// harmonise-drill: endless multiple choice on Unit 13 ideas (fits | upgrade | approach).
// After you answer, "Hear it" plays the plain version, then the answer. Logs ear accuracy under 'harmonise'.
import { h, button, injectStyle } from './_ui.js';
import { makeQuestion } from '../music/harmonise.js';

const GAP_MS = 1200;

export function mount(container, spec, ctx) {
  injectStyle();
  const logAs = spec.logAs || 'harmonise';
  let round = 0;
  let right = 0;
  let answered = false;
  let timers = [];
  let dead = false;

  const root = h('div', 'stack');
  container.append(root);
  next();

  function clearTimers() { timers.forEach(clearTimeout); timers = []; }

  async function hear(play) {
    try {
      await ctx.synth.unlock();
      clearTimers();
      ctx.synth.stopAll?.();
      [...play.before, ...play.after].forEach((midis, k) => {
        timers.push(setTimeout(() => { if (!dead) ctx.synth.playChord(midis, { strum: 0.03, dur: 1.3 }); }, k * GAP_MS));
      });
    } catch (_) { /* audio unavailable */ }
  }

  function next() {
    if (dead) return;
    clearTimers();
    answered = false;
    const q = makeQuestion();
    root.replaceChildren();
    const opts = h('div', 'ex-list');
    const fb = h('p', 'ex-fb');
    const btns = q.options.map((text, k) => {
      const b = button(text, 'btn ex-opt', () => pick(k));
      opts.append(b);
      return b;
    });
    const row = h('div', 'row');
    const hearBtn = button('Hear it', 'btn', () => hear(q.play));
    const nextBtn = button('Next', 'btn btn-primary', () => { round += 1; next(); });
    row.append(hearBtn, nextBtn);
    row.style.display = 'none'; // .row sets display:flex, which beats [hidden]

    function pick(k) {
      if (answered) return;
      answered = true;
      const ok = k === q.answer;
      if (ok) right += 1;
      ctx.store?.logEar?.(logAs, ok);
      btns[q.answer].classList.add('right');
      if (!ok) btns[k].classList.add('wrong');
      fb.textContent = (ok ? 'Right. ' : 'Not quite. ') + q.explain;
      fb.className = 'ex-fb ' + (ok ? 'good' : 'bad');
      row.style.display = '';
    }
    root.append(h('div', 'eyebrow', `Question ${round + 1} · ${right} right`), h('div', 'ex-prompt', q.prompt), opts, fb, row);
  }

  return { destroy() { dead = true; clearTimers(); ctx.synth?.stopAll?.(); root.remove(); } };
}
