import { recordsApi } from '../../api/domain.apis.js';
import { registerFeature } from '../register.js';
registerFeature('sheikh-recordings', ['renderSheikhRegistrationView', 'renderWafdeenTimeReport']);
export { recordsApi };
