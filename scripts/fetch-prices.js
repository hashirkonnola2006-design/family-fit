#!/usr/bin/env node
/**
 * scripts/fetch-prices.js
 *
 * Fetches live commodity mandi prices for Kerala from data.gov.in (Agmarknet),
 * groups by commodity, computes median modal prices, applies retail markup,
 * maps to FamilyFit grocery items, and outputs to prices.json.
 *
 * Usage:
 *   DATA_GOV_API_KEY="your_key" node scripts/fetch-prices.js
 * Or with .env file:
 *   node scripts/fetch-prices.js
 */

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.resolve(__dirname, '..')

// ── 1. Load Environment Variables from possible .env locations ──
function loadEnv() {
  const envPaths = [
    path.join(rootDir, '.env'),
    path.join(rootDir, 'familyfit-frontend', '.env'),
    path.join(process.env.HOME || process.env.USERPROFILE || '', '.env'),
  ]

  for (const envPath of envPaths) {
    if (fs.existsSync(envPath)) {
      try {
        const content = fs.readFileSync(envPath, 'utf8')
        content.split('\n').forEach((line) => {
          const trimmed = line.trim()
          if (!trimmed || trimmed.startsWith('#')) return
          const eqIdx = trimmed.indexOf('=')
          if (eqIdx > 0) {
            const key = trimmed.slice(0, eqIdx).trim()
            const val = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, '')
            if (!process.env[key]) {
              process.env[key] = val
            }
          }
        })
      } catch (err) {
        console.warn(`[WARN] Could not parse .env at ${envPath}:`, err.message)
      }
    }
  }
}

loadEnv()

const DATA_GOV_API_KEY = process.env.DATA_GOV_API_KEY || ''
const RETAIL_MARKUP = parseFloat(process.env.RETAIL_MARKUP || '1.4')
const RESOURCE_ID = '9ef84268-d588-465a-a308-a864a43d0070'
const BASE_URL = `https://api.data.gov.in/resource/${RESOURCE_ID}`

// Paths
const commodityMapPath = path.join(__dirname, 'commodity-map.json')
const publicPricesPath = path.join(rootDir, 'familyfit-frontend', 'public', 'data', 'prices.json')
const srcPricesPath = path.join(rootDir, 'familyfit-frontend', 'src', 'data', 'prices.json')
const rootPricesPath = path.join(rootDir, 'data', 'prices.json')

// ── 2. Helper: Calculate Median ──
function calculateMedian(numbers) {
  if (!Array.isArray(numbers) || numbers.length === 0) return 0
  const sorted = [...numbers].sort((a, b) => a - b)
  const mid = Math.floor(sorted.length / 2)
  if (sorted.length % 2 === 1) {
    return sorted[mid]
  }
  return Math.round(((sorted[mid - 1] + sorted[mid]) / 2) * 10) / 10
}

// ── 3. Helper: Fetch with Exponential Backoff ──
async function fetchWithRetry(url, maxRetries = 4, initialDelayMs = 1200) {
  let attempt = 0
  while (attempt <= maxRetries) {
    try {
      const response = await fetch(url, {
        headers: { Accept: 'application/json' },
        signal: AbortSignal.timeout(25000),
      })

      if (response.ok) {
        return await response.json()
      }

      // Retryable status codes (Rate limit or server error)
      if ([429, 500, 502, 503, 504].includes(response.status)) {
        throw new Error(`Server returned status ${response.status}`)
      }

      // Non-retryable client error (e.g. 401, 403, 404)
      const errorText = await response.text().catch(() => '')
      throw new Error(`Request failed with status ${response.status}: ${errorText}`)
    } catch (err) {
      attempt++
      if (attempt > maxRetries) {
        throw err
      }
      const delay = initialDelayMs * Math.pow(2, attempt - 1)
      console.warn(`[RETRY] Attempt ${attempt}/${maxRetries} failed (${err.message}). Retrying in ${delay}ms...`)
      await new Promise((res) => setTimeout(res, delay))
    }
  }
}

