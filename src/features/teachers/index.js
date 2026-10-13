import { registerFeature } from '../register.js';

// تبقى وظائف المعلمين القديمة هي المسؤولة عن الإضافة والتعديل والحذف
// إلى أن تكتمل مطابقة طبقة API الجديدة مع جلسة السحابة الحالية.
registerFeature('teachers', [
  'addTeacher',
  'editTeacher',
  'deleteTeacher',
  'renderTeachersTable'
]);
