# Pocket — guitar & harmony coach (SPEC)

Installable iPhone web app (PWA). Goal: take a strummer who knows open chords and basic fingerstyle
toward neo-soul / gospel-flavoured harmony on guitar (John Mayer, Lizzy McAlpine, Ryan Beatty,
Olivia Dean, MkGee; keys-player influence). Theory is always applied on the fretboard immediately.

## Stack & rules
- Vanilla JS ES modules, no framework, no build step, no npm runtime deps. Runs from any static server.
- One concern per file, files under ~250 lines. Tokens + shared classes only from `styles.css`.
- Strings are indexed **0 = low E … 5 = high e**. Standard tuning MIDI: `[40,45,50,55,59,64]`.
- Frets arrays are low→high, `-1` = muted, `0` = open.
- Note names: prefer flats for flat keys (F, Bb, Eb, Ab, Db, Gb, Dm, Gm, Cm, Fm), sharps otherwise.
- Every module is pure where possible; Node-testable logic gets tests in `tests/*.test.mjs`
  (run with `node --test tests/`). No test framework beyond `node:test` + `node:assert`.
- All views: `export function render(container, ctx) -> (cleanup?: () => void)`.
- All exercises: `export function mount(container, spec, ctx) -> { destroy() }`, call
  `ctx.onComplete({ passed: boolean, score?: number })` when finished.

## File ownership
```
index.html  manifest.webmanifest  sw.js  icons/           (D)
styles.css                                                (D)
js/app.js  js/router.js  js/store.js                      (D)
js/views/today.js  js/views/learn.js  js/views/ear.js
js/views/tools.js  js/views/placement.js                  (D)
js/audio/synth.js  js/audio/pitch.js  js/audio/listener.js
js/audio/metronome.js  js/views/tuner.js                  (A)
js/music/theory.js  js/music/voicings.js
js/ui/diagram.js  js/views/library.js                     (B)
js/content/curriculum.js  js/content/lessons/*.js
js/views/lesson.js  js/ui/markdown.js  js/exercises/*.js  (C)
tests/*.test.mjs  (each owner tests their own modules)
```

## ctx object (built by app.js)
```js
ctx = {
  store,                      // js/store.js
  navigate(route, params),    // routes below
  synth,                      // module namespace of js/audio/synth.js
  onComplete,                 // set per exercise mount by the caller
}
```
Routes (hash-free, in-app state): `today`, `learn`, `lesson` {id}, `ear`, `tools` {tab:'tuner'|'metronome'|'library'}, `placement`.

## Module APIs (contracts — implement exactly)

### js/audio/synth.js (A)
- `unlock(): Promise<void>` create/resume one shared AudioContext; call from a tap.
- `getContext(): AudioContext|null`
- `playMidi(midi, {when=0, dur=1.6, velocity=0.8}={})` — Karplus-Strong plucked string, warm, light body filter.
- `playChord(midis, {strum=0.035, direction='down', dur=2.2, velocity=0.75}={}): Promise<void>` resolves when done ringing.
- `playSequence(midis, {gap=0.45, dur=1.2}={}): Promise<void>`
- `stopAll()`

### js/audio/pitch.js (A)
- `detectPitch(buf: Float32Array, sampleRate: number): {freq:number, clarity:number}|null` — pure, YIN or MPM, valid 70–1200 Hz. Must work for low E (82.4 Hz) with 2048–4096 samples.
- `freqToMidiCents(freq, a4=440): {midi:int, cents:number}`
- `startMic(): Promise<{ctx, source, stop()}>` — getUserMedia with echoCancellation/noiseSuppression/autoGainControl **false**. Throws `Error` with `.code` in `'insecure'|'unsupported'|'denied'|'unknown'`.

### js/audio/listener.js (A)
- `createListener({onPitch?, onNote?, onLevel?, a4=440}) -> {start(): Promise<void>, stop()}`
  - `onPitch({freq, midi, cents, name, clarity, rms})` every frame with a confident pitch.
  - `onNote({midi, pc, name, cents})` once per **stable note onset**: same midi held ≥120 ms with clarity ≥0.9 and rms above an adaptive noise floor; next onset needs either a new midi or a level dip+rise (re-pluck). Tolerate octave errors by reporting the lower candidate when detector is ambiguous.
  - `onLevel(rms)`.

