// ear: synth plays, user picks. Modes: interval | quality | progression.
// Also used by the standalone Ear tab with spec { mode, rounds: Infinity }.
import { h, button, injectStyle } from './_ui.js';
import { chordPcs } from '../music/theory.js';
import {
  INTERVAL_SEMIS, PROGRESSIONS, DEFAULT_OPTIONS, optionLabel, stackPcs,
} from './ear-data.js';

const rnd = (n) => Math.floor(Math.random() * n);

export function mount(container, spec, ctx) {
  injectStyle();
  const mode = spec.mode || 'quality';
  const options = spec.options && spec.options.length ? spec.options : DEFAULT_OPTIONS[mode];
  const rounds = spec.rounds ?? 8;
  const endless = !Number.isFinite(rounds);
  let round = 0;
  let right = 0;
  let answered = false;
  let target = null;
  let play = null;
  let timers = [];
  let dead = false;

  const root = h('div', 'stack');
  container.append(root);
  next();

  function clearTimers() { timers.forEach(clearTimeout); timers = []; }

  function makeRound() {
    target = options[rnd(options.length)];
    if (mode === 'interval') {
      const lo = 52 + rnd(12); // E3-D#4: phone speakers are weak below that
      const hi = lo + INTERVAL_SEMIS[target];
      play = () => ctx.synth.playSequence([lo, hi], { gap: 0.75, dur: 1.5 });
    } else if (mode === 'quality') {
      // root lands in C3-B3, upper tones stack closely above it
      const rootPc = rnd(12);
      const voiced = stackPcs(chordPcs(rootPc, target), 48 + rootPc);
      play = () => ctx.synth.playChord(voiced, { strum: 0.04, dur: 2.2 });
    } else {
      const keyPc = rnd(12);
      const chords = PROGRESSIONS[target].map(([semi, q]) => {
        const rootPc = (keyPc + semi) % 12;
        const lo = 45 + (((rootPc - 45) % 12) + 12) % 12;
        return stackPcs(chordPcs(rootPc, q), lo);
      });
      play = () => {
        chords.forEach((midis, k) => {
          timers.push(setTimeout(() => { if (!dead) ctx.synth.playChord(midis, { strum: 0.03, dur: 1.3 }); }, k * 1150));
        });
      };
    }
  }

  async function playNow() {
    try {
      await ctx.synth.unlock();
      clearTimers();
      ctx.synth.stopAll?.();
      await play();
    } catch (_) { /* audio unavailable */ }
  }

  function header() {
    const total = endless ? '' : ` of ${rounds}`;
    return h('div', 'eyebrow', `Round ${round + 1}${total} · ${right} right`);
  }

  function next() {
    if (dead) return;
    if (!endless && round >= rounds) { finish(); return; }
    answered = false;
    makeRound();
    root.replaceChildren();
    const opts = h('div', 'ex-opts');
    const fb = h('p', 'ex-fb muted', 'Tap play, listen, then choose.');
    const btns = options.map((key) => {
      const b = button(optionLabel(mode, key), 'btn ex-opt', () => pick(key));
      opts.append(b);
      return [key, b];
    });
    const nextBtn = button('Next', 'btn btn-primary', () => { round += 1; next(); });
    nextBtn.hidden = true;
    const row = h('div', 'row');
    row.append(button('Play', 'btn btn-primary', playNow));
    if (endless) row.append(button('Finish', 'btn btn-ghost', () => { clearTimers(); finish(); }));

    function pick(key) {
      if (answered) return;
      answered = true;
      const ok = key === target;
      if (ok) right += 1;
      ctx.store?.logEar?.(mode, ok);
      btns.forEach(([k, b]) => {
        if (k === target) b.classList.add('right');
        else if (k === key) b.classList.add('wrong');
      });
      fb.textContent = ok ? 'Right.' : `Not quite. That was ${optionLabel(mode, target)}.`;
      fb.className = 'ex-fb ' + (ok ? 'good' : 'bad');
      nextBtn.hidden = false;
      nextBtn.textContent = !endless && round + 1 >= rounds ? 'See score' : 'Next';
    }
    root.append(header(), row, opts, fb, nextBtn);
  }

  function finish() {
    root.replaceChildren();
    const done = endless ? round + (answered ? 1 : 0) : rounds;
    const score = done ? right / done : 0;
    const passed = endless ? done > 0 : score >= 0.6;
    root.append(
      h('div', 'ex-prompt', `${right} of ${done} right`),
      h('p', 'muted', passed ? 'Your ears are warming up.' : 'Tricky ones. Run it again and listen for the character, not the notes.'),
      button('Go again', 'btn btn-primary', () => { round = 0; right = 0; next(); }),
    );
    ctx.onComplete?.({ passed, score });
  }

  return { destroy() { dead = true; clearTimers(); ctx.synth?.stopAll?.(); root.remove(); } };
}
