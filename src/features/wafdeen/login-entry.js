import { canOpenFeature } from '../../app/permissions.js';

const byId = (id) => document.getElementById(id);

function setLoginMessage(message, type = 'error') {
  const box = byId('wafdeen-login-msg');
  if (!box) return;
  box.textContent = String(message || 'تعذر تسجيل الدخول. حاول مرة أخرى.');
  box.className = `toast-msg toast-${type}`;
  box.style.display = 'block';
}

function showEntryScreen() {
  window.closeMainMenu?.();
  document.body.classList.add('login-screen-active');
  ['login-screen', 'results-screen', 'student-login-screen', 'app-screen'].forEach((id) => {
    byId(id)?.classList.add('hidden');
  });
  byId('wafdeen-entry-screen')?.classList.remove('hidden');
  byId('wafdeen-login-msg')?.style.setProperty('display', 'none');
  byId('wafdeen-login-username')?.focus();
}

function closeEntryScreen() {
  byId('wafdeen-entry-screen')?.classList.add('hidden');
  window.showLoginScreen?.();
}

async function submitEntryLogin(openTab) {
  const username = byId('wafdeen-login-username')?.value.trim() || '';
  const secret = byId('wafdeen-login-password')?.value || '';
  const submitButton = byId('wafdeen-login-submit');
  const appUsername = byId('username');
  const appSecret = byId('password');
  const appLoginMessage = byId('login-msg');
  if (!username || !secret) return setLoginMessage('يرجى إدخال اسم المستخدم وكلمة المرور.');
  if (typeof window.handleLogin !== 'function' || !appUsername || !appSecret) {
    return setLoginMessage('تعذر تحميل تسجيل الدخول. أعد تحميل الصفحة وحاول مرة أخرى.');
  }
  if (submitButton) submitButton.disabled = true;
  if (appLoginMessage) {
    appLoginMessage.textContent = '';
    appLoginMessage.style.display = 'none';
  }
  appUsername.value = username;
  appSecret.value = secret;
  try {
    await window.handleLogin();
    const teacher = window.currentTeacher || null;
    if (!teacher) {
      return setLoginMessage(appLoginMessage?.textContent || 'اسم المستخدم أو كلمة المرور غير صحيحة.');
    }
    if (!canOpenFeature('wafdeen', teacher)) {
      window.showMessage?.('app-msg', 'تم تسجيل الدخول، لكن هذا الحساب لا يملك صلاحية دخول جلسة الوافدين.', 'error');
      return;
    }
    openTab('wafdeen-tab');
  } catch (error) {
    setLoginMessage(error?.message || 'تعذر تسجيل الدخول. حاول مرة أخرى.');
  } finally {
    byId('wafdeen-login-password').value = '';
    appUsername.value = '';
    appSecret.value = '';
    if (submitButton) submitButton.disabled = false;
  }
}

export function installWafdeenLoginEntry(openTab) {
  window.showWafdeenEntryScreen = showEntryScreen;
  window.closeWafdeenEntryScreen = closeEntryScreen;
  window.submitWafdeenEntryLogin = () => submitEntryLogin(openTab);
  if (typeof window.showAppScreen === 'function' && !window.showAppScreen.__wafdeenEntryWrapped) {
    const original = window.showAppScreen;
    const wrapped = function (...args) {
      const result = original.apply(this, args);
      byId('wafdeen-entry-screen')?.classList.add('hidden');
      return result;
    };
    wrapped.__wafdeenEntryWrapped = true;
    window.showAppScreen = wrapped;
  }
  byId('wafdeen-login-btn')?.classList.remove('hidden');
}
