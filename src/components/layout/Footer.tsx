"use client";

import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Instagram, 
  Facebook, 
  Youtube, 
  Phone, 
  Twitter, 
  Linkedin,
  Disc,
  Sparkles,
  Shirt
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Footer: React.FC = () => {
  const { setPage } = useApp();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({});

  // Monitor viewport size to toggle mobile accordions
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 4000);
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

  const linkSections = [
    {
      id: 'product',
      title: 'Product',
      links: [
        { name: 'Sarees', action: () => handleNavClick('categories') },
        { name: 'Lehengas', action: () => handleNavClick('categories') },
        { name: 'Dresses', action: () => handleNavClick('categories') },
        { name: 'Ethnic Wear', action: () => handleNavClick('categories') },
        { name: 'Blouses', action: () => handleNavClick('categories') },
        { name: 'All Collections', action: () => handleNavClick('categories') }
      ]
    },
    {
      id: 'company',
      title: 'Company',
      links: [
        { name: 'About Us', action: () => handleNavClick('categories') },
        { name: 'Our Story', action: () => handleNavClick('categories') },
        { name: 'Press & Media', href: '#' },
        { name: 'Careers', href: '#' },
        { name: 'Sustainability', href: '#' }
      ]
    },
    {
      id: 'resources',
      title: 'Resources',
      links: [
        { name: 'Coin Care Guide', href: '#' },
        { name: 'Collector Resources', href: '#' },
        { name: 'Fashion Edits', href: '#' },
        { name: 'Size Charts', href: '#' },
        { name: 'FAQs', href: '#' }
      ]
    },
    {
      id: 'social',
      title: 'Social',
      links: [
        { name: 'Instagram', href: '#' },
        { name: 'Facebook', href: '#' },
        { name: 'YouTube', href: '#' },
        { name: 'LinkedIn', href: '#' }
      ]
    },
    {
      id: 'legal',
      title: 'Legal',
      links: [
        { name: 'Terms of Use', href: '#' },
        { name: 'Privacy Policy', href: '#' },
        { name: 'Cookies Guide', href: '#' },
        { name: 'Refund Policy', href: '#' },
        { name: 'Shipping Policy', href: '#' }
      ]
    }
  ];

  return (
    <footer className="w-full bg-[#DE7A8C] text-[#47271B] pt-12 pb-6 px-4 md:px-12 lg:px-24 mt-20 relative overflow-hidden select-none">
      
      {/* Top Section (2 Columns: Left details, Right scalloped cream block) */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch relative z-20">
        
        {/* Left Side: Brand, Tagline, Socials, Payments (5 cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between py-6 text-left space-y-6">
          <div className="space-y-4">
            {/* Elegant Cloud-Coin Hug Logo */}
            <div className="flex items-center space-x-2">
              <div className="w-12 h-12 rounded-full border-2 border-[#FCF5E5] bg-[#DE7A8C] flex items-center justify-center shadow-md relative overflow-hidden">
                <div className="absolute inset-1.5 rounded-full border border-dashed border-[#FCF5E5]/60" />
                <Disc className="w-6 h-6 text-[#FCF5E5] animate-spin-slow" />
              </div>
              <span className="font-display text-2xl font-black tracking-widest text-[#FCF5E5]">
                AADHYA
              </span>
            </div>

            {/* Tagline */}
            <p className="font-display font-bold text-lg md:text-xl leading-snug text-[#FCF5E5] max-w-sm">
              " Where Heritage Meets Contemporary Women's Fashion "
            </p>
          </div>

          {/* Social Icons inside circled outline boxes */}
          <div className="space-y-3">
            <div className="flex space-x-3.5">
              {[
                { icon: Twitter, href: "#" },
                { icon: Instagram, href: "#" },
                { icon: Facebook, href: "#" },
                { icon: Phone, href: "#" },
                { icon: Linkedin, href: "#" }
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <a
                    key={idx}
                    href={item.href}
                    className="w-8 h-8 rounded-full border border-[#FCF5E5] bg-[#DE7A8C] text-[#FCF5E5] flex items-center justify-center hover:bg-[#FCF5E5] hover:text-[#DE7A8C] transition-all shadow-sm"
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </a>
                );
              })}
            </div>
            
            <div className="pt-2">
              <span className="text-[9px] font-extrabold text-[#FCF5E5]/60 tracking-wider block uppercase">
                100% Safe & Secure payments
              </span>
              {/* Payment badges row */}
              <div className="flex flex-wrap gap-1.5 mt-1.5 opacity-85">
                {['GPay', 'PayPal', 'ApplePay', 'Visa', 'MasterCard', 'Amex'].map((badge) => (
                  <span key={badge} className="px-1.5 py-0.5 rounded bg-[#FCF5E5] text-[#47271B] text-[8px] font-extrabold tracking-wider border border-[#47271B]/10">
                    {badge}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Cream scalloped container containing directories (7 cols) */}
        <div className="lg:col-span-7 bg-[#FCF5E5] rounded-[32px] p-6 sm:p-8 lg:p-12 relative shadow-lg overflow-hidden border border-[#47271B]/5">
          
          {/* Dynamic Scalloped Edge Half-Circles on Left (Visible only on desktop viewports) */}
          <div className="hidden lg:flex absolute top-0 bottom-0 left-0 w-3 -translate-x-1/2 flex-col justify-between py-3 overflow-hidden pointer-events-none">
            {Array(16).fill(0).map((_, i) => (
              <div key={i} className="w-6 h-6 rounded-full bg-[#DE7A8C] -translate-x-1/2" />
            ))}
          </div>

          {/* Directory Links grid with mobile accordions */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 md:gap-6 text-left">
            {linkSections.map((section) => {
              const isOpen = openSections[section.id];
              return (
                <div key={section.id} className="space-y-2 border-b border-[#47271B]/10 pb-2 md:border-none md:pb-0">
                  <button
                    onClick={() => isMobile && toggleSection(section.id)}
                    className="w-full flex items-center justify-between focus:outline-none md:cursor-default"
                  >
                    <h4 className="text-[11px] font-extrabold tracking-wider text-[#47271B] uppercase">
                      {section.title}
                    </h4>
                    {isMobile && (
                      <span className="text-[#47271B]/60 text-[9px] transition-transform duration-300" style={{ transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)' }}>
                        →
                      </span>
                    )}
                  </button>

                  <AnimatePresence initial={false}>
                    {(isOpen || !isMobile) && (
                      <motion.ul
                        initial={isMobile ? { height: 0, opacity: 0 } : undefined}
                        animate={isMobile ? { height: "auto", opacity: 1 } : undefined}
                        exit={isMobile ? { height: 0, opacity: 0 } : undefined}
                        transition={{ duration: 0.3 }}
                        className="space-y-1.5 text-[10px] tracking-wide text-[#47271B]/75 font-semibold overflow-hidden mt-1.5"
                      >
                        {section.links.map((link) => (
                          <li key={link.name}>
                            {link.action ? (
                              <button onClick={link.action} className="hover:text-[#DE7A8C] transition-colors text-left">
                                {link.name}
                              </button>
                            ) : (
                              <a href={link.href} className="hover:text-[#DE7A8C] transition-colors">
                                {link.name}
                              </a>
                            )}
                          </li>
                        ))}
                      </motion.ul>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Bottom Block containing copyright & Giant Outlined brand logotype */}
      <div className="max-w-7xl mx-auto mt-12 border-t border-[#FCF5E5]/20 pt-8 relative overflow-hidden select-none">
        
        {/* Copyright info */}
        <div className="text-center text-[9px] font-bold tracking-widest text-[#FCF5E5]/80 uppercase z-20 relative">
          © 2026 Aadhya. All rights reserved.
        </div>

        {/* 
          Giant Outlined Cursive Wordmark (displays concisely and fully fitted on mobile viewport 
          without overlays or overflowing limits) 
        */}
        <div className="w-full text-center relative pointer-events-none mt-2 select-none overflow-hidden h-[120px] sm:h-[180px] lg:h-[240px] flex items-center justify-center">
          
          {/* Overlapping fashion/coin vector doodles */}
          <div className="absolute inset-0 z-10 flex items-center justify-between px-6 pointer-events-none">
            <Shirt className="w-6 h-6 sm:w-10 sm:h-10 text-[#FCFAF7]/30 transform -rotate-12 translate-y-6" />
            <Disc className="w-8 h-8 sm:w-12 sm:h-12 text-[#FCFAF7]/30 animate-spin-slow -translate-y-4" />
            <Sparkles className="w-6 h-6 sm:w-10 sm:h-10 text-[#FCFAF7]/30 transform rotate-12 translate-y-2" />
          </div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="font-black tracking-normal text-[#47271B] leading-none block select-none uppercase"
            style={{ 
              fontFamily: "'Pacifico', cursive",
              fontSize: 'clamp(3rem, 14vw, 11rem)',
              textTransform: 'lowercase',
              textShadow: `
                -3px -3px 0 #FCF5E5,
                 3px -3px 0 #FCF5E5,
                -3px  3px 0 #FCF5E5,
                 3px  3px 0 #FCF5E5,
                -5px -5px 0 #FCF5E5,
                 5px -5px 0 #FCF5E5,
                -5px  5px 0 #FCF5E5,
                 5px  5px 0 #FCF5E5
              `
            }}
          >
            aadhya
          </motion.h2>
        </div>

      </div>

    </footer>
  );
};

export default Footer;
