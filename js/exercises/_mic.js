// Shared mic panel for listening exercises: Start button, level meter, Skip fallback, errors.
import { createListener } from '../audio/listener.js';
import { h, button, injectStyle } from './_ui.js';

const MESSAGES = {
  insecure: 'The mic only works on a secure (https) page. Use Skip for now.',
  unsupported: 'This browser cannot reach the mic. Use Skip for now.',
  denied: 'Mic access was blocked. Allow it in your browser settings and tap Start again, or use Skip.',
  unknown: 'Could not start the mic. Tap Start to retry, or use Skip.',
};

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
  const status = h('p', 'muted ex-fb', 'Tap Start, then play.');
  let listener = null;
  let on = false;

  const startBtn = button('Start listening', 'btn btn-primary', async () => {
    if (on) { stop(); return; }
    try {
      const a4 = ctx?.store?.get?.().settings?.a4 ?? 440;
      listener = createListener({
        a4,
        onNote: (n) => { if (Math.abs(n.cents) <= 40) onNote(n); },
        onLevel: (rms) => { fill.style.width = Math.min(100, Math.round(rms * 600)) + '%'; },
      });
      await listener.start();
      on = true;
      startBtn.textContent = 'Stop listening';
      setStatus('Listening. Play a note.');
    } catch (e) {
      listener = null;
      setStatus(MESSAGES[e && e.code] || MESSAGES.unknown, 'bad');
    }
  });
  const skipBtn = button('Skip / I did it', 'btn btn-ghost', () => { stop(); onSkip(); });
  row.append(startBtn, skipBtn);
  el.append(row, meter, status);

  function setStatus(text, kind) {
    status.textContent = text;
    status.className = 'ex-fb ' + (kind || 'muted');
  }
  function stop() {
    if (listener) { try { listener.stop(); } catch (_) { /* ignore */ } }
    listener = null;
    on = false;
    startBtn.textContent = 'Start listening';
    fill.style.width = '0%';
  }
  return { el, setStatus, stop, destroy: stop };
}
