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
