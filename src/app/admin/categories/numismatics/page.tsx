"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Coins, Shirt, Edit } from 'lucide-react';
import { ImageUpload } from '@/components/ui/ImageUpload';

export default function NumismaticsCategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [sortOrder, setSortOrder] = useState<number>(0);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/categories?department=numismatics');
      const data = await res.json();
      if (data.success) {
        setCategories(data.categories);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const method = editingId ? 'PUT' : 'POST';
      const url = editingId ? `/api/admin/categories/${editingId}` : '/api/admin/categories';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          department: 'numismatics',
          description,
          image_url: imageUrl,
          sort_order: sortOrder
        })
      });
      const data = await res.json();
      if (data.success) {
        setName('');
        setDescription('');
        setImageUrl('');
        setEditingId(null);
        setShowModal(false);
        fetchCategories();
      } else {
        alert(data.error || 'Failed to save numismatics category');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleActive = async (id: string, currentActive: boolean) => {
    try {
      await fetch(`/api/admin/categories/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: !currentActive })
      });
      fetchCategories();
    } catch (err) {
      console.error(err);
    }
  };

  const openEditModal = (c: any) => {
    setEditingId(c.id);
    setName(c.name);
    setDescription(c.description || '');
    setImageUrl(c.image_url || '');
    setSortOrder(c.sort_order || 0);
    setShowModal(true);
  };

  const openCreateModal = () => {
    setEditingId(null);
    setName('');
    setDescription('');
    setImageUrl('');
    setSortOrder(0);
    setShowModal(true);
  };

  return (
    <div className="space-y-6 text-left pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">
            <Coins className="w-3.5 h-3.5" />
            <span>NUMISMATICS DOMAIN</span>
          </div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Coins & Notes Categories</h1>
          <p className="text-xs font-semibold text-gray-500">
            Configure historical eras, dynasties, paper money, badges, and catalog sorting
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            href="/admin/categories/fashion"
            className="px-3.5 py-2 bg-white border border-gray-200 text-gray-700 hover:text-black font-bold text-xs rounded-xl shadow-sm hover:bg-gray-50 transition-all flex items-center space-x-1.5"
          >
            <Shirt className="w-3.5 h-3.5 text-[#cca05b]" />
            <span>Switch to Fashion</span>
          </Link>
          <button
            onClick={openCreateModal}
            className="px-4 py-2 bg-[#cca05b] text-[#15171c] font-black text-xs rounded-xl shadow hover:bg-[#d8ae69] transition-all flex items-center space-x-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>New Numismatic Category</span>
          </button>
        </div>
      </div>

      {/* Grid of Categories */}
      {loading ? (
        <div className="p-12 text-center text-xs font-bold text-gray-400 animate-pulse">
          Loading numismatics categories...
        </div>
      ) : categories.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center text-xs font-bold text-gray-400 space-y-2">
          <div>No numismatics categories configured yet.</div>
          <button onClick={openCreateModal} className="text-[#cca05b] underline">
            + Create First Category
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((c) => (
            <div
              key={c.id}
              className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5 flex flex-col justify-between space-y-4 hover:border-blue-200 transition-all"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] text-gray-400 font-bold uppercase">
                    Order: {c.sort_order || 0}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEditModal(c)}
                      className="p-1 rounded-md text-gray-400 hover:text-blue-600 hover:bg-blue-50"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleToggleActive(c.id, c.is_active)}
                      className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                        c.is_active ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      {c.is_active ? 'Active' : 'Hidden'}
                    </button>
                  </div>
                </div>

                <h3 className="text-base font-black text-gray-900">{c.name}</h3>
                <p className="text-xs text-gray-500 line-clamp-2 font-medium">
                  {c.description || 'Numismatic historical category collection.'}
                </p>
              </div>

              <div className="pt-3 border-t border-gray-50 flex items-center justify-between">
                <span className="text-xs font-bold text-gray-600">
                  {c.active_product_count || 0} active items
                </span>

                <Link
                  href={`/admin/products/create?type=numismatics`}
                  className="text-[11px] font-bold text-blue-600 hover:underline"
                >
                  + Add Coin
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Category Modal (Create / Edit) */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-6 text-left">
            <div>
              <h2 className="text-xl font-black text-gray-900">{editingId ? 'Edit' : 'New'} Coins & Notes Category</h2>
              <p className="text-xs font-semibold text-gray-400">
                {editingId ? 'Update category details' : 'Adds a historical category to the Numismatics storefront & marquees'}
              </p>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-600 uppercase">Category Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. MUGHAL ZODIAC COINS"
                  className="w-full bg-gray-50 border border-gray-200 px-4 py-2.5 rounded-xl text-xs font-bold text-gray-900 focus:outline-none focus:border-[#cca05b]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-600 uppercase">Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Historical description and background..."
                  className="w-full bg-gray-50 border border-gray-200 p-3 rounded-xl text-xs"
                />
              </div>

              <ImageUpload 
                value={imageUrl} 
                onChange={setImageUrl} 
                label="Category Cover Image (Optional)" 
              />

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-600 uppercase">Display Sort Order</label>
                <input
                  type="number"
                  value={sortOrder}
                  onChange={(e) => setSortOrder(Number(e.target.value))}
                  placeholder="0"
                  className="w-full bg-gray-50 border border-gray-200 px-4 py-2.5 rounded-xl text-xs font-bold"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-gray-100 text-gray-700 font-bold text-xs hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-xl bg-[#cca05b] text-[#15171c] font-black text-xs hover:bg-[#d8ae69] shadow disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : editingId ? 'Save Changes' : 'Create Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
