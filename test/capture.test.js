import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from '../src/server.js';
import { resetStore } from '../src/store.js';

test('quick capture creates and returns capture records', async () => {
  await resetStore();
  const server = createServer();
  await new Promise((resolve) => server.listen(0, resolve));
  const { port } = server.address();
  const base = `http://127.0.0.1:${port}`;

  const create = await fetch(`${base}/api/quick-capture`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ type: 'note', value: { text: 'Review budget' } })
  });
  assert.equal(create.status, 201);

  const overview = await fetch(`${base}/api/overview`);
  const json = await overview.json();
  assert.equal(json.captures.length, 1);
  assert.equal(json.captures[0].type, 'note');

  await new Promise((resolve) => server.close(resolve));
});

test('quick capture rejects unsupported capture type', async () => {
  await resetStore();
  const server = createServer();
  await new Promise((resolve) => server.listen(0, resolve));
  const { port } = server.address();
  const base = `http://127.0.0.1:${port}`;

  const create = await fetch(`${base}/api/quick-capture`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ type: 'random', value: { text: 'X' } })
  });
  assert.equal(create.status, 422);

  await new Promise((resolve) => server.close(resolve));
});
