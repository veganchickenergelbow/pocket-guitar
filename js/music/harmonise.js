// Harmonise drill questions (Unit 13). Pure: no DOM, no audio. Spelled for the key, so F major has Bb.
import { CHORDS, SCALES } from './theory.js';

const LETTERS = 'CDEFGAB';
const NATURAL = [0, 2, 4, 5, 7, 9, 11];
const mod12 = (n) => ((n % 12) + 12) % 12;
export const KEYS = ['C', 'G', 'D', 'A', 'E', 'F'].map((name) => ({
  name, letter: LETTERS.indexOf(name), pc: NATURAL[LETTERS.indexOf(name)],
}));
const ROMAN = ['I', 'ii', 'iii', 'IV', 'V', 'vi', 'vii°'];
const TRIAD = ['maj', 'min', 'min', 'maj', 'maj', 'min', 'dim'];

/** Name for pitch class `pc` written on letter index `letterIdx` (so Db, not C#, when asked for D). */
export function spell(letterIdx, pc) {
  const l = ((letterIdx % 7) + 7) % 7;
  const d = ((mod12(pc) - NATURAL[l] + 6 + 12) % 12) - 6;
  return LETTERS[l] + (d > 0 ? '#'.repeat(d) : 'b'.repeat(-d));
}

/** Seven scale degrees of a major key: {letter, pc, name}. */
export function keyDegrees(key) {
  return SCALES.major.map((s, i) => {
    const letter = (key.letter + i) % 7;
    const pc = mod12(key.pc + s);
    return { letter, pc, name: spell(letter, pc) };
  });
}

// Letter steps above the root for each interval (in semitones, compound allowed), for spelling chord tones.
const STEP = { 0: 0, 2: 1, 3: 2, 4: 2, 5: 3, 6: 4, 7: 4, 9: 5, 10: 6, 11: 6, 14: 1, 18: 3, 21: 5 };
/** Voicing intervals above the root. 9ths sit up an octave; the 13 drops its 5th and 11th. */
function voice(q) {
  if (q === '13') return [0, 4, 10, 21];
  return CHORDS[q].intervals.map((i) => (i === 2 ? 14 : i));
}
function tones(letter, rootPc, q) {
  return voice(q).map((iv) => ({ iv, name: spell(letter + STEP[iv], rootPc + iv) }));
}
const chordName = (rootName, q) => rootName + CHORDS[q].symbol;
const notesText = (letter, rootPc, q) => tones(letter, rootPc, q).sort((a, b) => a.iv - b.iv).map((t) => t.name).join(', ');
/** MIDI for a chord, root in 45-56 so it sits well on a phone speaker. */
export function chordMidis(rootPc, q) {
  const root = 45 + mod12(rootPc - 45);
  return voice(q).map((iv) => root + iv).sort((a, b) => a - b);
}

const pick = (arr, rand) => arr[Math.floor(rand() * arr.length)];
function shuffled(arr, rand) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function sample(arr, n, rand) { return shuffled(arr, rand).slice(0, n); }
/** Shuffle options, track the right one. */
function finish(type, prompt, right, wrong, explain, play, rand) {
  const options = shuffled([right, ...wrong], rand);
  return { type, prompt, options, answer: options.indexOf(right), explain, play };
}

function fits(key, rand) {
  const deg = keyDegrees(key);
  const ni = Math.floor(rand() * 7);
  const note = deg[ni];
  const tri = (i) => ({ i, name: chordName(deg[i].name, TRIAD[i]), root: deg[i], has: [0, 2, 4].some((k) => (i + k) % 7 === ni) });
  const all = [0, 1, 2, 3, 4, 5].map(tri); // vii° left out on purpose
  const right = pick(all.filter((c) => c.has), rand);
  const wrong = sample(all.filter((c) => !c.has), 3, rand);
  const role = ['root', '3rd', '5th'][[0, 2, 4].findIndex((k) => (right.i + k) % 7 === ni)];
  const midi = 67 + mod12(note.pc - 67);
  return finish('fits', `Melody note ${note.name} in ${key.name} major. Which chord contains it?`,
    right.name, wrong.map((c) => c.name),
    `${right.name} is ${notesText(right.root.letter, right.root.pc, TRIAD[right.i])}. The ${note.name} is its ${role}.`,
    { before: [[midi]], after: [chordMidis(right.root.pc, TRIAD[right.i])] }, rand);
}

