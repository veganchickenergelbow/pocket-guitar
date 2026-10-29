// Guitar tuner screen.
import { createListener } from '../audio/listener.js';

const STRINGS = [
  { label: 'E', name: 'E2', midi: 40 },
  { label: 'A', name: 'A2', midi: 45 },
  { label: 'D', name: 'D3', midi: 50 },
  { label: 'G', name: 'G3', midi: 55 },
  { label: 'B', name: 'B3', midi: 59 },
  { label: 'e', name: 'E4', midi: 64 },
];
const NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const IN_TUNE = 5;
const IDLE_MS = 800;

const ERRORS = {
  insecure: 'The microphone only works on a secure page. Open the app over https (or localhost).',
  unsupported: 'This browser or device has no usable microphone support.',
  denied: 'Microphone access was blocked. Allow it in your browser or iOS Settings, then tap Start again.',
  unknown: 'Something went wrong opening the microphone. Try again.',
};

const CSS = `
.tn-note{font-family:var(--font-display);font-size:96px;line-height:1;text-align:center;color:var(--fg);transition:color .15s}
.tn-note.ok{color:var(--good)}
.tn-sub{text-align:center;min-height:1.4em}
.tn-strip{position:relative;height:56px;margin:var(--space-3) var(--space-2);border-radius:var(--r-md);background:var(--surface-2);border:1px solid var(--line)}
.tn-zone{position:absolute;top:0;bottom:0;left:45%;width:10%;background:var(--good);opacity:.16}
.tn-tick{position:absolute;bottom:0;width:1px;height:10px;background:var(--line)}
.tn-tick.big{height:18px;background:var(--muted)}
.tn-needle{position:absolute;top:6px;bottom:6px;width:4px;margin-left:-2px;border-radius:2px;background:var(--accent);left:50%;transition:left .12s ease-out,background .15s}
.tn-needle.ok{background:var(--good)}
.tn-cents{text-align:center;font-size:20px;min-height:1.4em}
.tn-strings{justify-content:center}
.tn-strings .chip{min-width:48px;min-height:44px;justify-content:center;cursor:pointer;font-size:16px}
.tn-idle .tn-note,.tn-idle .tn-needle{opacity:.45}
@media (prefers-reduced-motion:reduce){.tn-needle,.tn-note{transition:none}}
`;

/** @param {string} html @returns {HTMLElement} */
function el(html) {
  const t = document.createElement('template');
  t.innerHTML = html.trim();
  return /** @type {HTMLElement} */ (t.content.firstElementChild);
}

/**
 * @param {HTMLElement} container
 * @param {{store: {get: () => any}}} ctx
 * @returns {() => void} cleanup
 */