// ── 4. Main Fetch & Processing Function ──
export async function fetchKeralaMandiPrices() {
  console.log('───────────────────────────────────────────────────────')
  console.log(' 🍃 FamilyFit Kerala Agmarknet Price Sync')
  console.log('───────────────────────────────────────────────────────')
  console.log(`Resource ID   : ${RESOURCE_ID}`)
  console.log(`Retail Markup : ${RETAIL_MARKUP}x (Wholesale -> Retail estimate)`)

  // Load Commodity Map
  let commodityMap = {}
  if (fs.existsSync(commodityMapPath)) {
    try {
      commodityMap = JSON.parse(fs.readFileSync(commodityMapPath, 'utf8'))
      console.log(`Loaded ${Object.keys(commodityMap).length} commodity mappings from commodity-map.json`)
    } catch (err) {
      console.warn('[WARN] Failed to parse commodity-map.json, using defaults:', err.message)
    }
  }

  // Load Existing Prices as baseline fallback
  let existingPrices = null
  for (const p of [publicPricesPath, srcPricesPath, rootPricesPath]) {
    if (fs.existsSync(p)) {
      try {
        existingPrices = JSON.parse(fs.readFileSync(p, 'utf8'))
        break
      } catch {}
    }
  }

  // Verify API Key
  if (!DATA_GOV_API_KEY) {
    console.warn('\n⚠️ [WARN] DATA_GOV_API_KEY is not set in the environment.')
    console.warn('   To fetch live data from data.gov.in, set the environment variable:')
    console.warn('   PowerShell: $env:DATA_GOV_API_KEY="your_api_key_here"')
    console.warn('   Or add DATA_GOV_API_KEY=... to your .env file.\n')

    if (existingPrices) {
      console.log(`✓ Safe fallback: Serving existing saved prices (Last updated: ${existingPrices.last_updated})`)
      printSummary(existingPrices)
      return existingPrices
    }

    throw new Error('DATA_GOV_API_KEY is missing and no existing prices.json was found.')
  }

  console.log('🔑 API Key detected. Querying Agmarknet Kerala records...')

  const allKeralaRecords = []
  const limit = 1000
  let offset = 0
  let totalRecords = Infinity
  let page = 1

  while (offset < totalRecords) {
    const url = new URL(BASE_URL)
    url.searchParams.set('api-key', DATA_GOV_API_KEY)
    url.searchParams.set('format', 'json')
    url.searchParams.set('limit', String(limit))
    url.searchParams.set('offset', String(offset))
    url.searchParams.set('filters[state]', 'Kerala')

    console.log(`Fetching page ${page} (offset: ${offset}, limit: ${limit})...`)
    const data = await fetchWithRetry(url.toString())

    const records = data?.records || []
    if (data?.total !== undefined) {
      totalRecords = Number(data.total)
    }

    // Filter for Kerala (case-insensitive safeguard in case filter was ignored by server)
    const keralaRecords = records.filter(
      (r) => !r.state || String(r.state).trim().toLowerCase() === 'kerala'
    )

    allKeralaRecords.push(...keralaRecords)
    console.log(`  -> Retrieved ${records.length} records (${keralaRecords.length} Kerala records). Total so far: ${allKeralaRecords.length}`)

    if (records.length === 0 || records.length < limit) {
      break
    }

    offset += limit
    page++
  }

  console.log(`\n✓ Total Kerala Mandi records retrieved: ${allKeralaRecords.length}`)

  // ── 5. Group by Commodity & Calculate Median Modal Price ──
  // Record structure: { state, district, market, commodity, variety, grade, arrival_date, min_price, max_price, modal_price }
  const commodityGroups = new Map()

  for (const record of allKeralaRecords) {
    const rawCommodity = (record.commodity || '').trim()
    if (!rawCommodity) continue

    const modalPriceQuintal = parseFloat(record.modal_price)
    if (isNaN(modalPriceQuintal) || modalPriceQuintal <= 0) continue

    // Convert Rs / quintal to Rs / kg
    const pricePerKg = modalPriceQuintal / 100

    if (!commodityGroups.has(rawCommodity)) {
      commodityGroups.set(rawCommodity, {
        commodity: rawCommodity,
        prices: [],
        markets: new Set(),
        districts: new Set(),
        latestArrivalDate: record.arrival_date || '',
      })
    }

    const group = commodityGroups.get(rawCommodity)
    group.prices.push(pricePerKg)
    if (record.market) group.markets.add(record.market)
    if (record.district) group.districts.add(record.district)
    if (record.arrival_date) group.latestArrivalDate = record.arrival_date
  }

  // Calculate Median & Retail Prices for all Agmarknet commodities
  const rawCommodityStats = {}
  for (const [commodity, data] of commodityGroups.entries()) {
    const wholesaleMedian = calculateMedian(data.prices)
    const retailPrice = Math.round(wholesaleMedian * RETAIL_MARKUP)

    rawCommodityStats[commodity] = {
      wholesale_median_per_kg: wholesaleMedian,
      retail_price_per_kg: retailPrice,
      markets_reporting: data.markets.size,
      records_count: data.prices.length,
      last_arrival_date: data.latestArrivalDate,
    }
  }

  // ── 6. Map to FamilyFit Grocery Items ──
  const mappedItems = {}
  const mappedAgmarknetCommodities = new Set()

  for (const [agmarknetName, targetGroceryItem] of Object.entries(commodityMap)) {
    // targetGroceryItem can be string ("Tapioca / Kappa (1 kg)") or object
    const itemName = typeof targetGroceryItem === 'string' ? targetGroceryItem : targetGroceryItem.itemName
    const customUnit = typeof targetGroceryItem === 'object' ? targetGroceryItem.unit : 'kg'

    // Find commodity stats by exact or case-insensitive match
    let stats = rawCommodityStats[agmarknetName]
    if (!stats) {
      const lowerKey = agmarknetName.toLowerCase()
      const found = Object.keys(rawCommodityStats).find((k) => k.toLowerCase() === lowerKey)
      if (found) stats = rawCommodityStats[found]
    }

    if (stats) {
      mappedAgmarknetCommodities.add(agmarknetName)
      mappedItems[itemName] = {
        commodity: agmarknetName,
        wholesale_median_per_kg: stats.wholesale_median_per_kg,
        retail_price_per_kg: stats.retail_price_per_kg,
        unit: customUnit || 'kg',
        markets_reporting: stats.markets_reporting,
        last_arrival_date: stats.last_arrival_date,
      }
    }
  }

  // ── 7. Identify Unmapped Agmarknet Commodities ──
  const unmappedCommodities = []
  for (const [commodity, stats] of Object.entries(rawCommodityStats)) {
    if (!mappedAgmarknetCommodities.has(commodity)) {
      unmappedCommodities.push({
        commodity,
        wholesale_median_per_kg: stats.wholesale_median_per_kg,
        retail_price_per_kg: stats.retail_price_per_kg,
        markets_reporting: stats.markets_reporting,
        last_arrival_date: stats.last_arrival_date,
      })
    }
  }

  // Sort unmapped commodities by market frequency descending
  unmappedCommodities.sort((a, b) => b.markets_reporting - a.markets_reporting)

  // ── 8. Assemble Output Object ──
  const result = {
    last_updated: new Date().toISOString(),
    source: 'data.gov.in Agmarknet Mandi Daily Prices',
    resource_id: RESOURCE_ID,
    state: 'Kerala',
    retail_markup: RETAIL_MARKUP,
    items: mappedItems,
    raw_commodities: rawCommodityStats,
    unmapped_commodities: unmappedCommodities,
  }

  // ── 9. Write Output Files ──
  const outputPaths = [publicPricesPath, srcPricesPath, rootPricesPath]
  for (const outPath of outputPaths) {
    try {
      const dir = path.dirname(outPath)
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true })
      }
      fs.writeFileSync(outPath, JSON.stringify(result, null, 2), 'utf8')
      console.log(`✓ Saved: ${path.relative(rootDir, outPath)}`)
    } catch (err) {
      console.error(`[ERROR] Failed writing to ${outPath}:`, err.message)
    }
  }

  printSummary(result)
  return result
}

