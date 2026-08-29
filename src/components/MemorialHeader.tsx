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
      {/* Hero Banner Section using high-resolution newVVhero image */}
      <section className="relative w-full overflow-hidden bg-[#0a1017]">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 pt-2 sm:pt-4">
          <div className="relative w-full rounded-2xl overflow-hidden shadow-2xl border border-white/10">
            <img
              src="/assets/newVVhero.png"
              alt="Voices of Valor - Live Music Writers Round Honoring All Veterans featuring Johnny & Heidi Bulford"
              className="w-full h-auto object-contain block"
            />
          </div>
        </div>

        {/* CTA Bar right below the banner */}
        <div className="flex flex-col items-center justify-center pt-6 pb-2">
          <button
            onClick={handleScrollToVeterans}
            className="vov-btn-meet px-8 sm:px-10 py-2.5 sm:py-3 rounded-md text-white font-headline font-bold text-sm sm:text-base tracking-widest uppercase flex items-center gap-2 cursor-pointer shadow-xl hover:scale-105 transition-all"
          >
            <span className="text-amber-300 text-xs">★</span>
            <span>MEET OUR VETERANS</span>
            <span className="text-amber-300 text-xs">★</span>
          </button>

          <button
            onClick={handleScrollToVeterans}
            className="text-vov-redBright hover:text-red-400 transition-transform hover:translate-y-1 mt-2 p-1"
            aria-label="Scroll down to veterans"
          >
            <ChevronDown className="w-6 h-6 animate-bounce" />
          </button>
        </div>

        {/* Parchment 3-Feature Bar */}
        <div className="max-w-5xl mx-auto w-full px-4 sm:px-6 pt-4 pb-6">
          <div className="vov-parchment-strip p-4 sm:p-6 grid grid-cols-1 md:grid-cols-3 gap-6 text-slate-900 border border-amber-900/20 shadow-xl rounded-lg">
            
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
      <section id="meet-veterans-section" className="max-w-6xl mx-auto px-4 sm:px-6 pt-10 pb-6 text-center">
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