export function render(container, ctx) {
  if (!document.getElementById('tuner-styles')) {
    const s = document.createElement('style');
    s.id = 'tuner-styles';
    s.textContent = CSS;
    document.head.appendChild(s);
  }
  const settings = (ctx && ctx.store && ctx.store.get().settings) || {};
  const a4 = Number(settings.a4) || 440;

  const ticks = [];
  for (let c = -50; c <= 50; c += 10) {
    ticks.push(`<i class="tn-tick${c % 50 === 0 ? ' big' : ''}" style="left:${c + 50}%"></i>`);
  }
  const root = el(`
    <div class="screen stack tn-idle">
      <div class="eyebrow">Tuner</div>
      <div class="card stack">
        <div class="tn-note" aria-live="polite">&ndash;</div>
        <div class="tn-sub muted mono">Tap Start, then pluck a string</div>
        <div class="tn-strip"><span class="tn-zone"></span>${ticks.join('')}<span class="tn-needle"></span></div>
        <div class="tn-cents mono">&nbsp;</div>
        <div class="tn-hint muted" style="text-align:center;min-height:1.4em"></div>
      </div>
      <div class="row tn-strings" role="group" aria-label="Target string">
        <button class="chip active" data-s="auto">Auto</button>
        ${STRINGS.map((s, i) => `<button class="chip" data-s="${i}" aria-label="String ${6 - i}, ${s.name}">${s.label}</button>`).join('')}
      </div>
      <button class="btn btn-primary tn-go" style="min-height:48px">Start listening</button>
      <div class="callout tn-err" role="alert" hidden></div>
      <div class="muted mono" style="text-align:center">A4 = ${a4} Hz &middot; standard tuning</div>
    </div>`);
  container.replaceChildren(root);

  const $ = (sel) => root.querySelector(sel);
  const noteEl = $('.tn-note'), subEl = $('.tn-sub'), needle = $('.tn-needle');
  const centsEl = $('.tn-cents'), hintEl = $('.tn-hint'), goBtn = $('.tn-go'), errEl = $('.tn-err');

  let selected = -1; // -1 = auto
  let listening = false;
  let busy = false;
  let lastHeard = 0;
  let smooth = null;
  let lastTarget = -2;

  function setIdle(idle) { root.classList.toggle('tn-idle', idle); }

  function showCents(c, target) {
    const ok = Math.abs(c) <= IN_TUNE;
    noteEl.textContent = target.name;
    noteEl.classList.toggle('ok', ok);
    needle.classList.toggle('ok', ok);
    needle.style.left = `${Math.max(-50, Math.min(50, c)) + 50}%`;
    const r = Math.round(c);
    centsEl.textContent = `${r > 0 ? '+' : ''}${r}¢`;
    centsEl.style.color = ok ? 'var(--good)' : 'var(--fg)';
    hintEl.textContent = ok ? 'In tune' : c < 0 ? 'A bit low — tighten the string' : 'A bit high — loosen the string';
  }

  function onPitch(p) {
    const f = p.midi + p.cents / 100;
    let ti = selected;
    if (ti < 0) {
      let best = 0;
      STRINGS.forEach((s, i) => { if (Math.abs(f - s.midi) < Math.abs(f - STRINGS[best].midi)) best = i; });
      ti = best;
    }
    const target = STRINGS[ti];
    const c = (f - target.midi) * 100;
    smooth = ti !== lastTarget || smooth === null ? c : smooth * 0.55 + c * 0.45;
    lastTarget = ti;
    lastHeard = performance.now();
    setIdle(false);
    showCents(smooth, target);
    subEl.textContent = `heard ${NAMES[((p.midi % 12) + 12) % 12]}${Math.floor(p.midi / 12) - 1} · ${p.freq.toFixed(1)} Hz`;
  }

  const listener = createListener({ onPitch, a4 });
  const idleTimer = setInterval(() => {
    if (listening && performance.now() - lastHeard > IDLE_MS) { setIdle(true); smooth = null; }
  }, 200);

  function showError(code) {
    errEl.textContent = ERRORS[code] || ERRORS.unknown;
    errEl.hidden = false;
  }

  function stop() {
    listener.stop();
    listening = false;
    goBtn.textContent = 'Start listening';
    goBtn.classList.add('btn-primary');
    setIdle(true);
    subEl.textContent = 'Tap Start, then pluck a string';
  }

  goBtn.addEventListener('click', async () => {
    if (busy) return;
    if (listening) { stop(); return; }
    busy = true;
    errEl.hidden = true;
    goBtn.textContent = 'Starting…';
    try {
      await listener.start();
      listening = true;
      lastHeard = performance.now();
      goBtn.textContent = 'Stop';
      goBtn.classList.remove('btn-primary');
      subEl.textContent = 'Listening… pluck a string';
    } catch (err) {
      goBtn.textContent = 'Start listening';
      showError(err && err.code);
    } finally {
      busy = false;
    }
  });

  root.querySelector('.tn-strings').addEventListener('click', (e) => {
    const b = e.target.closest('button[data-s]');
    if (!b) return;
    selected = b.dataset.s === 'auto' ? -1 : Number(b.dataset.s);
    root.querySelectorAll('.tn-strings .chip').forEach((c) => c.classList.toggle('active', c === b));
    smooth = null;
    if (selected >= 0) { noteEl.textContent = STRINGS[selected].name; }
  });

  return () => {
    clearInterval(idleTimer);
    listener.stop();
  };
}
