"use client";

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ArrowRight } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setPage } = useApp();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  const handleNavClick = (sectionId: string) => {
    setPage('home');
    setTimeout(() => {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  return (
    <footer className="w-full bg-[#1A1513] text-brand-white pt-16 pb-8 px-6 md:px-12 mt-20 relative overflow-hidden">
      
      {/* 1. Large Cream Rounded Newsletter Panel (Asymmetrical overlap) */}
      <div className="max-w-6xl mx-auto mb-16">
        <div className="bg-brand-warmWhite text-brand-espresso rounded-3xl p-8 md:p-12 lg:p-16 relative overflow-hidden flex flex-col lg:flex-row items-center lg:items-stretch justify-between shadow-xl gap-8 border border-brand-border/60">
          
          {/* Asymmetric BG Details */}
          <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-brand-blush/20 blur-3xl pointer-events-none" />
          <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-brand-softBeige/30 blur-3xl pointer-events-none" />

          {/* Left Side: Brand & Call */}
          <div className="flex-1 space-y-6 z-10 text-center lg:text-left">
            <h2 className="font-display text-4xl md:text-5xl font-extrabold tracking-[0.2em] opacity-15">
              AADHYA
            </h2>
            <div className="space-y-2">
              <h3 className="font-display text-2xl md:text-3xl font-bold tracking-wide">
                STAY IN THE AADHYA EDIT
              </h3>
              <p className="text-xs md:text-sm text-brand-warmGray tracking-wider max-w-md mx-auto lg:mx-0">
                Be the first to discover new collections, exclusive launch invites, and rare historical coins.
              </p>
            </div>
          </div>

          {/* Right Side: Form */}
          <div className="flex-1 w-full max-w-md flex flex-col justify-center z-10">
            <form onSubmit={handleSubscribe} className="relative flex items-center border-b border-brand-espresso/40 py-2">
              <input
                type="email"
                placeholder="Enter your email address"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent outline-none text-brand-espresso text-sm placeholder-brand-warmGray/60 font-semibold tracking-wider pr-10"
              />
              <button
                type="submit"
                aria-label="Subscribe"
                className="absolute right-0 p-2 text-brand-espresso hover:text-brand-dustyRose transition-colors"
              >
                <ArrowRight className="w-5 h-5" />
              </button>
            </form>

            {subscribed && (
              <p className="text-[10px] text-brand-success font-bold tracking-wider mt-2 transition-all">
                ✓ Thank you! You have been added to our digital digest.
              </p>
            )}

            <div className="flex items-center justify-between lg:justify-end mt-8 gap-6 text-brand-warmGray">
              <span className="text-[10px] tracking-widest font-bold">@AADHYAOFFICIAL</span>
              <div className="flex space-x-4">
                <a href="#" aria-label="Instagram" className="hover:text-brand-espresso transition-colors">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                  </svg>
                </a>
                <a href="#" aria-label="Facebook" className="hover:text-brand-espresso transition-colors">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                  </svg>
                </a>
                <a href="#" aria-label="YouTube" className="hover:text-brand-espresso transition-colors">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17z"/>
                    <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* 2. Structured Columns */}
      <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 border-t border-brand-white/10 pt-16 pb-12">
        
        {/* Brand Column */}
        <div className="col-span-2 space-y-4">
          <span className="font-display text-2xl font-bold tracking-[0.25em] text-brand-white">
            AADHYA
          </span>
          <p className="text-xs text-brand-border/60 tracking-widest leading-relaxed max-w-sm">
            Handcrafted contemporary Indian silhouettes alongside historic coin artifacts preserved across generations. Fashion with character. Collections with stories.
          </p>
        </div>

        {/* Column: Fashion Shop */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold tracking-[0.2em] text-brand-dustyRose">FASHION</h4>
          <ul className="space-y-2 text-[11px] tracking-widest text-brand-border/70 font-semibold">
            <li><button onClick={() => handleNavClick('bestsellers')} className="hover:text-brand-white transition-colors">Bestsellers</button></li>
            <li><button onClick={() => handleNavClick('new-arrivals')} className="hover:text-brand-white transition-colors">New Arrivals</button></li>
            <li><button onClick={() => handleNavClick('categories')} className="hover:text-brand-white transition-colors">Sarees</button></li>
            <li><button onClick={() => handleNavClick('categories')} className="hover:text-brand-white transition-colors">Dresses</button></li>
            <li><button onClick={() => handleNavClick('categories')} className="hover:text-brand-white transition-colors">Ethnic Wear</button></li>
            <li><button onClick={() => handleNavClick('categories')} className="hover:text-brand-white transition-colors">Lehengas</button></li>
          </ul>
        </div>

        {/* Column: Numismatics */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold tracking-[0.2em] text-brand-gold">NUMISMATICS</h4>
          <ul className="space-y-2 text-[11px] tracking-widest text-brand-border/70 font-semibold">
            <li><button onClick={() => setPage('numismatics')} className="hover:text-brand-white transition-colors">Indian Coins</button></li>
            <li><button onClick={() => setPage('numismatics')} className="hover:text-brand-white transition-colors">Rare Coins</button></li>
            <li><button onClick={() => setPage('numismatics')} className="hover:text-brand-white transition-colors">Commemorative Coins</button></li>
            <li><button onClick={() => setPage('numismatics')} className="hover:text-brand-white transition-colors">Currency Notes</button></li>
            <li><button onClick={() => setPage('numismatics')} className="hover:text-brand-white transition-colors">Collector's Picks</button></li>
          </ul>
        </div>

        {/* Column: Support & Policies */}
        <div className="space-y-4 col-span-2 md:col-span-1">
          <h4 className="text-xs font-bold tracking-[0.2em] text-brand-border/40">CUSTOMER CARE</h4>
          <ul className="space-y-2 text-[11px] tracking-widest text-brand-border/70 font-semibold">
            <li><a href="#" className="hover:text-brand-white transition-colors">Track Your Order</a></li>
            <li><a href="#" className="hover:text-brand-white transition-colors">Shipping Info</a></li>
            <li><a href="#" className="hover:text-brand-white transition-colors">Cancellation & Refunds</a></li>
            <li><a href="#" className="hover:text-brand-white transition-colors">Returns & Exchanges</a></li>
            <li><a href="#" className="hover:text-brand-white transition-colors">Contact Support</a></li>
          </ul>
        </div>

      </div>

      {/* 3. Bottom Legal Footer */}
      <div className="max-w-6xl mx-auto border-t border-brand-white/10 pt-8 flex flex-col md:flex-row items-center justify-between text-[10px] tracking-[0.15em] text-brand-border/40 font-semibold gap-4">
        <span>© 2026 AADHYA. ALL RIGHTS RESERVED.</span>
        <div className="flex space-x-6">
          <a href="#" className="hover:text-brand-white transition-colors">PRIVACY POLICY</a>
          <a href="#" className="hover:text-brand-white transition-colors">TERMS & CONDITIONS</a>
          <a href="#" className="hover:text-brand-white transition-colors">REFUND POLICY</a>
          <a href="#" className="hover:text-brand-white transition-colors">SHIPPING POLICY</a>
        </div>
      </div>

    </footer>
  );
};
