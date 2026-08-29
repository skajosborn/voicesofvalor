import React from 'react';

export const SupportBanner: React.FC = () => {
  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 my-12">
      <div className="vov-support-box rounded-xl p-6 sm:p-8 border border-[#2b4463] relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8 shadow-2xl">
        {/* Left: Line-art acoustic guitar with floating music notes */}
        <div className="shrink-0 flex items-center justify-center w-16 h-20 text-slate-300 opacity-90">
          <svg
            viewBox="0 0 100 140"
            className="w-full h-full stroke-current fill-none stroke-[2.5]"
          >
            {/* Guitar body */}
            <path d="M50,45 C35,45 25,55 25,70 C25,80 32,86 38,90 C28,95 20,108 20,122 C20,135 32,138 50,138 C68,138 80,135 80,122 C80,108 72,95 62,90 C68,86 75,80 75,70 C75,55 65,45 50,45 Z" />
            {/* Neck */}
            <path d="M46,12 L46,45 M54,12 L54,45" />
            {/* Headstock */}
            <rect x="44" y="2" width="12" height="10" rx="1" />
            <circle cx="41" cy="4" r="1.5" />
            <circle cx="41" cy="8" r="1.5" />
            <circle cx="59" cy="4" r="1.5" />
            <circle cx="59" cy="8" r="1.5" />
            {/* Soundhole */}
            <circle cx="50" cy="72" r="7" />
            {/* Bridge */}
            <line x1="42" y1="110" x2="58" y2="110" strokeWidth="3" />
            {/* Music notes around */}
            <path d="M12,40 L12,28 L24,24 L24,36 M12,32 L24,28" strokeWidth="2" />
            <circle cx="10" cy="40" r="3" fill="currentColor" />
            <circle cx="22" cy="36" r="3" fill="currentColor" />
            <path d="M78,35 L78,25 L88,22 L88,32 M78,29 L88,26" strokeWidth="2" />
            <circle cx="76" cy="35" r="2.5" fill="currentColor" />
            <circle cx="86" cy="32" r="2.5" fill="currentColor" />
          </svg>
        </div>

        {/* Center Text */}
        <div className="text-center md:text-left flex-1 space-y-2">
          <h3 className="text-xl sm:text-2xl font-headline font-bold uppercase tracking-wider text-vov-gold">
            YOUR SUPPORT HONORS THEIR LEGACY
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans max-w-2xl">
            Voices of Valor is made possible through the support of our community.
            Together, we can ensure that their stories are never forgotten and their legacy lives on.
          </p>
        </div>

        {/* Right: Line art hands cradling American flag heart */}
        <div className="shrink-0 flex items-center justify-center w-16 h-20 text-slate-300 opacity-90">
          <svg
            viewBox="0 0 120 120"
            className="w-full h-full stroke-current fill-none stroke-[2.2]"
          >
            {/* Heart */}
            <path d="M60,32 C50,15 25,18 25,42 C25,62 55,85 60,90 C65,85 95,62 95,42 C95,18 70,15 60,32 Z" />
            {/* Stripes inside heart */}
            <path d="M30,42 L90,42 M35,52 L85,52 M42,62 L78,62 M50,72 L70,72" strokeWidth="1.5" />
            {/* Left Hand */}
            <path d="M22,65 C15,75 14,92 20,105 C26,112 38,114 48,110 L52,98" />
            <path d="M25,75 C22,82 28,90 38,92" />
            {/* Right Hand */}
            <path d="M98,65 C105,75 106,92 100,105 C94,112 82,114 72,110 L68,98" />
            <path d="M95,75 C98,82 92,90 82,92" />
          </svg>
        </div>
      </div>
    </section>
  );
};
