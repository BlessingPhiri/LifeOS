# Life OS

Personal Life Operating System foundations.

## What is implemented
- Core KPI engine for finance, habits, and schedule load.
- Deterministic insight generator for actionable alerts.
- Minimal API layer for ingestion and overview snapshots:
  - `POST /api/sync/finance`
  - `POST /api/sync/calendar`
  - `GET /api/overview`
- Automated tests for metrics, insights, and API flow.

## Quick start
```bash
npm test
npm run dev
```

## Next build step
Replace in-memory store with persistent Postgres tables and connect real Google OAuth + source integrations.
