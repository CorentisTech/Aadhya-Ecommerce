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
  Play,
  Check
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
  // 1. HERO BEST SELLER SHOWCASE STATE (Matching Reference Images)
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
    setHeroActiveIndex((prev) => (prev - 1 + heroFeaturedCoins.length) % heroFeaturedCoins.length);
    setTimeout(() => setIsPaused(false), 4500);
  };

  const handleNextHero = () => {
    setIsPaused(true);
    setHeroActiveIndex((prev) => (prev + 1) % heroFeaturedCoins.length);
    setTimeout(() => setIsPaused(false), 4500);
  };

  const handleHeroAddToCart = () => {
    addToCart(activeHeroProduct, 1);
    setAddedHero(true);
    setTimeout(() => setAddedHero(false), 1500);
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
      
      {/* Top Header Navigation */}
      <div className="max-w-7xl mx-auto px-4 md:px-12 pt-4">
        <NavigationControls className="justify-start border-b border-[#F0EAE1] pb-3" />
      </div>

      {/* ==================================================
          1. HERO SECTION — EXACT REFERENCE COMPOSITION (Matching Reference Image)
         ================================================== */}
      <section 
        className="w-full pt-10 pb-16 px-4 md:px-12 lg:px-20 bg-gradient-to-b from-[#FFF5EC] via-[#FFF8F3] to-[#FFFBF8] relative overflow-hidden"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Soft Ambient Warm Glow Elements */}
        <div className="absolute top-10 right-10 w-[550px] h-[550px] rounded-full bg-[#FCE5D3]/60 blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-4 w-80 h-80 rounded-full bg-[#FFF0E0]/80 blur-2xl pointer-events-none" />

        <div className="max-w-7xl mx-auto space-y-12 relative z-10">
          
          {/* TOP SPLIT: Left Headline, Price, Reviews & Actions + Right Large Hero Coin */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Content Area (6 cols) */}
            <div className="lg:col-span-6 space-y-5 text-left flex flex-col justify-center pr-0 lg:pr-6">
              
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeHeroProduct.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-4"
                >
                  {/* Catchy 2-Tone Headline */}
                  <h1 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl text-[#2B231D] tracking-tight leading-[1.12]">
                    Rare Coinage <span className="text-[#2B231D]">is</span> <br />
                    <span className="text-[#E0591D]">an Important Part</span> <br />
                    <span className="text-[#2B231D]">of Heritage</span>
                  </h1>

                  {/* Active Coin Title & Spec Tag */}
                  <div className="flex items-center space-x-2 pt-1">
                    <span className="text-[10px] font-extrabold tracking-[0.2em] bg-[#E0591D]/10 text-[#E0591D] px-2.5 py-0.5 rounded-full uppercase">
                      {activeHeroProduct.era || 'BRITISH INDIA'}
                    </span>
                    <span className="font-display font-bold text-sm text-[#2B231D] line-clamp-1">
                      {activeHeroProduct.name}
                    </span>
                  </div>

                  {/* Price & Rating Row (Enhanced with real prices & reviews) */}
                  <div className="flex flex-wrap items-center gap-4 pt-1">
                    <div className="flex items-baseline space-x-2.5">
                      <span className="font-sans font-black text-2xl sm:text-3xl text-[#E0591D]">
                        ₹{activeHeroProduct.price.toLocaleString('en-IN')}
                      </span>
                      <span className="text-sm text-brand-warmGray line-through font-semibold">
                        ₹{activeHeroProduct.mrp.toLocaleString('en-IN')}
                      </span>
                      <span className="text-[9px] font-extrabold bg-[#E0591D]/10 text-[#E0591D] px-2 py-0.5 rounded">
                        {activeHeroProduct.discount}% OFF
                      </span>
                    </div>

                    <div className="flex items-center space-x-1.5 bg-white/80 border border-[#EFE8DC] px-2.5 py-1 rounded-full text-xs shadow-xs">
                      {renderStars(5)}
                      <span className="text-[10px] font-bold text-[#2B231D]">5.0 (48 Reviews)</span>
                    </div>
                  </div>

                  {/* Subtitle */}
                  <p className="text-xs sm:text-sm text-[#7D736A] font-medium leading-relaxed max-w-md pt-0.5">
                    {activeHeroProduct.description}
                  </p>

                  {/* Action Buttons: Add to Cart + Wishlist + Collector Story */}
                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <button
                      onClick={handleHeroAddToCart}
                      className="px-7 py-3 bg-[#E0591D] hover:bg-[#C84B15] text-white font-extrabold text-xs tracking-wider rounded-full transition-all shadow-md shadow-[#E0591D]/25 flex items-center gap-2"
                    >
                      {addedHero ? (
                        <>
                          <Check className="w-4 h-4" />
                          <span>ADDED TO BAG</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="w-4 h-4" />
                          <span>ADD TO CART</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => toggleWishlist(activeHeroProduct)}
                      className={`p-3 rounded-full border transition-all shadow-sm ${
                        isHeroInWish
                          ? 'bg-brand-blush border-brand-dustyRose text-brand-dustyRose'
                          : 'bg-white border-[#EAE2D5] text-[#2B231D] hover:bg-[#FFF5EC]'
                      }`}
                      aria-label="Add to Wishlist"
                    >
                      <Heart className={`w-4 h-4 ${isHeroInWish ? 'fill-brand-dustyRose' : ''}`} />
                    </button>

                    <button
                      onClick={() => router.push(`/product/${activeHeroProduct.name.toLowerCase().replace(/ /g, '-')}`)}
                      className="flex items-center gap-2.5 text-xs font-extrabold text-[#2B231D] hover:text-[#E0591D] transition-colors group px-3 py-2"
                    >
                      <div className="w-8 h-8 rounded-full bg-[#2B231D] text-white flex items-center justify-center group-hover:bg-[#E0591D] transition-colors shadow-sm">
                        <Play className="w-3 h-3 fill-current ml-0.5" />
                      </div>
                      <span>Collector Story</span>
                    </button>
                  </div>

                </motion.div>
              </AnimatePresence>

            </div>

            {/* Right Large Hero Coin Visual (6 cols) */}
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
                  {/* Scalloped Badge on Top-Right */}
                  <div className="absolute -top-3 -right-2 sm:-right-4 z-30 w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#85A947] text-white flex flex-col items-center justify-center shadow-lg font-display font-extrabold rotate-12">
                    <span className="text-[11px] sm:text-xs font-black tracking-wider leading-none">
                      {currentHeroItem.discountBadge}
                    </span>
                    <span className="text-[8px] tracking-tight opacity-90">100% Genuine</span>
                  </div>

                  {/* Main Circular Coin Presentation Stage (Full-Fit Coin without excess padding) */}
                  <div 
                    onClick={() => router.push(`/product/${activeHeroProduct.name.toLowerCase().replace(/ /g, '-')}`)}
                    className="w-[280px] sm:w-[380px] h-[280px] sm:h-[380px] rounded-full bg-[#FFFDFB] border-8 border-white p-3 sm:p-4 shadow-2xl flex items-center justify-center cursor-pointer group relative overflow-hidden"
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

          {/* LOWER HERO CAROUSEL: Floating White Container with 4 Vibrant Cards (Full-Fit Coin) */}
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
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 pt-6">
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
                    {/* Floating Circular Coin on Top (Full-Fit Coin without excess white gap) */}
                    <div className="w-full flex justify-center -mt-12 mb-2">
                      <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white p-1 shadow-lg flex items-center justify-center overflow-hidden border-2 border-white">
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
          2. NEW ARRIVALS SECTION (Exact Fashion Card Layout & Grid)
         ================================================== */}
      <section className="w-full py-16 px-4 md:px-12 lg:px-24 bg-brand-warmWhite border-b border-brand-border/40 overflow-hidden">
        <div className="max-w-6xl mx-auto space-y-8 md:space-y-12">
          
          {/* Header Grid */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-brand-border/40 text-left">
            <div className="space-y-1">
              <span className="text-xs sm:text-sm text-[#E0591D] font-extrabold tracking-[0.2em] uppercase block">
                NEW ARRIVALS
              </span>
              <h2 className="font-display font-bold text-3xl md:text-5xl text-brand-espresso tracking-tight">
                Fresh Vault Additions
              </h2>
              <p className="text-[10px] sm:text-xs text-brand-warmGray font-medium">
                Recently acquired rare coins and historical banknotes.
              </p>
            </div>
            
            <div className="flex justify-start md:justify-end flex-shrink-0">
              <button 
                onClick={() => {
                  const el = document.getElementById('explore-products');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-4 py-2 border border-brand-border rounded-full text-[10px] font-bold tracking-widest text-brand-espresso hover:bg-brand-softBeige/40 transition-colors flex items-center space-x-1 uppercase"
              >
                <span>VIEW ALL</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* 4-Column Grid on Web, Horizontal Scroll on Mobile (Exact Fashion Card UI) */}
          <div className="flex overflow-x-auto pb-3 gap-4 md:grid md:grid-cols-2 lg:grid-cols-4 md:gap-8 scrollbar-none snap-x snap-mandatory w-full scroll-smooth">
            {numProducts.slice(2, 6).map((product, index) => {
              const inWishlist = isInWishlist(product.id);
              const slug = product.name.toLowerCase().replace(/ /g, '-');

              return (
                <div
                  key={product.id}
                  onClick={() => router.push(`/product/${slug}`)}
                  className="flex flex-col text-left group cursor-pointer bg-brand-white border border-brand-border/40 rounded-xl p-2.5 sm:p-3 hover:shadow-md transition-shadow relative flex-shrink-0 w-[165px] sm:w-[185px] md:w-auto snap-start"
                >
                  {/* Product Visual Container (Aspect 4/5 Matching Fashion Card) */}
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

                  {/* Details (Matching Fashion Card Anatomy) */}
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
          3. SHOP BY CATEGORY (Matching Uploaded Category Design)
         ================================================== */}
      <section className="w-full py-12 md:py-16 px-4 md:px-12 lg:px-24 bg-brand-warmWhite border-b border-brand-border/40 overflow-hidden">
        <div className="max-w-6xl mx-auto bg-white rounded-3xl p-6 sm:p-10 border border-brand-border/40 shadow-xs space-y-8">
          
          {/* Header Row */}
          <div className="flex items-center justify-between border-b border-brand-border/30 pb-4 text-left">
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-brand-espresso tracking-tight">
              Shop by Category
            </h2>
            <button
              onClick={() => {
                const el = document.getElementById('explore-products');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="text-xs font-bold text-brand-warmGray hover:text-[#E0591D] transition-colors flex items-center gap-1"
            >
              <span>Browse all</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* 6 Clean Circular Categories Row */}
          <div className="flex overflow-x-auto pb-2 gap-6 md:grid md:grid-cols-6 md:gap-4 scrollbar-none snap-x snap-mandatory w-full justify-between">
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
                onClick={() => {
                  setSelectedPillCategory(cat.id);
                  const el = document.getElementById('explore-products');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="flex flex-col items-center text-center group cursor-pointer space-y-2.5 flex-shrink-0 w-[110px] sm:w-[130px] md:w-auto snap-start"
              >
                {/* Big Circular Image Badge (Full-Fit Coin) */}
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
          4. EXPLORE PRODUCTS (Exact Fashion Card Layout & Grid)
         ================================================== */}
      <section id="explore-products" className="w-full py-16 px-4 md:px-12 lg:px-24 bg-white border-t border-brand-border/40">
        <div className="max-w-6xl mx-auto space-y-8 text-center">
          
          {/* Header Title & Subtitle */}
          <div className="space-y-2">
            <h2 className="font-display font-black text-3xl sm:text-4xl text-[#2B231D] tracking-tight uppercase">
              Explore Numismatics
            </h2>
            <p className="text-xs sm:text-sm text-brand-warmGray max-w-xl mx-auto font-medium">
              Discover our full archival catalogue of coins and banknotes with verified provenance registers.
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
                    : 'bg-[#FAF7F2] text-brand-warmGray border border-[#EAE2D5] hover:bg-[#F0EAE1]'
                }`}
              >
                {pill.label}
              </button>
            ))}
          </div>

          {/* 4-Column Web / 2-Column Mobile Product Grid (Matching Fashion Card Layout) */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 pt-4">
            {filteredExploreProducts.map((product) => {
              const inWishlist = isInWishlist(product.id);
              const slug = product.name.toLowerCase().replace(/ /g, '-');

              return (
                <div
                  key={product.id}
                  onClick={() => router.push(`/product/${slug}`)}
                  className="flex flex-col text-left group cursor-pointer bg-brand-white border border-brand-border/40 rounded-xl p-2.5 sm:p-3 hover:shadow-md transition-shadow relative"
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
      <section className="w-full py-16 px-4 md:px-12 lg:px-20 bg-[#FFF8F3]">
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
          <div className="relative bg-white/75 backdrop-blur-md border border-white/80 p-8 sm:p-12 rounded-3xl min-h-[200px] flex flex-col justify-between shadow-xl shadow-black/5">
            
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
                <button onClick={() => setIsFilterDrawerOpen(false)} className="p-2 hover:bg-[#FAF7F2] rounded-full">
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