function printSummary(data) {
  console.log('\n=======================================================')
  console.log(' SAMPLE MAPPED GROCERY ITEMS & LIVE PRICES')
  console.log('=======================================================')
  const items = Object.entries(data.items || {})
  if (items.length === 0) {
    console.log('No mapped items found.')
  } else {
    for (const [item, priceData] of items) {
      console.log(
        `• ${item.padEnd(35)} : ~₹${String(priceData.retail_price_per_kg).padEnd(4)} / ${priceData.unit} ` +
        `(Wholesale: ₹${priceData.wholesale_median_per_kg}/kg, Markets: ${priceData.markets_reporting}, Updated: ${priceData.last_arrival_date || 'Today'})`
      )
    }
  }

  console.log('\n=======================================================')
  console.log(` UNMAPPED AGMARKNET COMMODITIES (${(data.unmapped_commodities || []).length} items)`)
  console.log(' Use these to extend scripts/commodity-map.json:')
  console.log('=======================================================')
  const unmapped = (data.unmapped_commodities || []).slice(0, 20)
  for (const u of unmapped) {
    console.log(
      `  "${u.commodity.padEnd(25)}" -> Median: ₹${String(u.wholesale_median_per_kg).padStart(3)}/kg (Retail ~₹${u.retail_price_per_kg}/kg) [${u.markets_reporting} mkts]`
    )
  }
  if ((data.unmapped_commodities || []).length > 20) {
    console.log(`  ... and ${(data.unmapped_commodities.length - 20)} more.`)
  }
  console.log('=======================================================\n')
}

// Execute if run directly from CLI
const isDirectRun = process.argv[1] && path.resolve(process.argv[1]) === path.resolve(__filename)
if (isDirectRun) {
  fetchKeralaMandiPrices().catch((err) => {
    console.error('\n❌ Execution error:', err.message)
    process.exit(1)
  })
}
