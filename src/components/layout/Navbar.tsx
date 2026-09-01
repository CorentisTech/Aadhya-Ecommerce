"use client";

import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Search, 
  Heart, 
  User, 
  ShoppingBag, 
  X, 
  ArrowRight,
  Home,
  Sparkles,
  Compass,
  Grid,
  Info,
  Package,
  HelpCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter, usePathname } from 'next/navigation';
import { usePageTransition } from '../ui/PageTransitionOverlay';

export const Navbar: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { triggerSectionTransition } = usePageTransition();
  const { 
    activePage, 
    setPage, 
    cart, 
    wishlist, 
    setSearchOpen, 
    setAccountOpen, 
    setCartOpen 
  } = useApp();

  const [isScrolled, setIsScrolled] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [numismaticsHovered, setNumismaticsHovered] = useState(false);

  // Monitor scroll height to trigger background blur
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Monitor escape key to close sidebar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSidebarOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const cartItemsCount = cart.reduce((total, item) => total + item.quantity, 0);

  const handleNavClick = (sectionId: string) => {
    if (sectionId === 'categories') {
      router.push('/catalog');
      setSidebarOpen(false);
      return;
    }
    setPage('home');
    setSidebarOpen(false);
    setTimeout(() => {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  // Stagger variants for sidebar links
  const sidebarVariants = {
    closed: { 
      x: '-100%', 
      transition: { type: 'spring', damping: 26, stiffness: 220 } 
    },
    open: { 
      x: 0, 
      transition: { type: 'spring', damping: 26, stiffness: 220 } 
    }
  };

  const listVariants = {
    closed: {},
    open: {
      transition: { staggerChildren: 0.05 }
    }
  };

  const itemVariants = {
    closed: { opacity: 0, x: -15 },
    open: { opacity: 1, x: 0, transition: { duration: 0.35, ease: 'easeOut' } }
  };

  return (
    <>
      {/* Navbar Container - Fixed Height (68px) and Constant Spacing */}
      <header 
        className="sticky top-0 z-40 w-full max-w-full h-[68px] bg-[#FCFAF7]/94 backdrop-blur-[14px] border-b border-[#E8E1DA] px-3 sm:px-6 md:px-12 flex items-center justify-between box-border overflow-hidden"
      >
        {/* Left: Splitting Burger Trigger + Brand Logo Wordmark */}
        <div className="flex items-center space-x-2 sm:space-x-5">
          {/* Framer Motion Morphing Burger Button */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="flex flex-col justify-center items-center w-6 h-6 focus:outline-none relative z-50 cursor-pointer space-y-1"
            aria-label="Toggle Navigation Drawer"
          >
            <motion.span
              animate={sidebarOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.3 }}
              className="w-5 h-0.5 bg-brand-espresso rounded-full block"
            />
            <motion.span
              animate={sidebarOpen ? { opacity: 0, scale: 0 } : { opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
              className="w-5 h-0.5 bg-brand-espresso rounded-full block"
            />
            <motion.span
              animate={sidebarOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.3 }}
              className="w-5 h-0.5 bg-brand-espresso rounded-full block"
            />
          </button>

          <button
            onClick={() => { router.push('/'); setPage('home'); }}
            className="font-display text-xl md:text-2xl font-bold tracking-[0.25em] text-brand-espresso hover:opacity-85 transition-opacity"
          >
            AADHYA
          </button>
        </div>

        {/* Center: Desktop Navigation Links */}
        <nav className="hidden md:flex items-center space-x-8 text-[10px] font-bold tracking-[0.2em] text-brand-espresso">
          <button
            onClick={() => handleNavClick('bestsellers')}
            className="hover:text-[#F26A2E] transition-colors relative py-1 group"
          >
            BEST SELLERS
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#F26A2E] transition-all duration-300 group-hover:w-full" />
          </button>
          <button
            onClick={() => handleNavClick('new-arrivals')}
            className="hover:text-[#F26A2E] transition-colors relative py-1 group"
          >
            NEW ARRIVALS
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#F26A2E] transition-all duration-300 group-hover:w-full" />
          </button>
          <button
            onClick={() => handleNavClick('categories')}
            className="hover:text-[#F26A2E] transition-colors relative py-1 group"
          >
            CATEGORIES
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#F26A2E] transition-all duration-300 group-hover:w-full" />
          </button>
          <button
            onClick={() => handleNavClick('categories')}
            className="hover:text-[#F26A2E] transition-colors relative py-1 group"
          >
            ABOUT US
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#F26A2E] transition-all duration-300 group-hover:w-full" />
          </button>

          {/* Numismatics / Fashion Section Link */}
          <div
            className="relative"
            onMouseEnter={() => setNumismaticsHovered(true)}
            onMouseLeave={() => setNumismaticsHovered(false)}
          >
            <button
              onClick={() => {
                const isNumis = pathname?.includes('/numismatics') || activePage === 'numismatics';
                if (isNumis) {
                  setPage('home');
                  triggerSectionTransition('fashion');
                } else {
                  setPage('numismatics');
                  triggerSectionTransition('numismatics');
                }
              }}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-full border transition-all duration-300 ${
                (pathname?.includes('/numismatics') || activePage === 'numismatics') || numismaticsHovered
                  ? 'border-[#F26A2E] bg-[#FFF3EC] text-[#F26A2E] shadow-sm'
                  : 'border-brand-border/80 text-brand-warmGray'
              }`}
            >
              <div className="relative w-4 h-4 rounded-full overflow-hidden border border-[#2C2522] shadow-sm flex items-center justify-center bg-[#2C2522]">
                {(pathname?.includes('/numismatics') || activePage === 'numismatics') ? (
                  <span className="text-[9px]">👗</span>
                ) : (
                  <img
                    src="/coin_image_new.png"
                    alt="Coin"
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <span className="tracking-[0.2em] font-extrabold text-[9px] uppercase">
                {(pathname?.includes('/numismatics') || activePage === 'numismatics') ? 'FASHION' : 'COINS & NOTES'}
              </span>
            </button>

            {/* Premium Gold Accent Tooltip Popover */}
            <AnimatePresence>
              {numismaticsHovered && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 5, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute left-1/2 -translate-x-1/2 mt-2.5 w-52 bg-brand-espresso text-brand-warmWhite text-[9px] tracking-[0.12em] font-bold py-3.5 px-4 text-center rounded-2xl shadow-xl z-50 border border-brand-gold/30"
                >
                  <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-brand-espresso rotate-45 border-t border-l border-brand-gold/30" />
                  <p className="mb-2 text-brand-softBeige font-extrabold">Explore Coins & Currency</p>
                  <div className="flex items-center justify-center gap-1 text-brand-gold hover:text-brand-white transition-colors cursor-pointer text-[8px] tracking-[0.2em] uppercase font-extrabold">
                    <span>EXPLORE</span>
                    <ArrowRight className="w-2.5 h-2.5" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </nav>

        {/* Right: Core Actions Grid */}
        <div className="flex items-center space-x-2 sm:space-x-4 text-brand-espresso">
          <button
            onClick={() => setSearchOpen(true)}
            aria-label="Search"
            className="hover:text-brand-dustyRose transition-colors p-1"
          >
            <Search className="w-4 h-4 stroke-[2]" />
          </button>
          
          <button
            onClick={() => setPage('wishlist')}
            aria-label="Wishlist"
            className="hover:text-brand-dustyRose transition-colors p-1 relative"
          >
            <Heart className={`w-4 h-4 stroke-[2] ${activePage === 'wishlist' ? 'fill-brand-dustyRose stroke-brand-dustyRose' : ''}`} />
            {wishlist.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#F26A2E] text-brand-warmWhite text-[7px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center">
                {wishlist.length}
              </span>
            )}
          </button>

          <button
            onClick={() => router.push('/account')}
            aria-label="Account"
            className="hover:text-[#F26A2E] transition-colors p-1"
          >
            <User className="w-4 h-4 stroke-[2]" />
          </button>

          <button
            onClick={() => router.push('/cart')}
            aria-label="Cart"
            className="hover:text-[#F26A2E] transition-colors p-1 relative"
          >
            <ShoppingBag className="w-4 h-4 stroke-[2]" />
            {cartItemsCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#F26A2E] text-brand-warmWhite text-[7px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center">
                {cartItemsCount}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Glossy Translucent Left Sidebar Menu (YouTube Studio Theme Style) */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            {/* Dark blur background overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 z-50 bg-brand-espresso/30 backdrop-blur-sm"
            />

            {/* Translucent white sidebar panel (opens from left) */}
            <motion.div
              variants={sidebarVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="fixed left-0 top-0 bottom-0 z-50 w-full max-w-xs bg-brand-warmWhite/75 backdrop-blur-2xl border-r border-brand-border/60 shadow-2xl p-6 flex flex-col justify-between"
            >
              {/* Close Header */}
              <div className="flex items-center justify-between border-b border-brand-border/60 pb-4">
                <span className="font-display font-extrabold tracking-[0.25em] text-brand-espresso text-sm">AADHYA</span>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-1.5 hover:bg-brand-softBeige/65 rounded-full transition-colors"
                >
                  <X className="w-4.5 h-4.5 text-brand-warmGray" />
                </button>
              </div>

              {/* Glossy Link Items (Staggered inputs with icons) */}
              <motion.div 
                variants={listVariants}
                className="flex-grow py-6 space-y-6 overflow-y-auto"
              >
                <div className="space-y-2 text-left">
                  <span className="text-[8px] tracking-[0.25em] font-extrabold text-brand-warmGray block px-3">
                    FASHION EDITORIAL
                  </span>
                  
                  <nav className="flex flex-col space-y-1 font-sans text-xs font-bold tracking-widest text-brand-espresso">
                    {/* Home Link */}
                    <motion.button
                      variants={itemVariants}
                      onClick={() => { setPage('home'); setSidebarOpen(false); }}
                      className={`flex items-center space-x-3 py-3 px-4 rounded-xl text-left w-full transition-all relative ${
                        activePage === 'home' 
                          ? 'bg-[#FFF3EC] text-[#F26A2E] font-extrabold shadow-sm' 
                          : 'hover:bg-[#FFF3EC] text-brand-warmGray hover:text-[#F26A2E]'
                      }`}
                    >
                      {activePage === 'home' && (
                        <div className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-[#F26A2E] rounded-r-md" />
                      )}
                      <Home className="w-4 h-4 stroke-[2]" />
                      <span>HOME</span>
                    </motion.button>
                    
                    {/* Bestsellers Link */}
                    <motion.button
                      variants={itemVariants}
                      onClick={() => handleNavClick('bestsellers')}
                      className="flex items-center space-x-3 py-3 px-4 rounded-xl text-left w-full hover:bg-[#FFF3EC] text-brand-warmGray hover:text-[#F26A2E] transition-all"
                    >
                      <Sparkles className="w-4 h-4 stroke-[2]" />
                      <span>BEST SELLERS</span>
                    </motion.button>
                    
                    {/* New Arrivals Link */}
                    <motion.button
                      variants={itemVariants}
                      onClick={() => handleNavClick('new-arrivals')}
                      className="flex items-center space-x-3 py-3 px-4 rounded-xl text-left w-full hover:bg-[#FFF3EC] text-brand-warmGray hover:text-[#F26A2E] transition-all"
                    >
                      <Compass className="w-4 h-4 stroke-[2]" />
                      <span>NEW ARRIVALS</span>
                    </motion.button>
                    
                    {/* Categories Link */}
                    <motion.button
                      variants={itemVariants}
                      onClick={() => handleNavClick('categories')}
                      className="flex items-center space-x-3 py-3 px-4 rounded-xl text-left w-full hover:bg-[#FFF3EC] text-brand-warmGray hover:text-[#F26A2E] transition-all"
                    >
                      <Grid className="w-4 h-4 stroke-[2]" />
                      <span>CATEGORIES</span>
                    </motion.button>
 
                    {/* Shop Link */}
                    <motion.button
                      variants={itemVariants}
                      onClick={() => { setPage('home'); setSidebarOpen(false); }}
                      className="flex items-center space-x-3 py-3 px-4 rounded-xl text-left w-full hover:bg-[#FFF3EC] text-brand-warmGray hover:text-[#F26A2E] transition-all"
                    >
                      <ShoppingBag className="w-4 h-4 stroke-[2]" />
                      <span>SHOP COLLECTION</span>
                    </motion.button>
 
                    {/* About Link */}
                    <motion.button
                      variants={itemVariants}
                      onClick={() => handleNavClick('categories')}
                      className="flex items-center space-x-3 py-3 px-4 rounded-xl text-left w-full hover:bg-[#FFF3EC] text-brand-warmGray hover:text-[#F26A2E] transition-all"
                    >
                      <Info className="w-4 h-4 stroke-[2]" />
                      <span>ABOUT US</span>
                    </motion.button>
                  </nav>
                </div>

                <div className="w-full h-px bg-brand-border/60" />

                {/* Coin / Fashion Special Drawer Link */}
                <motion.div variants={itemVariants} className="px-3">
                  <button
                    onClick={() => {
                      setSidebarOpen(false);
                      const isNumis = pathname?.includes('/numismatics') || activePage === 'numismatics';
                      if (isNumis) {
                        setPage('home');
                        triggerSectionTransition('fashion');
                      } else {
                        setPage('numismatics');
                        triggerSectionTransition('numismatics');
                      }
                    }}
                    className={`flex items-center justify-between px-4 py-3 border rounded-2xl text-left font-sans text-[11px] font-extrabold w-full shadow-sm transition-all ${
                      (pathname?.includes('/numismatics') || activePage === 'numismatics')
                        ? 'bg-[#F26A2E] text-white border-[#E0591D]'
                        : 'bg-[#FFF3EC] text-[#F26A2E] border-[#F9E1D3]'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-5 h-5 rounded-full overflow-hidden border border-[#2C2522] flex items-center justify-center bg-[#2C2522]">
                        {(pathname?.includes('/numismatics') || activePage === 'numismatics') ? (
                          <span className="text-[10px]">👗</span>
                        ) : (
                          <img
                            src="/coin_image_new.png"
                            alt="Coin"
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <span className="tracking-widest">
                        {(pathname?.includes('/numismatics') || activePage === 'numismatics') ? 'FASHION' : 'COINS & NOTES'}
                      </span>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </motion.div>

                <div className="w-full h-px bg-brand-border/60" />

                {/* Account details links */}
                <motion.div 
                  variants={itemVariants}
                  className="flex flex-col space-y-1 font-sans text-xs font-bold tracking-widest text-brand-espresso"
                >
                  <button
                    onClick={() => { setAccountOpen(true); setSidebarOpen(false); }}
                    className="flex items-center space-x-3 py-3 px-4 rounded-xl text-left w-full hover:bg-[#FFF3EC] text-brand-warmGray hover:text-[#F26A2E] transition-all"
                  >
                    <User className="w-4 h-4 stroke-[2]" />
                    <span>ACCOUNT</span>
                  </button>
                  
                  <button
                    onClick={() => { setPage('wishlist'); setSidebarOpen(false); }}
                    className="flex items-center space-x-3 py-3 px-4 rounded-xl text-left w-full hover:bg-[#FFF3EC] text-brand-warmGray hover:text-[#F26A2E] transition-all"
                  >
                    <Heart className="w-4 h-4 stroke-[2]" />
                    <span>WISHLIST</span>
                  </button>

                  <button
                    onClick={() => { setAccountOpen(true); setSidebarOpen(false); }}
                    className="flex items-center space-x-3 py-3 px-4 rounded-xl text-left w-full hover:bg-[#FFF3EC] text-brand-warmGray hover:text-[#F26A2E] transition-all"
                  >
                    <Package className="w-4 h-4 stroke-[2]" />
                    <span>ORDERS</span>
                  </button>

                  <button
                    onClick={() => setSidebarOpen(false)}
                    className="flex items-center space-x-3 py-3 px-4 rounded-xl text-left w-full hover:bg-[#FFF3EC] text-brand-warmGray hover:text-[#F26A2E] transition-all"
                  >
                    <HelpCircle className="w-4 h-4 stroke-[2]" />
                    <span>HELP & SUPPORT</span>
                  </button>
                </motion.div>
              </motion.div>

              {/* Footer details */}
              <div className="border-t border-brand-border/60 pt-4 text-[9px] text-brand-warmGray font-extrabold tracking-widest text-left uppercase">
                © 2026 AADHYA. All Rights Reserved.
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
