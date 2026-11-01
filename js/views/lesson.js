// Lesson view: header, blocks in order, complete button, prev/next.
import { getLesson, allLessons, UNITS } from '../content/curriculum.js';
import { renderMarkdown } from '../ui/markdown.js';
import { resolveVoicing } from '../music/voicings.js';
import { voicingMidis } from '../music/theory.js';
import { chordDiagram, fretboard } from '../ui/diagram.js';

function h(tag, cls, text) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text != null) e.textContent = text;
  return e;
}
function btn(label, cls, onClick) {
  const b = h('button', cls, label);
  b.type = 'button';
  b.addEventListener('click', onClick);
  return b;
}

export function render(container, ctx) {
  const id = ctx.params && ctx.params.id;
  const lesson = getLesson(id);
  container.replaceChildren();
  const screen = h('div', 'screen stack');
  container.append(screen);
  if (!lesson) {
    screen.append(h('p', 'muted', 'That lesson was not found.'), btn('Back to lessons', 'btn', () => ctx.navigate('learn')));
    return undefined;
  }

  const mounted = [];
  let playToken = 0;
  const exercises = { total: 0, passed: new Set(), skipped: new Set() };
  const unit = UNITS.find((u) => u.id === lesson.unit);
  const completed = () => !!(ctx.store.get().completed || {})[lesson.id];

  screen.append(
    h('div', 'eyebrow', `Unit ${lesson.unit} · ${unit ? unit.title : ''}`),
    h('h1', 'h1', lesson.title),
    h('div', 'muted', `${lesson.minutes} min`),
  );

  async function playRefs(refs, mode) {
    const token = ++playToken;
    await ctx.synth.unlock();
    ctx.synth.stopAll?.();
    for (const ref of refs) {
      if (token !== playToken) return;
      const midis = voicingMidis(resolveVoicing(ref).frets);
      if (mode === 'arp') await ctx.synth.playSequence(midis, { gap: 0.35, dur: 1.4 });
      else await ctx.synth.playChord(midis, { dur: refs.length > 1 ? 1.3 : 2.2 });
    }
  }

  const blocks = {
    text: (b) => renderMarkdown(b.md),
    tip: (b) => {
      const d = h('div', 'callout');
      d.append(renderMarkdown(b.md));
      return d;
    },
    chords: (b) => {
      const wrap = h('div', 'stack');
      const row = h('div', 'diagram-row');
      for (const ref of b.refs) {
        const v = resolveVoicing(ref);
        const cell = btn('', 'btn-ghost', async () => {
          await ctx.synth.unlock();
          ctx.synth.playChord(voicingMidis(v.frets), { dur: 2.2 });
        });
        cell.style.cssText = 'display:flex;flex-direction:column;align-items:center;gap:4px;padding:var(--space-2);border:0;background:none;color:inherit;min-height:44px';
        cell.setAttribute('aria-label', `Hear ${v.name}`);
        cell.append(chordDiagram(v, { width: 120, showNotes: !!b.showNotes, rootPc: v.rootPc }), h('span', 'mono', v.name));
        row.append(cell);
      }
      wrap.append(row);
      if (b.caption) wrap.append(h('p', 'muted', b.caption));
      return wrap;
    },
    fretboard: (b) => {
      const wrap = h('div', 'stack');
      const box = h('div', 'scroll-x');
      box.append(fretboard({ from: b.from, to: b.to, marks: b.marks }));
      wrap.append(box);
      if (b.caption) wrap.append(h('p', 'muted', b.caption));
      return wrap;
    },
    listen: (b) => {
      const label = b.label || 'Listen';
      const run = async () => {
        if (b.refs) { await playRefs(b.refs, b.mode); return; }
        const token = ++playToken;
        await ctx.synth.unlock();
        if (token !== playToken) return;
        if (b.mode === 'strum') await ctx.synth.playChord(b.midis, { dur: 2.2 });
        else await ctx.synth.playSequence(b.midis, { gap: 0.7, dur: 1.5 });
      };
      return btn(`▶ ${label}`, 'btn', run);
    },
    exercise: (b, blockIndex) => {
      const idx = exercises.total++;
      const box = h('div', 'card stack');
      const slot = h('div');
      box.append(h('div', 'eyebrow', 'Try it'), slot);
      import(`../exercises/${b.spec.kind}.js`).then((mod) => {
        const exCtx = {
          ...ctx,
          quizKey: b.spec.kind === 'quiz' ? (i) => `${lesson.id}:${blockIndex}:${i}` : undefined,
          onComplete: (res) => {
            if (res && res.passed) { exercises.passed.add(idx); exercises.skipped.delete(idx); }
            else if (res && res.skipped && !exercises.passed.has(idx)) exercises.skipped.add(idx);
            refreshComplete();
          },
        };
        mounted.push(mod.mount(slot, b.spec, exCtx));
      }).catch((e) => { slot.append(h('p', 'muted', `This exercise could not load (${e.message}).`)); });
      return box;
    },
  };

  lesson.blocks.forEach((block, blockIndex) => {
    try {
      screen.append(blocks[block.type](block, blockIndex));
    } catch (e) {
      screen.append(h('p', 'muted', `Could not show this part (${e.message}).`));
    }
  });

  // Completion
  const done = h('div', 'card stack');
  const doneBtn = btn('Mark lesson complete', 'btn btn-primary', () => {
    ctx.store.completeLesson(lesson.id);
    refreshComplete();
  });
  const hint = h('p', 'muted');
  done.append(doneBtn, hint);
  screen.append(done);
  function refreshComplete() {
    if (completed()) {
      doneBtn.textContent = 'Completed';
      doneBtn.disabled = true;
      hint.textContent = 'Nice work. Next lesson is below.';
      return;
    }
    const all = exercises.total === 0 || exercises.passed.size >= exercises.total;
    doneBtn.className = all ? 'btn btn-primary' : 'btn';
    hint.textContent = exercises.total
      ? `${exercises.passed.size} of ${exercises.total} exercises done${exercises.skipped.size ? `, ${exercises.skipped.size} skipped` : ''}. Mark complete whenever you have played it.`
      : 'Mark complete once you have played it.';
  }
  refreshComplete();

  // Prev / next
  const list = allLessons();
  const at = list.findIndex((l) => l.id === lesson.id);
  const nav = h('div', 'row');
  if (at > 0) nav.append(btn('← Previous', 'btn btn-ghost', () => ctx.navigate('lesson', { id: list[at - 1].id })));
  if (at < list.length - 1) nav.append(btn('Next lesson →', 'btn', () => ctx.navigate('lesson', { id: list[at + 1].id })));
  screen.append(nav);

  return () => {
    playToken += 1;
    mounted.forEach((m) => { try { m && m.destroy && m.destroy(); } catch (_) { /* ignore */ } });
    ctx.synth.stopAll?.();
  };
}
