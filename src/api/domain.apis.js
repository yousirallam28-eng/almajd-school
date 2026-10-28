import { createCollectionApi } from './collection.api.js';

export const studentsApi = createCollectionApi('students');
export const recordsApi = createCollectionApi('dailyRecords');
export const notesApi = createCollectionApi('notes');
export const paymentsApi = createCollectionApi('payments');
export const reportsApi = createCollectionApi('results');
