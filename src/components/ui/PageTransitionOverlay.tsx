"use client";

import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter, usePathname } from 'next/navigation';

interface PageTransitionContextType {
  triggerSectionTransition: (target: 'numismatics' | 'fashion') => void;
  isTransitioning: boolean;
}

const PageTransitionContext = createContext<PageTransitionContextType | undefined>(undefined);

export const PageTransitionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [targetSection, setTargetSection] = useState<'numismatics' | 'fashion'>('numismatics');
  const timeoutRefs = useRef<NodeJS.Timeout[]>([]);

  const isSharedPage = (path?: string | null) => {
    if (!path) return false;
    return ['/wishlist', '/cart', '/checkout', '/account', '/admin'].some(p => path.startsWith(p));
  };

  const currentDepartment = pathname?.includes('/numismatics') ? 'numismatics' : 'fashion';
  const prevDepartmentRef = useRef<'numismatics' | 'fashion'>(currentDepartment);
  const prevPathRef = useRef<string | null>(pathname);
  const isTransitioningRef = useRef(false);

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

  useEffect(() => {
    isTransitioningRef.current = isTransitioning;
  }, [isTransitioning]);

  // Intercept browser back/forward between Fashion and Numismatics
  useEffect(() => {
    const prevPath = prevPathRef.current;
    prevPathRef.current = pathname;

    if (isSharedPage(pathname) || isSharedPage(prevPath)) {
      prevDepartmentRef.current = currentDepartment;
      return;
    }

    if (prevDepartmentRef.current !== currentDepartment) {
      const target = currentDepartment;
      prevDepartmentRef.current = target;

      if (!isTransitioningRef.current) {
        clearTimeouts();
        setTargetSection(target);
        setIsTransitioning(true);
        isTransitioningRef.current = true;
        document.body.style.overflow = 'hidden';

        const t1 = setTimeout(() => {
          setIsTransitioning(false);
          isTransitioningRef.current = false;
          document.body.style.overflow = '';
          clearTimeouts();
        }, 1100);

        timeoutRefs.current = [t1];
      }
    }
  }, [currentDepartment, pathname]);

  const triggerSectionTransition = (target: 'numismatics' | 'fashion') => {
    if (isTransitioningRef.current) return;

    clearTimeouts();
    setTargetSection(target);
    setIsTransitioning(true);
    isTransitioningRef.current = true;
    prevDepartmentRef.current = target;
    document.body.style.overflow = 'hidden';

    // Route switch halfway through transition while black overlay is fully opaque
    const t1 = setTimeout(() => {
      if (target === 'numismatics') {
        router.push('/numismatics');
      } else {
        router.push('/');
      }
    }, 600);

    const t2 = setTimeout(() => {
      setIsTransitioning(false);
      isTransitioningRef.current = false;
      document.body.style.overflow = '';
      clearTimeouts();
    }, 1250);

    timeoutRefs.current = [t1, t2];
  };

  return (
    <PageTransitionContext.Provider value={{ triggerSectionTransition, isTransitioning }}>
      {children}

      {/* ==================================================
          BLACK BACKGROUND + BOLD WHITE "AADHYA" SWITCHING OVERLAY
          (Strictly matching Part 9: No images, no sub-brands, smooth & premium)
         ================================================== */}
      <AnimatePresence>
        {isTransitioning && (
          <motion.div
            key="aadhya-pure-switch"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="fixed inset-0 z-[99999] w-screen h-screen bg-[#000000] text-white flex flex-col items-center justify-center select-none overflow-hidden touch-none pointer-events-auto"
            style={{ position: 'fixed', left: 0, top: 0, right: 0, bottom: 0 }}
            aria-live="polite"
            role="status"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.04 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center justify-center text-center px-6"
            >
              <h1 className="font-serif font-black text-3xl sm:text-5xl md:text-6xl lg:text-7xl tracking-[0.32em] text-[#FFFFFF] uppercase select-none leading-none">
                AADHYA
              </h1>
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
