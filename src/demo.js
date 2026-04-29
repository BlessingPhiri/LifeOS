import { netWorth, monthlyNetIncome, savingsRate, habitScore } from './metrics.js';
import { generateInsights } from './insights.js';

const finance = {
  assets: 55000,
  liabilities: 15000,
  monthIncome: 5000,
  monthExpenses: 4400,
  monthBudget: 4000
};

const dashboard = {
  netWorth: netWorth(finance),
  monthNetIncome: monthlyNetIncome({ income: finance.monthIncome, expenses: finance.monthExpenses }),
  savingsRate: savingsRate({ income: finance.monthIncome, expenses: finance.monthExpenses }),
  habitScore: habitScore([
    { habitId: 'read', completed: true },
    { habitId: 'workout', completed: false },
    { habitId: 'journal', completed: true }
  ])
};

const insights = generateInsights({
  finance,
  habits: { weeklyCompletionRate: 63 },
  health: { sleepTrend: 'down' },
  calendar: { todayEvents: [{ durationHours: 2.5 }, { durationHours: 4.5 }] },
  projects: { staleProjectName: 'Life OS PWA', staleProjectDays: 6 }
});

console.log('Life OS Dashboard Snapshot');
console.table(dashboard);
console.log('Top Insights');
console.table(insights.slice(0, 3));
