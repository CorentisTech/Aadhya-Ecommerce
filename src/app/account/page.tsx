"use client";

import React, { useState, useEffect } from 'react';
import { useApp, UserDetails } from '@/context/AppContext';
import { 
  User, 
  MapPin, 
  Bell, 
  ShoppingBag, 
  Heart, 
  LifeBuoy, 
  HelpCircle, 
  LogOut, 
  ArrowLeft,
  ChevronRight,
  Edit2,
  Check,
  X,
  Mail,
  Phone,
  Lock,
  Trash2,
  Smartphone,
  Key,
  Globe
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

export default function AccountPage() {
  const router = useRouter();
  const { 
    user, 
    isLoggedIn, 
    loginUser, 
    logoutUser, 
    registerUser, 
    updateUserDetails, 
    deleteUserAccount,
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
  const [activeModal, setActiveModal] = useState<'profile' | 'address' | 'orders' | 'notifications' | 'help' | null>(null);
  const [isSavedToast, setIsSavedToast] = useState(false);

  // Authentication screen states if user is not logged in
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [authEmail, setAuthEmail] = useState('');
  const [authOtp, setAuthOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpError, setOtpError] = useState(false);

  // Editable Profile Form State
  const [profileForm, setProfileForm] = useState({
    firstName: user?.firstName || 'Miranda',
    lastName: user?.lastName || 'West',
    email: user?.email || 'miranda.west@example.com',
    phone: user?.phone || '+91 98765 43210',
    avatar: (user?.avatar || 'female') as 'male' | 'female'
  });

  // Editable Address Form State (keeping all previous details)
  const [addressForm, setAddressForm] = useState({
    streetName: user?.streetName || 'Villa 42, Palm Avenue',
    landmark: user?.landmark || 'Near Koregaon Park Garden',
    city: user?.city || 'Pune',
    state: user?.state || 'Maharashtra',
    zip: user?.zip || '411001',
    otherPhone: user?.otherPhone || '+91 91234 56789'
  });

  // Sync state when user object updates
  useEffect(() => {
    if (user) {
      setProfileForm({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        avatar: user.avatar || 'female'
      });
      setAddressForm({
        streetName: user.streetName || 'Villa 42, Palm Avenue',
        landmark: user.landmark || 'Near Koregaon Park Garden',
        city: user.city || 'Pune',
        state: user.state || 'Maharashtra',
        zip: user.zip || '411001',
        otherPhone: user.otherPhone || '+91 91234 56789'
      });
    }
  }, [user]);

  // Handle saving basic profile details
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserDetails({
      firstName: profileForm.firstName,
      lastName: profileForm.lastName,
      email: profileForm.email,
      phone: profileForm.phone,
      avatar: profileForm.avatar
    });
    setActiveModal(null);
    setIsSavedToast(true);
    setTimeout(() => setIsSavedToast(false), 2500);
  };

  // Quick avatar switch
  const handleSwitchAvatar = (newAvatar: 'male' | 'female') => {
    setProfileForm(prev => ({ ...prev, avatar: newAvatar }));
    updateUserDetails({ avatar: newAvatar });
  };

  // Handle saving address details
  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    const fullAddress = `${addressForm.streetName}, ${addressForm.landmark ? addressForm.landmark + ', ' : ''}${addressForm.city}, ${addressForm.state} - ${addressForm.zip}`;
    updateUserDetails({
      address: fullAddress,
      streetName: addressForm.streetName,
      landmark: addressForm.landmark,
      city: addressForm.city,
      state: addressForm.state,
      zip: addressForm.zip,
      otherPhone: addressForm.otherPhone
    });
    setActiveModal(null);
    setIsSavedToast(true);
    setTimeout(() => setIsSavedToast(false), 2500);
  };

  // Auth flow for non-logged in users
  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpSent) {
      if (authEmail) setOtpSent(true);
      return;
    }
    if (authOtp === '1234' || authOtp.length === 4) {
      if (authMode === 'login') {
        loginUser(authEmail);
      } else {
        registerUser({
          email: authEmail,
          firstName: 'Miranda',
          lastName: 'West',
          phone: '+91 98765 43210',
          address: 'Villa 42, Palm Avenue, Pune - 411001',
          zip: '411001',
          state: 'Maharashtra',
          city: 'Pune',
          streetName: 'Villa 42, Palm Avenue',
          avatar: 'female'
        });
      }
    } else {
      setOtpError(true);
    }
  };

  const currentAvatar = user?.avatar || profileForm.avatar;
  const displayName = user ? `${user.firstName} ${user.lastName}` : `${profileForm.firstName} ${profileForm.lastName}`;
  const displayFirstName = user?.firstName || profileForm.firstName;
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen bg-[#ECE8E1] py-4 sm:py-8 px-3 sm:px-4 flex items-center justify-center select-none text-[#2B231D]">
      
      {/* Toast Alert */}
      {isSavedToast && (
        <div className="fixed top-6 z-50 bg-[#1A1A1A] text-white px-5 py-2.5 rounded-full text-xs font-bold shadow-2xl flex items-center gap-2 animate-bounce">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>Profile details saved successfully</span>
        </div>
      )}

      {/* Main Mobile/App Container Frame (Exact layout from media_1788456191322.png) */}
      <div className="w-full max-w-[420px] bg-[#F9F8F6] rounded-[36px] shadow-2xl overflow-hidden border border-[#DED7CB] flex flex-col relative">

        {/* ==================================================
            1. TOP HERO BANNER (Gradient colors & texture, NO bag/chair)
           ================================================== */}
        <div 
          className="w-full h-64 sm:h-72 relative overflow-hidden flex flex-col items-center justify-between p-5 text-white"
          style={{
            background: 'radial-gradient(circle at 50% 15%, #544439 0%, #2E221B 55%, #18120F 100%)',
          }}
        >
          {/* Subtle noise/texture overlay */}
          <div 
            className="absolute inset-0 opacity-15 pointer-events-none mix-blend-overlay"
            style={{
              backgroundImage: `radial-gradient(#F26A2E 0.75px, transparent 0.75px)`,
              backgroundSize: '12px 12px'
            }}
          />

          {/* Top Bar Actions (Matching Reference Image) */}
          <div className="w-full flex items-center justify-between relative z-10">
            {/* Back Button */}
            <button
              onClick={() => router.back()}
              className="w-9 h-9 rounded-full bg-black/25 backdrop-blur-md flex items-center justify-center text-white/90 hover:text-white hover:bg-black/40 transition-all cursor-pointer"
              aria-label="Go Back"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>

            {/* Wishlist and Cart Bag with Red Dot */}
            <div className="flex items-center space-x-2.5">
              <button
                onClick={() => router.push('/wishlist')}
                className="w-9 h-9 rounded-full bg-black/25 backdrop-blur-md flex items-center justify-center text-white/90 hover:text-white hover:bg-black/40 transition-all cursor-pointer relative"
                aria-label="Wishlist"
              >
                <Heart className="w-4 h-4" />
                {wishlist.length > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-[#E0591D] rounded-full ring-2 ring-black" />
                )}
              </button>

              <button
                onClick={() => router.push('/cart')}
                className="w-9 h-9 rounded-full bg-black/25 backdrop-blur-md flex items-center justify-center text-white/90 hover:text-white hover:bg-black/40 transition-all cursor-pointer relative"
                aria-label="Shopping Cart"
              >
                <ShoppingBag className="w-4 h-4" />
                {cartCount > 0 && (
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-black" />
                )}
              </button>
            </div>
          </div>

          {/* Center Profile Avatar Placeholder (No photo upload, strictly male/female avatar) */}
          <div className="flex flex-col items-center relative z-10 -mt-2">
            <div className="relative">
              <div className="w-20 h-20 sm:w-22 sm:h-22 rounded-full border-[3.5px] border-white/95 shadow-xl overflow-hidden bg-white flex items-center justify-center">
                <img
                  src={currentAvatar === 'male' ? '/images/avatar-male.png' : '/images/avatar-female.png'}
                  alt={currentAvatar === 'male' ? 'Male Avatar' : 'Female Avatar'}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Quick toggle indicator */}
              <button
                onClick={() => handleSwitchAvatar(currentAvatar === 'male' ? 'female' : 'male')}
                className="absolute bottom-0 right-0 p-1.5 bg-[#1A1A1A] text-white rounded-full border-2 border-white shadow-md hover:scale-110 transition-transform cursor-pointer"
                title="Toggle Male/Female Avatar"
              >
                <Edit2 className="w-2.5 h-2.5" />
              </button>
            </div>

            {/* Dynamic Greeting & User Name */}
            <div className="text-center pt-2 space-y-0.5">
              <h1 className="font-display font-bold text-lg sm:text-xl text-white tracking-tight drop-shadow-xs">
                {greeting}, {displayFirstName}
              </h1>
              <p className="text-[10px] text-white/80 font-medium tracking-wide max-w-[260px] italic">
                Work hard in silence. Let your success be the noise.
              </p>
            </div>
          </div>

          {/* Avatar Switcher Pills */}
          <div className="flex items-center gap-2 pb-1 relative z-10">
            <button
              onClick={() => handleSwitchAvatar('male')}
              className={`px-3 py-0.5 rounded-full text-[9px] font-bold tracking-wider uppercase transition-all cursor-pointer ${
                currentAvatar === 'male'
                  ? 'bg-sky-500 text-white shadow-xs'
                  : 'bg-black/30 text-white/70 hover:text-white'
              }`}
            >
              Male
            </button>
            <button
              onClick={() => handleSwitchAvatar('female')}
              className={`px-3 py-0.5 rounded-full text-[9px] font-bold tracking-wider uppercase transition-all cursor-pointer ${
                currentAvatar === 'female'
                  ? 'bg-pink-500 text-white shadow-xs'
                  : 'bg-black/30 text-white/70 hover:text-white'
              }`}
            >
              Female
            </button>
          </div>
        </div>

        {/* ==================================================
            2. CARD LIST SECTIONS (Exact design from media_1788456191322.png)
           ================================================== */}
        <div className="p-4 sm:p-5 space-y-3.5 -mt-3 relative z-20">

          {/* CARD GROUP 1: My Address & Account */}
          <div className="bg-white rounded-2xl shadow-xs border border-[#EAE4D8] overflow-hidden divide-y divide-[#F2EDE4]">
            
            {/* My Address */}
            <button
              onClick={() => setActiveModal('address')}
              className="w-full p-4 flex items-center justify-between hover:bg-[#FAF8F5] transition-colors text-left cursor-pointer group"
            >
              <div className="flex items-center space-x-3.5">
                <div className="w-8 h-8 rounded-full bg-[#FAF6F0] flex items-center justify-center text-[#8C827A] group-hover:text-[#E0591D] transition-colors">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs sm:text-[13px] font-bold text-[#2B231D] block">
                    My Address
                  </span>
                  <span className="text-[10px] text-[#8C827A] font-medium block truncate max-w-[200px]">
                    {addressForm.streetName}, {addressForm.city}
                  </span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-[#B8AEA4] group-hover:text-[#2B231D] transition-colors" />
            </button>

            {/* Account Details */}
            <button
              onClick={() => setActiveModal('profile')}
              className="w-full p-4 flex items-center justify-between hover:bg-[#FAF8F5] transition-colors text-left cursor-pointer group"
            >
              <div className="flex items-center space-x-3.5">
                <div className="w-8 h-8 rounded-full bg-[#FAF6F0] flex items-center justify-center text-[#8C827A] group-hover:text-[#E0591D] transition-colors">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs sm:text-[13px] font-bold text-[#2B231D] block">
                    Account
                  </span>
                  <span className="text-[10px] text-[#8C827A] font-medium block truncate max-w-[200px]">
                    {displayName} • {profileForm.phone}
                  </span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-[#B8AEA4] group-hover:text-[#2B231D] transition-colors" />
            </button>

          </div>

          {/* CARD GROUP 2: Notifications, Orders, Passwords, Language */}
          <div className="bg-white rounded-2xl shadow-xs border border-[#EAE4D8] overflow-hidden divide-y divide-[#F2EDE4]">
            
            {/* Notifications */}
            <button
              onClick={() => setActiveModal('notifications')}
              className="w-full p-4 flex items-center justify-between hover:bg-[#FAF8F5] transition-colors text-left cursor-pointer group"
            >
              <div className="flex items-center space-x-3.5">
                <div className="w-8 h-8 rounded-full bg-[#FAF6F0] flex items-center justify-center text-[#8C827A] group-hover:text-[#E0591D] transition-colors">
                  <Bell className="w-4 h-4" />
                </div>
                <span className="text-xs sm:text-[13px] font-bold text-[#2B231D]">
                  Notifications
                </span>
              </div>
              <ChevronRight className="w-4 h-4 text-[#B8AEA4] group-hover:text-[#2B231D] transition-colors" />
            </button>

            {/* Order History */}
            <button
              onClick={() => setActiveModal('orders')}
              className="w-full p-4 flex items-center justify-between hover:bg-[#FAF8F5] transition-colors text-left cursor-pointer group"
            >
              <div className="flex items-center space-x-3.5">
                <div className="w-8 h-8 rounded-full bg-[#FAF6F0] flex items-center justify-center text-[#8C827A] group-hover:text-[#E0591D] transition-colors">
                  <ShoppingBag className="w-4 h-4" />
                </div>
                <span className="text-xs sm:text-[13px] font-bold text-[#2B231D]">
                  Order History
                </span>
              </div>
              <ChevronRight className="w-4 h-4 text-[#B8AEA4] group-hover:text-[#2B231D] transition-colors" />
            </button>

            {/* Devices */}
            <button
              onClick={() => alert("Current device: Active Web Session (Secured)")}
              className="w-full p-4 flex items-center justify-between hover:bg-[#FAF8F5] transition-colors text-left cursor-pointer group"
            >
              <div className="flex items-center space-x-3.5">
                <div className="w-8 h-8 rounded-full bg-[#FAF6F0] flex items-center justify-center text-[#8C827A] group-hover:text-[#E0591D] transition-colors">
                  <Smartphone className="w-4 h-4" />
                </div>
                <span className="text-xs sm:text-[13px] font-bold text-[#2B231D]">
                  Devices
                </span>
              </div>
              <ChevronRight className="w-4 h-4 text-[#B8AEA4] group-hover:text-[#2B231D] transition-colors" />
            </button>

            {/* Passwords / Security */}
            <button
              onClick={() => alert("Passwordless OTP authentication is active on your email.")}
              className="w-full p-4 flex items-center justify-between hover:bg-[#FAF8F5] transition-colors text-left cursor-pointer group"
            >
              <div className="flex items-center space-x-3.5">
                <div className="w-8 h-8 rounded-full bg-[#FAF6F0] flex items-center justify-center text-[#8C827A] group-hover:text-[#E0591D] transition-colors">
                  <Key className="w-4 h-4" />
                </div>
                <span className="text-xs sm:text-[13px] font-bold text-[#2B231D]">
                  Passwords
                </span>
              </div>
              <ChevronRight className="w-4 h-4 text-[#B8AEA4] group-hover:text-[#2B231D] transition-colors" />
            </button>

            {/* Language */}
            <button
              onClick={() => alert("Language: English (US / India)")}
              className="w-full p-4 flex items-center justify-between hover:bg-[#FAF8F5] transition-colors text-left cursor-pointer group"
            >
              <div className="flex items-center space-x-3.5">
                <div className="w-8 h-8 rounded-full bg-[#FAF6F0] flex items-center justify-center text-[#8C827A] group-hover:text-[#E0591D] transition-colors">
                  <Globe className="w-4 h-4" />
                </div>
                <span className="text-xs sm:text-[13px] font-bold text-[#2B231D]">
                  Language
                </span>
              </div>
              <ChevronRight className="w-4 h-4 text-[#B8AEA4] group-hover:text-[#2B231D] transition-colors" />
            </button>

          </div>

          {/* CARD GROUP 3: Help & Support & Sign Out */}
          <div className="bg-white rounded-2xl shadow-xs border border-[#EAE4D8] overflow-hidden divide-y divide-[#F2EDE4]">
            
            <button
              onClick={() => setActiveModal('help')}
              className="w-full p-4 flex items-center justify-between hover:bg-[#FAF8F5] transition-colors text-left cursor-pointer group"
            >
              <div className="flex items-center space-x-3.5">
                <div className="w-8 h-8 rounded-full bg-[#FAF6F0] flex items-center justify-center text-[#8C827A] group-hover:text-[#E0591D] transition-colors">
                  <LifeBuoy className="w-4 h-4" />
                </div>
                <span className="text-xs sm:text-[13px] font-bold text-[#2B231D]">
                  Help & Support
                </span>
              </div>
              <ChevronRight className="w-4 h-4 text-[#B8AEA4] group-hover:text-[#2B231D] transition-colors" />
            </button>

            <button
              onClick={() => {
                logoutUser();
                router.push('/');
              }}
              className="w-full p-4 flex items-center justify-between hover:bg-red-50/50 transition-colors text-left cursor-pointer group"
            >
              <div className="flex items-center space-x-3.5">
                <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center text-red-500">
                  <LogOut className="w-4 h-4" />
                </div>
                <span className="text-xs sm:text-[13px] font-bold text-red-600">
                  Log Out
                </span>
              </div>
              <ChevronRight className="w-4 h-4 text-red-400" />
            </button>

          </div>

        </div>

      </div>

      {/* ==================================================
          MODAL 1: EDIT ACCOUNT DETAILS
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
              className="relative z-10 w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-[#EAE4D8] space-y-5 text-left"
            >
              <div className="flex items-center justify-between border-b border-[#F0EAE1] pb-3">
                <h3 className="font-display font-bold text-lg text-[#2B231D]">
                  Basic Profile Details
                </h3>
                <button 
                  onClick={() => setActiveModal(null)}
                  className="p-1 rounded-full hover:bg-[#FAF7F2] text-[#7D736A]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-4">
                
                {/* Avatar Selection */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-extrabold text-[#7D736A] tracking-wider uppercase block">
                    Profile Avatar
                  </label>
                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      onClick={() => setProfileForm({ ...profileForm, avatar: 'male' })}
                      className={`flex items-center gap-2 p-2 rounded-xl border transition-all cursor-pointer ${
                        profileForm.avatar === 'male'
                          ? 'border-sky-500 bg-sky-50/50 shadow-xs'
                          : 'border-[#EAE4D8] hover:bg-[#FAF7F2]'
                      }`}
                    >
                      <div className="w-10 h-10 rounded-full overflow-hidden border border-white shadow-xs">
                        <img src="/images/avatar-male.png" alt="Male" className="w-full h-full object-cover" />
                      </div>
                      <span className="text-xs font-bold text-[#2B231D]">Male</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setProfileForm({ ...profileForm, avatar: 'female' })}
                      className={`flex items-center gap-2 p-2 rounded-xl border transition-all cursor-pointer ${
                        profileForm.avatar === 'female'
                          ? 'border-pink-500 bg-pink-50/50 shadow-xs'
                          : 'border-[#EAE4D8] hover:bg-[#FAF7F2]'
                      }`}
                    >
                      <div className="w-10 h-10 rounded-full overflow-hidden border border-white shadow-xs">
                        <img src="/images/avatar-female.png" alt="Female" className="w-full h-full object-cover" />
                      </div>
                      <span className="text-xs font-bold text-[#2B231D]">Female</span>
                    </button>
                  </div>
                </div>

                {/* First Name & Last Name */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-extrabold text-[#7D736A] tracking-wider uppercase block">
                      First Name
                    </label>
                    <input
                      required
                      type="text"
                      value={profileForm.firstName}
                      onChange={(e) => setProfileForm({ ...profileForm, firstName: e.target.value })}
                      className="w-full bg-[#FAF8F5] border border-[#EAE4D8] p-2.5 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#E0591D]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-extrabold text-[#7D736A] tracking-wider uppercase block">
                      Last Name
                    </label>
                    <input
                      required
                      type="text"
                      value={profileForm.lastName}
                      onChange={(e) => setProfileForm({ ...profileForm, lastName: e.target.value })}
                      className="w-full bg-[#FAF8F5] border border-[#EAE4D8] p-2.5 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#E0591D]"
                    />
                  </div>
                </div>

                {/* Email Address */}
                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold text-[#7D736A] tracking-wider uppercase block">
                    Email Address
                  </label>
                  <input
                    required
                    type="email"
                    value={profileForm.email}
                    onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                    className="w-full bg-[#FAF8F5] border border-[#EAE4D8] p-2.5 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#E0591D]"
                  />
                </div>

                {/* Phone Number */}
                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold text-[#7D736A] tracking-wider uppercase block">
                    Phone Number
                  </label>
                  <input
                    required
                    type="tel"
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                    className="w-full bg-[#FAF8F5] border border-[#EAE4D8] p-2.5 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#E0591D]"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setActiveModal(null)}
                    className="px-4 py-2 border border-[#EAE4D8] rounded-full text-xs font-bold text-[#7D736A] hover:bg-[#FAF8F5]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-[#E0591D] hover:bg-[#C84B15] text-white rounded-full text-xs font-bold shadow-sm"
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
          MODAL 2: MY ADDRESS DETAILS (Preserves all previous details)
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
              className="relative z-10 w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-[#EAE4D8] space-y-5 text-left max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-[#F0EAE1] pb-3">
                <h3 className="font-display font-bold text-lg text-[#2B231D]">
                  Saved Address Details
                </h3>
                <button 
                  onClick={() => setActiveModal(null)}
                  className="p-1 rounded-full hover:bg-[#FAF7F2] text-[#7D736A]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveAddress} className="space-y-3.5">
                
                {/* Street Name / Flat No */}
                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold text-[#7D736A] tracking-wider uppercase block">
                    Street Name / Flat No.
                  </label>
                  <input
                    required
                    type="text"
                    value={addressForm.streetName}
                    onChange={(e) => setAddressForm({ ...addressForm, streetName: e.target.value })}
                    className="w-full bg-[#FAF8F5] border border-[#EAE4D8] p-2.5 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#E0591D]"
                  />
                </div>

                {/* Landmark */}
                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold text-[#7D736A] tracking-wider uppercase block">
                    Landmark
                  </label>
                  <input
                    type="text"
                    value={addressForm.landmark}
                    onChange={(e) => setAddressForm({ ...addressForm, landmark: e.target.value })}
                    className="w-full bg-[#FAF8F5] border border-[#EAE4D8] p-2.5 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#E0591D]"
                  />
                </div>

                {/* City & State */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-extrabold text-[#7D736A] tracking-wider uppercase block">
                      City
                    </label>
                    <input
                      required
                      type="text"
                      value={addressForm.city}
                      onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                      className="w-full bg-[#FAF8F5] border border-[#EAE4D8] p-2.5 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#E0591D]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-extrabold text-[#7D736A] tracking-wider uppercase block">
                      State
                    </label>
                    <input
                      required
                      type="text"
                      value={addressForm.state}
                      onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                      className="w-full bg-[#FAF8F5] border border-[#EAE4D8] p-2.5 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#E0591D]"
                    />
                  </div>
                </div>

                {/* Postal Code & Alternate Phone */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-extrabold text-[#7D736A] tracking-wider uppercase block">
                      PIN Code (ZIP)
                    </label>
                    <input
                      required
                      type="text"
                      value={addressForm.zip}
                      onChange={(e) => setAddressForm({ ...addressForm, zip: e.target.value })}
                      className="w-full bg-[#FAF8F5] border border-[#EAE4D8] p-2.5 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#E0591D]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-extrabold text-[#7D736A] tracking-wider uppercase block">
                      Alternate Phone
                    </label>
                    <input
                      type="tel"
                      value={addressForm.otherPhone}
                      onChange={(e) => setAddressForm({ ...addressForm, otherPhone: e.target.value })}
                      className="w-full bg-[#FAF8F5] border border-[#EAE4D8] p-2.5 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#E0591D]"
                    />
                  </div>
                </div>

                <div className="pt-3 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setActiveModal(null)}
                    className="px-4 py-2 border border-[#EAE4D8] rounded-full text-xs font-bold text-[#7D736A] hover:bg-[#FAF8F5]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-[#E0591D] hover:bg-[#C84B15] text-white rounded-full text-xs font-bold shadow-sm"
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
          MODAL 3: ORDER HISTORY
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
              className="relative z-10 w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-[#EAE4D8] space-y-4 text-left"
            >
              <div className="flex items-center justify-between border-b border-[#F0EAE1] pb-3">
                <h3 className="font-display font-bold text-lg text-[#2B231D]">
                  Order History
                </h3>
                <button 
                  onClick={() => setActiveModal(null)}
                  className="p-1 rounded-full hover:bg-[#FAF7F2] text-[#7D736A]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3">
                <div className="p-3.5 bg-[#FAF8F5] border border-[#EAE4D8] rounded-2xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-[#E0591D]">#ORD-98242</span>
                    <span className="text-[9px] font-bold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full">Delivered</span>
                  </div>
                  <p className="text-xs font-bold text-[#2B231D]">Rose Silk Saree & King George V Silver Rupee</p>
                  <span className="text-[10px] text-[#7D736A] block">Delivered to Pune • Total: ₹14,999</span>
                </div>

                <div className="p-3.5 bg-[#FAF8F5] border border-[#EAE4D8] rounded-2xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-[#E0591D]">#ORD-94101</span>
                    <span className="text-[9px] font-bold px-2 py-0.5 bg-sky-100 text-sky-800 rounded-full">Shipped</span>
                  </div>
                  <p className="text-xs font-bold text-[#2B231D]">Fine Cotton Blazer Dress</p>
                  <span className="text-[10px] text-[#7D736A] block">In Transit • Total: ₹5,499</span>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ==================================================
          MODAL 4: NOTIFICATIONS
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
              className="relative z-10 w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-[#EAE4D8] space-y-4 text-left"
            >
              <div className="flex items-center justify-between border-b border-[#F0EAE1] pb-3">
                <h3 className="font-display font-bold text-lg text-[#2B231D]">
                  Notifications
                </h3>
                <button 
                  onClick={() => setActiveModal(null)}
                  className="p-1 rounded-full hover:bg-[#FAF7F2] text-[#7D736A]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3">
                <div className="p-3 bg-[#FAF8F5] border border-[#EAE4D8] rounded-xl space-y-1">
                  <span className="text-[9px] font-extrabold text-[#E0591D] uppercase">Vault Addition</span>
                  <p className="text-xs font-semibold text-[#2B231D]">New 1835 William IV Double Mohur acquired.</p>
                </div>
                <div className="p-3 bg-[#FAF8F5] border border-[#EAE4D8] rounded-xl space-y-1">
                  <span className="text-[9px] font-extrabold text-emerald-600 uppercase">Order Update</span>
                  <p className="text-xs font-semibold text-[#2B231D]">Your package #ORD-94101 is out for delivery.</p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ==================================================
          MODAL 5: HELP & SUPPORT
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
              className="relative z-10 w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-[#EAE4D8] space-y-4 text-left"
            >
              <div className="flex items-center justify-between border-b border-[#F0EAE1] pb-3">
                <h3 className="font-display font-bold text-lg text-[#2B231D]">
                  Help & Support Desk
                </h3>
                <button 
                  onClick={() => setActiveModal(null)}
                  className="p-1 rounded-full hover:bg-[#FAF7F2] text-[#7D736A]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-2 text-xs text-[#2B231D]">
                <p className="font-semibold">Concierge Support Available 24/7:</p>
                <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#EAE4D8] space-y-1">
                  <p className="font-bold">Email: support@aadhya.com</p>
                  <p className="font-bold">Direct Line: +91 (020) 4122-8900</p>
                  <p className="text-[10px] text-[#7D736A]">Response within 1-2 hours.</p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
