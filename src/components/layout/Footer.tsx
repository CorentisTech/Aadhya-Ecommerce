"use client";

import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Instagram, 
  Facebook, 
  Twitter, 
  Linkedin,
  Disc,
  Truck,
  RotateCcw,
  ShieldCheck,
  Lock
} from 'lucide-react';
import { motion } from 'framer-motion';

export const Footer: React.FC = () => {
  const { setPage } = useApp();

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
    <footer className="w-full bg-[#121110] text-[#FCFAF7] pt-16 pb-24 md:pb-12 px-6 md:px-12 lg:px-24 mt-20 relative overflow-hidden select-none">
      
      {/* Top Section: Brand description and Directory columns */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12 mb-16 text-left relative z-20">
        
        {/* Column 1: Brand & Logo Details (takes 2 col spaces on desktop) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="space-y-4">
            <h2 className="font-display text-2xl md:text-3xl font-bold tracking-[0.25em] text-white">
              AADHYA
            </h2>
            <p className="text-xs md:text-sm text-white/70 leading-relaxed font-light max-w-sm">
              Inspiring modern luxury through bespoke Indian ethnic silhouettes, refined Western couture, and authenticated historical numismatics.
            </p>
          </div>

          {/* Social Links inside circled outline boxes */}
          <div className="flex space-x-3">
            {[
              { icon: Twitter, href: "#" },
              { icon: Instagram, href: "#" },
              { icon: Facebook, href: "#" },
              { icon: Linkedin, href: "#" }
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <a
                  key={idx}
                  href={item.href}
                  className="w-8 h-8 rounded-full border border-white/20 text-white/80 flex items-center justify-center hover:bg-white hover:text-[#121110] hover:border-white transition-all duration-300 shadow-sm"
                  aria-label="Social Link"
                >
                  <Icon className="w-3.5 h-3.5" />
                </a>
              );
            })}
          </div>
        </div>

        {/* Column 2: Policies & Care Links */}
        <div className="space-y-4">
          <h4 className="text-[10px] md:text-[11px] font-bold tracking-[0.2em] text-[#F26A2E] uppercase">
            POLICIES & CARE
          </h4>
          <ul className="space-y-2.5 text-xs text-white/60 font-light tracking-wide">
            <li><a href="#" className="hover:text-white transition-colors duration-300">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-white transition-colors duration-300">Terms & Conditions</a></li>
            <li><a href="#" className="hover:text-white transition-colors duration-300">Track Order</a></li>
            <li><a href="#" className="hover:text-white transition-colors duration-300">Cancellation & Refund</a></li>
          </ul>
        </div>

        {/* Column 3: Categories Links */}
        <div className="space-y-4">
          <h4 className="text-[10px] md:text-[11px] font-bold tracking-[0.2em] text-[#F26A2E] uppercase">
            CATEGORIES
          </h4>
          <ul className="space-y-2.5 text-xs text-white/60 font-light tracking-wide">
            <li><button onClick={() => handleNavClick('categories')} className="hover:text-white transition-colors duration-300 text-left">Western Couture</button></li>
            <li><button onClick={() => handleNavClick('categories')} className="hover:text-white transition-colors duration-300 text-left">Indian Ethnic</button></li>
            <li><button onClick={() => handleNavClick('categories')} className="hover:text-white transition-colors duration-300 text-left">Festive Ensembles</button></li>
            <li><button onClick={() => handleNavClick('categories')} className="hover:text-white transition-colors duration-300 text-left">Handcrafted Blouses</button></li>
          </ul>
        </div>

        {/* Column 4: Numismatics Links */}
        <div className="space-y-4">
          <h4 className="text-[10px] md:text-[11px] font-bold tracking-[0.2em] text-[#F26A2E] uppercase">
            THE HERITAGE VAULT
          </h4>
          <ul className="space-y-2.5 text-xs text-white/60 font-light tracking-wide">
            <li><button onClick={() => setPage('numismatics')} className="hover:text-white transition-colors duration-300 text-left">Antique British India Coins</button></li>
            <li><button onClick={() => setPage('numismatics')} className="hover:text-white transition-colors duration-300 text-left">Historical Banknotes</button></li>
            <li><a href="#" className="hover:text-white transition-colors duration-300">COA Authenticity Guarantee</a></li>
            <li><a href="#" className="hover:text-white transition-colors duration-300">Insured Courier Dispatch</a></li>
          </ul>
        </div>

      </div>

      {/* Middle Card Section: Aadhya Assurance Box Card */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-7xl mx-auto bg-white text-brand-espresso rounded-3xl p-6 md:p-10 shadow-2xl mb-16 relative overflow-hidden border border-brand-border/20 z-20"
      >
        
        {/* Assurance Card Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-brand-border/40 pb-6 mb-8 text-left">
          <div className="flex items-center space-x-2">
            <h3 className="font-display italic text-2xl md:text-3xl text-brand-espresso tracking-tight select-none lowercase" style={{ fontFamily: "'Pacifico', cursive" }}>
              aadhya™ assurance
            </h3>
          </div>
          <button 
            onClick={() => setPage('home')}
            className="px-6 py-2.5 bg-[#F26A2E] text-white text-[10px] md:text-xs font-bold tracking-widest uppercase rounded-full hover:bg-[#F26A2E]/90 transition-colors shadow-sm"
          >
            CONTINUE SHOPPING
          </button>
        </div>

        {/* Assurance Grid (4 Column cards) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-left">
          
          {/* Card 1 */}
          <div className="space-y-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#FFF3EC] border border-[#F9E1D3] flex items-center justify-center text-[#F26A2E] shadow-sm">
              <Truck className="w-5 h-5 stroke-[1.75]" />
            </div>
            <h4 className="font-sans font-bold text-xs md:text-sm text-brand-espresso tracking-wider uppercase">
              Track Your Order
            </h4>
            <p className="text-[11px] md:text-xs text-brand-warmGray leading-relaxed font-medium">
              Real-time courier updates with dedicated tracking IDs for apparel and vault items.
            </p>
          </div>

          {/* Card 2 */}
          <div className="space-y-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#FFF3EC] border border-[#F9E1D3] flex items-center justify-center text-[#F26A2E] shadow-sm">
              <RotateCcw className="w-5 h-5 stroke-[1.75]" />
            </div>
            <h4 className="font-sans font-bold text-xs md:text-sm text-brand-espresso tracking-wider uppercase">
              Cancellation & Refund
            </h4>
            <p className="text-[11px] md:text-xs text-brand-warmGray leading-relaxed font-medium">
              Hassle-free 7-day doorstep return policy and secure payment reversals.
            </p>
          </div>

          {/* Card 3 */}
          <div className="space-y-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#FFF3EC] border border-[#F9E1D3] flex items-center justify-center text-[#F26A2E] shadow-sm">
              <ShieldCheck className="w-5 h-5 stroke-[1.75]" />
            </div>
            <h4 className="font-sans font-bold text-xs md:text-sm text-brand-espresso tracking-wider uppercase">
              Terms & Conditions
            </h4>
            <p className="text-[11px] md:text-xs text-brand-warmGray leading-relaxed font-medium">
              Transparent purchase agreements and legal protection on all transactions.
            </p>
          </div>

          {/* Card 4 */}
          <div className="space-y-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#FFF3EC] border border-[#F9E1D3] flex items-center justify-center text-[#F26A2E] shadow-sm">
              <Lock className="w-5 h-5 stroke-[1.75]" />
            </div>
            <h4 className="font-sans font-bold text-xs md:text-sm text-brand-espresso tracking-wider uppercase">
              Privacy Policy
            </h4>
            <p className="text-[11px] md:text-xs text-brand-warmGray leading-relaxed font-medium">
              Enterprise-grade 256-bit SSL encryption safeguarding your personal data.
            </p>
          </div>

        </div>

        {/* Customer Concierge Banner */}
        <div className="text-center text-[10px] md:text-xs text-brand-warmGray tracking-wider font-semibold border-t border-brand-border/40 pt-6 mt-8">
          Dedicated Customer Concierge available Monday – Saturday (10:00 AM – 7:00 PM IST)
        </div>

      </motion.div>

      {/* Bottom Footer Section: Copyright & unified info separated by thin border */}
      <div className="max-w-7xl mx-auto border-t border-white/10 pt-8 relative z-20">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] md:text-xs font-bold tracking-widest text-white/50 uppercase">
          <div>
            © 2026 Aadhya Studios Ltd. All rights reserved.
          </div>
          <div>
            Unified Indian Couture & Numismatic Platform
          </div>
        </div>
      </div>

    </footer>
  );
};

export default Footer;
