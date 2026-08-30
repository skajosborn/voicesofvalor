import React, { useState, useEffect, useMemo, useCallback } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { GALLERY_PHOTOS, GalleryPhoto } from '../data/gallery';
import {
  Camera,
  ChevronLeft,
  ChevronRight,
  X,
  Sparkles,
  Eye,
  Grid
} from 'lucide-react';

export const PhotoGallery: React.FC = () => {
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState<'all' | 'performance' | 'veterans' | 'community'>('all');
  const [visibleCount, setVisibleCount] = useState<number>(16);
  const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({});

  // Filter photos based on category
  const filteredPhotos = useMemo(() => {
    if (activeCategory === 'all') return GALLERY_PHOTOS;
    return GALLERY_PHOTOS.filter((photo) => photo.category === activeCategory);
  }, [activeCategory]);

  // Current batch of displayed photos
  const displayedPhotos = useMemo(() => {
    return filteredPhotos.slice(0, visibleCount);
  }, [filteredPhotos, visibleCount]);

  const hasMore = visibleCount < filteredPhotos.length;

  const handleLoadMore = () => {
    setVisibleCount((prev) => Math.min(prev + 16, filteredPhotos.length));
  };

  const handleShowAll = () => {
    setVisibleCount(filteredPhotos.length);
  };

  const currentSelectedPhoto: GalleryPhoto | null = useMemo(() => {
    if (selectedPhotoIndex === null || selectedPhotoIndex < 0 || selectedPhotoIndex >= filteredPhotos.length) {
      return null;
    }
    return filteredPhotos[selectedPhotoIndex];
  }, [selectedPhotoIndex, filteredPhotos]);

  const handleOpenLightbox = (index: number) => {
    setSelectedPhotoIndex(index);
  };

  const handleCloseLightbox = () => {
    setSelectedPhotoIndex(null);
  };

  const handleNextPhoto = useCallback(() => {
    if (selectedPhotoIndex === null) return;
    setSelectedPhotoIndex((prev) => ((prev! + 1) % filteredPhotos.length));
  }, [selectedPhotoIndex, filteredPhotos.length]);

  const handlePrevPhoto = useCallback(() => {
    if (selectedPhotoIndex === null) return;
    setSelectedPhotoIndex((prev) => ((prev! - 1 + filteredPhotos.length) % filteredPhotos.length));
  }, [selectedPhotoIndex, filteredPhotos.length]);

  // Keyboard navigation for Lightbox
  useEffect(() => {
    if (selectedPhotoIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        handleNextPhoto();
      } else if (e.key === 'ArrowLeft') {
        handlePrevPhoto();
      } else if (e.key === 'Escape') {
        handleCloseLightbox();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedPhotoIndex, handleNextPhoto, handlePrevPhoto]);

  return (
    <section id="photo-gallery-section" className="relative mt-16 sm:mt-24 pt-8 border-t border-amber-900/30">
      {/* Decorative Top Accent Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 max-w-3xl h-px bg-gradient-to-r from-transparent via-amber-400/50 to-transparent" />

      {/* Header Container */}
      <div className="text-center max-w-3xl mx-auto px-4 mb-8 sm:mb-12">
        {/* Vintage Top Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-[#121e2d] border border-amber-400/30 text-amber-300 font-mono text-xs uppercase tracking-widest shadow-inner mb-3">
          <Camera className="w-3.5 h-3.5 text-amber-400" />
          <span>Voices of Valor Archive</span>
          <span className="text-slate-500">•</span>
          <span className="text-slate-300 font-semibold">{GALLERY_PHOTOS.length} Moments Captured</span>
        </div>

        {/* Section Headline */}
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-headline font-bold text-white tracking-wider uppercase drop-shadow-md">
          EVENT PHOTO GALLERY
        </h2>

        {/* Ribbon divider */}
        <div className="flex items-center justify-center gap-3 my-3">
          <span className="h-px w-12 sm:w-20 bg-gradient-to-r from-transparent to-vov-redBright" />
          <span className="text-vov-redBright text-sm">★ ★ ★</span>
          <span className="h-px w-12 sm:w-20 bg-gradient-to-l from-transparent to-vov-redBright" />
        </div>

        <p className="text-sm sm:text-base text-slate-300 font-sans leading-relaxed max-w-2xl mx-auto">
          Experience the unforgettable camaraderie, emotional songwriting rounds, and community tributes honoring our nation’s veterans through live music.
        </p>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mt-6">
          <button
            onClick={() => {
              setActiveCategory('all');
              setVisibleCount(16);
            }}
            className={`px-4 py-1.5 rounded-full text-xs font-headline font-bold tracking-wider uppercase transition-all duration-200 border ${
              activeCategory === 'all'
                ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-lg shadow-amber-400/20'
                : 'bg-[#0f1926] text-slate-300 border-white/10 hover:border-amber-400/40 hover:text-white'
            }`}
          >
            All Moments ({GALLERY_PHOTOS.length})
          </button>

          <button
            onClick={() => {
              setActiveCategory('performance');
              setVisibleCount(16);
            }}
            className={`px-4 py-1.5 rounded-full text-xs font-headline font-bold tracking-wider uppercase transition-all duration-200 border ${
              activeCategory === 'performance'
                ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-lg shadow-amber-400/20'
                : 'bg-[#0f1926] text-slate-300 border-white/10 hover:border-amber-400/40 hover:text-white'
            }`}
          >
            Live Performances
          </button>

          <button
            onClick={() => {
              setActiveCategory('veterans');
              setVisibleCount(16);
            }}
            className={`px-4 py-1.5 rounded-full text-xs font-headline font-bold tracking-wider uppercase transition-all duration-200 border ${
              activeCategory === 'veterans'
                ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-lg shadow-amber-400/20'
                : 'bg-[#0f1926] text-slate-300 border-white/10 hover:border-amber-400/40 hover:text-white'
            }`}
          >
            Veteran Honorees
          </button>

          <button
            onClick={() => {
              setActiveCategory('community');
              setVisibleCount(16);
            }}
            className={`px-4 py-1.5 rounded-full text-xs font-headline font-bold tracking-wider uppercase transition-all duration-200 border ${
              activeCategory === 'community'
                ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-lg shadow-amber-400/20'
                : 'bg-[#0f1926] text-slate-300 border-white/10 hover:border-amber-400/40 hover:text-white'
            }`}
          >
            Community & Family
          </button>
        </div>
      </div>

      {/* Photo Gallery Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
        {displayedPhotos.map((photo, index) => (
          <div
            key={photo.id}
            onClick={() => handleOpenLightbox(index)}
            className="group relative cursor-pointer overflow-hidden rounded-xl bg-[#0d1724] border border-white/10 shadow-lg hover:border-amber-400/60 transition-all duration-300 hover:shadow-2xl hover:shadow-amber-500/10"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleOpenLightbox(index);
              }
            }}
            aria-label={`View ${photo.alt}`}
          >
            {/* Aspect Ratio Container */}
            <div className="relative w-full pb-[80%] sm:pb-[85%] overflow-hidden bg-slate-950">
              <img
                src={photo.src}
                alt={photo.alt}
                loading="lazy"
                onLoad={() => setLoadedImages((prev) => ({ ...prev, [photo.id]: true }))}
                className={`absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-108 ${
                  loadedImages[photo.id] ? 'opacity-100' : 'opacity-80'
                }`}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/assets/newVVhero.png';
                }}
              />

              {/* Gradient Vignette */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-40 group-hover:opacity-75 transition-opacity duration-300" />

              {/* Hover Badge / View Icon */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="p-2.5 rounded-full bg-black/60 backdrop-blur-md border border-amber-400/50 text-amber-300 transform scale-75 group-hover:scale-100 transition-transform duration-300 shadow-xl">
                  <Eye className="w-5 h-5" />
                </div>
              </div>

              {/* Bottom Caption Overlay */}
              <div className="absolute bottom-0 inset-x-0 p-2.5 sm:p-3 transform translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                <p className="text-[11px] font-mono font-medium text-amber-300 uppercase tracking-wider truncate">
                  Photo #{index + 1}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination / Load More Controls */}
      {hasMore && (
        <div className="mt-8 sm:mt-12 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={handleLoadMore}
            className="w-full sm:w-auto px-8 py-3 rounded-xl bg-[#121f30] hover:bg-[#182a40] text-amber-300 font-headline font-bold text-sm uppercase tracking-wider border border-amber-400/30 hover:border-amber-400 transition-all shadow-lg hover:shadow-amber-500/10 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Grid className="w-4 h-4" />
            <span>Load More Photos ({displayedPhotos.length} of {filteredPhotos.length})</span>
          </button>

          <button
            onClick={handleShowAll}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-vov-red hover:bg-vov-redBright text-white font-headline font-bold text-sm uppercase tracking-wider border border-red-500/40 transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>Show All {filteredPhotos.length} Photos</span>
          </button>
        </div>
      )}

      {/* Lightbox Modal with Full Keyboard & Navigation Support */}
      <Dialog.Root open={selectedPhotoIndex !== null} onOpenChange={(open) => !open && handleCloseLightbox()}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/92 backdrop-blur-md z-50 animate-fade-in" />
          
          <Dialog.Content
            className="fixed inset-0 z-50 flex flex-col items-center justify-between p-3 sm:p-6 focus:outline-none select-none"
            onKeyDown={(e) => {
              if (e.key === 'ArrowRight') handleNextPhoto();
              if (e.key === 'ArrowLeft') handlePrevPhoto();
            }}
          >
            {/* Top Toolbar */}
            <div className="w-full max-w-6xl flex items-center justify-between text-white pb-3 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="px-3 py-1 rounded-full bg-white/10 border border-white/10 text-amber-300 font-mono text-xs">
                  {selectedPhotoIndex !== null ? `${selectedPhotoIndex + 1} / ${filteredPhotos.length}` : ''}
                </div>
                <Dialog.Title className="text-xs sm:text-sm font-headline uppercase tracking-wider text-slate-300 truncate max-w-[200px] sm:max-w-md">
                  Voices of Valor — Live Event
                </Dialog.Title>
              </div>

              {/* Close Button */}
              <Dialog.Close asChild>
                <button
                  className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors cursor-pointer"
                  aria-label="Close photo preview"
                >
                  <X className="w-6 h-6" />
                </button>
              </Dialog.Close>
            </div>

            {/* Main Stage Image Area with Side Navigation Buttons */}
            <div className="relative w-full max-w-5xl flex-1 flex items-center justify-center py-2">
              {/* Previous Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrevPhoto();
                }}
                className="absolute left-1 sm:left-4 z-10 p-3 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/20 hover:border-amber-400 transition-all hover:scale-110 cursor-pointer shadow-2xl focus:outline-none"
                aria-label="Previous photo"
              >
                <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8" />
              </button>

              {/* Active Image */}
              {currentSelectedPhoto && (
                <div className="relative max-h-[75vh] max-w-full flex items-center justify-center">
                  <img
                    src={currentSelectedPhoto.src}
                    alt={currentSelectedPhoto.alt}
                    className="max-h-[75vh] w-auto max-w-full object-contain rounded-lg border border-white/20 shadow-2xl animate-fade-in"
                  />
                </div>
              )}

              {/* Next Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleNextPhoto();
                }}
                className="absolute right-1 sm:right-4 z-10 p-3 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/20 hover:border-amber-400 transition-all hover:scale-110 cursor-pointer shadow-2xl focus:outline-none"
                aria-label="Next photo"
              >
                <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8" />
              </button>
            </div>

            {/* Bottom Caption Card */}
            {currentSelectedPhoto && (
              <div className="w-full max-w-3xl bg-[#0c1522]/90 backdrop-blur-md p-3 sm:p-4 rounded-xl border border-amber-400/20 text-center shadow-xl mb-1 sm:mb-2">
                <p className="text-xs sm:text-sm text-slate-200 font-sans">
                  {currentSelectedPhoto.caption}
                </p>
                <div className="flex items-center justify-center gap-4 mt-2 text-[11px] font-mono text-amber-300/80">
                  <span>Photo {selectedPhotoIndex! + 1} of {filteredPhotos.length}</span>
                  <span>•</span>
                  <span>Use ← → keys to browse</span>
                </div>
              </div>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </section>
  );
};
