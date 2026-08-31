"use client";

import React, { useState } from 'react';
import { useApp, UserDetails } from '@/context/AppContext';
import { 
  User, 
  ShoppingBag, 
  MapPin, 
  CreditCard, 
  HelpCircle, 
  LifeBuoy, 
  Heart, 
  Trash2, 
  LogOut, 
  ArrowLeft,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ChevronRight,
  Plus,
  Edit,
  Save,
  CheckCircle,
  HelpCircle as FaqIcon
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { NavigationControls } from '@/components/ui/NavigationControls';

type ScreenMode = 'landing' | 'email-verify' | 'register-form';
type AccountTab = 'manage' | 'addresses' | 'payments' | 'orders' | 'help' | 'faqs' | 'delete';

export default function AccountRoute() {
  const router = useRouter();
  const { 
    user, 
    isLoggedIn, 
    loginUser, 
    logoutUser, 
    registerUser, 
    updateUserDetails, 
    deleteUserAccount 
  } = useApp();

  // Authentication screen states
  const [screenMode, setScreenMode] = useState<ScreenMode>('landing');
  const [authAction, setAuthAction] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpError, setOtpError] = useState(false);
  
  // Registration form inputs
  const [regForm, setRegForm] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    zip: '',
    state: 'Maharashtra',
    city: '',
    landmark: '',
    streetName: '',
    otherPhone: '',
    avatar: 'male' as 'male' | 'female',
  });

  // Account dashboard states
  const [activeTab, setActiveTab] = useState<AccountTab>('manage');
  const [editMode, setEditMode] = useState(false);
  const [isSavedAlert, setIsSavedAlert] = useState(false);
  const [supportTicket, setSupportTicket] = useState({ subject: '', message: '' });
  const [ticketRaised, setTicketRaised] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  // Editable forms inside dashboard
  const [accountForm, setAccountForm] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    phone: user?.phone || '',
    email: user?.email || '',
    avatar: user?.avatar || 'male'
  });

  const [addressForm, setAddressForm] = useState({
    streetName: user?.streetName || '',
    landmark: user?.landmark || '',
    city: user?.city || '',
    state: user?.state || '',
    zip: user?.zip || ''
  });

  // Initialize editable forms when user logs in
  React.useEffect(() => {
    if (user) {
      setAccountForm({
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        email: user.email,
        avatar: user.avatar
      });
      setAddressForm({
        streetName: user.streetName,
        landmark: user.landmark || '',
        city: user.city,
        state: user.state,
        zip: user.zip
      });
    }
  }, [user]);

  // Auth Handlers
  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setOtpSent(true);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp === '1234') {
      setOtpError(false);
      if (authAction === 'login') {
        loginUser(email);
      } else {
        setScreenMode('register-form');
      }
    } else {
      setOtpError(true);
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newUser: UserDetails = {
      email,
      firstName: regForm.firstName,
      lastName: regForm.lastName,
      phone: regForm.phone,
      address: regForm.address,
      zip: regForm.zip,
      state: regForm.state,
      city: regForm.city,
      landmark: regForm.landmark,
      streetName: regForm.streetName,
      otherPhone: regForm.otherPhone,
      avatar: regForm.avatar
    };
    registerUser(newUser);
  };

  const handleSaveAccount = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserDetails(accountForm);
    setEditMode(false);
    setIsSavedAlert(true);
    setTimeout(() => setIsSavedAlert(false), 3000);
  };

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserDetails({
      address: `${addressForm.streetName}, ${addressForm.landmark ? addressForm.landmark + ', ' : ''}${addressForm.city}, ${addressForm.state} - ${addressForm.zip}`,
      streetName: addressForm.streetName,
      landmark: addressForm.landmark,
      city: addressForm.city,
      state: addressForm.state,
      zip: addressForm.zip
    });
    setEditMode(false);
    setIsSavedAlert(true);
    setTimeout(() => setIsSavedAlert(false), 3000);
  };

  const handleRaiseTicket = (e: React.FormEvent) => {
    e.preventDefault();
    setTicketRaised(true);
    setSupportTicket({ subject: '', message: '' });
    setTimeout(() => setTicketRaised(false), 4000);
  };

  const faqs = [
    { q: "How long does shipping take?", a: "Standard courier post takes 3-5 business days. Rare heritage coin packages are fully insured and require signature confirmation upon delivery." },
    { q: "Can I edit custom sizing after ordering?", a: "Sizing details can be edited within 12 hours of placing your order. Reach out directly using our support ticket page." },
    { q: "What is your return policy?", a: "We offer a 7-day hassle-free return window for unworn items in original packaging. Heritage coins and certified numismatic collections are subject to strict anti-tamper tag verification." }
  ];

  // Helper avatar graphics (SVGs)
  const AvatarIcon = ({ type, className = "w-16 h-16" }: { type: 'male' | 'female', className?: string }) => {
    if (type === 'male') {
      return (
        <svg className={`${className} text-[#F26A2E] bg-[#FFF3EC] rounded-full p-1.5`} viewBox="0 0 24 24" fill="currentColor">
          <circle cx="12" cy="8" r="4" />
          <path d="M12 14c-4.42 0-8 2.24-8 5v1h16v-1c0-2.76-3.58-5-8-5z" />
        </svg>
      );
    }
    return (
      <svg className={`${className} text-[#F26A2E] bg-[#FFF3EC] rounded-full p-1.5`} viewBox="0 0 24 24" fill="currentColor">
        <circle cx="12" cy="8" r="3.5" />
        <path d="M12 13c-3.87 0-7 2.13-7 4.75v1.25h14v-1.25c0-2.62-3.13-4.75-7-4.75z" />
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
      </svg>
    );
  };

  // --- RENDERING AUTHENTICATION FLOW ---
  if (!isLoggedIn) {
    return (
      <div className="w-full min-h-screen bg-[#FCFAF7] flex items-center justify-center py-12 px-4 select-none">
        <div className="bg-white w-full max-w-sm rounded-3xl p-6 md:p-8 shadow-xl border border-brand-border/30 text-center space-y-6">
          
          {/* Brand Logo Header */}
          <div className="space-y-1">
            <h1 className="font-display font-bold text-3xl text-brand-espresso tracking-widest uppercase">
              AADHYA
            </h1>
            <span className="text-[9px] font-bold text-brand-warmGray tracking-[0.25em] uppercase block">
              Heritage & Couture
            </span>
          </div>

          {/* SCREEN 1: LANDING */}
          {screenMode === 'landing' && (
            <div className="space-y-6">
              
              {/* SVG illustration matching laptop coaching/welcome vector */}
              <div className="w-full flex justify-center py-4">
                <svg className="w-36 h-36 text-brand-espresso" viewBox="0 0 100 100" fill="none">
                  {/* Laptop base */}
                  <rect x="25" y="65" width="50" height="4" rx="2" fill="currentColor" />
                  <path d="M28 69h44l-2 3H30l-2-3z" fill="currentColor" opacity="0.8" />
                  {/* Laptop screen */}
                  <rect x="30" y="35" width="40" height="28" rx="2" fill="none" stroke="currentColor" strokeWidth="2.5" />
                  {/* Person Head & headphones */}
                  <circle cx="50" cy="22" r="7" fill="none" stroke="currentColor" strokeWidth="2" />
                  <path d="M41 22a9 9 0 0 1 18 0M41 21v2M59 21v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  {/* Glasses */}
                  <circle cx="47" cy="22" r="1.5" stroke="currentColor" strokeWidth="1" />
                  <circle cx="53" cy="22" r="1.5" stroke="currentColor" strokeWidth="1" />
                  <line x1="48.5" y1="22" x2="51.5" y2="22" stroke="currentColor" strokeWidth="1" />
                  {/* Person body */}
                  <path d="M38 48c0-8 6-10 12-10s12 2 12 10v12H38V48z" fill="none" stroke="currentColor" strokeWidth="2" />
                  {/* Tiny hands */}
                  <circle cx="35" cy="50" r="2" fill="currentColor" />
                  <circle cx="65" cy="50" r="2" fill="currentColor" />
                </svg>
              </div>

              <div className="space-y-1">
                <h2 className="font-display font-bold text-lg text-brand-espresso tracking-tight">
                  {authAction === 'signup' ? 'Welcome' : 'Welcome Back'}
                </h2>
                <p className="text-[10px] text-brand-warmGray font-bold tracking-wider leading-relaxed px-4">
                  Discover fine custom silk couture and certified vintage collections.
                </p>
              </div>

              {/* Social Buttons */}
              <div className="space-y-2 pt-2">
                <button 
                  onClick={() => setScreenMode('email-verify')}
                  className="w-full py-3 bg-brand-white border border-brand-border/60 text-brand-espresso text-[10px] font-extrabold tracking-widest uppercase hover:bg-brand-softBeige/20 rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  <Mail className="w-3.5 h-3.5 text-[#F26A2E]" />
                  <span>Continue with Email</span>
                </button>

                <button 
                  onClick={() => alert("Google sign in triggered")}
                  className="w-full py-3 bg-[#FCFAF7] border border-brand-border/30 text-brand-espresso text-[10px] font-extrabold tracking-widest uppercase hover:opacity-90 rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  <span className="text-[#EA4335] font-bold">G</span>
                  <span>Continue with Google</span>
                </button>

                <button 
                  onClick={() => alert("Apple sign in triggered")}
                  className="w-full py-3 bg-[#383230] text-white text-[10px] font-extrabold tracking-widest uppercase hover:opacity-95 rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  <span className="text-white"></span>
                  <span>Continue with Apple</span>
                </button>

                <button 
                  onClick={() => {
                    loginUser("guest@aadhya.com");
                  }}
                  className="w-full py-3 bg-brand-white border border-brand-border/40 text-brand-warmGray text-[10px] font-extrabold tracking-widest uppercase hover:bg-brand-softBeige/15 rounded-xl transition-all flex items-center justify-center"
                >
                  <span>Continue As Guest</span>
                </button>
              </div>

              {/* Footer Switch */}
              <div className="pt-2">
                <button
                  onClick={() => setAuthAction(authAction === 'login' ? 'signup' : 'login')}
                  className="text-[10px] font-bold text-brand-warmGray hover:text-[#F26A2E] tracking-wider uppercase transition-colors"
                >
                  {authAction === 'login' 
                    ? "Need an account? Sign up" 
                    : "Already have an account? Log in"}
                </button>
              </div>

            </div>
          )}

          {/* SCREEN 2: EMAIL & OTP VERIFICATION */}
          {screenMode === 'email-verify' && (
            <div className="space-y-6">
              
              <div className="space-y-1">
                <h2 className="font-display font-bold text-lg text-brand-espresso tracking-tight">
                  {authAction === 'signup' ? 'Welcome' : 'Welcome Back'}
                </h2>
                <p className="text-[10px] text-brand-warmGray font-bold tracking-wider uppercase">
                  Please verify with OTP
                </p>
              </div>

              {!otpSent ? (
                // Step 1: Send OTP
                <form onSubmit={handleSendOtp} className="space-y-4">
                  <div className="space-y-1.5 text-left">
                    <label className="text-[9px] font-extrabold text-brand-warmGray tracking-widest uppercase block">Email Address</label>
                    <div className="relative">
                      <input
                        required
                        type="email"
                        placeholder="ananya.sharma@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-brand-warmWhite border border-brand-border/60 p-3 rounded-xl text-xs outline-none focus:border-[#F26A2E] font-semibold pl-10"
                      />
                      <Mail className="w-4 h-4 text-brand-warmGray absolute left-3 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-[#F26A2E] text-brand-white text-[10px] font-extrabold tracking-widest uppercase hover:opacity-90 rounded-xl transition-all shadow-sm"
                  >
                    Send Verification OTP
                  </button>
                </form>
              ) : (
                // Step 2: Input OTP
                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  <div className="text-left bg-[#FFF3EC] p-3 rounded-xl border border-[#F9E1D3]/50 mb-3">
                    <p className="text-[9px] font-bold text-[#F26A2E] tracking-wider uppercase">
                      ✓ OTP sent to your inbox. Use code "1234" to test.
                    </p>
                  </div>

                  <div className="space-y-1.5 text-left">
                    <label className="text-[9px] font-extrabold text-brand-warmGray tracking-widest uppercase block">Verification Code (OTP)</label>
                    <div className="relative">
                      <input
                        required
                        type="text"
                        placeholder="Enter 4-digit code"
                        maxLength={4}
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        className="w-full bg-brand-warmWhite border border-brand-border/60 p-3 rounded-xl text-xs outline-none focus:border-[#F26A2E] font-semibold pl-10 text-center tracking-[0.4em]"
                      />
                      <Lock className="w-4 h-4 text-brand-warmGray absolute left-3 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>

                  {otpError && (
                    <span className="text-[9px] font-bold text-brand-sale text-left block">
                      ✕ Invalid Verification Code. Use "1234" to test.
                    </span>
                  )}

                  <button
                    type="submit"
                    className="w-full py-3 bg-brand-espresso text-brand-white text-[10px] font-extrabold tracking-widest uppercase hover:opacity-90 rounded-xl transition-all shadow-sm"
                  >
                    Verify & Proceed
                  </button>
                </form>
              )}

              {/* Back Link */}
              <button
                onClick={() => {
                  setScreenMode('landing');
                  setOtpSent(false);
                }}
                className="text-[9px] font-bold text-brand-warmGray hover:text-[#F26A2E] tracking-widest uppercase transition-colors flex items-center justify-center gap-1 mx-auto"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Go Back</span>
              </button>

            </div>
          )}

          {/* SCREEN 3: REGISTER NEW USER DETAILS FORM */}
          {screenMode === 'register-form' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-4 text-left max-h-[75vh] overflow-y-auto pr-1">
              
              <div className="space-y-1 text-center pb-2">
                <h2 className="font-display font-bold text-lg text-brand-espresso tracking-tight">
                  Welcome to Aadhya
                </h2>
                <p className="text-[9px] text-brand-warmGray font-bold tracking-widest uppercase">
                  Please enter your profile details
                </p>
              </div>

              {/* Form Grid */}
              <div className="space-y-3.5">
                
                {/* First Name & Last Name */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[8px] font-extrabold text-brand-warmGray tracking-wider uppercase block">First Name</label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. Prem"
                      value={regForm.firstName}
                      onChange={(e) => setRegForm({ ...regForm, firstName: e.target.value })}
                      className="w-full bg-brand-warmWhite border border-brand-border/60 p-2.5 rounded-lg text-xs outline-none focus:border-[#F26A2E] font-semibold text-brand-espresso"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[8px] font-extrabold text-brand-warmGray tracking-wider uppercase block">Last Name</label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. Kumar"
                      value={regForm.lastName}
                      onChange={(e) => setRegForm({ ...regForm, lastName: e.target.value })}
                      className="w-full bg-brand-warmWhite border border-brand-border/60 p-2.5 rounded-lg text-xs outline-none focus:border-[#F26A2E] font-semibold text-brand-espresso"
                    />
                  </div>
                </div>

                {/* Phone Number */}
                <div className="space-y-1">
                  <label className="text-[8px] font-extrabold text-brand-warmGray tracking-wider uppercase block">Phone Number</label>
                  <input
                    required
                    type="tel"
                    placeholder="9876543210"
                    value={regForm.phone}
                    onChange={(e) => setRegForm({ ...regForm, phone: e.target.value })}
                    className="w-full bg-brand-warmWhite border border-brand-border/60 p-2.5 rounded-lg text-xs outline-none focus:border-[#F26A2E] font-semibold text-brand-espresso"
                  />
                </div>

                {/* Street Name & Landmark */}
                <div className="space-y-1">
                  <label className="text-[8px] font-extrabold text-brand-warmGray tracking-wider uppercase block">Street / Colony Name</label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. MG Road"
                    value={regForm.streetName}
                    onChange={(e) => setRegForm({ ...regForm, streetName: e.target.value })}
                    className="w-full bg-brand-warmWhite border border-brand-border/60 p-2.5 rounded-lg text-xs outline-none focus:border-[#F26A2E] font-semibold text-brand-espresso"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[8px] font-extrabold text-brand-warmGray tracking-wider uppercase block">Landmark (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. Opposite Grand Mall"
                    value={regForm.landmark}
                    onChange={(e) => setRegForm({ ...regForm, landmark: e.target.value })}
                    className="w-full bg-brand-warmWhite border border-brand-border/60 p-2.5 rounded-lg text-xs outline-none focus:border-[#F26A2E] font-semibold text-[#121110]"
                  />
                </div>

                {/* City & State */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[8px] font-extrabold text-brand-warmGray tracking-wider uppercase block">City</label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. Pune"
                      value={regForm.city}
                      onChange={(e) => setRegForm({ ...regForm, city: e.target.value })}
                      className="w-full bg-brand-warmWhite border border-brand-border/60 p-2.5 rounded-lg text-xs outline-none focus:border-[#F26A2E] font-semibold text-brand-espresso"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[8px] font-extrabold text-brand-warmGray tracking-wider uppercase block">State</label>
                    <select
                      value={regForm.state}
                      onChange={(e) => setRegForm({ ...regForm, state: e.target.value })}
                      className="w-full bg-brand-warmWhite border border-brand-border/60 p-2.5 rounded-lg text-xs outline-none focus:border-[#F26A2E] font-semibold text-brand-espresso"
                    >
                      <option value="Maharashtra">Maharashtra</option>
                      <option value="Delhi">Delhi</option>
                      <option value="Karnataka">Karnataka</option>
                      <option value="Tamil Nadu">Tamil Nadu</option>
                    </select>
                  </div>
                </div>

                {/* Postal Code & Other Phone */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[8px] font-extrabold text-brand-warmGray tracking-wider uppercase block">Postal Code</label>
                    <input
                      required
                      type="text"
                      placeholder="411001"
                      value={regForm.zip}
                      onChange={(e) => setRegForm({ ...regForm, zip: e.target.value })}
                      className="w-full bg-brand-warmWhite border border-brand-border/60 p-2.5 rounded-lg text-xs outline-none focus:border-[#F26A2E] font-semibold text-brand-espresso"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[8px] font-extrabold text-brand-warmGray tracking-wider uppercase block">Alternate Phone</label>
                    <input
                      type="tel"
                      placeholder="Optional phone"
                      value={regForm.otherPhone}
                      onChange={(e) => setRegForm({ ...regForm, otherPhone: e.target.value })}
                      className="w-full bg-brand-warmWhite border border-brand-border/60 p-2.5 rounded-lg text-xs outline-none focus:border-[#F26A2E] font-semibold text-brand-espresso"
                    />
                  </div>
                </div>

                {/* Avatar selection */}
                <div className="space-y-2 pt-2 border-t border-brand-border/10">
                  <label className="text-[9px] font-extrabold text-brand-warmGray tracking-widest uppercase block text-center">
                    Select Profile Avatar
                  </label>
                  
                  <div className="flex justify-center space-x-6">
                    <div 
                      onClick={() => setRegForm({ ...regForm, avatar: 'male' })}
                      className={`flex flex-col items-center space-y-1.5 p-3 rounded-2xl cursor-pointer transition-all border ${
                        regForm.avatar === 'male' ? 'border-[#F26A2E] bg-[#FFF3EC]' : 'border-transparent hover:bg-brand-softBeige/15'
                      }`}
                    >
                      <AvatarIcon type="male" className="w-12 h-12" />
                      <span className="text-[8px] font-extrabold text-brand-espresso uppercase tracking-wider">Male Avatar</span>
                    </div>

                    <div 
                      onClick={() => setRegForm({ ...regForm, avatar: 'female' })}
                      className={`flex flex-col items-center space-y-1.5 p-3 rounded-2xl cursor-pointer transition-all border ${
                        regForm.avatar === 'female' ? 'border-[#F26A2E] bg-[#FFF3EC]' : 'border-transparent hover:bg-brand-softBeige/15'
                      }`}
                    >
                      <AvatarIcon type="female" className="w-12 h-12" />
                      <span className="text-[8px] font-extrabold text-brand-espresso uppercase tracking-wider">Female Avatar</span>
                    </div>
                  </div>
                </div>

              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#F26A2E] text-brand-white text-[10px] font-extrabold tracking-widest uppercase hover:opacity-90 rounded-xl transition-all shadow-md mt-4"
              >
                Save Profile & Register
              </button>

            </form>
          )}

        </div>
      </div>
    );
  }

  // --- RENDERING REGISTERED ACCOUNT DASHBOARD PANEL ---
  return (
    <div className="w-full max-w-full min-h-screen bg-[#FCFAF7] py-10 px-4 md:px-12 lg:px-24 text-brand-espresso text-left">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header navigation bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-3 border-b border-brand-border/40 gap-3">
          <NavigationControls className="py-0" />
          
          <span className="text-[10px] font-bold text-brand-warmGray tracking-[0.25em] uppercase">
            Curated Member Space
          </span>
        </div>

        {/* Dashboard Grid Container */}
        <div className="bg-white rounded-3xl overflow-hidden shadow-sm flex flex-col md:flex-row border border-brand-border/30 min-h-[500px]">
          
          {/* Left Navigation Sidebar */}
          <div className="w-full md:w-1/3 bg-brand-softBeige/20 border-b md:border-b-0 md:border-r border-brand-border/30 p-6 flex flex-col justify-between">
            <div className="space-y-6">
              
              {/* Profile Avatar Header */}
              <div className="flex items-center space-x-3.5 pb-4 border-b border-brand-border/30">
                <AvatarIcon type={user?.avatar || 'male'} className="w-12 h-12 flex-shrink-0" />
                <div>
                  <h3 className="font-display font-extrabold text-sm text-brand-espresso uppercase tracking-wide">
                    Hello {user?.firstName}!
                  </h3>
                  <span className="text-[8px] text-brand-warmGray font-extrabold tracking-widest block mt-0.5">
                    ELITE COLLECTOR
                  </span>
                </div>
              </div>

              {/* Sidebar Menu items */}
              <nav className="flex md:flex-col overflow-x-auto md:overflow-x-visible space-x-2 md:space-x-0 md:space-y-1 text-[10px] font-extrabold tracking-widest uppercase text-brand-warmGray">
                
                <button
                  onClick={() => { setActiveTab('manage'); setEditMode(false); }}
                  className={`flex items-center space-x-2 py-2.5 px-3.5 rounded-xl text-left w-full transition-colors ${
                    activeTab === 'manage' ? 'bg-[#FFF3EC] text-[#F26A2E]' : 'hover:bg-brand-softBeige/10 hover:text-brand-espresso'
                  }`}
                >
                  <User className="w-4 h-4 stroke-[2]" />
                  <span>Manage Account</span>
                </button>

                <button
                  onClick={() => { setActiveTab('addresses'); setEditMode(false); }}
                  className={`flex items-center space-x-2 py-2.5 px-3.5 rounded-xl text-left w-full transition-colors ${
                    activeTab === 'addresses' ? 'bg-[#FFF3EC] text-[#F26A2E]' : 'hover:bg-brand-softBeige/10 hover:text-brand-espresso'
                  }`}
                >
                  <MapPin className="w-4 h-4 stroke-[2]" />
                  <span>Saved Addresses</span>
                </button>

                <button
                  onClick={() => setActiveTab('payments')}
                  className={`flex items-center space-x-2 py-2.5 px-3.5 rounded-xl text-left w-full transition-colors ${
                    activeTab === 'payments' ? 'bg-[#FFF3EC] text-[#F26A2E]' : 'hover:bg-brand-softBeige/10 hover:text-brand-espresso'
                  }`}
                >
                  <CreditCard className="w-4 h-4 stroke-[2]" />
                  <span>Payment Details</span>
                </button>

                <button
                  onClick={() => setActiveTab('orders')}
                  className={`flex items-center space-x-2 py-2.5 px-3.5 rounded-xl text-left w-full transition-colors ${
                    activeTab === 'orders' ? 'bg-[#FFF3EC] text-[#F26A2E]' : 'hover:bg-brand-softBeige/10 hover:text-brand-espresso'
                  }`}
                >
                  <ShoppingBag className="w-4 h-4 stroke-[2]" />
                  <span>Order History</span>
                </button>

                <button
                  onClick={() => router.push('/wishlist')}
                  className="flex items-center space-x-2 py-2.5 px-3.5 rounded-xl text-left w-full hover:bg-brand-softBeige/10 hover:text-[#F26A2E] transition-colors"
                >
                  <Heart className="w-4 h-4 stroke-[2]" />
                  <span>My Wishlist</span>
                </button>

                <button
                  onClick={() => setActiveTab('help')}
                  className={`flex items-center space-x-2 py-2.5 px-3.5 rounded-xl text-left w-full transition-colors ${
                    activeTab === 'help' ? 'bg-[#FFF3EC] text-[#F26A2E]' : 'hover:bg-brand-softBeige/10 hover:text-brand-espresso'
                  }`}
                >
                  <LifeBuoy className="w-4 h-4 stroke-[2]" />
                  <span>Help & Support</span>
                </button>

                <button
                  onClick={() => setActiveTab('faqs')}
                  className={`flex items-center space-x-2 py-2.5 px-3.5 rounded-xl text-left w-full transition-colors ${
                    activeTab === 'faqs' ? 'bg-[#FFF3EC] text-[#F26A2E]' : 'hover:bg-brand-softBeige/10 hover:text-brand-espresso'
                  }`}
                >
                  <HelpCircle className="w-4 h-4 stroke-[2]" />
                  <span>FAQs</span>
                </button>

                <button
                  onClick={() => setActiveTab('delete')}
                  className={`flex items-center space-x-2 py-2.5 px-3.5 rounded-xl text-left w-full transition-colors ${
                    activeTab === 'delete' ? 'bg-red-50 text-brand-sale' : 'hover:bg-red-50/50 hover:text-brand-sale'
                  }`}
                >
                  <Trash2 className="w-4 h-4 stroke-[2]" />
                  <span>Delete Account</span>
                </button>

              </nav>
            </div>

            <button
              onClick={logoutUser}
              className="flex items-center justify-center space-x-2 py-3 bg-[#1C1816] text-white rounded-xl text-[10px] font-extrabold tracking-widest uppercase hover:bg-brand-espresso transition-colors shadow-sm w-full mt-6 flex-shrink-0"
            >
              <LogOut className="w-4 h-4" />
              <span>LOGOUT</span>
            </button>
          </div>

          {/* Right Content Panels */}
          <div className="flex-grow p-6 md:p-8 relative text-left">
            
            {/* Status alerts */}
            {isSavedAlert && (
              <div className="absolute top-4 right-4 bg-brand-success/10 border border-brand-success/20 text-brand-success px-3.5 py-1.5 rounded-xl text-[10px] font-bold flex items-center gap-1.5 shadow-sm animate-pulse">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Changes saved successfully!</span>
              </div>
            )}

            {/* TAB 1: MANAGE ACCOUNT */}
            {activeTab === 'manage' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center border-b border-brand-border/30 pb-2">
                  <h4 className="text-xs font-extrabold tracking-[0.2em] text-brand-espresso uppercase">
                    Profile Details
                  </h4>
                  {!editMode && (
                    <button 
                      onClick={() => setEditMode(true)}
                      className="flex items-center gap-1 text-[10px] font-extrabold text-[#F26A2E] tracking-wider uppercase hover:opacity-80"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span>Edit Info</span>
                    </button>
                  )}
                </div>

                {!editMode ? (
                  // Read Mode
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-[11px] font-bold text-brand-espresso">
                    <div className="space-y-1">
                      <span className="text-[9px] text-brand-warmGray tracking-wider block">FIRST NAME</span>
                      <p className="bg-[#FCFAF7] p-3 rounded-xl border border-brand-border/20 text-xs font-semibold">{user?.firstName}</p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[9px] text-brand-warmGray tracking-wider block">LAST NAME</span>
                      <p className="bg-[#FCFAF7] p-3 rounded-xl border border-brand-border/20 text-xs font-semibold">{user?.lastName}</p>
                    </div>
                    <div className="space-y-1 col-span-1 sm:col-span-2">
                      <span className="text-[9px] text-brand-warmGray tracking-wider block">EMAIL ADDRESS</span>
                      <p className="bg-[#FCFAF7] p-3 rounded-xl border border-brand-border/20 text-xs font-semibold">{user?.email}</p>
                    </div>
                    <div className="space-y-1 col-span-1 sm:col-span-2">
                      <span className="text-[9px] text-brand-warmGray tracking-wider block">PHONE NUMBER</span>
                      <p className="bg-[#FCFAF7] p-3 rounded-xl border border-brand-border/20 text-xs font-semibold">{user?.phone}</p>
                    </div>
                  </div>
                ) : (
                  // Edit Mode Form
                  <form onSubmit={handleSaveAccount} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1 text-left">
                        <label className="text-[9px] font-bold text-brand-warmGray block">First Name</label>
                        <input
                          required
                          type="text"
                          value={accountForm.firstName}
                          onChange={(e) => setAccountForm({ ...accountForm, firstName: e.target.value })}
                          className="w-full bg-brand-warmWhite border border-brand-border/50 p-2.5 rounded-xl text-xs outline-none focus:border-[#F26A2E] font-semibold text-brand-espresso"
                        />
                      </div>
                      <div className="space-y-1 text-left">
                        <label className="text-[9px] font-bold text-brand-warmGray block">Last Name</label>
                        <input
                          required
                          type="text"
                          value={accountForm.lastName}
                          onChange={(e) => setAccountForm({ ...accountForm, lastName: e.target.value })}
                          className="w-full bg-brand-warmWhite border border-brand-border/50 p-2.5 rounded-xl text-xs outline-none focus:border-[#F26A2E] font-semibold text-brand-espresso"
                        />
                      </div>
                      <div className="space-y-1 text-left col-span-1 sm:col-span-2">
                        <label className="text-[9px] font-bold text-brand-warmGray block">Phone Number</label>
                        <input
                          required
                          type="tel"
                          value={accountForm.phone}
                          onChange={(e) => setAccountForm({ ...accountForm, phone: e.target.value })}
                          className="w-full bg-brand-warmWhite border border-brand-border/50 p-2.5 rounded-xl text-xs outline-none focus:border-[#F26A2E] font-semibold text-brand-espresso"
                        />
                      </div>
                      
                      {/* Avatar chooser */}
                      <div className="col-span-1 sm:col-span-2 space-y-2 border-t border-brand-border/10 pt-4 text-left">
                        <span className="text-[9px] font-bold text-brand-warmGray tracking-widest uppercase block text-center">Change Profile Avatar</span>
                        <div className="flex justify-center space-x-6">
                          <div 
                            onClick={() => setAccountForm({ ...accountForm, avatar: 'male' })}
                            className={`flex flex-col items-center space-y-1 p-2 rounded-xl cursor-pointer border ${
                              accountForm.avatar === 'male' ? 'border-[#F26A2E] bg-[#FFF3EC]' : 'border-transparent'
                            }`}
                          >
                            <AvatarIcon type="male" className="w-10 h-10" />
                            <span className="text-[8px] font-extrabold uppercase">Male</span>
                          </div>
                          <div 
                            onClick={() => setAccountForm({ ...accountForm, avatar: 'female' })}
                            className={`flex flex-col items-center space-y-1 p-2 rounded-xl cursor-pointer border ${
                              accountForm.avatar === 'female' ? 'border-[#F26A2E] bg-[#FFF3EC]' : 'border-transparent'
                            }`}
                          >
                            <AvatarIcon type="female" className="w-10 h-10" />
                            <span className="text-[8px] font-extrabold uppercase">Female</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex space-x-3 pt-2">
                      <button
                        type="submit"
                        className="px-5 py-2.5 bg-[#F26A2E] text-white text-[10px] font-extrabold tracking-widest rounded-xl uppercase flex items-center gap-1"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>Save Changes</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditMode(false)}
                        className="px-5 py-2.5 bg-brand-white border border-brand-border/50 text-brand-warmGray text-[10px] font-extrabold tracking-widest rounded-xl uppercase"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {/* TAB 2: SAVED ADDRESSES */}
            {activeTab === 'addresses' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center border-b border-brand-border/30 pb-2">
                  <h4 className="text-xs font-extrabold tracking-[0.2em] text-brand-espresso uppercase">
                    Saved Addresses
                  </h4>
                  {!editMode && (
                    <button 
                      onClick={() => setEditMode(true)}
                      className="flex items-center gap-1 text-[10px] font-extrabold text-[#F26A2E] tracking-wider uppercase hover:opacity-80"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span>Edit Address</span>
                    </button>
                  )}
                </div>

                {!editMode ? (
                  // Read Address
                  <div className="p-4 border border-brand-border/40 rounded-2xl bg-[#FCFAF7] text-[11px] font-bold text-brand-espresso relative">
                    <div className="flex items-center space-x-2 font-extrabold text-xs mb-2">
                      <MapPin className="w-4 h-4 text-[#F26A2E]" />
                      <span>Primary Residence</span>
                    </div>
                    <div className="space-y-1 font-semibold text-brand-warmGray pl-6 leading-relaxed">
                      <p>{user?.firstName} {user?.lastName}</p>
                      {user?.streetName && <p>{user.streetName}</p>}
                      {user?.landmark && <p>Landmark: {user.landmark}</p>}
                      {user?.city && <p>{user.city}, {user.state} - {user.zip}</p>}
                      <p>India</p>
                    </div>
                  </div>
                ) : (
                  // Edit Address Form
                  <form onSubmit={handleSaveAddress} className="space-y-4">
                    <div className="space-y-3.5">
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-brand-warmGray block">Street / Colony Name</label>
                        <input
                          required
                          type="text"
                          value={addressForm.streetName}
                          onChange={(e) => setAddressForm({ ...addressForm, streetName: e.target.value })}
                          className="w-full bg-brand-warmWhite border border-brand-border/50 p-2.5 rounded-xl text-xs outline-none focus:border-[#F26A2E] font-semibold text-brand-espresso"
                        />
                      </div>
                      
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-brand-warmGray block">Landmark (Optional)</label>
                        <input
                          type="text"
                          value={addressForm.landmark}
                          onChange={(e) => setAddressForm({ ...addressForm, landmark: e.target.value })}
                          className="w-full bg-brand-warmWhite border border-brand-border/50 p-2.5 rounded-xl text-xs outline-none focus:border-[#F26A2E] font-semibold text-brand-espresso"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-[9px] font-bold text-brand-warmGray block">City</label>
                          <input
                            required
                            type="text"
                            value={addressForm.city}
                            onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                            className="w-full bg-brand-warmWhite border border-brand-border/50 p-2.5 rounded-xl text-xs outline-none focus:border-[#F26A2E] font-semibold text-brand-espresso"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] font-bold text-brand-warmGray block">State</label>
                          <input
                            required
                            type="text"
                            value={addressForm.state}
                            onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                            className="w-full bg-brand-warmWhite border border-brand-border/50 p-2.5 rounded-xl text-xs outline-none focus:border-[#F26A2E] font-semibold text-brand-espresso"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-brand-warmGray block">Pincode</label>
                        <input
                          required
                          type="text"
                          value={addressForm.zip}
                          onChange={(e) => setAddressForm({ ...addressForm, zip: e.target.value })}
                          className="w-full bg-brand-warmWhite border border-[#FCFAF7] p-2.5 rounded-xl text-xs outline-none focus:border-[#F26A2E] font-semibold text-brand-espresso"
                        />
                      </div>
                    </div>

                    <div className="flex space-x-3 pt-2">
                      <button
                        type="submit"
                        className="px-5 py-2.5 bg-[#F26A2E] text-white text-[10px] font-extrabold tracking-widest rounded-xl uppercase flex items-center gap-1"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>Save Address</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditMode(false)}
                        className="px-5 py-2.5 bg-brand-white border border-brand-border/50 text-brand-warmGray text-[10px] font-extrabold tracking-widest rounded-xl uppercase"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {/* TAB 3: PAYMENT DETAILS */}
            {activeTab === 'payments' && (
              <div className="space-y-6">
                <h4 className="text-xs font-extrabold tracking-[0.2em] text-brand-espresso border-b border-brand-border/30 pb-2 uppercase">
                  Saved Wallet Options
                </h4>
                
                <div className="space-y-3">
                  <div className="p-4 border border-brand-border/20 rounded-2xl bg-gradient-to-r from-[#C45E2E] to-[#802611] text-white flex items-center justify-between shadow-sm relative overflow-hidden">
                    <div className="space-y-1 text-left">
                      <span className="text-[7px] font-extrabold opacity-75 uppercase tracking-widest">Saved Credit Card</span>
                      <h5 className="text-xs font-extrabold tracking-[0.15em]">•••• •••• •••• 9812</h5>
                      <p className="text-[8px] opacity-90 font-bold uppercase">{user?.firstName} {user?.lastName}</p>
                    </div>
                    <CreditCard className="w-8 h-8 opacity-45 stroke-[1.5]" />
                  </div>

                  <div className="p-4 border border-brand-border/20 rounded-2xl bg-[#FCFAF7] text-brand-espresso flex items-center justify-between">
                    <div className="space-y-0.5 text-left font-semibold">
                      <span className="text-[7px] font-extrabold text-[#F26A2E] tracking-widest uppercase block">Saved UPI Handle</span>
                      <h5 className="text-xs font-bold text-brand-espresso">{user?.firstName.toLowerCase()}@upi</h5>
                    </div>
                    <span className="text-[8px] bg-brand-success/15 border border-brand-success/20 text-brand-success font-extrabold tracking-widest px-2 py-0.5 rounded uppercase">Primary</span>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: ORDER HISTORY */}
            {activeTab === 'orders' && (
              <div className="space-y-6">
                <h4 className="text-xs font-extrabold tracking-[0.2em] text-brand-espresso border-b border-brand-border/30 pb-2 uppercase">
                  Consignment Archives
                </h4>

                <div className="space-y-4">
                  <div className="p-4 border border-brand-border/20 rounded-2xl bg-[#FCFAF7] text-[11px] font-semibold space-y-1 text-left relative">
                    <div className="flex justify-between items-baseline font-extrabold text-xs">
                      <span>#AD-981240</span>
                      <span className="text-brand-success font-extrabold text-[8px] bg-brand-success/10 border border-brand-success/20 px-2 py-0.5 rounded uppercase tracking-wider">Delivered</span>
                    </div>
                    <p className="text-brand-warmGray">Chanderi Silk Anarkali Suit (x1)</p>
                    <div className="flex justify-between text-brand-warmGray pt-2 border-t border-brand-border/10 mt-1">
                      <span>August 10, 2026</span>
                      <span className="font-extrabold text-brand-espresso">₹5,849</span>
                    </div>
                  </div>

                  <div className="p-4 border border-brand-border/20 rounded-2xl bg-[#FCFAF7] text-[11px] font-semibold space-y-1 text-left relative">
                    <div className="flex justify-between items-baseline font-extrabold text-xs">
                      <span>#AD-543190</span>
                      <span className="text-brand-success font-extrabold text-[8px] bg-brand-success/10 border border-brand-success/20 px-2 py-0.5 rounded uppercase tracking-wider">Delivered</span>
                    </div>
                    <p className="text-brand-warmGray">1918 Silver King George Rupee (x1)</p>
                    <div className="flex justify-between text-brand-warmGray pt-2 border-t border-brand-border/10 mt-1">
                      <span>July 28, 2026</span>
                      <span className="font-extrabold text-brand-espresso">₹990</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 5: HELP & SUPPORT */}
            {activeTab === 'help' && (
              <div className="space-y-6">
                <h4 className="text-xs font-extrabold tracking-[0.2em] text-brand-espresso border-b border-brand-border/30 pb-2 uppercase">
                  Raise Support Ticket
                </h4>

                {ticketRaised && (
                  <div className="p-4 border border-brand-success/25 bg-brand-success/10 rounded-2xl text-xs font-bold text-brand-success text-center">
                    ✓ Support Ticket raised! A member of team Aadhya will respond within 4 hours.
                  </div>
                )}

                <form onSubmit={handleRaiseTicket} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-brand-warmGray block">Subject of Query</label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. Sizing adjustment request"
                      value={supportTicket.subject}
                      onChange={(e) => setSupportTicket({ ...supportTicket, subject: e.target.value })}
                      className="w-full bg-[#FCFAF7] border border-brand-border/50 p-3 rounded-xl text-xs outline-none focus:border-[#F26A2E] font-semibold text-brand-espresso"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-brand-warmGray block">Message Details</label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Explain your issue in detail..."
                      value={supportTicket.message}
                      onChange={(e) => setSupportTicket({ ...supportTicket, message: e.target.value })}
                      className="w-full bg-[#FCFAF7] border border-brand-border/50 p-3 rounded-xl text-xs outline-none focus:border-[#F26A2E] font-semibold text-brand-espresso resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-[#F26A2E] text-white text-[10px] font-extrabold tracking-widest rounded-xl uppercase hover:opacity-90 transition-all shadow-sm"
                  >
                    Submit Support Ticket
                  </button>
                </form>
              </div>
            )}

            {/* TAB 6: FAQS */}
            {activeTab === 'faqs' && (
              <div className="space-y-6">
                <h4 className="text-xs font-extrabold tracking-[0.2em] text-[#1C1816] border-b border-brand-border/30 pb-2 uppercase">
                  FAQs & Curated Help
                </h4>

                <div className="space-y-3">
                  {faqs.map((faq, index) => {
                    const isOpen = expandedFaq === index;
                    return (
                      <div 
                        key={index} 
                        className="border border-brand-border/35 rounded-2xl overflow-hidden bg-[#FCFAF7]"
                      >
                        <button
                          onClick={() => setExpandedFaq(isOpen ? null : index)}
                          className="w-full p-4 flex items-center justify-between text-left font-bold text-xs text-brand-espresso hover:bg-brand-softBeige/20 transition-colors"
                        >
                          <span>{faq.q}</span>
                          <ChevronRight className={`w-4 h-4 text-[#F26A2E] transition-transform ${isOpen ? 'rotate-90' : ''}`} />
                        </button>
                        {isOpen && (
                          <div className="p-4 pt-0 text-[11px] text-brand-warmGray font-semibold leading-relaxed border-t border-brand-border/10 bg-white">
                            {faq.a}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB 7: DELETE ACCOUNT */}
            {activeTab === 'delete' && (
              <div className="space-y-6">
                <h4 className="text-xs font-extrabold tracking-[0.2em] text-brand-sale border-b border-brand-border/30 pb-2 uppercase">
                  Delete Account Registry
                </h4>

                <div className="p-4 border border-brand-sale/20 bg-brand-sale/10 rounded-2xl text-[11px] font-semibold text-brand-sale leading-relaxed space-y-3">
                  <p className="font-extrabold">⚠️ Warning: This action is irreversible.</p>
                  <p>
                    Deleting your account will permanently remove all profile details, saved addresses, wallet options, and order history from Aadhya registers.
                  </p>
                </div>

                <div className="pt-2 text-left">
                  <button
                    onClick={() => {
                      if (confirm("Are you sure you want to permanently delete your Aadhya account? This cannot be undone.")) {
                        deleteUserAccount();
                      }
                    }}
                    className="px-6 py-3 bg-brand-sale text-white text-[10px] font-extrabold tracking-widest rounded-xl uppercase hover:bg-opacity-90 shadow-sm flex items-center gap-1.5"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>PERMANENTLY DELETE ACCOUNT</span>
                  </button>
                </div>
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}
