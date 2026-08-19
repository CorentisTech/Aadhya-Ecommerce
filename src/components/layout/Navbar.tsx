"use client";

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Search, Heart, User, ShoppingBag, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Navbar: React.FC = () => {
  const {
    activePage,
    setPage,
    cart,
    wishlist,
    setCartOpen,
    setSearchOpen,
    setAccountOpen,
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [numismaticsHovered, setNumismaticsHovered] = useState(false);

  const cartItemsCount = cart.reduce((total, item) => total + item.quantity, 0);

  // Navigate to sections on fashion homepage
  const handleNavClick = (sectionId: string) => {
    setPage('home');
    setMobileMenuOpen(false);
    setTimeout(() => {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-brand-warmWhite border-b border-brand-border/60 py-4 px-6 md:px-12 flex items-center justify-between">
        {/* Left: Brand Wordmark */}
        <div className="flex items-center">
          <button
            onClick={() => setPage('home')}
            className="font-display text-2xl md:text-3xl font-bold tracking-[0.2em] text-brand-espresso hover:opacity-85 transition-opacity"
          >
            AADHYA
          </button>
        </div>

        {/* Center/Left Nav Menu (Desktop) */}
        <nav className="hidden md:flex items-center space-x-8 text-xs font-semibold tracking-[0.15em] text-brand-espresso">
          <button
            onClick={() => handleNavClick('bestsellers')}
            className="hover:text-brand-dustyRose transition-colors relative py-1 group"
          >
            BESTSELLERS
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
            onClick={() => handleNavClick('about-us')}
            className="hover:text-brand-dustyRose transition-colors relative py-1 group"
          >
            ABOUT US
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-brand-dustyRose transition-all duration-300 group-hover:w-full" />
          </button>

          {/* Special Numismatics navigation link */}
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
              {/* Rotating Coin Visual */}
              <div className="relative w-4 h-4 perspective-1000 preserve-3d">
                <motion.div
                  className="w-full h-full rounded-full bg-brand-gold border border-brand-antiqueBronze/40 flex items-center justify-center text-[8px] font-bold text-brand-espresso"
                  animate={{ rotateY: 360 }}
                  transition={{
                    repeat: Infinity,
                    duration: numismaticsHovered ? 2 : 6,
                    ease: 'linear',
                  }}
                  style={{ backfaceVisibility: 'hidden' }}
                >
                  🪙
                </motion.div>
              </div>
              <span className="tracking-[0.2em] font-bold text-[10px]">NUMISMATICS</span>
            </button>

            {/* Premium Tooltip */}
            <AnimatePresence>
              {numismaticsHovered && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 5, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute left-1/2 -translate-x-1/2 mt-2 w-48 bg-brand-espresso text-brand-warmWhite text-[10px] tracking-[0.1em] font-medium py-2 px-3 text-center rounded shadow-lg z-50"
                >
                  <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-brand-espresso rotate-45" />
                  Explore Coins & Currency
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </nav>

        {/* Right Actions Menu */}
        <div className="flex items-center space-x-5 text-brand-espresso">
          <button
            onClick={() => setSearchOpen(true)}
            aria-label="Search Catalog"
            className="hover:text-brand-dustyRose transition-colors p-1"
          >
            <Search className="w-5 h-5 stroke-[1.5]" />
          </button>
          
          <button
            onClick={() => setPage('wishlist')}
            aria-label="View Wishlist"
            className="hover:text-brand-dustyRose transition-colors p-1 relative"
          >
            <Heart className={`w-5 h-5 stroke-[1.5] ${activePage === 'wishlist' ? 'fill-brand-dustyRose stroke-brand-dustyRose' : ''}`} />
            {wishlist.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-brand-sale text-brand-warmWhite text-[8px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {wishlist.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setAccountOpen(true)}
            aria-label="Open Account"
            className="hover:text-brand-dustyRose transition-colors p-1"
          >
            <User className="w-5 h-5 stroke-[1.5]" />
          </button>

          <button
            onClick={() => setCartOpen(true)}
            aria-label="Open Cart"
            className="hover:text-brand-dustyRose transition-colors p-1 relative"
          >
            <ShoppingBag className="w-5 h-5 stroke-[1.5]" />
            {cartItemsCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-brand-espresso text-brand-warmWhite text-[8px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {cartItemsCount}
              </span>
            )}
          </button>

          {/* Burger Menu for mobile */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open Menu"
            className="md:hidden p-1 hover:text-brand-dustyRose transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-brand-espresso/40 backdrop-blur-sm md:hidden"
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute right-0 top-0 bottom-0 w-4/5 max-w-sm bg-brand-warmWhite shadow-2xl p-8 flex flex-col justify-between"
            >
              {/* Close Button */}
              <div className="flex items-center justify-between border-b border-brand-border/60 pb-4">
                <span className="font-display font-bold tracking-widest text-brand-espresso">AADHYA</span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 hover:text-brand-dustyRose transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Menu Links */}
              <div className="flex-grow py-8 space-y-8 overflow-y-auto">
                <div className="space-y-4">
                  <h4 className="text-[10px] tracking-[0.2em] font-bold text-brand-warmGray uppercase border-b border-brand-border pb-1">
                    FASHION DEPARTMENT
                  </h4>
                  <div className="flex flex-col space-y-3 font-display text-lg text-brand-espresso">
                    <button
                      onClick={() => handleNavClick('bestsellers')}
                      className="text-left hover:text-brand-dustyRose transition-colors"
                    >
                      Best Sellers
                    </button>
                    <button
                      onClick={() => handleNavClick('new-arrivals')}
                      className="text-left hover:text-brand-dustyRose transition-colors"
                    >
                      New Arrivals
                    </button>
                    <button
                      onClick={() => handleNavClick('categories')}
                      className="text-left hover:text-brand-dustyRose transition-colors"
                    >
                      Categories
                    </button>
                    <button
                      onClick={() => handleNavClick('about-us')}
                      className="text-left hover:text-brand-dustyRose transition-colors"
                    >
                      About Us
                    </button>
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-brand-border/60">
                  <h4 className="text-[10px] tracking-[0.2em] font-bold text-brand-antiqueBronze uppercase border-b border-brand-border pb-1">
                    NUMISMATICS DEPARTMENT
                  </h4>
                  <div className="flex flex-col space-y-4">
                    <button
                      onClick={() => {
                        setPage('numismatics');
                        setMobileMenuOpen(false);
                      }}
                      className="flex items-center space-x-3 p-3 bg-brand-softBeige border border-brand-antiqueBronze/30 rounded-lg text-brand-antiqueBronze text-left font-display text-lg"
                    >
                      {/* Spin Coin inside button */}
                      <span className="w-5 h-5 animate-spin-coin flex items-center justify-center bg-brand-gold rounded-full border border-brand-antiqueBronze text-xs">
                        🪙
                      </span>
                      <span className="font-bold tracking-wide">Coins & Notes</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Account / Support in Mobile Footer */}
              <div className="border-t border-brand-border/60 pt-4 flex flex-col space-y-3 text-xs tracking-wider text-brand-warmGray font-semibold">
                <button
                  onClick={() => {
                    setAccountOpen(true);
                    setMobileMenuOpen(false);
                  }}
                  className="text-left hover:text-brand-espresso transition-colors"
                >
                  My Account
                </button>
                <button
                  onClick={() => {
                    setPage('wishlist');
                    setMobileMenuOpen(false);
                  }}
                  className="text-left hover:text-brand-espresso transition-colors"
                >
                  Saved Items ({wishlist.length})
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
