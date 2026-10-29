const PAGE_SIZE = 50;

export function isWafdeenDataViewer(user) {
  if (user?.isAdmin === true || user?.isAdmin === 1) return true;
  const center = String(user?.center ?? user?.profile?.center ?? '');
  const canWafdeen = user?.canWafdeen === true || user?.canWafdeen === 1;
  return user?.accountType === 'staff' && canWafdeen && center !== 'مشرف';
}

export async function fetchWafdeenAdminData(apiRequest) {
  if (typeof apiRequest !== 'function') throw new Error('API_UNAVAILABLE');
  const [accountResponse, gradeResponse] = await Promise.all([
    apiRequest({ op: 'listWafdeenAccounts' }),
    apiRequest({ op: 'listWafdeenGrades' })
  ]);
  if (!Array.isArray(accountResponse?.accounts) || !Array.isArray(gradeResponse?.grades)) {
    throw new Error('INVALID_WAFDEEN_DATA_RESPONSE');
  }
  return { accounts: accountResponse.accounts, grades: gradeResponse.grades };
}

function createCell(document, row, value) {
  const cell = document.createElement('td');
  cell.textContent = String(value ?? '—');
  row.appendChild(cell);
}

function formatType(value) {
  return ({ new: 'الجديد', newLesson: 'الجديد', old: 'الماضي', oldRevision: 'الماضي', recitation: 'التلاوة' })[String(value || '')] || String(value || '—');
}

function formatScore(value) {
  if (value === null || value === undefined || value === '') return '—';
  const number = Number(value);
  return Number.isFinite(number) ? new Intl.NumberFormat('ar-EG', { maximumFractionDigits: 2 }).format(number) : '—';
}

