"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Tag, 
  Receipt, 
  Users, 
  Archive, 
  Percent, 
  Image as ImageIcon, 
  Star, 
  Disc, 
  Bell, 
  Settings, 
  LogOut, 
  Search,
  Menu,
  X,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminDashboard() {
  const router = useRouter();
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('Dashboard');

  const sidebarLinks = [
    { name: 'Dashboard', icon: LayoutDashboard },
    { name: 'Products', icon: ShoppingBag },
    { name: 'Categories', icon: Tag },
    { name: 'Orders', icon: Receipt },
    { name: 'Customers', icon: Users },
    { name: 'Inventory', icon: Archive },
    { name: 'Coupons', icon: Percent },
    { name: 'Banners', icon: ImageIcon },
    { name: 'Reviews', icon: Star },
    { name: 'Numismatics', icon: Disc },
    { name: 'Notifications', icon: Bell, badge: 3 },
    { name: 'Settings', icon: Settings },
  ];

  const handleLogout = () => {
    router.push('/');
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full py-6 justify-between select-none">
      <div className="space-y-8">
        {/* Brand Header */}
        <div className="px-6 flex items-center space-x-2">
          <span className="text-[10px] bg-brand-dustyRose text-brand-espresso font-extrabold px-2 py-0.5 rounded tracking-widest uppercase">
            ADMIN
          </span>
          <span className="font-display font-extrabold text-lg tracking-[0.2em] text-brand-espresso">
            AADHYA
          </span>
        </div>

        {/* Links grid */}
        <nav className="space-y-1 px-3">
          {sidebarLinks.map((link) => {
            const Icon = link.icon;
            const isActive = activeTab === link.name;
            return (
              <button
                key={link.name}
                onClick={() => {
                  setActiveTab(link.name);
                  setMobileDrawerOpen(false);
                }}
                className={`flex items-center justify-between w-full py-2.5 px-4 rounded-xl text-left text-xs font-bold transition-all relative ${
                  isActive 
                    ? 'bg-brand-softBeige text-brand-espresso' 
                    : 'text-brand-warmGray hover:bg-brand-softBeige/30 hover:text-brand-espresso'
                }`}
              >
                {isActive && (
                  <span className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-brand-dustyRose rounded-r-md" />
                )}
                <div className="flex items-center space-x-3.5">
                  <Icon className="w-4 h-4" />
                  <span className="tracking-widest uppercase">{link.name}</span>
                </div>
                {link.badge && (
                  <span className="bg-[#F4511E] text-brand-white text-[8px] font-extrabold px-1.5 py-0.5 rounded-full">
                    {link.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Logout button */}
      <div className="px-3 border-t border-brand-border/40 pt-4">
        <button
          onClick={handleLogout}
          className="flex items-center space-x-3.5 w-full py-2.5 px-4 text-left text-xs font-bold text-[#F4511E] hover:bg-red-50 rounded-xl transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span className="tracking-widest uppercase">LOGOUT</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="w-full min-h-screen bg-brand-warmWhite flex">
      {/* 1. Permanent Desktop Sidebar */}
      <aside className="hidden lg:block w-64 bg-brand-white border-r border-brand-border/60 flex-shrink-0">
        <SidebarContent />
      </aside>

      {/* 2. Mobile Drawer Sidebar */}
      <AnimatePresence>
        {mobileDrawerOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileDrawerOpen(false)}
              className="fixed inset-0 z-50 bg-brand-espresso/30 backdrop-blur-sm lg:hidden"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="fixed left-0 top-0 bottom-0 z-50 w-64 bg-brand-white border-r border-brand-border/60 shadow-2xl lg:hidden"
            >
              <SidebarContent />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* 3. Main Dashboard Wrapper */}
      <main className="flex-grow flex flex-col min-w-0">
        {/* Top Header Bar */}
        <header className="h-16 border-b border-brand-border/60 bg-brand-white/80 backdrop-blur-md px-6 flex items-center justify-between select-none">
          <div className="flex items-center space-x-4">
            {/* Hamburger Trigger for Mobile */}
            <button
              onClick={() => setMobileDrawerOpen(true)}
              className="lg:hidden p-1 text-brand-espresso hover:bg-brand-softBeige/40 rounded-lg transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Title / Tab Info */}
            <h1 className="font-display font-extrabold text-sm tracking-widest text-brand-espresso uppercase">
              {activeTab} Overview
            </h1>
          </div>

          {/* Search, Notifications, Admin Profile */}
          <div className="flex items-center space-x-4">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-warmGray" />
              <input
                type="text"
                placeholder="Search resources..."
                className="pl-9 pr-4 py-1.5 w-60 bg-brand-warmWhite/50 border border-brand-border/80 rounded-full text-xs text-brand-espresso focus:outline-none focus:border-brand-espresso transition-all"
              />
            </div>

            <button className="p-1.5 text-brand-warmGray hover:text-brand-espresso transition-colors relative">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-[#F4511E] rounded-full" />
            </button>

            <div className="flex items-center space-x-2 border-l border-brand-border/60 pl-4">
              <div className="w-7 h-7 rounded-full bg-brand-softBeige flex items-center justify-center text-xs font-bold text-brand-espresso border border-brand-border">
                AD
              </div>
              <span className="hidden sm:inline text-[10px] font-extrabold text-brand-espresso tracking-widest uppercase">
                ADMIN DEPT
              </span>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="p-6 md:p-8 space-y-8 overflow-y-auto flex-grow">
          {/* Key Metrics Widgets (2-column layout on mobile) */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {/* Metric 1 */}
            <div className="bg-brand-white border border-brand-border/60 p-5 rounded-2xl shadow-sm space-y-2 relative overflow-hidden">
              <span className="text-[9px] font-bold text-brand-warmGray tracking-widest uppercase block">
                TOTAL REVENUE
              </span>
              <div className="flex items-baseline space-x-2">
                <span className="text-xl font-extrabold text-brand-espresso">₹12,45,800</span>
                <span className="text-[8px] text-brand-success font-extrabold flex items-center">
                  <TrendingUp className="w-2.5 h-2.5 mr-0.5" /> +14.2%
                </span>
              </div>
              <span className="text-[8px] text-brand-warmGray font-bold block">Vs previous billing cycle</span>
            </div>

            {/* Metric 2 */}
            <div className="bg-brand-white border border-brand-border/60 p-5 rounded-2xl shadow-sm space-y-2 relative overflow-hidden">
              <span className="text-[9px] font-bold text-brand-warmGray tracking-widest uppercase block">
                ACTIVE ORDERS
              </span>
              <div className="flex items-baseline space-x-2">
                <span className="text-xl font-extrabold text-brand-espresso">382</span>
                <span className="text-[8px] text-brand-success font-extrabold flex items-center">
                  +8.5%
                </span>
              </div>
              <span className="text-[8px] text-brand-warmGray font-bold block">12 pending processing</span>
            </div>

            {/* Metric 3 */}
            <div className="bg-brand-white border border-brand-border/60 p-5 rounded-2xl shadow-sm space-y-2 relative overflow-hidden">
              <span className="text-[9px] font-bold text-brand-warmGray tracking-widest uppercase block">
                NEW CUSTOMERS
              </span>
              <div className="flex items-baseline space-x-2">
                <span className="text-xl font-extrabold text-brand-espresso">1,204</span>
                <span className="text-[8px] text-brand-success font-extrabold flex items-center text-brand-dustyRose">
                  ★ Star growth
                </span>
              </div>
              <span className="text-[8px] text-brand-warmGray font-bold block">In last 30 calendar days</span>
            </div>

            {/* Metric 4 */}
            <div className="bg-brand-white border border-brand-border/60 p-5 rounded-2xl shadow-sm space-y-2 relative overflow-hidden">
              <span className="text-[9px] font-bold text-brand-warmGray tracking-widest uppercase block">
                NUMISMATICS SALES
              </span>
              <div className="flex items-baseline space-x-2">
                <span className="text-xl font-extrabold text-brand-espresso">₹3,84,200</span>
                <span className="text-[8px] text-[#F4511E] font-extrabold">
                  ★ Premium
                </span>
              </div>
              <span className="text-[8px] text-brand-warmGray font-bold block">Highly active collection</span>
            </div>
          </div>

          {/* Lower Grid Panels */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Recent Orders List (7 cols) */}
            <div className="lg:col-span-7 bg-brand-white border border-brand-border/60 rounded-2xl p-5 shadow-sm space-y-4">
              <span className="text-[10px] font-extrabold text-brand-espresso tracking-widest block uppercase border-b border-brand-border pb-2">
                RECENT ORDERS
              </span>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-brand-border text-brand-warmGray font-extrabold text-[9px] tracking-widest uppercase">
                      <th className="py-2.5">ORDER ID</th>
                      <th className="py-2.5">CUSTOMER</th>
                      <th className="py-2.5">AMOUNT</th>
                      <th className="py-2.5">STATUS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brand-border/30 text-brand-espresso font-semibold">
                    <tr>
                      <td className="py-3 font-mono">#AD-9345</td>
                      <td className="py-3">Anjali Sharma</td>
                      <td className="py-3">₹4,998</td>
                      <td className="py-3"><span className="bg-brand-success/15 text-brand-success text-[8px] px-2 py-0.5 rounded font-extrabold tracking-wider uppercase">DELIVERED</span></td>
                    </tr>
                    <tr>
                      <td className="py-3 font-mono">#AD-9346</td>
                      <td className="py-3">Rohan Singhal</td>
                      <td className="py-3">₹12,500</td>
                      <td className="py-3"><span className="bg-amber-100 text-amber-700 text-[8px] px-2 py-0.5 rounded font-extrabold tracking-wider uppercase">PENDING</span></td>
                    </tr>
                    <tr>
                      <td className="py-3 font-mono">#AD-9347</td>
                      <td className="py-3">Priya Iyer</td>
                      <td className="py-3">₹3,999</td>
                      <td className="py-3"><span className="bg-blue-100 text-blue-700 text-[8px] px-2 py-0.5 rounded font-extrabold tracking-wider uppercase">SHIPPED</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Right: Low Stock Alert panel (5 cols) */}
            <div className="lg:col-span-5 bg-brand-white border border-brand-border/60 rounded-2xl p-5 shadow-sm space-y-4">
              <span className="text-[10px] font-extrabold text-brand-espresso tracking-widest block uppercase border-b border-brand-border pb-2 flex items-center justify-between">
                <span>STOCK ALERTS</span>
                <AlertTriangle className="w-4 h-4 text-[#F4511E]" />
              </span>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-2.5 bg-red-50 border border-red-100 rounded-xl">
                  <div className="space-y-0.5 text-left">
                    <span className="text-[10px] font-bold text-brand-espresso block">THE ROSE SILK SAREE</span>
                    <span className="text-[8px] text-brand-warmGray block">SKU: F-SAREE-ROS</span>
                  </div>
                  <span className="text-[9px] font-extrabold bg-[#F4511E]/10 text-[#F4511E] px-2 py-0.5 rounded">2 LEFT</span>
                </div>

                <div className="flex items-center justify-between p-2.5 bg-amber-50 border border-amber-100 rounded-xl">
                  <div className="space-y-0.5 text-left">
                    <span className="text-[10px] font-bold text-brand-espresso block">CHIC CO-ORD SET</span>
                    <span className="text-[8px] text-brand-warmGray block">SKU: F-COORD-CHIC</span>
                  </div>
                  <span className="text-[9px] font-extrabold bg-amber-600/10 text-amber-700 px-2 py-0.5 rounded">5 LEFT</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
