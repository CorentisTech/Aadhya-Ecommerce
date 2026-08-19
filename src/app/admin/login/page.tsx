"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate authentication and route to dashboard
    router.push('/admin/dashboard');
  };

  return (
    <div className="w-full min-h-screen bg-brand-warmWhite flex items-center justify-center py-12 px-6">
      {/* Glossy login card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md bg-brand-white/80 backdrop-blur-md border border-brand-border p-8 rounded-2xl shadow-lg space-y-6"
      >
        <div className="space-y-2 text-center">
          <span className="text-[10px] tracking-[0.3em] font-extrabold text-brand-dustyRose uppercase block">
            ADMIN SYSTEM
          </span>
          <h1 className="font-display font-extrabold text-2xl tracking-widest text-brand-espresso">
            AADHYA PORTAL
          </h1>
          <p className="text-[10px] text-brand-warmGray tracking-wider font-semibold">
            Secure administrative control access
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1.5 text-left">
            <label className="text-[9px] font-bold text-brand-espresso tracking-widest uppercase">
              EMAIL ADDRESS
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@aadhya.co"
              className="w-full bg-brand-warmWhite/50 border border-brand-border/80 px-4 py-2.5 rounded-xl text-xs text-brand-espresso placeholder-brand-warmGray focus:outline-none focus:border-brand-espresso focus:ring-1 focus:ring-brand-espresso transition-all"
            />
          </div>

          <div className="space-y-1.5 text-left">
            <label className="text-[9px] font-bold text-brand-espresso tracking-widest uppercase">
              PASSWORD
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-brand-warmWhite/50 border border-brand-border/80 px-4 py-2.5 rounded-xl text-xs text-brand-espresso placeholder-brand-warmGray focus:outline-none focus:border-brand-espresso focus:ring-1 focus:ring-brand-espresso transition-all"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 bg-brand-espresso text-brand-white text-xs font-bold tracking-[0.25em] uppercase hover:bg-brand-espresso/90 rounded-xl transition-all shadow-sm"
            >
              AUTHENTICATE →
            </button>
          </div>
        </form>

        <div className="text-center pt-2">
          <button
            onClick={() => router.push('/')}
            className="text-[9px] font-bold tracking-widest text-brand-warmGray hover:text-brand-espresso transition-colors uppercase"
          >
            ← Back to Storefront
          </button>
        </div>
      </motion.div>
    </div>
  );
}
