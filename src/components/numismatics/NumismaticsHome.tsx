"use client";

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PRODUCTS, CATEGORIES, Product } from '../../data/mockData';
import { ProductVisual } from '../ui/ProductVisual';
import { Heart, ShoppingBag, Sparkles, Filter, Info } from 'lucide-react';
import { motion } from 'framer-motion';
import { NavigationControls } from '../ui/NavigationControls';

export const NumismaticsHome: React.FC = () => {
  const { toggleWishlist, isInWishlist, setSelectedProduct, addToCart } = useApp();
  
  // Filter categories and products for Numismatics
  const numCategories = CATEGORIES.filter((c) => c.department === 'numismatics');
  const numProducts = PRODUCTS.filter((p) => p.department === 'numismatics');

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [activeRarity, setActiveRarity] = useState<string>('all');
  const [hoveredCoinId, setHoveredCoinId] = useState<string | null>(null);

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
  };

  const filteredProducts = numProducts.filter((product) => {
    const matchesCategory =
      activeCategory === 'all' || product.category.toLowerCase().replace("'", "") === activeCategory.toLowerCase().replace("'", "").replace(" ", "-");
    
    const matchesRarity =
      activeRarity === 'all' || product.rarity?.toLowerCase() === activeRarity.toLowerCase();

    return matchesCategory && matchesRarity;
  });

  const rarityGrades = ['Scarce', 'Rare', 'Very Rare'];

  return (
    <div className="w-full max-w-full min-h-screen bg-brand-warmWhite pb-24 text-brand-espresso">
      
      <div className="max-w-6xl mx-auto px-4 md:px-12 pt-6">
        <NavigationControls className="justify-start border-b border-brand-border/30 pb-3" />
      </div>

      {/* 1. Heritage Editorial Hero */}
      <section className="w-full py-16 md:py-24 px-6 md:px-12 lg:px-24 bg-brand-softBeige/40 border-b border-brand-border/60 relative overflow-hidden">
        {/* Floating Background coins */}
        <div className="absolute top-1/2 right-12 w-64 h-64 rounded-full bg-brand-gold/5 blur-3xl pointer-events-none" />
        <div className="absolute bottom-4 left-10 w-48 h-48 rounded-full bg-brand-antiqueBronze/5 blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center z-10 relative">
          <div className="space-y-6 text-left">
            
            <div className="flex items-center space-x-2 text-brand-antiqueBronze font-bold text-[10px] tracking-[0.25em] uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              <span>COLLECTOR'S CORNER</span>
            </div>

            <h1 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl text-brand-espresso tracking-wide leading-none uppercase">
              EVERY COIN <br />
              <span className="font-light italic text-brand-antiqueBronze">TELLS A STORY</span>
            </h1>

            <p className="text-xs md:text-sm text-brand-warmGray leading-relaxed font-semibold tracking-wider max-w-md">
              A curated world of authentic historical coinage, commemorative issues, and paper currency notes. Each artifact carries centuries of Indian heritage, trade, and artistry.
            </p>
          </div>

          {/* Golden Medallion Crest visual */}
          <div className="flex justify-center md:justify-end">
            <div className="w-48 h-48 md:w-64 md:h-64 rounded-full border border-brand-antiqueBronze/20 flex items-center justify-center p-4 relative animate-spin-slow">
              <div className="absolute inset-2 rounded-full border border-dashed border-brand-antiqueBronze/40" />
              <div className="w-full h-full flex items-center justify-center bg-brand-gold/10 rounded-full font-display text-7xl font-light text-brand-antiqueBronze select-none">
                🪙
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Directory filter controls */}
      <div className="max-w-6xl mx-auto px-6 mt-12 grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Filter Panels (3 cols) */}
        <aside className="md:col-span-3 space-y-8 bg-brand-white border border-brand-border/60 p-6 rounded-2xl">
          <div className="flex items-center space-x-2 text-brand-espresso border-b border-brand-border pb-3">
            <Filter className="w-4 h-4 text-brand-antiqueBronze" />
            <span className="text-xs font-extrabold tracking-widest uppercase">CATALOG FILTER</span>
          </div>

          {/* Categories group */}
          <div className="space-y-3">
            <h3 className="text-[10px] font-bold text-brand-warmGray tracking-widest uppercase">
              DEPARTMENTS
            </h3>
            <div className="flex flex-col space-y-1.5 text-xs font-semibold tracking-wide text-brand-warmGray">
              <button
                onClick={() => setActiveCategory('all')}
                className={`text-left py-1 hover:text-brand-antiqueBronze ${activeCategory === 'all' ? 'text-brand-antiqueBronze font-bold border-l-2 border-brand-antiqueBronze pl-2' : ''}`}
              >
                ALL ARTIFACTS
              </button>
              {numCategories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setActiveCategory(c.id)}
                  className={`text-left py-1 hover:text-brand-antiqueBronze ${activeCategory === c.id ? 'text-brand-antiqueBronze font-bold border-l-2 border-brand-antiqueBronze pl-2' : ''}`}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>

          {/* Rarity filter */}
          <div className="space-y-3 pt-4 border-t border-brand-border/40">
            <h3 className="text-[10px] font-bold text-brand-warmGray tracking-widest uppercase">
              RARITY CLASSIFICATION
            </h3>
            <div className="flex flex-col space-y-1.5 text-xs font-semibold tracking-wide text-brand-warmGray">
              <button
                onClick={() => setActiveRarity('all')}
                className={`text-left py-1 hover:text-brand-antiqueBronze ${activeRarity === 'all' ? 'text-brand-antiqueBronze font-bold border-l-2 border-brand-antiqueBronze pl-2' : ''}`}
              >
                ALL GRADES
              </button>
              {rarityGrades.map((r) => (
                <button
                  key={r}
                  onClick={() => setActiveRarity(r)}
                  className={`text-left py-1 hover:text-brand-antiqueBronze ${activeRarity.toLowerCase() === r.toLowerCase() ? 'text-brand-antiqueBronze font-bold border-l-2 border-brand-antiqueBronze pl-2' : ''}`}
                >
                  {r.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Collector's Warning alert info */}
          <div className="bg-brand-softBeige/40 border border-brand-border/40 p-3 rounded-lg flex items-start gap-2.5">
            <Info className="w-4 h-4 text-brand-antiqueBronze flex-shrink-0 mt-0.5" />
            <p className="text-[9px] text-brand-warmGray leading-relaxed font-semibold">
              All collections are accompanied by official certificates of authenticity and detailed provenance registers.
            </p>
          </div>
        </aside>

        {/* Right Side: Products Grid (9 cols) */}
        <main className="md:col-span-9 space-y-6">
          <div className="flex items-center justify-between border-b border-brand-border pb-3">
            <span className="text-[10px] text-brand-warmGray font-bold tracking-widest">
              SHOWING {filteredProducts.length} ARTIFACTS
            </span>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="text-center py-20 bg-brand-white border border-brand-border/40 rounded-2xl text-brand-warmGray text-xs font-semibold tracking-wider">
              NO ARTIFACTS MATCH THE SELECTED FILTER CRITERIA.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => {
                const inWishlist = isInWishlist(product.id);
                const isHovered = hoveredCoinId === product.id;

                return (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.4 }}
                    className="flex flex-col text-left group bg-brand-white border border-brand-border/50 rounded-2xl overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => handleProductClick(product)}
                    onMouseEnter={() => setHoveredCoinId(product.id)}
                    onMouseLeave={() => setHoveredCoinId(null)}
                  >
                    
                    {/* Visual Area (3D coin spinning on hover) */}
                    <div className="w-full aspect-[4/5] bg-brand-softBeige/20 p-6 flex items-center justify-center relative overflow-hidden border-b border-brand-border/40">
                      
                      {/* Spin Coin visual wrapper */}
                      <div className="w-full h-full transform group-hover:scale-103 transition-transform duration-500">
                        <ProductVisual
                          type={product.visualType}
                          color={product.visualColor}
                          pattern={product.visualPattern}
                          isRotating={isHovered && product.visualType === 'coin'}
                        />
                      </div>

                      {/* Top rarity banner badge */}
                      <div className="absolute top-3 left-3 flex flex-col gap-1">
                        <span className="text-[8px] bg-brand-espresso text-brand-gold font-extrabold tracking-widest px-2.5 py-0.8 rounded shadow-sm">
                          {product.rarity?.toUpperCase()}
                        </span>
                      </div>

                      {/* Wishlist button */}
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
                        <Heart className={`w-3.5 h-3.5 ${inWishlist ? 'fill-brand-dustyRose' : ''}`} />
                      </button>

                      {/* Quick Add Bag on hover */}
                      <div className="absolute bottom-3 right-3 translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            addToCart(product, 1);
                          }}
                          className="p-2.5 bg-brand-antiqueBronze text-brand-warmWhite rounded-full hover:bg-brand-antiqueBronze/90 shadow-md transition-colors"
                          aria-label="Quick Add to Bag"
                        >
                          <ShoppingBag className="w-4 h-4" />
                        </button>
                      </div>

                    </div>

                    {/* Metadata details */}
                    <div className="p-4 space-y-1.5 flex-grow flex flex-col justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-[9px] text-brand-warmGray font-bold tracking-widest">
                          <span>{product.category}</span>
                          <span className="text-brand-antiqueBronze">{product.year}</span>
                        </div>
                        
                        <h3 className="font-display font-bold text-sm text-brand-espresso leading-snug group-hover:text-brand-antiqueBronze transition-colors line-clamp-1">
                          {product.name}
                        </h3>

                        <p className="text-[10px] text-brand-warmGray line-clamp-2 leading-relaxed">
                          {product.description}
                        </p>
                      </div>

                      {/* Era and prices */}
                      <div className="border-t border-brand-border/30 pt-3 flex items-center justify-between">
                        <span className="text-[8px] text-brand-warmGray font-bold tracking-wider">
                          ERA: {product.era}
                        </span>
                        
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-bold text-brand-espresso">
                            ₹{product.price.toLocaleString('en-IN')}
                          </span>
                          <span className="text-[9px] text-brand-warmGray line-through font-semibold">
                            ₹{product.mrp.toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>

                    </div>

                  </motion.div>
                );
              })}
            </div>
          )}
        </main>

      </div>

    </div>
  );
};
