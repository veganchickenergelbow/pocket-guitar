import { h, checkMark } from '../dom.js';

export async function render(root, ctx) {
  const { store, navigate } = ctx;
  let curr;
  try { curr = await import('../content/curriculum.js'); }
  catch (e) {
    root.append(h('div', { class: 'screen' }, h('h1', { class: 'h1' }, 'Learn'),
      h('div', { class: 'callout' }, 'The curriculum could not be loaded yet. ', h('span', { class: 'mono small muted' }, e.message))));
    return;
  }

  const screen = h('div', { class: 'screen' });
  root.append(screen);

  function draw() {
    const state = store.get();
    const done = state.completed || {};
    const total = curr.UNITS.reduce((n, u) => n + u.lessons.length, 0);
    const doneCount = curr.UNITS.reduce((n, u) => n + u.lessons.filter((id) => done[id]).length, 0);
    screen.replaceChildren(
      h('div', { class: 'stack' },
        h('span', { class: 'eyebrow' }, `${doneCount} of ${total} lessons`),
        h('h1', { class: 'h1' }, 'Learn')),
      ...curr.UNITS.map((u) => {
        const n = u.lessons.filter((id) => done[id]).length;
        const pct = u.lessons.length ? Math.round((n / u.lessons.length) * 100) : 0;
        return h('section', { class: 'stack', 'aria-label': `Unit ${u.id}` },
          h('div', { class: 'stack', style: { gap: '8px' } },
            h('div', { class: 'row between' },
              h('span', { class: 'eyebrow' }, `Unit ${u.id}`),
              state.placementDone && state.startUnit === u.id && h('span', { class: 'chip' }, 'Starts here')),
            h('h2', { class: 'h2' }, u.title),
            u.blurb && h('p', { class: 'muted small' }, u.blurb),
            h('div', { class: 'progress', role: 'progressbar', 'aria-valuemin': 0, 'aria-valuemax': 100, 'aria-valuenow': pct, 'aria-label': `Unit ${u.id} progress` },
              h('div', { class: 'progress-fill', style: { width: pct + '%' } }))),
          h('div', { class: 'list' }, ...u.lessons.map((id) => {
            const l = curr.getLesson(id);
            if (!l) return null;
            return h('button', { class: 'list-row', type: 'button', onClick: () => navigate('lesson', { id }) },
              checkMark(!!done[id]),
              h('span', { class: 'grow' }, h('div', null, l.title), l.summary && h('div', { class: 'muted small' }, l.summary)),
              h('span', { class: 'mono small muted' }, `${l.minutes || 5}m`));
          })));
      }));
  }
  draw();
  return store.subscribe(draw);
}
