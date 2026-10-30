// Unit 9: Scales and modes
export const LESSONS = [
  {
    id: 'u9l1', unit: 9, title: 'Pentatonic scales', minutes: 9,
    summary: 'Five notes that almost never clash. The scale behind most guitar lines you love.',
    blocks: [
      { type: 'text', md: `A major or minor scale has seven notes. A **pentatonic** scale has five. Penta means five. It is the same scale with the two trickiest notes removed, so what is left sits well over almost any chord in the key.

The **minor pentatonic** is: **1, b3, 4, 5, b7.**

Start from the natural minor scale and drop the 2nd and the b6. In A minor that means dropping B and F. You keep **A, C, D, E, G.**

Those five notes are why a bluesy lick sounds good over nearly anything. There is no note in the set that fights the chord.` },
      { type: 'text', md: `### The box at fret 5
Guitarists learn the scale as a shape. This one is called the first position, or the box. Put your first finger on fret 5 and play two notes on every string. The coral dots are A, the root.

- Low E: fret 5 and 8
- A: fret 5 and 7
- D: fret 5 and 7
- G: fret 5 and 7
- B: fret 5 and 8
- High e: fret 5 and 8` },
      { type: 'fretboard', from: 4, to: 9, caption: 'A minor pentatonic, box at fret 5. Roots (A) in coral.', marks: [
        { string: 0, fret: 5, label: 'A', kind: 'root' }, { string: 0, fret: 8, label: 'C', kind: 'tone' },
        { string: 1, fret: 5, label: 'D', kind: 'tone' }, { string: 1, fret: 7, label: 'E', kind: 'tone' },
        { string: 2, fret: 5, label: 'G', kind: 'tone' }, { string: 2, fret: 7, label: 'A', kind: 'root' },
        { string: 3, fret: 5, label: 'C', kind: 'tone' }, { string: 3, fret: 7, label: 'D', kind: 'tone' },
        { string: 4, fret: 5, label: 'E', kind: 'tone' }, { string: 4, fret: 8, label: 'G', kind: 'tone' },
        { string: 5, fret: 5, label: 'A', kind: 'root' }, { string: 5, fret: 8, label: 'C', kind: 'tone' },
      ] },
      { type: 'text', md: `### One shape, two names
Now the useful trick. **C major pentatonic** is 1, 2, 3, 5, 6, which in C is **C, D, E, G, A.** Those are the same five notes as A minor pentatonic.

The two scales are **relatives**. A minor and C major share all their notes, and so do their pentatonics. Same box, different home. Land on A and it sounds minor and bluesy. Land on C and it sounds bright and open.

So one fingering gives you two keys' worth of lines. Over Am7 or Cmaj7 or Dm7 in the key of C, you cannot go far wrong inside this box.` },
      { type: 'text', md: `### Hear the shape
Every step of the minor pentatonic from the root is an interval you already know: a **minor 3rd**, a **perfect 4th**, a **perfect 5th**, and a **minor 7th**. Train your ear on them.` },
      { type: 'exercise', spec: { kind: 'ear', mode: 'interval', options: ['m3', 'P4', 'P5', 'm7'], rounds: 8 } },
      { type: 'text', md: `Now play the box. Start on the low E at fret 5 and climb through two octaves, from A2 up to A4. Use your first finger for fret 5, your third for fret 7 and your pinky for fret 8. Keep it slow and even.` },
      { type: 'exercise', spec: { kind: 'sequence', label: 'A minor pentatonic, two octaves', notes: ['A2', 'C3', 'D3', 'E3', 'G3', 'A3', 'C4', 'D4', 'E4', 'G4', 'A4'] } },
    ],
  },
  {
    id: 'u9l2', unit: 9, title: 'Chord tones and colour tones', minutes: 9,
    summary: 'Arpeggiate the chord, then learn why landing on a chord tone makes a line sound planned.',
    blocks: [
      { type: 'text', md: `Take any chord. Its **chord tones** are the notes inside it: root, 3rd, 5th, 7th. Every other note of the key is a **colour tone**. It is not in the chord, but it can still sound good when it passes by.

Here are three chords from a ii-V-I in C, with their chord tones:

- **Dm7:** D, F, A, C
- **G7:** G, B, D, F
- **Cmaj7:** C, E, G, B

Play only those four notes, one at a time, and you have an **arpeggio**. It is the safest melody there is. Every note agrees with the chord.` },
      { type: 'text', md: `### Why chord tones matter
When the chord changes, your ear listens to the first note that follows. If that note is a chord tone of the new chord, the line sounds **intentional**. You knew where the harmony was going.

A colour tone can be a lovely passing note. But if you land on one right as the chord arrives, the line can sound lost.

The rule is easy to remember:

- **Strong beats** (especially the first beat of a new chord): chord tones.
- **Weak beats and passing moments:** colour tones are fine.

Colour tones over Dm7 in the key of C are E (the 9th), G (the 11th) and B (the 13th). They sound rich when they pass between chord tones. They sound unsure when you rest on them.` },
      { type: 'listen', label: 'Hear the ii-V-I', refs: ['Dm7_open', 'G7_open', 'Cmaj7_open'], mode: 'strum' },
      { type: 'text', md: `A bonus. Look at where the arpeggios meet. The top of Dm7 is C. The G7 that follows has B as its 3rd. C falls to B by half a step. That is a guide tone line from unit 5, now sitting inside your solo.` },
      { type: 'exercise', spec: { kind: 'quiz', questions: [
        { q: 'Which are the chord tones of G7?', options: ['G, A, B, C', 'G, B, D, F', 'G, B, D, F#', 'G, Bb, D, F'], answer: 1, explain: 'A dominant 7 chord stacks root, major 3rd, perfect 5th and flat 7th. In G that is G, B, D and F.' },
        { q: 'Over Dm7 in the key of C, which of these notes is a colour tone and not a chord tone?', options: ['F', 'A', 'E', 'C'], answer: 2, explain: 'Dm7 is D, F, A, C. E is the 9th. It is in the key, but not in the chord, so it is a colour tone.' },
        { q: 'A new chord arrives on beat 1. What should your melody do?', options: ['Land on a chord tone', 'Land on any scale note', 'Rest on the 4th', 'Avoid the root'], answer: 0, explain: 'A chord tone on the first beat tells the ear you heard the change. Save colour tones for the weak beats.' },
        { q: 'The last note of your Dm7 arpeggio is C. What is a smooth step into G7?', options: ['C up to D', 'C down to B', 'C down to A', 'C stays on C'], answer: 1, explain: 'C is the 7th of Dm7 and B is the 3rd of G7. A half step down links the two chords.' },
        { q: 'Which note is the 3rd of Cmaj7?', options: ['D', 'F', 'E', 'G'], answer: 2, explain: 'Cmaj7 is C, E, G, B. The 3rd is E.' },
      ] } },
      { type: 'text', md: `Now play the arpeggios. First Dm7, which sits near the open position: D on the A string at fret 5, F on the D string at fret 3, A on the G string at fret 2, C on the G string at fret 5. Then G7 from the low E string at fret 3, and Cmaj7 from the A string at fret 3.` },
      { type: 'exercise', spec: { kind: 'sequence', label: 'Dm7 arpeggio', notes: ['D3', 'F3', 'A3', 'C4'] } },
      { type: 'exercise', spec: { kind: 'sequence', label: 'G7 arpeggio', notes: ['G2', 'B2', 'D3', 'F3'] } },
      { type: 'exercise', spec: { kind: 'sequence', label: 'Cmaj7 arpeggio', notes: ['C3', 'E3', 'G3', 'B3'] } },
    ],
  },
  {
    id: 'u9l3', unit: 9, title: 'Modes made simple', minutes: 10,
    summary: 'A mode is the same notes with a different home. Three of them cover neo-soul.',
    blocks: [
      { type: 'text', md: `A **mode** is a scale you get by starting a major scale on a different note. The notes do not change. The **home note** does, and that changes how everything sounds around it.

Take the C major scale: C D E F G A B. Start on D and play to the next D. You get D E F G A B C D. Every note is from C major, but now D is home, and it sounds minor. That is **D Dorian**.

There are seven modes. You only need three for this style.` },
      { type: 'text', md: `### Dorian: the minor with a bright 6th
Dorian is: **1, 2, b3, 4, 5, 6, b7.**

Compare it with natural minor: 1, 2, b3, 4, 5, **b6**, b7. The only difference is the 6th. Dorian has a **natural 6th**. In D, that is B natural instead of Bb.

That one note gives minor chords a lift. It is the sound of Dm7, Dm9 and Dm11 in neo-soul, soft but not sad. Over a m7 or m9 in a neo-soul groove, reach for Dorian first.

### Mixolydian: the major with a b7
Mixolydian is: **1, 2, 3, 4, 5, 6, b7.** It is a major scale with a flat 7th. G Mixolydian is G A B C D E F, which is C major from G. It fits a **dominant 7** chord exactly, because the b7 is already the chord's 7th.

### Lydian: the dreamy major
Lydian is: **1, 2, 3, #4, 5, 6, 7.** It is a major scale with a **sharp 4th**. F Lydian is F G A B C D E, which is C major from F. That B natural, instead of Bb, is the #4. On a chord it is called the **#11**, and it makes a maj7 chord shimmer.` },
      { type: 'chords', refs: ['Cmaj7s11_open', 'Fmaj7s11_open'], showNotes: true, caption: 'Cmaj7#11 (the F# is the sharp 11th) and Fmaj7#11 (the B is the sharp 11th).' },
      { type: 'text', md: `Hear the difference on the F chord. Fmaj7 is F, A, C, E. Fmaj7#11 swaps the C for a B, so the chord is F, A, B, E. The B is the #11. The plain F major scale has Bb as its 4th. Lydian raises it a half step to B, and that one note is the shimmer you hear.` },
      { type: 'listen', label: 'Fmaj7, then Fmaj7#11', refs: ['Fmaj7_open', 'Fmaj7s11_open'], mode: 'strum' },
      { type: 'exercise', spec: { kind: 'quiz', questions: [
        { q: 'Which mode fits a m9 chord in a neo-soul groove?', options: ['Lydian', 'Mixolydian', 'Dorian', 'Natural major'], answer: 2, explain: 'Dorian has the b3 and b7 of a minor chord, plus the natural 6th that gives it the soft lift.' },
        { q: 'Which mode fits a G7 chord?', options: ['G Mixolydian', 'G Lydian', 'G Dorian', 'G Locrian'], answer: 0, explain: 'Mixolydian is major with a b7. G7 has that b7, so G Mixolydian matches it exactly.' },
        { q: 'Which mode fits a maj7#11 chord?', options: ['Dorian', 'Lydian', 'Mixolydian', 'Natural minor'], answer: 1, explain: 'The #4 of Lydian is the #11 of the chord. That is the whole point of Cmaj7#11.' },
        { q: 'What note makes Dorian different from natural minor?', options: ['A flat 2nd', 'A natural 6th', 'A sharp 4th', 'A major 7th'], answer: 1, explain: 'Natural minor has a b6. Dorian raises it to a natural 6th. Everything else is the same.' },
        { q: 'Which note is the sharp 11th in Cmaj7#11?', options: ['F', 'F#', 'B', 'Bb'], answer: 1, explain: 'The 11th of C is F. Sharpen it and you get F#, the extra note in Cmaj7#11.' },
      ] } },
      { type: 'text', md: `Play D Dorian once, one octave from D3 to D4. Every note is a note of C major, but you are hearing it from D. Listen to how the B and the C near the top give the scale its character.` },
      { type: 'exercise', spec: { kind: 'sequence', label: 'D Dorian, one octave', notes: ['D3', 'E3', 'F3', 'G3', 'A3', 'B3', 'C4', 'D4'] } },
    ],
  },
  {
    id: 'u9l4', unit: 9, title: 'Which notes over which chord', minutes: 10,
    summary: 'A simple plan for a fill: start on a chord tone, move through the pentatonic, land on the next chord\'s 3rd.',
    blocks: [
      { type: 'text', md: `You now have a toolbox. Here is how to choose from it without thinking too hard. It is called chord-scale thinking: each chord gets a scale that matches its notes.

- **Maj7:** the major scale, or Lydian for a shimmer.
- **m7 or m9:** the minor pentatonic, or Dorian.
- **Dominant 7:** the Mixolydian, or the minor pentatonic for something bluesy.

When all your chords come from one key, it gets easier. Every chord of C major takes the notes of C major. The chord just changes which of those notes are the safest.` },
      { type: 'text', md: `### A three-part fill
Here is a recipe for a short fill between two chords.

1. **Start** on a chord tone of the first chord.
2. **Move** through the pentatonic in the middle. It is safe, and it keeps the line moving.
3. **Land** on a chord tone of the next chord. The 3rd is best, because it tells the ear whether the chord is major or minor.

Let us build one. The chords are **Am7 to Dm7**. The 3rd of Dm7 is **F**, so that is our landing note.

The fill: **E, D, C, A, G, F**.

- E is the 5th of Am7. Start here, on the open high e string.
- D and C are in the A minor pentatonic. D is on the B string at fret 3, C on the B string at fret 1.
- A is the root of Am7, on the G string at fret 2. A strong rest.
- G is the open G string. It is a passing note, the 11th of Dm7, and it wants to fall.
- F is on the D string at fret 3. It is the 3rd of Dm7 and lands on beat 1 of the new chord.

Time it like this. E, D and C on beats 1, 2 and 3. A on beat 4. G on the "and" of 4. F on beat 1 of Dm7.` },
      { type: 'chords', refs: ['Am7_open', 'Dm7_open'], showNotes: true, caption: 'Am7 into Dm7. The fill bridges them.' },
      { type: 'tip', md: `**Mayer-style double-stops.** Instead of a single note, play two chord tones together on neighbouring strings. Over Am7, the C on the B string (fret 1) and the open high E together are the 3rd and 5th of the chord. Slide or bend into them for the singing, vocal quality you hear in blues-soul guitar.` },
      { type: 'text', md: `First play the fill alone, slowly.` },
      { type: 'exercise', spec: { kind: 'sequence', label: 'The fill: Am7 to the F of Dm7', notes: ['E4', 'D4', 'C4', 'A3', 'G3', 'F3'] } },
      { type: 'text', md: `Now put it over the chords. Play Am7 for four beats and Dm7 for four. Strum on beat 1 of each chord, and play the fill in the space around it. Once it is smooth, change a note or two. Try starting from C, the 3rd of Am7, and see where it lands.` },
      { type: 'exercise', spec: { kind: 'progression', refs: ['Am7_open', 'Dm7_open'], bpm: 70, beatsPerChord: 4, bars: 8 } },
    ],
  },
];
