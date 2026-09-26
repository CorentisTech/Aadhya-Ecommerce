"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ShoppingBag, 
  Tags, 
  Users, 
  Receipt, 
  TrendingUp, 
  AlertTriangle, 
  ArrowUpRight, 
  Plus, 
  Shirt, 
  Coins, 
  Clock, 
  CheckCircle2, 
  Truck, 
  PackageCheck, 
  XCircle, 
  RefreshCcw,
  Sparkles,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function AdminDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [chartTimeframe, setChartTimeframe] = useState<'7d' | '30d' | '90d'>('30d');
  const [error, setError] = useState<string | null>(null);

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
      setError(err.message || 'Network error fetching dashboard metrics');
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
      <div className="space-y-8 animate-pulse text-left">
        {/* Header Skeleton */}
        <div className="flex justify-between items-center">
          <div className="h-8 w-44 bg-gray-200 rounded-xl" />
          <div className="h-6 w-32 bg-gray-200 rounded-lg" />
        </div>
        {/* Welcome Card Skeleton */}
        <div className="h-52 bg-gradient-to-r from-amber-200/50 to-amber-300/40 rounded-3xl" />
        {/* Stat Cards Skeleton */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-white rounded-2xl shadow-sm border border-gray-100 p-4" />
          ))}
        </div>
        {/* Charts & Tables Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-72 bg-white rounded-2xl border border-gray-100" />
          <div className="h-72 bg-white rounded-2xl border border-gray-100" />
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-8 text-center bg-white rounded-3xl border border-rose-100 shadow-sm space-y-4 my-auto">
        <AlertTriangle className="w-12 h-12 text-rose-500 mx-auto" />
        <h2 className="text-xl font-bold text-gray-900">Dashboard Metrics Unavailable</h2>
        <p className="text-xs text-gray-500 max-w-md mx-auto">{error}</p>
        <button
          onClick={fetchDashboardData}
          className="inline-flex items-center space-x-2 px-5 py-2.5 bg-[#cca05b] text-[#15171c] font-bold text-xs rounded-xl shadow hover:bg-[#d8ae69] transition-all"
        >
          <RefreshCcw className="w-4 h-4" />
          <span>Retry Loading</span>
        </button>
      </div>
    );
  }

  const { admin, statistics, revenue, chartData, domainComparison, recentOrders, lowStockAlerts, recentUsers } = data;

  // Filter chart data for timeframe
  let visibleChartPoints = chartData || [];
  if (chartTimeframe === '7d') {
    visibleChartPoints = visibleChartPoints.slice(-7);
  } else if (chartTimeframe === '30d') {
    visibleChartPoints = visibleChartPoints.slice(-30);
  }

  const maxRevenue = Math.max(...visibleChartPoints.map((p: any) => Number(p.revenue) || 0), 1000);

  return (
    <div className="space-y-8 text-left pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#15171c] tracking-tight">
            Dashboard
          </h1>
          <p className="text-xs font-semibold text-gray-500 mt-0.5">
            Store performance and live catalog oversight
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 text-xs font-bold text-emerald-700 bg-emerald-50 px-3.5 py-1.5 rounded-full border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Database Live</span>
          </div>
          <button
            onClick={fetchDashboardData}
            title="Refresh statistics"
            className="p-2 text-gray-600 hover:text-black bg-white border border-gray-200 rounded-xl hover:bg-gray-50 shadow-sm transition-colors"
          >
            <RefreshCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 1. Welcome Card (Visual foundation from reference image) */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative overflow-hidden rounded-[26px] bg-gradient-to-r from-[#ca9752] via-[#d0a05e] to-[#ba843d] p-6 sm:p-8 md:p-10 text-white shadow-lg shadow-amber-900/10 flex flex-col md:flex-row md:items-center justify-between gap-6"
      >
        {/* Glow ambient background circles */}
        <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        <div className="absolute right-32 -bottom-16 w-52 h-52 rounded-full bg-amber-400/20 blur-xl pointer-events-none" />

        <div className="space-y-4 max-w-xl z-10">
          <div className="space-y-1">
            <div className="flex items-center space-x-2 text-amber-100 text-xs font-bold tracking-wider uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AADHYA ECOMMERCE PLATFORM</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-white leading-tight">
              Welcome back, {admin.name}!
            </h2>
            <p className="text-xs sm:text-sm text-amber-50/90 font-medium leading-relaxed pt-1">
              Manage your AADHYA Fashion and Coins & Notes store from one place. Track orders, inventory levels, and live revenue.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 pt-2">
            <Link
              href="/admin/products/create?type=fashion"
              className="inline-flex items-center space-x-2 px-4 py-2.5 bg-white text-[#15171c] font-bold text-xs rounded-xl shadow-sm hover:bg-amber-50 transition-all transform hover:-translate-y-0.5"
            >
              <Plus className="w-3.5 h-3.5 text-[#ca9752]" />
              <span>Add Fashion Product</span>
            </Link>
            <Link
              href="/admin/products/create?type=numismatics"
              className="inline-flex items-center space-x-2 px-4 py-2.5 bg-white text-[#15171c] font-bold text-xs rounded-xl shadow-sm hover:bg-amber-50 transition-all transform hover:-translate-y-0.5"
            >
              <Coins className="w-3.5 h-3.5 text-[#ca9752]" />
              <span>Add Coins & Notes Product</span>
            </Link>
            <Link
              href="/admin/orders"
              className="inline-flex items-center space-x-2 px-4 py-2.5 bg-black/20 text-white hover:bg-black/30 backdrop-blur-sm font-bold text-xs rounded-xl transition-all"
            >
              <span>View Orders</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Right Circular Avatar / Motif Ring from Reference */}
        <div className="hidden md:flex items-center justify-center flex-shrink-0 z-10">
          <div className="w-32 h-32 rounded-full border-4 border-white/30 p-1.5 flex items-center justify-center bg-white/10 backdrop-blur-md shadow-2xl">
            <div className="w-full h-full rounded-full bg-gradient-to-tr from-[#996522] to-[#dfa658] flex flex-col items-center justify-center text-white text-center p-2 shadow-inner">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-200">
                ACTIVE
              </span>
              <span className="text-xl font-black">
                {statistics.activeProducts}
              </span>
              <span className="text-[9px] font-semibold text-white/80">
                Products Online
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* 2. Primary KPI Statistics Row (Clean rounded cards) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-4">
        {/* Total Products */}
        <Link
          href="/admin/products"
          className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm hover:border-[#cca05b]/40 hover:shadow-md transition-all flex flex-col justify-between group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
              PRODUCTS
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-[#cca05b] flex items-center justify-center group-hover:scale-105 transition-transform">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-gray-900">
              {statistics.totalProducts}
            </div>
            <div className="text-[10px] text-gray-400 font-semibold mt-0.5 flex items-center space-x-1">
              <span>{statistics.fashionProducts} Fashion</span>
              <span>•</span>
              <span>{statistics.numismaticProducts} Coins</span>
            </div>
          </div>
        </Link>

        {/* Total Categories */}
        <Link
          href="/admin/categories"
          className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm hover:border-[#cca05b]/40 hover:shadow-md transition-all flex flex-col justify-between group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
              CATEGORIES
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Tags className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-gray-900">
              {statistics.totalCategories}
            </div>
            <div className="text-[10px] text-gray-400 font-semibold mt-0.5 flex items-center space-x-1">
              <span>{statistics.fashionCategories} Fashion</span>
              <span>•</span>
              <span>{statistics.numismaticCategories} Coins</span>
            </div>
          </div>
        </Link>

        {/* Total Users */}
        <Link
          href="/admin/users"
          className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm hover:border-[#cca05b]/40 hover:shadow-md transition-all flex flex-col justify-between group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
              CUSTOMERS
            </span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-gray-900">
              {statistics.totalUsers}
            </div>
            <div className="text-[10px] text-emerald-600 font-bold mt-0.5">
              +{statistics.newUsers} in last 30d
            </div>
          </div>
        </Link>

        {/* Total Orders */}
        <Link
          href="/admin/orders"
          className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm hover:border-[#cca05b]/40 hover:shadow-md transition-all flex flex-col justify-between group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
              ORDERS
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Receipt className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-gray-900">
              {statistics.totalOrders}
            </div>
            <div className="text-[10px] text-amber-600 font-bold mt-0.5">
              {statistics.ordersReceived} Received / Pending
            </div>
          </div>
        </Link>

        {/* Total Revenue */}
        <Link
          href="/admin/revenue"
          className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm hover:border-[#cca05b]/40 hover:shadow-md transition-all flex flex-col justify-between group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
              REVENUE
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:scale-105 transition-transform">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-xl sm:text-2xl font-black text-gray-900 truncate">
              {formatCurrency(revenue.total)}
            </div>
            <div className="text-[10px] text-gray-400 font-semibold mt-0.5">
              AOV: {formatCurrency(revenue.averageOrderValue)}
            </div>
          </div>
        </Link>

        {/* Low Stock Alerts */}
        <div
          className={`p-4 rounded-2xl border shadow-sm flex flex-col justify-between transition-all ${
            statistics.lowStockCount > 0
              ? 'bg-rose-50/60 border-rose-200'
              : 'bg-white border-gray-100'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
              STOCK ALERT
            </span>
            <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-rose-600">
              {statistics.lowStockCount}
            </div>
            <div className="text-[10px] text-gray-500 font-semibold mt-0.5">
              {statistics.outOfStockCount} Out of stock
            </div>
          </div>
        </div>
      </div>

      {/* 3. Order Pipeline Lifecycle Cards (Clickable stage filters) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-extrabold uppercase tracking-wider text-gray-500">
            ORDER PIPELINE STATUS
          </span>
          <Link
            href="/admin/orders"
            className="text-xs font-bold text-[#cca05b] hover:text-[#b88c4a] flex items-center space-x-1"
          >
            <span>All Orders ({statistics.totalOrders})</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Link
            href="/admin/orders?status=received"
            className="p-4 bg-white rounded-2xl border border-gray-100 shadow-sm hover:border-amber-400 transition-all flex items-center space-x-3.5"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider block">
                1. RECEIVED
              </span>
              <span className="text-xl font-black text-gray-900 block leading-tight">
                {statistics.ordersReceived}
              </span>
            </div>
          </Link>

          <Link
            href="/admin/orders?status=approved"
            className="p-4 bg-white rounded-2xl border border-gray-100 shadow-sm hover:border-blue-400 transition-all flex items-center space-x-3.5"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider block">
                2. APPROVED
              </span>
              <span className="text-xl font-black text-gray-900 block leading-tight">
                {statistics.ordersApproved}
              </span>
            </div>
          </Link>

          <Link
            href="/admin/orders?status=dispatched"
            className="p-4 bg-white rounded-2xl border border-gray-100 shadow-sm hover:border-purple-400 transition-all flex items-center space-x-3.5"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center flex-shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider block">
                3. DISPATCHED
              </span>
              <span className="text-xl font-black text-gray-900 block leading-tight">
                {statistics.ordersDispatched}
              </span>
            </div>
          </Link>

          <Link
            href="/admin/orders?status=delivered"
            className="p-4 bg-white rounded-2xl border border-gray-100 shadow-sm hover:border-emerald-400 transition-all flex items-center space-x-3.5"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
              <PackageCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider block">
                4. DELIVERED
              </span>
              <span className="text-xl font-black text-gray-900 block leading-tight">
                {statistics.ordersDelivered}
              </span>
            </div>
          </Link>
        </div>
      </div>

      {/* 4. Analytics Row: Dynamic Revenue Chart & Fashion vs Coins Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left (2 cols): Revenue & Orders Trend Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-extrabold text-gray-900">
                Revenue & Sales Analytics
              </h3>
              <p className="text-xs font-semibold text-gray-400">
                Real-time transaction inflow across both domains
              </p>
            </div>
            {/* Timeframe selector pills */}
            <div className="flex items-center bg-gray-100 p-1 rounded-xl text-xs font-bold">
              {(['7d', '30d', '90d'] as const).map((tf) => (
                <button
                  key={tf}
                  onClick={() => setChartTimeframe(tf)}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    chartTimeframe === tf
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  {tf.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Bar / Column Chart Visual */}
          <div className="pt-4">
            <div className="h-52 flex items-end gap-1.5 sm:gap-2 border-b border-gray-100 pb-2">
              {visibleChartPoints.length === 0 ? (
                <div className="w-full h-full flex items-center justify-center text-xs font-bold text-gray-400">
                  No sales recorded in this period yet
                </div>
              ) : (
                visibleChartPoints.map((pt: any, idx: number) => {
                  const rev = Number(pt.revenue) || 0;
                  const heightPercent = Math.max(8, Math.min(100, Math.round((rev / maxRevenue) * 100)));
                  return (
                    <div
                      key={idx}
                      className="flex-1 flex flex-col items-center justify-end h-full group relative"
                    >
                      {/* Tooltip on hover */}
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute bottom-full mb-2 bg-[#15171c] text-white text-[10px] rounded-lg px-2 py-1 pointer-events-none whitespace-nowrap shadow-xl z-20 font-bold">
                        <div>{pt.label}</div>
                        <div className="text-[#cca05b]">{formatCurrency(rev)}</div>
                        <div>{pt.orders} orders</div>
                      </div>

                      {/* Bar fill */}
                      <div
                        style={{ height: `${heightPercent}%` }}
                        className={`w-full rounded-t-md transition-all ${
                          rev > 0
                            ? 'bg-gradient-to-t from-[#ca9752] to-[#dfa658] group-hover:from-amber-600 group-hover:to-amber-400 shadow-sm'
                            : 'bg-gray-100 group-hover:bg-gray-200'
                        }`}
                      />
                    </div>
                  );
                })
              )}
            </div>

            {/* X Axis Labels */}
            <div className="flex justify-between text-[10px] font-bold text-gray-400 pt-2 px-1">
              <span>{visibleChartPoints[0]?.label || ''}</span>
              <span>{visibleChartPoints[Math.floor(visibleChartPoints.length / 2)]?.label || ''}</span>
              <span>{visibleChartPoints[visibleChartPoints.length - 1]?.label || ''}</span>
            </div>
          </div>
        </div>

        {/* Right (1 col): Fashion vs Coins & Notes Domain Split */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-6 flex flex-col justify-between">
          <div className="space-y-1">
            <h3 className="text-base font-extrabold text-gray-900">
              Fashion vs Coins Breakdown
            </h3>
            <p className="text-xs font-semibold text-gray-400">
              Department catalog & revenue performance
            </p>
          </div>

          <div className="space-y-4">
            {/* Fashion Card */}
            <div className="p-4 rounded-2xl bg-[#faf8f5] border border-amber-100/80 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <div className="w-7 h-7 rounded-lg bg-amber-100 text-[#ca9752] flex items-center justify-center font-bold">
                    <Shirt className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-extrabold text-gray-900 tracking-wider">
                    FASHION
                  </span>
                </div>
                <span className="text-xs font-bold text-[#ca9752]">
                  {formatCurrency(domainComparison.fashion.revenue)}
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px] font-semibold text-gray-500 pt-1">
                <span>{statistics.fashionProducts} Products</span>
                <span>{domainComparison.fashion.units} units sold</span>
              </div>
            </div>

            {/* Numismatics Card */}
            <div className="p-4 rounded-2xl bg-[#f6f9fc] border border-blue-100/80 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                    <Coins className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-extrabold text-gray-900 tracking-wider">
                    COINS & NOTES
                  </span>
                </div>
                <span className="text-xs font-bold text-blue-600">
                  {formatCurrency(domainComparison.numismatics.revenue)}
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px] font-semibold text-gray-500 pt-1">
                <span>{statistics.numismaticProducts} Products</span>
                <span>{domainComparison.numismatics.units} units sold</span>
              </div>
            </div>
          </div>

          <div className="p-3 bg-gray-50 rounded-xl text-center">
            <span className="text-[11px] font-bold text-gray-600">
              Total Realized Sales: {formatCurrency(revenue.total)}
            </span>
          </div>
        </div>
      </div>

      {/* 5. Recent Orders Table */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-extrabold text-gray-900">
              Recent Incoming Orders
            </h3>
            <p className="text-xs font-semibold text-gray-400">
              Authoritative live orders received from storefront
            </p>
          </div>
          <Link
            href="/admin/orders"
            className="text-xs font-bold text-[#cca05b] hover:text-[#b88c4a] flex items-center space-x-1"
          >
            <span>View All Orders</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="text-center py-10 text-gray-400 text-xs font-bold">
            No customer orders placed yet. Orders placed by customers will appear here automatically.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-gray-100 text-gray-400 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-3">Order ID</th>
                  <th className="py-3 px-3">Customer</th>
                  <th className="py-3 px-3">Domain</th>
                  <th className="py-3 px-3">Amount</th>
                  <th className="py-3 px-3">Payment</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 font-semibold">
                {recentOrders.map((ord: any) => (
                  <tr key={ord.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="py-3.5 px-3 font-bold text-gray-900">
                      {ord.order_number}
                    </td>
                    <td className="py-3.5 px-3 text-gray-700">
                      {ord.customer_name}
                    </td>
                    <td className="py-3.5 px-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        ord.domain === 'numismatics'
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        {ord.domain === 'numismatics' ? 'Coins & Notes' : 'Fashion'}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 font-bold text-gray-900">
                      {formatCurrency(ord.total_amount)}
                    </td>
                    <td className="py-3.5 px-3 text-gray-500">
                      {ord.payment_method || 'COD'}
                    </td>
                    <td className="py-3.5 px-3">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                        ord.status === 'DELIVERED'
                          ? 'bg-emerald-50 text-emerald-700'
                          : ord.status === 'SHIPPED'
                          ? 'bg-purple-50 text-purple-700'
                          : ord.status === 'CONFIRMED' || ord.status === 'PROCESSING'
                          ? 'bg-blue-50 text-blue-700'
                          : ord.status === 'PENDING'
                          ? 'bg-amber-50 text-amber-700'
                          : 'bg-rose-50 text-rose-700'
                      }`}>
                        {ord.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      <Link
                        href={`/admin/orders/${ord.id}`}
                        className="text-xs font-bold text-[#cca05b] hover:text-[#b88c4a]"
                      >
                        Manage →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 6. Bottom Grid: Low Stock Alert List & Recent Registered Users */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Low Stock Alert Panel */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-extrabold text-gray-900 flex items-center space-x-2">
                <span>Stock Alerts</span>
                <span className="w-2 h-2 rounded-full bg-rose-500" />
              </h3>
              <p className="text-xs font-semibold text-gray-400">
                Products with 5 or fewer units remaining
              </p>
            </div>
            <Link
              href="/admin/products"
              className="text-xs font-bold text-[#cca05b] hover:text-[#b88c4a]"
            >
              View Inventory
            </Link>
          </div>

          {lowStockAlerts.length === 0 ? (
            <div className="text-center py-8 text-xs font-bold text-gray-400">
              All inventory levels are healthy. No items under critical threshold.
            </div>
          ) : (
            <div className="space-y-3">
              {lowStockAlerts.map((item: any) => (
                <div
                  key={item.variant_id}
                  className="flex items-center justify-between p-3 rounded-2xl bg-gray-50/70 border border-gray-100 hover:border-amber-200 transition-colors"
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-gray-200 overflow-hidden flex-shrink-0 flex items-center justify-center">
                      {item.image_url ? (
                        <img
                          src={item.image_url}
                          alt={item.product_name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <ShoppingBag className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <span className="text-xs font-bold text-gray-900 block truncate">
                        {item.product_name}
                      </span>
                      <span className="text-[10px] text-gray-400 font-semibold block">
                        SKU: {item.sku} • {item.department === 'numismatics' ? 'Coins' : 'Fashion'}
                      </span>
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <span className="text-xs font-black text-rose-600 block">
                      {item.stock_quantity} LEFT
                    </span>
                    <Link
                      href={`/admin/products/${item.product_id}/edit`}
                      className="text-[10px] font-bold text-[#cca05b] hover:underline"
                    >
                      Update Stock
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Registered Users */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-extrabold text-gray-900">
                Recent Registered Customers
              </h3>
              <p className="text-xs font-semibold text-gray-400">
                New accounts created on AADHYA
              </p>
            </div>
            <Link
              href="/admin/users"
              className="text-xs font-bold text-[#cca05b] hover:text-[#b88c4a]"
            >
              All Customers ({statistics.totalUsers})
            </Link>
          </div>

          {recentUsers.length === 0 ? (
            <div className="text-center py-8 text-xs font-bold text-gray-400">
              No registered customers yet.
            </div>
          ) : (
            <div className="space-y-3">
              {recentUsers.map((usr: any) => (
                <div
                  key={usr.id}
                  className="flex items-center justify-between p-3 rounded-2xl bg-gray-50/70 border border-gray-100 hover:border-gray-200 transition-colors"
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-500 to-[#cca05b] text-white flex items-center justify-center font-bold text-xs flex-shrink-0">
                      {usr.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <span className="text-xs font-bold text-gray-900 block truncate">
                        {usr.name}
                      </span>
                      <span className="text-[10px] text-gray-400 font-semibold block truncate">
                        {usr.phone || 'No phone'}
                      </span>
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <span className="text-xs font-bold text-gray-900 block">
                      {usr.total_orders} Orders
                    </span>
                    <Link
                      href={`/admin/users/${usr.id}`}
                      className="text-[10px] font-bold text-[#cca05b] hover:underline"
                    >
                      View Profile
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
