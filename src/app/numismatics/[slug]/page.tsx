"use client";

import React, { use, useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { PRODUCTS, Product } from '@/data/mockData';
import { ProductVisual } from '@/components/ui/ProductVisual';
import { 
  Heart, 
  ShoppingBag, 
  ArrowLeft, 
  ChevronDown, 
  ChevronUp, 
  Star, 
  RotateCcw, 
  Truck, 
  Award,
  Maximize2,
  X,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function NumismaticDetailPage({ params }: PageProps) {
  const router = useRouter();
  const { slug } = use(params);
  const { addToCart, toggleWishlist, isInWishlist } = useApp();

  // Find product by slug name
  const product = PRODUCTS.find(
    (p) => p.name.toLowerCase().replace(/ /g, '-') === slug
  );

  // Two-way Route Safeguard: If a fashion product is accessed here, redirect to fashion PDP
  useEffect(() => {
    if (product && product.department === 'fashion') {
      router.replace(`/product/${slug}`);
    }
  }, [product, slug, router]);

  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [isDetailsExpanded, setIsDetailsExpanded] = useState(false);

  // Gallery, Zoom, and Lightbox states
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [isGalleryOpen, setGalleryOpen] = useState(false);

  const holdTimerRef = useRef<NodeJS.Timeout | null>(null);
  const touchStartXRef = useRef<number | null>(null);
  const touchStartYRef = useRef<number | null>(null);
  const isSwipingRef = useRef(false);

  const productImages = product?.images && product.images.length > 0 
    ? product.images 
    : (product ? [product.image] : []);

  // Reset zoom state whenever image, product, or slug changes
  useEffect(() => {
    setIsZoomed(false);
    if (holdTimerRef.current) {
      clearTimeout(holdTimerRef.current);
      holdTimerRef.current = null;
    }
  }, [activeImageIndex, slug]);

  const startHold = () => {
    if (holdTimerRef.current) clearTimeout(holdTimerRef.current);
    holdTimerRef.current = setTimeout(() => {
      setIsZoomed(true);
    }, 220); // Intentional hold threshold (medium sensitivity)
  };

  const cancelHold = () => {
    if (holdTimerRef.current) {
      clearTimeout(holdTimerRef.current);
      holdTimerRef.current = null;
    }
    setIsZoomed(false);
  };

  // Safe image switching (strictly resets zoom)
  const handlePrevImage = () => {
    cancelHold();
    if (productImages.length > 0) {
      setActiveImageIndex((prev) => (prev - 1 + productImages.length) % productImages.length);
    }
  };

  const handleNextImage = () => {
    cancelHold();
    if (productImages.length > 0) {
      setActiveImageIndex((prev) => (prev + 1) % productImages.length);
    }
  };

  const handleSelectThumbnail = (idx: number) => {
    cancelHold();
    setActiveImageIndex(idx);
  };

  // Mobile touch handlers for swipe navigation + touch-and-hold zoom
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStartXRef.current = touch.clientX;
    touchStartYRef.current = touch.clientY;
    isSwipingRef.current = false;
    startHold();
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null || touchStartYRef.current === null) return;
    const touch = e.touches[0];
    const diffX = touch.clientX - touchStartXRef.current;
    const diffY = touch.clientY - touchStartYRef.current;

    // If movement is detected, cancel hold zoom immediately
    if (Math.abs(diffX) > 12 || Math.abs(diffY) > 12) {
      isSwipingRef.current = true;
      cancelHold();
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    cancelHold();

    if (touchStartXRef.current !== null && touchStartYRef.current !== null) {
      const touch = e.changedTouches[0];
      const diffX = touch.clientX - touchStartXRef.current;
      const diffY = touch.clientY - touchStartYRef.current;

      // Natural horizontal swipe (threshold: 35px, horizontal dominant)
      if (Math.abs(diffX) > 35 && Math.abs(diffX) > Math.abs(diffY)) {
        if (diffX < 0) {
          handleNextImage();
        } else {
          handlePrevImage();
        }
      }
    }

    touchStartXRef.current = null;
    touchStartYRef.current = null;
    isSwipingRef.current = false;
  };

  if (!product) {
    return (
      <div className="w-full min-h-screen flex flex-col items-center justify-center bg-brand-warmWhite text-brand-espresso p-6">
        <h2 className="font-display font-bold text-lg tracking-widest uppercase">COLLECTION ITEM NOT FOUND</h2>
        <button
          onClick={() => router.push('/numismatics')}
          className="mt-4 px-6 py-2.5 bg-[#F26A2E] text-white text-xs font-bold tracking-widest uppercase rounded-lg cursor-pointer"
        >
          RETURN TO NUMISMATICS
        </button>
      </div>
    );
  }

  // If this is a fashion product, render nothing while router redirects
  if (product.department === 'fashion') {
    return null;
  }

  const inWishlist = isInWishlist(product.id);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  // Related numismatic collectibles (Numismatics ONLY)
  const relatedProducts = PRODUCTS.filter(
    (p) => p.department === 'numismatics' && p.id !== product.id
  ).slice(0, 4);

  return (
    <div className="w-full min-h-screen bg-brand-warmWhite py-12 px-4 md:px-12 lg:px-24 text-brand-espresso text-left select-none">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* Back navigation */}
        <div className="flex items-center justify-between border-b border-brand-border/40 pb-4">
          <button
            onClick={() => router.push('/numismatics')}
            className="flex items-center gap-1.5 text-xs font-bold tracking-widest text-brand-warmGray hover:text-[#F26A2E] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>BACK TO NUMISMATICS GALLERY</span>
          </button>
          <span className="text-[10px] text-[#F26A2E] font-extrabold tracking-[0.25em] uppercase">
            AADHYA {product.department.toUpperCase()}
          </span>
        </div>

        {/* ==================================================
            1. PRIMARY PURCHASE AREA
           ================================================== */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-12 items-start">
          
          {/* Left Column: Image Canvas (6 cols) */}
          <div className="md:col-span-6 bg-brand-white p-4 sm:p-6 md:p-8 border border-brand-border/60 rounded-3xl relative flex flex-col items-center justify-center min-h-[380px] md:min-h-[460px] shadow-sm overflow-hidden select-none">
            {/* Rarity Tag */}
            <div className="absolute top-4 left-4 z-20 pointer-events-none">
              <span className="text-[9px] bg-brand-espresso text-brand-gold font-extrabold tracking-widest px-3 py-1 rounded-full shadow-xs uppercase">
                {product.rarity || 'RARE'}
              </span>
            </div>

            {/* Maximize / Lightbox Action */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                cancelHold();
                setGalleryOpen(true);
              }}
              onMouseDown={(e) => e.stopPropagation()}
              onTouchStart={(e) => e.stopPropagation()}
              className="absolute top-4 right-4 z-20 p-2 bg-white/90 hover:bg-white border border-brand-border/30 rounded-full shadow-sm text-brand-espresso transition-all hover:scale-105 active:scale-95 cursor-pointer pointer-events-auto"
              aria-label="View fullscreen artifact"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>

            {/* Left & Right Navigation Arrows (Always visible and usable) */}
            {productImages.length > 1 && (
              <>
                <button
                  onMouseDown={(e) => e.stopPropagation()}
                  onTouchStart={(e) => e.stopPropagation()}
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePrevImage();
                  }}
                  className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 z-20 p-2.5 sm:p-3 bg-white/95 hover:bg-white text-brand-espresso border border-brand-border/40 rounded-full shadow-md hover:shadow-lg transition-all hover:scale-105 active:scale-95 cursor-pointer pointer-events-auto flex items-center justify-center"
                  aria-label="Previous artifact image"
                >
                  <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-brand-espresso" />
                </button>
                <button
                  onMouseDown={(e) => e.stopPropagation()}
                  onTouchStart={(e) => e.stopPropagation()}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNextImage();
                  }}
                  className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 z-20 p-2.5 sm:p-3 bg-white/95 hover:bg-white text-brand-espresso border border-brand-border/40 rounded-full shadow-md hover:shadow-lg transition-all hover:scale-105 active:scale-95 cursor-pointer pointer-events-auto flex items-center justify-center"
                  aria-label="Next artifact image"
                >
                  <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-brand-espresso" />
                </button>
              </>
            )}

            {/* Main Collectible Display Area — NO automatic hover zoom, press-and-hold zoom ONLY */}
            <div 
              onMouseDown={startHold}
              onMouseUp={cancelHold}
              onMouseLeave={cancelHold}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              onTouchCancel={cancelHold}
              onContextMenu={(e) => e.preventDefault()}
              className="w-full h-[280px] sm:h-[320px] md:h-[360px] flex items-center justify-center p-4 relative overflow-hidden select-none touch-pan-y cursor-grab active:cursor-grabbing"
            >
              {/* Centered Image / Visual with Medium Zoom on Intentional Hold ONLY */}
              <div 
                className={`w-full h-full flex items-center justify-center transition-transform duration-300 ease-out origin-center pointer-events-none select-none ${
                  isZoomed ? 'scale-[1.5]' : 'scale-100'
                }`}
              >
                {product.visualType === 'note' ? (
                  <img 
                    src={productImages[activeImageIndex]} 
                    alt={product.name} 
                    className="max-w-full max-h-full object-contain drop-shadow-md rounded-lg"
                    loading="eager"
                  />
                ) : productImages[activeImageIndex] && (productImages[activeImageIndex].startsWith('/') || productImages[activeImageIndex].startsWith('http')) ? (
                  <img 
                    src={productImages[activeImageIndex]} 
                    alt={product.name} 
                    className="max-w-[240px] sm:max-w-[270px] md:max-w-[290px] max-h-full object-contain drop-shadow-lg rounded-full"
                    loading="eager"
                  />
                ) : (
                  <ProductVisual
                    type="coin"
                    color={product.visualColor || '#B89A67'}
                    pattern={product.visualPattern || 'antique-metallic'}
                  />
                )}
              </div>
            </div>

            {/* Zoom & Navigation Hint */}
            <span className="text-[9px] sm:text-[10px] text-brand-warmGray/80 font-medium tracking-wider text-center block pt-1 pointer-events-none">
              Press & hold to zoom • Swipe or use arrows to view angles
            </span>

            {/* Thumbnail switcher if multiple images available */}
            {productImages.length > 1 && (
              <div className="flex gap-2 pt-3 z-10">
                {productImages.map((img, idx) => (
                  <button
                    key={idx}
                    onMouseDown={(e) => e.stopPropagation()}
                    onTouchStart={(e) => e.stopPropagation()}
                    onClick={() => handleSelectThumbnail(idx)}
                    className={`w-12 h-12 rounded-xl border p-1 overflow-hidden transition-all cursor-pointer bg-white ${
                      activeImageIndex === idx 
                        ? 'border-[#F26A2E] ring-2 ring-[#F26A2E]/30 scale-105 shadow-xs' 
                        : 'border-brand-border/40 opacity-70 hover:opacity-100 hover:border-brand-border'
                    }`}
                    aria-label={`View angle ${idx + 1}`}
                  >
                    <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-contain pointer-events-none" />
                  </button>
                ))}
              </div>
            )}

            <div className="text-[9px] font-extrabold text-brand-warmGray tracking-widest uppercase mt-3">
              ✦ Certified Authentic Historical Artifact
            </div>
          </div>

          {/* Right Column: Spec sheet & purchase actions (6 cols) */}
          <div className="md:col-span-6 space-y-6">
            
            <div className="space-y-2">
              <span className="text-[10px] text-[#F26A2E] font-extrabold tracking-[0.25em] uppercase block">
                {product.category}
              </span>
              <h1 className="font-display font-bold text-2xl sm:text-3xl md:text-4xl text-brand-espresso leading-tight uppercase">
                {product.name}
              </h1>

              {/* Price row */}
              <div className="flex items-baseline space-x-3 pt-2">
                <span className="text-2xl sm:text-3xl font-extrabold text-brand-espresso">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
                <span className="text-base text-brand-warmGray line-through font-semibold">
                  ₹{product.mrp.toLocaleString('en-IN')}
                </span>
                <span className="text-[10px] bg-[#F26A2E]/10 text-[#F26A2E] font-extrabold px-2.5 py-0.5 rounded">
                  SAVE {product.discount}%
                </span>
              </div>
            </div>

            {/* Description */}
            <p className="text-xs text-brand-warmGray leading-relaxed font-semibold tracking-wider">
              {product.description}
            </p>

            {/* Key Historical Specs Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-[#FAF7F2] p-5 border border-brand-border/40 rounded-2xl text-[10px] tracking-wider font-semibold text-brand-espresso">
              <div>
                <span className="text-brand-warmGray block uppercase">PRODUCT NO</span>
                <span className="font-extrabold text-xs">{product.productNo || 'NP-201'}</span>
              </div>
              <div>
                <span className="text-brand-warmGray block uppercase">MINT YEAR</span>
                <span className="font-extrabold text-xs">{product.year || '1954'}</span>
              </div>
              <div>
                <span className="text-brand-warmGray block uppercase">MATERIAL</span>
                <span className="font-extrabold text-xs text-[#F26A2E]">{product.material || 'Silver'}</span>
              </div>
              <div>
                <span className="text-brand-warmGray block uppercase">WEIGHT</span>
                <span className="font-extrabold text-xs">{product.weight || '11.66 g'}</span>
              </div>
              <div>
                <span className="text-brand-warmGray block uppercase">MINT</span>
                <span className="font-extrabold text-xs">{product.mint || 'Mumbai Mint'}</span>
              </div>
              <div>
                <span className="text-brand-warmGray block uppercase">SHIPPING</span>
                <span className="font-extrabold text-xs text-emerald-700">{product.shippingCharges || 'Free Shipping'}</span>
              </div>
            </div>

            {/* Cart & Wishlist Actions */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={handleAddToCart}
                disabled={added}
                className={`flex-grow py-4 px-6 rounded-2xl flex items-center justify-center gap-2 font-extrabold text-xs tracking-widest uppercase transition-all shadow-md cursor-pointer ${
                  added ? 'bg-brand-success text-white' : 'bg-[#F26A2E] text-white hover:bg-[#E0591D]'
                }`}
              >
                {added ? (
                  <span>✓ ADDED TO SHOPPING BAG</span>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>ADD TO SHOPPING BAG</span>
                  </>
                )}
              </button>

              <button
                onClick={() => toggleWishlist(product)}
                className={`p-4 rounded-2xl border transition-all flex items-center justify-center cursor-pointer shadow-xs ${
                  inWishlist
                    ? 'bg-[#F26A2E] border-[#F26A2E] text-white'
                    : 'bg-brand-white border-brand-border hover:bg-brand-softBeige/40 text-brand-warmGray'
                }`}
                aria-label="Add to Wishlist"
              >
                <Heart className={`w-5 h-5 ${inWishlist ? 'fill-white' : ''}`} />
              </button>
            </div>

          </div>
        </div>

        {/* ==================================================
            2. SEE MORE DETAILS (EXPANDABLE NUMISMATIC SPECS)
           ================================================== */}
        <div className="w-full bg-white rounded-3xl border border-brand-border/40 shadow-xs overflow-hidden text-left">
          <button
            onClick={() => setIsDetailsExpanded(!isDetailsExpanded)}
            className="w-full p-6 md:p-8 flex items-center justify-between hover:bg-[#FAF8F5] transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-[#F26A2E]" />
              <h3 className="font-display font-bold text-base md:text-lg tracking-wider text-brand-espresso uppercase">
                SEE MORE DETAILS
              </h3>
            </div>

            <div className="flex items-center gap-2 text-xs font-bold text-[#F26A2E] uppercase tracking-wider">
              <span>{isDetailsExpanded ? 'Hide Specifications' : 'View Full Specifications'}</span>
              {isDetailsExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </div>
          </button>

          <AnimatePresence>
            {isDetailsExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.35, ease: 'easeInOut' }}
                className="overflow-hidden border-t border-brand-border/30 bg-[#FCFAF7]"
              >
                <div className="p-6 md:p-10 space-y-8">
                  
                  <div className="space-y-4">
                    <h4 className="text-xs font-extrabold text-brand-espresso tracking-[0.2em] uppercase border-b border-brand-border/30 pb-2">
                      NUMISMATIC DETAILS
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-xs text-brand-espresso">
                      <div className="space-y-1">
                        <span className="text-[10px] text-brand-warmGray font-bold uppercase tracking-wider block">Product No:</span>
                        <span className="font-extrabold text-sm">{product.productNo || 'NP-201'}</span>
                      </div>

                      <div className="space-y-1">
                        <span className="text-[10px] text-brand-warmGray font-bold uppercase tracking-wider block">Product Name:</span>
                        <span className="font-bold">{product.name}</span>
                      </div>

                      <div className="space-y-1">
                        <span className="text-[10px] text-brand-warmGray font-bold uppercase tracking-wider block">Material:</span>
                        <span className="font-extrabold text-[#F26A2E]">{product.material || 'Silver'}</span>
                      </div>

                      <div className="space-y-1">
                        <span className="text-[10px] text-brand-warmGray font-bold uppercase tracking-wider block">Weight:</span>
                        <span className="font-bold">{product.weight || '11.66 g'}</span>
                      </div>

                      <div className="space-y-1">
                        <span className="text-[10px] text-brand-warmGray font-bold uppercase tracking-wider block">Category:</span>
                        <span className="font-bold">{product.category}</span>
                      </div>

                      <div className="space-y-1">
                        <span className="text-[10px] text-brand-warmGray font-bold uppercase tracking-wider block">Mint:</span>
                        <span className="font-bold">{product.mint || 'Mumbai Mint'}</span>
                      </div>

                      <div className="space-y-1">
                        <span className="text-[10px] text-brand-warmGray font-bold uppercase tracking-wider block">Year:</span>
                        <span className="font-bold">{product.year || '1954'}</span>
                      </div>

                      <div className="space-y-1">
                        <span className="text-[10px] text-brand-warmGray font-bold uppercase tracking-wider block">Shipping Charges:</span>
                        <span className="font-bold text-emerald-700">{product.shippingCharges || 'Free Shipping'}</span>
                      </div>

                      <div className="space-y-1">
                        <span className="text-[10px] text-brand-warmGray font-bold uppercase tracking-wider block">Condition Grade:</span>
                        <span className="font-bold">{product.condition || 'Extremely Fine'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Return Policy & Authenticity Guarantee */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-brand-border/30">
                    <div className="bg-white p-5 rounded-2xl border border-brand-border/40 space-y-2">
                      <div className="flex items-center gap-2">
                        <Award className="w-4 h-4 text-[#F26A2E]" />
                        <span className="text-[10px] text-brand-warmGray font-extrabold tracking-wider uppercase">
                          Authenticity & Certification:
                        </span>
                      </div>
                      <p className="text-xs text-brand-espresso font-medium leading-relaxed">
                        Accompanied by an official Aadhya Numismatic Certificate of Authenticity. Inspected and verified using non-destructive XRF metallic spectroscopy and microscopic grading.
                      </p>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-brand-border/40 space-y-2">
                      <div className="flex items-center gap-2">
                        <RotateCcw className="w-4 h-4 text-[#F26A2E]" />
                        <span className="text-[10px] text-brand-warmGray font-extrabold tracking-wider uppercase">
                          Return Policy:
                        </span>
                      </div>
                      <p className="text-xs text-brand-espresso font-medium leading-relaxed">
                        {product.returnPolicy || 'Inspected archival artifact eligible for return within 3 days with untampered certificate security seal.'}
                      </p>
                    </div>
                  </div>

                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ==================================================
            3. RATING & REVIEWS SECTION (Matching media_1788500458278.png)
           ================================================== */}
        <div className="border-t border-brand-border/40 pt-12 grid grid-cols-1 lg:grid-cols-12 gap-8 text-left bg-brand-white p-8 rounded-3xl border border-brand-border/50 shadow-xs">
          {/* Reviews Score Card (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <h3 className="font-display font-bold text-lg md:text-xl tracking-wider text-brand-espresso uppercase">
              Rating & Reviews
            </h3>
            
            <div className="flex items-center space-x-6">
              <div className="text-center">
                <span className="font-display font-extrabold text-5xl md:text-6xl text-brand-espresso">
                  4,9
                </span>
                <span className="text-xs text-brand-warmGray font-bold block mt-1">/ 5</span>
              </div>
              
              <div className="flex-grow space-y-1.5 max-w-[220px]">
                {[
                  { star: 5, pct: '85%' },
                  { star: 4, pct: '12%' },
                  { star: 3, pct: '3%' },
                  { star: 2, pct: '0%' },
                  { star: 1, pct: '0%' }
                ].map((row) => (
                  <div key={row.star} className="flex items-center text-[10px] font-bold text-brand-espresso">
                    <span className="w-3">★{row.star}</span>
                    <div className="flex-grow h-[2px] bg-brand-border/30 rounded-full overflow-hidden ml-2">
                      <div className="h-full bg-brand-espresso" style={{ width: row.pct }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <p className="text-[10px] text-brand-warmGray font-semibold tracking-wider">
              ({product.reviewsCount || 48} Verified Collector Reviews)
            </p>
          </div>

          {/* Testimonial Quote Card (7 cols) */}
          <div className="lg:col-span-7 space-y-4 flex flex-col justify-between">
            <div className="bg-[#FAF8F5] border border-brand-border/30 p-6 rounded-3xl space-y-3.5 shadow-xs relative">
              <div className="flex text-brand-espresso">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-current" />
                ))}
              </div>
              <p className="text-xs md:text-sm text-brand-espresso font-medium leading-relaxed">
                "The specimen arrived preserved in an archival airtight acrylic slab with full provenance registration. The metallic purity and die strike match museum grade expectations."
              </p>
              
              <div className="flex items-center space-x-3 pt-2">
                <div className="w-8 h-8 rounded-full bg-brand-espresso text-white flex items-center justify-center text-xs font-bold font-display uppercase">
                  RM
                </div>
                <div>
                  <h5 className="text-[11px] font-extrabold text-brand-espresso uppercase">
                    Rohan Mehta
                  </h5>
                  <span className="text-[9px] text-brand-warmGray font-semibold block">
                    Verified Collector • Numismatic Society
                  </span>
                </div>
              </div>
            </div>

            <div className="flex justify-start">
              <button 
                onClick={() => alert("All verified collector reviews loaded!")}
                className="px-6 py-2.5 border border-brand-border rounded-full text-[10px] font-bold tracking-widest text-brand-espresso hover:bg-brand-softBeige/40 transition-colors uppercase cursor-pointer"
              >
                View All Reviews
              </button>
            </div>
          </div>
        </div>

        {/* ==================================================
            4. RELATED / RECOMMENDED PRODUCTS (BELOW REVIEWS)
           ================================================== */}
        <div className="pt-8 border-t border-brand-border/40 space-y-6">
          <div className="text-left space-y-1">
            <span className="text-[10px] text-[#F26A2E] font-extrabold tracking-[0.25em] uppercase block">
              CURATED RECOMMENDATIONS
            </span>
            <h2 className="font-display font-bold text-2xl md:text-3xl text-brand-espresso tracking-tight uppercase">
              YOU MAY ALSO LIKE
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((rel) => (
              <div
                key={rel.id}
                onClick={() => router.push(`/numismatics/${rel.name.toLowerCase().replace(/ /g, '-')}`)}
                className="bg-brand-white border border-brand-border/50 rounded-2xl p-3 text-left space-y-3 cursor-pointer group hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div className="w-full aspect-[4/5] bg-[#FAF7F2] rounded-xl p-4 flex items-center justify-center relative overflow-hidden border border-brand-border/30">
                  {rel.visualType === 'note' ? (
                    <img src={rel.image} alt={rel.name} className="w-full h-auto object-contain rounded" />
                  ) : (
                    <ProductVisual type="coin" color={rel.visualColor || '#B89A67'} pattern={rel.visualPattern || 'antique-metallic'} />
                  )}
                  <div className="absolute top-2 left-2 px-2 py-0.5 bg-white/90 rounded-full text-[8px] font-black uppercase tracking-wider text-brand-espresso">
                    {rel.year || 'Historic'}
                  </div>
                </div>
                <div>
                  <span className="text-[8px] font-bold text-[#F26A2E] tracking-widest uppercase block">{rel.mint || 'Mumbai Mint'}</span>
                  <h3 className="font-display font-bold text-xs text-brand-espresso group-hover:text-[#F26A2E] transition-colors line-clamp-1">
                    {rel.name}
                  </h3>
                  <span className="font-sans font-extrabold text-xs text-brand-espresso block pt-1">₹{rel.price.toLocaleString('en-IN')}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Gallery Lightbox Modal */}
      <AnimatePresence>
        {isGalleryOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#121110]/95 flex items-center justify-center p-4 md:p-12 select-none"
            onClick={() => setGalleryOpen(false)}
          >
            <button
              onClick={() => setGalleryOpen(false)}
              className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 border border-white/10 text-white rounded-full transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div 
              className="max-w-2xl max-h-[80vh] relative flex items-center justify-center p-4"
              onClick={(e) => e.stopPropagation()}
            >
              {product.visualType === 'note' ? (
                <img
                  src={productImages[activeImageIndex]}
                  alt={product.name}
                  className="max-w-full max-h-[80vh] object-contain rounded-2xl shadow-2xl"
                />
              ) : productImages[activeImageIndex] && (productImages[activeImageIndex].startsWith('/') || productImages[activeImageIndex].startsWith('http')) ? (
                <img
                  src={productImages[activeImageIndex]}
                  alt={product.name}
                  className="max-w-[80vw] sm:max-w-[420px] max-h-[75vh] object-contain drop-shadow-2xl rounded-full"
                />
              ) : (
                <div className="p-8 bg-white/5 rounded-3xl border border-white/10">
                  <ProductVisual
                    type="coin"
                    color={product.visualColor || '#B89A67'}
                    pattern={product.visualPattern || 'antique-metallic'}
                    className="scale-150"
                  />
                </div>
              )}

              {productImages.length > 1 && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveImageIndex((prev) => (prev - 1 + productImages.length) % productImages.length);
                    }}
                    className="absolute left-2 p-3 bg-white/10 hover:bg-white/20 border border-white/10 rounded-full text-white transition-colors cursor-pointer"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveImageIndex((prev) => (prev + 1) % productImages.length);
                    }}
                    className="absolute right-2 p-3 bg-white/10 hover:bg-white/20 border border-white/10 rounded-full text-white transition-colors cursor-pointer"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
