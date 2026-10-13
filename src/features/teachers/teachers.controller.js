import { addTeacherRecord, editTeacherRecord, removeTeacherRecord } from './teachers.service.js';

const $ = (id) => document.getElementById(id);
const value = (id) => $(id)?.value?.trim() || '';
const checked = (id) => Boolean($(id)?.checked);
const data = () => Array.isArray(window.teachersData) ? window.teachersData : [];
const isAdmin = () => window.currentTeacher?.username === 'admin';
const notify = (message, type = 'error') => window.showMessage?.('app-msg', message, type);
const error = (message) => window.showSiteError?.(message) || notify(message);
const persist = () => window.memoryStorage?.setItem('teachersData', JSON.stringify(data()));
const refresh = () => {
  renderTeachersTable();
  window.renderClassCards?.();
};

function escapeHtml(input) {
  return String(input ?? '').replace(/[&<>"']/g, (char) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'
  })[char]);
}

function findTeacher(id) {
  return data().find((teacher) => String(teacher.id) === String(id));
}

export async function editTeacher(id) {
  if (!isAdmin()) return;
  const teacher = findTeacher(id);
  if (!teacher) return;
  const result = await window.openTeacherEditModal?.(teacher);
  if (!result) return;
  if (data().some((item) => String(item.id) !== String(id) && item.username === result.username)) {
    return error('اسم المستخدم موجود بالفعل لمعلم آخر.');
  }
  const updated = { ...teacher, ...result, canWafdeen: Boolean(result.canWafdeen) };
  try {
    const saved = await editTeacherRecord(id, updated);
    const index = data().findIndex((item) => String(item.id) === String(id));
    if (index >= 0) data()[index] = { ...updated, ...(saved || {}), updatedAt: new Date().toISOString() };
    persist();
    refresh();
    notify('تم تعديل بيانات المعلم بنجاح', 'success');
  } catch (cause) {
    console.error('[teachers] update failed', cause);
    error('تعذر حفظ تعديل المعلم.');
  }
}

export async function addTeacher() {
  if (!isAdmin()) return;
  const teacher = {
    id: Date.now().toString(),
    username: value('newTeacherUser'),
    password: value('newTeacherPass'),
    assignedClass: $('newTeacherClass')?.value || '',
    center: $('newTeacherCenter')?.value || '',
    canWafdeen: checked('newTeacherWafdeen'),
    updatedAt: new Date().toISOString()
  };
  if (!teacher.username || !teacher.password) return notify('يرجى إدخال البيانات كاملة', 'error');
  if (data().some((item) => item.username === teacher.username)) return notify('اسم المستخدم موجود مسبقاً', 'error');
  try {
    const saved = await addTeacherRecord(teacher);
    data().push({ ...teacher, ...(saved || {}) });
    persist();
    refresh();
    notify('تم إضافة المعلم/المعلمة بنجاح', 'success');
    if ($('newTeacherUser')) $('newTeacherUser').value = '';
    if ($('newTeacherPass')) $('newTeacherPass').value = '';
    if ($('newTeacherWafdeen')) $('newTeacherWafdeen').checked = false;
  } catch (cause) {
    console.error('[teachers] create failed', cause);
    notify(cause.message || 'تعذر رفع المعلم إلى السحابة. أعد تسجيل الدخول وحاول مرة أخرى.', 'error');
  }
}

export function renderTeachersTable() {
  const tbody = document.querySelector('#teachersTable tbody');
  if (!tbody) return;
  tbody.innerHTML = data().map((teacher) => {
    const id = escapeHtml(teacher.id);
    const actions = teacher.username === 'admin'
      ? '<span style="color:gray;">مدير النظام الرئيسي</span>'
      : `<button type="button" class="action-btn btn-edit" style="padding:3px 8px; min-width:auto;" onclick="editTeacher('${id}')">تعديل</button> <button type="button" class="action-btn btn-danger" style="padding:3px 8px; min-width:auto;" onclick="deleteTeacher('${id}')">حذف</button>`;
    return `<tr><td style="font-weight:bold;">${escapeHtml(teacher.username)}</td><td title="كلمة المرور مخفية لأسباب أمنية">••••••</td><td>${escapeHtml(teacher.assignedClass)}</td><td>${teacher.canWafdeen ? '✅ مسموح' : '—'}</td><td>${escapeHtml(teacher.center)}</td><td>${actions}</td></tr>`;
  }).join('');
}

export async function deleteTeacher(id) {
  if (!isAdmin()) return;
  const teacher = findTeacher(id);
  if (!teacher) return;
  if (teacher.username === 'admin') return notify('لا يمكن حذف حساب المدير الرئيسي', 'error');
  const confirmed = await window.siteConfirm?.('🗑️ حذف المعلم / المعلمة', `سيتم حذف حساب <strong>${escapeHtml(teacher.username)}</strong> نهائياً من قائمة المعلمين.`, 'حذف الحساب', true);
  if (!confirmed) return;
  try {
    await removeTeacherRecord(id);
    window.teachersData = data().filter((item) => String(item.id) !== String(id));
    persist();
    refresh();
    notify('تم حذف المعلم بنجاح', 'success');
  } catch (cause) {
    console.error('[teachers] delete failed', cause);
    error('تعذر حذف المعلم.');
  }
}

export function installTeachersFeature() {
  window.addTeacher = addTeacher;
  window.editTeacher = editTeacher;
  window.deleteTeacher = deleteTeacher;
  window.renderTeachersTable = renderTeachersTable;
  window.MajdApp = Object.freeze({ ...(window.MajdApp || {}), teachersFeature: { addTeacher, editTeacher, deleteTeacher, renderTeachersTable } });
  renderTeachersTable();
}
