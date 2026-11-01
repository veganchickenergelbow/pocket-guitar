// Dev-only: render the synth offline and report loudness/brightness. Load in the browser console:
//   const p = await import('/tools/synth-probe.js?' + Date.now()); await p.probe();
export async function probe(path = '/js/audio/synth.js') {
  const SR = 48000, LEN = 3;
  const real = globalThis.AudioContext;
  let off;
  globalThis.AudioContext = function () { off = new OfflineAudioContext(1, SR * LEN, SR); return off; };
  let synth;
  try { synth = await import(path + '?probe=' + Math.random()); await synth.unlock(); } finally { globalThis.AudioContext = real; }
  const C = [48, 52, 55, 60, 64], G = [43, 47, 50, 55, 59, 67];
  synth.playChord(C, { dur: 1.2 });
  synth.playChord(G, { dur: 1.2, velocity: 0.75 }).catch(() => {});
  await new Promise((r) => setTimeout(r, 0));
  // second chord one second later via playMidi
  G.forEach((m, i) => synth.playMidi(m, { when: 1.3 + i * 0.035, dur: 1.4, velocity: 0.75 }));
  const buf = await off.startRendering();
  const x = buf.getChannelData(0);
  let peak = 0, over = 0, e = 0, d = 0;
  for (let i = 0; i < x.length; i++) { const a = Math.abs(x[i]); if (a > peak) peak = a; if (a >= 1) over++; e += x[i] * x[i]; if (i) d += (x[i] - x[i - 1]) ** 2; }
  const centroid = (start) => { const N = 4096, s = Math.floor(start * SR); let num = 0, den = 0;
    for (let k = 1; k < N / 2; k += 3) { let re = 0, im = 0; for (let n = 0; n < N; n++) { const w = 0.5 - 0.5 * Math.cos(2 * Math.PI * n / N); const v = x[s + n] * w; const ph = 2 * Math.PI * k * n / N; re += v * Math.cos(ph); im -= v * Math.sin(ph); }
      const mag = Math.hypot(re, im); num += mag * k * SR / N; den += mag; } return Math.round(num / den); };
  return { peak: +peak.toFixed(3), clippedSamples: over, rms: +Math.sqrt(e / x.length).toFixed(4), brightness: +(Math.sqrt(d / e)).toFixed(4), centroidAttackHz: centroid(0.02), centroidRingHz: centroid(0.6) };
}
