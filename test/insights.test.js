import test from 'node:test';
import assert from 'node:assert/strict';
import { generateInsights } from '../src/insights.js';

test('generateInsights returns prioritized, actionable insights', () => {
  const insights = generateInsights({
    finance: {
      monthIncome: 5000,
      monthExpenses: 4800,
      monthBudget: 4500
    },
    habits: { weeklyCompletionRate: 65 },
    health: { sleepTrend: 'down' },
    calendar: { todayEvents: [{ durationHours: 8 }] },
    projects: { staleProjectName: 'Deep Work', staleProjectDays: 7 }
  });

  assert.ok(insights.length >= 4);
  assert.equal(insights[0].severity, 'high');
  assert.ok(insights.some((item) => /over budget/i.test(item.message)));
});
