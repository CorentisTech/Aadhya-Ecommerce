"use client";

import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { PRODUCTS } from '../../data/mockData';
import { Heart, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Image scaling and alignment configuration per hero product
// Ensures the actual visible model is enlarged to 75-90% of the visual container without cropping edges
const IMAGE_CONFIGS: Record<string, { scale: number; x: number; y: number }> = {
  'f-prod-7': { scale: 1.45, x: 0, y: -2 }, // Rose Silk Saree
  'f-prod-1': { scale: 1.35, x: 0, y: -3 }, // Floral Midi Dress
  'f-prod-3': { scale: 1.30, x: 0, y: -2 }, // Ribbed Knit Sweater
  'f-prod-8': { scale: 1.40, x: 0, y: -4 }, // Ivory Saree
  'f-prod-2': { scale: 1.28, x: 0, y: -2 }  // Pink Bow Top
};

export const Hero: React.FC = () => {
  const { addToCart, toggleWishlist, isInWishlist, setSelectedProduct } = useApp();
  
  // Filter bestsellers for the hero showcase (strictly the 5 original cutout models with IMAGE_CONFIGS)
  const HERO_PRODUCT_IDS = ['f-prod-7', 'f-prod-1', 'f-prod-3', 'f-prod-8', 'f-prod-2'];
  const bestsellers = HERO_PRODUCT_IDS.map((id) => PRODUCTS.find((p) => p.id === id)).filter(Boolean) as (typeof PRODUCTS)[0][];
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // Monitor screen width to remove height limits on mobile viewports
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // States for size/color selections
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');

  // Auto-play slideshow (transitions every 7 seconds)
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % bestsellers.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [bestsellers.length]);

  const currentProduct = bestsellers[activeIndex];
  const inWishlist = isInWishlist(currentProduct.id);

  // Set default selection values once product is loaded
  useEffect(() => {
    if (currentProduct) {
      setSelectedSize(currentProduct.sizes && currentProduct.sizes.length > 0 ? currentProduct.sizes[0] : '');
      setSelectedColor(currentProduct.colors && currentProduct.colors.length > 0 ? currentProduct.colors[0] : '');
    }
  }, [currentProduct]);

  // Model entry/exit transitions: old model scales down/fades, new model scales up/fades
  const modelVariants = {
    initial: { opacity: 0, scale: 0.96 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.96 }
  };

  const imageConfig = IMAGE_CONFIGS[currentProduct.id] || { scale: 1.25, x: 0, y: 0 };

  return (
    <section 
      className="w-full max-w-full relative flex items-center justify-center py-3 sm:py-16 px-4 sm:px-12 lg:px-24 overflow-hidden border-b border-brand-border/40 select-none bg-[#FFFFFF]"
      style={{
        // 80-90% warm white with subtle orange glow influence
        background: 'radial-gradient(circle at 75% 50%, rgba(242, 106, 46, 0.05) 0%, rgba(255, 255, 255, 1) 70%), #FFFFFF',
        minHeight: isMobile ? 'auto' : 'clamp(480px, 78vh, 650px)'
      }}
    >
      {/* 2-column responsive layout (Side-by-side on mobile as well to prevent stacking) */}
      <div className="max-w-7xl mx-auto w-full grid grid-cols-12 gap-2 sm:gap-8 items-center z-10 relative">
        
        {/* Left Column: Product Information (7 cols on mobile, 5 cols on desktop) */}
        <div className="col-span-7 lg:col-span-5 flex flex-col justify-center space-y-2 sm:space-y-6 text-left">
          
          <div className="space-y-1">
            <span className="text-[7px] sm:text-[10px] font-extrabold text-[#F26A2E] tracking-[0.25em] uppercase border-b border-[#F9E1D3] pb-0.5">
              ★ BESTSELLER SHOWCASE
            </span>
          </div>

          <div className="space-y-2 sm:space-y-4">
            {/* Title */}
            <h1 className="font-display font-bold text-brand-espresso tracking-tight text-base sm:text-4xl lg:text-5xl leading-[1.15] uppercase">
              {currentProduct.name}
            </h1>
            
            {/* Description */}
            <p className="text-[9px] sm:text-xs text-brand-warmGray tracking-wide font-semibold max-w-sm leading-relaxed line-clamp-2 sm:line-clamp-none">
              {currentProduct.description}
            </p>

            {/* Price section */}
            <div className="flex items-center space-x-1.5 pt-0.5">
              <span className="text-sm sm:text-2xl font-extrabold text-brand-espresso">
                ₹{currentProduct.price.toLocaleString('en-IN')}
              </span>
              <span className="text-[10px] sm:text-sm text-brand-warmGray line-through font-semibold">
                ₹{currentProduct.mrp.toLocaleString('en-IN')}
              </span>
              <span className="text-[7px] sm:text-[9px] text-[#F26A2E] bg-[#FFF3EC] border border-[#F9E1D3] px-1 py-0.5 rounded font-extrabold tracking-widest">
                {currentProduct.discount}%
              </span>
            </div>

            {/* Selectors */}
            <div className="space-y-2 pt-1.5 border-t border-brand-border/40 max-w-xs">
              {currentProduct.sizes && currentProduct.sizes.length > 0 && (
                <div className="space-y-1">
                  <span className="text-[7px] sm:text-[9px] font-bold text-[#756E69] tracking-widest block uppercase">
                    SIZE:
                  </span>
                  <div className="flex gap-1">
                    {currentProduct.sizes.map((s) => (
                      <button
                        key={s}
                        onClick={() => setSelectedSize(s)}
                        className={`px-1.5 py-0.5 sm:px-3 sm:py-1 border text-[8px] sm:text-[10px] font-bold rounded transition-all duration-300 ${
                          selectedSize === s
                            ? 'border-brand-espresso bg-brand-espresso text-brand-white'
                            : 'border-brand-border text-brand-warmGray hover:bg-[#FFF3EC] hover:border-[#F9E1D3]'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {currentProduct.colors && currentProduct.colors.length > 0 && (
                <div className="space-y-1">
                  <span className="text-[7px] sm:text-[9px] font-bold text-[#756E69] tracking-widest block uppercase">
                    COLOR:
                  </span>
                  <div className="flex gap-1">
                    {currentProduct.colors.map((c) => (
                      <button
                        key={c}
                        onClick={() => setSelectedColor(c)}
                        className={`w-3.5 h-3.5 sm:w-5 sm:h-5 rounded-full border transition-all duration-300 ${
                          selectedColor === c
                            ? 'scale-110 border-brand-espresso ring-1 ring-brand-blush'
                            : 'border-brand-border hover:opacity-85'
                        }`}
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action Row */}
          <div className="flex items-center gap-1.5 pt-1.5">
            <button
              onClick={() => addToCart(currentProduct, 1, selectedSize, selectedColor)}
              className="py-1 px-2.5 sm:py-3 sm:px-6 bg-[#2C2522] text-[#FCFAF7] text-[8px] sm:text-xs font-bold tracking-[0.2em] uppercase hover:bg-[#F26A2E] hover:text-[#FCFAF7] transition-all duration-300 shadow rounded-lg"
            >
              ADD
            </button>
            
            <button
              onClick={() => setSelectedProduct(currentProduct)}
              className="py-1 px-2.5 sm:py-3 sm:px-6 border border-brand-border text-brand-espresso text-[8px] sm:text-xs font-bold tracking-[0.2em] uppercase hover:bg-[#FFF3EC] hover:border-[#F9E1D3] transition-all duration-300 flex items-center gap-0.5 rounded-lg"
            >
              <span>EXPLORE</span>
              <ArrowRight className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5" />
            </button>

            <button
              onClick={() => toggleWishlist(currentProduct)}
              className={`p-1.5 sm:p-3 border rounded-lg transition-all duration-300 ${
                inWishlist
                  ? 'bg-brand-blush border-brand-dustyRose text-brand-dustyRose'
                  : 'border-brand-border hover:bg-[#FFF3EC] hover:border-[#F9E1D3] text-brand-warmGray'
              }`}
              aria-label="Wishlist Product"
            >
              <Heart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${inWishlist ? 'fill-brand-dustyRose' : ''}`} />
            </button>
          </div>

          {/* Slide dots indicators */}
          <div className="flex space-x-2 pt-2">
            {bestsellers.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                aria-label={`Go to slide ${index + 1}`}
                className={`h-1 rounded-full transition-all duration-300 ${
                  activeIndex === index ? 'w-5 bg-[#F26A2E]' : 'w-1.5 bg-[#F4EFE9]'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Right Column: Large Cutout Model Visual (5 cols on mobile, 7 cols on desktop) */}
        <div className="col-span-5 lg:col-span-7 flex justify-center items-center relative">
          <div className="w-full max-w-[420px] aspect-[4/5] flex items-center justify-center relative overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentProduct.id}
                variants={modelVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="w-full h-full flex items-center justify-center cursor-pointer"
                onClick={() => setSelectedProduct(currentProduct)}
              >
                {/* 
                  Enlarged visual model cutout:
                  - object-fit: contain to prevent cropping head/feet
                  - translate offsets and scaling derived per-product
                  - soft subtle drop shadow overlay for premium depth
                */}
                <div className="relative w-full h-[180px] sm:h-[340px] lg:h-[480px] flex items-center justify-center">
                  <motion.img
                    src={currentProduct.image}
                    alt={currentProduct.name}
                    className="max-h-full w-full object-contain mix-blend-multiply pointer-events-none"
                    style={{
                      transform: `scale(${imageConfig.scale}) translate(${imageConfig.x}%, ${imageConfig.y}%)`,
                      filter: 'drop-shadow(0 15px 20px rgba(44, 37, 34, 0.04)) drop-shadow(0 5px 8px rgba(44, 37, 34, 0.02))'
                    }}
                    animate={{ y: [0, -4, 0] }}
                    transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                  />
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Hero;