### js/audio/metronome.js (A)
- `createMetronome({bpm=80, beatsPerBar=4, onBeat?(beatIndex, barIndex)}) -> {start(), stop(), setBpm(n), isRunning()}` — lookahead scheduler on AudioContext clock, accent on beat 1, soft woodblock-ish click.

### js/music/theory.js (B)
- `NOTE_SHARP = ['C','C#',…]`, `NOTE_FLAT = ['C','Db',…]`
- `pc(name: string): number` accepts 'C', 'Db', 'C#', 'Bb', also with octave 'G3' (ignores octave).
- `noteToMidi('G3') -> 55`, `midiToName(midi, preferFlats=false) -> 'G3'`, `pcName(pc, preferFlats)`
- `midiToFreq(midi, a4=440)`, `freqToMidi(freq, a4=440) -> float`
- `preferFlatsFor(keyName) -> boolean`
- `INTERVALS` table: `{semitones, short:'m3', name:'minor 3rd'}` for 0–14.
- `SCALES`: major, naturalMinor, majorPentatonic, minorPentatonic, dorian, mixolydian (semitone arrays).
- `scaleNotes(rootPc, scaleName) -> pc[]`
- `CHORDS`: quality → `{symbol, intervals, required}`; qualities:
  `maj, min, dim, aug, sus2, sus4, add9, 6, m6, maj7, m7, 7, m7b5, dim7, 9, maj9, m9, 11?(skip), m11, 13, 7sus4`.
  `required` = root, the 3rd (or sus tone), the 7th if present, and the highest named extension. 5th and lower extensions optional.
- `chordPcs(rootPc, quality) -> pc[]`
- `chordSymbol(rootPc, quality, preferFlats) -> 'Cmaj7'`
- `diatonicChords(keyPc, {sevenths=false, minor=false}) -> [{degree:'ii', roman:'ii7', rootPc, quality}]` (7 items).
- `fretMidi(stringIdx, fret) -> midi`, `voicingMidis(frets) -> midi[]` (low→high, mutes skipped).
- `analyzeVoicing(frets, rootPc, quality, {rootless=false}) -> {ok, missing:[interval], extra:[pc]}`.
- `fretsForPc(pc, stringIdx, maxFret=12) -> fret[]`.

### js/music/voicings.js (B)
- Fixed voicings: `{id, rootPc|root:'C', quality, frets, fingers?, label?, tags:[]}`.
- Movable templates: `{id, quality, rootString, shape:[relative offsets or null], minRootFret}` where fret = rootFret + offset.
- `resolveVoicing(ref) -> {id, name, rootPc, quality, frets, baseFret}`; `ref` is either a fixed id (`'Cmaj7_open'`)
  or `'<templateId>@<Note>'` (`'maj7_r5@C'`). Chooses the lowest root fret ≥ minRootFret (allow 0 only if template marks `openOk`).
- `listVoicings({quality?, rootPc?}) -> resolved[]` for the library.
- **Test (required):** every fixed voicing and every template resolved at all 12 roots passes `analyzeVoicing`. If a listed shape below fails, report it, don't silently change it.

