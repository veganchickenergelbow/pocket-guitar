// Unit 12: Moonchild-style neo-soul
export const LESSONS = [
  {
    id: 'u12l1', unit: 12, title: 'The Moonchild sound', minutes: 8,
    summary: 'What makes the style: soft dynamics, maj7 and m9 colours, and a floating #11.',
    blocks: [
      { type: 'text', md: `Moonchild is an LA trio. Amber Navran sings and plays sax and flute. Max Bryk and Andris Mattson complete the trio as multi-instrumentalists and producers. They met at USC. Their sound is jazz-rooted, neo-soul in the Soulquarians tradition, with soft vocals, horn arrangements and warm keys.

You do not need to copy one song. You need the ingredients. Here they are:

- **Soft dynamics.** Nothing is pushed. Even the loud parts feel relaxed.
- **maj7 and m9 chords nearly everywhere.** Plain triads are rare.
- **Sus dominants** instead of hard V7 chords. We cover them next lesson.
- **Borrowed minor chords** for a bittersweet turn. You met one in Unit 6.
- **Warm keys and horns.** Voices and horns answer the lead vocal.
- **A slow, laid-back groove.** Think 85 to 95 bpm, with ghosted 16th notes in the drums.` },
      { type: 'tip', md: `**Listening guide for "The List"** (from the album Voyager, 2017). Play it three times. First pass, follow only the bass line. Second pass, count how often a chord feels like a maj7 or an m9 rather than a plain major or minor. Third pass, listen for where the horns and background voices answer the lead vocal, and notice how much empty space there is. Space is part of the style.` },
      { type: 'text', md: `One colour you will hear all over this style is the **#11**. Take Fmaj7 and add a B natural on top. F to B is a raised fourth, a #11. That B is not in C major, but it is in F **Lydian**. The note floats above the chord and sounds dreamy.

Same trick on Cmaj7: add an F#. Play both below and look at the notes.` },
      { type: 'chords', refs: ['Cmaj7s11_open', 'Fmaj7s11_open'], showNotes: true, caption: 'Cmaj7#11 and Fmaj7#11. The #11 is the dreamy colour.' },
      { type: 'listen', label: 'Fmaj7, then Fmaj7#11', refs: ['Fmaj7_open', 'Fmaj7s11_open'], mode: 'strum' },
      { type: 'text', md: `The first chord is warm and settled. The second is the same chord with the ceiling lifted. Play them back and forth, and keep your touch soft.` },
      { type: 'exercise', spec: { kind: 'quiz', questions: [
        { q: 'Which chord quality is most typical of this style?', options: ['maj7 and m9', 'Plain power chords', 'Bare open triads', 'dim7 only'], answer: 0, explain: 'The sound is built on maj7 and m9 colours.' },
        { q: 'What does a sus dominant replace?', options: ['A hard V7', 'The tonic', 'The bass line', 'The groove'], answer: 0, explain: 'A sus dominant keeps the root motion but softens the V7 bite.' },
        { q: 'In Fmaj7#11, what is the #11?', options: ['B', 'Bb', 'E', 'G'], answer: 0, explain: 'F up to B is a raised fourth. B belongs to F Lydian.' },
        { q: 'Which tempo range fits the laid-back groove?', options: ['85 to 95 bpm', '140 to 160 bpm', '40 to 50 bpm', '180 bpm and up'], answer: 0, explain: 'A slow, relaxed pulse, around 85 to 95 bpm.' },
      ] } },
      { type: 'text', md: `Now play the dreamy colour yourself. Go back and forth, two bars each, and let the notes ring.` },
      { type: 'exercise', spec: { kind: 'progression', refs: ['Fmaj7_open', 'Fmaj7s11_open'], bpm: 70, beatsPerChord: 4, bars: 6 } },
    ],
  },
  {
    id: 'u12l2', unit: 12, title: 'Sus dominants', minutes: 9,
    summary: 'Soften the V chord with a sus shape that keeps the root motion but drops the bite.',
    blocks: [
      { type: 'text', md: `A plain G7 has a B in it. That B is the leading tone, and together with the F it forms a tritone. Both want to resolve. That is why G7 pulls so hard to C.

Neo-soul often softens that pull. A **sus** dominant replaces the 3rd with the 4th, so the B is gone. You keep the root motion (G down to C in the bass) but lose the sharp tension. The result is a drifting, open sound.

A neat shortcut: an **F triad over a G bass** is a G9sus4. The notes are G, F, A, C. That is the root, the b7, the 9th and the 4th. No 3rd at all.` },
      { type: 'chords', refs: ['G7_open', 'FoverG', 'Cmaj9_open'], showNotes: true, caption: 'G7, F/G and Cmaj9. F/G is G9sus4 with no 3rd.' },
      { type: 'listen', label: 'G7 into Cmaj9', refs: ['G7_open', 'Cmaj9_open'], mode: 'strum' },
      { type: 'listen', label: 'F/G into Cmaj9', refs: ['FoverG', 'Cmaj9_open'], mode: 'strum' },
      { type: 'text', md: `Hear the difference? G7 snaps into C. F/G floats into C. Both arrive at the same place.

Here is the F/G shape. Pick out each string and name the note.` },
      { type: 'exercise', spec: { kind: 'chord-arp', ref: 'FoverG' } },
      { type: 'text', md: `Now the bigger shape: **G#13sus4**, the same idea one step up, in the key of A. Its notes, low to high, are:

- **G#** is the root.
- **F#** is the b7.
- **C#** is the 4th, the sus note.
- **E#** is the 13th. It sounds the same as F natural, but it is spelled E# because the chord is built on G#.
- **A#** is the 9th.

So root, b7, 4th, 13th, 9th. No 3rd. Wide and airy.` },
      { type: 'chords', refs: ['Gs13sus4'], showNotes: true, caption: 'G#13sus4. Root, b7, 4th, 13th, 9th.' },
      { type: 'exercise', spec: { kind: 'chord-arp', ref: 'Gs13sus4' } },
      { type: 'text', md: `Last step: play F/G into Cmaj9 slowly. Let the F/G breathe for a full bar before you arrive.` },
      { type: 'exercise', spec: { kind: 'progression', refs: ['FoverG', 'Cmaj9_open'], bpm: 80, beatsPerChord: 4, bars: 8 } },
    ],
  },
  {
    id: 'u12l3', unit: 12, title: 'A study loop from "The List"', minutes: 10,
    summary: 'Amaj7, G#13sus4, F#m9, Dm9: a loop to learn from, then check against the record.',
    blocks: [
      { type: 'text', md: `One user-submitted chord chart online lists chords like Amaj7, Ab13sus, F#m9 and Dm9 for parts of "The List". We will learn those as a **study loop**. Charts online often disagree, so treat this one as a guide, not a fact. Check it against the recording by ear.

Ab and G# are the same note. In the key of A we spell it G#, so the second chord is **G#13sus4**.

The loop: **Amaj7, G#13sus4, F#m9, Dm9.**` },
      { type: 'chords', refs: ['Amaj7_open', 'Gs13sus4', 'm9_r6@F#', 'm9_r5@D'], caption: 'Amaj7, G#13sus4, F#m9, Dm9.' },
      { type: 'listen', label: 'The study loop', refs: ['Amaj7_open', 'Gs13sus4', 'm9_r6@F#', 'm9_r5@D'], mode: 'strum' },
      { type: 'text', md: `Each chord has a job in the key of A:

- **Amaj7** is I. Home.
- **G#13sus4** sits between I and vi. It is a soft passing chord that leads the bass down a step.
- **F#m9** is vi, the gentle minor.
- **Dm9** is a **borrowed minor iv**. D is the IV of A, and Dm comes from A minor. This is the bittersweet move from Unit 6, with a 9th on top.

Follow the **bass**: A, then G#, then F#, then D. It walks down, then steps over to D.

Now find the common tones. Amaj7 has C# and E. G#13sus4 also has C#. F#m9 has E, C# and A. Notes that stay put make the changes feel smooth. Look for them as you play.` },
      { type: 'exercise', spec: { kind: 'chord-arp', ref: 'm9_r6@F#' } },
      { type: 'text', md: `Play the whole loop slowly. Four beats per chord. Then put on the record and play along. If your ear disagrees with the chart on a chord, trust your ear and change it. That is how you learn.` },
      { type: 'exercise', spec: { kind: 'progression', refs: ['Amaj7_open', 'Gs13sus4', 'm9_r6@F#', 'm9_r5@D'], bpm: 88, beatsPerChord: 4, bars: 8 } },
    ],
  },
  {
    id: 'u12l4', unit: 12, title: 'Playing it like them', minutes: 10,
    summary: 'Turn keys and a band into one guitar: soft block chords, a muted backbeat, tiny melodies.',
    blocks: [
      { type: 'text', md: `A trio like this has keys, bass and drums. You have one guitar. So you play the parts of a Rhodes player, and let the bass note do the bass job.

Here is the recipe:

- **Fingerpick block chords.** Thumb on the bass note, three fingers on the upper strings, all together. Like pressing a key. No big strums.
- **Let notes ring.** Do not lift off early.
- **Soft attack.** Touch the strings, do not hit them.
- **Ghost the 16ths.** At 88 bpm, imagine a light 16th pulse. Brush the strings with your hand but barely sound them.
- **Mute with your thumb on 2 and 4.** A small dead click that stands in for the snare.` },
      { type: 'tip', md: `**Start simple.** Block chord on beat 1, muted thumb on beats 2 and 4, let the chord hang. Add ghosted 16ths only when that feels easy.` },
      { type: 'exercise', spec: { kind: 'progression', refs: ['Amaj7_open', 'Gs13sus4', 'm9_r6@F#', 'm9_r5@D'], bpm: 88, beatsPerChord: 4, bars: 8, backbeat: true } },
      { type: 'text', md: `Next, small top-string melodies inside a held chord. Two moves to try:

- Over Amaj7, play the open B string, then **hammer on** to the C# at fret 2. That is the 9th resolving to the 3rd.
- Over any held sus chord, let the 4th fall by a half step to the 3rd on one string. That is the sus4 resolving to 3.

Keep the rest of the chord ringing. The melody sits on top, like a singer over keys.` },
      { type: 'text', md: `Here is a short melody over Amaj7. It uses only A major pentatonic: A, B, C#, E, F#. Play it on the B and high e strings, near frets 0 to 2. The notes are C#, E, F#, E, C#, B.` },
      { type: 'exercise', spec: { kind: 'sequence', label: 'Top-string melody over Amaj7', notes: ['C#4', 'E4', 'F#4', 'E4', 'C#4', 'B3'] } },
      { type: 'text', md: `Last, put it all together. Play the loop again with the backbeat and slip one small melody in at the end of a bar. Less is more here.` },
      { type: 'exercise', spec: { kind: 'progression', refs: ['Amaj7_open', 'Gs13sus4', 'm9_r6@F#', 'm9_r5@D'], bpm: 90, beatsPerChord: 4, bars: 8, backbeat: true } },
    ],
  },
];
