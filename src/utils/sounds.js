let audioCtx;

export function ding() {
  try {
    audioCtx =
      audioCtx || new (window.AudioContext || window.webkitAudioContext)();
    const o = audioCtx.createOscillator(),
      g = audioCtx.createGain();
    o.type = "triangle";
    o.frequency.value = 900;
    g.gain.value = 0.001;
    o.connect(g);
    g.connect(audioCtx.destination);
    const t = audioCtx.currentTime;
    g.gain.exponentialRampToValueAtTime(0.12, t + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.22);
    o.start();
    o.stop(t + 0.25);
  } catch (e) {}
}

export function buzz() {
  try {
    audioCtx =
      audioCtx || new (window.AudioContext || window.webkitAudioContext)();
    const o = audioCtx.createOscillator(),
      g = audioCtx.createGain();
    o.type = "sawtooth";
    o.frequency.value = 180;
    g.gain.value = 0.001;
    o.connect(g);
    g.connect(audioCtx.destination);
    const t = audioCtx.currentTime;
    g.gain.exponentialRampToValueAtTime(0.12, t + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.38);
    o.start();
    o.stop(t + 0.4);
  } catch (e) {}
}
