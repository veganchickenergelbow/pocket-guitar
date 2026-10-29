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
