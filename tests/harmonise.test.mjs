import test from 'node:test';
import assert from 'node:assert/strict';
import { makeQuestion, keyDegrees, KEYS, spell, chordMidis } from '../js/music/harmonise.js';
import { chordPcs, pc } from '../js/music/theory.js';

const seeded = (s) => () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 2 ** 32; };
const N = 600;
const qs = (() => { const r = seeded(42); return Array.from({ length: N }, () => makeQuestion(r)); })();
const keyOf = (p) => /[Ii]n ([A-G]) major/.exec(p)[1];
const rootOf = (name) => /^[A-G][#b]*/.exec(name)[0];
const SUFFIX = { '': 'maj', m: 'min' };

test('every question has 4 unique options and exactly one correct answer index', () => {
  for (const q of qs) {
    assert.equal(q.options.length, 4, q.prompt);
    assert.equal(new Set(q.options).size, 4, q.prompt);
    assert.ok(Number.isInteger(q.answer) && q.answer >= 0 && q.answer < 4);
    assert.ok(q.prompt && q.explain);
  }
});

test('all three types and all six keys show up; answer position varies', () => {
  assert.deepEqual(new Set(qs.map((q) => q.type)), new Set(['fits', 'upgrade', 'approach']));
  assert.deepEqual(new Set(qs.map((q) => keyOf(q.prompt))), new Set(KEYS.map((k) => k.name)));
  assert.equal(new Set(qs.map((q) => q.answer)).size, 4);
});

test('play data is midi arrays in a playable register', () => {
  for (const q of qs) {
    for (const side of [q.play.before, q.play.after]) {
      assert.ok(side.length >= 1);
      for (const c of side) for (const m of c) assert.ok(Number.isInteger(m) && m >= 44 && m <= 82, `${m}`);
    }
  }
});

test('fits: the answer contains the note, the distractors do not, no vii dim', () => {
  const f = qs.filter((q) => q.type === 'fits');
  assert.ok(f.length > 100);
  for (const q of f) {
    const [, note, keyName] = /note ([A-G][#b]?) in ([A-G]) major/.exec(q.prompt);
    const notePc = pc(note);
    const has = (name) => {
      const root = rootOf(name);
      const quality = SUFFIX[name.slice(root.length)];
      assert.ok(quality, `no dim or odd suffix: ${name}`);
      return chordPcs(pc(root), quality).includes(notePc);
    };
    q.options.forEach((o, i) => assert.equal(has(o), i === q.answer, `${q.prompt} ${o}`));
    const names = keyDegrees(KEYS.find((k) => k.name === keyName)).map((d) => d.name);
    q.options.forEach((o) => assert.ok(names.includes(rootOf(o))));
  }
});

test('spelling: F major uses Bb, sharp keys use sharps', () => {
  const names = (n) => keyDegrees(KEYS.find((k) => k.name === n)).map((d) => d.name);
  assert.deepEqual(names('F'), ['F', 'G', 'A', 'Bb', 'C', 'D', 'E']);
  assert.deepEqual(names('E'), ['E', 'F#', 'G#', 'A', 'B', 'C#', 'D#']);
  assert.deepEqual(names('A'), ['A', 'B', 'C#', 'D', 'E', 'F#', 'G#']);
  assert.equal(spell(1, 1), 'Db');
  for (const q of qs.filter((x) => keyOf(x.prompt) === 'F')) {
    const text = q.prompt + q.options.join(' ') + q.explain;
    assert.ok(!/A#/.test(text), text);
  }
  assert.ok(qs.some((q) => keyOf(q.prompt) === 'F' && /Bb/.test(q.options.join(' '))));
});

test('upgrade: correct option is a job-keeping quality, wrong ones never are', () => {
  const GOOD = { I: ['maj7', 'maj9', 'add9'], ii: ['m7', 'm9'], IV: ['maj7', 'maj7#11'], V: ['7', '9', '13', '9sus4'], vi: ['m7', 'm9'] };
  const u = qs.filter((q) => q.type === 'upgrade');
  assert.ok(u.length > 100);
  const seen = new Set();
  for (const q of u) {
    const [, triad, roman] = /^(\S+) is the (\S+) chord/.exec(q.prompt);
    const root = rootOf(triad);
    const suffix = (o) => { assert.equal(rootOf(o), root, 'same root'); return o.slice(root.length); };
    q.options.forEach((o, i) => {
      assert.equal(GOOD[roman].includes(suffix(o)), i === q.answer, `${q.prompt} ${o}`);
    });
    seen.add(roman);
  }
  assert.deepEqual(seen, new Set(['I', 'ii', 'IV', 'V', 'vi']));
});

test('approach: secondary dominant root is a P5 above target; half-step answer is a semitone above I', () => {
  const a = qs.filter((q) => q.type === 'approach');
  assert.ok(a.length > 100);
  let sec = 0; let half = 0;
  for (const q of a) {
    const ans = q.options[q.answer];
    q.options.forEach((o) => assert.ok(/^[A-G][#b]*7$/.test(o), o));
    const target = /into (\S+)\?/.exec(q.prompt)[1];
    const tPc = pc(rootOf(target));
    const aPc = pc(rootOf(ans));
    if (/half step/.test(q.prompt)) {
      half++;
      assert.ok(/maj7$/.test(target));
      assert.equal((aPc - tPc + 12) % 12, 1);
    } else {
      sec++;
      assert.equal((aPc - tPc + 12) % 12, 7);
      assert.ok(!/maj7$/.test(target));
    }
    // no distractor sits on the answer's root, the target's root, or a half step above the target
    q.options.forEach((o, i) => {
      if (i === q.answer) return;
      const p = pc(rootOf(o));
      assert.notEqual(p, aPc);
      assert.notEqual(p, tPc);
      assert.notEqual(p, (tPc + 1) % 12);
    });
  }
  assert.ok(sec > 50 && half > 10);
});

test('half-step answers are spelled as flats of the next letter', () => {
  const r = seeded(7);
  const want = { Cmaj7: 'Db7', Gmaj7: 'Ab7', Dmaj7: 'Eb7', Amaj7: 'Bb7', Fmaj7: 'Gb7', Emaj7: 'F7' };
  const found = new Set();
  for (let i = 0; i < 6000 && found.size < 6; i++) {
    const q = makeQuestion(r);
    if (q.type !== 'approach' || !/half step/.test(q.prompt)) continue;
    const t = /into (\S+)\?/.exec(q.prompt)[1];
    assert.equal(q.options[q.answer], want[t]);
    found.add(t);
  }
  assert.equal(found.size, 6);
});

test('chordMidis sits in range and matches the chord pitch classes', () => {
  for (let r = 0; r < 12; r++) {
    for (const q of ['maj', 'min', 'maj7', 'm7', '7', '9', '13', 'maj9', 'm9', '9sus4', 'maj7#11', 'add9']) {
      const m = chordMidis(r, q);
      assert.ok(m[0] >= 45 && m[0] <= 56);
      const allowed = new Set(chordPcs(r, q));
      for (const x of m) assert.ok(allowed.has(x % 12), `${q} ${r}`);
    }
  }
});
