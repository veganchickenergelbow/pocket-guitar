// chord-arp: pick the chord one string at a time, low to high; each string turns green.
import { micPanel } from './_mic.js';
import { h, button, injectStyle } from './_ui.js';
import { resolveVoicing } from '../music/voicings.js';
import { fretMidi, midiToName } from '../music/theory.js';
import { chordDiagram } from '../ui/diagram.js';

const STRING_LABEL = ['E', 'A', 'D', 'G', 'B', 'e'];

export function mount(container, spec, ctx) {
  injectStyle();
  const v = resolveVoicing(spec.ref);
  const targets = [];
  v.frets.forEach((f, s) => { if (f >= 0) targets.push({ s, midi: fretMidi(s, f) }); });
  let i = 0;
  let finished = false;

  const root = h('div', 'stack');
  const prompt = h('div', 'ex-prompt', `Pick ${v.name} one string at a time, low to high`);
  const dia = h('div', 'diagram-row');
  dia.append(chordDiagram(v, { width: 130, rootPc: v.rootPc }));
  const chips = h('div', 'row');
  const chipEls = targets.map((t) => {
    const c = h('span', 'chip mono', `${STRING_LABEL[t.s]} ${midiToName(t.midi)}`);
    chips.append(c);
    return c;
  });
  const mic = micPanel({ ctx, onNote, onSkip: () => finish(false) });
  const again = button('Start over', 'btn btn-ghost', () => { i = 0; finished = false; mark(); });
  root.append(prompt, dia, chips, mic.el, again);
  container.append(root);
  mark();

  function mark() {
    chipEls.forEach((c, k) => {
      c.classList.remove('skipped');
      c.classList.toggle('good', k < i);
      c.classList.toggle('active', k === i);
    });
  }

  function onNote(n) {
    if (finished) return;
    const t = targets[i];
    if (n.pc !== t.midi % 12) {
      mic.setStatus(`Heard ${n.name}. Next string should give ${midiToName(t.midi)}.`, 'bad');
      return;
    }
    i += 1;
    mark();
    mic.setStatus(`${n.name}. Clean.`, 'good');
    if (i >= targets.length) finish(true);
  }

  function finish(real) {
    if (finished) return;
    finished = true;
    mic.stop();
    if (!real) chipEls.forEach((c) => c.classList.add('skipped'));
    mic.setStatus(real ? 'Every string rang true.' : 'Skipped.', real ? 'good' : 'muted');
    ctx.onComplete?.(real ? { passed: true, score: 1 } : { passed: false, skipped: true });
  }

  return { destroy() { finished = true; mic.destroy(); root.remove(); } };
}
