'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { PROMO_BANNERS } from '@/lib/data';
import { useApp } from '@/context/AppContext';
import { Sparkles, ChevronRight, Tag } from 'lucide-react';

export const BannerSlider: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);
  const { setSelectedCategory } = useApp();

  const activeBanners = PROMO_BANNERS.filter((banner) => banner.isActive);
  const totalBanners = activeBanners.length;

  // Auto-scroll 1-by-1 every 3.5 seconds
  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % totalBanners);
  }, [totalBanners]);

  useEffect(() => {
    if (isPaused || totalBanners === 0) return;
    const timer = setInterval(() => {
      nextSlide();
    }, 3500);

    return () => clearInterval(timer);
  }, [isPaused, nextSlide]);

  // Sync scroll position when index changes
  useEffect(() => {
    if (sliderRef.current) {
      const container = sliderRef.current;
      const targetScroll = currentIndex * container.clientWidth;
      container.scrollTo({
        left: targetScroll,
        behavior: 'smooth',
      });
    }
  }, [currentIndex]);

  if (totalBanners === 0) return null;

  // Handle manual scroll detection
  const handleScroll = () => {
    if (sliderRef.current) {
      const container = sliderRef.current;
      const scrollPosition = container.scrollLeft;
      const itemWidth = container.clientWidth;
      if (itemWidth > 0) {
        const newIndex = Math.round(scrollPosition / itemWidth);
        if (newIndex !== currentIndex && newIndex >= 0 && newIndex < totalBanners) {
          setCurrentIndex(newIndex);
        }
      }
    }
  };

  return (
    <div className="w-full px-4 my-2">
      {/* Rectangular Banner Container */}
      <div
        className="relative overflow-hidden rounded-2xl shadow-md border border-pink-100"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
      >
        <div
          ref={sliderRef}
          onScroll={handleScroll}
          className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar scroll-smooth w-full"
          style={{ scrollSnapType: 'x mandatory' }}
        >
          {activeBanners.map((banner) => (
            <div
              key={banner.id}
              className="w-full shrink-0 snap-center relative min-h-[145px] sm:min-h-[155px] p-4 flex flex-col justify-between overflow-hidden cursor-pointer"
              onClick={() => {
                if (banner.categoryFilter) {
                  setSelectedCategory(banner.categoryFilter);
                }
              }}
            >
              {/* Background gradient & image overlay */}
              <div
                className={`absolute inset-0 bg-gradient-to-r ${banner.bgGradient} opacity-90`}
              />
              <div
                className="absolute inset-0 bg-cover bg-center mix-blend-overlay opacity-30"
                style={{ backgroundImage: `url(${banner.image})` }}
              />
              <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-white/15 rounded-full blur-xl pointer-events-none" />

              {/* Content */}
              <div className="relative z-10">
                {/* Badge Tag */}
                <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/85 backdrop-blur-sm text-slate-800 text-[10px] font-bold tracking-wider uppercase mb-1.5 shadow-sm">
                  <Tag className="w-3 h-3 text-pink-600" />
                  {banner.badge}
                </div>

                {/* Banner Title */}
                <h3 className="text-white text-base sm:text-lg font-bold tracking-tight leading-snug drop-shadow-sm">
                  {banner.title}
                </h3>

                {/* Subtitle */}
                <p className="text-white/95 text-xs font-normal mt-1 max-w-[80%] line-clamp-2 leading-relaxed">
                  {banner.subtitle}
                </p>
              </div>

              {/* Bottom Row: Highlight Pill & Action */}
              <div className="relative z-10 flex items-center justify-between mt-2 pt-1 border-t border-white/20">
                <span className="text-[11px] font-medium text-white flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-200" />
                  {banner.highlightText}
                </span>

                <div className="flex items-center gap-0.5 text-xs font-semibold text-white bg-white/20 hover:bg-white/30 backdrop-blur-sm px-2.5 py-1 rounded-xl transition-all">
                  Lihat Promo
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Dynamic Dots Indicator */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-20 pointer-events-none">
          {activeBanners.map((_, i) => (
            <span
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                currentIndex === i
                  ? 'w-5 bg-white shadow-sm'
                  : 'w-1.5 bg-white/40'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
