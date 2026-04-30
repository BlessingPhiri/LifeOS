import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from '../src/server.js';
import { resetStore } from '../src/store.js';

test('habit creation and log updates overview habit score', async () => {
  await resetStore();
  const server = createServer();
  await new Promise((resolve) => server.listen(0, resolve));
  const { port } = server.address();
  const base = `http://127.0.0.1:${port}`;

  const createHabit = await fetch(`${base}/api/habits`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ id: 'h1', name: 'Workout' })
  });
  assert.equal(createHabit.status, 200);

  const logHabit = await fetch(`${base}/api/habits/log`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ habitId: 'h1', completed: true })
  });
  assert.equal(logHabit.status, 201);

  const overview = await fetch(`${base}/api/overview`);
  const data = await overview.json();
  assert.ok(data.dashboard.habitScore > 0);
  assert.equal(data.habits.total, 1);

  await new Promise((resolve) => server.close(resolve));
});
