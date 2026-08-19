"use client";

import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { PRODUCTS } from '../../data/mockData';
import { Heart, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Hero: React.FC = () => {
  const { addToCart, toggleWishlist, isInWishlist, setSelectedProduct } = useApp();
  
  // Filter bestsellers for the hero showcase
  const bestsellers = PRODUCTS.filter((p) => p.bestseller && p.department === 'fashion');
  const [activeIndex, setActiveIndex] = useState(0);

  // States for interactive selection in the Hero
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

  // Transition variants for stable layout changes
  const slideTextVariants = {
    initial: { opacity: 0, x: -15 },
    animate: { opacity: 1, x: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
    exit: { opacity: 0, x: 10, transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] } },
  };

  const modelVariants = {
    initial: { opacity: 0, scale: 0.96, y: 8 },
    animate: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
    exit: { opacity: 0, scale: 0.98, y: -8, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
  };

  return (
    <section className="w-full min-h-[50vh] sm:min-h-[60vh] lg:min-h-[85vh] bg-brand-warmWhite flex items-center justify-center py-6 sm:py-12 px-4 sm:px-8 lg:px-24 overflow-hidden relative border-b border-brand-border/40">
      
      {/* 2-column responsive layout (Side-by-side on mobile to prevent long vertical stacking) */}
      <div className="max-w-7xl mx-auto w-full grid grid-cols-12 gap-4 sm:gap-8 items-center z-10 relative">
        
        {/* Left Column: Product Information (7 cols on mobile, 6 cols on desktop) */}
        <div className="col-span-7 lg:col-span-6 flex flex-col justify-center space-y-3 sm:space-y-6 select-none">
          <div className="space-y-0.5">
            <span className="text-[7px] sm:text-[9px] font-extrabold text-brand-sale tracking-[0.25em] uppercase border-b border-brand-sale/25 pb-0.5">
              ★ BESTSELLER
            </span>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentProduct.id}
              variants={slideTextVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="space-y-2 sm:space-y-4 text-left"
            >
              {/* Responsive title using clamp size */}
              <h1 className="font-display font-bold text-brand-espresso tracking-tight text-lg sm:text-3xl lg:text-6xl leading-[1.15] uppercase">
                {currentProduct.name}
              </h1>
              
              {/* Compact description */}
              <p className="text-[9px] sm:text-xs text-brand-warmGray tracking-wide font-semibold max-w-sm leading-relaxed line-clamp-2 sm:line-clamp-none">
                {currentProduct.description}
              </p>

              {/* Price row */}
              <div className="flex items-center space-x-2 pt-1">
                <span className="text-sm sm:text-2xl font-extrabold text-brand-espresso">
                  ₹{currentProduct.price.toLocaleString('en-IN')}
                </span>
                <span className="text-[10px] sm:text-sm text-brand-warmGray line-through font-semibold">
                  ₹{currentProduct.mrp.toLocaleString('en-IN')}
                </span>
                <span className="text-[7px] sm:text-[9px] text-brand-sale bg-brand-sale/10 border border-brand-sale/20 px-1.5 py-0.5 rounded font-extrabold tracking-widest">
                  {currentProduct.discount}% OFF
                </span>
              </div>

              {/* Compact interactive selectors */}
              <div className="space-y-2.5 pt-2 border-t border-brand-border/40 max-w-xs">
                {/* Size options */}
                {currentProduct.sizes && currentProduct.sizes.length > 0 && (
                  <div className="space-y-1">
                    <span className="text-[7px] sm:text-[9px] font-bold text-brand-warmGray tracking-widest block uppercase">
                      SIZE:
                    </span>
                    <div className="flex gap-1.5">
                      {currentProduct.sizes.map((s) => (
                        <button
                          key={s}
                          onClick={() => setSelectedSize(s)}
                          className={`px-2 py-0.5 sm:px-3 sm:py-1 border text-[8px] sm:text-[10px] font-bold rounded transition-all ${
                            selectedSize === s
                              ? 'border-brand-espresso bg-brand-espresso text-brand-white'
                              : 'border-brand-border text-brand-warmGray hover:bg-brand-softBeige/30'
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Color options */}
                {currentProduct.colors && currentProduct.colors.length > 0 && (
                  <div className="space-y-1">
                    <span className="text-[7px] sm:text-[9px] font-bold text-brand-warmGray tracking-widest block uppercase">
                      COLOR:
                    </span>
                    <div className="flex gap-1.5">
                      {currentProduct.colors.map((c) => (
                        <button
                          key={c}
                          onClick={() => setSelectedColor(c)}
                          className={`w-3.5 h-3.5 sm:w-5 sm:h-5 rounded-full border transition-all ${
                            selectedColor === c
                              ? 'scale-115 border-brand-espresso ring-1 ring-brand-blush'
                              : 'border-brand-border hover:opacity-85'
                          }`}
                          style={{ backgroundColor: c }}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>

            </motion.div>
          </AnimatePresence>

          {/* Action Button Row */}
          <div className="flex items-center gap-2 pt-2">
            <button
              onClick={() => addToCart(currentProduct, 1, selectedSize, selectedColor)}
              className="py-1.5 px-3 sm:py-3 sm:px-6 bg-brand-espresso text-brand-white text-[8px] sm:text-xs font-bold tracking-[0.2em] uppercase hover:bg-brand-espresso/90 transition-colors shadow rounded-lg"
            >
              ADD
            </button>
            
            <button
              onClick={() => setSelectedProduct(currentProduct)}
              className="py-1.5 px-3 sm:py-3 sm:px-6 border border-brand-border text-brand-espresso text-[8px] sm:text-xs font-bold tracking-[0.2em] uppercase hover:bg-brand-softBeige/40 transition-colors flex items-center gap-1 rounded-lg"
            >
              <span>EXPLORE</span>
              <ArrowRight className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5" />
            </button>

            <button
              onClick={() => toggleWishlist(currentProduct)}
              className={`p-1.5 sm:p-3 border rounded-lg transition-all ${
                inWishlist
                  ? 'bg-brand-blush border-brand-dustyRose text-brand-dustyRose'
                  : 'border-brand-border hover:bg-brand-softBeige/30 text-brand-warmGray'
              }`}
              aria-label="Add to Wishlist"
            >
              <Heart className={`w-3 h-3 sm:w-4 sm:h-4 ${inWishlist ? 'fill-brand-dustyRose' : ''}`} />
            </button>
          </div>

          {/* Pagination Indicators */}
          <div className="flex space-x-2 pt-4">
            {bestsellers.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                aria-label={`Show bestseller slide ${index + 1}`}
                className={`h-1 rounded-full transition-all duration-300 ${
                  activeIndex === index ? 'w-5 bg-brand-espresso' : 'w-1.5 bg-brand-border hover:bg-brand-warmGray'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Right Column: Large Isolated Model Visual (5 cols on mobile, 6 cols on desktop) */}
        <div className="col-span-5 lg:col-span-6 flex justify-center items-center relative">
          <div className="w-full max-w-[340px] aspect-[4/5] flex items-center justify-center relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentProduct.id}
                variants={modelVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="w-full h-full z-10 flex items-center justify-center cursor-pointer"
                onClick={() => setSelectedProduct(currentProduct)}
              >
                {/* Visual cutout rendering: blend studio white backdrop completely */}
                <div className="relative w-full h-[220px] sm:h-[320px] lg:h-[480px] flex items-center justify-center">
                  <motion.img
                    src={currentProduct.image}
                    alt={currentProduct.name}
                    className="max-h-[200px] sm:max-h-[300px] lg:max-h-[460px] w-full object-contain mix-blend-multiply pointer-events-none"
                    animate={{ y: [0, -6, 0] }}
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
