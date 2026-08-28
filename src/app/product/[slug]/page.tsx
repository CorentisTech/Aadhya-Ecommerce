"use client";

import React, { use, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { PRODUCTS, Product } from '@/data/mockData';
import { 
  Heart, 
  ShoppingBag, 
  Star, 
  X, 
  Check, 
  ChevronLeft, 
  ChevronRight,
  Maximize2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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

  // States
  const [selectedSize, setSelectedSize] = useState('36');
  const [selectedColor, setSelectedColor] = useState('');
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [sizeError, setSizeError] = useState(false);
  const [isImgZoomed, setImgZoomed] = useState(false);

  // Lightbox Modals
  const [isGalleryOpen, setGalleryOpen] = useState(false);
  const [lightboxImageIndex, setLightboxImageIndex] = useState(0);
  const [isPhotoLightboxOpen, setPhotoLightboxOpen] = useState(false);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);

  // Set default selection values on mount / product change
  useEffect(() => {
    if (product) {
      // Default size
      if (product.sizes && product.sizes.length > 0) {
        setSelectedSize(product.sizes[0]);
      } else {
        setSelectedSize('36');
      }
      setSizeError(false);
      
      // Default color
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

  // Handle color change: updates gallery
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

  // Get active images based on color selection
  const activeColorObj = product.imagesByColor?.find(c => c.colorHex === selectedColor);
  const activeImages = activeColorObj?.images || Array(4).fill(product.image);

  const inWishlist = isInWishlist(product.id);

  const handleAddToCart = () => {
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      setSizeError(true);
      return;
    }
    setSizeError(false);

    // Add to Cart
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

  return (
    <div className="w-full min-h-screen bg-[#FFFFFF] py-16 px-4 md:px-12 lg:px-24 text-brand-espresso select-none">
      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* Main Floating Beige Container Card */}
        <div className="w-full bg-[#EAE6DF] rounded-[32px] p-6 md:p-12 relative shadow-lg overflow-hidden border border-brand-border/20">
          
          {/* Top-Right White Close Button */}
          <button
            onClick={() => router.push('/catalog')}
            className="absolute top-6 right-6 w-8 h-8 rounded-full bg-white flex items-center justify-center hover:bg-brand-softBeige transition-colors shadow-sm z-10 text-brand-espresso"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Mobile Structure (Visible below lg) */}
          <div className="block lg:hidden space-y-6 text-left">
            
            {/* 1. Title Block at Top */}
            <div className="space-y-3 pt-2">
              <span className="text-[9px] text-brand-warmGray font-bold tracking-[0.25em] uppercase block">
                artisan weaves
              </span>
              <h1 className="font-display font-bold text-2xl text-brand-espresso leading-tight">
                {product.name}
              </h1>
              <p className="text-xs text-[#756E69] leading-relaxed font-semibold">
                {product.description}
              </p>
              <div>
                <span className="text-[10px] font-bold text-brand-espresso tracking-widest uppercase block">
                  {product.fabric ? `${product.fabric.toUpperCase()}` : 'RAW SILK'}
                </span>
              </div>
            </div>

            {/* 2. Image Viewport */}
            <div className="w-full aspect-[3/4] bg-brand-softBeige/10 rounded-2xl overflow-hidden relative shadow-md">
              <img
                src={activeImages[activeImageIndex]}
                alt={product.name}
                className={`w-full h-full object-cover transition-transform duration-350 ${
                  isImgZoomed ? 'scale-150 cursor-zoom-out' : 'scale-100 cursor-zoom-in'
                }`}
                onClick={() => setImgZoomed(!isImgZoomed)}
              />

              {/* Fullscreen icon */}
              <button
                onClick={() => {
                  setLightboxImageIndex(activeImageIndex);
                  setGalleryOpen(true);
                }}
                className="absolute bottom-3 right-3 p-1.5 bg-[#FFFFFF]/90 hover:bg-brand-white border border-brand-border/20 text-brand-espresso rounded-full transition-all shadow-sm"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>

              {/* Swipe controls */}
              <div className="absolute inset-x-2 top-1/2 -translate-y-1/2 flex justify-between pointer-events-none">
                <button
                  onClick={handlePrevImage}
                  className="p-1.5 bg-white/80 hover:bg-white rounded-full shadow pointer-events-auto text-brand-espresso"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={handleNextImage}
                  className="p-1.5 bg-white/80 hover:bg-white rounded-full shadow pointer-events-auto text-brand-espresso"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* 3. Specs Selectors Card (Colour, REF, model size, height, size buttons) */}
            <div className="bg-white rounded-3xl p-5 shadow-sm border border-brand-border/20 space-y-4">
              {/* Colors selection */}
              <div className="space-y-1.5">
                <span className="text-[9px] font-extrabold text-brand-espresso tracking-wider uppercase block">
                  Colour: {activeColorObj?.colorName || 'Selected'}
                </span>
                <div className="flex space-x-2">
                  {product.colors?.map((colorHex) => {
                    const isSelected = selectedColor === colorHex;
                    return (
                      <button
                        key={colorHex}
                        onClick={() => handleColorChange(colorHex)}
                        className={`w-5 h-5 rounded-full border transition-all relative flex items-center justify-center ${
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

              {/* Metadata */}
              <div className="space-y-0.5 text-[9px] text-brand-warmGray font-bold tracking-widest uppercase">
                <div>REF: {product.sku || '1102/554'}</div>
                <div>The model size: {selectedSize}</div>
                <div>Height: 5.70 ft</div>
              </div>

              <div className="w-full h-px bg-brand-border/15" />

              {/* Sizes selection */}
              <div className="space-y-1.5">
                <span className="text-[9px] font-extrabold text-brand-espresso tracking-wider uppercase block">
                  Select your size:
                </span>
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

            {/* 4. Action Button (Shop button) */}
            <button
              onClick={handleAddToCart}
              disabled={added}
              className="w-full py-4 bg-white text-brand-espresso hover:bg-white/95 border border-brand-border/30 rounded-full font-bold text-xs tracking-widest uppercase transition-all shadow-md text-center block"
            >
              {added ? '✓ Added to bag' : `Shop ₹${product.price.toLocaleString('en-IN')}`}
            </button>

            {/* 5. Fabric & Fit details cards */}
            <div className="flex items-center space-x-3 pt-4 border-t border-brand-border/20">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm flex-shrink-0">
                <Check className="w-4.5 h-4.5 text-[#F26A2E] stroke-[2.5]" />
              </div>
              
              <div className="grid grid-cols-2 gap-3 flex-grow">
                <div className="bg-white rounded-xl p-2.5 shadow-sm border border-brand-border/10 text-left">
                  <h5 className="text-[8px] font-bold text-brand-espresso tracking-wider uppercase mb-0.5">
                    Fabric Details
                  </h5>
                  <p className="text-[9px] text-[#756E69] font-medium leading-tight">
                    Premium {product.fabric || 'Silk'} fibers.
                  </p>
                </div>
                <div className="bg-white rounded-xl p-2.5 shadow-sm border border-brand-border/10 text-left">
                  <h5 className="text-[8px] font-bold text-brand-espresso tracking-wider uppercase mb-0.5">
                    Fit & Style
                  </h5>
                  <p className="text-[9px] text-[#756E69] font-medium leading-tight">
                    Styled for {product.fit || 'Relaxed'} fit.
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* Desktop Structure (Visible on lg and up) */}
          <div className="hidden lg:grid grid-cols-12 gap-8 items-stretch pt-4">
            
            {/* Left Column: Product Information & Specs (4 cols) */}
            <div className="lg:col-span-4 flex flex-col justify-between text-left space-y-8 min-h-[400px]">
              
              <div className="space-y-4">
                <span className="text-[9px] text-brand-warmGray font-bold tracking-[0.25em] uppercase block">
                  artisan weaves
                </span>
                <h1 className="font-display font-bold text-3xl md:text-4.5xl text-brand-espresso leading-tight">
                  {product.name}
                </h1>
                <p className="text-xs text-brand-warmGray leading-relaxed font-semibold max-w-sm">
                  {product.description}
                </p>
                <div className="pt-2">
                  <span className="text-xs font-bold text-brand-espresso tracking-widest uppercase block">
                    {product.fabric ? `${product.fabric.toUpperCase()}` : 'RAW SILK'}
                  </span>
                </div>
              </div>

              {/* Bottom spec cards */}
              <div className="flex items-center space-x-3 pt-6 border-t border-brand-border/20">
                {/* Checkbox badge */}
                <div className="w-11 h-11 rounded-xl bg-white flex items-center justify-center shadow-sm flex-shrink-0">
                  <Check className="w-5 h-5 text-[#F26A2E] stroke-[2.5]" />
                </div>
                
                <div className="grid grid-cols-2 gap-3 flex-grow">
                  {/* Card 1 */}
                  <div className="bg-white rounded-xl p-3 shadow-sm border border-brand-border/10 text-left">
                    <h5 className="text-[8px] font-bold text-brand-espresso tracking-wider uppercase mb-1">
                      Fabric Details
                    </h5>
                    <p className="text-[9px] text-brand-warmGray font-medium leading-tight">
                      Premium {product.fabric || 'Silk'} fibers.
                    </p>
                  </div>
                  {/* Card 2 */}
                  <div className="bg-white rounded-xl p-3 shadow-sm border border-brand-border/10 text-left">
                    <h5 className="text-[8px] font-bold text-brand-espresso tracking-wider uppercase mb-1">
                      Fit & Style
                    </h5>
                    <p className="text-[9px] text-brand-warmGray font-medium leading-tight">
                      Styled for {product.fit || 'Relaxed'} fit.
                    </p>
                  </div>
                </div>
              </div>

            </div>

            {/* Center Column: Portrait Model Image (4 cols) */}
            <div className="lg:col-span-4 flex justify-center items-center relative">
              <div className="w-full aspect-[3/4] bg-brand-softBeige/10 rounded-2xl overflow-hidden relative shadow-md">
                <img
                  src={activeImages[activeImageIndex]}
                  alt={product.name}
                  className={`w-full h-full object-cover transition-transform duration-300 ${
                    isImgZoomed ? 'scale-150 cursor-zoom-out' : 'scale-100 cursor-zoom-in'
                  }`}
                  onClick={() => setImgZoomed(!isImgZoomed)}
                />

                {/* Fullscreen icon */}
                <button
                  onClick={() => {
                    setLightboxImageIndex(activeImageIndex);
                    setGalleryOpen(true);
                  }}
                  className="absolute bottom-3 right-3 p-2 bg-[#FFFFFF]/90 hover:bg-brand-white border border-brand-border/20 text-brand-espresso rounded-full transition-all shadow-sm"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                </button>

                {/* Swipe controls */}
                <div className="absolute inset-x-2 top-1/2 -translate-y-1/2 flex justify-between pointer-events-none">
                  <button
                    onClick={handlePrevImage}
                    className="p-1.5 bg-white/80 hover:bg-white rounded-full shadow pointer-events-auto text-brand-espresso"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleNextImage}
                    className="p-1.5 bg-white/80 hover:bg-white rounded-full shadow pointer-events-auto text-brand-espresso"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column: Spec Card & Action Controls (4 cols) */}
            <div className="lg:col-span-4 flex flex-col justify-between space-y-6">
              
              {/* White Specifications Card */}
              <div className="bg-white rounded-[24px] p-6 shadow-sm border border-brand-border/20 text-left space-y-5 flex-grow">
                
                {/* Color swatch selection */}
                <div className="space-y-2">
                  <span className="text-[10px] font-extrabold text-brand-espresso tracking-wider uppercase block">
                    Colour: {activeColorObj?.colorName || 'Selected'}
                  </span>
                  <div className="flex space-x-2">
                    {product.colors?.map((colorHex) => {
                      const isSelected = selectedColor === colorHex;
                      return (
                        <button
                          key={colorHex}
                          onClick={() => handleColorChange(colorHex)}
                          className={`w-6 h-6 rounded-full border transition-all relative flex items-center justify-center ${
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

                {/* SKU & size metadata updates */}
                <div className="space-y-1.5 text-[9px] md:text-[10px] text-brand-warmGray font-extrabold tracking-widest uppercase">
                  <div>REF: {product.sku || '1102/554'}</div>
                  <div>The model size: {selectedSize}</div>
                  <div>Height: 5.70 ft / 174 cm</div>
                </div>

                <div className="w-full h-px bg-brand-border/20 my-3" />

                {/* Sizing selection */}
                <div className="space-y-2">
                  <span className="text-[10px] font-extrabold text-brand-espresso tracking-wider uppercase block">
                    Select your size:
                  </span>
                  <div className="flex gap-2">
                    {(product.sizes || ['34', '36', '38', '40']).map((sz) => {
                      const isSelected = selectedSize === sz;
                      return (
                        <button
                          key={sz}
                          onClick={() => setSelectedSize(sz)}
                          className={`w-10 h-10 border rounded-lg text-xs font-bold transition-all ${
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

              </div>

              {/* Action Button: Shop Price */}
              <button
                onClick={handleAddToCart}
                disabled={added}
                className="w-full py-4 bg-white text-brand-espresso hover:bg-white/95 border border-brand-border/30 rounded-full font-bold text-xs tracking-widest uppercase transition-all shadow-md text-center block"
              >
                {added ? '✓ Added to bag' : `Shop ₹${product.price.toLocaleString('en-IN')}`}
              </button>

            </div>

          </div>

        </div>

        {/* Rating & Reviews Section */}
        <div className="border-t border-brand-border/40 pt-16 grid grid-cols-1 lg:grid-cols-12 gap-8 text-left bg-[#FFFFFF]">
          {/* Reviews Score Card (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <h3 className="font-display font-bold text-lg md:text-xl tracking-wider text-brand-espresso uppercase">
              Rating & Reviews
            </h3>
            
            <div className="flex items-center space-x-6">
              <div className="text-center">
                <span className="font-display font-extrabold text-5xl md:text-6xl text-brand-espresso">
                  {product.rating || '4.5'}
                </span>
                <span className="text-xs text-brand-warmGray font-bold block mt-1">/ 5</span>
              </div>
              
              <div className="flex-grow space-y-1 max-w-[200px]">
                {/* Stars distribution charts (thin black solid lines over light tracks) */}
                {[
                  { star: 5, pct: '60%' },
                  { star: 4, pct: '20%' },
                  { star: 3, pct: '10%' },
                  { star: 2, pct: '6%' },
                  { star: 1, pct: '4%' }
                ].map((row) => (
                  <div key={row.star} className="flex items-center text-[10px] font-bold text-brand-espresso">
                    <span className="w-3">{row.star}</span>
                    <Star className="w-2.5 h-2.5 text-brand-espresso fill-current mx-1.5" />
                    <div className="flex-grow h-[1px] bg-brand-border/30 rounded-full overflow-hidden">
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
            <div className="bg-[#EAE6DF]/30 border border-brand-border/30 p-6 rounded-2xl space-y-4 shadow-sm relative">
              <div className="flex text-brand-espresso">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3 h-3 fill-current" />
                ))}
              </div>
              <p className="text-xs md:text-sm text-brand-espresso font-medium leading-relaxed">
                "The dedication to sustainability and ethical practices resonates strongly with today's consumers, positioning the brand as a responsible choice in the fashion world."
              </p>
              
              <div className="flex items-center space-x-3 pt-2">
                <div className="w-8 h-8 rounded-full bg-brand-dustyRose/20 flex items-center justify-center text-brand-dustyRose text-xs font-bold font-display uppercase">
                  AM
                </div>
                <div>
                  <h5 className="text-[10px] md:text-[11px] font-extrabold text-brand-espresso uppercase">
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
                onClick={() => alert("All verified reviews are loaded!")}
                className="px-6 py-2.5 border border-brand-border rounded-full text-[10px] font-bold tracking-widest text-brand-espresso hover:bg-brand-softBeige/40 transition-colors uppercase"
              >
                View All Reviews
              </button>
            </div>
          </div>
        </div>

        {/* Customer Uploaded Photos grid */}
        {product.customerPhotos && product.customerPhotos.length > 0 && (
          <div className="border-t border-brand-border/40 pt-16 text-left space-y-6 bg-[#FFFFFF]">
            <h3 className="font-display font-bold text-xs tracking-widest text-brand-espresso uppercase">
              CUSTOMER UPLOADED PHOTOS ({product.customerPhotos.length})
            </h3>
            
            <div className="flex overflow-x-auto gap-4 pb-2 scrollbar-none snap-x snap-mandatory">
              {product.customerPhotos.map((photo, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setSelectedPhotoIndex(idx);
                    setPhotoLightboxOpen(true);
                  }}
                  className="w-36 md:w-44 aspect-square rounded-2xl overflow-hidden bg-brand-softBeige/15 border border-brand-border/40 flex-shrink-0 snap-start shadow-sm focus:outline-none transition-transform hover:scale-102"
                >
                  <img
                    src={photo}
                    alt={`Customer uploaded ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        )}

      </div>

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
            {/* Close button */}
            <button
              onClick={() => setGalleryOpen(false)}
              className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 border border-white/10 text-white rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Slider container */}
            <div 
              className="max-w-4xl max-h-[80vh] relative flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={activeImages[lightboxImageIndex]}
                alt="Product Lightbox Zoom"
                className={`max-w-full max-h-[80vh] object-contain rounded-2xl shadow-2xl transition-transform duration-300 ${
                  isImgZoomed ? 'scale-150 cursor-zoom-out' : 'scale-100 cursor-zoom-in'
                }`}
                onClick={() => setImgZoomed(!isImgZoomed)}
              />

              {/* Prev / Next controls */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxImageIndex(prev => (prev - 1 + activeImages.length) % activeImages.length);
                }}
                className="absolute left-4 p-3 bg-white/10 hover:bg-white/20 border border-white/10 rounded-full text-white transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxImageIndex(prev => (prev + 1) % activeImages.length);
                }}
                className="absolute right-4 p-3 bg-white/10 hover:bg-white/20 border border-white/10 rounded-full text-white transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              {/* Image index counter */}
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
            {/* Close button */}
            <button
              onClick={() => setPhotoLightboxOpen(false)}
              className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 border border-white/10 text-white rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Slider container */}
            <div 
              className="max-w-xl max-h-[80vh] relative flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={product.customerPhotos[selectedPhotoIndex]}
                alt="Customer Photo Lightbox"
                className="max-w-full max-h-[80vh] object-contain rounded-2xl shadow-2xl"
              />

              {/* Prev / Next controls */}
              {product.customerPhotos.length > 1 && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedPhotoIndex(prev => (prev - 1 + product.customerPhotos!.length) % product.customerPhotos!.length);
                    }}
                    className="absolute left-4 p-3 bg-white/10 hover:bg-white/20 border border-white/10 rounded-full text-white transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedPhotoIndex(prev => (prev + 1) % product.customerPhotos!.length);
                    }}
                    className="absolute right-4 p-3 bg-white/10 hover:bg-white/20 border border-white/10 rounded-full text-white transition-colors"
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
