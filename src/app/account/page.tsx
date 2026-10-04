"use client";

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { 
  User, 
  MapPin, 
  Bell, 
  ShoppingBag, 
  Heart, 
  LifeBuoy, 
  LogOut, 
  ArrowLeft,
  ChevronRight,
  Edit2,
  Check,
  X,
  Mail,
  Smartphone,
  Key,
  Globe,
  Loader2,
  Package,
  ExternalLink,
  ShieldCheck,
  HelpCircle,
  Clock,
  Truck,
  CheckCircle2
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { createClient } from '@/utils/supabase/client';
import { getDeviceId, getDeviceName } from '@/utils/device';

interface OrderItem {
  id: string;
  quantity: number;
  unit_price: number;
  selected_size?: string;
  selected_color?: string;
  product_name: string;
  product_no: string;
  product_slug: string;
  product_image?: string;
}

interface StatusHistoryEntry {
  status: string;
  action: string;
  timestamp: string;
  note?: string;
  courier?: string;
  tracking_number?: string;
}

interface Order {
  id: string;
  order_number: string;
  status: string;
  subtotal: number;
  shipping_cost: number;
  discount_amount: number;
  total_amount: number;
  payment_method: string;
  payment_status: string;
  courier?: string;
  tracking_number?: string;
  tracking_url?: string;
  dispatched_at?: string;
  delivered_at?: string;
  expected_delivery_date?: string;
  status_history?: StatusHistoryEntry[];
  rejection_reason?: string;
  created_at: string;
  items: OrderItem[];
}

export default function AccountPage() {
  const router = useRouter();
  const { 
    user, 
    isLoggedIn, 
    authLoading,
    logoutUser, 
    updateUserDetails, 
    refreshUserData,
    cart,
    wishlist
  } = useApp();

  // Active greeting based on real-time hour
  const [greeting, setGreeting] = useState('Good morning');
  
  useEffect(() => {
    const updateGreeting = () => {
      const hour = new Date().getHours();
      if (hour >= 4 && hour < 12) setGreeting('Good morning');
      else if (hour >= 12 && hour < 17) setGreeting('Good afternoon');
      else if (hour >= 17 && hour < 22) setGreeting('Good evening');
      else setGreeting('Good night');
    };
    updateGreeting();
    const timer = setInterval(updateGreeting, 60000);
    return () => clearInterval(timer);
  }, []);

  // Modal / Accordion Drawer States
  const [activeModal, setActiveModal] = useState<'profile' | 'address' | 'orders' | 'notifications' | 'help' | 'devices' | null>(null);
  const [isSavedToast, setIsSavedToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('Profile details saved successfully');

  // Tracking and Help Modals
  const [trackingOrder, setTrackingOrder] = useState<Order | null>(null);
  const [helpOrder, setHelpOrder] = useState<Order | null>(null);
  const [helpSubject, setHelpSubject] = useState('');
  const [helpCategory, setHelpCategory] = useState('Order Issue');
  const [helpDescription, setHelpDescription] = useState('');
  const [helpSubmitting, setHelpSubmitting] = useState(false);

  // Supabase Auth Email OTP State
  const [authEmail, setAuthEmail] = useState('');
  const [authOtp, setAuthOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Orders State
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  // Editable Profile Form State
  const [profileForm, setProfileForm] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    avatar: (user?.avatar || 'female') as 'male' | 'female'
  });

  // Editable Address Form State
  const [addressForm, setAddressForm] = useState({
    streetName: user?.streetName || '',
    landmark: user?.landmark || '',
    city: user?.city || '',
    state: user?.state || '',
    zip: user?.zip || '',
    otherPhone: user?.otherPhone || ''
  });

  // Sync state when user object updates
  useEffect(() => {
    if (user) {
      setProfileForm({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        avatar: user.avatar || 'female'
      });
      setAddressForm({
        streetName: user.streetName || '',
        landmark: user.landmark || '',
        city: user.city || '',
        state: user.state || '',
        zip: user.zip || '',
        otherPhone: user.otherPhone || ''
      });
    }
  }, [user]);

  // Fetch real orders when Orders modal opens
  useEffect(() => {
    if (activeModal === 'orders' && isLoggedIn) {
      setOrdersLoading(true);
      const deviceId = typeof window !== 'undefined' ? localStorage.getItem('aadhya_device_id') || '' : '';
      fetch('/api/orders', {
        headers: { 'x-device-id': deviceId }
      })
        .then((res) => (res.ok ? res.json() : []))
        .then((data) => {
          setOrders(Array.isArray(data) ? data : []);
        })
        .catch(() => setOrders([]))
        .finally(() => setOrdersLoading(false));
    }
  }, [activeModal, isLoggedIn]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setIsSavedToast(true);
    setTimeout(() => setIsSavedToast(false), 2500);
  };

  // Handle order help submission
  const handleHelpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!helpOrder) return;
    setHelpSubmitting(true);
    try {
      const res = await fetch('/api/admin/support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_name: user ? `${user.first_name} ${user.last_name}` : '',
          customer_email: user?.email || '',
          customer_phone: user?.phone || '',
          subject: helpSubject,
          category: helpCategory,
          related_order_id: helpOrder.id,
          message: helpDescription
        })
      });
      const data = await res.json();
      if (data.success) {
        setHelpOrder(null);
        setHelpSubject('');
        setHelpCategory('Order Issue');
        setHelpDescription('');
        showToast('Support ticket created successfully!');
      } else {
        alert(data.error || 'Failed to submit help request');
      }
    } catch (err) {
      alert('Error submitting help request');
    } finally {
      setHelpSubmitting(false);
    }
  };

  // Handle saving basic profile details
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateUserDetails({
      firstName: profileForm.firstName,
      lastName: profileForm.lastName,
      phone: profileForm.phone,
      avatar: profileForm.avatar
    });
    setActiveModal(null);
    showToast('Profile updated successfully');
  };

  // Quick avatar switch
  const handleSwitchAvatar = async (newAvatar: 'male' | 'female') => {
    setProfileForm(prev => ({ ...prev, avatar: newAvatar }));
    await updateUserDetails({ avatar: newAvatar });
  };

  // Handle saving address details
  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    const fullAddress = `${addressForm.streetName}${addressForm.landmark ? ', ' + addressForm.landmark : ''}, ${addressForm.city}, ${addressForm.state} - ${addressForm.zip}`;
    await updateUserDetails({
      address: fullAddress,
      streetName: addressForm.streetName,
      landmark: addressForm.landmark,
      city: addressForm.city,
      state: addressForm.state,
      zip: addressForm.zip,
      otherPhone: addressForm.otherPhone
    });
    setActiveModal(null);
    showToast('Shipping address saved');
  };

  // Real Supabase Auth: Send OTP
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    const cleanEmail = authEmail.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setAuthError('Please enter a valid email address.');
      return;
    }

    setIsAuthLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOtp({
        email: cleanEmail,
        options: {
          shouldCreateUser: true,
        },
      });

      if (error) {
        setAuthError(error.message || 'Failed to send verification code.');
      } else {
        setOtpSent(true);
        showToast(`Verification code sent to ${cleanEmail}`);
      }
    } catch (err: any) {
      setAuthError(err.message || 'Something went wrong.');
    } finally {
      setIsAuthLoading(false);
    }
  };

  // Real Supabase Auth: Verify OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    const cleanCode = authOtp.trim();
    if (!cleanCode || cleanCode.length < 4) {
      setAuthError('Please enter the verification code sent to your email.');
      return;
    }

    setIsAuthLoading(true);
    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.verifyOtp({
        email: authEmail.trim().toLowerCase(),
        token: cleanCode,
        type: 'email',
      });

      if (error) {
        setAuthError(error.message || 'Invalid or expired code. Please try again.');
      } else if (data.session) {
        await refreshUserData();
        showToast('Signed in successfully');
      }
    } catch (err: any) {
      setAuthError(err.message || 'Verification failed.');
    } finally {
      setIsAuthLoading(false);
    }
  };

  const currentAvatar = user?.avatar || profileForm.avatar;
  const displayName = user?.firstName 
    ? `${user.firstName} ${user.lastName || ''}`.trim() 
    : user?.email?.split('@')[0] || 'Member';
  const displayFirstName = user?.firstName || displayName;
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  // Loading state while checking session
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="w-8 h-8 text-[#181818] animate-spin" />
          <span className="font-serif tracking-widest text-xs uppercase text-[#7A6B5C]">Loading Aadhya...</span>
        </div>
      </div>
    );
  }

  // ==================================================
  // NON-AUTHENTICATED STATE: REAL SUPABASE EMAIL OTP
  // ==================================================
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] py-8 sm:py-16 px-4 flex items-center justify-center select-none text-[#181818]">
        {/* Toast Alert */}
        {isSavedToast && (
          <div className="fixed top-6 z-50 bg-[#181818] text-[#FAF7F2] px-5 py-2.5 rounded-full text-xs font-medium tracking-wide shadow-2xl flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
        )}

        <div className="w-full max-w-[420px] bg-[#EFE6DA] rounded-[32px] shadow-xl border border-[#D5C7B5] overflow-hidden p-6 sm:p-8 space-y-6">
          {/* Top Brand & Back */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.back()}
              className="w-9 h-9 rounded-full bg-[#FAF7F2] border border-[#D5C7B5] flex items-center justify-center text-[#181818] hover:bg-white transition-all cursor-pointer"
              aria-label="Go Back"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <span className="font-serif font-black text-xl tracking-[0.25em] text-[#181818]">AADHYA</span>
            <div className="w-9" />
          </div>

          <div className="text-center space-y-2 pt-2">
            <h1 className="font-serif text-2xl font-bold text-[#181818] tracking-tight">
              {otpSent ? 'Enter Verification Code' : 'Sign in to Aadhya'}
            </h1>
            <p className="text-xs text-[#7A6B5C] font-normal leading-relaxed">
              {otpSent 
                ? `We sent a security code to ${authEmail}`
                : 'Experience personalized curation, secure device synchronization, and dedicated concierge.'}
            </p>
          </div>

          {authError && (
            <div className="p-3 bg-red-100/80 border border-red-200 text-red-800 text-xs rounded-xl">
              {authError}
            </div>
          )}

          {!otpSent ? (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-[#7A6B5C] tracking-wider uppercase block">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#7A6B5C] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full bg-[#FAF7F2] border border-[#D5C7B5] pl-10 pr-3 py-3 rounded-2xl text-xs font-medium focus:outline-none focus:border-[#181818] transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isAuthLoading}
                className="w-full py-3.5 bg-[#181818] text-[#FAF7F2] hover:bg-black rounded-2xl text-xs font-bold tracking-widest uppercase transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {isAuthLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Sending Code...</span>
                  </>
                ) : (
                  <span>Continue with Email</span>
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-[#7A6B5C] tracking-wider uppercase block">
                  6-Digit OTP
                </label>
                <input
                  type="text"
                  required
                  maxLength={8}
                  value={authOtp}
                  onChange={(e) => setAuthOtp(e.target.value)}
                  placeholder="123456"
                  className="w-full bg-[#FAF7F2] border border-[#D5C7B5] px-4 py-3 rounded-2xl text-center text-lg tracking-[0.3em] font-mono font-bold focus:outline-none focus:border-[#181818] transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={isAuthLoading}
                className="w-full py-3.5 bg-[#181818] text-[#FAF7F2] hover:bg-black rounded-2xl text-xs font-bold tracking-widest uppercase transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {isAuthLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Verifying...</span>
                  </>
                ) : (
                  <span>Verify & Sign In</span>
                )}
              </button>

              <div className="flex items-center justify-between text-[11px] pt-1 text-[#7A6B5C]">
                <button
                  type="button"
                  onClick={() => { setOtpSent(false); setAuthOtp(''); }}
                  className="hover:text-[#181818] underline cursor-pointer"
                >
                  Change email
                </button>
                <button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={isAuthLoading}
                  className="hover:text-[#181818] underline cursor-pointer"
                >
                  Resend code
                </button>
              </div>
            </form>
          )}

          <div className="pt-2 text-center text-[10px] text-[#7A6B5C] leading-relaxed">
            By continuing, you agree to Aadhya's Terms of Service and Privacy Policy. Passwordless login protected by Supabase Auth.
          </div>
        </div>
      </div>
    );
  }

  // ==================================================
  // AUTHENTICATED STATE: REAL ACCOUNT DASHBOARD
  // ==================================================
  return (
    <div className="min-h-screen bg-[#FAF7F2] py-4 sm:py-8 px-3 sm:px-4 flex items-center justify-center select-none text-[#181818]">
      
      {/* Toast Alert */}
      {isSavedToast && (
        <div className="fixed top-6 z-50 bg-[#181818] text-[#FAF7F2] px-5 py-2.5 rounded-full text-xs font-medium tracking-wide shadow-2xl flex items-center gap-2 animate-bounce">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Account Frame */}
      <div className="w-full max-w-[420px] bg-[#EFE6DA] rounded-[36px] shadow-2xl overflow-hidden border border-[#D5C7B5] flex flex-col relative">

        {/* 1. TOP HERO BANNER */}
        <div 
          className="w-full h-64 sm:h-72 relative overflow-hidden flex flex-col items-center justify-between p-5 text-[#FAF7F2]"
          style={{
            background: 'radial-gradient(circle at 50% 15%, #38302A 0%, #201B17 55%, #120F0D 100%)',
          }}
        >
          {/* Top Bar Actions */}
          <div className="w-full flex items-center justify-between relative z-10">
            {/* Back Button */}
            <button
              onClick={() => router.back()}
              className="w-9 h-9 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white/90 hover:text-white hover:bg-white/20 transition-all cursor-pointer"
              aria-label="Go Back"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>

            <span className="font-serif font-black text-sm tracking-[0.25em] text-[#FAF7F2]">AADHYA</span>

            {/* Wishlist and Cart Bag */}
            <div className="flex items-center space-x-2.5">
              <button
                onClick={() => router.push('/wishlist')}
                className="w-9 h-9 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white/90 hover:text-white hover:bg-white/20 transition-all cursor-pointer relative"
                aria-label="Wishlist"
              >
                <Heart className="w-4 h-4" />
                {wishlist.length > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-[#FAF7F2] rounded-full ring-2 ring-black" />
                )}
              </button>

              <button
                onClick={() => router.push('/cart')}
                className="w-9 h-9 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white/90 hover:text-white hover:bg-white/20 transition-all cursor-pointer relative"
                aria-label="Shopping Cart"
              >
                <ShoppingBag className="w-4 h-4" />
                {cartCount > 0 && (
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full ring-2 ring-black" />
                )}
              </button>
            </div>
          </div>

          {/* Center Profile Avatar */}
          <div className="flex flex-col items-center relative z-10 -mt-2">
            <div className="relative">
              <div className="w-20 h-20 sm:w-22 sm:h-22 rounded-full border-[3px] border-[#FAF7F2]/90 shadow-xl overflow-hidden bg-[#FAF7F2] flex items-center justify-center">
                <img
                  src={currentAvatar === 'male' ? '/images/avatar-male.png' : '/images/avatar-female.png'}
                  alt={currentAvatar === 'male' ? 'Male Avatar' : 'Female Avatar'}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Quick toggle indicator */}
              <button
                onClick={() => handleSwitchAvatar(currentAvatar === 'male' ? 'female' : 'male')}
                className="absolute bottom-0 right-0 p-1.5 bg-[#181818] text-white rounded-full border-2 border-white shadow-md hover:scale-110 transition-transform cursor-pointer"
                title="Toggle Male/Female Avatar"
              >
                <Edit2 className="w-2.5 h-2.5" />
              </button>
            </div>

            {/* Dynamic Greeting & User Name */}
            <div className="text-center pt-2 space-y-0.5">
              <h1 className="font-serif font-bold text-lg sm:text-xl text-[#FAF7F2] tracking-tight">
                {greeting}, {displayFirstName}
              </h1>
              <p className="text-[10px] text-white/70 font-medium tracking-wide max-w-[260px] truncate">
                {user?.email}
              </p>
            </div>
          </div>

          {/* Avatar Switcher Pills */}
          <div className="flex items-center gap-2 pb-1 relative z-10">
            <button
              onClick={() => handleSwitchAvatar('male')}
              className={`px-3 py-0.5 rounded-full text-[9px] font-bold tracking-wider uppercase transition-all cursor-pointer ${
                currentAvatar === 'male'
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'bg-white/20 text-white/70 hover:text-white'
              }`}
            >
              Male
            </button>
            <button
              onClick={() => handleSwitchAvatar('female')}
              className={`px-3 py-0.5 rounded-full text-[9px] font-bold tracking-wider uppercase transition-all cursor-pointer ${
                currentAvatar === 'female'
                  ? 'bg-rose-500 text-white shadow-xs'
                  : 'bg-white/20 text-white/70 hover:text-white'
              }`}
            >
              Female
            </button>
          </div>
        </div>

        {/* 2. CARD LIST SECTIONS */}
        <div className="p-4 sm:p-5 space-y-3.5 -mt-3 relative z-20">

          {/* CARD GROUP 1: My Address & Account */}
          <div className="bg-[#FAF7F2] rounded-2xl shadow-xs border border-[#D5C7B5] overflow-hidden divide-y divide-[#EFE6DA]">
            
            {/* My Address */}
            <button
              onClick={() => setActiveModal('address')}
              className="w-full p-4 flex items-center justify-between hover:bg-white transition-colors text-left cursor-pointer group"
            >
              <div className="flex items-center space-x-3.5">
                <div className="w-8 h-8 rounded-full bg-[#EFE6DA] flex items-center justify-center text-[#7A6B5C] group-hover:text-[#181818] transition-colors">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs sm:text-[13px] font-bold text-[#181818] block">
                    My Address
                  </span>
                  <span className="text-[10px] text-[#7A6B5C] font-medium block truncate max-w-[200px]">
                    {addressForm.streetName ? `${addressForm.streetName}, ${addressForm.city}` : 'Add shipping address'}
                  </span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-[#7A6B5C] group-hover:text-[#181818] transition-colors" />
            </button>

            {/* Account Details */}
            <button
              onClick={() => setActiveModal('profile')}
              className="w-full p-4 flex items-center justify-between hover:bg-white transition-colors text-left cursor-pointer group"
            >
              <div className="flex items-center space-x-3.5">
                <div className="w-8 h-8 rounded-full bg-[#EFE6DA] flex items-center justify-center text-[#7A6B5C] group-hover:text-[#181818] transition-colors">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs sm:text-[13px] font-bold text-[#181818] block">
                    Account Details
                  </span>
                  <span className="text-[10px] text-[#7A6B5C] font-medium block truncate max-w-[200px]">
                    {displayName} • {profileForm.phone || user?.email}
                  </span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-[#7A6B5C] group-hover:text-[#181818] transition-colors" />
            </button>

          </div>

          {/* CARD GROUP 2: Notifications, Orders, Devices, Passwords, Language */}
          <div className="bg-[#FAF7F2] rounded-2xl shadow-xs border border-[#D5C7B5] overflow-hidden divide-y divide-[#EFE6DA]">
            
            {/* Order History */}
            <button
              onClick={() => setActiveModal('orders')}
              className="w-full p-4 flex items-center justify-between hover:bg-white transition-colors text-left cursor-pointer group"
            >
              <div className="flex items-center space-x-3.5">
                <div className="w-8 h-8 rounded-full bg-[#EFE6DA] flex items-center justify-center text-[#7A6B5C] group-hover:text-[#181818] transition-colors">
                  <ShoppingBag className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs sm:text-[13px] font-bold text-[#181818] block">
                    Order History
                  </span>
                  <span className="text-[10px] text-[#7A6B5C] font-medium block">
                    Track shipments & previous purchases
                  </span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-[#7A6B5C] group-hover:text-[#181818] transition-colors" />
            </button>

            {/* Notifications */}
            <button
              onClick={() => setActiveModal('notifications')}
              className="w-full p-4 flex items-center justify-between hover:bg-white transition-colors text-left cursor-pointer group"
            >
              <div className="flex items-center space-x-3.5">
                <div className="w-8 h-8 rounded-full bg-[#EFE6DA] flex items-center justify-center text-[#7A6B5C] group-hover:text-[#181818] transition-colors">
                  <Bell className="w-4 h-4" />
                </div>
                <span className="text-xs sm:text-[13px] font-bold text-[#181818]">
                  Notifications
                </span>
              </div>
              <ChevronRight className="w-4 h-4 text-[#7A6B5C] group-hover:text-[#181818] transition-colors" />
            </button>

            {/* Devices */}
            <button
              onClick={() => setActiveModal('devices')}
              className="w-full p-4 flex items-center justify-between hover:bg-white transition-colors text-left cursor-pointer group"
            >
              <div className="flex items-center space-x-3.5">
                <div className="w-8 h-8 rounded-full bg-[#EFE6DA] flex items-center justify-center text-[#7A6B5C] group-hover:text-[#181818] transition-colors">
                  <Smartphone className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs sm:text-[13px] font-bold text-[#181818] block">
                    Active Devices
                  </span>
                  <span className="text-[10px] text-emerald-600 font-semibold block">
                    Current Device Scoped & Verified
                  </span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-[#7A6B5C] group-hover:text-[#181818] transition-colors" />
            </button>

            {/* Security */}
            <button
              onClick={() => alert("Passwordless OTP authentication is verified for your account.")}
              className="w-full p-4 flex items-center justify-between hover:bg-white transition-colors text-left cursor-pointer group"
            >
              <div className="flex items-center space-x-3.5">
                <div className="w-8 h-8 rounded-full bg-[#EFE6DA] flex items-center justify-center text-[#7A6B5C] group-hover:text-[#181818] transition-colors">
                  <Key className="w-4 h-4" />
                </div>
                <span className="text-xs sm:text-[13px] font-bold text-[#181818]">
                  Security & Auth
                </span>
              </div>
              <ChevronRight className="w-4 h-4 text-[#7A6B5C] group-hover:text-[#181818] transition-colors" />
            </button>

          </div>

          {/* CARD GROUP 3: Help & Support & Sign Out */}
          <div className="bg-[#FAF7F2] rounded-2xl shadow-xs border border-[#D5C7B5] overflow-hidden divide-y divide-[#EFE6DA]">
            
            <button
              onClick={() => setActiveModal('help')}
              className="w-full p-4 flex items-center justify-between hover:bg-white transition-colors text-left cursor-pointer group"
            >
              <div className="flex items-center space-x-3.5">
                <div className="w-8 h-8 rounded-full bg-[#EFE6DA] flex items-center justify-center text-[#7A6B5C] group-hover:text-[#181818] transition-colors">
                  <LifeBuoy className="w-4 h-4" />
                </div>
                <span className="text-xs sm:text-[13px] font-bold text-[#181818]">
                  Help & Concierge
                </span>
              </div>
              <ChevronRight className="w-4 h-4 text-[#7A6B5C] group-hover:text-[#181818] transition-colors" />
            </button>

            <button
              onClick={async () => {
                await logoutUser();
                router.push('/');
              }}
              className="w-full p-4 flex items-center justify-between hover:bg-rose-50/60 transition-colors text-left cursor-pointer group"
            >
              <div className="flex items-center space-x-3.5">
                <div className="w-8 h-8 rounded-full bg-rose-100/60 flex items-center justify-center text-rose-600">
                  <LogOut className="w-4 h-4" />
                </div>
                <span className="text-xs sm:text-[13px] font-bold text-rose-600">
                  Sign Out
                </span>
              </div>
              <ChevronRight className="w-4 h-4 text-rose-400" />
            </button>

          </div>

        </div>

      </div>

      {/* ==================================================
          MODAL 1: EDIT PROFILE DETAILS
         ================================================== */}
      <AnimatePresence>
        {activeModal === 'profile' && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveModal(null)}
              className="fixed inset-0 bg-black/50 backdrop-blur-xs"
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative z-10 w-full max-w-md bg-[#FAF7F2] rounded-3xl p-6 shadow-2xl border border-[#D5C7B5] space-y-5 text-left"
            >
              <div className="flex items-center justify-between border-b border-[#EFE6DA] pb-3">
                <h3 className="font-serif font-bold text-lg text-[#181818]">
                  Profile Details
                </h3>
                <button 
                  onClick={() => setActiveModal(null)}
                  className="p-1 rounded-full hover:bg-[#EFE6DA] text-[#7A6B5C]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-4">
                
                {/* Avatar Selection */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-[#7A6B5C] tracking-wider uppercase block">
                    Profile Avatar
                  </label>
                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      onClick={() => setProfileForm({ ...profileForm, avatar: 'male' })}
                      className={`flex items-center gap-2 p-2 rounded-xl border transition-all cursor-pointer ${
                        profileForm.avatar === 'male'
                          ? 'border-[#181818] bg-white shadow-xs'
                          : 'border-[#D5C7B5] hover:bg-white'
                      }`}
                    >
                      <div className="w-10 h-10 rounded-full overflow-hidden border border-[#D5C7B5] shadow-xs">
                        <img src="/images/avatar-male.png" alt="Male" className="w-full h-full object-cover" />
                      </div>
                      <span className="text-xs font-bold text-[#181818]">Male</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setProfileForm({ ...profileForm, avatar: 'female' })}
                      className={`flex items-center gap-2 p-2 rounded-xl border transition-all cursor-pointer ${
                        profileForm.avatar === 'female'
                          ? 'border-[#181818] bg-white shadow-xs'
                          : 'border-[#D5C7B5] hover:bg-white'
                      }`}
                    >
                      <div className="w-10 h-10 rounded-full overflow-hidden border border-[#D5C7B5] shadow-xs">
                        <img src="/images/avatar-female.png" alt="Female" className="w-full h-full object-cover" />
                      </div>
                      <span className="text-xs font-bold text-[#181818]">Female</span>
                    </button>
                  </div>
                </div>

                {/* First Name & Last Name */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-[#7A6B5C] tracking-wider uppercase block">
                      First Name
                    </label>
                    <input
                      required
                      type="text"
                      value={profileForm.firstName}
                      onChange={(e) => setProfileForm({ ...profileForm, firstName: e.target.value })}
                      className="w-full bg-white border border-[#D5C7B5] p-2.5 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#181818]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-[#7A6B5C] tracking-wider uppercase block">
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={profileForm.lastName}
                      onChange={(e) => setProfileForm({ ...profileForm, lastName: e.target.value })}
                      className="w-full bg-white border border-[#D5C7B5] p-2.5 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#181818]"
                    />
                  </div>
                </div>

                {/* Email Address (Readonly from session) */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-[#7A6B5C] tracking-wider uppercase block">
                    Email Address
                  </label>
                  <input
                    disabled
                    type="email"
                    value={profileForm.email}
                    className="w-full bg-[#EFE6DA]/60 border border-[#D5C7B5] p-2.5 rounded-xl text-xs font-semibold text-[#7A6B5C] cursor-not-allowed"
                  />
                </div>

                {/* Phone Number */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-[#7A6B5C] tracking-wider uppercase block">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full bg-white border border-[#D5C7B5] p-2.5 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#181818]"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setActiveModal(null)}
                    className="px-4 py-2 border border-[#D5C7B5] rounded-full text-xs font-bold text-[#7A6B5C] hover:bg-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-[#181818] hover:bg-black text-[#FAF7F2] rounded-full text-xs font-bold shadow-sm"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ==================================================
          MODAL 2: MY ADDRESS DETAILS
         ================================================== */}
      <AnimatePresence>
        {activeModal === 'address' && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveModal(null)}
              className="fixed inset-0 bg-black/50 backdrop-blur-xs"
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative z-10 w-full max-w-md bg-[#FAF7F2] rounded-3xl p-6 shadow-2xl border border-[#D5C7B5] space-y-5 text-left max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-[#EFE6DA] pb-3">
                <h3 className="font-serif font-bold text-lg text-[#181818]">
                  Shipping Address
                </h3>
                <button 
                  onClick={() => setActiveModal(null)}
                  className="p-1 rounded-full hover:bg-[#EFE6DA] text-[#7A6B5C]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveAddress} className="space-y-3.5">
                
                {/* Street Name / Flat No */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-[#7A6B5C] tracking-wider uppercase block">
                    Street Name / Apartment / Flat No.
                  </label>
                  <input
                    required
                    type="text"
                    value={addressForm.streetName}
                    onChange={(e) => setAddressForm({ ...addressForm, streetName: e.target.value })}
                    className="w-full bg-white border border-[#D5C7B5] p-2.5 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#181818]"
                  />
                </div>

                {/* Landmark */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-[#7A6B5C] tracking-wider uppercase block">
                    Landmark (Optional)
                  </label>
                  <input
                    type="text"
                    value={addressForm.landmark}
                    onChange={(e) => setAddressForm({ ...addressForm, landmark: e.target.value })}
                    className="w-full bg-white border border-[#D5C7B5] p-2.5 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#181818]"
                  />
                </div>

                {/* City & State */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-[#7A6B5C] tracking-wider uppercase block">
                      City
                    </label>
                    <input
                      required
                      type="text"
                      value={addressForm.city}
                      onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                      className="w-full bg-white border border-[#D5C7B5] p-2.5 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#181818]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-[#7A6B5C] tracking-wider uppercase block">
                      State
                    </label>
                    <input
                      required
                      type="text"
                      value={addressForm.state}
                      onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                      className="w-full bg-white border border-[#D5C7B5] p-2.5 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#181818]"
                    />
                  </div>
                </div>

                {/* Postal Code & Alternate Phone */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-[#7A6B5C] tracking-wider uppercase block">
                      PIN Code (ZIP)
                    </label>
                    <input
                      required
                      type="text"
                      value={addressForm.zip}
                      onChange={(e) => setAddressForm({ ...addressForm, zip: e.target.value })}
                      className="w-full bg-white border border-[#D5C7B5] p-2.5 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#181818]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-[#7A6B5C] tracking-wider uppercase block">
                      Alternate Phone
                    </label>
                    <input
                      type="tel"
                      value={addressForm.otherPhone}
                      onChange={(e) => setAddressForm({ ...addressForm, otherPhone: e.target.value })}
                      className="w-full bg-white border border-[#D5C7B5] p-2.5 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#181818]"
                    />
                  </div>
                </div>

                <div className="pt-3 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setActiveModal(null)}
                    className="px-4 py-2 border border-[#D5C7B5] rounded-full text-xs font-bold text-[#7A6B5C] hover:bg-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-[#181818] hover:bg-black text-[#FAF7F2] rounded-full text-xs font-bold shadow-sm"
                  >
                    Update Address
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ==================================================
          MODAL 3: ORDER HISTORY (REAL SUPABASE ORDERS)
         ================================================== */}
      <AnimatePresence>
        {activeModal === 'orders' && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveModal(null)}
              className="fixed inset-0 bg-black/50 backdrop-blur-xs"
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative z-10 w-full max-w-lg bg-[#FAF7F2] rounded-3xl p-6 shadow-2xl border border-[#D5C7B5] space-y-4 text-left max-h-[85vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-[#EFE6DA] pb-3">
                <div>
                  <h3 className="font-serif font-bold text-lg text-[#181818]">
                    Order History
                  </h3>
                  <p className="text-[11px] text-[#7A6B5C]">
                    All orders placed under this account
                  </p>
                </div>
                <button 
                  onClick={() => setActiveModal(null)}
                  className="p-1 rounded-full hover:bg-[#EFE6DA] text-[#7A6B5C]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {ordersLoading ? (
                <div className="py-12 flex flex-col items-center justify-center space-y-2">
                  <Loader2 className="w-6 h-6 text-[#181818] animate-spin" />
                  <span className="text-xs text-[#7A6B5C]">Retrieving orders...</span>
                </div>
              ) : orders.length === 0 ? (
                <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-[#EFE6DA] flex items-center justify-center text-[#7A6B5C]">
                    <Package className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-serif font-bold text-sm text-[#181818]">No Orders Yet</h4>
                    <p className="text-xs text-[#7A6B5C] max-w-xs">
                      When you acquire items from our Fashion or Numismatics vaults, your orders and tracking details will appear here.
                    </p>
                  </div>
                  <button
                    onClick={() => { setActiveModal(null); router.push('/catalog'); }}
                    className="mt-2 px-5 py-2 bg-[#181818] text-[#FAF7F2] rounded-full text-xs font-bold uppercase tracking-wider hover:bg-black transition-colors"
                  >
                    Explore Catalog
                  </button>
                </div>
              ) : (
                <div className="space-y-3.5">
                  {orders.map((ord) => (
                    <div key={ord.id} className="p-4 bg-white border border-[#D5C7B5] rounded-2xl space-y-3 shadow-xs">
                      <div className="flex items-center justify-between border-b border-[#EFE6DA] pb-2">
                        <div>
                          <span className="font-mono text-xs font-bold text-[#181818]">#{ord.order_number}</span>
                          <span className="text-[10px] text-[#7A6B5C] block">
                            {new Date(ord.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </span>
                        </div>
                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                          ord.status === 'delivered' 
                            ? 'bg-emerald-100 text-emerald-800'
                            : ord.status === 'shipped'
                            ? 'bg-sky-100 text-sky-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {ord.status}
                        </span>
                      </div>

                      {/* Items */}
                      <div className="space-y-2">
                        {Array.isArray(ord.items) && ord.items.map((it, idx) => (
                          <div key={idx} className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-[#FAF7F2] border border-[#D5C7B5] overflow-hidden flex-shrink-0">
                              {it.product_image ? (
                                <img src={it.product_image} alt={it.product_name} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-[9px] text-[#7A6B5C]">item</div>
                              )}
                            </div>
                            <div className="flex-grow min-w-0">
                              <p className="text-xs font-semibold text-[#181818] truncate">{it.product_name}</p>
                              <span className="text-[10px] text-[#7A6B5C]">
                                Qty: {it.quantity} {it.selected_size ? `• Size: ${it.selected_size}` : ''}
                              </span>
                            </div>
                            <span className="text-xs font-bold text-[#181818]">
                              ₹{(Number(it.unit_price) * it.quantity).toLocaleString('en-IN')}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Summary & Actions */}
                      <div className="pt-2 border-t border-[#EFE6DA] flex flex-col sm:flex-row gap-3 sm:items-center justify-between text-xs">
                        <div className="flex gap-2">
                          <button
                            onClick={() => setTrackingOrder(ord)}
                            className="px-4 py-2 bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 rounded-lg font-semibold flex items-center gap-1.5 transition-colors"
                          >
                            <Truck className="w-3.5 h-3.5" /> Track Order
                          </button>
                          <button
                            onClick={() => setHelpOrder(ord)}
                            className="px-4 py-2 bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 rounded-lg font-semibold flex items-center gap-1.5 transition-colors"
                          >
                            <HelpCircle className="w-3.5 h-3.5" /> Help
                          </button>
                        </div>
                        <div className="text-right sm:text-right flex items-center justify-between sm:block">
                          <span className="text-[10px] text-[#7A6B5C] sm:block">Total Amount</span>
                          <span className="font-bold text-sm text-[#181818]">₹{Number(ord.total_amount).toLocaleString('en-IN')}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ==================================================
          MODAL 4: DEVICES (ACTIVE DEVICE SCOPING INFO)
         ================================================== */}
      <AnimatePresence>
        {activeModal === 'devices' && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveModal(null)}
              className="fixed inset-0 bg-black/50 backdrop-blur-xs"
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative z-10 w-full max-w-md bg-[#FAF7F2] rounded-3xl p-6 shadow-2xl border border-[#D5C7B5] space-y-4 text-left"
            >
              <div className="flex items-center justify-between border-b border-[#EFE6DA] pb-3">
                <h3 className="font-serif font-bold text-lg text-[#181818]">
                  Device Security
                </h3>
                <button 
                  onClick={() => setActiveModal(null)}
                  className="p-1 rounded-full hover:bg-[#EFE6DA] text-[#7A6B5C]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 text-xs text-[#181818]">
                <div className="p-4 bg-white border border-[#D5C7B5] rounded-2xl space-y-2">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span className="font-bold text-emerald-800">Current Active Device</span>
                  </div>
                  <p className="font-medium text-xs text-[#181818]">
                    {getDeviceName()}
                  </p>
                  <p className="text-[10px] font-mono text-[#7A6B5C] break-all">
                    Device Identifier: {getDeviceId()}
                  </p>
                  <p className="text-[10px] text-[#7A6B5C]">
                    Your shopping cart and wishlist are cryptographically scoped to your authenticated account and this verified device.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ==================================================
          MODAL 5: NOTIFICATIONS
         ================================================== */}
      <AnimatePresence>
        {activeModal === 'notifications' && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveModal(null)}
              className="fixed inset-0 bg-black/50 backdrop-blur-xs"
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative z-10 w-full max-w-md bg-[#FAF7F2] rounded-3xl p-6 shadow-2xl border border-[#D5C7B5] space-y-4 text-left"
            >
              <div className="flex items-center justify-between border-b border-[#EFE6DA] pb-3">
                <h3 className="font-serif font-bold text-lg text-[#181818]">
                  Notifications
                </h3>
                <button 
                  onClick={() => setActiveModal(null)}
                  className="p-1 rounded-full hover:bg-[#EFE6DA] text-[#7A6B5C]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3">
                <div className="p-3 bg-white border border-[#D5C7B5] rounded-xl space-y-1">
                  <span className="text-[9px] font-bold text-emerald-700 uppercase">Account Verified</span>
                  <p className="text-xs font-semibold text-[#181818]">Your Aadhya session is active and secured with device-scoped encryption.</p>
                </div>
                <div className="p-3 bg-white border border-[#D5C7B5] rounded-xl space-y-1">
                  <span className="text-[9px] font-bold text-[#7A6B5C] uppercase">Curated Access</span>
                  <p className="text-xs font-semibold text-[#181818]">Explore new additions in Heritage Numismatics and Couture Fashion.</p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ==================================================
          MODAL 6: HELP & SUPPORT
         ================================================== */}
      <AnimatePresence>
        {activeModal === 'help' && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveModal(null)}
              className="fixed inset-0 bg-black/50 backdrop-blur-xs"
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative z-10 w-full max-w-md bg-[#FAF7F2] rounded-3xl p-6 shadow-2xl border border-[#D5C7B5] space-y-4 text-left"
            >
              <div className="flex items-center justify-between border-b border-[#EFE6DA] pb-3">
                <h3 className="font-serif font-bold text-lg text-[#181818]">
                  Concierge Support Desk
                </h3>
                <button 
                  onClick={() => setActiveModal(null)}
                  className="p-1 rounded-full hover:bg-[#EFE6DA] text-[#7A6B5C]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 text-xs text-[#181818]">
                <p className="font-medium text-[#7A6B5C]">Dedicated Client Assistance Available 24/7:</p>
                <div className="p-3.5 bg-white rounded-xl border border-[#D5C7B5] space-y-1.5">
                  <p className="font-bold text-[#181818]">Email: concierge@aadhya.com</p>
                  <p className="font-bold text-[#181818]">Phone: +91 (020) 4122-8900</p>
                  <p className="text-[10px] text-[#7A6B5C]">Direct numismatic appraisals & couture fitting guidance.</p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ==================================================
          MODAL 7: ORDER TRACKING
         ================================================== */}
      <AnimatePresence>
        {trackingOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setTrackingOrder(null)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-[#FAF7F2] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
            >
              <div className="flex items-center justify-between p-6 border-b border-[#EFE6DA] bg-white">
                <div>
                  <h3 className="font-serif font-bold text-xl text-[#181818]">Track Order</h3>
                  <p className="text-xs text-[#7A6B5C]">Order #{trackingOrder.order_number}</p>
                </div>
                <button 
                  onClick={() => setTrackingOrder(null)}
                  className="p-2 bg-[#FAF7F2] hover:bg-[#EFE6DA] rounded-full transition-colors"
                >
                  <X className="w-4 h-4 text-[#7A6B5C]" />
                </button>
              </div>

              <div className="overflow-y-auto p-6 space-y-6">
                {/* Timeline */}
                <div className="space-y-6 relative">
                  {trackingOrder.status_history && trackingOrder.status_history.length > 0 ? (
                    <div className="relative pl-6 border-l-2 border-emerald-100 space-y-8">
                      {trackingOrder.status_history.map((step, idx) => (
                        <div key={idx} className="relative">
                          <div className={`absolute -left-[31px] w-4 h-4 rounded-full border-4 border-white ${
                            idx === trackingOrder.status_history!.length - 1 && step.status !== 'DELIVERED'
                              ? 'bg-amber-400' 
                              : 'bg-emerald-500'
                          }`} />
                          <div className="space-y-1">
                            <div className="flex items-center justify-between">
                              <h4 className="font-bold text-sm text-[#181818] capitalize">
                                {step.status === 'PENDING' ? 'Order Received' : step.status.replace('_', ' ').toLowerCase()}
                              </h4>
                              <span className="text-[10px] text-[#7A6B5C] bg-white px-2 py-0.5 rounded-full border border-[#EFE6DA]">
                                {new Date(step.timestamp).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} • {new Date(step.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                            {step.note && <p className="text-xs text-[#7A6B5C] italic">{step.note}</p>}
                            {step.courier && step.tracking_number && (
                              <div className="mt-2 p-3 bg-white rounded-xl border border-[#EFE6DA] text-xs">
                                <span className="text-[#7A6B5C]">Courier:</span> <span className="font-semibold text-[#181818]">{step.courier}</span><br />
                                <span className="text-[#7A6B5C]">Tracking ID:</span> <span className="font-mono font-bold text-[#181818]">{step.tracking_number}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center p-6 bg-white rounded-2xl border border-[#EFE6DA]">
                      <Clock className="w-8 h-8 text-[#7A6B5C] mx-auto mb-2 opacity-20" />
                      <p className="text-sm font-semibold text-[#181818]">Timeline unavailable</p>
                      <p className="text-xs text-[#7A6B5C]">Detailed tracking steps are not yet recorded for this order.</p>
                    </div>
                  )}
                </div>
                
                {/* Expected Delivery */}
                {trackingOrder.expected_delivery_date && (
                   <div className="p-4 bg-emerald-50/50 border border-emerald-100 rounded-2xl flex items-center justify-between">
                     <div className="flex items-center gap-3">
                       <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                         <Truck className="w-4 h-4 text-emerald-600" />
                       </div>
                       <div>
                         <p className="text-[10px] text-emerald-800 font-semibold uppercase tracking-wider">Expected Delivery</p>
                         <p className="text-sm font-bold text-emerald-950">
                           {new Date(trackingOrder.expected_delivery_date).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
                         </p>
                       </div>
                     </div>
                   </div>
                )}

                {/* Items Summary */}
                <div className="space-y-3">
                  <h4 className="font-bold text-xs text-[#181818] uppercase tracking-wider">Order Items</h4>
                  <div className="space-y-2">
                    {trackingOrder.items.map((it, idx) => (
                      <div key={idx} className="flex items-center gap-3 p-3 bg-white rounded-xl border border-[#EFE6DA]">
                        <div className="w-12 h-12 rounded-lg bg-[#FAF7F2] border border-[#D5C7B5] overflow-hidden flex-shrink-0">
                          {it.product_image ? (
                            <img src={it.product_image} alt={it.product_name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[9px] text-[#7A6B5C]">item</div>
                          )}
                        </div>
                        <div className="flex-grow min-w-0">
                          <p className="text-xs font-semibold text-[#181818] truncate">{it.product_name}</p>
                          <span className="text-[10px] text-[#7A6B5C]">
                            Qty: {it.quantity} {it.selected_size ? `• Size: ${it.selected_size}` : ''}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ==================================================
          MODAL 8: ORDER HELP / SUPPORT
         ================================================== */}
      <AnimatePresence>
        {helpOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setHelpOrder(null)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-[#FAF7F2] rounded-3xl shadow-2xl overflow-hidden flex flex-col"
            >
              <div className="flex items-center justify-between p-6 border-b border-[#EFE6DA] bg-white">
                <div>
                  <h3 className="font-serif font-bold text-xl text-[#181818]">Get Help</h3>
                  <p className="text-xs text-[#7A6B5C]">Order #{helpOrder.order_number}</p>
                </div>
                <button 
                  onClick={() => setHelpOrder(null)}
                  className="p-2 bg-[#FAF7F2] hover:bg-[#EFE6DA] rounded-full transition-colors"
                >
                  <X className="w-4 h-4 text-[#7A6B5C]" />
                </button>
              </div>

              <form onSubmit={handleHelpSubmit} className="p-6 space-y-5">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-[#7A6B5C] uppercase tracking-wider">Issue Category</label>
                  <div className="relative">
                    <select
                      value={helpCategory}
                      onChange={(e) => setHelpCategory(e.target.value)}
                      className="w-full bg-white border border-[#D5C7B5] px-4 py-3 rounded-xl text-xs font-semibold text-[#181818] appearance-none focus:outline-none focus:border-[#cca05b]"
                    >
                      <option value="Order Issue">Order Issue</option>
                      <option value="Delivery Problem">Delivery Problem</option>
                      <option value="Return/Refund">Return/Refund</option>
                      <option value="Product Quality">Product Quality</option>
                      <option value="Other">Other</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                      <ChevronRight className="w-4 h-4 text-[#7A6B5C] rotate-90" />
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-[#7A6B5C] uppercase tracking-wider">Subject</label>
                  <input
                    type="text"
                    required
                    value={helpSubject}
                    onChange={(e) => setHelpSubject(e.target.value)}
                    placeholder="Briefly describe the issue..."
                    className="w-full bg-white border border-[#D5C7B5] px-4 py-3 rounded-xl text-xs font-semibold text-[#181818] focus:outline-none focus:border-[#cca05b]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-[#7A6B5C] uppercase tracking-wider">Detailed Description</label>
                  <textarea
                    required
                    value={helpDescription}
                    onChange={(e) => setHelpDescription(e.target.value)}
                    rows={4}
                    placeholder="Please provide any relevant details..."
                    className="w-full bg-white border border-[#D5C7B5] px-4 py-3 rounded-xl text-xs font-medium text-[#181818] resize-none focus:outline-none focus:border-[#cca05b]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={helpSubmitting}
                  className="w-full bg-[#181818] text-[#cca05b] py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-black transition-colors disabled:opacity-50 flex items-center justify-center space-x-2 shadow-xl"
                >
                  {helpSubmitting ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /><span>Submitting...</span></>
                  ) : (
                    <span>Submit Request</span>
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
