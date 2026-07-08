# Habit Tracker MVP

## Quick Start
```bash
docker compose up --build
```

Then open http://localhost

## Development

### Backend
```bash
cd backend
cp .env.example .env
npm install
npx prisma migrate dev --name init
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Testing
```bash
cd backend
npm test
```

## Tech Stack
- Frontend: React 18 + Vite + TypeScript + Material UI v5
- Backend: Node.js + Express + TypeScript + Prisma + PostgreSQL
- Container: Docker + Docker Compose
