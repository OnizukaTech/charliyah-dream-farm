/* Charliyah's Dream Farm — gentle synthesized sounds (no audio files needed).
   Sound is OFF by default; everything is created lazily after a tap. */
(function () {
  'use strict';
  const DF = (window.DF = window.DF || {});
  const Au = (DF.Audio = {});
  let ctx = null, master = null, ambientTimer = null, padNodes = null;

  function ensure() {
    if (ctx) { if (ctx.state === 'suspended') ctx.resume().catch(() => {}); return ctx; }
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    try {
      ctx = new AC();
      master = ctx.createGain();
      master.gain.value = 0.35;
      master.connect(ctx.destination);
    } catch (e) { ctx = null; }
    return ctx;
  }
  const on = () => DF.state && DF.state.settings && DF.state.settings.sound;

  function tone(freq, start, dur, type, vol, slideTo) {
    const c = ctx, o = c.createOscillator(), g = c.createGain();
    o.type = type || 'sine';
    o.frequency.setValueAtTime(freq, c.currentTime + start);
    if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, c.currentTime + start + dur);
    g.gain.setValueAtTime(0.0001, c.currentTime + start);
    g.gain.exponentialRampToValueAtTime(vol || 0.3, c.currentTime + start + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + start + dur);
    o.connect(g); g.connect(master);
    o.start(c.currentTime + start); o.stop(c.currentTime + start + dur + 0.05);
  }

  const SFX = {
    tap:     () => tone(660, 0, 0.08, 'sine', 0.15),
    plant:   () => { tone(220, 0, 0.12, 'triangle', 0.3, 140); tone(520, 0.08, 0.1, 'sine', 0.15); },
    water:   () => { tone(900, 0, 0.12, 'sine', 0.15, 500); tone(1200, 0.07, 0.12, 'sine', 0.12, 700); tone(800, 0.15, 0.12, 'sine', 0.1, 450); },
    harvest: () => { [523, 659, 784].forEach((f, i) => tone(f, i * 0.07, 0.18, 'triangle', 0.22)); },
    coin:    () => { tone(988, 0, 0.08, 'square', 0.08); tone(1319, 0.07, 0.18, 'square', 0.08); },
    pet:     () => { tone(440, 0, 0.15, 'sine', 0.18, 660); },
    baa:     () => { tone(330, 0, 0.35, 'sawtooth', 0.06, 300); tone(336, 0, 0.35, 'triangle', 0.08, 296); },
    quest:   () => { [523, 659, 784, 1047].forEach((f, i) => tone(f, i * 0.1, 0.3, 'triangle', 0.22)); },
    level:   () => { [392, 523, 659, 784, 1047, 1319].forEach((f, i) => tone(f, i * 0.09, 0.35, 'triangle', 0.2)); },
    wrong:   () => { tone(330, 0, 0.18, 'sine', 0.15, 280); },
    right:   () => { tone(660, 0, 0.1, 'sine', 0.2); tone(880, 0.09, 0.18, 'sine', 0.2); },
    place:   () => { tone(300, 0, 0.08, 'triangle', 0.25); tone(450, 0.05, 0.08, 'triangle', 0.15); },
    buzz:    () => { tone(180, 0, 0.25, 'sawtooth', 0.04, 220); },
    page:    () => { tone(1500, 0, 0.06, 'sine', 0.05, 900); }
  };
  Au.play = (name) => {
    if (!on()) return;
    if (!ensure()) return;
    try { (SFX[name] || SFX.tap)(); } catch (e) { /* never let audio break the game */ }
  };

  /* Ambient: a very soft pad + occasional bird chirps */
  function chirp() {
    if (!ctx) return;
    const base = 1800 + Math.random() * 1200;
    for (let i = 0; i < 2 + Math.floor(Math.random() * 3); i++) tone(base, i * 0.12, 0.08, 'sine', 0.04, base * 1.3);
  }
  Au.setAmbient = (enabled) => {
    if (enabled && on() && ensure()) {
      if (padNodes) return;
      const g = ctx.createGain(); g.gain.value = 0.0001; g.connect(master);
      g.gain.exponentialRampToValueAtTime(0.035, ctx.currentTime + 2);
      const os = [196, 247, 294].map(f => { const o = ctx.createOscillator(); o.type = 'sine'; o.frequency.value = f; o.connect(g); o.start(); return o; });
      padNodes = { g, os };
      ambientTimer = setInterval(() => { if (Math.random() < 0.5) chirp(); }, 4000);
    } else if (padNodes) {
      try { padNodes.g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.6); const n = padNodes; setTimeout(() => n.os.forEach(o => o.stop()), 800); } catch (e) { /* ignore */ }
      padNodes = null; clearInterval(ambientTimer); ambientTimer = null;
    }
  };
  Au.unlock = () => { if (on()) ensure(); };
})();
