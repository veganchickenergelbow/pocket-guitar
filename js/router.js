// In-app router: lazy-loads view modules into #view. Views: render(container, ctx) -> cleanup?
import { h } from './dom.js';

export const ROUTES = {
  today: { load: () => import('./views/today.js'), tab: 'today' },
  learn: { load: () => import('./views/learn.js'), tab: 'learn' },
  lesson: { load: () => import('./views/lesson.js'), tab: 'learn' },
  ear: { load: () => import('./views/ear.js'), tab: 'ear' },
  tools: { load: () => import('./views/tools.js'), tab: 'tools' },
  placement: { load: () => import('./views/placement.js'), tab: null },
};
const SS_KEY = 'pocket.route';

export function savedRoute() {
  try {
    const r = JSON.parse(sessionStorage.getItem(SS_KEY) || 'null');
    if (r && ROUTES[r.route]) return r;
  } catch { /* storage unavailable */ }
  return null;
}

export function createRouter({ root, baseCtx, onRoute }) {
  let cleanup = null;
  let token = 0;
  let current = { route: 'today', params: {} };

  function runCleanup() {
    const c = cleanup; cleanup = null;
    try { c?.(); } catch (e) { console.error('view cleanup failed', e); }
  }

  function showError(route, err) {
    console.error(`view "${route}" failed`, err);
    root.replaceChildren(h('div', { class: 'screen' },
      h('div', { class: 'stack' },
        h('span', { class: 'eyebrow' }, 'Something stumbled'),
        h('h1', { class: 'h1' }, 'This screen would not load'),
        h('p', { class: 'muted' }, 'It may still be installing, or you may be offline without it cached. Try again, or head back to Today.'),
        h('p', { class: 'mono small muted' }, String(err && err.message || err)),
        h('div', { class: 'row' },
          h('button', { class: 'btn-primary', type: 'button', onClick: () => navigate(route, current.params) }, 'Try again'),
          h('button', { class: 'btn', type: 'button', onClick: () => navigate('today') }, 'Go to Today')))));
  }

  async function navigate(route, params = {}) {
    if (!ROUTES[route]) route = 'today';
    const mine = ++token;
    runCleanup();
    root.replaceChildren();
    current = { route, params };
    try { sessionStorage.setItem(SS_KEY, JSON.stringify(current)); } catch { /* ignore */ }
    onRoute?.(route, ROUTES[route].tab, params);
    try { window.scrollTo(0, 0); } catch { /* ignore */ }
    try {
      const mod = await ROUTES[route].load();
      if (mine !== token) return;
      const out = await mod.render(root, { ...baseCtx, navigate, params });
      const fn = typeof out === 'function' ? out : null;
      if (mine !== token) { try { fn?.(); } catch { /* ignore */ } return; }
      cleanup = fn;
    } catch (err) {
      if (mine === token) showError(route, err);
    }
  }

  return { navigate, current: () => current };
}
