import http from 'node:http';
import { generateInsights } from './insights.js';
import { habitScore, monthlyNetIncome, netWorth, savingsRate } from './metrics.js';
import { store } from './store.js';

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
      store.finance = normalizeFinance(body);
      return sendJson(res, 200, { ok: true, finance: store.finance });
    }

    if (req.method === 'POST' && req.url === '/api/sync/calendar') {
      const body = await parseJson(req);
      if (!body) return sendJson(res, 400, { error: 'Invalid JSON body.' });
      store.calendar = normalizeCalendar(body);
      return sendJson(res, 200, { ok: true, calendar: store.calendar });
    }

    if (req.method === 'GET' && req.url === '/api/overview') {
      const finance = store.finance;
      const calendar = store.calendar;
      const dashboard = {
        netWorth: netWorth(finance),
        monthNetIncome: monthlyNetIncome({ income: finance.monthIncome, expenses: finance.monthExpenses }),
        savingsRate: savingsRate({ income: finance.monthIncome, expenses: finance.monthExpenses }),
        habitScore: habitScore([])
      };
      const insights = generateInsights({
        finance,
        habits: { weeklyCompletionRate: 0 },
        health: null,
        calendar,
        projects: null
      });

      return sendJson(res, 200, {
        dashboard,
        recentTransactions: finance.transactions.slice(0, 5),
        todayEvents: calendar.todayEvents,
        insights: insights.slice(0, 3)
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
