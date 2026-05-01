import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from '../src/server.js';
import { resetStore } from '../src/store.js';

async function withServer(fn) {
  const server = createServer();
  await new Promise((resolve) => server.listen(0, resolve));
  const { port } = server.address();
  const base = `http://127.0.0.1:${port}`;
  try {
    await fn(base);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
}

test('finance sync rejects invalid numeric payloads', async () => {
  await resetStore();
  await withServer(async (base) => {
    const resp = await fetch(`${base}/api/sync/finance`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ monthIncome: 'not-a-number' })
    });

    assert.equal(resp.status, 422);
    const json = await resp.json();
    assert.equal(json.error, 'Validation failed.');
  });
});

test('calendar sync rejects malformed events', async () => {
  await resetStore();
  await withServer(async (base) => {
    const resp = await fetch(`${base}/api/sync/calendar`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ todayEvents: [{ durationHours: 'oops' }] })
    });

    assert.equal(resp.status, 422);
    const json = await resp.json();
    assert.equal(json.error, 'Validation failed.');
  });
});
