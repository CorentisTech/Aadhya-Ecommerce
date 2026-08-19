"use client";

import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { PRODUCTS } from '../../data/mockData';
import { ProductVisual } from '../ui/ProductVisual';
import { Heart, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Hero: React.FC = () => {
  const { addToCart, toggleWishlist, isInWishlist, setSelectedProduct } = useApp();
  
  // Filter bestsellers for the hero showcase
  const bestsellers = PRODUCTS.filter((p) => p.bestseller && p.department === 'fashion');
  const [activeIndex, setActiveIndex] = useState(0);

  // Auto-play rotation slideshow
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % bestsellers.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [bestsellers.length]);

  const currentProduct = bestsellers[activeIndex];
  const inWishlist = isInWishlist(currentProduct.id);

  // Transition variants for Framer Motion
  const slideTextVariants = {
    initial: { opacity: 0, x: -30 },
    animate: { opacity: 1, x: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as any } },
    exit: { opacity: 0, x: 20, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as any } },
  };

  const modelVariants = {
    initial: { opacity: 0, scale: 0.9, y: 15, rotateY: -90 },
    animate: { opacity: 1, scale: 1, y: 0, rotateY: 0, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] as any } },
    exit: { opacity: 0, scale: 0.95, y: -10, rotateY: 90, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as any } },
  };

  return (
    <section id="bestsellers" className="w-full min-h-[90vh] bg-brand-warmWhite flex items-center justify-center py-12 px-6 md:px-12 lg:px-24 overflow-hidden relative border-b border-brand-border/40">
      
      {/* Editorial Watermark Logo (Floating Asymmetrically) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-display text-[12vw] font-black tracking-[0.25em] text-brand-softBeige/25 select-none pointer-events-none z-0">
        AADHYA
      </div>

      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center z-10 relative">
        
        {/* Left Side: Product Details & Heading (5 cols) */}
        <div className="lg:col-span-5 flex flex-col justify-center space-y-6">
          
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-brand-sale tracking-[0.25em] uppercase border-b border-brand-sale/20 pb-1">
              ★ BESTSELLER SHOWCASE
            </span>
          </div>

          {/* Animate title, description and prices */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentProduct.id}
              variants={slideTextVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="space-y-4"
            >
              <h1 className="font-display font-extrabold text-brand-espresso tracking-wider text-4xl md:text-5xl lg:text-6xl leading-[1.1] uppercase">
                {currentProduct.name}
              </h1>
              
              <p className="text-xs md:text-sm text-brand-warmGray tracking-wider font-semibold max-w-md leading-relaxed">
                {currentProduct.description}
              </p>

              {/* Price Row */}
              <div className="flex items-center space-x-4 pt-2">
                <span className="text-2xl font-bold text-brand-espresso">
                  ₹{currentProduct.price.toLocaleString('en-IN')}
                </span>
                <span className="text-base text-brand-warmGray line-through font-semibold">
                  ₹{currentProduct.mrp.toLocaleString('en-IN')}
                </span>
                <span className="text-xs text-brand-sale bg-brand-sale/10 border border-brand-sale/20 px-2 py-0.5 rounded font-extrabold tracking-widest">
                  {currentProduct.discount}% OFF
                </span>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* CTAs */}
          <div className="flex items-center gap-4 pt-4">
            {/* Add to Cart */}
            <button
              onClick={() => addToCart(currentProduct, 1, 'Free Size')}
              className="py-3 px-6 bg-brand-espresso text-brand-white text-xs font-bold tracking-[0.2em] uppercase hover:bg-brand-espresso/90 transition-colors shadow-md rounded-xl"
            >
              ADD TO BAG
            </button>
            
            {/* Explore detail modal */}
            <button
              onClick={() => setSelectedProduct(currentProduct)}
              className="py-3 px-6 border border-brand-border text-brand-espresso text-xs font-bold tracking-[0.2em] uppercase hover:bg-brand-softBeige/40 transition-colors flex items-center gap-2 rounded-xl"
            >
              <span>EXPLORE PRODUCT</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Wishlist toggle */}
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

          {/* Carousel indicators dots */}
          <div className="flex space-x-2 pt-6">
            {bestsellers.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                aria-label={`Show slide ${index + 1}`}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  activeIndex === index ? 'w-8 bg-brand-espresso' : 'w-2 bg-brand-border hover:bg-brand-warmGray'
                }`}
              />
            ))}
          </div>

        </div>

        {/* Center: Large 3D Fashion Model (4 cols) */}
        <div className="lg:col-span-4 flex justify-center items-center relative min-h-[400px]">
          <div className="w-full max-w-[320px] aspect-square lg:aspect-[4/5] flex items-center justify-center relative">
            
            {/* Subtle floating gold/cream ring background */}
            <div className="absolute w-[80%] h-[80%] rounded-full border border-brand-border/60 pointer-events-none z-0" />
            <div className="absolute w-[95%] h-[95%] rounded-full border border-brand-border/20 pointer-events-none z-0 animate-spin-slow" />

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
                {/* Product cutout graphic - Spinning automatically on vertical axis */}
                <ProductVisual
                  type={currentProduct.visualType}
                  color={currentProduct.visualColor}
                  pattern={currentProduct.visualPattern}
                  isRotating={true}
                  className="max-h-[360px] lg:max-h-[440px]"
                />
              </motion.div>
            </AnimatePresence>

          </div>
        </div>

        {/* Right: Small Floating Visual Panel (3 cols) */}
        <div className="lg:col-span-3 hidden lg:flex flex-col space-y-6 items-end">
          
          <AnimatePresence mode="wait">
            <motion.div
              key={currentProduct.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              {/* Card 1: Alternate detail mockup (floating) */}
              <div className="bg-brand-white border border-brand-border/80 rounded-2xl p-4 shadow-sm max-w-[200px] animate-float-slow relative">
                <span className="text-[8px] font-bold text-brand-warmGray tracking-widest block mb-2 uppercase">
                  FABRIC CLOSE-UP
                </span>
                <div className="w-full h-24 bg-brand-warmWhite rounded-lg overflow-hidden flex items-center justify-center p-2">
                  {/* Styled pattern grid visual */}
                  <div
                    className="w-full h-full rounded border border-brand-border/50 flex items-center justify-center"
                    style={{
                      backgroundColor: currentProduct.visualColor,
                      opacity: 0.75,
                    }}
                  >
                    <span className="text-[9px] font-extrabold text-brand-white tracking-widest uppercase">
                      {currentProduct.visualPattern?.replace('-', ' ')}
                    </span>
                  </div>
                </div>
                <p className="text-[9px] text-brand-warmGray font-semibold leading-normal mt-2">
                  Premium {currentProduct.visualPattern === 'gold-brocade' ? 'Zari' : 'Thread'} details.
                </p>
              </div>

              {/* Card 2: Color options floating (delayed float) */}
              <div className="bg-brand-white border border-brand-border/80 rounded-2xl p-4 shadow-sm max-w-[200px] animate-float-delayed">
                <span className="text-[8px] font-bold text-brand-warmGray tracking-widest block mb-2 uppercase">
                  DESIGN EDIT
                </span>
                <div className="flex gap-2.5">
                  {currentProduct.colors?.map((c, i) => (
                    <span
                      key={i}
                      className="w-4 h-4 rounded-full border border-brand-border/60"
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
                <p className="text-[9px] text-brand-warmGray font-semibold leading-normal mt-2">
                  Available in multiple curation shades.
                </p>
              </div>
            </motion.div>
          </AnimatePresence>

        </div>

      </div>

    </section>
  );
};
