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

## Deploy

- **Frontend → Vercel**: Connect repo, set root directory to `familyfit-frontend`, build command `npm run build`, output `dist`.
- **Backend**: Deploy to Railway / Render / any Java host.
