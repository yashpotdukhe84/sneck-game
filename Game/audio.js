/* =========================================================
   SNAKE & SNACK ARCADE - WEB AUDIO ENGINE
   100% Pure Procedural Synthesizer (Zero External Assets)
   Retro 8-Bit Chiptune / Modern Synth Arcade Sound Effects
   ========================================================= */

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.soundEnabled = true;
    this.musicEnabled = false;
    this.musicInterval = null;
    this.musicStep = 0;
    this.masterGain = null;
  }

  init() {
    if (this.ctx) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.3, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    } catch (e) {
      console.warn("Web Audio API not supported", e);
    }
  }

  ensureContext() {
    this.init();
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Play a simple synthesized tone
  playTone(freq, type = 'sine', duration = 0.1, startVol = 0.4, endVol = 0.01) {
    if (!this.soundEnabled || !this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime;

      osc.type = type;
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(startVol, now);
      gain.gain.exponentialRampToValueAtTime(Math.max(endVol, 0.0001), now + duration);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + duration);
    } catch (e) {
      // Audio errors safely swallowed
    }
  }

  // Munch / Eat regular snack sound
  playEat(snackType = 'normal') {
    if (!this.soundEnabled) return;
    this.ensureContext();
    const now = this.ctx.currentTime;

    if (snackType === 'super' || snackType === 'donut') {
      // Sparkling double chime
      this.playTone(523.25, 'triangle', 0.08, 0.35, 0.01);
      setTimeout(() => this.playTone(659.25, 'triangle', 0.1, 0.4, 0.01), 60);
      setTimeout(() => this.playTone(783.99, 'sine', 0.14, 0.35, 0.01), 120);
    } else if (snackType === 'gem') {
      // High sparkle
      [880, 1174, 1396, 1760].forEach((freq, idx) => {
        setTimeout(() => this.playTone(freq, 'sine', 0.09, 0.3, 0.01), idx * 40);
      });
    } else {
      // Crisp retro snack munch
      try {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.exponentialRampToValueAtTime(680, now + 0.09);

        gain.gain.setValueAtTime(0.4, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.09);

        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(now);
        osc.stop(now + 0.09);
      } catch (err) {}
    }
  }

  // Power-up collected fanfare
  playPowerup() {
    if (!this.soundEnabled) return;
    this.ensureContext();
    const notes = [440, 554.37, 659.25, 880];
    notes.forEach((freq, index) => {
      setTimeout(() => {
        this.playTone(freq, 'square', 0.12, 0.25, 0.01);
      }, index * 60);
    });
  }

  // Combo Sound (pitch increases with multiplier)
  playCombo(mult = 2) {
    if (!this.soundEnabled) return;
    this.ensureContext();
    const baseFreq = 440 + Math.min(mult, 8) * 90;
    this.playTone(baseFreq, 'sine', 0.12, 0.4, 0.01);
    setTimeout(() => {
      this.playTone(baseFreq * 1.25, 'sine', 0.15, 0.4, 0.01);
    }, 70);
  }

  // Game over crash
  playGameOver() {
    if (!this.soundEnabled) return;
    this.ensureContext();
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(280, now);
      osc.frequency.exponentialRampToValueAtTime(60, now + 0.5);

      gain.gain.setValueAtTime(0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.5);
    } catch (e) {}
  }

  // Button click blip
  playClick() {
    if (!this.soundEnabled) return;
    this.ensureContext();
    this.playTone(600, 'sine', 0.04, 0.2, 0.01);
  }

  // New High Score fanfare
  playHighScore() {
    if (!this.soundEnabled) return;
    this.ensureContext();
    const notes = [523.25, 659.25, 783.99, 1046.50];
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        this.playTone(freq, 'triangle', 0.22, 0.35, 0.01);
      }, idx * 110);
    });
  }

  // Retro Synth BGM Generator
  startMusic() {
    if (!this.musicEnabled) return;
    this.ensureContext();
    if (this.musicInterval) clearInterval(this.musicInterval);

    // 8-step bassline pattern
    const bassline = [110, 110, 130.81, 110, 146.83, 110, 164.81, 146.83];
    const arpeggio = [220, 261.63, 329.63, 440, 329.63, 261.63, 220, 329.63];

    this.musicStep = 0;
    this.musicInterval = setInterval(() => {
      if (!this.musicEnabled || !this.ctx) return;
      try {
        const now = this.ctx.currentTime;
        const bFreq = bassline[this.musicStep % bassline.length];
        const aFreq = arpeggio[(this.musicStep * 2) % arpeggio.length];

        // Bass Note
        const bOsc = this.ctx.createOscillator();
        const bGain = this.ctx.createGain();
        bOsc.type = 'triangle';
        bOsc.frequency.setValueAtTime(bFreq, now);
        bGain.gain.setValueAtTime(0.12, now);
        bGain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
        bOsc.connect(bGain);
        bGain.connect(this.masterGain);
        bOsc.start(now);
        bOsc.stop(now + 0.18);

        // Hi-Hat / Synth Blip on every step
        const aOsc = this.ctx.createOscillator();
        const aGain = this.ctx.createGain();
        aOsc.type = 'sine';
        aOsc.frequency.setValueAtTime(aFreq, now);
        aGain.gain.setValueAtTime(0.04, now);
        aGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.1);
        aOsc.connect(aGain);
        aGain.connect(this.masterGain);
        aOsc.start(now);
        aOsc.stop(now + 0.1);

        this.musicStep++;
      } catch (e) {}
    }, 200); // 150 BPM 8th notes
  }

  stopMusic() {
    if (this.musicInterval) {
      clearInterval(this.musicInterval);
      this.musicInterval = null;
    }
  }

  toggleSound() {
    this.soundEnabled = !this.soundEnabled;
    return this.soundEnabled;
  }

  toggleMusic() {
    this.musicEnabled = !this.musicEnabled;
    if (this.musicEnabled) {
      this.startMusic();
    } else {
      this.stopMusic();
    }
    return this.musicEnabled;
  }
}

// Global Sound Instance
const sound = new SoundEngine();
