# Storage (Current MVP)

Life OS now uses a simple file-backed JSON store for local persistence.

- File path: `.data/lifeos.json`
- Module: `src/store.js`
- Behavior:
  - auto-initializes default state when file does not exist
  - persists finance sync payloads
  - persists calendar sync payloads

## Why this step
This replaces pure in-memory state so data survives server restarts while keeping dependencies minimal.

## Next upgrade
Migrate the same state model to Postgres tables and keep API contracts unchanged.


## Postgres mode (optional now)
If `DATABASE_URL` is set, Google Sheets finance imports are also upserted into Postgres `transactions`.
File-backed storage remains the primary state store until full migration is completed.


## Overview read path
If `DATABASE_URL` is set, `GET /api/overview` attempts to read recent transactions from Postgres first and compute month income/expenses from those rows.
If Postgres is unavailable, it safely falls back to file-backed state.


## Write-through Postgres mode
When `DATABASE_URL` is set:
- Google Sheets finance imports write to Postgres `transactions`
- `POST /api/habits` upserts into `habit_definitions`
- `POST /api/habits/log` inserts into `habit_logs`
- `POST /api/quick-capture` inserts into `quick_captures`

File-backed storage is still written for backward compatibility during migration.
