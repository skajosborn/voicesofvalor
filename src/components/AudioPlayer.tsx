import React, { useState, useEffect, useCallback } from 'react';
import * as Slider from '@radix-ui/react-slider';
import * as Tooltip from '@radix-ui/react-tooltip';
import { Play, Pause, Volume2, VolumeX, RotateCcw, FastForward, Rewind, Music } from 'lucide-react';
import { SongTrackData } from '../types/veteran';
import { globalAudioEngine } from '../services/audioEngine';
import { AudioVisualizer } from './AudioVisualizer';

interface AudioPlayerProps {
  song: SongTrackData;
  autoPlay?: boolean;
  onTimeChange?: (time: number) => void;
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  song,
  autoPlay = true,
  onTimeChange,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(song.durationSec);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [userInteracted, setUserInteracted] = useState(false);

  // Initialize and load track
  useEffect(() => {
    setDuration(song.durationSec);
    setCurrentTime(0);

    globalAudioEngine.loadAndPlay(song, autoPlay);
    setIsPlaying(autoPlay);

    globalAudioEngine.setTimeUpdateCallback((time, playing) => {
      setCurrentTime(time);
      setIsPlaying(playing);
      if (onTimeChange) {
        onTimeChange(time);
      }
    });

    return () => {
      globalAudioEngine.stop();
    };
  }, [song, autoPlay, onTimeChange]);

  const togglePlay = useCallback(() => {
    setUserInteracted(true);
    if (isPlaying) {
      globalAudioEngine.pause();
    } else {
      globalAudioEngine.play();
    }
  }, [isPlaying]);

  const handleSeek = (values: number[]) => {
    const target = values[0];
    setCurrentTime(target);
    globalAudioEngine.seek(target);
    if (onTimeChange) {
      onTimeChange(target);
    }
  };

  const handleSkip = (seconds: number) => {
    const target = Math.max(0, Math.min(currentTime + seconds, duration));
    handleSeek([target]);
  };

  const handleRestart = () => {
    handleSeek([0]);
    if (!isPlaying) {
      globalAudioEngine.play();
    }
  };

  const handleVolumeChange = (values: number[]) => {
    const newVol = values[0];
    setVolume(newVol);
    globalAudioEngine.setVolume(newVol);
    if (newVol > 0 && isMuted) {
      setIsMuted(false);
    }
  };

  const toggleMute = () => {
    const muted = globalAudioEngine.toggleMute();
    setIsMuted(muted);
  };

