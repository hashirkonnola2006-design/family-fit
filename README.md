# 🌿 Family Fit

A full-stack family health & nutrition tracking app.

## Stack
- **Frontend**: React + Vite, deployed on Vercel
- **Backend**: Spring Boot (Java), H2 / PostgreSQL

## Local Development

### Frontend
```bash
cd familyfit-frontend
npm install
npm run dev
```

### Backend
```bash
cd familyfit-backend
./mvnw spring-boot:run
```

Frontend runs on `http://localhost:5173`, backend on `http://localhost:8080`.

### Live Kerala Mandi Prices Server (Agmarknet Proxy)

The Grocery Advisory page features live Kerala wholesale mandi prices powered by data.gov.in Agmarknet records.

#### 1. Environment Variable
Create a `.env` file in the project root containing your API key:
```env
DATA_GOV_API_KEY=your_data_gov_in_api_key_here
```
> **Security Notice**: Never commit this file or prefix the key with `VITE_`. It is kept exclusively on the server side.

#### 2. Running the Server
You can run the proxy server in standalone mode:
```bash
npm run server
```
The server will run on `http://localhost:5000` (endpoint: `GET /api/prices`).
When running the Vite dev server (`npm run dev`), the Vite dev server also proxies `/api/prices` automatically.

#### 3. Caching & Resilience Architecture
- **6-Hour Cache**: External calls to `api.data.gov.in` are cached both in-memory and in `server/cache/prices.json` with a 6-hour TTL, limiting upstream requests to a few times per day.
- **Graceful Fallbacks (`stale: true`)**: If upstream Agmarknet APIs are unreachable or return zero arrivals for the day, the server immediately serves the latest cached snapshot with `stale: true` and the UI displays "Last updated <date>". The app never crashes.
- **Daily Cron Sync**: A background cron job (`node-cron`) automatically refreshes data at 6:00 AM IST and appends historical data to `server/cache/history.json`.
- **Wholesale to Retail Scaling**: Agmarknet returns wholesale prices in Rs/quintal (converted to Rs/kg). The frontend applies an adjustable `RETAIL_MARKUP = 1.3` constant (approx. retail) for Kerala grocery recommendations.

## Deploy

- **Frontend → Vercel**: Connect repo, set root directory to `familyfit-frontend`, build command `npm run build`, output `dist`.
- **Backend**: Deploy to Railway / Render / any Java host.
