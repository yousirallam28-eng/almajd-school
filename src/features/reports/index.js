import { reportsApi } from '../../api/domain.apis.js';
import { registerFeature } from '../register.js';
registerFeature('reports', ['renderWeeklyTable', 'renderMonthlyReport', 'renderManagerView', 'renderTopStudents', 'renderStudentDataAnalysis']);
export { reportsApi };
