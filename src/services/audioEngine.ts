import { SongTrackData } from '../types/veteran';

export class AudioEngine {
  private currentTrack: SongTrackData | null = null;
  private isPlaying = false;
  private isMuted = false;
  private volume = 0.8;
  private playbackTime = 0;
  private duration = 180;
  private onTimeUpdate?: (time: number, isPlaying: boolean) => void;
  
  // HTML5 Audio element for MP3 files
  private audioElement: HTMLAudioElement | null = null;

  constructor() {
    // Lazy initialization
  }

  public getAnalyser(): AnalyserNode | null {
    return null;
  }

  public setTimeUpdateCallback(cb: (time: number, isPlaying: boolean) => void) {
    this.onTimeUpdate = cb;
  }

  public loadAndPlay(track: SongTrackData, autoPlay = true) {
    this.stop();
    this.currentTrack = track;
    this.duration = track.durationSec || 180;
    this.playbackTime = 0;

    if (track.audioUrl) {
      this.initAudioElement(track.audioUrl, autoPlay);
    }
  }

  private initAudioElement(url: string, autoPlay: boolean) {
    if (this.audioElement) {
      this.audioElement.pause();
      this.audioElement.removeAttribute('src');
      this.audioElement.load();
      this.audioElement = null;
    }

    const audio = new Audio();
    audio.src = url;
    audio.preload = 'auto';
    audio.volume = this.isMuted ? 0 : this.volume;
    this.audioElement = audio;

    audio.addEventListener('loadedmetadata', () => {
      if (audio.duration && !isNaN(audio.duration) && isFinite(audio.duration)) {
        this.duration = audio.duration;
      }
    });

    audio.addEventListener('timeupdate', () => {
      if (this.currentTrack?.audioUrl && this.audioElement === audio) {
        this.playbackTime = audio.currentTime;
        if (audio.duration && !isNaN(audio.duration) && isFinite(audio.duration)) {
          this.duration = audio.duration;
        }
        if (this.onTimeUpdate) {
          this.onTimeUpdate(this.playbackTime, this.isPlaying);
        }
      }
    });

    audio.addEventListener('ended', () => {
      if (this.audioElement === audio) {
        this.playbackTime = 0;
        this.isPlaying = false;
        if (this.onTimeUpdate) {
          this.onTimeUpdate(0, false);
        }
      }
    });

    audio.addEventListener('play', () => {
      if (this.audioElement === audio) {
        this.isPlaying = true;
        if (this.onTimeUpdate) {
          this.onTimeUpdate(this.playbackTime, true);
        }
      }
    });

    audio.addEventListener('pause', () => {
      if (this.audioElement === audio) {
        this.isPlaying = false;
        if (this.onTimeUpdate) {
          this.onTimeUpdate(this.playbackTime, false);
        }
      }
    });

    if (autoPlay) {
      this.play();
    }
  }

  public play() {
    if (!this.currentTrack?.audioUrl || !this.audioElement) {
      return;
    }

    this.isPlaying = true;
    this.audioElement.volume = this.isMuted ? 0 : this.volume;
    const playPromise = this.audioElement.play();
    if (playPromise !== undefined) {
      playPromise.catch((err) => {
        console.warn('Audio play request handled:', err);
      });
    }

    if (this.onTimeUpdate) {
      this.onTimeUpdate(this.playbackTime, this.isPlaying);
    }
  }

  public pause() {
    this.isPlaying = false;
    if (this.audioElement) {
      this.audioElement.pause();
    }
    if (this.onTimeUpdate) {
      this.onTimeUpdate(this.playbackTime, this.isPlaying);
    }
  }

  public stop() {
    this.isPlaying = false;
    if (this.audioElement) {
      this.audioElement.pause();
      this.audioElement.currentTime = 0;
    }
    this.playbackTime = 0;
    if (this.onTimeUpdate) {
      this.onTimeUpdate(0, false);
    }
  }

  public seek(seconds: number) {
    this.playbackTime = Math.max(0, Math.min(seconds, this.duration));
    if (this.audioElement && this.currentTrack?.audioUrl) {
      this.audioElement.currentTime = this.playbackTime;
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
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.audioElement) {
      this.audioElement.volume = this.isMuted ? 0 : this.volume;
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
}

// Global shared singleton audio engine instance
export const globalAudioEngine = new AudioEngine();
