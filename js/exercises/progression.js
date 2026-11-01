// progression: play-along. Metronome + current chord highlighted + next chord preview.
import { h, button, injectStyle } from './_ui.js';
import { resolveVoicing } from '../music/voicings.js';
import { voicingMidis } from '../music/theory.js';
import { chordDiagram } from '../ui/diagram.js';
import { createMetronome, backbeatPattern } from '../audio/metronome.js';

const BEATS_PER_BAR = 4;

/** Split a voicing into a low bass note and keys-range comp notes. */
export function backingNotes(midis) {
  const sorted = [...midis].sort((a, b) => a - b);
  let bass = sorted[0];
  while (bass >= 52) bass -= 12;
  const keys = sorted.slice(1).map((m) => {
    while (m < 55) m += 12;
    while (m > 76) m -= 12;
    return m;
  });
  return { bass, keys: keys.length ? keys : [bass + 12] };
}

/** Comp hits for one beat of a chord: [{kind:'keys'|'bass', at: beats offset, vel}] */
export function compHits(beatInChord, per) {
  const hits = [];
  if (beatInChord === 0) hits.push({ kind: 'bass', at: 0, vel: 0.5 }, { kind: 'keys', at: 0, vel: 0.3 });
  if (per >= 4 && beatInChord === 2) hits.push({ kind: 'bass', at: 0, vel: 0.35 });
  if (per >= 4 && beatInChord === 1) hits.push({ kind: 'keys', at: 0.5, vel: 0.2 });
  return hits;
}

