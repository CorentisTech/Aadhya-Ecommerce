"use client";

import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Star } from 'lucide-react';
import { ImageUpload } from '@/components/ui/ImageUpload';
import Image from 'next/image';

interface Product {
  _id: string;
  name: string;
}

interface Review {
  _id: string;
  productId: string | { _id: string; name: string };
  customerName: string;
  rating: number;
  reviewTitle: string;
  reviewContent: string;
  image?: string;
  status: string;
  isFeatured: boolean;
  displayOrder: number;
}

export default function AdminReviewsPage() {
  const [activeTab, setActiveTab] = useState<'Fashion' | 'Coins & Notes'>('Fashion');
  const [reviews, setReviews] = useState<Review[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const initialFormState = {
    productId: '',
    customerName: '',
    rating: 5,
    reviewTitle: '',
    reviewContent: '',
    image: '',
    status: 'approved',
    isFeatured: false,
    displayOrder: 0
  };

  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    fetchReviews();
    fetchProducts();
  }, [activeTab]);

  const fetchReviews = async () => {
    try {
      const res = await fetch(`/api/admin/reviews?department=${encodeURIComponent(activeTab)}`);
      if (res.ok) {
        const data = await res.json();
        setReviews(data.reviews || data || []);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await fetch(`/api/admin/products?department=${encodeURIComponent(activeTab)}`);
      if (res.ok) {
        const data = await res.json();
        setProducts(data.products || data || []);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleOpenModal = (review?: Review) => {
    if (review) {
      setEditingId(review._id);
      setFormData({
        productId: typeof review.productId === 'object' ? review.productId._id : review.productId,
        customerName: review.customerName,
        rating: review.rating,
        reviewTitle: review.reviewTitle,
        reviewContent: review.reviewContent,
        image: review.image || '',
        status: review.status,
        isFeatured: review.isFeatured,
        displayOrder: review.displayOrder || 0
      });
    } else {
      setEditingId(null);
      setFormData(initialFormState);
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingId ? `/api/admin/reviews?id=${editingId}` : '/api/admin/reviews';
      const method = editingId ? 'PUT' : 'POST';
      
      const payload = {
        ...formData,
        department: activeTab
      };

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setIsModalOpen(false);
        fetchReviews();
      } else {
        alert('Failed to save review');
      }
    } catch (error) {
      console.error('Error saving review:', error);
      alert('Error saving review');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this review?')) return;
    try {
      const res = await fetch(`/api/admin/reviews?id=${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        fetchReviews();
      } else {
        alert('Failed to delete review');
      }
    } catch (error) {
      console.error('Error deleting review:', error);
    }
  };

  const renderStars = (rating: number) => {
    return Array(5).fill(0).map((_, i) => (
      <Star key={i} className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
    ));
  };

  const getProductName = (productId: string | { _id: string; name: string }) => {
    if (typeof productId === 'object') return productId.name;
    const product = products.find(p => p._id === productId);
    return product ? product.name : 'Unknown Product';
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Reviews Management</h1>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-[#cca05b] hover:bg-[#b88c4a] text-white px-6 py-2.5 rounded-xl flex items-center gap-2 transition-colors font-medium shadow-sm"
        >
          <Plus className="w-5 h-5" />
          Add Review
        </button>
      </div>

      <div className="bg-white rounded-3xl p-2 flex gap-2 mb-8 shadow-sm w-fit border border-gray-100">
        <button
          onClick={() => setActiveTab('Fashion')}
          className={`px-8 py-3 rounded-2xl font-medium transition-all ${
            activeTab === 'Fashion' ? 'bg-[#cca05b] text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'
          }`}
        >
          Fashion
        </button>
        <button
          onClick={() => setActiveTab('Coins & Notes')}
          className={`px-8 py-3 rounded-2xl font-medium transition-all ${
            activeTab === 'Coins & Notes' ? 'bg-[#cca05b] text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'
          }`}
        >
          Coins & Notes
        </button>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 text-sm">
                <th className="p-4 font-medium">Product</th>
                <th className="p-4 font-medium">Customer</th>
                <th className="p-4 font-medium">Rating</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium">Featured</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {reviews.map((review) => (
                <tr key={review._id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="p-4">
                    <div className="font-medium text-gray-800">{getProductName(review.productId)}</div>
                    <div className="text-sm text-gray-500 truncate max-w-xs">{review.reviewTitle}</div>
                  </td>
                  <td className="p-4 text-gray-700">{review.customerName}</td>
                  <td className="p-4">
                    <div className="flex gap-1">{renderStars(review.rating)}</div>
                  </td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      review.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {review.status}
                    </span>
                  </td>
                  <td className="p-4">
                    {review.isFeatured && (
                      <span className="bg-[#cca05b]/10 text-[#cca05b] px-3 py-1 rounded-full text-xs font-medium border border-[#cca05b]/20">
                        Featured
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    <button 
                      onClick={() => handleOpenModal(review)}
                      className="p-2 text-gray-400 hover:text-[#cca05b] transition-colors rounded-xl hover:bg-[#cca05b]/10 mr-2"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => handleDelete(review._id)}
                      className="p-2 text-gray-400 hover:text-red-500 transition-colors rounded-xl hover:bg-red-50"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
              {reviews.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-500">
                    No reviews found for {activeTab}.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
              <h2 className="text-2xl font-bold text-gray-800">
                {editingId ? 'Edit Review' : 'Add New Review'}
              </h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-2"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Product</label>
                  <select
                    required
                    value={formData.productId}
                    onChange={(e) => setFormData({...formData, productId: e.target.value})}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#cca05b] focus:border-transparent outline-none bg-white"
                  >
                    <option value="">Select a product...</option>
                    {products.map(p => (
                      <option key={p._id} value={p._id}>{p.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Customer Name</label>
                  <input
                    type="text"
                    required
                    value={formData.customerName}
                    onChange={(e) => setFormData({...formData, customerName: e.target.value})}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#cca05b] focus:border-transparent outline-none"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Rating (1-5)</label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    required
                    value={formData.rating}
                    onChange={(e) => setFormData({...formData, rating: Number(e.target.value)})}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#cca05b] focus:border-transparent outline-none"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Review Title</label>
                  <input
                    type="text"
                    required
                    value={formData.reviewTitle}
                    onChange={(e) => setFormData({...formData, reviewTitle: e.target.value})}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#cca05b] focus:border-transparent outline-none"
                    placeholder="Great product!"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Review Content</label>
                  <textarea
                    required
                    rows={4}
                    value={formData.reviewContent}
                    onChange={(e) => setFormData({...formData, reviewContent: e.target.value})}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#cca05b] focus:border-transparent outline-none resize-none"
                    placeholder="Write the full review here..."
                  ></textarea>
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Review Image (Optional)</label>
                  <ImageUpload
                    value={formData.image || ''}
                    onChange={(url) => setFormData({...formData, image: url})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#cca05b] focus:border-transparent outline-none bg-white"
                  >
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Display Order</label>
                  <input
                    type="number"
                    value={formData.displayOrder}
                    onChange={(e) => setFormData({...formData, displayOrder: Number(e.target.value)})}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#cca05b] focus:border-transparent outline-none"
                  />
                </div>

                <div className="col-span-2 flex items-center gap-3 bg-gray-50 p-4 rounded-xl">
                  <input
                    type="checkbox"
                    id="isFeatured"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({...formData, isFeatured: e.target.checked})}
                    className="w-5 h-5 text-[#cca05b] rounded focus:ring-[#cca05b]"
                  />
                  <label htmlFor="isFeatured" className="font-medium text-gray-700 cursor-pointer">
                    Mark as Featured Review
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-6 mt-6 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-2.5 rounded-xl font-medium text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl font-medium bg-[#cca05b] hover:bg-[#b88c4a] text-white transition-colors shadow-sm"
                >
                  {editingId ? 'Update Review' : 'Create Review'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
