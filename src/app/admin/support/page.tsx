"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, HelpCircle, MessageSquare, AlertCircle, ArrowUpRight, RefreshCcw } from 'lucide-react';

export default function AdminSupportPage() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, totalPages: 1 });

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `/api/admin/support?status=${status}&q=${encodeURIComponent(search)}&page=${pagination.page}`
      );
      const data = await res.json();
      if (data.success) {
        setTickets(data.tickets);
        setPagination(data.pagination);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [status, pagination.page]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPagination(p => ({ ...p, page: 1 }));
    fetchTickets();
  };

  return (
    <div className="space-y-6 text-left pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Customer Support & Tickets</h1>
          <p className="text-xs font-semibold text-gray-500">
            Handle customer inquiries, order assistance, and live support replies
          </p>
        </div>
        <button
          onClick={fetchTickets}
          className="p-2 text-gray-500 hover:text-black bg-white border border-gray-200 rounded-xl hover:bg-gray-50 shadow-sm transition-colors self-start sm:self-auto"
        >
          <RefreshCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Search & Status Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <form onSubmit={handleSearch} className="flex-1 relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by ticket #, customer name, email, or subject..."
            className="w-full bg-white border border-gray-200 pl-10 pr-4 py-2.5 rounded-2xl text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#cca05b]"
          />
        </form>

        <div className="flex items-center space-x-2 bg-white p-1 rounded-2xl border border-gray-200 text-xs font-bold text-gray-600">
          {['all', 'OPEN', 'IN_PROGRESS', 'WAITING_FOR_CUSTOMER', 'RESOLVED'].map(st => (
            <button
              key={st}
              onClick={() => { setStatus(st); setPagination(p => ({ ...p, page: 1 })); }}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                status === st ? 'bg-[#cca05b] text-[#15171c]' : 'hover:text-black'
              }`}
            >
              {st === 'all' ? 'All' : st.replace(/_/g, ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs font-bold text-gray-400 animate-pulse">
            Loading customer support tickets...
          </div>
        ) : tickets.length === 0 ? (
          <div className="p-12 text-center text-xs font-bold text-gray-400 space-y-2">
            <HelpCircle className="w-8 h-8 mx-auto text-gray-300" />
            <div>No customer support tickets found.</div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-gray-100 text-gray-400 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4">Ticket</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Subject</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Priority</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Created</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 font-semibold">
                {tickets.map((t) => (
                  <tr key={t.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-gray-900">
                      {t.ticket_number}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-gray-900 block">{t.customer_name}</span>
                      <span className="text-[10px] text-gray-400">{t.customer_email}</span>
                    </td>
                    <td className="py-3.5 px-4 max-w-[220px]">
                      <span className="font-bold text-gray-900 block truncate">{t.subject}</span>
                      <span className="text-[10px] text-gray-400 block truncate">{t.last_message}</span>
                    </td>
                    <td className="py-3.5 px-4 text-gray-600">
                      {t.category}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        t.priority === 'HIGH' || t.priority === 'URGENT'
                          ? 'bg-rose-50 text-rose-700'
                          : 'bg-amber-50 text-amber-700'
                      }`}>
                        {t.priority}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                        t.status === 'RESOLVED'
                          ? 'bg-emerald-50 text-emerald-700'
                          : t.status === 'OPEN'
                          ? 'bg-rose-50 text-rose-700'
                          : 'bg-blue-50 text-blue-700'
                      }`}>
                        {t.status.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-gray-400 text-[11px]">
                      {new Date(t.created_at).toLocaleDateString('en-IN')}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        href={`/admin/support/${t.id}`}
                        className="inline-flex items-center space-x-1 text-xs font-bold text-[#cca05b] hover:text-[#b88c4a]"
                      >
                        <span>Reply ({t.total_messages})</span>
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
            <span>Showing Page {pagination.page} of {pagination.totalPages}</span>
            <div className="flex space-x-2">
              <button
                disabled={pagination.page <= 1}
                onClick={() => setPagination(p => ({ ...p, page: p.page - 1 }))}
                className="px-3 py-1.5 bg-gray-100 rounded-lg disabled:opacity-40"
              >
                Previous
              </button>
              <button
                disabled={pagination.page >= pagination.totalPages}
                onClick={() => setPagination(p => ({ ...p, page: p.page + 1 }))}
                className="px-3 py-1.5 bg-gray-100 rounded-lg disabled:opacity-40"
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
