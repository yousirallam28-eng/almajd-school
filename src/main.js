import { cloudClient } from './api/client.js';
import * as teachersApi from './api/teachers.api.js';
import * as domainApis from './api/domain.apis.js';
import { loadFeatureForTab } from './app/router.js';
import { getAppState } from './app/state.js';

// User-approved release: the matching authenticated Edge Function is deployed.
window.__MAJD_WAFDEEN_SESSIONS_ENABLED__ = true;

const app = {
  cloud: cloudClient,
  teachers: teachersApi,
  domains: domainApis,
  state: getAppState(),
  loadFeature: loadFeatureForTab,
  version: 'modular-v1'
};

window.MajdApp = Object.freeze(app);

// تُحمّل ميزة المعلمين في chunk مستقل، مع بقاء legacy مسؤولاً عن بقية الشاشات مؤقتاً.
import('./features/teachers/index.js').catch((error) => {
  console.error('[MajdApp] failed to load teachers feature', error);
});

import('./features/wafdeen/index.js').catch((error) => {
  console.error('[MajdApp] failed to load Wafdeen feature', error);
});

if (typeof performance !== 'undefined' && performance.mark) {
  performance.mark('majd-modular-entry-ready');
}

window.addEventListener('error', (event) => {
  console.error('[MajdApp]', event.error || event.message);
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('[MajdApp] unhandled rejection', event.reason);
});
