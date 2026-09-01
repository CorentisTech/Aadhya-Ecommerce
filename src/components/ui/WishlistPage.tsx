"use client";

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Heart, ShoppingBag, Flame, ChevronRight, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { NavigationControls } from './NavigationControls';
import { ProductVisual } from './ProductVisual';

export const WishlistPage: React.FC = () => {
  const { wishlist, toggleWishlist, addToCart, setPage } = useApp();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'all' | 'western' | 'ethnic' | 'numismatics'>('all');

  // Move all wishlist items to cart
  const handleMoveAllToBag = () => {
    if (wishlist.length === 0) return;
    wishlist.forEach((p) => {
      addToCart(p, 1, p.sizes && p.sizes.length > 0 ? p.sizes[0] : '36');
    });
    alert("Curated favorites successfully moved to Shopping Bag!");
  };

  // Filter items dynamically into category buckets
  const westernItems = wishlist.filter(
    (p) =>
      p.department === 'fashion' &&
      !['saree', 'kurta', 'anarkali', 'blouse'].some(
        (term) => p.name.toLowerCase().includes(term) || p.category.toLowerCase().includes(term)
      )
  );

  const ethnicItems = wishlist.filter(
    (p) =>
      p.department === 'fashion' &&
      ['saree', 'kurta', 'anarkali', 'blouse'].some(
        (term) => p.name.toLowerCase().includes(term) || p.category.toLowerCase().includes(term)
      )
  );

  const numisItems = wishlist.filter((p) => p.department === 'numismatics');

  // Filter based on active tab selection
  let displayedProducts = wishlist;
  if (activeTab === 'western') displayedProducts = westernItems;
  if (activeTab === 'ethnic') displayedProducts = ethnicItems;
  if (activeTab === 'numismatics') displayedProducts = numisItems;

  return (
    <div className="w-full max-w-full min-h-screen bg-[#FCFAF7] py-10 px-4 md:px-12 lg:px-24 text-brand-espresso text-left select-none">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Navigation Controls (← Back & Back to Home) */}
        <NavigationControls className="justify-start border-b border-brand-border/30 pb-3" />

        {wishlist.length === 0 ? (
          <div className="text-center py-20 bg-brand-white border border-brand-border/40 rounded-3xl space-y-5 shadow-sm max-w-2xl mx-auto">
            <div className="w-16 h-16 rounded-full bg-[#FFF3EC] flex items-center justify-center text-[#F26A2E] text-2xl mx-auto">
              ♡
            </div>
            <div className="space-y-1">
              <h3 className="font-display font-bold text-sm tracking-widest text-brand-espresso">YOUR WISHLIST IS EMPTY</h3>
              <p className="text-[10px] text-brand-warmGray font-semibold tracking-wider">
                Explore our catalog to save fashion pieces and rare coin artifacts.
              </p>
            </div>
            <button
              onClick={() => router.push('/catalog')}
              className="px-6 py-2.5 bg-[#F26A2E] text-brand-white text-xs font-bold tracking-widest rounded-xl hover:bg-[#F26A2E]/90 transition-colors uppercase"
            >
              BROWSE CATALOG
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            
            {/* Dark Orange Flame Selling Out Alert Banner */}
            <div className="bg-[#1C1816] rounded-3xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-left shadow-md border border-brand-border/20">
              <div className="flex items-center space-x-3.5">
                {/* Orange Flame Badge */}
                <div className="w-10 h-10 rounded-full bg-[#F26A2E]/10 flex items-center justify-center flex-shrink-0 text-lg">
                  🔥
                </div>
                <div className="space-y-0.5">
                  <h4 className="font-sans font-bold text-sm text-white tracking-wide leading-tight">
                    Items in your wishlist are selling out fast!
                  </h4>
                  <p className="text-[9px] md:text-[10px] text-brand-warmGray font-semibold tracking-wider">
                    Prices and reserve stock for saved items are guaranteed for the next 24 hours only.
                  </p>
                </div>
              </div>

              <button
                onClick={handleMoveAllToBag}
                className="w-full sm:w-auto px-5 py-2.5 bg-[#F26A2E] text-brand-white text-[10px] font-extrabold tracking-widest rounded-full hover:bg-[#F26A2E]/90 transition-colors uppercase flex items-center justify-center gap-1.5 shadow-md flex-shrink-0"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>MOVE ALL TO BAG</span>
              </button>
            </div>

            {/* Serif Favorites Page Title & Stats */}
            <div className="space-y-1 pt-2">
              <h1 className="font-display font-bold text-4xl text-brand-espresso tracking-tight">
                Favorites
              </h1>
              <p className="text-[10px] text-brand-warmGray font-bold tracking-widest uppercase">
                {wishlist.length} Curated Products Saved
              </p>
            </div>

            {/* Chips Navigation Filter Row */}
            <div className="flex flex-wrap gap-2 text-[9px] font-extrabold tracking-widest uppercase pt-2">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-4 py-2 rounded-full border transition-all ${
                  activeTab === 'all'
                    ? 'bg-brand-espresso border-brand-espresso text-brand-white shadow-sm'
                    : 'bg-brand-white border-brand-border/60 text-brand-warmGray hover:bg-brand-softBeige/20'
                }`}
              >
                ALL ({wishlist.length})
              </button>
              <button
                onClick={() => setActiveTab('western')}
                className={`px-4 py-2 rounded-full border transition-all ${
                  activeTab === 'western'
                    ? 'bg-brand-espresso border-brand-espresso text-brand-white shadow-sm'
                    : 'bg-brand-white border-brand-border/60 text-brand-warmGray hover:bg-brand-softBeige/20'
                }`}
              >
                WESTERN ({westernItems.length})
              </button>
              <button
                onClick={() => setActiveTab('ethnic')}
                className={`px-4 py-2 rounded-full border transition-all ${
                  activeTab === 'ethnic'
                    ? 'bg-brand-espresso border-brand-espresso text-brand-white shadow-sm'
                    : 'bg-brand-white border-brand-border/60 text-brand-warmGray hover:bg-brand-softBeige/20'
                }`}
              >
                ETHNIC ({ethnicItems.length})
              </button>
              <button
                onClick={() => setActiveTab('numismatics')}
                className={`px-4 py-2 rounded-full border transition-all ${
                  activeTab === 'numismatics'
                    ? 'bg-brand-espresso border-brand-espresso text-brand-white shadow-sm'
                    : 'bg-brand-white border-brand-border/60 text-brand-warmGray hover:bg-brand-softBeige/20'
                }`}
              >
                NUMISMATICS ({numisItems.length})
              </button>
            </div>

            {/* Favorites Product Cards Grid */}
            {displayedProducts.length === 0 ? (
              <div className="text-center py-20 bg-brand-white border border-brand-border/30 rounded-3xl text-[10px] font-bold text-brand-warmGray uppercase tracking-widest">
                No items saved in this category.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
                {displayedProducts.map((product) => {
                  // Stock alert labels dynamically determined to match reference layouts
                  let stockLabel = '⚡ Only 2 pieces left in size S';
                  if (product.bestseller) {
                    stockLabel = '🔥 High demand + 14 people viewing';
                  } else if (product.discount && product.discount > 0) {
                    stockLabel = `🏷 Price drop! Save ₹${Math.round(product.price * 0.1)} today`;
                  }

                  // Category tag labels
                  let categoryLabel = 'Structured Dresses';
                  if (product.department === 'numismatics') {
                    categoryLabel = 'Heritage Coins';
                  } else if (['saree', 'kurta', 'anarkali'].some(term => product.name.toLowerCase().includes(term))) {
                    categoryLabel = 'Ethnic Festive';
                  }

                  return (
                    <div
                      key={product.id}
                      className="border border-brand-border/20 rounded-3xl overflow-hidden flex flex-col bg-white shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
                      onClick={() => router.push(`/product/${product.name.toLowerCase().replace(/ /g, '-')}`)}
                    >
                      {/* Upper section (White bg with center portrait image) */}
                      <div className="p-4 bg-white flex flex-col items-center relative flex-grow min-h-[290px] justify-between">
                        
                        {/* Upper image tags */}
                        {product.bestseller ? (
                          <div className="absolute top-4 left-4">
                            <span className="text-[7px] bg-white border border-brand-border text-brand-espresso font-extrabold tracking-widest px-2 py-0.5 rounded shadow-xs uppercase">
                              Bestseller
                            </span>
                          </div>
                        ) : product.discount && product.discount > 0 ? (
                          <div className="absolute top-4 left-4">
                            <span className="text-[7px] bg-brand-sale/10 border border-brand-sale/25 text-brand-sale font-extrabold tracking-widest px-2 py-0.5 rounded shadow-xs uppercase">
                              -{product.discount}%
                            </span>
                          </div>
                        ) : null}

                        {/* Image panel */}
                        <div className="w-[180px] aspect-[4/5] mt-3 rounded-2xl overflow-hidden relative bg-brand-softBeige/5">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            loading="lazy"
                          />
                        </div>

                        {/* Middle Stock Warning Status */}
                        <div className="w-full text-center mt-3 pt-2 border-t border-brand-border/10">
                          <span className="text-[9px] font-bold text-[#F26A2E] tracking-wide block">
                            {stockLabel}
                          </span>
                        </div>

                      </div>

                      {/* Lower Section (Beige background) */}
                      <div className="p-4 bg-[#FBF9F6] border-t border-brand-border/10 flex flex-col justify-between space-y-3">
                        <div className="space-y-0.5 text-left">
                          <span className="text-[8px] font-extrabold text-brand-warmGray tracking-widest uppercase block">
                            {categoryLabel}
                          </span>
                          <h3 className="font-sans font-bold text-xs text-brand-espresso tracking-wide line-clamp-1 group-hover:text-[#F26A2E] transition-colors">
                            {product.name}
                          </h3>
                        </div>

                        {/* Pricing and CTAs */}
                        <div className="flex items-center justify-between pt-1 border-t border-brand-border/15">
                          <div className="flex items-baseline space-x-1.5">
                            <span className="text-xs font-extrabold text-brand-espresso">
                              ₹{product.price.toLocaleString('en-IN')}
                            </span>
                            {product.mrp && product.mrp > product.price && (
                              <span className="text-[10px] text-brand-warmGray line-through font-semibold">
                                ₹{product.mrp.toLocaleString('en-IN')}
                              </span>
                            )}
                          </div>

                          <div className="flex items-center space-x-2">
                            {/* Heart toggle button (removes item) */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleWishlist(product);
                              }}
                              className="p-1.5 bg-brand-blush/35 hover:bg-brand-blush/60 border border-brand-dustyRose/30 rounded-full transition-colors"
                              aria-label="Remove item"
                            >
                              <Heart className="w-3.5 h-3.5 fill-[#F26A2E] text-[#F26A2E]" />
                            </button>

                            {/* Add to bag button */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                addToCart(product, 1, product.sizes && product.sizes.length > 0 ? product.sizes[0] : '36');
                                alert(`${product.name} added to shopping bag!`);
                              }}
                              className="p-1.5 bg-brand-espresso text-brand-white rounded-full hover:bg-[#F26A2E] transition-colors shadow-sm"
                              aria-label="Add to cart"
                            >
                              <ShoppingBag className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                      </div>

                    </div>
                  );
                })}
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
};

export default WishlistPage;
