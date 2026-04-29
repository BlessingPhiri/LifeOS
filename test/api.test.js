import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from '../src/server.js';
import { resetStore } from '../src/store.js';

test('API sync + overview flow works', async () => {
  resetStore();
  const server = createServer();
  await new Promise((resolve) => server.listen(0, resolve));
  const { port } = server.address();
  const base = `http://127.0.0.1:${port}`;

  const financeResp = await fetch(`${base}/api/sync/finance`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      assets: 10000,
      liabilities: 3000,
      monthIncome: 5000,
      monthExpenses: 4200,
      monthBudget: 4000,
      transactions: [{ id: 't1', amount: 20 }]
    })
  });
  assert.equal(financeResp.status, 200);

  const calResp = await fetch(`${base}/api/sync/calendar`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ todayEvents: [{ title: 'Deep Work', durationHours: 3 }] })
  });
  assert.equal(calResp.status, 200);

  const overviewResp = await fetch(`${base}/api/overview`);
  assert.equal(overviewResp.status, 200);
  const overview = await overviewResp.json();

  assert.equal(overview.dashboard.netWorth, 7000);
  assert.equal(overview.dashboard.monthNetIncome, 800);
  assert.equal(overview.todayEvents.length, 1);
  assert.equal(overview.recentTransactions.length, 1);

  await new Promise((resolve) => server.close(resolve));
});
