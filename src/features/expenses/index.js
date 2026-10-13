import { paymentsApi } from '../../api/domain.apis.js';
import { registerFeature } from '../register.js';
registerFeature('expenses', ['populatePaymentsClasses', 'renderPaymentReportTable', 'renderTotalExpenses_']);
export { paymentsApi };
