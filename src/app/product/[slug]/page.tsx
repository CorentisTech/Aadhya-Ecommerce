"use client";

import React, { use, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { PRODUCTS, Product, SizeGuideItem } from '@/data/mockData';
import { 
  Heart, 
  ShoppingBag, 
  Star, 
  X, 
  Check, 
  ChevronLeft, 
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Maximize2,
  Ruler,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { NavigationControls } from '@/components/ui/NavigationControls';
import { ZoomableImage } from '@/components/ui/ZoomableImage';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function ProductDetailPage({ params }: PageProps) {
  const router = useRouter();
  const { slug } = use(params);
  const { addToCart, toggleWishlist, isInWishlist } = useApp();

  // Find product by slug name
  const product = PRODUCTS.find(
    (p) => p.name.toLowerCase().replace(/ /g, '-') === slug
  );

  // Safeguard: Redirect numismatics products to the dedicated numismatics PDP route
  useEffect(() => {
    if (product && product.department === 'numismatics') {
      router.replace(`/numismatics/${slug}`);
    }
  }, [product, slug, router]);

  // States
  const [selectedSize, setSelectedSize] = useState('36');
  const [selectedColor, setSelectedColor] = useState('');
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [sizeError, setSizeError] = useState(false);
  const [isImgZoomed, setImgZoomed] = useState(false);

  // See More Details Toggle
  const [isDetailsExpanded, setIsDetailsExpanded] = useState(false);

  // Size Guide Modal State
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);

  // Lightbox Modals
  const [isGalleryOpen, setGalleryOpen] = useState(false);
  const [lightboxImageIndex, setLightboxImageIndex] = useState(0);
  const [isPhotoLightboxOpen, setPhotoLightboxOpen] = useState(false);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);

  // Set default selection values on mount / product change
  useEffect(() => {
    if (product) {
      if (product.sizes && product.sizes.length > 0) {
        setSelectedSize(product.sizes[0]);
      } else {
        setSelectedSize('36');
      }
      setSizeError(false);
      
      if (product.imagesByColor && product.imagesByColor.length > 0) {
        setSelectedColor(product.imagesByColor[0].colorHex);
      } else if (product.colors && product.colors.length > 0) {
        setSelectedColor(product.colors[0]);
      } else {
        setSelectedColor('');
      }
      
      setActiveImageIndex(0);
      setQuantity(1);
    }
  }, [product]);

  const handleColorChange = (colorHex: string) => {
    setSelectedColor(colorHex);
    setActiveImageIndex(0);
  };

  if (!product) {
    return (
      <div className="w-full min-h-screen flex flex-col items-center justify-center bg-brand-warmWhite text-brand-espresso p-6">
        <h2 className="font-display font-bold text-lg tracking-widest uppercase">PRODUCT NOT FOUND</h2>
        <button
          onClick={() => router.push('/catalog')}
          className="mt-4 px-6 py-2.5 bg-brand-espresso text-brand-white text-xs font-bold tracking-widest uppercase rounded-lg"
        >
          RETURN TO CATALOG
        </button>
      </div>
    );
  }

  // If this is a numismatics product, render nothing while router redirects
  if (product.department === 'numismatics') {
    return null;
  }

  // Get active images based on color selection
  const activeColorObj = product.imagesByColor?.find(c => c.colorHex === selectedColor);
  const activeImages = activeColorObj?.images || product.images || Array(4).fill(product.image);

  const inWishlist = isInWishlist(product.id);

  const handleAddToCart = () => {
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      setSizeError(true);
      return;
    }
    setSizeError(false);

    const colorName = activeColorObj?.colorName || selectedColor;
    addToCart(product, quantity, selectedSize, colorName);
    
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  const handlePrevImage = () => {
    setActiveImageIndex(prev => (prev - 1 + activeImages.length) % activeImages.length);
  };

  const handleNextImage = () => {
    setActiveImageIndex(prev => (prev + 1) % activeImages.length);
  };

  // Related products from fashion department (excluding current)
  const relatedProducts = PRODUCTS.filter(
    (p) => p.department === 'fashion' && p.id !== product.id
  ).slice(0, 4);

  const sizeGuideData: SizeGuideItem[] = product.sizeGuide || [
    { size: '34', bust: '34 in', waist: '28 in', hip: '36 in', length: '38 in' },
    { size: '36', bust: '36 in', waist: '30 in', hip: '38 in', length: '39 in' },
    { size: '38', bust: '38 in', waist: '32 in', hip: '40 in', length: '40 in' },
    { size: '40', bust: '40 in', waist: '34 in', hip: '42 in', length: '41 in' }
  ];

  return (
    <div className="w-full max-w-full min-h-screen bg-[#FFFFFF] py-10 md:py-16 px-4 md:px-12 lg:px-24 text-brand-espresso select-none">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Navigation Controls (← Back & Back to Home) */}
        <NavigationControls className="justify-start border-b border-brand-border/30 pb-3" />

        {/* ==================================================
            1. MAIN FLOATING BEIGE CONTAINER CARD (PURCHASE AREA)
           ================================================== */}
        <div className="w-full bg-[#EAE6DF] rounded-[32px] p-6 md:p-12 relative shadow-lg overflow-hidden border border-brand-border/20">
          
          {/* Top-Right White Close Button */}
          <button
            onClick={() => router.push('/catalog')}
            className="absolute top-6 right-6 w-8 h-8 rounded-full bg-white flex items-center justify-center hover:bg-brand-softBeige transition-colors shadow-sm z-10 text-brand-espresso cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Mobile Structure (Visible below lg) */}
          <div className="block lg:hidden space-y-6 text-left">
            
            {/* Title Block */}
            <div className="space-y-2 pt-2">
              <span className="text-[9px] text-brand-warmGray font-bold tracking-[0.25em] uppercase block">
                {product.category}
              </span>
              <h1 className="font-display font-bold text-2xl text-brand-espresso leading-tight">
                {product.name}
              </h1>
              <p className="text-xs text-[#756E69] leading-relaxed font-semibold">
                {product.description}
              </p>
              <div>
                <span className="text-[10px] font-bold text-brand-espresso tracking-widest uppercase block">
                  {product.fabric ? `${product.fabric.toUpperCase()}` : 'AV COTTON'}
                </span>
              </div>
            </div>

            {/* Image Viewport with Press & Hold Zoom */}
            <div className="w-full relative">
              <ZoomableImage
                src={activeImages[activeImageIndex]}
                alt={product.name}
                aspectRatio="aspect-[3/4]"
                className="rounded-2xl bg-brand-softBeige/10 shadow-md"
                showHint={true}
                onClick={() => {
                  setLightboxImageIndex(activeImageIndex);
                  setGalleryOpen(true);
                }}
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setLightboxImageIndex(activeImageIndex);
                    setGalleryOpen(true);
                  }}
                  className="absolute bottom-3 right-3 p-1.5 bg-[#FFFFFF]/90 hover:bg-brand-white border border-brand-border/20 text-brand-espresso rounded-full transition-all shadow-sm pointer-events-auto"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                </button>

                <div className="absolute inset-x-2 top-1/2 -translate-y-1/2 flex justify-between pointer-events-none z-20">
                  <button
                    onMouseDown={(e) => e.stopPropagation()}
                    onTouchStart={(e) => e.stopPropagation()}
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePrevImage();
                    }}
                    className="p-1.5 bg-white/80 hover:bg-white rounded-full shadow pointer-events-auto text-brand-espresso cursor-pointer"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onMouseDown={(e) => e.stopPropagation()}
                    onTouchStart={(e) => e.stopPropagation()}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNextImage();
                    }}
                    className="p-1.5 bg-white/80 hover:bg-white rounded-full shadow pointer-events-auto text-brand-espresso cursor-pointer"
                    aria-label="Next image"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </ZoomableImage>
            </div>

            {/* Specs Selectors Card */}
            <div className="bg-white rounded-3xl p-5 shadow-sm border border-brand-border/20 space-y-4">
              {/* Colors selection */}
              <div className="space-y-1.5">
                <span className="text-[9px] font-extrabold text-brand-espresso tracking-wider uppercase block">
                  Colour: {activeColorObj?.colorName || selectedColor || 'Default'}
                </span>
                <div className="flex space-x-2">
                  {product.colors?.map((colorHex) => {
                    const isSelected = selectedColor === colorHex;
                    return (
                      <button
                        key={colorHex}
                        onClick={() => handleColorChange(colorHex)}
                        className={`w-6 h-6 rounded-full border transition-all relative flex items-center justify-center ${
                          isSelected ? 'scale-110 border-brand-espresso ring-1 ring-brand-espresso/30' : 'border-brand-border/60'
                        }`}
                        style={{ backgroundColor: colorHex }}
                        aria-label="Select Color"
                      />
                    );
                  })}
                </div>
              </div>

              <div className="w-full h-px bg-brand-border/15" />

              {/* Sizing selection with Size Guide link */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-extrabold text-brand-espresso tracking-wider uppercase">
                    Select your size:
                  </span>
                  <button
                    onClick={() => setIsSizeGuideOpen(true)}
                    className="text-[9px] font-bold text-[#F26A2E] hover:underline flex items-center gap-1 uppercase tracking-wider cursor-pointer"
                  >
                    <Ruler className="w-3 h-3" />
                    <span>Size Guide</span>
                  </button>
                </div>

                <div className="flex gap-2">
                  {(product.sizes || ['34', '36', '38', '40']).map((sz) => {
                    const isSelected = selectedSize === sz;
                    return (
                      <button
                        key={sz}
                        onClick={() => setSelectedSize(sz)}
                        className={`w-9 h-9 border rounded-lg text-xs font-bold transition-all ${
                          isSelected ? 'border-brand-espresso bg-brand-espresso text-white' : 'border-brand-border bg-white text-brand-espresso'
                        }`}
                      >
                        {sz}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Action Buttons: Add to Bag & Wishlist */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleAddToCart}
                disabled={added}
                className="flex-grow py-4 bg-white text-brand-espresso hover:bg-white/95 border border-brand-border/30 rounded-full font-bold text-xs tracking-widest uppercase transition-all shadow-md text-center cursor-pointer"
              >
                {added ? '✓ Added to bag' : `Shop ₹${product.price.toLocaleString('en-IN')}`}
              </button>

              <button
                onClick={() => toggleWishlist(product)}
                className={`p-4 rounded-full border transition-all flex items-center justify-center shadow-md cursor-pointer ${
                  inWishlist
                    ? 'bg-[#F26A2E] border-[#F26A2E] text-white'
                    : 'bg-white border-brand-border/30 text-brand-espresso hover:bg-brand-softBeige/30'
                }`}
                aria-label="Wishlist"
              >
                <Heart className={`w-4 h-4 ${inWishlist ? 'fill-white' : ''}`} />
              </button>
            </div>

          </div>

          {/* Desktop Structure (Visible on lg and up) */}
          <div className="hidden lg:grid grid-cols-12 gap-8 items-stretch pt-4">
            
            {/* Left Column: Product Information (4 cols) */}
            <div className="lg:col-span-4 flex flex-col justify-between text-left space-y-8 min-h-[400px]">
              <div className="space-y-4">
                <span className="text-[9px] text-brand-warmGray font-bold tracking-[0.25em] uppercase block">
                  {product.category}
                </span>
                <h1 className="font-display font-bold text-3xl md:text-4.5xl text-brand-espresso leading-tight">
                  {product.name}
                </h1>
                <p className="text-xs text-brand-warmGray leading-relaxed font-semibold max-w-sm">
                  {product.description}
                </p>
                <div className="pt-2">
                  <span className="text-xs font-bold text-brand-espresso tracking-widest uppercase block">
                    {product.fabric ? `${product.fabric.toUpperCase()}` : 'AV COTTON'}
                  </span>
                </div>
              </div>

              {/* Bottom spec quick badges */}
              <div className="flex items-center space-x-3 pt-6 border-t border-brand-border/20">
                <div className="w-11 h-11 rounded-xl bg-white flex items-center justify-center shadow-sm flex-shrink-0">
                  <Check className="w-5 h-5 text-[#F26A2E] stroke-[2.5]" />
                </div>
                
                <div className="grid grid-cols-2 gap-3 flex-grow">
                  <div className="bg-white rounded-xl p-3 shadow-sm border border-brand-border/10 text-left">
                    <h5 className="text-[8px] font-bold text-brand-espresso tracking-wider uppercase mb-1">
                      Fabric Details
                    </h5>
                    <p className="text-[9px] text-brand-warmGray font-medium leading-tight">
                      Premium {product.fabric || 'AV Cotton'}.
                    </p>
                  </div>
                  <div className="bg-white rounded-xl p-3 shadow-sm border border-brand-border/10 text-left">
                    <h5 className="text-[8px] font-bold text-brand-espresso tracking-wider uppercase mb-1">
                      Pattern & Fit
                    </h5>
                    <p className="text-[9px] text-brand-warmGray font-medium leading-tight">
                      {product.pattern || 'Plain'} • {product.fit || 'Regular'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Center Column: Portrait Model Image with Press & Hold Zoom (4 cols) */}
            <div className="lg:col-span-4 flex justify-center items-center relative">
              <div className="w-full relative">
                <ZoomableImage
                  src={activeImages[activeImageIndex]}
                  alt={product.name}
                  aspectRatio="aspect-[3/4]"
                  className="rounded-2xl bg-brand-softBeige/10 shadow-md"
                  showHint={true}
                  onClick={() => {
                    setLightboxImageIndex(activeImageIndex);
                    setGalleryOpen(true);
                  }}
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setLightboxImageIndex(activeImageIndex);
                      setGalleryOpen(true);
                    }}
                    className="absolute bottom-3 right-3 p-2 bg-[#FFFFFF]/90 hover:bg-brand-white border border-brand-border/20 text-brand-espresso rounded-full transition-all shadow-sm pointer-events-auto cursor-pointer"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                  </button>

                  <div className="absolute inset-x-2 top-1/2 -translate-y-1/2 flex justify-between pointer-events-none z-20">
                    <button
                      onMouseDown={(e) => e.stopPropagation()}
                      onTouchStart={(e) => e.stopPropagation()}
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePrevImage();
                      }}
                      className="p-1.5 bg-white/80 hover:bg-white rounded-full shadow pointer-events-auto text-brand-espresso cursor-pointer"
                      aria-label="Previous image"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onMouseDown={(e) => e.stopPropagation()}
                      onTouchStart={(e) => e.stopPropagation()}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleNextImage();
                      }}
                      className="p-1.5 bg-white/80 hover:bg-white rounded-full shadow pointer-events-auto text-brand-espresso cursor-pointer"
                      aria-label="Next image"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </ZoomableImage>
              </div>
            </div>

            {/* Right Column: Spec Card & Action Controls (4 cols) */}
            <div className="lg:col-span-4 flex flex-col justify-between space-y-6">
              
              <div className="bg-white rounded-[24px] p-6 shadow-sm border border-brand-border/20 text-left space-y-5 flex-grow">
                
                {/* Color swatch selection */}
                <div className="space-y-2">
                  <span className="text-[10px] font-extrabold text-brand-espresso tracking-wider uppercase block">
                    Colour: {activeColorObj?.colorName || selectedColor || 'Default'}
                  </span>
                  <div className="flex space-x-2">
                    {product.colors?.map((colorHex) => {
                      const isSelected = selectedColor === colorHex;
                      return (
                        <button
                          key={colorHex}
                          onClick={() => handleColorChange(colorHex)}
                          className={`w-6 h-6 rounded-full border transition-all relative flex items-center justify-center cursor-pointer ${
                            isSelected
                              ? 'scale-110 border-brand-espresso ring-1 ring-brand-espresso/30'
                              : 'border-brand-border/60 hover:opacity-85'
                          }`}
                          style={{ backgroundColor: colorHex }}
                          aria-label="Select Color"
                        >
                          {isSelected && (
                            <Check className={`w-3 h-3 ${colorHex === '#FFFFFF' || colorHex === '#FCFAF7' ? 'text-brand-espresso' : 'text-white'}`} />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="w-full h-px bg-brand-border/20 my-3" />

                {/* Sizing selection with Size Guide */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold text-brand-espresso tracking-wider uppercase">
                      Select your size:
                    </span>
                    <button
                      onClick={() => setIsSizeGuideOpen(true)}
                      className="text-[10px] font-extrabold text-[#F26A2E] hover:underline flex items-center gap-1 uppercase tracking-wider cursor-pointer"
                    >
                      <Ruler className="w-3.5 h-3.5" />
                      <span>Size Guide</span>
                    </button>
                  </div>

                  <div className="flex gap-2">
                    {(product.sizes || ['34', '36', '38', '40']).map((sz) => {
                      const isSelected = selectedSize === sz;
                      return (
                        <button
                          key={sz}
                          onClick={() => setSelectedSize(sz)}
                          className={`w-10 h-10 border rounded-lg text-xs font-bold transition-all cursor-pointer ${
                            isSelected
                              ? 'border-brand-espresso bg-brand-espresso text-brand-white'
                              : 'border-brand-border bg-white text-brand-espresso hover:bg-brand-softBeige/30'
                          }`}
                        >
                          {sz}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="w-full h-px bg-brand-border/20 my-3" />

                {/* Pricing row */}
                <div className="flex items-baseline justify-between pt-1">
                  <div className="flex items-baseline space-x-2">
                    <span className="text-2xl font-extrabold text-brand-espresso">
                      ₹{product.price.toLocaleString('en-IN')}
                    </span>
                    <span className="text-xs text-brand-warmGray line-through font-semibold">
                      ₹{product.mrp.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <span className="text-[10px] bg-[#F26A2E]/10 text-[#F26A2E] font-extrabold px-2.5 py-1 rounded-full uppercase">
                    SAVE {product.discount}%
                  </span>
                </div>

              </div>

              {/* Action Buttons: Add to Bag & Wishlist */}
              <div className="flex items-center gap-3">
                <button
                  onClick={handleAddToCart}
                  disabled={added}
                  className="flex-grow py-4 bg-white text-brand-espresso hover:bg-white/95 border border-brand-border/30 rounded-full font-bold text-xs tracking-widest uppercase transition-all shadow-md text-center cursor-pointer"
                >
                  {added ? '✓ Added to bag' : `Shop ₹${product.price.toLocaleString('en-IN')}`}
                </button>

                <button
                  onClick={() => toggleWishlist(product)}
                  className={`p-4 rounded-full border transition-all flex items-center justify-center shadow-md cursor-pointer ${
                    inWishlist
                      ? 'bg-[#F26A2E] border-[#F26A2E] text-white'
                      : 'bg-white border-brand-border/30 text-brand-espresso hover:bg-brand-softBeige/30'
                  }`}
                  aria-label="Wishlist"
                >
                  <Heart className={`w-4 h-4 ${inWishlist ? 'fill-white' : ''}`} />
                </button>
              </div>

            </div>

          </div>

        </div>

        {/* ==================================================
            2. SEE MORE DETAILS (EXPANDABLE ACCORDION PANEL)
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
                  
                  {/* Detailed Specifications Grid */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-extrabold text-brand-espresso tracking-[0.2em] uppercase border-b border-brand-border/30 pb-2">
                      PRODUCT DETAILS
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-xs text-brand-espresso">
                      <div className="space-y-1">
                        <span className="text-[10px] text-brand-warmGray font-bold uppercase tracking-wider block">Product No:</span>
                        <span className="font-extrabold text-sm">{product.productNo || 'FP-101'}</span>
                      </div>

                      <div className="space-y-1">
                        <span className="text-[10px] text-brand-warmGray font-bold uppercase tracking-wider block">Product Name:</span>
                        <span className="font-bold">{product.name}</span>
                      </div>

                      <div className="space-y-1">
                        <span className="text-[10px] text-brand-warmGray font-bold uppercase tracking-wider block">Category:</span>
                        <span className="font-bold">{product.category}</span>
                      </div>

                      <div className="space-y-1">
                        <span className="text-[10px] text-brand-warmGray font-bold uppercase tracking-wider block">Fabric:</span>
                        <span className="font-extrabold text-[#F26A2E]">{product.fabric || 'AV Cotton'}</span>
                      </div>

                      <div className="space-y-1">
                        <span className="text-[10px] text-brand-warmGray font-bold uppercase tracking-wider block">Pattern:</span>
                        <span className="font-bold">{product.pattern || 'Plain'}</span>
                      </div>

                      <div className="space-y-1">
                        <span className="text-[10px] text-brand-warmGray font-bold uppercase tracking-wider block">Length:</span>
                        <span className="font-bold">{product.length || 'Full Length'}</span>
                      </div>

                      <div className="space-y-1">
                        <span className="text-[10px] text-brand-warmGray font-bold uppercase tracking-wider block">Pack Of:</span>
                        <span className="font-bold">{product.packOf || 'Pack of 1'}</span>
                      </div>

                      <div className="space-y-1">
                        <span className="text-[10px] text-brand-warmGray font-bold uppercase tracking-wider block">Color:</span>
                        <span className="font-bold">{activeColorObj?.colorName || selectedColor || 'Standard'}</span>
                      </div>

                      <div className="space-y-1">
                        <span className="text-[10px] text-brand-warmGray font-bold uppercase tracking-wider block">Available Colors:</span>
                        <div className="flex items-center gap-1.5 pt-0.5">
                          {product.colors?.map((c) => (
                            <span 
                              key={c} 
                              className="w-4 h-4 rounded-full border border-black/10 inline-block" 
                              style={{ backgroundColor: c }}
                            />
                          ))}
                        </div>
                      </div>

                      <div className="space-y-1">
                        <span className="text-[10px] text-brand-warmGray font-bold uppercase tracking-wider block">Size:</span>
                        <span className="font-bold">{selectedSize}</span>
                      </div>

                      <div className="space-y-1">
                        <span className="text-[10px] text-brand-warmGray font-bold uppercase tracking-wider block">Size Guide:</span>
                        <button
                          onClick={() => setIsSizeGuideOpen(true)}
                          className="text-xs font-extrabold text-[#F26A2E] underline flex items-center gap-1 cursor-pointer"
                        >
                          <Ruler className="w-3.5 h-3.5" />
                          <span>Open Size Guide</span>
                        </button>
                      </div>

                      <div className="space-y-1">
                        <span className="text-[10px] text-brand-warmGray font-bold uppercase tracking-wider block">Return Time:</span>
                        <span className="font-bold text-emerald-600">{product.returnTime || '7 Days'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Fabric Care & Return Policy */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-brand-border/30">
                    {/* Fabric Care */}
                    <div className="bg-white p-5 rounded-2xl border border-brand-border/40 space-y-2.5">
                      <span className="text-[10px] text-brand-warmGray font-extrabold tracking-wider uppercase block">
                        Fabric Care Instructions:
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {(product.fabricCare || ['Cold Wash', 'Machine Wash', 'Brush Care']).map((care) => (
                          <span 
                            key={care}
                            className="px-3 py-1 bg-[#FAF6F0] border border-[#EAE2D5] rounded-full text-[11px] font-bold text-brand-espresso"
                          >
                            ✓ {care}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Return Policy */}
                    <div className="bg-white p-5 rounded-2xl border border-brand-border/40 space-y-2">
                      <div className="flex items-center gap-2">
                        <RotateCcw className="w-4 h-4 text-[#F26A2E]" />
                        <span className="text-[10px] text-brand-warmGray font-extrabold tracking-wider uppercase">
                          Return Policy:
                        </span>
                      </div>
                      <p className="text-xs text-brand-espresso font-medium leading-relaxed">
                        {product.returnPolicy || 'Eligible for return within 7 days of delivery subject to product condition in original packaging.'}
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
        <div className="border-t border-brand-border/40 pt-12 grid grid-cols-1 lg:grid-cols-12 gap-8 text-left bg-[#FFFFFF]">
          {/* Reviews Score Card (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <h3 className="font-display font-bold text-lg md:text-xl tracking-wider text-brand-espresso uppercase">
              Rating & Reviews
            </h3>
            
            <div className="flex items-center space-x-6">
              <div className="text-center">
                <span className="font-display font-extrabold text-5xl md:text-6xl text-brand-espresso">
                  {product.rating ? String(product.rating).replace('.', ',') : '4,5'}
                </span>
                <span className="text-xs text-brand-warmGray font-bold block mt-1">/ 5</span>
              </div>
              
              <div className="flex-grow space-y-1.5 max-w-[220px]">
                {[
                  { star: 5, pct: '70%' },
                  { star: 4, pct: '48%' },
                  { star: 3, pct: '24%' },
                  { star: 2, pct: '10%' },
                  { star: 1, pct: '4%' }
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
              ({product.reviewsCount || 50} Verified Customer Reviews)
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
                "The dedication to sustainability and ethical practices resonates strongly with today's consumers, positioning the brand as a responsible choice in the fashion world."
              </p>
              
              <div className="flex items-center space-x-3 pt-2">
                <div className="w-8 h-8 rounded-full bg-brand-espresso text-white flex items-center justify-center text-xs font-bold font-display uppercase">
                  AM
                </div>
                <div>
                  <h5 className="text-[11px] font-extrabold text-brand-espresso uppercase">
                    Alex Mathio
                  </h5>
                  <span className="text-[9px] text-brand-warmGray font-semibold block">
                    13 Oct 2024
                  </span>
                </div>
              </div>
            </div>

            <div className="flex justify-start">
              <button 
                onClick={() => alert("All verified customer reviews loaded!")}
                className="px-6 py-2.5 border border-brand-border rounded-full text-[10px] font-bold tracking-widest text-brand-espresso hover:bg-brand-softBeige/40 transition-colors uppercase cursor-pointer"
              >
                View All Reviews
              </button>
            </div>
          </div>
        </div>

        {/* Customer Uploaded Photos grid */}
        {product.customerPhotos && product.customerPhotos.length > 0 && (
          <div className="border-t border-brand-border/40 pt-10 text-left space-y-4 bg-[#FFFFFF]">
            <h4 className="font-display font-bold text-xs tracking-widest text-brand-espresso uppercase">
              CUSTOMER UPLOADED PHOTOS ({product.customerPhotos.length})
            </h4>
            
            <div className="flex overflow-x-auto gap-4 pb-2 scrollbar-none snap-x snap-mandatory">
              {product.customerPhotos.map((photo, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setSelectedPhotoIndex(idx);
                    setPhotoLightboxOpen(true);
                  }}
                  className="w-32 sm:w-40 aspect-square rounded-2xl overflow-hidden bg-brand-softBeige/15 border border-brand-border/40 flex-shrink-0 snap-start shadow-xs focus:outline-none transition-transform hover:scale-102 cursor-pointer"
                >
                  <img
                    src={photo}
                    alt={`Customer photo ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ==================================================
            4. RELATED / RECOMMENDED PRODUCTS (BELOW REVIEWS)
           ================================================== */}
        <div className="border-t border-brand-border/40 pt-14 space-y-8 text-left">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] text-[#F26A2E] font-extrabold tracking-[0.25em] uppercase block">
                CURATED FOR YOU
              </span>
              <h3 className="font-display font-bold text-2xl md:text-3xl text-brand-espresso tracking-tight">
                Recommended Fashion Ensembles
              </h3>
            </div>

            <button
              onClick={() => router.push('/catalog?department=fashion')}
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-brand-espresso hover:text-[#F26A2E] tracking-wider uppercase transition-colors"
            >
              <span>Explore Collection</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {relatedProducts.map((rel) => {
              const relSlug = rel.name.toLowerCase().replace(/ /g, '-');
              return (
                <div
                  key={rel.id}
                  onClick={() => router.push(`/product/${relSlug}`)}
                  className="bg-white border border-brand-border/50 rounded-2xl p-3 text-left space-y-3 cursor-pointer group hover:shadow-md transition-shadow flex flex-col justify-between"
                >
                  <div className="w-full aspect-[3/4] bg-[#FAF8F5] rounded-xl overflow-hidden relative">
                    <img
                      src={rel.image}
                      alt={rel.name}
                      className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                    />
                    <div className="absolute top-2 left-2 px-2 py-0.5 bg-white/90 rounded-full text-[8px] font-black uppercase tracking-wider text-brand-espresso">
                      {rel.category}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[9px] font-bold text-[#F26A2E] uppercase tracking-wider block">
                      {rel.fabric || 'AV Cotton'}
                    </span>
                    <h4 className="font-display font-medium text-xs sm:text-sm text-brand-espresso line-clamp-1 group-hover:text-[#F26A2E] transition-colors">
                      {rel.name}
                    </h4>
                    <div className="flex items-baseline gap-2 pt-0.5">
                      <span className="text-xs sm:text-sm font-bold text-brand-espresso">
                        ₹{rel.price.toLocaleString('en-IN')}
                      </span>
                      <span className="text-[10px] text-brand-warmGray line-through">
                        ₹{rel.mrp.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* ==================================================
          RESPONSIVE SIZE GUIDE MODAL (NO HORIZONTAL OVERFLOW)
         ================================================== */}
      <AnimatePresence>
        {isSizeGuideOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSizeGuideOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative z-10 w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-brand-border/40 space-y-5 text-left max-h-[90vh] overflow-y-auto"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-brand-border/30 pb-4">
                <div className="space-y-0.5">
                  <span className="text-[10px] text-[#F26A2E] font-extrabold tracking-[0.2em] uppercase block">
                    AADHYA FIT GUIDE
                  </span>
                  <h3 className="font-display font-bold text-xl text-brand-espresso">
                    Size & Measurements
                  </h3>
                </div>
                <button
                  onClick={() => setIsSizeGuideOpen(false)}
                  className="p-1.5 rounded-full hover:bg-brand-softBeige/30 text-brand-espresso cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Description */}
              <p className="text-xs text-brand-warmGray leading-relaxed font-medium">
                Measurements are provided in inches. For a tailored drape, measure comfortably around the fullest part of your bust and waist.
              </p>

              {/* Responsive Size Guide Table with Horizontal Scroll Wrapper */}
              <div className="w-full overflow-x-auto rounded-2xl border border-brand-border/40 shadow-xs">
                <table className="w-full text-xs text-left">
                  <thead className="bg-[#FAF8F5] text-brand-espresso uppercase font-extrabold text-[10px] tracking-wider border-b border-brand-border/40">
                    <tr>
                      <th className="p-3.5 pl-4">Size</th>
                      <th className="p-3.5">Bust</th>
                      <th className="p-3.5">Waist</th>
                      <th className="p-3.5">Hip</th>
                      <th className="p-3.5 pr-4">Length</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brand-border/20 font-medium">
                    {sizeGuideData.map((row) => (
                      <tr key={row.size} className="hover:bg-[#FAF8F5]/60 transition-colors">
                        <td className="p-3.5 pl-4 font-bold text-brand-espresso">{row.size}</td>
                        <td className="p-3.5 text-brand-warmGray">{row.bust}</td>
                        <td className="p-3.5 text-brand-warmGray">{row.waist}</td>
                        <td className="p-3.5 text-brand-warmGray">{row.hip}</td>
                        <td className="p-3.5 pr-4 text-brand-warmGray">{row.length}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setIsSizeGuideOpen(false)}
                  className="px-6 py-2.5 bg-brand-espresso text-white rounded-full text-xs font-bold uppercase tracking-wider shadow-sm hover:opacity-95 cursor-pointer"
                >
                  Got It
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Main product photo gallery slider Zoom Lightbox Modal */}
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
              className="max-w-4xl max-h-[80vh] relative flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={activeImages[lightboxImageIndex]}
                alt="Product Lightbox Zoom"
                className={`max-w-full max-h-[80vh] object-contain rounded-2xl shadow-2xl transition-transform duration-300 ${
                  isImgZoomed ? 'scale-[2.5] cursor-zoom-out' : 'scale-100 cursor-zoom-in'
                }`}
                onClick={() => setImgZoomed(!isImgZoomed)}
              />

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxImageIndex(prev => (prev - 1 + activeImages.length) % activeImages.length);
                }}
                className="absolute left-4 p-3 bg-white/10 hover:bg-white/20 border border-white/10 rounded-full text-white transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxImageIndex(prev => (prev + 1) % activeImages.length);
                }}
                className="absolute right-4 p-3 bg-white/10 hover:bg-white/20 border border-white/10 rounded-full text-white transition-colors cursor-pointer"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-black/60 rounded-full text-[10px] text-white/95 font-bold tracking-widest uppercase">
                {lightboxImageIndex + 1} / {activeImages.length}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Customer uploaded photo Lightbox Modal */}
      <AnimatePresence>
        {isPhotoLightboxOpen && product.customerPhotos && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#121110]/95 flex items-center justify-center p-4 md:p-12 select-none"
            onClick={() => setPhotoLightboxOpen(false)}
          >
            <button
              onClick={() => setPhotoLightboxOpen(false)}
              className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 border border-white/10 text-white rounded-full transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div 
              className="max-w-xl max-h-[80vh] relative flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={product.customerPhotos[selectedPhotoIndex]}
                alt="Customer Photo Lightbox"
                className="max-w-full max-h-[80vh] object-contain rounded-2xl shadow-2xl"
              />

              {product.customerPhotos.length > 1 && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedPhotoIndex(prev => (prev - 1 + product.customerPhotos!.length) % product.customerPhotos!.length);
                    }}
                    className="absolute left-4 p-3 bg-white/10 hover:bg-white/20 border border-white/10 rounded-full text-white transition-colors cursor-pointer"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedPhotoIndex(prev => (prev + 1) % product.customerPhotos!.length);
                    }}
                    className="absolute right-4 p-3 bg-white/10 hover:bg-white/20 border border-white/10 rounded-full text-white transition-colors cursor-pointer"
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