Required fixed voicings (id: frets low→high):
```
C_open x32010   G_open 320003   D_open xx0232   A_open x02220   E_open 022100
Am_open x02210  Em_open 022000  Dm_open xx0231  F_barre 133211  Fm_barre 133111
Cmaj7_open x32000  Fmaj7_open xx3210  Amaj7_open x02120  Dmaj7_open xx0222  Gmaj7_open 320002
Am7_open x02010    Em7_open 022030    Dm7_open xx0211
G7_open 320001  E7_open 020100  A7_open x02020  D7_open xx0212  B7_open x21202  C7_open x32310
Cadd9_open x32030  Cmaj9_open x32430  Am9_5th x05557
Dsus2_open xx0230  Asus2_open x02200  Dsus4_open xx0233  Asus4_open x02230
CG_slash 332010 (C/G, quality maj)  Fsharpdim7 2x121x (F#dim7)
```
Required templates (id: quality, rootString, shape offsets low→high, `x`=muted):
```
maj_r6   maj  0  [0,2,2,1,0,0]          maj_r5  maj  1  [x,0,2,2,2,0]
min_r6   min  0  [0,2,2,0,0,0]          min_r5  min  1  [x,0,2,2,1,0]
maj7_r6  maj7 0  [0,x,1,1,0,x]          maj7_r5 maj7 1  [x,0,2,1,2,0]
m7_r6    m7   0  [0,x,0,0,0,x]          m7_r5   m7   1  [x,0,2,0,1,0]
dom7_r6  7    0  [0,x,0,1,0,x]          dom7_r5 7    1  [x,0,2,0,2,0]
m7b5_r6  m7b5 0  [0,x,0,0,-1,x]         m7b5_r5 m7b5 1  [x,0,1,0,1,x]
maj9_r5  maj9 1  [x,0,-1,1,0,x]  min 2  m9_r5   m9   1  [x,0,-2,0,0,x]  min 3
dom9_r5  9    1  [x,0,-1,0,0,0]  min 2  dom13_r6 13  0  [0,x,0,1,2,x]
m11_r6   m11  0  [0,x,0,0,-2,x]  min 3  dim7_r6 dim7 0  [0,x,-1,0,-1,x] min 2
maj7_d2  maj7 2  [x,x,0,2,2,2]          m7_d2   m7   2  [x,x,0,2,1,1]
dom7_d2  7    2  [x,x,0,2,1,2]
```
(rootString 2 = D string, "drop-2" voicings on the top four strings.)

### js/ui/diagram.js (B)
- `chordDiagram(resolvedVoicing, {width=120, showNotes=false, rootPc, highlight?:pc[]}) -> SVGElement`
  vertical chord box, 6 strings, 5 frets, nut when baseFret ≤1 else fret number label, x/o markers,
  root dots in `--root`, other dots in `--tone`, optional note-name labels in dots. Uses CSS vars via `currentColor`/`var()`.
- `fretboard({from=0, to=12, marks=[{string, fret, label?, kind:'root'|'tone'|'target'|'ghost'}], height=150}) -> SVGElement`
  horizontal neck, low E at bottom, inlays at 3,5,7,9,12; scrolls horizontally inside its own container.

### js/content/curriculum.js (C)
- `UNITS = [{id:1, title, blurb, lessons:[lessonId,…]}]`
- `getLesson(id)`, `allLessons()`, `getNextLesson(state) -> lesson|null` (first incomplete lesson at or after `state.startUnit`).
- Lesson: `{id:'u3l1', unit:3, title, minutes, summary, blocks:[…]}`. Block types:
  - `{type:'text', md}` — tiny markdown (paragraphs, **bold**, *italic*, `- ` lists, `### ` subheads, `` `code` ``), rendered by `js/ui/markdown.js`.
  - `{type:'chords', refs:[voicingRef…], caption?, showNotes?}` diagrams in a row, each tappable to hear it.
  - `{type:'fretboard', from, to, marks, caption}`
  - `{type:'listen', label, refs?:[voicingRef], midis?:[], mode:'strum'|'arp'|'seq'}` play button.
  - `{type:'exercise', spec}` → mounts `js/exercises/<spec.kind>.js`.
  - `{type:'tip', md}` callout (style/artist context).
- Exercise kinds (one file each in `js/exercises/`):
  - `find-note` `{string:0|1, notes:['G','C',…]|'random', count}` mic: play named note on given string (pc match, fret 0–12 range of that string).
  - `sequence` `{label, notes:['G3','A3',…], octaveStrict:false}` mic: play in order; shows progress chips.
  - `chord-arp` `{ref}` mic: pick the chord one string at a time low→high; each played string turns green.
  - `ear` `{mode:'interval'|'quality'|'progression', options:[…], rounds=8}` synth plays, user picks; score.
  - `quiz` `{questions:[{q, options, answer:index, explain}]}` no audio.
  - `progression` `{refs:[…], bpm, beatsPerChord, bars?}` play-along: metronome + current chord highlighted + next chord preview; "Play demo" uses synth strum; self-mark done.
  All mic exercises: explicit "Start listening" button (iOS needs a tap), level meter, "Skip / I did it" fallback, graceful message when mic denied.
  Pass = completing all items; mic matches accept ±40 cents.

