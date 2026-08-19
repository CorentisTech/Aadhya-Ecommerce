"use client";

import React from 'react';
import { PRODUCTS } from '../../data/mockData';
import { ProductVisual } from '../ui/ProductVisual';
import { useApp } from '../../context/AppContext';
import { Heart, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';

export const AadhyaEdit: React.FC = () => {
  const { toggleWishlist, isInWishlist, setSelectedProduct, addToCart } = useApp();

  // Curate 4 specific items for the everyday showcase edit
  const editProducts = PRODUCTS.filter((p) => p.department === 'fashion').slice(0, 5);

  return (
    <section className="w-full py-20 px-6 md:px-12 lg:px-24 bg-brand-warmWhite border-t border-brand-border/40 overflow-hidden">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* Header Block */}
        <div className="flex flex-col sm:flex-row items-baseline justify-between border-b border-brand-border pb-4 gap-4">
          <div className="space-y-1">
            <span className="text-[10px] text-brand-warmGray font-bold tracking-[0.2em] uppercase">
              EDITORIAL CURATION
            </span>
            <h2 className="font-display font-bold text-3xl md:text-4xl text-brand-espresso uppercase tracking-wider">
              THE AADHYA EDIT
            </h2>
            <p className="font-display italic text-brand-warmGray text-sm">
              "Handpicked essential fashion pieces for your daily story."
            </p>
          </div>
        </div>

        {/* Horizontal scroll container for mobile, standard grid for desktop */}
        <div className="flex overflow-x-auto pb-6 md:pb-0 gap-6 snap-x snap-mandatory scrollbar-none md:grid md:grid-cols-4 lg:grid-cols-5">
          {editProducts.map((product, index) => {
            const inWishlist = isInWishlist(product.id);
            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, scale: 0.98 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="flex-shrink-0 w-64 snap-start md:w-auto flex flex-col text-left group cursor-pointer"
                onClick={() => setSelectedProduct(product)}
              >
                
                {/* Visual Aspect Ratio (4/5) */}
                <div className="w-full aspect-[4/5] bg-brand-white border border-brand-border/50 rounded-2xl p-5 relative flex items-center justify-center overflow-hidden hover:shadow-md transition-shadow">
                  
                  {/* Silhouette Visual */}
                  <div className="w-full h-full transform group-hover:scale-103 transition-transform duration-500">
                    <ProductVisual
                      type={product.visualType}
                      color={product.visualColor}
                      pattern={product.visualPattern}
                    />
                  </div>

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3">
                    <span className="text-[7px] border border-brand-border bg-brand-warmWhite font-extrabold tracking-widest px-2 py-0.5 rounded">
                      EDIT CHOICE
                    </span>
                  </div>

                  {/* Wishlist Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleWishlist(product);
                    }}
                    className={`absolute top-3 right-3 p-2 rounded-full border transition-all ${
                      inWishlist
                        ? 'bg-brand-blush border-brand-dustyRose text-brand-dustyRose'
                        : 'bg-brand-warmWhite/80 border-brand-border/60 text-brand-warmGray hover:bg-brand-white'
                    }`}
                    aria-label="Add to Wishlist"
                  >
                    <Heart className={`w-3 h-3 ${inWishlist ? 'fill-brand-dustyRose' : ''}`} />
                  </button>

                  {/* Quick Add to bag */}
                  <div className="absolute bottom-3 right-3 translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(product, 1, 'Free Size');
                      }}
                      className="p-2.5 bg-brand-espresso text-brand-white rounded-full hover:bg-brand-espresso/90 shadow-md transition-colors"
                      aria-label="Quick Add to Bag"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                    </button>
                  </div>

                </div>

                {/* Details */}
                <div className="mt-3 space-y-1">
                  <span className="text-[9px] text-brand-warmGray font-bold tracking-widest uppercase">
                    {product.category}
                  </span>
                  
                  <h3 className="font-display font-bold text-xs text-brand-espresso leading-snug group-hover:text-brand-dustyRose transition-colors line-clamp-1">
                    {product.name}
                  </h3>
                  
                  {/* Prices */}
                  <div className="flex items-center space-x-2 pt-0.5">
                    <span className="text-xs font-bold text-brand-espresso">
                      ₹{product.price.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[9px] text-brand-warmGray line-through font-semibold">
                      ₹{product.mrp.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
