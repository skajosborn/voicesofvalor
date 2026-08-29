import React, { useState, useMemo, useEffect } from 'react';
import { VETERANS_DATA } from './data/veterans';
import { Veteran } from './types/veteran';
import { Navbar } from './components/Navbar';
import { MemorialHeader } from './components/MemorialHeader';
import { VeteranCard } from './components/VeteranCard';
import { VeteranDetail } from './components/VeteranDetail';
import { SupportBanner } from './components/SupportBanner';
import { ParchmentFooter } from './components/ParchmentFooter';
import { globalAudioEngine } from './services/audioEngine';
import { Shield } from 'lucide-react';

export const App: React.FC = () => {
  const [selectedVeteranId, setSelectedVeteranId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('All');

  // Handle URL hash routing (e.g. #john-bircher-iii)
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash) {
        const found = VETERANS_DATA.find((v) => v.id === hash);
        if (found) {
          setSelectedVeteranId(found.id);
          window.scrollTo({ top: 0, behavior: 'smooth' });
          return;
        }
      }
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
        vet.song.title.toLowerCase().includes(q) ||
        vet.song.genre.toLowerCase().includes(q) ||
        vet.hometown.toLowerCase().includes(q) ||
        vet.lyrics.some((sec) => sec.lines.some((l) => l.text.toLowerCase().includes(q)));

      return matchesBranch && matchesQuery;
    });
  }, [searchQuery, selectedBranch]);

  const handleSelectVeteran = (vet: Veteran) => {
    setSelectedVeteranId(vet.id);
    window.location.hash = vet.id;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToRoster = () => {
    globalAudioEngine.stop();
    setSelectedVeteranId(null);
    window.location.hash = '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen vov-hero-bg flex flex-col text-slate-100">
      {/* Top Navigation Bar with authentic VOICES OF VALOR branding */}
      <Navbar onHomeClick={handleBackToRoster} />

      {/* Main Content Area */}
      <div className="flex-1">
        {selectedVeteran ? (
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

            {/* Meet Our Veterans Grid (2 rows of 3 = 6 veterans) */}
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
          </main>
        )}
      </div>

      {/* Authentic Parchment Sponsor Footer */}
      <ParchmentFooter />
    </div>
  );
};