### js/store.js (D)
```js
state = { version:1, startUnit:1, placementDone:false, completed:{[lessonId]:isoDate},
  ear:{[mode]:{right, total}}, streak:{last:'YYYY-MM-DD', days:0}, practice:{[date]:minutes},
  settings:{a4:440, leftHanded:false} }
```
`get()`, `update(fn)`, `subscribe(fn)`, `completeLesson(id)`, `logEar(mode, right)`, `logPractice(min)`, `exportJson()`, `importJson(str)`. localStorage key `pocket.v1`, wrapped in try/catch.

## Design tokens (styles.css, D) — everyone uses these names
Concept: "late-night session" — dark-first, dim stage light, brass accent like fret wire; one column, bottom tab bar.
```
--bg --surface --surface-2 --line --fg --muted
--accent (brass) --accent-ink (text on accent) --root (coral, root notes) --tone (blue, chord tones)
--good --bad
--font-display 'Bricolage Grotesque'  --font-body 'Figtree'  --font-mono 'JetBrains Mono'
--r-sm 8px --r-md 14px --r-lg 22px   --space-1..6 (4,8,12,16,24,32px)
```
Dark (default): bg #111319, surface #191c24, surface-2 #222632, line #2e3342, fg #ecebe6, muted #9aa0ae,
accent #e2b45e, accent-ink #1b1405, root #f08a6c, tone #86b4e6, good #7ccf98, bad #e87474.
Light (`prefers-color-scheme: light` and `[data-theme=light]`): bg #f2f3f6, surface #ffffff, surface-2 #e9ebf0,
line #d6d9e1, fg #181a20, muted #5c6270, accent #9c6c12, accent-ink #ffffff, root #c8502f, tone #2c66ad, good #23824a, bad #c03a3a.
Shared classes: `.screen` `.stack` (vertical gap) `.row` (wrap gap) `.card` `.btn` `.btn-primary` `.btn-ghost`
`.chip` `.chip.good` `.chip.bad` `.chip.active` `.muted` `.mono` `.h1` `.h2` `.eyebrow` `.meter` (level bar, inner `.meter-fill`)
`.diagram-row` (horizontal scroll row of diagrams) `.scroll-x` `.callout` `.progress` (inner `.progress-fill`).
Respect `prefers-reduced-motion`. Tap targets ≥44px. Safe-area insets on bottom tab bar.

## Curriculum outline (C writes the lesson text from this; Opus-authored)
Voice: a friendly, direct teacher who plays. Short paragraphs. Every lesson ends with something to play.
Name artists only for general style ("Mayer-style hammer-ons"), never claim a specific song uses a specific progression.

**Unit 1 · Map the neck** (roots are how every movable shape works)
1. Notes on the low E and A strings — naturals, sharps/flats, fret 12 = octave, dots as landmarks. Ex: find-note string 0 then string 1.
2. Octave shapes — 2 frets up, 2 strings over (E→D, A→G); 3 frets up across the B string. Ex: sequence of octaves.
3. Root-6 vs root-5 shapes — maj_r6/maj_r5/min_r6/min_r5 at G, C, A, D. Ex: chord-arp maj_r5@C, progression with barre shapes.

**Unit 2 · Why chords sound the way they do**
1. Intervals by ear and by fret — half/whole steps, m3/M3, P4, P5, octave. Ex: ear interval (m3,M3,P4,P5,8ve).
2. The major scale — W W H W W W H; degrees 1–7; G major one octave from low E 3. Ex: sequence G2…G3.
3. Triads — stacked thirds, major vs minor lives in the 3rd. Ex: ear quality (maj/min), chord-arp C_open.
4. Chords in a key by number — I ii iii IV V vi vii°; why the same four chords power so many pop songs; transpose by number. Ex: quiz (numbers in G, D, C), progression G_open D_open Em_open C_open.

