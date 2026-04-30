import http from 'node:http';
import { generateInsights } from './insights.js';
import { habitScore, healthScore, monthlyNetIncome, netWorth, savingsRate } from './metrics.js';
import { addCapture, addHabitLog, readState, updateCalendar, updateFinance, updateHealth, upsertHabit } from './store.js';
import { validateCalendarPayload, validateFinancePayload, validateHealthPayload } from './validation.js';
import { normalizeCapture, validateCapturePayload } from './capture.js';
import { computeWeeklyCompletion, normalizeHabit, normalizeHabitLog, validateHabitLogPayload, validateHabitPayload } from './habits.js';

function sendJson(res, status, body) {
  res.writeHead(status, { 'content-type': 'application/json' });
  res.end(JSON.stringify(body));
}

function normalizeFinance(payload) {
  return {
    assets: Number(payload.assets || 0),
    liabilities: Number(payload.liabilities || 0),
    monthIncome: Number(payload.monthIncome || 0),
    monthExpenses: Number(payload.monthExpenses || 0),
    monthBudget: Number(payload.monthBudget || 0),
    transactions: Array.isArray(payload.transactions) ? payload.transactions : []
  };
}

function normalizeCalendar(payload) {
  return {
    todayEvents: Array.isArray(payload.todayEvents)
      ? payload.todayEvents.map((event) => ({
          title: String(event.title || 'Untitled'),
          durationHours: Number(event.durationHours || 0)
        }))
      : []
  };
}

async function parseJson(req) {
  let raw = '';
  for await (const chunk of req) raw += chunk;
  try {
    return raw ? JSON.parse(raw) : {};
  } catch {
    return null;
  }
}

export function createServer() {
  return http.createServer(async (req, res) => {
    if (req.method === 'POST' && req.url === '/api/sync/finance') {
      const body = await parseJson(req);
      if (!body) return sendJson(res, 400, { error: 'Invalid JSON body.' });
      const errors = validateFinancePayload(body);
      if (errors.length) return sendJson(res, 422, { error: 'Validation failed.', details: errors });
      const finance = await updateFinance(normalizeFinance(body));
      return sendJson(res, 200, { ok: true, finance });
    }

    if (req.method === 'POST' && req.url === '/api/sync/calendar') {
      const body = await parseJson(req);
      if (!body) return sendJson(res, 400, { error: 'Invalid JSON body.' });
      const errors = validateCalendarPayload(body);
      if (errors.length) return sendJson(res, 422, { error: 'Validation failed.', details: errors });
      const calendar = await updateCalendar(normalizeCalendar(body));
      return sendJson(res, 200, { ok: true, calendar });
    }



    if (req.method === 'POST' && req.url === '/api/sync/health') {
      const body = await parseJson(req);
      if (!body) return sendJson(res, 400, { error: 'Invalid JSON body.' });
      const errors = validateHealthPayload(body);
      if (errors.length) return sendJson(res, 422, { error: 'Validation failed.', details: errors });
      const health = await updateHealth({
        sleepHours: Number(body.sleepHours || 0),
        steps: Number(body.steps || 0),
        exerciseMinutes: Number(body.exerciseMinutes || 0),
        weight: body.weight == null ? null : Number(body.weight),
        sleepTrend: body.sleepTrend || 'stable'
      });
      return sendJson(res, 200, { ok: true, health });
    }

    if (req.method === 'POST' && req.url === '/api/quick-capture') {
      const body = await parseJson(req);
      if (!body) return sendJson(res, 400, { error: 'Invalid JSON body.' });
      const errors = validateCapturePayload(body);
      if (errors.length) return sendJson(res, 422, { error: 'Validation failed.', details: errors });
      const capture = await addCapture(normalizeCapture(body));
      return sendJson(res, 201, { ok: true, capture });
    }


    if (req.method === 'POST' && req.url === '/api/habits') {
      const body = await parseJson(req);
      if (!body) return sendJson(res, 400, { error: 'Invalid JSON body.' });
      const errors = validateHabitPayload(body);
      if (errors.length) return sendJson(res, 422, { error: 'Validation failed.', details: errors });
      const habit = await upsertHabit(normalizeHabit(body));
      return sendJson(res, 200, { ok: true, habit });
    }

    if (req.method === 'POST' && req.url === '/api/habits/log') {
      const body = await parseJson(req);
      if (!body) return sendJson(res, 400, { error: 'Invalid JSON body.' });
      const errors = validateHabitLogPayload(body);
      if (errors.length) return sendJson(res, 422, { error: 'Validation failed.', details: errors });
      const log = await addHabitLog(normalizeHabitLog(body));
      return sendJson(res, 201, { ok: true, log });
    }

    if (req.method === 'GET' && req.url === '/api/insights') {
      const state = await readState();
      const insights = generateInsights({
        finance: state.finance,
        habits: { weeklyCompletionRate: computeWeeklyCompletion(state.habits || [], state.habitLogs || []) },
        health: state.health || { sleepTrend: 'stable' },
        calendar: state.calendar,
        projects: null
      });
      return sendJson(res, 200, { insights });
    }

    if (req.method === 'GET' && req.url === '/api/overview') {
      const state = await readState();
      const finance = state.finance;
      const calendar = state.calendar;
      const health = state.health || { sleepHours: 0, steps: 0, exerciseMinutes: 0, weight: null, sleepTrend: 'stable' };
      const weeklyHabitRate = computeWeeklyCompletion(state.habits || [], state.habitLogs || []);
      const dashboard = {
        netWorth: netWorth(finance),
        monthNetIncome: monthlyNetIncome({ income: finance.monthIncome, expenses: finance.monthExpenses }),
        savingsRate: savingsRate({ income: finance.monthIncome, expenses: finance.monthExpenses }),
        habitScore: weeklyHabitRate,
        healthScore: healthScore(health)
      };
      const insights = generateInsights({
        finance,
        habits: { weeklyCompletionRate: computeWeeklyCompletion(state.habits || [], state.habitLogs || []) },
        health,
        calendar,
        projects: null
      });

      return sendJson(res, 200, {
        dashboard,
        recentTransactions: finance.transactions.slice(0, 5),
        todayEvents: calendar.todayEvents,
        insights: insights.slice(0, 3),
        captures: state.captures.slice(0, 10),
        health,
        habits: { weeklyCompletionRate: weeklyHabitRate, total: (state.habits || []).length }
      });
    }

    return sendJson(res, 404, { error: 'Not found.' });
  });
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const port = Number(process.env.PORT || 3000);
  createServer().listen(port, () => {
    console.log(`Life OS API listening on http://localhost:${port}`);
  });
}
