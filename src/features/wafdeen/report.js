import { loadWafdeenReportData } from '../../api/wafdeen-report.api.js';
import { canOpenFeature } from '../../app/permissions.js';
import { registerFeature } from '../register.js';
import { aggregateMonthlyQuranUsage, formatDuration, localDateKey, monthRange } from './model.js';

const byId = (id) => document.getElementById(id);
const currentTeacher = () => window.currentTeacher || null;
const canViewReport = () => canOpenFeature('wafdeen-report', currentTeacher());
const escapeHtml = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' })[char]);

function text(id, value) {
  const element = byId(id);
  if (element) element.textContent = String(value ?? '');
}

function notice(message, type = 'info') {
  const box = byId('wafdeen-report-message');
  if (!box) return;
  box.textContent = String(message || '');
  box.dataset.type = type;
}

function addDailyRecordUsageFallback(usage, dailyRecords, month) {
  const normalizedType = (value) => ({ new: 'الجديد', newLesson: 'الجديد', old: 'الماضي', oldRevision: 'الماضي', recitation: 'التلاوة' })[String(value || '')] || String(value || '');
  const output = new Map();
  const usageType = (record) => normalizedType(record.quranGradeType || record.type);
  const signatureFor = (record, type) => `${String(record.studentId || '')}|${String(record.dateISO || '').slice(0, 10)}|${type}`;
  const signatures = new Set();

  for (const record of usage || []) {
    const type = usageType(record);
    const signature = signatureFor(record, type);
    if (!signatures.has(signature)) output.set(signature, record);
    signatures.add(signature);
  }

  const { start, end } = monthRange(month);
  for (const record of dailyRecords || []) {
    if (!record || record._deleted) continue;
    const date = String(record.dateISO || '').slice(0, 10);
    if (date < start || date > end) continue;
    const times = record.quranSessionTimeByType && typeof record.quranSessionTimeByType === 'object' ? record.quranSessionTimeByType : {};
    let entries = Object.entries(times).filter(([, seconds]) => Number(seconds) > 0);
    if (!entries.length) {
      entries = [
        ['الجديد', record.newLessonTimeSeconds],
        ['الماضي', record.oldRevisionTimeSeconds],
        ['التلاوة', record.recitationTimeSeconds]
      ].filter(([, seconds]) => Number(seconds) > 0);
    }
    const totalSeconds = Number(record.quranSessionTimeSeconds) || (Number(record.newLessonTimeSeconds) || 0) + (Number(record.oldRevisionTimeSeconds) || 0) + (Number(record.recitationTimeSeconds) || 0);
    const typedTotal = entries.reduce((sum, [, seconds]) => sum + (Number(seconds) || 0), 0);
    const untypedRemainder = Math.max(0, totalSeconds - typedTotal);
    if (untypedRemainder > 0) entries.push(['جلسة', untypedRemainder]);

    for (const [sourceType, seconds] of entries) {
      const type = normalizedType(sourceType);
      const signature = `${String(record.studentId || '')}|${date}|${type}`;
      if (signatures.has(signature)) continue;
      output.set(signature, {
        category: 'quran',
        teacherUsername: record.teacherUsername || 'غير معروف',
        studentId: record.studentId,
        type,
        quranGradeType: type,
        seconds: Number(seconds),
        sessionSeconds: Number(seconds),
        dateISO: date
      });
      signatures.add(signature);
    }
  }
  return [...output.values()];
}

export async function renderWafdeenMonthlyReport() {
  if (!canViewReport()) return notice('تقرير الوافدين الشهري متاح للمدير فقط.', 'error');
  const input = byId('wafdeen-report-month');
  if (input && !input.value) input.value = localDateKey().slice(0, 7);
  const month = String(input?.value || localDateKey().slice(0, 7));
  try {
    const data = await loadWafdeenReportData(month);
    const { start, end } = monthRange(month);
    text('wafdeen-report-period', `الفترة: ${start} إلى ${end}`);
    const rows = aggregateMonthlyQuranUsage(addDailyRecordUsageFallback(data.usage, data.dailyRecords, month), month);
    const body = document.querySelector('#wafdeen-monthly-report-table tbody');
    if (body) {
      body.innerHTML = rows.map((row) => `<tr><td>${escapeHtml(row.teacher)}</td><td>${row.sessions}</td><td>${escapeHtml(formatDuration(row.sessionSeconds))}</td><td>${(row.sessionSeconds / 3000).toFixed(2)}</td><td>${(row.sessionSeconds / 3600).toFixed(2)}</td></tr>`).join('') || '<tr><td colspan="5">لا توجد جلسات تسميع مسجلة خلال هذه الفترة.</td></tr>';
    }
    text('wafdeen-report-count', `${rows.length} شيخًا مسجلًا`);
    notice('تم إنشاء التقرير من حقول الجلسات اللازمة فقط.', 'success');
  } catch (error) {
    console.error('[wafdeen-report] monthly report failed', error);
    notice(error?.message || 'تعذر تحميل التقرير الشهري.', 'error');
  }
}

