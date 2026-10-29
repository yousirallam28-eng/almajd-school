import { createWafdeenStandaloneBridge } from './standalone-api.js';
import { wireWafdeenStandalonePage } from './standalone-page.js';
import { isAllowedWafdeenStandaloneOperation } from './standalone-policy.js';

function initializeWafdeenStandalone() {
  if (window.__WAFDEEN_STANDALONE_INITIALIZED__) return;
  window.__WAFDEEN_STANDALONE_INITIALIZED__ = true;

  const jsonRequest = window.majdJsonRequest_;
  if (typeof jsonRequest === 'function' && !jsonRequest.__wafdeenScopeGuard) {
    const guardedJsonRequest = function (url, body, authenticated) {
      if (authenticated && !isAllowedWafdeenStandaloneOperation(body)) {
        return Promise.reject(new Error('WAFDEEN_FEATURE_DISABLED'));
      }
      return jsonRequest.call(this, url, body, authenticated);
    };
    guardedJsonRequest.__wafdeenScopeGuard = true;
    window.majdJsonRequest_ = guardedJsonRequest;
  }

  const apiRequest = window.majdAuthenticatedRequest_;
  if (typeof apiRequest === 'function' && !apiRequest.__wafdeenScopeGuard) {
    const guardedRequest = function (body) {
      if (!isAllowedWafdeenStandaloneOperation(body)) {
        return Promise.reject(new Error('WAFDEEN_FEATURE_DISABLED'));
      }
      return apiRequest.call(this, body);
    };
    guardedRequest.__wafdeenScopeGuard = true;
    window.majdAuthenticatedRequest_ = guardedRequest;
  }

  // No public lookup contract is verified for this standalone route.
  const publicRequest = window.majdPublicRequest_;
  if (typeof publicRequest === 'function' && !publicRequest.__wafdeenPublicGuard) {
    const guardedPublicRequest = () => Promise.reject(new Error('WAFDEEN_PUBLIC_LOOKUP_UNAVAILABLE'));
    guardedPublicRequest.__wafdeenPublicGuard = true;
    window.majdPublicRequest_ = guardedPublicRequest;
  }

  const originalErrorMessage = window.majdApiErrorMessage_;
  if (typeof originalErrorMessage === 'function') {
    window.majdApiErrorMessage_ = function (error) {
      const code = String(error?.code || error?.message || '');
      if (/WAFDEEN_FEATURE_DISABLED|WAFDEEN_PUBLIC_LOOKUP_UNAVAILABLE|WAFDEEN_REPORT_UNAVAILABLE/.test(code)) {
        return 'هذه الوظيفة غير متاحة في صفحة الوافدين الحالية؛ لم يُرسل طلب أو تغيير غير معتمد.';
      }
      return originalErrorMessage.call(this, error);
    };
  }

  if (typeof window.stopSupabaseSession_ === 'function') window.stopSupabaseSession_();
  window.MajdLocalDataAPI = createWafdeenStandaloneBridge(
    (body) => window.majdAuthenticatedRequest_(body),
    () => Boolean(window.MAJD_SESSION_TOKEN)
  );
  wireWafdeenStandalonePage(window.MajdLocalDataAPI);

  document.body.classList.remove('wafdeen-mode');
  document.body.classList.add('login-screen-active', 'wafdeen-standalone-route');
  document.getElementById('wafdeen-app-screen')?.classList.add('hidden');
  document.getElementById('wafdeen-login-screen')?.classList.remove('hidden');
  const passwordField = document.getElementById('wafdeenPassword');
  if (passwordField) passwordField.value = '';
  document.getElementById('wafdeenUsername')?.focus();

  if (typeof window.showLoginScreen === 'function') {
    window.showLoginScreen = () => window.location.replace('./index.html');
  }
}

// Vite may place module scripts in <head>; wait for the classic app assets first.
if (window.__WAFDEEN_CLASSIC_ASSETS_READY__) {
  initializeWafdeenStandalone();
} else {
  window.addEventListener('wafdeen-classic-assets-ready', initializeWafdeenStandalone, { once: true });
}
