import { h } from '../dom.js';
import { buildReview } from '../content/review.js';

// minutes per step for each session length
const PLANS = {
  10: { tune: 2, lesson: 6, ear: 2, play: 0 },
  20: { tune: 2, lesson: 10, ear: 4, play: 4 },
  30: { tune: 2, lesson: 14, ear: 6, play: 8 },
};

// Most recent completed lesson (curriculum order) that has a play-along (progression) exercise.
function lastPlayAlong(curr, state) {
  try {
    const ids = curr.allLessons().map((l) => l.id);
    const has = (l) => l.blocks.some((b) => b.type === 'exercise' && b.spec && b.spec.kind === 'progression');
    for (let i = ids.length - 1; i >= 0; i--) {
      if (!state.completed[ids[i]]) continue;
      const l = curr.getLesson(ids[i]);
      if (l && has(l)) return l;
    }
  } catch { /* ignore */ }
  return null;
}

const EAR_LABEL = {
  interval: 'intervals', quality: 'chord quality', progression: 'progressions',
  colour: 'colour chords', soul: 'soul moves', harmonise: 'harmonise drill',
};
/** Weakest ear mode: under-practised (<5 rounds, fewest first) before lowest accuracy. */
function earPick(ear = {}) {
  const modes = Object.keys(EAR_LABEL);
  const tot = (m) => (ear[m] && ear[m].total) || 0;
  const acc = (m) => ear[m].right / ear[m].total;
  const few = modes.filter((m) => tot(m) < 5).sort((a, b) => tot(a) - tot(b));
  if (few.length) return few[0];
  return modes.sort((a, b) => acc(a) - acc(b))[0];
}

const installed = () => {
  try { return navigator.standalone === true || matchMedia('(display-mode: standalone)').matches; } catch { return false; }
};
function backupStale(last) {
  if (!last) return true;
  const t = Date.parse(`${last}T12:00:00`);
  return !(t > 0) || Date.now() - t > 14 * 86400000;
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
  root.append(h('div', { class: 'screen' }, main));

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
    const last = curr ? lastPlayAlong(curr, state) : null;
    const earMode = earPick(state.ear);
    let next = null;
    try { next = curr ? curr.getNextLesson(state) : null; } catch { /* ignore */ }
    let review = [];
    try { if (curr) review = buildReview(state, curr.allLessons(), 5); } catch { /* ignore */ }
    const revMin = review.length >= 3 ? 3 : 0; // taken from the lesson time
    const steps = [
      { t: 'Tune up', m: p.tune, go: () => navigate('tools', { tab: 'tuner' }) },
      next && { t: `Lesson: ${next.title}`, m: p.lesson - revMin + (last || !p.play ? 0 : p.play), go: () => navigate('lesson', { id: next.id }) },
      revMin && { t: `Review: ${review.length} questions`, m: revMin, go: () => navigate('ear', { mode: 'review' }) },
      { t: `Ear set: ${EAR_LABEL[earMode]}`, m: p.ear, go: () => navigate('ear', { mode: earMode }) },
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

  // At most one: install nudge, else a stale-backup nudge once there is progress to lose.
  function protectCard(state) {
    if (!installed()) {
      return h('div', { class: 'callout' }, 'Add Pocket to your Home Screen (Share → Add to Home Screen) so Safari keeps your progress.');
    }
    if (Object.keys(state.completed).length && backupStale(state.lastBackup)) {
      return h('div', { class: 'callout stack' },
        h('p', null, 'Back up your progress'),
        h('div', null, h('button', { class: 'btn', type: 'button', onClick: () => navigate('tools', { tab: 'settings' }) }, 'Open backup')));
    }
    return null;
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
      protectCard(state),
      nextCard(state),
      sessionCard(state)].filter(Boolean));
  }

  draw();
  const unsub = store.subscribe(() => { if (!note) draw(); });
  return () => { alive = false; unsub(); };
}
