// Karplus-Strong plucked guitar. Each note is rendered offline into an AudioBuffer (cached per midi).
/** @type {AudioContext|null} */
let ac = null;
/** @type {GainNode|null} */
let master = null;
let silentPlayed = false;
/** @type {Map<string, AudioBuffer>} */
const cache = new Map();
/** @type {Set<{src: AudioBufferSourceNode, gain: GainNode}>} */
const active = new Set();
/** @type {Set<{timer: number, done: () => void}>} */
const pending = new Set();

const BUF_SECONDS = 3.5;

/** @returns {AudioContext|null} */
export function getContext() {
  return ac;
}

function buildGraph() {
  master = ac.createGain();
  master.gain.value = 0.85;
  const body = ac.createBiquadFilter(); // wooden body resonance
  body.type = 'peaking'; body.frequency.value = 190; body.Q.value = 0.9; body.gain.value = 3.5;
  const dip = ac.createBiquadFilter(); // tame pick-scratch / harshness
  dip.type = 'peaking'; dip.frequency.value = 2600; dip.Q.value = 0.8; dip.gain.value = -3;
  const lp = ac.createBiquadFilter();
  lp.type = 'lowpass'; lp.frequency.value = 5200; lp.Q.value = 0.4;
  const comp = ac.createDynamicsCompressor();
  comp.threshold.value = -16; comp.ratio.value = 3; comp.attack.value = 0.005; comp.release.value = 0.25;
  master.connect(body); body.connect(dip); dip.connect(lp); lp.connect(comp); comp.connect(ac.destination);
}

/**
 * Create/resume the shared AudioContext. Call from a user tap (iOS Safari).
 * @returns {Promise<void>}
 */
export async function unlock() {
  if (!ac) {
    const AC = globalThis.AudioContext || globalThis.webkitAudioContext;
    if (!AC) return;
    ac = new AC();
    buildGraph();
  }
  if (!silentPlayed) { // iOS: a tiny silent buffer inside the gesture fully unlocks output
    const s = ac.createBufferSource();
    s.buffer = ac.createBuffer(1, 1, ac.sampleRate);
    s.connect(ac.destination);
    s.start(0);
    silentPlayed = true;
  }
  if (ac.state !== 'running') {
    try { await ac.resume(); } catch (e) { /* ignore */ }
  }
}

/**
 * Render one plucked string with a tuned Karplus-Strong loop.
 * @param {number} midi
 * @returns {AudioBuffer}
 */
function noteBuffer(midi) {
  const key = midi + '@' + ac.sampleRate;
  const hit = cache.get(key);
  if (hit) return hit;
  const sr = ac.sampleRate;
  const f = 440 * Math.pow(2, (midi - 69) / 12);
  const len = Math.floor(sr * BUF_SECONDS);
  const D = sr / f - 0.5; // averaging filter adds half a sample of delay
  const N = Math.max(2, Math.floor(D));
  const frac = D - N;
  const c = (1 - frac) / (1 + frac); // allpass for fractional-delay tuning
  const rho = Math.pow(0.5, 1 / (f * 1.5)); // ~1.5 s half-life regardless of pitch

  let seed = (midi * 2654435761) >>> 0; // deterministic noise per note
  const rnd = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296 * 2 - 1; };
  const line = new Float32Array(N);
  let lp = 0;
  for (let i = 0; i < N; i++) { lp += 0.45 * (rnd() - lp); line[i] = lp; } // softened burst
  const pick = Math.max(1, Math.round(N * 0.17)); // pick-position comb
  const tmp = Float32Array.from(line);
  let mean = 0;
  for (let i = 0; i < N; i++) { line[i] = tmp[i] - 0.6 * tmp[(i + pick) % N]; mean += line[i]; }
  mean /= N;
  let peak = 1e-9;
  for (let i = 0; i < N; i++) { line[i] -= mean; peak = Math.max(peak, Math.abs(line[i])); }
  for (let i = 0; i < N; i++) line[i] /= peak;

  const buf = ac.createBuffer(1, len, sr);
  const out = buf.getChannelData(0);
  let last = 0, apx = 0, apy = 0, idx = 0, max = 1e-9;
  for (let n = 0; n < len; n++) {
    const y = line[idx];
    const filt = rho * 0.5 * (y + last);
    last = y;
    const ap = c * filt + apx - c * apy;
    apx = filt; apy = ap;
    line[idx] = ap;
    idx = idx + 1 === N ? 0 : idx + 1;
    out[n] = y;
    if (Math.abs(y) > max) max = Math.abs(y);
  }
  const fade = Math.floor(sr * 0.3), g = 0.9 / max;
  for (let n = 0; n < len; n++) {
    const t = len - n < fade ? (len - n) / fade : 1;
    out[n] *= g * t;
  }
  cache.set(key, buf);
  return buf;
}

