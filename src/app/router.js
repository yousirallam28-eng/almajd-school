import { getAppState, markFeatureLoaded, setActiveTab } from './state.js';

const featureByTab = {
  'admin-tab': 'admin',
  'daily-tab': 'daily',
  'quick-registration-tab': 'quick-registration',
  'status-tab': 'daily',
  'attendance-tab': 'reports',
  'weekly-tab': 'reports',
  'reports-tab': 'reports',
  'manager-tab': 'reports',
  'top-students-tab': 'reports',
  'analysis-tab': 'reports',
  'notes-tab': 'notes',
  'payments-tab': 'expenses',
  'payment-report-tab': 'expenses',
  'total-expenses-tab': 'expenses',
  'sheikh-registration-tab': 'sheikh-recordings',
  'wafdeen-time-tab': 'sheikh-recordings'
};

const modules = {
  admin: () => import('../features/admin/index.js'),
  daily: () => import('../features/daily/index.js'),
  'quick-registration': () => import('../features/quick-registration/index.js'),
  reports: () => import('../features/reports/index.js'),
  notes: () => import('../features/notes/index.js'),
  expenses: () => import('../features/expenses/index.js'),
  'sheikh-recordings': () => import('../features/sheikh-recordings/index.js')
};

export function featureForTab(tabId) { return featureByTab[tabId] || null; }

export function loadFeatureForTab(tabId) {
  const name = featureForTab(tabId);
  setActiveTab(tabId);
  if (!name) return Promise.resolve(null);
  const state = getAppState();
  if (state.loadedFeatures.has(name)) return Promise.resolve(name);
  if (!state.featurePromises.has(name)) {
    const promise = modules[name]().then(() => name).catch((error) => {
      console.error(`[MajdApp] failed to load feature: ${name}`, error);
      throw error;
    });
    state.featurePromises.set(name, promise);
    promise.then(() => markFeatureLoaded(name));
  }
  return state.featurePromises.get(name);
}
