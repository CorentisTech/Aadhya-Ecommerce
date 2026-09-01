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

  // Derived 3D Roll-Out Motion Animation values as user drags Left → Right
  const rollWidth = useTransform(dragX, [0, maxDrag], ['12%', '100%']);
  const unrollScaleX = useTransform(dragX, [0, maxDrag], [0.18, 1]);
  const unrollRotateY = useTransform(dragX, [0, maxDrag], [-65, 0]);
  const unrollSkewY = useTransform(dragX, [0, maxDrag * 0.5, maxDrag], [6, -2, 0]);
  const unrollOpacity = useTransform(dragX, [0, 15, maxDrag], [0, 0.9, 1]);
  const textOpacity = useTransform(dragX, [0, maxDrag * 0.65], [1, 0.2]);

  const isNumismaticsPage = pathname?.includes('/numismatics') || activePage === 'numismatics';

  const handleDragEnd = (event: any, info: any) => {
    const currentX = dragX.get();
    const threshold = maxDrag * 0.4; // 40% swipe threshold to trigger section switch

    if (currentX >= threshold || info.velocity.x > 200) {
      // Complete roll out animation cleanly to right edge
      animate(dragX, maxDrag, { type: 'spring', stiffness: 380, damping: 28 }).then(() => {
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
      // Released before threshold: animate smoothly back to rolled up state
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
        
        {/* Layer 1: Banknote 3D Roll-Out Motion Unrolling Layer (ONLY for switching to Numismatics) */}
        {!isNumismaticsPage && (
          <motion.div 
            style={{ width: rollWidth, opacity: unrollOpacity }}
            className="absolute inset-y-1 left-1 z-10 flex items-center pointer-events-none rounded-full overflow-hidden bg-gradient-to-r from-[#6B66A6]/30 via-[#8A84C8]/40 to-[#9E98D8]/50 p-0.5 border border-[#8A84C8]/40 shadow-inner"
          >
            {/* 3D Perspective Roll-Out Container */}
            <motion.div 
              style={{ 
                scaleX: unrollScaleX, 
                rotateY: unrollRotateY, 
                skewY: unrollSkewY,
                transformOrigin: 'left center',
                perspective: 800
              }}
              className="w-full h-full relative overflow-hidden rounded-full flex items-center justify-center bg-[#7B75B8]"
            >
              {/* Concise, Fully Visible Banknote image (Entire note fitted inside CTA, no cutting in half) */}
              <img 
                src="/images/inr-100-note.png" 
                alt="INR 100 Currency Note" 
                className="h-[88%] max-w-[95%] object-contain rounded-md shadow-xs opacity-95"
              />
              {/* Orange drag edge indicator matching reference UI */}
              <div className="absolute right-0 top-0 bottom-0 w-3 bg-[#F26A2E] shadow-md rounded-r-full" />
            </motion.div>
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
