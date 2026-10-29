// Metronome panel for Tools. Engine: js/audio/metronome.js (accent on beat 1 only).
import { h } from '../dom.js';
import { createMetronome } from '../audio/metronome.js';

const MIN = 40, MAX = 200;
const clamp = (n) => Math.min(MAX, Math.max(MIN, Math.round(n)));
// Remembered while the app stays open.
let bpm = 80, bars = 4, backbeat = false;

export function render(root, ctx) {
  let m = null, running = false, startTimer = null, taps = [];

  const num = h('div', { class: 'big mono', 'aria-live': 'polite' });
  const slider = h('input', { type: 'range', min: MIN, max: MAX, step: 1, 'aria-label': 'Tempo in beats per minute' });
  const dots = h('div', { class: 'beat-dots', 'aria-hidden': 'true' });
  const startBtn = h('button', { class: 'btn-primary', type: 'button', style: { minHeight: '56px', flex: '1' } }, 'Start');
  const barBtns = [3, 4, 6].map((n) => h('button', { type: 'button', onClick: () => { bars = n; if (n !== 4) backbeat = false; rebuild(); } }, String(n)));
  const accent = h('input', { type: 'checkbox' });
  const accentRow = h('label', { class: 'toggle-row' }, h('span', null, 'Clicks on 2 & 4 only', h('div', { class: 'muted small' }, 'Backbeat feel, 4/4 only. Beat 1 is silent.')), accent);

  const engineBpm = () => (backbeat ? bpm / 2 : bpm);
  const beatsShown = () => (backbeat ? 4 : bars);

  function drawDots(on = -1) {
    dots.replaceChildren(...Array.from({ length: beatsShown() }, (_, i) => h('i', { class: i === on ? 'on' : '' })));
  }
  function sync() {
    num.textContent = String(bpm);
    slider.value = String(bpm);
    barBtns.forEach((b, i) => b.setAttribute('aria-pressed', String([3, 4, 6][i] === bars)));
    accent.checked = backbeat; accent.disabled = bars !== 4;
    startBtn.textContent = running ? 'Stop' : 'Start';
    drawDots();
  }
  function stop() {
    clearTimeout(startTimer); startTimer = null;
    try { m?.stop(); } catch { /* ignore */ }
    m = null; running = false;
  }
  async function start() {
    try { await ctx.synth?.unlock?.(); } catch { /* ignore */ }
    m = createMetronome({
      bpm: engineBpm(), beatsPerBar: backbeat ? 2 : bars,
      onBeat: (i) => drawDots(backbeat ? (i % 2 === 0 ? 1 : 3) : i),
    });
    running = true;
    // Backbeat trick: half-tempo clicks, started one beat late, land on beats 2 and 4.
    if (backbeat) startTimer = setTimeout(() => { if (running) m.start(); }, 60000 / bpm);
    else m.start();
    sync();
  }
  function rebuild() { const was = running; stop(); sync(); if (was) start(); }
  function setBpm(n) { bpm = clamp(n); m?.setBpm(engineBpm()); sync(); }

  startBtn.addEventListener('click', () => { if (running) { stop(); sync(); } else start(); });
  slider.addEventListener('input', () => setBpm(Number(slider.value)));
  accent.addEventListener('change', () => { backbeat = accent.checked; rebuild(); });

  const tap = () => {
    const t = performance.now();
    if (taps.length && t - taps[taps.length - 1] > 2000) taps = [];
    taps.push(t); taps = taps.slice(-6);
    if (taps.length >= 2) setBpm(60000 / ((taps[taps.length - 1] - taps[0]) / (taps.length - 1)));
  };

  root.append(h('div', { class: 'stack' },
    num, h('div', { class: 'muted mono small', style: { textAlign: 'center' } }, 'BPM'), dots,
    h('div', { class: 'row', style: { flexWrap: 'nowrap' } },
      h('button', { class: 'btn', type: 'button', 'aria-label': 'Slower', onClick: () => setBpm(bpm - 1) }, '−'),
      h('div', { class: 'grow' }, slider),
      h('button', { class: 'btn', type: 'button', 'aria-label': 'Faster', onClick: () => setBpm(bpm + 1) }, '+')),
    h('div', { class: 'row', style: { flexWrap: 'nowrap' } }, startBtn,
      h('button', { class: 'btn', type: 'button', style: { minHeight: '56px' }, onClick: tap }, 'Tap tempo')),
    h('div', { class: 'field' }, 'Beats per bar', h('div', { class: 'seg', role: 'group' }, ...barBtns)),
    accentRow));
  sync();
  return stop;
}
