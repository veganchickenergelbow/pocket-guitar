// find-note: play the named note on a given string (frets 0-12).
import { micPanel } from './_mic.js';
import { h, injectStyle } from './_ui.js';
import { pc as pcOf } from '../music/theory.js';

const OPEN = [40, 45, 50, 55, 59, 64];
const STRING_NAMES = ['low E', 'A', 'D', 'G', 'B', 'high e'];
const POOL = ['C', 'D', 'E', 'F', 'G', 'A', 'B', 'F#', 'C#', 'Bb', 'Eb', 'G#'];

function targets(spec) {
  const list = Array.isArray(spec.notes) ? spec.notes : null;
  const count = spec.count ?? (list ? list.length : 6);
  const out = [];
  for (let i = 0; i < count; i++) {
    if (list) { out.push(list[i % list.length]); continue; }
    let n;
    do { n = POOL[Math.floor(Math.random() * POOL.length)]; } while (n === out[i - 1]);
    out.push(n);
  }
  return out;
}

export function mount(container, spec, ctx) {
  injectStyle();
  const str = spec.string ?? 0;
  const open = OPEN[str];
  const list = targets(spec);
  let i = 0;
  let finished = false;

  const root = h('div', 'stack');
  const prompt = h('div', 'ex-prompt');
  const chips = h('div', 'row');
  const chipEls = list.map((n) => { const c = h('span', 'chip', n); chips.append(c); return c; });
  const mic = micPanel({ ctx, onNote, onSkip: () => finish(false) });
  root.append(prompt, chips, mic.el);
  container.append(root);
  show();

  function show() {
    chipEls.forEach((c, k) => c.classList.toggle('active', k === i));
    prompt.textContent = `Play ${list[i]} on the ${STRING_NAMES[str]} string`;
  }

  function onNote(n) {
    if (finished) return;
    const want = pcOf(list[i]);
    if (n.pc !== want) { mic.setStatus(`Heard ${n.name}. Looking for ${list[i]}.`, 'bad'); return; }
    // Phone mics often report low notes an octave off, so accept n.midi +/- 12 too.
    const inRange = [n.midi, n.midi - 12, n.midi + 12].some((m) => m >= open && m <= open + 12);
    if (!inRange) {
      mic.setStatus(`That is a ${list[i]}, but keep it on the ${STRING_NAMES[str]} string, frets 0 to 12.`, 'bad');
      return;
    }
    chipEls[i].classList.add('good');
    chipEls[i].classList.remove('active');
    mic.setStatus(`${list[i]}. Yes.`, 'good');
    i += 1;
    if (i >= list.length) finish(true); else show();
  }

  function finish(real) {
    if (finished) return;
    finished = true;
    mic.stop();
    if (!real) chipEls.forEach((c) => { if (!c.classList.contains('good')) { c.classList.remove('active'); c.classList.add('skipped'); } });
    prompt.textContent = real ? 'All found.' : 'Skipped. Come back to it when you can.';
    ctx.onComplete?.(real ? { passed: true, score: 1 } : { passed: false, skipped: true });
  }

  return { destroy() { finished = true; mic.destroy(); root.remove(); } };
}
