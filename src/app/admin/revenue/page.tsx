"use client";

import React, { useState, useEffect } from 'react';
import { TrendingUp, DollarSign, Calendar, RefreshCcw, Shirt, Coins, ArrowUpRight } from 'lucide-react';

import { ExportButton } from '@/components/admin/ExportButton';

export default function AdminRevenuePage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState<'7d' | '30d' | '90d'>('30d');

  const fetchRevenueData = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/dashboard');
      const json = await res.json();
      if (json.success) {
        setData(json);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRevenueData();
  }, []);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val || 0);
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-xs font-bold text-gray-400 animate-pulse">
        Calculating financial aggregates...
      </div>
    );
  }

  const { revenue = {}, domainComparison = { fashion: {}, numismatics: {} }, chartData = [] } = data || {};

  let visiblePoints = chartData;
  if (timeframe === '7d') visiblePoints = visiblePoints.slice(-7);
  else if (timeframe === '30d') visiblePoints = visiblePoints.slice(-30);

  const maxVal = Math.max(...visiblePoints.map((p: any) => Number(p.revenue) || 0), 1000);

  return (
    <div className="space-y-8 text-left pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Financial & Revenue Analytics</h1>
          <p className="text-xs font-semibold text-gray-500">
            Authoritative realized revenue, sales timeline, and domain financial split
          </p>
        </div>
        <div className="flex space-x-2 self-start sm:self-auto">
          <ExportButton type="revenue" label="Download Excel" />
          <button
            onClick={fetchRevenueData}
            className="p-2 text-gray-500 hover:text-black bg-white border border-gray-200 rounded-xl hover:bg-gray-50 shadow-sm transition-colors"
          >
            <RefreshCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Revenue KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
            TOTAL REALIZED REVENUE
          </span>
          <span className="text-2xl font-black text-gray-900 block mt-1">
            {formatCurrency(revenue.total)}
          </span>
          <span className="text-[10px] text-emerald-600 font-bold block mt-1">
            Excludes cancelled orders
          </span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
            TODAY'S REVENUE
          </span>
          <span className="text-2xl font-black text-gray-900 block mt-1">
            {formatCurrency(revenue.today)}
          </span>
          <span className="text-[10px] text-gray-400 font-semibold block mt-1">
            Daily active billing
          </span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
            LAST 30 DAYS
          </span>
          <span className="text-2xl font-black text-[#cca05b] block mt-1">
            {formatCurrency(revenue.monthly)}
          </span>
          <span className="text-[10px] text-gray-400 font-semibold block mt-1">
            Rolling monthly inflow
          </span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
            AVERAGE ORDER VALUE (AOV)
          </span>
          <span className="text-2xl font-black text-gray-900 block mt-1">
            {formatCurrency(revenue.averageOrderValue)}
          </span>
          <span className="text-[10px] text-gray-400 font-semibold block mt-1">
            Per paid transaction
          </span>
        </div>
      </div>

      {/* Dynamic Chart */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-extrabold text-gray-900">Revenue Inflow Timeline</h3>
            <p className="text-xs text-gray-400 font-semibold">Daily transaction breakdown</p>
          </div>
          <div className="flex items-center bg-gray-100 p-1 rounded-xl text-xs font-bold">
            {(['7d', '30d', '90d'] as const).map(tf => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  timeframe === tf ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'
                }`}
              >
                {tf.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <div className="h-60 flex items-end gap-1 sm:gap-2 border-b border-gray-100 pb-2">
          {visiblePoints.map((pt: any, i: number) => {
            const rev = Number(pt.revenue) || 0;
            const h = Math.max(6, Math.min(100, Math.round((rev / maxVal) * 100)));
            return (
              <div key={i} className="flex-1 flex flex-col items-center justify-end h-full group relative">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute bottom-full mb-2 bg-[#15171c] text-white text-[10px] rounded-lg px-2 py-1 pointer-events-none whitespace-nowrap shadow-xl z-20 font-bold">
                  <div>{pt.label}</div>
                  <div className="text-[#cca05b]">{formatCurrency(rev)}</div>
                  <div>{pt.orders} order(s)</div>
                </div>
                <div
                  style={{ height: `${h}%` }}
                  className={`w-full rounded-t-md transition-all ${
                    rev > 0 ? 'bg-gradient-to-t from-[#ca9752] to-[#dfa658]' : 'bg-gray-100'
                  }`}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Domain Financial Split */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-[#cca05b] flex items-center justify-center">
              <Shirt className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-base font-black text-gray-900">Fashion Apparel Inflow</h4>
              <span className="text-xs text-gray-400 font-semibold">Women's luxury & ethnic</span>
            </div>
          </div>
          <div className="pt-2">
            <span className="text-2xl font-black text-gray-900 block">
              {formatCurrency(domainComparison.fashion.revenue)}
            </span>
            <span className="text-xs font-semibold text-gray-500">
              {domainComparison.fashion.units || 0} units sold across catalog
            </span>
          </div>
        </div>

        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Coins className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-base font-black text-gray-900">Numismatics Inflow</h4>
              <span className="text-xs text-gray-400 font-semibold">Coins, currency, and medals</span>
            </div>
          </div>
          <div className="pt-2">
            <span className="text-2xl font-black text-gray-900 block">
              {formatCurrency(domainComparison.numismatics.revenue)}
            </span>
            <span className="text-xs font-semibold text-gray-500">
              {domainComparison.numismatics.units || 0} units sold across collection
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
