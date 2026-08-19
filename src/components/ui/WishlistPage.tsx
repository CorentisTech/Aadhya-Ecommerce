"use client";

import React from 'react';
import { useApp } from '../../context/AppContext';
import { ProductVisual } from './ProductVisual';
import { Heart, ShoppingBag } from 'lucide-react';

export const WishlistPage: React.FC = () => {
  const { wishlist, toggleWishlist, addToCart, setSelectedProduct, setPage } = useApp();

  const fashionWish = wishlist.filter((item) => item.department === 'fashion');
  const numisWish = wishlist.filter((item) => item.department === 'numismatics');

  const handleProductClick = (product: any) => {
    setSelectedProduct(product);
  };

  return (
    <div className="w-full min-h-screen bg-brand-warmWhite py-16 px-6 md:px-12 lg:px-24 text-brand-espresso">
      
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* Header Block */}
        <div className="border-b border-brand-border pb-4 text-center md:text-left">
          <span className="text-[10px] text-brand-warmGray font-bold tracking-[0.25em] uppercase">
            YOUR COLLECTION
          </span>
          <h1 className="font-display font-bold text-3xl md:text-4xl text-brand-espresso uppercase tracking-wider mt-1">
            SAVED ITEMS
          </h1>
          <p className="font-display italic text-brand-warmGray text-sm">
            "Your curated choices, gathered in one place."
          </p>
        </div>

        {wishlist.length === 0 ? (
          <div className="text-center py-24 bg-brand-white border border-brand-border/40 rounded-3xl space-y-6 max-w-2xl mx-auto">
            <div className="w-16 h-16 rounded-full bg-brand-softBeige/60 flex items-center justify-center text-brand-warmGray text-2xl mx-auto">
              ♡
            </div>
            <div>
              <h3 className="font-display font-bold text-sm tracking-widest text-brand-espresso uppercase">YOUR WISHLIST IS EMPTY</h3>
              <p className="text-[10px] text-brand-warmGray font-semibold tracking-wider mt-1">
                Explore our catalog to save fashion pieces and rare coin artifacts.
              </p>
            </div>
            <button
              onClick={() => setPage('home')}
              className="px-6 py-2.5 bg-brand-espresso text-brand-white text-xs font-bold tracking-widest hover:bg-brand-espresso/90 transition-colors rounded-lg shadow-sm"
            >
              BROWSE FASHION
            </button>
          </div>
        ) : (
          <div className="space-y-16">
            
            {/* Section 1: Fashion Saved Items */}
            {fashionWish.length > 0 && (
              <div className="space-y-6">
                <h2 className="text-xs font-bold tracking-[0.2em] text-brand-dustyRose border-b border-brand-border pb-2">
                  FASHION WISHLIST ({fashionWish.length})
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {fashionWish.map((product) => (
                    <div
                      key={product.id}
                      onClick={() => handleProductClick(product)}
                      className="flex flex-col text-left group cursor-pointer"
                    >
                      <div className="w-full aspect-[4/5] bg-brand-white border border-brand-border/50 rounded-2xl p-5 relative flex items-center justify-center hover:shadow-md transition-shadow">
                        <ProductVisual type={product.visualType} color={product.visualColor} pattern={product.visualPattern} />
                        
                        {/* Remove heart */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleWishlist(product);
                          }}
                          className="absolute top-3 right-3 p-2 rounded-full bg-brand-blush border border-brand-dustyRose text-brand-dustyRose"
                          aria-label="Remove from Wishlist"
                        >
                          <Heart className="w-3.5 h-3.5 fill-brand-dustyRose" />
                        </button>

                        {/* Add to bag */}
                        <div className="absolute bottom-3 right-3 translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              addToCart(product, 1, 'Free Size');
                            }}
                            className="p-2.5 bg-brand-espresso text-brand-white rounded-full hover:bg-brand-espresso/90 shadow-md transition-colors"
                          >
                            <ShoppingBag className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <div className="mt-3 space-y-1">
                        <span className="text-[9px] text-brand-warmGray font-bold tracking-widest uppercase">
                          {product.category}
                        </span>
                        <h3 className="font-display font-bold text-xs text-brand-espresso leading-snug group-hover:text-brand-dustyRose transition-colors line-clamp-1">
                          {product.name}
                        </h3>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-bold text-brand-espresso">
                            ₹{product.price.toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Section 2: Numismatics Saved Items */}
            {numisWish.length > 0 && (
              <div className="space-y-6">
                <h2 className="text-xs font-bold tracking-[0.2em] text-brand-antiqueBronze border-b border-brand-border pb-2">
                  NUMISMATICS COLLECTION ({numisWish.length})
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {numisWish.map((product) => (
                    <div
                      key={product.id}
                      onClick={() => handleProductClick(product)}
                      className="flex flex-col text-left group cursor-pointer"
                    >
                      <div className="w-full aspect-[4/5] bg-brand-white border border-brand-border/50 rounded-2xl p-5 relative flex items-center justify-center hover:shadow-md transition-shadow">
                        <ProductVisual type={product.visualType} color={product.visualColor} pattern={product.visualPattern} />
                        
                        {/* Remove heart */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleWishlist(product);
                          }}
                          className="absolute top-3 right-3 p-2 rounded-full bg-brand-blush border border-brand-dustyRose text-brand-dustyRose"
                          aria-label="Remove from Wishlist"
                        >
                          <Heart className="w-3.5 h-3.5 fill-brand-dustyRose" />
                        </button>

                        {/* Add to bag */}
                        <div className="absolute bottom-3 right-3 translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              addToCart(product, 1);
                            }}
                            className="p-2.5 bg-brand-antiqueBronze text-brand-warmWhite rounded-full hover:bg-brand-antiqueBronze/90 shadow-md transition-colors"
                          >
                            <ShoppingBag className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <div className="mt-3 space-y-1">
                        <div className="flex justify-between items-center text-[9px] text-brand-warmGray font-bold tracking-widest">
                          <span>{product.category}</span>
                          <span className="text-brand-antiqueBronze">{product.year}</span>
                        </div>
                        <h3 className="font-display font-bold text-xs text-brand-espresso leading-snug group-hover:text-brand-antiqueBronze transition-colors line-clamp-1">
                          {product.name}
                        </h3>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-bold text-brand-espresso">
                            ₹{product.price.toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        )}

      </div>

    </div>
  );
};
export default WishlistPage;
