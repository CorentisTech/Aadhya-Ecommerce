"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useApp, UserDetails } from '../../context/AppContext';
import { createClient } from '@/utils/supabase/client';
import { ProductVisual } from './ProductVisual';
import { 
  ArrowLeft, 
  ArrowRight,
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
    // Fast and smooth - activate early if pulled up fast, or pulled more than half
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
      {/* Progress indicator */}
      <div className="flex flex-col items-center space-y-1 mb-2">
        <motion.div
          animate={{ y: [0, -8, 0], opacity: dragState === 'dragging' ? 0.3 : 1 }}
          transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
          className="text-[#F26A2E] text-lg"
        >
          ??
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
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          className="absolute inset-x-1.5 h-[50px] bg-[#F26A2E] rounded-full flex items-center justify-center cursor-grab active:cursor-grabbing text-brand-white text-xs font-bold tracking-[0.25em] shadow-md touch-none"
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
  const router = useRouter();
  const { cart, clearCart, setPage, isLoggedIn, loginUser, registerUser, user, appliedOffer } = useApp();
  const [success, setSuccess] = useState(false);
  const [isPaymentModalOpen, setPaymentModalOpen] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [confirmedOrderSummary, setConfirmedOrderSummary] = useState<{
    orderNumber: string;
    totalAmount: number;
    itemsCount: number;
    shippingAddress: string;
    city: string;
    zip: string;
  } | null>(null);
  
  // Checkout login inline panel states
  const [checkoutLoginScreen, setCheckoutLoginScreen] = useState<'landing' | 'email' | 'register'>('landing');
  const [checkoutEmail, setCheckoutEmail] = useState('');
  const [checkoutOtp, setCheckoutOtp] = useState('');
  const [checkoutOtpSent, setCheckoutOtpSent] = useState(false);
  const [checkoutOtpError, setCheckoutOtpError] = useState(false);
  const [checkoutAuthLoading, setCheckoutAuthLoading] = useState(false);
  const [checkoutAuthMsg, setCheckoutAuthMsg] = useState('');
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

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkoutEmail) return;
    setCheckoutAuthLoading(true);
    setCheckoutAuthMsg('');
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email: checkoutEmail.trim(),
      options: { shouldCreateUser: true }
    });
    setCheckoutAuthLoading(false);
    if (error) {
      setCheckoutAuthMsg(error.message);
    } else {
      setCheckoutOtpSent(true);
      setCheckoutAuthMsg('OTP sent to your email.');
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setCheckoutAuthLoading(true);
    setCheckoutAuthMsg('');
    setCheckoutOtpError(false);
    const supabase = createClient();
    const { data, error } = await supabase.auth.verifyOtp({
      email: checkoutEmail.trim(),
      token: checkoutOtp.trim(),
      type: 'email'
    });
    
    if (error) {
      setCheckoutOtpError(true);
      setCheckoutAuthMsg(error.message);
      setCheckoutAuthLoading(false);
    } else {
      setCheckoutLoginScreen('register');
      setCheckoutAuthLoading(false);
    }
  };

  // Mock inputs inside payment methods
  const [cardDetails, setCardDetails] = useState({ number: '', expiry: '', cvv: '', name: '' });
  const [upiId, setUpiId] = useState('');
  const [selectedBank, setSelectedBank] = useState('');

  // Pre-fill form data from user profile when available
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    streetName: '',
    landmark: '',
    city: '',
    state: '',
    zip: '',
    country: 'India',
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Automatically pre-fill shipping address when user logs in
  React.useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        streetName: user.streetName || '',
        landmark: user.landmark || '',
        city: user.city || '',
        state: user.state || '',
        zip: user.zip || '',
        country: 'India',
      });
    }
  }, [user]);

  const subtotal = cart.reduce((total, item) => total + item.product.price * item.quantity, 0);
  const shippingThreshold = 5000;
  const isFreeShipping = subtotal >= shippingThreshold;
  const shippingCost = isFreeShipping ? 0 : 150;
  
  // Authoritative discount calculation matching cart
  let discount = 0;
  if (appliedOffer) {
    if (appliedOffer.discountPercentage && appliedOffer.discountPercentage > 0) {
      discount = Math.round(subtotal * (appliedOffer.discountPercentage / 100));
    } else if (appliedOffer.discountAmount && appliedOffer.discountAmount > 0) {
      discount = Math.min(Number(appliedOffer.discountAmount), subtotal);
    }
  }
  const total = Math.max(0, subtotal + shippingCost - discount);

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear error on field change
    if (formErrors[name]) {
      setFormErrors(prev => { const n = { ...prev }; delete n[name]; return n; });
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    if (!formData.firstName.trim()) errors.firstName = 'First name is required';
    if (!formData.lastName.trim()) errors.lastName = 'Last name is required';
    if (!formData.phone.trim()) errors.phone = 'Mobile number is required';
    else if (!/^[6-9]\d{9}$/.test(formData.phone.replace(/\s/g, '').replace(/^\+91/, ''))) errors.phone = 'Enter a valid 10-digit Indian mobile number';
    if (!formData.address.trim()) errors.address = 'Address is required';
    if (!formData.streetName.trim()) errors.streetName = 'Street name is required';
    if (!formData.landmark.trim()) errors.landmark = 'Landmark is required';
    if (!formData.zip.trim()) errors.zip = 'Pincode is required';
    else if (!/^\d{6}$/.test(formData.zip.trim())) errors.zip = 'Enter a valid 6-digit pincode';
    if (!formData.city.trim()) errors.city = 'City is required';
    if (!formData.state.trim()) errors.state = 'State is required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const [placedOrderNo, setPlacedOrderNo] = useState<string | null>(null);
  const [orderLoading, setOrderLoading] = useState(false);

  const handlePayNow = async () => {
    if (!validateForm()) return;
    
    try {
      setOrderLoading(true);
      const mappedMethod = selectedCard === 'cod' 
        ? 'COD' 
        : selectedCard === 'upi' 
          ? 'UPI' 
          : selectedCard === 'net-banking' 
            ? 'NET_BANKING' 
            : 'CARD';

      const payload = {
        items: cart.map(item => ({
          product: { id: item.product.id, price: item.product.price },
          quantity: item.quantity,
          selectedSize: item.selectedSize || null,
          selectedColor: item.selectedColor || null,
        })),
        shipping_address: formData,
        subtotal,
        shipping_cost: shippingCost,
        discount_amount: discount,
        offer_code: appliedOffer?.code || null,
        total_amount: total,
        payment_method: mappedMethod,
        idempotency_key: `chk_${Date.now()}_${Math.random()}`
      };
      
      const deviceId = typeof window !== 'undefined' ? localStorage.getItem('aadhya_device_id') || '' : '';

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-device-id': deviceId
        },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      
      if (data.success && data.order) {
        setPlacedOrderNo(data.order.order_number);
        setConfirmedOrderSummary({
          orderNumber: data.order.order_number,
          totalAmount: total,
          itemsCount: cart.reduce((acc, it) => acc + it.quantity, 0),
          shippingAddress: `${formData.address}, ${formData.streetName}`,
          city: formData.city,
          zip: formData.zip,
        });
        setPaymentModalOpen(false);
        setSuccess(true);
        clearCart();
      } else {
        alert(data.error || 'Failed to place order');
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred during checkout');
    } finally {
      setOrderLoading(false);
    }
  };

  if (success && placedOrderNo) {
    return (
      <div className="w-full min-h-screen bg-[#FCFAF7] flex items-center justify-center py-20 px-4 md:px-6 select-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-brand-white p-8 md:p-10 rounded-3xl border border-brand-border/40 shadow-xl max-w-lg w-full text-center space-y-6"
        >
          <CheckCircle className="w-16 h-16 text-brand-success mx-auto stroke-[1.5]" />
          <div className="space-y-1.5">
            <span className="text-[10px] font-extrabold tracking-widest text-[#F26A2E] uppercase">
              Authoritative Confirmation
            </span>
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-brand-espresso uppercase tracking-wider">
              ORDER PLACED SUCCESSFULLY
            </h2>
            <p className="text-xs text-brand-warmGray font-semibold tracking-wider">
              Order Reference: <strong className="text-brand-espresso font-mono text-sm">{placedOrderNo}</strong>
            </p>
          </div>

          {confirmedOrderSummary && (
            <div className="bg-[#FAF7F2] border border-brand-border/30 rounded-2xl p-4 text-left space-y-2.5 text-xs">
              <div className="flex justify-between items-center border-b border-brand-border/20 pb-2">
                <span className="text-brand-warmGray font-semibold">Total Paid</span>
                <span className="font-extrabold text-sm text-[#F26A2E]">
                  ₹{confirmedOrderSummary.totalAmount.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-brand-warmGray">Items</span>
                <span className="font-bold text-brand-espresso">{confirmedOrderSummary.itemsCount} pcs</span>
              </div>
              <div className="text-[11px] space-y-0.5 border-t border-brand-border/20 pt-2">
                <span className="text-brand-warmGray block">Shipping Address:</span>
                <span className="font-medium text-brand-espresso block">
                  {confirmedOrderSummary.shippingAddress}, {confirmedOrderSummary.city} - {confirmedOrderSummary.zip}
                </span>
              </div>
              <div className="text-[10px] text-brand-warmGray pt-1 flex items-center gap-1 font-semibold">
                <Truck className="w-3.5 h-3.5 text-[#F26A2E]" />
                <span>Expected Delivery: 3 to 5 business days</span>
              </div>
            </div>
          )}

          <p className="text-xs text-brand-warmGray leading-relaxed font-semibold">
            Thank you for shopping at Aadhya. We have sent a confirmation email to your registered address with live dispatch tracking details.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={() => router.push('/account')}
              className="flex-1 py-3 bg-[#EFE6DA] border border-[#E5DACB] text-brand-espresso text-xs font-bold tracking-widest uppercase hover:bg-[#E5DACB] transition-colors rounded-xl"
            >
              VIEW IN ACCOUNT
            </button>
            <button
              onClick={() => {
                setPage('home');
                router.push('/');
              }}
              className="flex-1 py-3 bg-[#F26A2E] text-brand-white text-xs font-bold tracking-[0.15em] uppercase hover:bg-[#F26A2E]/90 transition-colors rounded-xl shadow-sm"
            >
              CONTINUE SHOPPING
            </button>
          </div>
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
              </div>
            </div>
          )}

          {checkoutLoginScreen === 'email' && (
            <div className="space-y-5">
              <h2 className="font-display font-bold text-lg text-brand-espresso">Welcome Back</h2>
              
              {!checkoutOtpSent ? (
                <form onSubmit={handleSendOtp} className="space-y-4">
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
                  {checkoutAuthMsg && <span className="text-[9px] font-bold text-brand-sale block">{checkoutAuthMsg}</span>}
                  <button type="submit" disabled={checkoutAuthLoading} className="w-full py-3 bg-[#F26A2E] text-white text-[10px] font-extrabold tracking-widest uppercase hover:opacity-95 rounded-xl disabled:opacity-50">
                    {checkoutAuthLoading ? 'Sending...' : 'Send Verification OTP'}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  <div className="text-left bg-[#FFF3EC] p-3 rounded-xl border border-[#F9E1D3]/50">
                    <p className="text-[9px] font-bold text-[#F26A2E] tracking-wider uppercase">
                      OTP sent to {checkoutEmail}
                    </p>
                  </div>
                  <div className="space-y-1 text-left">
                    <label className="text-[9px] font-bold text-brand-warmGray uppercase tracking-wider block">OTP Verification Code</label>
                    <input
                      required
                      type="text"
                      placeholder="Enter 6-digit code"
                      maxLength={6}
                      value={checkoutOtp}
                      onChange={(e) => setCheckoutOtp(e.target.value)}
                      className="w-full bg-[#FCFAF7] border border-brand-border/60 p-3 rounded-xl text-xs outline-none focus:border-[#F26A2E] font-semibold text-center tracking-[0.4em]"
                    />
                  </div>
                  {checkoutOtpError && <span className="text-[9px] font-bold text-brand-sale block">{checkoutAuthMsg || 'Invalid Code.'}</span>}
                  <button type="submit" disabled={checkoutAuthLoading} className="w-full py-3 bg-brand-espresso text-white text-[10px] font-extrabold tracking-widest uppercase hover:opacity-95 rounded-xl disabled:opacity-50">
                    {checkoutAuthLoading ? 'Verifying...' : 'Verify Code'}
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
                    {/* First and Last Name */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <input
                          required
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleTextChange}
                          className={`w-full bg-brand-warmWhite border ${formErrors.firstName ? 'border-red-500' : 'border-brand-border/50'} p-3 rounded-xl text-xs outline-none focus:border-[#F26A2E] font-semibold text-brand-espresso`}
                          placeholder="First Name"
                        />
                        {formErrors.firstName && <p className="text-red-500 text-[9px] mt-1 ml-1">{formErrors.firstName}</p>}
                      </div>
                      <div>
                        <input
                          required
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleTextChange}
                          className={`w-full bg-brand-warmWhite border ${formErrors.lastName ? 'border-red-500' : 'border-brand-border/50'} p-3 rounded-xl text-xs outline-none focus:border-[#F26A2E] font-semibold text-brand-espresso`}
                          placeholder="Last Name"
                        />
                        {formErrors.lastName && <p className="text-red-500 text-[9px] mt-1 ml-1">{formErrors.lastName}</p>}
                      </div>
                    </div>

                    {/* Phone Number */}
                    <div>
                      <input
                        required
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleTextChange}
                        className={`w-full bg-brand-warmWhite border ${formErrors.phone ? 'border-red-500' : 'border-brand-border/50'} p-3 rounded-xl text-xs outline-none focus:border-[#F26A2E] font-semibold text-brand-espresso`}
                        placeholder="Mobile Number"
                      />
                      {formErrors.phone && <p className="text-red-500 text-[9px] mt-1 ml-1">{formErrors.phone}</p>}
                    </div>

                    {/* Address Lines */}
                    <div className="space-y-3">
                      <div>
                        <input
                          required
                          type="text"
                          name="address"
                          value={formData.address}
                          onChange={handleTextChange}
                          className={`w-full bg-brand-warmWhite border ${formErrors.address ? 'border-red-500' : 'border-brand-border/50'} p-3 rounded-xl text-xs outline-none focus:border-[#F26A2E] font-semibold text-brand-espresso`}
                          placeholder="Address Line 1"
                        />
                        {formErrors.address && <p className="text-red-500 text-[9px] mt-1 ml-1">{formErrors.address}</p>}
                      </div>
                      <div>
                        <input
                          required
                          type="text"
                          name="streetName"
                          value={formData.streetName}
                          onChange={handleTextChange}
                          className={`w-full bg-brand-warmWhite border ${formErrors.streetName ? 'border-red-500' : 'border-brand-border/50'} p-3 rounded-xl text-xs outline-none focus:border-[#F26A2E] font-semibold text-brand-espresso`}
                          placeholder="Street Name"
                        />
                        {formErrors.streetName && <p className="text-red-500 text-[9px] mt-1 ml-1">{formErrors.streetName}</p>}
                      </div>
                    </div>

                    {/* Landmark / Line 2 */}
                    <div>
                      <input
                        type="text"
                        name="landmark"
                        value={formData.landmark}
                        onChange={handleTextChange}
                        className={`w-full bg-brand-warmWhite border ${formErrors.landmark ? 'border-red-500' : 'border-brand-border/50'} p-3 rounded-xl text-xs outline-none focus:border-[#F26A2E] font-semibold text-brand-espresso`}
                        placeholder="Landmark / Area (e.g. Opposite Grand Mall)"
                      />
                      {formErrors.landmark && <p className="text-red-500 text-[9px] mt-1 ml-1">{formErrors.landmark}</p>}
                    </div>

                    {/* City & State */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <input
                          required
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleTextChange}
                          className={`w-full bg-brand-warmWhite border ${formErrors.city ? 'border-red-500' : 'border-brand-border/50'} p-3 rounded-xl text-xs outline-none focus:border-[#F26A2E] font-semibold text-brand-espresso`}
                          placeholder="City"
                        />
                        {formErrors.city && <p className="text-red-500 text-[9px] mt-1 ml-1">{formErrors.city}</p>}
                      </div>
                      
                      <div>
                        <div className="relative">
                          <select
                            name="state"
                            value={formData.state}
                            onChange={handleTextChange}
                            className={`w-full bg-brand-warmWhite border ${formErrors.state ? 'border-red-500' : 'border-brand-border/50'} p-3 rounded-xl text-xs outline-none focus:border-[#F26A2E] font-semibold text-brand-espresso appearance-none`}
                          >
                            <option value="">Select State</option>
                            <option value="Maharashtra">Maharashtra</option>
                            <option value="Delhi">Delhi</option>
                            <option value="Karnataka">Karnataka</option>
                            <option value="Tamil Nadu">Tamil Nadu</option>
                            <option value="Uttar Pradesh">Uttar Pradesh</option>
                          </select>
                          <ChevronDown className="w-4 h-4 text-brand-warmGray absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>
                        {formErrors.state && <p className="text-red-500 text-[9px] mt-1 ml-1">{formErrors.state}</p>}
                      </div>
                    </div>

                    {/* Zip & Country */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <input
                          required
                          type="text"
                          name="zip"
                          value={formData.zip}
                          onChange={handleTextChange}
                          className={`w-full bg-brand-warmWhite border ${formErrors.zip ? 'border-red-500' : 'border-brand-border/50'} p-3 rounded-xl text-xs outline-none focus:border-[#F26A2E] font-semibold text-brand-espresso`}
                          placeholder="Pincode / Zipcode"
                        />
                        {formErrors.zip && <p className="text-red-500 text-[9px] mt-1 ml-1">{formErrors.zip}</p>}
                      </div>
                      
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

              {/* Clean Click-to-Pay CTA Button */}
              <button
                type="button"
                onClick={() => {
                  if (validateForm()) {
                    setPaymentModalOpen(true);
                  }
                }}
                className="w-full py-4 px-8 bg-[#F26A2E] text-brand-white text-xs font-bold tracking-[0.25em] uppercase hover:bg-[#F26A2E]/90 transition-all shadow-md rounded-full flex items-center justify-center gap-2 active:scale-98 cursor-pointer"
              >
                <span>PROCEED TO PAYMENT</span>
                <ArrowRight className="w-4 h-4" />
              </button>

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
                {appliedOffer && discount > 0 ? (
                  <div className="flex justify-between text-brand-success font-extrabold">
                    <span>DISCOUNT ({appliedOffer.code})</span>
                    <span>-₹{discount.toLocaleString('en-IN')}</span>
                  </div>
                ) : (
                  <div className="flex justify-between text-brand-warmGray font-bold">
                    <span>DISCOUNT</span>
                    <span>₹0</span>
                  </div>
                )}
                
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
            {/* Modal Body (Centered, tight wrapping, zero top white space) */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: 'spring', damping: 26, stiffness: 240 }}
              className="bg-white w-full max-w-md rounded-3xl pt-5 pb-2 px-5 sm:px-6 relative shadow-2xl border border-brand-border/30 text-center flex flex-col items-center overflow-hidden my-auto max-h-fit"
              onClick={(e) => e.stopPropagation()}
            >
              
              {/* Close/Cut Button - Positioned top-right without overlapping text */}
              <button
                onClick={() => {
                  setPaymentModalOpen(false);
                  setSelectedCard(null);
                }}
                className="absolute top-4 right-4 text-brand-espresso p-1.5 hover:bg-brand-softBeige rounded-full transition-colors border border-brand-border/40 z-50 shadow-xs"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Header Title */}
              <div className="space-y-0.5 pt-1 pb-2 text-center w-full px-4">
                <h3 className="font-display font-bold text-xl sm:text-2xl text-brand-espresso leading-tight">
                  Choose Payment Method
                </h3>
                <p className="text-[10px] text-brand-warmGray font-bold tracking-wider">
                  Tap or click any card in your wallet to proceed
                </p>
              </div>

              {/* Stacked Wallet container */}
              <div className={`relative ${selectedCard ? 'min-h-[380px]' : 'h-[300px]'} w-full flex flex-col justify-start mt-2 mb-2 select-none transition-all duration-300`}>
                
                {paymentCards.map((card) => {
                  const Icon = card.icon;
                  const isHovered = hoveredCard === card.id;
                  const isSelected = selectedCard === card.id;
                  const isOtherSelected = selectedCard !== null && !isSelected;

                  // Smooth medium sensitivity offsets
                  let yVal = card.yOffset;
                  let zVal = card.zIndex;

                  if (isSelected) {
                    yVal = 0; // Pop up right at top of container below title
                    zVal = 100;
                  } else if (isHovered && !selectedCard) {
                    yVal = card.yOffset - 16; // Smooth medium hover jump
                    zVal = 80;
                  }

                  return (
                    <motion.div
                      key={card.id}
                      onClick={() => {
                        if (!isSelected) {
                          setSelectedCard(card.id);
                        }
                      }}
                      onMouseEnter={() => !selectedCard && setHoveredCard(card.id)}
                      onMouseLeave={() => !selectedCard && setHoveredCard(null)}
                      animate={{
                        y: isSelected ? 0 : isOtherSelected ? card.yOffset + 140 : yVal,
                        scale: isSelected ? 1.02 : isOtherSelected ? 0.92 : isHovered && !selectedCard ? 1.015 : 1,
                        filter: isOtherSelected ? 'blur(6px)' : 'blur(0px)',
                        opacity: isOtherSelected ? 0.15 : 1,
                        zIndex: isSelected ? 100 : zVal,
                      }}
                      transition={{ type: 'spring', damping: 28, stiffness: 180 }}
                      className={`absolute left-0 right-0 ${isSelected ? 'min-h-[295px] h-auto p-5' : 'h-[175px] p-4'} rounded-2xl flex flex-col justify-between text-white cursor-pointer shadow-xl border border-white/20 transition-all ${card.bgColor}`}
                    >
                      {/* Top Header Row */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Icon className="w-5 h-5 stroke-[1.5]" />
                          <span className="font-display text-[13px] sm:text-[14px] font-bold tracking-wider uppercase">
                            {card.title}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="font-sans text-[13px] font-extrabold">
                            {card.amount}
                          </span>
                          {/* Close/Deselect option on popped-up selected card */}
                          {isSelected && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedCard(null);
                              }}
                              className="p-1 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors ml-1 cursor-pointer"
                              aria-label="Deselect card"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Card Middle & dynamic layout inputs */}
                      <div className="flex-grow flex flex-col justify-center pt-2">
                        {isSelected ? (
                          <motion.div 
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.2 }}
                            className="w-full space-y-2 text-left py-1"
                            onClick={(e) => e.stopPropagation()} // Keep focus on inputs
                          >
                            {/* Option 1: Card fields */}
                            {card.id === 'card' && (
                              <div className="space-y-2 text-xs font-semibold text-white/90">
                                <div>
                                  <input
                                    type="text"
                                    placeholder="Cardholder Full Name"
                                    value={cardDetails.name}
                                    onChange={(e) => setCardDetails({ ...cardDetails, name: e.target.value })}
                                    className="w-full bg-white/20 border border-white/30 p-2.5 rounded-xl text-xs text-white placeholder-white/60 outline-none focus:bg-white/30 transition-colors"
                                  />
                                </div>
                                <div>
                                  <input
                                    type="text"
                                    placeholder="Card Number (16 digits)"
                                    maxLength={19}
                                    value={cardDetails.number}
                                    onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value })}
                                    className="w-full bg-white/20 border border-white/30 p-2.5 rounded-xl text-xs text-white placeholder-white/60 outline-none focus:bg-white/30 transition-colors"
                                  />
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                  <input
                                    type="text"
                                    placeholder="MM / YY"
                                    maxLength={5}
                                    value={cardDetails.expiry}
                                    onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                                    className="bg-white/20 border border-white/30 p-2.5 rounded-xl text-xs text-white placeholder-white/60 outline-none focus:bg-white/30 transition-colors"
                                  />
                                  <input
                                    type="password"
                                    placeholder="CVV"
                                    maxLength={4}
                                    value={cardDetails.cvv}
                                    onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                                    className="bg-white/20 border border-white/30 p-2.5 rounded-xl text-xs text-white placeholder-white/60 outline-none focus:bg-white/30 transition-colors"
                                  />
                                </div>
                              </div>
                            )}

                            {/* Option 2: UPI fields */}
                            {card.id === 'upi' && (
                              <div className="space-y-2 text-center flex flex-col items-center py-1">
                                <div className="w-10 h-10 bg-white/25 rounded-lg p-1.5 flex flex-col justify-between shadow-inner">
                                  <div className="flex justify-between"><div className="w-2 h-2 bg-white rounded-xs"/><div className="w-2 h-2 bg-white rounded-xs"/></div>
                                  <div className="flex justify-between"><div className="w-2 h-2 bg-white rounded-xs"/><div className="w-2 h-2 bg-white rounded-xs"/></div>
                                </div>
                                <input
                                  type="text"
                                  placeholder="Enter UPI ID (e.g. name@okhdfcbank)"
                                  value={upiId}
                                  onChange={(e) => setUpiId(e.target.value)}
                                  className="w-full bg-white/20 border border-white/30 p-2.5 rounded-xl text-xs text-white placeholder-white/60 outline-none text-center focus:bg-white/30 transition-colors"
                                />
                                <span className="text-[9px] text-white/70 block">
                                  You will receive a payment request on your UPI app.
                                </span>
                              </div>
                            )}

                            {/* Option 3: Netbanking banks dropdown */}
                            {card.id === 'net-banking' && (
                              <div className="space-y-2 py-1">
                                <label className="text-[10px] text-white/80 font-bold block uppercase tracking-wider">
                                  Select Your Bank:
                                </label>
                                <select
                                  value={selectedBank}
                                  onChange={(e) => setSelectedBank(e.target.value)}
                                  className="w-full bg-white/20 border border-white/30 p-2.5 rounded-xl text-xs text-white outline-none select-bank focus:bg-white/30 transition-colors"
                                >
                                  <option value="" className="text-brand-espresso">Select bank from list</option>
                                  <option value="sbi" className="text-brand-espresso">State Bank of India (SBI)</option>
                                  <option value="hdfc" className="text-brand-espresso">HDFC Bank</option>
                                  <option value="icici" className="text-brand-espresso">ICICI Bank</option>
                                  <option value="axis" className="text-brand-espresso">Axis Bank</option>
                                  <option value="kotak" className="text-brand-espresso">Kotak Mahindra Bank</option>
                                </select>
                              </div>
                            )}

                            {/* Option 4: COD details */}
                            {card.id === 'cod' && (
                              <div className="py-2 text-center space-y-1">
                                <div className="inline-block p-2 rounded-full bg-white/20 mb-1">
                                  <DollarSign className="w-5 h-5 text-white" />
                                </div>
                                <p className="text-xs font-medium text-center text-white/95 leading-relaxed">
                                  Pay with cash or UPI QR upon delivery. Insured package dispatch with tamper-evident seal.
                                </p>
                              </div>
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
                          type="button"
                          onClick={handlePayNow}
                          disabled={orderLoading}
                          className="w-full py-3 bg-white text-brand-espresso font-extrabold text-xs tracking-wider rounded-xl uppercase hover:bg-opacity-95 transition-all shadow-md mt-2 cursor-pointer active:scale-98 disabled:opacity-50"
                        >
                          {orderLoading ? 'PROCESSING PAYMENT...' : `PAY ${card.amount} SECURELY`}
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
                <div className={`absolute bottom-0 left-0 right-0 h-[36px] bg-[#1C1816] rounded-t-2xl border-t border-dashed border-[#F26A2E]/50 shadow-inner flex items-center justify-center z-45 pointer-events-none transition-opacity duration-300 ${selectedCard ? 'opacity-0' : 'opacity-100'}`}>
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
