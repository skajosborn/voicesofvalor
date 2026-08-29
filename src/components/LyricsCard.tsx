import React, { useState } from 'react';
import { Copy, Check, Sparkles, BookOpen } from 'lucide-react';
import { LyricSection } from '../types/veteran';
import { globalAudioEngine } from '../services/audioEngine';

interface LyricsCardProps {
  lyrics: LyricSection[];
  currentTime: number;
  songTitle: string;
  veteranName: string;
}

export const LyricsCard: React.FC<LyricsCardProps> = ({
  lyrics,
  currentTime,
  songTitle,
  veteranName,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyLyrics = async () => {
    const fullText = lyrics
      .map(
        (sec) =>
          `[${sec.title}]\n` + sec.lines.map((l) => l.text).join('\n')
      )
      .join('\n\n');

    const formatted = `"${songTitle}" — ${veteranName}\nVoices of Valor Memorial\n\n${fullText}`;

    try {
      await navigator.clipboard.writeText(formatted);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  const handleLineClick = (timeSec: number) => {
    globalAudioEngine.seek(timeSec);
  };

  // Find currently active lyric line
  let activeLineId = '';
  for (const section of lyrics) {
    for (const line of section.lines) {
      if (currentTime >= line.timeSec) {
        activeLineId = line.id;
      }
    }
  }

  return (
    <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-valor-gold/20 relative shadow-xl">
      {/* Header with copy action */}
      <div className="flex items-center justify-between pb-5 mb-6 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <BookOpen className="w-5 h-5 text-valor-gold" />
          <h3 className="text-xl font-serif font-semibold text-white tracking-wide">
            Song Lyrics & Poetic Inscription
          </h3>
        </div>

        <button
          onClick={handleCopyLyrics}
          className="flex items-center gap-1.5 text-xs text-valor-slate hover:text-valor-gold bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-lg border border-white/10 transition-colors"
          aria-label="Copy full lyrics"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy Lyrics</span>
            </>
          )}
        </button>
      </div>

      {/* Lyrics Content with Sections */}
      <div className="space-y-8">
        {lyrics.map((section, sIdx) => (
          <div key={sIdx} className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase tracking-widest text-valor-gold/80 px-2.5 py-0.5 rounded bg-valor-gold/10 border border-valor-gold/20">
                {section.title}
              </span>
              <div className="h-px bg-white/5 flex-grow" />
            </div>

            <div className="space-y-2 pl-2 sm:pl-4 border-l border-white/10">
              {section.lines.map((line) => {
                const isActive = line.id === activeLineId;

                return (
                  <div
                    key={line.id}
                    onClick={() => handleLineClick(line.timeSec)}
                    className={`group flex items-start gap-3 cursor-pointer py-1.5 px-3 rounded-lg transition-all ${
                      isActive
                        ? 'bg-valor-gold/15 text-white font-medium border-l-2 border-valor-gold pl-3 scale-[1.01]'
                        : 'text-slate-300 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <span className="text-[11px] font-mono text-valor-slate/50 group-hover:text-valor-gold/70 pt-0.5 select-none w-8 shrink-0">
                      {Math.floor(line.timeSec / 60)}:
                      {(line.timeSec % 60).toString().padStart(2, '0')}
                    </span>
                    <p className="text-base sm:text-lg leading-relaxed font-sans">
                      {line.text}
                    </p>
                    {isActive && (
                      <Sparkles className="w-3.5 h-3.5 text-valor-gold ml-auto shrink-0 self-center animate-pulse" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Interactive tip */}
      <div className="mt-8 pt-4 border-t border-white/5 flex items-center justify-between text-xs text-valor-textMuted">
        <span>Click any timestamped lyric line to jump the background song directly to that verse.</span>
        <span className="hidden sm:inline font-mono text-valor-gold/60">Voices of Valor Archive</span>
      </div>
    </div>
  );
};
