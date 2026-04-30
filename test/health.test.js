import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from '../src/server.js';
import { resetStore } from '../src/store.js';

test('health sync updates overview healthScore', async () => {
  await resetStore();
  const server = createServer();
  await new Promise((resolve) => server.listen(0, resolve));
  const { port } = server.address();
  const base = `http://127.0.0.1:${port}`;

  const sync = await fetch(`${base}/api/sync/health`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ sleepHours: 7, steps: 8000, exerciseMinutes: 20, weight: 70.2 })
  });
  assert.equal(sync.status, 200);

  const overview = await fetch(`${base}/api/overview`);
  const json = await overview.json();
  assert.equal(json.health.steps, 8000);
  assert.ok(json.dashboard.healthScore > 0);

  await new Promise((resolve) => server.close(resolve));
});

test('health sync validates payload', async () => {
  await resetStore();
  const server = createServer();
  await new Promise((resolve) => server.listen(0, resolve));
  const { port } = server.address();
  const base = `http://127.0.0.1:${port}`;

  const sync = await fetch(`${base}/api/sync/health`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ sleepHours: 'bad' })
  });
  assert.equal(sync.status, 422);

  await new Promise((resolve) => server.close(resolve));
});
