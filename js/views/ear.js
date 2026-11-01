import { h } from '../dom.js';

// Default answer sets per mode (keys defined in exercises/ear-data.js).
// kind: ear (ear.js: earMode + options) | harmonise | review. Accuracy is logged under the chip key, so colour and soul keep their own.
const MODES = {
  interval: { label: 'Intervals', kind: 'ear', earMode: 'interval', options: ['m3', 'M3', 'P4', 'P5', '8ve'] },
  quality: { label: 'Chord quality', kind: 'ear', earMode: 'quality', options: ['maj', 'min', '7', 'maj7', 'm7'] },
  progression: { label: 'Progressions', kind: 'ear', earMode: 'progression', options: ['I-vi-IV-V', 'I-iii-IV-V', 'I-IV-V-I', 'I-V-vi-IV'] },
  colour: { label: 'Colour chords', kind: 'ear', earMode: 'quality', options: ['maj7', 'maj9', 'm7', 'm9', '7', '9sus4'] },
  soul: { label: 'Soul moves', kind: 'ear', earMode: 'progression', options: ['ii7-V7-Imaj7', 'Imaj7-vi7-ii7-V7', 'IVmaj7-iv7-Imaj7', 'bII7-Imaj7', 'V7-Imaj7'] },
  harmonise: { label: 'Harmonise', kind: 'harmonise' },
  review: { label: 'Review', kind: 'review' },
};
let lastMode = 'quality';

export function render(root, ctx) {
  const { store } = ctx;
  const want = ctx.params?.mode;
  let mode = want && MODES[want] ? (lastMode = want) : lastMode;
  let handle = null;
  let gen = 0;

  const acc = h('p', { class: 'mono muted', role: 'status' });
  const stage = h('div', { class: 'stack' });
  const chips = h('div', { class: 'row' });
  root.append(h('div', { class: 'screen' },
    h('div', { class: 'stack' }, h('span', { class: 'eyebrow' }, 'Ear training'), h('h1', { class: 'h1' }, 'Listen, then name it')),
    chips, acc, stage));

  function drawAcc() {
    if (mode === 'review') {
      const n = Object.keys(store.get().missed || {}).length;
      acc.textContent = n ? `${n} missed ${n === 1 ? 'question' : 'questions'} to revisit.` : 'Missed questions come back here until you get them right.';
      return;
    }
    const e = store.get().ear[mode];
    acc.textContent = e && e.total ? `Accuracy ${Math.round((e.right / e.total) * 100)}%  (${e.right}/${e.total})` : 'No rounds yet. Your accuracy builds here.';
  }
  function drawChips() {
    chips.replaceChildren(...Object.entries(MODES).map(([k, m]) => h('button', {
      class: 'chip' + (k === mode ? ' active' : ''), type: 'button', 'aria-pressed': String(k === mode),
      onClick: () => { if (k !== mode) { mode = lastMode = k; drawChips(); drawAcc(); mount(); } },
    }, m.label)));
  }

  function destroy() { try { handle?.destroy?.(); } catch (e) { console.error(e); } handle = null; }

  async function mount() {
    const mine = ++gen;
    destroy();
    stage.replaceChildren();
    const m = MODES[mode];
    try {
      if (m.kind === 'review') { await mountReview(mine); return; }
      const mod = await import(m.kind === 'harmonise' ? '../exercises/harmonise-drill.js' : '../exercises/ear.js');
      if (mine !== gen) return;
      // The exercise logs each round itself via ctx.store.logEar(logAs, right), so each chip keeps its own accuracy.
      const spec = m.kind === 'harmonise' ? { kind: 'harmonise-drill', logAs: mode }
        : { kind: 'ear', mode: m.earMode, rounds: Infinity, options: m.options, logAs: mode };
      handle = mod.mount(stage, spec, { ...ctx, onComplete: () => {} });
    } catch (e) {
      if (mine !== gen) return;
      stage.replaceChildren(h('div', { class: 'callout' }, 'The ear trainer could not load. ', h('span', { class: 'mono small muted' }, e.message)));
    }
  }

  // Spaced review: quiz questions from finished lessons, missed ones first.
  async function mountReview(mine) {
    const [cur, rev, quiz] = await Promise.all([import('../content/curriculum.js'), import('../content/review.js'), import('../exercises/quiz.js')]);
    if (mine !== gen) return;
    const items = rev.buildReview(store.get(), cur.allLessons(), 5);
    if (!items.length) {
      stage.replaceChildren(h('div', { class: 'callout' }, 'Finish a lesson with a quiz and its questions will show up here.'));
      return;
    }
    const slot = h('div');
    const again = h('div', { class: 'row' });
    stage.replaceChildren(slot, again);
    const spec = { kind: 'quiz', questions: items.map((i) => ({ q: i.q, options: i.options, answer: i.answer, explain: i.explain, lessonTitle: i.lessonTitle })) };
    const onComplete = () => {
      again.replaceChildren(h('button', { class: 'btn', type: 'button', onClick: () => { if (mine === gen) mount(); } }, 'Review more'));
    };
    handle = quiz.mount(slot, spec, { ...ctx, quizKey: (i) => items[i].key, onComplete });
  }

  drawChips(); drawAcc(); mount();
  const unsub = store.subscribe(drawAcc);
  return () => { gen++; unsub(); destroy(); };
}
