import { studentsApi } from '../../api/domain.apis.js';
import { registerFeature } from '../register.js';
registerFeature('students', ['renderStudentsTable', 'editStudent', 'deleteStudent']);
export { studentsApi };
