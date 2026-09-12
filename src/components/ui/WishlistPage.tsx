"use client";

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Heart, ShoppingBag, Sparkles, Coins, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { NavigationControls } from './NavigationControls';
import { ProductVisual } from './ProductVisual';
import { Product } from '@/data/mockData';

export const WishlistPage: React.FC = () => {
  const { wishlist, toggleWishlist, addToCart } = useApp();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'all' | 'fashion' | 'numismatics'>('all');

  // Strictly partitioned into the 2 sections requested by user
  const fashionItems = wishlist.filter((p) => p.department === 'fashion');
  const numisItems = wishlist.filter((p) => p.department === 'numismatics');

  // Move active items to cart
  const handleMoveAllToBag = (itemsToMove: Product[]) => {
    if (itemsToMove.length === 0) return;
    itemsToMove.forEach((p) => {
      addToCart(p, 1, p.sizes && p.sizes.length > 0 ? p.sizes[0] : '36');
    });
    alert(`${itemsToMove.length} curated favorites successfully moved to Shopping Bag!`);
  };

  // Helper renderer for a single product card (2 columns on mobile, 3 on desktop)
  const renderProductCard = (product: Product) => {
    const isNumis = product.department === 'numismatics';
    const slug = product.name.toLowerCase().replace(/ /g, '-');

    // Dynamic stock/demand label
    let stockLabel = '⚡ Only 2 pieces left';
    if (product.bestseller) {
      stockLabel = '🔥 High demand + 14 people viewing';
    } else if (product.discount && product.discount > 0) {
      stockLabel = `🏷 Price drop! Save ₹${Math.round(product.price * 0.1)} today`;
    }

    return (
      <div
        key={product.id}
        className="border border-brand-border/20 rounded-2xl sm:rounded-3xl overflow-hidden flex flex-col bg-white shadow-xs hover:shadow-md transition-shadow cursor-pointer group justify-between"
        onClick={() => {
          router.push(isNumis ? `/numismatics/${slug}` : `/product/${slug}`);
        }}
      >
        {/* Upper section (White bg with image/visual) */}
        <div className="p-2 sm:p-4 bg-white flex flex-col items-center relative flex-grow min-h-[190px] sm:min-h-[290px] justify-between">
          
          {/* Upper image tags */}
          {product.bestseller ? (
            <div className="absolute top-2 left-2 sm:top-4 sm:left-4 z-10">
              <span className="text-[7px] bg-white border border-brand-border text-brand-espresso font-extrabold tracking-widest px-1.5 sm:px-2 py-0.5 rounded shadow-xs uppercase">
                Bestseller
              </span>
            </div>
          ) : product.discount && product.discount > 0 ? (
            <div className="absolute top-2 left-2 sm:top-4 sm:left-4 z-10">
              <span className="text-[7px] bg-brand-sale/10 border border-brand-sale/25 text-brand-sale font-extrabold tracking-widest px-1.5 sm:px-2 py-0.5 rounded shadow-xs uppercase">
                -{product.discount}%
              </span>
            </div>
          ) : null}

          {/* Image / Visual Panel */}
          <div className="w-full max-w-[180px] aspect-[4/5] mt-1 sm:mt-3 rounded-xl sm:rounded-2xl overflow-hidden relative bg-brand-softBeige/5 flex items-center justify-center">
            {isNumis ? (
              product.visualType === 'note' ? (
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center p-2">
                  <ProductVisual
                    type="coin"
                    color={product.visualColor || '#B89A67'}
                    pattern={product.visualPattern || 'antique-metallic'}
                    className="w-full h-full scale-105"
                    isRotating={false}
                  />
                </div>
              )
            ) : (
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
            )}
          </div>

          {/* Stock Warning Status */}
          <div className="w-full text-center mt-1 sm:mt-3 pt-1 sm:pt-2 border-t border-brand-border/10">
            <span className="text-[7.5px] sm:text-[9px] font-bold text-[#F26A2E] tracking-wide block line-clamp-1">
              {stockLabel}
            </span>
          </div>

        </div>

        {/* Lower Section (Beige background) */}
        <div className="p-2.5 sm:p-4 bg-[#FBF9F6] border-t border-brand-border/10 flex flex-col justify-between space-y-2 sm:space-y-3">
          <div className="space-y-0.5 text-left">
            <span className="text-[7px] sm:text-[8px] font-extrabold text-brand-warmGray tracking-widest uppercase block">
              {product.category || (isNumis ? 'Numismatics' : 'Fashion')}
            </span>
            <h3 className="font-sans font-bold text-[11px] sm:text-xs text-brand-espresso tracking-wide line-clamp-1 group-hover:text-[#F26A2E] transition-colors">
              {product.name}
            </h3>
          </div>

          {/* Pricing and CTAs */}
          <div className="flex items-center justify-between pt-1 border-t border-brand-border/15 gap-1">
            <div className="flex flex-col sm:flex-row sm:items-baseline sm:space-x-1.5">
              <span className="text-[11px] sm:text-xs font-extrabold text-brand-espresso whitespace-nowrap">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              {product.mrp && product.mrp > product.price && (
                <span className="text-[9px] sm:text-[10px] text-brand-warmGray line-through font-semibold whitespace-nowrap">
                  ₹{product.mrp.toLocaleString('en-IN')}
                </span>
              )}
            </div>

            <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
              {/* Heart toggle button (removes item) */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleWishlist(product);
                }}
                className="p-1 sm:p-1.5 bg-brand-blush/35 hover:bg-brand-blush/60 border border-brand-dustyRose/30 rounded-full transition-colors"
                aria-label="Remove item"
                title="Remove from wishlist"
              >
                <Heart className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-[#F26A2E] text-[#F26A2E]" />
              </button>

              {/* Add to bag button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  addToCart(product, 1, product.sizes && product.sizes.length > 0 ? product.sizes[0] : '36');
                  alert(`${product.name} added to shopping bag!`);
                }}
                className="p-1 sm:p-1.5 bg-brand-espresso text-brand-white rounded-full hover:bg-[#F26A2E] transition-colors shadow-sm"
                aria-label="Add to cart"
                title="Add to bag"
              >
                <ShoppingBag className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              </button>
            </div>
          </div>

        </div>

      </div>
    );
  };

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
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                onClick={() => router.push('/catalog')}
                className="px-6 py-2.5 bg-[#F26A2E] text-brand-white text-xs font-bold tracking-widest rounded-xl hover:bg-[#F26A2E]/90 transition-colors uppercase shadow-xs"
              >
                BROWSE FASHION
              </button>
              <button
                onClick={() => router.push('/numismatics/catalog')}
                className="px-6 py-2.5 bg-[#2B231D] text-brand-white text-xs font-bold tracking-widest rounded-xl hover:bg-black transition-colors uppercase shadow-xs"
              >
                BROWSE NUMISMATICS
              </button>
            </div>
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
                onClick={() => handleMoveAllToBag(wishlist)}
                className="w-full sm:w-auto px-5 py-2.5 bg-[#F26A2E] text-brand-white text-[10px] font-extrabold tracking-widest rounded-full hover:bg-[#F26A2E]/90 transition-colors uppercase flex items-center justify-center gap-1.5 shadow-md flex-shrink-0 cursor-pointer"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>MOVE ALL TO BAG ({wishlist.length})</span>
              </button>
            </div>

            {/* Serif Favorites Page Title & Stats */}
            <div className="space-y-1 pt-2">
              <h1 className="font-display font-bold text-3xl sm:text-4xl text-brand-espresso tracking-tight">
                Curated Wishlist
              </h1>
              <p className="text-[10px] sm:text-xs text-brand-warmGray font-bold tracking-widest uppercase">
                {wishlist.length} Curated Products Saved across {fashionItems.length > 0 && numisItems.length > 0 ? 'Fashion & Numismatics' : fashionItems.length > 0 ? 'Fashion' : 'Numismatics'}
              </p>
            </div>

            {/* Chips Navigation Filter Row (ALL SECTIONS | FASHION | NUMISMATICS) */}
            <div className="flex flex-wrap gap-2 text-[9px] font-extrabold tracking-widest uppercase pt-2">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-4 py-2 rounded-full border transition-all cursor-pointer ${
                  activeTab === 'all'
                    ? 'bg-brand-espresso border-brand-espresso text-brand-white shadow-sm'
                    : 'bg-brand-white border-brand-border/60 text-brand-warmGray hover:bg-brand-softBeige/20'
                }`}
              >
                ALL SECTIONS ({wishlist.length})
              </button>
              <button
                onClick={() => setActiveTab('fashion')}
                className={`px-4 py-2 rounded-full border transition-all cursor-pointer ${
                  activeTab === 'fashion'
                    ? 'bg-brand-espresso border-brand-espresso text-brand-white shadow-sm'
                    : 'bg-brand-white border-brand-border/60 text-brand-warmGray hover:bg-brand-softBeige/20'
                }`}
              >
                FASHION ({fashionItems.length})
              </button>
              <button
                onClick={() => setActiveTab('numismatics')}
                className={`px-4 py-2 rounded-full border transition-all cursor-pointer ${
                  activeTab === 'numismatics'
                    ? 'bg-brand-espresso border-brand-espresso text-brand-white shadow-sm'
                    : 'bg-brand-white border-brand-border/60 text-brand-warmGray hover:bg-brand-softBeige/20'
                }`}
              >
                COINS & NUMISMATICS ({numisItems.length})
              </button>
            </div>

            {/* ==================================================
                SECTION 1: FASHION COLLECTION
               ================================================== */}
            {(activeTab === 'all' || activeTab === 'fashion') && (
              <div className="space-y-4 pt-4">
                {/* Section Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#EAE2D5] gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-[#FFF3EC] text-[#F26A2E] flex items-center justify-center flex-shrink-0 shadow-xs">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <h2 className="font-display font-bold text-xl sm:text-2xl text-brand-espresso tracking-tight">
                        Fashion Collection
                      </h2>
                      <p className="text-[10px] sm:text-xs text-brand-warmGray font-medium">
                        Handcrafted silhouettes, bottoms, blouses & designer wear
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-extrabold px-3 py-1 bg-white border border-[#EAE2D5] text-brand-espresso rounded-full uppercase shadow-xs">
                      {fashionItems.length} {fashionItems.length === 1 ? 'Piece' : 'Pieces'} Saved
                    </span>
                    {fashionItems.length > 0 && (
                      <button
                        onClick={() => handleMoveAllToBag(fashionItems)}
                        className="text-[10px] font-extrabold text-[#F26A2E] hover:underline uppercase cursor-pointer"
                      >
                        Move Fashion to Bag
                      </button>
                    )}
                  </div>
                </div>

                {/* Section Products Grid (Strictly Fashion only, 2 columns on mobile) */}
                {fashionItems.length === 0 ? (
                  <div className="text-center py-12 bg-white border border-brand-border/30 rounded-2xl space-y-3 shadow-xs">
                    <p className="text-xs font-bold text-brand-warmGray uppercase tracking-wider">
                      No fashion pieces saved in your wishlist yet.
                    </p>
                    <button
                      onClick={() => router.push('/catalog')}
                      className="inline-flex items-center gap-1.5 px-5 py-2 bg-brand-espresso text-white text-[10px] font-bold rounded-full hover:bg-black transition-colors uppercase tracking-widest cursor-pointer"
                    >
                      <span>Explore Fashion Catalog</span>
                      <ArrowRight className="w-3 h-3 text-[#F26A2E]" />
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-6">
                    {fashionItems.map(renderProductCard)}
                  </div>
                )}
              </div>
            )}

            {/* SECTION DIVIDER (Visible when viewing All Sections and both have items) */}
            {activeTab === 'all' && (
              <div className="pt-6 pb-2">
                <div className="w-full border-t border-dashed border-[#EAE2D5]" />
              </div>
            )}

            {/* ==================================================
                SECTION 2: COINS & NUMISMATICS COLLECTION
               ================================================== */}
            {(activeTab === 'all' || activeTab === 'numismatics') && (
              <div className="space-y-4 pt-4">
                {/* Section Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#EAE2D5] gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-[#FAF5EE] text-[#E0591D] flex items-center justify-center flex-shrink-0 border border-[#E0591D]/20 shadow-xs">
                      <Coins className="w-4 h-4" />
                    </div>
                    <div>
                      <h2 className="font-display font-bold text-xl sm:text-2xl text-brand-espresso tracking-tight">
                        Coins & Numismatics Collection
                      </h2>
                      <p className="text-[10px] sm:text-xs text-brand-warmGray font-medium">
                        Rare certified coins, imperial banknotes & historical specimens
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-extrabold px-3 py-1 bg-white border border-[#EAE2D5] text-[#E0591D] rounded-full uppercase shadow-xs">
                      {numisItems.length} {numisItems.length === 1 ? 'Collectible' : 'Collectibles'} Saved
                    </span>
                    {numisItems.length > 0 && (
                      <button
                        onClick={() => handleMoveAllToBag(numisItems)}
                        className="text-[10px] font-extrabold text-[#E0591D] hover:underline uppercase cursor-pointer"
                      >
                        Move Coins to Bag
                      </button>
                    )}
                  </div>
                </div>

                {/* Section Products Grid (Strictly Numismatics only, 2 columns on mobile) */}
                {numisItems.length === 0 ? (
                  <div className="text-center py-12 bg-white border border-brand-border/30 rounded-2xl space-y-3 shadow-xs">
                    <p className="text-xs font-bold text-brand-warmGray uppercase tracking-wider">
                      No coins or banknotes saved in your wishlist yet.
                    </p>
                    <button
                      onClick={() => router.push('/numismatics/catalog')}
                      className="inline-flex items-center gap-1.5 px-5 py-2 bg-[#2B231D] text-white text-[10px] font-bold rounded-full hover:bg-black transition-colors uppercase tracking-widest cursor-pointer"
                    >
                      <span>Explore Numismatics Vault</span>
                      <ArrowRight className="w-3 h-3 text-[#E0591D]" />
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-6">
                    {numisItems.map(renderProductCard)}
                  </div>
                )}
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
};

export default WishlistPage;
