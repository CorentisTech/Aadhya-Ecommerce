"use client";

import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { ProductVisual } from './ProductVisual';
import { Heart, Trash2, ArrowLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Product } from '../../data/mockData';
import { fetchProducts } from '@/services/productService';

import { NavigationControls } from './NavigationControls';

export const CartPage: React.FC = () => {
  const { cart, updateQuantity, removeFromCart, toggleWishlist, isInWishlist, appliedOffer, applyOffer, removeOffer } = useApp();
  const router = useRouter();
  
  // Promo code & available offers state
  const [promoCode, setPromoCode] = useState('');
  const [availableOffers, setAvailableOffers] = useState<any[]>([]);
  const [isApplying, setIsApplying] = useState(false);
  const [promoError, setPromoError] = useState<string | null>(null);
  const [recommendedProducts, setRecommendedProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetch('/api/offers?department=fashion')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.offers) {
          setAvailableOffers(data.offers);
        }
      })
      .catch(() => {});

    fetchProducts({ limit: 12 })
      .then(prods => {
        if (prods && prods.length > 0) {
          setRecommendedProducts(prods);
        }
      })
      .catch(() => {});
  }, []);

  const subtotal = cart.reduce((total, item) => total + item.product.price * item.quantity, 0);
  const totalItemsCount = cart.reduce((total, item) => total + item.quantity, 0);
  
  // Insured delivery cost: ₹150 or Free if subtotal >= 5000
  const deliveryCost = subtotal >= 5000 || subtotal === 0 ? 0 : 150;
  
  // Authoritative discount calculation
  let discountAmount = 0;
  if (appliedOffer) {
    if (appliedOffer.discountPercentage && appliedOffer.discountPercentage > 0) {
      discountAmount = Math.round(subtotal * (appliedOffer.discountPercentage / 100));
    } else if (appliedOffer.discountAmount && appliedOffer.discountAmount > 0) {
      discountAmount = Math.min(Number(appliedOffer.discountAmount), subtotal);
    }
  }
  
  const total = Math.max(0, subtotal + deliveryCost - discountAmount);

  const handleApplyPromo = async (codeToApply?: string) => {
    const code = (codeToApply || promoCode).trim();
    if (!code) return;
    setIsApplying(true);
    setPromoError(null);
    const res = await applyOffer(code);
    setIsApplying(false);
    if (res.success) {
      setPromoCode('');
      setPromoError(null);
    } else {
      setPromoError(res.message || 'Invalid promo code');
    }
  };

  // Filter cross-sell recommendations (See also section)
  // Get items from database that are not in the current cart
  const cartIds = cart.map(item => item.product.id);
  const crossSellProducts = recommendedProducts.filter(p => !cartIds.includes(p.id)).slice(0, 4);

  return (
    <div className="w-full max-w-full min-h-screen bg-[#FCFAF7] py-10 px-4 md:px-12 lg:px-24 text-brand-espresso text-left">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Navigation Controls (← Back & Back to Home) */}
        <NavigationControls className="justify-start border-b border-brand-border/30 pb-3" />

        {/* Serif Page Title */}
        <h1 className="font-display font-bold text-4xl text-brand-espresso tracking-tight">
          Shopping Cart
        </h1>

        {cart.length === 0 ? (
          <div className="text-center py-20 bg-brand-white border border-brand-border/40 rounded-3xl space-y-5 shadow-sm">
            <div className="w-16 h-16 rounded-full bg-[#FFF3EC] flex items-center justify-center text-[#F26A2E] text-2xl mx-auto">
              🛍
            </div>
            <div className="space-y-1">
              <h3 className="font-display font-bold text-sm tracking-widest text-brand-espresso">YOUR SHOPPING CART IS EMPTY</h3>
              <p className="text-[10px] text-brand-warmGray font-semibold tracking-wider">
                Explore our catalog to find fine garments and heritage coins.
              </p>
            </div>
            <button
              onClick={() => router.push('/catalog')}
              className="px-6 py-2.5 bg-[#F26A2E] text-brand-white text-xs font-bold tracking-widest rounded-xl hover:bg-[#F26A2E]/90 transition-colors uppercase"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Cart Items Grid (7 cols) */}
            <div className="lg:col-span-7 space-y-4">
              {cart.map((item, index) => {
                const inWishlist = isInWishlist(item.product.id);
                
                // Color hex mapping for small preview swatch dot
                const colorHex = item.selectedColor || '';

                return (
                  <div 
                    key={`${item.product.id}-${item.selectedSize}-${item.selectedColor}-${index}`}
                    className="bg-brand-white p-4 border border-brand-border/30 rounded-3xl flex flex-col gap-3.5 relative shadow-sm"
                  >
                    <div className="flex items-start gap-4 w-full">
                      {/* Rounded Image Frame */}
                      <div 
                        onClick={() => {
                          const itemSlug = item.product.name.toLowerCase().replace(/ /g, '-');
                          router.push(item.product.department === 'numismatics' ? `/numismatics/${itemSlug}` : `/product/${itemSlug}`);
                        }}
                        className="w-16 h-20 sm:w-20 sm:h-24 bg-brand-softBeige/15 rounded-2xl overflow-hidden flex-shrink-0 flex items-center justify-center border border-brand-border/20 cursor-pointer hover:opacity-90 transition-opacity"
                      >
                        <img 
                          src={item.product.image || (item.product.images && item.product.images[0]) || ''} 
                          alt={item.product.name} 
                          className="w-full h-full object-cover" 
                          draggable={false}
                        />
                      </div>

                      {/* Details & Price container */}
                      <div className="flex-grow flex flex-col sm:flex-row sm:justify-between min-h-[80px] sm:min-h-[96px] justify-between text-left">
                        <div className="space-y-0.5">
                          <span className="text-[8px] font-extrabold text-[#F26A2E] tracking-widest uppercase block">
                            {item.product.department === 'numismatics' ? 'Ethnic Heritage' : 'Women\'s Couture'}
                          </span>
                          <h3 
                            onClick={() => {
                              const itemSlug = item.product.name.toLowerCase().replace(/ /g, '-');
                              router.push(item.product.department === 'numismatics' ? `/numismatics/${itemSlug}` : `/product/${itemSlug}`);
                            }}
                            className="font-sans font-bold text-xs sm:text-sm text-brand-espresso line-clamp-2 pr-2 cursor-pointer hover:text-[#F26A2E] transition-colors"
                          >
                            {item.product.name}
                          </h3>
                          
                          {/* Specs display (with small color swatch dot) */}
                          <div className="flex items-center space-x-2 text-[10px] text-brand-warmGray font-bold pt-1">
                            {item.selectedSize && <span>Size: {item.selectedSize}</span>}
                            {item.selectedSize && item.selectedColor && <span>•</span>}
                            {item.selectedColor && (
                              <span className="flex items-center space-x-1">
                                <span>Color:</span>
                                <span 
                                  className="w-2.5 h-2.5 rounded-full border border-brand-border/50 inline-block"
                                  style={{ backgroundColor: colorHex }}
                                />
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Price aligned */}
                        <div className="text-left sm:text-right mt-1.5 sm:mt-0 flex-shrink-0">
                          <span className="font-display font-extrabold text-sm sm:text-base text-brand-espresso">
                            ₹{item.product.price.toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Bottom actions row */}
                    <div className="flex flex-wrap items-center gap-3 w-full border-t border-brand-border/10 pt-3">
                      {/* Quantity Selector: - 1 + */}
                      <div className="flex items-center border border-brand-border/50 rounded-full py-0.5 px-2 bg-brand-warmWhite text-xs font-bold text-brand-espresso">
                        <button
                          onClick={() => {
                            if (item.quantity > 1) {
                              updateQuantity(item.product.id, item.quantity - 1, item.selectedSize, item.selectedColor);
                            }
                          }}
                          className="hover:text-[#F26A2E] p-1 font-extrabold"
                        >
                          -
                        </button>
                        <span className="px-2 min-w-[16px] text-center">{item.quantity}</span>
                        <button
                          onClick={() => {
                            updateQuantity(item.product.id, item.quantity + 1, item.selectedSize, item.selectedColor);
                          }}
                          className="hover:text-[#F26A2E] p-1 font-extrabold"
                        >
                          +
                        </button>
                      </div>

                      {/* Favorite button */}
                      <button
                        onClick={() => toggleWishlist(item.product)}
                        className="flex items-center space-x-1 text-[9px] font-bold text-brand-warmGray hover:text-[#F26A2E] transition-colors"
                      >
                        <Heart className={`w-3.5 h-3.5 ${inWishlist ? 'fill-[#F26A2E] text-[#F26A2E]' : ''}`} />
                        <span>Move to Favourites</span>
                      </button>

                      {/* Delete button */}
                      <button
                        onClick={() => removeFromCart(item.product.id, item.selectedSize, item.selectedColor)}
                        className="flex items-center space-x-1 text-[9px] font-bold text-brand-warmGray hover:text-brand-sale transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right Column: Totals Sidebar Summary (5 cols) */}
            <div className="lg:col-span-5 bg-brand-white border border-brand-border/30 p-6 md:p-8 rounded-3xl space-y-6 shadow-sm">
              <div className="flex items-baseline justify-between border-b border-brand-border/30 pb-3">
                <h2 className="font-display font-bold text-xl text-brand-espresso">
                  Total
                </h2>
                <span className="font-display font-extrabold text-2xl text-brand-espresso">
                  ₹{total.toLocaleString('en-IN')}
                </span>
              </div>

              {/* Breakdown */}
              <div className="space-y-3 text-[10px] font-bold tracking-widest text-brand-warmGray">
                <div className="flex justify-between">
                  <span>PRODUCTS, {totalItemsCount} PCS</span>
                  <span className="text-brand-espresso font-extrabold">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                {appliedOffer && discountAmount > 0 ? (
                  <div className="flex justify-between text-brand-success font-extrabold">
                    <span>DISCOUNT ({appliedOffer.code})</span>
                    <span>-₹{discountAmount.toLocaleString('en-IN')}</span>
                  </div>
                ) : (
                  <div className="flex justify-between text-brand-warmGray font-bold">
                    <span>DISCOUNT</span>
                    <span>₹0</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>INSURED DELIVERY</span>
                  <span className="text-brand-espresso font-extrabold">
                    {deliveryCost === 0 ? 'FREE' : `₹${deliveryCost}`}
                  </span>
                </div>
              </div>

              {/* Coupon Form */}
              <div className="space-y-2 pt-2 border-t border-brand-border/20 text-left">
                {appliedOffer ? (
                  <div className="bg-[#FFF3EC] border border-[#F26A2E]/30 rounded-2xl p-3 flex items-center justify-between shadow-2xs">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-black uppercase px-2 py-0.5 bg-[#F26A2E] text-white rounded-md tracking-wider">
                          {appliedOffer.code}
                        </span>
                        <span className="text-xs font-bold text-brand-espresso">{appliedOffer.title}</span>
                      </div>
                      <span className="text-[9px] text-brand-success font-bold block">
                        ✓ Savings of ₹{discountAmount.toLocaleString('en-IN')} applied
                      </span>
                    </div>
                    <button
                      onClick={() => removeOffer()}
                      className="text-[10px] font-bold text-brand-sale hover:underline px-2 py-1"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <>
                    <span className="text-[9px] font-extrabold text-brand-warmGray tracking-wider block">
                      Do you have a discount coupon? Enter it to activate
                    </span>
                    
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Enter promo code (e.g. AD10)"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        className="flex-grow bg-brand-warmWhite border border-brand-border/50 px-3 py-2 rounded-xl text-xs outline-none focus:border-[#F26A2E] font-semibold uppercase"
                      />
                      <button
                        onClick={() => handleApplyPromo()}
                        disabled={isApplying}
                        className="px-4 py-2 bg-brand-softBeige/40 border border-brand-border/60 hover:bg-[#FFF3EC] hover:text-[#F26A2E] text-xs font-bold rounded-xl transition-all disabled:opacity-50"
                      >
                        {isApplying ? 'Checking...' : 'Apply'}
                      </button>
                    </div>

                    {promoError && (
                      <span className="text-[9px] font-bold text-brand-sale block">
                        ✕ {promoError}
                      </span>
                    )}

                    {availableOffers.length > 0 && (
                      <div className="pt-2 space-y-1.5">
                        <span className="text-[8px] font-extrabold text-brand-warmGray uppercase tracking-wider block">
                          Available Coupons:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {availableOffers.map((off) => (
                            <button
                              key={off.id}
                              onClick={() => handleApplyPromo(off.code)}
                              disabled={isApplying}
                              className="flex items-center gap-1.5 bg-[#FFF3EC] border border-[#F26A2E]/30 text-[#F26A2E] px-2.5 py-1 rounded-lg text-[9px] font-bold hover:bg-[#F26A2E] hover:text-white transition-all shadow-2xs"
                            >
                              <span>{off.code}</span>
                              <span className="text-[8px] opacity-80">
                                ({off.discount_percentage ? `${off.discount_percentage}% OFF` : `₹${off.discount_amount} OFF`})
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Place Order CTA - Rounded Pill Style */}
              <button
                onClick={() => router.push('/checkout')}
                className="w-full py-4 px-8 bg-[#F26A2E] text-brand-white text-xs font-bold tracking-[0.25em] uppercase hover:bg-[#F26A2E]/90 transition-all shadow-md rounded-full flex items-center justify-center gap-2 active:scale-98"
              >
                <span>PROCEED TO PAYMENT</span>
                <ArrowRight className="w-4 h-4" />
              </button>

            </div>

          </div>
        )}

        {/* Cross-Sell Carousel ("See also" section) */}
        {crossSellProducts.length > 0 && (
          <div className="space-y-6 pt-10 border-t border-brand-border/30 text-left">
            
            {/* Header */}
            <div className="flex items-center justify-between">
              <h2 className="font-display font-bold text-2xl text-brand-espresso tracking-tight">
                See also
              </h2>
              <span className="text-xs text-brand-warmGray font-medium">Curated selections</span>
            </div>

            {/* Grid layout */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {crossSellProducts.map((product) => {
                const inWishlist = isInWishlist(product.id);

                return (
                  <div
                    key={product.id}
                    onClick={() => {
                      const crossSlug = product.name.toLowerCase().replace(/ /g, '-');
                      router.push(product.department === 'numismatics' ? `/numismatics/${crossSlug}` : `/product/${crossSlug}`);
                    }}
                    className="flex flex-col text-left group cursor-pointer bg-brand-white border border-brand-border/20 rounded-2xl p-2 hover:shadow-md transition-shadow relative"
                  >
                    {/* Image viewport */}
                    <div className="w-full aspect-[3/4] bg-brand-softBeige/15 rounded-xl overflow-hidden relative flex items-center justify-center">
                      <img 
                        src={product.image || (product.images && product.images[0]) || ''} 
                        alt={product.name} 
                        className="w-full h-full object-cover transform group-hover:scale-102 transition-transform duration-500"
                        loading="lazy"
                        draggable={false}
                      />

                      {/* Top-left Discount badge */}
                      {product.discount && (
                        <div className="absolute top-2 left-2">
                          <span className="text-[8px] bg-brand-espresso text-brand-white font-extrabold tracking-widest px-2 py-0.5 rounded-md shadow-sm">
                            -{product.discount}%
                          </span>
                        </div>
                      )}

                      {/* Top-right Wishlist trigger */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleWishlist(product);
                        }}
                        className={`absolute top-2 right-2 p-1.5 rounded-full border transition-all shadow-sm ${
                          inWishlist
                            ? 'bg-brand-blush border-brand-dustyRose text-brand-dustyRose'
                            : 'bg-white/95 border-brand-border/60 text-brand-warmGray hover:bg-brand-white'
                        }`}
                      >
                        <Heart className={`w-3 h-3 ${inWishlist ? 'fill-brand-dustyRose text-brand-dustyRose' : ''}`} />
                      </button>
                    </div>

                    {/* Details */}
                    <div className="pt-3 pb-1 px-1 space-y-1">
                      <h4 className="font-sans font-bold text-xs text-brand-espresso line-clamp-1 group-hover:text-[#F26A2E] transition-colors">
                        {product.name}
                      </h4>
                      
                      <div className="flex items-baseline space-x-2 pt-1">
                        <span className="text-xs font-extrabold text-brand-espresso">
                          ₹{product.price.toLocaleString('en-IN')}
                        </span>
                        <span className="text-[10px] text-brand-warmGray line-through font-semibold">
                          ₹{product.mrp.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
