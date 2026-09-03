"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { useRouter, usePathname } from 'next/navigation';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { usePageTransition } from '../ui/PageTransitionOverlay';

export const MobileBottomNav: React.FC = () => {
  const { setPage, activePage } = useApp();
  const router = useRouter();
  const pathname = usePathname();
  const { triggerSectionTransition } = usePageTransition();

  const containerRef = useRef<HTMLDivElement>(null);
  const [maxDrag, setMaxDrag] = useState(240);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Motion value for drag offset X (strictly 0 to maxDrag)
  const dragX = useMotionValue(0);

  // Calculate max drag distance dynamically based on container width
  useEffect(() => {
    const updateMaxDrag = () => {
      if (containerRef.current) {
        setMaxDrag(containerRef.current.clientWidth - 48);
      }
    };
    updateMaxDrag();
    window.addEventListener('resize', updateMaxDrag);
    return () => window.removeEventListener('resize', updateMaxDrag);
  }, []);

  // Reset CTA position when route or page state updates
  useEffect(() => {
    setStatusMessage(null);
    animate(dragX, 0, { duration: 0.15 });
  }, [pathname, activePage]);

  // Derived progressive unroll & reveal motion values
  const rollWidth = useTransform(dragX, [0, maxDrag], ['0%', '100%']);
  const unrollScaleX = useTransform(dragX, [0, maxDrag], [0.15, 1]);
  const unrollOpacity = useTransform(dragX, [0, 15, maxDrag], [0, 0.95, 1]);
  const textOpacity = useTransform(dragX, [0, maxDrag * 0.7], [1, 0.25]);

  const isNumismaticsPage = Boolean(pathname?.includes('/numismatics'));

  // Reset swipe state whenever pathname changes (e.g. mobile back button)
  useEffect(() => {
    dragX.set(0);
    setStatusMessage(null);
  }, [pathname, dragX]);

  const handleDragEnd = (event: any, info: any) => {
    const currentX = dragX.get();
    const threshold = maxDrag * 0.4; // 40% swipe threshold to trigger section switch

    if (currentX >= threshold || info.velocity.x > 200) {
      // Complete drag handle to right edge cleanly (State 5: Completed 100%)
      animate(dragX, maxDrag, { type: 'spring', stiffness: 380, damping: 28 }).then(() => {
        if (isNumismaticsPage) {
          setStatusMessage('✓ Opening Fashion Collection...');
          setTimeout(() => {
            setPage('home');
            triggerSectionTransition('fashion');
          }, 250);
        } else {
          setStatusMessage('✓ Opening Coins & Notes...');
          setTimeout(() => {
            setPage('numismatics');
            triggerSectionTransition('numismatics');
          }, 250);
        }
      });
    } else {
      // Released before threshold: animate smoothly back to rolled initial state (State 6: Reset State)
      animate(dragX, 0, { type: 'spring', stiffness: 400, damping: 28 });
    }
  };

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-[92%] max-w-sm md:hidden select-none pb-[env(safe-area-inset-bottom,0px)]">
      
      {/* Outer Off-White Pill Capsule */}
      <div 
        ref={containerRef}
        className="w-full h-14 bg-[#FFFDFC]/95 backdrop-blur-md border border-[#F4ECE3] rounded-full relative overflow-hidden flex items-center justify-between px-3 shadow-md shadow-brand-espresso/8"
      >
        
        {/* Layer 1: Roll-to-Reveal Animation Layer (Progressive unroll Left → Right) */}
        <motion.div 
          style={{ width: rollWidth, opacity: unrollOpacity }}
          className="absolute inset-y-1 left-1 z-10 flex items-center pointer-events-none rounded-full overflow-hidden bg-[#FFFDFC]/95"
        >
          {isNumismaticsPage ? (
            /* Fashion Collection Rack Image Reveal (Matching Image 2) */
            <div className="w-full h-full relative overflow-hidden rounded-full flex items-center justify-center bg-[#FBF9F6]">
              <img 
                src="/images/fashion-banner.jpg" 
                alt="Fashion Collection" 
                className="w-full h-full object-cover rounded-full shadow-inner"
              />
              <div className="absolute right-0 top-0 bottom-0 w-3 bg-[#F26A2E] shadow-md rounded-r-full" />
            </div>
          ) : (
            /* 3D Banknote Roll-to-Reveal Animation (Matching Image 1) */
            <motion.div 
              style={{ scaleX: unrollScaleX, transformOrigin: 'left center' }}
              className="w-full h-full relative overflow-hidden rounded-full flex items-center justify-center bg-[#7B75B8]"
            >
              <img 
                src="/images/inr-100-note.png" 
                alt="INR 100 Currency Note" 
                className="h-[90%] max-w-[95%] object-contain rounded-md shadow-xs opacity-95"
              />
              <div className="absolute right-0 top-0 bottom-0 w-3 bg-[#F26A2E] shadow-md rounded-r-full" />
            </motion.div>
          )}
        </motion.div>

        {/* Layer 2: Default Initial State Content & Icons (Matching Images 1 & 2) */}
        <div className="relative z-20 flex items-center space-x-1.5 pl-0.5 pointer-events-none">
          {/* Badge Icon */}
          <div className="w-8 h-8 rounded-full bg-[#FFF3EC] border border-[#F9E1D3] flex items-center justify-center text-sm shadow-xs flex-shrink-0">
            {isNumismaticsPage ? '👗' : '🪙'}
          </div>

          {/* Rolled Cylinder indicator beside gold coin (ONLY shown for Coins & Notes initial state) */}
          {!isNumismaticsPage && (
            <div className="w-3.5 h-8 bg-gradient-to-r from-[#8A84C8] via-[#7B75B8] to-[#5C5699] rounded-sm shadow-xs flex-shrink-0 border border-[#6B66A6]/40" />
          )}
        </div>

        {/* Center Label Text */}
        <motion.div 
          style={{ opacity: textOpacity }}
          className="relative z-20 flex items-center justify-center flex-grow px-2 text-center pointer-events-none"
        >
          <span className="font-sans font-bold text-[10px] sm:text-xs text-[#F26A2E] tracking-[0.14em] uppercase whitespace-nowrap drop-shadow-xs">
            {isNumismaticsPage ? 'SWIPE RIGHT FOR FASHION' : 'SWIPE RIGHT TO COINS & NOTES'}
          </span>
        </motion.div>

        {/* Right Arrow Cue: >> */}
        <div className="relative z-20 flex items-center pr-2 pointer-events-none">
          <motion.span 
            animate={{ x: [0, 4, 0] }}
            transition={{ repeat: Infinity, duration: 1.4, ease: 'easeInOut' }}
            className="font-mono font-bold text-xs sm:text-sm text-[#F26A2E] tracking-tighter"
          >
            &gt;&gt;
          </motion.span>
        </div>

        {/* Layer 3: Interactive Draggable Handle Overlay - STRICTLY SWIPE ONLY (NO TAPPING REDIRECT) */}
        <motion.div
          drag="x"
          dragConstraints={{ left: 0, right: maxDrag }}
          dragElastic={0}
          dragMomentum={false}
          style={{ x: dragX }}
          onDragEnd={handleDragEnd}
          className="absolute inset-0 z-30 cursor-grab active:cursor-grabbing rounded-full touch-none"
        />

      </div>

      {/* Completion Status Toast Message */}
      {statusMessage && (
        <motion.div 
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mt-1 text-[9px] font-bold text-[#F26A2E] tracking-wider uppercase"
        >
          {statusMessage}
        </motion.div>
      )}

    </div>
  );
};
