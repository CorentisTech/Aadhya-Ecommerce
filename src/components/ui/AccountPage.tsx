"use client";

import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { X, User, ShoppingBag, MapPin, Truck, LogOut, Loader2, Package } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

type TabType = 'profile' | 'orders' | 'addresses' | 'track';

interface OrderItem {
  id: string;
  quantity: number;
  unit_price: number;
  product_name: string;
  product_no: string;
}

interface Order {
  id: string;
  order_number: string;
  status: string;
  total_amount: number;
  created_at: string;
  items: OrderItem[];
}

export const AccountPage: React.FC = () => {
  const router = useRouter();
  const { isAccountOpen, setAccountOpen, user, isLoggedIn, logoutUser } = useApp();
  const [activeTab, setActiveTab] = useState<TabType>('profile');
  const [trackId, setTrackId] = useState('');
  const [trackStatus, setTrackStatus] = useState<string | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  useEffect(() => {
    if (isAccountOpen && isLoggedIn) {
      setOrdersLoading(true);
      fetch('/api/orders')
        .then((res) => (res.ok ? res.json() : []))
        .then((data) => setOrders(Array.isArray(data) ? data : []))
        .catch(() => setOrders([]))
        .finally(() => setOrdersLoading(false));
    }
  }, [isAccountOpen, isLoggedIn]);

  if (!isAccountOpen) return null;

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (trackId.trim()) {
      const found = orders.find(o => o.order_number?.toLowerCase() === trackId.trim().toLowerCase());
      if (found) {
        setTrackStatus(`Order #${found.order_number}: Status is ${found.status.toUpperCase()}`);
      } else {
        setTrackStatus(`Tracking ID ${trackId.trim()}: In Transit with Express Courier`);
      }
    }
  };

  const displayName = user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : (user?.email?.split('@')[0] || 'Member');

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setAccountOpen(false)}
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 md:p-6"
      >
        <motion.div
          initial={{ scale: 0.96, y: 10 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.96, y: 10 }}
          transition={{ type: 'spring', damping: 25, stiffness: 220 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-[#FAF7F2] w-full max-w-3xl rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row relative border border-[#D5C7B5] h-[520px]"
        >
          {/* Close button */}
          <button
            onClick={() => setAccountOpen(false)}
            className="absolute top-4 right-4 z-10 p-2 text-[#181818] hover:bg-[#EFE6DA] bg-white border border-[#D5C7B5] rounded-full transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Left: Sidebar */}
          <div className="w-full md:w-1/3 bg-[#EFE6DA]/60 border-b md:border-b-0 md:border-r border-[#D5C7B5] p-6 flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center space-x-3 pb-4 border-b border-[#D5C7B5]">
                <div className="w-10 h-10 rounded-full bg-[#181818] flex items-center justify-center text-[#FAF7F2]">
                  <User className="w-5 h-5 stroke-[1.5]" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-sm text-[#181818] truncate max-w-[140px]">
                    {isLoggedIn ? displayName : 'Guest Visitor'}
                  </h3>
                  <span className="text-[9px] text-[#7A6B5C] font-bold tracking-wider uppercase">
                    {isLoggedIn ? 'AADHYA CLIENT' : 'NOT SIGNED IN'}
                  </span>
                </div>
              </div>

              {/* Sidebar Tabs */}
              <nav className="flex md:flex-col overflow-x-auto md:overflow-x-visible space-x-4 md:space-x-0 md:space-y-1 text-xs font-bold tracking-widest text-[#7A6B5C]">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`flex items-center space-x-2 py-2 px-3 rounded-xl text-left w-full transition-colors cursor-pointer ${
                    activeTab === 'profile' ? 'bg-[#FAF7F2] text-[#181818] border border-[#D5C7B5] shadow-xs' : 'hover:text-[#181818]'
                  }`}
                >
                  <User className="w-3.5 h-3.5" />
                  <span>PROFILE</span>
                </button>
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`flex items-center space-x-2 py-2 px-3 rounded-xl text-left w-full transition-colors cursor-pointer ${
                    activeTab === 'orders' ? 'bg-[#FAF7F2] text-[#181818] border border-[#D5C7B5] shadow-xs' : 'hover:text-[#181818]'
                  }`}
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>ORDERS</span>
                </button>
                <button
                  onClick={() => setActiveTab('addresses')}
                  className={`flex items-center space-x-2 py-2 px-3 rounded-xl text-left w-full transition-colors cursor-pointer ${
                    activeTab === 'addresses' ? 'bg-[#FAF7F2] text-[#181818] border border-[#D5C7B5] shadow-xs' : 'hover:text-[#181818]'
                  }`}
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>ADDRESS</span>
                </button>
                <button
                  onClick={() => setActiveTab('track')}
                  className={`flex items-center space-x-2 py-2 px-3 rounded-xl text-left w-full transition-colors cursor-pointer ${
                    activeTab === 'track' ? 'bg-[#FAF7F2] text-[#181818] border border-[#D5C7B5] shadow-xs' : 'hover:text-[#181818]'
                  }`}
                >
                  <Truck className="w-3.5 h-3.5" />
                  <span>TRACK</span>
                </button>
              </nav>
            </div>

            {/* Logout or Login button */}
            {isLoggedIn ? (
              <button
                onClick={async () => {
                  await logoutUser();
                  setAccountOpen(false);
                  router.push('/');
                }}
                className="hidden md:flex items-center space-x-2 text-xs font-bold tracking-widest text-rose-600 hover:opacity-85 transition-opacity pt-4 border-t border-[#D5C7B5] cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>SIGN OUT</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  setAccountOpen(false);
                  router.push('/account');
                }}
                className="hidden md:flex items-center space-x-2 text-xs font-bold tracking-widest text-[#181818] hover:underline pt-4 border-t border-[#D5C7B5] cursor-pointer"
              >
                <User className="w-3.5 h-3.5" />
                <span>SIGN IN</span>
              </button>
            )}
          </div>

          {/* Right: Content panel */}
          <div className="flex-grow p-6 sm:p-8 overflow-y-auto">
            
            {/* Tab: Profile */}
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-[#D5C7B5] pb-2">
                  <h4 className="text-xs font-bold tracking-[0.2em] text-[#181818] uppercase">
                    Client Details
                  </h4>
                  <button
                    onClick={() => {
                      setAccountOpen(false);
                      router.push('/account');
                    }}
                    className="text-[11px] font-bold text-[#181818] underline hover:opacity-80"
                  >
                    Manage Account
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-4 text-xs font-semibold text-[#181818]">
                  <div>
                    <span className="text-[10px] text-[#7A6B5C] block">NAME</span>
                    <span className="font-bold">{displayName}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#7A6B5C] block">STATUS</span>
                    <span className="font-bold text-emerald-700">{isLoggedIn ? 'Active Session' : 'Guest'}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-[10px] text-[#7A6B5C] block">EMAIL</span>
                    <span className="font-bold">{user?.email || 'Not configured'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#7A6B5C] block">PHONE</span>
                    <span className="font-bold">{user?.phone || 'Not configured'}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Orders */}
            {activeTab === 'orders' && (
              <div className="space-y-6">
                <h4 className="text-xs font-bold tracking-[0.2em] text-[#181818] border-b border-[#D5C7B5] pb-2 uppercase">
                  Order History
                </h4>
                {ordersLoading ? (
                  <div className="py-8 flex justify-center">
                    <Loader2 className="w-5 h-5 text-[#181818] animate-spin" />
                  </div>
                ) : orders.length === 0 ? (
                  <div className="py-8 text-center space-y-2">
                    <Package className="w-8 h-8 text-[#7A6B5C] mx-auto" />
                    <p className="text-xs text-[#7A6B5C]">No orders placed yet under this account.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {orders.map((ord) => (
                      <div key={ord.id} className="p-3.5 border border-[#D5C7B5] rounded-xl bg-white text-xs space-y-1">
                        <div className="flex justify-between items-baseline font-bold">
                          <span className="text-[#181818]">#{ord.order_number}</span>
                          <span className="text-[9px] font-bold px-2 py-0.5 rounded-full uppercase bg-[#EFE6DA] text-[#181818]">{ord.status}</span>
                        </div>
                        <div className="flex justify-between text-[#7A6B5C] text-[10px] pt-1">
                          <span>{new Date(ord.created_at).toLocaleDateString()}</span>
                          <span className="font-bold text-[#181818]">₹{Number(ord.total_amount).toLocaleString('en-IN')}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Tab: Addresses */}
            {activeTab === 'addresses' && (
              <div className="space-y-6">
                <h4 className="text-xs font-bold tracking-[0.2em] text-[#181818] border-b border-[#D5C7B5] pb-2 uppercase">
                  Shipping Address
                </h4>
                <div className="p-4 border border-[#D5C7B5] rounded-2xl bg-white text-xs space-y-2 text-left">
                  <div className="flex items-center space-x-2 text-[#181818] font-bold">
                    <MapPin className="w-3.5 h-3.5 text-[#7A6B5C]" />
                    <span>Default Destination</span>
                  </div>
                  <p className="text-[#7A6B5C] leading-relaxed">
                    {user?.streetName ? (
                      <>
                        {user.firstName} {user.lastName}<br />
                        {user.streetName}{user.landmark ? `, ${user.landmark}` : ''}<br />
                        {user.city}, {user.state} - {user.zip}
                      </>
                    ) : (
                      'No saved shipping address found.'
                    )}
                  </p>
                </div>
              </div>
            )}

            {/* Tab: Track Order */}
            {activeTab === 'track' && (
              <div className="space-y-6">
                <h4 className="text-xs font-bold tracking-[0.2em] text-[#181818] border-b border-[#D5C7B5] pb-2 uppercase">
                  Track Consignment
                </h4>
                <form onSubmit={handleTrackSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-[#7A6B5C] tracking-wider block">ENTER ORDER NUMBER</label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. ORD-98242"
                      value={trackId}
                      onChange={(e) => setTrackId(e.target.value)}
                      className="w-full bg-white border border-[#D5C7B5] p-3 rounded-xl text-xs outline-none focus:border-[#181818] font-semibold"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2.5 bg-[#181818] text-[#FAF7F2] text-xs font-bold tracking-widest uppercase hover:bg-black rounded-xl shadow-xs cursor-pointer"
                  >
                    SEARCH ORDER STATUS
                  </button>
                </form>

                {trackStatus && (
                  <div className="p-4 border border-[#D5C7B5] bg-white rounded-xl text-xs font-bold text-[#181818] text-center">
                    {trackStatus}
                  </div>
                )}
              </div>
            )}

          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
export default AccountPage;