function exportMonthlyReport() {
  const table = byId('wafdeen-monthly-report-table');
  const month = String(byId('wafdeen-report-month')?.value || localDateKey().slice(0, 7));
  if (!table || !table.querySelector('tbody tr')) return notice('لا توجد بيانات لتصديرها.', 'error');
  if (!window.XLSX?.utils?.table_to_book) return notice('ميزة تصدير Excel غير متاحة الآن.', 'error');
  const workbook = window.XLSX.utils.table_to_book(table, { sheet: 'التقرير الشهري الوقتي' });
  window.XLSX.writeFile(workbook, `تقرير_الوافدين_الشهري_الوقتي_${month}.xlsx`);
}

function updateNavigation() {
  const visible = canViewReport();
  byId('wafdeen-monthly-report-tab-btn')?.classList.toggle('hidden', !visible);
  byId('wafdeen-monthly-report-tab')?.classList.toggle('hidden', !visible);
}

function openTab(tabId) {
  if (!canViewReport()) return notice('تقرير الوافدين الشهري متاح للمدير فقط.', 'error');
  const button = byId(tabId === 'wafdeen-monthly-report-tab' ? 'wafdeen-monthly-report-tab-btn' : 'sheikh-registration-tab-btn');
  window.switchTab?.(tabId, { currentTarget: button, target: button });
}

function installReportHandlers() {
  const report = byId('wafdeen-monthly-report-tab');
  if (!report || report.dataset.wafdeenReportBound === 'true') return;
  report.dataset.wafdeenReportBound = 'true';
  report.addEventListener('change', (event) => {
    if (event.target.id === 'wafdeen-report-month') renderWafdeenMonthlyReport();
  });
  report.addEventListener('click', (event) => {
    if (event.target.closest('#wafdeen-report-refresh')) renderWafdeenMonthlyReport();
    if (event.target.closest('#wafdeen-report-export')) exportMonthlyReport();
  });
}

function installNavigationGuards() {
  if (typeof window.showAppScreen === 'function' && !window.showAppScreen.__wafdeenReportWrapped) {
    const original = window.showAppScreen;
    const wrapped = function (...args) {
      const result = original.apply(this, args);
      updateNavigation();
      return result;
    };
    wrapped.__wafdeenReportWrapped = true;
    window.showAppScreen = wrapped;
  }
  if (typeof window.switchTab === 'function' && !window.switchTab.__wafdeenReportWrapped) {
    const original = window.switchTab;
    const wrapped = function (tabId, event) {
      if (tabId === 'wafdeen-monthly-report-tab' && !canViewReport()) return notice('تقرير الوافدين الشهري متاح للمدير فقط.', 'error');
      const result = original.apply(this, arguments);
      if (tabId === 'wafdeen-monthly-report-tab') {
        byId('sheikh-recordings-menu-wrap')?.classList.add('open');
        byId('sheikh-recordings-menu-btn')?.classList.add('active');
        Promise.resolve(window.MajdApp?.loadFeature(tabId)).then(() => renderWafdeenMonthlyReport()).catch((error) => {
          console.error('[wafdeen-report] tab open failed', error);
          notice(error?.message || 'تعذر فتح التقرير الشهري.', 'error');
        });
      }
      return result;
    };
    wrapped.__wafdeenReportWrapped = true;
    window.switchTab = wrapped;
  }
}

window.renderWafdeenMonthlyReport = renderWafdeenMonthlyReport;
window.openWafdeenMonthlyReport = () => openTab('wafdeen-monthly-report-tab');
window.refreshWafdeenNavigation = updateNavigation;
installReportHandlers();
installNavigationGuards();
updateNavigation();
registerFeature('wafdeen-report', ['renderWafdeenMonthlyReport']);
