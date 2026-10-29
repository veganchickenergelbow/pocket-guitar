import { h } from '../dom.js';

// Each self-check maps to the unit to start at if it is NOT ticked.
const CHECKS = [
  { id: 'notes', unit: 1, text: 'I know the note names on the low E and A strings' },
  { id: 'barre', unit: 1, text: 'I can play E- and A-shape barre chords' },
  { id: 'scale', unit: 2, text: 'I know what a major scale and scale degrees are' },
  { id: 'numbers', unit: 2, text: 'I can name the chords in a key by number (I, IV, V)' },
  { id: 'sevenths', unit: 3, text: 'I can play maj7, m7 and 7 chords' },
];
const QUIZ = [
  { q: 'What makes a triad minor?', opts: ['A flattened 3rd', 'A flattened 7th', 'A sharpened 5th', 'An added 9th'], answer: 0, unit: 2 },
  { q: 'Which notes make a G major triad?', opts: ['G  B  D', 'G  Bb  D', 'G  B  D#', 'G  C  D'], answer: 0, unit: 2 },
  { q: 'In the key of D, what is the V chord?', opts: ['A', 'G', 'E', 'B'], answer: 0, unit: 2 },
];
const FALLBACK_UNITS = 7;

export function suggestUnit(ticks, answers) {
  const gaps = CHECKS.filter((c) => !ticks[c.id]).map((c) => c.unit);
  QUIZ.forEach((q, i) => { if (answers[i] !== q.answer) gaps.push(q.unit); });
  return gaps.length ? Math.min(...gaps) : 4;
}

export async function render(root, ctx) {
  const { store, navigate } = ctx;
  let units = null;
  try { units = (await import('../content/curriculum.js')).UNITS; } catch { /* titles optional */ }
  const unitCount = units?.length || FALLBACK_UNITS;
  const unitName = (n) => `Unit ${n}${units?.[n - 1] ? `: ${units[n - 1].title}` : ''}`;

  const ticks = {};
  const answers = [];
  const result = h('div', { class: 'stack' });

  const checkRows = CHECKS.map((c) => {
    const box = h('input', { type: 'checkbox' });
    box.addEventListener('change', () => { ticks[c.id] = box.checked; });
    return h('label', { class: 'toggle-row' }, h('span', null, c.text), box);
  });

  const quizBlocks = QUIZ.map((item, qi) => h('fieldset', { class: 'stack', style: { border: 0, padding: 0, margin: 0 } },
    h('legend', { style: { fontWeight: '600', padding: 0, marginBottom: '8px' } }, `${qi + 1}. ${item.q}`),
    ...item.opts.map((o, oi) => {
      const r = h('input', { type: 'radio', name: `q${qi}` });
      r.addEventListener('change', () => { answers[qi] = oi; });
      return h('label', { class: 'toggle-row' }, h('span', { class: 'mono' }, o), r);
    })));

  function showResult() {
    const unit = suggestUnit(ticks, answers);
    const sel = h('select', { 'aria-label': 'Starting unit' },
      ...Array.from({ length: unitCount }, (_, i) => h('option', { value: String(i + 1), selected: i + 1 === unit }, unitName(i + 1))));
    result.replaceChildren(h('div', { class: 'card stack' },
      h('span', { class: 'eyebrow' }, 'Suggested start'),
      h('h2', { class: 'h2' }, unitName(unit)),
      h('p', { class: 'muted small' }, 'This only sets where Today points you. Every unit stays open, so jump around whenever you like.'),
      h('label', { class: 'field' }, 'Start somewhere else?', sel),
      h('button', { class: 'btn-primary', type: 'button', onClick: () => {
        store.update((s) => { s.startUnit = Number(sel.value); s.placementDone = true; });
        navigate('today');
      } }, 'Save and begin')));
    result.scrollIntoView?.({ behavior: 'smooth', block: 'nearest' });
  }

  root.append(h('div', { class: 'screen' },
    h('div', { class: 'stack' },
      h('span', { class: 'eyebrow' }, 'Welcome to Pocket'),
      h('h1', { class: 'h1' }, 'Where should we start?'),
      h('p', { class: 'muted' }, 'Tick what you already do comfortably, then answer three quick questions. Be honest; nobody is grading.')),
    h('div', { class: 'stack' }, h('h2', { class: 'h2' }, 'What you can do'), h('div', { class: 'list' }, ...checkRows)),
    h('div', { class: 'stack' }, h('h2', { class: 'h2' }, 'Three questions'), ...quizBlocks),
    h('div', { class: 'row' },
      h('button', { class: 'btn-primary', type: 'button', onClick: showResult }, 'See my starting point'),
      h('button', { class: 'btn-ghost', type: 'button', onClick: () => { store.update((s) => { s.placementDone = true; s.startUnit = 1; }); navigate('today'); } }, 'Skip, start at Unit 1')),
    result));
}
