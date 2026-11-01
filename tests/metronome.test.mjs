import test from 'node:test';
import assert from 'node:assert/strict';
import { patternFor, backbeatPattern } from '../js/audio/metronome.js';

test('default pattern accents beat 1', () => {
  assert.deepEqual(patternFor(4), ['accent', 'click', 'click', 'click']);
  assert.deepEqual(patternFor(3, null), ['accent', 'click', 'click']);
});
test('custom pattern is used, padded and sanitised to length', () => {
  assert.deepEqual(patternFor(4, ['mute', 'accent']), ['mute', 'accent', 'click', 'click']);
  assert.deepEqual(patternFor(2, ['click', 'mute', 'accent']), ['click', 'mute']);
  assert.deepEqual(patternFor(2, ['bogus', 'mute']), ['accent', 'mute']);
});
test('backbeat pattern', () => {
  assert.deepEqual(backbeatPattern(4), ['mute', 'accent', 'mute', 'accent']);
  assert.equal(backbeatPattern(6).length, 6);
});

import { createMetronome } from '../js/audio/metronome.js';
import { backingNotes, compHits } from '../js/exercises/progression.js';

test('createMetronome accepts onSchedule without starting', () => {
  const m = createMetronome({ bpm: 90, onSchedule: () => {} });
  assert.equal(m.isRunning(), false);
});
test('backingNotes puts bass low and keys in 55-76', () => {
  const { bass, keys } = backingNotes([48, 55, 64, 67, 72]);
  assert.ok(bass < 52);
  assert.ok(keys.every((k) => k >= 55 && k <= 76));
  assert.equal(backingNotes([60, 64, 67]).bass, 48);
});
test('compHits groove', () => {
  assert.equal(compHits(0, 4).length, 2);
  assert.deepEqual(compHits(1, 4).map((h) => h.at), [0.5]);
  assert.equal(compHits(2, 4)[0].kind, 'bass');
  assert.equal(compHits(1, 2).length, 0);
  assert.equal(compHits(2, 2).length, 0);
});
