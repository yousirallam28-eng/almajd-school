import { studentsApi } from '../../api/domain.apis.js';
import { registerFeature } from '../register.js';
registerFeature('admin', ['renderTeachersTable', 'renderStudentsTable', 'renderClassCards', 'renderResultsAdminSummary']);
export { studentsApi };
