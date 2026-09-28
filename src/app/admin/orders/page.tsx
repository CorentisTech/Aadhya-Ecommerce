"use client";

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { 
  Search, 
  Receipt, 
  Clock, 
  CheckCircle2, 
  Truck, 
  PackageCheck, 
  XCircle, 
  RefreshCcw,
  ArrowUpRight 
} from 'lucide-react';

import { ExportButton } from '@/components/admin/ExportButton';

function AdminOrdersContent() {
  const searchParams = useSearchParams();
  const initialStatus = searchParams?.get('status') || 'all';

  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState(initialStatus);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, totalPages: 1 });

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `/api/admin/orders?status=${status}&q=${encodeURIComponent(search)}&page=${pagination.page}`
      );
      const data = await res.json();
      if (data.success) {
        setOrders(data.orders);
        setPagination(data.pagination);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [status, pagination.page]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPagination(p => ({ ...p, page: 1 }));
    fetchOrders();
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val || 0);
  };

  const getStatusBadge = (st: string) => {
    switch (st) {
      case 'DELIVERED':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'SHIPPED':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'CONFIRMED':
      case 'PROCESSING':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'PENDING':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'CANCELLED':
      case 'REFUNDED':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="space-y-6 text-left pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Order Management</h1>
          <p className="text-xs font-semibold text-gray-500">
            Real customer orders, pipeline transitions, dispatching and delivery tracking
          </p>
        </div>
        <div className="flex space-x-2 self-start sm:self-auto">
          <ExportButton type="orders" label="Download Excel" />
          <button
            onClick={fetchOrders}
            className="p-2 text-gray-500 hover:text-black bg-white border border-gray-200 rounded-xl hover:bg-gray-50 shadow-sm transition-colors"
          >
            <RefreshCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Search & Status Pipeline Filters */}
      <div className="space-y-3">
        <form onSubmit={handleSearch} className="relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Order # (e.g. #AD-1024), customer name, or courier tracking #..."
            className="w-full bg-white border border-gray-200 pl-10 pr-4 py-2.5 rounded-2xl text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#cca05b]"
          />
        </form>

        {/* Pipeline Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 bg-white p-1.5 rounded-2xl border border-gray-200 text-xs font-bold text-gray-600">
          {[
            { id: 'all', label: 'All Orders' },
            { id: 'received', label: '1. Received (Pending)' },
            { id: 'approved', label: '2. Approved' },
            { id: 'dispatched', label: '3. Dispatched' },
            { id: 'delivered', label: '4. Delivered' },
            { id: 'cancelled', label: 'Cancelled / Rejected' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setStatus(tab.id);
                setPagination(p => ({ ...p, page: 1 }));
              }}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                status === tab.id
                  ? 'bg-[#cca05b] text-[#15171c] shadow-sm'
                  : 'hover:text-black'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs font-bold text-gray-400 animate-pulse">
            Loading orders pipeline...
          </div>
        ) : orders.length === 0 ? (
          <div className="p-12 text-center text-xs font-bold text-gray-400 space-y-2">
            <Receipt className="w-8 h-8 mx-auto text-gray-300" />
            <div>No orders match the selected pipeline status or search query.</div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-gray-100 text-gray-400 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4">Order ID</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Domain</th>
                  <th className="py-3 px-4">Items Summary</th>
                  <th className="py-3 px-4">Total Amount</th>
                  <th className="py-3 px-4">Payment</th>
                  <th className="py-3 px-4">Pipeline Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 font-semibold">
                {orders.map((o) => (
                  <tr key={o.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-gray-900">
                      {o.order_number}
                      <span className="text-[10px] text-gray-400 block font-sans">
                        {new Date(o.created_at).toLocaleDateString('en-IN')}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-gray-900 block">{o.customer_name}</span>
                      <span className="text-[10px] text-gray-400">{o.customer_phone}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        o.domain === 'numismatics'
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        {o.domain === 'numismatics' ? 'Coins & Notes' : 'Fashion'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-gray-700 max-w-[200px] truncate">
                      {o.items?.length > 0 ? (
                        <span>{o.items[0].product_name} {o.items.length > 1 ? `+${o.items.length - 1} more` : ''}</span>
                      ) : (
                        <span>1 item</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-gray-900">
                      {formatCurrency(o.total_amount)}
                    </td>
                    <td className="py-3.5 px-4 text-gray-500 uppercase text-[11px]">
                      {o.payment_method || 'COD'}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase border ${getStatusBadge(o.status)}`}>
                        {o.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        href={`/admin/orders/${o.id}`}
                        className="inline-flex items-center space-x-1 text-xs font-bold text-[#cca05b] hover:text-[#b88c4a]"
                      >
                        <span>Manage</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="p-4 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-gray-500">
            <span>Showing Page {pagination.page} of {pagination.totalPages} ({pagination.total} orders)</span>
            <div className="flex space-x-2">
              <button
                disabled={pagination.page <= 1}
                onClick={() => setPagination(p => ({ ...p, page: p.page - 1 }))}
                className="px-3 py-1.5 bg-gray-100 rounded-lg disabled:opacity-40 hover:bg-gray-200"
              >
                Previous
              </button>
              <button
                disabled={pagination.page >= pagination.totalPages}
                onClick={() => setPagination(p => ({ ...p, page: p.page + 1 }))}
                className="px-3 py-1.5 bg-gray-100 rounded-lg disabled:opacity-40 hover:bg-gray-200"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AdminOrdersPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs font-bold text-gray-400">Loading orders...</div>}>
      <AdminOrdersContent />
    </Suspense>
  );
}
