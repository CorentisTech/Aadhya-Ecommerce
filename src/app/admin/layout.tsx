"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  ShoppingBag, 
  Tags, 
  Receipt, 
  TrendingUp, 
  Globe, 
  HelpCircle, 
  Settings, 
  LogOut, 
  ChevronDown, 
  ChevronRight, 
  Menu, 
  X, 
  Sun, 
  Moon,
  Sparkles,
  Shirt,
  Coins,
  ShieldCheck,
  Bell
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { createClient } from '@/utils/supabase/client';

interface AdminProfile {
  name: string;
  email: string;
  role: string;
  avatar: string;
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [productsExpanded, setProductsExpanded] = useState(
    pathname?.includes('/admin/products') || false
  );
  const [categoriesExpanded, setCategoriesExpanded] = useState(
    pathname?.includes('/admin/categories') || false
  );
  const [themeMode, setThemeMode] = useState<'light' | 'dark'>('light');
  const [adminProfile, setAdminProfile] = useState<AdminProfile>({
    name: 'Prem Karnawat',
    email: 'admin@aadhya.co',
    role: 'Super Admin',
    avatar: 'male'
  });
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  // If on login page, render bare children
  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    if (isLoginPage) return;

    // Fetch authenticated admin details
    const fetchAdmin = async () => {
      try {
        const res = await fetch('/api/admin/profile');
        const data = await res.json();
        if (data.success && data.profile) {
          const p = data.profile;
          const fullName = [p.first_name, p.last_name].filter(Boolean).join(' ') || p.name || 'Admin';
          setAdminProfile({
            name: fullName,
            email: p.email || 'admin@aadhya.co',
            role: p.role === 'super_admin' ? 'Super Admin' : 'Admin',
            avatar: p.avatar || 'male'
          });
        }
      } catch (err) {
        console.error('Failed to load admin profile:', err);
      }
    };
    fetchAdmin();
  }, [isLoginPage]);

  // Keep groups expanded if URL matches
  useEffect(() => {
    if (pathname?.includes('/admin/products')) setProductsExpanded(true);
    if (pathname?.includes('/admin/categories')) setCategoriesExpanded(true);
  }, [pathname]);

  const handleLogout = async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
    } catch (err) {
      console.error(err);
    }
    router.push('/admin/login');
  };

  if (isLoginPage) {
    return <>{children}</>;
  }

  const isNavActive = (path: string, exact = false) => {
    if (!pathname) return false;
    if (exact) return pathname === path;
    return pathname.startsWith(path);
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full justify-between select-none text-left p-4">
      <div className="space-y-6">
        {/* Brand Header with AADHYA typography and gold emblem */}
        <div className="flex items-center space-x-3 px-3 py-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#dfa658] via-[#cb9752] to-[#996522] flex items-center justify-center shadow-lg shadow-black/20 flex-shrink-0">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="font-display font-black text-xl tracking-[0.22em] text-white block leading-none">
              AADHYA
            </span>
            <span className="text-[9px] font-bold text-[#dfa658] tracking-widest uppercase block mt-1">
              ADMIN PLATFORM
            </span>
          </div>
        </div>

        {/* Navigation items */}
        <nav className="space-y-1.5 pt-2">
          {/* Dashboard */}
          <Link
            href="/admin/dashboard"
            onClick={() => setMobileDrawerOpen(false)}
            className={`flex items-center space-x-3.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all relative ${
              pathname === '/admin' || pathname === '/admin/dashboard'
                ? 'bg-[#cca05b] text-[#15171c] shadow-md shadow-black/10'
                : 'text-[#8e929a] hover:bg-white/5 hover:text-white'
            }`}
          >
            <LayoutDashboard className="w-4 h-4 flex-shrink-0" />
            <span className="tracking-wider">Dashboard</span>
          </Link>

          {/* Users */}
          <Link
            href="/admin/users"
            onClick={() => setMobileDrawerOpen(false)}
            className={`flex items-center space-x-3.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all relative ${
              isNavActive('/admin/users')
                ? 'bg-[#cca05b] text-[#15171c] shadow-md shadow-black/10'
                : 'text-[#8e929a] hover:bg-white/5 hover:text-white'
            }`}
          >
            <Users className="w-4 h-4 flex-shrink-0" />
            <span className="tracking-wider">Users</span>
          </Link>

          {/* Products (Expandable: Fashion & Coins) */}
          <div className="space-y-1">
            <button
              onClick={() => setProductsExpanded(!productsExpanded)}
              className={`flex items-center justify-between w-full px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                pathname?.includes('/admin/products')
                  ? 'text-white bg-white/5'
                  : 'text-[#8e929a] hover:bg-white/5 hover:text-white'
              }`}
            >
              <div className="flex items-center space-x-3.5">
                <ShoppingBag className="w-4 h-4 flex-shrink-0" />
                <span className="tracking-wider">Products</span>
              </div>
              {productsExpanded ? (
                <ChevronDown className="w-3.5 h-3.5 opacity-60" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5 opacity-60" />
              )}
            </button>

            <AnimatePresence>
              {productsExpanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="pl-7 pr-1 space-y-1 overflow-hidden"
                >
                  <Link
                    href="/admin/products/fashion"
                    onClick={() => setMobileDrawerOpen(false)}
                    className={`flex items-center space-x-2.5 px-3 py-2 rounded-lg text-[11px] font-semibold transition-all ${
                      pathname === '/admin/products/fashion'
                        ? 'bg-[#cca05b] text-[#15171c] font-bold'
                        : 'text-[#8e929a] hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Shirt className="w-3.5 h-3.5" />
                    <span>Fashion</span>
                  </Link>
                  <Link
                    href="/admin/products/numismatics"
                    onClick={() => setMobileDrawerOpen(false)}
                    className={`flex items-center space-x-2.5 px-3 py-2 rounded-lg text-[11px] font-semibold transition-all ${
                      pathname === '/admin/products/numismatics'
                        ? 'bg-[#cca05b] text-[#15171c] font-bold'
                        : 'text-[#8e929a] hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Coins className="w-3.5 h-3.5" />
                    <span>Coins & Notes</span>
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Categories (Expandable: Fashion & Coins) */}
          <div className="space-y-1">
            <button
              onClick={() => setCategoriesExpanded(!categoriesExpanded)}
              className={`flex items-center justify-between w-full px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                pathname?.includes('/admin/categories')
                  ? 'text-white bg-white/5'
                  : 'text-[#8e929a] hover:bg-white/5 hover:text-white'
              }`}
            >
              <div className="flex items-center space-x-3.5">
                <Tags className="w-4 h-4 flex-shrink-0" />
                <span className="tracking-wider">Categories</span>
              </div>
              {categoriesExpanded ? (
                <ChevronDown className="w-3.5 h-3.5 opacity-60" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5 opacity-60" />
              )}
            </button>

            <AnimatePresence>
              {categoriesExpanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="pl-7 pr-1 space-y-1 overflow-hidden"
                >
                  <Link
                    href="/admin/categories/fashion"
                    onClick={() => setMobileDrawerOpen(false)}
                    className={`flex items-center space-x-2.5 px-3 py-2 rounded-lg text-[11px] font-semibold transition-all ${
                      pathname === '/admin/categories/fashion'
                        ? 'bg-[#cca05b] text-[#15171c] font-bold'
                        : 'text-[#8e929a] hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Shirt className="w-3.5 h-3.5" />
                    <span>Fashion</span>
                  </Link>
                  <Link
                    href="/admin/categories/numismatics"
                    onClick={() => setMobileDrawerOpen(false)}
                    className={`flex items-center space-x-2.5 px-3 py-2 rounded-lg text-[11px] font-semibold transition-all ${
                      pathname === '/admin/categories/numismatics'
                        ? 'bg-[#cca05b] text-[#15171c] font-bold'
                        : 'text-[#8e929a] hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Coins className="w-3.5 h-3.5" />
                    <span>Coins & Notes</span>
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Orders */}
          <Link
            href="/admin/orders"
            onClick={() => setMobileDrawerOpen(false)}
            className={`flex items-center space-x-3.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all relative ${
              isNavActive('/admin/orders')
                ? 'bg-[#cca05b] text-[#15171c] shadow-md shadow-black/10'
                : 'text-[#8e929a] hover:bg-white/5 hover:text-white'
            }`}
          >
            <Receipt className="w-4 h-4 flex-shrink-0" />
            <span className="tracking-wider">Orders</span>
          </Link>

          {/* Revenue */}
          <Link
            href="/admin/revenue"
            onClick={() => setMobileDrawerOpen(false)}
            className={`flex items-center space-x-3.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all relative ${
              isNavActive('/admin/revenue')
                ? 'bg-[#cca05b] text-[#15171c] shadow-md shadow-black/10'
                : 'text-[#8e929a] hover:bg-white/5 hover:text-white'
            }`}
          >
            <TrendingUp className="w-4 h-4 flex-shrink-0" />
            <span className="tracking-wider">Revenue</span>
          </Link>

          {/* Website CMS */}
          <Link
            href="/admin/website"
            onClick={() => setMobileDrawerOpen(false)}
            className={`flex items-center space-x-3.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all relative ${
              isNavActive('/admin/website')
                ? 'bg-[#cca05b] text-[#15171c] shadow-md shadow-black/10'
                : 'text-[#8e929a] hover:bg-white/5 hover:text-white'
            }`}
          >
            <Globe className="w-4 h-4 flex-shrink-0" />
            <span className="tracking-wider">Website</span>
          </Link>

          {/* Support Tickets */}
          <Link
            href="/admin/support"
            onClick={() => setMobileDrawerOpen(false)}
            className={`flex items-center space-x-3.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all relative ${
              isNavActive('/admin/support')
                ? 'bg-[#cca05b] text-[#15171c] shadow-md shadow-black/10'
                : 'text-[#8e929a] hover:bg-white/5 hover:text-white'
            }`}
          >
            <HelpCircle className="w-4 h-4 flex-shrink-0" />
            <span className="tracking-wider">Support</span>
          </Link>
        </nav>
      </div>

      {/* Bottom Area: Profile Card & Light/Dark Switcher */}
      <div className="space-y-3 pt-4 border-t border-white/5">
        {/* Profile Card */}
        <div className="relative">
          <button
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            className="w-full flex items-center justify-between p-2.5 rounded-2xl bg-[#202229] border border-white/5 hover:border-white/10 transition-colors text-left"
          >
            <div className="flex items-center space-x-3 min-w-0">
              <div className="relative flex-shrink-0">
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#cca05b] to-[#dfa658] flex items-center justify-center text-[#15171c] font-black text-xs">
                  {adminProfile.name.charAt(0)}
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-[#202229] rounded-full" />
              </div>
              <div className="min-w-0">
                <span className="text-xs font-bold text-white block truncate leading-tight">
                  {adminProfile.name}
                </span>
                <span className="text-[10px] text-[#cca05b] font-semibold block leading-tight">
                  {adminProfile.role}
                </span>
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-[#8e929a] flex-shrink-0 ml-1" />
          </button>

          {/* Profile Dropdown */}
          <AnimatePresence>
            {profileDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute bottom-full left-0 right-0 mb-2 bg-[#202229] border border-white/10 rounded-2xl p-2 shadow-2xl z-50 space-y-1"
              >
                <Link
                  href="/admin/profile"
                  onClick={() => setProfileDropdownOpen(false)}
                  className="flex items-center space-x-2.5 px-3 py-2 text-xs font-semibold text-[#8e929a] hover:text-white hover:bg-white/5 rounded-xl transition-colors"
                >
                  <Settings className="w-3.5 h-3.5 text-[#cca05b]" />
                  <span>Admin Profile</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2.5 w-full px-3 py-2 text-xs font-semibold text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors text-left"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Logout</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Light / Dark Mode Toggle from reference */}
        <div className="flex items-center bg-[#202229] p-1 rounded-xl border border-white/5 text-[11px] font-bold">
          <button
            onClick={() => setThemeMode('light')}
            className={`flex-1 flex items-center justify-center space-x-1.5 py-1.5 rounded-lg transition-all ${
              themeMode === 'light'
                ? 'bg-[#cca05b] text-[#15171c] shadow'
                : 'text-[#8e929a] hover:text-white'
            }`}
          >
            <Sun className="w-3 h-3" />
            <span>Light</span>
          </button>
          <button
            onClick={() => setThemeMode('dark')}
            className={`flex-1 flex items-center justify-center space-x-1.5 py-1.5 rounded-lg transition-all ${
              themeMode === 'dark'
                ? 'bg-[#cca05b] text-[#15171c] shadow'
                : 'text-[#8e929a] hover:text-white'
            }`}
          >
            <Moon className="w-3 h-3" />
            <span>Dark</span>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#b98846] p-2 sm:p-4 md:p-6 lg:p-8 flex items-center justify-center font-sans antialiased text-[#15171c]">
      {/* Outer rounded dashboard shell from reference */}
      <div className="w-full max-w-[1600px] min-h-[92vh] bg-[#15171c] rounded-[28px] md:rounded-[36px] shadow-2xl border border-black/20 flex overflow-hidden">
        
        {/* Permanent Desktop Left Sidebar */}
        <aside className="hidden lg:flex w-64 bg-[#15171c] border-r border-white/5 flex-shrink-0 flex-col">
          <SidebarContent />
        </aside>

        {/* Mobile Header & Drawer */}
        <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-[#15171c] border-b border-white/5 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#dfa658] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-display font-black text-lg tracking-widest text-white">
              AADHYA
            </span>
          </div>
          <button
            onClick={() => setMobileDrawerOpen(true)}
            className="p-2 text-white/80 hover:text-white bg-white/5 rounded-xl"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>

        {/* Mobile Drawer */}
        <AnimatePresence>
          {mobileDrawerOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setMobileDrawerOpen(false)}
                className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm lg:hidden"
              />
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 220 }}
                className="fixed left-0 top-0 bottom-0 z-50 w-72 bg-[#15171c] border-r border-white/10 shadow-2xl lg:hidden flex flex-col"
              >
                <div className="p-4 flex items-center justify-between border-b border-white/5">
                  <span className="font-display font-black text-white text-base tracking-widest">
                    AADHYA ADMIN
                  </span>
                  <button
                    onClick={() => setMobileDrawerOpen(false)}
                    className="p-1.5 text-white/70 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto">
                  <SidebarContent />
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Main Content Area (Rounded clean off-white canvas) */}
        <main className="flex-1 min-w-0 bg-[#faf9f6] rounded-[24px] md:rounded-[32px] m-1 md:m-2 lg:m-3 p-4 sm:p-6 md:p-8 lg:p-10 overflow-y-auto flex flex-col pt-16 lg:pt-8">
          {children}
        </main>

      </div>
    </div>
  );
}
