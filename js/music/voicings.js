import { pc, chordSymbol, voicingMidis, STANDARD_TUNING } from './theory.js';
import { FIXED, TEMPLATES } from './voicings-data.js';

export { FIXED, TEMPLATES, voicingMidis };

// Default root spellings when only a pitch class is known.
export const ROOT_NAMES = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B'];

const FIXED_BY_ID = new Map(FIXED.map((v) => [v.id, v]));
const TEMPLATE_BY_ID = new Map(TEMPLATES.map((t) => [t.id, t]));
const STRING_LABEL = ['6th', '5th', '4th', '3rd', '2nd', '1st'];

function flatsFor(rootName) {
  if (rootName.includes('b')) return true;
  if (rootName.includes('#')) return false;
  return [1, 3, 8, 10].includes(pc(rootName));
}

/** Fret number shown at the top of a diagram (1 = show the nut). */
export function baseFretOf(frets) {
  const fretted = frets.filter((f) => f > 0);
  if (!fretted.length) return 1;
  return Math.max(...fretted) <= 5 ? 1 : Math.min(...fretted);
}

function fixedLabel(v) {
  if (v.id.endsWith('_open')) return 'Open';
  if (v.id.endsWith('_barre')) return 'Barre';
  if (v.id.endsWith('_slash')) return 'Slash chord';
  if (v.id.endsWith('_5th')) return 'Root on A string';
  return 'Passing chord';
}

function resolveFixed(v) {
  const rootPc = pc(v.root);
  const preferFlats = flatsFor(v.root);
  return {
    id: v.id, name: v.name || chordSymbol(rootPc, v.quality, preferFlats), rootPc,
    quality: v.quality, frets: [...v.frets], baseFret: baseFretOf(v.frets),
    fingers: v.fingers ? [...v.fingers] : null, preferFlats,
    label: fixedLabel(v), tags: ['fixed'],
  };
}

function templateLabel(t, rootFret) {
  const where = t.rootString === 2 ? 'Drop-2, root on D string'
    : t.id.startsWith('tri_') ? `Top-string triad, root on ${STRING_LABEL[t.rootString]} string`
      : `Root on ${STRING_LABEL[t.rootString]} string`;
  return `${where} · fret ${rootFret}`;
}

function resolveTemplate(t, rootName) {
  const rootPc = pc(rootName);
  const lowest = Math.min(...t.shape.filter((o) => o !== null));
  const start = t.openOk ? 0 : t.minRootFret;
  let rootFret = -1;
  for (let f = start; f < start + 24; f++) {
    if ((STANDARD_TUNING[t.rootString] + f) % 12 === rootPc && f + lowest >= 0) { rootFret = f; break; }
  }
  const frets = t.shape.map((o) => (o === null ? -1 : rootFret + o));
  const preferFlats = flatsFor(rootName);
  return {
    id: `${t.id}@${rootName}`, name: chordSymbol(rootPc, t.quality, preferFlats), rootPc,
    quality: t.quality, frets, baseFret: baseFretOf(frets), fingers: null, preferFlats,
    label: templateLabel(t, rootFret), tags: ['template'], rootFret,
  };
}

export function resolveVoicing(ref) {
  const at = ref.indexOf('@');
  if (at < 0) {
    const v = FIXED_BY_ID.get(ref);
    if (!v) throw new Error(`Unknown voicing: ${ref}`);
    return resolveFixed(v);
  }
  const t = TEMPLATE_BY_ID.get(ref.slice(0, at));
  if (!t) throw new Error(`Unknown voicing template: ${ref}`);
  return resolveTemplate(t, ref.slice(at + 1));
}

export function listVoicings({ quality, rootPc } = {}) {
  const out = [];
  for (const v of FIXED) {
    if (quality && v.quality !== quality) continue;
    if (rootPc != null && pc(v.root) !== rootPc) continue;
    out.push(resolveFixed(v));
  }
  const roots = rootPc == null ? ROOT_NAMES : [ROOT_NAMES[rootPc]];
  for (const t of TEMPLATES) {
    if (quality && t.quality !== quality) continue;
    for (const r of roots) out.push(resolveTemplate(t, r));
  }
  return out;
}
