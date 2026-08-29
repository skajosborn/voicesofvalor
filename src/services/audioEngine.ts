import { SongTrackData } from '../types/veteran';

// Note frequencies map (Hz)
const NOTE_FREQS: Record<string, number> = {
  'C2': 65.41, 'D2': 73.42, 'E2': 82.41, 'F2': 87.31, 'G2': 98.00, 'A2': 110.00, 'B2': 123.47,
  'C3': 130.81, 'D3': 146.83, 'E3': 164.81, 'F3': 174.61, 'G3': 196.00, 'A3': 220.00, 'B3': 246.94,
  'C4': 261.63, 'D4': 293.66, 'E4': 329.63, 'F4': 349.23, 'G4': 392.00, 'A4': 440.00, 'B4': 493.88,
  'C5': 523.25, 'D5': 587.33, 'E5': 659.25, 'F5': 698.46, 'G5': 783.99, 'A5': 880.00, 'B5': 987.77,
  'Bb2': 116.54, 'Bb3': 233.08, 'Bb4': 466.16,
  'F#3': 185.00, 'F#4': 369.99, 'F#5': 739.99,
  'Eb3': 155.56, 'Eb4': 311.13, 'Eb5': 622.25,
  'Ab3': 207.65, 'Ab4': 415.30, 'Ab5': 830.61,
  'C#4': 277.18, 'C#5': 554.37,
};

// Chord note breakdown for arpeggios
const CHORD_NOTES: Record<string, string[]> = {
  'Dm': ['D3', 'F3', 'A3', 'D4', 'F4', 'A4'],
  'Bb': ['Bb2', 'D3', 'F3', 'Bb3', 'D4', 'F4'],
  'F': ['F2', 'A2', 'C3', 'F3', 'A3', 'C4'],
  'C': ['C3', 'E3', 'G3', 'C4', 'E4', 'G4'],
  'A': ['A2', 'C#4', 'E3', 'A3', 'C#5', 'E4'],
  'F#m': ['F#3', 'A3', 'C#4', 'F#4', 'A4'],
  'D': ['D3', 'F#3', 'A3', 'D4', 'F#4'],
  'E': ['E2', 'G#3' in NOTE_FREQS ? 'G#3' : 'G3', 'B3', 'E4', 'B4'],
  'Em': ['E2', 'G3', 'B3', 'E4', 'G4', 'B4'],
  'G': ['G2', 'B2', 'D3', 'G3', 'B3', 'D4'],
  'Am': ['A2', 'C3', 'E3', 'A3', 'C4', 'E4'],
  'Gm': ['G2', 'Bb2', 'D3', 'G3', 'Bb3', 'D4'],
  'Eb': ['Eb3', 'G3', 'Bb3', 'Eb4', 'G4'],
};

