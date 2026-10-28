import { notesApi } from '../../api/domain.apis.js';
import { registerFeature } from '../register.js';
registerFeature('notes', ['renderNotesTable', 'populateNotesClasses', 'updateNotesStudentList']);
export { notesApi };
