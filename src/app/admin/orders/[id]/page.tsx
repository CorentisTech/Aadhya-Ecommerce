"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { 
  ArrowLeft, 
  CheckCircle2, 
  Clock, 
  Truck, 
  PackageCheck, 
  XCircle, 
  MapPin, 
  Phone, 
  Mail, 
  ExternalLink,
  ShieldCheck,
  AlertTriangle,
  Receipt
} from 'lucide-react';

export default function OrderDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Action Modals
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  const [dispatchModalOpen, setDispatchModalOpen] = useState(false);
  const [courier, setCourier] = useState('Blue Dart Express');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [trackingUrl, setTrackingUrl] = useState('');

  const [updating, setUpdating] = useState(false);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/orders/${id}`);
      const data = await res.json();
      if (data.success && data.order) {
        setOrder(data.order);
      } else {
        setError(data.error || 'Order not found');
      }
    } catch (err: any) {
      setError(err.message || 'Error loading order');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchOrder();
  }, [id]);

  const handleStatusAction = async (action: 'APPROVE' | 'REJECT' | 'DISPATCH' | 'DELIVER', extraPayload: any = {}) => {
    try {
      setUpdating(true);
      const res = await fetch('/api/admin/orders', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          order_id: order.id,
          action,
          ...extraPayload
        })
      });
      const data = await res.json();
      if (data.success) {
        setRejectModalOpen(false);
        setDispatchModalOpen(false);
        fetchOrder();
      } else {
        alert(data.error || 'Failed to update order status');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

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
        Loading order details and tracking timeline...
      </div>
    );
  }

  if (!order) {
    return (
      <div className="p-8 text-center space-y-4">
        <div className="text-sm font-bold text-rose-600">{error || 'Order not found'}</div>
        <Link href="/admin/orders" className="text-xs font-bold text-[#cca05b]">
          ← Back to Orders
        </Link>
      </div>
    );
  }

  const { items = [], shipping_address = {} } = order;

  // Pipeline step calculation
  const getStepIndex = (st: string) => {
    switch (st) {
      case 'PENDING': return 0;
      case 'CONFIRMED':
      case 'PROCESSING': return 1;
      case 'SHIPPED': return 2;
      case 'DELIVERED': return 3;
      default: return -1;
    }
  };

  const currentStep = getStepIndex(order.status);
  const isCancelled = order.status === 'CANCELLED' || order.status === 'REFUNDED';

  return (
    <div className="space-y-6 text-left pb-16 max-w-5xl mx-auto">
      {/* Breadcrumb & Order Number */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Link
          href="/admin/orders"
          className="inline-flex items-center space-x-2 text-xs font-bold text-gray-500 hover:text-black transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Orders</span>
        </Link>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {order.status === 'PENDING' && (
            <>
              <button
                disabled={updating}
                onClick={() => setRejectModalOpen(true)}
                className="px-4 py-2 bg-rose-50 text-rose-700 font-bold text-xs rounded-xl hover:bg-rose-100 transition-colors"
              >
                Reject Order
              </button>
              <button
                disabled={updating}
                onClick={() => handleStatusAction('APPROVE')}
                className="px-5 py-2 bg-[#cca05b] text-[#15171c] font-black text-xs rounded-xl hover:bg-[#d8ae69] shadow transition-all"
              >
                Approve Order
              </button>
            </>
          )}

          {(order.status === 'CONFIRMED' || order.status === 'PROCESSING') && (
            <button
              disabled={updating}
              onClick={() => setDispatchModalOpen(true)}
              className="px-5 py-2 bg-purple-600 text-white font-black text-xs rounded-xl hover:bg-purple-700 shadow transition-all flex items-center space-x-1.5"
            >
              <Truck className="w-4 h-4" />
              <span>Dispatch & Add Tracking</span>
            </button>
          )}

          {order.status === 'SHIPPED' && (
            <button
              disabled={updating}
              onClick={() => handleStatusAction('DELIVER')}
              className="px-5 py-2 bg-emerald-600 text-white font-black text-xs rounded-xl hover:bg-emerald-700 shadow transition-all flex items-center space-x-1.5"
            >
              <PackageCheck className="w-4 h-4" />
              <span>Mark Delivered</span>
            </button>
          )}
        </div>
      </div>

      {/* 1. Order Status Timeline from prompt */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400">
              STATUS TIMELINE
            </span>
            <h1 className="text-xl font-black text-gray-900">
              Order {order.order_number}
            </h1>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-black uppercase ${
            isCancelled
              ? 'bg-rose-100 text-rose-800'
              : order.status === 'DELIVERED'
              ? 'bg-emerald-100 text-emerald-800'
              : 'bg-amber-100 text-amber-900'
          }`}>
            {order.status}
          </span>
        </div>

        {isCancelled ? (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-800 space-y-1">
            <span className="font-bold block">Order has been cancelled / rejected</span>
            {order.rejection_reason && (
              <span className="block text-rose-600">Reason: {order.rejection_reason}</span>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-2 pt-2">
            {[
              { label: 'ORDER PLACED', icon: Clock, step: 0 },
              { label: 'APPROVED', icon: CheckCircle2, step: 1 },
              { label: 'DISPATCHED', icon: Truck, step: 2 },
              { label: 'DELIVERED', icon: PackageCheck, step: 3 },
            ].map((st, i) => {
              const isPast = currentStep >= st.step;
              const isCurrent = currentStep === st.step;
              const Icon = st.icon;
              return (
                <div key={i} className="flex flex-col items-center text-center space-y-2">
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${
                    isPast 
                      ? 'bg-emerald-500 text-white shadow-md' 
                      : 'bg-gray-100 text-gray-400'
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className={`text-[10px] font-extrabold uppercase tracking-wider ${
                    isCurrent ? 'text-gray-900' : isPast ? 'text-emerald-700' : 'text-gray-400'
                  }`}>
                    {st.label}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {/* Courier Tracking Info if Dispatched */}
        {order.status === 'SHIPPED' && order.tracking_number && (
          <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div>
              <span className="font-extrabold text-purple-900 block">
                Courier: {order.courier || 'Express Shipping'}
              </span>
              <span className="text-purple-700 font-mono">
                Tracking Number: {order.tracking_number}
              </span>
            </div>
            {order.tracking_url && (
              <a
                href={order.tracking_url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center space-x-1 px-3 py-1.5 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-700 transition-colors"
              >
                <span>Track Package</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        )}
      </div>

      {/* 2. Order Summary & Customer Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Order Items */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8 space-y-4">
          <h2 className="text-base font-black text-gray-900">Ordered Items</h2>

          <div className="divide-y divide-gray-100">
            {items.map((it: any, i: number) => (
              <div key={i} className="py-4 flex items-center justify-between text-xs">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-xl bg-gray-100 overflow-hidden flex items-center justify-center flex-shrink-0">
                    {it.image_url ? (
                      <img src={it.image_url} alt={it.product_name} className="w-full h-full object-cover" />
                    ) : (
                      <Receipt className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                  <div>
                    <span className="font-bold text-gray-900 block">{it.product_name}</span>
                    <span className="text-[10px] text-gray-400 block">
                      SKU: {it.product_no} • {it.selected_size ? `Size: ${it.selected_size}` : 'Standard'}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-bold text-gray-900 block">
                    {it.quantity} × {formatCurrency(it.unit_price)}
                  </span>
                  <span className="text-[10px] text-gray-500">
                    {formatCurrency(it.unit_price * it.quantity)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Pricing Totals */}
          <div className="pt-4 border-t border-gray-100 space-y-2 text-xs">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>{formatCurrency(order.subtotal)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Shipping Charges</span>
              <span>{order.shipping_cost > 0 ? formatCurrency(order.shipping_cost) : 'FREE'}</span>
            </div>
            {order.discount_amount > 0 && (
              <div className="flex justify-between text-emerald-600 font-semibold">
                <span>Festive Discount</span>
                <span>-{formatCurrency(order.discount_amount)}</span>
              </div>
            )}
            <div className="flex justify-between text-sm font-black text-gray-900 pt-2 border-t border-gray-100">
              <span>Total Paid ({order.payment_method || 'COD'})</span>
              <span className="text-[#cca05b]">{formatCurrency(order.total_amount)}</span>
            </div>
          </div>
        </div>

        {/* Right Col: Customer & Shipping Address */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8 space-y-6">
          <div className="space-y-1">
            <h2 className="text-base font-black text-gray-900">Customer Details</h2>
            <p className="text-xs text-gray-400 font-semibold">Account and contact information</p>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-amber-100 text-[#cca05b] font-bold flex items-center justify-center flex-shrink-0">
                {order.first_name?.charAt(0) || 'C'}
              </div>
              <div>
                <span className="font-bold text-gray-900 block">
                  {order.first_name} {order.last_name}
                </span>
                <span className="text-gray-400 text-[10px]">AADHYA Customer</span>
              </div>
            </div>

            <div className="flex items-center space-x-2 text-gray-600 pt-2 border-t border-gray-50">
              <Mail className="w-3.5 h-3.5 text-gray-400" />
              <span>{order.customer_email || 'No email provided'}</span>
            </div>

            <div className="flex items-center space-x-2 text-gray-600">
              <Phone className="w-3.5 h-3.5 text-gray-400" />
              <span>{order.customer_phone || shipping_address.alt_phone || 'No phone'}</span>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="pt-4 border-t border-gray-100 space-y-2 text-xs">
            <div className="flex items-center space-x-1.5 text-xs font-bold text-gray-700">
              <MapPin className="w-3.5 h-3.5 text-[#cca05b]" />
              <span>Delivery Destination</span>
            </div>
            <div className="p-3 bg-gray-50 rounded-2xl text-gray-600 space-y-1 leading-relaxed">
              <span className="font-bold text-gray-900 block">{shipping_address.full_name}</span>
              <p>
                {shipping_address.address_line1 || shipping_address.street_name}
                {shipping_address.landmark && `, near ${shipping_address.landmark}`}
                <br />
                {shipping_address.city}, {shipping_address.state} - {shipping_address.zip_code}
                <br />
                {shipping_address.country || 'India'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Reject Modal */}
      {rejectModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-4 text-left">
            <h3 className="text-lg font-black text-gray-900">Reject Customer Order</h3>
            <p className="text-xs text-gray-500">
              Please specify the cancellation reason. The customer will be notified in their order history.
            </p>
            <textarea
              rows={3}
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="e.g. Out of stock / Delivery address non-serviceable"
              className="w-full bg-gray-50 border border-gray-200 p-3 rounded-xl text-xs"
            />
            <div className="flex justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setRejectModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-gray-100 text-gray-700 font-bold text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleStatusAction('REJECT', { rejection_reason: rejectionReason })}
                className="px-5 py-2 rounded-xl bg-rose-600 text-white font-bold text-xs shadow"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Dispatch Modal */}
      {dispatchModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-4 text-left">
            <h3 className="text-lg font-black text-gray-900">Dispatch Package & Tracking</h3>
            <p className="text-xs text-gray-500">
              Assign shipping courier and tracking number. These will appear on the customer's tracking page.
            </p>
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-600 uppercase">Courier Service</label>
                <input
                  type="text"
                  value={courier}
                  onChange={(e) => setCourier(e.target.value)}
                  placeholder="e.g. Blue Dart / Delhivery / DTDC"
                  className="w-full bg-gray-50 border border-gray-200 px-3 py-2 rounded-xl text-xs font-bold"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-600 uppercase">Tracking Number *</label>
                <input
                  type="text"
                  required
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="e.g. BD-893478921"
                  className="w-full bg-gray-50 border border-gray-200 px-3 py-2 rounded-xl text-xs font-mono font-bold"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-600 uppercase">Tracking Link URL</label>
                <input
                  type="url"
                  value={trackingUrl}
                  onChange={(e) => setTrackingUrl(e.target.value)}
                  placeholder="https://track.bluedart.com/..."
                  className="w-full bg-gray-50 border border-gray-200 px-3 py-2 rounded-xl text-xs"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2 pt-3">
              <button
                type="button"
                onClick={() => setDispatchModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-gray-100 text-gray-700 font-bold text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleStatusAction('DISPATCH', { courier, tracking_number: trackingNumber, tracking_url: trackingUrl })}
                className="px-5 py-2 rounded-xl bg-purple-600 text-white font-bold text-xs shadow"
              >
                Confirm Dispatch
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
