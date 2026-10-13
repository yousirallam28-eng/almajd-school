import { installTeachersFeature } from './teachers.controller.js';

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', installTeachersFeature, { once: true });
} else {
  installTeachersFeature();
}
