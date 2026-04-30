# Life OS

Personal Life Operating System foundations.

## What is implemented
- Core KPI engine for finance, habits, and schedule load.
- Deterministic insight generator for actionable alerts.
- Minimal API layer for ingestion and overview snapshots:
  - `POST /api/sync/finance`
  - `POST /api/sync/calendar`
  - `GET /api/overview`
  - `POST /api/quick-capture`
- File-backed local persistence at `.data/lifeos.json`.
- Validation for sync payloads with structured 422 responses.
- Automated tests for metrics, insights, and API flow.

## Quick start
```bash
npm test
npm run dev
```

## Next build step
Migrate file-backed persistence to Postgres tables and add Google OAuth with real Sheets/Calendar sync adapters.
