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

  // Derived progressive reveal calculations (Left → Right)
  const progress = useTransform(dragX, [0, maxDrag], [0, 1]);
  const noteClipWidth = useTransform(dragX, [0, maxDrag], ['0%', '100%']);
  const textOpacity = useTransform(dragX, [0, maxDrag * 0.45], [1, 0]);

  const handleDragEnd = (event: any, info: any) => {
    setIsDragging(false);
    const currentX = dragX.get();
    const threshold = maxDrag * 0.45; // 45% swipe threshold to trigger transition

    if (currentX >= threshold || info.velocity.x > 250) {
      // Threshold reached: fully reveal note and trigger transition to Numismatics
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
        
        {/* Layer 1: Banknote Progressive Reveal Layer (Expands Left → Right, filling 100% CTA height) */}
        <motion.div 
          style={{ width: noteClipWidth }}
          className="absolute inset-y-0 left-0 rounded-full overflow-hidden z-10 bg-[#7B75B8] flex items-center pointer-events-none"
        >
          <div className="w-full h-full relative overflow-hidden rounded-full flex items-center">
            {/* Cropped Banknote image spanning 100% capsule height */}
            <img 
              src="/images/inr-100-note.png" 
              alt="INR 100 Currency Note" 
              className="w-full h-full object-cover object-left rounded-full shadow-inner"
            />
            {/* Orange drag edge indicator matching reference image 4 */}
            <div className="absolute right-0 top-0 bottom-0 w-3.5 bg-[#F26A2E] shadow-md rounded-r-full" />
          </div>
        </motion.div>

        {/* Layer 2: Default Initial State Content */}
        <div className="relative z-20 flex items-center space-x-2 pl-1 pointer-events-none">
          <div className="w-9 h-9 rounded-full bg-[#FFF3EC] border border-[#F9E1D3] flex items-center justify-center text-base shadow-xs flex-shrink-0">
            🪙
          </div>
        </div>

        <motion.div 
          style={{ opacity: textOpacity }}
          className="relative z-20 flex items-center justify-center flex-grow px-2 text-center pointer-events-none"
        >
          <span className="font-sans font-bold text-[11px] sm:text-xs text-[#F26A2E] tracking-[0.18em] uppercase whitespace-nowrap">
            {isNumismaticsPage ? 'Swipe right to Fashion' : 'COINS & NOTES'}
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
