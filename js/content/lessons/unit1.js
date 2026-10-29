// Unit 1: Map the neck
export const LESSONS = [
  {
    id: 'u1l1', unit: 1, title: 'Notes on the low E and A strings', minutes: 8,
    summary: 'Learn the note names on your two bass strings, and the landmarks that make them quick.',
    blocks: [
      { type: 'text', md: `Every movable chord shape in this course is anchored to a root on the low E or A string. If you know the note names there, you can play any chord in any key.

The musical alphabet has seven letters: **A B C D E F G**, then it loops. Between most letters there is a sharp or flat note in the middle. Two pairs have nothing between them: **B to C** and **E to F**. That is why those pairs sit one fret apart.

One fret is one half step. So the naturals go: E, (1 fret) F, (2 frets) G, (2) A, (2) B, (1) C, (2) D, (2) E.` },
      { type: 'fretboard', from: 0, to: 12, caption: 'Low E string, natural notes only. Fret 12 is E again, one octave up.', marks: [
        { string: 0, fret: 0, label: 'E', kind: 'root' }, { string: 0, fret: 1, label: 'F', kind: 'tone' },
        { string: 0, fret: 3, label: 'G', kind: 'tone' }, { string: 0, fret: 5, label: 'A', kind: 'tone' },
        { string: 0, fret: 7, label: 'B', kind: 'tone' }, { string: 0, fret: 8, label: 'C', kind: 'tone' },
        { string: 0, fret: 10, label: 'D', kind: 'tone' }, { string: 0, fret: 12, label: 'E', kind: 'root' },
      ] },
      { type: 'text', md: `The frets in between are the sharps and flats. Fret 2 is F# (also called Gb), fret 4 is G#/Ab, and so on. Same pitch, two names. The key you are in decides which name you use.

### Landmarks
- Fret 12 is the same note as the open string, one octave higher.
- The dots are your signposts. On the low E string, fret 3 is G, fret 5 is A, fret 7 is B.
- Fret 5 on the low E is the open A string. Fret 5 on the A string is the open D. Same trick all the way across (except into the B string).` },
      { type: 'fretboard', from: 0, to: 12, caption: 'The A string. Same pattern, shifted: A, B, C, D, E, F, G.', marks: [
        { string: 1, fret: 0, label: 'A', kind: 'root' }, { string: 1, fret: 2, label: 'B', kind: 'tone' },
        { string: 1, fret: 3, label: 'C', kind: 'tone' }, { string: 1, fret: 5, label: 'D', kind: 'tone' },
        { string: 1, fret: 7, label: 'E', kind: 'tone' }, { string: 1, fret: 8, label: 'F', kind: 'tone' },
        { string: 1, fret: 10, label: 'G', kind: 'tone' }, { string: 1, fret: 12, label: 'A', kind: 'root' },
      ] },
      { type: 'tip', md: `**Style note.** Players in the neo-soul and gospel world name their chords by root first, in their head, before they think of a shape. That habit starts here.` },
      { type: 'text', md: `Now play them. The mic will listen for the note. Take your time, and say the name out loud as you land on it.` },
      { type: 'exercise', spec: { kind: 'find-note', string: 0, notes: ['G', 'A', 'B', 'C', 'D', 'F'], count: 6 } },
      { type: 'exercise', spec: { kind: 'find-note', string: 1, notes: ['D', 'E', 'G', 'B', 'C', 'F#'], count: 6 } },
    ],
  },
  {
    id: 'u1l2', unit: 1, title: 'Octave shapes', minutes: 7,
    summary: 'Two strings over, two frets up. A shortcut that finds every octave on the neck.',
    blocks: [
      { type: 'text', md: `An octave is the same note name, higher or lower. You already know one octave: 12 frets up the same string. Here is a faster one.

**Skip a string and go up two frets.** Play the low E at fret 3. That is G. Now go over to the D string and play fret 5. Also G, an octave higher.

The same shape works from the A string to the G string: A string fret 3 is C, and G string fret 5 is C.` },
      { type: 'fretboard', from: 0, to: 7, caption: 'Root (coral) on the bass string, octave (blue) two strings over and two frets up.', marks: [
        { string: 0, fret: 3, label: 'G', kind: 'root' }, { string: 2, fret: 5, label: 'G', kind: 'tone' },
        { string: 1, fret: 3, label: 'C', kind: 'root' }, { string: 3, fret: 5, label: 'C', kind: 'tone' },
      ] },
      { type: 'text', md: `### The one exception
When the jump crosses the B string, add one more fret. The B string is tuned a half step closer to the G string than the others, so it takes **three frets up** instead of two.

- D string to B string: three frets up (D string fret 5 is G, B string fret 8 is G).
- G string to high e string: three frets up.

So the rule is: skip one string, go up two frets, or three if you cross the B string.` },
      { type: 'listen', label: 'Hear G and its octave', midis: [43, 55], mode: 'seq' },
      { type: 'text', md: `Why this matters: a chord shape is just a set of notes at fixed distances from the root. The octave tells you where the root repeats, which gives you more places to grab a chord.

Play these pairs, root then octave. Be strict about the octave this time.` },
      { type: 'exercise', spec: { kind: 'sequence', label: 'Octave pairs', notes: ['G2', 'G3', 'A2', 'A3', 'C3', 'C4'], octaveStrict: true } },
    ],
  },
  {
    id: 'u1l3', unit: 1, title: 'Root-6 and root-5 shapes', minutes: 9,
    summary: 'The two barre families you already half know, now named by their root string.',
    blocks: [
      { type: 'text', md: `You know the open E and A chord shapes. Slide them up the neck with a barre and they become movable. The chord takes its name from the note under your root finger.

- **Root-6 shapes** have their root on the low E string (the E-shape family).
- **Root-5 shapes** have their root on the A string (the A-shape family).

With lesson 1 in your head, you can name any chord on the spot. Barre at fret 3 of the low E string: that is G, so the E-shape there is a G chord.` },
      { type: 'chords', refs: ['maj_r6@G', 'maj_r5@C', 'min_r6@A', 'min_r5@D'], showNotes: true, caption: 'G (root-6), C (root-5), Am (root-6), Dm (root-5). Tap a diagram to hear it.' },
      { type: 'text', md: `Check the pattern. Major shapes have the major third (the note a major 3rd above the root). Minor shapes drop that note down a fret. That is the whole difference, and it is why one finger moves when you switch between major and minor.

Pick the right shape for the neighbourhood you are in. If the next chord is two frets away, a root-5 shape is often closer than reaching back to the low E.` },
      { type: 'exercise', spec: { kind: 'chord-arp', ref: 'maj_r5@C' } },
      { type: 'text', md: `Last job: play the same sounds as the open G, D, Em and C, but with barre shapes. Count four beats per chord. It will be slow at first.` },
      { type: 'exercise', spec: { kind: 'progression', refs: ['maj_r6@G', 'maj_r5@D', 'min_r5@E', 'maj_r5@C'], bpm: 70, beatsPerChord: 4, bars: 8 } },
    ],
  },
];
