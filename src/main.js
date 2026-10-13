import { cloudClient } from './api/client.js';
import * as teachersApi from './api/teachers.api.js';

const app = {
  cloud: cloudClient,
  teachers: teachersApi,
  version: 'modular-v1'
};

window.MajdApp = Object.freeze(app);

if (typeof performance !== 'undefined' && performance.mark) {
  performance.mark('majd-modular-entry-ready');
}

window.addEventListener('error', (event) => {
  console.error('[MajdApp]', event.error || event.message);
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('[MajdApp] unhandled rejection', event.reason);
});
