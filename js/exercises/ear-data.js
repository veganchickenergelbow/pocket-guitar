// Pure data + helpers for the ear exercise (Node-testable, no DOM, no audio).

export const INTERVAL_SEMIS = {
  m2: 1, M2: 2, m3: 3, M3: 4, P4: 5, TT: 6, P5: 7, m6: 8, M6: 9, m7: 10, M7: 11, '8ve': 12,
};
export const INTERVAL_LABELS = {
  m2: 'minor 2nd', M2: 'major 2nd', m3: 'minor 3rd', M3: 'major 3rd', P4: 'perfect 4th',
  TT: 'tritone', P5: 'perfect 5th', m6: 'minor 6th', M6: 'major 6th', m7: 'minor 7th',
  M7: 'major 7th', '8ve': 'octave',
};
export const QUALITY_LABELS = {
  maj: 'major', min: 'minor', dim: 'diminished', aug: 'augmented', sus2: 'sus2', sus4: 'sus4',
  add9: 'add9', maj7: 'maj7', m7: 'minor 7', '7': 'dominant 7', m7b5: 'm7b5', dim7: 'dim7',
  maj9: 'maj9', m9: 'minor 9', '9': 'dominant 9', '13': 'dominant 13',
};

// Progressions as [semitones above key root, chord quality]. Keys are the option strings.
const M = 'maj';
const m = 'min';
export const PROGRESSIONS = {
  'I-vi-IV-V': [[0, M], [9, m], [5, M], [7, M]],
  'I-iii-IV-V': [[0, M], [4, m], [5, M], [7, M]],
  'I-IV-V-I': [[0, M], [5, M], [7, M], [0, M]],
  'I-V-vi-IV': [[0, M], [7, M], [9, m], [5, M]],
  'I-vi-ii-V': [[0, M], [9, m], [2, m], [7, M]],
  'I-III7-vi-IV': [[0, M], [4, '7'], [9, m], [5, M]],
  'I-iii-vi-IV': [[0, M], [4, m], [9, m], [5, M]],
  'I-IV-iv-I': [[0, M], [5, M], [5, m], [0, M]],
  'i-iv-v-i': [[0, m], [5, m], [7, m], [0, m]],
  'i-iv-V7-i': [[0, m], [5, m], [7, '7'], [0, m]],
  'ii7-V7-Imaj7': [[2, 'm7'], [7, '7'], [0, 'maj7']],
};

export const DEFAULT_OPTIONS = {
  interval: ['m3', 'M3', 'P4', 'P5', '8ve'],
  quality: ['maj', 'min'],
  progression: ['I-vi-IV-V', 'I-iii-IV-V', 'I-IV-V-I', 'I-V-vi-IV'],
};

export function optionLabel(mode, key) {
  if (mode === 'interval') return INTERVAL_LABELS[key] || key;
  if (mode === 'quality') return QUALITY_LABELS[key] || key;
  return key.replace(/-/g, ' – ');
}

export function isValidOption(mode, key) {
  if (mode === 'interval') return key in INTERVAL_SEMIS;
  if (mode === 'progression') return key in PROGRESSIONS;
  return mode === 'quality' && typeof key === 'string' && key.length > 0;
}

/** Stack pitch classes upward from the lowest note placed at/above `lo` (midi). */
export function stackPcs(pcs, lo) {
  const out = [];
  let prev = lo - 1;
  pcs.forEach((p) => {
    const m0 = prev + 1;
    const note = m0 + ((((p - m0) % 12) + 12) % 12);
    out.push(note);
    prev = note;
  });
  return out;
}
