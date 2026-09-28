"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { useRouter, usePathname } from 'next/navigation';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { usePageTransition } from '../ui/PageTransitionOverlay';
import { ChevronRight } from 'lucide-react';

export const MobileBottomNav: React.FC = () => {
  const { setPage, activePage } = useApp();
  const router = useRouter();
  const pathname = usePathname();
  const { triggerSectionTransition } = usePageTransition();

  if (pathname?.startsWith('/admin')) {
    return null;
  }

  const containerRef = useRef<HTMLDivElement>(null);
  const [maxDrag, setMaxDrag] = useState(240);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const dragX = useMotionValue(0);

  useEffect(() => {
    const updateMaxDrag = () => {
      if (containerRef.current) {
        setMaxDrag(containerRef.current.clientWidth - 52);
      }
    };
    updateMaxDrag();
    window.addEventListener('resize', updateMaxDrag);
    return () => window.removeEventListener('resize', updateMaxDrag);
  }, []);

  useEffect(() => {
    setStatusMessage(null);
    animate(dragX, 0, { duration: 0.15 });
  }, [pathname, activePage]);

  const isNumis = Boolean(pathname?.includes('/numismatics'));

  useEffect(() => {
    dragX.set(0);
    setStatusMessage(null);
  }, [pathname, dragX]);

  const textOpacity = useTransform(dragX, [0, maxDrag * 0.6], [1, 0.15]);

  const handleDragEnd = (event: any, info: any) => {
    const currentX = dragX.get();
    const threshold = maxDrag * 0.38;

    if (currentX >= threshold || info.velocity.x > 220) {
      animate(dragX, maxDrag, { type: 'spring', stiffness: 350, damping: 28 }).then(() => {
        if (isNumis) {
          setStatusMessage('AADHYA');
          setTimeout(() => {
            setPage('home');
            triggerSectionTransition('fashion');
          }, 150);
        } else {
          setStatusMessage('AADHYA');
          setTimeout(() => {
            setPage('numismatics');
            triggerSectionTransition('numismatics');
          }, 150);
        }
      });
    } else {
      animate(dragX, 0, { type: 'spring', stiffness: 400, damping: 28 });
    }
  };

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-[92%] max-w-sm md:hidden select-none pb-[env(safe-area-inset-bottom,0px)]">
      {/* Outer Beige Capsule */}
      <div 
        ref={containerRef}
        className="w-full h-14 bg-[#EFE6DA]/95 backdrop-blur-md border border-[#D5C7B5] rounded-full relative overflow-hidden flex items-center justify-between px-2.5 shadow-lg shadow-black/10"
      >
        {/* Left Drag Indicator Handle */}
        <motion.div
          drag="x"
          dragConstraints={{ left: 0, right: maxDrag }}
          dragElastic={0}
          dragMomentum={false}
          style={{ x: dragX }}
          onDragEnd={handleDragEnd}
          className="w-10 h-10 rounded-full bg-[#181818] text-[#EFE6DA] flex items-center justify-center cursor-grab active:cursor-grabbing shadow-md z-30 touch-none flex-shrink-0"
        >
          <span className="font-serif font-black text-[10px] tracking-wider">A</span>
        </motion.div>

        {/* Center Label Text */}
        <motion.div 
          style={{ opacity: textOpacity }}
          className="relative z-10 flex flex-col items-center justify-center flex-grow px-2 text-center pointer-events-none"
        >
          <span className="font-serif font-black text-xs text-[#181818] tracking-[0.24em] uppercase">
            AADHYA
          </span>
          <span className="font-sans font-bold text-[8.5px] text-[#7A6B5C] tracking-[0.18em] uppercase">
            {isNumis ? 'SWIPE TO FASHION' : 'SWIPE TO COINS & NOTES'}
          </span>
        </motion.div>

        {/* Right Arrow Cue */}
        <div className="relative z-10 flex items-center pr-2 pointer-events-none text-[#7A6B5C]">
          <motion.div
            animate={{ x: [0, 4, 0] }}
            transition={{ repeat: Infinity, duration: 1.4, ease: 'easeInOut' }}
          >
            <ChevronRight className="w-4 h-4 stroke-[2.2]" />
          </motion.div>
        </div>
      </div>

      {statusMessage && (
        <motion.div 
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mt-1 text-[9px] font-bold text-[#181818] tracking-widest uppercase font-serif"
        >
          {statusMessage}
        </motion.div>
      )}
    </div>
  );
};
