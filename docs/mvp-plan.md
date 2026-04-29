# Life OS MVP Build Plan

## Phase 1 (Current)
- Define core formulas and deterministic insight rules.
- Build test coverage around KPI calculations.
- Validate local data flow with a CLI dashboard snapshot.

## Phase 2
- Add API layer (`/api/sync/finance`, `/api/sync/calendar`, `/api/overview`).
- Persist normalized data into Postgres tables.
- Support manual quick-capture writes (habit, transaction, note).

## Phase 3
- Build mobile-first dashboard UI (cards + action tray).
- Add PWA install and offline cache for latest snapshot.
- Enable push reminders and weekly review prompt.

## Initial Data Contracts
- `finance_summary`: { assets, liabilities, monthIncome, monthExpenses, monthBudget }
- `habit_week`: { weeklyCompletionRate, logs[] }
- `calendar_day`: { todayEvents[] }
- `insight`: { type, severity, message }