  return (
    <Tooltip.Provider delayDuration={200}>
      <div className="glass-panel p-5 rounded-2xl border border-valor-gold/25 shadow-2xl relative overflow-hidden">
        {/* Ambient background glow */}
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-valor-gold/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header with song title & musical meta */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-valor-gold/15 border border-valor-gold/30 flex items-center justify-center text-valor-gold">
              <Music className="w-5 h-5 animate-pulse-subtle" />
            </div>
            <div>
              <h3 className="text-lg font-serif font-bold text-white tracking-wide">
                {song.title}
              </h3>
              <p className="text-xs text-valor-textMuted flex items-center gap-2">
                <span>{song.composer}</span>
                <span>•</span>
                <span className="text-valor-gold/80 font-mono">{song.genre}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-valor-slate/80 bg-black/30 px-3 py-1.5 rounded-md border border-white/5">
            <span>Key of {song.scaleRoot} {song.scaleType}</span>
            <span>|</span>
            <span>{song.tempoBpm} BPM</span>
          </div>
        </div>

        {/* Visualizer */}
        <div className="mb-4">
          <AudioVisualizer isPlaying={isPlaying} accentColor="#d4af37" />
        </div>

        {/* Time and Scrub Slider */}
        <div className="space-y-1.5 mb-4">
          <Slider.Root
            className="relative flex items-center select-none touch-none w-full h-5 cursor-pointer group"
            value={[currentTime]}
            max={duration || 180}
            step={0.5}
            onValueChange={handleSeek}
            aria-label="Track playback position"
          >
            <Slider.Track className="bg-slate-800 relative grow rounded-full h-1.5 overflow-hidden">
              <Slider.Range className="absolute bg-gradient-to-r from-valor-goldMuted to-valor-gold h-full rounded-full" />
            </Slider.Track>
            <Slider.Thumb
              className="block w-4 h-4 bg-valor-goldLight shadow-md border-2 border-valor-gold rounded-full focus:outline-none focus:ring-2 focus:ring-valor-gold/50 transition-transform group-hover:scale-110"
              aria-label="Playback thumb"
            />
          </Slider.Root>

          <div className="flex justify-between text-xs font-mono text-valor-textMuted">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Player Controls Row */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Main playback buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Tooltip.Root>
              <Tooltip.Trigger asChild>
                <button
                  onClick={handleRestart}
                  className="p-2 text-valor-slate hover:text-valor-gold hover:bg-white/5 rounded-full transition-colors"
                  aria-label="Restart song"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </Tooltip.Trigger>
              <Tooltip.Portal>
                <Tooltip.Content className="bg-slate-900 text-xs text-white px-2.5 py-1 rounded shadow-lg border border-white/10 z-50">
                  Restart Track
                  <Tooltip.Arrow className="fill-slate-900" />
                </Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip.Root>

            <button
              onClick={() => handleSkip(-10)}
              className="p-2 text-valor-slate hover:text-white hover:bg-white/5 rounded-full transition-colors"
              aria-label="Rewind 10 seconds"
            >
              <Rewind className="w-4 h-4" />
            </button>

            <button
              onClick={togglePlay}
              className="w-12 h-12 rounded-full bg-gradient-to-br from-valor-gold to-valor-goldMuted text-slate-950 flex items-center justify-center font-bold shadow-lg shadow-valor-gold/20 hover:scale-105 active:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-valor-gold"
              aria-label={isPlaying ? 'Pause song' : 'Play song'}
            >
              {isPlaying ? (
                <Pause className="w-5 h-5 fill-current" />
              ) : (
                <Play className="w-5 h-5 fill-current translate-x-0.5" />
              )}
            </button>

            <button
              onClick={() => handleSkip(10)}
              className="p-2 text-valor-slate hover:text-white hover:bg-white/5 rounded-full transition-colors"
              aria-label="Forward 10 seconds"
            >
              <FastForward className="w-4 h-4" />
            </button>
          </div>

          {/* Volume and Audio status */}
          <div className="flex items-center gap-3">
            <button
              onClick={toggleMute}
              className="text-valor-slate hover:text-valor-gold transition-colors p-1"
              aria-label={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="w-5 h-5 text-red-400" />
              ) : (
                <Volume2 className="w-5 h-5" />
              )}
            </button>

            <div className="w-20 sm:w-24">
              <Slider.Root
                className="relative flex items-center select-none touch-none w-full h-5 cursor-pointer"
                value={[isMuted ? 0 : volume]}
                max={1}
                step={0.01}
                onValueChange={handleVolumeChange}
                aria-label="Audio volume"
              >
                <Slider.Track className="bg-slate-800 relative grow rounded-full h-1">
                  <Slider.Range className="absolute bg-valor-gold h-full rounded-full" />
                </Slider.Track>
                <Slider.Thumb
                  className="block w-3 h-3 bg-white rounded-full shadow focus:outline-none"
                  aria-label="Volume slider thumb"
                />
              </Slider.Root>
            </div>

            {/* Audio engine live indicator */}
            <div className="hidden md:flex items-center gap-1.5 text-[11px] font-mono text-emerald-400/90 bg-emerald-950/40 border border-emerald-500/20 px-2.5 py-1 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              <span>Synthesizing Audio</span>
            </div>
          </div>
        </div>

        {!userInteracted && !isPlaying && (
          <div className="mt-3 text-center text-xs text-valor-gold/90 bg-valor-gold/10 py-1 px-3 rounded-md border border-valor-gold/20">
            Click Play above to start the background memorial soundtrack
          </div>
        )}
      </div>
    </Tooltip.Provider>
  );
};
