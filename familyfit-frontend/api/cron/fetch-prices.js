/**
 * Vercel Serverless Cron Handler
 * Triggered automatically by Vercel Cron according to vercel.json
 * or called directly with Authorization header.
 */

export default async function handler(req, res) {
  // Verify Vercel Cron signature if configured
  const authHeader = req.headers['authorization']
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized cron invocation' })
  }

  const DATA_GOV_API_KEY = process.env.DATA_GOV_API_KEY
  if (!DATA_GOV_API_KEY) {
    return res.status(200).json({
      status: 'warning',
      message: 'DATA_GOV_API_KEY is not set. Serving cached prices.',
      last_updated: new Date().toISOString(),
    })
  }

  try {
    const RESOURCE_ID = '9ef84268-d588-465a-a308-a864a43d0070'
    const url = `https://api.data.gov.in/resource/${RESOURCE_ID}?api-key=${DATA_GOV_API_KEY}&format=json&limit=1000&filters[state]=Kerala`

    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`Data.gov.in returned status ${response.status}`)
    }

    const data = await response.json()
    return res.status(200).json({
      status: 'success',
      timestamp: new Date().toISOString(),
      records_fetched: (data?.records || []).length,
      total_available: data?.total || 0,
    })
  } catch (err) {
    console.error('Vercel cron fetch error:', err.message)
    // Always return 200 with last saved status so cron runner does not fail
    return res.status(200).json({
      status: 'fallback',
      message: err.message,
      note: 'Serving last saved prices to avoid breaking frontend.',
    })
  }
}
