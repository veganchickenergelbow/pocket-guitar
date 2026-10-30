// quiz: multiple choice, no audio. Pass at 60% or better.
import { h, button, injectStyle } from './_ui.js';

export function mount(container, spec, ctx) {
  injectStyle();
  const qs = spec.questions;
  let i = 0;
  let right = 0;
  let answered = false;

  const root = h('div', 'stack');
  container.append(root);
  ask();

  function ask() {
    root.replaceChildren();
    answered = false;
    const q = qs[i];
    const opts = h('div', 'ex-list');
    const fb = h('p', 'ex-fb');
    const next = button(i + 1 < qs.length ? 'Next question' : 'See result', 'btn btn-primary', () => {
      i += 1;
      if (i < qs.length) ask(); else done();
    });
    next.hidden = true;
    // Show options in a fresh random order each time so answer position can't be memorised.
    const btns = q.options.map((text, k) => button(text, 'btn ex-opt', () => pick(k)));
    shuffled(btns).forEach((b) => opts.append(b));
    function pick(k) {
      if (answered) return;
      answered = true;
      const ok = k === q.answer;
      if (ok) right += 1;
      btns[q.answer].classList.add('right');
      if (!ok) btns[k].classList.add('wrong');
      fb.textContent = (ok ? 'Right. ' : 'Not quite. ') + (q.explain || '');
      fb.className = 'ex-fb ' + (ok ? 'good' : 'bad');
      next.hidden = false;
    }
    root.append(
      h('div', 'eyebrow', `Question ${i + 1} of ${qs.length}`),
      h('div', 'ex-prompt', q.q), opts, fb, next,
    );
  }

  function done() {
    root.replaceChildren();
    const score = right / qs.length;
    const passed = score >= 0.6;
    root.append(
      h('div', 'ex-prompt', `${right} of ${qs.length} right`),
      h('p', 'muted', passed ? 'Solid. On to the next thing.' : 'Worth another pass. Re-read the lesson, then try again.'),
    );
    if (!passed) root.append(button('Try again', 'btn btn-primary', () => { i = 0; right = 0; ask(); }));
    ctx.onComplete?.({ passed, score });
  }

  return { destroy() { root.remove(); } };
}

function shuffled(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
