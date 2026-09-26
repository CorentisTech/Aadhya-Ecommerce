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
  Shirt,
  Coins,
  ShieldCheck,
  Bell,
  Archive,
  CreditCard,
  Percent,
  Search
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
  const [adminProfile, setAdminProfile] = useState<AdminProfile>({
    name: 'Prem Karnawat',
    email: 'admin@aadhya.co',
    role: 'Administrator',
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
            role: p.role === 'super_admin' ? 'Super Admin' : 'Administrator',
            avatar: p.avatar || 'male'
          });
        }
      } catch (err) {
        console.error('Failed to load admin profile:', err);
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
    { name: 'Product Manager', href: '/admin/products/fashion', icon: ShoppingBag, hasSub: true },
    { name: 'Sales & Orders', href: '/admin/orders', icon: Receipt },
    { name: 'Categories', href: '/admin/categories/fashion', icon: Tags },
    { name: 'Revenue Reports', href: '/admin/revenue', icon: TrendingUp },
    { name: 'Website CMS', href: '/admin/website', icon: Globe },
    { name: 'Support', href: '/admin/support', icon: HelpCircle },
    { name: 'Settings', href: '/admin/profile', icon: Settings },
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full justify-between select-none text-left p-5 bg-[#121420]">
      <div className="space-y-7">
        {/* Brand Header: Logo + AADHYA */}
        <div className="flex items-center space-x-3 px-2 pt-1">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 via-amber-400 to-amber-200 flex items-center justify-center shadow-lg shadow-amber-900/30">
            <Sparkles className="w-4 h-4 text-[#121420]" />
          </div>
          <div>
            <span className="font-display font-black text-xl tracking-[0.2em] text-white block leading-none">
              AADHYA
            </span>
            <span className="text-[9px] font-bold text-gray-400 tracking-wider uppercase block mt-1">
              Store Platform
            </span>
          </div>
        </div>

        {/* Navigation list matching reference image */}
        <nav className="space-y-1.5">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = isNavActive(link.href, link.exact);
            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileDrawerOpen(false)}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  active
                    ? 'bg-[#202434] text-white font-bold shadow-sm'
                    : 'text-[#878e9f] hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`w-4 h-4 ${active ? 'text-white' : 'text-[#878e9f]'}`} />
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

      {/* Bottom Profile Pill */}
      <div className="pt-4 border-t border-white/5 space-y-3">
        <div className="relative">
          <button
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            className="w-full flex items-center justify-between p-2 rounded-xl bg-[#1b1e2c] border border-white/5 hover:border-white/10 transition-colors text-left"
          >
            <div className="flex items-center space-x-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-400 to-amber-600 flex items-center justify-center text-[#121420] font-black text-xs flex-shrink-0">
                {adminProfile.name.charAt(0)}
              </div>
              <div className="min-w-0">
                <span className="text-xs font-bold text-white block truncate leading-tight">
                  {adminProfile.name}
                </span>
                <span className="text-[10px] text-gray-400 font-medium block truncate">
                  {adminProfile.role}
                </span>
              </div>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-gray-500" />
          </button>

          {/* Profile Dropdown */}
          <AnimatePresence>
            {profileDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute bottom-full left-0 right-0 mb-2 bg-[#1b1e2c] border border-white/10 rounded-2xl p-2 shadow-2xl z-50 space-y-1"
              >
                <Link
                  href="/admin/profile"
                  onClick={() => setProfileDropdownOpen(false)}
                  className="flex items-center space-x-2.5 px-3 py-2 text-xs font-semibold text-gray-300 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
                >
                  <Settings className="w-3.5 h-3.5 text-amber-400" />
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
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#eaecf2] p-2 sm:p-4 md:p-6 lg:p-7 flex items-center justify-center font-sans antialiased text-[#1a1f36]">
      {/* Outer rounded desktop shell */}
      <div className="w-full max-w-[1640px] min-h-[94vh] bg-[#121420] rounded-[24px] md:rounded-[32px] shadow-2xl border border-black/10 flex overflow-hidden">
        
        {/* Permanent Desktop Left Sidebar */}
        <aside className="hidden lg:flex w-64 bg-[#121420] border-r border-white/5 flex-shrink-0 flex-col">
          <SidebarContent />
        </aside>

        {/* Mobile Header Bar */}
        <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-[#121420] border-b border-white/5 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-7 h-7 rounded-lg bg-amber-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-[#121420]" />
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
                className="fixed left-0 top-0 bottom-0 z-50 w-72 bg-[#121420] border-r border-white/10 shadow-2xl lg:hidden flex flex-col"
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

        {/* Main Content Canvas (Clean crisp off-white surface) */}
        <main className="flex-1 min-w-0 bg-[#f7f8fc] rounded-[20px] md:rounded-[28px] m-1 md:m-2 p-4 sm:p-6 md:p-8 lg:p-9 overflow-y-auto flex flex-col pt-16 lg:pt-8">
          {children}
        </main>

      </div>
    </div>
  );
}
