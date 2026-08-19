"use client";

import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Search, Heart, User, ShoppingBag, Menu, X, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Navbar: React.FC = () => {
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
      transition: { type: 'spring', damping: 25, stiffness: 200 } 
    },
    open: { 
      x: 0, 
      transition: { type: 'spring', damping: 25, stiffness: 200 } 
    }
  };

  const listVariants = {
    closed: {},
    open: {
      transition: { staggerChildren: 0.06 }
    }
  };

  const itemVariants = {
    closed: { opacity: 0, x: -20 },
    open: { opacity: 1, x: 0, transition: { duration: 0.4, ease: 'easeOut' } }
  };

  return (
    <>
      {/* Navbar Container */}
      <header 
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          isScrolled 
            ? 'bg-brand-warmWhite/85 backdrop-blur-lg border-b border-brand-border/60 py-3' 
            : 'bg-brand-warmWhite border-b border-brand-border/20 py-5'
        } px-6 md:px-12 flex items-center justify-between`}
      >
        {/* Left: Brand Logo Wordmark */}
        <div className="flex items-center">
          <button
            onClick={() => setPage('home')}
            className="font-display text-xl md:text-2xl font-bold tracking-[0.25em] text-brand-espresso hover:opacity-85 transition-opacity"
          >
            AADHYA
          </button>
        </div>

        {/* Center: Desktop Navigation Links */}
        <nav className="hidden md:flex items-center space-x-8 text-[10px] font-bold tracking-[0.2em] text-brand-espresso">
          <button
            onClick={() => handleNavClick('bestsellers')}
            className="hover:text-brand-dustyRose transition-colors relative py-1 group"
          >
            BEST SELLERS
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-brand-dustyRose transition-all duration-300 group-hover:w-full" />
          </button>
          <button
            onClick={() => handleNavClick('new-arrivals')}
            className="hover:text-brand-dustyRose transition-colors relative py-1 group"
          >
            NEW ARRIVALS
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-brand-dustyRose transition-all duration-300 group-hover:w-full" />
          </button>
          <button
            onClick={() => handleNavClick('categories')}
            className="hover:text-brand-dustyRose transition-colors relative py-1 group"
          >
            CATEGORIES
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-brand-dustyRose transition-all duration-300 group-hover:w-full" />
          </button>
          <button
            onClick={() => handleNavClick('categories')} // Curations
            className="hover:text-brand-dustyRose transition-colors relative py-1 group"
          >
            ABOUT US
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-brand-dustyRose transition-all duration-300 group-hover:w-full" />
          </button>

          {/* Numismatics Item with custom popup card */}
          <div
            className="relative"
            onMouseEnter={() => setNumismaticsHovered(true)}
            onMouseLeave={() => setNumismaticsHovered(false)}
          >
            <button
              onClick={() => setPage('numismatics')}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-full border transition-all duration-300 ${
                activePage === 'numismatics' || numismaticsHovered
                  ? 'border-brand-antiqueBronze/60 bg-brand-softBeige text-brand-antiqueBronze shadow-sm shadow-brand-antiqueBronze/10'
                  : 'border-brand-border/80 text-brand-warmGray'
              }`}
            >
              {/* Spinning Coin */}
              <div className="relative w-4 h-4 perspective-1000 preserve-3d">
                <motion.div
                  className="w-full h-full rounded-full bg-brand-gold border border-brand-antiqueBronze/40 flex items-center justify-center text-[7px] font-bold text-brand-espresso"
                  animate={{ rotateY: 360 }}
                  transition={{
                    repeat: Infinity,
                    duration: numismaticsHovered ? 2.5 : 7,
                    ease: 'linear',
                  }}
                  style={{ backfaceVisibility: 'hidden' }}
                >
                  🪙
                </motion.div>
              </div>
              <span className="tracking-[0.2em] font-extrabold text-[9px] uppercase">NUMISMATICS</span>
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
                  <p className="mb-2 text-brand-softBeige">Explore Coins & Currency</p>
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
        <div className="flex items-center space-x-4 text-brand-espresso">
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
              <span className="absolute -top-1 -right-1 bg-brand-sale text-brand-warmWhite text-[7px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center">
                {wishlist.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setAccountOpen(true)}
            aria-label="Account"
            className="hover:text-brand-dustyRose transition-colors p-1"
          >
            <User className="w-4 h-4 stroke-[2]" />
          </button>

          <button
            onClick={() => setCartOpen(true)}
            aria-label="Cart"
            className="hover:text-brand-dustyRose transition-colors p-1 relative"
          >
            <ShoppingBag className="w-4 h-4 stroke-[2]" />
            {cartItemsCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-brand-espresso text-brand-warmWhite text-[7px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center">
                {cartItemsCount}
              </span>
            )}
          </button>

          {/* Desktop & Mobile General Menu Icon (Opens left side panel) */}
          <button
            onClick={() => setSidebarOpen(true)}
            aria-label="Menu"
            className="p-1 hover:text-brand-dustyRose transition-colors border-l border-brand-border/60 pl-3 ml-1"
          >
            <Menu className="w-5 h-5 stroke-[2]" />
          </button>
        </div>
      </header>

      {/* Modern Glassy Navigation Drawer (opens from Left) */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            {/* Dark background overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 z-50 bg-brand-espresso/35 backdrop-blur-sm"
            />

            {/* Glassy Sidebar panel (opens from left) */}
            <motion.div
              variants={sidebarVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="fixed left-0 top-0 bottom-0 z-50 w-full max-w-sm bg-[#FCFAF7]/75 backdrop-blur-xl border-r border-[#E8E1DA]/80 shadow-2xl p-8 flex flex-col justify-between"
            >
              {/* Close Head block */}
              <div className="flex items-center justify-between border-b border-brand-border pb-4">
                <span className="font-display font-bold tracking-[0.25em] text-brand-espresso">AADHYA</span>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-1.5 hover:bg-brand-softBeige/60 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-brand-warmGray" />
                </button>
              </div>

              {/* Staggered Links Container */}
              <motion.div 
                variants={listVariants}
                className="flex-grow py-8 space-y-8 overflow-y-auto"
              >
                <div className="space-y-4 text-left">
                  <span className="text-[9px] tracking-[0.25em] font-extrabold text-brand-warmGray block">
                    DEPARTMENTS
                  </span>
                  
                  <nav className="flex flex-col space-y-3.5 font-display text-xl font-bold tracking-wide text-brand-espresso">
                    <motion.button
                      variants={itemVariants}
                      onClick={() => { setPage('home'); setSidebarOpen(false); }}
                      className="text-left hover:text-brand-dustyRose transition-colors"
                    >
                      HOME
                    </motion.button>
                    
                    <motion.button
                      variants={itemVariants}
                      onClick={() => handleNavClick('bestsellers')}
                      className="text-left hover:text-brand-dustyRose transition-colors"
                    >
                      BEST SELLERS
                    </motion.button>
                    
                    <motion.button
                      variants={itemVariants}
                      onClick={() => handleNavClick('new-arrivals')}
                      className="text-left hover:text-brand-dustyRose transition-colors"
                    >
                      NEW ARRIVALS
                    </motion.button>
                    
                    <motion.button
                      variants={itemVariants}
                      onClick={() => handleNavClick('categories')}
                      className="text-left hover:text-brand-dustyRose transition-colors"
                    >
                      CATEGORIES
                    </motion.button>

                    <motion.button
                      variants={itemVariants}
                      onClick={() => { setPage('home'); setSidebarOpen(false); }}
                      className="text-left hover:text-brand-dustyRose transition-colors"
                    >
                      SHOP
                    </motion.button>

                    <motion.button
                      variants={itemVariants}
                      onClick={() => handleNavClick('categories')} // About
                      className="text-left hover:text-brand-dustyRose transition-colors"
                    >
                      ABOUT US
                    </motion.button>
                  </nav>
                </div>

                {/* Separator line */}
                <div className="w-full h-px bg-brand-border" />

                {/* Coin Special Item */}
                <motion.div variants={itemVariants} className="space-y-4 text-left">
                  <button
                    onClick={() => {
                      setPage('numismatics');
                      setSidebarOpen(false);
                    }}
                    className="flex items-center space-x-3.5 px-4 py-3 bg-brand-softBeige border border-brand-antiqueBronze/20 rounded-2xl text-brand-antiqueBronze text-left font-display text-lg w-full shadow-sm hover:bg-brand-softBeige/70 transition-colors"
                  >
                    <span className="w-6 h-6 animate-spin-coin flex items-center justify-center bg-brand-gold rounded-full border border-brand-antiqueBronze text-xs">
                      🪙
                    </span>
                    <span className="font-extrabold tracking-[0.1em] text-sm">NUMISMATICS</span>
                  </button>
                </motion.div>

                {/* Separator line */}
                <div className="w-full h-px bg-brand-border" />

                {/* Sub links */}
                <motion.div 
                  variants={itemVariants}
                  className="flex flex-col space-y-3 text-[11px] font-bold tracking-widest text-brand-warmGray text-left"
                >
                  <button
                    onClick={() => { setAccountOpen(true); setSidebarOpen(false); }}
                    className="text-left hover:text-brand-espresso transition-colors"
                  >
                    ACCOUNT
                  </button>
                  <button
                    onClick={() => { setPage('wishlist'); setSidebarOpen(false); }}
                    className="text-left hover:text-brand-espresso transition-colors"
                  >
                    WISHLIST
                  </button>
                  <button
                    onClick={() => { setAccountOpen(true); setSidebarOpen(false); }}
                    className="text-left hover:text-brand-espresso transition-colors"
                  >
                    ORDERS
                  </button>
                  <button
                    onClick={() => setSidebarOpen(false)}
                    className="text-left hover:text-brand-espresso transition-colors"
                  >
                    HELP & SUPPORT
                  </button>
                </motion.div>
              </motion.div>

              {/* Sidebar Footer info */}
              <div className="border-t border-brand-border pt-4 text-[9px] text-brand-warmGray font-bold tracking-wider text-left">
                © 2026 AADHYA. All Rights Reserved.
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