export function mountWafdeenAdminPanel(document, window) {
  const user = window?.currentWafdeenTeacher;
  if (!isWafdeenDataViewer(user)) return false;
  const app = document?.getElementById('wafdeen-app-screen');
  if (!app) return false;
  if (document.getElementById('wafdeen-admin-data-open')) return true;

  const openButton = document.createElement('button');
  openButton.id = 'wafdeen-admin-data-open';
  openButton.type = 'button';
  openButton.className = 'action-btn btn-save';
  openButton.textContent = 'قائمة الحسابات والدرجات';
  openButton.setAttribute('aria-haspopup', 'dialog');
  openButton.style.cssText = 'margin:10px 0;min-height:44px;';

  const panel = document.createElement('section');
  panel.id = 'wafdeen-admin-data-panel';
  panel.setAttribute('role', 'dialog');
  panel.setAttribute('aria-modal', 'true');
  panel.setAttribute('aria-label', 'قائمة حسابات ودرجات الوافدين');
  panel.style.cssText = 'display:none;position:fixed;inset:0;z-index:1000000;overflow:auto;box-sizing:border-box;background:#f7f8fa;color:#18212b;padding:16px;direction:rtl;font-family:Cairo,Arial,sans-serif;';
  panel.innerHTML = `
    <div style="max-width:1200px;margin:0 auto;width:100%;">
      <header style="display:flex;gap:12px;align-items:center;justify-content:space-between;flex-wrap:wrap;margin-bottom:12px;">
        <h2 style="margin:0;font-size:1.35rem;">قائمة حسابات ودرجات الوافدين</h2>
        <button type="button" id="wafdeen-admin-data-close" class="action-btn btn-secondary" style="min-height:42px;">العودة</button>
      </header>
      <p id="wafdeen-admin-data-status" role="status" aria-live="polite" style="background:#fff;border-radius:10px;padding:10px;margin:0 0 14px;">يتم تحميل البيانات من الخدمة عند فتح اللوحة فقط.</p>
      <section style="background:#fff;border-radius:12px;padding:12px;margin-bottom:16px;">
        <h3 style="margin:0 0 10px;">الحسابات النشطة</h3>
        <input id="wafdeen-admin-accounts-search" type="search" aria-label="بحث الحسابات" placeholder="ابحث في الحسابات" style="width:100%;box-sizing:border-box;padding:10px;margin-bottom:8px;">
        <div style="overflow:auto;max-height:40vh;"><table style="width:100%;border-collapse:collapse;min-width:620px;"><thead><tr><th>الاسم</th><th>اسم المستخدم</th><th>النوع</th><th>الدور</th><th>الفصل</th><th>الحالة</th></tr></thead><tbody id="wafdeen-admin-accounts-body"></tbody></table></div>
        <div style="display:flex;gap:8px;align-items:center;justify-content:center;margin-top:8px;"><button type="button" id="wafdeen-admin-accounts-prev">السابق</button><span id="wafdeen-admin-accounts-page"></span><button type="button" id="wafdeen-admin-accounts-next">التالي</button></div>
      </section>
      <section style="background:#fff;border-radius:12px;padding:12px;">
        <h3 style="margin:0 0 10px;">درجات الرصد اليومية</h3>
        <input id="wafdeen-admin-grades-search" type="search" aria-label="بحث الدرجات" placeholder="ابحث باسم الطالب أو التاريخ" style="width:100%;box-sizing:border-box;padding:10px;margin-bottom:8px;">
        <div style="overflow:auto;max-height:52vh;"><table style="width:100%;border-collapse:collapse;min-width:760px;"><thead><tr><th>التاريخ</th><th>الطالب</th><th>النوع</th><th>الجديد</th><th>الماضي</th><th>التلاوة</th><th>المجموع</th></tr></thead><tbody id="wafdeen-admin-grades-body"></tbody></table></div>
        <div style="display:flex;gap:8px;align-items:center;justify-content:center;margin-top:8px;"><button type="button" id="wafdeen-admin-grades-prev">السابق</button><span id="wafdeen-admin-grades-page"></span><button type="button" id="wafdeen-admin-grades-next">التالي</button></div>
      </section>
    </div>`;

  const anchor = document.getElementById('wafdeen-teacher-name');
  if (anchor?.insertAdjacentElement) anchor.insertAdjacentElement('afterend', openButton);
  else app.insertBefore(openButton, app.firstChild);
  app.appendChild(panel);

  let accounts = [];
  let grades = [];
  const accountPage = { value: 0 };
  const gradePage = { value: 0 };
  const status = panel.querySelector('#wafdeen-admin-data-status');

  function renderTable(kind) {
    const accountMode = kind === 'accounts';
    const rows = accountMode ? accounts : grades;
    const input = panel.querySelector(accountMode ? '#wafdeen-admin-accounts-search' : '#wafdeen-admin-grades-search');
    const body = panel.querySelector(accountMode ? '#wafdeen-admin-accounts-body' : '#wafdeen-admin-grades-body');
    const pageState = accountMode ? accountPage : gradePage;
    const needle = String(input?.value || '').trim().toLocaleLowerCase('ar');
    const filtered = rows.filter((item) => {
      const fields = accountMode
        ? [item.name, item.username, item.accountType, item.role, item.className, item.assignedClass]
        : [item.studentName, item.dateISO, item.sessionType];
      return !needle || fields.some((value) => String(value ?? '').toLocaleLowerCase('ar').includes(needle));
    });
    const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    pageState.value = Math.min(pageState.value, pages - 1);
    body.replaceChildren();
    const slice = filtered.slice(pageState.value * PAGE_SIZE, (pageState.value + 1) * PAGE_SIZE);
    for (const item of slice) {
      const row = document.createElement('tr');
      if (accountMode) {
        const type = ({ wafdeen_student: 'طالب وافد', wafdeen_teacher: 'معلم وافد', staff: 'موظف' })[item.accountType] || item.accountType;
        [item.name || item.username, item.username, type, item.role, item.assignedClass || item.className, item.isActive ? 'نشط' : 'غير نشط'].forEach((value) => createCell(document, row, value));
      } else {
        [item.dateISO, item.studentName, formatType(item.sessionType), formatScore(item.newLesson), formatScore(item.oldRevision), formatScore(item.recitation), formatScore(item.total)].forEach((value) => createCell(document, row, value));
      }
      body.appendChild(row);
    }
    panel.querySelector(accountMode ? '#wafdeen-admin-accounts-page' : '#wafdeen-admin-grades-page').textContent = `صفحة ${pageState.value + 1} من ${pages} — ${filtered.length} سجل`;
    panel.querySelector(accountMode ? '#wafdeen-admin-accounts-prev' : '#wafdeen-admin-grades-prev').disabled = pageState.value <= 0;
    panel.querySelector(accountMode ? '#wafdeen-admin-accounts-next' : '#wafdeen-admin-grades-next').disabled = pageState.value >= pages - 1;
  }

  for (const [kind, suffix] of [['accounts', 'accounts'], ['grades', 'grades']]) {
    panel.querySelector(`#wafdeen-admin-${suffix}-search`).addEventListener('input', () => {
      (kind === 'accounts' ? accountPage : gradePage).value = 0;
      renderTable(kind);
    });
    panel.querySelector(`#wafdeen-admin-${suffix}-prev`).addEventListener('click', () => {
      const pageState = kind === 'accounts' ? accountPage : gradePage;
      pageState.value = Math.max(0, pageState.value - 1);
      renderTable(kind);
    });
    panel.querySelector(`#wafdeen-admin-${suffix}-next`).addEventListener('click', () => {
      const pageState = kind === 'accounts' ? accountPage : gradePage;
      pageState.value += 1;
      renderTable(kind);
    });
  }

  panel.querySelector('#wafdeen-admin-data-close').addEventListener('click', () => {
    panel.style.display = 'none';
    accounts = [];
    grades = [];
    panel.querySelector('#wafdeen-admin-accounts-body').replaceChildren();
    panel.querySelector('#wafdeen-admin-grades-body').replaceChildren();
    status.textContent = 'أُغلقت اللوحة ومسحت بياناتها المؤقتة من الذاكرة.';
  });

  openButton.addEventListener('click', async () => {
    panel.style.display = 'flex';
    status.textContent = 'جار تحميل الحسابات والدرجات من الخادم…';
    openButton.disabled = true;
    try {
      const data = await fetchWafdeenAdminData(window.majdAuthenticatedRequest_);
      accounts = data.accounts;
      grades = data.grades;
      accountPage.value = 0;
      gradePage.value = 0;
      renderTable('accounts');
      renderTable('grades');
      status.textContent = 'عُرضت بيانات الخادم المسموح بها فقط؛ لا تُستخدم نسخة محلية للدرجات.';
    } catch {
      accounts = [];
      grades = [];
      panel.querySelector('#wafdeen-admin-accounts-body').replaceChildren();
      panel.querySelector('#wafdeen-admin-grades-body').replaceChildren();
      status.textContent = 'تعذر جلب البيانات من الخدمة. لم تُعرض بيانات محلية بديلة.';
    } finally {
      openButton.disabled = false;
    }
  });

  return true;
}
