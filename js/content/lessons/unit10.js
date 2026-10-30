// Unit 10: Harmony toolbox
export const LESSONS = [
  {
    id: 'u10l1', unit: 10, title: 'The circle of fifths', minutes: 9,
    summary: 'One map of all twelve keys, and the reason ii-V-I always walks the same way.',
    blocks: [
      { type: 'text', md: `The **circle of fifths** is a map of the twelve keys. Start at C, with no sharps or flats. Move up a perfect 5th and you get G. Up another 5th and you get D. Keep going and you are back at C after twelve steps.

### The sharp side
Each step up a 5th adds one sharp:

- **C:** none
- **G:** 1 sharp
- **D:** 2 sharps
- **A:** 3 sharps
- **E:** 4 sharps
- **B:** 5 sharps
- **F#:** 6 sharps

The sharps arrive in a fixed order: **F, C, G, D, A, E, B.** So G has F#. D has F# and C#. A has F#, C# and G#. To learn it, remember a silly sentence: Father Charles Goes Down And Ends Battle.

### The flat side
Go the other way, down a 5th (or up a 4th), and each step adds a flat:

- **F:** 1 flat
- **Bb:** 2 flats
- **Eb:** 3 flats
- **Ab:** 4 flats
- **Db:** 5 flats
- **Gb:** 6 flats

The flats arrive in the reverse order: **B, E, A, D, G, C, F.** Bb has Bb and Eb. Eb has Bb, Eb and Ab.` },
      { type: 'text', md: `### Why neighbours feel close
Two keys next to each other on the circle share **six of their seven notes**. C and G differ by one note only: C has F, G has F#. That is why a song can slide from C to G and still feel at home. It is also why the I, IV and V of any key are neighbours on the circle: the IV is one step flat-ward, the V is one step sharp-ward. In C, those are F and G.

### The path home
Look at the roots of a ii-V-I in C: **D, G, C.** D to G is a 5th down. G to C is a 5th down. The ii-V-I is the circle of fifths, walked **backwards**, one step at a time.

This is the strongest motion in tonal music. A 5th down feels like falling toward home. Keep going and you get a whole chain: Em7, A7, Dm7, G7, Cmaj7. Each chord sets up the next.` },
      { type: 'exercise', spec: { kind: 'quiz', questions: [
        { q: 'How many sharps does D major have?', options: ['1', '2', '3', '4'], answer: 1, explain: 'D is two steps up the circle from C. Its sharps are F# and C#.' },
        { q: 'Which key has three flats?', options: ['F', 'Bb', 'Eb', 'Ab'], answer: 2, explain: 'The flat keys in order are F, Bb, Eb. Eb has Bb, Eb and Ab.' },
        { q: 'Which key is one step sharp-ward from G on the circle?', options: ['C', 'D', 'A', 'F'], answer: 1, explain: 'Up a perfect 5th from G is D.' },
        { q: 'In the key of Bb, what is the V chord?', options: ['Eb', 'F', 'G', 'C'], answer: 1, explain: 'The V is the 5th note of the scale. Bb, C, D, Eb, F. The 5th note is F.' },
        { q: 'In the key of G, a ii-V-I is Am7, D7 and Gmaj7. What moves from D7 to Gmaj7?', options: ['The root rises a 5th', 'The root falls a 5th', 'The root falls a half step', 'The root stays'], answer: 1, explain: 'D down to G is a perfect 5th. Every step of ii-V-I falls a 5th.' },
        { q: 'How many notes do C major and G major share?', options: ['4', '5', '6', '7'], answer: 2, explain: 'Only F and F# differ. The other six notes are the same.' },
      ] } },
      { type: 'text', md: `Now play the flat side of the circle. These are the roots of C, F, Bb, Eb, Ab, Db and Gb, in order. Each one is a 5th below the last, or a 4th above. Use whichever octave is closest to your hand.` },
      { type: 'exercise', spec: { kind: 'sequence', label: 'Down the circle by fifths', notes: ['C3', 'F2', 'Bb2', 'Eb3', 'Ab2', 'Db3', 'Gb2'] } },
    ],
  },
  {
    id: 'u10l2', unit: 10, title: 'Triad inversions on the top strings', minutes: 9,
    summary: 'Tiny three-note shapes on the G, B and high e strings, and how to chain them with a smooth top note.',
    blocks: [
      { type: 'text', md: `A triad has three notes, so it can be stacked in three ways. The note on the bottom decides the name:

- **Root position:** root on the bottom. For C, that is C, E, G.
- **1st inversion:** 3rd on the bottom. E, G, C.
- **2nd inversion:** 5th on the bottom. G, C, E.

Same chord, three different shapes. On the **G, B and high e strings** each one is tiny. Three notes, three fingers or one barre, no stretching. Keyboard players call this closed-position voicing. It is the sound of a Rhodes chord with the left hand away.

Here are all three for C:` },
      { type: 'chords', refs: ['tri_r3@C', 'tri_r5@C', 'tri_r4@C'], showNotes: true, caption: 'C: root position (G-B-e frets 5-5-3), 1st inversion (9-8-8), 2nd inversion (0-1-0).' },
      { type: 'text', md: `Now F and G, so you can see how each moves. F root position sits high up at fret 10. The 1st inversion is down near the nut, at frets 2, 1 and 1. The 2nd inversion is at fret 5. G root position is way up at fret 12, so you will usually pick another inversion for G.` },
      { type: 'chords', refs: ['tri_r3@F', 'tri_r5@F', 'tri_r4@F'], showNotes: true, caption: 'F: root position, 1st inversion, 2nd inversion.' },
      { type: 'chords', refs: ['tri_r3@G', 'tri_r5@G', 'tri_r4@G'], showNotes: true, caption: 'G: root position, 1st inversion, 2nd inversion.' },
      { type: 'text', md: `### The smooth top voice
The trick is to choose the inversion that keeps your **top note moving by step** between chords. Remember: your ear follows the top note.

Try C, F, G and F:

- **C**, root position (frets 5-5-3): the top note is G.
- **F**, 2nd inversion (5-6-5): the top note is A.
- **G**, 1st inversion (4-3-3): the top note is G.
- **F**, 2nd inversion again: the top note is A.

The top line goes G, A, G, A. It is a small melody, and your hand barely moves. The F chord (C, F, A) and the C chord (C, E, G) share the low C, so only two notes change between them.` },
      { type: 'tip', md: `**Decorate with hammer-ons.** Take the C triad at frets 5-5-3. Fret the B string at 6 first. That is F, and it sounds like Csus4. Then pull off to fret 5 for E. That is the sus-to-major move from unit 4, tiny and slick. You can also hammer from G to A on the high e string (fret 3 to fret 5) for a sixth. This is the stuff Mayer-style players do all the time.` },
      { type: 'exercise', spec: { kind: 'chord-arp', ref: 'tri_r3@C' } },
      { type: 'text', md: `Now chain them. The top-note line is G, A, G, A. Strum lightly with your thumb or the fingers of your picking hand across just the three strings.` },
      { type: 'exercise', spec: { kind: 'progression', refs: ['tri_r3@C', 'tri_r4@F', 'tri_r5@G', 'tri_r4@F'], bpm: 70, beatsPerChord: 4, bars: 8 } },
    ],
  },
  {
    id: 'u10l3', unit: 10, title: 'Slash chords and upper structures', minutes: 9,
    summary: 'Put a simple triad over a different bass note and a rich chord appears.',
    blocks: [
      { type: 'text', md: `A **slash chord** puts a chord over a bass note. **C/G** is a C chord with G in the bass. But slash chords can also do something clever: put a triad over a bass note that is *not* in it, and the triad becomes an **upper structure** that builds a bigger chord.

Three to know:

- **Em over C** is C, E, G, B, which is **Cmaj7**. The open Cmaj7 is literally this: a C in the bass with an E minor triad on top.
- **Am over F** is F, A, C, E, which is **Fmaj7**.
- **F over G** is G, F, A, C. From G the notes are b7, 9 and 4. That is **G9sus4**.` },
      { type: 'chords', refs: ['Cmaj7_open', 'Fmaj7_open', 'FoverG'], showNotes: true, caption: 'Cmaj7 (Em over C), Fmaj7 (Am over F), and G9sus4 (F over G).' },
      { type: 'text', md: `### The soft dominant
G9sus4 is a great chord. It is a dominant chord with the **3rd removed**. No B means no tritone, so it does not pull toward C as hard as G7 does. Instead it leans, like a sigh. This is a common soft-gospel and neo-soul sound for the V chord.

The recipe is easy to remember: take the triad a whole step **below** the bass note and put it on top. F is a whole step below G. Play F, A, C over a G bass.

Listen to G7 into Cmaj9, then F/G into Cmaj9. Same destination, very different journey.` },
      { type: 'listen', label: 'G7 into Cmaj9', refs: ['G7_open', 'Cmaj9_open'], mode: 'strum' },
      { type: 'listen', label: 'F/G into Cmaj9', refs: ['FoverG', 'Cmaj9_open'], mode: 'strum' },
      { type: 'exercise', spec: { kind: 'quiz', questions: [
        { q: 'An Em triad over a C bass makes which chord?', options: ['Cmaj7', 'C7', 'Cadd9', 'Cm7'], answer: 0, explain: 'C with E, G and B on top is C, E, G, B. That is Cmaj7.' },
        { q: 'An Am triad over an F bass makes which chord?', options: ['Fm7', 'Fmaj7', 'F7', 'Fsus2'], answer: 1, explain: 'F, A, C and E. A major 3rd and a major 7th above F make Fmaj7.' },
        { q: 'An F triad over a G bass makes which chord?', options: ['G7', 'Gmaj7', 'G9sus4', 'Gm7'], answer: 2, explain: 'From G, the F is the b7, the A is the 9th and the C is the 4th. No 3rd, so it is a sus chord.' },
        { q: 'Why does G9sus4 pull to C less than G7 does?', options: ['It has no root', 'It has no B, the note that rises to C', 'It is louder', 'It has a major 7th'], answer: 1, explain: 'The B of G7 wants to rise to C. Without it the chord leans gently instead of pulling.' },
        { q: 'In a slash chord like C/E, the note after the slash is...', options: ['the lowest note', 'the 5th', 'the top note', 'the key'], answer: 0, explain: 'The name before the slash is the chord. The note after the slash is the bass.' },
      ] } },
      { type: 'text', md: `Put it to work. F/G is a V chord, so it lands on Cmaj9. Four beats each. Play F/G with the low G on beat 1 and let the high notes ring.` },
      { type: 'exercise', spec: { kind: 'progression', refs: ['FoverG', 'Cmaj9_open'], bpm: 66, beatsPerChord: 4, bars: 8 } },
    ],
  },
  {
    id: 'u10l4', unit: 10, title: 'Borrowed chords', minutes: 10,
    summary: 'Steal chords from the parallel minor to add shade to a major key.',
    blocks: [
      { type: 'text', md: `Songs in C major are not limited to the seven chords of C major. You can **borrow** a chord from the key with the same name but the minor mood: **C minor.** This is called **modal interchange**. The two keys share a root, so the borrowed chords still feel at home.

C minor has these notes: C, D, Eb, F, G, Ab, Bb. Three borrowed chords matter most:

- **iv (Fm).** You met it in unit 6. F, Ab, C.
- **bVI (Abmaj7).** Ab, C, Eb, G. Warm, wide and cinematic.
- **bVII (Bb).** Bb, D, F. A strong, gospel-flavoured walk home.

The "b" in bVI and bVII means the root is a half step lower than the major scale would have. Ab is lower than the A in C major. Bb is lower than B.` },
      { type: 'chords', refs: ['Fm_barre', 'maj7_r6@Ab', 'maj_r5@Bb'], showNotes: true, caption: 'Fm, Abmaj7 and Bb: three colours from C minor.' },
      { type: 'text', md: `Why do they work? They share a root and a lot of notes with the major key, so the harmony is close. But each one brings a note that is not in C major, such as Ab or Eb. That note sounds like a cloud passing over the sun.

Bb to C is a favourite move. The Bb chord steps up a whole tone into C. The Bb is also the flat 7th of C, the same note the Mixolydian mode uses in unit 9, so it feels natural and a little bluesy.` },
      { type: 'listen', label: 'C, Abmaj7, Bb, C', refs: ['C_open', 'maj7_r6@Ab', 'maj_r5@Bb', 'C_open'], mode: 'strum' },
      { type: 'text', md: `Can you hear the iv? Test your ear. In these progressions, one has a borrowed iv chord and the rest do not.` },
      { type: 'exercise', spec: { kind: 'ear', mode: 'progression', options: ['I-IV-iv-I', 'I-IV-V-I', 'I-vi-IV-V'], rounds: 8 } },
      { type: 'text', md: `Now play the whole set in a loop: C, Fm, Abmaj7, Bb. Four beats each. The Abmaj7 root is on the low E string at fret 4. The Bb is the familiar A-shape barre at fret 1. Go slowly and listen for the mood to shift.` },
      { type: 'exercise', spec: { kind: 'progression', refs: ['C_open', 'Fm_barre', 'maj7_r6@Ab', 'maj_r5@Bb'], bpm: 72, beatsPerChord: 4, bars: 8 } },
    ],
  },
];
