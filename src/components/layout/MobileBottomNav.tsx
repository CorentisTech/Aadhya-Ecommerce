"use client";

import React from 'react';
import { useApp } from '@/context/AppContext';
import { Home, Search, Grid, Heart, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

export const MobileBottomNav: React.FC = () => {
  const { activePage, setPage, setSearchOpen, setAccountOpen } = useApp();
  const router = useRouter();

  const handleCategoriesClick = () => {
    router.push('/catalog');
  };

  const navItems = [
    { id: 'home', label: 'Home', icon: Home, action: () => setPage('home') },
    { id: 'search', label: 'Search', icon: Search, action: () => setSearchOpen(true) },
    { id: 'categories', label: 'Categories', icon: Grid, action: handleCategoriesClick },
    { id: 'wishlist', label: 'Wishlist', icon: Heart, action: () => setPage('wishlist') },
    { id: 'account', label: 'Account', icon: User, action: () => setAccountOpen(true) }
  ];

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-[90%] max-w-sm md:hidden select-none">
      {/* Floating Pill Container (rgba bg + backdrop blur + shadow) */}
      <div className="bg-[#FCFAF7]/85 backdrop-blur-lg border border-[#E8E1DA]/80 rounded-full py-3 px-5 flex items-center justify-between shadow-lg">
        {navItems.map((item) => {
          // Check active status
          const isActive = 
            (item.id === 'home' && activePage === 'home') || 
            (item.id === 'wishlist' && activePage === 'wishlist');

          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={item.action}
              className="flex flex-col items-center justify-center relative p-1.5 focus:outline-none"
              aria-label={item.label}
            >
              {/* Animated Icon scale on active */}
              <motion.div
                animate={{
                  scale: isActive ? 1.15 : 1,
                  color: isActive ? '#F26A2E' : '#756E69'
                }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                <Icon className="w-5 h-5 stroke-[2]" />
              </motion.div>

              {/* Accent active dot */}
              {isActive && (
                <motion.span
                  layoutId="activeDot"
                  className="absolute bottom-0 w-1 h-1 bg-[#F26A2E] rounded-full"
                  transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
