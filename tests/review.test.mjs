import test from 'node:test';
import assert from 'node:assert/strict';
import { buildReview, reviewPool } from '../js/content/review.js';

const quiz = (n) => ({ type: 'exercise', spec: { kind: 'quiz', questions: Array.from({ length: n }, (_, i) => ({ q: `q${i}`, options: ['a', 'b'], answer: 0, explain: 'e' })) } });
const lessons = [
  { id: 'a', title: 'Alpha', blocks: [{ type: 'text' }, quiz(3)] },
  { id: 'b', title: 'Beta', blocks: [quiz(2), { type: 'exercise', spec: { kind: 'ear' } }, quiz(2)] },
  { id: 'c', title: 'Gamma (not done)', blocks: [quiz(4)] },
];
const seeded = (s) => () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 2 ** 32; };

test('pool only has quiz questions from completed lessons, with block-aware keys', () => {
  const pool = reviewPool({ completed: { a: 'x', b: 'x' } }, lessons);
  assert.equal(pool.length, 7);
  assert.ok(pool.every((p) => p.lessonId !== 'c'));
  assert.ok(pool.some((p) => p.key === 'a:1:2'));
  assert.ok(pool.some((p) => p.key === 'b:2:1'));
  assert.equal(pool[0].lessonTitle, 'Alpha');
});

test('nothing completed means nothing to review', () => {
  assert.deepEqual(buildReview({ completed: {} }, lessons), []);
  assert.deepEqual(buildReview(undefined, lessons), []);
});

test('missed questions come first, most missed first, no duplicates', () => {
  const state = { completed: { a: 'x', b: 'x' }, missed: { 'a:1:0': 1, 'b:2:1': 4, 'c:0:0': 9 } };
  for (let s = 1; s < 30; s++) {
    const r = buildReview(state, lessons, 5, seeded(s));
    assert.equal(r.length, 5);
    assert.equal(r[0].key, 'b:2:1');
    assert.equal(r[1].key, 'a:1:0');
    assert.equal(new Set(r.map((x) => x.key)).size, 5);
    assert.ok(r.every((x) => x.lessonId !== 'c'));
  }
});

test('n larger than the pool returns the whole pool; shape is complete', () => {
  const r = buildReview({ completed: { b: 'x' }, missed: {} }, lessons, 10, seeded(3));
  assert.equal(r.length, 4);
  for (const k of ['key', 'lessonId', 'lessonTitle', 'q', 'options', 'answer', 'explain']) assert.ok(k in r[0], k);
});

test('random others vary with the rng', () => {
  const state = { completed: { a: 'x', b: 'x' }, missed: {} };
  const sets = new Set();
  for (let s = 1; s < 20; s++) sets.add(buildReview(state, lessons, 3, seeded(s)).map((x) => x.key).join());
  assert.ok(sets.size > 1);
});