**Unit 3 · Seventh chords — the first step into lush**
1. Major 7 — add the 7th, dreamy. Cmaj7_open, Fmaj7_open, Amaj7_open, Dmaj7_open; maj7_r5. Ex: chord-arp Cmaj7_open; progression Cmaj7 Fmaj7.
2. Minor 7 — soft, open. Am7_open Em7_open Dm7_open; m7_r6, m7_r5. Ex: progression Am7 Dm7 Em7.
3. Dominant 7 — tension that wants home. G7_open E7_open A7_open B7_open. Ex: ear quality (maj7, m7, 7).
4. The ii–V–I — Dm7 G7 Cmaj7 with m7_r5@D, dom7_r6@G, maj7_r5@C; diatonic sevenths of C. Ex: quiz, progression.

**Unit 4 · Extensions — colour tones**
1. add9 & sus — Cadd9, Dsus2, Asus2, sus4→3 resolution (Dsus4→D, Asus4→A). Ex: progression.
2. 9 chords — Cmaj9_open, maj9_r5, m9_r5, Am9_5th; the 9 is the 2 an octave up. Ex: chord-arp Cmaj9_open; ear quality (maj7 vs maj9).
3. 11 & 13 — m11_r6@A, dom13_r6@G; drop the 5th and root-doubling, keep 3, 7, colour. Ex: chord-arp dom13_r6@G.
4. Building voicings yourself — rule: guide tones (3 & 7) + one colour; use analyzeVoicing-style explanation. Ex: quiz.

**Unit 5 · Voice leading — make guitar move like keys**
1. Guide tones — 3rds and 7ths move by step through ii–V–I; fretboard marks of the guide tones. Two lines: C (7 of Dm7) → B (3 of G7) → B (7 of Cmaj7), and F (3 of Dm7) → F (7 of G7) → E (3 of Cmaj7). Ex: sequence C4 B3 B3 then F3 F3 E3, explain both lines.
2. Top-note melody — drop-2 on the top four strings: maj7_d2, m7_d2, dom7_d2; keep the top note moving smoothly. Ex: progression m7_d2@D dom7_d2@G maj7_d2@C.
3. The smooth neo-soul ii–V–I — m9_r5@D, dom13_r6@G, maj9_r5@C: tiny finger moves, huge sound. Ex: chord-arp each, progression slow bpm 66.
4. Inner-voice embellishment — sus4→3 and 9→1 hammer-ons/pull-offs inside a held chord (Mayer-style). Ex: sequence.

**Unit 6 · Gospel & neo-soul moves (keys ideas on guitar)**
1. Chromatic approach chords — slide any voicing in from a half step above/below (e.g. m9 one fret up → home). Ex: progression.
2. Secondary dominants — V7 of vi: C – E7 – Am – F. Ex: ear progression (hear the E7 lift), progression.
3. The minor iv — F → Fm → C (bittersweet); F_barre Fm_barre C_open. Ex: progression.
4. The church walk-up — C – C7 – F – F#dim7 – C/G – G7 – C. Ex: progression.
5. Reharmonize a pop progression — G D Em C → maj7_r6@G, Dsus2_open, m9_r5@E, Cmaj9_open — take four-chord songs you already play and swap in 7ths/9ths by function. Ex: progression, quiz.

**Unit 7 · Ear & feel**
1. Hearing chord quality in context — ear progression mode (I–vi–IV–V vs I–iii–IV–V etc).
2. The pocket — ghost strums, muted 2 and 4 slap, laid-back time; metronome at 70 with clicks on 2 & 4. Ex: progression with bpm 70.

## Placement (D, js/views/placement.js)
Self-check toggles (each maps to a unit skip): "I can play E- and A-shape barre chords" (U1.3), "I know note names on the low E and A strings" (U1.1–2), "I know what a major scale and scale degrees are" (U2.2), "I can name the chords in a key by number (I–IV–V)" (U2.4), "I can play maj7, m7 and 7 chords" (U3). Plus 3 quiz questions (what makes a chord minor; notes of G major triad; what is the V chord in D). Suggest `startUnit` = first unit with a gap; user can override; all units always open.

## Today screen (D)
Streak, minutes this week, "Next lesson" card, suggested session (pick 10 / 20 / 30 min): tune (tuner) → next lesson → ear set (quality mode) → play-along from the last completed lesson. Link to placement if not done.
