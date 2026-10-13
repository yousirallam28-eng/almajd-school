import { cloudClient } from './client.js';

export function createCollectionApi(collection) {
  return {
    list: (filters = []) => cloudClient.list(collection, filters),
    get: (id) => cloudClient.get(collection, id),
    upsert: (id, data, options = { merge: true }) => cloudClient.upsert(collection, id, data, options),
    remove: (id) => cloudClient.remove(collection, id)
  };
}
