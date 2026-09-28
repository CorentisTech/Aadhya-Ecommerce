"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Users, ArrowUpRight, Filter, RefreshCcw } from 'lucide-react';

import { ExportButton } from '@/components/admin/ExportButton';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, totalPages: 1 });

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/users?q=${encodeURIComponent(search)}&filter=${filter}&page=${pagination.page}`);
      const data = await res.json();
      if (data.success) {
        setUsers(data.users);
        setPagination(data.pagination);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [filter, pagination.page]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPagination(prev => ({ ...prev, page: 1 }));
    fetchUsers();
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val || 0);
  };

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Customer Management</h1>
          <p className="text-xs font-semibold text-gray-500">
            Registered customers, order history, and account activity
          </p>
        </div>
        <div className="flex space-x-2 self-start sm:self-auto">
          <ExportButton type="users" label="Download Excel" />
          <button
            onClick={fetchUsers}
            className="p-2 text-gray-500 hover:text-black bg-white border border-gray-200 rounded-xl hover:bg-gray-50 shadow-sm transition-colors"
          >
            <RefreshCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <form onSubmit={handleSearch} className="flex-1 relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by customer name, email, phone or order #..."
            className="w-full bg-white border border-gray-200 pl-10 pr-4 py-2.5 rounded-2xl text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#cca05b] focus:ring-1 focus:ring-[#cca05b]"
          />
        </form>

        <div className="flex items-center space-x-2 bg-white p-1 rounded-2xl border border-gray-200 text-xs font-bold text-gray-600">
          <button
            onClick={() => { setFilter('all'); setPagination(p => ({ ...p, page: 1 })); }}
            className={`px-3 py-1.5 rounded-xl transition-all ${filter === 'all' ? 'bg-[#cca05b] text-[#15171c]' : 'hover:text-black'}`}
          >
            All
          </button>
          <button
            onClick={() => { setFilter('with_orders'); setPagination(p => ({ ...p, page: 1 })); }}
            className={`px-3 py-1.5 rounded-xl transition-all ${filter === 'with_orders' ? 'bg-[#cca05b] text-[#15171c]' : 'hover:text-black'}`}
          >
            With Orders
          </button>
          <button
            onClick={() => { setFilter('without_orders'); setPagination(p => ({ ...p, page: 1 })); }}
            className={`px-3 py-1.5 rounded-xl transition-all ${filter === 'without_orders' ? 'bg-[#cca05b] text-[#15171c]' : 'hover:text-black'}`}
          >
            No Orders
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs font-bold text-gray-400 animate-pulse">
            Loading customers...
          </div>
        ) : users.length === 0 ? (
          <div className="p-12 text-center text-xs font-bold text-gray-400 space-y-2">
            <Users className="w-8 h-8 mx-auto text-gray-300" />
            <div>No customers match the current filter or search.</div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-gray-100 text-gray-400 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Phone</th>
                  <th className="py-3 px-4">Orders</th>
                  <th className="py-3 px-4">Total Spent</th>
                  <th className="py-3 px-4">Joined</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 font-semibold">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 to-[#cca05b] text-white flex items-center justify-center font-bold text-xs flex-shrink-0">
                          {u.full_name.charAt(0)}
                        </div>
                        <div>
                          <span className="font-bold text-gray-900 block">{u.full_name}</span>
                          <span className="text-[10px] text-gray-400">{u.role}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-gray-600">{u.email || '—'}</td>
                    <td className="py-3.5 px-4 text-gray-600">{u.phone || '—'}</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-800 text-[10px] font-bold">
                        {u.total_orders} Orders
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-gray-900">
                      {formatCurrency(u.total_spent)}
                    </td>
                    <td className="py-3.5 px-4 text-gray-400 text-[11px]">
                      {new Date(u.created_at).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        href={`/admin/users/${u.id}`}
                        className="inline-flex items-center space-x-1 text-xs font-bold text-[#cca05b] hover:text-[#b88c4a]"
                      >
                        <span>View</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination footer */}
        {pagination.totalPages > 1 && (
          <div className="p-4 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-gray-500">
            <span>Showing Page {pagination.page} of {pagination.totalPages} ({pagination.total} total)</span>
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
