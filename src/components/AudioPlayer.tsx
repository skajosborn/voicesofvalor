import React, { useState, useEffect, useCallback, useRef } from 'react';
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
  const [duration, setDuration] = useState(song.durationSec || 180);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);

  const onTimeChangeRef = useRef(onTimeChange);
  useEffect(() => {
    onTimeChangeRef.current = onTimeChange;
  }, [onTimeChange]);

  // Initialize and load track
  useEffect(() => {
    setDuration(song.durationSec || 180);
    setCurrentTime(0);

    globalAudioEngine.setTimeUpdateCallback((time, playing) => {
      setCurrentTime(time);
      setIsPlaying(playing);
      const curDur = globalAudioEngine.getDuration();
      if (curDur > 0) {
        setDuration(curDur);
      }
      if (onTimeChangeRef.current) {
        onTimeChangeRef.current(time);
      }
    });

    globalAudioEngine.loadAndPlay(song, autoPlay);
    setIsPlaying(autoPlay);

    return () => {
      globalAudioEngine.stop();
    };
  }, [song.title, song.audioUrl, autoPlay]);

  const togglePlay = useCallback(() => {
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
    if (onTimeChangeRef.current) {
      onTimeChangeRef.current(target);
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
            {song.audioUrl ? (
              <span className="text-amber-300 font-semibold">HQ Studio MP3 Track</span>
            ) : (
              <>
                <span>Key of {song.scaleRoot} {song.scaleType}</span>
                <span>|</span>
                <span>{song.tempoBpm} BPM</span>
              </>
            )}
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
            aria-label="Track progress slider"
          >
            <Slider.Track className="bg-slate-800 relative grow rounded-full h-1.5 overflow-hidden border border-white/5">
              <Slider.Range className="absolute bg-gradient-to-r from-amber-600 via-amber-400 to-amber-200 h-full rounded-full" />
            </Slider.Track>
            <Slider.Thumb
              className="block w-4 h-4 bg-amber-300 shadow-md border-2 border-slate-900 rounded-full hover:scale-125 focus:outline-none focus:ring-2 focus:ring-amber-400/50 transition-transform"
              aria-label="Current track position"
            />
          </Slider.Root>

          <div className="flex justify-between items-center text-[11px] font-mono text-valor-textMuted px-0.5">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Transport & Volume Controls */}
        <div className="flex items-center justify-between gap-4">
          {/* Main playback buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Tooltip.Root>
              <Tooltip.Trigger asChild>
                <button
                  onClick={handleRestart}
                  className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors focus:outline-none"
                  aria-label="Restart song"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </Tooltip.Trigger>
              <Tooltip.Portal>
                <Tooltip.Content className="px-2 py-1 bg-slate-900 text-xs text-slate-200 rounded border border-slate-700 shadow-lg">
                  Restart Track
                  <Tooltip.Arrow className="fill-slate-900" />
                </Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip.Root>

            <Tooltip.Root>
              <Tooltip.Trigger asChild>
                <button
                  onClick={() => handleSkip(-10)}
                  className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors focus:outline-none"
                  aria-label="Rewind 10 seconds"
                >
                  <Rewind className="w-4 h-4" />
                </button>
              </Tooltip.Trigger>
              <Tooltip.Portal>
                <Tooltip.Content className="px-2 py-1 bg-slate-900 text-xs text-slate-200 rounded border border-slate-700 shadow-lg">
                  -10s
                  <Tooltip.Arrow className="fill-slate-900" />
                </Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip.Root>

            <button
              onClick={togglePlay}
              className="w-12 h-12 rounded-full bg-gradient-to-tr from-amber-600 via-amber-500 to-amber-300 text-slate-950 flex items-center justify-center hover:scale-105 active:scale-95 shadow-lg shadow-amber-500/25 transition-transform focus:outline-none"
              aria-label={isPlaying ? 'Pause song' : 'Play song'}
            >
              {isPlaying ? (
                <Pause className="w-5 h-5 fill-slate-950" />
              ) : (
                <Play className="w-5 h-5 fill-slate-950 translate-x-0.5" />
              )}
            </button>

            <Tooltip.Root>
              <Tooltip.Trigger asChild>
                <button
                  onClick={() => handleSkip(10)}
                  className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors focus:outline-none"
                  aria-label="Fast forward 10 seconds"
                >
                  <FastForward className="w-4 h-4" />
                </button>
              </Tooltip.Trigger>
              <Tooltip.Portal>
                <Tooltip.Content className="px-2 py-1 bg-slate-900 text-xs text-slate-200 rounded border border-slate-700 shadow-lg">
                  +10s
                  <Tooltip.Arrow className="fill-slate-900" />
                </Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip.Root>
          </div>

          {/* Volume Control */}
          <div className="flex items-center gap-2.5 max-w-[140px] sm:max-w-[170px] w-full">
            <button
              onClick={toggleMute}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors focus:outline-none"
              aria-label={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="w-4 h-4 text-rose-400" />
              ) : (
                <Volume2 className="w-4 h-4 text-amber-400" />
              )}
            </button>

            <Slider.Root
              className="relative flex items-center select-none touch-none w-full h-4 cursor-pointer"
              value={[isMuted ? 0 : volume]}
              max={1}
              step={0.02}
              onValueChange={handleVolumeChange}
              aria-label="Volume slider"
            >
              <Slider.Track className="bg-slate-800 relative grow rounded-full h-1 overflow-hidden border border-white/5">
                <Slider.Range className="absolute bg-amber-400 h-full rounded-full" />
              </Slider.Track>
              <Slider.Thumb
                className="block w-3 h-3 bg-white shadow rounded-full hover:scale-125 focus:outline-none transition-transform"
                aria-label="Volume level"
              />
            </Slider.Root>
          </div>
        </div>
      </div>
    </Tooltip.Provider>
  );
};
