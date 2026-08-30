import React, { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Volume2, X, Menu } from 'lucide-react';

interface NavbarProps {
  onHomeClick: () => void;
  onNavigateSection?: (sectionId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onHomeClick, onNavigateSection }) => {
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleNav = (target: string) => {
    setIsMobileMenuOpen(false);
    if (target === 'home') {
      onHomeClick();
    } else if (target === 'veterans') {
      const el = document.getElementById('meet-veterans-section');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      } else {
        onHomeClick();
      }
    } else if (target === 'about') {
      setActiveModal('about');
    } else if (target === 'support') {
      setActiveModal('support');
    } else if (target === 'contact') {
      setActiveModal('contact');
    } else if (target === 'events' || target === 'gallery') {
      if (onNavigateSection) {
        onNavigateSection(target);
      } else {
        const el = document.getElementById('photo-gallery-section');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        } else {
          setActiveModal(target);
        }
      }
    }
  };

  return (
    <nav className="sticky top-0 z-40 bg-[#090f18]/85 backdrop-blur-md border-b border-white/10 px-4 sm:px-8 py-2.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Combat Veterans to Careers Official Logo on Left */}
        <button
          onClick={onHomeClick}
          className="flex items-center gap-3 text-left group focus:outline-none"
          aria-label="Voices of Valor Home"
        >
          <img
            src="/assets/logos/CVClogo.png"
            alt="Combat Veterans to Careers"
            className="h-12 sm:h-14 w-auto object-contain filter drop-shadow-md group-hover:scale-105 transition-transform"
          />
        </button>

        {/* Navigation menu with star separators matching the exact header in the image */}
        <div className="hidden md:flex items-center gap-4 lg:gap-6 text-xs font-headline font-bold uppercase tracking-widest text-slate-300">
          {/* HOME (Active state with star underline indicator) */}
          <button
            onClick={() => handleNav('home')}
            className="flex flex-col items-center text-amber-300 hover:text-white transition-colors"
          >
            <span>HOME</span>
            <div className="flex items-center gap-1 text-[8px] text-vov-redBright leading-none mt-0.5">
              <span className="w-2.5 h-px bg-vov-redBright"></span>
              <span>★</span>
              <span className="w-2.5 h-px bg-vov-redBright"></span>
            </div>
          </button>

          <span className="text-slate-600 text-[10px]">★</span>

          <button
            onClick={() => handleNav('about')}
            className="hover:text-amber-300 transition-colors"
          >
            ABOUT
          </button>

          <span className="text-slate-600 text-[10px]">★</span>

          <button
            onClick={() => handleNav('veterans')}
            className="hover:text-amber-300 transition-colors"
          >
            VETERANS
          </button>

          <span className="text-slate-600 text-[10px]">★</span>

          <button
            onClick={() => handleNav('events')}
            className="hover:text-amber-300 transition-colors"
          >
            PAST EVENTS
          </button>

          <span className="text-slate-600 text-[10px]">★</span>

          <button
            onClick={() => handleNav('gallery')}
            className="hover:text-amber-300 transition-colors"
          >
            GALLERY
          </button>

          <span className="text-slate-600 text-[10px]">★</span>

          <button
            onClick={() => handleNav('support')}
            className="hover:text-amber-300 transition-colors"
          >
            SUPPORT
          </button>

          <span className="text-slate-600 text-[10px]">★</span>

          <button
            onClick={() => handleNav('contact')}
            className="hover:text-amber-300 transition-colors"
          >
            CONTACT
          </button>
        </div>

        {/* Right side: Audio status indicator & Mobile menu button */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-2 text-xs font-mono text-amber-300/90 bg-amber-950/40 border border-amber-500/20 px-3 py-1 rounded-full">
            <Volume2 className="w-3.5 h-3.5 text-amber-400 animate-pulse-subtle" />
            <span className="hidden sm:inline">Audio Engine Active</span>
          </div>

          {/* Mobile hamburger menu toggle */}
          <button
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={isMobileMenuOpen}
            className="md:hidden p-2 rounded-xl text-slate-300 hover:text-amber-300 hover:bg-white/5 border border-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-400"
          >
            {isMobileMenuOpen ? (
              <X className="w-5 h-5 text-amber-300" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Dropdown Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden mt-3 bg-[#0c1522]/95 rounded-2xl p-4 shadow-2xl border border-white/10 animate-fade-in">
          <div className="flex flex-col gap-1 text-sm font-headline font-bold uppercase tracking-widest text-slate-200">
            <button
              onClick={() => handleNav('home')}
              className="flex items-center justify-between px-3 py-2.5 rounded-lg text-amber-300 bg-amber-400/10 hover:bg-amber-400/20 transition-colors text-left"
            >
              <span>HOME</span>
              <span className="text-vov-redBright text-xs">★</span>
            </button>

            <button
              onClick={() => handleNav('about')}
              className="flex items-center justify-between px-3 py-2.5 rounded-lg hover:text-amber-300 hover:bg-white/5 transition-colors text-left"
            >
              <span>ABOUT</span>
              <span className="text-slate-600 text-xs">★</span>
            </button>

            <button
              onClick={() => handleNav('veterans')}
              className="flex items-center justify-between px-3 py-2.5 rounded-lg hover:text-amber-300 hover:bg-white/5 transition-colors text-left"
            >
              <span>VETERANS</span>
              <span className="text-slate-600 text-xs">★</span>
            </button>

            <button
              onClick={() => handleNav('events')}
              className="flex items-center justify-between px-3 py-2.5 rounded-lg hover:text-amber-300 hover:bg-white/5 transition-colors text-left"
            >
              <span>PAST EVENTS</span>
              <span className="text-slate-600 text-xs">★</span>
            </button>

            <button
              onClick={() => handleNav('gallery')}
              className="flex items-center justify-between px-3 py-2.5 rounded-lg hover:text-amber-300 hover:bg-white/5 transition-colors text-left"
            >
              <span>GALLERY</span>
              <span className="text-slate-600 text-xs">★</span>
            </button>

            <button
              onClick={() => handleNav('support')}
              className="flex items-center justify-between px-3 py-2.5 rounded-lg hover:text-amber-300 hover:bg-white/5 transition-colors text-left"
            >
              <span>SUPPORT</span>
              <span className="text-slate-600 text-xs">★</span>
            </button>

            <button
              onClick={() => handleNav('contact')}
              className="flex items-center justify-between px-3 py-2.5 rounded-lg hover:text-amber-300 hover:bg-white/5 transition-colors text-left"
            >
              <span>CONTACT</span>
              <span className="text-slate-600 text-xs">★</span>
            </button>
          </div>
        </div>
      )}

      {/* Dialog Modals */}
      <Dialog.Root open={!!activeModal} onOpenChange={(open) => !open && setActiveModal(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 animate-fade-in" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-lg max-h-[88vh] overflow-y-auto bg-[#0f1926] p-6 sm:p-8 rounded-2xl border border-amber-400/30 shadow-2xl z-50 focus:outline-none">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10">
              <Dialog.Title className="text-xl font-headline font-bold uppercase tracking-wider text-white">
                {activeModal === 'about' && 'About Voices of Valor'}
                {activeModal === 'support' && 'Support Our Mission'}
                {activeModal === 'events' && 'Past Writers Round Events'}
                {activeModal === 'gallery' && 'Veteran Song Gallery'}
                {activeModal === 'contact' && 'Contact Voices of Valor'}
              </Dialog.Title>
              <Dialog.Close asChild>
                <button
                  className="text-slate-400 hover:text-white p-1"
                  aria-label="Close dialog"
                >
                  <X className="w-5 h-5" />
                </button>
              </Dialog.Close>
            </div>

            <Dialog.Description asChild>
              <div className="text-sm text-slate-300 leading-relaxed space-y-4 font-sans">
                {activeModal === 'about' && (
                  <>
                    <div className="relative overflow-hidden rounded-xl border border-amber-400/30 shadow-xl bg-black/50 group">
                      <img
                        src="/assets/Johnny & Heidi.png"
                        alt="Johnny and Heidi Bulford"
                        className="w-full max-h-60 sm:max-h-72 object-cover object-top filter brightness-95 group-hover:brightness-100 transition-all duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0c1522] via-transparent to-transparent opacity-90" />
                      <div className="absolute bottom-2.5 left-3.5 right-3.5 flex items-center justify-between text-xs font-mono">
                        <span className="font-headline font-bold uppercase tracking-wider text-white drop-shadow">
                          Johnny & Heidi Bulford
                        </span>
                        <span className="text-amber-300 font-medium drop-shadow text-[11px]">
                          Nashville Songwriters
                        </span>
                      </div>
                    </div>

                    <p>
                      <strong>Voices of Valor</strong> is a live music storytelling series presented by{' '}
                      <span className="text-amber-300 font-semibold">Combat Veterans to Careers</span> and{' '}
                      <span className="text-amber-300 font-semibold">CreatiVets</span> that honors the courage, sacrifice, and
                      strength of our nation’s veterans.
                    </p>
                    <p>
                      Each event features veterans who share their stories, which are then transformed
                      into songs written and performed by talented Nashville songwriters, Johnny and Heidi Bulford.
                    </p>
                    <div className="p-3 bg-black/40 rounded-xl border border-white/10 text-xs font-mono text-amber-300">
                      ★ Real stories. Real heroes. Real impact.
                    </div>
                  </>
                )}

                {activeModal === 'support' && (
                  <>
                    <p>
                      Voices of Valor is made possible through the support of our community.
                      Together, we can ensure that their stories are never forgotten and their legacy
                      lives on through music and healing.
                    </p>
                    <p className="text-xs text-slate-400">
                      To make a contribution, sponsor a veteran songwriting session, or get support:{' '}
                      <a
                        href="mailto:info@combatveteranstocareers.org"
                        className="text-amber-300 hover:underline font-semibold"
                      >
                        info@combatveteranstocareers.org
                      </a>
                    </p>
                  </>
                )}

                {activeModal === 'contact' && (
                  <>
                    <p>
                      <strong>Voices of Valor</strong> proudly welcomes and serves veterans, active duty service members, and military families across <strong>all branches of the United States Armed Forces</strong>:
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 my-2 font-headline uppercase tracking-wider text-xs">
                      <div className="px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-center text-amber-300 font-bold flex items-center justify-center gap-1.5 shadow-sm">
                        <span className="text-vov-redBright text-[10px]">★</span> Army
                      </div>
                      <div className="px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-center text-amber-300 font-bold flex items-center justify-center gap-1.5 shadow-sm">
                        <span className="text-vov-redBright text-[10px]">★</span> Marine Corps
                      </div>
                      <div className="px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-center text-amber-300 font-bold flex items-center justify-center gap-1.5 shadow-sm">
                        <span className="text-vov-redBright text-[10px]">★</span> Navy
                      </div>
                      <div className="px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-center text-amber-300 font-bold flex items-center justify-center gap-1.5 shadow-sm">
                        <span className="text-vov-redBright text-[10px]">★</span> Air Force
                      </div>
                      <div className="px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-center text-amber-300 font-bold flex items-center justify-center gap-1.5 shadow-sm">
                        <span className="text-vov-redBright text-[10px]">★</span> Space Force
                      </div>
                      <div className="px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-center text-amber-300 font-bold flex items-center justify-center gap-1.5 shadow-sm">
                        <span className="text-vov-redBright text-[10px]">★</span> Coast Guard
                      </div>
                    </div>
                    <p>
                      Whether you are a veteran interested in participating in our songwriting sessions, an organization seeking to host a live event, or a community sponsor, we would love to connect with you.
                    </p>
                    <div className="p-3 bg-amber-950/40 rounded-xl border border-amber-500/20 text-xs">
                      <span className="text-slate-300">General, Veteran & Sponsorship Inquiries:</span>{' '}
                      <a
                        href="mailto:info@combatveteranstocareers.org"
                        className="text-amber-300 hover:underline font-semibold block sm:inline mt-1 sm:mt-0 font-mono"
                      >
                        info@combatveteranstocareers.org
                      </a>
                    </div>
                  </>
                )}

                {(activeModal === 'events' || activeModal === 'gallery') && (
                  <>
                    <p>
                      Explore our featured roster below to experience songs and lyrics created directly with
                      veterans across the United States Army, Marine Corps, Navy, Air Force, Space Force, and Coast Guard.
                    </p>
                    <p className="text-xs text-slate-400">
                      For press and event inquiries: <span className="text-amber-300">info@combatveteranstocareers.org</span>
                    </p>
                  </>
                )}
              </div>
            </Dialog.Description>

            <div className="mt-6 flex justify-end">
              <Dialog.Close asChild>
                <button className="px-5 py-2 rounded-xl bg-vov-btn-meet text-white font-headline font-bold text-xs uppercase tracking-wider transition-colors shadow-lg">
                  Close Window
                </button>
              </Dialog.Close>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </nav>
  );
};
