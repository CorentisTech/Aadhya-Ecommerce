"use client";

import React, { useState, useEffect, useRef } from 'react';
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
  Check,
  Tag
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

export const NumismaticsHome: React.FC = () => {
  const router = useRouter();
  const { toggleWishlist, isInWishlist, addToCart } = useApp();
  const exploreScrollRef = useRef<HTMLDivElement>(null);
  const heroCardsScrollRef = useRef<HTMLDivElement>(null);

  // Numismatic Products source of truth
  const numProducts = PRODUCTS.filter((p) => p.department === 'numismatics');

  // --------------------------------------------------
  // 1. HERO BEST SELLER SHOWCASE STATE (Matching Reference Image)
  // --------------------------------------------------
  const [heroActiveIndex, setHeroActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [addedHero, setAddedHero] = useState(false);

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
  const isHeroInWish = isInWishlist(activeHeroProduct.id);

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
    const newIdx = (heroActiveIndex - 1 + heroFeaturedCoins.length) % heroFeaturedCoins.length;
    setHeroActiveIndex(newIdx);
    if (heroCardsScrollRef.current) {
      const cardWidth = 160;
      heroCardsScrollRef.current.scrollTo({ left: newIdx * cardWidth, behavior: 'smooth' });
    }
    setTimeout(() => setIsPaused(false), 4500);
  };

  const handleNextHero = () => {
    setIsPaused(true);
    const newIdx = (heroActiveIndex + 1) % heroFeaturedCoins.length;
    setHeroActiveIndex(newIdx);
    if (heroCardsScrollRef.current) {
      const cardWidth = 160;
      heroCardsScrollRef.current.scrollTo({ left: newIdx * cardWidth, behavior: 'smooth' });
    }
    setTimeout(() => setIsPaused(false), 4500);
  };

  const handleHeroAddToCart = () => {
    addToCart(activeHeroProduct, 1);
    setAddedHero(true);
    setTimeout(() => setAddedHero(false), 1500);
  };

  // Horizontal Scroll handlers for Explore Numismatics
  const scrollExplore = (direction: 'left' | 'right') => {
    if (exploreScrollRef.current) {
      const scrollAmount = direction === 'left' ? -320 : 320;
      exploreScrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // --------------------------------------------------
  // 2. REVIEWS SLIDER CAROUSEL STATE (Glassmorphic)
  // --------------------------------------------------
  const numismaticReviews = REVIEWS.filter((r) => r.productName.toLowerCase().includes('rupee') || r.rating === 5);
  const [activeReviewIndex, setActiveReviewIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveReviewIndex((prev) => (prev + 1) % numismaticReviews.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [numismaticReviews.length]);

  const renderStars = (rating = 5) => (
    <div className="flex items-center space-x-0.5 text-amber-500">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`w-3 h-3 ${i < rating ? 'fill-current' : 'text-brand-border stroke-[1.5]'}`}
        />
      ))}
    </div>
  );

  return (
    <div className="w-full max-w-full min-h-screen bg-[#FFFBF8] text-brand-espresso select-none overflow-x-hidden">

      {/* ==================================================
          1. HERO SECTION — SINGLE SCREEN FIT (Desktop & Mobile)
         ================================================== */}
      <section 
        className="w-full pt-3 sm:pt-4 md:pt-6 pb-4 sm:pb-6 md:pb-8 px-3 sm:px-6 md:px-12 lg:px-16 bg-gradient-to-b from-[#FFF5EC] via-[#FFF8F3] to-[#FFFBF8] relative overflow-hidden"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Soft Ambient Warm Glow Elements */}
        <div className="absolute top-6 right-8 w-[450px] h-[450px] rounded-full bg-[#FCE5D3]/60 blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 left-4 w-72 h-72 rounded-full bg-[#FFF0E0]/80 blur-2xl pointer-events-none" />

        <div className="max-w-7xl mx-auto space-y-3 sm:space-y-4 md:space-y-5 relative z-10">
          
          {/* TOP SPLIT: Left Headline, Price, Reviews & Actions + Right Large Hero Coin */}
          <div className="grid grid-cols-12 gap-2 sm:gap-4 md:gap-8 items-center">
            
            {/* Left Content Area (7 cols on mobile, 6 cols on desktop) */}
            <div className="col-span-7 sm:col-span-7 lg:col-span-6 space-y-2 sm:space-y-3 md:space-y-3.5 text-left flex flex-col justify-center pr-0 sm:pr-4 lg:pr-6">
              
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeHeroProduct.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.35 }}
                  className="space-y-1.5 sm:space-y-2.5 md:space-y-3"
                >
                  {/* Catchy 2-Tone Headline */}
                  <h1 className="font-display font-black text-lg sm:text-2xl md:text-3xl lg:text-[40px] text-[#2B231D] tracking-tight leading-[1.12]">
                    Rare Coinage <span className="text-[#2B231D]">is</span> <br />
                    <span className="text-[#E0591D]">an Important Part</span> <br />
                    <span className="text-[#2B231D]">of Heritage</span>
                  </h1>

                  {/* Active Coin Title & Spec Tag */}
                  <div className="flex items-center space-x-1.5 sm:space-x-2 pt-0.5">
                    <span className="text-[7px] sm:text-[8px] md:text-[10px] font-extrabold tracking-[0.15em] sm:tracking-[0.2em] bg-[#E0591D]/10 text-[#E0591D] px-2 py-0.5 rounded-full uppercase whitespace-nowrap">
                      {activeHeroProduct.era || 'BRITISH INDIA'}
                    </span>
                    <span className="font-display font-bold text-xs sm:text-sm text-[#2B231D] line-clamp-1">
                      {activeHeroProduct.name}
                    </span>
                  </div>

                  {/* Price & Rating Row */}
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 pt-0.5">
                    <div className="flex items-baseline space-x-1.5 sm:space-x-2">
                      <span className="font-sans font-black text-base sm:text-xl md:text-2xl text-[#E0591D]">
                        ₹{activeHeroProduct.price.toLocaleString('en-IN')}
                      </span>
                      <span className="text-[10px] sm:text-xs text-brand-warmGray line-through font-semibold">
                        ₹{activeHeroProduct.mrp.toLocaleString('en-IN')}
                      </span>
                      <span className="text-[7px] sm:text-[8px] font-extrabold bg-[#E0591D]/10 text-[#E0591D] px-1.5 py-0.5 rounded">
                        {activeHeroProduct.discount}% OFF
                      </span>
                    </div>

                    <div className="flex items-center space-x-1 bg-white/80 border border-[#EFE8DC] px-1.5 sm:px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] shadow-xs">
                      {renderStars(5)}
                      <span className="font-bold text-[#2B231D] whitespace-nowrap">5.0 (48)</span>
                    </div>
                  </div>

                  {/* Subtitle / Description */}
                  <p className="text-[10px] sm:text-xs md:text-sm text-[#7D736A] font-medium leading-relaxed max-w-md line-clamp-2 pt-0.5">
                    {activeHeroProduct.description}
                  </p>

                  {/* Action Buttons: Add to Cart + Wishlist */}
                  <div className="flex items-center gap-2 sm:gap-3 pt-1">
                    <button
                      onClick={handleHeroAddToCart}
                      className="px-4 sm:px-6 md:px-7 py-2 sm:py-2.5 bg-[#E0591D] hover:bg-[#C84B15] text-white font-extrabold text-[10px] sm:text-xs tracking-wider rounded-full transition-all shadow-md shadow-[#E0591D]/25 flex items-center gap-1.5 sm:gap-2"
                    >
                      {addedHero ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>ADDED</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>ADD TO CART</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => toggleWishlist(activeHeroProduct)}
                      className={`p-2 sm:p-2.5 rounded-full border transition-all shadow-sm ${
                        isHeroInWish
                          ? 'bg-brand-blush border-brand-dustyRose text-brand-dustyRose'
                          : 'bg-white border-[#EAE2D5] text-[#2B231D] hover:bg-[#FFF5EC]'
                      }`}
                      aria-label="Add to Wishlist"
                    >
                      <Heart className={`w-3.5 h-3.5 ${isHeroInWish ? 'fill-brand-dustyRose' : ''}`} />
                    </button>
                  </div>

                </motion.div>
              </AnimatePresence>

            </div>

            {/* Right Large Hero Coin Visual (5 cols on mobile, 6 cols on desktop) */}
            <div className="col-span-5 sm:col-span-5 lg:col-span-6 relative flex items-center justify-center lg:justify-end">
              
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeHeroProduct.id}
                  initial={{ scale: 0.94, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.94, opacity: 0 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="relative flex items-center justify-center"
                >
                  {/* Scalloped Badge on Top-Right */}
                  <div className="absolute -top-1.5 sm:-top-2 -right-1 sm:-right-3 z-30 w-11 h-11 sm:w-15 sm:h-15 md:w-18 md:h-18 rounded-full bg-[#85A947] text-white flex flex-col items-center justify-center shadow-lg font-display font-extrabold rotate-12">
                    <span className="text-[8px] sm:text-[10px] md:text-xs font-black tracking-wider leading-none">
                      {currentHeroItem.discountBadge}
                    </span>
                    <span className="text-[6px] sm:text-[7px] md:text-[8px] tracking-tight opacity-90">100% Genuine</span>
                  </div>

                  {/* Main Circular Coin Presentation Stage */}
                  <div 
                    onClick={() => router.push(`/product/${activeHeroProduct.name.toLowerCase().replace(/ /g, '-')}`)}
                    className="w-[140px] sm:w-[200px] md:w-[260px] lg:w-[300px] h-[140px] sm:h-[200px] md:h-[260px] lg:h-[300px] rounded-full bg-[#FFFDFB] border-4 sm:border-6 lg:border-8 border-white p-1.5 sm:p-2.5 md:p-3 shadow-xl sm:shadow-2xl flex items-center justify-center cursor-pointer group relative overflow-hidden"
                  >
                    {activeHeroProduct.visualType === 'note' ? (
                      <img 
                        src={activeHeroProduct.image} 
                        alt={activeHeroProduct.name} 
                        className="w-full h-full object-contain rounded-lg shadow-md group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ProductVisual 
                          type="coin" 
                          color={activeHeroProduct.visualColor || '#B89A67'} 
                          pattern={activeHeroProduct.visualPattern || 'antique-metallic'} 
                          className="w-full h-full scale-105"
                          isRotating={false} 
                        />
                      </div>
                    )}
                  </div>

                  {/* Floating Glassmorphic Provenance Badge (Bottom-Left) */}
                  <div className="absolute -bottom-2 sm:-bottom-3 -left-1.5 sm:-left-4 md:-left-6 z-30 bg-white/95 backdrop-blur-md border border-[#EFE8DC] rounded-xl sm:rounded-2xl p-1.5 sm:p-2.5 md:p-3 shadow-lg flex items-center gap-1.5 sm:gap-2.5">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 md:w-9 md:h-9 rounded-lg sm:rounded-xl bg-[#FFF3EC] flex items-center justify-center text-[#E0591D] flex-shrink-0">
                      <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                    </div>
                    <div className="text-left pr-1">
                      <span className="text-[9px] sm:text-[10px] md:text-[11px] font-extrabold text-[#2B231D] block leading-tight">Verified Provenance</span>
                      <span className="text-[7px] sm:text-[8px] md:text-[9px] text-[#7D736A] font-semibold">Historic Specimen</span>
                    </div>
                  </div>

                </motion.div>
              </AnimatePresence>

            </div>

          </div>

          {/* LOWER HERO CAROUSEL: Floating White Container with 4 Vibrant Cards Moved Up */}
          <div className="relative max-w-5xl mx-auto bg-white rounded-[22px] sm:rounded-[32px] md:rounded-[40px] p-3 sm:p-4 md:p-6 shadow-xl shadow-black/5 border border-[#F0EAE1]">
            
            {/* Outer Left Circular Navigation Button */}
            <button
              onClick={handlePrevHero}
              className="absolute -left-2.5 sm:-left-4 md:-left-5 top-1/2 -translate-y-1/2 w-7 h-7 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full bg-white border border-[#EAE2D5] shadow-lg flex items-center justify-center text-[#2B231D] hover:bg-[#FAF3E8] transition-all z-30"
              aria-label="Previous Coin"
            >
              <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5" />
            </button>

            {/* Outer Right Circular Navigation Button */}
            <button
              onClick={handleNextHero}
              className="absolute -right-2.5 sm:-right-4 md:-right-5 top-1/2 -translate-y-1/2 w-7 h-7 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full bg-white border border-[#EAE2D5] shadow-lg flex items-center justify-center text-[#2B231D] hover:bg-[#FAF3E8] transition-all z-30"
              aria-label="Next Coin"
            >
              <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5" />
            </button>

            {/* 4 Vibrant Rounded Cards: Horizontal Touch-Swipe on Mobile, Grid on Desktop */}
            <div 
              ref={heroCardsScrollRef}
              className="flex overflow-x-auto gap-3 sm:gap-4 md:grid md:grid-cols-4 md:gap-4 lg:gap-5 pt-6 sm:pt-7 pb-1 scrollbar-none snap-x snap-mandatory touch-pan-x w-full scroll-smooth"
            >
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
                    className={`flex-shrink-0 w-[145px] sm:w-[170px] md:w-auto snap-start bg-gradient-to-b ${item.cardGradient} rounded-[20px] sm:rounded-[26px] p-2.5 sm:p-3.5 text-left flex flex-col justify-between cursor-pointer transition-all duration-300 relative ${
                      isSelected 
                        ? 'ring-3 sm:ring-4 ring-[#E0591D]/30 shadow-2xl scale-[1.02] -translate-y-0.5' 
                        : 'shadow-md hover:scale-[1.01] opacity-90 hover:opacity-100'
                    }`}
                  >
                    {/* Floating Circular Coin on Top */}
                    <div className="w-full flex justify-center -mt-9 sm:-mt-11 mb-1 sm:mb-1.5">
                      <div className="w-13 h-13 sm:w-16 sm:h-16 md:w-19 md:h-19 rounded-full bg-white p-0.5 sm:p-1 shadow-lg flex items-center justify-center overflow-hidden border-2 border-white">
                        {prod.visualType === 'note' ? (
                          <img src={prod.image} alt={prod.name} className="w-full h-full object-cover rounded-full" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ProductVisual 
                              type="coin" 
                              color={prod.visualColor || '#B89A67'} 
                              pattern={prod.visualPattern || 'antique-metallic'} 
                              className="w-full h-full scale-110"
                              isRotating={false} 
                            />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Product Details inside Card */}
                    <div className="space-y-1.5 sm:space-y-2 pt-0.5 text-white">
                      <div>
                        <span className="text-[7px] sm:text-[8px] uppercase tracking-widest text-white/80 font-bold block">{item.categoryLabel}</span>
                        <h3 className="font-display font-extrabold text-[11px] sm:text-xs md:text-sm text-white line-clamp-1">
                          {prod.name}
                        </h3>
                      </div>

                      {/* Price & Wishlist Row */}
                      <div className="flex items-center justify-between">
                        <span className="font-sans font-black text-xs sm:text-sm md:text-base text-white">
                          ₹{prod.price.toLocaleString('en-IN')}
                        </span>
                        <button
                          onClick={(e) => { e.stopPropagation(); toggleWishlist(prod); }}
                          className="p-1 sm:p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
                        >
                          <Heart className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${inWish ? 'fill-white' : ''}`} />
                        </button>
                      </div>

                      {/* Bottom Action: Order Now Button + Rating */}
                      <div className="flex items-center justify-between pt-0.5">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            addToCart(prod, 1);
                          }}
                          className="py-0.5 sm:py-1 px-2 sm:px-2.5 bg-white text-[#2B231D] font-extrabold text-[8px] sm:text-[9px] uppercase tracking-wider rounded-full shadow-xs hover:bg-white/90 transition-colors"
                        >
                          Order Now &gt;
                        </button>
                        
                        <div className="flex items-center gap-0.5 sm:gap-1 text-[9px] sm:text-[10px] font-extrabold text-white">
                          <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-current" />
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
          2. NEW ARRIVALS SECTION (Exact Fashion Card Layout & Grid)
         ================================================== */}
      <section className="w-full py-12 md:py-16 px-4 md:px-12 lg:px-24 bg-brand-warmWhite border-b border-brand-border/40 overflow-hidden">
        <div className="max-w-6xl mx-auto space-y-6 md:space-y-10">
          
          {/* Header Grid */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-brand-border/40 text-left">
            <div className="space-y-1">
              <span className="text-xs sm:text-sm text-[#E0591D] font-extrabold tracking-[0.2em] uppercase block">
                NEW ARRIVALS
              </span>
              <h2 className="font-display font-bold text-2xl sm:text-3xl md:text-5xl text-brand-espresso tracking-tight">
                Fresh Vault Additions
              </h2>
              <p className="text-[10px] sm:text-xs text-brand-warmGray font-medium">
                Recently acquired rare coins and historical banknotes.
              </p>
            </div>
            
            <div className="flex justify-start md:justify-end flex-shrink-0">
              <button 
                onClick={() => router.push('/catalog?department=numismatics&sort=newest')}
                className="px-4 py-2 border border-brand-border rounded-full text-[10px] font-bold tracking-widest text-brand-espresso hover:bg-brand-softBeige/40 transition-colors flex items-center space-x-1 uppercase"
              >
                <span>VIEW ALL</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* 4-Column Grid on Web, Horizontal Touch-Swipe on Mobile */}
          <div className="flex overflow-x-auto pb-3 gap-3 sm:gap-4 md:grid md:grid-cols-2 lg:grid-cols-4 md:gap-8 scrollbar-none snap-x snap-mandatory touch-pan-x w-full scroll-smooth">
            {numProducts.slice(2, 6).map((product) => {
              const inWishlist = isInWishlist(product.id);
              const slug = product.name.toLowerCase().replace(/ /g, '-');

              return (
                <div
                  key={product.id}
                  onClick={() => router.push(`/product/${slug}`)}
                  className="flex flex-col text-left group cursor-pointer bg-brand-white border border-brand-border/40 rounded-xl p-2.5 sm:p-3 hover:shadow-md transition-shadow relative flex-shrink-0 w-[165px] sm:w-[185px] md:w-auto snap-start"
                >
                  {/* Product Visual Container */}
                  <div className="w-full aspect-[4/5] bg-brand-softBeige/20 overflow-hidden relative rounded-lg p-3 flex items-center justify-center">
                    {product.visualType === 'note' ? (
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105" 
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ProductVisual 
                          type="coin" 
                          color={product.visualColor || '#B89A67'} 
                          pattern={product.visualPattern || 'antique-metallic'} 
                          className="w-full h-full scale-110"
                          isRotating={false} 
                        />
                      </div>
                    )}

                    {/* Top left badge */}
                    <div className="absolute top-2 left-2 pointer-events-none">
                      <span className="text-[7px] bg-brand-white/95 border border-brand-border/60 text-brand-espresso font-extrabold tracking-widest px-1.5 py-0.5 rounded shadow-sm uppercase">
                        {product.rarity || 'BEST'}
                      </span>
                    </div>

                    {/* Wishlist button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleWishlist(product);
                      }}
                      className={`absolute top-2 right-2 p-1.5 rounded-full border transition-all shadow-sm pointer-events-auto ${
                        inWishlist
                          ? 'bg-brand-blush border-brand-dustyRose text-brand-dustyRose'
                          : 'bg-brand-white/95 border-brand-border/60 text-brand-warmGray hover:bg-brand-white'
                      }`}
                    >
                      <Heart className={`w-2.5 h-2.5 ${inWishlist ? 'fill-brand-dustyRose' : ''}`} />
                    </button>
                  </div>

                  {/* Details */}
                  <div className="pt-2.5 space-y-1.5">
                    <h3 className="font-sans font-bold text-xs sm:text-sm text-brand-espresso tracking-wide leading-snug group-hover:text-[#E0591D] transition-colors line-clamp-1">
                      {product.name}
                    </h3>

                    {/* Ratings */}
                    <div className="flex items-center space-x-1">
                      {renderStars(product.rating || 5)}
                      <span className="text-[9px] sm:text-[10px] text-brand-warmGray font-bold">
                        ({product.reviewsCount || 128})
                      </span>
                    </div>

                    {/* Price Row with Discount Badge */}
                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-baseline space-x-1.5">
                        <span className="font-sans font-extrabold text-xs sm:text-sm text-brand-espresso">
                          ₹{product.price.toLocaleString('en-IN')}
                        </span>
                        <span className="text-[10px] text-brand-warmGray line-through font-medium">
                          ₹{product.mrp.toLocaleString('en-IN')}
                        </span>
                      </div>
                      <span className="text-[9px] bg-brand-sale/10 text-brand-sale font-bold px-1.5 py-0.5 rounded">
                        {product.discount}%
                      </span>
                    </div>

                    {/* Add to Bag CTA */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(product, 1);
                      }}
                      className="w-full mt-2 py-1.5 bg-[#E0591D] hover:bg-[#C84B15] text-white text-[10px] font-extrabold tracking-wider uppercase rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                    >
                      <ShoppingBag className="w-3 h-3" />
                      <span>ADD TO BAG</span>
                    </button>
                  </div>

                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ==================================================
          3. SHOP BY CATEGORY (Exact Match for Uploaded media_1788273362349.jpg Top Part)
         ================================================== */}
      <section className="w-full py-10 md:py-16 px-4 md:px-12 lg:px-24 bg-brand-warmWhite overflow-hidden">
        <div className="max-w-6xl mx-auto bg-white rounded-3xl p-5 sm:p-8 md:p-10 border border-brand-border/40 shadow-xs space-y-6 sm:space-y-8">
          
          {/* Header Row */}
          <div className="flex items-center justify-between border-b border-brand-border/30 pb-4 text-left">
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-brand-espresso tracking-tight">
              Shop by Category
            </h2>
            <button
              onClick={() => router.push('/catalog?department=numismatics')}
              className="text-xs font-bold text-brand-warmGray hover:text-[#E0591D] transition-colors flex items-center gap-1"
            >
              <span>Browse all</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* 6 Clean Circular Categories Row: Horizontal Touch-Swipe on Mobile */}
          <div className="flex overflow-x-auto pb-2 gap-4 sm:gap-6 md:grid md:grid-cols-6 md:gap-4 scrollbar-none snap-x snap-mandatory touch-pan-x w-full justify-between scroll-smooth">
            {[
              { id: 'coins', name: 'Coins', count: '120+ Items', img: '/coin_image_new.png' },
              { id: 'notes', name: 'Paper Money', count: '95+ Items', img: '/images/inr-100-note.png' },
              { id: 'ancient-coins', name: 'Ancient Coins', count: '150+ Items', img: '/coin_image.jpg' },
              { id: 'british-india', name: 'British India', count: '80+ Items', img: '/coin_image_new.png' },
              { id: 'republic-india', name: 'Republic India', count: '70+ Items', img: '/coin_image.jpg' },
              { id: 'commemorative', name: 'Commemorative', count: '65+ Items', img: '/coin_image_new.png' },
            ].map((cat) => (
              <div
                key={cat.id}
                onClick={() => router.push(`/catalog?department=numismatics&category=${cat.id}`)}
                className="flex flex-col items-center text-center group cursor-pointer space-y-2.5 flex-shrink-0 w-[110px] sm:w-[130px] md:w-auto snap-start"
              >
                {/* Big Circular Image Badge */}
                <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-full overflow-hidden bg-[#FAF7F2] border border-[#EAE2D5] p-1.5 flex items-center justify-center group-hover:scale-105 transition-transform shadow-xs">
                  <img src={cat.img} alt={cat.name} className="w-full h-full object-contain rounded-full" />
                </div>

                {/* Name and Count */}
                <div>
                  <span className="font-sans font-bold text-xs sm:text-sm text-brand-espresso group-hover:text-[#E0591D] transition-colors block">
                    {cat.name}
                  </span>
                  <span className="text-[10px] text-brand-warmGray font-medium block pt-0.5">
                    {cat.count}
                  </span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ==================================================
          4. PROMOTIONAL HERITAGE SALE BANNER (Exact Match for media_1788273362349.jpg Bottom Part)
         ================================================== */}
      <section className="w-full py-6 px-4 md:px-12 lg:px-24 bg-brand-warmWhite">
        <div className="max-w-6xl mx-auto rounded-[32px] sm:rounded-[36px] overflow-hidden bg-[#1B3832] text-white p-6 sm:p-10 md:p-12 relative flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8 shadow-xl">
          
          {/* Left Text & CTA */}
          <div className="space-y-3 sm:space-y-4 text-left z-10 max-w-lg">
            <div className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-[#E8A598]" />
              <span className="text-[10px] font-extrabold tracking-[0.25em] text-[#E8A598] uppercase">
                LIMITED TIME OFFER
              </span>
            </div>
            
            <h2 className="font-display font-bold text-2xl sm:text-4xl lg:text-5xl text-white tracking-tight leading-tight">
              Heritage Sale is Live!
            </h2>
            
            <p className="text-xs sm:text-sm text-white/80 font-medium leading-relaxed max-w-md">
              Enjoy up to 40% off on selected museum-grade coins, rare Mughal rupees, and archival British India banknotes.
            </p>

            <div className="pt-1 sm:pt-2">
              <button
                onClick={() => router.push('/catalog?department=numismatics&discount=true')}
                className="px-6 sm:px-7 py-3 sm:py-3.5 bg-[#E8A598] hover:bg-[#F2B6A9] text-[#1B3832] font-extrabold text-xs tracking-wider rounded-full transition-colors flex items-center gap-2 shadow-lg"
              >
                <span>Explore Deals</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right Visual with Overlapping 40% Badge */}
          <div className="relative flex items-center justify-center z-10">
            {/* Circular Discount Pill Badge */}
            <div className="w-24 h-24 sm:w-32 sm:h-32 md:w-36 md:h-36 rounded-full bg-[#E8A598] text-[#1B3832] flex flex-col items-center justify-center font-display font-black shadow-2xl text-center flex-shrink-0 z-20 -mr-5 sm:-mr-8">
              <span className="text-[8px] sm:text-[10px] font-extrabold tracking-widest uppercase">UP TO</span>
              <span className="text-xl sm:text-3xl md:text-4xl font-black leading-none my-0.5">40%</span>
              <span className="text-[8px] sm:text-[10px] font-extrabold tracking-widest uppercase">OFF</span>
            </div>

            {/* Lifestyle Coin / Artifact Image Display */}
            <div className="w-36 h-36 sm:w-48 sm:h-48 md:w-56 md:h-56 rounded-3xl overflow-hidden bg-white/10 border border-white/20 p-2 sm:p-3 backdrop-blur-xs flex items-center justify-center shadow-lg">
              <img 
                src="/coin_image_new.png" 
                alt="Heritage Numismatics Collection" 
                className="w-full h-full object-contain rounded-2xl"
              />
            </div>
          </div>

        </div>
      </section>

      {/* ==================================================
          5. EXPLORE NUMISMATICS (Horizontal Carousel with Mobile Swipe & Web Arrow Controls)
         ================================================== */}
      <section id="explore-products" className="w-full py-12 md:py-16 px-4 md:px-12 lg:px-24 bg-white border-t border-brand-border/40">
        <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8 text-center">
          
          {/* Header Row with Arrow Controls */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-brand-border/30 pb-4 text-left gap-4">
            <div className="space-y-1">
              <span className="text-xs sm:text-sm text-[#E0591D] font-extrabold tracking-[0.2em] uppercase block">
                CURATED ARCHIVE
              </span>
              <h2 className="font-display font-black text-2xl sm:text-4xl text-[#2B231D] tracking-tight uppercase">
                Explore Numismatics
              </h2>
              <p className="text-xs sm:text-sm text-brand-warmGray font-medium">
                Swipe horizontally on mobile or use arrow controls on desktop.
              </p>
            </div>

            {/* Desktop Navigation Arrows */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => scrollExplore('left')}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-brand-border bg-white text-brand-espresso hover:bg-brand-softBeige/40 flex items-center justify-center transition-colors shadow-xs"
                aria-label="Scroll left"
              >
                <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              <button
                onClick={() => scrollExplore('right')}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-brand-border bg-white text-brand-espresso hover:bg-brand-softBeige/40 flex items-center justify-center transition-colors shadow-xs"
                aria-label="Scroll right"
              >
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>

          {/* Horizontal Scroll Carousel with Touch-Swipe */}
          <div 
            ref={exploreScrollRef}
            className="flex overflow-x-auto pb-4 gap-3 sm:gap-6 scrollbar-none snap-x snap-mandatory touch-pan-x w-full scroll-smooth pt-2 text-left"
          >
            {numProducts.map((product) => {
              const inWishlist = isInWishlist(product.id);
              const slug = product.name.toLowerCase().replace(/ /g, '-');

              return (
                <div
                  key={product.id}
                  onClick={() => router.push(`/product/${slug}`)}
                  className="flex flex-col text-left group cursor-pointer bg-brand-white border border-brand-border/40 rounded-xl p-2.5 sm:p-3 hover:shadow-md transition-shadow relative flex-shrink-0 w-[170px] sm:w-[210px] md:w-[240px] snap-start"
                >
                  {/* Product Visual Container */}
                  <div className="w-full aspect-[4/5] bg-brand-softBeige/20 overflow-hidden relative rounded-lg p-3 flex items-center justify-center">
                    {product.visualType === 'note' ? (
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105" 
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ProductVisual 
                          type="coin" 
                          color={product.visualColor || '#B89A67'} 
                          pattern={product.visualPattern || 'antique-metallic'} 
                          className="w-full h-full scale-110"
                          isRotating={false} 
                        />
                      </div>
                    )}

                    {/* Top left badge */}
                    <div className="absolute top-2 left-2 pointer-events-none">
                      <span className="text-[7px] bg-brand-white/95 border border-brand-border/60 text-brand-espresso font-extrabold tracking-widest px-1.5 py-0.5 rounded shadow-sm uppercase">
                        {product.rarity || 'RARE'}
                      </span>
                    </div>

                    {/* Wishlist button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleWishlist(product);
                      }}
                      className={`absolute top-2 right-2 p-1.5 rounded-full border transition-all shadow-sm pointer-events-auto ${
                        inWishlist
                          ? 'bg-brand-blush border-brand-dustyRose text-brand-dustyRose'
                          : 'bg-brand-white/95 border-brand-border/60 text-brand-warmGray hover:bg-brand-white'
                      }`}
                    >
                      <Heart className={`w-2.5 h-2.5 ${inWishlist ? 'fill-brand-dustyRose' : ''}`} />
                    </button>
                  </div>

                  {/* Details */}
                  <div className="pt-2.5 space-y-1.5">
                    <h3 className="font-sans font-bold text-xs sm:text-sm text-brand-espresso tracking-wide leading-snug group-hover:text-[#E0591D] transition-colors line-clamp-1">
                      {product.name}
                    </h3>

                    {/* Ratings */}
                    <div className="flex items-center space-x-1">
                      {renderStars(product.rating || 5)}
                      <span className="text-[9px] sm:text-[10px] text-brand-warmGray font-bold">
                        ({product.reviewsCount || 128})
                      </span>
                    </div>

                    {/* Price Row with Discount Badge */}
                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-baseline space-x-1.5">
                        <span className="font-sans font-extrabold text-xs sm:text-sm text-brand-espresso">
                          ₹{product.price.toLocaleString('en-IN')}
                        </span>
                        <span className="text-[10px] text-brand-warmGray line-through font-medium">
                          ₹{product.mrp.toLocaleString('en-IN')}
                        </span>
                      </div>
                      <span className="text-[9px] bg-brand-sale/10 text-brand-sale font-bold px-1.5 py-0.5 rounded">
                        {product.discount}%
                      </span>
                    </div>

                    {/* Add to Bag CTA */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(product, 1);
                      }}
                      className="w-full mt-2 py-1.5 bg-[#E0591D] hover:bg-[#C84B15] text-white text-[10px] font-extrabold tracking-wider uppercase rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                    >
                      <ShoppingBag className="w-3 h-3" />
                      <span>ADD TO BAG</span>
                    </button>
                  </div>

                </div>
              );
            })}
          </div>

          {/* Bottom Redirect Link to Full Catalogue */}
          <div className="pt-4">
            <button
              onClick={() => router.push('/catalog?department=numismatics')}
              className="py-3 px-8 bg-[#2B231D] text-white font-extrabold text-xs tracking-widest uppercase rounded-full hover:bg-black transition-colors shadow-md inline-flex items-center gap-2"
            >
              <span>EXPLORE MORE NUMISMATIC PIECES</span>
              <ArrowRight className="w-4 h-4 text-[#E0591D]" />
            </button>
          </div>

        </div>
      </section>

      {/* ==================================================
          6. GLASSMORPHIC COLLECTOR REVIEWS
         ================================================== */}
      <section className="w-full py-12 md:py-16 px-4 md:px-12 lg:px-20 bg-[#FFF8F3]">
        <div className="max-w-4xl mx-auto text-center space-y-6 sm:space-y-8">
          
          <div className="space-y-1">
            <span className="text-[10px] text-[#E0591D] font-extrabold tracking-[0.25em] uppercase block">
              VERIFIED FEEDBACK
            </span>
            <h2 className="font-display font-bold text-2xl sm:text-3xl md:text-4xl text-[#2B231D] tracking-tight uppercase">
              COLLECTOR REVIEWS
            </h2>
          </div>

          {/* Review Glassmorphic Stage */}
          <div className="relative bg-white/75 backdrop-blur-md border border-white/80 p-6 sm:p-10 md:p-12 rounded-3xl min-h-[190px] flex flex-col justify-between shadow-xl shadow-black/5">
            
            <AnimatePresence mode="wait">
              <motion.div
                key={activeReviewIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4 }}
                className="space-y-3 sm:space-y-4"
              >
                <div className="flex justify-center text-amber-500 space-x-1">
                  {[...Array(numismaticReviews[activeReviewIndex]?.rating || 5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>

                <p className="text-xs sm:text-sm md:text-base text-[#2B231D] font-medium leading-relaxed italic max-w-2xl mx-auto">
                  "{numismaticReviews[activeReviewIndex]?.text}"
                </p>

                <div className="pt-1 sm:pt-2">
                  <span className="font-sans font-extrabold text-xs sm:text-sm text-[#2B231D] block">
                    {numismaticReviews[activeReviewIndex]?.author}
                  </span>
                  <span className="text-[9px] bg-brand-success/10 text-brand-success font-extrabold px-2 py-0.5 rounded uppercase inline-block mt-1">
                    ✓ Verified Collector
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Slider Dots */}
            <div className="flex justify-center space-x-2 pt-4 sm:pt-6">
              {numismaticReviews.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveReviewIndex(idx)}
                  className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full transition-all ${
                    activeReviewIndex === idx ? 'bg-[#E0591D] w-5 sm:w-6' : 'bg-[#EAE2D5]'
                  }`}
                  aria-label={`Slide ${idx + 1}`}
                />
              ))}
            </div>

          </div>

        </div>
      </section>

    </div>
  );
};
