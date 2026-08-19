"use client";

import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { ArrowRight, Instagram, Facebook, Youtube, Phone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Footer: React.FC = () => {
  const { setPage } = useApp();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({});
  const [numismaticsHovered, setNumismaticsHovered] = useState(false);

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
      id: 'shop',
      title: 'SHOP',
      links: [
        { name: 'Best Sellers', action: () => handleNavClick('bestsellers') },
        { name: 'New Arrivals', action: () => handleNavClick('new-arrivals') },
        { name: 'Sarees', action: () => handleNavClick('categories') },
        { name: 'Lehengas', action: () => handleNavClick('categories') },
        { name: 'Dresses', action: () => handleNavClick('categories') },
        { name: 'Bodycon & Partywear', action: () => handleNavClick('categories') },
        { name: 'Ethnic Wear', action: () => handleNavClick('categories') },
        { name: 'Blouses', action: () => handleNavClick('categories') },
        { name: 'All Collections', action: () => handleNavClick('categories') }
      ]
    },
    {
      id: 'support',
      title: 'CUSTOMER CARE',
      links: [
        { name: 'Track Your Order', href: '#' },
        { name: 'Shipping & Delivery', href: '#' },
        { name: 'Returns & Refunds', href: '#' },
        { name: 'Cancellation', href: '#' },
        { name: 'Contact Support', href: '#' },
        { name: 'Help Centre', href: '#' },
        { name: 'FAQs', href: '#' }
      ]
    },
    {
      id: 'about',
      title: 'AADHYA',
      links: [
        { name: 'About Us', action: () => handleNavClick('categories') },
        { name: 'Our Story', action: () => handleNavClick('categories') },
        { name: 'Contact Us', href: '#' },
        { name: 'Careers', href: '#' },
        { name: 'WhatsApp Support', href: 'https://wa.me/placeholder' }
      ]
    },
    {
      id: 'numismatics',
      title: 'NUMISMATICS',
      links: [
        { name: 'Explore Coins', action: () => setPage('numismatics') },
        { name: 'Indian Coins', action: () => setPage('numismatics') },
        { name: 'Rare Coins', action: () => setPage('numismatics') },
        { name: 'Banknotes', action: () => setPage('numismatics') },
        { name: 'Collections', action: () => setPage('numismatics') }
      ]
    }
  ];

  return (
    <footer className="mx-4 md:mx-10 bg-[#171311] text-[#FCFAF7] pt-12 pb-8 px-6 md:px-12 mt-20 relative overflow-hidden rounded-[4px] border border-brand-border/10 select-none">
      
      {/* 1. TOP FOOTER NAVIGATION (Clean minimal row) */}
      <div className="flex flex-col md:flex-row items-center justify-between border-b border-brand-border/10 pb-8 gap-6">
        <button
          onClick={() => setPage('home')}
          className="font-display text-lg font-bold tracking-[0.25em] text-[#FCFAF7] hover:opacity-85 transition-opacity"
        >
          AADHYA
        </button>

        <nav className="flex flex-wrap justify-center gap-6 text-[9px] font-bold tracking-[0.2em] text-[#FCFAF7]/80">
          <button onClick={() => handleNavClick('bestsellers')} className="hover:text-brand-white transition-colors">SHOP</button>
          <button onClick={() => handleNavClick('new-arrivals')} className="hover:text-brand-white transition-colors">NEW ARRIVALS</button>
          <button onClick={() => handleNavClick('bestsellers')} className="hover:text-brand-white transition-colors">BEST SELLERS</button>
          <button onClick={() => handleNavClick('categories')} className="hover:text-brand-white transition-colors">CATEGORIES</button>
          <button onClick={() => handleNavClick('categories')} className="hover:text-brand-white transition-colors">ABOUT US</button>
        </nav>

        {/* Highlighted Numismatics link */}
        <div 
          className="flex items-center space-x-2"
          onMouseEnter={() => setNumismaticsHovered(true)}
          onMouseLeave={() => setNumismaticsHovered(false)}
        >
          <button
            onClick={() => setPage('numismatics')}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-full border transition-all duration-300 text-[9px] font-extrabold tracking-widest ${
              numismaticsHovered 
                ? 'border-brand-gold/60 bg-brand-softBeige/10 text-brand-gold shadow shadow-brand-gold/15'
                : 'border-brand-border/20 text-[#FCFAF7]/80'
            }`}
          >
            {/* Spinning Coin */}
            <div className="w-3.5 h-3.5 rounded-full overflow-hidden border border-brand-gold/40 flex items-center justify-center bg-brand-gold">
              <motion.img
                src="/coin_image.jpg"
                alt="Coin"
                className="w-full h-full object-cover"
                animate={{ rotateY: 360 }}
                transition={{
                  repeat: Infinity,
                  duration: numismaticsHovered ? 1.5 : 5,
                  ease: 'linear',
                }}
              />
            </div>
            <span>NUMISMATICS →</span>
          </button>
        </div>
      </div>

      {/* 2. EDITORIAL INTRO COPY BLOCKS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-12 text-left items-center">
        <div className="space-y-2">
          <h3 className="text-xs font-bold tracking-[0.2em] text-[#FCFAF7]/50 uppercase">
            CRAFTED FOR YOUR EVERYDAY.
          </h3>
          <p className="text-[10px] text-brand-border/60 leading-relaxed font-semibold tracking-wider max-w-xs">
            Contemporary Indian fashion, timeless silhouettes, and carefully curated pieces made for every occasion.
          </p>
        </div>

        <div className="space-y-2">
          <h3 className="text-xs font-bold tracking-[0.2em] text-[#FCFAF7]/50 uppercase">
            COLLECT. WEAR. DISCOVER.
          </h3>
          <p className="text-[10px] text-brand-border/60 leading-relaxed font-semibold tracking-wider max-w-xs">
            Explore AADHYA's fashion collections and discover a curated world of Indian coins and numismatic treasures.
          </p>
        </div>

        {/* Circular editorial CTA */}
        <div className="flex justify-start md:justify-end">
          <motion.button
            whileHover={{ scale: 1.04 }}
            onClick={() => setPage('home')}
            className="w-24 h-24 rounded-full border border-brand-border/30 flex flex-col items-center justify-center text-center p-2 hover:border-[#FCFAF7] transition-colors"
          >
            <span className="text-[7px] font-bold tracking-[0.25em] block uppercase text-brand-gold">EXPLORE</span>
            <span className="font-serif font-black text-[9px] tracking-wider block text-[#FCFAF7] mt-0.5">AADHYA</span>
            <span className="text-[8px] mt-1 text-[#FCFAF7]/60">→</span>
          </motion.button>
        </div>
      </div>

      {/* 3. GIGANTIC BRAND TYPOGRAPHY HEADER */}
      <div className="w-full text-center relative pointer-events-none select-none z-10 overflow-hidden leading-none mt-4 mb-[-40px] md:mb-[-100px]">
        <motion.h2
          initial={{ opacity: 0, y: 70, scale: 0.96 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="font-serif font-black tracking-widest text-[#FCFAF7]/95 text-[18vw] uppercase leading-none block"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          AADHYA
        </motion.h2>
      </div>

      {/* 4. VISUAL CARDS ROW (Horizontal scroll rail on mobile, col-5 grid on desktop) */}
      <div className="w-full z-20 relative px-2 md:px-0">
        <div className="flex overflow-x-auto pb-4 gap-4 md:grid md:grid-cols-5 md:gap-5 md:pb-0 scrollbar-none snap-x snap-mandatory w-full scroll-smooth">
          {/* Card 1: Traditional Saree */}
          <motion.div 
            whileHover={{ scale: 1.03, y: -4 }}
            transition={{ duration: 0.4 }}
            className="flex-shrink-0 w-[180px] md:w-auto aspect-[3/4] rounded-t-full overflow-hidden bg-brand-espresso/25 border border-brand-border/10 shadow-sm relative group snap-start cursor-pointer"
          >
            <img 
              src="https://images.unsplash.com/photo-1610030470224-3467b4a47530?q=80&w=400&auto=format&fit=crop" 
              alt="Traditional Indian Saree" 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
            />
            <div className="absolute inset-0 bg-[#171311]/20 group-hover:bg-[#171311]/5 transition-all duration-300" />
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-center text-brand-white">
              <span className="text-[7px] font-bold tracking-widest uppercase bg-[#171311]/60 px-2 py-0.5 rounded">HERITAGE</span>
            </div>
          </motion.div>

          {/* Card 2: Lehenga */}
          <motion.div 
            whileHover={{ scale: 1.03, y: -4 }}
            transition={{ duration: 0.4 }}
            className="flex-shrink-0 w-[180px] md:w-auto aspect-[3/4] rounded-t-full overflow-hidden bg-brand-espresso/25 border border-brand-border/10 shadow-sm relative group snap-start cursor-pointer"
          >
            <img 
              src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=400&auto=format&fit=crop" 
              alt="Traditional Lehenga" 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
            />
            <div className="absolute inset-0 bg-[#171311]/20 group-hover:bg-[#171311]/5 transition-all duration-300" />
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-center text-brand-white">
              <span className="text-[7px] font-bold tracking-widest uppercase bg-[#171311]/60 px-2 py-0.5 rounded">ATELIER</span>
            </div>
          </motion.div>

          {/* Card 3: Central Circular Text Card */}
          <div className="flex-shrink-0 w-[180px] md:w-auto aspect-[3/4] flex items-center justify-center snap-start select-none">
            <motion.div 
              whileHover={{ scale: 1.04 }}
              className="w-32 h-32 rounded-full bg-[#F4511E] border border-[#F4511E] flex flex-col items-center justify-center p-3 text-brand-white shadow-lg text-center"
            >
              <span className="text-[8px] font-extrabold tracking-[0.2em] block opacity-85">EDIT</span>
              <p className="font-serif font-black text-[11px] tracking-wider leading-snug uppercase mt-1 text-[#FCFAF7]">
                WEAR<br />YOUR<br />STORY.
              </p>
            </motion.div>
          </div>

          {/* Card 4: Numismatics Coin Card */}
          <motion.div 
            whileHover={{ scale: 1.03, y: -4 }}
            onClick={() => setPage('numismatics')}
            className="flex-shrink-0 w-[180px] md:w-auto aspect-[3/4] rounded-t-full bg-brand-softBeige/5 border border-brand-border/15 shadow-sm relative snap-start flex flex-col items-center justify-center p-4 cursor-pointer hover:bg-brand-softBeige/10 transition-all duration-300"
          >
            {/* Spinning Coin */}
            <div className="relative w-20 h-20 rounded-full overflow-hidden border border-brand-gold shadow-lg flex items-center justify-center bg-brand-espresso">
              <motion.img
                src="/coin_image.jpg"
                alt="Rotating Coin"
                className="w-full h-full object-cover"
                animate={{ rotateY: 360 }}
                transition={{
                  repeat: Infinity,
                  duration: 10,
                  ease: 'linear',
                }}
              />
            </div>
            <div className="mt-4 text-center">
              <span className="text-[8px] font-bold text-brand-gold tracking-[0.2em] uppercase block">NUMISMATICS</span>
              <span className="text-[7px] text-[#FCFAF7]/50 tracking-wider font-semibold block mt-0.5">Explore Heritage</span>
            </div>
          </motion.div>

          {/* Card 5: Contemporary Drape */}
          <motion.div 
            whileHover={{ scale: 1.03, y: -4 }}
            transition={{ duration: 0.4 }}
            className="flex-shrink-0 w-[180px] md:w-auto aspect-[3/4] rounded-t-full overflow-hidden bg-brand-espresso/25 border border-brand-border/10 shadow-sm relative group snap-start cursor-pointer"
          >
            <img 
              src="https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=400&auto=format&fit=crop" 
              alt="Contemporary Indian Fashion" 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
            />
            <div className="absolute inset-0 bg-[#171311]/20 group-hover:bg-[#171311]/5 transition-all duration-300" />
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-center text-brand-white">
              <span className="text-[7px] font-bold tracking-widest uppercase bg-[#171311]/60 px-2 py-0.5 rounded">TIMELESS</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* 5. FUNCTIONAL FOOTER NAVIGATION LINK GRID (With Mobile Accordion integration) */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-6 md:gap-8 border-t border-brand-border/10 pt-16 pb-12 mt-12">
        {linkSections.map((section) => {
          const isOpen = openSections[section.id];
          return (
            <div key={section.id} className="space-y-3 text-left border-b border-brand-border/10 pb-3 md:border-b-0 md:pb-0">
              <button
                onClick={() => isMobile && toggleSection(section.id)}
                className="w-full flex items-center justify-between focus:outline-none md:cursor-default"
              >
                <h4 className="text-[10px] font-bold tracking-[0.2em] text-[#FCFAF7] uppercase">
                  {section.title}
                </h4>
                {isMobile && (
                  <span className="text-[#FCFAF7]/50 text-xs font-bold transition-transform duration-300" style={{ transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)' }}>
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
                    className="space-y-2 text-[10px] tracking-widest text-[#FCFAF7]/60 font-semibold overflow-hidden mt-2"
                  >
                    {section.links.map((link) => (
                      <li key={link.name}>
                        {link.action ? (
                          <button onClick={link.action} className="hover:text-brand-white transition-colors text-left">
                            {link.name}
                          </button>
                        ) : (
                          <a href={link.href} className="hover:text-brand-white transition-colors">
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

        {/* 6. PREMIUM NEWSLETTER BLOCK */}
        <div className="space-y-4 text-left pt-4 md:pt-0">
          <span className="text-[9px] text-[#FCFAF7]/50 font-bold tracking-[0.2em] uppercase block">
            STAY IN THE AADHYA WORLD
          </span>
          <p className="text-[10px] text-brand-border/60 font-semibold leading-relaxed tracking-wider max-w-xs">
            New collections, exclusive edits, and stories delivered directly to your inbox.
          </p>
          <form onSubmit={handleSubscribe} className="relative flex items-center border-b border-brand-border/30 py-2 max-w-xs">
            <input
              type="email"
              placeholder="Enter your email address"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-transparent outline-none text-[#FCFAF7] text-xs placeholder-brand-warmGray/60 tracking-wider pr-12 focus:ring-0"
            />
            <button
              type="submit"
              className="absolute right-0 text-brand-gold hover:text-brand-white transition-colors text-[9px] font-extrabold tracking-widest uppercase"
            >
              SUBSCRIBE
            </button>
          </form>
          {subscribed && (
            <p className="text-[9px] text-brand-success font-bold tracking-wider mt-1.5">
              ✓ Added successfully to our mailing digest.
            </p>
          )}
        </div>
      </div>

      {/* 7. CONTACT & SOCIAL CHANNELS */}
      <div className="max-w-6xl mx-auto border-t border-brand-border/10 pt-8 pb-4 flex flex-col sm:flex-row items-center justify-between gap-6 select-none">
        {/* Placeholder contacts */}
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 text-[9px] text-brand-border/50 font-bold tracking-wider">
          <span>EMAIL: support@aadhya.co</span>
          <span>PHONE: +91 98765 43210</span>
          <span>WHATSAPP SUPPORT: ONLINE</span>
        </div>

        {/* Minimal Social icons */}
        <div className="flex items-center space-x-5 text-brand-border/50">
          <a href="#" aria-label="Instagram" className="hover:text-brand-white hover:-translate-y-0.5 transition-all">
            <Instagram className="w-4 h-4" />
          </a>
          <a href="#" aria-label="Facebook" className="hover:text-brand-white hover:-translate-y-0.5 transition-all">
            <Facebook className="w-4 h-4" />
          </a>
          <a href="#" aria-label="YouTube" className="hover:text-brand-white hover:-translate-y-0.5 transition-all">
            <Youtube className="w-4 h-4" />
          </a>
          <a href="#" aria-label="WhatsApp" className="hover:text-brand-white hover:-translate-y-0.5 transition-all">
            <Phone className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* 8. FINAL LEGAL COPYRIGHT AREA */}
      <div className="max-w-6xl mx-auto border-t border-brand-border/10 pt-6 flex flex-col sm:flex-row items-center justify-between text-[9px] tracking-[0.15em] text-[#FCFAF7]/30 font-semibold gap-4">
        <span>© 2026 AADHYA. ALL RIGHTS RESERVED.</span>
        <div className="flex space-x-4">
          <a href="#" className="hover:text-brand-white transition-colors">PRIVACY POLICY</a>
          <a href="#" className="hover:text-brand-white transition-colors">TERMS OF USE</a>
        </div>
        <span className="text-[#FCFAF7]/20">MADE WITH INTENTION.</span>
      </div>

    </footer>
  );
};
