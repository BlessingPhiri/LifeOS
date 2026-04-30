# Life OS

Personal Life Operating System foundations.

## What is implemented
- Core KPI engine for finance, habits, schedule load, and health score.
- Deterministic insight generator for actionable alerts.
- Minimal API layer for ingestion and overview snapshots:
  - `POST /api/sync/finance`
  - `POST /api/sync/calendar`
  - `POST /api/sync/health`
  - `GET /api/overview`
  - `POST /api/quick-capture`
  - `GET /api/insights`
  - `POST /api/habits`
  - `POST /api/habits/log`
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


## Google Sheets (free setup for now)
Use a public-link sheet tab and call:
`POST /api/sync/finance/google-sheet?spreadsheetId=<id>&gid=<gid>`

This is a no-OAuth MVP path. Later we can upgrade to Google OAuth + private Sheets API.


## Postgres (optional, free tier ready)
1. Copy `.env.example` to `.env` and set `DATABASE_URL`.
2. Apply `db/schema.sql` to your Postgres database.
3. Start server with `npm run dev`.

When enabled, Google Sheets finance imports are also persisted to Postgres.


With `DATABASE_URL` enabled, overview attempts Postgres transaction reads first and falls back to file storage if unavailable.


Current Postgres support is **write-through mode** for finance imports, habits, habit logs, and quick captures, while file storage remains as fallback.
