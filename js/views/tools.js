import { h } from '../dom.js';

const TABS = [
  { id: 'tuner', label: 'Tuner', load: () => import('./tuner.js') },
  { id: 'metronome', label: 'Metronome', load: () => import('./metronome-ui.js') },
  { id: 'library', label: 'Chords', load: () => import('./library.js') },
];

export function render(root, ctx) {
  const tab = TABS.find((t) => t.id === ctx.params?.tab) || TABS[0];
  let cleanup = null;
  let alive = true;

  const body = h('div', { class: 'stack' });
  root.append(h('div', { class: 'screen' },
    h('div', { class: 'stack' }, h('span', { class: 'eyebrow' }, 'Tools'), h('h1', { class: 'h1' }, tab.label)),
    h('div', { class: 'seg', role: 'group', 'aria-label': 'Tool' }, ...TABS.map((t) => h('button', {
      type: 'button', 'aria-pressed': String(t.id === tab.id),
      onClick: () => { if (t.id !== tab.id) ctx.navigate('tools', { tab: t.id }); },
    }, t.label))),
    body));

  (async () => {
    try {
      const mod = await tab.load();
      if (!alive) return;
      const c = await mod.render(body, ctx);
      if (!alive) { try { c?.(); } catch { /* ignore */ } return; }
      cleanup = typeof c === 'function' ? c : null;
    } catch (e) {
      if (!alive) return;
      body.replaceChildren(h('div', { class: 'callout stack' },
        h('p', null, `The ${tab.label.toLowerCase()} could not load. Check your connection and try again.`),
        h('p', { class: 'mono small muted' }, e.message),
        h('div', null, h('button', { class: 'btn', type: 'button', onClick: () => ctx.navigate('tools', { tab: tab.id }) }, 'Retry'))));
    }
  })();

  return () => { alive = false; try { cleanup?.(); } catch (e) { console.error(e); } };
}
