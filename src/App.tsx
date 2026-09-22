import React, { useState, useMemo, useEffect } from 'react';
import { VETERANS_DATA } from './data/veterans';
import { Veteran } from './types/veteran';
import { Navbar } from './components/Navbar';
import { MemorialHeader } from './components/MemorialHeader';
import { VeteranCard } from './components/VeteranCard';
import { VeteranDetail } from './components/VeteranDetail';
import { SupportBanner } from './components/SupportBanner';
import { PhotoGallery } from './components/PhotoGallery';
import { MilitaryRadioPlaylist } from './components/MilitaryRadioPlaylist';
import { ParchmentFooter } from './components/ParchmentFooter';
import { globalAudioEngine } from './services/audioEngine';
import { Shield } from 'lucide-react';

type AppView = 'home' | 'playlist' | 'detail';

export const App: React.FC = () => {
  const [selectedVeteranId, setSelectedVeteranId] = useState<string | null>(null);
  const [showPlaylist, setShowPlaylist] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('All');

  // Handle URL hash routing (e.g. #john-bircher-iii or #playlist)
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash === 'playlist' || hash === 'radio') {
        setSelectedVeteranId(null);
        setShowPlaylist(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      if (hash) {
        const found = VETERANS_DATA.find((v) => v.id === hash);
        if (found) {
          setShowPlaylist(false);
          setSelectedVeteranId(found.id);
          window.scrollTo({ top: 0, behavior: 'smooth' });
          return;
        }
      }
      setShowPlaylist(false);
      setSelectedVeteranId(null);
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const selectedVeteran = useMemo(() => {
    if (!selectedVeteranId) return null;
    return VETERANS_DATA.find((v) => v.id === selectedVeteranId) || null;
  }, [selectedVeteranId]);

  const view: AppView = showPlaylist ? 'playlist' : selectedVeteran ? 'detail' : 'home';

  // Unique branches for filter bar
  const branches = useMemo(() => {
    const set = new Set(VETERANS_DATA.map((v) => v.branch));
    return ['All', ...Array.from(set)];
  }, []);

  // Filtered list based on search and branch
  const filteredVeterans = useMemo(() => {
    return VETERANS_DATA.filter((vet) => {
      const matchesBranch = selectedBranch === 'All' || vet.branch === selectedBranch;
      const q = searchQuery.toLowerCase().trim();
      const matchesQuery =
        !q ||
        vet.name.toLowerCase().includes(q) ||
        vet.rank.toLowerCase().includes(q) ||
        vet.branch.toLowerCase().includes(q) ||
        vet.serviceEra.toLowerCase().includes(q) ||
        vet.song.title.toLowerCase().includes(q) ||
        vet.song.genre.toLowerCase().includes(q) ||
        vet.lyrics.some((sec) => sec.lines.some((l) => l.text.toLowerCase().includes(q)));

      return matchesBranch && matchesQuery;
    });
  }, [searchQuery, selectedBranch]);

  const handleSelectVeteran = (vet: Veteran) => {
    setShowPlaylist(false);
    setSelectedVeteranId(vet.id);
    window.location.hash = vet.id;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToRoster = () => {
    globalAudioEngine.stop();
    setShowPlaylist(false);
    setSelectedVeteranId(null);
    window.location.hash = '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenPlaylist = () => {
    globalAudioEngine.stop();
    setSelectedVeteranId(null);
    setShowPlaylist(true);
    window.location.hash = 'playlist';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateSection = (sectionId: string) => {
    if (sectionId === 'playlist' || sectionId === 'radio') {
      handleOpenPlaylist();
      return;
    }
    if (sectionId === 'gallery' || sectionId === 'events') {
      if (selectedVeteranId || showPlaylist) {
        setSelectedVeteranId(null);
        setShowPlaylist(false);
        window.location.hash = '';
      }
      setTimeout(() => {
        const el = document.getElementById('photo-gallery-section');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 50);
    } else if (sectionId === 'veterans') {
      if (selectedVeteranId || showPlaylist) {
        setSelectedVeteranId(null);
        setShowPlaylist(false);
        window.location.hash = '';
      }
      setTimeout(() => {
        const el = document.getElementById('meet-veterans-section');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 50);
    }
  };

  return (
    <div className="min-h-screen vov-hero-bg flex flex-col text-slate-100">
      {/* Top Navigation Bar with authentic VOICES OF VALOR branding */}
      <Navbar onHomeClick={handleBackToRoster} onNavigateSection={handleNavigateSection} />

      {/* Main Content Area */}
      <div className="flex-1">
        {view === 'playlist' ? (
          <MilitaryRadioPlaylist onBack={handleBackToRoster} />
        ) : view === 'detail' && selectedVeteran ? (
          <VeteranDetail
            veteran={selectedVeteran}
            allVeterans={VETERANS_DATA}
            onBack={handleBackToRoster}
            onSelectVeteran={handleSelectVeteran}
          />
        ) : (
          <main className="max-w-6xl mx-auto px-4 sm:px-6 pb-12">
            {/* Poster Hero Header */}
            <MemorialHeader
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              selectedBranch={selectedBranch}
              onSelectBranch={setSelectedBranch}
              branches={branches}
            />

            {/* Meet Our Veterans Grid */}
            {filteredVeterans.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 mt-6">
                {filteredVeterans.map((veteran) => (
                  <VeteranCard
                    key={veteran.id}
                    veteran={veteran}
                    onSelect={handleSelectVeteran}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 vov-support-box rounded-2xl max-w-lg mx-auto p-8 border border-slate-700">
                <Shield className="w-10 h-10 text-amber-400 mx-auto mb-3 opacity-60" />
                <h3 className="text-lg font-headline font-bold text-white mb-1 uppercase tracking-wider">
                  No veterans found
                </h3>
                <p className="text-xs text-slate-400 mb-4 font-sans">
                  Try adjusting your search query or branch filter.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedBranch('All');
                  }}
                  className="px-4 py-2 rounded-lg bg-vov-red text-white text-xs font-mono font-medium hover:bg-vov-redBright transition-colors shadow-md"
                >
                  Reset Filters
                </button>
              </div>
            )}

            {/* Support Callout Banner */}
            <SupportBanner />

            {/* Event Photo Gallery */}
            <PhotoGallery />
          </main>
        )}
      </div>

      {/* Authentic Parchment Sponsor Footer */}
      <ParchmentFooter />
    </div>
  );
};
