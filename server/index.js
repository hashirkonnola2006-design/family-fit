import express from 'express';
import cors from 'cors';
import cron from 'node-cron';
import { getKeralaPrices } from './pricesService.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Main prices endpoint
app.get('/api/prices', async (req, res) => {
  try {
    const forceRefresh = req.query.refresh === 'true';
    const result = await getKeralaPrices({ forceRefresh });
    res.json(result);
  } catch (err) {
    console.error('[API ERROR] /api/prices failed:', err.message);
    res.status(200).json({
      updatedAt: null,
      source: 'data.gov.in Agmarknet',
      items: [],
      stale: true,
      error: 'Unexpected server error while processing prices',
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'familyfit-mandi-proxy',
    timestamp: new Date().toISOString(),
  });
});

// Optional: Scheduled daily refresh at 6:00 AM IST (00:30 UTC)
// In cron syntax: '30 0 * * *' (UTC) or '0 6 * * *' in Asia/Kolkata timezone
try {
  cron.schedule(
    '0 6 * * *',
    async () => {
      console.log(`[CRON ${new Date().toISOString()}] Running daily 6:00 AM IST Agmarknet price sync...`);
      try {
        const fresh = await getKeralaPrices({ forceRefresh: true });
        console.log(`[CRON] Price sync completed. Items: ${fresh.items?.length || 0}, Stale: ${fresh.stale}`);
      } catch (err) {
        console.error('[CRON ERROR] Daily refresh failed:', err.message);
      }
    },
    {
      timezone: 'Asia/Kolkata',
    }
  );
  console.log('[CRON] Scheduled daily Kerala mandi price refresh at 06:00 AM IST.');
} catch (cronErr) {
  console.warn('[CRON WARN] Could not initialize node-cron schedule:', cronErr.message);
}

// Start standalone server if run directly
const isDirectExecution = process.argv[1] && process.argv[1].endsWith('server\\index.js') || process.argv[1]?.endsWith('server/index.js');
if (isDirectExecution || !process.env.VITE_EMBEDDED) {
  app.listen(PORT, () => {
    console.log(`──────────────────────────────────────────────────────────`);
    console.log(` 🍃 FamilyFit Mandi Proxy Server running on port ${PORT}`);
    console.log(` Endpoint: http://localhost:${PORT}/api/prices`);
    console.log(`──────────────────────────────────────────────────────────`);
  });
}

export default app;
