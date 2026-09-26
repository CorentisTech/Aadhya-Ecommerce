"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { 
  ArrowLeft, 
  MapPin, 
  Phone, 
  Mail, 
  Calendar, 
  Clock, 
  Package, 
  Receipt,
  ExternalLink 
} from 'lucide-react';

export default function UserDetailPage() {
  const params = useParams();
  const userId = params?.id as string;
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    const fetchUser = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/admin/users/${userId}`);
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
    fetchUser();
  }, [userId]);

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
        Loading customer record...
      </div>
    );
  }

  if (!data || !data.user) {
    return (
      <div className="p-8 text-center space-y-4">
        <div className="text-sm font-bold text-gray-700">Customer not found</div>
        <Link href="/admin/users" className="text-xs font-bold text-[#cca05b]">
          ← Back to Customers
        </Link>
      </div>
    );
  }

  const { user, addresses, activeOrders, pastOrders, totalOrders, totalSpent } = data;

  return (
    <div className="space-y-6 text-left pb-12">
      {/* Top Breadcrumb */}
      <Link
        href="/admin/users"
        className="inline-flex items-center space-x-2 text-xs font-bold text-gray-500 hover:text-black transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Customers</span>
      </Link>

      {/* Profile Header Card */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center space-x-5">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-[#cca05b] text-white flex items-center justify-center font-black text-2xl shadow-md">
            {user.full_name?.charAt(0) || 'U'}
          </div>
          <div>
            <h1 className="text-2xl font-black text-gray-900">{user.full_name}</h1>
            <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-gray-500 mt-1">
              <span className="flex items-center space-x-1">
                <Mail className="w-3.5 h-3.5" />
                <span>{user.email || 'No email registered'}</span>
              </span>
              <span>•</span>
              <span className="flex items-center space-x-1">
                <Phone className="w-3.5 h-3.5" />
                <span>{user.phone || 'No phone'}</span>
              </span>
              <span>•</span>
              <span className="flex items-center space-x-1">
                <Calendar className="w-3.5 h-3.5" />
                <span>Joined {new Date(user.created_at).toLocaleDateString('en-IN')}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Quick totals */}
        <div className="flex items-center space-x-4 border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-8">
          <div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
              TOTAL ORDERS
            </span>
            <span className="text-xl font-black text-gray-900">{totalOrders}</span>
          </div>
          <div className="w-px h-8 bg-gray-100" />
          <div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
              LIFETIME SPEND
            </span>
            <span className="text-xl font-black text-[#cca05b]">{formatCurrency(totalSpent)}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Saved Addresses */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2 text-xs font-extrabold uppercase tracking-wider text-gray-500">
            <MapPin className="w-4 h-4 text-[#cca05b]" />
            <span>Saved Addresses ({addresses.length})</span>
          </div>

          {addresses.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-6 text-center text-xs font-semibold text-gray-400">
              No addresses saved for this customer yet.
            </div>
          ) : (
            <div className="space-y-3">
              {addresses.map((addr: any) => (
                <div
                  key={addr.id}
                  className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-gray-900">{addr.full_name}</span>
                    {addr.is_default && (
                      <span className="px-2 py-0.5 rounded-full bg-amber-50 text-[#cca05b] text-[10px] font-bold">
                        Default
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600 leading-relaxed">
                    {addr.address_line1 || addr.street_name}
                    {addr.landmark && `, near ${addr.landmark}`}
                    <br />
                    {addr.city}, {addr.state} - {addr.zip_code}
                  </p>
                  {addr.alt_phone && (
                    <div className="text-gray-400 text-[11px] pt-1">
                      Phone: {addr.alt_phone}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right 2 Columns: Order History (Active vs Past) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active Orders */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-xs font-extrabold uppercase tracking-wider text-amber-600">
              <Clock className="w-4 h-4" />
              <span>Current / Active Orders ({activeOrders.length})</span>
            </div>

            {activeOrders.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-100 p-6 text-center text-xs font-semibold text-gray-400">
                No active in-flight orders for this customer.
              </div>
            ) : (
              <div className="space-y-3">
                {activeOrders.map((ord: any) => (
                  <div
                    key={ord.id}
                    className="bg-white rounded-2xl border border-amber-200/80 p-5 shadow-sm space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="font-black text-sm text-gray-900">{ord.order_number}</span>
                        <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold uppercase">
                          {ord.status}
                        </span>
                      </div>
                      <Link
                        href={`/admin/orders/${ord.id}`}
                        className="text-xs font-bold text-[#cca05b] hover:underline inline-flex items-center space-x-1"
                      >
                        <span>Manage Order</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    </div>

                    <div className="text-xs text-gray-500 flex items-center justify-between pt-1 border-t border-gray-50">
                      <span>Placed on {new Date(ord.created_at).toLocaleDateString('en-IN')}</span>
                      <span className="font-black text-sm text-gray-900">{formatCurrency(ord.total_amount)}</span>
                    </div>

                    {/* Items */}
                    <div className="space-y-1.5 pt-1">
                      {ord.items?.map((it: any, i: number) => (
                        <div key={i} className="text-xs text-gray-700 flex justify-between">
                          <span>{it.quantity}x {it.product_name} ({it.selected_size || 'Std'})</span>
                          <span className="font-semibold">{formatCurrency(it.unit_price * it.quantity)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Past Orders */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-xs font-extrabold uppercase tracking-wider text-gray-500">
              <Package className="w-4 h-4 text-emerald-600" />
              <span>Past / Completed Orders ({pastOrders.length})</span>
            </div>

            {pastOrders.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-100 p-6 text-center text-xs font-semibold text-gray-400">
                No past completed orders recorded.
              </div>
            ) : (
              <div className="space-y-3">
                {pastOrders.map((ord: any) => (
                  <div
                    key={ord.id}
                    className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-gray-900">{ord.order_number}</span>
                        <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 text-[10px] font-bold uppercase">
                          {ord.status}
                        </span>
                      </div>
                      <span className="text-[10px] text-gray-400 block mt-0.5">
                        {new Date(ord.created_at).toLocaleDateString('en-IN')} • {ord.items?.length || 0} items
                      </span>
                    </div>

                    <div className="flex items-center space-x-4">
                      <span className="font-bold text-gray-900">{formatCurrency(ord.total_amount)}</span>
                      <Link
                        href={`/admin/orders/${ord.id}`}
                        className="text-[#cca05b] font-bold hover:underline"
                      >
                        View
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
