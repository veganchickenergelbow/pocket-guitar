import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { UNITS, getLesson, allLessons, getNextLesson } from '../js/content/curriculum.js';
import { INTERVAL_SEMIS, PROGRESSIONS, isValidOption, stackPcs } from '../js/exercises/ear-data.js';

const BLOCKS = new Set(['text', 'chords', 'fretboard', 'listen', 'exercise', 'tip']);
const KINDS = new Set(['find-note', 'sequence', 'chord-arp', 'ear', 'quiz', 'progression']);
const REF = /^[A-Za-z#0-9_]+(@[A-G][b#]?)?$/;
const NOTE = /^[A-G][b#]?-?\d$/;
const PC = /^[A-G][b#]?$/;

const exercises = [];
const refs = [];
for (const l of allLessons()) {
  l.blocks.forEach((b) => {
    if (b.type === 'exercise') exercises.push([l.id, b.spec]);
    if (b.type === 'chords' || (b.type === 'listen' && b.refs)) b.refs.forEach((r) => refs.push([l.id, r]));
  });
}
exercises.forEach(([id, s]) => { if (s.ref) refs.push([id, s.ref]); if (s.refs) s.refs.forEach((r) => refs.push([id, r])); });

test('every unit lesson id exists and matches its unit', () => {
  for (const u of UNITS) {
    assert.ok(u.lessons.length > 0, `unit ${u.id} empty`);
    for (const id of u.lessons) {
      const l = getLesson(id);
      assert.ok(l, `missing lesson ${id}`);
      assert.equal(l.unit, u.id, `${id} unit mismatch`);
    }
  }
  assert.equal(new Set(allLessons().map((l) => l.id)).size, allLessons().length, 'duplicate lesson ids');
  assert.equal(allLessons().length, 54);
});

test('lessons have required fields and sane minutes', () => {
  for (const l of allLessons()) {
    assert.ok(l.title && l.summary, l.id);
    assert.ok(l.minutes >= 5 && l.minutes <= 14, `${l.id} minutes`);
    assert.ok(l.blocks.length > 0, l.id);
  }
});

test('block types and exercise kinds are known', () => {
  for (const l of allLessons()) {
    for (const b of l.blocks) {
      assert.ok(BLOCKS.has(b.type), `${l.id}: block ${b.type}`);
      if (b.type === 'text' || b.type === 'tip') assert.equal(typeof b.md, 'string');
    }
  }
  for (const [id, s] of exercises) {
    assert.ok(KINDS.has(s.kind), `${id}: kind ${s.kind}`);
    const file = fileURLToPath(new URL(`../js/exercises/${s.kind}.js`, import.meta.url));
    assert.ok(existsSync(file), `${s.kind}.js missing`);
  }
});

test('voicing ref strings are well formed', () => {
  assert.ok(refs.length > 50);
  for (const [id, r] of refs) assert.match(r, REF, `${id}: ${r}`);
});

test('notes and exercise specs parse', () => {
  for (const [id, s] of exercises) {
    if (s.kind === 'sequence') s.notes.forEach((n) => assert.match(n, NOTE, `${id}: ${n}`));
    if (s.kind === 'find-note') {
      assert.ok(s.string === 0 || s.string === 1);
      if (Array.isArray(s.notes)) s.notes.forEach((n) => assert.match(n, PC, `${id}: ${n}`));
    }
    if (s.kind === 'quiz') {
      for (const q of s.questions) {
        assert.ok(q.answer >= 0 && q.answer < q.options.length, `${id}: ${q.q}`);
        assert.ok(q.explain, `${id}: explain`);
      }
    }
    if (s.kind === 'ear') {
      assert.ok(['interval', 'quality', 'progression'].includes(s.mode));
      s.options.forEach((o) => assert.ok(isValidOption(s.mode, o), `${id}: ${o}`));
    }
    if (s.kind === 'progression') assert.ok(s.refs.length > 0 && s.bpm > 0 && s.beatsPerChord > 0);
  }
  for (const l of allLessons()) {
    for (const b of l.blocks) {
      if (b.type === 'listen') assert.ok(b.refs || Array.isArray(b.midis), `${l.id}: listen needs refs or midis`);
      if (b.type === 'fretboard') {
        for (const m of b.marks) {
          assert.ok(m.string >= 0 && m.string <= 5 && Number.isInteger(m.fret), `${l.id} mark`);
          assert.ok(['root', 'tone', 'target', 'ghost'].includes(m.kind), `${l.id} kind`);
        }
      }
    }
  }
});

test('ear data is consistent', () => {
  assert.equal(INTERVAL_SEMIS.P5, 7);
  assert.ok(Object.keys(PROGRESSIONS).length >= 8);
  assert.deepEqual(stackPcs([0, 4, 7], 48), [48, 52, 55]);
  assert.deepEqual(stackPcs([7, 11, 2], 43), [43, 47, 50]);
});

test('getNextLesson respects startUnit and completion', () => {
  assert.equal(getNextLesson({ startUnit: 1, completed: {} }).id, 'u1l1');
  assert.equal(getNextLesson({ startUnit: 3, completed: {} }).id, 'u3l1');
  assert.equal(getNextLesson({ startUnit: 1, completed: { u1l1: 'x' } }).id, 'u1l2');
  const all = Object.fromEntries(allLessons().map((l) => [l.id, 'x']));
  assert.equal(getNextLesson({ startUnit: 1, completed: all }), null);
});

test('every ref resolves with resolveVoicing (skipped if music module missing)', async (t) => {
  let mod;
  try { mod = await import('../js/music/voicings.js'); } catch { t.skip('voicings.js not available'); return; }
  for (const [id, r] of refs) {
    assert.doesNotThrow(() => {
      const v = mod.resolveVoicing(r);
      assert.ok(v && v.frets && v.frets.length === 6, 'no frets');
    }, `${id}: ${r}`);
  }
});
