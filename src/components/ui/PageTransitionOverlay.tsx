"use client";

import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useRouter } from 'next/navigation';

interface PageTransitionContextType {
  triggerSectionTransition: (target: 'numismatics' | 'fashion') => void;
  isTransitioning: boolean;
}

const PageTransitionContext = createContext<PageTransitionContextType | undefined>(undefined);

export const PageTransitionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();
  const shouldReduceMotion = useReducedMotion();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [targetSection, setTargetSection] = useState<'numismatics' | 'fashion'>('numismatics');
  
  // Animation stage states (controlled timeline)
  const [stage, setStage] = useState<'enter' | 'visual' | 'text' | 'settle' | 'exit'>('enter');
  const timeoutRefs = useRef<NodeJS.Timeout[]>([]);

  // Clear all pending timeouts on unmount or reset
  const clearTimeouts = () => {
    timeoutRefs.current.forEach(t => clearTimeout(t));
    timeoutRefs.current = [];
  };

  useEffect(() => {
    return () => {
      clearTimeouts();
      document.body.style.overflow = '';
    };
  }, []);

  const triggerSectionTransition = (target: 'numismatics' | 'fashion') => {
    // Prevent duplicate triggers or rapid clicks while running
    if (isTransitioning) return;

    clearTimeouts();
    setTargetSection(target);
    setIsTransitioning(true);
    setStage('enter');

    // Freeze page scroll immediately
    document.body.style.overflow = 'hidden';

    // Timeline Sequence (Total: ~2.55s)
    // 0.20s: Concentric rings start expanding
    const t1 = setTimeout(() => {
      setStage('visual');
    }, 250);

    // 1.15s: Visual settled, trigger text reveal
    const t2 = setTimeout(() => {
      setStage('text');
    }, 1150);

    // 1.70s: Load target route underneath while black overlay is fully opaque
    const t3 = setTimeout(() => {
      if (target === 'numismatics') {
        router.push('/numismatics');
      } else {
        router.push('/');
      }
    }, 1650);

    // 2.25s: Start smooth dissolve out
    const t4 = setTimeout(() => {
      setStage('exit');
    }, 2250);

    // 2.65s: Complete transition, restore body scroll & unmount
    const t5 = setTimeout(() => {
      setIsTransitioning(false);
      document.body.style.overflow = '';
      clearTimeouts();
    }, 2650);

    timeoutRefs.current = [t1, t2, t3, t4, t5];
  };

  const isNumis = targetSection === 'numismatics';

  return (
    <PageTransitionContext.Provider value={{ triggerSectionTransition, isTransitioning }}>
      {children}

      {/* ==================================================
          PREMIUM CINEMATIC SECTION-SWITCHING SPLASH OVERLAY
         ================================================== */}
      <AnimatePresence>
        {isTransitioning && (
          <motion.div
            key="aadhya-cinematic-splash"
            initial={{ opacity: 0 }}
            animate={{ opacity: stage === 'exit' ? 0 : 1 }}
            exit={{ opacity: 0 }}
            transition={{
              duration: stage === 'exit' ? 0.38 : 0.22,
              ease: [0.22, 1, 0.36, 1]
            }}
            className="fixed inset-0 z-[99999] w-screen h-screen max-w-full max-h-full bg-[#000000] text-white flex flex-col items-center justify-center select-none overflow-hidden touch-none pointer-events-auto"
            style={{ position: 'fixed', left: 0, top: 0, right: 0, bottom: 0 }}
            aria-live="polite"
            role="status"
          >
            {/* Background Ambient Radial Atmosphere Glow */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: [0, 0.45, 0.35], scale: [0.8, 1.15, 1.25] }}
              transition={{ duration: 2.3, ease: 'easeOut' }}
              className={`absolute w-[450px] sm:w-[650px] md:w-[850px] h-[450px] sm:h-[650px] md:h-[850px] rounded-full pointer-events-none blur-3xl ${
                isNumis
                  ? 'bg-gradient-to-r from-[#E0591D]/25 via-[#D4AF37]/20 to-transparent'
                  : 'bg-gradient-to-r from-[#C98F91]/25 via-[#F3DFDF]/15 to-transparent'
              }`}
            />

            {/* ==================================================
                CONCENTRIC GLOWING RINGS (Atmospheric, Luminous, Breathing)
               ================================================== */}
            {!shouldReduceMotion && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
                {/* Ring 1: scale 0.4 -> 1.2 */}
                <motion.div
                  initial={{ scale: 0.4, opacity: 0 }}
                  animate={{ 
                    scale: [0.4, 1.12, 1.2], 
                    opacity: [0, 0.55, 0.4] 
                  }}
                  transition={{ 
                    duration: 2.2, 
                    times: [0, 0.55, 1], 
                    ease: [0.16, 1, 0.3, 1] 
                  }}
                  className={`absolute w-36 h-36 sm:w-48 sm:h-48 md:w-56 md:h-56 rounded-full border border-dashed ${
                    isNumis
                      ? 'border-[#D4AF37]/40 shadow-[0_0_20px_rgba(212,175,55,0.25)]'
                      : 'border-[#F3DFDF]/40 shadow-[0_0_20px_rgba(201,143,145,0.25)]'
                  }`}
                />

                {/* Ring 2: scale 0.55 -> 1.35 */}
                <motion.div
                  initial={{ scale: 0.55, opacity: 0 }}
                  animate={{ 
                    scale: [0.55, 1.25, 1.35], 
                    opacity: [0, 0.45, 0.3] 
                  }}
                  transition={{ 
                    duration: 2.3, 
                    delay: 0.08, 
                    times: [0, 0.55, 1], 
                    ease: [0.16, 1, 0.3, 1] 
                  }}
                  className={`absolute w-52 h-52 sm:w-68 sm:h-68 md:w-80 md:h-80 rounded-full border ${
                    isNumis
                      ? 'border-[#E0591D]/30 border-t-[#D4AF37]/50 shadow-[0_0_30px_rgba(224,89,29,0.2)]'
                      : 'border-[#C98F91]/30 border-t-[#F3DFDF]/50 shadow-[0_0_30px_rgba(201,143,145,0.2)]'
                  }`}
                />

                {/* Ring 3: scale 0.7 -> 1.5 */}
                <motion.div
                  initial={{ scale: 0.7, opacity: 0 }}
                  animate={{ 
                    scale: [0.7, 1.38, 1.5], 
                    opacity: [0, 0.35, 0.2] 
                  }}
                  transition={{ 
                    duration: 2.4, 
                    delay: 0.14, 
                    times: [0, 0.55, 1], 
                    ease: [0.16, 1, 0.3, 1] 
                  }}
                  className={`absolute w-72 h-72 sm:w-96 sm:h-96 md:w-[440px] md:h-[440px] rounded-full border border-dotted ${
                    isNumis
                      ? 'border-[#B89A67]/25 shadow-[0_0_40px_rgba(184,154,103,0.15)]'
                      : 'border-[#C98F91]/25 shadow-[0_0_40px_rgba(201,143,145,0.15)]'
                  }`}
                />

                {/* Ring 4: scale 0.85 -> 1.65 */}
                <motion.div
                  initial={{ scale: 0.85, opacity: 0 }}
                  animate={{ 
                    scale: [0.85, 1.52, 1.65], 
                    opacity: [0, 0.25, 0.15] 
                  }}
                  transition={{ 
                    duration: 2.5, 
                    delay: 0.2, 
                    times: [0, 0.55, 1], 
                    ease: [0.16, 1, 0.3, 1] 
                  }}
                  className={`absolute w-96 h-96 sm:w-[460px] sm:h-[460px] md:w-[580px] md:h-[580px] rounded-full border ${
                    isNumis
                      ? 'border-[#E0591D]/20 border-b-[#D4AF37]/35'
                      : 'border-[#C98F91]/20 border-b-[#F3DFDF]/35'
                  }`}
                />

                {/* Ring 5: scale 1.0 -> 1.8 */}
                <motion.div
                  initial={{ scale: 1.0, opacity: 0 }}
                  animate={{ 
                    scale: [1.0, 1.68, 1.8], 
                    opacity: [0, 0.18, 0.08] 
                  }}
                  transition={{ 
                    duration: 2.55, 
                    delay: 0.26, 
                    times: [0, 0.55, 1], 
                    ease: [0.16, 1, 0.3, 1] 
                  }}
                  className={`absolute w-[440px] h-[440px] sm:w-[580px] sm:h-[580px] md:w-[740px] md:h-[740px] rounded-full border border-dashed ${
                    isNumis
                      ? 'border-[#D4AF37]/20 shadow-[0_0_50px_rgba(212,175,55,0.1)]'
                      : 'border-[#F3DFDF]/20 shadow-[0_0_50px_rgba(201,143,145,0.1)]'
                  }`}
                />
              </div>
            )}

            {/* ==================================================
                CENTER COMPOSITION: COIN / FASHION VISUAL + BRANDING
               ================================================== */}
            <div className="relative z-20 flex flex-col items-center justify-center text-center px-4 sm:px-6">
              
              {/* Emergent Center Visual: Transparent ₹1 Coin or Luxury Fashion */}
              <div className="relative flex items-center justify-center mb-6 sm:mb-8">
                
                {/* Luminous Glow Behind Hero Object */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: [0, 0.7, 0.55], scale: [0.6, 1.15, 1.05] }}
                  transition={{ duration: 1.6, delay: 0.35, ease: 'easeOut' }}
                  className={`absolute w-36 h-36 sm:w-48 sm:h-48 md:w-56 md:h-56 rounded-full pointer-events-none blur-xl ${
                    isNumis
                      ? 'bg-gradient-to-tr from-[#E0591D]/40 via-[#D4AF37]/35 to-amber-200/20'
                      : 'bg-gradient-to-tr from-[#C98F91]/40 via-[#F3DFDF]/35 to-rose-200/20'
                  }`}
                />

                {/* The Isolated Hero Graphic: Aadhya Trends Emblem Logo */}
                <motion.div
                  initial={{ 
                    opacity: 0, 
                    scale: shouldReduceMotion ? 1 : 0.75, 
                    rotate: shouldReduceMotion ? 0 : -8,
                    y: 8
                  }}
                  animate={{ 
                    opacity: 1, 
                    scale: 1, 
                    rotate: 0,
                    y: [0, -3, 0]
                  }}
                  transition={{
                    opacity: { duration: 0.65, delay: 0.38, ease: [0.22, 1, 0.36, 1] },
                    scale: { duration: 0.75, delay: 0.38, ease: [0.22, 1, 0.36, 1] },
                    rotate: { duration: 0.85, delay: 0.38, ease: [0.22, 1, 0.36, 1] },
                    y: { 
                      duration: 2.2, 
                      delay: 1.1, 
                      repeat: Infinity, 
                      ease: "easeInOut" 
                    }
                  }}
                  className="relative z-10 flex items-center justify-center select-none pointer-events-none"
                >
                  {/* Luxury Aadhya Trends Gold Emblem Logo */}
                  <div className="w-[140px] sm:w-[185px] md:w-[220px] lg:w-[240px] aspect-square rounded-full overflow-hidden flex items-center justify-center p-0.5 shadow-2xl drop-shadow-[0_16px_40px_rgba(212,175,55,0.45)] border border-[#D4AF37]/30 bg-black">
                    <img
                      src="/images/aadhya-trends-logo.jpg"
                      alt="Aadhya Trends Luxury Emblem"
                      className="w-full h-full object-cover rounded-full select-none"
                    />
                  </div>
                </motion.div>
              </div>

              {/* ==================================================
                  TYPOGRAPHY REVEAL: "Welcome to AADHYA" + Category Label
                 ================================================== */}
              <div className="space-y-1.5 sm:space-y-2.5">
                
                {/* Primary Text: "Welcome to AADHYA" */}
                <motion.h2
                  initial={{ 
                    opacity: 0, 
                    y: shouldReduceMotion ? 0 : 16,
                    filter: 'blur(5px)'
                  }}
                  animate={{ 
                    opacity: stage === 'text' || stage === 'settle' || stage === 'exit' ? 1 : 0, 
                    y: stage === 'text' || stage === 'settle' || stage === 'exit' ? 0 : 16,
                    filter: stage === 'text' || stage === 'settle' || stage === 'exit' ? 'blur(0px)' : 'blur(5px)'
                  }}
                  transition={{ 
                    duration: 0.65, 
                    ease: [0.16, 1, 0.3, 1] 
                  }}
                  className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-[42px] font-medium text-[#FAF7F2] tracking-wide leading-tight"
                >
                  Welcome to <span className="font-bold tracking-wider">AADHYA</span>
                </motion.h2>

                {/* Secondary Category Label: "Numismatics" or "Fashions" */}
                <motion.div
                  initial={{ 
                    opacity: 0, 
                    y: shouldReduceMotion ? 0 : 12,
                    filter: 'blur(4px)'
                  }}
                  animate={{ 
                    opacity: stage === 'text' || stage === 'settle' || stage === 'exit' ? 1 : 0, 
                    y: stage === 'text' || stage === 'settle' || stage === 'exit' ? 0 : 12,
                    filter: stage === 'text' || stage === 'settle' || stage === 'exit' ? 'blur(0px)' : 'blur(4px)'
                  }}
                  transition={{ 
                    duration: 0.55, 
                    delay: 0.22, 
                    ease: [0.16, 1, 0.3, 1] 
                  }}
                  className="flex items-center justify-center space-x-2 pt-0.5"
                >
                  <span className="w-4 sm:w-6 h-[1px] bg-white/25 inline-block" />
                  <span 
                    className={`font-sans text-xs sm:text-sm md:text-base font-extrabold tracking-[0.28em] sm:tracking-[0.32em] uppercase ${
                      isNumis ? 'text-[#D4AF37]' : 'text-[#E8A598]'
                    }`}
                  >
                    {isNumis ? 'Numismatics' : 'Fashions'}
                  </span>
                  <span className="w-4 sm:w-6 h-[1px] bg-white/25 inline-block" />
                </motion.div>

              </div>

            </div>

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
