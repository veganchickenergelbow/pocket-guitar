// Unit 11: Rhythm theory
export const LESSONS = [
  {
    id: 'u11l1', unit: 11, title: 'Subdivisions', minutes: 9,
    summary: 'Quarters, eighths and sixteenths, and why slow neo-soul lives on the sixteenths.',
    blocks: [
      { type: 'text', md: `Rhythm starts with the **beat**, the pulse you tap your foot to. A **subdivision** is how you cut that beat into smaller, equal pieces. There are three you need.

- **Quarter notes:** one note per beat. You count "1, 2, 3, 4."
- **Eighth notes:** two notes per beat. You count "1 & 2 & 3 & 4 &." The "&" sits exactly halfway through the beat.
- **Sixteenth notes:** four notes per beat. You count "1 e & a 2 e & a 3 e & a 4 e & a."

Say the sixteenth count out loud, evenly, with the metronome. The numbers fall on the beat. The "&" falls halfway. The "e" and the "a" sit between them.

### Why sixteenths matter here
Neo-soul grooves usually sit at a slow tempo, around 80 to 90 beats per minute. At that speed a beat is long, and an eighth note feels empty. So the groove is carried by the **sixteenth-note grid**. Your hand keeps moving four times per beat, and the music sits on some of those four positions and skips others.

At 80 bpm a beat lasts 750 milliseconds, so a sixteenth is about 190 milliseconds. That is slow enough to play loosely and fast enough to feel busy.` },
      { type: 'text', md: `### The strumming hand never stops
Here is the trick. Your picking hand moves down-up-down-up in steady sixteenths, like a pendulum. You do **not** hit every stroke. You choose.

- Strong strokes: a full chord, usually on the beat or the "&".
- **Ghost strokes:** the hand passes over the strings but the fretting hand eases off, or you barely touch them. You get a soft, percussive "chk" with no ringing notes.

The ghosts fill the gaps and give the groove a rolling feel. The steady hand is what keeps the timing even, even when the notes are sparse.` },
      { type: 'exercise', spec: { kind: 'quiz', questions: [
        { q: 'How many sixteenth notes fit in one beat?', options: ['2', '3', '4', '8'], answer: 2, explain: 'Four sixteenths make one beat. You count them "1 e & a".' },
        { q: 'In the count "1 e & a", where does the "&" fall?', options: ['On the beat', 'A quarter of the way', 'Halfway through the beat', 'Just before the next beat'], answer: 2, explain: 'The "&" is the eighth-note offbeat, halfway between one beat and the next.' },
        { q: 'At 80 bpm, roughly how long is one sixteenth note?', options: ['75 ms', '190 ms', '375 ms', '750 ms'], answer: 1, explain: 'A beat at 80 bpm is 750 ms. Divide by four and you get about 190 ms.' },
        { q: 'What do you do on a ghost stroke?', options: ['Stop your hand', 'Hit the chord as hard as you can', 'Let your hand pass over muted strings', 'Skip the beat'], answer: 2, explain: 'The hand keeps moving so the timing stays even. The ghost stroke is a soft, muted sound that fills the gap.' },
        { q: 'Why do slow neo-soul grooves lean on sixteenths?', options: ['They are easier to play', 'The slow beat needs finer pulses to feel alive', 'They make the chords louder', 'They change the key'], answer: 1, explain: 'At slow tempos an eighth note is a long gap. Sixteenths give the groove its shuffle and movement.' },
      ] } },
      { type: 'text', md: `Now play it. Four chords, one bar each, at 80 bpm: Am7, Dm7, G7, Cmaj7. Keep your strumming hand moving in sixteenths: down on the beat, up on the "e", down on the "&", up on the "a". Hit a full chord on beat 1 and on the "&" of 2. Everything else is a ghost. Start slow and let your hand settle.` },
      { type: 'exercise', spec: { kind: 'progression', refs: ['Am7_open', 'Dm7_open', 'G7_open', 'Cmaj7_open'], bpm: 80, beatsPerChord: 4, bars: 8 } },
    ],
  },
  {
    id: 'u11l2', unit: 11, title: 'Syncopation and anticipation', minutes: 9,
    summary: 'Put accents off the beat and push chords early so the groove leans forward.',
    blocks: [
      { type: 'text', md: `A groove with every accent on the beat sounds square. **Syncopation** means putting the accents on the weaker spots: the "&" or the "a", the places between the beats. The beat is still there in your foot, but the music dances around it.

Try it with one chord. Count "1 e & a 2 e & a" and strum a chord on 1, the "&" of 1, and the "a" of 2. Feel how the accents slip around the pulse.

### Anticipation
The most useful syncopation for chord changes is **anticipation**: you play the new chord a little **before** the beat it belongs to.

- Normal: the new chord arrives on beat 1 of the next bar.
- Pushed by an eighth: it arrives on the "&" of 4, half a beat early.
- Pushed by a sixteenth: it arrives on the "a" of 4, a quarter of a beat early.

The bar line becomes blurry. The harmony changes just before you expect it, which makes the music feel like it is leaning forward. Keys players do this all the time, and it is a big part of the neo-soul feel.` },
      { type: 'text', md: `### How to do it
On paper the chord belongs to beat 1. In your hands it arrives at the "a" or the "&" just before. You do not rush the tempo. You keep counting, and just place the strum early.

A good first target is the "&" of 4. Play the next chord there, and let it ring through beat 1. When that is easy, try the "a" of 4. It is a smaller, subtler push, only a sixteenth early.` },
      { type: 'exercise', spec: { kind: 'quiz', questions: [
        { q: 'What is syncopation?', options: ['Playing faster', 'Accenting the weaker parts of the beat', 'Playing without a pulse', 'Changing key'], answer: 1, explain: 'Syncopation puts the accents between the beats instead of on them.' },
        { q: 'You play the next chord on the "&" of 4. How early is it?', options: ['A whole beat', 'Half a beat', 'A quarter of a beat', 'It is on time'], answer: 1, explain: 'The "&" is halfway through the beat, so the chord is half a beat early.' },
        { q: 'Which count position is the last sixteenth before the next beat?', options: ['e', '&', 'a', '1'], answer: 2, explain: 'In "1 e & a" the "a" is the fourth sixteenth. It sits right before the next beat.' },
        { q: 'What is anticipation?', options: ['Playing a chord late', 'Playing a chord before the beat where it belongs', 'Holding a chord for two bars', 'Muting a chord'], answer: 1, explain: 'Anticipation moves the arrival of a chord ahead of its beat.' },
        { q: 'What should you do with the tempo when you anticipate?', options: ['Speed up', 'Slow down', 'Keep it steady', 'Stop counting'], answer: 2, explain: 'The pulse stays still. Only the placement of the chord moves.' },
      ] } },
      { type: 'text', md: `Now practise. This progression walks the bass down by step: F, E, D, C. Change chords on the **"&" of 4** each time, not on the next bar line. Count "1 e & a" quietly in your head and strum the new chord on the "&", then let it ring across the barline.` },
      { type: 'exercise', spec: { kind: 'progression', refs: ['Fmaj7_lowF', 'Em7_open', 'Dm7_open', 'Cmaj7_open'], bpm: 76, beatsPerChord: 4, bars: 8 } },
    ],
  },
  {
    id: 'u11l3', unit: 11, title: 'Straight, swung and laid back', minutes: 9,
    summary: 'Three ways to place the same notes in time, and how to sit just behind the click.',
    blocks: [
      { type: 'text', md: `The same pattern of notes can feel very different depending on **where inside the beat** you place them.

### Straight
In **straight** feel, the "&" falls exactly halfway through the beat. The eighth notes are even. Most pop and rock is straight.

### Swung
In **swung** feel, the beat is divided into **three** parts, as a triplet, and the first eighth takes two of them. The second eighth takes the last one. So the two eighths are **long, short**, in a ratio of about 2 to 1. You count "1 trip-let 2 trip-let" and play on the first and third pulse. Jazz and shuffle blues live here. A loose swing, somewhere between straight and a full triplet, is common in neo-soul and hip-hop.

### Laid back
**Laid back** is different. It is not about the shape of the beat. It is about where the whole groove sits against the pulse. A laid-back player lands notes a tiny moment **behind the beat**, perhaps a few hundredths of a second. The tempo does not slow down. The click stays steady, and you play slightly late, relaxed and in no hurry.

This is a big part of the feel in neo-soul. The drummer's snare drags, the keys sit back and the chords float. You can do the same on guitar by playing each strum a hair after the click, and by leaving space.` },
      { type: 'text', md: `### How to practise laid-back time
1. Play along with the click and put your strums right **on** it. Notice the feeling of being on top.
2. Now deliberately let each strum land a hair after the click. The click should sound like it is a little ahead of you.
3. Keep the delay **steady**. If it grows, you are slowing down. The gap must stay the same size.

The metronome in this next exercise clicks on **beats 2 and 4** only, like a snare. Strum your chords with a relaxed, slightly late feel and let the backbeat pull against you.` },
      { type: 'exercise', spec: { kind: 'quiz', questions: [
        { q: 'In swung eighths, the long and short notes are in roughly what ratio?', options: ['1 to 1', '2 to 1', '3 to 1', '4 to 1'], answer: 1, explain: 'Swing puts the first eighth on the first two thirds of a triplet and the second on the last third. That is 2 to 1.' },
        { q: 'How many equal parts is a beat divided into in a triplet feel?', options: ['2', '4', '3', '6'], answer: 2, explain: 'A triplet splits the beat into three equal parts.' },
        { q: 'What does playing "behind the beat" mean?', options: ['Playing slower than the song', 'Rushing the tempo', 'Landing notes a little after the pulse while the tempo stays steady', 'Playing only on beat 1'], answer: 2, explain: 'The pulse stays the same. Your notes arrive just a touch late, which gives a relaxed feel.' },
        { q: 'Which beats does a typical backbeat accent?', options: ['1 and 3', 'Every beat', 'Only 1', '2 and 4'], answer: 3, explain: 'The snare in most grooves lands on 2 and 4. That is the backbeat.' },
        { q: 'You notice your laid-back strums are getting later every bar. What is happening?', options: ['You are dragging, not sitting steadily behind', 'You are laid back perfectly', 'The metronome is broken', 'You changed key'], answer: 0, explain: 'A laid-back feel keeps a constant gap behind the pulse. A growing gap means the tempo is slipping.' },
      ] } },
      { type: 'text', md: `Last piece. Cmaj9, Am7, Dm7 and F/G, one bar each at 84 bpm. Strum loosely, a hair behind the 2 and 4 clicks. Let the F/G lean into the Cmaj9 when the loop comes around.` },
      { type: 'exercise', spec: { kind: 'progression', refs: ['Cmaj9_open', 'Am7_open', 'Dm7_open', 'FoverG'], bpm: 84, beatsPerChord: 4, bars: 8, backbeat: true } },
    ],
  },
];
