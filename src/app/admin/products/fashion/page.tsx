"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Plus, Shirt, Coins, RefreshCcw, Edit, Archive, CheckCircle2, AlertTriangle, ExternalLink } from 'lucide-react';

export default function FashionProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, totalPages: 1 });

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `/api/admin/products?department=fashion&q=${encodeURIComponent(search)}&status=${status}&page=${pagination.page}`
      );
      const data = await res.json();
      if (data.success) {
        setProducts(data.products);
        setPagination(data.pagination);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [status, pagination.page]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPagination(p => ({ ...p, page: 1 }));
    fetchProducts();
  };

  const handleArchive = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to archive "${name}"? It will be hidden from the storefront.`)) return;
    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        fetchProducts();
      } else {
        alert(data.error || 'Failed to archive product');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val || 0);
  };

  return (
    <div className="space-y-6 text-left pb-12">
      {/* Header with Domain Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-[#cca05b] uppercase tracking-wider mb-1">
            <Shirt className="w-3.5 h-3.5" />
            <span>FASHION DOMAIN</span>
          </div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Fashion Catalog</h1>
          <p className="text-xs font-semibold text-gray-500">
            Manage women's apparel, sarees, kurtis, co-ords, sizes, and color galleries
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            href="/admin/products/numismatics"
            className="px-3.5 py-2 bg-white border border-gray-200 text-gray-700 hover:text-black font-bold text-xs rounded-xl shadow-sm hover:bg-gray-50 transition-all flex items-center space-x-1.5"
          >
            <Coins className="w-3.5 h-3.5 text-blue-600" />
            <span>Switch to Coins & Notes</span>
          </Link>
          <Link
            href="/admin/products/create?type=fashion"
            className="px-4 py-2 bg-[#cca05b] text-[#15171c] font-black text-xs rounded-xl shadow hover:bg-[#d8ae69] transition-all flex items-center space-x-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add Fashion Product</span>
          </Link>
        </div>
      </div>

      {/* Search & Status Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <form onSubmit={handleSearch} className="flex-1 relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by product name, product #, category or fabric..."
            className="w-full bg-white border border-gray-200 pl-10 pr-4 py-2.5 rounded-2xl text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#cca05b]"
          />
        </form>

        <div className="flex items-center space-x-2 bg-white p-1 rounded-2xl border border-gray-200 text-xs font-bold text-gray-600">
          <button
            onClick={() => { setStatus('all'); setPagination(p => ({ ...p, page: 1 })); }}
            className={`px-3 py-1.5 rounded-xl transition-all ${status === 'all' ? 'bg-[#cca05b] text-[#15171c]' : 'hover:text-black'}`}
          >
            All
          </button>
          <button
            onClick={() => { setStatus('active'); setPagination(p => ({ ...p, page: 1 })); }}
            className={`px-3 py-1.5 rounded-xl transition-all ${status === 'active' ? 'bg-[#cca05b] text-[#15171c]' : 'hover:text-black'}`}
          >
            Active
          </button>
          <button
            onClick={() => { setStatus('archived'); setPagination(p => ({ ...p, page: 1 })); }}
            className={`px-3 py-1.5 rounded-xl transition-all ${status === 'archived' ? 'bg-[#cca05b] text-[#15171c]' : 'hover:text-black'}`}
          >
            Archived
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs font-bold text-gray-400 animate-pulse">
            Loading fashion catalog...
          </div>
        ) : products.length === 0 ? (
          <div className="p-12 text-center text-xs font-bold text-gray-400 space-y-2">
            <div>No fashion products found matching current criteria.</div>
            <Link
              href="/admin/products/create?type=fashion"
              className="text-[#cca05b] underline block"
            >
              + Create the first Fashion Product
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-gray-100 text-gray-400 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4">Product</th>
                  <th className="py-3 px-4">Product No</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Price</th>
                  <th className="py-3 px-4">MRP / Discount</th>
                  <th className="py-3 px-4">Variants / Stock</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 font-semibold">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-xl bg-gray-100 overflow-hidden flex-shrink-0 flex items-center justify-center">
                          {p.image_url ? (
                            <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" />
                          ) : (
                            <Shirt className="w-5 h-5 text-gray-400" />
                          )}
                        </div>
                        <div>
                          <span className="font-bold text-gray-900 block truncate max-w-[200px]">
                            {p.name}
                          </span>
                          <span className="text-[10px] text-gray-400">
                            {p.domain_details?.fabric || 'Fashion'}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-gray-700">
                      {p.product_no}
                    </td>
                    <td className="py-3.5 px-4 text-gray-600">
                      {p.category_name || '—'}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-gray-900">
                      {formatCurrency(p.base_price)}
                    </td>
                    <td className="py-3.5 px-4 text-gray-500">
                      <span className="line-through text-gray-400 text-[11px] block">
                        {formatCurrency(p.base_mrp)}
                      </span>
                      <span className="text-emerald-600 font-bold text-[10px]">
                        {p.base_discount}% OFF
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-gray-900 block">
                        {p.total_stock} in stock
                      </span>
                      <span className="text-[10px] text-gray-400">
                        {p.variants?.length || 1} variant(s)
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                        p.is_active ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {p.is_active ? 'Active' : 'Archived'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Link
                          href={`/admin/products/${p.id}/edit`}
                          className="p-1.5 text-gray-600 hover:text-black hover:bg-gray-100 rounded-lg transition-colors"
                          title="Edit product"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </Link>
                        {p.is_active && (
                          <button
                            onClick={() => handleArchive(p.id, p.name)}
                            className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Archive product"
                          >
                            <Archive className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
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
            <span>Showing Page {pagination.page} of {pagination.totalPages} ({pagination.total} products)</span>
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
