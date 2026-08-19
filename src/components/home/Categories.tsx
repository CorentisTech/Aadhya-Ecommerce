import React from 'react';
import { CATEGORIES } from '../../data/mockData';
import { ProductVisual } from '../ui/ProductVisual';
import { useApp } from '../../context/AppContext';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export const Categories: React.FC = () => {
  const { setPage } = useApp();
  
  // Display only fashion categories on the main home page
  const fashionCategories = CATEGORIES.filter((c) => c.department === 'fashion');

  return (
    <section id="categories" className="w-full py-20 px-6 md:px-12 lg:px-24 bg-brand-warmWhite">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* Header Titles */}
        <div className="space-y-2 text-center md:text-left">
          <span className="text-[10px] text-brand-warmGray font-bold tracking-[0.2em] uppercase">
            COLLECTIONS
          </span>
          <h2 className="font-display font-bold text-3xl md:text-4xl text-brand-espresso uppercase tracking-wider">
            SHOP BY CATEGORY
          </h2>
          <p className="font-display italic text-brand-warmGray text-sm">
            "Find your style in carefully curated shapes."
          </p>
        </div>

        {/* Categories Grid (Asymmetric tiles) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {fashionCategories.map((category, index) => (
            <motion.button
              key={category.id}
              onClick={() => setPage('home')} // Switches to fashion listing
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.05 }}
              className="flex flex-col text-left group bg-brand-white border border-brand-border/40 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300"
            >
              {/* Graphic Block */}
              <div className="w-full aspect-[4/5] bg-brand-softBeige/30 relative flex items-center justify-center p-8 overflow-hidden">
                {/* Visual rendering inside categories */}
                <div className="w-full h-full transform group-hover:scale-105 transition-transform duration-500">
                  <ProductVisual
                    type={category.visualType as any}
                    color={category.visualColor}
                    pattern="silk-sheen"
                  />
                </div>

                {/* Subtle Hover Overlay */}
                <div className="absolute inset-0 bg-brand-espresso/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              {/* Text info */}
              <div className="p-5 flex flex-col justify-between flex-grow space-y-2 border-t border-brand-border/40 bg-brand-white">
                <div className="flex items-center justify-between">
                  <h3 className="font-display font-extrabold text-sm text-brand-espresso tracking-widest group-hover:text-brand-dustyRose transition-colors">
                    {category.name}
                  </h3>
                  <ArrowRight className="w-4 h-4 text-brand-warmGray group-hover:translate-x-1.5 transition-transform" />
                </div>
                <p className="text-[10px] text-brand-warmGray leading-normal font-semibold">
                  {category.description}
                </p>
              </div>

            </motion.button>
          ))}
        </div>

      </div>
    </section>
  );
};
