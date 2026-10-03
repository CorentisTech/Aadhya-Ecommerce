"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Sparkles, AlertCircle, ArrowLeft } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password
      });

      if (authError) {
        setError(authError.message || 'Invalid admin credentials');
        return;
      }

      if (!data.user) {
        setError('Authentication failed');
        return;
      }

      // Verify admin role via server API
      const res = await fetch('/api/admin/profile');
      const profileData = await res.json();

      if (!profileData.success || !profileData.profile) {
        setError('Unable to verify admin privileges. Access denied.');
        await supabase.auth.signOut();
        return;
      }

      const role = profileData.profile.role;
      const validAdminRoles = ['super_admin', 'admin', 'editor', 'support'];
      if (!validAdminRoles.includes(role)) {
        setError('This account does not have admin access.');
        await supabase.auth.signOut();
        return;
      }

      // Register device for Single Device Policy
      const deviceId = localStorage.getItem('aadhya_device_id') || 
                       (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : 'dev_' + Date.now());
      localStorage.setItem('aadhya_device_id', deviceId);

      await fetch('/api/auth/device', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deviceId, deviceName: 'Admin Portal' })
      });

      router.push('/admin/dashboard');
    } catch (err: any) {
      setError(err.message || 'Authentication error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#b98846] flex items-center justify-center p-4 select-none">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md bg-[#15171c] border border-white/10 p-8 sm:p-10 rounded-[32px] shadow-2xl space-y-6 text-left"
      >
        {/* Brand Header */}
        <div className="space-y-3 text-center">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#996522] via-[#cb9752] to-[#dfa658] mx-auto flex items-center justify-center shadow-lg shadow-black/40">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-display font-black text-2xl tracking-[0.25em] text-white">
              AADHYA
            </h1>
            <p className="text-[10px] text-[#cca05b] tracking-widest font-extrabold uppercase mt-1">
              STORE MANAGEMENT PLATFORM
            </p>
          </div>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-bold flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-gray-400 tracking-widest uppercase">
              EMAIL ADDRESS
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@aadhya.co"
              className="w-full bg-[#202229] border border-white/10 px-4 py-3 rounded-2xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#cca05b]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-gray-400 tracking-widest uppercase">
              PASSWORD
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-[#202229] border border-white/10 px-4 py-3 rounded-2xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#cca05b]"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-[#cca05b] hover:bg-[#d8ae69] text-[#15171c] text-xs font-black tracking-widest uppercase rounded-2xl transition-all shadow-md disabled:opacity-50"
            >
              {loading ? 'AUTHENTICATING...' : 'ACCESS PORTAL →'}
            </button>
          </div>
        </form>

        <div className="text-center pt-2">
          <button
            onClick={() => router.push('/')}
            className="text-[10px] font-bold tracking-widest text-gray-400 hover:text-white transition-colors uppercase inline-flex items-center space-x-1"
          >
            <ArrowLeft className="w-3 h-3" />
            <span>Back to Storefront</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
}
