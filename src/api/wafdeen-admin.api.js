function getBridge(methodName) {
  const api = globalThis.window?.MajdLocalDataAPI;
  if (!api || typeof api.isAvailable !== 'function' || !api.isAvailable() || typeof api[methodName] !== 'function') {
    throw new Error('إدارة الوافدين غير متاحة؛ أعد تسجيل الدخول وحاول مرة أخرى.');
  }
  return api;
}
function text(value) {
  return String(value ?? '').trim();
}
export async function addWafdeenStudent(studentName) {
  const name = text(studentName).replace(/\s+/g, ' ');
  if (!name || name.length > 200) throw new Error('اكتب اسم طالب صالحًا.');
  const result = await getBridge('addWafdeenStudent').addWafdeenStudent(name);
  if (!result?.student?.studentId || !result.student.studentName) throw new Error('لم يؤكد الخادم إضافة الطالب.');
  return {
    id: text(result.student.studentId),
    name: text(result.student.studentName),
    className: text(result.student.className)
  };
}
export async function listWafdeenTeachers() {
  const result = await getBridge('listWafdeenTeachers').listWafdeenTeachers();
  if (!Array.isArray(result)) throw new Error('استجابة قائمة المعلمين غير صالحة.');
  return result.map((teacher) => ({
    id: text(teacher?.id),
    username: text(teacher?.username),
    assignedClass: text(teacher?.assignedClass),
    center: text(teacher?.center),
    canWafdeen: teacher?.canWafdeen === true || teacher?.canWafdeen === 1
  })).filter((teacher) => teacher.id && teacher.username);
}
export async function createWafdeenTeacher(input) {
  const teacher = {
    username: text(input?.username),
    password: String(input?.password || ''),
    assignedClass: text(input?.assignedClass),
    center: text(input?.center)
  };
  if (!teacher.username || !teacher.password || !teacher.assignedClass || !teacher.center) {
    throw new Error('أكمل اسم المستخدم وكلمة المرور والصف والمركز.');
  }
  const result = await getBridge('createWafdeenTeacher').createWafdeenTeacher(teacher);
  if (!result?.teacher?.id || result.teacher.canWafdeen !== true) throw new Error('لم يؤكد الخادم إضافة المعلم.');
  return {
    id: text(result.teacher.id),
    username: text(result.teacher.username),
    assignedClass: text(result.teacher.assignedClass),
    center: text(result.teacher.center),
    canWafdeen: true
  };
}
