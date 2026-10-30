// Voicing data. Frets low->high ('x' = muted). Fingers: digits, 0/x = none.
// Fixed: [id, rootName, quality, frets, fingers?, nameOverride?]
const F = (id, root, quality, frets, fingers = '', name = '') => ({ id, root, quality, frets, fingers, name });

const parse = (s) => [...s].map((c) => (c === 'x' ? -1 : parseInt(c, 10)));
const parseFingers = (s) => (s ? [...s].map((c) => (c === 'x' || c === '0' ? 0 : parseInt(c, 10))) : null);

const RAW = [
  F('C_open', 'C', 'maj', 'x32010', 'x32010'), F('G_open', 'G', 'maj', '320003', '210003'),
  F('D_open', 'D', 'maj', 'xx0232', 'xx0132'), F('A_open', 'A', 'maj', 'x02220', 'x01230'),
  F('E_open', 'E', 'maj', '022100', '023100'), F('Am_open', 'A', 'min', 'x02210', 'x02310'),
  F('Em_open', 'E', 'min', '022000', '023000'), F('Dm_open', 'D', 'min', 'xx0231', 'xx0231'),
  F('F_barre', 'F', 'maj', '133211', '134211'), F('Fm_barre', 'F', 'min', '133111', '134111'),
  F('Cmaj7_open', 'C', 'maj7', 'x32000', 'x32000'), F('Fmaj7_open', 'F', 'maj7', 'xx3210'),
  F('Amaj7_open', 'A', 'maj7', 'x02120'), F('Dmaj7_open', 'D', 'maj7', 'xx0222'),
  F('Gmaj7_open', 'G', 'maj7', '320002'),
  F('Am7_open', 'A', 'm7', 'x02010', 'x02010'), F('Em7_open', 'E', 'm7', '022030'),
  F('Dm7_open', 'D', 'm7', 'xx0211'),
  F('G7_open', 'G', '7', '320001', '320001'), F('E7_open', 'E', '7', '020100', '020100'),
  F('A7_open', 'A', '7', 'x02020'), F('D7_open', 'D', '7', 'xx0212'),
  F('B7_open', 'B', '7', 'x21202'), F('C7_open', 'C', '7', 'x32310'),
  F('Cadd9_open', 'C', 'add9', 'x32030'), F('Cmaj9_open', 'C', 'maj9', 'x32430'),
  F('Am9_5th', 'A', 'm9', 'x05557'),
  F('Dsus2_open', 'D', 'sus2', 'xx0230'), F('Asus2_open', 'A', 'sus2', 'x02200'),
  F('Dsus4_open', 'D', 'sus4', 'xx0233'), F('Asus4_open', 'A', 'sus4', 'x02230'),
  F('CG_slash', 'C', 'maj', '332010', '', 'C/G'), F('Fsharpdim7', 'F#', 'dim7', '2x121x'),
  F('Fmaj7_lowF', 'F', 'maj7', '1x3210'), F('C_E_slash', 'C', 'maj', '032010', '', 'C/E'),
  F('E7_Gsharp', 'E', '7', '4x0430', '', 'E7/G#'),
  F('Cmaj7s11_open', 'C', 'maj7#11', 'x32002', '', 'Cmaj7#11'),
  F('Fmaj7s11_open', 'F', 'maj7#11', '1x3200', '', 'Fmaj7#11'),
  F('FoverG', 'G', '9sus4', '3x3211', '', 'F/G'),
  F('Gs13sus4', 'G#', '13sus4', '4x4666', '', 'G#13sus4'),
  // Voice-led drop-2 ii-V-I in C on the top four strings (each voice moves a fret at most).
  F('Dm7_d2', 'D', 'm7', 'xx3535', 'xx1314'), F('G7_d2', 'G', '7', 'xx3433', 'xx1211'),
  F('Cmaj7_d2', 'C', 'maj7', 'xx2413', 'xx2413'),
];

export const FIXED = RAW.map((v) => ({
  id: v.id, root: v.root, quality: v.quality, frets: parse(v.frets),
  fingers: parseFingers(v.fingers), name: v.name || null,
}));

// Templates: [id, quality, rootString, shape ('x' = muted, -1/-2 as 'a'/'b' not needed: array), minRootFret]
const X = null;
const T = (id, quality, rootString, shape, minRootFret = 1, openOk = false) =>
  ({ id, quality, rootString, shape, minRootFret, openOk });

export const TEMPLATES = [
  T('maj_r6', 'maj', 0, [0, 2, 2, 1, 0, 0], 1, true), T('maj_r5', 'maj', 1, [X, 0, 2, 2, 2, 0], 1, true),
  T('min_r6', 'min', 0, [0, 2, 2, 0, 0, 0], 1, true), T('min_r5', 'min', 1, [X, 0, 2, 2, 1, 0], 1, true),
  T('maj7_r6', 'maj7', 0, [0, X, 1, 1, 0, X], 1, true), T('maj7_r5', 'maj7', 1, [X, 0, 2, 1, 2, 0], 1, true),
  T('m7_r6', 'm7', 0, [0, X, 0, 0, 0, X], 1, true), T('m7_r5', 'm7', 1, [X, 0, 2, 0, 1, 0], 1, true),
  T('dom7_r6', '7', 0, [0, X, 0, 1, 0, X], 1, true), T('dom7_r5', '7', 1, [X, 0, 2, 0, 2, 0], 1, true),
  T('m7b5_r6', 'm7b5', 0, [0, X, 0, 0, -1, X]), T('m7b5_r5', 'm7b5', 1, [X, 0, 1, 0, 1, X], 1, true),
  T('maj9_r5', 'maj9', 1, [X, 0, -1, 1, 0, X], 2), T('m9_r5', 'm9', 1, [X, 0, -2, 0, 0, X], 3),
  T('dom9_r5', '9', 1, [X, 0, -1, 0, 0, 0], 2), T('dom13_r6', '13', 0, [0, X, 0, 1, 2, X], 1, true),
  T('m11_r6', 'm11', 0, [0, X, 0, 0, -2, X], 3), T('dim7_r6', 'dim7', 0, [0, X, -1, 0, -1, X], 2),
  T('m9_r6', 'm9', 0, [0, X, 0, 0, 0, 2], 1, true),
  T('tri_r3', 'maj', 3, [X, X, X, 0, 0, -2], 2), T('tri_r5', 'maj', 5, [X, X, X, 1, 0, 0], 1, true),
  T('tri_r4', 'maj', 4, [X, X, X, -1, 0, -1], 1),
  T('maj7_d2', 'maj7', 2, [X, X, 0, 2, 2, 2], 1, true), T('m7_d2', 'm7', 2, [X, X, 0, 2, 1, 1], 1, true),
  T('dom7_d2', '7', 2, [X, X, 0, 2, 1, 2], 1, true),
];
