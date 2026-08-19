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

  // Drag Gesture handler (converts swipe/drag left-right into transitions)
  const handleDragEnd = (event: any, info: any) => {
    const swipeThreshold = 50; // Minimum drag px to trigger swipe
    if (info.offset.x < -swipeThreshold) {
      // Swiped Left -> Next
      handleNext();
    } else if (info.offset.x > swipeThreshold) {
      // Swiped Right -> Prev
      handlePrev();
    }
  };

  return (
    <section className="w-full py-20 px-6 md:px-12 lg:px-24 bg-brand-warmWhite overflow-hidden relative border-t border-brand-border/40 select-none">
      <div className="max-w-4xl mx-auto space-y-16">
        
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

        {/* Swipeable Editorial Review Card Container (Universal desktop/mobile) */}
        <div className="relative flex justify-center items-center py-10 min-h-[300px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              // Framer Motion Drag Attributes for Mobile Swiping
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={handleDragEnd}
              
              initial={{ opacity: 0, x: 60, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -60, scale: 0.95 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-lg bg-brand-white border border-brand-border/60 p-8 rounded-2xl shadow-sm cursor-grab active:cursor-grabbing text-left space-y-6"
            >
              <div className="space-y-5">
                {/* Stars and Quote */}
                <div className="flex items-center justify-between">
                  <div className="flex text-brand-gold">
                    {Array(REVIEWS[activeIndex].rating)
                      .fill(0)
                      .map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-brand-gold stroke-none" />
                      ))}
                  </div>
                  <Quote className="w-8 h-8 text-brand-softBeige stroke-[1]" />
                </div>

                {/* Text content */}
                <p className="text-sm text-brand-espresso font-semibold italic leading-relaxed tracking-wider">
                  "{REVIEWS[activeIndex].text}"
                </p>

                {/* User details */}
                <div className="border-t border-brand-border/30 pt-4 flex items-center justify-between text-[10px] tracking-widest font-bold">
                  <div className="space-y-0.5">
                    <span className="text-brand-espresso block">{REVIEWS[activeIndex].author.toUpperCase()}</span>
                    <span className="text-brand-success block">✓ VERIFIED PURCHASE</span>
                  </div>
                  {REVIEWS[activeIndex].productName && (
                    <span className="text-brand-warmGray text-right max-w-[150px] line-clamp-1">
                      {REVIEWS[activeIndex].productName.toUpperCase()}
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Swipe Indicator Dots */}
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex space-x-2">
            {REVIEWS.map((_, idx) => (
              <span
                key={idx}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  activeIndex === idx ? 'w-5 bg-brand-espresso' : 'w-1.5 bg-brand-border'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Floating Mobile Tip */}
        <p className="text-[9px] text-brand-warmGray tracking-wider font-extrabold block md:hidden">
          Swipe left/right to browse reviews
        </p>

      </div>
    </section>
  );
};

export default Reviews;
