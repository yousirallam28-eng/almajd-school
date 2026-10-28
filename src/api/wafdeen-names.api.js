// This adapter uses only the names-only Edge Function operation. The Wafdeen UI remains mock-only until rollout is approved.
export async function listWafdeenStudentNames() {
  const api = globalThis.window?.MajdLocalDataAPI;
  if (!api || typeof api.isAvailable !== 'function' || !api.isAvailable() || typeof api.listWafdeenStudentNames !== 'function') {
    throw new Error('خدمة أسماء الطلاب غير متاحة؛ لم يتم تحميل أي سجلات.');
  }
  const names = await api.listWafdeenStudentNames();
  if (!Array.isArray(names) || !names.every((name) => typeof name === 'string')) {
    throw new Error('استجابة أسماء الطلاب غير صالحة.');
  }
  return [...new Set(names.map((name) => name.trim()).filter(Boolean))].sort((a, b) => a.localeCompare(b, 'ar'));
}