/**
 * Pluck one note.
 * @param {number} midi
 * @param {{when?: number, dur?: number, velocity?: number}} [opts] when = seconds from now
 */
export function playMidi(midi, { when = 0, dur = 1.6, velocity = 0.8 } = {}) {
  if (!ac || !master) { unlock(); return; }
  const t = ac.currentTime + Math.max(0, when) + 0.01;
  const src = ac.createBufferSource();
  src.buffer = noteBuffer(midi);
  const tone = ac.createBiquadFilter();
  tone.type = 'lowpass';
  tone.frequency.value = 1800 + velocity * 3000; // softer plucks are darker
  tone.Q.value = 0.3;
  const gain = ac.createGain();
  gain.gain.setValueAtTime(Math.min(1, velocity), t);
  gain.gain.setTargetAtTime(0, t + dur, 0.09);
  src.connect(tone); tone.connect(gain); gain.connect(master);
  const rec = { src, gain };
  active.add(rec);
  src.onended = () => { active.delete(rec); try { gain.disconnect(); } catch (e) { /* ignore */ } };
  src.start(t);
  src.stop(t + dur + 0.6);
}

/** @param {number} seconds @returns {Promise<void>} */
function wait(seconds) {
  return new Promise((resolve) => {
    const rec = { timer: 0, done: resolve };
    rec.timer = setTimeout(() => { pending.delete(rec); resolve(); }, seconds * 1000);
    pending.add(rec);
  });
}

/**
 * Strum a chord (midis low to high).
 * @returns {Promise<void>} resolves when done ringing
 */
export async function playChord(midis, { strum = 0.035, direction = 'down', dur = 2.2, velocity = 0.75 } = {}) {
  await unlock();
  if (!ac) return;
  const list = direction === 'up' ? [...midis].reverse() : [...midis];
  list.forEach((m, i) => playMidi(m, { when: i * strum, dur, velocity: velocity * (0.92 + 0.08 * ((i * 7) % 3) / 2) }));
  await wait(dur + strum * list.length);
}

/**
 * Play notes one after another.
 * @returns {Promise<void>}
 */
export async function playSequence(midis, { gap = 0.45, dur = 1.2 } = {}) {
  await unlock();
  if (!ac) return;
  midis.forEach((m, i) => playMidi(m, { when: i * gap, dur, velocity: 0.8 }));
  await wait(gap * Math.max(0, midis.length - 1) + dur);
}

/** Silence everything immediately (short release to avoid clicks). */
export function stopAll() {
  for (const p of pending) { clearTimeout(p.timer); p.done(); }
  pending.clear();
  if (!ac) return;
  const t = ac.currentTime;
  for (const { src, gain } of active) {
    try {
      gain.gain.cancelScheduledValues(t);
      gain.gain.setTargetAtTime(0, t, 0.02);
      src.stop(t + 0.15);
    } catch (e) { /* already stopped */ }
  }
}
