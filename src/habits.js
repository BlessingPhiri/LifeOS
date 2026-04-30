export function validateHabitPayload(payload) {
  const errors = [];
  if (payload == null || typeof payload !== 'object') return ['Payload must be a JSON object.'];
  if (!payload.id || typeof payload.id !== 'string') errors.push('id is required and must be a string.');
  if (!payload.name || typeof payload.name !== 'string') errors.push('name is required and must be a string.');
  return errors;
}

export function validateHabitLogPayload(payload) {
  const errors = [];
  if (payload == null || typeof payload !== 'object') return ['Payload must be a JSON object.'];
  if (!payload.habitId || typeof payload.habitId !== 'string') errors.push('habitId is required and must be a string.');
  if (payload.completed != null && typeof payload.completed !== 'boolean') errors.push('completed must be a boolean when provided.');
  return errors;
}

export function normalizeHabit(payload) {
  return {
    id: payload.id,
    name: payload.name,
    color: payload.color || '#22c55e',
    icon: payload.icon || '✅',
    createdAt: new Date().toISOString()
  };
}

export function normalizeHabitLog(payload) {
  return {
    habitId: payload.habitId,
    completed: payload.completed ?? true,
    date: payload.date || new Date().toISOString().slice(0, 10),
    createdAt: new Date().toISOString()
  };
}

export function computeWeeklyCompletion(habits, logs) {
  if (!habits.length) return 0;
  const end = new Date();
  const start = new Date(end);
  start.setDate(end.getDate() - 6);
  const startStr = start.toISOString().slice(0, 10);
  const endStr = end.toISOString().slice(0, 10);
  const windowLogs = logs.filter((log) => log.date >= startStr && log.date <= endStr);
  const totalSlots = habits.length * 7;
  if (!totalSlots) return 0;
  const completed = windowLogs.filter((log) => log.completed).length;
  return Number(((completed / totalSlots) * 100).toFixed(1));
}
