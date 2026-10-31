// Pitch detection (YIN) and microphone access.
import { unlock, getContext } from './synth.js';
import { setPlayRecord, setPlaybackAfterMic } from './session.js';

const FMIN = 70;
const FMAX = 1200;

/**
 * YIN pitch detector. Pure; valid 70-1200 Hz.
 * @param {Float32Array} buf mono samples (2048-4096 recommended)
 * @param {number} sampleRate
 * @returns {{freq: number, clarity: number}|null}
 */
export function detectPitch(buf, sampleRate) {
  const n = buf.length;
  let energy = 0;
  for (let i = 0; i < n; i++) energy += buf[i] * buf[i];
  if (Math.sqrt(energy / n) < 1e-4) return null;

  const tauMin = Math.max(2, Math.floor(sampleRate / FMAX));
  const tauMax = Math.min(Math.ceil(sampleRate / FMIN), Math.floor(n / 2));
  const W = n - tauMax;
  if (tauMax <= tauMin + 2 || W < tauMax / 2) return null;

  // Difference function + cumulative mean normalisation.
  const cmnd = new Float32Array(tauMax + 1);
  cmnd[0] = 1;
  let running = 0;
  for (let tau = 1; tau <= tauMax; tau++) {
    let d = 0;
    for (let j = 0; j < W; j++) {
      const diff = buf[j] - buf[j + tau];
      d += diff * diff;
    }
    running += d;
    cmnd[tau] = running > 0 ? (d * tau) / running : 1;
  }

  // Absolute threshold: first dip below 0.15, then walk to its local minimum.
  let tau = -1;
  for (let t = tauMin; t < tauMax; t++) {
    if (cmnd[t] < 0.15) {
      while (t + 1 < tauMax && cmnd[t + 1] < cmnd[t]) t++;
      tau = t;
      break;
    }
  }
  if (tau < 0) { // fall back to the global minimum if it is reasonably clear
    let best = tauMin;
    for (let t = tauMin; t < tauMax; t++) if (cmnd[t] < cmnd[best]) best = t;
    if (cmnd[best] > 0.3) return null;
    tau = best;
  }

  // Parabolic interpolation around the minimum.
  let better = tau;
  if (tau > 1 && tau < tauMax) {
    const s0 = cmnd[tau - 1], s1 = cmnd[tau], s2 = cmnd[tau + 1];
    const denom = 2 * (2 * s1 - s2 - s0);
    if (Math.abs(denom) > 1e-12) better = tau + (s2 - s0) / denom;
  }
  const freq = sampleRate / better;
  if (!(freq >= FMIN && freq <= FMAX)) return null;
  return { freq, clarity: Math.max(0, Math.min(1, 1 - cmnd[tau])) };
}

/**
 * @param {number} freq
 * @param {number} [a4]
 * @returns {{midi: number, cents: number}} nearest midi note and cents offset (-50..50)
 */
export function freqToMidiCents(freq, a4 = 440) {
  const m = 69 + 12 * Math.log2(freq / a4);
  const midi = Math.round(m);
  return { midi, cents: (m - midi) * 100 };
}

/**
 * @param {string} code
 * @param {string} message
 * @returns {Error & {code: string}}
 */
function micError(code, message) {
  const e = /** @type {Error & {code: string}} */ (new Error(message));
  e.code = code;
  return e;
}

/**
 * Open the microphone with all processing disabled. Call from a tap.
 * Throws Error with .code in 'insecure' | 'unsupported' | 'denied' | 'unknown'.
 * @returns {Promise<{ctx: AudioContext, source: MediaStreamAudioSourceNode, stop: () => void}>}
 */
export async function startMic() {
  if (typeof window !== 'undefined' && window.isSecureContext === false) {
    throw micError('insecure', 'Microphone needs a secure (https) page');
  }
  const md = typeof navigator !== 'undefined' ? navigator.mediaDevices : undefined;
  if (!md || !md.getUserMedia) throw micError('unsupported', 'Microphone not supported in this browser');

  setPlayRecord(); // iOS: allow capture; paired with setPlaybackAfterMic() on failure/stop
  // Start both inside the same gesture: unlock() creates/resumes the shared context synchronously.
  const unlocking = unlock();
  const asking = md.getUserMedia({
    audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false },
  });
  let stream;
  try {
    stream = await asking;
  } catch (err) {
    setPlaybackAfterMic();
    const name = err && err.name;
    if (name === 'NotAllowedError' || name === 'SecurityError' || name === 'PermissionDeniedError') {
      throw micError('denied', 'Microphone permission denied');
    }
    if (name === 'NotFoundError' || name === 'NotSupportedError') {
      throw micError('unsupported', 'No microphone available');
    }
    throw micError('unknown', (err && err.message) || 'Could not open microphone');
  }
  await unlocking;
  // iOS: a context created earlier under the 'playback' session often hears silence from the mic.
  // Give the mic its own context, made after capture starts (capture lifts the autoplay block).
  const AC = globalThis.AudioContext || globalThis.webkitAudioContext;
  let ctx = null, own = false;
  if (AC) {
    try { ctx = new AC(); own = true; } catch (e) { ctx = null; }
    if (ctx && ctx.state !== 'running') await resumeSoon(ctx);
    if (ctx && ctx.state !== 'running') { try { ctx.close(); } catch (e) { /* ignore */ } ctx = null; own = false; }
  }
  if (!ctx) ctx = getContext(); // fall back to the shared context
  if (!ctx) {
    setPlaybackAfterMic();
    stream.getTracks().forEach((t) => t.stop());
    throw micError('unsupported', 'Web Audio not supported');
  }
  if (ctx.state !== 'running') { try { await ctx.resume(); } catch (e) { /* ignore */ } }
  const source = ctx.createMediaStreamSource(stream);
  let stopped = false;
  return {
    ctx,
    source,
    stop() {
      if (stopped) return;
      stopped = true;
      setPlaybackAfterMic();
      try { source.disconnect(); } catch (e) { /* ignore */ }
      stream.getTracks().forEach((t) => t.stop());
      if (own) { try { ctx.close(); } catch (e) { /* ignore */ } }
    },
  };
}

/** resume() can hang on iOS when it is not allowed, so give up after a short wait. */
function resumeSoon(ctx) {
  return Promise.race([
    ctx.resume().catch(() => {}),
    new Promise((r) => setTimeout(r, 800)),
  ]);
}
