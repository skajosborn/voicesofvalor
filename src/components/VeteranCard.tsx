import React from 'react';
import { Play, Music, FileText } from 'lucide-react';
import { Veteran } from '../types/veteran';

interface VeteranCardProps {
  veteran: Veteran;
  onSelect: (veteran: Veteran) => void;
}

export const VeteranCard: React.FC<VeteranCardProps> = ({ veteran, onSelect }) => {
  const hasAudio = !!veteran.song.audioUrl;

  return (
    <article
      onClick={() => onSelect(veteran)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(veteran);
        }
      }}
      tabIndex={0}
      role="button"
      aria-label={`View song card and story for ${veteran.rank} ${veteran.name}`}
      className="vov-card-interactive rounded-xl overflow-hidden cursor-pointer flex flex-col group focus:outline-none focus:ring-2 focus:ring-amber-400 relative"
    >
      {/* Portrait Image with Vignette */}
      <div className="aspect-[4/3.8] relative overflow-hidden bg-slate-950">
        <img
          src={veteran.imageUrl}
          alt={veteran.imageAlt}
          loading="lazy"
          className="w-full h-full object-cover object-top filter contrast-105 group-hover:scale-105 transition-all duration-500"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/assets/images/IMG_3460.jpeg';
          }}
        />
        
        {/* Dark bottom gradient shadow */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#090f18] via-[#090f18]/40 to-transparent" />

        {/* Hover Audio Indicator Button */}
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {hasAudio ? (
            <div className="w-9 h-9 rounded-full bg-vov-red text-white flex items-center justify-center shadow-lg shadow-black/60 transform group-hover:scale-110 transition-transform">
              <Play className="w-4 h-4 fill-current translate-x-0.5" />
            </div>
          ) : (
            <div className="w-9 h-9 rounded-full bg-slate-900/90 text-amber-300 border border-amber-400/40 flex items-center justify-center shadow-lg shadow-black/60 transform group-hover:scale-110 transition-transform">
              <FileText className="w-4 h-4" />
            </div>
          )}
        </div>

        {/* Hover song title pill */}
        <div className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-mono font-medium bg-black/80 text-amber-300 border border-amber-400/40 backdrop-blur-md shadow-md">
            {hasAudio ? (
              <Music className="w-3 h-3 text-amber-400" />
            ) : (
              <FileText className="w-3 h-3 text-amber-400" />
            )}
            {veteran.song.title}
          </span>
        </div>
      </div>

      {/* Card Inscription matching the exact poster design */}
      <div className="bg-[#0b131e] px-4 pt-2 pb-4 text-center flex flex-col items-center justify-center border-t border-slate-800">
        {/* Red Line with Centered White Star */}
        <div className="flex items-center justify-center gap-2 w-full max-w-[140px] mb-1.5">
          <div className="h-[1.5px] bg-vov-red flex-1" />
          <span className="text-white text-xs leading-none select-none">★</span>
          <div className="h-[1.5px] bg-vov-red flex-1" />
        </div>

        {/* Bold White Name */}
        <h3 className="font-headline font-bold text-lg sm:text-xl tracking-wider text-white uppercase group-hover:text-amber-300 transition-colors">
          {veteran.name}
        </h3>

        {/* Branch & Song metadata */}
        <p className="text-[11px] font-mono text-slate-400 mt-0.5 flex items-center gap-2">
          <span>{veteran.branch}</span>
          <span>•</span>
          <span className="text-amber-300/80 italic font-sans font-normal truncate max-w-[180px]">
            {veteran.song.title}
          </span>
        </p>
      </div>
    </article>
  );
};
