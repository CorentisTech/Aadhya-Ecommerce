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
  ChevronRight, 
  Menu, 
  X, 
  Sparkles,
  Sun,
  Moon,
  ChevronDown
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
        console.warn('Failed to load admin profile:', err);
      }
    };
    fetchAdmin();
  }, [isLoginPage]);

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

  const navLinks = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard, exact: true },
    { name: 'Users', href: '/admin/users', icon: Users },
    { name: 'Product Manager', href: '/admin/products/fashion', icon: ShoppingBag },
    { name: 'Sales & Orders', href: '/admin/orders', icon: Receipt },
    { name: 'Categories', href: '/admin/categories/fashion', icon: Tags },
    { name: 'Revenue Reports', href: '/admin/revenue', icon: TrendingUp },
    { name: 'Website CMS', href: '/admin/website', icon: Globe },
    { name: 'Support', href: '/admin/support', icon: HelpCircle },
    { name: 'Settings', href: '/admin/profile', icon: Settings },
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full justify-between select-none text-left p-4 lg:p-5 bg-[#14161f]">
      <div className="space-y-6">
        {/* Brand Header: Logo + AADHYA matching reference image */}
        <div className="flex items-center space-x-3 px-2 pt-1">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-[#ba8c4d] to-[#d4ab6c] flex items-center justify-center shadow-lg shadow-amber-950/40">
            <Sparkles className="w-5 h-5 text-[#14161f]" />
          </div>
          <div>
            <span className="font-display font-black text-xl tracking-[0.18em] text-white block leading-none">
              AADHYA
            </span>
            <span className="text-[9px] font-bold text-amber-300/80 tracking-widest uppercase block mt-1">
              Store Platform
            </span>
          </div>
        </div>

        {/* Navigation list matching reference image */}
        <nav className="space-y-1.5 pt-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = isNavActive(link.href, link.exact);
            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileDrawerOpen(false)}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all duration-150 ${
                  active
                    ? 'bg-[#c89b5c] text-[#14161f] shadow-md shadow-amber-900/20'
                    : 'text-[#8b91a5] hover:text-white hover:bg-white/[0.05]'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`w-4 h-4 ${active ? 'text-[#14161f]' : 'text-[#8b91a5]'}`} />
                  <span>{link.name}</span>
                </div>
                {!active && (
                  <ChevronRight className="w-3.5 h-3.5 text-[#4a5163] opacity-60" />
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Profile & Light/Dark Switch (EXACT match to reference image bottom left) */}
      <div className="pt-4 border-t border-white/5 space-y-3">
        {/* User Pill Card */}
        <div className="relative">
          <button
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            className="w-full flex items-center justify-between p-2.5 rounded-2xl bg-[#1c202d] border border-white/5 hover:border-white/10 transition-colors text-left"
          >
            <div className="flex items-center space-x-2.5 min-w-0">
              <div className="relative">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#ba8c4d] to-[#d4ab6c] flex items-center justify-center text-[#14161f] font-black text-xs flex-shrink-0">
                  {adminProfile.name.charAt(0)}
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-[#1c202d]" />
              </div>
              <div className="min-w-0">
                <span className="text-xs font-bold text-white block truncate leading-tight">
                  {adminProfile.name}
                </span>
                <span className="text-[10px] text-emerald-400 font-medium block truncate">
                  Active
                </span>
              </div>
            </div>
            <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform ${profileDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Profile Dropdown */}
          <AnimatePresence>
            {profileDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute bottom-full left-0 right-0 mb-2 bg-[#1c202d] border border-white/10 rounded-2xl p-2 shadow-2xl z-50 space-y-1"
              >
                <Link
                  href="/admin/profile"
                  onClick={() => setProfileDropdownOpen(false)}
                  className="flex items-center space-x-2.5 px-3 py-2 text-xs font-semibold text-gray-300 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
                >
                  <Settings className="w-3.5 h-3.5 text-amber-400" />
                  <span>Admin Settings</span>
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

        {/* Light / Dark Mode Toggle (From reference image bottom-left) */}
        <div className="bg-[#1c202d] p-1 rounded-2xl flex items-center border border-white/5">
          <button
            onClick={() => setThemeMode('light')}
            className={`flex-1 flex items-center justify-center space-x-1.5 py-1.5 rounded-xl text-[11px] font-bold transition-all ${
              themeMode === 'light'
                ? 'bg-[#c89b5c] text-[#14161f] shadow-sm'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Sun className="w-3.5 h-3.5" />
            <span>Light</span>
          </button>
          <button
            onClick={() => setThemeMode('dark')}
            className={`flex-1 flex items-center justify-center space-x-1.5 py-1.5 rounded-xl text-[11px] font-bold transition-all ${
              themeMode === 'dark'
                ? 'bg-[#2a3045] text-white shadow-sm'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Moon className="w-3.5 h-3.5" />
            <span>Dark</span>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full h-screen min-h-screen bg-[#14161f] flex overflow-hidden p-0 m-0 font-sans antialiased text-[#1a1f36]">
      {/* Permanent Desktop Left Sidebar */}
      <aside className="hidden lg:flex w-64 bg-[#14161f] border-r border-white/5 flex-shrink-0 flex-col h-full z-20">
        <SidebarContent />
      </aside>

      {/* Mobile Top Header Bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-[#14161f] border-b border-white/5 px-4 h-14 flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-[#ba8c4d] to-[#d4ab6c] flex items-center justify-center shadow">
            <Sparkles className="w-4 h-4 text-[#14161f]" />
          </div>
          <span className="font-display font-black text-base tracking-widest text-white">
            AADHYA
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <Link
            href="/"
            target="_blank"
            className="p-2 text-gray-400 hover:text-white bg-white/5 rounded-xl transition-colors"
            title="View Storefront"
          >
            <Globe className="w-4 h-4" />
          </Link>
          <button
            onClick={() => setMobileDrawerOpen(true)}
            className="p-2 text-white bg-white/10 rounded-xl hover:bg-white/15 transition-colors"
            aria-label="Open Navigation"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {mobileDrawerOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileDrawerOpen(false)}
              className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm lg:hidden"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 26, stiffness: 240 }}
              className="fixed left-0 top-0 bottom-0 z-50 w-72 max-w-[85vw] bg-[#14161f] border-r border-white/10 shadow-2xl lg:hidden flex flex-col"
            >
              <div className="p-4 flex items-center justify-between border-b border-white/5">
                <span className="font-display font-black text-white text-sm tracking-widest">
                  AADHYA ADMIN
                </span>
                <button
                  onClick={() => setMobileDrawerOpen(false)}
                  className="p-1.5 text-white/70 hover:text-white rounded-lg hover:bg-white/10"
                  aria-label="Close Navigation"
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

      {/* Main Content Canvas - Fits fully to edge with smooth inner rounded corner on desktop */}
      <main className="flex-1 min-w-0 h-full bg-[#fbf9f5] rounded-none lg:rounded-tl-[32px] lg:rounded-bl-[32px] overflow-y-auto overflow-x-hidden p-3.5 sm:p-5 md:p-7 lg:p-8 flex flex-col pt-16 lg:pt-8">
        <div className="w-full max-w-[1600px] mx-auto flex-1">
          {children}
        </div>
      </main>
    </div>
  );
}
