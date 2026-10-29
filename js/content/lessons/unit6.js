// Unit 6: Gospel and neo-soul moves
export const LESSONS = [
  {
    id: 'u6l1', unit: 6, title: 'Chromatic approach chords', minutes: 8,
    summary: 'Slide a whole chord shape in from a fret away, then land on the real one.',
    blocks: [
      { type: 'text', md: `Keyboard players slide a chord in from a half step above or below, as a grace note for the whole hand. Guitar shapes are movable, so you can do exactly that.

Play the target chord, say Dm9. Now play the same shape one fret **above** (Ebm9) or one fret **below** (C#m9), and then slide into Dm9. It sounds like the chord was leaning in.

It works because every note in the approach chord is only one fret from the matching note in the target. The ear hears the whole chord settle into place.` },
      { type: 'chords', refs: ['m9_r5@Eb', 'm9_r5@D'], caption: 'Ebm9 slides down one fret into Dm9. Same shape, one fret apart.' },
      { type: 'listen', label: 'Ebm9 into Dm9', refs: ['m9_r5@Eb', 'm9_r5@D'], mode: 'strum' },
      { type: 'text', md: `Use it on a ii-V-I. Approach the G13 from the fret above (Ab13), and approach the Cmaj9 from the fret above (Dbmaj9). Short approach chord, longer target.

Keep the approach chord short and a little softer. If it lingers, it stops being an approach and becomes a wrong chord.` },
      { type: 'tip', md: `**Style note.** Slides into a chord from one fret away are common in soulful, keys-influenced playing. Use them as a seasoning, not every bar.` },
      { type: 'exercise', spec: { kind: 'progression', refs: ['m9_r5@Eb', 'm9_r5@D', 'dom13_r6@Ab', 'dom13_r6@G', 'maj9_r5@Db', 'maj9_r5@C'], bpm: 60, beatsPerChord: 2, bars: 6 } },
    ],
  },
  {
    id: 'u6l2', unit: 6, title: 'Secondary dominants', minutes: 9,
    summary: 'Borrow the V7 of another chord in the key, and the whole progression lifts.',
    blocks: [
      { type: 'text', md: `Every dominant 7 wants to resolve down a fifth. The V7 chord does that to I. But you can aim a dominant at **any** chord in the key. That is a **secondary dominant**.

In C, the vi chord is Am. The dominant of A is **E7**: E, G#, B, D. Its G# is one half step below the A, so it pulls hard into Am.

C, **E7**, Am, F. That E7 is "V7 of vi". Compare it to C, Em, Am, F: the Em is gentle, the E7 is a lift.` },
      { type: 'chords', refs: ['C_open', 'E7_open', 'Am_open', 'F_barre'], caption: 'C, E7, Am, F. The G# in E7 is the note that makes it lean.' },
      { type: 'listen', label: 'C E7 Am F', refs: ['C_open', 'E7_open', 'Am_open', 'F_barre'], mode: 'strum' },
      { type: 'text', md: `Train your ear to catch the lift. The progression options below differ only in the third chord: a lifted E7, a plain Em, or something else entirely.` },
      { type: 'exercise', spec: { kind: 'ear', mode: 'progression', options: ['I-III7-vi-IV', 'I-iii-vi-IV', 'I-vi-IV-V'], rounds: 8 } },
      { type: 'text', md: `Now play it. Let the E7 ring a little, and aim for Am on beat one.` },
      { type: 'exercise', spec: { kind: 'progression', refs: ['C_open', 'E7_open', 'Am_open', 'F_barre'], bpm: 72, beatsPerChord: 4, bars: 8 } },
    ],
  },
  {
    id: 'u6l3', unit: 6, title: 'The minor iv', minutes: 8,
    summary: 'Turn the IV chord minor for a bittersweet turn on the way home.',
    blocks: [
      { type: 'text', md: `In C major, the IV chord is F major: F, A, C. Swap it for F **minor**: F, Ab, C. One note changes, the A drops to Ab.

That Ab is borrowed from C minor. It does not belong to the C major scale, so it sounds like a cloud passing over. Then you land on C and the sun comes out. People call the feeling bittersweet.

The move: **F, Fm, C**. Major IV, then minor iv, then home.` },
      { type: 'chords', refs: ['F_barre', 'Fm_barre', 'C_open'], caption: 'F, Fm, C. Slide one finger and the whole chord changes colour.' },
      { type: 'listen', label: 'F, Fm, C', refs: ['F_barre', 'Fm_barre', 'C_open'], mode: 'strum' },
      { type: 'text', md: `Only one barre note moves between F and Fm: your middle finger on the G string lifts off. The rest of the shape stays put, so this is easy to place in a strum.

Hold the Fm for two full beats before you resolve. The longer you sit in it, the sweeter the C feels.` },
      { type: 'exercise', spec: { kind: 'progression', refs: ['F_barre', 'Fm_barre', 'C_open'], bpm: 66, beatsPerChord: 4, bars: 9 } },
    ],
  },
  {
    id: 'u6l4', unit: 6, title: 'The church walk-up', minutes: 10,
    summary: 'A bass line that climbs through a passing chord, a classic gospel move.',
    blocks: [
      { type: 'text', md: `A walk-up is a bass line stepping upward by half and whole steps under a set of chords. Here it is in C:

**C, C7, F, F#dim7, C/G, G7, C**

The bass notes are: C, C, F, F#, G, G, C. The chord on the F# is a diminished 7th, which is a stack of minor thirds. Its notes (F#, A, C, Eb) all pull toward the chords next door, so it works like a passing chord. It slides the bass from F up to G.

Two other things are going on. The C7 is the V7 of F, which sets up the F chord. And C/G is a C chord with G in the bass, so the bass keeps climbing to G. The G7 then releases it back to C.` },
      { type: 'chords', refs: ['C_open', 'C7_open', 'F_barre', 'Fsharpdim7', 'CG_slash', 'G7_open', 'C_open'], caption: 'Seven chords, one climbing bass line. Hear the bass note on each.' },
      { type: 'listen', label: 'The whole walk-up', refs: ['C_open', 'C7_open', 'F_barre', 'Fsharpdim7', 'CG_slash', 'G7_open', 'C_open'], mode: 'strum' },
      { type: 'text', md: `Play it slowly with the bass note leading each strum. Two beats on each chord, and a small breath before the final C. Once the voicings are in your hands, the line almost plays itself.` },
      { type: 'exercise', spec: { kind: 'progression', refs: ['C_open', 'C7_open', 'F_barre', 'Fsharpdim7', 'CG_slash', 'G7_open', 'C_open'], bpm: 66, beatsPerChord: 2, bars: 7 } },
    ],
  },
  {
    id: 'u6l5', unit: 6, title: 'Reharmonize a pop progression', minutes: 10,
    summary: 'Take a four-chord progression you know and swap in richer chords by function.',
    blocks: [
      { type: 'text', md: `You can rewrite almost any four-chord progression with the tools you now have. The trick is to match chords by **function**, not by guess.

Take the familiar I, V, vi, IV in G: **G, D, Em, C**. Each chord has a job:

- **G (I)** is home. Swap in **Gmaj7**.
- **D (V)** wants to lead back. Swap in **Dsus2** for a softer lean, or D7 for a stronger one.
- **Em (vi)** is a gentle minor. Swap in **Em9**.
- **C (IV)** is a lift. Swap in **Cmaj9**.

Same job, richer colour. If you swap a chord for something with a different job, the song changes direction. If you keep the job, it feels like the same song in nicer clothes.` },
      { type: 'chords', refs: ['maj7_r6@G', 'Dsus2_open', 'm9_r5@E', 'Cmaj9_open'], showNotes: true, caption: 'Gmaj7, Dsus2, Em9, Cmaj9. The same I, V, vi, IV, richer.' },
      { type: 'listen', label: 'Plain version, then rich version', refs: ['G_open', 'D_open', 'Em_open', 'C_open', 'maj7_r6@G', 'Dsus2_open', 'm9_r5@E', 'Cmaj9_open'], mode: 'strum' },
      { type: 'text', md: `Try this on songs you already play. Name each chord's number, then pick a substitute with the same function. If it sounds wrong, try another colour. You will learn what each one does faster by listening than by reading.` },
      { type: 'exercise', spec: { kind: 'progression', refs: ['maj7_r6@G', 'Dsus2_open', 'm9_r5@E', 'Cmaj9_open'], bpm: 72, beatsPerChord: 4, bars: 8 } },
      { type: 'exercise', spec: { kind: 'quiz', questions: [
        { q: 'Which swap keeps the job of the V chord (D) in G?', options: ['Dsus2', 'Dmaj9', 'Dm7', 'Bm'], answer: 0, explain: 'Sus2 keeps D as the root and still leans toward G. Dm7 would change the character.' },
        { q: 'What number is Em in the key of G?', options: ['I', 'IV', 'vi', 'iii'], answer: 2, explain: 'E is the sixth note of G major, and the chord is minor.' },
        { q: 'Which is a good richer swap for a plain minor vi chord?', options: ['m9', 'sus4', 'maj7', 'dim7'], answer: 0, explain: 'A minor 9 keeps the minor quality and adds colour.' },
        { q: 'If you replace the IV chord with a different chord, what is the main rule?', options: ['Keep the same function', 'Always add a 7th', 'Always use sus', 'Change the key'], answer: 0, explain: 'Match the job and the progression keeps its direction.' },
      ] } },
    ],
  },
];
