// Pure music theory helpers. Strings: 0 = low E ... 5 = high e.
export const NOTE_SHARP = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
export const NOTE_FLAT = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];
export const STANDARD_TUNING = [40, 45, 50, 55, 59, 64];

const LETTER = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
const mod12 = (n) => ((n % 12) + 12) % 12;

function parseNote(name) {
  const m = /^([A-G])([#b\u266F\u266D]*)(-?\d+)?$/.exec(String(name).trim());
  if (!m) throw new Error(`Bad note name: ${name}`);
  let n = LETTER[m[1]];
  for (const ch of m[2]) n += ch === '#' || ch === '\u266F' ? 1 : -1;
  return { n, octave: m[3] === undefined ? null : parseInt(m[3], 10) };
}

export function pc(name) { return mod12(parseNote(name).n); }

export function noteToMidi(name) {
  const { n, octave } = parseNote(name);
  return ((octave ?? 4) + 1) * 12 + n;
}

export function pcName(p, preferFlats = false) {
  return (preferFlats ? NOTE_FLAT : NOTE_SHARP)[mod12(p)];
}

export function midiToName(midi, preferFlats = false) {
  return `${pcName(midi, preferFlats)}${Math.floor(midi / 12) - 1}`;
}

export function midiToFreq(midi, a4 = 440) { return a4 * Math.pow(2, (midi - 69) / 12); }
export function freqToMidi(freq, a4 = 440) { return 69 + 12 * Math.log2(freq / a4); }

const FLAT_MAJOR = new Set(['F', 'Bb', 'Eb', 'Ab', 'Db', 'Gb']);
const FLAT_MINOR = new Set(['D', 'G', 'C', 'F']);

/** 'F' -> true, 'G' -> false, 'Dm' -> true, 'Em' -> false, 'Bb' -> true. */
export function preferFlatsFor(keyName) {
  const m = /^([A-G][#b]?)(m|min|minor)?$/.exec(String(keyName).trim());
  if (!m) return false;
  const root = m[1];
  if (root.includes('#')) return false;
  if (root.includes('b')) return true;
  return m[2] ? FLAT_MINOR.has(root) : FLAT_MAJOR.has(root);
}

const IV = [
  ['P1', 'unison'], ['m2', 'minor 2nd'], ['M2', 'major 2nd'], ['m3', 'minor 3rd'],
  ['M3', 'major 3rd'], ['P4', 'perfect 4th'], ['TT', 'tritone'], ['P5', 'perfect 5th'],
  ['m6', 'minor 6th'], ['M6', 'major 6th'], ['m7', 'minor 7th'], ['M7', 'major 7th'],
  ['P8', 'octave'], ['m9', 'minor 9th'], ['M9', 'major 9th'],
];
export const INTERVALS = IV.map(([short, name], semitones) => ({ semitones, short, name }));

export const SCALES = {
  major: [0, 2, 4, 5, 7, 9, 11],
  naturalMinor: [0, 2, 3, 5, 7, 8, 10],
  majorPentatonic: [0, 2, 4, 7, 9],
  minorPentatonic: [0, 3, 5, 7, 10],
  dorian: [0, 2, 3, 5, 7, 9, 10],
  mixolydian: [0, 2, 4, 5, 7, 9, 10],
};

export function scaleNotes(rootPc, scaleName) {
  const s = SCALES[scaleName];
  if (!s) throw new Error(`Unknown scale: ${scaleName}`);
  return s.map((i) => mod12(rootPc + i));
}

// intervals = allowed pitch classes relative to root; required = must be present.
const C = (symbol, intervals, required) => ({ symbol, intervals, required });
export const CHORDS = {
  maj: C('', [0, 4, 7], [0, 4]),
  min: C('m', [0, 3, 7], [0, 3]),
  dim: C('dim', [0, 3, 6], [0, 3, 6]),
  aug: C('aug', [0, 4, 8], [0, 4, 8]),
  sus2: C('sus2', [0, 2, 7], [0, 2]),
  sus4: C('sus4', [0, 5, 7], [0, 5]),
  add9: C('add9', [0, 2, 4, 7], [0, 4, 2]),
  6: C('6', [0, 4, 7, 9], [0, 4, 9]),
  m6: C('m6', [0, 3, 7, 9], [0, 3, 9]),
  maj7: C('maj7', [0, 4, 7, 11], [0, 4, 11]),
  m7: C('m7', [0, 3, 7, 10], [0, 3, 10]),
  7: C('7', [0, 4, 7, 10], [0, 4, 10]),
  m7b5: C('m7b5', [0, 3, 6, 10], [0, 3, 6, 10]),
  dim7: C('dim7', [0, 3, 6, 9], [0, 3, 6, 9]),
  9: C('9', [0, 2, 4, 7, 10], [0, 4, 10, 2]),
  maj9: C('maj9', [0, 2, 4, 7, 11], [0, 4, 11, 2]),
  m9: C('m9', [0, 2, 3, 7, 10], [0, 3, 10, 2]),
  m11: C('m11', [0, 2, 3, 5, 7, 10], [0, 3, 10, 5]),
  13: C('13', [0, 2, 4, 5, 7, 9, 10], [0, 4, 10, 9]),
  '7sus4': C('7sus4', [0, 5, 7, 10], [0, 5, 10]),
  'maj7#11': C('maj7#11', [0, 4, 7, 11, 18], [0, 4, 11, 18]),
  '9sus4': C('9sus4', [0, 5, 7, 10, 14], [0, 5, 10, 14]),
  '13sus4': C('13sus4', [0, 5, 7, 10, 14, 21], [0, 5, 10, 21]),
};

export function chordPcs(rootPc, quality) {
  return CHORDS[quality].intervals.map((i) => mod12(rootPc + i));
}

export function chordSymbol(rootPc, quality, preferFlats = false) {
  return pcName(rootPc, preferFlats) + CHORDS[quality].symbol;
}

const MAJ_DEG = [
  ['I', 'maj', 'maj7'], ['ii', 'min', 'm7'], ['iii', 'min', 'm7'], ['IV', 'maj', 'maj7'],
  ['V', 'maj', '7'], ['vi', 'min', 'm7'], ['vii\u00B0', 'dim', 'm7b5'],
];
const MIN_DEG = [
  ['i', 'min', 'm7'], ['ii\u00B0', 'dim', 'm7b5'], ['III', 'maj', 'maj7'], ['iv', 'min', 'm7'],
  ['v', 'min', 'm7'], ['VI', 'maj', 'maj7'], ['VII', 'maj', '7'],
];
const SEVENTH_SUFFIX = { maj7: 'maj7', m7: '7', 7: '7', m7b5: '\u00F87' };

export function diatonicChords(keyPc, { sevenths = false, minor = false } = {}) {
  const scale = SCALES[minor ? 'naturalMinor' : 'major'];
  return (minor ? MIN_DEG : MAJ_DEG).map(([degree, triad, seventh], i) => {
    const rootPc = mod12(keyPc + scale[i]);
    if (!sevenths) return { degree, roman: degree, rootPc, quality: triad };
    const base = degree.replace('\u00B0', '');
    const roman = base + SEVENTH_SUFFIX[seventh];
    return { degree, roman, rootPc, quality: seventh };
  });
}

export function fretMidi(stringIdx, fret) { return STANDARD_TUNING[stringIdx] + fret; }

export function voicingMidis(frets) {
  const out = [];
  frets.forEach((f, s) => { if (f >= 0) out.push(fretMidi(s, f)); });
  return out;
}

export function analyzeVoicing(frets, rootPc, quality, { rootless = false } = {}) {
  const def = CHORDS[quality];
  if (!def) throw new Error(`Unknown quality: ${quality}`);
  const present = new Set(voicingMidis(frets).map((m) => mod12(m - rootPc)));
  // Compound intervals (14, 18, 21) are compared by pitch class.
  const allowed = def.intervals.map(mod12);
  const missing = def.required.filter((i) => !(rootless && i === 0) && !present.has(mod12(i)));
  const extra = [...present].filter((i) => !allowed.includes(i)).map((i) => mod12(rootPc + i));
  return { ok: missing.length === 0 && extra.length === 0, missing, extra };
}

export function fretsForPc(p, stringIdx, maxFret = 12) {
  const out = [];
  for (let f = 0; f <= maxFret; f++) if (mod12(STANDARD_TUNING[stringIdx] + f) === mod12(p)) out.push(f);
  return out;
}
