import { h } from '../dom.js';
import { renderSettings } from './settings.js';

// minutes per step for each session length
const PLANS = {
  10: { tune: 2, lesson: 6, ear: 2, play: 0 },
  20: { tune: 2, lesson: 10, ear: 4, play: 4 },
  30: { tune: 2, lesson: 14, ear: 6, play: 8 },
};

function lastCompleted(curr, state) {
  try {
    const ids = curr.allLessons().map((l) => l.id);
    let best = null;
    for (const id of Object.keys(state.completed)) {
      const i = ids.indexOf(id);
      if (i >= 0 && (best === null || i > best)) best = i;
    }
    return best === null ? null : curr.getLesson(ids[best]);
  } catch { return null; }
}

function greeting() {
  const hr = new Date().getHours();
  return hr >= 21 || hr < 5 ? 'Late-night session' : hr < 12 ? 'Morning session' : 'Today’s session';
}

export function render(root, ctx) {
  const { store, navigate } = ctx;
  let curr = null;
  let minutes = 20;
  let note = '';
  let alive = true;

  const main = h('div', { class: 'screen' });
  const settings = h('div', { class: 'stack' });
  root.append(h('div', { class: 'screen' }, main, settings));
  settings.append(renderSettings(ctx));

  import('../content/curriculum.js').then((m) => { curr = m; }).catch(() => { curr = false; }).then(() => { if (alive) draw(); });

  function statBlock(value, label) {
    return h('div', { class: 'stat' }, h('b', null, String(value)), h('span', null, label));
  }

  function nextCard(state) {
    if (curr === null) return h('p', { class: 'muted' }, 'Loading lessons…');
    let next = null;
    try { next = curr ? curr.getNextLesson(state) : null; } catch { /* ignore */ }
    if (!curr) return h('div', { class: 'card stack' }, h('span', { class: 'eyebrow' }, 'Next lesson'), h('p', { class: 'muted' }, 'Lessons are not available yet. Tuner, metronome and ear training still work.'));
    if (!next) return h('div', { class: 'card stack' }, h('span', { class: 'eyebrow' }, 'Next lesson'), h('h2', { class: 'h2' }, 'Every lesson done'), h('p', { class: 'muted' }, 'Revisit any lesson from Learn, or sharpen your ear.'));
    return h('div', { class: 'card stack' },
      h('span', { class: 'eyebrow' }, `Next lesson · Unit ${next.unit}`),
      h('h2', { class: 'h2' }, next.title),
      h('p', { class: 'muted' }, next.summary || ''),
      h('div', { class: 'row between' },
        h('span', { class: 'mono small muted' }, `${next.minutes || 5} min`),
        h('button', { class: 'btn-primary', type: 'button', onClick: () => navigate('lesson', { id: next.id }) }, 'Start lesson')));
  }

  function sessionCard(state) {
    const p = PLANS[minutes];
    const last = curr ? lastCompleted(curr, state) : null;
    let next = null;
    try { next = curr ? curr.getNextLesson(state) : null; } catch { /* ignore */ }
    const steps = [
      { t: 'Tune up', m: p.tune, go: () => navigate('tools', { tab: 'tuner' }) },
      next && { t: `Lesson: ${next.title}`, m: p.lesson + (last || !p.play ? 0 : p.play), go: () => navigate('lesson', { id: next.id }) },
      { t: 'Ear set: chord quality', m: p.ear, go: () => navigate('ear') },
      last && p.play && { t: `Play-along: ${last.title}`, m: p.play, go: () => navigate('lesson', { id: last.id }) },
    ].filter(Boolean);
    return h('div', { class: 'stack' },
      h('div', { class: 'row between' }, h('h2', { class: 'h2' }, 'Suggested session'),
        h('div', { class: 'row' }, ...[10, 20, 30].map((m) => h('button', {
          class: 'chip' + (m === minutes ? ' active' : ''), type: 'button', 'aria-pressed': String(m === minutes),
          onClick: () => { minutes = m; note = ''; draw(); },
        }, `${m} min`)))),
      h('div', { class: 'list' }, ...steps.map((s, i) => h('button', { class: 'list-row', type: 'button', onClick: s.go },
        h('span', { class: 'mono muted' }, String(i + 1).padStart(2, '0')),
        h('span', { class: 'grow' }, h('div', null, s.t)),
        h('span', { class: 'mono small muted' }, `${s.m}m`)))),
      h('div', { class: 'row' },
        h('button', { class: 'btn', type: 'button', onClick: () => { store.logPractice(minutes); note = `Logged ${minutes} minutes. Nice.`; draw(); } }, `Log ${minutes} min as done`),
        note && h('span', { class: 'small', style: { color: 'var(--good)' } }, note)));
  }

  function draw() {
    if (!alive) return;
    const state = store.get();
    main.replaceChildren(...[
      h('div', { class: 'stack' }, h('span', { class: 'eyebrow' }, 'Pocket'), h('h1', { class: 'h1' }, greeting())),
      h('div', { class: 'row', style: { gap: '32px' } }, statBlock(store.currentStreak(), 'day streak'), statBlock(store.weekMinutes(), 'min this week')),
      !state.placementDone && h('div', { class: 'callout stack' },
        h('p', null, 'Not sure where to start? A two-minute check places you in the right unit.'),
        h('div', null, h('button', { class: 'btn', type: 'button', onClick: () => navigate('placement') }, 'Find my starting point'))),
      nextCard(state),
      sessionCard(state)].filter(Boolean));
  }

  draw();
  const unsub = store.subscribe(() => { if (!note) draw(); });
  return () => { alive = false; unsub(); };
}
