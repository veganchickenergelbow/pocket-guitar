// Chord library: pick a root + quality, see every known voicing, tap to hear.
import { CHORDS, chordSymbol } from '../music/theory.js';
import { listVoicings, voicingMidis, ROOT_NAMES } from '../music/voicings.js';
import { chordDiagram } from '../ui/diagram.js';

const GROUPS = [
  ['Triads', ['maj', 'min', 'dim', 'aug', 'sus2', 'sus4']],
  ['Sevenths', ['maj7', 'm7', '7', 'm7b5', 'dim7', '7sus4']],
  ['Colour', ['add9', '6', 'm6', '9', 'maj9', 'm9', 'm11', '13', 'maj7#11', '9sus4', '13sus4']],
];

function h(tag, props = {}, ...kids) {
  const e = document.createElement(tag);
  for (const [k, v] of Object.entries(props)) {
    if (k === 'class') e.className = v;
    else if (k.startsWith('on')) e.addEventListener(k.slice(2), v);
    else e.setAttribute(k, v);
  }
  e.append(...kids);
  return e;
}

export function render(container, ctx) {
  const state = { rootPc: 0, quality: 'maj7', notes: false };
  let alive = true;

  function chip(text, active, onClick, aria) {
    return h('button', {
      type: 'button', class: `chip${active ? ' active' : ''}`, 'aria-pressed': String(active),
      'aria-label': aria || text, onclick: onClick,
    }, text);
  }

  async function play(v) {
    try {
      await ctx.synth.unlock();
      if (alive) ctx.synth.playChord(voicingMidis(v.frets));
    } catch (err) { console.warn('Audio unavailable', err); }
  }

  function card(v) {
    const btn = h('button', {
      type: 'button', class: 'btn btn-ghost', 'aria-label': `Play ${v.name}, ${v.label}`,
      style: 'padding:var(--space-2);height:auto;display:block;', onclick: () => play(v),
    }, chordDiagram(v, { showNotes: state.notes }));
    return h('div', { class: 'card stack', style: 'align-items:center;' },
      h('div', { class: 'mono' }, v.name),
      btn,
      h('div', { class: 'muted', style: 'font-size:12px;text-align:center;' }, v.label),
    );
  }

  function draw() {
    if (!alive) return;
    const set = (patch) => { Object.assign(state, patch); draw(); };
    const flats = [1, 3, 5, 8, 10].includes(state.rootPc);
    const list = listVoicings({ quality: state.quality, rootPc: state.rootPc });

    const rootRow = h('div', { class: 'row' }, ...ROOT_NAMES.map((n, i) =>
      chip(n, i === state.rootPc, () => set({ rootPc: i }), `Root ${n}`)));
    const groupEls = GROUPS.map(([title, qs]) => h('div', { class: 'stack', style: 'gap:var(--space-2);' },
      h('div', { class: 'eyebrow' }, title),
      h('div', { class: 'row' }, ...qs.map((q) => chip(CHORDS[q].symbol || 'maj', q === state.quality, () => set({ quality: q }), `Quality ${q}`)))));

    const results = list.length
      ? h('div', { class: 'row', style: 'align-items:stretch;' }, ...list.map(card))
      : h('div', { class: 'callout' }, 'No shapes for this chord yet. Try another root or quality.');

    container.replaceChildren(h('div', { class: 'screen stack' },
      h('div', { class: 'eyebrow' }, 'Chord library'),
      h('h2', { class: 'h2' }, chordSymbol(state.rootPc, state.quality, flats)),
      h('div', { class: 'stack', style: 'gap:var(--space-2);' }, h('div', { class: 'eyebrow' }, 'Root'), rootRow),
      ...groupEls,
      h('div', { class: 'row' },
        chip('Note names', state.notes, () => set({ notes: !state.notes }), 'Toggle note names'),
        h('span', { class: 'muted' }, `${list.length} shape${list.length === 1 ? '' : 's'} · tap one to hear it`)),
      results));
  }

  draw();
  return () => { alive = false; try { ctx.synth.stopAll?.(); } catch { /* ignore */ } };
}
