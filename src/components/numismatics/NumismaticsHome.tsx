"use client";

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { PRODUCTS, CATEGORIES, Product, REVIEWS } from '@/data/mockData';
import { ProductVisual } from '../ui/ProductVisual';
import { 
  Heart, 
  ShoppingBag, 
  Sparkles, 
  Filter, 
  Info, 
  ArrowRight, 
  ChevronLeft, 
  ChevronRight, 
  ShieldCheck, 
  Award, 
  Truck, 
  Star,
  SlidersHorizontal,
  X,
  Play
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { NavigationControls } from '../ui/NavigationControls';

export const NumismaticsHome: React.FC = () => {
  const router = useRouter();
  const { toggleWishlist, isInWishlist, addToCart } = useApp();

  // Numismatic Products source of truth
  const numProducts = PRODUCTS.filter((p) => p.department === 'numismatics');

  // --------------------------------------------------
  // 1. HERO BEST SELLER SHOWCASE STATE (Matching Reference Image)
  // --------------------------------------------------
  const [heroActiveIndex, setHeroActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // 4 Featured Hero Coins (Card Colors matching Reference Image)
  const heroFeaturedCoins = [
    {
      product: numProducts[4] || numProducts[0], // Mughal Shah Alam II Rupee
      cardGradient: 'from-[#F28B82] to-[#E56B6F]', // Rose / Peach-Red Card
      categoryLabel: 'Mughal Empire',
      discountBadge: '20% Off'
    },
    {
      product: numProducts[0] || numProducts[0], // 1954 Republic One Rupee
      cardGradient: 'from-[#FBA858] to-[#EF8A24]', // Warm Amber / Orange Card
      categoryLabel: 'Republic India',
      discountBadge: 'Rare Issue'
    },
    {
      product: numProducts[2] || numProducts[1], // British India 100 Rupee Note
      cardGradient: 'from-[#7CD585] to-[#55B75F]', // Sage / Leaf Green Card
      categoryLabel: 'Paper Currency',
      discountBadge: 'Uncirculated'
    },
    {
      product: numProducts[3] || numProducts[2], // Queen Victoria Two Annas
      cardGradient: 'from-[#7B73F0] to-[#584FE3]', // Rich Violet / Indigo Card
      categoryLabel: 'British India',
      discountBadge: '100% Certified'
    }
  ];

  const currentHeroItem = heroFeaturedCoins[heroActiveIndex] || heroFeaturedCoins[0];
  const activeHeroProduct = currentHeroItem.product;

  // Auto rotation every 5.5s
  useEffect(() => {
    if (isPaused || heroFeaturedCoins.length === 0) return;
    const timer = setInterval(() => {
      setHeroActiveIndex((prev) => (prev + 1) % heroFeaturedCoins.length);
    }, 5500);
    return () => clearInterval(timer);
  }, [isPaused, heroFeaturedCoins.length]);

  const handlePrevHero = () => {
    setIsPaused(true);
    setHeroActiveIndex((prev) => (prev - 1 + heroFeaturedCoins.length) % heroFeaturedCoins.length);
    setTimeout(() => setIsPaused(false), 4500);
  };

  const handleNextHero = () => {
    setIsPaused(true);
    setHeroActiveIndex((prev) => (prev + 1) % heroFeaturedCoins.length);
    setTimeout(() => setIsPaused(false), 4500);
  };

  // --------------------------------------------------
  // 2. EXPLORE PRODUCTS GRID & FILTERS
  // --------------------------------------------------
  const [selectedPillCategory, setSelectedPillCategory] = useState<string>('all');
  const [selectedMaterialFilter, setSelectedMaterialFilter] = useState<string>('all');
  const [selectedRarityFilter, setSelectedRarityFilter] = useState<string>('all');
  const [priceMaxFilter, setPriceMaxFilter] = useState<number>(30000);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  const exploreCategoryPills = [
    { id: 'all', label: 'All' },
    { id: 'coins', label: 'Coins' },
    { id: 'notes', label: 'Notes' },
    { id: 'rare-coins', label: 'Rare Coins' },
    { id: 'british-india', label: 'British India' },
    { id: 'republic-india', label: 'Republic India' },
    { id: 'commemorative', label: 'Commemorative' },
  ];

  const filteredExploreProducts = numProducts.filter((product) => {
    const matchesCategory =
      selectedPillCategory === 'all' ||
      product.category.toLowerCase().includes(selectedPillCategory.toLowerCase()) ||
      (selectedPillCategory === 'coins' && product.visualType === 'coin') ||
      (selectedPillCategory === 'notes' && product.visualType === 'note') ||
      (selectedPillCategory === 'british-india' && product.era === 'British India') ||
      (selectedPillCategory === 'republic-india' && product.era === 'Republic India');

    const matchesMat =
      selectedMaterialFilter === 'all' || product.material?.toLowerCase() === selectedMaterialFilter.toLowerCase();

    const matchesRarity =
      selectedRarityFilter === 'all' || product.rarity?.toLowerCase() === selectedRarityFilter.toLowerCase();

    const matchesPrice = product.price <= priceMaxFilter;

    return matchesCategory && matchesMat && matchesRarity && matchesPrice;
  });

  // --------------------------------------------------
  // 3. REVIEWS SLIDER CAROUSEL STATE (Glassmorphic)
  // --------------------------------------------------
  const numismaticReviews = REVIEWS.filter((r) => r.productName.toLowerCase().includes('rupee') || r.rating === 5);
  const [activeReviewIndex, setActiveReviewIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveReviewIndex((prev) => (prev + 1) % numismaticReviews.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [numismaticReviews.length]);

  return (
    <div className="w-full max-w-full min-h-screen bg-[#FDF9F3] text-brand-espresso select-none overflow-x-hidden">
      
      {/* Top Header Navigation */}
      <div className="max-w-7xl mx-auto px-4 md:px-12 pt-4">
        <NavigationControls className="justify-start border-b border-[#EFE8DC] pb-3" />
      </div>

      {/* ==================================================
          1. HERO SECTION — EXACT REFERENCE COMPOSITION (Matching Reference Image)
         ================================================== */}
      <section 
        className="w-full pt-10 pb-16 px-4 md:px-12 lg:px-20 bg-[#FDF9F3] relative overflow-hidden"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Soft Ambient Background Elements */}
        <div className="absolute top-10 right-10 w-[500px] h-[500px] rounded-full bg-[#FCEFE0]/60 blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-4 w-72 h-72 rounded-full bg-[#FFF5EA]/80 blur-2xl pointer-events-none" />

        <div className="max-w-7xl mx-auto space-y-12 relative z-10">
          
          {/* TOP SPLIT: Left Headline & CTA + Right Large Hero Coin */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Content Area (6 cols) */}
            <div className="lg:col-span-6 space-y-6 text-left flex flex-col justify-center pr-0 lg:pr-6">
              
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeHeroProduct.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-4"
                >
                  {/* Catchy 2-Tone Headline (Matching Reference Image Style) */}
                  <h1 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl text-[#2B231D] tracking-tight leading-[1.12]">
                    Rare Coinage <span className="text-[#2B231D]">is</span> <br />
                    <span className="text-[#E0591D]">an Important Part</span> <br />
                    <span className="text-[#2B231D]">of Heritage</span>
                  </h1>

                  {/* Subtitle */}
                  <p className="text-xs sm:text-sm text-[#7D736A] font-medium leading-relaxed max-w-md pt-1">
                    We curate authentic historical coins and collectible banknotes with verified provenance for discerning collectors.
                  </p>

                  {/* Dual Action Buttons: Explore Now + Play Video/Story */}
                  <div className="flex flex-wrap items-center gap-5 pt-3">
                    <button
                      onClick={() => {
                        const el = document.getElementById('explore-products');
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="px-8 py-3.5 bg-[#E0591D] hover:bg-[#C84B15] text-white font-extrabold text-xs tracking-wider rounded-full transition-all shadow-md shadow-[#E0591D]/25"
                    >
                      Explore Now
                    </button>

                    <button
                      onClick={() => router.push(`/product/${activeHeroProduct.name.toLowerCase().replace(/ /g, '-')}`)}
                      className="flex items-center gap-3 text-xs font-extrabold text-[#2B231D] hover:text-[#E0591D] transition-colors group"
                    >
                      <div className="w-10 h-10 rounded-full bg-[#2B231D] text-white flex items-center justify-center group-hover:bg-[#E0591D] transition-colors shadow-sm">
                        <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                      </div>
                      <span>Collector Story</span>
                    </button>
                  </div>

                </motion.div>
              </AnimatePresence>

            </div>

            {/* Right Large Hero Coin Visual (6 cols) (Matching Reference Image Style) */}
            <div className="lg:col-span-6 relative flex items-center justify-center lg:justify-end">
              
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeHeroProduct.id}
                  initial={{ scale: 0.92, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.92, opacity: 0 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="relative flex items-center justify-center"
                >
                  {/* Scalloped Badge on Top-Right (Matching the '20% Off' Green Scalloped Badge in Reference Image) */}
                  <div className="absolute -top-3 -right-2 sm:-right-4 z-30 w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#85A947] text-white flex flex-col items-center justify-center shadow-lg font-display font-extrabold rotate-12">
                    <span className="text-[11px] sm:text-xs font-black tracking-wider leading-none">
                      {currentHeroItem.discountBadge}
                    </span>
                    <span className="text-[8px] tracking-tight opacity-90">100% Genuine</span>
                  </div>

                  {/* Main Circular Coin Presentation Stage */}
                  <div 
                    onClick={() => router.push(`/product/${activeHeroProduct.name.toLowerCase().replace(/ /g, '-')}`)}
                    className="w-[280px] sm:w-[380px] h-[280px] sm:h-[380px] rounded-full bg-[#FFFDFB] border-8 border-white p-6 sm:p-8 shadow-2xl flex items-center justify-center cursor-pointer group relative overflow-hidden"
                  >
                    {activeHeroProduct.visualType === 'note' ? (
                      <img 
                        src={activeHeroProduct.image} 
                        alt={activeHeroProduct.name} 
                        className="w-full h-auto object-contain rounded-lg shadow-md group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-56 h-56 sm:w-72 sm:h-72 flex items-center justify-center">
                        <ProductVisual 
                          type="coin"
                          color={activeHeroProduct.visualColor || '#B89A67'}
                          pattern={activeHeroProduct.visualPattern || 'antique-metallic'}
                          isRotating={false}
                        />
                      </div>
                    )}
                  </div>

                  {/* Floating Glassmorphic Provenance Badge (Bottom-Left) */}
                  <div className="absolute -bottom-4 -left-4 sm:-left-8 z-30 bg-white/95 backdrop-blur-md border border-[#EFE8DC] rounded-2xl p-3.5 shadow-xl flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#FFF3EC] flex items-center justify-center text-[#E0591D] flex-shrink-0">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div className="text-left pr-2">
                      <span className="text-[11px] font-extrabold text-[#2B231D] block leading-tight">Verified Provenance</span>
                      <span className="text-[9px] text-[#7D736A] font-semibold">Historic Silver Specimen</span>
                    </div>
                  </div>

                </motion.div>
              </AnimatePresence>

            </div>

          </div>

          {/* LOWER HERO CAROUSEL: Floating White Container with 4 Vibrant Cards (Matching Reference Image) */}
          <div className="relative max-w-5xl mx-auto bg-white rounded-[32px] sm:rounded-[44px] p-6 sm:p-8 shadow-xl shadow-black/5 border border-[#F0EAE1]">
            
            {/* Outer Left Circular Navigation Button */}
            <button
              onClick={handlePrevHero}
              className="absolute -left-4 sm:-left-6 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white border border-[#EAE2D5] shadow-lg flex items-center justify-center text-[#2B231D] hover:bg-[#FAF3E8] transition-all z-30"
              aria-label="Previous Coin"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Outer Right Circular Navigation Button */}
            <button
              onClick={handleNextHero}
              className="absolute -right-4 sm:-right-6 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white border border-[#EAE2D5] shadow-lg flex items-center justify-center text-[#2B231D] hover:bg-[#FAF3E8] transition-all z-30"
              aria-label="Next Coin"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* 4 Vibrant Rounded Cards Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 pt-4">
              {heroFeaturedCoins.map((item, idx) => {
                const isSelected = heroActiveIndex === idx;
                const prod = item.product;
                const inWish = isInWishlist(prod.id);

                return (
                  <div
                    key={prod.id}
                    onClick={() => {
                      setIsPaused(true);
                      setHeroActiveIndex(idx);
                      setTimeout(() => setIsPaused(false), 4500);
                    }}
                    className={`bg-gradient-to-b ${item.cardGradient} rounded-[28px] p-4 text-left flex flex-col justify-between cursor-pointer transition-all duration-300 relative ${
                      isSelected 
                        ? 'ring-4 ring-[#E0591D]/30 shadow-2xl scale-[1.03] -translate-y-1' 
                        : 'shadow-md hover:scale-[1.02] opacity-90 hover:opacity-100'
                    }`}
                  >
                    {/* Floating Circular Coin on Top (Matching Reference Image) */}
                    <div className="w-full flex justify-center -mt-10 mb-2">
                      <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white p-2 shadow-lg flex items-center justify-center overflow-hidden border-2 border-white/60">
                        {prod.visualType === 'note' ? (
                          <img src={prod.image} alt={prod.name} className="w-full h-auto object-contain rounded" />
                        ) : (
                          <ProductVisual type="coin" color={prod.visualColor || '#B89A67'} pattern={prod.visualPattern || 'antique-metallic'} isRotating={false} />
                        )}
                      </div>
                    </div>

                    {/* Product Details inside Card */}
                    <div className="space-y-3 pt-1 text-white">
                      <div>
                        <span className="text-[8px] uppercase tracking-widest text-white/80 font-bold block">{item.categoryLabel}</span>
                        <h3 className="font-display font-extrabold text-xs sm:text-sm text-white line-clamp-1">
                          {prod.name}
                        </h3>
                      </div>

                      {/* Price & Wishlist Row */}
                      <div className="flex items-center justify-between">
                        <span className="font-sans font-black text-sm sm:text-base text-white">
                          ₹{prod.price.toLocaleString('en-IN')}
                        </span>
                        <button
                          onClick={(e) => { e.stopPropagation(); toggleWishlist(prod); }}
                          className="p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
                        >
                          <Heart className={`w-3.5 h-3.5 ${inWish ? 'fill-white' : ''}`} />
                        </button>
                      </div>

                      {/* Bottom Action: Order Now Button + Rating */}
                      <div className="flex items-center justify-between pt-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            addToCart(prod, 1);
                          }}
                          className="py-1 px-3 bg-white text-[#2B231D] font-extrabold text-[9px] uppercase tracking-wider rounded-full shadow-xs hover:bg-white/90 transition-colors"
                        >
                          Order Now &gt;
                        </button>
                        
                        <div className="flex items-center gap-1 text-[10px] font-extrabold text-white">
                          <Star className="w-3 h-3 fill-current" />
                          <span>5.0</span>
                        </div>
                      </div>

                    </div>

                  </div>
                );
              })}
            </div>

          </div>

        </div>
      </section>

      {/* ==================================================
          2. NEW ARRIVALS SECTION ("Fresh Vault Additions")
         ================================================== */}
      <section className="w-full py-16 px-4 md:px-12 lg:px-20 bg-white border-y border-[#EFE8DC]">
        <div className="max-w-7xl mx-auto space-y-8">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-[#EFE8DC] pb-4 gap-2 text-left">
            <div>
              <span className="text-[10px] text-[#E0591D] font-extrabold tracking-[0.25em] uppercase block">
                FRESH VAULT ADDITIONS
              </span>
              <h2 className="font-display font-bold text-2xl sm:text-3xl text-[#2B231D] tracking-tight uppercase">
                NEW ARRIVALS
              </h2>
            </div>
            <button
              onClick={() => {
                const el = document.getElementById('explore-products');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="text-[10px] font-extrabold tracking-widest text-[#2B231D] hover:text-[#E0591D] transition-colors flex items-center gap-1 uppercase"
            >
              <span>EXPLORE ALL</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* 4-Column Grid on Web, Horizontal Scroll on Mobile */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {numProducts.slice(2, 6).map((product) => {
              const inWish = isInWishlist(product.id);
              const slug = product.name.toLowerCase().replace(/ /g, '-');

              return (
                <div
                  key={product.id}
                  onClick={() => router.push(`/product/${slug}`)}
                  className="bg-[#FDF9F3] border border-[#EFE8DC] rounded-[24px] p-4 text-left flex flex-col justify-between cursor-pointer group hover:shadow-md transition-all relative overflow-hidden"
                >
                  <div className="w-full flex justify-center pt-2 pb-4">
                    <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-white border border-[#EAE2D5] p-3 flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform overflow-hidden">
                      {product.visualType === 'note' ? (
                        <img src={product.image} alt={product.name} className="w-full h-auto object-contain rounded" />
                      ) : (
                        <ProductVisual type="coin" color={product.visualColor || '#B89A67'} pattern={product.visualPattern || 'antique-metallic'} isRotating={false} />
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <span className="text-[8px] font-bold text-brand-warmGray tracking-widest uppercase block">{product.era || 'HISTORIC'}</span>
                    <h3 className="font-display font-bold text-xs sm:text-sm text-[#2B231D] group-hover:text-[#E0591D] transition-colors line-clamp-1">
                      {product.name}
                    </h3>
                    <div className="flex items-center justify-between border-t border-[#EFE8DC] pt-2">
                      <span className="font-sans font-extrabold text-xs sm:text-sm text-[#2B231D]">₹{product.price.toLocaleString('en-IN')}</span>
                      <button
                        onClick={(e) => { e.stopPropagation(); addToCart(product, 1); }}
                        className="py-1 px-2.5 bg-[#E0591D] text-white rounded-full text-[9px] font-bold uppercase hover:bg-[#C84B15]"
                      >
                        + Add
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ==================================================
          3. SHOP BY CATEGORY (Curated 12 Categories with Images)
         ================================================== */}
      <section className="w-full py-16 px-4 md:px-12 lg:px-20 bg-[#FDF9F3]">
        <div className="max-w-7xl mx-auto space-y-8 text-center">
          
          <div className="space-y-1">
            <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-[#2B231D] tracking-tight uppercase">
              SHOP BY CATEGORY
            </h2>
            <p className="text-xs text-brand-warmGray font-medium">
              Discover curated historical eras and numismatic artifacts from our archives
            </p>
          </div>

          {/* 12 Categories Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-4">
            {[
              { id: 'ancient-coins', name: 'ANCIENT COINS', desc: 'Punched mark & dynastic coins', img: '/coin_image.jpg' },
              { id: 'mughal-coins', name: 'MUGHAL COINS', desc: 'Silver & gold Mughal coins', img: '/coin_image_new.png' },
              { id: 'british-india', name: 'BRITISH INDIA', desc: 'Victoria & George VI coin issues', img: '/coin_image.jpg' },
              { id: 'princely-states', name: 'PRINCELY STATES', desc: 'Royal Indian princely state coins', img: '/coin_image_new.png' },
              { id: 'republic-india', name: 'REPUBLIC INDIA', desc: 'Post-1950 Indian coinage & proof sets', img: '/coin_image.jpg' },
              { id: 'foreign-coins', name: 'FOREIGN COINS', desc: 'International archival numismatics', img: '/coin_image_new.png' },
              { id: 'medals', name: 'MEDALS', desc: 'Historic military & honorary medals', img: '/coin_image.jpg' },
              { id: 'paper-money', name: 'PAPER MONEY', desc: 'Preserved banknotes & currency', img: '/images/inr-100-note.png' },
              { id: 'tokens-badges', name: 'TOKENS & BADGES', desc: 'Trade tokens and heritage badges', img: '/coin_image_new.png' },
              { id: 'east-india-company', name: 'EAST INDIA COMPANY', desc: 'Coins struck by early EIC mints', img: '/coin_image.jpg' },
              { id: 'sultanates', name: 'SULTANATES', desc: 'Medieval Delhi & regional sultanates', img: '/coin_image_new.png' },
              { id: 'independent-kingdoms', name: 'INDEPENDENT KINGDOMS', desc: 'Maratha, Sikh & regional kingdoms', img: '/coin_image.jpg' },
            ].map((cat) => (
              <div
                key={cat.id}
                onClick={() => {
                  setSelectedPillCategory(cat.id);
                  const el = document.getElementById('explore-products');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="bg-white border border-[#EFE8DC] rounded-3xl p-5 text-center space-y-3 cursor-pointer group hover:shadow-md transition-all flex flex-col items-center justify-between"
              >
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#FDF9F3] border border-[#EAE2D5] p-3 flex items-center justify-center overflow-hidden shadow-xs group-hover:scale-105 transition-transform">
                  <img src={cat.img} alt={cat.name} className="w-full h-full object-contain" />
                </div>
                <div>
                  <span className="font-sans font-extrabold text-xs text-[#2B231D] group-hover:text-[#E0591D] transition-colors block">
                    {cat.name}
                  </span>
                  <span className="text-[9px] text-brand-warmGray font-medium block pt-0.5">
                    {cat.desc}
                  </span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ==================================================
          4. EXPLORE PRODUCTS (4-Column Web / 2-Column Mobile Grid)
         ================================================== */}
      <section id="explore-products" className="w-full py-16 px-4 md:px-12 lg:px-20 bg-white border-t border-[#EFE8DC]">
        <div className="max-w-7xl mx-auto space-y-8 text-center">
          
          {/* Header Title & Subtitle */}
          <div className="space-y-2">
            <h2 className="font-display font-black text-3xl sm:text-4xl text-[#2B231D] tracking-tight uppercase">
              Explore Numismatics
            </h2>
            <p className="text-xs sm:text-sm text-brand-warmGray max-w-xl mx-auto font-medium">
              Discover our best-selling coins and notes, preserved for collectors with verified provenance registers.
            </p>
          </div>

          {/* Category Pill Tabs */}
          <div className="flex items-center justify-center gap-2 overflow-x-auto scrollbar-none py-1 px-4">
            {exploreCategoryPills.map((pill) => (
              <button
                key={pill.id}
                onClick={() => setSelectedPillCategory(pill.id)}
                className={`px-5 py-2 rounded-full text-xs font-extrabold transition-all whitespace-nowrap ${
                  selectedPillCategory === pill.id
                    ? 'bg-[#E0591D] text-white shadow-sm'
                    : 'bg-[#FDF9F3] text-brand-warmGray border border-[#EAE2D5] hover:bg-[#F8EFE4]'
                }`}
              >
                {pill.label}
              </button>
            ))}
          </div>

          {/* 4-Column Web / 2-Column Mobile Product Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 pt-4">
            {filteredExploreProducts.map((product) => {
              const inWish = isInWishlist(product.id);
              const slug = product.name.toLowerCase().replace(/ /g, '-');

              return (
                <div
                  key={product.id}
                  onClick={() => router.push(`/product/${slug}`)}
                  className="bg-[#FDF9F3] border border-[#EFE8DC] rounded-[24px] p-4 text-left flex flex-col justify-between cursor-pointer group hover:shadow-lg transition-all relative overflow-hidden"
                >
                  {/* Floating Circular Image Top Badge */}
                  <div className="w-full flex justify-center pt-2 pb-4">
                    <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-white border border-[#EAE2D5] p-3 flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform overflow-hidden">
                      {product.visualType === 'note' ? (
                        <img src={product.image} alt={product.name} className="w-full h-auto object-contain rounded" />
                      ) : (
                        <ProductVisual type="coin" color={product.visualColor || '#B89A67'} pattern={product.visualPattern || 'antique-metallic'} isRotating={false} />
                      )}
                    </div>
                  </div>

                  {/* Wishlist Heart */}
                  <button
                    onClick={(e) => { e.stopPropagation(); toggleWishlist(product); }}
                    className={`absolute top-3 right-3 p-1.5 rounded-full border transition-all z-10 ${
                      inWish ? 'bg-brand-blush border-brand-dustyRose text-brand-dustyRose' : 'bg-white/80 border-[#EAE2D5] text-brand-warmGray'
                    }`}
                  >
                    <Heart className={`w-3.5 h-3.5 ${inWish ? 'fill-brand-dustyRose' : ''}`} />
                  </button>

                  {/* Product Details */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-display font-extrabold text-xs sm:text-sm text-[#2B231D] group-hover:text-[#E0591D] transition-colors line-clamp-1">
                        {product.name}
                      </h3>
                      <div className="flex items-center gap-1 text-[10px] font-bold text-amber-500">
                        <Star className="w-3 h-3 fill-current" />
                        <span>4.8</span>
                      </div>
                    </div>

                    <p className="text-[10px] text-brand-warmGray line-clamp-2 leading-relaxed">
                      {product.description}
                    </p>

                    {/* Price & Add to Cart Action Row */}
                    <div className="flex items-center justify-between border-t border-[#EFE8DC] pt-3">
                      <span className="font-sans font-extrabold text-sm sm:text-base text-[#2B231D]">
                        ₹{product.price.toLocaleString('en-IN')}
                      </span>
                      
                      <button
                        onClick={(e) => { e.stopPropagation(); addToCart(product, 1); }}
                        className="py-1.5 px-3 bg-[#E0591D] text-white font-extrabold text-[10px] uppercase tracking-wider rounded-full hover:bg-[#C84B15] transition-colors shadow-xs flex items-center gap-1"
                      >
                        <span>+ Add</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Full Catalog Filters CTA Button */}
          <div className="pt-6">
            <button
              onClick={() => setIsFilterDrawerOpen(true)}
              className="py-3 px-8 bg-[#2B231D] text-white font-extrabold text-xs tracking-widest uppercase rounded-full hover:bg-black transition-colors shadow-md inline-flex items-center gap-2"
            >
              <SlidersHorizontal className="w-4 h-4 text-[#E0591D]" />
              <span>Full Catalog Filters</span>
            </button>
          </div>

        </div>
      </section>

      {/* ==================================================
          5. PROMOTIONAL / INFORMATION BANNERS
         ================================================== */}
      <section className="w-full py-16 px-6 bg-[#1C1816] text-white border-y border-brand-border/40 relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center space-y-4 relative z-10">
          <span className="text-[10px] font-extrabold tracking-[0.3em] text-brand-gold uppercase block">
            AADHYA PROVENANCE & AUTHENTICITY
          </span>
          <h2 className="font-display font-bold text-3xl md:text-5xl tracking-wide uppercase leading-tight text-[#FCFAF7]">
            AUTHENTIC COLLECTIBLES. <br />
            <span className="italic font-light text-brand-gold">DELIVERED SAFELY.</span>
          </h2>
          <p className="text-xs md:text-sm text-[#756E69] leading-relaxed max-w-xl mx-auto font-medium">
            Every historical coin and banknote in our atelier is verified by expert numismatists and shipped in tamper-evident protective slabs with official certificate registers.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6 pt-4 text-[10px] font-extrabold tracking-widest text-[#B89A67] uppercase">
            <div className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4" /> <span>256-BIT SSL SECURE</span></div>
            <div className="flex items-center gap-1.5"><Award className="w-4 h-4" /> <span>VERIFIED PROVENANCE</span></div>
            <div className="flex items-center gap-1.5"><Truck className="w-4 h-4" /> <span>FREE INSURED SHIPPING</span></div>
          </div>
        </div>
      </section>

      {/* ==================================================
          6. GLASSMORPHIC COLLECTOR REVIEWS
         ================================================== */}
      <section className="w-full py-16 px-4 md:px-12 lg:px-20 bg-[#FDF9F3]">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          
          <div className="space-y-1">
            <span className="text-[10px] text-[#E0591D] font-extrabold tracking-[0.25em] uppercase block">
              VERIFIED FEEDBACK
            </span>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-[#2B231D] tracking-tight uppercase">
              COLLECTOR REVIEWS
            </h2>
          </div>

          {/* Review Glassmorphic Stage */}
          <div className="relative bg-white/70 backdrop-blur-md border border-white/80 p-8 sm:p-12 rounded-3xl min-h-[200px] flex flex-col justify-between shadow-xl shadow-black/5">
            
            <AnimatePresence mode="wait">
              <motion.div
                key={activeReviewIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4 }}
                className="space-y-4"
              >
                <div className="flex justify-center text-amber-500 space-x-1">
                  {[...Array(numismaticReviews[activeReviewIndex]?.rating || 5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>

                <p className="text-sm sm:text-base text-[#2B231D] font-medium leading-relaxed italic max-w-2xl mx-auto">
                  "{numismaticReviews[activeReviewIndex]?.text}"
                </p>

                <div className="pt-2">
                  <span className="font-sans font-extrabold text-sm text-[#2B231D] block">
                    {numismaticReviews[activeReviewIndex]?.author}
                  </span>
                  <span className="text-[9px] bg-brand-success/10 text-brand-success font-extrabold px-2 py-0.5 rounded uppercase inline-block mt-1">
                    ✓ Verified Collector
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Slider Dots */}
            <div className="flex justify-center space-x-2 pt-6">
              {numismaticReviews.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveReviewIndex(idx)}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    activeReviewIndex === idx ? 'bg-[#E0591D] w-6' : 'bg-[#EAE2D5]'
                  }`}
                  aria-label={`Slide ${idx + 1}`}
                />
              ))}
            </div>

          </div>

        </div>
      </section>

      {/* Conditional Full Catalog Filter Drawer */}
      <AnimatePresence>
        {isFilterDrawerOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex justify-end"
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 26, stiffness: 240 }}
              className="w-full max-w-md h-full bg-white p-6 overflow-y-auto space-y-6 text-left"
            >
              <div className="flex items-center justify-between border-b border-brand-border/40 pb-4">
                <h3 className="font-display font-bold text-lg text-[#2B231D] uppercase">Full Catalog Filters</h3>
                <button onClick={() => setIsFilterDrawerOpen(false)} className="p-2 hover:bg-[#FDF9F3] rounded-full">
                  <X className="w-5 h-5 text-[#2B231D]" />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="text-[10px] font-extrabold text-brand-warmGray uppercase tracking-widest mb-2">MATERIAL</h4>
                  {['all', 'silver', 'gold', 'paper', 'mixed metal'].map((mat) => (
                    <button
                      key={mat}
                      onClick={() => { setSelectedMaterialFilter(mat); setIsFilterDrawerOpen(false); }}
                      className={`block text-xs py-1.5 w-full text-left font-semibold ${selectedMaterialFilter === mat ? 'text-[#E0591D] font-bold' : 'text-brand-warmGray'}`}
                    >
                      {mat.toUpperCase()}
                    </button>
                  ))}
                </div>

                <div className="pt-4 border-t border-brand-border/40">
                  <h4 className="text-[10px] font-extrabold text-brand-warmGray uppercase tracking-widest mb-2">RARITY GRADE</h4>
                  {['all', 'scarce', 'rare', 'very rare', 'extremely rare'].map((r) => (
                    <button
                      key={r}
                      onClick={() => { setSelectedRarityFilter(r); setIsFilterDrawerOpen(false); }}
                      className={`block text-xs py-1.5 w-full text-left font-semibold ${selectedRarityFilter === r ? 'text-[#E0591D] font-bold' : 'text-brand-warmGray'}`}
                    >
                      {r.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};