export function mount(container, spec, ctx) {
  injectStyle();
  const vs = spec.refs.map((r) => resolveVoicing(r));
  const n = vs.length;
  const per = spec.beatsPerChord || 4;
  const totalBeats = spec.bars ? spec.bars * BEATS_PER_BAR : Infinity;
  let bpm = spec.bpm || 80;
  let beat = 0;
  let demoToken = 0;
  let demoTimers = [];
  let metro = null;
  let dead = false;
  let backing = true;

  const root = h('div', 'stack');
  const nowSlot = h('div');
  const nextSlot = h('div');
  const now = h('div', 'ex-now');
  const nowWrap = h('div'); nowWrap.append(h('div', 'eyebrow', 'Now'), nowSlot);
  const nextWrap = h('div', 'muted'); nextWrap.append(h('div', 'eyebrow', 'Next'), nextSlot);
  now.append(nowWrap, nextWrap);
  const dots = h('div', 'ex-dots');
  const dotEls = Array.from({ length: BEATS_PER_BAR }, () => { const d = h('span', 'ex-dot'); dots.append(d); return d; });
  const tempo = h('span', 'mono', `${bpm} bpm`);
  const status = h('p', 'muted ex-fb', `${n} chords, ${per} beats each. Count it out loud.`);

  const playBtn = button('Play along', 'btn btn-primary', toggle);
  const demoBtn = button('Play demo', 'btn', demo);
  const slower = button('-5', 'btn btn-ghost', () => setTempo(bpm - 5));
  const faster = button('+5', 'btn btn-ghost', () => setTempo(bpm + 5));
  const backBtn = button('Backing: on', 'btn btn-ghost', () => {
    backing = !backing;
    backBtn.textContent = backing ? 'Backing: on' : 'Backing: off';
    backBtn.setAttribute('aria-pressed', String(backing));
    if (!backing) ctx.synth?.stopAll?.();
  });
  backBtn.setAttribute('aria-pressed', 'true');
  const doneBtn = button('I played it through', 'btn btn-ghost', () => { stopAll(); ctx.onComplete?.({ passed: true }); status.textContent = 'Marked done.'; });
  const r1 = h('div', 'row'); r1.append(playBtn, demoBtn);
  const r2 = h('div', 'row'); r2.append(slower, tempo, faster, backBtn);
  const hint = spec.backbeat ? h('p', 'muted small', 'Clicks on 2 and 4') : null;
  root.append(now, dots, r1, r2, ...(hint ? [hint] : []), status, doneBtn);
  container.append(root);
  show(0, -1);

  function diagram(v, width) { return chordDiagram(v, { width, rootPc: v.rootPc }); }

  function show(idx, b) {
    nowSlot.replaceChildren(diagram(vs[idx % n], 150));
    nowSlot.append(h('div', 'mono', vs[idx % n].name));
    nextSlot.replaceChildren(diagram(vs[(idx + 1) % n], 90));
    nextSlot.append(h('div', 'mono', vs[(idx + 1) % n].name));
    dotEls.forEach((d, k) => d.classList.toggle('on', b >= 0 && k === b % BEATS_PER_BAR));
  }

  function setTempo(v) {
    bpm = Math.max(40, Math.min(160, v));
    tempo.textContent = `${bpm} bpm`;
    metro?.setBpm(bpm);
  }

  async function toggle() {
    if (metro && metro.isRunning()) { stopAll(); return; }
    stopAll();
    try { await ctx.synth.unlock(); } catch (_) { /* continue */ }
    beat = 0;
    metro = createMetronome({
      bpm, beatsPerBar: BEATS_PER_BAR,
      pattern: spec.backbeat ? backbeatPattern(BEATS_PER_BAR) : undefined,
      onSchedule: (b, bar, when) => {
        if (dead || !backing || !ctx.synth?.playKeys) return;
        const k = bar * BEATS_PER_BAR + b;
        if (k >= totalBeats) return;
        const c = Math.floor(k / per) % n, inChord = k % per;
        const beatS = 60 / bpm;
        const { bass, keys } = backingNotes(voicingMidis(vs[c].frets));
        const now = ctx.synth.getContext?.()?.currentTime ?? 0;
        for (const hit of compHits(inChord, per)) {
          const delay = Math.max(0, when + hit.at * beatS - now);
          const dur = Math.max(0.4, (per - inChord) * beatS - 0.1);
          if (hit.kind === 'bass') ctx.synth.playBass(bass, { when: delay, dur: Math.min(dur, beatS * 2), velocity: hit.vel });
          else ctx.synth.playKeys(keys, { when: delay, dur: hit.at ? beatS * 0.8 : dur, velocity: hit.vel });
        }
      },
      onBeat: () => {
        if (dead) return;
        if (beat >= totalBeats) { stopAll(); status.textContent = 'That is the pass. Go again or mark it done.'; return; }
        show(Math.floor(beat / per), beat);
        beat += 1;
      },
    });
    metro.start();
    playBtn.textContent = 'Stop';
    status.textContent = 'Playing. Strum along on the click.';
  }

  function stopAll() {
    demoToken += 1;
    demoTimers.forEach(clearTimeout); demoTimers = [];
    if (metro) { metro.stop(); metro = null; }
    ctx.synth?.stopAll?.();
    playBtn.textContent = 'Play along';
    demoBtn.textContent = 'Play demo';
  }

  async function demo() {
    if (demoBtn.textContent === 'Stop demo') { stopAll(); return; }
    stopAll();
    const token = demoToken;
    try { await ctx.synth.unlock(); } catch (_) { return; }
    if (!ctx.synth.getContext?.()) return;
    demoBtn.textContent = 'Stop demo';
    // Audio is scheduled up front on the AudioContext clock (no per-beat timer drift);
    // timers below only move the visuals, aligned to the same schedule.
    const beatS = 60 / bpm, lead = 0.12, strum = 0.035;
    const passes = spec.bars ? Math.ceil(totalBeats / (per * n)) : 1;
    const hit = (c, at, up) => {
      const midis = voicingMidis(vs[c].frets);
      (up ? [...midis].reverse() : midis).forEach((m, i) => ctx.synth.playMidi(m, {
        when: at + i * strum, dur: up ? 1.2 : Math.max(1, per * beatS), velocity: (up ? 0.5 : 0.75) * (0.92 + 0.08 * ((i * 7) % 3) / 2),
      }));
    };
    let k = 0;
    const last = passes * n * per;
    for (let p = 0; p < passes; p++) {
      for (let c = 0; c < n; c++) {
        for (let b = 0; b < per; b++, k++) {
          const at = lead + k * beatS;
          if (b === 0) hit(c, at, false); else if (b === 2) hit(c, at, true);
          demoTimers.push(setTimeout(() => {
            if (token !== demoToken) return;
            if (b === 0) show(c, 0);
            dotEls.forEach((d, j) => d.classList.toggle('on', j === b % BEATS_PER_BAR));
          }, at * 1000));
        }
      }
    }
    demoTimers.push(setTimeout(() => {
      if (token === demoToken) { demoBtn.textContent = 'Play demo'; show(0, -1); }
    }, (lead + last * beatS) * 1000));
  }

  return { destroy() { dead = true; stopAll(); root.remove(); } };
}
