"use client";

import React from 'react';
import { CATEGORIES } from '../../data/mockData';
import { useApp } from '../../context/AppContext';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export const Categories: React.FC = () => {
  const { setPage } = useApp();
  
  // Display only fashion categories on the main home page
  const fashionCategories = CATEGORIES.filter((c) => c.department === 'fashion');

  return (
    <section id="categories" className="w-full py-20 px-6 md:px-12 lg:px-24 bg-brand-warmWhite border-b border-brand-border/40">
      <div className="max-w-6xl mx-auto space-y-16">
        
        {/* Header Block (Centered) */}
        <div className="space-y-2 text-center max-w-lg mx-auto">
          <span className="text-[10px] text-brand-warmGray font-bold tracking-[0.2em] uppercase block">
            SHOP BY CATEGORY
          </span>
          <h2 className="font-display font-bold text-3xl md:text-4xl text-brand-espresso tracking-tight">
            Find Your Perfect Style
          </h2>
          <div className="w-12 h-0.5 bg-brand-sale/30 mx-auto mt-3" />
        </div>

        {/* Categories Grid (6 columns to match category ui design reference) */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 md:gap-8">
          {fashionCategories.map((category, index) => (
            <motion.button
              key={category.id}
              onClick={() => setPage('home')} // Link back to fashion catalog
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.05 }}
              className="flex flex-col text-center group cursor-pointer space-y-4 focus:outline-none"
            >
              {/* Arched Top Image (rounded-t-full aspect-[2/3]) */}
              <div className="w-full aspect-[2/3] rounded-t-full overflow-hidden bg-brand-softBeige/30 border border-brand-border/40 relative shadow-sm">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover transform group-hover:scale-103 transition-transform duration-500 ease-out"
                  loading="lazy"
                />
                
                {/* Subtle Hover Shade */}
                <div className="absolute inset-0 bg-brand-espresso/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              {/* Title & Arrow Below Image */}
              <div className="flex items-center justify-center space-x-1.5 pt-1 transform group-hover:-translate-y-1 transition-transform duration-300">
                <span className="font-sans font-bold text-xs text-brand-espresso tracking-wide group-hover:text-brand-dustyRose transition-colors">
                  {category.name}
                </span>
                <span className="text-brand-warmGray group-hover:translate-x-1.5 transition-transform duration-300 font-sans text-xs">
                  →
                </span>
              </div>

            </motion.button>
          ))}
        </div>

      </div>
    </section>
  );
};
