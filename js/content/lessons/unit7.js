// Unit 7: Ear and feel
export const LESSONS = [
  {
    id: 'u7l1', unit: 7, title: 'Hearing harmony in context', minutes: 8,
    summary: 'Tell progressions apart by listening to what changes, not to every note.',
    blocks: [
      { type: 'text', md: `Hearing a single chord's quality is a skill. Hearing it inside a moving progression is a bigger skill, and it is the one you actually use.

Do not try to name every note. Listen for **what changed** between two things you know. These two sound almost the same at first:

- **I, vi, IV, V** (C, Am, F, G)
- **I, iii, IV, V** (C, Em, F, G)

Only the second chord differs. Am sounds darker and more melancholy. Em sounds lighter and a little more floating, because it shares two notes with the C chord (E and G). Listen to the bass and the mood of the second chord.` },
      { type: 'listen', label: 'I, vi, IV, V', refs: ['C_open', 'Am_open', 'F_barre', 'G_open'], mode: 'strum' },
      { type: 'listen', label: 'I, iii, IV, V', refs: ['C_open', 'Em_open', 'F_barre', 'G_open'], mode: 'strum' },
      { type: 'text', md: `Start with chord qualities (7th chords in isolation), then move on to the progressions. The keys change every round, so you cannot rely on pitch. Rely on character.` },
      { type: 'exercise', spec: { kind: 'ear', mode: 'quality', options: ['maj7', 'm7', '7', 'maj9', 'm9'], rounds: 8 } },
      { type: 'exercise', spec: { kind: 'ear', mode: 'progression', options: ['I-vi-IV-V', 'I-iii-IV-V', 'I-IV-V-I', 'I-V-vi-IV'], rounds: 8 } },
      { type: 'text', md: `Do a few sets a week. The Ear tab has an endless mode so you can do five minutes whenever you have a gap.` },
    ],
  },
  {
    id: 'u7l2', unit: 7, title: 'The pocket', minutes: 9,
    summary: 'Ghost strums, muted backbeats and a laid-back feel that makes chords groove.',
    blocks: [
      { type: 'text', md: `The right chords played stiffly sound like homework. The pocket is how a groove feels: relaxed, steady, a little behind the beat.

Three ingredients:

- **Ghost strums.** Keep your strumming hand moving in steady eighths (1 & 2 & 3 & 4 &), but let some strokes miss the strings or only brush them. The motion stays constant; the sound has holes.
- **Muted backbeat.** On beats **2 and 4**, hit the strings with your fretting hand relaxed, so the notes are choked into a percussive slap. It acts like a snare.
- **Laid-back time.** Place your strums a hair behind the click, not on top of it. Early feels nervous. Late (slightly) feels cool.

Chords on beat 1 and the "and" of 2 give the groove its shape. The muted slaps on 2 and 4 hold it down.` },
      { type: 'tip', md: `**Style note.** A lot of groove-based soul and R&B guitar is built on tight, quiet rhythm and space. Fewer notes, played with feel, outlast busy ones.` },
      { type: 'text', md: `Set the tempo around 70. The metronome only clicks on **2 and 4**, like a drummer's snare. Put your muted slap right on those clicks and let the chords fall around them. Play this I, vi, ii, V in C with your new rhythm.` },
      { type: 'exercise', spec: { kind: 'progression', refs: ['Cmaj7_open', 'Am7_open', 'Dm7_open', 'G7_open'], bpm: 70, beatsPerChord: 4, bars: 8, backbeat: true } },
      { type: 'text', md: `Record yourself on your phone once and listen back. The first time you hear yourself sitting properly in the pocket, you will know.` },
    ],
  },
];
