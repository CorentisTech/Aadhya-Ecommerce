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
  Minus,
  Plus
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
  // 1. HERO HALF-CIRCLE ORBITAL SHOWCASE STATE (Matching Reference Image 2)
  // --------------------------------------------------
  const [activeIndex, setActiveIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isPaused, setIsPaused] = useState(false);

  const activeProduct = numProducts[activeIndex] || numProducts[0];

  // Autoplay hero rotation every 5 seconds
  useEffect(() => {
    if (isPaused || numProducts.length === 0) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % numProducts.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isPaused, numProducts.length]);

  const handlePrevHero = () => {
    setIsPaused(true);
    setActiveIndex((prev) => (prev - 1 + numProducts.length) % numProducts.length);
    setTimeout(() => setIsPaused(false), 4000);
  };

  const handleNextHero = () => {
    setIsPaused(true);
    setActiveIndex((prev) => (prev + 1) % numProducts.length);
    setTimeout(() => setIsPaused(false), 4000);
  };

  // --------------------------------------------------
  // 2. EXPLORE PRODUCTS GRID & CONDITIONAL FILTERS
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
  // 3. REVIEWS SLIDER CAROUSEL STATE
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
    <div className="w-full max-w-full min-h-screen bg-[#F8F9FA] text-brand-espresso select-none overflow-x-hidden">
      
      {/* Top Header Navigation */}
      <div className="max-w-7xl mx-auto px-4 md:px-12 pt-4">
        <NavigationControls className="justify-start border-b border-brand-border/30 pb-3" />
      </div>

      {/* ==================================================
          1. HERO SECTION — HALF-CIRCLE ORBITAL SHOWCASE (Matching Reference Image 2)
         ================================================== */}
      <section 
        className="w-full py-12 md:py-16 px-4 md:px-12 lg:px-24 bg-[#F8F9FA] relative overflow-hidden"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          
          {/* LEFT COLUMN: Dynamic Product Panel (Matching Reference Image 2) */}
          <div className="lg:col-span-6 space-y-6 text-left flex flex-col justify-center pr-0 lg:pr-6">
            
            <AnimatePresence mode="wait">
              <motion.div
                key={activeProduct.id}
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 15 }}
                transition={{ duration: 0.4 }}
                className="space-y-4"
              >
                {/* Collection Tag */}
                <div className="flex items-center space-x-2">
                  <span className="text-[9px] font-extrabold tracking-[0.25em] bg-[#F26A2E]/10 border border-[#F26A2E]/25 text-[#F26A2E] px-3 py-1 rounded-full uppercase">
                    BEST SELLER
                  </span>
                  <span className="text-[9px] font-extrabold tracking-widest text-brand-warmGray uppercase">
                    ✦ {activeProduct.era || 'BRITISH INDIA'} — {activeProduct.rarity || 'RARE'}
                  </span>
                </div>

                {/* Main Product Title */}
                <h1 className="font-display font-black text-3xl sm:text-4xl md:text-5xl text-[#1A1A1A] tracking-tight leading-tight uppercase">
                  {activeProduct.name}
                </h1>

                {/* Price Display (Bold Orange Text) */}
                <div className="flex items-baseline space-x-3 pt-1">
                  <span className="font-sans font-extrabold text-2xl sm:text-3xl text-[#F26A2E]">
                    ₹{activeProduct.price.toLocaleString('en-IN')}
                  </span>
                  <span className="text-base text-brand-warmGray line-through font-semibold">
                    ₹{activeProduct.mrp.toLocaleString('en-IN')}
                  </span>
                </div>

                {/* Description */}
                <p className="text-xs sm:text-sm text-[#555555] leading-relaxed font-medium max-w-lg">
                  {activeProduct.description}
                </p>

                {/* Controls Row: Quantity Selector + Order Now / Add to Cart CTA */}
                <div className="flex flex-wrap items-center gap-4 pt-2">
                  
                  {/* Quantity Stepper */}
                  <div className="flex items-center space-x-3 bg-white border border-[#E5E5E5] px-3 py-2 rounded-full shadow-xs">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="p-1 hover:text-[#F26A2E] text-brand-warmGray transition-colors"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="font-sans font-extrabold text-xs text-[#1A1A1A] min-w-[20px] text-center">
                      {String(quantity).padStart(2, '0')}
                    </span>
                    <button
                      onClick={() => setQuantity((q) => q + 1)}
                      className="p-1 hover:text-[#F26A2E] text-brand-warmGray transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Primary Order Now / Add to Cart Button */}
                  <button
                    onClick={() => addToCart(activeProduct, quantity)}
                    className="py-3 px-8 bg-[#F26A2E] text-white font-extrabold text-xs tracking-widest uppercase rounded-full hover:bg-[#E0591D] transition-colors shadow-md flex items-center justify-center gap-2"
                  >
                    <span>ADD TO CART</span>
                  </button>

                  {/* Wishlist Heart */}
                  <button
                    onClick={() => toggleWishlist(activeProduct)}
                    className={`p-3 rounded-full border transition-all ${
                      isInWishlist(activeProduct.id)
                        ? 'bg-brand-blush border-brand-dustyRose text-brand-dustyRose'
                        : 'bg-white border-[#E5E5E5] text-brand-warmGray hover:bg-brand-softBeige/40'
                    }`}
                    aria-label="Wishlist"
                  >
                    <Heart className={`w-4 h-4 ${isInWishlist(activeProduct.id) ? 'fill-brand-dustyRose' : ''}`} />
                  </button>
                </div>

                {/* Bottom Left Navigation Arrows (Previous / Next) */}
                <div className="flex items-center space-x-4 pt-4 text-xs font-extrabold text-[#1A1A1A] tracking-wider">
                  <button
                    onClick={handlePrevHero}
                    className="flex items-center gap-1.5 hover:text-[#F26A2E] transition-colors uppercase"
                  >
                    <span>← Previous</span>
                  </button>
                  <span className="text-brand-border">|</span>
                  <button
                    onClick={handleNextHero}
                    className="flex items-center gap-1.5 hover:text-[#F26A2E] transition-colors uppercase"
                  >
                    <span>Next →</span>
                  </button>
                </div>

              </motion.div>
            </AnimatePresence>

          </div>

          {/* RIGHT COLUMN STAGE: Half-Circle Dashed Arc & Giant Active Dish (Matching Reference Image 2) */}
          <div className="lg:col-span-6 relative h-[360px] sm:h-[440px] w-full flex items-center justify-center lg:justify-end">
            
            {/* Dashed Half-Circle Orbital Arc Path */}
            <div className="absolute right-[-40px] sm:right-[-60px] top-1/2 -translate-y-1/2 w-[340px] sm:w-[460px] h-[340px] sm:h-[460px] rounded-full border-2 border-dashed border-[#F26A2E]/30 pointer-events-none" />

            {/* Giant Center Stage Container for Active Product */}
            <motion.div 
              key={activeProduct.id}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              onClick={() => router.push(`/product/${activeProduct.name.toLowerCase().replace(/ /g, '-')}`)}
              className="relative z-20 w-[260px] sm:w-[360px] h-[260px] sm:h-[360px] rounded-full bg-white border border-[#EBF0EF] shadow-2xl flex items-center justify-center p-6 cursor-pointer group"
            >
              {/* Product Graphic (No Rotation Animation, Clean High-Res Image) */}
              {activeProduct.visualType === 'note' ? (
                <img 
                  src={activeProduct.image} 
                  alt={activeProduct.name} 
                  className="w-full h-auto object-contain rounded-lg shadow-md group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-48 h-48 sm:w-64 sm:h-64 flex items-center justify-center">
                  <ProductVisual 
                    type="coin"
                    color={activeProduct.visualColor || '#B89A67'}
                    pattern={activeProduct.visualPattern || 'antique-metallic'}
                    isRotating={false}
                  />
                </div>
              )}
            </motion.div>

            {/* Surrounding Orbital Items along the Half-Circle Arc */}
            {numProducts.map((product, i) => {
              const n = numProducts.length;
              let offset = (i - activeIndex + n) % n;
              if (offset > n / 2) offset -= n;
              if (offset === 0) return null; // Skip active center product

              // Compute position along left arc of half circle
              const arcAngle = (offset / (n - 1)) * (Math.PI * 0.8) - Math.PI * 0.4;
              const radius = 200;
              const posX = -Math.cos(arcAngle) * radius - 40;
              const posY = Math.sin(arcAngle) * radius;

              return (
                <motion.div
                  key={product.id}
                  onClick={() => {
                    setIsPaused(true);
                    setActiveIndex(i);
                    setTimeout(() => setIsPaused(false), 4000);
                  }}
                  animate={{ x: posX, y: posY }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute z-30 cursor-pointer"
                >
                  <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-white border border-[#E5E5E5] p-2 shadow-md hover:scale-110 transition-transform flex items-center justify-center overflow-hidden">
                    {product.visualType === 'note' ? (
                      <img src={product.image} alt={product.name} className="w-full h-full object-contain" />
                    ) : (
                      <ProductVisual type="coin" color={product.visualColor || '#B89A67'} pattern={product.visualPattern || 'antique-metallic'} isRotating={false} />
                    )}
                  </div>
                </motion.div>
              );
            })}

          </div>

        </div>
      </section>

      {/* ==================================================
          2. NEW ARRIVALS SECTION ("Fresh Finds for Collectors")
         ================================================== */}
      <section className="w-full py-14 px-4 md:px-12 lg:px-24 bg-white border-y border-[#EBF0EF]">
        <div className="max-w-7xl mx-auto space-y-8">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-[#EBF0EF] pb-4 gap-2 text-left">
            <div>
              <span className="text-[10px] text-[#F26A2E] font-extrabold tracking-[0.25em] uppercase block">
                FRESH VAULT ADDITIONS
              </span>
              <h2 className="font-display font-bold text-2xl sm:text-3xl text-[#1A1A1A] tracking-tight uppercase">
                NEW ARRIVALS
              </h2>
            </div>
            <button
              onClick={() => {
                const el = document.getElementById('explore-products');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="text-[10px] font-extrabold tracking-widest text-[#1A1A1A] hover:text-[#F26A2E] transition-colors flex items-center gap-1 uppercase"
            >
              <span>EXPLORE ALL</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Horizontal Scroll on Mobile, 4-col Grid on Web */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {numProducts.slice(2, 6).map((product) => {
              const inWish = isInWishlist(product.id);
              const slug = product.name.toLowerCase().replace(/ /g, '-');

              return (
                <div
                  key={product.id}
                  onClick={() => router.push(`/product/${slug}`)}
                  className="bg-[#F8F9FA] border border-[#EBF0EF] rounded-[24px] p-4 text-left flex flex-col justify-between cursor-pointer group hover:shadow-md transition-all relative overflow-hidden"
                >
                  <div className="w-full flex justify-center pt-2 pb-4">
                    <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-white border border-[#E5E5E5] p-3 flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform overflow-hidden">
                      {product.visualType === 'note' ? (
                        <img src={product.image} alt={product.name} className="w-full h-auto object-contain rounded" />
                      ) : (
                        <ProductVisual type="coin" color={product.visualColor || '#B89A67'} pattern={product.visualPattern || 'antique-metallic'} isRotating={false} />
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <span className="text-[8px] font-bold text-brand-warmGray tracking-widest uppercase block">{product.era || 'HISTORIC'}</span>
                    <h3 className="font-display font-bold text-xs sm:text-sm text-[#1A1A1A] group-hover:text-[#F26A2E] transition-colors line-clamp-1">
                      {product.name}
                    </h3>
                    <div className="flex items-center justify-between border-t border-[#F0F0F0] pt-2">
                      <span className="font-sans font-extrabold text-xs sm:text-sm text-[#1A1A1A]">₹{product.price.toLocaleString('en-IN')}</span>
                      <button
                        onClick={(e) => { e.stopPropagation(); addToCart(product, 1); }}
                        className="py-1 px-2.5 bg-[#F26A2E] text-white rounded-full text-[9px] font-bold uppercase"
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
          3. SHOP BY CATEGORY WITH CATEGORY IMAGES
         ================================================== */}
      <section className="w-full py-16 px-4 md:px-12 lg:px-24 bg-[#F8F9FA]">
        <div className="max-w-7xl mx-auto space-y-8 text-center">
          
          <div className="space-y-1">
            <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-[#1A1A1A] tracking-tight uppercase">
              SHOP BY CATEGORY
            </h2>
            <p className="text-xs text-brand-warmGray font-medium">
              Discover curated historical eras and numismatic artifacts
            </p>
          </div>

          {/* 8 Categories with Representative Images */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-4">
            {[
              { id: 'coins', name: 'COINS', desc: 'Historic Indian and world coinage', img: '/coin_image_new.png' },
              { id: 'notes', name: 'NOTES', desc: 'Preserved paper currency notes', img: '/images/inr-100-note.png' },
              { id: 'ancient-coins', name: 'ANCIENT COINS', desc: 'Punched mark & Mughal coinage', img: '/coin_image.jpg' },
              { id: 'british-india', name: 'BRITISH INDIA', desc: 'Victoria & George VI coin issues', img: '/coin_image_new.png' },
              { id: 'republic-india', name: 'REPUBLIC INDIA', desc: 'Post-1950 Indian coinage sets', img: '/coin_image.jpg' },
              { id: 'commemorative', name: 'COMMEMORATIVE', desc: 'Special issue milestone coins', img: '/coin_image_new.png' },
              { id: 'rare-coins', name: 'RARE COINS', desc: 'Exceedingly scarce mintages', img: '/coin_image.jpg' },
              { id: 'world-coins', name: 'WORLD COINS', desc: 'International archival numismatics', img: '/coin_image_new.png' },
            ].map((cat) => (
              <div
                key={cat.id}
                onClick={() => {
                  setSelectedPillCategory(cat.id);
                  const el = document.getElementById('explore-products');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="bg-white border border-[#EBF0EF] rounded-3xl p-5 text-center space-y-3 cursor-pointer group hover:shadow-md transition-all flex flex-col items-center justify-between"
              >
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#FAF7F2] border border-[#E5E5E5] p-3 flex items-center justify-center overflow-hidden shadow-xs group-hover:scale-105 transition-transform">
                  <img src={cat.img} alt={cat.name} className="w-full h-full object-contain" />
                </div>
                <div>
                  <span className="font-sans font-extrabold text-xs text-[#1A1A1A] group-hover:text-[#F26A2E] transition-colors block">
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
          4. EXPLORE PRODUCTS (4-Column Web / 2-Column Mobile Grid) (Matching Reference Image 1)
         ================================================== */}
      <section id="explore-products" className="w-full py-16 px-4 md:px-12 lg:px-24 bg-white border-t border-[#EBF0EF]">
        <div className="max-w-7xl mx-auto space-y-8 text-center">
          
          {/* Header Title & Subtitle */}
          <div className="space-y-2">
            <h2 className="font-display font-black text-3xl sm:text-4xl text-[#1A1A1A] tracking-tight uppercase">
              Explore Numismatics
            </h2>
            <p className="text-xs sm:text-sm text-brand-warmGray max-w-xl mx-auto font-medium">
              Discover our best-selling coins and notes, preserved for collectors with verified provenance registers.
            </p>
          </div>

          {/* Category Pill Tabs (Matching Reference Image 1) */}
          <div className="flex items-center justify-center gap-2 overflow-x-auto scrollbar-none py-1 px-4">
            {exploreCategoryPills.map((pill) => (
              <button
                key={pill.id}
                onClick={() => setSelectedPillCategory(pill.id)}
                className={`px-5 py-2 rounded-full text-xs font-extrabold transition-all whitespace-nowrap ${
                  selectedPillCategory === pill.id
                    ? 'bg-[#F26A2E] text-white shadow-sm'
                    : 'bg-[#F8F9FA] text-brand-warmGray border border-[#E5E5E5] hover:bg-brand-softBeige/40'
                }`}
              >
                {pill.label}
              </button>
            ))}
          </div>

          {/* 4-Column Web / 2-Column Mobile Product Grid (Matching Reference Image 1) */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 pt-4">
            {filteredExploreProducts.map((product) => {
              const inWish = isInWishlist(product.id);
              const slug = product.name.toLowerCase().replace(/ /g, '-');

              return (
                <div
                  key={product.id}
                  onClick={() => router.push(`/product/${slug}`)}
                  className="bg-[#F8F9FA] border border-[#EBF0EF] rounded-[24px] p-4 text-left flex flex-col justify-between cursor-pointer group hover:shadow-lg transition-all relative overflow-hidden"
                >
                  {/* Floating Circular Image Top Badge (Matching Reference Image 1) */}
                  <div className="w-full flex justify-center pt-2 pb-4">
                    <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-white border border-[#E5E5E5] p-3 flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform overflow-hidden">
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
                      inWish ? 'bg-brand-blush border-brand-dustyRose text-brand-dustyRose' : 'bg-white/80 border-[#E5E5E5] text-brand-warmGray'
                    }`}
                  >
                    <Heart className={`w-3.5 h-3.5 ${inWish ? 'fill-brand-dustyRose' : ''}`} />
                  </button>

                  {/* Product Details */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-display font-extrabold text-xs sm:text-sm text-[#1A1A1A] group-hover:text-[#F26A2E] transition-colors line-clamp-1">
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
                    <div className="flex items-center justify-between border-t border-[#F0F0F0] pt-3">
                      <span className="font-sans font-extrabold text-sm sm:text-base text-[#1A1A1A]">
                        ₹{product.price.toLocaleString('en-IN')}
                      </span>
                      
                      <button
                        onClick={(e) => { e.stopPropagation(); addToCart(product, 1); }}
                        className="py-1.5 px-3 bg-[#F26A2E] text-white font-extrabold text-[10px] uppercase tracking-wider rounded-full hover:bg-[#E0591D] transition-colors shadow-xs flex items-center gap-1"
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
              className="py-3 px-8 bg-[#1A1A1A] text-white font-extrabold text-xs tracking-widest uppercase rounded-full hover:bg-black transition-colors shadow-md inline-flex items-center gap-2"
            >
              <SlidersHorizontal className="w-4 h-4 text-[#F26A2E]" />
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
          6. REVIEWS SLIDER CAROUSEL ANIMATION
         ================================================== */}
      <section className="w-full py-16 px-4 md:px-12 lg:px-24 bg-[#F8F9FA]">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          
          <div className="space-y-1">
            <span className="text-[10px] text-[#F26A2E] font-extrabold tracking-[0.25em] uppercase block">
              VERIFIED FEEDBACK
            </span>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-[#1A1A1A] tracking-tight uppercase">
              COLLECTOR REVIEWS
            </h2>
          </div>

          {/* Review Glassmorphic Stage */}
          <div className="relative bg-white/70 backdrop-blur-md border border-white/80 p-8 sm:p-12 rounded-3xl min-h-[200px] flex flex-col justify-between shadow-xl shadow-brand-espresso/5">
            
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

                <p className="text-sm sm:text-base text-[#1A1A1A] font-medium leading-relaxed italic max-w-2xl mx-auto">
                  "{numismaticReviews[activeReviewIndex]?.text}"
                </p>

                <div className="pt-2">
                  <span className="font-sans font-extrabold text-sm text-[#1A1A1A] block">
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
                    activeReviewIndex === idx ? 'bg-[#F26A2E] w-6' : 'bg-[#E5E5E5]'
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
                <h3 className="font-display font-bold text-lg text-[#1A1A1A] uppercase">Full Catalog Filters</h3>
                <button onClick={() => setIsFilterDrawerOpen(false)} className="p-2 hover:bg-brand-softBeige rounded-full">
                  <X className="w-5 h-5 text-brand-espresso" />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="text-[10px] font-extrabold text-brand-warmGray uppercase tracking-widest mb-2">MATERIAL</h4>
                  {['all', 'silver', 'gold', 'paper', 'mixed metal'].map((mat) => (
                    <button
                      key={mat}
                      onClick={() => { setSelectedMaterialFilter(mat); setIsFilterDrawerOpen(false); }}
                      className={`block text-xs py-1.5 w-full text-left font-semibold ${selectedMaterialFilter === mat ? 'text-[#F26A2E] font-bold' : 'text-brand-warmGray'}`}
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
                      className={`block text-xs py-1.5 w-full text-left font-semibold ${selectedRarityFilter === r ? 'text-[#F26A2E] font-bold' : 'text-brand-warmGray'}`}
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
