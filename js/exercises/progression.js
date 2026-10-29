// progression: play-along. Metronome + current chord highlighted + next chord preview.
import { h, button, injectStyle } from './_ui.js';
import { resolveVoicing } from '../music/voicings.js';
import { voicingMidis } from '../music/theory.js';
import { chordDiagram } from '../ui/diagram.js';
import { createMetronome, backbeatPattern } from '../audio/metronome.js';

const BEATS_PER_BAR = 4;

export function mount(container, spec, ctx) {
  injectStyle();
  const vs = spec.refs.map((r) => resolveVoicing(r));
  const n = vs.length;
  const per = spec.beatsPerChord || 4;
  const totalBeats = spec.bars ? spec.bars * BEATS_PER_BAR : Infinity;
  let bpm = spec.bpm || 80;
  let beat = 0;
  let demoToken = 0;
  let metro = null;
  let dead = false;

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
  const doneBtn = button('I played it through', 'btn btn-ghost', () => { stopAll(); ctx.onComplete?.({ passed: true }); status.textContent = 'Marked done.'; });
  const r1 = h('div', 'row'); r1.append(playBtn, demoBtn);
  const r2 = h('div', 'row'); r2.append(slower, tempo, faster);
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
    demoBtn.textContent = 'Stop demo';
    const beatMs = 60000 / bpm;
    const passes = spec.bars ? Math.ceil(totalBeats / (per * n)) : 1;
    for (let p = 0; p < passes && token === demoToken; p++) {
      for (let c = 0; c < n && token === demoToken; c++) {
        show(c, 0);
        for (let b = 0; b < per && token === demoToken; b++) {
          dotEls.forEach((d, k) => d.classList.toggle('on', k === b % BEATS_PER_BAR));
          if (b === 0) ctx.synth.playChord(voicingMidis(vs[c].frets), { dur: Math.max(1, per * beatMs / 1000) });
          else if (b === 2) ctx.synth.playChord(voicingMidis(vs[c].frets), { direction: 'up', velocity: 0.5, dur: 1.2 });
          await new Promise((r) => setTimeout(r, beatMs));
        }
      }
    }
    if (token === demoToken) { demoBtn.textContent = 'Play demo'; show(0, -1); }
  }

  return { destroy() { dead = true; stopAll(); root.remove(); } };
}
