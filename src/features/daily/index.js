import { recordsApi } from '../../api/domain.apis.js';
import { registerFeature } from '../register.js';
registerFeature('daily', ['renderDailyTable', 'renderAttendanceTable', 'renderClassStatusTable']);
export { recordsApi };
