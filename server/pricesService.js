import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Load environment from root .env safely
dotenv.config({ path: path.join(rootDir, '.env') });

const RESOURCE_ID = '9ef84268-d588-465a-a308-a864a43d0070';
const ENDPOINT = `https://api.data.gov.in/resource/${RESOURCE_ID}`;
const CACHE_DIR = path.join(__dirname, 'cache');
const CACHE_FILE = path.join(CACHE_DIR, 'prices.json');
const HISTORY_FILE = path.join(CACHE_DIR, 'history.json');
const BUNDLED_FALLBACK_FILE = path.join(rootDir, 'familyfit-frontend', 'public', 'data', 'prices.json');

const SIX_HOURS_MS = 6 * 60 * 60 * 1000;

// In-memory cache
let inMemoryCache = null;

// Ensure cache directory exists
if (!fs.existsSync(CACHE_DIR)) {
  fs.mkdirSync(CACHE_DIR, { recursive: true });
}

/**
 * Reads cached prices from disk if valid JSON.
 */
function readCacheFile(filePath) {
  try {
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, 'utf8');
      const data = JSON.parse(raw);
      if (data && Array.isArray(data.items)) {
        return data;
      }
    }
  } catch (err) {
    console.warn(`[CACHE WARN] Could not read cache at ${filePath}:`, err.message);
  }
  return null;
}

/**
 * Saves prices to disk cache.
 */
