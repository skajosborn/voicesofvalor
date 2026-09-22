import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowLeft,
  Pause,
  Play,
  Radio,
  Shuffle,
  SkipForward,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { VETERANS_DATA } from '../data/veterans';
import { SongTrackData, Veteran } from '../types/veteran';
import { globalAudioEngine } from '../services/audioEngine';

export interface PlaylistTrack {
  veteranId: string;
  veteranName: string;
  rank: string;
  branch: Veteran['branch'];
  imageUrl: string;
  song: SongTrackData;
}

function shuffleArray<T>(items: T[]): T[] {
  const next = [...items];
  for (let i = next.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [next[i], next[j]] = [next[j], next[i]];
  }
  return next;
}

function formatTime(sec: number): string {
  if (!Number.isFinite(sec) || sec < 0) return '00:00';
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

interface MilitaryRadioPlaylistProps {
  onBack: () => void;
}

export const MilitaryRadioPlaylist: React.FC<MilitaryRadioPlaylistProps> = ({ onBack }) => {
  const tracks = useMemo<PlaylistTrack[]>(() => {
    return VETERANS_DATA.filter((v) => Boolean(v.song.audioUrl)).map((v) => ({
      veteranId: v.id,
      veteranName: v.name,
      rank: v.rank,
      branch: v.branch,
      imageUrl: v.imageUrl,
      song: v.song,
    }));
  }, []);

  const [queue, setQueue] = useState<PlaylistTrack[]>(() => shuffleArray(tracks));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [shuffleOn, setShuffleOn] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [poweredOn, setPoweredOn] = useState(true);

  const queueRef = useRef(queue);
  const currentIndexRef = useRef(currentIndex);
  const shuffleOnRef = useRef(shuffleOn);
  const tracksRef = useRef(tracks);

  useEffect(() => {
    queueRef.current = queue;
  }, [queue]);
  useEffect(() => {
    currentIndexRef.current = currentIndex;
  }, [currentIndex]);
  useEffect(() => {
    shuffleOnRef.current = shuffleOn;
  }, [shuffleOn]);
  useEffect(() => {
    tracksRef.current = tracks;
  }, [tracks]);

  const currentTrack = queue[currentIndex] ?? null;

  const playTrackAt = useCallback((index: number, list: PlaylistTrack[] = queueRef.current) => {
    const track = list[index];
    if (!track?.song.audioUrl) return;
    setCurrentIndex(index);
    currentIndexRef.current = index;
    setDuration(track.song.durationSec);
    setCurrentTime(0);
    globalAudioEngine.loadAndPlay(track.song, true);
  }, []);

  const advanceToNext = useCallback(() => {
    const list = queueRef.current;
    if (list.length === 0) return;

    if (shuffleOnRef.current) {
      if (list.length === 1) {
        playTrackAt(0, list);
        return;
      }
      let nextIndex = Math.floor(Math.random() * list.length);
      if (nextIndex === currentIndexRef.current) {
        nextIndex = (nextIndex + 1) % list.length;
      }
      playTrackAt(nextIndex, list);
      return;
    }

    const nextIndex = (currentIndexRef.current + 1) % list.length;
    playTrackAt(nextIndex, list);
  }, [playTrackAt]);

  useEffect(() => {
    globalAudioEngine.setTimeUpdateCallback((time, playing) => {
      setCurrentTime(time);
      setIsPlaying(playing);
      setDuration(globalAudioEngine.getDuration());
    });
    globalAudioEngine.setEndedCallback(() => {
      advanceToNext();
    });

    return () => {
      globalAudioEngine.setEndedCallback(null);
      globalAudioEngine.setTimeUpdateCallback(() => {});
      globalAudioEngine.stop();
    };
  }, [advanceToNext]);

  const handlePowerToggle = () => {
    if (poweredOn) {
      globalAudioEngine.stop();
      setIsPlaying(false);
      setPoweredOn(false);
    } else {
      setPoweredOn(true);
    }
  };

  const handlePlayPause = () => {
    if (!poweredOn || !currentTrack) return;
    if (isPlaying) {
      globalAudioEngine.pause();
      return;
    }
    // Resume if the current track is already loaded in the engine
    if (currentTime > 0.15) {
      globalAudioEngine.play();
      return;
    }
    playTrackAt(currentIndex);
  };

  const handleSkip = () => {
    if (!poweredOn) return;
    advanceToNext();
  };

  const handleShuffleToggle = () => {
    const next = !shuffleOn;
    setShuffleOn(next);
    if (next) {
      const reshuffled = shuffleArray(tracksRef.current);
      setQueue(reshuffled);
      queueRef.current = reshuffled;
      // Keep currently playing song at front if possible
      if (currentTrack) {
        const idx = reshuffled.findIndex((t) => t.veteranId === currentTrack.veteranId);
        if (idx >= 0) {
          setCurrentIndex(idx);
          currentIndexRef.current = idx;
        }
      }
    } else {
      setQueue(tracksRef.current);
      queueRef.current = tracksRef.current;
      const idx = tracksRef.current.findIndex((t) => t.veteranId === currentTrack?.veteranId);
      setCurrentIndex(idx >= 0 ? idx : 0);
      currentIndexRef.current = idx >= 0 ? idx : 0;
    }
  };

  const handleSelectChannel = (index: number) => {
    if (!poweredOn) return;
    playTrackAt(index);
  };

  const handleMuteToggle = () => {
    const muted = globalAudioEngine.toggleMute();
    setIsMuted(muted);
  };

  const progressPct =
    duration > 0 ? Math.min(100, Math.max(0, (currentTime / duration) * 100)) : 0;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-xs font-headline uppercase tracking-widest text-slate-400 hover:text-amber-300 transition-colors mb-5"
        aria-label="Back to all veterans"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to roster
      </button>

      <div className="military-radio relative overflow-hidden rounded-2xl border-2 border-[#3d4a2e] shadow-2xl">
        {/* Chassis rivets */}
        <div className="absolute top-3 left-3 w-2.5 h-2.5 rounded-full bg-[#1a1f14] border border-[#6b7a4f] shadow-inner" aria-hidden />
        <div className="absolute top-3 right-3 w-2.5 h-2.5 rounded-full bg-[#1a1f14] border border-[#6b7a4f] shadow-inner" aria-hidden />
        <div className="absolute bottom-3 left-3 w-2.5 h-2.5 rounded-full bg-[#1a1f14] border border-[#6b7a4f] shadow-inner" aria-hidden />
        <div className="absolute bottom-3 right-3 w-2.5 h-2.5 rounded-full bg-[#1a1f14] border border-[#6b7a4f] shadow-inner" aria-hidden />

        <div className="relative z-10 p-5 sm:p-8">
          {/* Header plate */}
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-6 border-b border-[#4a5836]/80 pb-4">
            <div>
              <p className="font-mono text-[10px] tracking-[0.35em] uppercase text-[#9aaf6c] mb-1">
                Combat Veterans to Careers · Net Call
              </p>
              <h1 className="font-headline font-bold text-2xl sm:text-3xl tracking-[0.12em] uppercase text-[#d6e3b0] flex items-center gap-2">
                <Radio className="w-6 h-6 text-amber-400" />
                Field Radio
              </h1>
              <p className="font-mono text-[11px] text-[#8a9b64] mt-1 uppercase tracking-wider">
                Unit VOV-01 · Frequency Band: Valor Stories
              </p>
            </div>

            <button
              onClick={handlePowerToggle}
              aria-pressed={poweredOn}
              aria-label={poweredOn ? 'Power off radio' : 'Power on radio'}
              className={`self-start sm:self-auto px-4 py-2 rounded-md font-mono text-xs uppercase tracking-widest border transition-all ${
                poweredOn
                  ? 'bg-[#5c1a16] border-[#c4453a] text-[#ffb4ab] shadow-[0_0_12px_rgba(196,69,58,0.45)]'
                  : 'bg-[#1e2418] border-[#4a5836] text-[#6b7a4f]'
              }`}
            >
              {poweredOn ? 'PWR ON' : 'PWR OFF'}
            </button>
          </div>

          {/* LED readout */}
          <div
            className={`military-radio-display rounded-lg border border-[#2a3320] p-4 sm:p-5 mb-5 transition-opacity ${
              poweredOn ? 'opacity-100' : 'opacity-35'
            }`}
          >
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="min-w-0">
                <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-[#5f8f3a] mb-1">
                  Now Receiving
                </p>
                <p className="font-mono text-lg sm:text-xl text-[#b8f06a] truncate drop-shadow-[0_0_8px_rgba(184,240,106,0.35)]">
                  {poweredOn && currentTrack
                    ? currentTrack.song.title.toUpperCase()
                    : '—— STANDBY ——'}
                </p>
                <p className="font-mono text-xs text-[#7aab4f] mt-1 truncate">
                  {poweredOn && currentTrack
                    ? `${currentTrack.rank} ${currentTrack.veteranName} · ${currentTrack.branch}`
                    : 'Awaiting transmission'}
                </p>
              </div>
              <div className="shrink-0 text-right font-mono text-[11px] text-[#7aab4f]">
                <div>{formatTime(currentTime)}</div>
                <div className="opacity-70">/ {formatTime(duration)}</div>
              </div>
            </div>

            {/* Signal / progress bar */}
            <div className="h-2 rounded-sm bg-[#0c1208] border border-[#1f2a14] overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#3d6b1f] via-[#8fd94a] to-[#c8ff7a] transition-[width] duration-200"
                style={{ width: poweredOn ? `${progressPct}%` : '0%' }}
              />
            </div>

            {/* Fake VU / signal meters */}
            <div className="mt-3 flex items-end gap-1 h-8" aria-hidden>
              {Array.from({ length: 24 }).map((_, i) => {
                const active = poweredOn && isPlaying;
                const height = active
                  ? 30 + ((Math.sin(currentTime * 8 + i) + 1) * 35)
                  : 12;
                return (
                  <div
                    key={i}
                    className="flex-1 rounded-sm bg-[#2f4a1c] origin-bottom"
                    style={{
                      height: `${height}%`,
                      opacity: active ? 0.55 + (i % 5) * 0.08 : 0.25,
                    }}
                  />
                );
              })}
            </div>
          </div>

          {/* Control deck */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mb-6">
            <button
              onClick={handlePlayPause}
              disabled={!poweredOn || tracks.length === 0}
              aria-label={isPlaying ? 'Pause radio' : 'Play shuffled playlist'}
              className="w-14 h-14 rounded-full bg-[#1a2114] border-2 border-[#8a9b64] text-[#d6e3b0] hover:border-amber-400 hover:text-amber-300 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center shadow-lg transition-colors"
            >
              {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
            </button>

            <button
              onClick={handleSkip}
              disabled={!poweredOn || tracks.length === 0}
              aria-label="Skip to next song"
              className="w-11 h-11 rounded-full bg-[#1a2114] border border-[#5a6b42] text-[#b8c99a] hover:border-amber-400 hover:text-amber-300 disabled:opacity-40 flex items-center justify-center transition-colors"
            >
              <SkipForward className="w-5 h-5" />
            </button>

            <button
              onClick={handleShuffleToggle}
              disabled={!poweredOn}
              aria-label="Shuffle playlist"
              aria-pressed={shuffleOn}
              className={`px-4 h-11 rounded-md font-mono text-[11px] uppercase tracking-widest border flex items-center gap-2 transition-colors disabled:opacity-40 ${
                shuffleOn
                  ? 'bg-[#2a3a18] border-amber-500/70 text-amber-300'
                  : 'bg-[#1a2114] border-[#5a6b42] text-[#8a9b64]'
              }`}
            >
              <Shuffle className="w-4 h-4" />
              Shuffle {shuffleOn ? 'ON' : 'OFF'}
            </button>

            <button
              onClick={handleMuteToggle}
              disabled={!poweredOn}
              aria-label={isMuted ? 'Unmute radio' : 'Mute radio'}
              className="w-11 h-11 rounded-full bg-[#1a2114] border border-[#5a6b42] text-[#b8c99a] hover:border-amber-400 hover:text-amber-300 disabled:opacity-40 flex items-center justify-center transition-colors"
            >
              {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>
          </div>

          {/* Channel list */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-[#8a9b64]">
                Channel Roster · {tracks.length} Transmissions
              </p>
              <p className="font-mono text-[10px] text-[#6b7a4f] uppercase tracking-wider">
                {shuffleOn ? 'Random Net' : 'Sequential Net'}
              </p>
            </div>

            <ul
              className={`max-h-[340px] overflow-y-auto rounded-lg border border-[#3d4a2e] bg-[#12180e]/80 divide-y divide-[#2a3320] ${
                poweredOn ? '' : 'opacity-40 pointer-events-none'
              }`}
              aria-label="Radio channel playlist"
            >
              {queue.map((track, index) => {
                const isActive = index === currentIndex && poweredOn;
                return (
                  <li key={`${track.veteranId}-${index}`}>
                    <button
                      type="button"
                      onClick={() => handleSelectChannel(index)}
                      className={`w-full text-left px-3 sm:px-4 py-2.5 flex items-center gap-3 transition-colors ${
                        isActive
                          ? 'bg-[#243018] text-[#c8ff7a]'
                          : 'hover:bg-[#1a2212] text-[#a8b888]'
                      }`}
                    >
                      <span className="font-mono text-[10px] w-7 shrink-0 text-[#6b7a4f]">
                        CH{String(index + 1).padStart(2, '0')}
                      </span>
                      <img
                        src={track.imageUrl}
                        alt=""
                        className="w-9 h-9 rounded object-cover border border-[#3d4a2e] shrink-0"
                      />
                      <span className="min-w-0 flex-1">
                        <span className="block font-mono text-xs sm:text-sm truncate">
                          {track.song.title}
                        </span>
                        <span className="block font-mono text-[10px] text-[#6b7a4f] truncate">
                          {track.veteranName} · {track.branch}
                        </span>
                      </span>
                      {isActive && isPlaying && (
                        <span className="font-mono text-[9px] uppercase tracking-widest text-amber-400 animate-pulse shrink-0">
                          Live
                        </span>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
