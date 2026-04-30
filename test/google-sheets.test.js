import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeFinanceRows, parseCsv } from '../src/googleSheets.js';

test('parseCsv and normalizeFinanceRows support finance import', () => {
  const rows = parseCsv('date,description,category,amount,type\n2026-04-01,Salary,Income,5000,income\n2026-04-02,Coffee,Food,-5,expense');
  const normalized = normalizeFinanceRows(rows);
  assert.equal(normalized.length, 2);
  assert.equal(normalized[0].type, 'income');
  assert.equal(normalized[1].category, 'Food');
});
