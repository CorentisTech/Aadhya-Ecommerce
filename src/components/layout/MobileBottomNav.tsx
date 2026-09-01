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
    animate(dragX, 0, { duration: 0.15 });
  }, [pathname, activePage]);

  // Derived clip-path value for zero-gap unmasking (Left → Right)
  const noteClipPercentage = useTransform(dragX, [0, maxDrag], [100, 0]);
  const clipPathStyle = useTransform(noteClipPercentage, (v) => `inset(0 ${v}% 0 0)`);
  const textOpacity = useTransform(dragX, [0, maxDrag * 0.7], [1, 0.25]);

  const isNumismaticsPage = pathname?.includes('/numismatics') || activePage === 'numismatics';

  const handleDragEnd = (event: any, info: any) => {
    const currentX = dragX.get();
    const threshold = maxDrag * 0.4; // 40% swipe threshold to trigger section switch

    if (currentX >= threshold || info.velocity.x > 200) {
      // Complete drag handle to right edge cleanly
      animate(dragX, maxDrag, { type: 'spring', stiffness: 400, damping: 30 }).then(() => {
        // Trigger smooth zoom rollout opening screen animation
        if (isNumismaticsPage) {
          setPage('home');
          triggerSectionTransition('fashion');
        } else {
          setPage('numismatics');
          triggerSectionTransition('numismatics');
        }
      });
    } else {
      // Released before threshold: animate smoothly back to 0
      animate(dragX, 0, { type: 'spring', stiffness: 400, damping: 28 });
    }
  };

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-[92%] max-w-sm md:hidden select-none pb-[env(safe-area-inset-bottom,0px)]">
      
      {/* Outer Pill Capsule */}
      <div 
        ref={containerRef}
        className={`w-full h-14 rounded-full relative overflow-hidden flex items-center justify-between px-3 shadow-md transition-colors ${
          isNumismaticsPage 
            ? 'bg-[#F26A2E] text-white border border-[#E0591D]' 
            : 'bg-[#FFFDFC]/95 backdrop-blur-md border border-[#F4ECE3] shadow-brand-espresso/8'
        }`}
      >
        
        {/* Layer 1: Banknote Progressive Unmasking Layer (ONLY shown for switching to Numismatics, ZERO GAPS) */}
        {!isNumismaticsPage && (
          <motion.div 
            style={{ clipPath: clipPathStyle }}
            className="absolute inset-0 z-10 bg-[#7B75B8] flex items-center pointer-events-none rounded-full overflow-hidden"
          >
            <div className="w-full h-full relative overflow-hidden rounded-full flex items-center">
              {/* Full Banknote image filling 100% capsule height and width with ZERO empty gaps */}
              <img 
                src="/images/inr-100-note.png" 
                alt="INR 100 Currency Note" 
                className="w-full h-full object-cover object-left rounded-full shadow-inner"
              />
              {/* Orange drag edge indicator matching reference UI */}
              <div className="absolute right-0 top-0 bottom-0 w-3.5 bg-[#F26A2E] shadow-md rounded-r-full" />
            </div>
          </motion.div>
        )}

        {/* Layer 2: Default Initial State Content & Text Overlay */}
        <div className="relative z-20 flex items-center space-x-2 pl-1 pointer-events-none">
          <div className={`w-8 h-8 rounded-full border flex items-center justify-center text-sm shadow-xs flex-shrink-0 ${
            isNumismaticsPage 
              ? 'bg-white/20 border-white/30 text-white' 
              : 'bg-[#FFF3EC] border-[#F9E1D3]'
          }`}>
            {isNumismaticsPage ? '👗' : '🪙'}
          </div>
        </div>

        <motion.div 
          style={{ opacity: textOpacity }}
          className="relative z-20 flex items-center justify-center flex-grow px-2 text-center pointer-events-none"
        >
          <span className={`font-sans font-bold text-[10px] sm:text-xs tracking-[0.14em] uppercase whitespace-nowrap drop-shadow-xs ${
            isNumismaticsPage ? 'text-white' : 'text-[#F26A2E]'
          }`}>
            {isNumismaticsPage ? 'Swipe right to Fashion' : 'Swipe right to Coins & Notes'}
          </span>
        </motion.div>

        <div className="relative z-20 flex items-center pr-2 pointer-events-none">
          <motion.span 
            animate={{ x: [0, 4, 0] }}
            transition={{ repeat: Infinity, duration: 1.4, ease: 'easeInOut' }}
            className={`font-mono font-bold text-xs sm:text-sm tracking-tighter ${
              isNumismaticsPage ? 'text-white' : 'text-[#F26A2E]'
            }`}
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

    </div>
  );
};
