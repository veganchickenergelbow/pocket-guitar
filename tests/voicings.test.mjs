import test from 'node:test';
import assert from 'node:assert/strict';
import { analyzeVoicing, CHORDS } from '../js/music/theory.js';
import {
  FIXED, TEMPLATES, ROOT_NAMES, resolveVoicing, listVoicings,
} from '../js/music/voicings.js';

const REQUIRED_FIXED = {
  C_open: 'x32010', G_open: '320003', D_open: 'xx0232', A_open: 'x02220', E_open: '022100',
  Am_open: 'x02210', Em_open: '022000', Dm_open: 'xx0231', F_barre: '133211', Fm_barre: '133111',
  Cmaj7_open: 'x32000', Fmaj7_open: 'xx3210', Amaj7_open: 'x02120', Dmaj7_open: 'xx0222',
  Gmaj7_open: '320002', Am7_open: 'x02010', Em7_open: '022030', Dm7_open: 'xx0211',
  G7_open: '320001', E7_open: '020100', A7_open: 'x02020', D7_open: 'xx0212', B7_open: 'x21202',
  C7_open: 'x32310', Cadd9_open: 'x32030', Cmaj9_open: 'x32430', Am9_5th: 'x05557',
  Dsus2_open: 'xx0230', Asus2_open: 'x02200', Dsus4_open: 'xx0233', Asus4_open: 'x02230',
  CG_slash: '332010', Fsharpdim7: '2x121x',
  Fmaj7_lowF: '1x3210', C_E_slash: '032010', E7_Gsharp: '4x0430',
  Cmaj7s11_open: 'x32002', Fmaj7s11_open: '1x3200', FoverG: '3x3211', Gs13sus4: '4x4666',
  Dm7_d2: 'xx3535', G7_d2: 'xx3433', Cmaj7_d2: 'xx2413',
};
const REQUIRED_TEMPLATES = [
  'maj_r6', 'maj_r5', 'min_r6', 'min_r5', 'maj7_r6', 'maj7_r5', 'm7_r6', 'm7_r5', 'dom7_r6', 'dom7_r5',
  'm7b5_r6', 'm7b5_r5', 'maj9_r5', 'm9_r5', 'dom9_r5', 'dom13_r6', 'm11_r6', 'dim7_r6',
  'maj7_d2', 'm7_d2', 'dom7_d2', 'm9_r6', 'tri_r3', 'tri_r5', 'tri_r4',
];

const str = (frets) => frets.map((f) => (f < 0 ? 'x' : String(f))).join('');

test('all required fixed voicings exist with the exact frets', () => {
  for (const [id, frets] of Object.entries(REQUIRED_FIXED)) {
    assert.equal(str(resolveVoicing(id).frets), frets, id);
  }
  assert.equal(FIXED.length, Object.keys(REQUIRED_FIXED).length);
});

test('all required templates exist', () => {
  assert.deepEqual(TEMPLATES.map((t) => t.id).sort(), [...REQUIRED_TEMPLATES].sort());
});

test('every fixed voicing passes analyzeVoicing', () => {
  for (const v of FIXED) {
    const r = resolveVoicing(v.id);
    const a = analyzeVoicing(r.frets, r.rootPc, r.quality);
    assert.ok(a.ok, `FIXED VOICING FAILS: ${v.id} (${str(r.frets)}) as ${r.name}: missing intervals ${a.missing}, extra pcs ${a.extra}`);
  }
});

test('every template passes analyzeVoicing at all 12 roots', () => {
  for (const t of TEMPLATES) {
    ROOT_NAMES.forEach((root, rootPc) => {
      const r = resolveVoicing(`${t.id}@${root}`);
      assert.equal(r.rootPc, rootPc);
      assert.equal(r.quality, t.quality);
      assert.ok(r.frets.length === 6 && r.frets.every((f) => f >= -1 && f <= 16), `${r.id} frets ${str(r.frets)} out of range`);
      const a = analyzeVoicing(r.frets, r.rootPc, r.quality);
      assert.ok(a.ok, `TEMPLATE FAILS: ${r.id} (${r.frets.join(',')}) missing intervals ${a.missing}, extra pcs ${a.extra}`);
    });
  }
});

test('resolveVoicing picks the lowest sensible root fret', () => {
  assert.deepEqual(resolveVoicing('maj7_r5@C').frets, [-1, 3, 5, 4, 5, 3]);
  assert.deepEqual(resolveVoicing('maj_r6@G').frets, [3, 5, 5, 4, 3, 3]);
  assert.deepEqual(resolveVoicing('maj_r6@E').frets, [0, 2, 2, 1, 0, 0]);
  assert.equal(resolveVoicing('m9_r5@D').frets[1], 5); // min root fret 3 -> A string fret 5
  assert.equal(resolveVoicing('m7b5_r6@F').frets[0], 1);
  assert.equal(resolveVoicing('maj7_r5@C').id, 'maj7_r5@C');
  assert.equal(resolveVoicing('maj7_r5@Bb').name, 'Bbmaj7');
  assert.equal(resolveVoicing('dom13_r6@G').name, 'G13');
  assert.equal(resolveVoicing('CG_slash').name, 'C/G');
  assert.equal(resolveVoicing('Fsharpdim7').name, 'F#dim7');
  assert.equal(resolveVoicing('Cmaj7_open').name, 'Cmaj7');
  assert.equal(resolveVoicing('Am9_5th').baseFret, 5);
  assert.equal(resolveVoicing('C_open').baseFret, 1);
  assert.throws(() => resolveVoicing('nope'));
  assert.throws(() => resolveVoicing('nope@C'));
});

test('new colour and triad shapes resolve as designed', () => {
  assert.equal(resolveVoicing('Cmaj7s11_open').name, 'Cmaj7#11');
  assert.equal(resolveVoicing('Fmaj7s11_open').name, 'Fmaj7#11');
  assert.equal(resolveVoicing('FoverG').name, 'F/G');
  assert.equal(resolveVoicing('Gs13sus4').name, 'G#13sus4');
  assert.equal(str(resolveVoicing('m9_r6@E').frets), '0x0002');
  assert.equal(str(resolveVoicing('m9_r6@F#').frets), '2x2224');
  assert.equal(str(resolveVoicing('tri_r3@C').frets), 'xxx553');
  assert.equal(str(resolveVoicing('tri_r5@C').frets), 'xxx988');
  assert.equal(str(resolveVoicing('tri_r4@C').frets), 'xxx010');
  assert.equal(str(resolveVoicing('tri_r4@F').frets), 'xxx565');
  assert.equal(str(resolveVoicing('tri_r5@G').frets), 'xxx433');
});

test('listVoicings filters by quality and root', () => {
  const cmaj7 = listVoicings({ quality: 'maj7', rootPc: 0 });
  assert.ok(cmaj7.some((v) => v.id === 'Cmaj7_open'));
  assert.ok(cmaj7.some((v) => v.id === 'maj7_r5@C'));
  assert.ok(cmaj7.every((v) => v.rootPc === 0 && v.quality === 'maj7'));
  assert.ok(listVoicings({ quality: 'dim7', rootPc: 6 }).some((v) => v.id === 'Fsharpdim7'));
  assert.ok(listVoicings().length > 21 * 12);
  for (const q of Object.keys(CHORDS)) assert.ok(Array.isArray(listVoicings({ quality: q, rootPc: 0 })));
});
