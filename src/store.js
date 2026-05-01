import { promises as fs } from 'node:fs';
import path from 'node:path';

const dataDir = path.resolve(process.cwd(), '.data');
const dataFile = path.join(dataDir, 'lifeos.json');

const defaultState = () => ({
  finance: {
    assets: 0,
    liabilities: 0,
    monthIncome: 0,
    monthExpenses: 0,
    monthBudget: 0,
    transactions: []
  },
  calendar: {
    todayEvents: []
  },
  captures: [],
  habits: [],
  habitLogs: [],
  health: {
    sleepHours: 0,
    steps: 0,
    exerciseMinutes: 0,
    weight: null,
    sleepTrend: 'stable'
  }
});

export async function readState() {
  try {
    const raw = await fs.readFile(dataFile, 'utf8');
    const state = JSON.parse(raw);
    if (!Array.isArray(state.captures)) state.captures = [];
    if (!state.health) state.health = { sleepHours: 0, steps: 0, exerciseMinutes: 0, weight: null, sleepTrend: 'stable' };
    if (!Array.isArray(state.habits)) state.habits = [];
    if (!Array.isArray(state.habitLogs)) state.habitLogs = [];
    return state;
  } catch {
    const initial = defaultState();
    await writeState(initial);
    return initial;
  }
}

export async function writeState(state) {
  await fs.mkdir(dataDir, { recursive: true });
  await fs.writeFile(dataFile, JSON.stringify(state, null, 2), 'utf8');
}

export async function updateFinance(finance) {
  const state = await readState();
  state.finance = finance;
  await writeState(state);
  return state.finance;
}

export async function updateCalendar(calendar) {
  const state = await readState();
  state.calendar = calendar;
  await writeState(state);
  return state.calendar;
}

export async function upsertHabit(habit) {
  const state = await readState();
  const existingIndex = state.habits.findIndex((item) => item.id === habit.id);
  if (existingIndex >= 0) state.habits[existingIndex] = { ...state.habits[existingIndex], ...habit };
  else state.habits.push(habit);
  await writeState(state);
  return habit;
}

export async function addHabitLog(log) {
  const state = await readState();
  state.habitLogs.push(log);
  state.habitLogs = state.habitLogs.slice(-500);
  await writeState(state);
  return log;
}

export async function updateHealth(health) {
  const state = await readState();
  state.health = health;
  await writeState(state);
  return state.health;
}

export async function addCapture(capture) {
  const state = await readState();
  state.captures.unshift(capture);
  state.captures = state.captures.slice(0, 100);
  await writeState(state);
  return capture;
}

export async function resetStore() {
  await writeState(defaultState());
}
