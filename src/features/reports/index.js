import { reportsApi } from '../../api/domain.apis.js';
import { registerFeature } from '../register.js';
registerFeature('reports', ['renderWeeklyTable', 'renderWeeklySheetTable', 'renderMonthlyReport', 'renderManagerView', 'renderTopStudents', 'renderStudentDataAnalysis']);
export { reportsApi };
