"use client";

import React, { use, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { PRODUCTS, Product } from '@/data/mockData';
import { ProductVisual } from '@/components/ui/ProductVisual';
import { 
  Heart, 
  ShoppingBag, 
  ArrowLeft, 
  Star, 
  X, 
  ChevronDown, 
  ChevronUp, 
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

  // Find product by slug
  const product = PRODUCTS.find(
    (p) => p.name.toLowerCase().replace(/ /g, '-') === slug
  );

  // Detail Page States
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [sizeError, setSizeError] = useState(false);
  
  // Accordion open states
  const [accordions, setAccordions] = useState({
    details: true,
    shipping: false,
    returns: false
  });

  // Lightbox Modal States
  const [isGalleryOpen, setGalleryOpen] = useState(false);
  const [lightboxImageIndex, setLightboxImageIndex] = useState(0);
  const [isPhotoLightboxOpen, setPhotoLightboxOpen] = useState(false);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);

  // Set default selection values on mount / product change
  useEffect(() => {
    if (product) {
      setSelectedSize('');
      setSizeError(false);
      
      // Set default color
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
    setActiveImageIndex(0); // Reset gallery thumbnail index to first
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

    // Add to Context Cart
    const colorName = activeColorObj?.colorName || selectedColor;
    addToCart(product, quantity, selectedSize, colorName);
    
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  const toggleAccordion = (section: keyof typeof accordions) => {
    setAccordions(prev => ({ ...prev, [section]: !prev[section] }));
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
        
        {/* Breadcrumb Back row */}
        <div className="flex items-center justify-between border-b border-brand-border pb-4">
          <button
            onClick={() => router.push('/catalog')}
            className="flex items-center gap-1.5 text-xs font-bold tracking-widest text-brand-warmGray hover:text-brand-espresso transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>BACK TO PRODUCTS</span>
          </button>
          <span className="text-[10px] text-brand-warmGray font-bold tracking-[0.25em] uppercase">
            AADHYA FASHION EDITORIAL
          </span>
        </div>

        {/* 3-column layout splits (Thumbnails, Main Image, Purchasing Specs) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Column 1: Thumbnails Vertical selector (2 cols on desktop) */}
          <div className="hidden lg:flex lg:col-span-2 flex-col space-y-3">
            {activeImages.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImageIndex(idx)}
                className={`w-full aspect-[4/5] bg-brand-softBeige/10 border rounded-xl overflow-hidden p-1 transition-all ${
                  activeImageIndex === idx
                    ? 'border-brand-espresso ring-1 ring-brand-espresso/35'
                    : 'border-brand-border/40 hover:border-brand-warmGray'
                }`}
              >
                <img
                  src={img}
                  alt={`Thumbnail ${idx + 1}`}
                  className="w-full h-full object-cover rounded-lg"
                />
              </button>
            ))}
          </div>

          {/* Column 2: Large main image panel (6 cols on desktop) */}
          <div className="col-span-1 lg:col-span-6 space-y-4">
            <div className="w-full aspect-[4/5] bg-brand-softBeige/10 border border-brand-border/40 rounded-3xl overflow-hidden relative flex items-center justify-center shadow-sm group">
              {/* Discount Badge */}
              <div className="absolute top-4 left-4 z-10">
                <span className="text-[8px] md:text-[9px] bg-brand-sale text-brand-warmWhite font-extrabold tracking-widest px-3 py-1 rounded-full shadow-sm">
                  {product.discount}% OFF
                </span>
              </div>

              {/* View Fullscreen overlay icon */}
              <button
                onClick={() => {
                  setLightboxImageIndex(activeImageIndex);
                  setGalleryOpen(true);
                }}
                className="absolute bottom-4 right-4 z-10 p-2.5 bg-[#FFFFFF]/90 hover:bg-brand-white border border-brand-border/40 text-brand-espresso rounded-full transition-all shadow-sm opacity-0 group-hover:opacity-100"
                aria-label="Zoom Image"
              >
                <Maximize2 className="w-4 h-4" />
              </button>

              {/* Main Image */}
              <img
                src={activeImages[activeImageIndex]}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-[1.01]"
              />

              {/* Mobile Swipe Indicators */}
              <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 flex justify-between lg:hidden pointer-events-none">
                <button
                  onClick={handlePrevImage}
                  className="p-2 bg-white/80 border border-brand-border/20 rounded-full shadow pointer-events-auto text-brand-espresso hover:bg-white transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={handleNextImage}
                  className="p-2 bg-white/80 border border-brand-border/20 rounded-full shadow pointer-events-auto text-brand-espresso hover:bg-white transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Horizontal thumbnail slider on mobile/tablet viewports */}
            <div className="flex lg:hidden overflow-x-auto gap-3 pb-2 scrollbar-none snap-x snap-mandatory">
              {activeImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-16 aspect-[4/5] bg-brand-softBeige/10 border rounded-lg overflow-hidden flex-shrink-0 snap-start p-0.5 ${
                    activeImageIndex === idx ? 'border-brand-espresso' : 'border-brand-border/40'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover rounded" />
                </button>
              ))}
            </div>
          </div>

          {/* Column 3: Purchasing Specs (4 cols on desktop) */}
          <div className="col-span-1 lg:col-span-4 space-y-6 text-left">
            
            {/* Header info */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[9px] text-brand-warmGray font-bold tracking-[0.2em] uppercase">
                  {product.category}
                </span>
                {product.sku && (
                  <span className="text-[9px] text-brand-warmGray font-semibold tracking-wider">
                    {product.sku}
                  </span>
                )}
              </div>
              <h1 className="font-display font-bold text-2xl md:text-3.5xl text-brand-espresso leading-tight">
                {product.name}
              </h1>
              
              <div className="flex items-baseline space-x-3 pt-2">
                <span className="text-xl md:text-2xl font-bold text-brand-espresso">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
                <span className="text-sm font-semibold text-brand-warmGray line-through">
                  ₹{product.mrp.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <p className="text-xs text-brand-warmGray leading-relaxed font-medium">
              {product.description}
            </p>

            {/* Color selection Dot Swatches */}
            {product.colors && product.colors.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[9px] font-bold text-brand-warmGray tracking-widest uppercase">
                  <span>COLOUR: {activeColorObj?.colorName || 'SELECTED'}</span>
                </div>
                <div className="flex space-x-2.5">
                  {product.colors.map((colorHex) => {
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
                          <Check className={`w-3.5 h-3.5 ${colorHex === '#FFFFFF' || colorHex === '#FCFAF7' ? 'text-brand-espresso' : 'text-white'}`} />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Size selection */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-[9px] font-bold text-brand-warmGray tracking-widest uppercase">
                  <span>SELECT SIZE:</span>
                  {sizeError && (
                    <span className="text-brand-sale text-[8px] font-extrabold normal-case">
                      * Please select a size
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-2 text-xs font-bold text-brand-espresso">
                  {product.sizes.map((sz) => {
                    const isSelected = selectedSize === sz;
                    return (
                      <button
                        key={sz}
                        onClick={() => {
                          setSelectedSize(sz);
                          setSizeError(false);
                        }}
                        className={`px-4 py-2 border rounded-xl transition-all shadow-sm ${
                          isSelected
                            ? 'border-brand-espresso bg-brand-espresso text-brand-white'
                            : 'border-brand-border bg-white hover:bg-brand-softBeige/30'
                        }`}
                      >
                        {sz}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Model Dimensions */}
            {product.modelInfo && (
              <p className="text-[10px] text-brand-warmGray font-semibold tracking-wide italic">
                {product.modelInfo}
              </p>
            )}

            {/* Add to Cart & Wishlist Actions */}
            <div className="flex gap-4 pt-4 border-t border-brand-border/40">
              <button
                onClick={handleAddToCart}
                disabled={added}
                className={`flex-grow py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 font-bold text-xs tracking-widest uppercase transition-all shadow-md ${
                  added 
                    ? 'bg-brand-success text-brand-white' 
                    : 'bg-[#F26A2E] text-brand-white hover:bg-[#F26A2E]/90'
                }`}
              >
                {added ? (
                  <span>✓ ADDED TO BAG</span>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>ADD TO SHOPPING BAG</span>
                  </>
                )}
              </button>

              <button
                onClick={() => toggleWishlist(product)}
                className={`p-3.5 rounded-xl border transition-all flex items-center justify-center shadow-sm ${
                  inWishlist
                    ? 'bg-brand-blush/40 border-brand-dustyRose text-brand-dustyRose'
                    : 'border-brand-border hover:bg-brand-softBeige/30 text-brand-warmGray'
                }`}
                aria-label="Wishlist"
              >
                <Heart className={`w-4.5 h-4.5 ${inWishlist ? 'fill-brand-dustyRose' : ''}`} />
              </button>
            </div>

            {/* Collapsible details accordions */}
            <div className="border-t border-brand-border/40 pt-4 space-y-1">
              {/* Accordion 1: Details */}
              <div className="border-b border-brand-border/20 py-2">
                <button
                  onClick={() => toggleAccordion('details')}
                  className="w-full flex items-center justify-between text-[10px] font-extrabold tracking-widest text-brand-espresso uppercase focus:outline-none"
                >
                  <span>PRODUCT DETAILS & DESCRIPTION</span>
                  {accordions.details ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>
                <AnimatePresence>
                  {accordions.details && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <ul className="pl-4 pr-2 pt-2.5 space-y-1.5 list-disc text-[11px] text-brand-warmGray font-medium leading-relaxed">
                        <li>Fabric composition: {product.fabric || 'Premium weave'}</li>
                        <li>Occasion parameters: {product.occasion || 'General wear'}</li>
                        <li>Silhouettes fit: {product.fit || 'Regular'}</li>
                        {product.details?.map((detailItem, idx) => (
                          <li key={idx}>{detailItem}</li>
                        ))}
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Accordion 2: Shipping */}
              <div className="border-b border-brand-border/20 py-2">
                <button
                  onClick={() => toggleAccordion('shipping')}
                  className="w-full flex items-center justify-between text-[10px] font-extrabold tracking-widest text-brand-espresso uppercase focus:outline-none"
                >
                  <span>SHIPPING & DELIVERY</span>
                  {accordions.shipping ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>
                <AnimatePresence>
                  {accordions.shipping && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <p className="pt-2.5 text-[11px] text-brand-warmGray leading-relaxed font-medium">
                        Standard courier shipping delivered within 3-5 business days. Safe, insured courier packaging is certified for security.
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Accordion 3: Returns */}
              <div className="border-b border-brand-border/20 py-2">
                <button
                  onClick={() => toggleAccordion('returns')}
                  className="w-full flex items-center justify-between text-[10px] font-extrabold tracking-widest text-brand-espresso uppercase focus:outline-none"
                >
                  <span>EASY RETURN POLICY</span>
                  {accordions.returns ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>
                <AnimatePresence>
                  {accordions.returns && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <p className="pt-2.5 text-[11px] text-brand-warmGray leading-relaxed font-medium">
                        Hassle-free 7-day return collection from your doorstep. The items must remain unworn, with original tags intact.
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

          </div>

        </div>

        {/* Rating & Reviews Section */}
        <div className="border-t border-brand-border/40 pt-16 grid grid-cols-1 lg:grid-cols-12 gap-8 text-left bg-brand-white">
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
                {/* 5 lines for stars distribution */}
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
                    <div className="flex-grow h-1 bg-brand-softBeige/60 rounded-full overflow-hidden">
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

          {/* Testimonial card lists (7 cols) */}
          <div className="lg:col-span-7 space-y-4 flex flex-col justify-between">
            <div className="bg-brand-softBeige/20 border border-brand-border/40 p-6 rounded-2xl space-y-4 shadow-sm relative">
              <div className="flex text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-current" />
                ))}
              </div>
              <p className="text-xs md:text-sm text-brand-espresso italic leading-relaxed font-medium">
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
                onClick={() => alert("All verified customer reviews are synced!")}
                className="px-6 py-2.5 border border-brand-border rounded-full text-[10px] font-bold tracking-widest text-brand-espresso hover:bg-brand-softBeige/40 transition-colors uppercase"
              >
                View All Reviews
              </button>
            </div>
          </div>
        </div>

        {/* Customer Uploaded Photos grid */}
        {product.customerPhotos && product.customerPhotos.length > 0 && (
          <div className="border-t border-brand-border/40 pt-16 text-left space-y-6 bg-brand-white">
            <h3 className="font-display font-bold text-sm md:text-xs tracking-widest text-brand-espresso uppercase">
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
                className="max-w-full max-h-[80vh] object-contain rounded-2xl shadow-2xl"
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
