// Lookahead metronome on the AudioContext clock.
import { unlock, getContext } from './synth.js';

const LOOKAHEAD = 0.12; // seconds scheduled ahead
const TICK_MS = 25;

/**
 * @param {{bpm?: number, beatsPerBar?: number, onBeat?: (beat: number, bar: number) => void}} [opts]
 * @returns {{start: () => Promise<void>, stop: () => void, setBpm: (n: number) => void, isRunning: () => boolean}}
 */
export function createMetronome({ bpm = 80, beatsPerBar = 4, onBeat } = {}) {
  let tempo = bpm;
  let running = false;
  let timer = 0;
  let nextTime = 0;
  let beat = 0;
  let bar = 0;
  const timeouts = new Set();

  /** Soft woodblock-ish click: short filtered triangle with a pitch drop. */
  function click(ctx, when, accent) {
    const osc = ctx.createOscillator();
    osc.type = 'triangle';
    const f = accent ? 1250 : 880;
    osc.frequency.setValueAtTime(f * 1.15, when);
    osc.frequency.exponentialRampToValueAtTime(f, when + 0.012);
    const bp = ctx.createBiquadFilter();
    bp.type = 'bandpass'; bp.frequency.value = f; bp.Q.value = 1.2;
    const g = ctx.createGain();
    const peak = accent ? 0.55 : 0.32;
    g.gain.setValueAtTime(0.0001, when);
    g.gain.exponentialRampToValueAtTime(peak, when + 0.003);
    g.gain.exponentialRampToValueAtTime(0.0001, when + 0.07);
    osc.connect(bp); bp.connect(g); g.connect(ctx.destination);
    osc.start(when);
    osc.stop(when + 0.09);
  }

  function schedule() {
    const ctx = getContext();
    if (!ctx || !running) return;
    while (nextTime < ctx.currentTime + LOOKAHEAD) {
      const b = beat, r = bar, when = nextTime;
      click(ctx, when, b === 0);
      if (onBeat) {
        const id = setTimeout(() => { timeouts.delete(id); if (running) onBeat(b, r); },
          Math.max(0, (when - ctx.currentTime) * 1000));
        timeouts.add(id);
      }
      nextTime += 60 / tempo;
      beat += 1;
      if (beat >= beatsPerBar) { beat = 0; bar += 1; }
    }
  }

  return {
    async start() {
      if (running) return;
      running = true; // set first so a quick stop() during unlock wins
      await unlock();
      const ctx = getContext();
      if (!ctx || !running) { running = false; return; }
      beat = 0; bar = 0;
      nextTime = ctx.currentTime + 0.06;
      schedule();
      timer = setInterval(schedule, TICK_MS);
    },
    stop() {
      running = false;
      clearInterval(timer);
      timer = 0;
      for (const id of timeouts) clearTimeout(id);
      timeouts.clear();
    },
    setBpm(n) { tempo = Math.max(20, Math.min(300, Number(n) || tempo)); },
    isRunning() { return running; },
  };
}
