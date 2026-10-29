import { h } from '../dom.js';

// Default answer sets per mode (keys defined in exercises/ear-data.js).
const MODES = {
  interval: { label: 'Intervals', options: ['m3', 'M3', 'P4', 'P5', '8ve'] },
  quality: { label: 'Chord quality', options: ['maj', 'min', '7', 'maj7', 'm7'] },
  progression: { label: 'Progressions', options: ['I-vi-IV-V', 'I-iii-IV-V', 'I-IV-V-I', 'I-V-vi-IV'] },
};
let lastMode = 'quality';

export function render(root, ctx) {
  const { store } = ctx;
  let mode = lastMode;
  let handle = null;
  let gen = 0;

  const acc = h('p', { class: 'mono muted', role: 'status' });
  const stage = h('div', { class: 'stack' });
  const chips = h('div', { class: 'row' });
  root.append(h('div', { class: 'screen' },
    h('div', { class: 'stack' }, h('span', { class: 'eyebrow' }, 'Ear training'), h('h1', { class: 'h1' }, 'Listen, then name it')),
    chips, acc, stage));

  function drawAcc() {
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
    try {
      const mod = await import('../exercises/ear.js');
      if (mine !== gen) return;
      const spec = { kind: 'ear', mode, rounds: Infinity, options: MODES[mode].options };
      // The exercise logs each round itself via ctx.store.logEar(mode, right).
      handle = mod.mount(stage, spec, { ...ctx, onComplete: () => {} });
    } catch (e) {
      if (mine !== gen) return;
      stage.replaceChildren(h('div', { class: 'callout' }, 'The ear trainer could not load. ', h('span', { class: 'mono small muted' }, e.message)));
    }
  }

  drawChips(); drawAcc(); mount();
  const unsub = store.subscribe(drawAcc);
  return () => { gen++; unsub(); destroy(); };
}
