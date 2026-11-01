// Persistent progress store. localStorage key `pocket.v1`; every access is guarded.
const KEY = 'pocket.v1';
let now = () => new Date();
const subs = new Set();

/** Test hook: override the clock. Pass nothing to restore. */
export function _setNow(fn) { now = fn || (() => new Date()); }

const pad = (n) => String(n).padStart(2, '0');
export function dateKey(d = now()) { return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`; }
function shift(d, days) { const x = new Date(d); x.setDate(x.getDate() + days); return x; }

function defaults() {
  return {
    version: 1, startUnit: 1, placementDone: false, completed: {}, ear: {}, missed: {},
    streak: { last: '', days: 0 }, practice: {}, lastBackup: '',
    settings: { a4: 440, leftHanded: false, theme: 'system' },
  };
}

function normalize(o) {
  const d = defaults();
  if (!o || typeof o !== 'object') return d;
  return {
    ...d, ...o, version: 1,
    completed: { ...(o.completed || {}) }, ear: { ...(o.ear || {}) }, missed: { ...(o.missed || {}) }, practice: { ...(o.practice || {}) },
    streak: { ...d.streak, ...(o.streak || {}) }, settings: { ...d.settings, ...(o.settings || {}) },
  };
}

const ls = () => { try { return globalThis.localStorage || null; } catch { return null; } };

function load() {
  try {
    const raw = ls()?.getItem(KEY);
    if (raw) return normalize(JSON.parse(raw));
  } catch { /* corrupt or blocked storage: start fresh */ }
  return defaults();
}

let state = load();

function save() { try { ls()?.setItem(KEY, JSON.stringify(state)); } catch { /* storage full or blocked */ } }
function emit() { for (const fn of subs) { try { fn(state); } catch { /* subscriber bug must not break store */ } } }

export const get = () => state;
export function update(fn) { fn(state); save(); emit(); return state; }
export function subscribe(fn) { subs.add(fn); return () => subs.delete(fn); }

function touchStreak(s) {
  const today = dateKey();
  if (s.streak.last === today) return;
  s.streak.days = s.streak.last === dateKey(shift(now(), -1)) ? s.streak.days + 1 : 1;
  s.streak.last = today;
}

/** Streak to display: 0 once a full day has been missed. */
export function currentStreak() {
  const { last, days } = state.streak;
  return last === dateKey() || last === dateKey(shift(now(), -1)) ? days : 0;
}

export function completeLesson(id) {
  return update((s) => { if (!s.completed[id]) s.completed[id] = dateKey(); touchStreak(s); });
}

/** right: boolean for one round (true = correct). Counts a round in `total`. */
export function logEar(mode, right) {
  return update((s) => {
    const e = s.ear[mode] || (s.ear[mode] = { right: 0, total: 0 });
    e.total += 1; if (right) e.right += 1;
    touchStreak(s);
  });
}

/** Spaced-review bookkeeping: wrong adds a miss, right pays one off (deleted at 0). */
export function logQuiz(key, right) {
  return update((s) => {
    const n = (s.missed[key] || 0) + (right ? -1 : 1);
    if (n > 0) s.missed[key] = n; else delete s.missed[key];
  });
}

export function logPractice(min) {
  return update((s) => {
    const k = dateKey();
    s.practice[k] = (s.practice[k] || 0) + Math.max(0, Number(min) || 0);
    touchStreak(s);
  });
}

/** Practice minutes over the last 7 days including today. */
export function weekMinutes() {
  let sum = 0;
  for (let i = 0; i < 7; i++) sum += state.practice[dateKey(shift(now(), -i))] || 0;
  return sum;
}

/** Record that the user just exported a backup. */
export function markBackedUp() { return update((s) => { s.lastBackup = dateKey(); }); }

export function exportJson() { return JSON.stringify(state, null, 2); }

/** Throws Error on bad input; on success replaces state and returns it. */
export function importJson(str) {
  let o;
  try { o = JSON.parse(str); } catch { throw new Error('That is not valid JSON.'); }
  if (!o || typeof o !== 'object' || Array.isArray(o) || o.version !== 1) throw new Error('This is not a Pocket backup (version 1).');
  state = normalize(o);
  save(); emit();
  return state;
}

/** Re-read from localStorage (tests, or after another tab wrote). */
export function reload() { state = load(); emit(); return state; }
export function reset() { state = defaults(); save(); emit(); return state; }
