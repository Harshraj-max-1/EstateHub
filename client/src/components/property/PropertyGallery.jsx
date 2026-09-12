import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Maximize2, X } from 'lucide-react';
import { getImageUrl } from '../../utils/formatters';

const PropertyGallery = ({ images = [], title = 'Property Image' }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const imageList = images.length > 0
    ? images
    : [{ url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80' }];

  const handlePrev = (e) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? imageList.length - 1 : prev - 1));
  };

  const handleNext = (e) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev === imageList.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Main Image Showcase */}
      <div className="relative h-80 sm:h-[480px] w-full rounded-3xl overflow-hidden bg-slate-950 group">
        <img
          src={getImageUrl(imageList[currentIndex]?.url)}
          alt={`${title} - Photo ${currentIndex + 1}`}
          className="w-full h-full object-cover transition-all duration-500"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20 pointer-events-none" />

        {/* Counter Badge */}
        <div className="absolute bottom-4 left-4 px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-white text-xs font-bold">
          {currentIndex + 1} / {imageList.length} Photos
        </div>

        {/* Fullscreen Trigger */}
        <button
          onClick={() => setIsLightboxOpen(true)}
          className="absolute top-4 right-4 p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-900 backdrop-blur-md text-white transition-all shadow-lg cursor-pointer"
          title="Full-screen viewer"
        >
          <Maximize2 className="w-4 h-4" />
        </button>

        {/* Left / Right Nav Arrows */}
        {imageList.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-2xl bg-white/80 dark:bg-slate-900/80 hover:bg-white dark:hover:bg-slate-900 backdrop-blur-md text-slate-800 dark:text-white shadow-lg transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-2xl bg-white/80 dark:bg-slate-900/80 hover:bg-white dark:hover:bg-slate-900 backdrop-blur-md text-slate-800 dark:text-white shadow-lg transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnail Strip */}
      {imageList.length > 1 && (
        <div className="flex items-center gap-2.5 overflow-x-auto pb-1">
          {imageList.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`relative h-20 w-28 flex-shrink-0 rounded-2xl overflow-hidden border-2 transition-all cursor-pointer ${
                currentIndex === idx
                  ? 'border-indigo-600 shadow-md scale-95'
                  : 'border-transparent opacity-70 hover:opacity-100'
              }`}
            >
              <img
                src={getImageUrl(img.url)}
                alt={`Thumbnail ${idx + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Fullscreen Lightbox Modal */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4">
          <button
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-6 right-6 p-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="relative max-w-5xl max-h-[85vh] w-full flex items-center justify-center">
            <img
              src={getImageUrl(imageList[currentIndex]?.url)}
              alt="Full view"
              className="max-h-[80vh] max-w-full object-contain rounded-2xl shadow-2xl"
            />

            {imageList.length > 1 && (
              <>
                <button
                  onClick={handlePrev}
                  className="absolute left-2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md cursor-pointer"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={handleNext}
                  className="absolute right-2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md cursor-pointer"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
          </div>

          <div className="absolute bottom-6 text-white text-xs font-bold px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md">
            {currentIndex + 1} / {imageList.length} Photos
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyGallery;
