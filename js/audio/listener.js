// Continuous mic listener: per-frame pitch + stable note-onset detection.
import { detectPitch, freqToMidiCents, startMic } from './pitch.js';

const NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const FRAME_MS = 40;
const LOWEST_MIDI = 36; // C2, allows drop tunings

/** @param {number} midi */
export function noteName(midi) {
  return NAMES[((midi % 12) + 12) % 12] + (Math.floor(midi / 12) - 1);
}

/**
 * Stateful onset logic, separated from audio so it can be tested.
 * Call the returned step() once per frame.
 * @param {(n: {midi:number, pc:number, name:string, cents:number}) => void} emit
 * @param {number} [holdMs]
 * @returns {(now: number, rms: number, thr: number, p: {midi:number, cents:number, clarity:number}|null) => void}
 */
export function createOnsetTracker(emit, holdMs = 120) {
  let cand = -1, since = 0, emitted = false, hist = [];
  let last = -1, armed = true;
  let peak = 0, dipped = false, minLvl = Infinity;

  return function step(now, rms, thr, p) {
    // Level dip + rise detection (re-pluck of the same note).
    if (rms > peak) peak = rms;
    if (!dipped) {
      if (rms < peak * 0.5 || rms < thr) { dipped = true; minLvl = rms; }
    } else if (rms < minLvl) {
      minLvl = rms;
    } else if (rms > thr && rms > minLvl * 1.8) {
      dipped = false; peak = rms; armed = true;
      cand = -1; emitted = false; hist = [];
    }

    if (!p || rms < thr) { cand = -1; hist = []; return; }
    if (p.clarity < 0.9) return;

    const m = p.midi;
    if (cand >= 0 && m !== cand && (m - cand) % 12 === 0) {
      hist.push(m); // octave wobble within the same hold
    } else if (m !== cand) {
      cand = m; since = now; emitted = false; hist = [m];
    } else {
      hist.push(m);
    }
    if (emitted || now - since < holdMs) return;
    if (last >= 0 && !armed && (cand - last) % 12 === 0) return; // same note still ringing
    const midi = Math.max(LOWEST_MIDI, Math.min(...hist)); // ambiguous octave -> lower candidate
    last = midi; armed = false; emitted = true; peak = rms;
    emit({ midi, pc: ((midi % 12) + 12) % 12, name: noteName(midi), cents: p.cents });
  };
}

/**
 * @param {{onPitch?: Function, onNote?: Function, onLevel?: (rms:number)=>void, a4?: number}} opts
 * @returns {{start: () => Promise<void>, stop: () => void}}
 */
export function createListener({ onPitch, onNote, onLevel, a4 = 440 } = {}) {
  let mic = null, analyser = null, proc = null, sink = null, timer = 0;
  let buf = new Float32Array(4096);
  let floor = 0.004;
  const tracker = createOnsetTracker((n) => onNote && onNote(n));

  function frame() {
    if (!mic) return;
    if (analyser) analyser.getFloatTimeDomainData(buf);
    let sum = 0;
    for (let i = 0; i < buf.length; i++) sum += buf[i] * buf[i];
    const rms = Math.sqrt(sum / buf.length);
    if (onLevel) onLevel(rms);

    // Adaptive noise floor: follows quiet levels quickly, creeps up slowly.
    floor = rms < floor * 1.5 ? floor * 0.95 + rms * 0.05 : floor * 1.002;
    floor = Math.max(0.0015, Math.min(floor, 0.05));
    const thr = Math.max(0.008, floor * 3);

    let info = null;
    if (rms > thr) {
      const r = detectPitch(buf, mic.ctx.sampleRate);
      if (r && r.clarity >= 0.8) {
        const mc = freqToMidiCents(r.freq, a4);
        info = { midi: mc.midi, cents: mc.cents, clarity: r.clarity };
        if (onPitch) onPitch({ freq: r.freq, midi: mc.midi, cents: mc.cents, name: noteName(mc.midi), clarity: r.clarity, rms });
      }
    }
    tracker(performance.now(), rms, thr, info);
  }

  return {
    async start() {
      if (mic) return;
      mic = await startMic();
      const ctx = mic.ctx;
      sink = ctx.createGain(); // silent sink keeps the graph "pulled" on iOS
      sink.gain.value = 0;
      sink.connect(ctx.destination);
      const probe = ctx.createAnalyser();
      if (typeof probe.getFloatTimeDomainData === 'function') {
        analyser = probe;
        analyser.fftSize = 4096;
        analyser.smoothingTimeConstant = 0;
        mic.source.connect(analyser);
        analyser.connect(sink);
      } else { // ScriptProcessor fallback for old Safari
        proc = ctx.createScriptProcessor(4096, 1, 1);
        proc.onaudioprocess = (e) => { buf.set(e.inputBuffer.getChannelData(0)); };
        mic.source.connect(proc);
        proc.connect(sink);
      }
      timer = setInterval(frame, FRAME_MS);
    },
    stop() {
      clearInterval(timer);
      timer = 0;
      const m = mic;
      mic = null;
      for (const node of [analyser, proc, sink]) { try { node && node.disconnect(); } catch (e) { /* ignore */ } }
      if (proc) proc.onaudioprocess = null;
      analyser = proc = sink = null;
      if (m) m.stop();
    },
  };
}
