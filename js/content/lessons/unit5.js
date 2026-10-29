// Unit 5: Voice leading
export const LESSONS = [
  {
    id: 'u5l1', unit: 5, title: 'Guide tones', minutes: 9,
    summary: 'Follow the 3rds and 7ths through a ii-V-I and hear the smooth lines inside the chords.',
    blocks: [
      { type: 'text', md: `Keyboard players make chords flow because each finger moves as little as possible. On guitar you can do the same by following the **guide tones**, the 3rd and 7th of each chord.

Here they are for ii-V-I in C:

- **Dm7:** 3rd is F, 7th is C
- **G7:** 3rd is B, 7th is F
- **Cmaj7:** 3rd is E, 7th is B

String them together and two lines appear.

**Line 1:** C (7th of Dm7) to B (3rd of G7) to B (7th of Cmaj7). It falls a half step, then holds.

**Line 2:** F (3rd of Dm7) to F (7th of G7) to E (3rd of Cmaj7). It holds, then falls a half step.

The 7th of one chord becomes the 3rd of the next, or the same note stays put. That is voice leading.` },
      { type: 'fretboard', from: 0, to: 5, caption: 'Line 1 on the B string (C to B to B). Line 2 on the D string (F to F to E).', marks: [
        { string: 4, fret: 1, label: 'C', kind: 'tone' }, { string: 4, fret: 0, label: 'B', kind: 'target' },
        { string: 2, fret: 3, label: 'F', kind: 'tone' }, { string: 2, fret: 2, label: 'E', kind: 'target' },
      ] },
      { type: 'listen', label: 'Hear the chords', refs: ['m7_r5@D', 'dom7_r6@G', 'maj7_r5@C'], mode: 'strum' },
      { type: 'text', md: `Play each line as single notes. The motion is tiny, but it carries the whole progression. Once you can hear these lines, you can steer any chord change.

Line 1 uses the B string. Line 2 uses the D string, where F3 is fret 3.` },
      { type: 'exercise', spec: { kind: 'sequence', label: 'Line 1: C, B, B', notes: ['C4', 'B3', 'B3'] } },
      { type: 'exercise', spec: { kind: 'sequence', label: 'Line 2: F, F, E', notes: ['F3', 'F3', 'E3'] } },
    ],
  },
  {
    id: 'u5l2', unit: 5, title: 'Top-note melody', minutes: 9,
    summary: 'Drop-2 chords on the top four strings, and why your ear follows the top note.',
    blocks: [
      { type: 'text', md: `Your ear follows the top note of a chord as if it were a melody. So the top note matters more than any other.

A **drop-2 voicing** takes a close four-note chord and drops its second-highest note an octave. That opens up the spacing, so the chord fits across four neighbouring strings and sounds full instead of cramped. These shapes sit on the top four strings, with the root on the D string.` },
      { type: 'chords', refs: ['m7_d2@D', 'dom7_d2@G', 'maj7_d2@C'], showNotes: true, caption: 'Dm7, G7, Cmaj7 in drop-2 form. Look at the top note of each.' },
      { type: 'text', md: `The top notes here are F, B and E. Each chord has its 3rd on top, so the top line is the 3rds of the chord. It leaps, and that gives it a bold, singing quality.

Play each shape and sing the top note out loud. If you can sing it, you can hear it. Then try playing only the top two strings of each shape. It sounds like a tiny melody.

In the next lesson we will find a smoother path.` },
      { type: 'listen', label: 'Hear the three', refs: ['m7_d2@D', 'dom7_d2@G', 'maj7_d2@C'], mode: 'strum' },
      { type: 'exercise', spec: { kind: 'progression', refs: ['m7_d2@D', 'dom7_d2@G', 'maj7_d2@C'], bpm: 60, beatsPerChord: 4, bars: 12 } },
    ],
  },
  {
    id: 'u5l3', unit: 5, title: 'The smooth neo-soul ii-V-I', minutes: 10,
    summary: 'Three richer chords with tiny finger moves between them.',
    blocks: [
      { type: 'text', md: `Here is the same ii-V-I with extensions: **Dm9, G13, Cmaj9**. The shapes:

- Dm9 root on the A string (fret 5)
- G13 root on the low E string (fret 3)
- Cmaj9 root on the A string (fret 3)

Look at what each finger does. On the G string the notes go C, B, B (fret 5, 4, 4), which is Line 1 from the last lesson. On the D string they go F, F, E (fret 3, 3, 2), which is Line 2. And the top note goes **E, E, D**, a step that closes the phrase.

Tiny moves, huge sound.` },
      { type: 'chords', refs: ['m9_r5@D', 'dom13_r6@G', 'maj9_r5@C'], showNotes: true, caption: 'Dm9, G13, Cmaj9. Watch the top note step down from E to D.' },
      { type: 'text', md: `Pick each chord apart first so you know every string rings. Then play the loop slowly. Let the chords overlap a little, the way a keyboard player's sustain pedal would.` },
      { type: 'exercise', spec: { kind: 'chord-arp', ref: 'm9_r5@D' } },
      { type: 'exercise', spec: { kind: 'chord-arp', ref: 'dom13_r6@G' } },
      { type: 'exercise', spec: { kind: 'chord-arp', ref: 'maj9_r5@C' } },
      { type: 'tip', md: `**Style note.** This kind of glassy, stepwise chord motion is a big part of the sound in modern soul and neo-soul. Slow tempo, let it breathe.` },
      { type: 'exercise', spec: { kind: 'progression', refs: ['m9_r5@D', 'dom13_r6@G', 'maj9_r5@C'], bpm: 66, beatsPerChord: 4, bars: 12 } },
    ],
  },
  {
    id: 'u5l4', unit: 5, title: 'Inner-voice embellishment', minutes: 8,
    summary: 'Hammer-ons and pull-offs inside a held chord, so the harmony moves while you stay put.',
    blocks: [
      { type: 'text', md: `You do not have to change chords to make the harmony move. Hold a shape and let one note inside it hop to a neighbour and back. This is how a lot of Mayer-style chord playing breathes.

Two moves worth owning:

- **sus4 to 3rd.** Inside D, the F# on the high e string moves to G and back. That is D to Dsus4 to D.
- **9th to root.** Inside C, the C on the B string moves to D and back. That is C to Cadd9 to C.` },
      { type: 'chords', refs: ['D_open', 'Dsus4_open', 'C_open', 'Cadd9_open'], caption: 'Same chord, one note changes.' },
      { type: 'text', md: `### How to do it
For the D: hold the chord and put your pinky down on fret 3 of the high e string with a hammer-on. Then pull off to the F# at fret 2.

For the C: keep your first finger on fret 1 of the B string. Hammer on to fret 3 for D, then pull off back to the C.

Keep the other strings ringing. The picking hand should just strum or pluck once, and the left hand does the work.` },
      { type: 'exercise', spec: { kind: 'sequence', label: 'D chord: F#, G, F# on the high e', notes: ['F#4', 'G4', 'F#4'] } },
      { type: 'exercise', spec: { kind: 'sequence', label: 'C chord: C, D, C on the B string', notes: ['C4', 'D4', 'C4'] } },
      { type: 'text', md: `When both feel smooth, loop them: strum the chord once, then run the hammer and pull while it rings. That one gesture is a whole phrase.` },
    ],
  },
];
