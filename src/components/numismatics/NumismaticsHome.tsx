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
      discountBadge: '20% OFF'
    },
    {
      product: numProducts[0] || numProducts[0], // 1954 Republic One Rupee
      cardGradient: 'from-[#FBA858] to-[#EF8A24]', // Warm Amber / Orange Card
      categoryLabel: 'Republic India',
      discountBadge: '30% OFF'
    },
    {
      product: numProducts[2] || numProducts[1], // British India 100 Rupee Note
      cardGradient: 'from-[#7CD585] to-[#55B75F]', // Sage / Leaf Green Card
      categoryLabel: 'Paper Currency',
      discountBadge: '25% OFF'
    },
    {
      product: numProducts[3] || numProducts[2], // Queen Victoria Two Annas
      cardGradient: 'from-[#7B73F0] to-[#584FE3]', // Rich Violet / Indigo Card
      categoryLabel: 'British India',
      discountBadge: '20% OFF'
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
      const cardWidth = 180;
      heroCardsScrollRef.current.scrollTo({ left: newIdx * cardWidth, behavior: 'smooth' });
    }
    setTimeout(() => setIsPaused(false), 4500);
  };

  const handleNextHero = () => {
    setIsPaused(true);
    const newIdx = (heroActiveIndex + 1) % heroFeaturedCoins.length;
    setHeroActiveIndex(newIdx);
    if (heroCardsScrollRef.current) {
      const cardWidth = 180;
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

  // --------------------------------------------------
  // 3. CATEGORIES DATA (User-Provided Images & Authentic Titles Only)
  // --------------------------------------------------
  const categoryRow1 = [
    {
      id: 'east-india-company',
      name: 'East India Co.',
      tag: 'Gold Two Mohurs',
      desc: 'Rare 1835 William IV gold mohurs with royal palm & lion crest.',
      count: '85+ Items',
      price: 'From ₹18,500',
      img: '/images/categories/east-india-company.jpg'
    },
    {
      id: 'mughal-zodiac',
      name: 'Mughal Zodiac',
      tag: 'Jahangir Mohur',
      desc: 'Legendary Aries ram gold mohur struck under Emperor Jahangir.',
      count: '60+ Items',
      price: 'From ₹24,000',
      img: '/images/categories/mughal-zodiac.png'
    },
    {
      id: 'british-india',
      name: 'British India',
      tag: 'Victoria Queen',
      desc: 'Imperial crowned portraits of Queen Victoria & silver rupees.',
      count: '140+ Items',
      price: 'From ₹4,500',
      img: '/images/categories/victoria-queen.jpg'
    },
    {
      id: 'ancient-coins',
      name: 'Ancient India',
      tag: 'Goddess Lakshmi',
      desc: 'Sacred archaic gold dinars depicting seated Goddess Lakshmi.',
      count: '110+ Items',
      price: 'From ₹8,900',
      img: '/images/categories/ancient-lakshmi.jpg'
    }
  ];

  const categoryRow2 = [
    {
      id: 'commemorative',
      name: 'Commemorative',
      tag: 'Republic ₹100',
      desc: 'Official 100 Rupees silver commemorative proof with Ashoka Lion.',
      count: '95+ Items',
      price: 'From ₹1,800',
      img: '/images/categories/commemorative-100.jpg'
    },
    {
      id: 'notes',
      name: 'Paper Currency',
      tag: '1914 Banknote',
      desc: 'Preserved 1914 Government of India 100 Rupees archival banknote.',
      count: '75+ Items',
      price: 'From ₹3,200',
      img: '/images/categories/gov-india-100-note.jpg'
    },
    {
      id: 'princely-states',
      name: 'Princely States',
      tag: 'Awadh Kingdom',
      desc: 'Royal silver rupee with twin fish emblem & crown of Awadh kingdom.',
      count: '80+ Items',
      price: 'From ₹2,900',
      img: '/images/categories/princely-states-awadh.jpg'
    },
    {
      id: 'square-mohurs',
      name: 'Square Mohurs',
      tag: 'Akbar The Great',
      desc: 'Calligraphic heavy gold square mohurs of Emperor Akbar the Great.',
      count: '50+ Items',
      price: 'From ₹32,000',
      img: '/images/categories/mughal-square-mohur.jpg'
    }
  ];

  // --------------------------------------------------
  // 4. PROMOTIONAL BANNER CAROUSEL STATE (Loop, Swipe & Arrows)
  // --------------------------------------------------
  const numismaticBanners = [
    {
      id: 'heritage-treasures',
      title: 'Indian Heritage. Timeless Treasures.',
      subtitle: 'Authentic Coins • Rare Notes • Historic Value',
      img: '/images/banners/banner-heritage-treasures.png',
      link: '/catalog?department=numismatics'
    },
    {
      id: 'authenticity-trust',
      title: 'Authenticity. Assurance. Trust.',
      subtitle: 'Every piece is verified by experts for genuine value and authenticity.',
      img: '/images/banners/banner-authenticity-trust.jpg',
      link: '/catalog?department=numismatics'
    },
    {
      id: 'secure-delivery',
      title: 'Secure Delivery. Safe Arrival.',
      subtitle: 'Your collectibles are packed with care and delivered with complete safety.',
      img: '/images/banners/banner-secure-delivery.png',
      link: '/catalog?department=numismatics'
    },
    {
      id: 'numismatic-events',
      title: 'Join Our Numismatic Events',
      subtitle: 'Connect. Learn. Collect.',
      img: '/images/banners/banner-numismatic-events.jpg',
      link: '/catalog?department=numismatics'
    }
  ];

  const [activeBannerIdx, setActiveBannerIdx] = useState(0);
  const [isBannerPaused, setIsBannerPaused] = useState(false);
  const [bannerTouchStartX, setBannerTouchStartX] = useState<number | null>(null);
  const [bannerTouchEndX, setBannerTouchEndX] = useState<number | null>(null);

  // Auto loop every 5s
  useEffect(() => {
    if (isBannerPaused || numismaticBanners.length === 0) return;
    const timer = setInterval(() => {
      setActiveBannerIdx((prev) => (prev + 1) % numismaticBanners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [isBannerPaused, numismaticBanners.length]);

  const handlePrevBanner = () => {
    setIsBannerPaused(true);
    setActiveBannerIdx((prev) => (prev - 1 + numismaticBanners.length) % numismaticBanners.length);
    setTimeout(() => setIsBannerPaused(false), 4500);
  };

  const handleNextBanner = () => {
    setIsBannerPaused(true);
    setActiveBannerIdx((prev) => (prev + 1) % numismaticBanners.length);
    setTimeout(() => setIsBannerPaused(false), 4500);
  };

  const handleBannerTouchStart = (e: React.TouchEvent) => {
    setBannerTouchEndX(null);
    setBannerTouchStartX(e.targetTouches[0].clientX);
    setIsBannerPaused(true);
  };

  const handleBannerTouchMove = (e: React.TouchEvent) => {
    setBannerTouchEndX(e.targetTouches[0].clientX);
  };

  const handleBannerTouchEnd = () => {
    if (bannerTouchStartX === null || bannerTouchEndX === null) return;
    const distance = bannerTouchStartX - bannerTouchEndX;
    if (distance > 40) {
      handleNextBanner(); // Swiped left -> next
    } else if (distance < -40) {
      handlePrevBanner(); // Swiped right -> prev
    }
    setTimeout(() => setIsBannerPaused(false), 4000);
  };

  return (
    <div className="w-full max-w-full min-h-screen bg-[#FFFBF8] text-brand-espresso select-none overflow-x-hidden">

      {/* ==================================================
          1. FULL SCREEN FIT HERO SECTION (Desktop & Mobile) - BEST SELLERS SHOWCASE
         ================================================== */}
      <section 
        id="best-sellers"
        className="w-full min-h-[calc(100vh-72px)] flex flex-col justify-center py-4 sm:py-6 md:py-8 px-3 sm:px-6 md:px-12 lg:px-16 bg-gradient-to-b from-[#FFF5EC] via-[#FFF8F3] to-[#FFFBF8] relative overflow-hidden"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Soft Ambient Warm Glow Elements */}
        <div className="absolute top-6 right-8 w-[450px] h-[450px] rounded-full bg-[#FCE5D3]/60 blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 left-4 w-72 h-72 rounded-full bg-[#FFF0E0]/80 blur-2xl pointer-events-none" />

        <div className="max-w-7xl mx-auto w-full my-auto space-y-4 sm:space-y-6 md:space-y-7 relative z-10">
          
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
                  {/* BEST SELLERS SHOWCASE BADGE & TITLE */}
                  <div className="flex items-center gap-2">
                    <span className="text-[8px] sm:text-[9px] md:text-[10px] font-black tracking-[0.25em] bg-[#E0591D] text-white px-2.5 py-0.5 rounded-full uppercase shadow-xs flex items-center gap-1.5">
                      <Sparkles className="w-3 h-3 fill-current" />
                      <span>BEST SELLERS SHOWCASE</span>
                    </span>
                    <span className="text-[8px] sm:text-[9px] text-[#7D736A] font-bold uppercase tracking-wider hidden sm:inline">
                      Vault Highlights
                    </span>
                  </div>

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
                  {/* RED 20% or 30% DISCOUNT BADGE ON TOP-RIGHT */}
                  <div className="absolute top-1 sm:top-2 right-1 sm:right-2 z-30 w-12 h-12 sm:w-15 sm:h-15 md:w-17 md:h-17 rounded-full bg-[#E53935] text-white flex flex-col items-center justify-center shadow-xl font-display font-black border-2 border-white rotate-6">
                    <span className="text-xs sm:text-sm md:text-base font-black leading-none">
                      {currentHeroItem.discountBadge.includes('OFF') ? currentHeroItem.discountBadge.replace(' OFF', '') : '30%'}
                    </span>
                    <span className="text-[7px] sm:text-[8px] md:text-[9px] font-black tracking-wider leading-none uppercase mt-0.5">
                      OFF
                    </span>
                  </div>

                  {/* Main Circular Coin Presentation Stage */}
                  <div 
                    onClick={() => router.push(`/product/${activeHeroProduct.name.toLowerCase().replace(/ /g, '-')}`)}
                    className="w-[150px] sm:w-[210px] md:w-[270px] lg:w-[320px] h-[150px] sm:h-[210px] md:h-[270px] lg:h-[320px] rounded-full bg-[#FFFDFB] border-4 sm:border-6 lg:border-8 border-white p-1.5 sm:p-2.5 md:p-3 shadow-xl sm:shadow-2xl flex items-center justify-center cursor-pointer group relative overflow-hidden"
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

                </motion.div>
              </AnimatePresence>

            </div>

          </div>

          {/* LOWER HERO CAROUSEL: Floating White Container with 4 Vibrant Cards (Enlarged Coins) */}
          <div className="relative max-w-5xl mx-auto bg-white rounded-[22px] sm:rounded-[32px] md:rounded-[40px] p-3 sm:p-5 md:p-6 shadow-xl shadow-black/5 border border-[#F0EAE1]">
            
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
              className="flex overflow-x-auto gap-3 sm:gap-4 md:grid md:grid-cols-4 md:gap-4 lg:gap-5 pt-8 sm:pt-10 md:pt-11 pb-1 scrollbar-none snap-x snap-mandatory touch-pan-x w-full scroll-smooth"
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
                    className={`flex-shrink-0 w-[155px] sm:w-[185px] md:w-auto snap-start bg-gradient-to-b ${item.cardGradient} rounded-[20px] sm:rounded-[26px] p-2.5 sm:p-3.5 text-left flex flex-col justify-between cursor-pointer transition-all duration-300 relative ${
                      isSelected 
                        ? 'ring-3 sm:ring-4 ring-[#E0591D]/30 shadow-2xl scale-[1.02] -translate-y-0.5' 
                        : 'shadow-md hover:scale-[1.01] opacity-90 hover:opacity-100'
                    }`}
                  >
                    {/* Floating Circular Coin on Top (ENLARGED & CLEARLY VISIBLE) */}
                    <div className="w-full flex justify-center -mt-12 sm:-mt-14 md:-mt-16 mb-1 sm:mb-2">
                      <div className="w-18 h-18 sm:w-22 sm:h-22 md:w-24 md:h-24 rounded-full bg-white p-1 sm:p-1.5 shadow-xl flex items-center justify-center overflow-hidden border-2 sm:border-3 border-white">
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
      <section id="new-arrivals" className="w-full py-12 md:py-16 px-4 md:px-12 lg:px-24 bg-brand-warmWhite border-b border-brand-border/40 overflow-hidden">
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
                <ArrowRight className="w-3.5 h-3.5" />
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
          3. SHOP BY CATEGORY (2 Animated Sliding Rows Matching media_1788422746488.png)
         ================================================== */}
      <section id="categories" className="w-full py-12 md:py-20 px-3 sm:px-6 md:px-12 lg:px-20 bg-gradient-to-b from-[#FFFDFB] to-[#FAF5EE] overflow-hidden">
        <div className="max-w-7xl mx-auto space-y-8 md:space-y-12">
          
          {/* Header Title (Matching media_1788422746488.png) */}
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="font-display font-black text-2xl sm:text-3xl md:text-5xl text-[#2B231D] tracking-tight uppercase">
              Curated Numismatic Categories
            </h2>
            <p className="text-xs sm:text-sm text-[#7D736A] font-medium leading-relaxed">
              Discover our distinguished range of rare historical coinages, crafted across ancient dynasties and royal mints.
            </p>
          </div>

          {/* TWO SLIDING TRACKS */}
          <div className="space-y-6 sm:space-y-8 md:space-y-10">

            {/* TRACK 1: SLOW LEFT-TO-RIGHT SLIDE (Pauses ONLY Track 1 on hover) */}
            <div className="relative group/track1 overflow-hidden w-full">
              <div className="flex w-max animate-marquee-reverse-slow group-hover/track1:[animation-play-state:paused] ease-linear hover:[animation-play-state:paused] touch-pan-x">
                {[...categoryRow1, ...categoryRow1, ...categoryRow1].map((cat, idx) => (
                  <div
                    key={`row1-${cat.id}-${idx}`}
                    onClick={() => router.push(`/catalog?department=numismatics&category=${cat.id}`)}
                    className="w-[200px] sm:w-[240px] md:w-[270px] mx-2.5 sm:mx-4 flex-shrink-0 cursor-pointer text-center group/card transition-all duration-300"
                  >
                    {/* Circular Plate with Glow Background (Matching media_1788422746488.png) */}
                    <div className="w-36 h-36 sm:w-44 sm:h-44 md:w-48 md:h-48 rounded-full bg-gradient-to-b from-[#FFF5DC] via-[#FFEBC2] to-[#FEDE9A] p-2.5 sm:p-3 mx-auto relative shadow-lg group-hover/card:scale-105 group-hover/card:shadow-xl transition-all duration-300 flex items-center justify-center border-2 border-white/60">
                      <img
                        src={cat.img}
                        alt={cat.name}
                        className="w-full h-full object-contain rounded-full drop-shadow-md transition-transform duration-300 group-hover/card:rotate-3"
                      />
                      {/* Frosted Title Ribbon across middle/lower part (Matching media_1788422746488.png) */}
                      <div className="absolute inset-x-2.5 bottom-5 sm:bottom-7 bg-[#2B231D]/85 backdrop-blur-md text-white py-1 sm:py-1.5 px-2 rounded-lg text-center shadow-lg border border-white/20">
                        <span className="font-display font-black text-xs sm:text-sm tracking-wide block uppercase line-clamp-1">
                          {cat.name}
                        </span>
                      </div>
                    </div>

                    {/* Subtitle & Details */}
                    <div className="pt-3 space-y-1.5 px-2">
                      <p className="text-[11px] sm:text-xs text-[#666666] font-medium line-clamp-2 leading-relaxed h-8">
                        {cat.desc}
                      </p>
                      <div className="flex items-center justify-center gap-2 pt-1">
                        <span className="text-[11px] sm:text-xs font-bold text-[#E0591D]">
                          {cat.count}
                        </span>
                        <button className="px-3 py-1 bg-[#8B261D] hover:bg-[#6D1B13] text-white text-[10px] font-black uppercase tracking-wider rounded-full shadow-xs transition-colors">
                          Explore &gt;
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* TRACK 2: SLOW RIGHT-TO-LEFT SLIDE (Pauses ONLY Track 2 on hover) */}
            <div className="relative group/track2 overflow-hidden w-full">
              <div className="flex w-max animate-marquee-slow group-hover/track2:[animation-play-state:paused] ease-linear hover:[animation-play-state:paused] touch-pan-x">
                {[...categoryRow2, ...categoryRow2, ...categoryRow2].map((cat, idx) => (
                  <div
                    key={`row2-${cat.id}-${idx}`}
                    onClick={() => router.push(`/catalog?department=numismatics&category=${cat.id}`)}
                    className="w-[200px] sm:w-[240px] md:w-[270px] mx-2.5 sm:mx-4 flex-shrink-0 cursor-pointer text-center group/card transition-all duration-300"
                  >
                    {/* Circular Plate with Glow Background (Matching media_1788422746488.png) */}
                    <div className="w-36 h-36 sm:w-44 sm:h-44 md:w-48 md:h-48 rounded-full bg-gradient-to-b from-[#FFF5DC] via-[#FFEBC2] to-[#FEDE9A] p-2.5 sm:p-3 mx-auto relative shadow-lg group-hover/card:scale-105 group-hover/card:shadow-xl transition-all duration-300 flex items-center justify-center border-2 border-white/60">
                      <img
                        src={cat.img}
                        alt={cat.name}
                        className="w-full h-full object-contain rounded-full drop-shadow-md transition-transform duration-300 group-hover/card:rotate-3"
                      />
                      {/* Frosted Title Ribbon across middle/lower part (Matching media_1788422746488.png) */}
                      <div className="absolute inset-x-2.5 bottom-5 sm:bottom-7 bg-[#2B231D]/85 backdrop-blur-md text-white py-1 sm:py-1.5 px-2 rounded-lg text-center shadow-lg border border-white/20">
                        <span className="font-display font-black text-xs sm:text-sm tracking-wide block uppercase line-clamp-1">
                          {cat.name}
                        </span>
                      </div>
                    </div>

                    {/* Subtitle & Details */}
                    <div className="pt-3 space-y-1.5 px-2">
                      <p className="text-[11px] sm:text-xs text-[#666666] font-medium line-clamp-2 leading-relaxed h-8">
                        {cat.desc}
                      </p>
                      <div className="flex items-center justify-center gap-2 pt-1">
                        <span className="text-[11px] sm:text-xs font-bold text-[#E0591D]">
                          {cat.count}
                        </span>
                        <button className="px-3 py-1 bg-[#8B261D] hover:bg-[#6D1B13] text-white text-[10px] font-black uppercase tracking-wider rounded-full shadow-xs transition-colors">
                          Explore &gt;
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Bottom Browse All CTA */}
          <div className="text-center pt-2">
            <button
              onClick={() => router.push('/catalog?department=numismatics')}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-brand-border bg-white text-xs font-black uppercase tracking-widest text-[#2B231D] hover:bg-[#2B231D] hover:text-white transition-all shadow-xs"
            >
              <span>Browse All Categories</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      </section>

      {/* ==================================================
          4. NUMISMATICS BANNER SECTION (4 Luxury Banners with Auto Loop, Phone Swipe & Web Arrows)
         ================================================== */}
      <section className="w-full py-6 sm:py-10 md:py-12 px-3 sm:px-6 md:px-10 lg:px-12 bg-brand-warmWhite overflow-hidden">
        <div className="max-w-7xl mx-auto">
          
          {/* Banner Outer Container (Fully Fitted to Screen) */}
          <div 
            className="relative w-full aspect-[2/1] sm:aspect-[2.1/1] md:aspect-[2.3/1] lg:aspect-[2.4/1] rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border border-[#EAE2D5]/80 bg-[#16212B] select-none group"
            onMouseEnter={() => setIsBannerPaused(true)}
            onMouseLeave={() => setIsBannerPaused(false)}
            onTouchStart={handleBannerTouchStart}
            onTouchMove={handleBannerTouchMove}
            onTouchEnd={handleBannerTouchEnd}
          >
            {/* Animated Banner Transition */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeBannerIdx}
                initial={{ opacity: 0, scale: 0.99 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.01 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                onClick={() => router.push(numismaticBanners[activeBannerIdx].link)}
                className="w-full h-full cursor-pointer relative"
              >
                <img 
                  src={numismaticBanners[activeBannerIdx].img} 
                  alt={numismaticBanners[activeBannerIdx].title}
                  className="w-full h-full object-fill sm:object-cover rounded-2xl sm:rounded-3xl"
                  loading="eager"
                />
              </motion.div>
            </AnimatePresence>

            {/* Left Web Arrow Navigation */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handlePrevBanner();
              }}
              className="absolute left-2 sm:left-4 md:left-6 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-md border border-white/30 shadow-xl flex items-center justify-center transition-all z-30 opacity-80 hover:opacity-100 hover:scale-105"
              aria-label="Previous Banner"
            >
              <ChevronLeft className="w-4 h-4 sm:w-6 sm:h-6" />
            </button>

            {/* Right Web Arrow Navigation */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleNextBanner();
              }}
              className="absolute right-2 sm:right-4 md:right-6 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-md border border-white/30 shadow-xl flex items-center justify-center transition-all z-30 opacity-80 hover:opacity-100 hover:scale-105"
              aria-label="Next Banner"
            >
              <ChevronRight className="w-4 h-4 sm:w-6 sm:h-6" />
            </button>

            {/* Bottom Dots Indicator */}
            <div className="absolute bottom-2.5 sm:bottom-4 md:bottom-5 inset-x-0 flex justify-center items-center gap-1.5 sm:gap-2 z-30 pointer-events-auto">
              {numismaticBanners.map((banner, idx) => (
                <button
                  key={banner.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsBannerPaused(true);
                    setActiveBannerIdx(idx);
                    setTimeout(() => setIsBannerPaused(false), 4500);
                  }}
                  className={`transition-all duration-300 rounded-full ${
                    activeBannerIdx === idx
                      ? 'w-6 sm:w-8 h-1.5 sm:h-2 bg-[#E0591D] shadow-md shadow-[#E0591D]/60'
                      : 'w-2 sm:w-2.5 h-1.5 sm:h-2 bg-white/70 hover:bg-white'
                  }`}
                  aria-label={`Go to banner ${idx + 1}`}
                />
              ))}
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

            {/* Desktop Navigation & Filters */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => router.push('/catalog?department=numismatics')}
                className="px-4 py-2 bg-[#2B231D] text-white rounded-full text-xs font-bold hover:bg-black transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer mr-1"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-[#E0591D]" />
                <span>Filters</span>
              </button>

              <button
                onClick={() => scrollExplore('left')}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-brand-border bg-white text-brand-espresso hover:bg-brand-softBeige/40 flex items-center justify-center transition-colors shadow-xs cursor-pointer"
                aria-label="Scroll left"
              >
                <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              <button
                onClick={() => scrollExplore('right')}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-brand-border bg-white text-brand-espresso hover:bg-brand-softBeige/40 flex items-center justify-center transition-colors shadow-xs cursor-pointer"
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
