import test from 'node:test';
import assert from 'node:assert/strict';

const mem = new Map();
globalThis.localStorage = {
  getItem: (k) => (mem.has(k) ? mem.get(k) : null),
  setItem: (k, v) => { mem.set(k, String(v)); },
  removeItem: (k) => { mem.delete(k); },
};
const store = await import('../js/store.js');

const at = (iso) => store._setNow(() => new Date(`${iso}T12:00:00`));
const fresh = () => { mem.clear(); store.reset(); };

test('streak: first activity starts at 1, same day does not double count', () => {
  fresh(); at('2026-03-01');
  store.logPractice(5); store.logEar('quality', true); store.completeLesson('u1l1');
  assert.equal(store.get().streak.days, 1);
  assert.equal(store.get().streak.last, '2026-03-01');
});

test('streak: consecutive days grow, a gap resets', () => {
  fresh();
  at('2026-03-01'); store.logPractice(5);
  at('2026-03-02'); store.logPractice(5);
  at('2026-03-03'); store.logPractice(5);
  assert.equal(store.get().streak.days, 3);
  at('2026-03-05'); // missed the 4th
  assert.equal(store.currentStreak(), 0);
  store.logPractice(5);
  assert.equal(store.get().streak.days, 1);
});

test('streak: month and DST-ish boundaries count as consecutive', () => {
  fresh();
  at('2026-02-28'); store.logPractice(1);
  at('2026-03-01'); store.logPractice(1);
  at('2026-03-08'); assert.equal(store.currentStreak(), 0);
  at('2026-03-02'); assert.equal(store.currentStreak(), 2);
});

test('currentStreak still shows yesterday streak before practicing today', () => {
  fresh();
  at('2026-03-01'); store.logPractice(1);
  at('2026-03-02'); assert.equal(store.currentStreak(), 1);
});

test('completeLesson records first completion date and keeps it', () => {
  fresh(); at('2026-04-10');
  store.completeLesson('u3l2');
  at('2026-04-12');
  store.completeLesson('u3l2');
  assert.deepEqual(Object.keys(store.get().completed), ['u3l2']);
  assert.equal(store.get().completed.u3l2, '2026-04-10');
});

test('logEar accumulates right/total per mode', () => {
  fresh(); at('2026-04-10');
  store.logEar('interval', true); store.logEar('interval', false); store.logEar('quality', true);
  assert.deepEqual(store.get().ear.interval, { right: 1, total: 2 });
  assert.deepEqual(store.get().ear.quality, { right: 1, total: 1 });
});

test('logPractice sums minutes per day and weekMinutes spans 7 days', () => {
  fresh();
  at('2026-04-01'); store.logPractice(10); // outside the window by the 8th
  at('2026-04-05'); store.logPractice(10); store.logPractice(5);
  at('2026-04-08');
  assert.equal(store.get().practice['2026-04-05'], 15);
  assert.equal(store.weekMinutes(), 15);
});

test('subscribe notifies and unsubscribes', () => {
  fresh(); at('2026-04-10');
  let n = 0; const off = store.subscribe(() => { n++; });
  store.logPractice(1); off(); store.logPractice(1);
  assert.equal(n, 1);
});

test('state persists to localStorage and reload restores it', () => {
  fresh(); at('2026-04-10');
  store.completeLesson('u1l1');
  assert.ok(mem.get('pocket.v1').includes('u1l1'));
  store.reload();
  assert.ok(store.get().completed.u1l1);
});

test('export/import round trip', () => {
  fresh(); at('2026-05-01');
  store.update((s) => { s.startUnit = 3; s.placementDone = true; s.settings.a4 = 442; });
  store.completeLesson('u1l1'); store.logEar('interval', true); store.logPractice(12);
  const json = store.exportJson();
  const before = JSON.parse(json);
  store.reset();
  assert.equal(store.get().startUnit, 1);
  store.importJson(json);
  assert.deepEqual(JSON.parse(store.exportJson()), before);
  assert.equal(store.get().settings.a4, 442);
});

test('importJson rejects garbage and wrong versions without touching state', () => {
  fresh(); at('2026-05-01'); store.completeLesson('u1l1');
  assert.throws(() => store.importJson('nope'), /valid JSON/);
  assert.throws(() => store.importJson('{"version":2}'), /not a Pocket backup/);
  assert.throws(() => store.importJson('[]'), /not a Pocket backup/);
  assert.ok(store.get().completed.u1l1);
});

test('importJson fills missing fields with defaults', () => {
  fresh();
  store.importJson('{"version":1,"startUnit":4}');
  assert.equal(store.get().startUnit, 4);
  assert.equal(store.get().settings.a4, 440);
  assert.deepEqual(store.get().completed, {});
});
