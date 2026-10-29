import { isAllowedWafdeenStandaloneOperation } from './standalone-policy.js';

const asText = (value) => String(value ?? '').trim();

export function createWafdeenStandaloneBridge(request, isAvailable = () => true) {
  if (typeof request !== 'function') throw new TypeError('A request function is required.');

  const invoke = (body) => {
    if (!isAllowedWafdeenStandaloneOperation(body)) {
      return Promise.reject(new Error('WAFDEEN_FEATURE_DISABLED'));
    }
    return request(body);
  };

  return Object.freeze({
    isAvailable: () => Boolean(isAvailable()),
    listWafdeenSessionData(options) {
      if (options?.purpose !== 'daily') {
        return Promise.reject(new Error('WAFDEEN_REPORT_UNAVAILABLE'));
      }
      return invoke({ op: 'listWafdeenSessionData', purpose: 'daily' });
    },
    createWafdeenSession(session) {
      return invoke({
        op: 'createWafdeenSession',
        session: {
          studentId: asText(session?.studentId),
          studentName: asText(session?.studentName),
          dateISO: asText(session?.dateISO),
          gradeType: asText(session?.gradeType),
          pages: asText(session?.pages),
          topic: asText(session?.topic),
          errors: Number(session?.errors) || 0,
          tashkeel: Number(session?.tashkeel) || 0,
          repetition: Number(session?.repetition) || 0,
          sessionSeconds: Number(session?.sessionSeconds) || 0
        }
      });
    },
    addWafdeenStudent(studentName) {
      return invoke({ op: 'addWafdeenStudent', studentName: asText(studentName) });
    },
    listWafdeenTeachers() {
      return invoke({ op: 'listWafdeenTeachers' });
    },
    createWafdeenTeacher(teacher) {
      return invoke({
        op: 'createWafdeenTeacher',
        teacher: {
          username: asText(teacher?.username),
          password: String(teacher?.password ?? ''),
          assignedClass: asText(teacher?.assignedClass),
          center: asText(teacher?.center)
        }
      });
    }
  });
}
