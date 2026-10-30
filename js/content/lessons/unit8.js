// Unit 8: Keys-style soul
export const LESSONS = [
  {
    id: 'u8l1', unit: 8, title: 'Where the sound lives', minutes: 9,
    summary: 'Flat keys, relative minors, and the capo trick that puts C shapes in D-flat.',
    blocks: [
      { type: 'text', md: `This unit is built from what the clips you sent seem to be doing. It is a reading of the sound, not a claim about any one song. The goal is to get that sound under your fingers.

In the clips you sent, the harmony sits in **D-flat major** and its relative minor, **B-flat minor**. That is five flats. Keys players like these keys because the black keys fall under the fingers. On a guitar, five flats is no help at all. So we cheat.

First, the relative minor. Every major key shares its notes with one minor key, which starts on the **sixth note** of the major scale. C major and A minor use the same seven notes. D-flat major and B-flat minor use the same seven notes. That is why music in these keys moves so easily between a bright chord and a dark one: nothing is leaving the key.

Now the cheat. Learn everything in **C and A minor**, where the shapes are friendly. Then put a **capo on fret 1**. Every shape you play sounds one half step higher, so C sounds as D-flat and A minor sounds as B-flat minor. Keep the shape names relative to the capo. A shape you call Am9 is still Am9 in your hands, and it sounds as Bbm9.` },
      { type: 'text', md: `### The chord family

The chords of C major with a 9th or a 13th added where they fit are the palette for this whole unit:

- **Cmaj9** (I)
- **Dm9** (ii)
- **Em7** (iii)
- **Fmaj7** (IV)
- **G13** (V)
- **Am9** (vi)

All of them are built only from notes in C major. That is the point. The colour comes from the 7ths and 9ths, not from leaving the key.` },
      { type: 'chords', refs: ['Cmaj9_open', 'm9_r5@D', 'Em7_open', 'Fmaj7_open', 'dom13_r6@G', 'Am9_5th'], caption: 'Cmaj9, Dm9, Em7, Fmaj7, G13, Am9. Six chords, one key.' },
      { type: 'listen', label: 'The whole family', refs: ['Cmaj9_open', 'm9_r5@D', 'Em7_open', 'Fmaj7_open', 'dom13_r6@G', 'Am9_5th'], mode: 'strum' },
      { type: 'text', md: `Check the idea with a few questions, then play Am9 one string at a time, low to high. Am9 is the vi chord, the home of the minor side of the key, and it is the one that matters most today.` },
      { type: 'exercise', spec: { kind: 'quiz', questions: [
        { q: 'What is the relative minor of C major?', options: ['Am', 'Em', 'Dm', 'Gm'], answer: 0, explain: 'A is the sixth note of C major, so A minor shares all of its notes.' },
        { q: 'What is the relative minor of D-flat major?', options: ['B-flat minor', 'F minor', 'E-flat minor', 'A minor'], answer: 0, explain: 'B-flat is the sixth note of D-flat major.' },
        { q: 'You play C shapes with a capo on fret 1. What key do you sound in?', options: ['D-flat', 'B', 'D', 'C'], answer: 0, explain: 'The capo raises everything by one half step, and C up a half step is D-flat.' },
        { q: 'Which chord is the vi in the key of C?', options: ['Am', 'Dm', 'Em', 'G'], answer: 0, explain: 'A is the sixth note of C major, and the chord is minor.' },
      ] } },
      { type: 'exercise', spec: { kind: 'chord-arp', ref: 'Am9_5th' } },
    ],
  },
  {
    id: 'u8l2', unit: 8, title: 'The vi-ii-I-IV loop', minutes: 9,
    summary: 'Four chords, almost no movement. Find the notes that stay put.',
    blocks: [
      { type: 'text', md: `What the clips suggest is a loop built on four chords: the vi, the ii, the I and the IV, each with a 9th or 7th on top. In the clips you sent, those would be Bbm9, Ebm9, Dbmaj9 and Gbmaj7. In C, with the capo off, they are:

**Am9, Dm9, Cmaj9, Fmaj7**

Play them and look at your hand. It barely moves. That is the secret. Each chord shares notes with the next, and the notes that change move only a step.

- **Am9 to Dm9:** C and E stay.
- **Dm9 to Cmaj9:** C, D and E all appear in both chords.
- **Cmaj9 to Fmaj7:** C and E stay again.

Common tones make the chords feel like one slow thought instead of four separate events. Let them ring and listen for them.` },
      { type: 'chords', refs: ['Am9_5th', 'm9_r5@D', 'maj9_r5@C', 'Fmaj7_lowF'], showNotes: true, caption: 'Am9, Dm9, Cmaj9, Fmaj7. Watch C and E sit still.' },
      { type: 'listen', label: 'The loop', refs: ['Am9_5th', 'm9_r5@D', 'maj9_r5@C', 'Fmaj7_lowF'], mode: 'strum' },
      { type: 'text', md: `One new shape here: Fmaj7 with the **low E string at fret 1**. The bass note is F, the root, and it keeps the loop in the same low register. Mute the A string with the tip of your first finger.

Now train the ear on the key difference in this loop. Dm9 is a **minor 9**. Cmaj9 is a **major 9**. Same stacked colour, different mood.` },
      { type: 'exercise', spec: { kind: 'ear', mode: 'quality', options: ['m9', 'maj9'], rounds: 8 } },
      { type: 'text', md: `Play along slowly. Four beats on each chord. Aim for the next chord a little early, so the sound never has a gap.` },
      { type: 'exercise', spec: { kind: 'progression', refs: ['Am9_5th', 'm9_r5@D', 'maj9_r5@C', 'Fmaj7_lowF'], bpm: 68, beatsPerChord: 4, bars: 8 } },
    ],
  },
  {
    id: 'u8l3', unit: 8, title: 'Walk the bass by step', minutes: 10,
    summary: 'Keep the chords, move the bass one note at a time, and learn what C/E means.',
    blocks: [
      { type: 'text', md: `A keys player has a left hand for the bass and a right hand for the chords. The bass often walks by **step**: one note, then the next note, no big leaps. This is a big part of why that style sounds so smooth.

To walk the bass, you sometimes need a chord with a note other than the root at the bottom. That is an **inversion**. In writing it is a **slash chord**. The name before the slash is the chord. The name after the slash is the bass note.

- **C/G** is a C chord with G in the bass.
- **C/E** is a C chord with E in the bass.

The upper notes are still C, E and G. Only the lowest note changes.

Here is a bass line that steps down: **A, G, F, E, D**. Put a chord over each note:

**Am9 (A), C/G (G), Fmaj7 (F), C/E (E), Dm9 (D)**

The chords barely change. The bass is doing the moving.` },
      { type: 'chords', refs: ['Am9_5th', 'CG_slash', 'Fmaj7_lowF', 'C_E_slash', 'm9_r5@D'], caption: 'Bass notes A, G, F, E, D. The bass walks down a step at a time.' },
      { type: 'listen', label: 'Bass walking down', refs: ['Am9_5th', 'CG_slash', 'Fmaj7_lowF', 'C_E_slash', 'm9_r5@D'], mode: 'strum' },
      { type: 'text', md: `First play only the bass notes, to get the line into your ear. A is the open A string. G and F are on the low E string at frets 3 and 1. E is the open low E. D is the A string at fret 5.` },
      { type: 'exercise', spec: { kind: 'sequence', label: 'The bass line', notes: ['A2', 'G2', 'F2', 'E2', 'D3'] } },
      { type: 'text', md: `Now play the full chords. Two beats on each, with the bass note landing clearly on the beat.` },
      { type: 'exercise', spec: { kind: 'progression', refs: ['Am9_5th', 'CG_slash', 'Fmaj7_lowF', 'C_E_slash', 'm9_r5@D'], bpm: 68, beatsPerChord: 2, bars: 10 } },
    ],
  },
  {
    id: 'u8l4', unit: 8, title: 'Slide in from a half step', minutes: 9,
    summary: 'A chromatic bass drop, D to D-flat to C, and the substitute chord that makes it work.',
    blocks: [
      { type: 'text', md: `In the clips you sent, the bass seems to drop by half steps right before the home chord: three notes in a row, each one fret lower. In our key of C that is **D, D-flat, C**. The chords over it:

**Dm9, Db9, Cmaj9**

The middle chord is the interesting one. D-flat is not in C major. Why does it work?

Think of the usual way home. A G7 chord goes to C. The G7 has two tension notes: **F** and **B**. F wants to fall to E, and B wants to rise to C. That tension is what makes the resolution feel real.

Now look inside **Db7**. Its notes are Db, F, Ab and Cb. Cb is the same pitch as B. So Db7 has **the same two tension notes** as G7. It does G7's job. This is called a **tritone substitute**, because Db is a tritone (six half steps) away from G.

And there is a bonus. The root of Db7 slides a half step down into the C. Smooth bass, strong pull.

Db9 is Db7 with an added 9th (Eb), which makes it softer and more at home next to Dm9 and Cmaj9.` },
      { type: 'chords', refs: ['m9_r5@D', 'dom9_r5@Db', 'maj9_r5@C'], caption: 'Dm9, Db9, Cmaj9. The root drops D, Db, C.' },
      { type: 'listen', label: 'Dm9, Db9, Cmaj9', refs: ['m9_r5@D', 'dom9_r5@Db', 'maj9_r5@C'], mode: 'strum' },
      { type: 'text', md: `Notice the roots all sit on the A string, and they walk down: fret 5, fret 4, fret 3. Your hand slides down the neck with the bass.

Learn the Db9 on its own first.` },
      { type: 'exercise', spec: { kind: 'chord-arp', ref: 'dom9_r5@Db' } },
      { type: 'text', md: `Now play the drop. Give the Db9 a shorter time than the others, if you like. It is a passing chord, so do not park on it.` },
      { type: 'exercise', spec: { kind: 'progression', refs: ['m9_r5@D', 'dom9_r5@Db', 'maj9_r5@C'], bpm: 64, beatsPerChord: 4, bars: 6 } },
    ],
  },
  {
    id: 'u8l5', unit: 8, title: 'The minor-key pull', minutes: 9,
    summary: 'In a minor key, swap the soft v for a dominant 7 and feel the lean toward home.',
    blocks: [
      { type: 'text', md: `Now the minor side. In A minor the natural v chord is **Em**: E, G, B. The G is a plain G, a whole step below the A. It is gentle. It does not push.

Soul players often swap in **E7** instead: E, G#, B, D. Its G# is a half step under the A, so it leans hard into the Am. It is the same idea as the E7 you met in Unit 6, now aimed at the minor key's home chord.

In the clips you sent, something similar seems to happen in G minor: a **major V**, D or D7, going home to Gm. The F# sits a half step under G and does the same job. The move works the same way in any minor key.

Compare the two. Both start and end on Am, and both visit the iv (Dm). Only the third chord changes. Listen for the lean, not for the notes.` },
      { type: 'exercise', spec: { kind: 'ear', mode: 'progression', options: ['i-iv-v-i', 'i-iv-V7-i'], rounds: 8 } },
      { type: 'text', md: `### Approach the bass from below

There is a second half-step trick here. Put the G# in the **bass** of the E7 and you get **E7/G#**. The bass then moves up a half step, G# to A, into the Am9. The bass is leaning in as well.

In the clips you sent, the bass seems to approach the root from a half step below in the same way. It is one of the simplest ways to make a progression sound intentional.` },
      { type: 'chords', refs: ['E7_Gsharp', 'Am9_5th'], caption: 'E7/G# into Am9. The bass steps G#, A.' },
      { type: 'listen', label: 'E7/G# into Am9', refs: ['E7_Gsharp', 'Am9_5th'], mode: 'strum' },
      { type: 'text', md: `Play the whole minor turn: Am9, Dm9, E7/G#, Am9. Let the E7/G# last a full bar and breathe before the Am9.` },
      { type: 'exercise', spec: { kind: 'progression', refs: ['Am9_5th', 'm9_r5@D', 'E7_Gsharp', 'Am9_5th'], bpm: 66, beatsPerChord: 4, bars: 8 } },
    ],
  },
  {
    id: 'u8l6', unit: 8, title: 'Put it together', minutes: 10,
    summary: 'One loop with every move from this unit: stepwise bass, a chromatic drop and a leaning dominant.',
    blocks: [
      { type: 'text', md: `Time to join the pieces. Here is one six-chord loop that uses everything from this unit:

**Am9, Dm9, Db9, Cmaj9, Fmaj7, E7/G#**

- Am9 to Dm9 is the minor side of the key.
- Dm9, Db9, Cmaj9 is the chromatic drop. The bass goes D, Db, C.
- Cmaj9 to Fmaj7 is a gentle step across, with common tones.
- Fmaj7 to E7/G# sets up the bass climb: F, then G#.
- E7/G# loops back into Am9 with the half-step lean.

The bass goes A, D, Db, C, F, G#, and back to A. A lot of that motion is by step or half step. That is the keys-player trick, translated for guitar.` },
      { type: 'chords', refs: ['Am9_5th', 'm9_r5@D', 'dom9_r5@Db', 'maj9_r5@C', 'Fmaj7_lowF', 'E7_Gsharp'], caption: 'Six chords, one loop.' },
      { type: 'listen', label: 'The full loop', refs: ['Am9_5th', 'm9_r5@D', 'dom9_r5@Db', 'maj9_r5@C', 'Fmaj7_lowF', 'E7_Gsharp'], mode: 'strum' },
      { type: 'text', md: `Start slow. Four beats per chord. Look ahead to the next shape and move early. When the loop feels easy, let the Db9 shrink to two beats.` },
      { type: 'exercise', spec: { kind: 'progression', refs: ['Am9_5th', 'm9_r5@D', 'dom9_r5@Db', 'maj9_r5@C', 'Fmaj7_lowF', 'E7_Gsharp'], bpm: 66, beatsPerChord: 4, bars: 12 } },
      { type: 'tip', md: `**Capo 1.** Put the capo on fret 1 and play the same loop. It now sounds in the key of the clips you sent. The chords you hear are Bbm9, Ebm9, D9, Dbmaj9, Gbmaj7 and F7/A. Each one is exactly a half step above the shape you are playing. The shapes in your hand keep their old names.` },
      { type: 'tip', md: `**Your next step.** Pick a few seconds of a clip and copy it by ear, chord by chord. Listen for the bass first. Then guess a chord, and test your guess in the Chords library. Slow the clip down if you can. It will teach you more than any lesson here.` },
    ],
  },
];
