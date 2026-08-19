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
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
    exit: { opacity: 0, x: 15, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
  };

  const modelVariants = {
    initial: { opacity: 0, scale: 0.95, y: 10 },
    animate: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
    exit: { opacity: 0, scale: 0.98, y: -10, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
  };

  return (
    <section className="w-full min-h-[85vh] bg-brand-warmWhite flex items-center justify-center py-12 px-6 md:px-12 lg:px-24 overflow-hidden relative border-b border-brand-border/40">
      
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center z-10 relative">
        
        {/* Left Column: Product Information & Variable Selectors (6 cols / 50% width) */}
        <div className="lg:col-span-6 flex flex-col justify-center space-y-6 select-none">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-brand-sale tracking-[0.25em] uppercase border-b border-brand-sale/20 pb-1">
              ★ BESTSELLER SHOWCASE
            </span>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentProduct.id}
              variants={slideTextVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="space-y-5 text-left"
            >
              {/* Product Title */}
              <h1 className="font-display font-bold text-brand-espresso tracking-tight text-4xl md:text-5xl lg:text-6xl leading-[1.1] uppercase">
                {currentProduct.name}
              </h1>
              
              {/* Description */}
              <p className="text-xs text-brand-warmGray tracking-wide font-semibold max-w-sm leading-relaxed">
                {currentProduct.description}
              </p>

              {/* Price Row */}
              <div className="flex items-center space-x-3 pt-2">
                <span className="text-2xl font-bold text-brand-espresso">
                  ₹{currentProduct.price.toLocaleString('en-IN')}
                </span>
                <span className="text-sm text-brand-warmGray line-through font-semibold">
                  ₹{currentProduct.mrp.toLocaleString('en-IN')}
                </span>
                <span className="text-[9px] text-brand-sale bg-brand-sale/10 border border-brand-sale/20 px-2 py-0.5 rounded font-extrabold tracking-widest">
                  {currentProduct.discount}% OFF
                </span>
              </div>

              {/* Added interactive selectors to avoid blank space and improve UX */}
              <div className="space-y-4 pt-3 border-t border-brand-border/40 max-w-xs">
                {/* Size options */}
                {currentProduct.sizes && currentProduct.sizes.length > 0 && (
                  <div className="space-y-1.5">
                    <span className="text-[9px] font-bold text-brand-warmGray tracking-widest block uppercase">
                      SELECT SIZE:
                    </span>
                    <div className="flex gap-2">
                      {currentProduct.sizes.map((s) => (
                        <button
                          key={s}
                          onClick={() => setSelectedSize(s)}
                          className={`px-3 py-1 border text-[10px] font-bold rounded-md transition-all ${
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
                  <div className="space-y-1.5">
                    <span className="text-[9px] font-bold text-brand-warmGray tracking-widest block uppercase">
                      SELECT COLOR SHADE:
                    </span>
                    <div className="flex gap-2">
                      {currentProduct.colors.map((c) => (
                        <button
                          key={c}
                          onClick={() => setSelectedColor(c)}
                          className={`w-5 h-5 rounded-full border transition-all ${
                            selectedColor === c
                              ? 'scale-110 border-brand-espresso ring-2 ring-brand-blush'
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

          {/* Action Row */}
          <div className="flex items-center gap-3 pt-4">
            <button
              onClick={() => addToCart(currentProduct, 1, selectedSize, selectedColor)}
              className="py-3 px-6 bg-brand-espresso text-brand-white text-xs font-bold tracking-[0.2em] uppercase hover:bg-brand-espresso/90 transition-colors shadow-md rounded-xl"
            >
              ADD TO BAG
            </button>
            
            <button
              onClick={() => setSelectedProduct(currentProduct)}
              className="py-3 px-6 border border-brand-border text-brand-espresso text-xs font-bold tracking-[0.2em] uppercase hover:bg-brand-softBeige/40 transition-colors flex items-center gap-2 rounded-xl"
            >
              <span>EXPLORE PRODUCT</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => toggleWishlist(currentProduct)}
              className={`p-3 border rounded-xl transition-all ${
                inWishlist
                  ? 'bg-brand-blush border-brand-dustyRose text-brand-dustyRose'
                  : 'border-brand-border hover:bg-brand-softBeige/30 text-brand-warmGray'
              }`}
              aria-label="Add to Wishlist"
            >
              <Heart className={`w-4 h-4 ${inWishlist ? 'fill-brand-dustyRose' : ''}`} />
            </button>
          </div>

          {/* Pagination Indicators */}
          <div className="flex space-x-2.5 pt-6">
            {bestsellers.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                aria-label={`Show bestseller slide ${index + 1}`}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  activeIndex === index ? 'w-8 bg-brand-espresso' : 'w-2 bg-brand-border hover:bg-brand-warmGray'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Right Column: Large Isolated Model Visual (6 cols / 50% width) */}
        <div className="lg:col-span-6 flex justify-center items-center relative min-h-[420px] lg:min-h-[480px]">
          <div className="w-full max-w-[420px] aspect-[4/5] flex items-center justify-center relative">
            
            {/* Subtle background circles for depth */}
            <div className="absolute w-[80%] h-[80%] rounded-full border border-brand-border/40 pointer-events-none z-0" />
            <div className="absolute w-[95%] h-[95%] rounded-full border border-brand-border/10 pointer-events-none z-0 animate-spin-slow" />

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
                {/* Visual cutout rendering: max size and blend overlay to blend white borders */}
                <div className="relative w-full h-[400px] lg:h-[480px] flex items-center justify-center">
                  <motion.img
                    src={currentProduct.image}
                    alt={currentProduct.name}
                    className="max-h-[380px] lg:max-h-[460px] w-full object-contain mix-blend-multiply pointer-events-none"
                    animate={{ y: [0, -10, 0] }}
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
