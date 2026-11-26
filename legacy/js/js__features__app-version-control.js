/* إدارة إصدار التطبيق وقياس الأجهزة التي أبلغت عن حضورها. */
(function (w) {
  'use strict';
  var APP_VERSION_CODE = 2026112601;
  var APP_RELEASE_NAME = 'نسخة نوفمبر 2026';
  var DEVICE_KEY = 'majd.app.deviceId.v1';
  var FORCE_ATTEMPT_KEY = 'majd.app.forceUpdateAttempt';
  var cardReady = false;

  function api() { return w.__MAJD_SUPABASE__ && w.__MAJD_SUPABASE__.request; }
  function isAdmin() { var t = w.currentTeacher || {}; return String(t.username || '').trim() === 'admin'; }
  function installed() { try { return !!(w.matchMedia && w.matchMedia('(display-mode: standalone)').matches) || w.navigator.standalone === true; } catch (_) { return false; } }
  function deviceId() {
    try {
      var id = w.localStorage.getItem(DEVICE_KEY);
      if (!id) { id = 'd_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2) + '_' + Math.random().toString(36).slice(2); w.localStorage.setItem(DEVICE_KEY, id); }
      return id;
    } catch (_) { return 'd_session_' + Math.random().toString(36).slice(2); }
  }
  function esc(v) { return String(v == null ? '' : v).replace(/[&<>"']/g, function (m) { return ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' })[m]; }); }
  function formatDate(value) { try { return value ? new Date(value).toLocaleString('ar-EG') : '—'; } catch (_) { return '—'; } }

  function ensureCard() {
    if (!isAdmin() || cardReady) return;
    var root = document.getElementById('admin-tab');
    if (!root) return;
    var card = document.createElement('div');
    card.className = 'card-view app-control-card';
    card.id = 'app-version-control-card';
    card.innerHTML = '<h3 class="card-title">📡 إدارة إصدار الموقع والتطبيق</h3>' +
      '<p class="app-control-help">أرسل إصدارًا إجباريًا للأجهزة التي لم يصلها آخر تحديث، وتابع الأجهزة التي فتحت الموقع وأرسلت حضورًا للسحابة.</p>' +
      '<div class="app-control-stats" id="app-control-stats"><span>جارٍ قراءة الإحصاءات...</span></div>' +
      '<div class="app-control-actions"><button type="button" class="action-btn btn-warning" id="app-force-update-btn">🔄 إرسال تحديث إجباري للجميع</button><button type="button" class="action-btn btn-edit" id="app-refresh-stats-btn">تحديث الإحصاءات</button></div>' +
      '<div class="toast-msg" id="app-control-msg" role="status" aria-live="polite"></div>' +
      '<small class="app-control-note">العدد هو الأجهزة التي فتحت الموقع/التطبيق وأرسلت حضورًا للسحابة، وليس عدد التثبيتات التاريخية بدقة. يُعد الجهاز نشطًا إذا أرسل حضورًا خلال آخر 30 يومًا.</small>';
    root.insertBefore(card, root.firstChild);
    card.querySelector('#app-force-update-btn').onclick = forceUpdate;
    card.querySelector('#app-refresh-stats-btn').onclick = refreshStatus;
    cardReady = true;
  }
  function renderStatus(result) {
    ensureCard();
    var box = document.getElementById('app-control-stats'); if (!box) return;
    var cfg = result && result.config || {};
    var active = Number(result && result.activeDevices || 0), reported = Number(result && result.reportedDevices || 0);
    box.innerHTML = '<div><strong>الأجهزة النشطة:</strong><b>' + active + '</b></div><div><strong>إجمالي الأجهزة المبلغة:</strong><b>' + reported + '</b></div><div><strong>الإصدار المطلوب حاليًا:</strong><b>' + esc(cfg.requiredVersion || 'لم يُرسل بعد') + '</b></div><div><strong>آخر إرسال:</strong><b>' + esc(formatDate(cfg.forcedAt)) + '</b></div><div><strong>آخر حضور:</strong><b>' + esc(formatDate(result && result.lastSeenAt)) + '</b></div>';
  }
  async function refreshStatus() {
    if (!api() || !isAdmin()) return null;
    var msg = document.getElementById('app-control-msg'); if (msg) msg.textContent = 'جارٍ تحديث الإحصاءات...';
    try { var result = await api()('getAppStatus', {}); renderStatus(result); if (msg) { msg.textContent = 'تم تحديث الإحصاءات.'; msg.className = 'toast-msg success'; } return result; }
    catch (e) { if (msg) { msg.textContent = 'تعذر قراءة إحصاءات الأجهزة: ' + (e.message || 'خطأ اتصال'); msg.className = 'toast-msg error'; } return null; }
  }
  async function forceUpdate() {
    if (!api() || !isAdmin()) return;
    var ok = typeof w.siteConfirm === 'function' ? await w.siteConfirm('تحديث إجباري', 'سيُطلب من كل جهاز قديم إعادة تحميل أحدث نسخة عند فتحه. هل تريد الإرسال الآن؟', 'إرسال التحديث', false) : w.confirm('إرسال تحديث إجباري؟');
    if (!ok) return;
    var btn = document.getElementById('app-force-update-btn'); if (btn) btn.disabled = true;
    try {
      var result = await api()('forceAppUpdate', { version: APP_VERSION_CODE, releaseName: APP_RELEASE_NAME });
      renderStatus(result);
      var msg = document.getElementById('app-control-msg'); if (msg) { msg.textContent = 'تم إرسال التحديث الإجباري للإصدار الحالي.'; msg.className = 'toast-msg success'; }
    } catch (e) { var err = document.getElementById('app-control-msg'); if (err) { err.textContent = 'تعذر إرسال التحديث: ' + (e.message || 'خطأ اتصال'); err.className = 'toast-msg error'; } }
    finally { if (btn) btn.disabled = false; }
  }
  async function clearCachesAndReload(target) {
    try { if (w.caches) { var names = await w.caches.keys(); await Promise.all(names.map(function (n) { return w.caches.delete(n); })); } } catch (_) {}
    try { var regs = await w.navigator.serviceWorker.getRegistrations(); await Promise.all(regs.map(function (r) { return r.update(); })); } catch (_) {}
    try { w.sessionStorage.setItem(FORCE_ATTEMPT_KEY, String(target)); } catch (_) {}
    var url = new URL(w.location.href); url.searchParams.set('majd_update', String(target)); w.location.replace(url.toString());
  }
  function showUpdateGate(target) {
    var old = document.getElementById('app-force-update-gate'); if (old) return false;
    var gate = document.createElement('div'); gate.id = 'app-force-update-gate'; gate.style.cssText = 'position:fixed;inset:0;z-index:2147483647;display:flex;align-items:center;justify-content:center;padding:20px;background:rgba(8,35,29,.86);font-family:Cairo,Segoe UI,sans-serif;';
    gate.innerHTML = '<div style="max-width:440px;background:#fff;border-radius:20px;padding:28px;text-align:center;color:#075c4c;box-shadow:0 18px 60px #0008"><div style="font-size:46px">🔄</div><h2>يتوفر تحديث جديد</h2><p>يجب إعادة تحميل أحدث نسخة من الموقع قبل المتابعة.</p><button type="button" class="action-btn btn-save">تحديث الآن</button></div>';
    document.body.appendChild(gate); gate.querySelector('button').onclick = function () { clearCachesAndReload(target); };
    return false;
  }
  async function checkVersionAndHeartbeat() {
    if (!api() || !w.currentTeacher) return true;
    var result;
    try { result = await api()('getAppStatus', {}); } catch (_) { result = null; }
    if (result && Number(result.config && result.config.requiredVersion || 0) > APP_VERSION_CODE) return showUpdateGate(Number(result.config.requiredVersion));
    try { await api()('heartbeatApp', { deviceId: deviceId(), appVersion: APP_VERSION_CODE, installed: !!(document.getElementById('installAppBtn') && document.getElementById('installAppBtn').hidden), standalone: installed() }); } catch (_) {}
    if (isAdmin()) { ensureCard(); renderStatus(result || {}); }
    try { if (Number(w.sessionStorage.getItem(FORCE_ATTEMPT_KEY) || 0) <= APP_VERSION_CODE) w.sessionStorage.removeItem(FORCE_ATTEMPT_KEY); } catch (_) {}
    return true;
  }
  w.MajdAppVersion = { current: APP_VERSION_CODE, check: checkVersionAndHeartbeat, refresh: refreshStatus, force: forceUpdate };
  w.renderAppVersionControl = ensureCard;
  w.checkMandatoryAppUpdate = checkVersionAndHeartbeat;
  var originalShow = w.showAppScreen;
  if (typeof originalShow === 'function') w.showAppScreen = function () { var result = originalShow.apply(this, arguments); ensureCard(); return result; };
  document.addEventListener('DOMContentLoaded', function () { if (isAdmin()) ensureCard(); });
})(window);