export class AudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private analyser: AnalyserNode | null = null;
  private timerId: number | null = null;
  private currentTrack: SongTrackData | null = null;
  private isPlaying = false;
  private isMuted = false;
  private volume = 0.75;
  private playbackTime = 0;
  private duration = 180;
  private stepIndex = 0;
  private onTimeUpdate?: (time: number, isPlaying: boolean) => void;
  private activeOscillators: OscillatorNode[] = [];
  
  // HTML5 Audio element for MP3 playback
  private audioElement: HTMLAudioElement | null = null;
  private mediaSourceNode: MediaElementAudioSourceNode | null = null;

  constructor() {
    // Lazy initialization on user interaction
  }

  private initContext(): AudioContext {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioContextClass();
      
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.volume, this.ctx.currentTime);

      this.analyser = this.ctx.createAnalyser();
      this.analyser.fftSize = 512;
      this.analyser.smoothingTimeConstant = 0.85;

      this.masterGain.connect(this.analyser);
      this.analyser.connect(this.ctx.destination);
    }

    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }

    return this.ctx;
  }

  public getAnalyser(): AnalyserNode | null {
    return this.analyser;
  }

  public setTimeUpdateCallback(cb: (time: number, isPlaying: boolean) => void) {
    this.onTimeUpdate = cb;
  }

  public loadAndPlay(track: SongTrackData, autoPlay = true) {
    this.stop();
    this.currentTrack = track;
    this.duration = track.durationSec;
    this.playbackTime = 0;
    this.stepIndex = 0;

    if (track.audioUrl) {
      this.initAudioElement(track.audioUrl);
    }

    if (autoPlay) {
      this.play();
    }
  }

  private initAudioElement(url: string) {
    if (this.audioElement) {
      this.audioElement.pause();
      this.audioElement.src = '';
    }

    this.audioElement = new Audio();
    this.audioElement.src = url;
    this.audioElement.preload = 'auto';
    this.audioElement.volume = this.isMuted ? 0 : this.volume;

    const ctx = this.initContext();
    try {
      if (ctx.createMediaElementSource) {
        this.mediaSourceNode = ctx.createMediaElementSource(this.audioElement);
        if (this.masterGain) {
          this.mediaSourceNode.connect(this.masterGain);
        }
      }
    } catch {
      // Direct playback fallback if MediaElementSource already attached
    }

    this.audioElement.addEventListener('timeupdate', () => {
      if (this.audioElement && this.currentTrack?.audioUrl) {
        this.playbackTime = this.audioElement.currentTime;
        if (this.audioElement.duration && !isNaN(this.audioElement.duration)) {
          this.duration = this.audioElement.duration;
        }
        if (this.onTimeUpdate) {
          this.onTimeUpdate(this.playbackTime, this.isPlaying);
        }
      }
    });

    this.audioElement.addEventListener('ended', () => {
      this.playbackTime = 0;
      this.isPlaying = false;
      if (this.onTimeUpdate) {
        this.onTimeUpdate(0, false);
      }
    });
  }

  public play() {
    if (this.isPlaying) return;
    const ctx = this.initContext();
    this.isPlaying = true;

    if (this.currentTrack?.audioUrl && this.audioElement) {
      this.audioElement.play().catch(() => {});
    } else {
      // Start procedural synthesizer loop
      const stepIntervalMs = (60 / (this.currentTrack?.tempoBpm || 70)) * 500;
      
      this.timerId = window.setInterval(() => {
        if (!this.isPlaying || !this.currentTrack) return;

        this.playbackTime += stepIntervalMs / 1000;
        if (this.playbackTime >= this.duration) {
          this.playbackTime = 0;
          this.stepIndex = 0;
        }

        this.playProceduralStep(ctx, this.currentTrack, this.stepIndex);
        this.stepIndex++;

        if (this.onTimeUpdate) {
          this.onTimeUpdate(this.playbackTime, this.isPlaying);
        }
      }, stepIntervalMs);
    }

    if (this.onTimeUpdate) {
      this.onTimeUpdate(this.playbackTime, this.isPlaying);
    }
  }

  public pause() {
    this.isPlaying = false;
    if (this.timerId !== null) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
    if (this.audioElement) {
      this.audioElement.pause();
    }
    this.stopActiveOscillators();
    if (this.onTimeUpdate) {
      this.onTimeUpdate(this.playbackTime, this.isPlaying);
    }
  }

  public stop() {
    this.pause();
    this.playbackTime = 0;
    this.stepIndex = 0;
    if (this.audioElement) {
      this.audioElement.currentTime = 0;
    }
    if (this.onTimeUpdate) {
      this.onTimeUpdate(0, false);
    }
  }

  public seek(seconds: number) {
    this.playbackTime = Math.max(0, Math.min(seconds, this.duration));
    if (this.audioElement && this.currentTrack?.audioUrl) {
      this.audioElement.currentTime = this.playbackTime;
    } else {
      const stepIntervalSec = (60 / (this.currentTrack?.tempoBpm || 70)) * 0.5;
      this.stepIndex = Math.floor(this.playbackTime / stepIntervalSec);
    }
    if (this.onTimeUpdate) {
      this.onTimeUpdate(this.playbackTime, this.isPlaying);
    }
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.audioElement) {
      this.audioElement.volume = this.isMuted ? 0 : this.volume;
    }
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(this.isMuted ? 0 : this.volume, this.ctx.currentTime, 0.05);
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.audioElement) {
      this.audioElement.volume = this.isMuted ? 0 : this.volume;
    }
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(this.isMuted ? 0 : this.volume, this.ctx.currentTime, 0.05);
    }
    return this.isMuted;
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public getVolume(): number {
    return this.volume;
  }

  public getCurrentTime(): number {
    return this.playbackTime;
  }

  public getDuration(): number {
    return this.duration;
  }

  private stopActiveOscillators() {
    this.activeOscillators.forEach((osc) => {
      try {
        osc.stop();
        osc.disconnect();
      } catch {
        // Ignored if already stopped
      }
    });
    this.activeOscillators = [];
  }

  private playProceduralStep(ctx: AudioContext, track: SongTrackData, step: number) {
    if (!this.masterGain) return;

    const chords = track.chordProgression;
    const chordIndex = Math.floor(step / 8) % chords.length;
    const currentChord = chords[chordIndex] || chords[0];
    const notesInChord = CHORD_NOTES[currentChord] || ['C3', 'G3', 'C4', 'E4'];

    const noteInArp = notesInChord[step % notesInChord.length];
    const freq = NOTE_FREQS[noteInArp] || 220;

    const now = ctx.currentTime;

    // 1. Root bass drone note on every 8th step (measure start)
    if (step % 8 === 0) {
      const bassNote = notesInChord[0];
      const bassFreq = (NOTE_FREQS[bassNote] || 110) * 0.5; // lower octave
      this.triggerTone(ctx, bassFreq, 'triangle', now, 2.5, 0.28, 600);
    }

    // 2. Harmonic Pad / Strings layer
    if (step % 4 === 0) {
      const padNote = notesInChord[1] || notesInChord[0];
      const padFreq = NOTE_FREQS[padNote] || 220;
      this.triggerTone(ctx, padFreq, 'sine', now, 1.8, 0.15, 1200);
    }

    // 3. Main melodic pluck / acoustic guitar tone
    const pluckStyle = track.synthStyle === 'piano-elegy' ? 'sine' : track.synthStyle === 'brass-chorale' ? 'sawtooth' : 'triangle';
    const decayTime = track.synthStyle === 'ambient-strings' ? 1.2 : 0.65;
    this.triggerTone(ctx, freq, pluckStyle, now, decayTime, 0.22, 2400);

    // 4. Ambient shimmer sparkle note on occasional beat
    if (step % 6 === 3) {
      const highNote = notesInChord[notesInChord.length - 1];
      const highFreq = (NOTE_FREQS[highNote] || 440) * 1.5;
      this.triggerTone(ctx, highFreq, 'sine', now, 0.8, 0.08, 4000);
    }
  }

  private triggerTone(
    ctx: AudioContext,
    freq: number,
    type: OscillatorType,
    time: number,
    duration: number,
    gainLevel: number,
    filterCutoff = 2000
  ) {
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, time);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(filterCutoff, time);

      // Envelope: Attack, Decay, Release
      gain.gain.setValueAtTime(0.001, time);
      gain.gain.exponentialRampToValueAtTime(gainLevel, time + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);

      osc.connect(filter);
      filter.connect(gain);
      if (this.masterGain) {
        gain.connect(this.masterGain);
      }

      osc.start(time);
      osc.stop(time + duration + 0.05);

      this.activeOscillators.push(osc);

      // Clean up reference after note finish
      setTimeout(() => {
        const index = this.activeOscillators.indexOf(osc);
        if (index > -1) {
          this.activeOscillators.splice(index, 1);
        }
      }, (duration + 0.1) * 1000);
    } catch {
      // Audio node scheduling guard
    }
  }
}

// Global shared singleton audio engine instance
export const globalAudioEngine = new AudioEngine();
