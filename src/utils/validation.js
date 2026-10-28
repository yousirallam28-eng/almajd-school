export function required(value, label) {
  const normalized = String(value ?? '').trim();
  if (!normalized) throw new Error(`${label} مطلوب.`);
  return normalized;
}

export function isoDate(value = new Date()) {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) throw new Error('التاريخ غير صحيح.');
  return date.toISOString().slice(0, 10);
}
