"use client";

import React, { useState, useEffect } from 'react';
import { useApp, UserDetails } from '../../context/AppContext';
import { ProductVisual } from './ProductVisual';
import { 
  ArrowLeft, 
  CheckCircle, 
  CreditCard, 
  Building, 
  Smartphone, 
  DollarSign, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  Lock, 
  X, 
  ArrowUp,
  ChevronDown,
  Mail
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { NavigationControls } from './NavigationControls';

interface DragToPaymentButtonProps {
  onProceed: () => void;
  isOpen: boolean;
}

const DragToPaymentButton: React.FC<DragToPaymentButtonProps> = ({ onProceed, isOpen }) => {
  type DragState = 'idle' | 'dragging' | 'completed' | 'cancelled' | 'resetting';
  const [dragState, setDragState] = useState<DragState>('idle');
  const [resetKey, setResetKey] = useState(0);

  // Automatically reset position & state when payment modal closes or opens
  useEffect(() => {
    if (!isOpen) {
      setDragState('resetting');
      const timer = setTimeout(() => {
        setDragState('idle');
        setResetKey(prev => prev + 1);
      }, 150);
      return () => clearTimeout(timer);
    } else {
      setDragState('completed');
    }
  }, [isOpen]);

  const handleDragStart = () => {
    setDragState('dragging');
  };

  const handleDragEnd = (event: any, info: any) => {
    if (info.offset.y < -30 || info.velocity.y < -150) {
      setDragState('completed');
      onProceed();
    } else {
      setDragState('cancelled');
      setTimeout(() => {
        setDragState('idle');
        setResetKey(prev => prev + 1);
      }, 200);
    }
  };

  const handleClick = () => {
    setDragState('completed');
    onProceed();
  };

  return (
    <div className="relative pt-2 select-none">
      <div className="flex flex-col items-center space-y-1 mb-2">
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          className="text-[#F26A2E] text-base"
        >
          👆
        </motion.div>
        <span className="text-[8px] font-bold text-[#F26A2E] tracking-[0.25em] uppercase">
          Drag up to pay
        </span>
      </div>

      <div className="h-16 bg-brand-white rounded-full border-2 border-dashed border-[#F26A2E]/50 relative overflow-hidden flex items-center justify-center p-1.5 shadow-sm">
        <motion.div
          key={resetKey}
          drag="y"
          dragConstraints={{ top: -75, bottom: 0 }}
          dragElastic={0.1}
          dragSnapToOrigin={true}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onClick={handleClick}
          animate={
            dragState === 'idle' || dragState === 'resetting' || dragState === 'cancelled'
              ? { y: 0 }
              : undefined
          }
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="absolute inset-x-1.5 h-[50px] bg-[#F26A2E] rounded-full flex items-center justify-center cursor-pointer text-brand-white text-xs font-bold tracking-[0.25em] shadow-md touch-none"
          whileTap={{ scale: 0.98 }}
        >
          <span className="flex items-center gap-2">
            <ArrowUp className="w-3.5 h-3.5 animate-bounce" />
            <span>
              {dragState === 'completed' ? 'PROCESSING PAYMENT...' : 'DRAG UP FOR PAYMENT'}
            </span>
          </span>
        </motion.div>
      </div>
    </div>
  );
};

export const CheckoutPage: React.FC = () => {
  const { cart, clearCart, setPage, isLoggedIn, loginUser, registerUser, user } = useApp();
  const [success, setSuccess] = useState(false);
  const [isPaymentModalOpen, setPaymentModalOpen] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  
  // Checkout login inline panel states
  const [checkoutLoginScreen, setCheckoutLoginScreen] = useState<'landing' | 'email' | 'register'>('landing');
  const [checkoutEmail, setCheckoutEmail] = useState('');
  const [checkoutOtp, setCheckoutOtp] = useState('');
  const [checkoutOtpSent, setCheckoutOtpSent] = useState(false);
  const [checkoutOtpError, setCheckoutOtpError] = useState(false);
  const [checkoutRegForm, setCheckoutRegForm] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    address: 'Flat 402, Royal Palms Residency, MG Road',
    zip: '411001',
    state: 'Maharashtra',
    city: 'Pune',
    landmark: 'Opposite Grand Mall',
    streetName: 'MG Road',
    otherPhone: '',
    avatar: 'male' as 'male' | 'female',
  });

  // Mock inputs inside payment methods
  const [cardDetails, setCardDetails] = useState({ number: '', expiry: '', cvv: '', name: '' });
  const [upiId, setUpiId] = useState('');
  const [selectedBank, setSelectedBank] = useState('');

  // Pre-fill form data to match the uploaded screenshot
  const [formData, setFormData] = useState({
    email: 'ananya.sharma@example.com',
    name: 'Ananya Sharma',
    address: 'Flat 402, Royal Palms Residency, MG Road',
    landmark: 'Opposite Grand Mall',
    city: 'Pune',
    state: 'Maharashtra',
    zip: '411001',
    country: 'India',
  });

  // Automatically pre-fill shipping address when user logs in
  React.useEffect(() => {
    if (user) {
      setFormData({
        email: user.email,
        name: `${user.firstName} ${user.lastName}`,
        address: user.streetName || user.address,
        landmark: user.landmark || '',
        city: user.city,
        state: user.state,
        zip: user.zip,
        country: 'India',
      });
    }
  }, [user]);

  const subtotal = cart.reduce((total, item) => total + item.product.price * item.quantity, 0);
  const shippingThreshold = 5000;
  const isFreeShipping = subtotal >= shippingThreshold;
  const shippingCost = isFreeShipping ? 0 : 150;
  
  // Dynamic 10% Festive Discount
  const discount = Math.round(subtotal * 0.1);
  const total = subtotal + shippingCost - discount;

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePayNow = () => {
    setPaymentModalOpen(false);
    setSuccess(true);
    clearCart();
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
            className="w-full py-3 bg-[#F26A2E] text-brand-white text-xs font-bold tracking-[0.2em] uppercase hover:bg-[#F26A2E]/90 transition-colors rounded-xl"
          >
            CONTINUE SHOPPING
          </button>
        </motion.div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="w-full min-h-screen bg-[#FCFAF7] flex items-center justify-center py-12 px-4 select-none text-left">
        <div className="bg-white w-full max-w-sm rounded-3xl p-6 md:p-8 shadow-xl border border-brand-border/30 text-center space-y-6">
          
          {/* Brand Logo Header */}
          <div className="space-y-1">
            <h1 className="font-display font-bold text-3xl text-[#1C1816] tracking-widest uppercase">
              AADHYA
            </h1>
            <span className="text-[9px] font-bold text-brand-warmGray tracking-[0.25em] uppercase block">
              Secure Checkout Login
            </span>
          </div>

          {checkoutLoginScreen === 'landing' && (
            <div className="space-y-5">
              <p className="text-[10px] text-brand-warmGray font-bold tracking-wider leading-relaxed">
                You must login or create an account to proceed to payment.
              </p>
              
              <div className="space-y-2 pt-2">
                <button 
                  onClick={() => setCheckoutLoginScreen('email')}
                  className="w-full py-3 bg-brand-white border border-brand-border/60 text-brand-espresso text-[10px] font-extrabold tracking-widest uppercase hover:bg-brand-softBeige/20 rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  <Mail className="w-3.5 h-3.5 text-[#F26A2E]" />
                  <span>Continue with Email</span>
                </button>
                <button 
                  onClick={() => loginUser("ananya.sharma@example.com")}
                  className="w-full py-3 bg-[#F26A2E] text-white text-[10px] font-extrabold tracking-widest uppercase hover:opacity-95 rounded-xl transition-all shadow-sm"
                >
                  Quick Guest Checkout
                </button>
              </div>
            </div>
          )}

          {checkoutLoginScreen === 'email' && (
            <div className="space-y-5">
              <h2 className="font-display font-bold text-lg text-brand-espresso">Welcome Back</h2>
              
              {!checkoutOtpSent ? (
                <form onSubmit={(e) => { e.preventDefault(); setCheckoutOtpSent(true); }} className="space-y-4">
                  <div className="space-y-1.5 text-left">
                    <label className="text-[9px] font-bold text-brand-warmGray uppercase tracking-wider block">Email Address</label>
                    <input
                      required
                      type="email"
                      placeholder="ananya.sharma@example.com"
                      value={checkoutEmail}
                      onChange={(e) => setCheckoutEmail(e.target.value)}
                      className="w-full bg-[#FCFAF7] border border-brand-border/60 p-3 rounded-xl text-xs outline-none focus:border-[#F26A2E] font-semibold text-brand-espresso"
                    />
                  </div>
                  <button type="submit" className="w-full py-3 bg-[#F26A2E] text-white text-[10px] font-extrabold tracking-widest uppercase hover:opacity-95 rounded-xl">
                    Send Verification OTP
                  </button>
                </form>
              ) : (
                <form onSubmit={(e) => {
                  e.preventDefault();
                  if (checkoutOtp === '1234') {
                    setCheckoutOtpError(false);
                    // Open register form to let them enter name etc.
                    setCheckoutLoginScreen('register');
                  } else {
                    setCheckoutOtpError(true);
                  }
                }} className="space-y-4">
                  <div className="text-left bg-[#FFF3EC] p-3 rounded-xl border border-[#F9E1D3]/50">
                    <p className="text-[9px] font-bold text-[#F26A2E] tracking-wider uppercase">
                      ✓ OTP sent! Enter code "1234" to verify.
                    </p>
                  </div>
                  <div className="space-y-1 text-left">
                    <label className="text-[9px] font-bold text-brand-warmGray uppercase tracking-wider block">OTP Verification Code</label>
                    <input
                      required
                      type="text"
                      placeholder="Enter 4-digit code"
                      maxLength={4}
                      value={checkoutOtp}
                      onChange={(e) => setCheckoutOtp(e.target.value)}
                      className="w-full bg-[#FCFAF7] border border-brand-border/60 p-3 rounded-xl text-xs outline-none focus:border-[#F26A2E] font-semibold text-center tracking-[0.4em]"
                    />
                  </div>
                  {checkoutOtpError && <span className="text-[9px] font-bold text-brand-sale block">✕ Invalid Code. Use "1234".</span>}
                  <button type="submit" className="w-full py-3 bg-brand-espresso text-white text-[10px] font-extrabold tracking-widest uppercase hover:opacity-95 rounded-xl">
                    Verify Code
                  </button>
                </form>
              )}
            </div>
          )}

          {checkoutLoginScreen === 'register' && (
            <form onSubmit={(e) => {
              e.preventDefault();
              const newUser: UserDetails = {
                email: checkoutEmail,
                firstName: checkoutRegForm.firstName,
                lastName: checkoutRegForm.lastName,
                phone: checkoutRegForm.phone,
                address: `${checkoutRegForm.streetName}, ${checkoutRegForm.landmark ? checkoutRegForm.landmark + ', ' : ''}${checkoutRegForm.city}, ${checkoutRegForm.state} - ${checkoutRegForm.zip}`,
                zip: checkoutRegForm.zip,
                state: checkoutRegForm.state,
                city: checkoutRegForm.city,
                landmark: checkoutRegForm.landmark,
                streetName: checkoutRegForm.streetName,
                otherPhone: checkoutRegForm.otherPhone,
                avatar: checkoutRegForm.avatar
              };
              registerUser(newUser);
            }} className="space-y-3.5 text-left max-h-[70vh] overflow-y-auto pr-1">
              <h2 className="font-display font-bold text-lg text-[#1C1816] text-center">Complete Registration</h2>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[8px] font-bold text-[#383230] block">First Name</label>
                  <input required type="text" value={checkoutRegForm.firstName} onChange={(e) => setCheckoutRegForm({ ...checkoutRegForm, firstName: e.target.value })} className="w-full bg-[#FCFAF7] border border-brand-border/60 p-2.5 rounded-lg text-xs outline-none focus:border-[#F26A2E]" />
                </div>
                <div className="space-y-1">
                  <label className="text-[8px] font-bold text-[#383230] block">Last Name</label>
                  <input required type="text" value={checkoutRegForm.lastName} onChange={(e) => setCheckoutRegForm({ ...checkoutRegForm, lastName: e.target.value })} className="w-full bg-[#FCFAF7] border border-brand-border/60 p-2.5 rounded-lg text-xs outline-none focus:border-[#F26A2E]" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[8px] font-bold text-[#383230] block">Phone Number</label>
                <input required type="tel" value={checkoutRegForm.phone} onChange={(e) => setCheckoutRegForm({ ...checkoutRegForm, phone: e.target.value })} className="w-full bg-[#FCFAF7] border border-brand-border/60 p-2.5 rounded-lg text-xs outline-none focus:border-[#F26A2E]" />
              </div>
              <button type="submit" className="w-full py-3 bg-[#F26A2E] text-white text-[10px] font-extrabold tracking-widest uppercase rounded-xl">
                Register & Checkout
              </button>
            </form>
          )}

        </div>
      </div>
    );
  }

  // Stacking properties of payment wallet cards
  const paymentCards = [
    {
      id: 'net-banking',
      title: 'Net Banking',
      amount: `₹${Math.floor(total).toLocaleString('en-IN')}`,
      bgColor: 'bg-[#802611]', // Deep auburn red
      icon: Building,
      zIndex: 10,
      yOffset: 0,
    },
    {
      id: 'upi',
      title: 'UPI & QR Pay',
      amount: `₹${Math.floor(total).toLocaleString('en-IN')}`,
      bgColor: 'bg-[#9C7E12]', // Olive Gold
      icon: Smartphone,
      zIndex: 20,
      yOffset: 45,
    },
    {
      id: 'card',
      title: 'Debit / Credit Card',
      amount: `₹${Math.floor(total).toLocaleString('en-IN')}`,
      bgColor: 'bg-[#C45E2E]', // Terracotta Orange
      icon: CreditCard,
      zIndex: 30,
      yOffset: 90,
    },
    {
      id: 'cod',
      title: 'Cash on Delivery',
      amount: `₹${Math.floor(total).toLocaleString('en-IN')}`,
      bgColor: 'bg-[#2A2624]', // Charcoal espresso
      icon: DollarSign,
      zIndex: 40,
      yOffset: 135,
    }
  ];

  return (
    <div className="w-full max-w-full min-h-screen bg-[#FCFAF7] py-10 px-4 md:px-12 lg:px-24 text-brand-espresso text-left">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header Navigation */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-2 border-b border-brand-border/40 gap-3">
          <NavigationControls className="py-0" />
          
          <div className="flex items-center gap-2 text-brand-warmGray text-[10px] font-bold tracking-widest uppercase">
            <Lock className="w-3.5 h-3.5 text-[#F26A2E]" />
            <span>256-Bit SSL Secure Checkout</span>
          </div>
        </div>

        {cart.length === 0 ? (
          <div className="text-center py-20 bg-brand-white border border-brand-border/40 rounded-2xl">
            <p className="text-xs text-brand-warmGray font-bold tracking-widest uppercase mb-4">
              Your bag is empty. Please add products to check out.
            </p>
            <button
              onClick={() => setPage('home')}
              className="px-6 py-2 bg-[#F26A2E] text-brand-white text-xs font-bold tracking-widest rounded-lg"
            >
              GO SHOPPING
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Form Details & Drag CTA (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Elegant Title */}
              <h1 className="font-display font-bold text-4xl text-brand-espresso tracking-tight">
                Checkout
              </h1>

              {/* Stepper Indicators */}
              <div className="flex items-center space-x-6 text-xs font-semibold tracking-wider pb-2">
                <div className="flex items-center space-x-2">
                  <span className="w-5 h-5 rounded-full bg-[#F26A2E] text-white flex items-center justify-center font-bold text-[10px]">1</span>
                  <span className="text-[#F26A2E]">Shipping</span>
                </div>
                <div className="flex items-center space-x-2 text-brand-warmGray/60">
                  <span className="w-5 h-5 rounded-full bg-brand-border/40 text-brand-warmGray flex items-center justify-center font-bold text-[10px]">2</span>
                  <span>Payment</span>
                </div>
                <div className="flex items-center space-x-2 text-brand-warmGray/60">
                  <span className="w-5 h-5 rounded-full bg-brand-border/40 text-brand-warmGray flex items-center justify-center font-bold text-[10px]">3</span>
                  <span>Review</span>
                </div>
              </div>

              {/* Address Form */}
              <div className="bg-brand-white p-6 md:p-8 border border-brand-border/40 rounded-3xl space-y-5 shadow-sm">
                
                {/* Contact Info */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-brand-espresso tracking-widest uppercase block">
                    Contact Information
                  </label>
                  <input
                    required
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleTextChange}
                    className="w-full bg-brand-warmWhite border border-brand-border/50 p-3 rounded-xl text-xs outline-none focus:border-[#F26A2E] font-semibold text-brand-espresso"
                    placeholder="Enter email address"
                  />
                </div>

                {/* Shipping address details */}
                <div className="space-y-4">
                  <label className="text-[10px] font-bold text-brand-espresso tracking-widest uppercase block border-b border-brand-border/30 pb-1">
                    Shipping Address
                  </label>
                  
                  <div className="space-y-3">
                    {/* Full Name */}
                    <input
                      required
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleTextChange}
                      className="w-full bg-brand-warmWhite border border-brand-border/50 p-3 rounded-xl text-xs outline-none focus:border-[#F26A2E] font-semibold text-brand-espresso"
                      placeholder="Full Name"
                    />

                    {/* Address Line 1 */}
                    <input
                      required
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleTextChange}
                      className="w-full bg-brand-warmWhite border border-brand-border/50 p-3 rounded-xl text-xs outline-none focus:border-[#F26A2E] font-semibold text-brand-espresso"
                      placeholder="Address Line 1"
                    />

                    {/* Landmark / Line 2 */}
                    <input
                      type="text"
                      name="landmark"
                      value={formData.landmark}
                      onChange={handleTextChange}
                      className="w-full bg-brand-warmWhite border border-brand-border/50 p-3 rounded-xl text-xs outline-none focus:border-[#F26A2E] font-semibold text-brand-espresso"
                      placeholder="Landmark / Area (e.g. Opposite Grand Mall)"
                    />

                    {/* City & State */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        required
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleTextChange}
                        className="w-full bg-brand-warmWhite border border-brand-border/50 p-3 rounded-xl text-xs outline-none focus:border-[#F26A2E] font-semibold text-brand-espresso"
                        placeholder="City"
                      />
                      
                      <div className="relative">
                        <select
                          name="state"
                          value={formData.state}
                          onChange={handleTextChange}
                          className="w-full bg-brand-warmWhite border border-brand-border/50 p-3 rounded-xl text-xs outline-none focus:border-[#F26A2E] font-semibold text-brand-espresso appearance-none"
                        >
                          <option value="Maharashtra">Maharashtra</option>
                          <option value="Delhi">Delhi</option>
                          <option value="Karnataka">Karnataka</option>
                          <option value="Tamil Nadu">Tamil Nadu</option>
                          <option value="Uttar Pradesh">Uttar Pradesh</option>
                        </select>
                        <ChevronDown className="w-4 h-4 text-brand-warmGray absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>

                    {/* Zip & Country */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        required
                        type="text"
                        name="zip"
                        value={formData.zip}
                        onChange={handleTextChange}
                        className="w-full bg-brand-warmWhite border border-brand-border/50 p-3 rounded-xl text-xs outline-none focus:border-[#F26A2E] font-semibold text-brand-espresso"
                        placeholder="Pincode / Zipcode"
                      />
                      
                      <div className="relative">
                        <select
                          name="country"
                          value={formData.country}
                          onChange={handleTextChange}
                          className="w-full bg-brand-warmWhite border border-brand-border/50 p-3 rounded-xl text-xs outline-none focus:border-[#F26A2E] font-semibold text-brand-espresso appearance-none"
                        >
                          <option value="India">India</option>
                          <option value="United States">United States</option>
                          <option value="United Kingdom">United Kingdom</option>
                        </select>
                        <ChevronDown className="w-4 h-4 text-brand-warmGray absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* State-Safe Drag to Payment CTA */}
              <DragToPaymentButton
                onProceed={() => setPaymentModalOpen(true)}
                isOpen={isPaymentModalOpen}
              />

            </div>

            {/* Right Column: Order Summary (5 cols) */}
            <div className="lg:col-span-5 bg-brand-white border border-brand-border/30 p-6 md:p-8 rounded-3xl space-y-6 shadow-sm">
              <h2 className="font-display font-bold text-lg text-brand-espresso border-b border-brand-border/30 pb-2">
                Order Summary
              </h2>

              {/* Order items lists with real images */}
              <div className="max-h-[260px] overflow-y-auto space-y-4 pr-1">
                {cart.map((item, index) => (
                  <div key={index} className="flex gap-4 items-center pb-4 border-b border-brand-border/20">
                    <div className="w-14 h-16 bg-brand-softBeige/10 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center border border-brand-border/30">
                      <img 
                        src={item.product.image} 
                        alt={item.product.name} 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                    
                    <div className="flex-grow text-left space-y-1">
                      <h4 className="font-sans font-bold text-xs text-brand-espresso line-clamp-1">
                        {item.product.name}
                      </h4>
                      <p className="text-[9px] text-brand-warmGray font-bold tracking-wider uppercase">
                        {item.selectedColor && `Color: ${item.selectedColor.toUpperCase()}`} {item.selectedSize && `• Size: ${item.selectedSize}`}
                      </p>
                      <p className="text-[9px] text-brand-warmGray font-bold">
                        QTY: {item.quantity}
                      </p>
                    </div>

                    <span className="text-xs font-extrabold text-brand-espresso">
                      ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>

              {/* Totals Summary */}
              <div className="space-y-2.5 border-t border-brand-border/30 pt-4 text-[10px] font-bold tracking-widest text-brand-warmGray">
                <div className="flex justify-between">
                  <span>SUBTOTAL</span>
                  <span>₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span>INSURED EXPRESS SHIPPING</span>
                  <span>{shippingCost === 0 ? '₹0.00 (Free)' : `₹${shippingCost}`}</span>
                </div>
                <div className="flex justify-between text-brand-success font-extrabold">
                  <span>FESTIVE SPECIAL DISCOUNT</span>
                  <span>-₹{discount.toLocaleString('en-IN')}</span>
                </div>
                
                <div className="flex justify-between text-sm font-bold text-brand-espresso border-t border-brand-border/30 pt-4">
                  <span className="font-display font-bold">TOTAL</span>
                  <span className="text-[#F26A2E] text-lg font-extrabold">
                    ₹{total.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Checkout Badge overlays */}
              <div className="grid grid-cols-3 gap-2 pt-4 border-t border-brand-border/30 text-center">
                <div className="flex flex-col items-center space-y-1">
                  <ShieldCheck className="w-5 h-5 text-[#F26A2E] stroke-[1.5]" />
                  <span className="text-[7px] font-extrabold text-brand-espresso uppercase tracking-wider">Secure Checkout</span>
                </div>
                <div className="flex flex-col items-center space-y-1">
                  <Truck className="w-5 h-5 text-[#F26A2E] stroke-[1.5]" />
                  <span className="text-[7px] font-extrabold text-brand-espresso uppercase tracking-wider">Free Insured Post</span>
                </div>
                <div className="flex flex-col items-center space-y-1">
                  <RotateCcw className="w-5 h-5 text-[#F26A2E] stroke-[1.5]" />
                  <span className="text-[7px] font-extrabold text-brand-espresso uppercase tracking-wider">Easy Returns</span>
                </div>
              </div>

            </div>

          </div>
        )}

      </div>

      {/* Stacked wallet popup modal */}
      <AnimatePresence>
        {isPaymentModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              setPaymentModalOpen(false);
              setSelectedCard(null);
            }}
            className="fixed inset-0 z-50 bg-brand-espresso/60 backdrop-blur-md flex items-center justify-center p-4 select-none"
          >
            {/* Modal Body (Centered, zero empty gaps) */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: 'spring', damping: 26, stiffness: 240 }}
              className="bg-white w-full max-w-md rounded-3xl p-6 sm:p-7 relative shadow-2xl border border-brand-border/30 text-center flex flex-col items-center justify-center overflow-hidden my-auto"
              onClick={(e) => e.stopPropagation()}
            >
              
              {/* Close/Cut Button - Positioned top-right without overlapping text */}
              <button
                onClick={() => {
                  setPaymentModalOpen(false);
                  setSelectedCard(null);
                }}
                className="absolute top-4 right-4 text-brand-espresso p-2 hover:bg-brand-softBeige rounded-full transition-colors border border-brand-border/40 z-50 shadow-xs"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Header Title */}
              <div className="space-y-1 pt-1 pb-3 text-center w-full px-4">
                <h3 className="font-display font-bold text-xl sm:text-2xl text-brand-espresso leading-tight">
                  Choose Payment Method
                </h3>
                <p className="text-[10px] text-brand-warmGray font-bold tracking-wider">
                  Tap or click any card in your wallet to proceed
                </p>
              </div>

              {/* Stacked Wallet container (Centered, zero empty gaps) */}
              <div className="relative h-[290px] w-full flex flex-col justify-end my-2 select-none">
                
                {paymentCards.map((card) => {
                  const Icon = card.icon;
                  const isHovered = hoveredCard === card.id;
                  const isSelected = selectedCard === card.id;
                  const isOtherSelected = selectedCard !== null && !isSelected;

                  // Smooth medium sensitivity offsets
                  let yVal = card.yOffset;
                  let zVal = card.zIndex;

                  if (isSelected) {
                    yVal = -125; // Pop up to center of modal
                    zVal = 100;
                  } else if (isHovered && !selectedCard) {
                    yVal = card.yOffset - 22; // Smooth medium hover jump
                    zVal = 80;
                  }

                  return (
                    <motion.div
                      key={card.id}
                      onClick={() => {
                        setSelectedCard(selectedCard === card.id ? null : card.id);
                      }}
                      onMouseEnter={() => !selectedCard && setHoveredCard(card.id)}
                      onMouseLeave={() => !selectedCard && setHoveredCard(null)}
                      animate={{
                        y: yVal,
                        scale: isSelected ? 1.04 : isHovered && !selectedCard ? 1.015 : 1,
                        filter: isOtherSelected ? 'blur(4px)' : 'blur(0px)',
                        opacity: isOtherSelected ? 0.35 : 1,
                        zIndex: zVal,
                      }}
                      transition={{ type: 'spring', damping: 28, stiffness: 180 }}
                      className={`absolute left-0 right-0 h-[175px] rounded-2xl p-4 flex flex-col justify-between text-white cursor-pointer shadow-xl border border-white/15 transition-all ${card.bgColor}`}
                    >
                      {/* Top Header Row */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Icon className="w-5 h-5 stroke-[1.5]" />
                          <span className="font-display text-[12px] sm:text-[13px] font-bold tracking-wider uppercase">
                            {card.title}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="font-sans text-[13px] font-extrabold">
                            {card.amount}
                          </span>
                          {/* Close/Deselect cut option on popped-up selected card */}
                          {isSelected && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedCard(null);
                              }}
                              className="p-1 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors ml-1"
                              aria-label="Deselect card"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Card Middle Mock Chip & dynamic layout inputs */}
                      <div className="flex-grow flex flex-col justify-center pt-2">
                        {isSelected ? (
                          <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3, delay: 0.1 }}
                            className="w-full space-y-2 text-left"
                            onClick={(e) => e.stopPropagation()} // Keep focus on inputs
                          >
                            {/* Option 1: Card fields */}
                            {card.id === 'card' && (
                              <div className="space-y-1.5 text-[8px] font-bold text-white/80">
                                <input
                                  type="text"
                                  placeholder="Cardholder Name"
                                  value={cardDetails.name}
                                  onChange={(e) => setCardDetails({ ...cardDetails, name: e.target.value })}
                                  className="w-full bg-white/15 border border-white/20 p-2 rounded-lg text-[9px] text-white placeholder-white/50 outline-none"
                                />
                                <div className="grid grid-cols-3 gap-1.5">
                                  <input
                                    type="text"
                                    placeholder="Card Number"
                                    value={cardDetails.number}
                                    onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value })}
                                    className="col-span-2 bg-white/15 border border-white/20 p-2 rounded-lg text-[9px] text-white placeholder-white/50 outline-none"
                                  />
                                  <input
                                    type="text"
                                    placeholder="CVV"
                                    value={cardDetails.cvv}
                                    onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                                    className="bg-white/15 border border-white/20 p-2 rounded-lg text-[9px] text-white placeholder-white/50 outline-none"
                                  />
                                </div>
                              </div>
                            )}

                            {/* Option 2: UPI fields */}
                            {card.id === 'upi' && (
                              <div className="space-y-1.5 text-center flex flex-col items-center">
                                <div className="w-9 h-9 bg-white/25 rounded p-1 flex flex-col justify-between">
                                  <div className="flex justify-between"><div className="w-1.5 h-1.5 bg-white rounded-xs"/><div className="w-1.5 h-1.5 bg-white rounded-xs"/></div>
                                  <div className="flex justify-between"><div className="w-1.5 h-1.5 bg-white rounded-xs"/><div className="w-1.5 h-1.5 bg-white rounded-xs"/></div>
                                </div>
                                <input
                                  type="text"
                                  placeholder="Enter UPI ID (e.g. name@upi)"
                                  value={upiId}
                                  onChange={(e) => setUpiId(e.target.value)}
                                  className="w-full bg-white/15 border border-white/20 p-1.5 rounded-lg text-[9px] text-white placeholder-white/50 outline-none text-center"
                                />
                              </div>
                            )}

                            {/* Option 3: Netbanking banks dropdown */}
                            {card.id === 'net-banking' && (
                              <div className="space-y-1.5">
                                <select
                                  value={selectedBank}
                                  onChange={(e) => setSelectedBank(e.target.value)}
                                  className="w-full bg-white/15 border border-white/20 p-2 rounded-lg text-[9px] text-white outline-none select-bank"
                                >
                                  <option value="" className="text-brand-espresso">Select your Bank</option>
                                  <option value="sbi" className="text-brand-espresso">State Bank of India</option>
                                  <option value="hdfc" className="text-brand-espresso">HDFC Bank</option>
                                  <option value="icici" className="text-brand-espresso">ICICI Bank</option>
                                  <option value="axis" className="text-brand-espresso">Axis Bank</option>
                                </select>
                              </div>
                            )}

                            {/* Option 4: COD details */}
                            {card.id === 'cod' && (
                              <p className="text-[8px] font-semibold text-center text-white/90 leading-tight">
                                Handover cash or scan QR code on delivery. Insured package dispatch.
                              </p>
                            )}

                          </motion.div>
                        ) : (
                          /* Mock Card Chip layout */
                          <div className="w-8 h-5 bg-yellow-400/20 border border-yellow-400/30 rounded-md flex items-center justify-center self-start">
                            <div className="w-4 h-2.5 bg-yellow-400/40 rounded-xs" />
                          </div>
                        )}
                      </div>

                      {/* Pay Button Action overlay */}
                      {isSelected ? (
                        <button
                          onClick={handlePayNow}
                          className="w-full py-2 bg-white text-brand-espresso font-extrabold text-[10px] tracking-wider rounded-xl uppercase hover:bg-opacity-90 transition-all shadow-sm"
                        >
                          PAY {card.amount} SECURELY
                        </button>
                      ) : (
                        /* Mock card footer network label */
                        <div className="flex items-center justify-between text-[7px] font-extrabold opacity-75 uppercase tracking-widest pt-1">
                          <span>•••• CARD EMBLEM</span>
                          <span>AADHYA PAY</span>
                        </div>
                      )}
                    </motion.div>
                  );
                })}

                {/* Stitched Wallet Bottom Pocket container */}
                <div className="absolute bottom-0 left-0 right-0 h-[36px] bg-[#1C1816] rounded-t-2xl border-t border-dashed border-[#F26A2E]/50 shadow-inner flex items-center justify-center z-45 pointer-events-none">
                  <div className="text-[8px] text-[#F26A2E] font-extrabold tracking-[0.25em] uppercase">
                    Aadhya Secure Wallet
                  </div>
                </div>

              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};
