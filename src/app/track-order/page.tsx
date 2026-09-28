"use client";

import React, { useState } from 'react';
import { 
  Search, 
  Package, 
  Truck, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  ExternalLink,
  ArrowRight
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function TrackOrderPage() {
  const [orderNo, setOrderNo] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [trackingData, setTrackingData] = useState<any>(null);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderNo.trim()) return;

    try {
      setLoading(true);
      setError(null);
      setTrackingData(null);

      const res = await fetch(`/api/orders/track?orderNo=${encodeURIComponent(orderNo.trim())}`);
      const data = await res.json();

      if (data.success && data.tracking) {
        setTrackingData(data.tracking);
      } else {
        setError(data.error || 'Order not found. Please check your order number.');
      }
    } catch (err: any) {
      setError('An error occurred while tracking. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const getStepIndex = (st: string) => {
    switch (st) {
      case 'PENDING': return 0;
      case 'CONFIRMED':
      case 'PROCESSING': return 1;
      case 'SHIPPED': return 2;
      case 'DELIVERED': return 3;
      default: return -1;
    }
  };

  const currentStep = trackingData ? getStepIndex(trackingData.status) : -1;
  const isCancelled = trackingData && (trackingData.status === 'CANCELLED' || trackingData.status === 'REFUNDED' || trackingData.status === 'REJECTED');

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#181818] pt-24 pb-20 px-4 sm:px-6 md:px-12 flex flex-col items-center">
      <div className="w-full max-w-3xl space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <span className="text-xs sm:text-sm text-[#7A6B5C] font-bold tracking-[0.25em] uppercase block">
            Customer Support
          </span>
          <h1 className="font-serif font-black text-4xl md:text-5xl text-[#181818] tracking-tight">
            Track Your Order
          </h1>
          <p className="text-sm text-brand-warmGray max-w-md mx-auto">
            Enter your order number below to check the real-time status of your delivery.
          </p>
        </div>

        {/* Search Form */}
        <form onSubmit={handleTrack} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-grow">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="e.g. AD-893478921"
              value={orderNo}
              onChange={(e) => setOrderNo(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white border border-[#EFE6DA] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#7A6B5C] font-mono font-medium text-lg placeholder-gray-300"
            />
          </div>
          <button
            type="submit"
            disabled={loading || !orderNo.trim()}
            className="px-8 py-4 bg-[#181818] text-[#FCFAF7] font-bold text-sm tracking-wider uppercase rounded-2xl hover:bg-[#7A6B5C] transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
          >
            {loading ? (
              <span className="animate-pulse">Locating...</span>
            ) : (
              <>
                <span>Track</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Error */}
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl flex items-center space-x-3 text-sm font-medium"
          >
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </motion.div>
        )}

        {/* Tracking Result */}
        {trackingData && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-[#EFE6DA] shadow-sm rounded-3xl p-6 sm:p-10 space-y-8"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EFE6DA] pb-6">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#7A6B5C]">
                  Order Number
                </span>
                <h2 className="text-2xl font-black font-serif text-[#181818] mt-1">
                  {trackingData.order_number}
                </h2>
              </div>
              <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase border ${
                isCancelled
                  ? 'bg-rose-50 border-rose-200 text-rose-700'
                  : trackingData.status === 'DELIVERED'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                  : 'bg-[#EFE6DA] border-[#E5DACB] text-[#181818]'
              }`}>
                {trackingData.status}
              </span>
            </div>

            {isCancelled ? (
              <div className="p-6 rounded-2xl bg-rose-50 border border-rose-100 text-center space-y-2">
                <AlertCircle className="w-8 h-8 text-rose-400 mx-auto" />
                <h3 className="font-bold text-rose-900 text-lg">Order Cancelled</h3>
                {trackingData.rejection_reason && (
                  <p className="text-sm text-rose-700">{trackingData.rejection_reason}</p>
                )}
                <p className="text-xs text-rose-600/80 pt-2">If you have any questions, please contact support.</p>
              </div>
            ) : (
              <div className="space-y-10">
                {/* Timeline */}
                <div className="relative">
                  {/* Connecting Line */}
                  <div className="absolute top-6 left-0 right-0 h-[2px] bg-[#EFE6DA] -z-10 hidden sm:block mx-12"></div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 sm:gap-2">
                    {[
                      { label: 'Order Placed', icon: Clock, step: 0, date: trackingData.created_at },
                      { label: 'Order Approved', icon: CheckCircle2, step: 1, date: null },
                      { label: 'Dispatched', icon: Truck, step: 2, date: trackingData.dispatched_at },
                      { label: 'Delivered', icon: Package, step: 3, date: trackingData.delivered_at },
                    ].map((st, i) => {
                      const isPast = currentStep >= st.step;
                      const isCurrent = currentStep === st.step;
                      const Icon = st.icon;
                      
                      return (
                        <div key={i} className="flex sm:flex-col items-center sm:text-center gap-4 sm:gap-3">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                            isPast 
                              ? 'bg-[#181818] text-[#FCFAF7] shadow-lg' 
                              : 'bg-[#EFE6DA] text-[#7A6B5C]'
                          }`}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <div className="flex flex-col sm:items-center">
                            <span className={`text-xs font-bold uppercase tracking-wider ${
                              isCurrent ? 'text-[#181818]' : isPast ? 'text-[#181818]/80' : 'text-[#7A6B5C]'
                            }`}>
                              {st.label}
                            </span>
                            {st.date && isPast && (
                              <span className="text-[10px] text-[#7A6B5C] font-mono mt-0.5">
                                {new Date(st.date).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Courier details if dispatched */}
                {trackingData.status === 'SHIPPED' && (
                  <div className="bg-[#FAF7F2] border border-[#EFE6DA] rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-[#7A6B5C] uppercase tracking-wider">Shipping Courier</span>
                      <p className="font-bold text-[#181818] text-lg">{trackingData.courier || 'Express Shipping'}</p>
                      <p className="font-mono text-sm text-[#7A6B5C]">Tracking: {trackingData.tracking_number}</p>
                    </div>
                    {trackingData.tracking_url && (
                      <a
                        href={trackingData.tracking_url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center space-x-2 px-6 py-3 bg-white border border-[#EFE6DA] text-[#181818] rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-[#EFE6DA] transition-colors"
                      >
                        <span>Track on {trackingData.courier?.split(' ')[0] || 'Courier'}</span>
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                )}
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
