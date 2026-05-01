/**
 * Core KPI formulas for Life OS.
 */

export function netWorth({ assets = 0, liabilities = 0 }) {
  return roundCurrency(assets - liabilities);
}

export function monthlyNetIncome({ income = 0, expenses = 0 }) {
  return roundCurrency(income - expenses);
}

export function savingsRate({ income = 0, expenses = 0 }) {
  if (income <= 0) return 0;
  return roundPercent(((income - expenses) / income) * 100);
}

export function habitScore(logs = []) {
  if (!logs.length) return 0;
  const completed = logs.filter((entry) => entry.completed).length;
  return roundPercent((completed / logs.length) * 100);
}

export function scheduleLoadScore(events = []) {
  const totalHours = events.reduce((sum, event) => sum + Math.max(0, Number(event.durationHours || 0)), 0);

  // 0-100 scale. 8+ scheduled hours in a day is considered full load.
  return Math.min(100, roundPercent((totalHours / 8) * 100));
}

export function runwaysMonths({ liquidCash = 0, monthlyBurn = 0 }) {
  if (monthlyBurn <= 0) return Infinity;
  return Number((liquidCash / monthlyBurn).toFixed(1));
}

function roundCurrency(value) {
  return Number(Number(value).toFixed(2));
}

function roundPercent(value) {
  return Number(Number(value).toFixed(1));
}

export function healthScore({ sleepHours = 0, steps = 0, exerciseMinutes = 0 } = {}) {
  const sleepComponent = Math.min(100, (Number(sleepHours) / 8) * 100);
  const stepsComponent = Math.min(100, (Number(steps) / 10000) * 100);
  const exerciseComponent = Math.min(100, (Number(exerciseMinutes) / 30) * 100);
  return roundPercent((sleepComponent + stepsComponent + exerciseComponent) / 3);
}
