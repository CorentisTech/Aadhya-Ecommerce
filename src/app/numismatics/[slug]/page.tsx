"use client";

import React, { use, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { PRODUCTS, Product } from '@/data/mockData';
import { ProductVisual } from '@/components/ui/ProductVisual';
import { Heart, ShoppingBag, ArrowLeft, Info, ChevronDown, ChevronUp, ShieldCheck, Award, Truck } from 'lucide-react';
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
  const [activeAccordion, setActiveAccordion] = useState<string | null>('specs');

  if (!product) {
    return (
      <div className="w-full min-h-screen flex flex-col items-center justify-center bg-brand-warmWhite text-brand-espresso p-6">
        <h2 className="font-display font-bold text-lg tracking-widest uppercase">COLLECTION ITEM NOT FOUND</h2>
        <button
          onClick={() => router.push('/numismatics')}
          className="mt-4 px-6 py-2.5 bg-[#F26A2E] text-white text-xs font-bold tracking-widest uppercase rounded-lg"
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

  const relatedProducts = PRODUCTS.filter(
    (p) => p.department === 'numismatics' && p.id !== product.id
  ).slice(0, 4);

  const toggleAccordion = (section: string) => {
    setActiveAccordion(activeAccordion === section ? null : section);
  };

  return (
    <div className="w-full min-h-screen bg-brand-warmWhite py-12 px-4 md:px-12 lg:px-24 text-brand-espresso text-left">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* Back navigation */}
        <div className="flex items-center justify-between border-b border-brand-border/40 pb-4">
          <button
            onClick={() => router.push('/numismatics')}
            className="flex items-center gap-1.5 text-xs font-bold tracking-widest text-brand-warmGray hover:text-[#F26A2E] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>BACK TO NUMISMATICS GALLERY</span>
          </button>
          <span className="text-[10px] text-[#F26A2E] font-extrabold tracking-[0.25em] uppercase">
            AADHYA {product.department.toUpperCase()}
          </span>
        </div>

        {/* Product details split */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-12 items-start">
          
          {/* Left Column: Image Canvas (6 cols) */}
          <div className="md:col-span-6 bg-brand-white p-8 border border-brand-border/60 rounded-3xl relative flex flex-col items-center justify-center min-h-[380px] md:min-h-[460px] shadow-sm">
            {/* Rarity Tag */}
            <div className="absolute top-4 left-4">
              <span className="text-[9px] bg-brand-espresso text-brand-gold font-extrabold tracking-widest px-3 py-1 rounded-full shadow-xs uppercase">
                {product.rarity || 'RARE'}
              </span>
            </div>

            {/* Main Collectible Display */}
            <div className="w-full h-[320px] md:h-[380px] flex items-center justify-center p-4">
              {product.visualType === 'note' ? (
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="max-w-full max-h-full object-contain shadow-md rounded-lg"
                />
              ) : (
                <ProductVisual
                  type="coin"
                  color={product.visualColor || '#B89A67'}
                  pattern={product.visualPattern || 'antique-metallic'}
                  className="transform transition-transform hover:scale-103 cursor-pointer"
                />
              )}
            </div>

            <div className="text-[9px] font-extrabold text-brand-warmGray tracking-widest uppercase mt-2">
              ✦ Certified Authentic Historical Artifact
            </div>
          </div>

          {/* Right Column: Spec sheet & cart controls (6 cols) */}
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

            {/* Historical Spec Sheet Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-[#FAF7F2] p-5 border border-brand-border/40 rounded-2xl text-[10px] tracking-wider font-semibold text-brand-espresso">
              <div>
                <span className="text-brand-warmGray block uppercase">HISTORIC ERA</span>
                <span className="font-extrabold text-xs">{product.era || 'Republic India'}</span>
              </div>
              <div>
                <span className="text-brand-warmGray block uppercase">MINT YEAR</span>
                <span className="font-extrabold text-xs">{product.year || '1954'}</span>
              </div>
              <div>
                <span className="text-brand-warmGray block uppercase">MATERIAL</span>
                <span className="font-extrabold text-xs">{product.material || 'Silver'}</span>
              </div>
              <div>
                <span className="text-brand-warmGray block uppercase">WEIGHT</span>
                <span className="font-extrabold text-xs">{product.weight || '11.66 g'}</span>
              </div>
              <div>
                <span className="text-brand-warmGray block uppercase">CONDITION</span>
                <span className="font-extrabold text-xs">{product.condition || 'Extremely Fine'}</span>
              </div>
              <div>
                <span className="text-brand-warmGray block uppercase">MINT</span>
                <span className="font-extrabold text-xs">{product.mint || 'Mumbai'}</span>
              </div>
            </div>

            {/* Cart & Wishlist Actions */}
            <div className="flex gap-3 pt-4 border-t border-brand-border/40">
              <button
                onClick={handleAddToCart}
                disabled={added}
                className={`flex-grow py-4 px-6 rounded-xl flex items-center justify-center gap-2 font-extrabold text-xs tracking-widest uppercase transition-all shadow-md ${
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
                className={`p-4 rounded-xl border transition-all flex items-center justify-center ${
                  inWishlist
                    ? 'bg-brand-blush border-brand-dustyRose text-brand-dustyRose'
                    : 'bg-brand-white border-brand-border hover:bg-brand-softBeige/40 text-brand-warmGray'
                }`}
                aria-label="Add to Wishlist"
              >
                <Heart className={`w-5 h-5 ${inWishlist ? 'fill-brand-dustyRose' : ''}`} />
              </button>
            </div>

            {/* Expandable Accordion Specs */}
            <div className="space-y-2 pt-4 border-t border-brand-border/40">
              
              {/* History */}
              <div className="border border-brand-border/40 rounded-xl overflow-hidden bg-brand-white">
                <button
                  onClick={() => toggleAccordion('history')}
                  className="w-full p-4 text-left text-xs font-extrabold text-brand-espresso flex items-center justify-between uppercase tracking-wider"
                >
                  <span>HISTORICAL BACKGROUND & PROVENANCE</span>
                  {activeAccordion === 'history' ? <ChevronUp className="w-4 h-4 text-[#F26A2E]" /> : <ChevronDown className="w-4 h-4 text-brand-warmGray" />}
                </button>
                {activeAccordion === 'history' && (
                  <div className="p-4 pt-0 text-xs text-brand-warmGray leading-relaxed font-medium">
                    This artifact originates from the archival mint reserves. Minted during pivotal economic transitions, each piece preserves original die strikes, metallic purity, and historic provenance.
                  </div>
                )}
              </div>

              {/* Authenticity */}
              <div className="border border-brand-border/40 rounded-xl overflow-hidden bg-brand-white">
                <button
                  onClick={() => toggleAccordion('authenticity')}
                  className="w-full p-4 text-left text-xs font-extrabold text-brand-espresso flex items-center justify-between uppercase tracking-wider"
                >
                  <span>AUTHENTICITY & CERTIFICATION</span>
                  {activeAccordion === 'authenticity' ? <ChevronUp className="w-4 h-4 text-[#F26A2E]" /> : <ChevronDown className="w-4 h-4 text-brand-warmGray" />}
                </button>
                {activeAccordion === 'authenticity' && (
                  <div className="p-4 pt-0 text-xs text-brand-warmGray leading-relaxed font-medium">
                    Accompanied by an official Aadhya Numismatic Certificate of Authenticity. Inspected and verified using non-destructive XRF metallic spectroscopy and microscopic grading.
                  </div>
                )}
              </div>

              {/* Shipping */}
              <div className="border border-brand-border/40 rounded-xl overflow-hidden bg-brand-white">
                <button
                  onClick={() => toggleAccordion('shipping')}
                  className="w-full p-4 text-left text-xs font-extrabold text-brand-espresso flex items-center justify-between uppercase tracking-wider"
                >
                  <span>INSURED SHIPPING & PACKAGING</span>
                  {activeAccordion === 'shipping' ? <ChevronUp className="w-4 h-4 text-[#F26A2E]" /> : <ChevronDown className="w-4 h-4 text-brand-warmGray" />}
                </button>
                {activeAccordion === 'shipping' && (
                  <div className="p-4 pt-0 text-xs text-brand-warmGray leading-relaxed font-medium">
                    Housed in an inert tamper-evident acrylic slab. Shipped via insured transit with real-time GPS tracking and mandatory signature confirmation upon delivery.
                  </div>
                )}
              </div>

            </div>

          </div>
        </div>

        {/* SECTION: YOU MAY ALSO LIKE (Related Numismatic Collectibles) */}
        <div className="pt-12 border-t border-brand-border/40 space-y-6">
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
                className="bg-brand-white border border-brand-border/50 rounded-2xl p-3 text-left space-y-3 cursor-pointer group hover:shadow-md transition-shadow"
              >
                <div className="w-full aspect-[4/5] bg-[#FAF7F2] rounded-xl p-4 flex items-center justify-center relative overflow-hidden border border-brand-border/30">
                  {rel.visualType === 'note' ? (
                    <img src={rel.image} alt={rel.name} className="w-full h-auto object-contain rounded" />
                  ) : (
                    <ProductVisual type="coin" color={rel.visualColor || '#B89A67'} pattern={rel.visualPattern || 'antique-metallic'} />
                  )}
                </div>
                <div>
                  <span className="text-[8px] font-bold text-brand-warmGray tracking-widest uppercase block">{rel.year || '1954'}</span>
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
    </div>
  );
}
