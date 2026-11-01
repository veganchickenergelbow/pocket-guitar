// Curriculum index. Pure data + lookups (no DOM, Node-importable).
import { LESSONS as U1 } from './lessons/unit1.js';
import { LESSONS as U2 } from './lessons/unit2.js';
import { LESSONS as U3 } from './lessons/unit3.js';
import { LESSONS as U4 } from './lessons/unit4.js';
import { LESSONS as U5 } from './lessons/unit5.js';
import { LESSONS as U6 } from './lessons/unit6.js';
import { LESSONS as U7 } from './lessons/unit7.js';
import { LESSONS as U8 } from './lessons/unit8.js';
import { LESSONS as U9 } from './lessons/unit9.js';
import { LESSONS as U10 } from './lessons/unit10.js';
import { LESSONS as U11 } from './lessons/unit11.js';
import { LESSONS as U12 } from './lessons/unit12.js';
import { LESSONS as U13 } from './lessons/unit13.js';

const ALL = [...U1, ...U2, ...U3, ...U4, ...U5, ...U6, ...U7, ...U8, ...U9, ...U10, ...U11, ...U12, ...U13];
const BY_ID = new Map(ALL.map((l) => [l.id, l]));
const ids = (list) => list.map((l) => l.id);

export const UNITS = [
  { id: 1, title: 'Map the neck', blurb: 'Learn the notes on your two bass strings. Every movable shape hangs off them.', lessons: ids(U1) },
  { id: 2, title: 'Why chords sound the way they do', blurb: 'Intervals, the major scale, triads and numbers. The grammar under every song.', lessons: ids(U2) },
  { id: 3, title: 'Seventh chords', blurb: 'Maj7, m7 and 7. The first step into lush.', lessons: ids(U3) },
  { id: 4, title: 'Extensions', blurb: 'Sus chords, 9ths, 11ths and 13ths. Colour tones, and how to build your own.', lessons: ids(U4) },
  { id: 5, title: 'Voice leading', blurb: 'Make guitar chords move like a keyboard player\'s hands.', lessons: ids(U5) },
  { id: 6, title: 'Gospel and neo-soul moves', blurb: 'Approach chords, secondary dominants, the minor iv and the church walk-up.', lessons: ids(U6) },
  { id: 7, title: 'Ear and feel', blurb: 'Hear the harmony in context, and make it sit in the pocket.', lessons: ids(U7) },
  { id: 8, title: 'Keys-style soul', blurb: 'The sound of keys-led soul duos, translated to guitar: flat keys, stepwise bass and chords that lean.', lessons: ids(U8) },
  { id: 9, title: 'Scales and modes', blurb: 'Pentatonics, chord tones and colour tones, and three modes that matter: Dorian, Mixolydian and Lydian.', lessons: ids(U9) },
  { id: 10, title: 'Harmony toolbox', blurb: 'The circle of fifths, top-string triads, slash chords and borrowed chords from the parallel minor.', lessons: ids(U10) },
  { id: 11, title: 'Rhythm theory', blurb: 'Subdivisions, syncopation, swing and the laid-back feel that makes slow soul groove.', lessons: ids(U11) },
  { id: 12, title: 'Moonchild-style neo-soul', blurb: 'Soft, jazzy, Rhodes-flavoured neo-soul: sus dominants, borrowed minor chords and a laid-back 16th-note feel.', lessons: ids(U12) },
  { id: 13, title: 'Harmonise your songs', blurb: 'How to take a plain chord chart and make it yours: chord families, colour by job, approach chords, bass lines and borrowed colour.', lessons: ids(U13) },
];

export function getLesson(id) {
  return BY_ID.get(id) || null;
}

export function allLessons() {
  return ALL.slice();
}

/** First incomplete lesson at or after state.startUnit, else null. */
export function getNextLesson(state) {
  const start = (state && state.startUnit) || 1;
  const done = (state && state.completed) || {};
  for (const l of ALL) {
    if (l.unit >= start && !done[l.id]) return l;
  }
  return null;
}
