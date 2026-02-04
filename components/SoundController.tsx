import React, { useEffect, useState } from 'react';

interface SoundControllerProps {
  playBgMusic?: boolean;
}

// --- SYNTHESIZER ENGINE (Stranger Things Style) --- //
class CinematicSynth {
  ctx: AudioContext | null = null;
  bgOscillators: OscillatorNode[] = [];
  bgGain: GainNode | null = null;
  masterGain: GainNode | null = null;

  constructor() {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) {
      this.ctx = new AudioContextClass();
      this.masterGain = this.ctx.createGain();
      this.masterGain.connect(this.ctx.destination);
      this.masterGain.gain.value = 0.5; // Global volume
    }
  }

  ensureContext() {
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // 1. CLICK: Short, crisp hi-tech blip
  playClick() {
    if (!this.ctx) return;
    this.ensureContext();
    
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.connect(gain);
    gain.connect(this.masterGain!);

    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(100, this.ctx.currentTime + 0.1);
    
    gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.1);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.1);
  }

  // 2. CORRECT: 80s Synth Arpeggio (C Major 7)
  playCorrect() {
    if (!this.ctx) return;
    this.ensureContext();

    const notes = [523.25, 659.25, 783.99, 987.77]; // C5, E5, G5, B5
    const now = this.ctx.currentTime;

    notes.forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = 'triangle';
      osc.frequency.value = freq;
      
      osc.connect(gain);
      gain.connect(this.masterGain!);
      
      const startTime = now + (i * 0.08);
      
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.1, startTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.4);
      
      osc.start(startTime);
      osc.stop(startTime + 0.4);
    });
  }

  // 3. WRONG: Harsh "Upside Down" Glitch Bass
  playWrong() {
    if (!this.ctx) return;
    this.ensureContext();
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const distortion = this.ctx.createWaveShaper();

    // Create distortion curve
    const curve = new Float32Array(44100);
    for (let i = 0; i < 44100; i++) {
        const x = (i * 2) / 44100 - 1;
        curve[i] = ((3 + 20) * x * 20 * (Math.PI / 180)) / (Math.PI + 20 * Math.abs(x));
    }
    distortion.curve = curve;

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(100, now);
    osc.frequency.linearRampToValueAtTime(40, now + 0.5); // Pitch drop

    osc.connect(distortion);
    distortion.connect(gain);
    gain.connect(this.masterGain!);

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

    osc.start(now);
    osc.stop(now + 0.5);
  }

  // 4. EPIC WIN: Cinematic Fanfare + Arpeggio + Bass Drop
  playWin() {
    if (!this.ctx) return;
    this.ensureContext();
    const now = this.ctx.currentTime;

    // A. The Impact (Deep Bass Drop)
    const kickOsc = this.ctx.createOscillator();
    const kickGain = this.ctx.createGain();
    kickOsc.frequency.setValueAtTime(150, now);
    kickOsc.frequency.exponentialRampToValueAtTime(0.01, now + 0.5);
    kickGain.gain.setValueAtTime(0.8, now);
    kickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
    kickOsc.connect(kickGain);
    kickGain.connect(this.masterGain!);
    kickOsc.start(now);
    kickOsc.stop(now + 0.5);

    // B. The Fanfare (Major Chord Stack - C Major Add9)
    // C4, E4, G4, B4, D5
    const chordFreqs = [261.63, 329.63, 392.00, 493.88, 587.33]; 

    chordFreqs.forEach((f, i) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        
        // Detuned Sawtooth for "Brass" feel
        osc.type = 'sawtooth'; 
        osc.frequency.value = f;
        osc.detune.value = (Math.random() * 10) - 5; // Slight detune for thickness

        const filter = this.ctx!.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(400, now);
        filter.frequency.exponentialRampToValueAtTime(5000, now + 0.5); // Wah effect

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain!);

        // Envelope
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.15, now + 0.1 + (i*0.05)); // Staggered entry
        gain.gain.setValueAtTime(0.15, now + 2); // Sustain
        gain.gain.exponentialRampToValueAtTime(0.001, now + 5); // Long Fade out

        osc.start(now);
        osc.stop(now + 5);
    });

    // C. The Sparkle (High Speed Arpeggio)
    const arpNotes = [523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98]; // C5 -> G6
    let arpTime = now + 0.2;
    for(let k=0; k<12; k++) { // Play 12 notes
        const noteIndex = k % arpNotes.length;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        
        osc.type = 'triangle';
        osc.frequency.value = arpNotes[noteIndex];
        
        osc.connect(gain);
        gain.connect(this.masterGain!);
        
        gain.gain.setValueAtTime(0.05, arpTime);
        gain.gain.exponentialRampToValueAtTime(0.001, arpTime + 0.1);
        
        osc.start(arpTime);
        osc.stop(arpTime + 0.1);
        
        arpTime += 0.08; // Speed of arpeggio
    }
  }

  // 5. AMBIENCE: Dark Analog Drone (Stranger Things Vibe)
  startAmbience() {
    if (!this.ctx || this.bgOscillators.length > 0) return;
    this.ensureContext();

    this.bgGain = this.ctx.createGain();
    this.bgGain.connect(this.masterGain!);
    this.bgGain.gain.setValueAtTime(0, this.ctx.currentTime);
    this.bgGain.gain.linearRampToValueAtTime(0.15, this.ctx.currentTime + 2); // Fade in

    // Two oscillators slightly detuned for chorus effect
    const freq = 65.41; // C2 (Deep low note)
    
    const osc1 = this.ctx.createOscillator();
    osc1.type = 'sawtooth';
    osc1.frequency.value = freq;

    const osc2 = this.ctx.createOscillator();
    osc2.type = 'sawtooth';
    osc2.frequency.value = freq - 0.5; // Detuned

    // Lowpass filter to make it dark and muddy
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 180;
    
    // Connect LFO to filter for breathing effect
    const lfo = this.ctx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.value = 0.2; // Very slow pulse
    const lfoGain = this.ctx.createGain();
    lfoGain.gain.value = 50; // Filter modulation depth

    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);
    lfo.start();

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(this.bgGain);

    osc1.start();
    osc2.start();

    this.bgOscillators = [osc1, osc2, lfo];
  }

  stopAmbience() {
    if (!this.bgGain || !this.ctx) return;
    
    const now = this.ctx.currentTime;
    this.bgGain.gain.cancelScheduledValues(now);
    this.bgGain.gain.setValueAtTime(this.bgGain.gain.value, now);
    this.bgGain.gain.linearRampToValueAtTime(0, now + 1); // Fade out

    setTimeout(() => {
        this.bgOscillators.forEach(osc => {
            try { osc.stop(); } catch(e) {}
        });
        this.bgOscillators = [];
    }, 1000);
  }
}

