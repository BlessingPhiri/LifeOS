export function validateFinancePayload(payload) {
  const errors = [];
  if (payload == null || typeof payload !== 'object') {
    return ['Payload must be a JSON object.'];
  }

  const numericFields = ['assets', 'liabilities', 'monthIncome', 'monthExpenses', 'monthBudget'];
  for (const key of numericFields) {
    if (payload[key] != null && !Number.isFinite(Number(payload[key]))) {
      errors.push(`${key} must be a finite number.`);
    }
  }

  if (payload.transactions != null && !Array.isArray(payload.transactions)) {
    errors.push('transactions must be an array when provided.');
  }

  return errors;
}

export function validateCalendarPayload(payload) {
  const errors = [];
  if (payload == null || typeof payload !== 'object') {
    return ['Payload must be a JSON object.'];
  }

  if (payload.todayEvents != null && !Array.isArray(payload.todayEvents)) {
    errors.push('todayEvents must be an array when provided.');
    return errors;
  }

  for (const [index, event] of (payload.todayEvents || []).entries()) {
    if (event == null || typeof event !== 'object') {
      errors.push(`todayEvents[${index}] must be an object.`);
      continue;
    }
    if (event.durationHours != null && !Number.isFinite(Number(event.durationHours))) {
      errors.push(`todayEvents[${index}].durationHours must be a finite number.`);
    }
  }

  return errors;
}

export function validateHealthPayload(payload) {
  const errors = [];
  if (payload == null || typeof payload !== 'object') return ['Payload must be a JSON object.'];

  const numericFields = ['sleepHours', 'steps', 'exerciseMinutes'];
  for (const key of numericFields) {
    if (payload[key] != null && !Number.isFinite(Number(payload[key]))) {
      errors.push(`${key} must be a finite number.`);
    }
  }
  if (payload.weight != null && !Number.isFinite(Number(payload.weight))) {
    errors.push('weight must be a finite number.');
  }
  return errors;
}
