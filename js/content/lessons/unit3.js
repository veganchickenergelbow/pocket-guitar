// Unit 3: Seventh chords
export const LESSONS = [
  {
    id: 'u3l1', unit: 3, title: 'Major 7', minutes: 8,
    summary: 'Add the seventh note to a major chord for a dreamy, open sound.',
    blocks: [
      { type: 'text', md: `Take a major triad and stack one more third on top. For C that gives C, E, G, **B**. The new note is the 7th scale degree. It sits one fret below the root, an octave up. That half step of tension against the root is the shimmer.

Formula: **1 3 5 7**. Name: **Cmaj7**.

It sounds settled but unfinished, like a sentence that trails off on purpose. That is why it is the home chord in so much laid-back, soulful music.` },
      { type: 'chords', refs: ['Cmaj7_open', 'Fmaj7_open', 'Amaj7_open', 'Dmaj7_open'], caption: 'Four open maj7 chords. Tap each one.' },
      { type: 'text', md: `Notice what the open shapes do. Compare Cmaj7 to a plain C: you lift one finger off the B string, and the open B rings. That is the 7th. Everything is a small move from what you know.

Here is the movable version, with the root on the A string. It leaves out the low strings so it stays clear.` },
      { type: 'chords', refs: ['maj7_r5@C', 'maj7_r5@F'], showNotes: true, caption: 'Root-5 maj7 at C and F. Slide it to any root.' },
      { type: 'text', md: `Pick the Cmaj7 apart first, one string at a time, then play between Cmaj7 and Fmaj7. Let each chord ring.` },
      { type: 'exercise', spec: { kind: 'chord-arp', ref: 'Cmaj7_open' } },
      { type: 'exercise', spec: { kind: 'progression', refs: ['Cmaj7_open', 'Fmaj7_open'], bpm: 60, beatsPerChord: 4, bars: 8 } },
    ],
  },
  {
    id: 'u3l2', unit: 3, title: 'Minor 7', minutes: 8,
    summary: 'A minor triad plus a flat seventh. Soft, warm and a little open.',
    blocks: [
      { type: 'text', md: `Minor 7 is a minor triad with a **flat 7th** on top. For A: A, C, E, **G**. The G is two frets below the octave, a whole step under the root.

Formula: **1 b3 5 b7**. Name: **Am7**.

A plain minor chord can sound heavy or sad. The 7th softens it. It feels more like a shrug than a sigh. You will hear it constantly in smooth, mellow music.` },
      { type: 'chords', refs: ['Am7_open', 'Em7_open', 'Dm7_open'], caption: 'Am7, Em7, Dm7. These three are vi, iii and ii in the key of C.' },
      { type: 'text', md: `Two movable shapes cover almost everything. One has its root on the low E string, one on the A string. The chord's name is whatever note sits under the root.` },
      { type: 'chords', refs: ['m7_r6@A', 'm7_r5@D'], showNotes: true, caption: 'Am7 (root-6, fret 5) and Dm7 (root-5, fret 5). Notice both are at fret 5.' },
      { type: 'text', md: `Play the three open chords as a loop. Keep your fingers relaxed, and let the open strings ring into each other. Count four beats per chord.` },
      { type: 'exercise', spec: { kind: 'progression', refs: ['Am7_open', 'Dm7_open', 'Em7_open'], bpm: 66, beatsPerChord: 4, bars: 9 } },
    ],
  },
  {
    id: 'u3l3', unit: 3, title: 'Dominant 7', minutes: 8,
    summary: 'A major chord with a flat 7th. It leans, and wants to go home.',
    blocks: [
      { type: 'text', md: `The dominant 7 is a major triad with a **flat 7th**: 1, 3, 5, b7. For G: G, B, D, **F**. Name: **G7**.

It sits on the V chord of a key. Inside it is a tense interval, the **tritone**, between the 3rd (B) and the b7 (F). Those two notes are three whole steps apart, and your ear hears that as an unresolved lean. The tension resolves when B moves up to C and F moves down to E. Both notes land inside the I chord, Cmaj7.

That is the pull of V to I. You will use it in every progression from now on.` },
      { type: 'chords', refs: ['G7_open', 'E7_open', 'A7_open', 'B7_open'], caption: 'G7, E7, A7, B7. Four open dominant chords.' },
      { type: 'listen', label: 'G7 resolving to Cmaj7', refs: ['G7_open', 'Cmaj7_open'], mode: 'strum' },
      { type: 'text', md: `Play G7 and let it hang for a moment. Then play Cmaj7. Feel the release. Do it a few times so you can tell the three sevenths apart by character: maj7 is dreamy, m7 is soft, and 7 is leaning forward.

Now test your ears on the three.` },
      { type: 'exercise', spec: { kind: 'ear', mode: 'quality', options: ['maj7', 'm7', '7'], rounds: 8 } },
    ],
  },
  {
    id: 'u3l4', unit: 3, title: 'The ii-V-I', minutes: 10,
    summary: 'The most important progression in harmony, in three chords you now know.',
    blocks: [
      { type: 'text', md: `Build a seventh chord on every note of the C major scale and you get a set of chords with a clear personality:

- **Imaj7** Cmaj7
- **ii7** Dm7
- **iii7** Em7
- **IVmaj7** Fmaj7
- **V7** G7
- **vi7** Am7
- **vii m7b5** Bm7b5

The ii, V and I together make the **ii-V-I**. It is a chain of fifths falling home: D to G to C. Each chord pulls to the next. Soul, gospel and jazz are full of it, and so is a lot of pop ballad writing.` },
      { type: 'chords', refs: ['m7_r5@D', 'dom7_r6@G', 'maj7_r5@C'], showNotes: true, caption: 'Dm7 (root-5), G7 (root-6), Cmaj7 (root-5). Hear the three in order.' },
      { type: 'listen', label: 'Dm7, G7, Cmaj7', refs: ['m7_r5@D', 'dom7_r6@G', 'maj7_r5@C'], mode: 'strum' },
      { type: 'text', md: `Fretboard shapes make this compact. The three chords sit within a couple of frets of each other. That closeness matters in the next unit.

Check your understanding, then play the loop.` },
      { type: 'exercise', spec: { kind: 'quiz', questions: [
        { q: 'In C, which chord is ii7?', options: ['Em7', 'Dm7', 'Fmaj7', 'Am7'], answer: 1, explain: 'D is the second note of C major, and the ii chord is a minor 7.' },
        { q: 'In C, which chord is V7?', options: ['G7', 'Gmaj7', 'Bm7b5', 'F7'], answer: 0, explain: 'G is the fifth note, and the V chord is the dominant 7.' },
        { q: 'What is the ii-V-I in F major?', options: ['Gm7 C7 Fmaj7', 'Dm7 G7 Fmaj7', 'Am7 D7 Gmaj7', 'Gm7 C7 Cmaj7'], answer: 0, explain: 'In F, G is the second note and C is the fifth.' },
        { q: 'What kind of chord sits on the 7th note of the major scale?', options: ['Major 7', 'Dominant 7', 'Minor 7 flat 5', 'Minor 7'], answer: 2, explain: 'In C that is Bm7b5, also called half-diminished.' },
      ] } },
      { type: 'exercise', spec: { kind: 'progression', refs: ['m7_r5@D', 'dom7_r6@G', 'maj7_r5@C'], bpm: 60, beatsPerChord: 4, bars: 12 } },
    ],
  },
];
