"use client";

import React, { use, useState } from 'react';
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

  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [isDetailsExpanded, setIsDetailsExpanded] = useState(false);

  // Gallery lightboxes
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isGalleryOpen, setGalleryOpen] = useState(false);

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

  const inWishlist = isInWishlist(product.id);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  const productImages = product.images && product.images.length > 0 
    ? product.images 
    : [product.image];

  // Related numismatic collectibles
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
          <div className="md:col-span-6 bg-brand-white p-6 sm:p-8 border border-brand-border/60 rounded-3xl relative flex flex-col items-center justify-center min-h-[380px] md:min-h-[460px] shadow-sm">
            {/* Rarity Tag */}
            <div className="absolute top-4 left-4">
              <span className="text-[9px] bg-brand-espresso text-brand-gold font-extrabold tracking-widest px-3 py-1 rounded-full shadow-xs uppercase">
                {product.rarity || 'RARE'}
              </span>
            </div>

            {/* Main Collectible Display */}
            <div 
              onClick={() => setGalleryOpen(true)}
              className="w-full h-[300px] md:h-[360px] flex items-center justify-center p-4 cursor-pointer relative group"
            >
              {product.visualType === 'note' ? (
                <img 
                  src={productImages[activeImageIndex]} 
                  alt={product.name} 
                  className="max-w-full max-h-full object-contain shadow-md rounded-lg group-hover:scale-103 transition-transform"
                />
              ) : (
                <ProductVisual
                  type="coin"
                  color={product.visualColor || '#B89A67'}
                  pattern={product.visualPattern || 'antique-metallic'}
                  className="transform transition-transform group-hover:scale-105"
                />
              )}

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setGalleryOpen(true);
                }}
                className="absolute bottom-2 right-2 p-2 bg-white/90 border border-brand-border/30 rounded-full shadow-sm text-brand-espresso hover:bg-white"
                aria-label="Zoom artifact"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Thumbnail switcher if multiple images available */}
            {productImages.length > 1 && (
              <div className="flex gap-2 pt-3">
                {productImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`w-12 h-12 rounded-xl border p-1 overflow-hidden transition-all cursor-pointer ${
                      activeImageIndex === idx ? 'border-[#F26A2E] ring-1 ring-[#F26A2E]/30' : 'border-brand-border/40 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="Thumbnail" className="w-full h-full object-contain" />
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
