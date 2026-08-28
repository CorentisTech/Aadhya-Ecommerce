"use client";

import React, { useState, useEffect } from 'react';
import { REVIEWS } from '../../data/mockData';
import { Star, Quote, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export const Reviews: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // Monitor window resize to scale down the 3D Arc dynamically
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
    const swipeThreshold = 40; // Low threshold for high responsiveness on touch drag
    if (info.offset.x < -swipeThreshold) {
      handleNext();
    } else if (info.offset.x > swipeThreshold) {
      handlePrev();
    }
  };

  // Get positioning styles for each card based on its index (Dynamically scales for Mobile view)
  const getCardStyle = (index: number) => {
    const total = REVIEWS.length;
    const diff = (index - activeIndex + total) % total;
    let relIndex = diff;
    if (relIndex > 2) relIndex -= total; // map to -2, -1, 0, 1, 2

    // Shrink coordinates on mobile screen sizes to prevent horizontal viewport leaks
    const factor = isMobile ? 0.36 : 1; 

    let x = 0;
    let y = 0;
    let z = 0;
    let scale = 1;
    let opacity = 1;
    let rotate = 0;

    switch (relIndex) {
      case 0: // Active Center
        x = 0;
        y = isMobile ? 8 : 25;
        z = 10;
        scale = isMobile ? 1.02 : 1.1;
        opacity = 1;
        rotate = 0;
        break;
      case 1: // Right Front
        x = 240 * factor;
        y = 0;
        z = 5;
        scale = isMobile ? 0.82 : 0.9;
        opacity = 0.65;
        rotate = 6;
        break;
      case 2: // Right Back
        x = 120 * factor;
        y = isMobile ? -8 : -25;
        z = 2;
        scale = isMobile ? 0.68 : 0.75;
        opacity = 0.35;
        rotate = 12;
        break;
      case -2: // Left Back
        x = -120 * factor;
        y = isMobile ? -8 : -25;
        z = 2;
        scale = isMobile ? 0.68 : 0.75;
        opacity = 0.35;
        rotate = -12;
        break;
      case -1: // Left Front
        x = -240 * factor;
        y = 0;
        z = 5;
        scale = isMobile ? 0.82 : 0.9;
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
    <section className="w-full py-10 md:py-20 px-4 md:px-12 lg:px-24 bg-brand-warmWhite overflow-hidden relative border-t border-brand-border/40 select-none">
      <div className="max-w-6xl mx-auto space-y-10 md:space-y-16">
        
        {/* Header Block */}
        <div className="flex flex-col sm:flex-row items-baseline justify-between border-b border-brand-border pb-4 gap-4">
          <div className="space-y-1 text-left">
            <span className="text-[9px] sm:text-[10px] text-[#F26A2E] font-bold tracking-[0.2em] uppercase">
              TESTIMONIALS
            </span>
            <h2 className="font-display font-bold text-3xl md:text-5xl text-brand-espresso uppercase tracking-wider">
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

        {/* 3D Arc Review Carousel (Responsive stack rendered on both desktop and mobile viewports) */}
        <div className="relative h-[280px] sm:h-[350px] md:h-[380px] w-full mt-6 flex items-center justify-center">
          <div className="absolute top-[45%] left-1/2 -translate-x-1/2 w-4/5 h-[65px] sm:h-[85px] rounded-full border-t border-brand-border/20 border-dashed pointer-events-none" />

          {/* Staggered cards */}
          <div className="absolute inset-0 flex items-center justify-center">
            {REVIEWS.map((review, idx) => {
              const style = getCardStyle(idx);
              const isActive = idx === activeIndex;
              return (
                <motion.div
                  key={review.id}
                  style={style}
                  animate={style}
                  transition={{ type: 'spring', damping: 25, stiffness: 140 }}
                  onClick={() => setActiveIndex(idx)}
                  // Enable swipe horizontal dragging on mobile and active desktop card
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.2}
                  onDragEnd={handleDragEnd}
                  className={`absolute left-1/2 w-[230px] sm:w-[280px] md:w-[320px] bg-brand-white border border-brand-border/60 p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-sm cursor-grab active:cursor-grabbing ${
                    isActive 
                      ? 'shadow-md border-brand-dustyRose/20 ring-1 ring-brand-blush/10' 
                      : 'hover:border-brand-warmGray/40 opacity-40 pointer-events-none md:pointer-events-auto'
                  }`}
                >
                  <div className="space-y-2 sm:space-y-4 text-left">
                    <div className="flex items-center justify-between">
                      <div className="flex text-brand-gold">
                        {Array(review.rating)
                          .fill(0)
                          .map((_, i) => (
                            <Star key={i} className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 fill-brand-gold stroke-none" />
                          ))}
                      </div>
                      <Quote className="w-5 h-5 sm:w-8 sm:h-8 text-brand-softBeige stroke-[1]" />
                    </div>

                    <p className="text-[10px] sm:text-xs text-brand-espresso font-semibold italic leading-relaxed tracking-wider line-clamp-4 sm:line-clamp-none">
                      "{review.text}"
                    </p>

                    <div className="border-t border-brand-border/20 pt-2 flex items-center justify-between text-[8px] sm:text-[9px] tracking-widest font-bold">
                      <div className="space-y-0.5">
                        <span className="text-brand-espresso block">{review.author.toUpperCase()}</span>
                        <span className="text-brand-success block">✓ VERIFIED</span>
                      </div>
                      {review.productName && (
                        <span className="text-brand-warmGray text-right max-w-[90px] sm:max-w-[120px] line-clamp-1">
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

        {/* Swipe indicator dots */}
        <div className="flex justify-center space-x-2 pt-2">
          {REVIEWS.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className={`h-1 rounded-full transition-all duration-300 ${
                activeIndex === idx ? 'w-5 bg-brand-espresso' : 'w-1.5 bg-brand-border'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>

      </div>
    </section>
  );
};

export default Reviews;
