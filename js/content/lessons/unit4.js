// Unit 4: Extensions
export const LESSONS = [
  {
    id: 'u4l1', unit: 4, title: 'add9 and sus chords', minutes: 8,
    summary: 'Two easy colours: the added 9th, and the suspended chords that resolve.',
    blocks: [
      { type: 'text', md: `Extensions are notes added on top of a triad or seventh chord. The simplest is the **add9**: the 9th is the 2nd note of the scale, just placed an octave up. Cadd9 is C, E, G and **D**. No 7th, just a bright shimmer on top.

**Sus chords** swap the 3rd for a neighbour:

- **sus2** replaces the 3rd with the 2nd. Dsus2 is D, E, A.
- **sus4** replaces the 3rd with the 4th. Dsus4 is D, G, A.

With no 3rd the chord is neither major nor minor. It floats.` },
      { type: 'chords', refs: ['Cadd9_open', 'Dsus2_open', 'Asus2_open'], caption: 'Cadd9, Dsus2, Asus2. Tap to hear the float.' },
      { type: 'text', md: `### Sus4 wants to resolve
Sus4 is tension. The 4th sits a half step above the 3rd, and your ear wants it to fall. When it does, the chord clicks into major.

- Dsus4 to D: G falls to F#.
- Asus4 to A: D falls to C#.

This is one of the most used moves in the guitar's vocabulary. Make it deliberate.` },
      { type: 'chords', refs: ['Dsus4_open', 'D_open', 'Asus4_open', 'A_open'], caption: 'Sus4 to major, twice. Look at the one finger that moves.' },
      { type: 'listen', label: 'Dsus4 into D', refs: ['Dsus4_open', 'D_open'], mode: 'strum' },
      { type: 'listen', label: 'Asus4 into A', refs: ['Asus4_open', 'A_open'], mode: 'strum' },
      { type: 'text', md: `Play the resolutions as a loop. Two beats each, so the tension is brief and the release lands.` },
      { type: 'exercise', spec: { kind: 'progression', refs: ['Dsus4_open', 'D_open', 'Asus4_open', 'A_open'], bpm: 70, beatsPerChord: 2, bars: 8 } },
    ],
  },
  {
    id: 'u4l2', unit: 4, title: '9 chords', minutes: 9,
    summary: 'Add the 9th to a seventh chord and the sound opens up.',
    blocks: [
      { type: 'text', md: `A 9 chord is a seventh chord plus the 9th. The 9th is the same note as the 2nd, one octave higher. In C that is D.

- **Cmaj9:** C E G B D
- **Am9:** A C E G B
- **C9 (dominant):** C E G Bb D

On guitar you usually leave out the 5th. It adds little, and you need the room for the notes that matter.` },
      { type: 'chords', refs: ['Cmaj9_open', 'maj9_r5@C', 'm9_r5@C', 'Am9_5th'], showNotes: true, caption: 'Cmaj9 (open), Cmaj9 (movable), Cm9 (movable), Am9 (5th-fret). All dropped the 5th except the last.' },
      { type: 'text', md: `Notice the movable maj9 and m9 shapes are small and compact: four strings, root on the A string. Slide them to any root.

The 9th sits right above the root, so it sounds airy instead of heavy. Play maj7 and then maj9 on the same root. The only difference is that one top note, and it changes the mood from dreamy to open.` },
      { type: 'listen', label: 'Cmaj7 then Cmaj9', refs: ['Cmaj7_open', 'Cmaj9_open'], mode: 'strum' },
      { type: 'exercise', spec: { kind: 'chord-arp', ref: 'Cmaj9_open' } },
      { type: 'exercise', spec: { kind: 'ear', mode: 'quality', options: ['maj7', 'maj9'], rounds: 8 } },
    ],
  },
  {
    id: 'u4l3', unit: 4, title: '11 and 13', minutes: 9,
    summary: 'Pile on the upper colours, and learn what to drop to make them fit.',
    blocks: [
      { type: 'text', md: `Keep stacking thirds past the 9th and you reach the 11th (the 4th, up an octave) and the 13th (the 6th, up an octave). A full 13 chord has seven notes. You only have six strings, and some are hard to reach, so you choose.

The rule is simple. Keep the notes that define the chord:

- The **3rd** (major or minor).
- The **7th**.
- The **colour note** you are naming (11 or 13).

Drop the **5th**, which says little. If a bass player (or your own low string) already has the root, you can sometimes drop it from the middle of the chord too.` },
      { type: 'chords', refs: ['m11_r6@A', 'dom13_r6@G'], showNotes: true, caption: 'Am11 and G13. Compact four-note shapes on the low strings and the B string.' },
      { type: 'text', md: `Look at the G13: low E is G (root), D string is F (b7), G string is B (3rd), B string is E (13th). That is the whole recipe: root, 7, 3, colour.

Am11: root A, G (b7), C (b3), D (the 11th). Same idea, different colour.

Mayer-style players love the 13 on a dominant chord. It adds a sweet sixth against the bluesy flat 7th, and it lets you stay on the V chord without a hard edge.` },
      { type: 'listen', label: 'G13 into Cmaj7', refs: ['dom13_r6@G', 'Cmaj7_open'], mode: 'strum' },
      { type: 'exercise', spec: { kind: 'chord-arp', ref: 'dom13_r6@G' } },
    ],
  },
  {
    id: 'u4l4', unit: 4, title: 'Building voicings yourself', minutes: 10,
    summary: 'A short rule that lets you invent chord shapes on the fly.',
    blocks: [
      { type: 'text', md: `You do not need to memorise a shape for every chord. You need a rule.

### The rule: guide tones plus one colour
- Pick the **3rd and the 7th**. They define the chord quality. These are the guide tones.
- Add **one colour** (a 9th, 11th or 13th that fits the chord).
- Add the root only if nothing else covers it.
- Skip the 5th unless it is free.

Three or four notes is plenty. The sound is in the choice, not the count.` },
      { type: 'text', md: `### Worked example: Dm7
The 3rd is F. The 7th is C. A good colour is the 9th, E. So a voicing needs F, C and E, and a D underneath if possible.

Find them in a small area. On the A string, fret 5 is D. On the D string, fret 3 is F. On the G string, fret 5 is C. On the B string, fret 5 is E. That is the movable m9 shape you already learned. You just rebuilt it from a rule.

### Check yourself
After you build one, name each note and ask: is the 3rd there? Is the 7th there? Is there at least one colour tone? If yes, it works.

### Which colours work?
- On **maj7**, the 9th and 13th are great. The 11th clashes with the 3rd, so avoid it.
- On **m7**, the 9th and 11th are great.
- On **7**, the 9th and 13th are great.` },
      { type: 'chords', refs: ['m7_r6@A', 'm11_r6@A'], caption: 'Same chord, two colours. Hear how the 11th changes it.' },
      { type: 'exercise', spec: { kind: 'quiz', questions: [
        { q: 'Which two notes are the guide tones of a chord?', options: ['Root and 5th', '3rd and 7th', '5th and 9th', 'Root and 3rd'], answer: 1, explain: 'The 3rd and 7th define the quality, so they come first.' },
        { q: 'What are the 3rd and 7th of Dm7?', options: ['F and C', 'F and B', 'E and C', 'F# and C'], answer: 0, explain: 'D minor has F as its 3rd, and the minor 7th above D is C.' },
        { q: 'What are the 3rd and 7th of G7?', options: ['B and F', 'Bb and F', 'B and F#', 'D and F'], answer: 0, explain: 'G7 has a major 3rd (B) and a flat 7th (F).' },
        { q: 'Which colour note is safest to add to Cmaj7?', options: ['D (the 9th)', 'F (the 11th)', 'Bb', 'Db'], answer: 0, explain: 'D, the 9th, sits comfortably on top. F, the 11th, is a half step above the 3rd (E) and rubs against it.' },
        { q: 'Which note can you usually drop first from a bigger chord?', options: ['3rd', '7th', '5th', 'Colour tone'], answer: 2, explain: 'The 5th adds little to the sound, and it takes up space.' },
      ] } },
      { type: 'text', md: `Take away: pick a chord you know the name of, build it with this rule on the A string and the D string, and play it. You have just invented a voicing.` },
    ],
  },
];