// Per job: right answers, and wrong ones that clash with the diatonic chord (never a valid move such as
// I7, II7 or IV7, which are blues or secondary-dominant sounds).
const UPGRADE = {
  0: { job: 'rest at home', good: ['maj7', 'maj9', 'add9'], bad: ['m7', 'm7b5', 'dim7'] },
  1: { job: 'set up the V', good: ['m7', 'm9'], bad: ['maj7', 'maj9', 'm7b5', 'dim7'] },
  3: { job: 'move away from home', good: ['maj7', 'maj7#11'], bad: ['m7b5', 'dim7', 'aug'] },
  4: { job: 'pull back home', good: ['7', '9', '13', '9sus4'], bad: ['maj7', 'm7b5', 'maj9', 'dim7'] },
  5: { job: 'stand in for home', good: ['m7', 'm9'], bad: ['maj7', 'maj9', 'm7b5', 'dim7'] },
};

function upgrade(key, rand) {
  const deg = keyDegrees(key);
  const di = pick([0, 1, 3, 4, 5], rand);
  const d = deg[di];
  const u = UPGRADE[di];
  const q = pick(u.good, rand);
  const right = chordName(d.name, q);
  const wrong = sample(u.bad, 3, rand).map((b) => chordName(d.name, b));
  return finish('upgrade',
    `${chordName(d.name, TRIAD[di])} is the ${ROMAN[di]} chord in ${key.name} major. Pick a colour upgrade that keeps its job.`,
    right, wrong,
    `${right} is ${notesText(d.letter, d.pc, q)}. Every note is in ${key.name} major, so it can still ${u.job}. The others bring in notes from outside the key.`,
    { before: [chordMidis(d.pc, TRIAD[di])], after: [chordMidis(d.pc, q)] }, rand);
}

function approach(key, rand) {
  const deg = keyDegrees(key);
  const ti = pick([1, 2, 3, 4, 5, 0], rand);
  const t = deg[ti];
  const half = ti === 0;
  // Answer root: a 5th above the target, or (for I) a half step above it.
  const rootLetter = half ? t.letter + 1 : t.letter + 4;
  const rootPc = half ? t.pc + 1 : t.pc + 7;
  const right = chordName(spell(rootLetter, rootPc), '7');
  // Wrong dominants sit on other scale degrees, never on the target or a half step above it (tritone sub).
  const banned = new Set([mod12(rootPc), mod12(t.pc), mod12(t.pc + 1)]);
  const wrong = sample(deg.filter((x) => !banned.has(x.pc)), 3, rand).map((x) => chordName(x.name, '7'));
  const targetQ = half ? 'maj7' : TRIAD[ti];
  const target = chordName(t.name, targetQ);
  const prompt = half
    ? `In ${key.name} major, which dominant a half step above leads into ${target}?`
    : `In ${key.name} major, which chord is the secondary dominant into ${target}?`;
  const explain = half
    ? `${right} sits a half step above ${t.name}. Its notes slide down to ${target}. This is the flat-II dominant, a tritone sub for V7.`
    : `${right} is a 5th above ${t.name}, so it is the V7 of ${target}. It resolves down a 5th.`;
  return finish('approach', prompt, right, wrong, explain,
    { before: [chordMidis(t.pc, targetQ)], after: [chordMidis(rootPc, '7'), chordMidis(t.pc, targetQ)] }, rand);
}

/** One random question: { type, prompt, options, answer (index), explain, play: { before, after } }. */
export function makeQuestion(rand = Math.random) {
  const key = pick(KEYS, rand);
  return pick([fits, upgrade, approach], rand)(key, rand);
}
