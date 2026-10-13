export function byId(id) { return document.getElementById(id); }
export function setText(id, text) { const element = byId(id); if (element) element.textContent = text ?? ''; return element; }
export function escapeHtml(value) { return String(value ?? '').replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' })[char]); }
export function renderRows(tbody, rows, emptyMessage = 'لا توجد بيانات') {
  if (!tbody) return;
  tbody.replaceChildren();
  if (!rows.length) { const row = document.createElement('tr'); row.innerHTML = `<td colspan="99">${escapeHtml(emptyMessage)}</td>`; tbody.append(row); return; }
  const fragment = document.createDocumentFragment();
  rows.forEach((html) => { const row = document.createElement('tr'); row.innerHTML = html; fragment.append(row); });
  tbody.append(fragment);
}
