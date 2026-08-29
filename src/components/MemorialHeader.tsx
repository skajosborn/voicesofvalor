import React from 'react';
import { Mic, Tag, Star, ChevronDown, Search } from 'lucide-react';

interface MemorialHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedBranch: string;
  onSelectBranch: (branch: string) => void;
  branches: string[];
}

export const MemorialHeader: React.FC<MemorialHeaderProps> = ({
  searchQuery,
  onSearchChange,
  selectedBranch,
  onSelectBranch,
  branches,
}) => {
  const handleScrollToVeterans = () => {
    const el = document.getElementById('meet-veterans-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative">
      {/* Hero Section Container with User Provided Graphic Backdrop */}
      <section className="vov-hero-container flex flex-col justify-between pt-6 sm:pt-10 pb-8 px-4 sm:px-6">
        <div className="vov-hero-overlay absolute inset-0 pointer-events-none" />

        {/* Center Hero Content */}
        <div className="relative max-w-3xl mx-auto text-center z-10 my-auto py-8">
          
          {/* Top 3 Stars with Flanking Navy Lines */}
          <div className="flex items-center justify-center gap-3 sm:gap-4 mb-2 select-none">
            <span className="w-12 sm:w-20 h-[1.5px] bg-[#1c3554] opacity-90"></span>
            <span className="text-[#1c3554] text-base sm:text-lg">★</span>
            <span className="text-[#87191d] text-2xl sm:text-3xl font-bold -translate-y-0.5">★</span>
            <span className="text-[#1c3554] text-base sm:text-lg">★</span>
            <span className="w-12 sm:w-20 h-[1.5px] bg-[#1c3554] opacity-90"></span>
          </div>

          {/* Main Title: VOICES OF VALOR */}
          <div className="space-y-0 leading-none select-none mb-3">
            <h1 className="text-6xl sm:text-8xl md:text-9xl font-headline font-extrabold uppercase tracking-tight text-[#152a45] drop-shadow-sm">
              VOICES
            </h1>
            <h2 className="text-5xl sm:text-7xl md:text-8xl font-headline font-extrabold uppercase tracking-tight text-[#152a45] drop-shadow-sm">
              OF VALOR
            </h2>
          </div>

          {/* Burgundy Ribbon: LIVE MUSIC WRITERS ROUND */}
          <div className="inline-block relative my-3 px-8 sm:px-12 py-1.5 sm:py-2 vov-ribbon rounded-sm select-none">
            <div className="flex items-center justify-center gap-3 font-headline font-bold text-xs sm:text-sm tracking-[0.25em] uppercase text-white shadow-sm">
              <span className="text-amber-300 text-xs">★</span>
              <span>LIVE MUSIC WRITERS ROUND</span>
              <span className="text-amber-300 text-xs">★</span>
            </div>
          </div>

          {/* Subheading: HONORING ALL VETERANS */}
          <div className="mt-3 select-none">
            <h3 className="font-headline font-bold text-base sm:text-xl md:text-2xl tracking-[0.15em] text-[#1c3554] uppercase">
              HONORING ALL VETERANS
            </h3>
            <p className="vov-script-italic text-sm sm:text-base md:text-lg text-[#2d486b] font-medium mt-0.5">
              Through Stories. Through Songs. Forever Remembered.
            </p>
          </div>

          {/* Red Star Divider */}
          <div className="text-vov-red text-base sm:text-lg my-3 select-none">
            ★
          </div>

          {/* Description Paragraph */}
          <p className="text-xs sm:text-sm md:text-base text-[#1e293b] max-w-xl mx-auto font-sans leading-relaxed font-medium mb-3 px-2">
            Voices of Valor is a live music storytelling series that honors the courage, sacrifice,
            and strength of our nation’s veterans. Each event features a veteran who shares their story,
            which is then transformed into a song written and performed by talented Nashville songwriters.
          </p>

          {/* Tagline */}
          <p className="font-headline font-bold text-sm sm:text-base text-[#87191d] tracking-wider mb-6">
            Real Stories. Real Heroes. Real Impact.
          </p>

          {/* Meet Our Veterans Button */}
          <div className="flex flex-col items-center justify-center gap-2">
            <button
              onClick={handleScrollToVeterans}
              className="vov-btn-meet px-8 sm:px-10 py-2.5 sm:py-3 rounded-md text-white font-headline font-bold text-sm sm:text-base tracking-widest uppercase flex items-center gap-2 cursor-pointer"
            >
              <span className="text-amber-300 text-xs">★</span>
              <span>MEET OUR VETERANS</span>
              <span className="text-amber-300 text-xs">★</span>
            </button>

            {/* Downward Chevron Arrow */}
            <button
              onClick={handleScrollToVeterans}
              className="text-vov-redBright hover:text-red-400 transition-transform hover:translate-y-1 mt-1 p-1"
              aria-label="Scroll down to veterans"
            >
              <ChevronDown className="w-6 h-6 animate-bounce" />
            </button>
          </div>
        </div>

        {/* Parchment 3-Feature Bar at Bottom of Hero */}
        <div className="relative max-w-5xl mx-auto w-full z-10 mt-6">
          <div className="vov-parchment-strip p-4 sm:p-6 grid grid-cols-1 md:grid-cols-3 gap-6 text-slate-900 border border-amber-900/20 shadow-xl">
            
            {/* 1. Live Music */}
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-12 h-12 rounded-full bg-[#152a45] text-white flex items-center justify-center shrink-0 shadow-md">
                <Mic className="w-5 h-5 text-amber-300" />
              </div>
              <div className="text-left">
                <h4 className="font-headline font-bold text-sm sm:text-base text-[#87191d] tracking-wider uppercase">
                  LIVE MUSIC
                </h4>
                <p className="text-xs text-slate-700 font-sans leading-snug mt-0.5">
                  Award-winning Nashville songwriters perform inspired by real stories.
                </p>
              </div>
            </div>

            {/* 2. Veteran Stories */}
            <div className="flex items-center gap-3 sm:gap-4 border-t md:border-t-0 md:border-l border-amber-900/15 pt-4 md:pt-0 md:pl-6">
              <div className="w-12 h-12 rounded-full bg-[#152a45] text-white flex items-center justify-center shrink-0 shadow-md">
                <Tag className="w-5 h-5 text-amber-300 transform -rotate-45" />
              </div>
              <div className="text-left">
                <h4 className="font-headline font-bold text-sm sm:text-base text-[#87191d] tracking-wider uppercase">
                  VETERAN STORIES
                </h4>
                <p className="text-xs text-slate-700 font-sans leading-snug mt-0.5">
                  Veterans share their experiences of courage, service, and resilience.
                </p>
              </div>
            </div>

            {/* 3. Community & Honor */}
            <div className="flex items-center gap-3 sm:gap-4 border-t md:border-t-0 md:border-l border-amber-900/15 pt-4 md:pt-0 md:pl-6">
              <div className="w-12 h-12 rounded-full bg-[#152a45] text-white flex items-center justify-center shrink-0 shadow-md">
                <Star className="w-5 h-5 text-amber-300 fill-amber-300" />
              </div>
              <div className="text-left">
                <h4 className="font-headline font-bold text-sm sm:text-base text-[#87191d] tracking-wider uppercase">
                  COMMUNITY & HONOR
                </h4>
                <p className="text-xs text-slate-700 font-sans leading-snug mt-0.5">
                  Bringing our community together to honor and celebrate our heroes.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Meet Our Veterans Gallery Anchor Section */}
      <section id="meet-veterans-section" className="max-w-6xl mx-auto px-4 sm:px-6 pt-16 pb-6 text-center">
        {/* Section Heading: ── MEET OUR VETERANS ── */}
        <div className="flex items-center justify-center gap-4 max-w-2xl mx-auto mb-2 select-none">
          <div className="h-[2px] bg-vov-red flex-1" />
          <h2 className="text-2xl sm:text-4xl font-headline font-bold tracking-widest text-white uppercase">
            MEET OUR VETERANS
          </h2>
          <div className="h-[2px] bg-vov-red flex-1" />
        </div>
        <p className="text-xs sm:text-sm text-slate-300 font-sans mb-8">
          Click on a veteran to hear their song and read their story.
        </p>

        {/* Search & Branch Filter Controls */}
        <div className="max-w-xl mx-auto mb-8 flex flex-col sm:flex-row items-center gap-3">
          <div className="relative w-full flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search by veteran name, song, or branch..."
              className="w-full pl-9 pr-4 py-2 bg-slate-900/80 border border-slate-700/60 rounded-lg text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400"
              aria-label="Search veterans and songs"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto justify-center">
            {branches.map((b) => (
              <button
                key={b}
                onClick={() => onSelectBranch(b)}
                className={`px-3 py-1.5 rounded-md text-[11px] font-mono transition-colors uppercase ${
                  selectedBranch === b
                    ? 'bg-vov-red text-white font-bold shadow'
                    : 'bg-slate-900/60 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {b}
              </button>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
