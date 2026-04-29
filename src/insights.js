import { savingsRate, scheduleLoadScore } from './metrics.js';

/**
 * Deterministic rule-based insights (MVP).
 */
export function generateInsights({ finance, habits, health, calendar, projects }) {
  const insights = [];

  if (finance) {
    const rate = savingsRate({ income: finance.monthIncome, expenses: finance.monthExpenses });
    if (rate < 20) {
      insights.push({
        type: 'finance',
        severity: rate < 10 ? 'high' : 'medium',
        message: `Savings rate is ${rate}%. Aim for 20%+ this month.`
      });
    }

    if (finance.monthExpenses > finance.monthBudget) {
      const overBy = (finance.monthExpenses - finance.monthBudget).toFixed(2);
      insights.push({
        type: 'finance',
        severity: 'high',
        message: `You are over budget by $${overBy} this month.`
      });
    }
  }

  if (habits?.weeklyCompletionRate < 70) {
    insights.push({
      type: 'habit',
      severity: 'medium',
      message: `Habit completion is ${habits.weeklyCompletionRate}%. Try a smaller daily target.`
    });
  }

  if (health?.sleepTrend === 'down') {
    insights.push({
      type: 'health',
      severity: 'medium',
      message: 'Sleep trend has declined this week. Prioritize bedtime consistency.'
    });
  }

  const load = scheduleLoadScore(calendar?.todayEvents || []);
  if (load >= 85) {
    insights.push({
      type: 'calendar',
      severity: 'low',
      message: `Today is heavily scheduled (${load}% load). Block recovery time.`
    });
  }

  if (projects?.staleProjectDays >= 5) {
    insights.push({
      type: 'project',
      severity: 'medium',
      message: `Project ${projects.staleProjectName} has no progress for ${projects.staleProjectDays} days.`
    });
  }

  return prioritize(insights);
}

function prioritize(insights) {
  const order = { high: 0, medium: 1, low: 2 };
  return insights.sort((a, b) => order[a.severity] - order[b.severity]);
}
