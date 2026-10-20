#!/usr/bin/env node
/**
 * scripts/cron-runner.js
 *
 * Daily scheduled cron runner using standard Node.js timer loop.
 * Runs fetchKeralaMandiPrices() once immediately on launch,
 * and thereafter once every 24 hours (or at 06:00 UTC).
 */

import { fetchKeralaMandiPrices } from './fetch-prices.js'

const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000

async function runJob() {
  console.log(`\n[CRON] ${new Date().toISOString()} Starting daily Agmarknet price sync...`)
  try {
    await fetchKeralaMandiPrices()
    console.log(`[CRON] Daily sync finished successfully. Next run in 24 hours.`)
  } catch (err) {
    console.error(`[CRON] Sync error (safe fallback preserved):`, err.message)
  }
}

// Initial run
runJob()

// Daily recurrence
setInterval(runJob, TWENTY_FOUR_HOURS)
