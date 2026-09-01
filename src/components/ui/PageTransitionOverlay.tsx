"use client";

import React, { createContext, useContext, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

interface PageTransitionContextType {
  triggerSectionTransition: (target: 'numismatics' | 'fashion') => void;
  isTransitioning: boolean;
}

const PageTransitionContext = createContext<PageTransitionContextType | undefined>(undefined);

export const PageTransitionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [targetSection, setTargetSection] = useState<'numismatics' | 'fashion'>('numismatics');

  const triggerSectionTransition = (target: 'numismatics' | 'fashion') => {
    if (isTransitioning) return;
    setTargetSection(target);
    setIsTransitioning(true);

    // Navigate to target route at peak transition frame
    setTimeout(() => {
      if (target === 'numismatics') {
        router.push('/numismatics');
      } else {
        router.push('/');
      }
    }, 320);

    // Complete overlay fade-out
    setTimeout(() => {
      setIsTransitioning(false);
    }, 750);
  };

  return (
    <PageTransitionContext.Provider value={{ triggerSectionTransition, isTransitioning }}>
      {children}

      {/* Luxury Zoom Rollout Opening Screen Animation */}
      <AnimatePresence>
        {isTransitioning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-[#1C1816] flex flex-col items-center justify-center pointer-events-auto select-none overflow-hidden"
          >
            {/* Expanding Radial Golden Portal Ring */}
            <motion.div
              initial={{ scale: 0.4, opacity: 0 }}
              animate={{ scale: [0.5, 1.4, 25], opacity: [0, 1, 1, 0] }}
              transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
              className="absolute w-40 h-40 rounded-full border-2 border-[#B89A67]/40 bg-gradient-to-tr from-[#9A7955]/30 via-[#B89A67]/20 to-transparent blur-xs pointer-events-none"
            />

            {/* Center Heritage Medallion Emblem */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 15 }}
              animate={{ scale: [0.95, 1.05, 1.1], opacity: [0, 1, 0.9, 0], y: 0 }}
              transition={{ duration: 0.7, times: [0, 0.3, 0.7, 1] }}
              className="relative z-10 flex flex-col items-center text-center space-y-4 px-6"
            >
              <div className="w-16 h-16 rounded-full bg-[#9A7955]/20 border border-[#B89A67]/50 flex items-center justify-center text-3xl shadow-xl">
                {targetSection === 'numismatics' ? '🪙' : '👗'}
              </div>

              <div className="space-y-1">
                <span className="text-[9px] font-extrabold tracking-[0.3em] text-[#B89A67] uppercase block">
                  AADHYA ATELIER
                </span>
                <h2 className="font-display font-bold text-xl md:text-2xl text-[#FCFAF7] tracking-wider uppercase">
                  {targetSection === 'numismatics'
                    ? 'Entering Coins & Notes'
                    : 'Returning to Fashion'}
                </h2>
                <p className="text-[10px] text-[#756E69] font-medium tracking-widest uppercase">
                  {targetSection === 'numismatics'
                    ? 'Certified Indian Heritage Coins & Currency'
                    : 'Handcrafted Couture & Western Silhouettes'}
                </p>
              </div>

              <div className="w-12 h-0.5 bg-[#B89A67]/40 mt-2 animate-pulse" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageTransitionContext.Provider>
  );
};

export const usePageTransition = () => {
  const context = useContext(PageTransitionContext);
  if (!context) {
    throw new Error('usePageTransition must be used within a PageTransitionProvider');
  }
  return context;
};
