// Unit 2: Why chords sound the way they do
export const LESSONS = [
  {
    id: 'u2l1', unit: 2, title: 'Intervals by ear and by fret', minutes: 9,
    summary: 'The distance between two notes, how it looks on the neck, and how each one feels.',
    blocks: [
      { type: 'text', md: `An interval is the distance between two notes. Everything else in harmony is built from them.

We measure in half steps (one fret) and whole steps (two frets). Here are the ones you need first:

- **Minor 3rd (m3):** 3 frets. Darker, a little sad.
- **Major 3rd (M3):** 4 frets. Bright, settled.
- **Perfect 4th (P4):** 5 frets. Open, a bit hanging.
- **Perfect 5th (P5):** 7 frets. Hollow and strong.
- **Octave:** 12 frets. The same note again.` },
      { type: 'fretboard', from: 4, to: 12, caption: 'Root A on the low E string (fret 5), and each interval above it on the same string.', marks: [
        { string: 0, fret: 5, label: 'A', kind: 'root' }, { string: 0, fret: 8, label: 'm3', kind: 'tone' },
        { string: 0, fret: 9, label: 'M3', kind: 'tone' }, { string: 0, fret: 10, label: 'P4', kind: 'tone' },
        { string: 0, fret: 12, label: 'P5', kind: 'tone' },
      ] },
      { type: 'text', md: `A handy shortcut across strings: the **same fret on the next string up is a perfect 4th** (except between the G and B strings, where it is a major 3rd). And **one string up, two frets higher, is a perfect 5th**.

Now listen. Each pair starts on the same note. Feel what changes.` },
      { type: 'listen', label: 'Minor 3rd (E to G)', midis: [52, 55], mode: 'seq' },
      { type: 'listen', label: 'Major 3rd (E to G#)', midis: [52, 56], mode: 'seq' },
      { type: 'listen', label: 'Perfect 4th (E to A)', midis: [52, 57], mode: 'seq' },
      { type: 'listen', label: 'Perfect 5th (E to B)', midis: [52, 59], mode: 'seq' },
      { type: 'listen', label: 'Octave (E to E)', midis: [52, 64], mode: 'seq' },
      { type: 'text', md: `Quiz yourself. Do not hunt for the notes on the neck, just listen to the character. Eight rounds, and your score is logged.` },
      { type: 'exercise', spec: { kind: 'ear', mode: 'interval', options: ['m3', 'M3', 'P4', 'P5', '8ve'], rounds: 8 } },
    ],
  },
  {
    id: 'u2l2', unit: 2, title: 'The major scale', minutes: 8,
    summary: 'Whole and half steps in the order that makes a scale, and the seven degrees.',
    blocks: [
      { type: 'text', md: `The major scale is the reference every other sound is measured against. Its recipe, in steps:

**W W H W W W H** (whole, whole, half, whole, whole, whole, half)

Start on G and follow it: G, A (whole), B (whole), C (half), D (whole), E (whole), F# (whole), G (half). That gives **G A B C D E F#**. Notice the single sharp. Every major scale has its own set of sharps or flats because the recipe has to hold.

Each note has a number, called its scale degree: 1 2 3 4 5 6 7. In G major, G is 1, B is 3, D is 5 and F# is 7. Remember these. Chord names are built from them.` },
      { type: 'fretboard', from: 0, to: 12, caption: 'G major from the low E string, third fret, up one octave. Numbers are scale degrees.', marks: [
        { string: 0, fret: 3, label: '1', kind: 'root' }, { string: 0, fret: 5, label: '2', kind: 'tone' },
        { string: 1, fret: 2, label: '3', kind: 'tone' }, { string: 1, fret: 3, label: '4', kind: 'tone' },
        { string: 1, fret: 5, label: '5', kind: 'tone' }, { string: 1, fret: 7, label: '6', kind: 'tone' },
        { string: 1, fret: 9, label: '7', kind: 'tone' }, { string: 1, fret: 10, label: '8', kind: 'root' },
      ] },
      { type: 'text', md: `We hop to the A string halfway, because fret 14 on the low E is out of the way. The pitches are the same.

Play it slowly and listen for the pull. Degrees 7 to 8 (F# to G) are a half step apart, and your ear wants that 7 to climb home. Keep that feeling for later, because it explains why dominant chords work.` },
      { type: 'exercise', spec: { kind: 'sequence', label: 'G major, one octave', notes: ['G2', 'A2', 'B2', 'C3', 'D3', 'E3', 'F#3', 'G3'] } },
    ],
  },
  {
    id: 'u2l3', unit: 2, title: 'Triads', minutes: 8,
    summary: 'Three notes stacked in thirds. Major and minor are decided by one note.',
    blocks: [
      { type: 'text', md: `A triad is three notes: the root, a third above it, and a fifth above that. You build it by stacking thirds. Take the scale degrees 1, 3 and 5.

In C major: **C E G**. That is a C major chord.

Major or minor lives in the third. Look at the two thirds inside a triad:

- **Major triad:** major 3rd, then minor 3rd (C to E is 4 frets, E to G is 3).
- **Minor triad:** minor 3rd, then major 3rd (C to Eb is 3, Eb to G is 4).

The 5th stays put. Lower the 3rd by one fret and a bright chord turns dark. Everything else follows from that tiny move.` },
      { type: 'chords', refs: ['A_open', 'Am_open'], showNotes: true, caption: 'A is A, C#, E. Am is A, C, E. One note moves.' },
      { type: 'listen', label: 'A then Am', refs: ['A_open', 'Am_open'], mode: 'strum' },
      { type: 'tip', md: `**Style note.** A lot of the music you love lives on the edge of that choice. Chords with a bright or dark third, and notes that lean between them, are part of the soulful sound. We will get there.` },
      { type: 'text', md: `Train your ear on this one choice first. Then pick a chord apart.` },
      { type: 'exercise', spec: { kind: 'ear', mode: 'quality', options: ['maj', 'min'], rounds: 8 } },
      { type: 'exercise', spec: { kind: 'chord-arp', ref: 'C_open' } },
    ],
  },
  {
    id: 'u2l4', unit: 2, title: 'Chords in a key, by number', minutes: 9,
    summary: 'Build a chord on each note of the scale and name it with a Roman numeral.',
    blocks: [
      { type: 'text', md: `Take the major scale and build a triad on every note, using only notes from the scale. You get seven chords. In C major:

- **I** C major
- **ii** D minor
- **iii** E minor
- **IV** F major
- **V** G major
- **vi** A minor
- **vii°** B diminished

Capitals are major, lower case is minor, the little circle is diminished. The pattern of major and minor is the same in every major key.

In G major it is G, Am, Bm, C, D, Em, F#dim. In D major it is D, Em, F#m, G, A, Bm, C#dim.` },
      { type: 'text', md: `### Why numbers
Songs are about relationships, not letters. A progression written as I, V, vi, IV is a shape you can drop into any key. In G it is G, D, Em, C. In D it is D, A, Bm, G. That one pattern shows up in enormous amounts of pop music, which is why learning it by number pays off.

If someone says "play it in a different key", you do not memorise new chords. You move the whole numbered shape.` },
      { type: 'exercise', spec: { kind: 'quiz', questions: [
        { q: 'In the key of G, what is the V chord?', options: ['C', 'D', 'Em', 'A'], answer: 1, explain: 'G is 1, so the fifth note up the scale is D.' },
        { q: 'In the key of D, which chord is IV?', options: ['G', 'A', 'Bm', 'E'], answer: 0, explain: 'D E F# G: the fourth note is G.' },
        { q: 'In the key of C, what is the vi chord?', options: ['Dm', 'Em', 'Am', 'F'], answer: 2, explain: 'The sixth note is A, and vi is minor.' },
        { q: 'In the key of G, which chord is iii?', options: ['Bm', 'Am', 'Em', 'C'], answer: 0, explain: 'G A B: the third note is B, and iii is minor.' },
        { q: 'Play I, V, vi, IV in D. What chords is that?', options: ['D A Bm G', 'D G Em A', 'D A F#m G', 'D E Bm G'], answer: 0, explain: 'I is D, V is A, vi is Bm, IV is G.' },
      ] } },
      { type: 'text', md: `Now play one. This is I, V, vi, IV in G, using your open chords. Count it, and think in numbers as you change.` },
      { type: 'exercise', spec: { kind: 'progression', refs: ['G_open', 'D_open', 'Em_open', 'C_open'], bpm: 72, beatsPerChord: 4, bars: 8 } },
    ],
  },
];