// Singleton Instance
const synth = new CinematicSynth();

// Global export for use in other components
export const playSound = (type: 'click' | 'correct' | 'wrong' | 'win') => {
  try {
    if (type === 'click') synth.playClick();
    if (type === 'correct') synth.playCorrect();
    if (type === 'wrong') synth.playWrong();
    if (type === 'win') synth.playWin();

    // Trigger haptics alongside sound
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
        if (type === 'click') navigator.vibrate(10);
        if (type === 'correct') navigator.vibrate([50, 50, 50]);
        if (type === 'wrong') navigator.vibrate([300]);
        if (type === 'win') navigator.vibrate([100, 50, 100, 50, 100]); // Long vibration for win
    }
  } catch (e) {
    console.warn("Audio synthesis failed", e);
  }
};

const SoundController: React.FC<SoundControllerProps> = ({ playBgMusic = false }) => {
  const [hasInteracted, setHasInteracted] = useState(false);

  // Initialize Interaction Listener
  useEffect(() => {
    const unlockAudio = () => {
        setHasInteracted(true);
        synth.ensureContext();
        window.removeEventListener('click', unlockAudio);
        window.removeEventListener('touchstart', unlockAudio);
        window.removeEventListener('keydown', unlockAudio);
    };

    window.addEventListener('click', unlockAudio);
    window.addEventListener('touchstart', unlockAudio);
    window.addEventListener('keydown', unlockAudio);

    return () => {
        window.removeEventListener('click', unlockAudio);
        window.removeEventListener('touchstart', unlockAudio);
        window.removeEventListener('keydown', unlockAudio);
    };
  }, []);

  // Manage Background Music
  useEffect(() => {
    // Assuming sound is always "on" internally since the button is gone
    if (playBgMusic && hasInteracted) {
        synth.startAmbience();
    } else {
        synth.stopAmbience();
    }
  }, [playBgMusic, hasInteracted]);

  // Logic remains, but visual button is removed
  return null;
};

export default SoundController;