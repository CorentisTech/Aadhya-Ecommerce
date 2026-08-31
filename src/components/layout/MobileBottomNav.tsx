"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { useRouter, usePathname } from 'next/navigation';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';

export const MobileBottomNav: React.FC = () => {
  const { setPage, activePage } = useApp();
  const router = useRouter();
  const pathname = usePathname();

  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  // Motion value for drag offset X (0 to maxDrag)
  const dragX = useMotionValue(0);
  const [maxDrag, setMaxDrag] = useState(240);

  // Calculate max drag distance based on container width
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

  // Reset CTA state when route/page changes
  useEffect(() => {
    setIsCompleted(false);
    setIsDragging(false);
    animate(dragX, 0, { duration: 0.2 });
  }, [pathname, activePage]);

  // Derived clip-path value for zero-zoom, progressive unmasking (Left → Right)
  // Image scale remains 100% FIXED without zooming or scaling distortions
  const noteClipPercentage = useTransform(dragX, [0, maxDrag], [100, 0]);
  const clipPathStyle = useTransform(noteClipPercentage, (v) => `inset(0 ${v}% 0 0)`);
  const textOpacity = useTransform(dragX, [0, maxDrag * 0.7], [1, 0.4]);

  const handleDragEnd = (event: any, info: any) => {
    setIsDragging(false);
    const currentX = dragX.get();
    const threshold = maxDrag * 0.45; // 45% swipe threshold to trigger transition

    if (currentX >= threshold || info.velocity.x > 250) {
      // Threshold reached: fully unmask note and trigger transition to Numismatics
      setIsCompleted(true);
      animate(dragX, maxDrag, { type: 'spring', stiffness: 300, damping: 25 }).then(() => {
        setTimeout(() => {
          setPage('numismatics');
          router.push('/numismatics');
        }, 180);
      });
    } else {
      // Released before threshold: animate smoothly back to initial state
      animate(dragX, 0, { type: 'spring', stiffness: 350, damping: 25 });
    }
  };

  const isNumismaticsPage = pathname?.includes('/numismatics') || activePage === 'numismatics';

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-[92%] max-w-sm md:hidden select-none pb-[env(safe-area-inset-bottom,0px)]">
      
      {/* Outer Pill Capsule */}
      <div 
        ref={containerRef}
        className="w-full h-14 bg-[#FFFDFC]/95 backdrop-blur-md border border-[#F4ECE3] rounded-full relative overflow-hidden flex items-center justify-between px-3 shadow-md shadow-brand-espresso/8"
      >
        
        {/* Layer 1: Banknote Progressive Unmasking Layer (Clip-path Left → Right, NO ZOOMING) */}
        <motion.div 
          style={{ clipPath: clipPathStyle }}
          className="absolute inset-0 z-10 bg-[#7B75B8] flex items-center pointer-events-none rounded-full overflow-hidden"
        >
          <div className="w-full h-full relative overflow-hidden rounded-full flex items-center justify-center p-0.5">
            {/* Full Un-zoomed Banknote image at 100% fixed size */}
            <img 
              src="/images/inr-100-note.png" 
              alt="INR 100 Currency Note" 
              className="w-full h-full object-contain rounded-full shadow-inner"
            />
            {/* Orange drag edge indicator matching reference UI */}
            <div className="absolute right-0 top-0 bottom-0 w-3 bg-[#F26A2E] shadow-md rounded-r-full" />
          </div>
        </motion.div>

        {/* Layer 2: Default Initial State Content & Text Overlay */}
        <div className="relative z-20 flex items-center space-x-2 pl-1 pointer-events-none">
          <div className="w-8 h-8 rounded-full bg-[#FFF3EC] border border-[#F9E1D3] flex items-center justify-center text-sm shadow-xs flex-shrink-0">
            🪙
          </div>
        </div>

        <motion.div 
          style={{ opacity: textOpacity }}
          className="relative z-20 flex items-center justify-center flex-grow px-2 text-center pointer-events-none"
        >
          <span className="font-sans font-bold text-[10px] sm:text-xs text-[#F26A2E] tracking-[0.14em] uppercase whitespace-nowrap drop-shadow-xs">
            {isNumismaticsPage ? 'Swipe to Fashion' : 'Swipe to Coins & Notes'}
          </span>
        </motion.div>

        <div className="relative z-20 flex items-center pr-2 pointer-events-none">
          <motion.span 
            animate={{ x: [0, 4, 0] }}
            transition={{ repeat: Infinity, duration: 1.4, ease: 'easeInOut' }}
            className="font-mono font-bold text-xs sm:text-sm text-[#F26A2E] tracking-tighter"
          >
            &gt;&gt;
          </motion.span>
        </div>

        {/* Layer 3: Interactive Draggable Handle Overlay */}
        <motion.div
          drag="x"
          dragConstraints={{ left: 0, right: maxDrag }}
          dragElastic={0.05}
          dragSnapToOrigin={false}
          style={{ x: dragX }}
          onDragStart={() => setIsDragging(true)}
          onDragEnd={handleDragEnd}
          onClick={() => {
            animate(dragX, maxDrag, { duration: 0.3 }).then(() => {
              setPage('numismatics');
              router.push('/numismatics');
            });
          }}
          className="absolute inset-0 z-30 cursor-grab active:cursor-grabbing rounded-full touch-none"
        />

      </div>

    </div>
  );
};
