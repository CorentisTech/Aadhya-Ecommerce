"use client";

import React from 'react';
import { useApp } from '../../context/AppContext';
import { ProductVisual } from '../ui/ProductVisual';
import { X, Plus, Minus, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isCartOpen,
    setCartOpen,
    updateQuantity,
    removeFromCart,
    setPage,
  } = useApp();

  const subtotal = cart.reduce((total, item) => total + item.product.price * item.quantity, 0);
  const shippingThreshold = 5000;
  const isFreeShipping = subtotal >= shippingThreshold;

  const handleCheckoutClick = () => {
    setCartOpen(false);
    setPage('checkout');
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setCartOpen(false)}
          className="fixed inset-0 z-50 bg-brand-espresso/45 backdrop-blur-sm"
        >
          {/* Drawer Content */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            onClick={(e) => e.stopPropagation()} // Stop bubble up
            className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-brand-warmWhite shadow-2xl flex flex-col justify-between"
          >
            {/* Header */}
            <div className="p-6 border-b border-brand-border flex items-center justify-between">
              <div className="flex items-center space-x-2 text-brand-espresso">
                <ShoppingBag className="w-5 h-5 stroke-[1.5]" />
                <span className="font-display font-bold tracking-widest text-sm">SHOPPING BAG ({cart.length})</span>
              </div>
              <button
                onClick={() => setCartOpen(false)}
                className="p-1 text-brand-espresso hover:text-brand-dustyRose transition-colors rounded-full border border-brand-border/60"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Cart Items List */}
            <div className="flex-grow overflow-y-auto p-6 space-y-6">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-[#FFF3EC] flex items-center justify-center text-[#F26A2E] text-xl">
                    🛍
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-sm tracking-widest text-brand-espresso">YOUR BAG IS EMPTY</h3>
                    <p className="text-[10px] text-brand-warmGray font-semibold tracking-wider mt-1">
                      Add premium fashion or heritage coins to begin.
                    </p>
                  </div>
                  <button
                    onClick={() => setCartOpen(false)}
                    className="px-6 py-2 border border-[#F26A2E] text-xs font-bold tracking-widest text-[#F26A2E] hover:bg-[#F26A2E] hover:text-brand-white transition-colors"
                  >
                    CONTINUE SHOPPING
                  </button>
                </div>
              ) : (
                cart.map((item, index) => (
                  <div
                    key={`${item.product.id}-${item.selectedSize}-${item.selectedColor}-${index}`}
                    className="flex items-stretch gap-4 pb-6 border-b border-brand-border/40"
                  >
                    {/* Visual */}
                    <div className="w-20 h-24 bg-brand-white rounded-lg flex-shrink-0 flex items-center justify-center p-1 border border-brand-border/30">
                      <ProductVisual type={item.product.visualType} color={item.product.visualColor} pattern={item.product.visualPattern} />
                    </div>

                    {/* Details */}
                    <div className="flex-grow flex flex-col justify-between space-y-1">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-display font-bold text-xs text-brand-espresso line-clamp-1">
                            {item.product.name}
                          </h4>
                          <button
                            onClick={() => removeFromCart(item.product.id, item.selectedSize, item.selectedColor)}
                            aria-label="Remove item"
                            className="text-brand-warmGray hover:text-brand-sale transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-[9px] text-brand-warmGray font-semibold tracking-widest uppercase">
                          {item.product.category}
                        </p>
                        
                        {/* Selected Size / Color Attributes */}
                        {(item.selectedSize || item.selectedColor) && (
                          <div className="flex items-center gap-2 mt-1 text-[9px] text-brand-warmGray font-bold tracking-wider uppercase">
                            {item.selectedSize && <span>Size: {item.selectedSize}</span>}
                            {item.selectedColor && (
                              <span className="flex items-center gap-1">
                                Color:{' '}
                                <span
                                  className="w-2 h-2 rounded-full border border-brand-border inline-block"
                                  style={{ backgroundColor: item.selectedColor }}
                                />
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Quantity Selector & Price */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center border border-brand-border rounded">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1, item.selectedSize, item.selectedColor)}
                            className="p-1 hover:text-brand-dustyRose transition-colors text-brand-warmGray"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2 text-xs font-bold text-brand-espresso">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1, item.selectedSize, item.selectedColor)}
                            className="p-1 hover:text-brand-dustyRose transition-colors text-brand-warmGray"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <span className="text-xs font-bold text-brand-espresso">
                          ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer Summary (Sticky at bottom) */}
            {cart.length > 0 && (
              <div className="p-6 bg-brand-white border-t border-brand-border space-y-4">
                
                {/* Shipping alert */}
                <div className="bg-[#FFF3EC] border border-[#F9E1D3] p-3 rounded-lg text-center">
                  <p className="text-[10px] text-brand-espresso font-semibold tracking-wider">
                    {isFreeShipping ? (
                      <span className="text-brand-success font-bold">✓ YOU ARE ELIGIBLE FOR FREE SHIPPING</span>
                    ) : (
                      <span>
                        ADD{' '}
                        <strong className="font-extrabold text-brand-espresso">
                          ₹{(shippingThreshold - subtotal).toLocaleString('en-IN')}
                        </strong>{' '}
                        MORE FOR FREE SHIPPING
                      </span>
                    )}
                  </p>
                  {/* Progress bar */}
                  <div className="w-full bg-brand-border/40 h-1 rounded-full mt-2 overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ${isFreeShipping ? 'bg-brand-success' : 'bg-[#F26A2E]'}`}
                      style={{ width: `${Math.min((subtotal / shippingThreshold) * 100, 100)}%` }}
                    />
                  </div>
                </div>

                {/* Pricing subtotal */}
                <div className="space-y-1.5 font-semibold text-xs tracking-wider">
                  <div className="flex justify-between text-brand-warmGray">
                    <span>BAG SUBTOTAL</span>
                    <span>₹{subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-brand-warmGray">
                    <span>ESTIMATED DELIVERY</span>
                    <span>{isFreeShipping ? 'FREE' : '₹150'}</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-brand-espresso pt-2 border-t border-brand-border/30">
                    <span>TOTAL ORDER VALUE</span>
                    <span>₹{(subtotal + (isFreeShipping ? 0 : 150)).toLocaleString('en-IN')}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-1 gap-2 pt-2">
                  <button
                    onClick={handleCheckoutClick}
                    className="w-full py-3 bg-brand-espresso text-brand-white text-xs font-bold tracking-[0.2em] uppercase hover:bg-brand-espresso/90 transition-colors shadow-sm"
                  >
                    PROCEED TO SECURE CHECKOUT
                  </button>
                  <button
                    onClick={() => setCartOpen(false)}
                    className="w-full py-3 border border-brand-border text-brand-espresso text-xs font-bold tracking-[0.2em] uppercase hover:bg-brand-softBeige/40 transition-colors"
                  >
                    CONTINUE SHOPPING
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
