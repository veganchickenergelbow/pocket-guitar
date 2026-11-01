// Spaced review: pick quiz questions from finished lessons. Pure, Node-testable.

function shuffled(arr, rand) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Every quiz question in completed lessons, keyed `${lessonId}:${blockIndex}:${questionIndex}`. */
export function reviewPool(state, lessons) {
  const done = (state && state.completed) || {};
  const out = [];
  for (const l of lessons) {
    if (!done[l.id]) continue;
    l.blocks.forEach((b, bi) => {
      if (b.type !== 'exercise' || !b.spec || b.spec.kind !== 'quiz') return;
      (b.spec.questions || []).forEach((q, qi) => {
        out.push({ key: `${l.id}:${bi}:${qi}`, lessonId: l.id, lessonTitle: l.title, q: q.q, options: q.options, answer: q.answer, explain: q.explain });
      });
    });
  }
  return out;
}

/** Up to n questions: missed ones first (most misses first), then random others. No duplicates. */
export function buildReview(state, lessons, n = 5, rand = Math.random) {
  const missed = (state && state.missed) || {};
  const pool = shuffled(reviewPool(state, lessons), rand); // shuffle first so ties are random
  const hit = pool.filter((p) => missed[p.key] > 0).sort((a, b) => missed[b.key] - missed[a.key]);
  const rest = pool.filter((p) => !(missed[p.key] > 0));
  return [...hit, ...rest].slice(0, n);
}
