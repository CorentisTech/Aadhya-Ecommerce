"use client";

import React from 'react';
import { CATEGORIES } from '../../data/mockData';
import { useApp } from '../../context/AppContext';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

export const Categories: React.FC = () => {
  const { setPage } = useApp();
  const router = useRouter();
  
  // Display only fashion categories on the main home page
  const fashionCategories = CATEGORIES.filter((c) => c.department === 'fashion');

  return (
    <section id="categories" className="w-full max-w-full py-10 md:py-20 px-4 md:px-12 lg:px-24 bg-brand-warmWhite border-b border-brand-border/40 overflow-hidden">
      <div className="max-w-6xl mx-auto space-y-8 md:space-y-16">
        
        {/* Header Block (Centered) */}
        <div className="space-y-1.5 text-center max-w-lg mx-auto">
          <span className="text-xs sm:text-sm text-[#F26A2E] font-extrabold tracking-[0.2em] uppercase block">
            SHOP BY CATEGORY
          </span>
          <h2 className="font-display font-bold text-3xl md:text-5xl text-brand-espresso tracking-tight">
            Find Your Perfect Style
          </h2>
          <div className="w-10 h-0.5 bg-brand-sale/25 mx-auto mt-2" />
        </div>

        {/* Horizontal Scroll Layout on mobile/tablet, grid layout on desktop */}
        <div className="flex overflow-x-auto pb-3 gap-4 md:grid md:grid-cols-3 lg:grid-cols-6 md:gap-8 scrollbar-none snap-x snap-mandatory w-full scroll-smooth">
          {fashionCategories.map((category) => (
            <div
              key={category.id}
              className="flex flex-col text-center group cursor-pointer space-y-2 focus:outline-none flex-shrink-0 w-[125px] md:w-auto snap-start"
            >
              {/* Arched Top Image */}
              <div 
                onClick={() => router.push(`/catalog?category=${category.id}`)}
                className="w-full aspect-[2/3] rounded-t-full overflow-hidden bg-brand-softBeige/30 border border-brand-border/40 relative shadow-sm"
              >
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-brand-espresso/5 opacity-0 hover:opacity-100 transition-opacity duration-300" />
              </div>

              {/* Label */}
              <div 
                onClick={() => router.push(`/catalog?category=${category.id}`)}
                className="flex items-center justify-center space-x-1 pt-0.5"
              >
                <span className="font-sans font-bold text-[10px] sm:text-xs text-brand-espresso tracking-wide group-hover:text-brand-dustyRose transition-colors">
                  {category.name}
                </span>
                <span className="text-brand-warmGray font-sans text-[10px] sm:text-xs">
                  →
                </span>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
