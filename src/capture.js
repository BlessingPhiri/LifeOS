const allowedTypes = new Set(['transaction', 'habit', 'note', 'task', 'mood']);

export function validateCapturePayload(payload) {
  const errors = [];
  if (payload == null || typeof payload !== 'object') {
    return ['Payload must be a JSON object.'];
  }

  if (!allowedTypes.has(payload.type)) {
    errors.push('type must be one of transaction|habit|note|task|mood.');
  }

  if (payload.value == null || typeof payload.value !== 'object' || Array.isArray(payload.value)) {
    errors.push('value must be an object.');
  }

  return errors;
}

export function normalizeCapture(payload) {
  return {
    id: `cap_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    type: payload.type,
    value: payload.value,
    createdAt: new Date().toISOString()
  };
}
