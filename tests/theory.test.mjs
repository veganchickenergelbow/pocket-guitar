import test from 'node:test';
import assert from 'node:assert/strict';
import {
  pc, noteToMidi, midiToName, pcName, midiToFreq, freqToMidi, preferFlatsFor, INTERVALS,
  scaleNotes, chordPcs, chordSymbol, diatonicChords, fretMidi, voicingMidis,
  analyzeVoicing, fretsForPc, NOTE_SHARP, NOTE_FLAT, CHORDS,
} from '../js/music/theory.js';

test('pc parses names, accidentals and octaves', () => {
  assert.equal(pc('C'), 0); assert.equal(pc('Db'), 1); assert.equal(pc('C#'), 1);
  assert.equal(pc('Bb'), 10); assert.equal(pc('G3'), 7); assert.equal(pc('E'), 4);
  assert.equal(pc('Cb'), 11); assert.equal(pc('B#'), 0);
  assert.throws(() => pc('H'));
});

test('noteToMidi / midiToName round trips', () => {
  assert.equal(noteToMidi('G3'), 55); assert.equal(noteToMidi('E2'), 40); assert.equal(noteToMidi('A4'), 69);
  for (let m = 28; m <= 100; m++) {
    assert.equal(noteToMidi(midiToName(m)), m);
    assert.equal(noteToMidi(midiToName(m, true)), m);
  }
  assert.equal(midiToName(58, true), 'Bb3'); assert.equal(midiToName(58), 'A#3');
});

test('pcName and tables round trip', () => {
  for (let i = 0; i < 12; i++) {
    assert.equal(pc(pcName(i)), i); assert.equal(pc(pcName(i, true)), i);
    assert.equal(pc(NOTE_SHARP[i]), i); assert.equal(pc(NOTE_FLAT[i]), i);
  }
  assert.equal(pcName(13), 'C#'); assert.equal(pcName(-1), 'B');
});

test('frequency conversion', () => {
  assert.equal(midiToFreq(69), 440);
  assert.ok(Math.abs(midiToFreq(40) - 82.407) < 0.01);
  assert.ok(Math.abs(freqToMidi(82.407) - 40) < 0.01);
  assert.ok(Math.abs(freqToMidi(442, 442) - 69) < 1e-9);
});

test('preferFlatsFor', () => {
  for (const k of ['F', 'Bb', 'Eb', 'Ab', 'Db', 'Gb', 'Dm', 'Gm', 'Cm', 'Fm', 'Bbm']) assert.equal(preferFlatsFor(k), true, k);
  for (const k of ['C', 'G', 'D', 'A', 'E', 'B', 'F#', 'Em', 'Am', 'Bm', 'F#m']) assert.equal(preferFlatsFor(k), false, k);
});

test('INTERVALS and scales', () => {
  assert.equal(INTERVALS.length, 15);
  assert.deepEqual(INTERVALS[3], { semitones: 3, short: 'm3', name: 'minor 3rd' });
  assert.equal(INTERVALS[7].short, 'P5'); assert.equal(INTERVALS[12].name, 'octave');
  assert.deepEqual(scaleNotes(7, 'major'), [7, 9, 11, 0, 2, 4, 6]);
  assert.deepEqual(scaleNotes(9, 'minorPentatonic'), [9, 0, 2, 4, 7]);
});

test('chord definitions are consistent', () => {
  for (const [q, d] of Object.entries(CHORDS)) {
    assert.ok(d.intervals.includes(0), q);
    for (const r of d.required) assert.ok(d.intervals.includes(r), `${q} required ${r}`);
  }
  assert.deepEqual(chordPcs(0, 'maj7'), [0, 4, 7, 11]);
  assert.equal(chordSymbol(10, 'maj7', true), 'Bbmaj7');
  assert.equal(chordSymbol(0, 'maj'), 'C'); assert.equal(chordSymbol(9, 'm9'), 'Am9');
});

const names = (list) => list.map((c) => pcName(c.rootPc) + CHORDS[c.quality].symbol);

test('diatonicChords: C and G, triads and sevenths', () => {
  assert.deepEqual(names(diatonicChords(0)), ['C', 'Dm', 'Em', 'F', 'G', 'Am', 'Bdim']);
  assert.deepEqual(names(diatonicChords(0, { sevenths: true })), ['Cmaj7', 'Dm7', 'Em7', 'Fmaj7', 'G7', 'Am7', 'Bm7b5']);
  assert.deepEqual(names(diatonicChords(7)), ['G', 'Am', 'Bm', 'C', 'D', 'Em', 'F#dim']);
  assert.deepEqual(names(diatonicChords(7, { sevenths: true })), ['Gmaj7', 'Am7', 'Bm7', 'Cmaj7', 'D7', 'Em7', 'F#m7b5']);
  const c7 = diatonicChords(0, { sevenths: true });
  assert.equal(c7.length, 7); assert.equal(c7[1].degree, 'ii'); assert.equal(c7[1].roman, 'ii7');
  assert.equal(c7[4].roman, 'V7'); assert.equal(c7[0].roman, 'Imaj7');
  assert.deepEqual(names(diatonicChords(9, { minor: true })), ['Am', 'Bdim', 'C', 'Dm', 'Em', 'F', 'G']);
});

test('fret helpers', () => {
  assert.equal(fretMidi(0, 3), 43); assert.equal(fretMidi(5, 0), 64);
  assert.deepEqual(voicingMidis([-1, 3, 2, 0, 1, 0]), [48, 52, 55, 60, 64]);
  assert.deepEqual(fretsForPc(7, 0), [3]);
  assert.deepEqual(fretsForPc(4, 0, 12), [0, 12]);
  assert.deepEqual(fretsForPc(0, 1), [3]);
});

test('analyzeVoicing', () => {
  assert.equal(analyzeVoicing([-1, 3, 2, 0, 1, 0], 0, 'maj').ok, true);
  const bad = analyzeVoicing([-1, 3, 2, 0, 1, 0], 0, 'maj7');
  assert.equal(bad.ok, false); assert.deepEqual(bad.missing, [11]);
  const min = analyzeVoicing([-1, 3, 2, 0, 1, 0], 0, 'min');
  assert.equal(min.ok, false); assert.deepEqual(min.extra, [4]); assert.deepEqual(min.missing, [3]);
  // E-G-B-D on strings D..e is Em7 without... (D string 2 = E, G 0 = G, B 0 = B, e 3 = G): rootless Cmaj7 has E G B
  assert.equal(analyzeVoicing([-1, -1, 2, 0, 0, 0], 0, 'maj7', { rootless: true }).ok, true);
  assert.equal(analyzeVoicing([-1, -1, 2, 0, 0, 0], 0, 'maj7').ok, false);
});