function writeCacheFile(data) {
  try {
    fs.writeFileSync(CACHE_FILE, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error(`[CACHE ERROR] Failed writing to ${CACHE_FILE}:`, err.message);
  }
}

/**
 * Records daily history snapshot.
 */
export function recordHistorySnapshot(data) {
  try {
    let history = [];
    if (fs.existsSync(HISTORY_FILE)) {
      try {
        history = JSON.parse(fs.readFileSync(HISTORY_FILE, 'utf8'));
        if (!Array.isArray(history)) history = [];
      } catch {}
    }

    const snapshot = {
      date: new Date().toISOString(),
      updatedAt: data.updatedAt,
      recordCount: data.items ? data.items.length : 0,
      stale: !!data.stale,
    };

    history.push(snapshot);
    // Keep last 90 snapshots
    if (history.length > 90) {
      history = history.slice(-90);
    }

    fs.writeFileSync(HISTORY_FILE, JSON.stringify(history, null, 2), 'utf8');
  } catch (err) {
    console.warn('[HISTORY WARN] Could not save history snapshot:', err.message);
  }
}

/**
 * Fetches raw records for Kerala from data.gov.in.
 * Handles both "Keralam" and "Kerala" state keywords to ensure maximum reliability.
 */
async function fetchFromDataGov(stateFilter) {
  const apiKey = process.env.DATA_GOV_API_KEY;
  if (!apiKey) {
    throw new Error('DATA_GOV_API_KEY is not configured in environment');
  }

  const url = new URL(ENDPOINT);
  url.searchParams.set('api-key', apiKey);
  url.searchParams.set('format', 'json');
  url.searchParams.set('limit', '1000');
  url.searchParams.set('filters[state.keyword]', stateFilter);

  const res = await fetch(url.toString(), {
    headers: { Accept: 'application/json' },
    signal: AbortSignal.timeout(25000),
  });

  if (!res.ok) {
    throw new Error(`Upstream returned HTTP ${res.status}: ${res.statusText}`);
  }

  const json = await res.json();
  return json.records || [];
}

/**
 * Normalizes raw Agmarknet records.
 * Prices are in Rs/quintal (100 kg) -> divided by 100 to get Rs/kg.
 */
function normalizeRecords(rawRecords) {
  const seenKeys = new Set();
  const normalized = [];

  for (const r of rawRecords) {
    if (!r || !r.commodity) continue;

    const commodity = String(r.commodity).trim();
    const market = String(r.market || '').trim();
    const district = String(r.district || '').trim();
    const arrivalDate = String(r.arrival_date || '').trim();
    const variety = String(r.variety || '').trim();

    const minPriceQuintal = parseFloat(r.min_price);
    const maxPriceQuintal = parseFloat(r.max_price);
    const modalPriceQuintal = parseFloat(r.modal_price);

    // Dedup key
    const dedupKey = `${district}|${market}|${commodity}|${variety}|${arrivalDate}`;
    if (seenKeys.has(dedupKey)) continue;
    seenKeys.add(dedupKey);

    const minPerKg = !isNaN(minPriceQuintal) ? Math.round((minPriceQuintal / 100) * 100) / 100 : 0;
    const maxPerKg = !isNaN(maxPriceQuintal) ? Math.round((maxPriceQuintal / 100) * 100) / 100 : 0;
    const modalPerKg = !isNaN(modalPriceQuintal) ? Math.round((modalPriceQuintal / 100) * 100) / 100 : 0;

    normalized.push({
      commodity,
      market,
      district,
      variety,
      minPerKg,
      maxPerKg,
      modalPerKg,
      arrivalDate,
    });
  }

  return normalized;
}

/**
 * Main function to retrieve prices.
 * Respects 6-hour cache, serves stale data on upstream failure, never crashes.
 */
export async function getKeralaPrices({ forceRefresh = false } = {}) {
  const now = Date.now();

  // 1. Check in-memory cache
  if (!forceRefresh && inMemoryCache && inMemoryCache.data) {
    const age = now - inMemoryCache.timestamp;
    if (age < SIX_HOURS_MS && inMemoryCache.data.items && inMemoryCache.data.items.length > 0) {
      return { ...inMemoryCache.data, stale: false, fromCache: 'memory' };
    }
  }

  // 2. Check disk cache
  if (!forceRefresh) {
    const diskData = readCacheFile(CACHE_FILE);
    if (diskData && diskData.updatedAt && Array.isArray(diskData.items) && diskData.items.length > 0) {
      const diskTime = new Date(diskData.updatedAt).getTime();
      if (!isNaN(diskTime) && (now - diskTime) < SIX_HOURS_MS) {
        inMemoryCache = { timestamp: diskTime, data: diskData };
        return { ...diskData, stale: false, fromCache: 'disk' };
      }
    }
  }

  // 3. Query upstream data.gov.in
  try {
    // Try both Keralam and Kerala to handle potential naming changes in the national portal
    let rawRecords = [];
    try {
      const keralamRecords = await fetchFromDataGov('Keralam');
      if (Array.isArray(keralamRecords) && keralamRecords.length > 0) {
        rawRecords.push(...keralamRecords);
      }
    } catch (err) {
      console.warn('[FETCH] Keralam query notice:', err.message);
    }

    try {
      const keralaRecords = await fetchFromDataGov('Kerala');
      if (Array.isArray(keralaRecords) && keralaRecords.length > 0) {
        rawRecords.push(...keralaRecords);
      }
    } catch (err) {
      console.warn('[FETCH] Kerala query notice:', err.message);
    }

    const items = normalizeRecords(rawRecords);

    if (items.length > 0) {
      const freshData = {
        updatedAt: new Date().toISOString(),
        source: 'data.gov.in Agmarknet Kerala Mandis',
        items,
        stale: false,
      };

      inMemoryCache = { timestamp: now, data: freshData };
      writeCacheFile(freshData);
      recordHistorySnapshot(freshData);
      return freshData;
    }

    console.warn('[FETCH] Upstream returned 0 Kerala records. Falling back to cached data...');
  } catch (fetchError) {
    console.error('[FETCH ERROR] Failed to fetch live prices from data.gov.in:', fetchError.message);
  }

  // 4. Fallback to existing disk cache if upstream failed or returned empty
  const fallbackCache = readCacheFile(CACHE_FILE);
  if (fallbackCache && Array.isArray(fallbackCache.items) && fallbackCache.items.length > 0) {
    inMemoryCache = { timestamp: now, data: fallbackCache };
    return {
      ...fallbackCache,
      stale: true,
      notice: 'Serving cached Kerala mandi prices (live update unavailable)',
    };
  }

  // 5. Fallback to bundled legacy cache if available
  const bundledCache = readCacheFile(BUNDLED_FALLBACK_FILE);
  if (bundledCache) {
    // Convert bundled format if needed
    let items = [];
    if (Array.isArray(bundledCache.items)) {
      items = bundledCache.items;
    } else if (bundledCache.items && typeof bundledCache.items === 'object') {
      items = Object.entries(bundledCache.items).map(([name, data]) => ({
        commodity: data.commodity || name,
        market: 'Kerala Mandis',
        district: 'Kerala',
        minPerKg: data.wholesale_median_per_kg || 0,
        maxPerKg: data.wholesale_median_per_kg || 0,
        modalPerKg: data.wholesale_median_per_kg || 0,
        arrivalDate: data.last_arrival_date || '',
      }));
    }

    if (items.length > 0) {
      const bundledData = {
        updatedAt: bundledCache.last_updated || new Date().toISOString(),
        source: 'data.gov.in Agmarknet (bundled cache)',
        items,
        stale: true,
      };
      return bundledData;
    }
  }

  // 6. Absolute fallback if no data exists anywhere — never crash
  return {
    updatedAt: null,
    source: 'data.gov.in Agmarknet',
    items: [],
    stale: true,
    error: 'No live records or cached data available at this time',
  };
}
