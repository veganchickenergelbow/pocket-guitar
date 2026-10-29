// SVG builders. All colours come from CSS tokens so they follow the theme.
import { fretMidi, pcName } from '../music/theory.js';

const NS = 'http://www.w3.org/2000/svg';
const STYLE_KEYS = new Set(['fill', 'stroke', 'opacity']);

function el(tag, attrs = {}, text) {
  const e = document.createElementNS(NS, tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (STYLE_KEYS.has(k)) e.style.setProperty(k, String(v));
    else e.setAttribute(k, String(v));
  }
  if (text != null) e.textContent = text;
  return e;
}

const line = (x1, y1, x2, y2, stroke, w = 1, extra = {}) =>
  el('line', { x1, y1, x2, y2, stroke, 'stroke-width': w, 'stroke-linecap': 'round', ...extra });

function label(x, y, text, size, fill, anchor = 'middle') {
  return el('text', {
    x, y, fill, 'font-size': size, 'text-anchor': anchor, 'font-weight': 600,
    style: 'font-family:var(--font-mono),ui-monospace,monospace',
  }, text);
}

/** Lowest fretted fret that is shared by a contiguous run of >=3 strings, else null. */
function findBarre(frets) {
  const fretted = frets.filter((f) => f > 0);
  if (!fretted.length) return null;
  const m = Math.min(...fretted);
  const idx = frets.map((f, i) => (f === m ? i : -1)).filter((i) => i >= 0);
  if (idx.length < 3) return null;
  const [a, b] = [idx[0], idx[idx.length - 1]];
  for (let i = a; i <= b; i++) if (frets[i] < m) return null;
  return { fret: m, from: a, to: b };
}

export function chordDiagram(v, { width = 120, showNotes = false, rootPc, highlight } = {}) {
  const W = 120, H = 142, left = 22, right = 12, top = 28, fh = 20, rows = 5;
  const sp = (W - left - right) / 5;
  const sx = (s) => left + s * sp;
  const base = v.baseFret || 1;
  const root = rootPc ?? v.rootPc;
  const svg = el('svg', {
    viewBox: `0 0 ${W} ${H}`, width, height: Math.round((width * H) / W), role: 'img',
    'aria-label': `${v.name || 'Chord'} chord diagram, frets ${v.frets.map((f) => (f < 0 ? 'x' : f)).join(' ')}`,
  });
  svg.style.display = 'block';
  const bottom = top + rows * fh;

  for (let r = 1; r <= rows; r++) svg.append(line(sx(0), top + r * fh, sx(5), top + r * fh, 'var(--muted)', 1, { opacity: 0.5 }));
  for (let s = 0; s < 6; s++) svg.append(line(sx(s), top, sx(s), bottom, 'var(--muted)', 1.2, { opacity: 0.85 }));
  if (base <= 1) svg.append(line(sx(0) - 0.6, top, sx(5) + 0.6, top, 'var(--fg)', 4, { 'stroke-linecap': 'butt' }));
  else svg.append(label(left - 6, top + fh / 2 + 3, `${base}fr`, 9, 'var(--muted)', 'end'));

  const rowY = (fret) => top + (fret - base + 0.5) * fh;
  const barre = findBarre(v.frets);
  if (barre && barre.fret - base < rows) {
    const y = rowY(barre.fret);
    svg.append(el('rect', {
      x: sx(barre.from) - 7, y: y - 7, width: sx(barre.to) - sx(barre.from) + 14, height: 14, rx: 7,
      fill: 'var(--tone)', opacity: 0.45,
    }));
  }

  v.frets.forEach((f, s) => {
    if (f < 0) {
      const x = sx(s), y = top - 11, d = 3.2;
      svg.append(line(x - d, y - d, x + d, y + d, 'var(--muted)', 1.4), line(x - d, y + d, x + d, y - d, 'var(--muted)', 1.4));
    } else if (f === 0) {
      svg.append(el('circle', { cx: sx(s), cy: top - 11, r: 3.8, fill: 'none', stroke: 'var(--fg)', 'stroke-width': 1.4 }));
    } else {
      const row = f - base + 1;
      if (row < 1 || row > rows) return;
      const p = fretMidi(s, f) % 12;
      const dim = highlight && !highlight.includes(p);
      svg.append(el('circle', {
        cx: sx(s), cy: rowY(f), r: 7.4, fill: p === root ? 'var(--root)' : 'var(--tone)',
        opacity: dim ? 0.3 : 1,
      }));
      const finger = v.fingers && v.fingers[s];
      const text = showNotes ? pcName(p, v.preferFlats) : finger ? String(finger) : '';
      if (text) svg.append(label(sx(s), rowY(f) + 2.8, text, showNotes && text.length > 1 ? 7.5 : 8.5, 'var(--bg)'));
    }
  });
  return svg;
}

const INLAYS = [3, 5, 7, 9, 12];

export function fretboard({ from = 0, to = 12, marks = [], height = 150 } = {}) {
  const cells = to - from + 1, cw = 44, lp = 8, tp = 12, bp = 24;
  const W = lp + cells * cw + 8;
  const sp = (height - tp - bp) / 5;
  const sy = (s) => tp + (5 - s) * sp;
  const cx = (f) => lp + (f - from) * cw + cw / 2;
  const svg = el('svg', { viewBox: `0 0 ${W} ${height}`, width: W, height, role: 'img', 'aria-label': 'Guitar fretboard' });
  svg.style.display = 'block';
  svg.style.flex = 'none';
  const bottom = sy(0), x0 = lp;

  for (let f = from; f <= to; f++) {
    const x = x0 + (f - from + 1) * cw;
    const nut = f === 0;
    svg.append(line(x, tp, x, bottom, nut ? 'var(--fg)' : 'var(--muted)', nut ? 4 : 1.2, { opacity: nut ? 1 : 0.6, 'stroke-linecap': 'butt' }));
    svg.append(label(cx(f), height - 7, String(f), 10, 'var(--muted)'));
    if (INLAYS.includes(f)) {
      const mid = (tp + bottom) / 2, d = f === 12 ? [-sp, sp] : [0];
      for (const o of d) svg.append(el('circle', { cx: cx(f), cy: mid + o * 0.5, r: 4, fill: 'var(--line)' }));
    }
  }
  for (let s = 0; s < 6; s++) svg.append(line(x0, sy(s), x0 + cells * cw, sy(s), 'var(--muted)', 0.8 + (5 - s) * 0.25, { opacity: 0.85 }));

  for (const m of marks) {
    if (m.fret < from || m.fret > to) continue;
    const x = cx(m.fret), y = sy(m.string);
    const kind = m.kind || 'tone';
    if (kind === 'ghost') svg.append(el('circle', { cx: x, cy: y, r: 9, fill: 'none', stroke: 'var(--muted)', 'stroke-width': 1.3, opacity: 0.7, 'stroke-dasharray': '3 3' }));
    else if (kind === 'target') svg.append(el('circle', { cx: x, cy: y, r: 10, fill: 'var(--accent)', stroke: 'var(--fg)', 'stroke-width': 1.5 }));
    else svg.append(el('circle', { cx: x, cy: y, r: 9.5, fill: kind === 'root' ? 'var(--root)' : 'var(--tone)' }));
    if (m.label) svg.append(label(x, y + 3.4, m.label, m.label.length > 2 ? 8 : 10, kind === 'ghost' ? 'var(--muted)' : kind === 'target' ? 'var(--accent-ink)' : 'var(--bg)'));
  }
  return svg;
}
