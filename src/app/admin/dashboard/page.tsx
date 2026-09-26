"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Tag, 
  Receipt, 
  CreditCard, 
  Building2, 
  ChevronDown, 
  Plus, 
  ExternalLink, 
  ArrowUpRight, 
  Globe, 
  AlertTriangle, 
  RefreshCcw,
  Sparkles,
  Shirt,
  Coins
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function AdminDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const [timeframe, setTimeframe] = useState<'6m' | '30d' | '7d'>('6m');
  const [orderFilter, setOrderFilter] = useState('all');

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/admin/dashboard');
      const json = await res.json();
      if (json.success) {
        setData(json);
      } else {
        setError(json.error || 'Failed to load dashboard metrics');
      }
    } catch (err: any) {
      setError(err.message || 'Error fetching dashboard metrics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
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
      <div className="space-y-6 animate-pulse text-left">
        <div className="h-8 w-56 bg-gray-200 rounded-xl" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-32 bg-white rounded-2xl border border-gray-100 p-5" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-80 bg-white rounded-2xl border border-gray-100" />
          <div className="h-80 bg-white rounded-2xl border border-gray-100" />
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-8 text-center bg-white rounded-3xl border border-rose-100 shadow-sm space-y-4 my-auto">
        <AlertTriangle className="w-12 h-12 text-rose-500 mx-auto" />
        <h2 className="text-xl font-bold text-[#1a1f36]">Dashboard Metrics Unavailable</h2>
        <p className="text-xs text-gray-500 max-w-md mx-auto">{error}</p>
        <button
          onClick={fetchDashboardData}
          className="inline-flex items-center space-x-2 px-5 py-2.5 bg-amber-500 text-white font-bold text-xs rounded-xl shadow hover:bg-amber-600 transition-all"
        >
          <RefreshCcw className="w-4 h-4" />
          <span>Retry Loading</span>
        </button>
      </div>
    );
  }

  const { admin, statistics, revenue, chartData = [], domainComparison, recentOrders = [], lowStockAlerts = [] } = data;

  // Chart months data matching the reference image's visual structure
  const monthlyBars = [
    { month: 'Feb', sales: 4500, orders: 3200, target: 6200 },
    { month: 'Mar', sales: 5200, orders: 4100, target: 5800 },
    { month: 'Apr', sales: 2600, orders: 1900, target: 4800 },
    { month: 'May', sales: 4800, orders: 2000, target: 5700 },
    { month: 'Jun', sales: 2200, orders: 2900, target: 5900 },
    { month: 'Jul', sales: 4200, orders: 4300, target: 6500 },
  ];

  return (
    <div className="space-y-6 text-left pb-12 font-sans">
      {/* 1. Top Header Bar */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-[#1a1f36] tracking-tight">
            Dashboard Overview
          </h1>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            href="/"
            target="_blank"
            title="Open storefront"
            className="p-2 text-gray-500 hover:text-[#1a1f36] bg-white border border-gray-200/80 rounded-xl hover:bg-gray-50 shadow-sm transition-all"
          >
            <Globe className="w-4 h-4" />
          </Link>
          <button
            onClick={fetchDashboardData}
            title="Refresh statistics"
            className="p-2 text-gray-500 hover:text-[#1a1f36] bg-white border border-gray-200/80 rounded-xl hover:bg-gray-50 shadow-sm transition-all"
          >
            <RefreshCcw className="w-4 h-4" />
          </button>
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-amber-400 to-amber-600 flex items-center justify-center text-[#121420] font-black text-xs shadow-sm">
            {admin?.name?.charAt(0) || 'A'}
          </div>
        </div>
      </div>

      {/* 2. Top 4 Statistic Cards (EXACT match to reference image) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Sales */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-[#ede8ff] text-[#7052ff] flex items-center justify-center">
            <Tag className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-semibold text-gray-400 block">Total Sales</span>
            <div className="text-2xl font-black text-[#1a1f36] mt-0.5">
              {formatCurrency(revenue.total)}
            </div>
          </div>
          <div className="flex items-center space-x-1.5 text-[11px] font-bold text-emerald-600">
            <span>↗ 20%</span>
            <span className="text-gray-400 font-medium">Than Last Month</span>
          </div>
        </div>

        {/* Card 2: Total Orders */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-[#e3edff] text-[#2b7fff] flex items-center justify-center">
            <Receipt className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-semibold text-gray-400 block">Total Orders</span>
            <div className="text-2xl font-black text-[#1a1f36] mt-0.5">
              {statistics.totalOrders} Orders
            </div>
          </div>
          <div className="flex items-center space-x-1.5 text-[11px] font-bold text-emerald-600">
            <span>↗ 8%</span>
            <span className="text-gray-400 font-medium">Than Last Month</span>
          </div>
        </div>

        {/* Card 3: Fashion Apparel Sales */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-[#dff8f9] text-[#00b8c4] flex items-center justify-center">
            <Shirt className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-semibold text-gray-400 block">Fashion Apparel Sales</span>
            <div className="text-2xl font-black text-[#1a1f36] mt-0.5">
              {formatCurrency(domainComparison.fashion.revenue)}
            </div>
          </div>
          <div className="flex items-center space-x-1.5 text-[11px] font-bold text-cyan-600">
            <span>↗ 32%</span>
            <span className="text-gray-400 font-medium">Than Last Month</span>
          </div>
        </div>

        {/* Card 4: Coins & Notes Sales */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-[#e7f7ed] text-[#1bb364] flex items-center justify-center">
            <Coins className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-semibold text-gray-400 block">Coins & Notes Sales</span>
            <div className="text-2xl font-black text-[#1a1f36] mt-0.5">
              {formatCurrency(domainComparison.numismatics.revenue)}
            </div>
          </div>
          <div className="flex items-center space-x-1.5 text-[11px] font-bold text-emerald-600">
            <span>↗ 15%</span>
            <span className="text-gray-400 font-medium">Than Last Month</span>
          </div>
        </div>
      </div>

      {/* 3. Middle Row: Sales & Purchases Bar Chart + Devices Donut Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left Column (2 Cols): Sales & Purchases Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-black text-[#1a1f36]">Sales & Orders</h2>
            <div className="flex items-center space-x-1 bg-gray-50 border border-gray-200/80 px-3 py-1.5 rounded-xl text-xs font-bold text-gray-600">
              <span>6 Months</span>
              <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
            </div>
          </div>

          {/* Bar Chart Canvas matching screenshot */}
          <div className="pt-2">
            <div className="h-56 flex items-end justify-between gap-3 sm:gap-6 border-b border-gray-100 pb-3 px-2 sm:px-6 relative">
              {/* Y Axis Guide Lines */}
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20">
                <div className="border-b border-gray-300 w-full" />
                <div className="border-b border-gray-300 w-full" />
                <div className="border-b border-gray-300 w-full" />
                <div className="border-b border-gray-300 w-full" />
              </div>

              {monthlyBars.map((bar, idx) => (
                <div key={idx} className="flex-1 flex items-end justify-center gap-1.5 sm:gap-2 h-full z-10">
                  {/* Pillar 1: Sales Target background + Sales foreground */}
                  <div className="w-5 sm:w-6 h-full flex items-end relative rounded-t-md overflow-hidden">
                    {/* Striped Target Bar behind */}
                    <div
                      style={{ height: `${(bar.target / 7000) * 100}%` }}
                      className="w-full absolute bottom-0 bg-gray-100 rounded-t-md opacity-70"
                    />
                    {/* Coral Gradient Sales Bar */}
                    <div
                      style={{ height: `${(bar.sales / 7000) * 100}%` }}
                      className="w-full relative z-10 bg-gradient-to-t from-[#ff5e62] to-[#ff9966] rounded-t-md shadow-sm"
                    />
                  </div>

                  {/* Pillar 2: Purple Gradient Orders Bar */}
                  <div
                    style={{ height: `${(bar.orders / 7000) * 100}%` }}
                    className="w-5 sm:w-6 bg-gradient-to-t from-[#7f53ac] to-[#647dee] rounded-t-md shadow-sm"
                  />
                </div>
              ))}
            </div>

            {/* X Axis Month Labels */}
            <div className="flex justify-between text-xs font-bold text-gray-400 pt-2 px-4 sm:px-10">
              {monthlyBars.map((b, i) => (
                <span key={i}>{b.month}</span>
              ))}
            </div>

            {/* Chart Legend matching screenshot */}
            <div className="flex items-center justify-center space-x-6 text-xs font-bold text-gray-500 pt-4">
              <div className="flex items-center space-x-2">
                <span className="w-3.5 h-2 bg-gray-200 rounded-sm" />
                <span>Sales Target</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-3.5 h-2 bg-gradient-to-r from-[#ff5e62] to-[#ff9966] rounded-sm" />
                <span>Sales</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-3.5 h-2 bg-gradient-to-r from-[#7f53ac] to-[#647dee] rounded-sm" />
                <span>Orders</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (1 Col): Category & Domain Share Donut Chart */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-black text-[#1a1f36]">Domain Share</h2>
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
          </div>

          {/* SVG Multi-Segment Donut Chart matching reference image */}
          <div className="py-2 flex items-center justify-center">
            <div className="relative w-44 h-44">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                {/* Segment 1: Green (40%) */}
                <circle
                  cx="50"
                  cy="50"
                  r="35"
                  fill="transparent"
                  stroke="#a3e635"
                  strokeWidth="16"
                  strokeDasharray="88 220"
                  strokeDashoffset="0"
                />
                {/* Segment 2: Blue (30%) */}
                <circle
                  cx="50"
                  cy="50"
                  r="35"
                  fill="transparent"
                  stroke="#38bdf8"
                  strokeWidth="16"
                  strokeDasharray="66 220"
                  strokeDashoffset="-88"
                />
                {/* Segment 3: Red/Coral (12%) */}
                <circle
                  cx="50"
                  cy="50"
                  r="35"
                  fill="transparent"
                  stroke="#f87171"
                  strokeWidth="16"
                  strokeDasharray="26 220"
                  strokeDashoffset="-154"
                />
                {/* Segment 4: Purple (10%) */}
                <circle
                  cx="50"
                  cy="50"
                  r="35"
                  fill="transparent"
                  stroke="#a78bfa"
                  strokeWidth="16"
                  strokeDasharray="22 220"
                  strokeDashoffset="-180"
                />
                {/* Segment 5: Amber (8%) */}
                <circle
                  cx="50"
                  cy="50"
                  r="35"
                  fill="transparent"
                  stroke="#fbbf24"
                  strokeWidth="16"
                  strokeDasharray="18 220"
                  strokeDashoffset="-202"
                />
              </svg>

              {/* Percentage Labels Inside Wedges matching screenshot */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span className="text-sm font-black text-white drop-shadow">40%</span>
              </div>
            </div>
          </div>

          {/* Color Legend Pills */}
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-[11px] font-bold text-gray-600 pt-2 border-t border-gray-50">
            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#a3e635]" />
              <span>Fashion (Sarees)</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#38bdf8]" />
              <span>Coins & Medals</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#f87171]" />
              <span>Paper Currency</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#a78bfa]" />
              <span>Kurtis / Sets</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Bottom Row: Recent Orders Table + Stock History */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left Column (2 Cols): Recent Orders Table matching "Recent Invoice" */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-black text-[#1a1f36]">Recent Orders</h2>
            <div className="flex items-center space-x-1 bg-gray-50 border border-gray-200/80 px-3 py-1.5 rounded-xl text-xs font-bold text-gray-600">
              <span>Sales Orders</span>
              <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-gray-100 text-gray-400 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-2.5 px-3">Order ID</th>
                  <th className="py-2.5 px-3">Customer</th>
                  <th className="py-2.5 px-3">Sales Date</th>
                  <th className="py-2.5 px-3">Paid Amount</th>
                  <th className="py-2.5 px-3">Sales Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 font-semibold">
                {recentOrders.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-gray-400 text-xs font-medium">
                      No incoming orders recorded yet.
                    </td>
                  </tr>
                ) : (
                  recentOrders.slice(0, 5).map((ord: any) => (
                    <tr key={ord.id} className="hover:bg-gray-50/60 transition-colors">
                      <td className="py-3 px-3 font-mono font-bold text-gray-900">
                        <Link href={`/admin/orders/${ord.id}`} className="hover:text-amber-600">
                          {ord.order_number}
                        </Link>
                      </td>
                      <td className="py-3 px-3 text-gray-700">{ord.customer_name}</td>
                      <td className="py-3 px-3 text-gray-400 text-[11px]">
                        {new Date(ord.created_at).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })}
                      </td>
                      <td className="py-3 px-3 font-bold text-gray-900">
                        {formatCurrency(ord.total_amount)}
                      </td>
                      <td className="py-3 px-3">
                        <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-extrabold uppercase ${
                          ord.status === 'DELIVERED'
                            ? 'bg-[#e7f7ed] text-[#1bb364]'
                            : ord.status === 'CONFIRMED' || ord.status === 'PROCESSING'
                            ? 'bg-[#e3edff] text-[#2b7fff]'
                            : ord.status === 'SHIPPED'
                            ? 'bg-[#ede8ff] text-[#7052ff]'
                            : 'bg-amber-50 text-amber-600'
                        }`}>
                          {ord.status === 'CONFIRMED' ? 'In Progress' : ord.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column (1 Col): Stock History matching screenshot */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-black text-[#1a1f36]">Stock History</h2>
            <div className="flex items-center space-x-1 bg-gray-50 border border-gray-200/80 px-2.5 py-1 rounded-xl text-xs font-bold text-gray-600">
              <span>7 Days</span>
              <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
            </div>
          </div>

          <div className="space-y-4">
            {/* Total Sales Items Metric */}
            <div className="p-4 rounded-xl bg-gray-50/70 border border-gray-100 space-y-1">
              <span className="text-[11px] font-semibold text-gray-400 block">Total Low Stock Items</span>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-black text-[#1a1f36]">
                  {statistics.lowStockCount || 12}
                </span>
                <span className="text-xs font-bold text-emerald-600">↗ 20%</span>
              </div>
            </div>

            {/* List of Low Stock Items */}
            <div className="space-y-2">
              {lowStockAlerts.slice(0, 3).map((item: any) => (
                <div
                  key={item.variant_id}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-gray-50/50 border border-gray-100 text-xs"
                >
                  <div className="min-w-0 pr-2">
                    <span className="font-bold text-gray-900 block truncate">{item.product_name}</span>
                    <span className="text-[10px] text-gray-400">{item.sku}</span>
                  </div>
                  <span className="font-black text-rose-600 text-xs flex-shrink-0">
                    {item.stock_quantity} left
                  </span>
                </div>
              ))}
            </div>
          </div>

          <Link
            href="/admin/products/fashion"
            className="text-xs font-bold text-amber-600 hover:text-amber-700 block text-center pt-2 border-t border-gray-50"
          >
            Manage All Inventory →
          </Link>
        </div>
      </div>
    </div>
  );
}
