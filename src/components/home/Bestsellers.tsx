"use client";

import React from 'react';
import { PRODUCTS } from '../../data/mockData';
import { useApp } from '../../context/AppContext';
import { Heart, Star, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export const Bestsellers: React.FC = () => {
  const { toggleWishlist, isInWishlist, setSelectedProduct } = useApp();
  
  // Filter bestseller fashion items
  const bestsellerProducts = PRODUCTS.filter((p) => p.bestseller && p.department === 'fashion');

  const renderStars = (rating = 4) => {
    return (
      <div className="flex items-center space-x-0.5 text-amber-500">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-2.5 h-2.5 ${i < rating ? 'fill-current' : 'text-brand-border stroke-[1.5]'}`}
          />
        ))}
      </div>
    );
  };

  return (
    <section id="bestsellers" className="w-full py-20 px-6 md:px-12 lg:px-24 bg-brand-warmWhite border-b border-brand-border/40">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* Header Grid */}
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
              onClick={() => setSelectedProduct(bestsellerProducts[0])}
              className="px-5 py-2.5 border border-brand-border rounded-full text-xs font-bold tracking-widest text-brand-espresso hover:bg-brand-softBeige/40 transition-colors flex items-center space-x-1.5"
            >
              <span>VIEW ALL</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {bestsellerProducts.slice(0, 4).map((product, index) => {
            const inWishlist = isInWishlist(product.id);

            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.06 }}
                className="flex flex-col text-left group cursor-pointer bg-brand-white border border-brand-border/40 rounded-xl p-3 hover:shadow-md transition-shadow relative"
                onClick={() => setSelectedProduct(product)}
              >
                {/* Image panel (clean, mix-blend white studio images) */}
                <div className="w-full aspect-[4/5] bg-brand-softBeige/15 rounded-lg overflow-hidden relative flex items-center justify-center">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transform group-hover:scale-103 transition-transform duration-500 ease-out mix-blend-multiply"
                    loading="lazy"
                  />

                  {/* Top left badge */}
                  <div className="absolute top-2.5 left-2.5">
                    <span className="text-[7px] bg-brand-white/95 border border-brand-border/60 text-brand-espresso font-extrabold tracking-widest px-2 py-0.5 rounded shadow-sm">
                      BEST SELLER
                    </span>
                  </div>

                  {/* Wishlist button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleWishlist(product);
                    }}
                    className={`absolute top-2.5 right-2.5 p-2 rounded-full border transition-all shadow-sm ${
                      inWishlist
                        ? 'bg-brand-blush border-brand-dustyRose text-brand-dustyRose'
                        : 'bg-brand-white/95 border-brand-border/60 text-brand-warmGray hover:bg-brand-white'
                    }`}
                  >
                    <Heart className={`w-3 h-3 ${inWishlist ? 'fill-brand-dustyRose' : ''}`} />
                  </button>
                </div>

                {/* Details */}
                <div className="pt-3 space-y-2">
                  <h3 className="font-sans font-bold text-xs text-brand-espresso tracking-wide leading-snug group-hover:text-brand-dustyRose transition-colors">
                    {product.name}
                  </h3>

                  {/* Ratings */}
                  <div className="flex items-center space-x-1.5">
                    {renderStars(product.rating)}
                    <span className="text-[8px] text-brand-warmGray font-bold">
                      ({product.reviewsCount || 100})
                    </span>
                  </div>

                  {/* Pricing */}
                  <div className="flex items-baseline justify-between border-t border-brand-border/20 pt-2">
                    <div className="flex items-baseline space-x-2">
                      <span className="text-xs font-extrabold text-brand-espresso">
                        ₹{product.price.toLocaleString('en-IN')}
                      </span>
                      <span className="text-[9px] text-brand-warmGray line-through font-semibold">
                        ₹{product.mrp.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <span className="text-[8px] text-brand-sale font-extrabold tracking-wider bg-brand-sale/10 px-1.5 py-0.5 rounded">
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
