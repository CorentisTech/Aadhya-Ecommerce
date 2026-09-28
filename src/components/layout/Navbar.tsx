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
  ChevronLeft,
  ChevronRight,
  Menu
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
  const [announcementIdx, setAnnouncementIdx] = useState(0);

  const announcements = [
    "Free Shipping On Orders Above ₹2,999",
    "Handcrafted Pure Silks & Breathable Cottons",
    "Easy 7-Day Returns & Exchanges Across India"
  ];

  // Rotate announcement bar every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setAnnouncementIdx((prev) => (prev + 1) % announcements.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [announcements.length]);

  // Monitor scroll height
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
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
  const isNumis = Boolean(pathname?.includes('/numismatics'));

  if (pathname?.startsWith('/admin')) {
    return null;
  }

  const handleNavClick = (sectionId: string) => {
    setSidebarOpen(false);

    if (isNumis) {
      if (sectionId === 'categories') {
        if (pathname !== '/numismatics') router.push('/numismatics#categories');
        else document.getElementById('categories')?.scrollIntoView({ behavior: 'smooth' });
        return;
      }
      if (sectionId === 'bestsellers') {
        if (pathname !== '/numismatics') router.push('/numismatics#best-sellers');
        else document.getElementById('best-sellers')?.scrollIntoView({ behavior: 'smooth' });
        return;
      }
      if (sectionId === 'new-arrivals') {
        if (pathname !== '/numismatics') router.push('/numismatics#new-arrivals');
        else document.getElementById('new-arrivals')?.scrollIntoView({ behavior: 'smooth' });
        return;
      }
      return;
    }

    if (sectionId === 'categories') {
      if (pathname !== '/') router.push('/#categories');
      else document.getElementById('categories')?.scrollIntoView({ behavior: 'smooth' });
    } else if (sectionId === 'bestsellers') {
      if (pathname !== '/') router.push('/#bestsellers');
      else document.getElementById('bestsellers')?.scrollIntoView({ behavior: 'smooth' });
    } else if (sectionId === 'new-arrivals') {
      if (pathname !== '/') router.push('/#new-arrivals');
      else document.getElementById('new-arrivals')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const sidebarVariants = {
    closed: { x: '-100%', transition: { type: 'spring', damping: 25, stiffness: 220 } },
    open: { x: '0%', transition: { type: 'spring', damping: 25, stiffness: 220 } }
  };

  return (
    <>
      {/* 1. Top Announcement Bar (Reference 1 Inspiration: Thin Black Bar with Centered Offers) */}
      {!isNumis && (
        <div className="w-full bg-[#111111] text-[#EFE6DA] py-2 px-4 flex items-center justify-between text-[11px] font-medium tracking-widest uppercase select-none z-50 relative border-b border-black/20">
          <button 
            onClick={() => setAnnouncementIdx((prev) => (prev - 1 + announcements.length) % announcements.length)}
            className="p-0.5 text-[#EFE6DA]/60 hover:text-white transition-colors"
            aria-label="Previous announcement"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          
          <AnimatePresence mode="wait">
            <motion.span
              key={announcementIdx}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.25 }}
              className="text-center font-sans tracking-[0.16em] text-[10px] sm:text-[11px] font-semibold text-[#F4ECE1]"
            >
              {announcements[announcementIdx]}
            </motion.span>
          </AnimatePresence>

          <button 
            onClick={() => setAnnouncementIdx((prev) => (prev + 1) % announcements.length)}
            className="p-0.5 text-[#EFE6DA]/60 hover:text-white transition-colors"
            aria-label="Next announcement"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 2. Main Luxury Header (Saayra Inspired: Warm Beige #EFE6DA, Centered AADHYA Branding) */}
      <header 
        className={`sticky top-0 z-40 w-full max-w-full transition-colors duration-200 select-none ${
          isNumis 
            ? 'h-[68px] bg-[#FCFAF7]/95 backdrop-blur-[14px] border-b border-[#E8E1DA] px-3 sm:px-6 md:px-12 flex items-center justify-between'
            : 'h-[76px] sm:h-[84px] bg-[#EFE6DA] border-b border-[#E5DACB] px-4 sm:px-8 md:px-12 flex items-center justify-between'
        }`}
      >
        {/* LEFT: Hamburger menu + Desktop Navigation Links */}
        <div className="flex items-center space-x-4 sm:space-x-8 flex-1 justify-start">
          {/* Hamburger Menu Trigger */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-1.5 -ml-1 text-[#181818] hover:text-[#555555] transition-colors focus:outline-none"
            aria-label="Open Navigation Menu"
          >
            <Menu className="w-5 h-5 sm:w-6 sm:h-6 stroke-[1.8]" />
          </button>

          {/* Minimal Desktop Nav Links (Reference 1: Home, Kurta Sets, New Arrivals) */}
          {!isNumis && (
            <nav className="hidden lg:flex items-center space-x-7 text-xs font-semibold tracking-wider text-[#181818]">
              <button
                onClick={() => {
                  if (pathname === '/') window.scrollTo({ top: 0, behavior: 'smooth' });
                  else router.push('/');
                }}
                className={`py-1 border-b transition-colors ${
                  pathname === '/' ? 'border-[#181818] font-bold' : 'border-transparent text-[#444444] hover:text-[#181818]'
                }`}
              >
                Home
              </button>
              <button
                onClick={() => router.push('/catalog')}
                className="py-1 border-b border-transparent text-[#444444] hover:text-[#181818] transition-colors"
              >
                Catalog
              </button>
              <button
                onClick={() => handleNavClick('new-arrivals')}
                className="py-1 border-b border-transparent text-[#444444] hover:text-[#181818] transition-colors"
              >
                New Arrivals
              </button>
              <button
                onClick={() => handleNavClick('categories')}
                className="py-1 border-b border-transparent text-[#444444] hover:text-[#181818] transition-colors"
              >
                Categories
              </button>
            </nav>
          )}

          {isNumis && (
            <button
              onClick={() => router.push('/numismatics')}
              className="font-display text-lg font-bold tracking-[0.2em] text-[#181818]"
            >
              AADHYA HERITAGE
            </button>
          )}
        </div>

        {/* CENTER: Strong Centered AADHYA Branding with Soft Blush/Ivory Aura */}
        <div className="flex flex-col items-center justify-center flex-shrink-0 relative">
          <button
            onClick={() => {
              if (isNumis) {
                if (pathname === '/numismatics') window.scrollTo({ top: 0, behavior: 'smooth' });
                else router.push('/numismatics');
              } else {
                if (pathname === '/') window.scrollTo({ top: 0, behavior: 'smooth' });
                else router.push('/');
                setPage('home');
              }
            }}
            className="group relative flex flex-col items-center justify-center focus:outline-none"
          >
            {/* Soft blush halo matching Reference 1 aesthetic */}
            <div className="absolute w-24 sm:w-28 h-10 sm:h-12 bg-[#E5D7C7]/80 rounded-full blur-xs pointer-events-none -z-0" />
            
            <div className="relative z-10 flex flex-col items-center">
              <span className="font-serif font-black text-2xl sm:text-3xl md:text-4xl tracking-[0.26em] text-[#181818] group-hover:opacity-90 transition-opacity uppercase leading-none">
                AADHYA
              </span>
              <span className="text-[8px] sm:text-[9px] font-sans font-bold tracking-[0.38em] text-[#7A6B5C] uppercase mt-1">
                FASHION ATELIER
              </span>
            </div>
          </button>
        </div>

        {/* RIGHT: Minimal Line Icons (Search, Profile, Wishlist, Bag) */}
        <div className="flex items-center space-x-3 sm:space-x-5 text-[#181818] flex-1 justify-end">
          {/* Domain Switch Pill: Coins & Notes */}
          <button
            onClick={() => {
              if (isNumis) {
                setPage('home');
                triggerSectionTransition('fashion');
                router.push('/');
              } else {
                setPage('numismatics');
                triggerSectionTransition('numismatics');
                router.push('/numismatics');
              }
            }}
            className="hidden md:flex items-center space-x-2 px-3 py-1 rounded-full border border-[#D5C7B5] bg-white/40 hover:bg-white text-[10px] font-bold tracking-widest text-[#181818] transition-all shadow-2xs mr-1"
            title="Switch to Coins & Notes"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-pulse" />
            <span>{isNumis ? 'FASHION' : 'COINS & NOTES'}</span>
          </button>

          {/* Search */}
          <button
            onClick={() => setSearchOpen(true)}
            aria-label="Search Catalog"
            className="p-1.5 hover:text-[#555555] transition-colors focus:outline-none"
          >
            <Search className="w-4.5 h-4.5 sm:w-5 sm:h-5 stroke-[1.6]" />
          </button>

          {/* Profile / Account */}
          <button
            onClick={() => router.push('/account')}
            aria-label="Customer Profile"
            className="p-1.5 hover:text-[#555555] transition-colors focus:outline-none hidden sm:block"
          >
            <User className="w-4.5 h-4.5 sm:w-5 sm:h-5 stroke-[1.6]" />
          </button>

          {/* Wishlist */}
          <button
            onClick={() => {
              setPage('wishlist');
              router.push('/wishlist');
            }}
            aria-label="Wishlist"
            className="p-1.5 hover:text-[#555555] transition-colors relative focus:outline-none"
          >
            <Heart className={`w-4.5 h-4.5 sm:w-5 sm:h-5 stroke-[1.6] ${activePage === 'wishlist' ? 'fill-[#181818]' : ''}`} />
            {wishlist.length > 0 && (
              <span className="absolute 0 top-0.5 right-0.5 bg-[#181818] text-[#EFE6DA] text-[8px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center leading-none">
                {wishlist.length}
              </span>
            )}
          </button>

          {/* Shopping Bag */}
          <button
            onClick={() => router.push('/cart')}
            aria-label="Shopping Cart"
            className="p-1.5 hover:text-[#555555] transition-colors relative focus:outline-none"
          >
            <ShoppingBag className="w-4.5 h-4.5 sm:w-5 sm:h-5 stroke-[1.6]" />
            {cartItemsCount > 0 && (
              <span className="absolute top-0.5 right-0.5 bg-[#181818] text-[#EFE6DA] text-[8px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center leading-none">
                {cartItemsCount}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* 3. Re-themed Luxury Left Sidebar Navigation Drawer */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            />

            {/* Slide-over panel */}
            <motion.div
              variants={sidebarVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="fixed left-0 top-0 bottom-0 z-50 w-full max-w-xs bg-[#FAF7F2] border-r border-[#E5DACB] shadow-2xl p-6 flex flex-col justify-between"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-[#E5DACB] pb-4">
                <div className="flex flex-col">
                  <span className="font-serif font-black tracking-[0.2em] text-[#181818] text-base">AADHYA</span>
                  <span className="text-[8px] tracking-[0.25em] text-[#7A6B5C] font-semibold uppercase">Luxury Atelier</span>
                </div>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-1.5 hover:bg-[#EFE6DA] rounded-full transition-colors text-[#181818]"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5 stroke-[1.8]" />
                </button>
              </div>

              {/* Navigation Items */}
              <div className="flex-grow py-6 space-y-6 overflow-y-auto">
                <div className="space-y-2 text-left">
                  <span className="text-[8px] tracking-[0.25em] font-extrabold text-[#7A6B5C] block px-3 uppercase">
                    {isNumis ? 'NUMISMATICS ARCHIVE' : 'FASHION COLLECTIONS'}
                  </span>
                  
                  <nav className="flex flex-col space-y-1.5 font-sans text-xs font-bold tracking-widest text-[#181818]">
                    <button
                      onClick={() => {
                        setSidebarOpen(false);
                        if (isNumis) router.push('/numismatics');
                        else router.push('/');
                      }}
                      className="flex items-center space-x-3 py-3 px-4 rounded-xl text-left w-full hover:bg-[#EFE6DA] transition-all"
                    >
                      <Home className="w-4 h-4 text-[#181818]" />
                      <span>HOME</span>
                    </button>
                    
                    <button
                      onClick={() => handleNavClick('bestsellers')}
                      className="flex items-center space-x-3 py-3 px-4 rounded-xl text-left w-full hover:bg-[#EFE6DA] transition-all"
                    >
                      <Sparkles className="w-4 h-4 text-[#181818]" />
                      <span>BEST SELLERS</span>
                    </button>
                    
                    <button
                      onClick={() => handleNavClick('new-arrivals')}
                      className="flex items-center space-x-3 py-3 px-4 rounded-xl text-left w-full hover:bg-[#EFE6DA] transition-all"
                    >
                      <Compass className="w-4 h-4 text-[#181818]" />
                      <span>NEW ARRIVALS</span>
                    </button>
                    
                    <button
                      onClick={() => handleNavClick('categories')}
                      className="flex items-center space-x-3 py-3 px-4 rounded-xl text-left w-full hover:bg-[#EFE6DA] transition-all"
                    >
                      <Grid className="w-4 h-4 text-[#181818]" />
                      <span>CATEGORIES</span>
                    </button>

                    <button
                      onClick={() => {
                        setSidebarOpen(false);
                        if (isNumis) router.push('/numismatics/catalog');
                        else router.push('/catalog');
                      }}
                      className="flex items-center space-x-3 py-3 px-4 rounded-xl text-left w-full hover:bg-[#EFE6DA] transition-all"
                    >
                      <ShoppingBag className="w-4 h-4 text-[#181818]" />
                      <span>{isNumis ? 'ALL COINS & NOTES' : 'ALL FASHION'}</span>
                    </button>
                  </nav>
                </div>

                {/* Domain Switch Card */}
                <div className="p-4 rounded-2xl bg-[#EFE6DA] border border-[#E5DACB] space-y-2">
                  <span className="text-[9px] font-extrabold tracking-widest text-[#7A6B5C] uppercase block">
                    CROSS DOMAIN EXPLORER
                  </span>
                  <p className="text-xs text-[#181818] font-medium leading-relaxed">
                    {isNumis ? 'Looking for premium Indian womenswear?' : 'Explore historic numismatic coins and heritage paper currency.'}
                  </p>
                  <button
                    onClick={() => {
                      setSidebarOpen(false);
                      if (isNumis) {
                        setPage('home');
                        triggerSectionTransition('fashion');
                        router.push('/');
                      } else {
                        setPage('numismatics');
                        triggerSectionTransition('numismatics');
                        router.push('/numismatics');
                      }
                    }}
                    className="w-full py-2 bg-[#181818] text-[#EFE6DA] rounded-xl text-xs font-bold tracking-wider hover:bg-black transition-colors flex items-center justify-center space-x-2"
                  >
                    <span>{isNumis ? 'VISIT FASHION' : 'VISIT COINS & NOTES'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Footer Account / Orders */}
              <div className="pt-4 border-t border-[#E5DACB] flex items-center justify-between text-xs font-bold text-[#181818]">
                <button
                  onClick={() => {
                    setSidebarOpen(false);
                    router.push('/account');
                  }}
                  className="hover:underline"
                >
                  My Account
                </button>
                <button
                  onClick={() => {
                    setSidebarOpen(false);
                    router.push('/cart');
                  }}
                  className="hover:underline flex items-center space-x-1"
                >
                  <span>Bag ({cartItemsCount})</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
