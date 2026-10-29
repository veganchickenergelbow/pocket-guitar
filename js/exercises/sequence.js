// sequence: play the listed notes in order (pitch class match unless octaveStrict).
import { micPanel } from './_mic.js';
import { h, button, injectStyle } from './_ui.js';
import { pc as pcOf, noteToMidi } from '../music/theory.js';

export function mount(container, spec, ctx) {
  injectStyle();
  const notes = spec.notes;
  const strict = !!spec.octaveStrict;
  let i = 0;
  let finished = false;

  const root = h('div', 'stack');
  const prompt = h('div', 'ex-prompt', spec.label || 'Play these notes in order');
  const chips = h('div', 'row');
  const chipEls = notes.map((n) => { const c = h('span', 'chip mono', n); chips.append(c); return c; });
  const mic = micPanel({ ctx, onNote, onSkip: () => finish(false) });
  const again = button('Start over', 'btn btn-ghost', reset);
  root.append(prompt, chips, mic.el, again);
  container.append(root);
  mark();

  function mark() {
    chipEls.forEach((c, k) => {
      c.classList.toggle('good', k < i);
      c.classList.toggle('active', k === i);
    });
  }
  function reset() { i = 0; finished = false; mark(); mic.setStatus('Back to the start.'); }

  function onNote(n) {
    if (finished) return;
    const want = notes[i];
    const ok = strict ? n.midi === noteToMidi(want) : n.pc === pcOf(want);
    if (!ok) { mic.setStatus(`Heard ${n.name}. Next is ${want}.`, 'bad'); return; }
    i += 1;
    mark();
    mic.setStatus(`${n.name}. Good.`, 'good');
    if (i >= notes.length) finish(true);
  }

  function finish(real) {
    if (finished) return;
    finished = true;
    mic.stop();
    if (!real) { chipEls.forEach((c) => c.classList.add('good')); }
    mic.setStatus(real ? 'Complete.' : 'Skipped.', real ? 'good' : 'muted');
    ctx.onComplete?.({ passed: true, score: real ? 1 : undefined });
  }

  return { destroy() { finished = true; mic.destroy(); root.remove(); } };
}
