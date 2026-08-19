import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ProductVisual } from './ProductVisual';
import { ArrowLeft, CheckCircle, CreditCard } from 'lucide-react';
import { motion } from 'framer-motion';

export const CheckoutPage: React.FC = () => {
  const { cart, clearCart, setPage } = useApp();
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zip: '',
  });

  const subtotal = cart.reduce((total, item) => total + item.product.price * item.quantity, 0);
  const shipping = subtotal >= 5000 ? 0 : 150;
  const total = subtotal + shipping;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(true);
    clearCart();
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (success) {
    return (
      <div className="w-full min-h-screen bg-brand-warmWhite flex items-center justify-center py-20 px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-brand-white p-8 md:p-12 rounded-3xl border border-brand-border shadow-lg max-w-md text-center space-y-6"
        >
          <CheckCircle className="w-16 h-16 text-brand-success mx-auto stroke-[1.5]" />
          <div className="space-y-2">
            <h2 className="font-display font-bold text-2xl text-brand-espresso uppercase tracking-wider">
              ORDER PLACED SUCCESSFULLY
            </h2>
            <p className="text-xs text-brand-warmGray font-semibold tracking-wider">
              Your order ID is <strong className="text-brand-espresso">#AD-{Math.floor(100000 + Math.random() * 900000)}</strong>.
            </p>
          </div>
          <p className="text-xs text-brand-warmGray leading-relaxed font-semibold">
            Thank you for shopping at Aadhya. We have sent a confirmation email to your address with tracking details. Your treasures will arrive in 3-5 business days.
          </p>
          <button
            onClick={() => setPage('home')}
            className="w-full py-3 bg-brand-espresso text-brand-white text-xs font-bold tracking-[0.2em] uppercase hover:bg-brand-espresso/90 transition-colors rounded-xl"
          >
            CONTINUE SHOPPING
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-brand-warmWhite py-16 px-6 md:px-12 lg:px-24 text-brand-espresso">
      
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* Header Back Button */}
        <div className="flex items-center justify-between border-b border-brand-border pb-4">
          <button
            onClick={() => setPage('home')}
            className="flex items-center gap-1.5 text-xs font-bold tracking-widest text-brand-warmGray hover:text-brand-espresso transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>BACK TO SHOP</span>
          </button>
          <span className="font-display font-extrabold text-sm tracking-[0.25em]">SECURE CHECKOUT</span>
        </div>

        {cart.length === 0 ? (
          <div className="text-center py-20 bg-brand-white border border-brand-border/40 rounded-2xl">
            <p className="text-xs text-brand-warmGray font-bold tracking-widest uppercase mb-4">
              Your bag is empty. Please add products to check out.
            </p>
            <button
              onClick={() => setPage('home')}
              className="px-6 py-2 bg-brand-espresso text-brand-white text-xs font-bold tracking-widest rounded-lg"
            >
              GO SHOPPING
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Left Column: Address Form & Payment (7 cols) */}
            <div className="lg:col-span-7 space-y-8 bg-brand-white p-6 md:p-8 border border-brand-border/60 rounded-3xl">
              
              <div className="space-y-4">
                <h2 className="text-xs font-bold tracking-[0.2em] text-brand-espresso border-b border-brand-border pb-2">
                  1. SHIPPING INFORMATION
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5 col-span-2">
                    <label className="text-[9px] font-bold text-brand-warmGray tracking-wider block">FULL NAME</label>
                    <input
                      required
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleTextChange}
                      className="w-full bg-brand-warmWhite border border-brand-border/80 p-3 rounded-lg text-xs outline-none focus:border-brand-espresso font-semibold"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-bold text-brand-warmGray tracking-wider block">EMAIL ADDRESS</label>
                    <input
                      required
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleTextChange}
                      className="w-full bg-brand-warmWhite border border-brand-border/80 p-3 rounded-lg text-xs outline-none focus:border-brand-espresso font-semibold"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-bold text-brand-warmGray tracking-wider block">PHONE NUMBER</label>
                    <input
                      required
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleTextChange}
                      className="w-full bg-brand-warmWhite border border-brand-border/80 p-3 rounded-lg text-xs outline-none focus:border-brand-espresso font-semibold"
                    />
                  </div>
                  <div className="space-y-1.5 col-span-2">
                    <label className="text-[9px] font-bold text-brand-warmGray tracking-wider block">SHIPPING ADDRESS</label>
                    <input
                      required
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleTextChange}
                      className="w-full bg-brand-warmWhite border border-brand-border/80 p-3 rounded-lg text-xs outline-none focus:border-brand-espresso font-semibold"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-bold text-brand-warmGray tracking-wider block">CITY / REGION</label>
                    <input
                      required
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleTextChange}
                      className="w-full bg-brand-warmWhite border border-brand-border/80 p-3 rounded-lg text-xs outline-none focus:border-brand-espresso font-semibold"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-bold text-brand-warmGray tracking-wider block">PINCODE / POSTCODE</label>
                    <input
                      required
                      type="text"
                      name="zip"
                      value={formData.zip}
                      onChange={handleTextChange}
                      className="w-full bg-brand-warmWhite border border-brand-border/80 p-3 rounded-lg text-xs outline-none focus:border-brand-espresso font-semibold"
                    />
                  </div>
                </div>
              </div>

              {/* Payment selection */}
              <div className="space-y-4 pt-4 border-t border-brand-border/40">
                <h2 className="text-xs font-bold tracking-[0.2em] text-brand-espresso border-b border-brand-border pb-2 flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-brand-warmGray" />
                  <span>2. PAYMENT METHOD</span>
                </h2>
                
                {/* Visual payment options tabs */}
                <div className="grid grid-cols-3 gap-3 text-center text-[10px] font-bold tracking-widest">
                  <div className="p-4 border border-brand-espresso bg-brand-softBeige/20 rounded-xl cursor-pointer">
                    UPI / QR
                  </div>
                  <div className="p-4 border border-brand-border rounded-xl cursor-not-allowed opacity-50">
                    CARD
                  </div>
                  <div className="p-4 border border-brand-border rounded-xl cursor-not-allowed opacity-50">
                    NET BANK
                  </div>
                </div>
              </div>

            </div>

            {/* Right Column: Order Summary (5 cols) */}
            <div className="lg:col-span-5 bg-brand-white border border-brand-border/60 p-6 md:p-8 rounded-3xl sticky top-28 space-y-6">
              <h2 className="text-xs font-bold tracking-[0.2em] text-brand-espresso border-b border-brand-border pb-2">
                ORDER SUMMARY
              </h2>

              {/* Order items scroll list */}
              <div className="max-h-[220px] overflow-y-auto space-y-4 pr-2">
                {cart.map((item, index) => (
                  <div key={index} className="flex gap-3 items-center pb-3 border-b border-brand-border/30">
                    <div className="w-10 h-12 bg-brand-warmWhite rounded flex-shrink-0 flex items-center justify-center p-0.5 border border-brand-border/40">
                      <ProductVisual type={item.product.visualType} color={item.product.visualColor} pattern={item.product.visualPattern} />
                    </div>
                    <div className="flex-grow text-left space-y-0.5">
                      <h4 className="font-display font-bold text-[11px] text-brand-espresso line-clamp-1">{item.product.name}</h4>
                      <p className="text-[8px] text-brand-warmGray font-semibold tracking-wider">
                        QTY: {item.quantity} {item.selectedSize && `• SIZE: ${item.selectedSize}`}
                      </p>
                    </div>
                    <span className="text-[11px] font-bold text-brand-espresso">
                      ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>

              {/* Pricing totals */}
              <div className="space-y-2 border-t border-brand-border/40 pt-4 text-xs font-semibold tracking-wider text-brand-warmGray">
                <div className="flex justify-between">
                  <span>ITEMS TOTAL</span>
                  <span>₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span>SHIPPING & HANDLING</span>
                  <span>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-brand-espresso border-t border-brand-border/30 pt-3">
                  <span>TOTAL BILL</span>
                  <span>₹{total.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Place Order CTA */}
              <button
                type="submit"
                className="w-full py-4 bg-brand-espresso text-brand-white text-xs font-bold tracking-[0.25em] uppercase hover:bg-brand-espresso/90 transition-colors shadow-md rounded-xl"
              >
                PLACE SECURE ORDER (₹{total.toLocaleString('en-IN')})
              </button>

            </div>

          </form>
        )}

      </div>

    </div>
  );
};
