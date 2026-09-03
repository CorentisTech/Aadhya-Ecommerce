"use client";

import React, { useState, useEffect, useRef } from 'react';
import { PRODUCTS, Product } from '../../data/mockData';
import { useApp } from '../../context/AppContext';
import { Heart, ChevronLeft, ChevronRight, ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

export const NewArrivals: React.FC = () => {
  const { toggleWishlist, isInWishlist } = useApp();
  const router = useRouter();

  // Curated 7 New Arrivals fashion products
  const NEW_ARRIVAL_IDS = [
    'f-new-1',     // Emerald Georgette Maxi Gown
    'f-new-2',     // Handloom Banarasi Silk Saree
    'f-new-3',     // Crimson Velvet Embroidered Kaftan
    'f-prod-cat-2',// Fine Cotton Blazer Dress
    'f-prod-cat-3',// Chanderi Silk Anarkali Suit
    'f-prod-cat-1',// Striped Shirt Dress
    'f-prod-4'     // Oversized Cotton Tee
  ];

  const newProducts = NEW_ARRIVAL_IDS
    .map((id) => PRODUCTS.find((p) => p.id === id))
    .filter(Boolean) as Product[];

  const [activeIndex, setActiveIndex] = useState(1);
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Track screen size for mobile gestures vs web autoplay
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Web step-by-step loop (every 2.8 seconds, pauses on hover)
  useEffect(() => {
    if (isMobile || isHovered || newProducts.length === 0) return;

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % newProducts.length);
    }, 2800);

    return () => clearInterval(interval);
  }, [isMobile, isHovered, newProducts.length]);

  // Desktop step handlers (infinite stuck loop)
  const handlePrevWeb = () => {
    setActiveIndex((prev) => (prev - 1 + newProducts.length) % newProducts.length);
  };

  const handleNextWeb = () => {
    setActiveIndex((prev) => (prev + 1) % newProducts.length);
  };

  // Mobile hand swipe gesture (strictly NOT looping, stops at edges)
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchEndX.current = null;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return;
    const diff = touchStartX.current - touchEndX.current;

    // Minimum swipe threshold of 40px
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        // Swiped Left: Advance forward, clamp at the end (not loop)
        setActiveIndex((prev) => Math.min(newProducts.length - 1, prev + 1));
      } else {
        // Swiped Right: Advance backward, clamp at the start (not loop)
        setActiveIndex((prev) => Math.max(0, prev - 1));
      }
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  // 3D Perspective Coverflow positioning relative to active index
  const getCardStyle = (index: number) => {
    const total = newProducts.length;
    let diff = index - activeIndex;

    // Wrap diff for circular web display
    if (!isMobile) {
      if (diff > total / 2) diff -= total;
      if (diff < -total / 2) diff += total;
    }

    // Center Card: Main attention, extra zoom, facing forward
    if (diff === 0) {
      return {
        x: '0%',
        scale: 1.08,
        rotateY: 0,
        zIndex: 30,
        opacity: 1,
        filter: 'brightness(1)',
        pointerEvents: 'auto' as const
      };
    }

    // Immediate Left Card
    if (diff === -1) {
      return {
        x: '-72%',
        scale: 0.86,
        rotateY: 22,
        zIndex: 20,
        opacity: 0.85,
        filter: 'brightness(0.75)',
        pointerEvents: 'auto' as const
      };
    }

    // Immediate Right Card
    if (diff === 1) {
      return {
        x: '72%',
        scale: 0.86,
        rotateY: -22,
        zIndex: 20,
        opacity: 0.85,
        filter: 'brightness(0.75)',
        pointerEvents: 'auto' as const
      };
    }

    // Far Left Card
    if (diff === -2) {
      return {
        x: '-132%',
        scale: 0.70,
        rotateY: 38,
        zIndex: 10,
        opacity: 0.45,
        filter: 'brightness(0.5)',
        pointerEvents: 'auto' as const
      };
    }

    // Far Right Card
    if (diff === 2) {
      return {
        x: '132%',
        scale: 0.70,
        rotateY: -38,
        zIndex: 10,
        opacity: 0.45,
        filter: 'brightness(0.5)',
        pointerEvents: 'auto' as const
      };
    }

    // Distant hidden cards
    return {
      x: diff > 0 ? '180%' : '-180%',
      scale: 0.5,
      rotateY: diff > 0 ? -45 : 45,
      zIndex: 0,
      opacity: 0,
      filter: 'brightness(0.3)',
      pointerEvents: 'none' as const
    };
  };

  return (
    <section 
      id="new-arrivals" 
      className="w-full max-w-full py-12 md:py-20 px-4 md:px-12 lg:px-24 bg-[#0D0B0A] text-white border-b border-white/10 overflow-hidden select-none relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-r from-[#F26A2E]/10 via-[#D4AF37]/10 to-transparent blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto space-y-8 md:space-y-12 relative z-10 text-center">
        
        {/* Header Block (Inspired by media_1788455303236.png) */}
        <div className="flex flex-col items-center justify-center space-y-2.5 max-w-2xl mx-auto">
          <span className="text-[9px] sm:text-[11px] text-[#F26A2E] font-extrabold tracking-[0.25em] uppercase px-3 py-1 bg-white/5 border border-white/10 rounded-full flex items-center gap-1.5 shadow-sm">
            <Sparkles className="w-3 h-3 text-[#F26A2E]" />
            <span>NEW RUNWAY ARRIVALS</span>
          </span>

          <h2 className="font-display font-medium text-3xl sm:text-4xl md:text-5xl text-white tracking-tight leading-[1.15]">
            Fresh Off The Runway
          </h2>
          
          <p className="text-xs sm:text-sm text-[#A09890] font-medium max-w-md">
            Discover handcrafted haute couture silhouettes, vibrant artisanal prints, and timeless contemporary draping.
          </p>
        </div>

        {/* ==================================================
            3D COVERFLOW PERSPECTIVE CAROUSEL STAGE
           ================================================== */}
        <div 
          className="relative w-full h-[400px] sm:h-[460px] md:h-[520px] flex items-center justify-center [perspective:1200px] [transform-style:preserve-3d] touch-pan-y"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {newProducts.map((product, idx) => {
            const inWishlist = isInWishlist(product.id);
            const slug = product.name.toLowerCase().replace(/ /g, '-');
            const style = getCardStyle(idx);
            const isCenter = idx === activeIndex;

            return (
              <motion.div
                key={product.id}
                animate={{
                  x: style.x,
                  scale: style.scale,
                  rotateY: style.rotateY,
                  opacity: style.opacity,
                  zIndex: style.zIndex
                }}
                transition={{
                  duration: 0.65,
                  ease: [0.25, 1, 0.5, 1]
                }}
                style={{
                  filter: style.filter,
                  pointerEvents: style.pointerEvents
                }}
                onClick={() => {
                  if (isCenter) {
                    router.push(`/product/${slug}`);
                  } else {
                    setActiveIndex(idx);
                  }
                }}
                className="absolute w-[220px] sm:w-[260px] md:w-[300px] aspect-[9/14] rounded-[24px] sm:rounded-[30px] overflow-hidden cursor-pointer shadow-2xl transition-all duration-300 group border border-white/20 bg-[#161311]"
              >
                {/* Full-Bleed Product Photography */}
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />

                {/* Dark Vignette Overlay for Text Legibility (Matching Reference Image) */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/35 to-transparent pointer-events-none" />

                {/* Top Left Badge */}
                <div className="absolute top-3.5 left-3.5 pointer-events-none">
                  <span className="text-[7px] sm:text-[8px] bg-[#E0591D] text-white font-black tracking-widest px-2.5 py-0.5 rounded-full uppercase shadow-md">
                    NEW
                  </span>
                </div>

                {/* Top Right Wishlist Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleWishlist(product);
                  }}
                  className={`absolute top-3.5 right-3.5 p-2 rounded-full border backdrop-blur-md transition-all shadow-md ${
                    inWishlist
                      ? 'bg-[#E0591D] border-[#E0591D] text-white'
                      : 'bg-black/40 border-white/20 text-white hover:bg-white hover:text-black'
                  }`}
                  aria-label="Wishlist"
                >
                  <Heart className={`w-3.5 h-3.5 ${inWishlist ? 'fill-white' : ''}`} />
                </button>

                {/* Bottom Overlay Details (Exact Style from media_1788455303236.png) */}
                <div className="absolute bottom-0 inset-x-0 p-4 sm:p-5 text-center flex flex-col items-center justify-end space-y-1.5">
                  <span className="text-[8px] sm:text-[9px] font-extrabold text-[#F26A2E] tracking-[0.2em] uppercase">
                    {product.occasion || 'SUMMER RUNWAY'}
                  </span>

                  <h3 className="font-display font-medium text-sm sm:text-base md:text-lg text-white leading-tight drop-shadow-md line-clamp-2">
                    {product.name}
                  </h3>

                  <div className="flex items-center gap-2 pt-0.5">
                    <span className="text-xs sm:text-sm font-bold text-white">
                      ₹{product.price.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[10px] sm:text-xs text-white/60 line-through">
                      ₹{product.mrp.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[8px] sm:text-[9px] font-extrabold text-[#F26A2E] bg-white/10 px-1.5 py-0.5 rounded">
                      {product.discount}% OFF
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* ==================================================
            CONTROLS: Left & Right Arrows (Web Screen) & Dots
           ================================================== */}
        <div className="flex items-center justify-between pt-2 max-w-xs sm:max-w-md mx-auto">
          {/* Left Arrow Button (Web screen) */}
          <button
            onClick={handlePrevWeb}
            className="w-10 h-10 rounded-full border border-white/20 bg-white/5 hover:bg-white text-white hover:text-black flex items-center justify-center transition-all shadow-md cursor-pointer backdrop-blur-xs"
            aria-label="Previous card"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Dots Indicator */}
          <div className="flex items-center gap-1.5">
            {newProducts.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                  activeIndex === i ? 'w-6 bg-[#F26A2E]' : 'w-1.5 bg-white/30 hover:bg-white/60'
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>

          {/* Right Arrow Button (Web screen) */}
          <button
            onClick={handleNextWeb}
            className="w-10 h-10 rounded-full border border-white/20 bg-white/5 hover:bg-white text-white hover:text-black flex items-center justify-center transition-all shadow-md cursor-pointer backdrop-blur-xs"
            aria-label="Next card"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* View All Button */}
        <div className="pt-2">
          <button
            onClick={() => router.push('/catalog?collection=new-arrivals')}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-white/20 text-white text-xs font-bold tracking-[0.2em] uppercase hover:bg-white hover:text-black transition-all shadow-sm"
          >
            <span>VIEW ALL RUNWAY ARRIVALS</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </section>
  );
};
