# API Contracts (MVP)

## POST /api/sync/finance
Accepts finance sync payload. Returns normalized finance snapshot.

Validation (422):
- numeric fields must be finite numbers
- `transactions` must be an array when provided

## POST /api/sync/calendar
Accepts calendar sync payload. Returns normalized calendar snapshot.

Validation (422):
- `todayEvents` must be an array when provided
- each event must be an object
- `durationHours` must be a finite number when provided

## GET /api/overview
Returns dashboard KPIs, recent transactions, today events, and top insights.


## POST /api/quick-capture
Creates a quick capture record for transaction, habit, note, task, or mood.
Returns `201` on success and `422` for validation errors.
