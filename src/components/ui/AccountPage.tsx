import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, User, ShoppingBag, MapPin, Truck, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type TabType = 'profile' | 'orders' | 'addresses' | 'track' | 'coupons';

export const AccountPage: React.FC = () => {
  const { isAccountOpen, setAccountOpen } = useApp();
  const [activeTab, setActiveTab] = useState<TabType>('profile');
  const [trackId, setTrackId] = useState('');
  const [trackStatus, setTrackStatus] = useState<string | null>(null);

  if (!isAccountOpen) return null;

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (trackId.trim()) {
      setTrackStatus('In Transit - Estimated Delivery: 2 Days');
    }
  };

  const sampleOrders = [
    { id: '#AD-981240', date: 'August 10, 2026', total: '₹3,149', status: 'Delivered', items: 'The Rose Silk Saree (x1)' },
    { id: '#AD-543190', date: 'July 28, 2026', total: '₹3,500', status: 'Delivered', items: 'George VI Silver Rupee (x1)' }
  ];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setAccountOpen(false)}
        className="fixed inset-0 z-50 bg-brand-espresso/50 backdrop-blur-sm flex items-center justify-center p-4 md:p-6"
      >
        <motion.div
          initial={{ scale: 0.96, y: 10 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.96, y: 10 }}
          transition={{ type: 'spring', damping: 25, stiffness: 220 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-brand-warmWhite w-full max-w-3xl rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row relative border border-brand-border h-[500px]"
        >
          {/* Close button */}
          <button
            onClick={() => setAccountOpen(false)}
            className="absolute top-4 right-4 z-10 p-2 text-brand-espresso hover:text-brand-dustyRose bg-brand-white/80 border border-brand-border/60 rounded-full transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Left: Sidebar (3 cols relative) */}
          <div className="w-full md:w-1/3 bg-brand-softBeige/40 border-b md:border-b-0 md:border-r border-brand-border/60 p-6 flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center space-x-3 pb-4 border-b border-brand-border/60">
                <div className="w-10 h-10 rounded-full bg-brand-espresso flex items-center justify-center text-brand-white">
                  <User className="w-5 h-5 stroke-[1.5]" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-sm text-brand-espresso">Aadhya Member</h3>
                  <span className="text-[9px] text-brand-warmGray font-bold tracking-wider">ELITE COLLECTOR</span>
                </div>
              </div>

              {/* Sidebar Tabs */}
              <nav className="flex md:flex-col overflow-x-auto md:overflow-x-visible space-x-4 md:space-x-0 md:space-y-1 text-xs font-bold tracking-widest text-brand-warmGray">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`flex items-center space-x-2 py-2 px-3 rounded-lg text-left w-full transition-colors ${
                    activeTab === 'profile' ? 'bg-brand-white text-brand-espresso border border-brand-border/60' : 'hover:text-brand-espresso'
                  }`}
                >
                  <User className="w-3.5 h-3.5" />
                  <span>PROFILE</span>
                </button>
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`flex items-center space-x-2 py-2 px-3 rounded-lg text-left w-full transition-colors ${
                    activeTab === 'orders' ? 'bg-brand-white text-brand-espresso border border-brand-border/60' : 'hover:text-brand-espresso'
                  }`}
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>ORDERS</span>
                </button>
                <button
                  onClick={() => setActiveTab('addresses')}
                  className={`flex items-center space-x-2 py-2 px-3 rounded-lg text-left w-full transition-colors ${
                    activeTab === 'addresses' ? 'bg-brand-white text-brand-espresso border border-brand-border/60' : 'hover:text-brand-espresso'
                  }`}
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>ADDRESSES</span>
                </button>
                <button
                  onClick={() => setActiveTab('track')}
                  className={`flex items-center space-x-2 py-2 px-3 rounded-lg text-left w-full transition-colors ${
                    activeTab === 'track' ? 'bg-brand-white text-brand-espresso border border-brand-border/60' : 'hover:text-brand-espresso'
                  }`}
                >
                  <Truck className="w-3.5 h-3.5" />
                  <span>TRACK ORDER</span>
                </button>
              </nav>
            </div>

            {/* Logout button */}
            <button
              onClick={() => {
                alert('Logging out of account...');
                setAccountOpen(false);
              }}
              className="hidden md:flex items-center space-x-2 text-xs font-bold tracking-widest text-brand-sale hover:opacity-85 transition-opacity pt-4 border-t border-brand-border/60"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>LOGOUT</span>
            </button>
          </div>

          {/* Right: Content panel (2/3 cols relative) */}
          <div className="flex-grow p-8 overflow-y-auto">
            
            {/* Tab: Profile */}
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <h4 className="text-xs font-bold tracking-[0.2em] text-brand-espresso border-b border-brand-border pb-2">
                  MY PROFILE DETAILS
                </h4>
                <div className="grid grid-cols-2 gap-4 text-xs font-semibold text-brand-espresso tracking-wide">
                  <div>
                    <span className="text-[10px] text-brand-warmGray block">FULL NAME</span>
                    <span className="font-bold">Aadhya Member</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-brand-warmGray block">MEMBER SINCE</span>
                    <span className="font-bold">August 2026</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-[10px] text-brand-warmGray block">EMAIL ADDRESS</span>
                    <span className="font-bold">member@aadhya.com</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-brand-warmGray block">PHONE CONTACT</span>
                    <span className="font-bold">+91 98765 43210</span>
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Orders */}
            {activeTab === 'orders' && (
              <div className="space-y-6">
                <h4 className="text-xs font-bold tracking-[0.2em] text-brand-espresso border-b border-brand-border pb-2">
                  ORDER HISTORY
                </h4>
                <div className="space-y-4">
                  {sampleOrders.map((ord) => (
                    <div key={ord.id} className="p-4 border border-brand-border/60 rounded-xl bg-brand-white text-[11px] font-semibold space-y-1 relative">
                      <div className="flex justify-between items-baseline font-bold">
                        <span className="text-brand-espresso text-xs">{ord.id}</span>
                        <span className="text-brand-success bg-brand-success/10 border border-brand-success/20 px-2 py-0.5 rounded text-[8.5px] uppercase tracking-wider">{ord.status}</span>
                      </div>
                      <p className="text-brand-warmGray">{ord.items}</p>
                      <div className="flex justify-between text-brand-warmGray pt-1.5 border-t border-brand-border/30">
                        <span>{ord.date}</span>
                        <span className="font-bold text-brand-espresso">{ord.total}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab: Addresses */}
            {activeTab === 'addresses' && (
              <div className="space-y-6">
                <h4 className="text-xs font-bold tracking-[0.2em] text-brand-espresso border-b border-brand-border pb-2">
                  SAVED ADDRESSES
                </h4>
                <div className="p-4 border border-brand-border/60 rounded-xl bg-brand-white text-[11px] font-semibold space-y-2 text-left relative">
                  <div className="flex items-center space-x-2 text-brand-espresso font-bold text-xs">
                    <MapPin className="w-3.5 h-3.5 text-brand-warmGray" />
                    <span>Home Address (Default)</span>
                  </div>
                  <p className="text-brand-warmGray leading-relaxed">
                    Aadhya Member <br />
                    101 Heritage Estate, Colaba Road <br />
                    Mumbai, Maharashtra - 400005 <br />
                    India
                  </p>
                </div>
              </div>
            )}

            {/* Tab: Track Order */}
            {activeTab === 'track' && (
              <div className="space-y-6">
                <h4 className="text-xs font-bold tracking-[0.2em] text-brand-espresso border-b border-brand-border pb-2">
                  TRACK MY CONSIGNMENTS
                </h4>
                <form onSubmit={handleTrackSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-brand-warmGray tracking-wider block">ENTER ORDER ID</label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. AD-981240"
                      value={trackId}
                      onChange={(e) => setTrackId(e.target.value)}
                      className="w-full bg-brand-warmWhite border border-brand-border/80 p-3 rounded-lg text-xs outline-none focus:border-brand-espresso font-semibold"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2.5 bg-brand-espresso text-brand-white text-xs font-bold tracking-widest uppercase hover:opacity-90 rounded-lg shadow-sm"
                  >
                    SEARCH ORDER STATUS
                  </button>
                </form>

                {trackStatus && (
                  <div className="p-4 border border-brand-border/60 bg-brand-softBeige/20 rounded-xl text-xs font-bold text-brand-espresso text-center">
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
