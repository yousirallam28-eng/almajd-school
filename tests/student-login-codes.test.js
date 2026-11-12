import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const sourceFiles = [
  new URL('../legacy/js/js__features__main-application.js', import.meta.url),
  new URL('../public/legacy/js/js__features__main-application.js', import.meta.url)
];

function getPersistFunction(source, context) {
  const start = source.indexOf('function persistStudentLoginCodes(');
  const end = source.indexOf('function persistChangedStudentLoginCodes(', start);
  assert.notEqual(start, -1, 'student-code cloud uploader must exist');
  assert.notEqual(end, -1, 'change-tracking wrapper must follow cloud uploader');
  vm.createContext(context);
  vm.runInContext(source.slice(start, end), context);
  return context.persistStudentLoginCodes;
}

for (const fileUrl of sourceFiles) {
  const fileName = fileUrl.pathname.includes('/public/') ? 'published asset' : 'source asset';

  test(`${fileName}: existing student codes upload to the cloud`, async () => {
    const writes = [];
    const context = {
      currentTeacher: { username: 'admin' },
      window: {
        MajdLocalDataAPI: {
          isAvailable: () => true,
          writeRecord: async (...args) => { writes.push(args); return { saved: true }; }
        }
      }
    };
    const persist = getPersistFunction(readFileSync(fileUrl, 'utf8'), context);
    const count = await persist([
      { id: '1', loginCode: 'ABC234' },
      { id: '2', loginCode: '' },
      { loginCode: 'XYZ789' }
    ]);
    assert.equal(count, 1);
    assert.equal(JSON.stringify(writes), JSON.stringify([[ 'students', '1', { id: '1', loginCode: 'ABC234' }, { merge: true } ]]));
  });

  test(`${fileName}: cloud upload failures are not reported as successful saves`, async () => {
    const context = {
      currentTeacher: { username: 'admin' },
      window: {
        MajdLocalDataAPI: {
          isAvailable: () => true,
          writeRecord: async () => { throw new Error('offline'); }
        }
      }
    };
    const persist = getPersistFunction(readFileSync(fileUrl, 'utf8'), context);
    await assert.rejects(persist([{ id: '1', loginCode: 'ABC234' }]), /offline/);
  });
}
