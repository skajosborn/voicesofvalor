import React from 'react';

export const ParchmentFooter: React.FC = () => {
  return (
    <footer className="w-full mt-auto">
      {/* Cream / Ivory Parchment Sponsor Bar */}
      <div className="vov-parchment-footer py-8 px-4 sm:px-8 border-t border-amber-900/20">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-center text-center md:text-left">
          
          {/* Left: Presented by Combat Veterans to Careers + CreatiVets + 7 City Fire */}
          <div className="md:col-span-5 flex flex-col items-center md:items-start space-y-2.5">
            <span className="text-[11px] font-mono tracking-widest text-slate-700 uppercase font-semibold">
              PRESENTED BY
            </span>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 sm:gap-6">
              {/* Combat Veterans to Careers Logo */}
              <img
                src="/assets/logos/CVClogo.png"
                alt="Combat Veterans to Careers"
                className="h-10 sm:h-12 w-auto object-contain filter drop-shadow-sm"
              />

              {/* CreatiVets Logo */}
              <img
                src="/assets/logos/creativets.png"
                alt="CreatiVets — Creating Hope Through the Arts"
                className="h-9 sm:h-11 w-auto object-contain filter drop-shadow-sm"
              />

              {/* 7 City Fire Logo */}
              <img
                src="/assets/logos/7_city_fire_logo.jpg"
                alt="7 City Fire"
                className="h-9 sm:h-10 w-auto object-contain rounded filter drop-shadow-sm"
              />
            </div>
          </div>

          {/* Center Quote & Red Stars */}
          <div className="md:col-span-4 flex flex-col items-center justify-center space-y-2.5">
            <blockquote className="font-serif font-bold text-sm sm:text-base text-slate-900 tracking-wide uppercase text-center">
              “WE DON’T KNOW THEM ALL, BUT WE OWE THEM ALL.”
            </blockquote>
            
            {/* 3 Red Stars with subtle red accent line */}
            <div className="flex items-center gap-2 text-vov-red text-sm">
              <span className="w-8 h-px bg-vov-red/60" />
              <span>★</span>
              <span>★</span>
              <span>★</span>
              <span className="w-8 h-px bg-vov-red/60" />
            </div>
          </div>

          {/* Right: Follow Us Social Circles */}
          <div className="md:col-span-3 flex flex-col items-center md:items-end space-y-2">
            <span className="text-[11px] font-mono tracking-widest text-slate-700 uppercase font-semibold">
              FOLLOW US
            </span>
            <div className="flex items-center gap-2.5 text-white">
              {/* Facebook icon */}
              <a
                href="#facebook"
                aria-label="Follow on Facebook"
                className="w-8 h-8 rounded-full bg-slate-900 hover:bg-slate-800 flex items-center justify-center text-xs font-bold transition-transform hover:scale-110 shadow-sm"
              >
                f
              </a>
              {/* Instagram icon */}
              <a
                href="#instagram"
                aria-label="Follow on Instagram"
                className="w-8 h-8 rounded-full bg-slate-900 hover:bg-slate-800 flex items-center justify-center text-xs transition-transform hover:scale-110 shadow-sm"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              {/* YouTube icon */}
              <a
                href="#youtube"
                aria-label="Follow on YouTube"
                className="w-8 h-8 rounded-full bg-slate-900 hover:bg-slate-800 flex items-center justify-center text-xs transition-transform hover:scale-110 shadow-sm"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Very bottom copyright row */}
      <div className="bg-[#080d14] py-3 px-4 text-center text-[10px] sm:text-[11px] font-mono tracking-wider text-slate-400 uppercase border-t border-white/5">
        © 2026 COMBAT VETERANS TO CAREERS & CREATIVETS. ALL RIGHTS RESERVED.
      </div>
    </footer>
  );
};
