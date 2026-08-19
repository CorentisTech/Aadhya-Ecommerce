"use client";

import React, { useState, useEffect } from 'react';
import { REVIEWS } from '../../data/mockData';
import { Star, Quote, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Reviews: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  // Auto-play loop running at exactly 3 seconds (3000ms)
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % REVIEWS.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % REVIEWS.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + REVIEWS.length) % REVIEWS.length);
  };

  // Drag handler for swipe gestures
  const handleDragEnd = (event: any, info: any) => {
    const swipeThreshold = 55;
    if (info.offset.x < -swipeThreshold) {
      handleNext();
    } else if (info.offset.x > swipeThreshold) {
      handlePrev();
    }
  };

  // Get positioning styles for each card based on its index relative to the active card (Original Arc Design)
  const getCardStyle = (index: number) => {
    const total = REVIEWS.length;
    const diff = (index - activeIndex + total) % total;
    let relIndex = diff;
    if (relIndex > 2) relIndex -= total; // map to -2, -1, 0, 1, 2

    let x = 0;
    let y = 0;
    let z = 0;
    let scale = 1;
    let opacity = 1;
    let rotate = 0;

    switch (relIndex) {
      case 0: // Active Center
        x = 0;
        y = 25;
        z = 10;
        scale = 1.1;
        opacity = 1;
        rotate = 0;
        break;
      case 1: // Right Front
        x = 240;
        y = 0;
        z = 5;
        scale = 0.9;
        opacity = 0.65;
        rotate = 6;
        break;
      case 2: // Right Back
        x = 120;
        y = -25;
        z = 2;
        scale = 0.75;
        opacity = 0.35;
        rotate = 12;
        break;
      case -2: // Left Back
        x = -120;
        y = -25;
        z = 2;
        scale = 0.75;
        opacity = 0.35;
        rotate = -12;
        break;
      case -1: // Left Front
        x = -240;
        y = 0;
        z = 5;
        scale = 0.9;
        opacity = 0.65;
        rotate = -6;
        break;
      default:
        break;
    }

    return {
      x: `calc(${x}px - 50%)`,
      y: y,
      scale: scale,
      opacity: opacity,
      zIndex: z,
      rotate: rotate,
      transformOrigin: 'center center',
    };
  };

  return (
    <section className="w-full py-20 px-6 md:px-12 lg:px-24 bg-brand-warmWhite overflow-hidden relative border-t border-brand-border/40 select-none">
      <div className="max-w-6xl mx-auto space-y-16">
        
        {/* Header Block */}
        <div className="flex flex-col sm:flex-row items-baseline justify-between border-b border-brand-border pb-4 gap-4">
          <div className="space-y-1 text-left">
            <span className="text-[10px] text-brand-warmGray font-bold tracking-[0.2em] uppercase">
              TESTIMONIALS
            </span>
            <h2 className="font-display font-bold text-3xl md:text-4xl text-brand-espresso uppercase tracking-wider">
              LOVED BY OUR CUSTOMERS
            </h2>
            <p className="font-display italic text-brand-warmGray text-xs">
              "Real experiences from the Aadhya community."
            </p>
          </div>
          
          <button 
            onClick={() => alert("More customer experiences coming soon!")}
            className="text-[10px] font-bold tracking-widest text-brand-dustyRose hover:opacity-80 transition-opacity flex items-center gap-1.5"
          >
            <span>MORE REVIEWS</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 1. Desktop Arc Carousel (Touch drag active on center card) */}
        <div className="hidden md:block relative h-[380px] w-full mt-8">
          <div className="absolute top-[45%] left-1/2 -translate-x-1/2 w-4/5 h-[85px] rounded-full border-t border-brand-border/30 border-dashed pointer-events-none" />

          <div className="absolute inset-0 flex items-center justify-center">
            {REVIEWS.map((review, idx) => {
              const style = getCardStyle(idx);
              const isActive = idx === activeIndex;
              return (
                <motion.div
                  key={review.id}
                  style={style}
                  animate={style}
                  transition={{ type: 'spring', damping: 24, stiffness: 130 }}
                  onClick={() => setActiveIndex(idx)}
                  // Drag active only on center card
                  drag={isActive ? "x" : false}
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.25}
                  onDragEnd={handleDragEnd}
                  className={`absolute left-1/2 w-[320px] bg-brand-white border border-brand-border/60 p-6 rounded-2xl shadow-sm select-none cursor-pointer ${
                    isActive 
                      ? 'shadow-md border-brand-dustyRose/30 ring-1 ring-brand-blush/20 cursor-grab active:cursor-grabbing' 
                      : 'hover:border-brand-warmGray/40 opacity-50'
                  }`}
                >
                  <div className="space-y-4 text-left">
                    <div className="flex items-center justify-between">
                      <div className="flex text-brand-gold">
                        {Array(review.rating)
                          .fill(0)
                          .map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-brand-gold stroke-[1.5]" />
                          ))}
                      </div>
                      <Quote className="w-8 h-8 text-brand-softBeige stroke-[1]" />
                    </div>

                    <p className="text-xs text-brand-espresso font-semibold italic leading-relaxed tracking-wider">
                      "{review.text}"
                    </p>

                    <div className="border-t border-brand-border/30 pt-3 flex items-center justify-between text-[9px] tracking-widest font-bold">
                      <div className="space-y-0.5">
                        <span className="text-brand-espresso block">{review.author.toUpperCase()}</span>
                        <span className="text-brand-success block">✓ VERIFIED PURCHASE</span>
                      </div>
                      {review.productName && (
                        <span className="text-brand-warmGray text-right max-w-[120px] line-clamp-1">
                          {review.productName.toUpperCase()}
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* 2. Mobile Swipeable Carousel (One clean card with full horizontal drag) */}
        <div className="md:hidden flex justify-center items-center min-h-[280px] relative py-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={handleDragEnd}
              initial={{ opacity: 0, x: 60, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -60, scale: 0.95 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-sm bg-brand-white border border-brand-border/60 p-6 rounded-2xl shadow-sm cursor-grab active:cursor-grabbing"
            >
              <div className="space-y-4 text-left">
                <div className="flex items-center justify-between">
                  <div className="flex text-brand-gold">
                    {Array(REVIEWS[activeIndex].rating)
                      .fill(0)
                      .map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-brand-gold stroke-none" />
                      ))}
                  </div>
                  <Quote className="w-6 h-6 text-brand-softBeige stroke-[1.5]" />
                </div>

                <p className="text-xs text-brand-espresso font-semibold italic leading-relaxed tracking-wider">
                  "{REVIEWS[activeIndex].text}"
                </p>

                <div className="border-t border-brand-border/30 pt-3 flex items-center justify-between text-[9px] tracking-widest font-bold">
                  <div>
                    <span className="text-brand-espresso block">{REVIEWS[activeIndex].author.toUpperCase()}</span>
                    <span className="text-brand-success block">✓ VERIFIED PURCHASE</span>
                  </div>
                  <span className="text-brand-warmGray max-w-[120px] line-clamp-1">
                    {REVIEWS[activeIndex].productName.toUpperCase()}
                  </span>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Swipe Indicator Dots */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex space-x-1.5">
            {REVIEWS.map((_, idx) => (
              <span
                key={idx}
                className={`h-1 rounded-full transition-all duration-300 ${
                  activeIndex === idx ? 'w-4 bg-brand-espresso' : 'w-1 bg-brand-border'
                }`}
              />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default Reviews;
