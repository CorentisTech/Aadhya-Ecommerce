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

  // Motion value for drag offset X (0 to containerWidth)
  const dragX = useMotionValue(0);
  const [maxDrag, setMaxDrag] = useState(240);

  // Calculate max drag distance based on actual container width
  useEffect(() => {
    const updateMaxDrag = () => {
      if (containerRef.current) {
        // Container width minus handle padding
        setMaxDrag(containerRef.current.clientWidth - 50);
      }
    };
    updateMaxDrag();
    window.addEventListener('resize', updateMaxDrag);
    return () => window.removeEventListener('resize', updateMaxDrag);
  }, []);

  // Reset CTA state when route/page changes or when returning to fashion
  useEffect(() => {
    setIsCompleted(false);
    setIsDragging(false);
    animate(dragX, 0, { duration: 0.2 });
  }, [pathname, activePage]);

  // Derived animation values based on drag progress (0 to 1)
  // Note width expands from 0% to 100% of the drag handle width as user slides right
  const progress = useTransform(dragX, [0, maxDrag], [0, 1]);
  const noteClipWidth = useTransform(dragX, [0, maxDrag], ['0%', '100%']);
  const noteOpacity = useTransform(dragX, [0, 30, maxDrag], [0, 0.85, 1]);
  const textOpacity = useTransform(dragX, [0, maxDrag * 0.7], [1, 0.2]);

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDragEnd = (event: any, info: any) => {
    setIsDragging(false);
    const currentX = dragX.get();
    const threshold = maxDrag * 0.55; // 55% swipe threshold to trigger transition

    if (currentX >= threshold || info.velocity.x > 300) {
      // Swipe threshold met: complete reveal and trigger transition
      setIsCompleted(true);
      animate(dragX, maxDrag, { type: 'spring', stiffness: 300, damping: 25 }).then(() => {
        setTimeout(() => {
          setPage('numismatics');
          router.push('/numismatics');
        }, 150);
      });
    } else {
      // Released before threshold: animate smoothly back to initial state
      animate(dragX, 0, { type: 'spring', stiffness: 350, damping: 25 });
    }
  };

  // If user is already on numismatics page, offer a quick return gesture or clean toggle
  const isNumismaticsPage = pathname?.includes('/numismatics') || activePage === 'numismatics';

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-[92%] max-w-sm md:hidden select-none pb-[env(safe-area-inset-bottom,0px)]">
      
      {/* Single Premium Floating Pill CTA Container */}
      <div 
        ref={containerRef}
        className="w-full h-14 bg-[#FFFDFC]/95 backdrop-blur-md border border-[#F4ECE3] rounded-full relative overflow-hidden flex items-center justify-between px-3 shadow-md shadow-brand-espresso/8"
      >
        
        {/* Background Progressive Currency Note Reveal Layer (Left → Right) */}
        <motion.div 
          style={{ width: noteClipWidth, opacity: noteOpacity }}
          className="absolute inset-y-1 left-1 rounded-full overflow-hidden z-10 bg-gradient-to-r from-[#6B66A6]/20 via-[#8A84C8]/30 to-[#9E98D8]/40 border border-[#8A84C8]/40 flex items-center shadow-inner pointer-events-none"
        >
          <div className="w-full h-full relative flex items-center overflow-hidden rounded-full">
            <img 
              src="/images/inr-100-note.png" 
              alt="INR 100 Currency Note" 
              className="h-[92%] w-auto object-contain rounded-md shadow-xs opacity-95 ml-1"
            />
          </div>
        </motion.div>

        {/* Left Coin Icon / Accent */}
        <div className="relative z-20 flex items-center space-x-2 pl-1 pointer-events-none">
          <div className="w-9 h-9 rounded-full bg-[#FFF3EC] border border-[#F9E1D3] flex items-center justify-center text-base shadow-xs flex-shrink-0">
            🪙
          </div>
        </div>

        {/* Center Label Text */}
        <motion.div 
          style={{ opacity: textOpacity }}
          className="relative z-20 flex items-center justify-center flex-grow px-2 text-center pointer-events-none"
        >
          <span className="font-sans font-bold text-[11px] sm:text-xs text-[#2C2522] tracking-[0.15em] uppercase whitespace-nowrap">
            {isNumismaticsPage ? 'Swipe right to Fashion' : 'Swipe right to Coins & Notes'}
          </span>
        </motion.div>

        {/* Right Indicator: >> Arrow Cue */}
        <div className="relative z-20 flex items-center pr-2 pointer-events-none">
          <motion.span 
            animate={{ x: [0, 4, 0] }}
            transition={{ repeat: Infinity, duration: 1.4, ease: 'easeInOut' }}
            className="font-mono font-bold text-xs sm:text-sm text-[#F26A2E] tracking-tighter"
          >
            &gt;&gt;
          </motion.span>
        </div>

        {/* Interactive Draggable Handle Overlay */}
        <motion.div
          drag="x"
          dragConstraints={{ left: 0, right: maxDrag }}
          dragElastic={0.08}
          dragSnapToOrigin={false}
          style={{ x: dragX }}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onClick={() => {
            // Optional tap trigger for instant smooth slide & transition
            animate(dragX, maxDrag, { duration: 0.35 }).then(() => {
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
