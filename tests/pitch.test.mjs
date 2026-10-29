import test from 'node:test';
import assert from 'node:assert/strict';
import { detectPitch, freqToMidiCents } from '../js/audio/pitch.js';
import { createOnsetTracker } from '../js/audio/listener.js';

const SR = 48000;
const FREQS = [82.41, 110, 146.83, 196, 246.94, 329.63, 440];

function harmonics(f, n, amps) {
  const b = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    let s = 0;
    amps.forEach((a, h) => { s += a * Math.sin(2 * Math.PI * f * (h + 1) * i / SR); });
    b[i] = s / 3;
  }
  return b;
}

/** Karplus-Strong string; returns a window taken after the attack. */
function ks(f, n, skip = 3000) {
  const D = SR / f - 0.5, N = Math.floor(D), frac = D - N, c = (1 - frac) / (1 + frac);
  const line = new Float32Array(N);
  let seed = 12345, lp = 0;
  for (let i = 0; i < N; i++) { seed = (seed * 1664525 + 1013904223) >>> 0; lp += 0.45 * ((seed / 2 ** 32) * 2 - 1 - lp); line[i] = lp; }
  const out = new Float32Array(n);
  let last = 0, apx = 0, apy = 0, idx = 0;
  for (let k = 0; k < skip + n; k++) {
    const y = line[idx];
    const filt = 0.998 * 0.5 * (y + last);
    last = y;
    const ap = c * filt + apx - c * apy;
    apx = filt; apy = ap; line[idx] = ap;
    idx = (idx + 1) % N;
    if (k >= skip) out[k - skip] = y;
  }
  return out;
}

function check(buf, f, label) {
  const r = detectPitch(buf, SR);
  assert.ok(r, `${label}: no pitch for ${f}`);
  const err = 1200 * Math.log2(r.freq / f);
  assert.ok(Math.abs(err) <= 10, `${label}: ${f} Hz detected as ${r.freq.toFixed(2)} (${err.toFixed(1)} cents)`);
  const want = Math.round(69 + 12 * Math.log2(f / 440));
  assert.equal(freqToMidiCents(r.freq).midi, want, `${label}: wrong octave/note for ${f}`);
  assert.ok(r.clarity > 0.8, `${label}: low clarity ${r.clarity}`);
}

for (const size of [4096, 2048]) {
  for (const f of FREQS) {
    test(`harmonic sine ${f} Hz @${size}`, () => check(harmonics(f, size, [1, 0.5, 0.33, 0.25]), f, 'sine'));
    test(`strong 2nd harmonic ${f} Hz @${size}`, () => check(harmonics(f, size, [0.5, 1, 0.6, 0.3]), f, 'h2'));
    test(`KS string ${f} Hz @${size}`, () => check(ks(f, size), f, 'ks'));
  }
}

test('silence and noise-free zeros return null', () => {
  assert.equal(detectPitch(new Float32Array(4096), SR), null);
});

test('freqToMidiCents with custom A4', () => {
  const r = freqToMidiCents(442, 442);
  assert.equal(r.midi, 69);
  assert.ok(Math.abs(r.cents) < 1e-6);
});

test('onset tracker: one onset per hold, re-pluck fires again, octave wobble ignored', () => {
  const notes = [];
  const step = createOnsetTracker((n) => notes.push(n));
  const p = (midi) => ({ midi, cents: 2, clarity: 0.95 });
  let t = 0;
  const run = (ms, rms, pp) => { for (let e = 0; e < ms; e += 40) { t += 40; step(t, rms, 0.01, pp); } };
  run(200, 0.002, null);           // silence
  run(400, 0.2, p(40));            // pluck low E
  assert.equal(notes.length, 1);
  assert.equal(notes[0].midi, 40);
  run(120, 0.15, p(52));           // octave jump while ringing: ignored
  run(200, 0.1, p(40));
  assert.equal(notes.length, 1);
  run(200, 0.001, null);           // dip
  run(400, 0.2, p(40));            // re-pluck
  assert.equal(notes.length, 2);
  run(400, 0.15, p(45));           // new note
  assert.equal(notes.length, 3);
  assert.equal(notes[2].name, 'A2');
});
