import { isAllowedWafdeenStandaloneOperation } from './standalone-policy.js';
import { mountWafdeenAdminPanel } from './standalone-data-panel.js';

const jsonRequest = window.majdJsonRequest_;
if (typeof jsonRequest === 'function' && !jsonRequest.__wafdeenScopeGuard) {
  const guardedJsonRequest = function (url, body, authenticated) {
    if (authenticated && !isAllowedWafdeenStandaloneOperation(body)) {
      return Promise.reject(new Error('SESSION_SCOPE_FORBIDDEN'));
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
      return Promise.reject(new Error('SESSION_SCOPE_FORBIDDEN'));
    }
    return apiRequest.call(this, body);
  };
  guardedRequest.__wafdeenScopeGuard = true;
  window.majdAuthenticatedRequest_ = guardedRequest;
}

const showWafdeenAppScreen = window.showWafdeenAppScreen;
if (typeof showWafdeenAppScreen === 'function' && !showWafdeenAppScreen.__wafdeenAdminPanelHook) {
  const guardedShowWafdeenAppScreen = function (...args) {
    const result = showWafdeenAppScreen.apply(this, args);
    mountWafdeenAdminPanel(document, window);
    return result;
  };
  guardedShowWafdeenAppScreen.__wafdeenAdminPanelHook = true;
  window.showWafdeenAppScreen = guardedShowWafdeenAppScreen;
}

// لا تستعد هذه الصفحة أي جلسة أو بيانات محلية؛ كل صفحة جديدة تبدأ فارغة.
if (typeof window.stopSupabaseSession_ === 'function') window.stopSupabaseSession_();

document.body.classList.remove('wafdeen-mode');
document.body.classList.add('login-screen-active', 'wafdeen-standalone-route');
document.getElementById('wafdeen-app-screen')?.classList.add('hidden');
document.getElementById('wafdeen-login-screen')?.classList.remove('hidden');
const passwordField = document.getElementById('wafdeenPassword');
if (passwordField) passwordField.value = '';
document.getElementById('wafdeenUsername')?.focus();

// تسجيل الخروج من صفحة الوافدين يعيد المستخدم إلى نقطة الدخول الرئيسية.
if (typeof window.showLoginScreen === 'function') {
  window.showLoginScreen = () => window.location.replace('./index.html');
}
