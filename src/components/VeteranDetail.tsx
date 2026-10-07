import React, { useState, useCallback, useEffect } from 'react';
import { ArrowLeft, Award, Calendar, Shield, ChevronLeft, ChevronRight, Music, Image as ImageIcon, FileText } from 'lucide-react';
import { SongTrackData, Veteran } from '../types/veteran';
import { AudioPlayer } from './AudioPlayer';
import { LyricsCard } from './LyricsCard';

interface VeteranDetailProps {
  veteran: Veteran;
  allVeterans: Veteran[];
  onBack: () => void;
  onSelectVeteran: (veteran: Veteran) => void;
}

const PRIMARY_TRACK_ID = 'primary';

export const VeteranDetail: React.FC<VeteranDetailProps> = ({
  veteran,
  allVeterans,
  onBack,
  onSelectVeteran,
}) => {
  const additionalSongs = veteran.additionalSongs ?? [];
  const [playingTrackId, setPlayingTrackId] = useState(PRIMARY_TRACK_ID);
  const [currentTime, setCurrentTime] = useState(0);
  const [activeTab, setActiveTab] = useState<'card' | 'lyrics'>(
    veteran.songcardUrl ? 'card' : 'lyrics'
  );

  useEffect(() => {
    setPlayingTrackId(PRIMARY_TRACK_ID);
    setCurrentTime(0);
    setActiveTab(veteran.songcardUrl ? 'card' : 'lyrics');
  }, [veteran.id, veteran.songcardUrl]);

  const isPlayingPrimary = playingTrackId === PRIMARY_TRACK_ID;
  const playingSong: SongTrackData = isPlayingPrimary
    ? veteran.song
    : (additionalSongs.find((t) => t.id === playingTrackId)?.song ?? veteran.song);

  const firstName = veteran.name.split(' ')[0];

  const handleTimeChange = useCallback((time: number) => {
    setCurrentTime(time);
  }, []);

  const currentIndex = allVeterans.findIndex((v) => v.id === veteran.id);
  const prevVeteran = currentIndex > 0 ? allVeterans[currentIndex - 1] : allVeterans[allVeterans.length - 1];
  const nextVeteran = currentIndex < allVeterans.length - 1 ? allVeterans[currentIndex + 1] : allVeterans[0];

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 animate-fade-in" tabIndex={-1}>
      {/* Top navigation row */}
      <div className="flex items-center justify-between gap-4 mb-8">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-200 hover:text-amber-300 border border-slate-700/60 transition-all group shadow-md"
          aria-label="Back to all veterans"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span className="font-headline font-semibold tracking-wider uppercase text-xs sm:text-sm">
            Back to Meet Our Veterans
          </span>
        </button>

        {/* Quick switcher between veterans */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              onSelectVeteran(prevVeteran);
              setActiveTab(prevVeteran.songcardUrl ? 'card' : 'lyrics');
            }}
            className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60 transition-colors"
            title={`Previous: ${prevVeteran.name}`}
            aria-label={`Previous veteran: ${prevVeteran.name}`}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-xs font-mono text-slate-400 px-2">
            {currentIndex + 1} / {allVeterans.length}
          </span>
          <button
            onClick={() => {
              onSelectVeteran(nextVeteran);
              setActiveTab(nextVeteran.songcardUrl ? 'card' : 'lyrics');
            }}
            className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60 transition-colors"
            title={`Next: ${nextVeteran.name}`}
            aria-label={`Next veteran: ${nextVeteran.name}`}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Portrait, Service Details, Story */}
        <div className="lg:col-span-5 space-y-6">
          {/* Portrait Card */}
          <div className="vov-card rounded-2xl overflow-hidden border border-slate-700 shadow-2xl relative group">
            <div className="aspect-[4/4.5] relative overflow-hidden bg-slate-950">
              <img
                src={veteran.imageUrl}
                alt={veteran.imageAlt}
                className="w-full h-full object-cover object-top filter contrast-105"
                onError={(e) => {
                  // Fallback to default portrait if not loaded
                  (e.target as HTMLImageElement).src = '/assets/images/IMG_3460.jpeg';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#090f18] via-[#090f18]/30 to-transparent" />

              {/* Branch Badge */}
              <div className="absolute top-4 left-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium bg-black/80 text-amber-300 border border-amber-400/40 backdrop-blur-md shadow-lg">
                  <Shield className="w-3.5 h-3.5 text-amber-400" />
                  {veteran.branch}
                </span>
              </div>

              {/* Rank & Name Inscription over portrait */}
              <div className="absolute bottom-4 left-4 right-4">
                <div className="flex items-center justify-start gap-2 max-w-[120px] mb-1">
                  <div className="h-[1.5px] bg-vov-red flex-1" />
                  <span className="text-white text-xs leading-none">★</span>
                  <div className="h-[1.5px] bg-vov-red flex-1" />
                </div>

                <p className="text-xs font-mono text-amber-400/90 tracking-widest uppercase">
                  {veteran.rank}
                </p>
                <h1 className="text-2xl sm:text-3xl font-headline font-bold text-white tracking-wider uppercase mt-0.5">
                  {veteran.name}
                </h1>
                <p className="text-xs text-slate-300 mt-1 flex items-center gap-2 font-mono">
                  <span className="inline-flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-amber-400/80" />
                    {veteran.yearsOfService}
                  </span>
                  <span>•</span>
                  <span>{veteran.serviceEra}</span>
                </p>
              </div>
            </div>

            {/* Quote Block */}
            <div className="p-5 border-t border-slate-800 bg-[#090f18]/90">
              <p className="text-sm italic text-amber-200/90 font-serif leading-relaxed">
                {veteran.shortQuote}
              </p>
            </div>
          </div>

          {/* Service Narrative & Songwriting Collaboration */}
          <div className="vov-card rounded-2xl p-6 border border-slate-700 space-y-4">
            <div className="flex items-center gap-2 text-xs font-headline font-bold tracking-widest uppercase text-vov-redBright">
              <Music className="w-4 h-4" />
              <span>Nashville Songwriting Story</span>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed font-sans">
              {veteran.story}
            </p>

            {veteran.medals && veteran.medals.length > 0 && (
              <div className="pt-3 border-t border-slate-800">
                <h5 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-amber-400" />
                  Decorations & Honors
                </h5>
                <div className="flex flex-wrap gap-1.5">
                  {veteran.medals.map((medal, idx) => (
                    <span
                      key={idx}
                      className="text-xs px-2.5 py-1 rounded-md bg-black/40 border border-slate-700 text-slate-200 font-sans"
                    >
                      {medal}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Featured song + optional additional tracks */}
        <div className="lg:col-span-7 space-y-6">
          {playingSong.audioUrl && (
            <AudioPlayer
              key={`${veteran.id}-${playingTrackId}`}
              song={playingSong}
              autoPlay={true}
              onTimeChange={isPlayingPrimary ? handleTimeChange : undefined}
            />
          )}

          {!isPlayingPrimary && (
            <button
              type="button"
              onClick={() => {
                setPlayingTrackId(PRIMARY_TRACK_ID);
                setCurrentTime(0);
              }}
              className="text-xs font-mono text-sky-300 hover:underline"
            >
              ← Back to {veteran.song.title}
            </button>
          )}

          {additionalSongs.length > 0 && (
            <div
              className="rounded-2xl p-4 sm:p-5 border border-sky-500/30 bg-sky-950/40 shadow-[inset_0_1px_0_rgba(125,211,252,0.08)]"
              aria-label={`Other songs by ${firstName}`}
            >
              <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-sky-300/90 mb-3">
                Other songs by {firstName}
              </p>
              <ul className="flex flex-col gap-2">
                {additionalSongs.map((track) => {
                  const isPlaying = playingTrackId === track.id;
                  return (
                    <li key={track.id}>
                      <button
                        type="button"
                        onClick={() => {
                          setPlayingTrackId(track.id);
                          setCurrentTime(0);
                        }}
                        className={`w-full text-left px-3 py-2.5 rounded-xl border transition-all ${
                          isPlaying
                            ? 'bg-sky-800/70 border-sky-400/50 text-white shadow-md'
                            : 'bg-sky-950/50 border-sky-700/40 text-sky-100/90 hover:border-sky-400/50 hover:bg-sky-900/50 hover:text-white'
                        }`}
                        aria-pressed={isPlaying}
                        aria-label={`Play ${track.song.title}`}
                      >
                        <span className="flex items-center gap-3">
                          <Music
                            className={`w-3.5 h-3.5 shrink-0 ${isPlaying ? 'text-sky-300' : 'text-sky-500'}`}
                          />
                          <span className="min-w-0 flex-1">
                            <span className="block text-xs sm:text-sm font-headline font-bold uppercase tracking-wider">
                              {track.song.title}
                            </span>
                            <span className="block text-[10px] font-mono text-sky-300/60 truncate mt-0.5">
                              {track.song.composer}
                            </span>
                          </span>
                          {isPlaying && (
                            <span className="text-[9px] font-mono uppercase tracking-widest text-sky-300 shrink-0">
                              Playing
                            </span>
                          )}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          {veteran.songcardUrl && (
            <div className="flex items-center gap-2 bg-slate-900/80 p-1.5 rounded-xl border border-slate-700 max-w-sm">
              <button
                onClick={() => setActiveTab('card')}
                className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-headline font-bold uppercase tracking-wider transition-all ${
                  activeTab === 'card'
                    ? 'bg-vov-btn-meet text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5 text-amber-300" />
                <span>Song Card</span>
              </button>
              <button
                onClick={() => setActiveTab('lyrics')}
                className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-headline font-bold uppercase tracking-wider transition-all ${
                  activeTab === 'lyrics'
                    ? 'bg-vov-btn-meet text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <FileText className="w-3.5 h-3.5 text-amber-300" />
                <span>Interactive Lyrics</span>
              </button>
            </div>
          )}

          {activeTab === 'card' && veteran.songcardUrl ? (
            <div className="vov-card rounded-2xl p-4 sm:p-6 border border-slate-700 shadow-2xl relative overflow-hidden text-center">
              <div className="mb-4 flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="text-left">
                  <h3 className="font-headline font-bold text-lg text-white uppercase tracking-wider">
                    {veteran.song.title}
                  </h3>
                  <p className="text-xs font-sans text-slate-400">
                    Written by {veteran.song.composer}
                  </p>
                </div>
                <span className="text-[11px] font-mono text-amber-300 bg-black/40 px-3 py-1 rounded border border-amber-400/20">
                  Official Song Card
                </span>
              </div>

              <div className="rounded-xl overflow-hidden bg-black/60 border border-slate-800 shadow-inner flex items-center justify-center">
                <img
                  src={veteran.songcardUrl}
                  alt={`Song Card for ${veteran.name} - ${veteran.song.title}`}
                  className="w-full h-auto max-h-[700px] object-contain rounded-lg filter drop-shadow-xl hover:scale-[1.01] transition-transform"
                />
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 font-sans">
                <span>Created in partnership with CreatiVets & Combat Veterans to Careers</span>
                <button
                  onClick={() => setActiveTab('lyrics')}
                  className="text-amber-300 hover:underline font-mono"
                >
                  View synchronized lyrics →
                </button>
              </div>
            </div>
          ) : (
            <LyricsCard
              lyrics={veteran.lyrics}
              currentTime={isPlayingPrimary ? currentTime : 0}
              songTitle={veteran.song.title}
              veteranName={veteran.name}
            />
          )}
        </div>
      </div>
    </main>
  );
};
