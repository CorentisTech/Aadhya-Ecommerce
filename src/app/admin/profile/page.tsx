"use client";

import React, { useState, useEffect } from 'react';
import { User, ShieldCheck, Lock, Save, AlertCircle, Check } from 'lucide-react';

export default function AdminProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [avatar, setAvatar] = useState<'male' | 'female'>('male');
  const [newPassword, setNewPassword] = useState('');

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/profile');
      const data = await res.json();
      if (data.success && data.profile) {
        const p = data.profile;
        setFirstName(p.first_name || 'Prem');
        setLastName(p.last_name || 'Karnawat');
        setEmail(p.email || 'admin@aadhya.co');
        setPhone(p.phone || '+91 98765 43210');
        setAvatar(p.avatar || 'male');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await fetch('/api/admin/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          first_name: firstName,
          last_name: lastName,
          phone,
          avatar,
          password: newPassword ? newPassword : undefined
        })
      });
      const data = await res.json();
      if (data.success) {
        setSuccess(true);
        setNewPassword('');
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setError(data.error || 'Failed to update admin profile');
      }
    } catch (err: any) {
      setError(err.message || 'Error updating profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-12 text-center text-xs font-bold text-gray-400">Loading admin profile...</div>;
  }

  return (
    <div className="space-y-6 text-left pb-16 max-w-3xl mx-auto">
      <div>
        <h1 className="text-2xl font-black text-gray-900 tracking-tight">Admin Profile & Access</h1>
        <p className="text-xs font-semibold text-gray-500">
          Personal identification, avatar, and authentication security
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center space-x-2">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center space-x-2">
          <Check className="w-4 h-4" />
          <span>Admin profile updated successfully! Changes reflected immediately.</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8 space-y-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-[#cca05b] text-white flex items-center justify-center font-black text-2xl shadow-md">
              {firstName.charAt(0) || 'A'}
            </div>
            <div>
              <h2 className="text-lg font-black text-gray-900">{firstName} {lastName}</h2>
              <span className="text-xs font-bold text-[#cca05b] block">Authorized Store Administrator</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-600 uppercase">First Name</label>
              <input
                type="text"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 px-4 py-2.5 rounded-xl text-xs font-bold"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-600 uppercase">Last Name</label>
              <input
                type="text"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 px-4 py-2.5 rounded-xl text-xs font-bold"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-600 uppercase">Email Address (Auth)</label>
              <input
                type="email"
                readOnly
                value={email}
                className="w-full bg-gray-100 border border-gray-200 px-4 py-2.5 rounded-xl text-xs text-gray-500 cursor-not-allowed"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-600 uppercase">Phone Number</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 px-4 py-2.5 rounded-xl text-xs font-bold"
              />
            </div>
          </div>

          {/* Change Password */}
          <div className="pt-4 border-t border-gray-100 space-y-2">
            <label className="text-[10px] font-bold text-gray-600 uppercase block">
              Update Admin Password (leave blank to keep current)
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full sm:w-1/2 bg-gray-50 border border-gray-200 px-4 py-2.5 rounded-xl text-xs"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center space-x-2 px-8 py-3 bg-[#cca05b] text-[#15171c] font-black text-xs rounded-2xl shadow hover:bg-[#d8ae69] transition-all disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Updating...' : 'Save Profile Changes'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
