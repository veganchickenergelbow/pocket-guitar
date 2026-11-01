// Unit 13: Harmonise your songs
export const LESSONS = [
  {
    id: 'u13l1', unit: 13, title: 'Which chords fit a melody note', minutes: 8,
    summary: 'Every note of the scale lives in three chords. Learn to pick the one that suits the moment.',
    blocks: [
      { type: 'text', md: `A chord chart is only one way to harmonise a tune. The melody is free to sit over other chords too, as long as they **contain the melody note**.

In C major, every note belongs to three of the diatonic triads. It can be the **root**, the **3rd** or the **5th** of a chord. Take the note **E**:

- It is the 3rd of **C** (C, E, G).
- It is the root of **Em** (E, G, B).
- It is the 5th of **Am** (A, C, E).

Same melody note, three different moods. C is bright and settled. Em is softer. Am is wistful. You pick by feel.` },
      { type: 'chords', refs: ['C_open', 'Em_open', 'Am_open'], showNotes: true, caption: 'C, Em and Am. All three have the open high e string (E) on top.' },
      { type: 'listen', label: 'One note, three chords', refs: ['C_open', 'Em_open', 'Am_open'], mode: 'strum' },
      { type: 'text', md: `Hear how the top note stays put while the colour underneath changes. That is the heart of harmonising: **the melody stays, the chord moves**.

Here are two more notes to learn:

- **A** fits **F** (its 3rd), **Dm** (its 5th) and **Am** (its root).
- **G** fits **C** (its 5th), **Em** (its 3rd) and **G** (its root).

You do not have to memorise a table. Spell the chord, check whether the note is in it.` },
      { type: 'tip', md: `Hum or sing the melody note, then strum each candidate chord. If the chord contains the note, it sounds like it belongs. If not, you will hear it rub.` },
      { type: 'exercise', spec: { kind: 'quiz', questions: [
        { q: 'Melody note A in C major. Which chord contains it?', options: ['F', 'G', 'Em', 'C'], answer: 0, explain: 'F is F, A, C. The A is the 3rd of F. G, Em and C do not have an A.' },
        { q: 'Melody note E. Which chord has it as the 3rd?', options: ['C', 'Em', 'Am', 'G'], answer: 0, explain: 'C is C, E, G. E is the 3rd. In Em it is the root, and in Am it is the 5th.' },
        { q: 'Melody note G. Which chord contains it?', options: ['Em', 'Dm', 'Am', 'F'], answer: 0, explain: 'Em is E, G, B. G is its 3rd. Dm, Am and F do not have a G.' },
        { q: 'Melody note F. Which chord contains it?', options: ['Dm', 'Am', 'G', 'Em'], answer: 0, explain: 'Dm is D, F, A. F is its 3rd. The others have no F.' },
        { q: 'How many diatonic triads contain any one scale note?', options: ['Three', 'One', 'Two', 'Seven'], answer: 0, explain: 'Each note can be the root, 3rd or 5th of a triad, so three chords share it.' },
      ] } },
      { type: 'text', md: `Now play the E demo. Sing or hum an E over every chord, and notice how the same note feels different each time.` },
      { type: 'exercise', spec: { kind: 'progression', refs: ['C_open', 'Em_open', 'Am_open', 'C_open'], bpm: 72, beatsPerChord: 4, bars: 8 } },
    ],
  },
  {
    id: 'u13l2', unit: 13, title: 'Chord families', minutes: 8,
    summary: 'Chords come in three families by job. Swap within a family and the song keeps its shape.',
    blocks: [
      { type: 'text', md: `The seven chords of a key fall into three families. Each family has a **job**.

- **Tonic family: I, iii, vi.** Rest and home. In C: C, Em, Am.
- **Subdominant family: IV, ii.** Moving away from home. In C: F, Dm.
- **Dominant family: V (and vii°).** Pull back home. In C: G, and Bdim.

A good progression moves around the families: home, away, pull, home. If you swap a chord for another **in the same family**, the song keeps its direction.

Two swaps to know:

- **IV and ii** trade places. F and Dm share two notes (F and A), and Dm7 contains a whole F chord (F, A, C).
- **I and vi** trade places. C and Am share two notes (C and E). Am7 has all of C (C, E, G) plus an A.` },
      { type: 'chords', refs: ['F_barre', 'Dm7_open', 'C_open', 'Am7_open'], showNotes: true, caption: 'F or Dm7. C or Am7. Same families, different colour.' },
      { type: 'listen', label: 'Plain: C G Am F', refs: ['C_open', 'G_open', 'Am_open', 'F_barre'], mode: 'strum' },
      { type: 'listen', label: 'Swapped: C G Am Dm7', refs: ['C_open', 'G_open', 'Am_open', 'Dm7_open'], mode: 'strum' },
      { type: 'text', md: `The last chord is the only change. It is a different shade, but it does the same job: it moves you away from home, ready to come back.

Train your ear on three common shapes. In each one you will hear the chords move through the families in a different order.` },
      { type: 'exercise', spec: { kind: 'ear', mode: 'progression', options: ['I-V-vi-IV', 'I-vi-IV-V', 'I-IV-V-I'], rounds: 6 } },
      { type: 'exercise', spec: { kind: 'quiz', questions: [
        { q: 'Which chord can stand in for IV (F) in C?', options: ['Dm', 'G', 'Em', 'Bdim'], answer: 0, explain: 'Dm (ii) is in the subdominant family, like F.' },
        { q: 'Which chord can stand in for I (C) in C?', options: ['Am', 'F', 'G', 'Dm'], answer: 0, explain: 'Am (vi) is in the tonic family. It shares two notes with C.' },
        { q: 'Which family does G belong to in C?', options: ['Dominant', 'Tonic', 'Subdominant', 'None'], answer: 0, explain: 'G is V, the dominant. It pulls back to C.' },
        { q: 'What is the job of the subdominant family?', options: ['Move away from home', 'Rest at home', 'Pull back home', 'Change key'], answer: 0, explain: 'IV and ii move you away from the tonic, setting up the pull back.' },
      ] } },
      { type: 'text', md: `Play a progression that uses all three families: tonic (C, Am), subdominant (Dm7) and dominant (G7).` },
      { type: 'exercise', spec: { kind: 'progression', refs: ['C_open', 'Am_open', 'Dm7_open', 'G7_open'], bpm: 76, beatsPerChord: 4, bars: 8 } },
    ],
  },
  {
    id: 'u13l3', unit: 13, title: 'Colour by job', minutes: 10,
    summary: 'Upgrade each chord by what it does: maj9 for home, m7 for vi, #11 for IV, sus for V.',
    blocks: [
      { type: 'text', md: `You met these colours in Units 3 and 4. Now use them with a plan. Each chord has a job, and each job has a favourite upgrade.

- **I (home)** becomes **maj7 or maj9**. Cmaj7, Cmaj9.
- **vi (gentle minor)** becomes **m7 or m9**. Am7, Am9.
- **IV (lift)** becomes **maj7 or maj7#11**. Fmaj7, Fmaj7#11.
- **V (pull home)** becomes **9sus4 or 13**. F/G (which is G9sus4) or G13.

The two V upgrades do different things. **F/G (G9sus4)** has no 3rd, so it softens the pull, as in Unit 12. **G13** keeps the 3rd (B), so it pulls just as hard, with extra colour on top.` },
      { type: 'chords', refs: ['Cmaj9_open', 'Am9_5th', 'Fmaj7_open', 'Fmaj7s11_open', 'FoverG', 'dom13_r6@G'], showNotes: true, caption: 'Cmaj9, Am9, Fmaj7, Fmaj7#11, F/G (G9sus4) and G13.' },
      { type: 'listen', label: 'Plain: C G Am F', refs: ['C_open', 'G_open', 'Am_open', 'F_barre'], mode: 'strum' },
      { type: 'listen', label: 'Rich: Cmaj9 F/G Am7 Fmaj7', refs: ['Cmaj9_open', 'FoverG', 'Am7_open', 'Fmaj7_open'], mode: 'strum' },
      { type: 'tip', md: `**The melody-clash rule.** A richer chord can fight the tune. Two cases to remember:

- If the melody sits on the **root** of a major chord, a **maj7** rubs against it, because the 7th is a half step below the root. Use **add9** or the plain chord instead. Cadd9 works where Cmaj7 clashes.
- If the melody sits on the **3rd** of a chord, a **sus4** version fights it, because the 4th is a half step above the 3rd. Save sus chords for when the melody is somewhere else.

**Sing the melody over the new chord. If it rubs, back off one layer.**` },
      { type: 'chords', refs: ['Cmaj7_open', 'Cadd9_open'], showNotes: true, caption: 'Cmaj7 has a B just under the C. Cadd9 has a D above it. Choose by what the melody is doing.' },
      { type: 'exercise', spec: { kind: 'quiz', questions: [
        { q: 'The melody sits on C over a C chord. Which colour is safest?', options: ['Cadd9', 'Cmaj7', 'Csus4', 'Cmaj7#11'], answer: 0, explain: 'Cmaj7 has a B a half step below the melody C. Add9 keeps the root clean.' },
        { q: 'Which upgrade suits the V chord (G) in C?', options: ['F/G (G9sus4)', 'Gmaj7', 'Gm9', 'G6'], answer: 0, explain: 'F/G keeps the root motion to C but softens the pull. A G13 would keep the full pull with more colour. Gmaj7 and Gm9 do not belong to the key in that role.' },
        { q: 'The melody sits on the 3rd of a chord. Which colour fights it?', options: ['sus4', 'add9', 'm7', 'maj7'], answer: 0, explain: 'The 4th is a half step above the 3rd, so the two notes grind together.' },
        { q: 'What do you do if the melody rubs against your new chord?', options: ['Back off one layer', 'Add more notes', 'Play it louder', 'Change key'], answer: 0, explain: 'Step back to a simpler version, such as add9 or the plain chord.' },
      ] } },
      { type: 'text', md: `Play the rich version slowly. Sing the top line of any song you know over it, and see which chords still feel right.` },
      { type: 'exercise', spec: { kind: 'progression', refs: ['Cmaj9_open', 'FoverG', 'Am7_open', 'Fmaj7_open'], bpm: 80, beatsPerChord: 4, bars: 8 } },
    ],
  },
  {
    id: 'u13l4', unit: 13, title: 'Approach chords', minutes: 10,
    summary: 'Lean into the chord that matters with its own dominant, its ii-V, or a chord a half step above.',
    blocks: [
      { type: 'text', md: `An **approach chord** is a short chord that leans into the next one. You met the idea in Unit 6. Here are three ways to build one.

**1. Its own dominant.** This is the secondary dominant. Put a V7 in front of your target chord.

- **E7 into Am.** The E7/G# version has G# in the bass, which steps up to the A. Smooth.
- **C7 into F.** C is the V of F.

**2. Its ii-V.** Put a whole ii-V in front. Into F, play **Gm7 then C7**. Gm7 is the ii of F, and C7 is the V.

**3. A half step above.** Play a dominant 7 a half step above the target. This is the **tritone substitute**. Into Cmaj7, play **Db7**: the notes are Db, F, Ab and Cb (which is the same pitch as B). So it shares F and B with G7. The two are twins, and Db7 slides into C by half steps.` },
      { type: 'chords', refs: ['E7_Gsharp', 'C7_open', 'm7_r6@G', 'dom7_r5@Db'], showNotes: true, caption: 'E7/G#, C7, Gm7 and Db7. Four ways to lean in.' },
      { type: 'listen', label: 'G7 into Cmaj7', refs: ['G7_open', 'Cmaj7_open'], mode: 'strum' },
      { type: 'listen', label: 'Db7 into Cmaj7', refs: ['dom7_r5@Db', 'Cmaj7_open'], mode: 'strum' },
      { type: 'listen', label: 'Cmaj7 to Am7', refs: ['Cmaj7_open', 'Am7_open'], mode: 'strum' },
      { type: 'listen', label: 'Cmaj7, E7/G#, Am7', refs: ['Cmaj7_open', 'E7_Gsharp', 'Am7_open'], mode: 'strum' },
      { type: 'tip', md: `**The rule.** Add **one** approach chord before the chord that matters most in a phrase. Not before every chord. An approach chord is seasoning. Add too many, and the line has no home.` },
      { type: 'exercise', spec: { kind: 'quiz', questions: [
        { q: 'What is the secondary dominant of Dm?', options: ['A7', 'G7', 'E7', 'D7'], answer: 0, explain: 'A is a 5th above D. A7 resolves down a 5th to Dm.' },
        { q: 'Which pair is the ii-V approach into F?', options: ['Gm7, C7', 'Am7, D7', 'Dm7, G7', 'Em7, A7'], answer: 0, explain: 'G is the ii of F, and C is the V of F.' },
        { q: 'Which dominant shares its tritone with G7 and slides into C?', options: ['Db7', 'D7', 'Eb7', 'A7'], answer: 0, explain: 'Db7 has F and Cb (B), the same two notes that make the tritone in G7.' },
        { q: 'How many approach chords should you add before one target?', options: ['One', 'Three', 'As many as fit', 'None'], answer: 0, explain: 'One approach before the arrival that matters. Less is more.' },
      ] } },
      { type: 'text', md: `Now play a phrase that uses them: E7/G# into Am7, C7 into Fmaj7, and Db7 into Cmaj7 at the end. Each chord gets two beats, so the approach chords stay short.` },
      { type: 'exercise', spec: { kind: 'progression', refs: ['Cmaj7_open', 'E7_Gsharp', 'Am7_open', 'C7_open', 'Fmaj7_open', 'Dm7_open', 'dom7_r5@Db', 'Cmaj7_open'], bpm: 76, beatsPerChord: 2, bars: 8 } },
    ],
  },
  {
    id: 'u13l5', unit: 13, title: 'Make the bass walk', minutes: 10,
    summary: 'Use slash chords so the bass moves by step, the way keyboard players do it.',
    blocks: [
      { type: 'text', md: `Keys players like Alex Alessandroni Jr and his daughter Sayaka often play chords over a **stepwise bass**. The left hand walks down the scale while the right hand holds the chords. You can do the same with slash chords (Unit 10) and inversions (Unit 5).

Here is a walk down in C. Each chord keeps its job, but the bass moves one step at a time:

**C, G/B, Am, Am/G, Fmaj7, C/E, Dm7, G7**

The bass notes are **C, B, A, G, F, E, D, G**. The first seven walk down the scale. The last jumps up to G, to set up the next C.

Two of those are new voicings. **G/B** is a G chord with B in the bass. **Am/G** is Am with a G in the bass, which makes it an Am7 on its side.` },
      { type: 'chords', refs: ['C_open', 'G_B_slash', 'Am_open', 'Am_G_slash', 'Fmaj7_lowF', 'C_E_slash', 'Dm7_open', 'G7_open'], caption: 'Bass: C, B, A, G, F, E, D, G. Scroll across to see all eight.' },
      { type: 'listen', label: 'The walk-down', refs: ['C_open', 'G_B_slash', 'Am_open', 'Am_G_slash', 'Fmaj7_lowF', 'C_E_slash', 'Dm7_open', 'G7_open'], mode: 'strum' },
      { type: 'text', md: `Listen again and follow only the lowest note. The D sounds an octave higher than the notes before it, because the open D string is the lowest note in that shape. That is fine. The ear follows the letter names.

A second trick is a **pedal point**. Keep one bass note while the chords above change. Here the bass stays on C while the chords go C, F/C, C, F/C. F/C is an F triad with C in the bass, so the C is held under it.` },
      { type: 'chords', refs: ['C_open', 'F_C_slash'], showNotes: true, caption: 'C and F/C. Same low C, different chord above.' },
      { type: 'listen', label: 'Pedal point on C', refs: ['C_open', 'F_C_slash', 'C_open', 'F_C_slash'], mode: 'strum' },
      { type: 'text', md: `Look at G/B on its own. Pick out each string and name the note, starting with the B in the bass.` },
      { type: 'exercise', spec: { kind: 'chord-arp', ref: 'G_B_slash' } },
      { type: 'exercise', spec: { kind: 'quiz', questions: [
        { q: 'What is the bass note of G/B?', options: ['B', 'G', 'D', 'F'], answer: 0, explain: 'The note after the slash is the bass. G/B is a G chord with B at the bottom.' },
        { q: 'Which chord keeps the Am shape but drops the bass down to G?', options: ['Am/G', 'Am/E', 'C/E', 'G/B'], answer: 0, explain: 'Am/G is Am with G in the bass. It links A down to G on the walk.' },
        { q: 'What is a pedal point?', options: ['One bass note held while the chords change', 'A sustain pedal', 'A bass note that rises', 'A rest'], answer: 0, explain: 'The bass stays on one note while the chords above move.' },
        { q: 'Why do slash chords help a bass line?', options: ['They move the bass by step', 'They are louder', 'They change the key', 'They are easier'], answer: 0, explain: 'The bass note can be chosen freely, so you can connect roots with passing notes.' },
      ] } },
      { type: 'text', md: `Play the walk-down. Land each bass note on the beat and keep the strum light.` },
      { type: 'exercise', spec: { kind: 'progression', refs: ['C_open', 'G_B_slash', 'Am_open', 'Am_G_slash', 'Fmaj7_lowF', 'C_E_slash', 'Dm7_open', 'G7_open'], bpm: 72, beatsPerChord: 2, bars: 8 } },
    ],
  },
  {
    id: 'u13l6', unit: 13, title: 'Borrowed colour', minutes: 8,
    summary: 'When to reach for the minor iv, bVII and bVI in your own songs, and when to hold back.',
    blocks: [
      { type: 'text', md: `You met borrowed chords in Unit 6 (the minor iv) and Unit 10 (chords from the parallel minor). Now decide **when** to use them in a song of your own.

In C, the parallel minor is C minor. It lends three useful chords:

- **Fm (minor iv).** Bittersweet. Use it on an emotional word, or on the last line before you go home. F, Fm, C.
- **Bb (bVII).** A warm lift into C, like a door opening. Bb, C.
- **Ab, Bb, C (bVI, bVII, I).** A big, rising finish. Save it for the end.

Use these **once or twice per song**. They are special because they are rare.` },
      { type: 'chords', refs: ['Fm_barre', 'maj_r5@Bb', 'maj_r6@Ab'], showNotes: true, caption: 'Fm, Bb and Ab. All three come from C minor.' },
      { type: 'listen', label: 'Minor iv: F, Fm, C', refs: ['F_barre', 'Fm_barre', 'C_open'], mode: 'strum' },
      { type: 'listen', label: 'bVII lift: F, Bb, C', refs: ['F_barre', 'maj_r5@Bb', 'C_open'], mode: 'strum' },
      { type: 'listen', label: 'Big ending: F, Ab, Bb, C', refs: ['F_barre', 'maj_r6@Ab', 'maj_r5@Bb', 'C_open'], mode: 'strum' },
      { type: 'tip', md: `Pick **one** borrowed moment per song and put it where the words matter most. If every line has a surprise, none of them feels like one.` },
      { type: 'exercise', spec: { kind: 'quiz', questions: [
        { q: 'Which note is borrowed from C minor when F becomes Fm?', options: ['Ab', 'A', 'B', 'F#'], answer: 0, explain: 'F major has an A. F minor swaps it for Ab, a note from C minor.' },
        { q: 'What is the bVII chord in C?', options: ['Bb', 'B', 'Ab', 'D'], answer: 0, explain: 'The b7th of C is Bb, so the bVII chord is Bb major.' },
        { q: 'How often should you use borrowed colour in one song?', options: ['Once or twice', 'Every bar', 'Never', 'Only in the intro'], answer: 0, explain: 'It works as a surprise, so keep it rare.' },
      ] } },
      { type: 'text', md: `Play the minor iv as the turn before home. Let the Fm ring, then settle on C.` },
      { type: 'exercise', spec: { kind: 'progression', refs: ['C_open', 'F_barre', 'Fm_barre', 'C_open'], bpm: 72, beatsPerChord: 4, bars: 8 } },
    ],
  },
  {
    id: 'u13l7', unit: 13, title: 'Workshop: rebuild a plain progression', minutes: 14,
    summary: 'Take I-V-vi-IV in C through four stages and make it your own.',
    blocks: [
      { type: 'text', md: `The I, V, vi, IV progression sits behind a huge number of pop songs. In C it is **C, G, Am, F**. Let us rebuild it in stages. Each stage adds one idea from this unit. Play and listen at every step.

### Stage 0: plain
Four open chords, each doing its job.` },
      { type: 'listen', label: 'Stage 0: plain', refs: ['C_open', 'G_open', 'Am_open', 'F_barre'], mode: 'strum' },
      { type: 'exercise', spec: { kind: 'progression', refs: ['C_open', 'G_open', 'Am_open', 'F_barre'], bpm: 76, beatsPerChord: 4, bars: 8 } },
      { type: 'text', md: `### Stage 1: colour by job
Cmaj9 for home, F/G for the pull, Am7 for the gentle minor, Fmaj7 for the lift. Check the melody-clash rule if you are singing over it.` },
      { type: 'listen', label: 'Stage 1: colour by job', refs: ['Cmaj9_open', 'FoverG', 'Am7_open', 'Fmaj7_open'], mode: 'strum' },
      { type: 'exercise', spec: { kind: 'progression', refs: ['Cmaj9_open', 'FoverG', 'Am7_open', 'Fmaj7_open'], bpm: 76, beatsPerChord: 4, bars: 8 } },
      { type: 'text', md: `### Stage 2: one approach chord
Put E7/G# before Am7, the chord that matters most. Then let the Fm sneak in before the loop returns to C. Each chord gets two beats, so the E7/G# and the Fm are short.` },
      { type: 'listen', label: 'Stage 2: approach chord and minor iv', refs: ['Cmaj9_open', 'Cmaj9_open', 'FoverG', 'E7_Gsharp', 'Am7_open', 'Am7_open', 'Fmaj7_open', 'Fm_barre'], mode: 'strum' },
      { type: 'exercise', spec: { kind: 'progression', refs: ['Cmaj9_open', 'Cmaj9_open', 'FoverG', 'E7_Gsharp', 'Am7_open', 'Am7_open', 'Fmaj7_open', 'Fm_barre'], bpm: 76, beatsPerChord: 2, bars: 8 } },
      { type: 'text', md: `### Stage 3: walking bass
Swap the F/G for G/B, and add Am/G, so the bass walks down: **C, B, A, G, F**. Hold the F, then Fm, and loop back to C.` },
      { type: 'listen', label: 'Stage 3: walking bass', refs: ['Cmaj9_open', 'G_B_slash', 'Am7_open', 'Am_G_slash', 'Fmaj7_lowF', 'Fmaj7_lowF', 'Fm_barre', 'Fm_barre'], mode: 'strum' },
      { type: 'exercise', spec: { kind: 'progression', refs: ['Cmaj9_open', 'G_B_slash', 'Am7_open', 'Am_G_slash', 'Fmaj7_lowF', 'Fmaj7_lowF', 'Fm_barre', 'Fm_barre'], bpm: 72, beatsPerChord: 2, bars: 8 } },
      { type: 'text', md: `### Do it to your own songs
Here is the checklist:

1. **Find the key.** If you use a capo, work in the shapes you play.
2. **Write the chords as numbers.** I, V, vi, IV and so on.
3. **Colour each chord by its job.** maj9 for I, m7 for vi, maj7 for IV, sus for V.
4. **Sing the melody over every change.** If a note rubs, back off.
5. **Add one approach chord** before the most important arrival.
6. **Smooth the bass** with one or two slash chords.
7. **Save borrowed colour** for one emotional moment.
8. **Less is more.** Two layers often beat five.` },
      { type: 'tip', md: `Try it on songs you already play, such as Here Without You, Teenage Dream or Stupid Song. Start from your own chord sheet, write the numbers, and work through the checklist one step at a time. Keep both versions so you can compare.` },
      { type: 'exercise', spec: { kind: 'quiz', questions: [
        { q: 'What is the first step when you harmonise a song?', options: ['Find the key', 'Add a 13th', 'Change the tempo', 'Use a capo'], answer: 0, explain: 'You need the key before you can write the chords as numbers.' },
        { q: 'How many approach chords should you add at first?', options: ['One, before the most important arrival', 'One before every chord', 'Three per bar', 'None'], answer: 0, explain: 'One approach chord at the moment that matters.' },
        { q: 'What do you do when the melody rubs against a new chord?', options: ['Back off one layer', 'Play louder', 'Add another colour', 'Skip the note'], answer: 0, explain: 'Simplify the chord until it stops grinding.' },
      ] } },
    ],
  },
];
