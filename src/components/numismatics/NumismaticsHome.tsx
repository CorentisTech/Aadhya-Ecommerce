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
  Check, 
  Star,
  SlidersHorizontal,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { NavigationControls } from '../ui/NavigationControls';

export const NumismaticsHome: React.FC = () => {
  const router = useRouter();
  const { toggleWishlist, isInWishlist, addToCart } = useApp();

  // Numismatic Products source of truth (7 products for hero orbit & catalog)
  const numProducts = PRODUCTS.filter((p) => p.department === 'numismatics');
  const numCategories = CATEGORIES.filter((c) => c.department === 'numismatics');

  // --------------------------------------------------
  // 1. HERO 3D ORBITAL ROTATION STATE & TIMERS
  // --------------------------------------------------
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [dragStartX, setDragStartX] = useState<number | null>(null);
  const activeProduct = numProducts[activeIndex] || numProducts[0];

  // Continuous Orbital Autoplay Timer (4.5 seconds)
  useEffect(() => {
    if (isPaused || numProducts.length === 0) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % numProducts.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [isPaused, numProducts.length]);

  // Pause autoplay temporarily on manual interaction
  const triggerManualPause = () => {
    setIsPaused(true);
    setTimeout(() => setIsPaused(false), 3500);
  };

  const handlePrev = () => {
    triggerManualPause();
    setActiveIndex((prev) => (prev - 1 + numProducts.length) % numProducts.length);
  };

  const handleNext = () => {
    triggerManualPause();
    setActiveIndex((prev) => (prev + 1) % numProducts.length);
  };

  // Touch / Drag Handlers for Orbital Stage
  const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    setDragStartX(clientX);
    triggerManualPause();
  };

  const handleTouchEnd = (e: React.TouchEvent | React.MouseEvent) => {
    if (dragStartX === null) return;
    const clientX = 'changedTouches' in e ? e.changedTouches[0].clientX : (e as React.MouseEvent).clientX;
    const diff = clientX - dragStartX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        setActiveIndex((prev) => (prev - 1 + numProducts.length) % numProducts.length);
      } else {
        setActiveIndex((prev) => (prev + 1) % numProducts.length);
      }
    }
    setDragStartX(null);
  };

  // --------------------------------------------------
  // 2. HERO CATEGORY PILLS FILTER & CATALOG FILTERS
  // --------------------------------------------------
  const [selectedHeroCategory, setSelectedHeroCategory] = useState('ALL');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedDenomination, setSelectedDenomination] = useState<string>('all');
  const [selectedMaterial, setSelectedMaterial] = useState<string>('all');
  const [selectedRarity, setSelectedRarity] = useState<string>('all');
  const [selectedYearEra, setSelectedYearEra] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('Recommended');
  const [priceMax, setPriceMax] = useState<number>(30000);
  const [isMobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [hoveredCoinId, setHoveredCoinId] = useState<string | null>(null);

  // Filter products for the main discovery section
  const catalogFilteredProducts = numProducts.filter((product) => {
    const matchesCategory =
      activeCategory === 'all' ||
      product.category.toLowerCase().includes(activeCategory.toLowerCase()) ||
      (activeCategory === 'coins' && product.visualType === 'coin') ||
      (activeCategory === 'notes' && product.visualType === 'note');

    const matchesDenom =
      selectedDenomination === 'all' || product.denomination === selectedDenomination;

    const matchesMat =
      selectedMaterial === 'all' || product.material?.toLowerCase() === selectedMaterial.toLowerCase();

    const matchesRarity =
      selectedRarity === 'all' || product.rarity?.toLowerCase() === selectedRarity.toLowerCase();

    const matchesPrice = product.price <= priceMax;

    return matchesCategory && matchesDenom && matchesMat && matchesRarity && matchesPrice;
  });

  // Sort products
  const sortedCatalogProducts = [...catalogFilteredProducts].sort((a, b) => {
    if (sortBy === 'Price Low to High') return a.price - b.price;
    if (sortBy === 'Price High to Low') return b.price - a.price;
    if (sortBy === 'Newest') return parseInt(b.year || '0') - parseInt(a.year || '0');
    return 0;
  });

  const heroCategoryPills = [
    'ALL',
    'COINS',
    'NOTES',
    'RARE COINS',
    'SILVER COINS',
    'GOLD COINS',
    'COMMEMORATIVE',
    'VINTAGE NOTES'
  ];

  const numismaticReviews = REVIEWS.filter((r) => r.productName.toLowerCase().includes('rupee') || r.rating === 5);

  return (
    <div className="w-full max-w-full min-h-screen bg-brand-warmWhite text-brand-espresso select-none overflow-x-hidden">
      
      {/* Top Navigation Controls */}
      <div className="max-w-6xl mx-auto px-4 md:px-12 pt-6">
        <NavigationControls className="justify-start border-b border-brand-border/30 pb-3" />
      </div>

      {/* ==================================================
          1. SIGNATURE 3D ORBITAL ROTATING HERO SHOWCASE
         ================================================== */}
      <section 
        className="w-full py-12 md:py-20 px-4 md:px-12 lg:px-24 bg-[#FAF7F2] border-b border-brand-border/60 relative overflow-hidden"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Background Ambient Lighting Glows */}
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 rounded-full bg-brand-gold/10 blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 right-1/4 w-80 h-80 rounded-full bg-[#F26A2E]/5 blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center relative z-10">
          
          {/* LEFT CONTENT: Synchronized Dynamic Information Panel (6 cols) */}
          <div className="lg:col-span-6 space-y-6 text-left flex flex-col justify-center">
            
            <AnimatePresence mode="wait">
              <motion.div
                key={activeProduct.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="space-y-4"
              >
                {/* Collection Badge Tag */}
                <div className="flex items-center space-x-2">
                  <span className="text-[9px] font-extrabold tracking-[0.25em] bg-[#F26A2E]/10 border border-[#F26A2E]/25 text-[#F26A2E] px-3 py-1 rounded-full uppercase">
                    {activeProduct.collectionLabel || activeProduct.category}
                  </span>
                  <span className="text-[9px] font-extrabold tracking-widest text-brand-warmGray uppercase">
                    ✦ {activeProduct.rarity || 'RARE'}
                  </span>
                </div>

                {/* Product Title */}
                <h1 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl text-brand-espresso tracking-tight leading-tight uppercase">
                  {activeProduct.name}
                </h1>

                {/* Description */}
                <p className="text-xs sm:text-sm text-brand-warmGray leading-relaxed font-semibold tracking-wider max-w-lg">
                  {activeProduct.description}
                </p>

                {/* Price Display */}
                <div className="flex items-baseline space-x-3 pt-1">
                  <span className="font-sans font-extrabold text-2xl sm:text-3xl text-brand-espresso">
                    ₹{activeProduct.price.toLocaleString('en-IN')}
                  </span>
                  <span className="text-sm sm:text-base text-brand-warmGray line-through font-semibold">
                    ₹{activeProduct.mrp.toLocaleString('en-IN')}
                  </span>
                  <span className="text-[10px] bg-[#F26A2E]/10 text-[#F26A2E] font-extrabold px-2 py-0.5 rounded">
                    SAVE {activeProduct.discount}%
                  </span>
                </div>

                {/* Spec Sheet Grid Chips */}
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 pt-2 text-left">
                  <div className="bg-brand-white border border-brand-border/60 p-2.5 rounded-xl">
                    <span className="text-[8px] text-brand-warmGray font-bold tracking-widest uppercase block">YEAR</span>
                    <span className="font-extrabold text-xs text-brand-espresso">{activeProduct.year || '1954'}</span>
                  </div>
                  <div className="bg-brand-white border border-brand-border/60 p-2.5 rounded-xl">
                    <span className="text-[8px] text-brand-warmGray font-bold tracking-widest uppercase block">MATERIAL</span>
                    <span className="font-extrabold text-xs text-brand-espresso">{activeProduct.material || 'Silver'}</span>
                  </div>
                  <div className="bg-brand-white border border-brand-border/60 p-2.5 rounded-xl">
                    <span className="text-[8px] text-brand-warmGray font-bold tracking-widest uppercase block">WEIGHT</span>
                    <span className="font-extrabold text-xs text-brand-espresso">{activeProduct.weight || '11.66 g'}</span>
                  </div>
                  <div className="bg-brand-white border border-brand-border/60 p-2.5 rounded-xl hidden sm:block">
                    <span className="text-[8px] text-brand-warmGray font-bold tracking-widest uppercase block">DENOM</span>
                    <span className="font-extrabold text-xs text-brand-espresso">{activeProduct.denomination || '₹1'}</span>
                  </div>
                </div>

                {/* Action Buttons (Primary Add to Cart + Secondary Explore + Wishlist) */}
                <div className="flex flex-wrap items-center gap-3 pt-4">
                  <button
                    onClick={() => addToCart(activeProduct, 1)}
                    className="flex-grow sm:flex-grow-0 py-3.5 px-8 bg-[#F26A2E] text-white font-extrabold text-xs tracking-[0.2em] uppercase rounded-xl hover:bg-[#E0591D] transition-colors shadow-md flex items-center justify-center gap-2"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>ADD TO CART</span>
                  </button>

                  <button
                    onClick={() => router.push(`/numismatics/${activeProduct.name.toLowerCase().replace(/ /g, '-')}`)}
                    className="py-3.5 px-6 border border-brand-espresso text-brand-espresso font-extrabold text-xs tracking-[0.2em] uppercase rounded-xl hover:bg-brand-espresso hover:text-white transition-all flex items-center justify-center gap-2"
                  >
                    <span>EXPLORE</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => toggleWishlist(activeProduct)}
                    className={`p-3.5 rounded-xl border transition-all flex items-center justify-center ${
                      isInWishlist(activeProduct.id)
                        ? 'bg-brand-blush border-brand-dustyRose text-brand-dustyRose'
                        : 'bg-brand-white border-brand-border text-brand-warmGray hover:bg-brand-softBeige/40'
                    }`}
                    aria-label="Wishlist"
                  >
                    <Heart className={`w-4 h-4 ${isInWishlist(activeProduct.id) ? 'fill-brand-dustyRose' : ''}`} />
                  </button>
                </div>

              </motion.div>
            </AnimatePresence>

          </div>

          {/* RIGHT PRODUCT STAGE: 3D Elliptical Orbital Stage (6 cols) */}
          <div 
            className="lg:col-span-6 relative h-[380px] sm:h-[440px] w-full flex items-center justify-center touch-pan-y"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onMouseDown={handleTouchStart}
            onMouseUp={handleTouchEnd}
          >
            {/* Stage Pedestal Shadow Glow */}
            <div className="absolute bottom-4 w-72 h-12 rounded-full bg-brand-espresso/15 blur-xl pointer-events-none" />

            {/* Previous / Next Arrow Controls */}
            <button
              onClick={handlePrev}
              className="absolute left-0 z-40 p-2.5 rounded-full bg-brand-white/90 border border-brand-border/60 text-brand-espresso hover:bg-brand-white transition-all shadow-md"
              aria-label="Previous Collectible"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-0 z-40 p-2.5 rounded-full bg-brand-white/90 border border-brand-border/60 text-brand-espresso hover:bg-brand-white transition-all shadow-md"
              aria-label="Next Collectible"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* 7 Products 3D Orbit Loop */}
            {numProducts.map((product, i) => {
              // Calculate relative offset from active index
              const n = numProducts.length;
              let offset = (i - activeIndex + n) % n;
              if (offset > n / 2) offset -= n;

              const isCenter = offset === 0;

              // Compute 3D Orbital Positioning Coordinates
              // Elliptical arc path: x = sin(angle) * rX, y = cos(angle) * rY
              const angle = (offset / n) * (2 * Math.PI);
              const radiusX = 170; // Horizontal orbit spread
              const radiusY = 45;  // Vertical depth tilt

              const translateX = Math.sin(angle) * radiusX;
              const translateY = Math.cos(angle) * radiusY - 20;

              // Scale & opacity depth steps
              const absOffset = Math.abs(offset);
              const scale = isCenter ? 1.15 : Math.max(0.42, 0.82 - absOffset * 0.16);
              const opacity = isCenter ? 1 : Math.max(0.3, 0.85 - absOffset * 0.2);
              const zIndex = isCenter ? 30 : 20 - absOffset * 3;

              return (
                <motion.div
                  key={product.id}
                  onClick={() => {
                    triggerManualPause();
                    setActiveIndex(i);
                  }}
                  animate={{
                    x: translateX,
                    y: translateY,
                    scale,
                    opacity,
                    zIndex,
                  }}
                  transition={{
                    duration: 1.1,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className={`absolute cursor-pointer transition-all duration-300 ${
                    isCenter ? 'drop-shadow-2xl' : 'drop-shadow-md hover:opacity-100'
                  }`}
                  style={{
                    transformStyle: 'preserve-3d',
                  }}
                >
                  <div className={`p-4 rounded-3xl transition-transform ${
                    isCenter 
                      ? 'bg-brand-white/95 border-2 border-[#F26A2E] shadow-2xl p-6 sm:p-8' 
                      : 'bg-brand-white/70 border border-brand-border/50'
                  }`}>
                    {/* Render Collectible Image or Vector Visual */}
                    {product.visualType === 'note' ? (
                      <div className="w-36 h-20 sm:w-48 sm:h-28 flex items-center justify-center overflow-hidden rounded-lg">
                        <img 
                          src={product.image} 
                          alt={product.name} 
                          className="w-full h-full object-contain shadow-xs"
                        />
                      </div>
                    ) : (
                      <div className="w-24 h-24 sm:w-36 sm:h-36 flex items-center justify-center relative">
                        <ProductVisual 
                          type="coin"
                          color={product.visualColor || '#B89A67'}
                          pattern={product.visualPattern || 'antique-metallic'}
                          isRotating={isCenter}
                        />
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}

          </div>

        </div>

        {/* Integrated Category Pills Navigation */}
        <div className="max-w-6xl mx-auto mt-12 pt-6 border-t border-brand-border/40 flex items-center justify-center gap-2 overflow-x-auto scrollbar-none py-1 px-4">
          {heroCategoryPills.map((pill) => (
            <button
              key={pill}
              onClick={() => {
                setSelectedHeroCategory(pill);
                setActiveCategory(pill.toLowerCase().replace(' ', '-'));
              }}
              className={`px-4 py-2 rounded-full text-[9px] sm:text-[10px] font-extrabold tracking-[0.18em] uppercase transition-all whitespace-nowrap border ${
                selectedHeroCategory === pill
                  ? 'bg-brand-espresso text-brand-white border-brand-espresso shadow-xs'
                  : 'bg-brand-white text-brand-warmGray border-brand-border/60 hover:bg-brand-softBeige/40'
              }`}
            >
              {pill}
            </button>
          ))}
        </div>

      </section>

      {/* ==================================================
          2. BEST SELLERS SECTION ("Most Collected Pieces")
         ================================================== */}
      <section className="w-full py-16 px-4 md:px-12 lg:px-24 bg-brand-warmWhite border-b border-brand-border/40">
        <div className="max-w-6xl mx-auto space-y-8">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-brand-border/40 pb-4 gap-2">
            <div className="text-left">
              <span className="text-[10px] text-[#F26A2E] font-extrabold tracking-[0.25em] uppercase block">
                CURATED SELECTION
              </span>
              <h2 className="font-display font-bold text-3xl md:text-4xl text-brand-espresso tracking-tight uppercase">
                BEST SELLERS
              </h2>
            </div>
            <button
              onClick={() => { setActiveCategory('all'); setSortBy('Recommended'); }}
              className="text-[10px] font-extrabold tracking-widest text-brand-espresso hover:text-[#F26A2E] transition-colors flex items-center gap-1 uppercase self-start sm:self-auto"
            >
              <span>VIEW ALL PIECES</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {numProducts.filter(p => p.bestseller).slice(0, 4).map((product) => {
              const inWish = isInWishlist(product.id);
              const slug = product.name.toLowerCase().replace(/ /g, '-');

              return (
                <div
                  key={product.id}
                  onClick={() => router.push(`/numismatics/${slug}`)}
                  className="flex flex-col text-left group cursor-pointer bg-brand-white border border-brand-border/50 rounded-2xl p-3 hover:shadow-md transition-shadow relative"
                >
                  <div className="w-full aspect-[4/5] bg-[#FBF9F6] rounded-xl p-4 flex items-center justify-center relative overflow-hidden border border-brand-border/30">
                    <span className="absolute top-2.5 left-2.5 text-[7px] bg-brand-espresso text-brand-gold font-extrabold tracking-widest px-2 py-0.5 rounded uppercase">
                      {product.rarity || 'RARE'}
                    </span>
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleWishlist(product); }}
                      className={`absolute top-2.5 right-2.5 p-1.5 rounded-full border transition-all z-10 ${
                        inWish ? 'bg-brand-blush border-brand-dustyRose text-brand-dustyRose' : 'bg-white/90 border-brand-border/60 text-brand-warmGray'
                      }`}
                    >
                      <Heart className={`w-3 h-3 ${inWish ? 'fill-brand-dustyRose' : ''}`} />
                    </button>
                    {product.visualType === 'note' ? (
                      <img src={product.image} alt={product.name} className="w-full h-auto object-contain rounded" />
                    ) : (
                      <ProductVisual type="coin" color={product.visualColor || '#B89A67'} pattern={product.visualPattern || 'antique-metallic'} />
                    )}
                  </div>

                  <div className="pt-3 space-y-1 flex-grow flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-[8px] text-brand-warmGray font-bold tracking-widest uppercase">
                        <span>{product.year || '1954'}</span>
                        <span className="text-brand-antiqueBronze">{product.material || 'Silver'}</span>
                      </div>
                      <h3 className="font-display font-bold text-xs text-brand-espresso group-hover:text-[#F26A2E] transition-colors line-clamp-1">
                        {product.name}
                      </h3>
                    </div>
                    <div className="flex items-center justify-between border-t border-brand-border/20 pt-2">
                      <span className="font-sans font-extrabold text-xs text-brand-espresso">₹{product.price.toLocaleString('en-IN')}</span>
                      <button
                        onClick={(e) => { e.stopPropagation(); addToCart(product, 1); }}
                        className="p-1.5 bg-[#F26A2E] text-white rounded-lg hover:bg-[#E0591D] transition-colors"
                        aria-label="Add to cart"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
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
          3. NEW ARRIVALS SECTION ("Fresh Finds for Collectors")
         ================================================== */}
      <section className="w-full py-16 px-4 md:px-12 lg:px-24 bg-[#FAF7F2] border-b border-brand-border/40">
        <div className="max-w-6xl mx-auto space-y-8">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-brand-border/40 pb-4 gap-2">
            <div className="text-left">
              <span className="text-[10px] text-[#F26A2E] font-extrabold tracking-[0.25em] uppercase block">
                RECENT VAULT ADDITIONS
              </span>
              <h2 className="font-display font-bold text-3xl md:text-4xl text-brand-espresso tracking-tight uppercase">
                NEW ARRIVALS
              </h2>
            </div>
          </div>

          {/* Horizontal scroll container on mobile, row on desktop */}
          <div className="flex overflow-x-auto pb-4 gap-4 md:grid md:grid-cols-4 md:gap-6 scrollbar-none snap-x snap-mandatory w-full">
            {numProducts.slice(3, 7).map((product) => {
              const inWish = isInWishlist(product.id);
              const slug = product.name.toLowerCase().replace(/ /g, '-');

              return (
                <div
                  key={product.id}
                  onClick={() => router.push(`/numismatics/${slug}`)}
                  className="flex flex-col text-left group cursor-pointer bg-brand-white border border-brand-border/50 rounded-2xl p-3 hover:shadow-md transition-shadow relative flex-shrink-0 w-[200px] sm:w-[220px] md:w-auto snap-start"
                >
                  <div className="w-full aspect-[4/5] bg-[#FBF9F6] rounded-xl p-4 flex items-center justify-center relative overflow-hidden border border-brand-border/30">
                    <span className="absolute top-2.5 left-2.5 text-[7px] bg-[#F26A2E] text-white font-extrabold tracking-widest px-2 py-0.5 rounded uppercase">
                      NEW
                    </span>
                    {product.visualType === 'note' ? (
                      <img src={product.image} alt={product.name} className="w-full h-auto object-contain rounded" />
                    ) : (
                      <ProductVisual type="coin" color={product.visualColor || '#B89A67'} pattern={product.visualPattern || 'antique-metallic'} />
                    )}
                  </div>

                  <div className="pt-3 space-y-1 flex-grow flex flex-col justify-between">
                    <div>
                      <span className="text-[8px] font-bold text-brand-warmGray tracking-widest uppercase block">{product.era || 'HISTORIC'}</span>
                      <h3 className="font-display font-bold text-xs text-brand-espresso group-hover:text-[#F26A2E] transition-colors line-clamp-1">
                        {product.name}
                      </h3>
                    </div>
                    <div className="flex items-center justify-between border-t border-brand-border/20 pt-2">
                      <span className="font-sans font-extrabold text-xs text-brand-espresso">₹{product.price.toLocaleString('en-IN')}</span>
                      <button
                        onClick={(e) => { e.stopPropagation(); addToCart(product, 1); }}
                        className="p-1.5 bg-[#F26A2E] text-white rounded-lg hover:bg-[#E0591D] transition-colors"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
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
          4. SHOP BY CATEGORY (Editorial Category Cards)
         ================================================== */}
      <section className="w-full py-16 px-4 md:px-12 lg:px-24 bg-brand-warmWhite border-b border-brand-border/40">
        <div className="max-w-6xl mx-auto space-y-8">
          
          <div className="text-left space-y-1">
            <span className="text-[10px] text-[#F26A2E] font-extrabold tracking-[0.25em] uppercase block">
              COLLECTION ERAS
            </span>
            <h2 className="font-display font-bold text-3xl md:text-4xl text-brand-espresso tracking-tight uppercase">
              SHOP BY CATEGORY
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { id: 'rare-coins', title: 'RARE COINS', desc: 'Exceedingly scarce mintages with royal provenance', icon: '🪙' },
              { id: 'currency-notes', title: 'VINTAGE NOTES', desc: 'Preserved paper currency from British India & RBI', icon: '💵' },
              { id: 'indian-coins', title: 'SILVER COINS', desc: 'Pure silver coinage from historic Indian mints', icon: '🥈' },
              { id: 'gold-coins', title: 'GOLD COINS', desc: 'Exceedingly rare gold mohurs and sovereigns', icon: '👑' },
              { id: 'commemorative', title: 'COMMEMORATIVE', desc: 'Special issue coinage celebrating national milestones', icon: '📜' },
              { id: 'collectors-picks', title: 'COLLECTOR SETS', desc: 'Proof & uncirculated coin booklets with certificates', icon: '💎' }
            ].map((cat) => (
              <div
                key={cat.id}
                onClick={() => {
                  setActiveCategory(cat.id);
                  const el = document.getElementById('explore-catalog');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="bg-[#FAF7F2] border border-brand-border/60 p-6 rounded-3xl text-left space-y-4 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="w-12 h-12 rounded-2xl bg-white border border-brand-border/40 flex items-center justify-center text-2xl shadow-xs">
                    {cat.icon}
                  </div>
                  <h3 className="font-display font-bold text-lg text-brand-espresso tracking-wide group-hover:text-[#F26A2E] transition-colors">
                    {cat.title}
                  </h3>
                  <p className="text-xs text-brand-warmGray font-medium leading-relaxed">
                    {cat.desc}
                  </p>
                </div>
                <div className="flex items-center gap-1 text-[10px] font-extrabold text-[#F26A2E] tracking-widest uppercase pt-2">
                  <span>EXPLORE CATEGORY</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ==================================================
          5. EDITORIAL PROMOTIONAL BANNER
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
          6. EXPLORE PRODUCTS (Discovery Section + Left Filters)
         ================================================== */}
      <section id="explore-catalog" className="w-full py-16 px-4 md:px-12 lg:px-24 bg-brand-warmWhite">
        <div className="max-w-6xl mx-auto space-y-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-brand-border/40 pb-4 gap-4">
            <div className="text-left space-y-1">
              <span className="text-[10px] text-[#F26A2E] font-extrabold tracking-[0.25em] uppercase block">
                FULL VAULT DISCOVERY
              </span>
              <h2 className="font-display font-bold text-3xl md:text-4xl text-brand-espresso tracking-tight uppercase">
                EXPLORE NUMISMATICS
              </h2>
            </div>

            {/* Mobile Filter Toggle & Sort Dropdown */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileFilterOpen(true)}
                className="md:hidden px-4 py-2 bg-brand-white border border-brand-border/60 rounded-full text-xs font-bold flex items-center gap-2"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-[#F26A2E]" />
                <span>FILTERS</span>
              </button>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-brand-white border border-brand-border/60 px-3 py-2 rounded-full text-xs font-bold text-brand-espresso outline-none cursor-pointer"
              >
                <option value="Recommended">Sort: Recommended</option>
                <option value="Newest">Sort: Newest</option>
                <option value="Price Low to High">Price: Low to High</option>
                <option value="Price High to Low">Price: High to Low</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            
            {/* LEFT FILTER SIDEBAR (3 cols) */}
            <aside className="hidden md:block md:col-span-3 space-y-6 bg-brand-white border border-brand-border/60 p-5 rounded-3xl text-left">
              <div className="flex items-center space-x-2 border-b border-brand-border pb-3">
                <Filter className="w-4 h-4 text-[#F26A2E]" />
                <span className="text-xs font-extrabold tracking-widest uppercase">FILTERS</span>
              </div>

              {/* Department */}
              <div className="space-y-2">
                <h4 className="text-[9px] font-extrabold text-brand-warmGray tracking-widest uppercase">DEPARTMENT</h4>
                <div className="flex flex-col space-y-1 text-xs font-semibold text-brand-warmGray">
                  {['all', 'coins', 'notes', 'rare-coins', 'currency-notes', 'commemorative'].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`text-left py-1 transition-colors ${activeCategory === cat ? 'text-[#F26A2E] font-extrabold border-l-2 border-[#F26A2E] pl-2' : 'hover:text-brand-espresso'}`}
                    >
                      {cat.toUpperCase().replace('-', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Material */}
              <div className="space-y-2 pt-3 border-t border-brand-border/40">
                <h4 className="text-[9px] font-extrabold text-brand-warmGray tracking-widest uppercase">MATERIAL</h4>
                <div className="flex flex-col space-y-1 text-xs font-semibold text-brand-warmGray">
                  {['all', 'silver', 'gold', 'paper', 'mixed metal'].map((mat) => (
                    <button
                      key={mat}
                      onClick={() => setSelectedMaterial(mat)}
                      className={`text-left py-1 transition-colors ${selectedMaterial === mat ? 'text-[#F26A2E] font-extrabold border-l-2 border-[#F26A2E] pl-2' : 'hover:text-brand-espresso'}`}
                    >
                      {mat.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              {/* Rarity */}
              <div className="space-y-2 pt-3 border-t border-brand-border/40">
                <h4 className="text-[9px] font-extrabold text-brand-warmGray tracking-widest uppercase">RARITY GRADE</h4>
                <div className="flex flex-col space-y-1 text-xs font-semibold text-brand-warmGray">
                  {['all', 'scarce', 'rare', 'very rare', 'extremely rare'].map((r) => (
                    <button
                      key={r}
                      onClick={() => setSelectedRarity(r)}
                      className={`text-left py-1 transition-colors ${selectedRarity === r ? 'text-[#F26A2E] font-extrabold border-l-2 border-[#F26A2E] pl-2' : 'hover:text-brand-espresso'}`}
                    >
                      {r.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              {/* Max Price Slider */}
              <div className="space-y-2 pt-3 border-t border-brand-border/40">
                <div className="flex justify-between text-[9px] font-extrabold text-brand-warmGray uppercase">
                  <span>MAX PRICE</span>
                  <span className="text-brand-espresso">₹{priceMax.toLocaleString('en-IN')}</span>
                </div>
                <input
                  type="range"
                  min="2000"
                  max="30000"
                  step="1000"
                  value={priceMax}
                  onChange={(e) => setPriceMax(Number(e.target.value))}
                  className="w-full accent-[#F26A2E] cursor-pointer"
                />
              </div>

              <button
                onClick={() => {
                  setActiveCategory('all');
                  setSelectedMaterial('all');
                  setSelectedRarity('all');
                  setPriceMax(30000);
                }}
                className="w-full py-2 border border-brand-border text-[9px] font-extrabold tracking-widest text-brand-warmGray hover:text-brand-espresso rounded-xl uppercase"
              >
                RESET FILTERS
              </button>

            </aside>

            {/* RIGHT PRODUCT GRID (9 cols) */}
            <main className="md:col-span-9 space-y-6">
              {sortedCatalogProducts.length === 0 ? (
                <div className="text-center py-20 bg-brand-white border border-brand-border/40 rounded-3xl text-brand-warmGray text-xs font-bold uppercase tracking-widest">
                  NO COLLECTIBLES MATCH THE SELECTED FILTERS.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {sortedCatalogProducts.map((product) => {
                    const inWish = isInWishlist(product.id);
                    const isHovered = hoveredCoinId === product.id;
                    const slug = product.name.toLowerCase().replace(/ /g, '-');

                    return (
                      <div
                        key={product.id}
                        onClick={() => router.push(`/numismatics/${slug}`)}
                        onMouseEnter={() => setHoveredCoinId(product.id)}
                        onMouseLeave={() => setHoveredCoinId(null)}
                        className="flex flex-col text-left group bg-brand-white border border-brand-border/50 rounded-2xl overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                      >
                        <div className="w-full aspect-[4/5] bg-[#FAF7F2] p-6 flex items-center justify-center relative overflow-hidden border-b border-brand-border/40">
                          <div className="w-full h-full transform group-hover:scale-103 transition-transform duration-500 flex items-center justify-center">
                            {product.visualType === 'note' ? (
                              <img src={product.image} alt={product.name} className="w-full h-auto object-contain rounded" />
                            ) : (
                              <ProductVisual
                                type="coin"
                                color={product.visualColor || '#B89A67'}
                                pattern={product.visualPattern || 'antique-metallic'}
                                isRotating={isHovered}
                              />
                            )}
                          </div>

                          <div className="absolute top-3 left-3">
                            <span className="text-[8px] bg-brand-espresso text-brand-gold font-extrabold tracking-widest px-2.5 py-0.8 rounded shadow-xs uppercase">
                              {product.rarity || 'RARE'}
                            </span>
                          </div>

                          <button
                            onClick={(e) => { e.stopPropagation(); toggleWishlist(product); }}
                            className={`absolute top-3 right-3 p-2 rounded-full border transition-all ${
                              inWish ? 'bg-brand-blush border-brand-dustyRose text-brand-dustyRose' : 'bg-white/80 border-brand-border/60 text-brand-warmGray'
                            }`}
                          >
                            <Heart className={`w-3.5 h-3.5 ${inWish ? 'fill-brand-dustyRose' : ''}`} />
                          </button>
                        </div>

                        <div className="p-4 space-y-1.5 flex-grow flex flex-col justify-between">
                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-[9px] text-brand-warmGray font-bold tracking-widest">
                              <span>{product.category}</span>
                              <span className="text-brand-antiqueBronze">{product.year}</span>
                            </div>
                            <h3 className="font-display font-bold text-sm text-brand-espresso leading-snug group-hover:text-[#F26A2E] transition-colors line-clamp-1">
                              {product.name}
                            </h3>
                          </div>

                          <div className="border-t border-brand-border/30 pt-3 flex items-center justify-between">
                            <span className="text-[8px] text-brand-warmGray font-bold tracking-wider uppercase">
                              {product.material || 'SILVER'}
                            </span>
                            <span className="text-xs font-extrabold text-brand-espresso">
                              ₹{product.price.toLocaleString('en-IN')}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </main>

          </div>

        </div>
      </section>

      {/* ==================================================
          7. COLLECTOR REVIEWS SECTION
         ================================================== */}
      <section className="w-full py-16 px-4 md:px-12 lg:px-24 bg-[#FAF7F2] border-t border-brand-border/40">
        <div className="max-w-6xl mx-auto space-y-8">
          
          <div className="text-left space-y-1">
            <span className="text-[10px] text-[#F26A2E] font-extrabold tracking-[0.25em] uppercase block">
              VERIFIED FEEDBACK
            </span>
            <h2 className="font-display font-bold text-3xl md:text-4xl text-brand-espresso tracking-tight uppercase">
              COLLECTOR REVIEWS
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {numismaticReviews.map((rev) => (
              <div key={rev.id} className="bg-brand-white border border-brand-border/60 p-6 rounded-3xl text-left space-y-3 shadow-xs">
                <div className="flex items-center justify-between">
                  <div className="flex text-amber-500 space-x-1">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                  <span className="text-[9px] text-brand-warmGray font-bold">{rev.date}</span>
                </div>
                <p className="text-xs text-brand-espresso font-medium leading-relaxed italic">
                  "{rev.text}"
                </p>
                <div className="flex items-center justify-between border-t border-brand-border/30 pt-3">
                  <span className="text-xs font-extrabold text-brand-espresso">{rev.author}</span>
                  <span className="text-[8px] bg-brand-success/10 text-brand-success font-extrabold px-2 py-0.5 rounded uppercase">
                    ✓ Verified Collector
                  </span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Mobile Slide-Over Filter Panel */}
      <AnimatePresence>
        {isMobileFilterOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-brand-espresso/50 backdrop-blur-sm flex justify-end md:hidden"
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="w-4/5 max-w-xs h-full bg-brand-white p-6 overflow-y-auto space-y-6 text-left"
            >
              <div className="flex items-center justify-between border-b border-brand-border pb-4">
                <h3 className="font-display font-bold text-lg text-brand-espresso">FILTERS</h3>
                <button onClick={() => setMobileFilterOpen(false)} className="p-1">
                  <X className="w-5 h-5 text-brand-warmGray" />
                </button>
              </div>

              {/* Mobile Filter Options */}
              <div className="space-y-4">
                <div>
                  <h4 className="text-[9px] font-extrabold text-brand-warmGray uppercase tracking-widest mb-2">CATEGORY</h4>
                  {['all', 'coins', 'notes', 'rare-coins', 'currency-notes'].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => { setActiveCategory(cat); setMobileFilterOpen(false); }}
                      className={`block text-xs py-1.5 w-full text-left font-semibold ${activeCategory === cat ? 'text-[#F26A2E] font-bold' : 'text-brand-warmGray'}`}
                    >
                      {cat.toUpperCase()}
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
