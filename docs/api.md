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


## POST /api/sync/health
Accepts health snapshot payload (`sleepHours`, `steps`, `exerciseMinutes`, optional `weight`, optional `sleepTrend`).
Returns normalized health snapshot and supports `422` validation responses.


## GET /api/insights
Returns the prioritized insight list only (same engine used by `/api/overview`).


## POST /api/habits
Creates or updates a habit definition (`id`, `name`, optional `color`, `icon`).

## POST /api/habits/log
Creates a habit completion log (`habitId`, optional `completed`, optional `date`).


## POST /api/sync/finance/google-sheet?spreadsheetId=...&gid=...
Imports a public Google Sheets tab via CSV export URL and maps rows to transactions.

Requirements:
- the sheet tab must be shared as **Anyone with the link (Viewer)**
- finance columns should include: `date`, `description`, `category`, `amount`, `type`
