"use client";

import React from 'react';
import { PRODUCTS, Product } from '../../data/mockData';
import { useApp } from '../../context/AppContext';
import { Heart, ShoppingBag, Star, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export const NewArrivals: React.FC = () => {
  const { toggleWishlist, isInWishlist, setSelectedProduct } = useApp();
  
  // Filter for fashion department products
  const fashionProducts = PRODUCTS.filter((p) => p.department === 'fashion');
  
  // Display top 4 fashion products matching the design reference list
  const displayProducts = fashionProducts.slice(0, 4);

  // Helper to render star rating row
  const renderStars = (rating = 4) => {
    return (
      <div className="flex items-center space-x-0.5 text-amber-500">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-3 h-3 ${i < rating ? 'fill-current' : 'text-brand-border stroke-[1.5]'}`}
          />
        ))}
      </div>
    );
  };

  // Helper to determine card badge
  const getBadgeText = (index: number, bestseller?: boolean) => {
    if (bestseller) return 'Best Seller';
    if (index === 0 || index === 3) return 'New';
    return 'Trending';
  };

  return (
    <section id="new-arrivals" className="w-full py-20 px-6 md:px-12 lg:px-24 bg-brand-warmWhite border-b border-brand-border/40">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* Header Block (Centered text with View All on the right) */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-brand-border/40">
          <div className="flex-grow text-center md:text-left space-y-2">
            <span className="text-[10px] text-brand-warmGray font-bold tracking-[0.2em] uppercase block">
              BESTSELLERS
            </span>
            <h2 className="font-display font-bold text-3xl md:text-4xl text-brand-espresso tracking-tight">
              Our Most Loved Styles
            </h2>
            <p className="text-xs text-brand-warmGray font-medium">
              Customer favorites you'll fall in love with.
            </p>
          </div>
          
          <div className="flex justify-center md:justify-end flex-shrink-0">
            <button 
              onClick={() => setSelectedProduct(displayProducts[0])}
              className="px-5 py-2.5 border border-brand-border rounded-full text-xs font-bold tracking-widest text-brand-espresso hover:bg-brand-softBeige/40 transition-colors flex items-center space-x-1.5"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Product Cards Grid (Strict 4-columns) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {displayProducts.map((product, index) => {
            const inWishlist = isInWishlist(product.id);
            const badge = getBadgeText(index, product.bestseller);

            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.08 }}
                className="flex flex-col text-left group cursor-pointer bg-brand-white border border-brand-border/50 rounded-2xl p-4 hover:shadow-md transition-shadow relative"
                onClick={() => setSelectedProduct(product)}
              >
                {/* 4:5 Aspect Ratio Image Wrapper */}
                <div className="w-full aspect-[4/5] bg-brand-softBeige/25 rounded-xl overflow-hidden relative flex items-center justify-center">
                  
                  {/* Real product photograph */}
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transform group-hover:scale-103 transition-transform duration-500 ease-out"
                    loading="lazy"
                  />

                  {/* Top-Left Badge */}
                  <div className="absolute top-3 left-3">
                    <span className="text-[8px] bg-brand-white/95 border border-brand-border/40 text-brand-espresso font-extrabold tracking-widest px-2.5 py-1 rounded-full shadow-sm">
                      {badge.toUpperCase()}
                    </span>
                  </div>

                  {/* Top-Right Wishlist Heart Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Avoid opening details modal
                      toggleWishlist(product);
                    }}
                    className={`absolute top-3 right-3 p-2 rounded-full border transition-all shadow-sm ${
                      inWishlist
                        ? 'bg-brand-blush border-brand-dustyRose text-brand-dustyRose'
                        : 'bg-brand-white/90 border-brand-border/60 text-brand-warmGray hover:bg-brand-white hover:text-brand-espresso'
                    }`}
                    aria-label="Add to Wishlist"
                  >
                    <Heart className={`w-3.5 h-3.5 ${inWishlist ? 'fill-brand-dustyRose' : ''}`} />
                  </button>
                </div>

                {/* Card Details Block */}
                <div className="pt-4 space-y-2.5">
                  <h3 className="font-sans font-bold text-xs text-brand-espresso tracking-wide leading-snug group-hover:text-brand-dustyRose transition-colors">
                    {product.name}
                  </h3>

                  {/* Reviews Star Indicator */}
                  <div className="flex items-center space-x-1.5">
                    {renderStars(product.rating)}
                    <span className="text-[9px] text-brand-warmGray font-bold">
                      ({product.reviewsCount || 100})
                    </span>
                  </div>

                  {/* Pricing row with discount */}
                  <div className="flex items-baseline justify-between border-t border-brand-border/30 pt-2">
                    <div className="flex items-baseline space-x-2">
                      <span className="text-sm font-extrabold text-brand-espresso">
                        ₹{product.price.toLocaleString('en-IN')}
                      </span>
                      <span className="text-[10px] text-brand-warmGray line-through font-semibold">
                        ₹{product.mrp.toLocaleString('en-IN')}
                      </span>
                    </div>
                    
                    <span className="text-[9px] text-brand-sale font-extrabold tracking-wider">
                      {product.discount}% OFF
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
