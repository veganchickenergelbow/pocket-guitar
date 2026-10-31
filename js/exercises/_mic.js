// Shared mic panel for listening exercises: Start button, level meter, Skip fallback, errors.
import { createListener, noteName } from '../audio/listener.js';
import { h, button, injectStyle } from './_ui.js';

const MESSAGES = {
  insecure: 'The mic only works on a secure (https) page. Use Skip for now.',
  unsupported: 'This browser cannot reach the mic. Use Skip for now.',
  denied: 'Mic access was blocked. Allow it in your browser settings and tap Start again, or use Skip.',
  unknown: 'Could not start the mic. Tap Start to retry, or use Skip.',
};
const SILENT_RMS = 0.0005; // below this the input is effectively dead, not just quiet
const SILENT_MS = 3000;

/** Only one panel listens at a time; starting another stops this one. */
let activePanel = null;

/**
 * opts: { ctx, onNote(note), onSkip() }  (notes more than 40 cents off are dropped)
 * returns { el, setStatus(text, kind?), stop(), destroy() }
 */
export function micPanel({ ctx, onNote, onSkip }) {
  injectStyle();
  const el = h('div', 'stack');
  const row = h('div', 'row');
  const fill = h('div', 'meter-fill');
  const meter = h('div', 'meter');
  meter.append(fill);
  const hearing = h('p', 'muted', '');
  hearing.style.margin = '0';
  hearing.style.fontSize = '0.9em';
  const status = h('p', 'muted ex-fb', 'Tap Start, then play.');
  let listener = null;
  let on = false;
  let loudSeen = false;
  let startedAt = 0;
  let lastPitchAt = 0;
  const self = { el, setStatus, stop, destroy: stop };

  const startBtn = button('Start listening', 'btn btn-primary', async () => {
    if (on) { stop(); setStatus('Stopped. Tap Start to listen again.'); return; }
    if (activePanel && activePanel !== self) activePanel.stop();
    try {
      const a4 = ctx?.store?.get?.().settings?.a4 ?? 440;
      loudSeen = false;
      listener = createListener({
        a4,
        onNote: (n) => { if (Math.abs(n.cents) <= 40) onNote(n); },
        onPitch: (p) => {
          lastPitchAt = performance.now();
          const c = Math.round(p.cents);
          hearing.textContent = `Hearing ${noteName(p.midi)} (${c > 0 ? '+' : ''}${c} cents)`;
        },
        onLevel: (rms) => {
          fill.style.width = Math.min(100, Math.round(rms * 600)) + '%';
          const now = performance.now();
          if (rms > SILENT_RMS) loudSeen = true;
          if (!loudSeen && now - startedAt > SILENT_MS) {
            hearing.textContent = 'The mic is hearing nothing at all. Stop and Start again. If it stays silent, close the app fully and reopen it.';
          } else if (now - lastPitchAt > 1500 && loudSeen) {
            hearing.textContent = rms > 0.008 ? 'Hearing sound, but no clear note yet. Pluck one string and let it ring.' : '';
          }
        },
      });
      startedAt = performance.now();
      await listener.start();
      on = true;
      activePanel = self;
      startBtn.textContent = 'Stop listening';
      setStatus('Listening. Play a note.');
    } catch (e) {
      listener = null;
      setStatus(MESSAGES[e && e.code] || MESSAGES.unknown, 'bad');
    }
  });
  const skipBtn = button('Skip / I did it', 'btn btn-ghost', () => { stop(); setStatus(''); onSkip(); });
  row.append(startBtn, skipBtn);
  el.append(row, meter, hearing, status);

  function setStatus(text, kind) {
    status.textContent = text;
    status.className = 'ex-fb ' + (kind || 'muted');
  }
  function stop() {
    if (listener) { try { listener.stop(); } catch (_) { /* ignore */ } }
    if (activePanel === self) activePanel = null;
    listener = null;
    on = false;
    startBtn.textContent = 'Start listening';
    fill.style.width = '0%';
    hearing.textContent = '';
  }
  return self;
}
