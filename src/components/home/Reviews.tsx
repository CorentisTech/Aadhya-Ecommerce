import React, { useState, useEffect } from 'react';
import { REVIEWS } from '../../data/mockData';
import { ArrowLeft, ArrowRight, Star, Quote } from 'lucide-react';
import { motion } from 'framer-motion';

export const Reviews: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Auto-play loop
  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % REVIEWS.length);
    }, 5500);
    return () => clearInterval(interval);
  }, [isHovered]);

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % REVIEWS.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + REVIEWS.length) % REVIEWS.length);
  };

  // Get positioning styles for each card based on its index relative to the active card
  const getCardStyle = (index: number) => {
    const total = REVIEWS.length;
    // Calculate relative index from -2 to +2
    const diff = (index - activeIndex + total) % total;
    let relIndex = diff;
    if (relIndex > 2) relIndex -= total; // map to -2, -1, 0, 1, 2

    // Desktop Arc coordinates
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
    <section className="w-full py-20 px-6 md:px-12 lg:px-24 bg-brand-warmWhite overflow-hidden relative border-t border-brand-border/40">
      
      <div className="max-w-6xl mx-auto space-y-16">
        
        {/* Header Title with Asymmetric Curation Link */}
        <div className="flex flex-col sm:flex-row items-baseline justify-between border-b border-brand-border pb-4 gap-4">
          <div className="space-y-1">
            <span className="text-[10px] text-brand-warmGray font-bold tracking-[0.2em] uppercase">
              TESTIMONIALS
            </span>
            <h2 className="font-display font-bold text-3xl md:text-4xl text-brand-espresso uppercase tracking-wider">
              LOVED BY OUR CUSTOMERS
            </h2>
            <p className="font-display italic text-brand-warmGray text-sm">
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

        {/* Desktop Carousel Area (Arc) */}
        <div 
          className="hidden md:block relative h-[380px] w-full mt-8"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Subtle Curve Guideline Arc Path */}
          <div className="absolute top-[45%] left-1/2 -translate-x-1/2 w-4/5 h-[80px] rounded-full border-t border-brand-border/30 border-dashed pointer-events-none" />

          {/* Cards Loop Container */}
          <div className="absolute inset-0 flex items-center justify-center">
            {REVIEWS.map((review, idx) => {
              const style = getCardStyle(idx);
              const isActive = idx === activeIndex;
              return (
                <motion.div
                  key={review.id}
                  style={style}
                  animate={style}
                  transition={{ type: 'spring', damping: 22, stiffness: 120 }}
                  onClick={() => setActiveIndex(idx)}
                  className={`absolute left-1/2 w-[320px] bg-brand-white border border-brand-border/60 p-6 rounded-2xl shadow-sm cursor-pointer select-none ${
                    isActive ? 'shadow-md border-brand-dustyRose/30 ring-1 ring-brand-blush/20' : 'hover:border-brand-warmGray/40'
                  }`}
                >
                  <div className="space-y-4">
                    {/* Stars & Quote Icon */}
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

                    {/* Review text */}
                    <p className="text-xs text-brand-espresso font-semibold italic leading-relaxed tracking-wider">
                      "{review.text}"
                    </p>

                    {/* Author Metadata */}
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

          {/* Left/Right Buttons */}
          <div className="absolute bottom-0 left-0 right-0 flex items-center justify-center space-x-6 z-20">
            <button
              onClick={handlePrev}
              className="p-3 border border-brand-border text-brand-espresso hover:bg-brand-softBeige/40 rounded-full transition-colors"
              aria-label="Previous review"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <span className="text-[10px] font-bold tracking-widest text-brand-warmGray">
              {activeIndex + 1} / {REVIEWS.length}
            </span>
            <button
              onClick={handleNext}
              className="p-3 border border-brand-border text-brand-espresso hover:bg-brand-softBeige/40 rounded-full transition-colors"
              aria-label="Next review"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mobile Swipeable Slider fallback */}
        <div className="md:hidden flex overflow-x-auto pb-4 gap-6 snap-x snap-mandatory scrollbar-none w-full">
          {REVIEWS.map((review) => (
            <div
              key={review.id}
              className="flex-shrink-0 w-4/5 snap-center bg-brand-white border border-brand-border/60 p-6 rounded-2xl shadow-sm"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex text-brand-gold">
                    {Array(review.rating)
                      .fill(0)
                      .map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-brand-gold stroke-none" />
                      ))}
                  </div>
                  <Quote className="w-6 h-6 text-brand-softBeige stroke-[1.5]" />
                </div>

                <p className="text-xs text-brand-espresso font-semibold italic leading-relaxed tracking-wider">
                  "{review.text}"
                </p>

                <div className="border-t border-brand-border/30 pt-3 flex items-center justify-between text-[9px] tracking-widest font-bold">
                  <div>
                    <span className="text-brand-espresso block">{review.author.toUpperCase()}</span>
                    <span className="text-brand-success block">✓ VERIFIED PURCHASE</span>
                  </div>
                  <span className="text-brand-warmGray max-w-[100px] line-clamp-1">{review.productName.toUpperCase()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
export default Reviews;
