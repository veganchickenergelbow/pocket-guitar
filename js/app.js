// Pocket entry: builds ctx, wires tab bar, theme, service worker, and starts the router.
import * as store from './store.js';
import { createRouter, savedRoute } from './router.js';

const synthStub = {
  unlock: async () => {}, getContext: () => null, playMidi() {},
  playChord: async () => {}, playSequence: async () => {}, stopAll() {},
};

async function loadSynth() {
  try { return await import('./audio/synth.js'); } catch (e) { console.warn('synth unavailable', e); return synthStub; }
}

function applyTheme() {
  const t = store.get().settings.theme;
  const el = document.documentElement;
  if (t === 'dark' || t === 'light') el.setAttribute('data-theme', t); else el.removeAttribute('data-theme');
}

function highlightTab(tab) {
  document.querySelectorAll('#tabbar .tab').forEach((b) => {
    if (b.dataset.route === tab) b.setAttribute('aria-current', 'page'); else b.removeAttribute('aria-current');
  });
}

async function boot() {
  applyTheme();
  // Ask the browser not to evict our storage (iOS may still wipe uninstalled sites after 7 idle days).
  try { navigator.storage?.persist?.()?.catch?.(() => {}); } catch { /* unsupported */ }
  store.subscribe(applyTheme);
  const synth = await loadSynth();
  // iOS only lets audio start from a user gesture: unlock on the first touch anywhere.
  addEventListener('pointerdown', () => { Promise.resolve(synth.unlock?.()).catch(() => {}); }, { once: true });

  const root = document.getElementById('view');
  const router = createRouter({
    root,
    baseCtx: { store, synth },
    onRoute: (_route, tab) => highlightTab(tab),
  });
  document.querySelectorAll('#tabbar .tab').forEach((b) => {
    b.addEventListener('click', () => router.navigate(b.dataset.route));
  });

  const saved = savedRoute();
  if (!store.get().placementDone) router.navigate('placement');
  else if (saved) router.navigate(saved.route, saved.params || {});
  else router.navigate('today');

  if ('serviceWorker' in navigator) {
    addEventListener('load', () => { navigator.serviceWorker.register('sw.js').catch((e) => console.warn('sw failed', e)); });
  }
}

boot();
