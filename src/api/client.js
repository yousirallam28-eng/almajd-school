const apiUnavailable = () => new Error('اتصال السحابة غير متاح. أعد تسجيل الدخول وحاول مرة أخرى.');

function getApi() {
  const api = window.MajdLocalDataAPI;
  if (!api || typeof api.writeRecord !== 'function') throw apiUnavailable();
  if (typeof api.isAvailable === 'function' && !api.isAvailable()) throw apiUnavailable();
  return api;
}

export const cloudClient = {
  async list(collection, filters = []) {
    const api = getApi();
    let query = api.collection(collection);
    for (const filter of filters) query = query.where(filter.field, filter.op, filter.value);
    const snapshot = await query.get();
    return (snapshot.docs || []).map((doc) => ({ id: doc.id, ...doc.data() }));
  },

  async get(collection, id) {
    const api = getApi();
    const snapshot = await api.collection(collection).doc(String(id)).get();
    return snapshot.exists ? { id: snapshot.id, ...snapshot.data() } : null;
  },

  async upsert(collection, id, data, options = { merge: true }) {
    const api = getApi();
    const result = await api.writeRecord(collection, String(id), data, options);
    if (!result) throw new Error('لم يؤكد الخادم حفظ البيانات.');
    return result;
  },

  async remove(collection, id) {
    const api = getApi();
    const result = await api.deleteRecord(collection, String(id));
    if (!result) throw new Error('لم يؤكد الخادم حذف البيانات.');
    return result;
  }
};
