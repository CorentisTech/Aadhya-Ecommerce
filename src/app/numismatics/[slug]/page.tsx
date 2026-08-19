"use client";

import React, { use, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { PRODUCTS, Product } from '@/data/mockData';
import { ProductVisual } from '@/components/ui/ProductVisual';
import { Heart, ShoppingBag, ArrowLeft, Info } from 'lucide-react';

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

  if (!product) {
    return (
      <div className="w-full min-h-screen flex flex-col items-center justify-center bg-brand-warmWhite text-brand-espresso p-6">
        <h2 className="font-display font-bold text-lg tracking-widest uppercase">COLLECTION ITEM NOT FOUND</h2>
        <button
          onClick={() => router.push('/numismatics')}
          className="mt-4 px-6 py-2.5 bg-brand-espresso text-brand-white text-xs font-bold tracking-widest uppercase rounded-lg"
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

  return (
    <div className="w-full min-h-screen bg-brand-warmWhite py-16 px-6 md:px-12 lg:px-24 text-brand-espresso">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Back navigation */}
        <div className="flex items-center justify-between border-b border-brand-border pb-4">
          <button
            onClick={() => router.push('/numismatics')}
            className="flex items-center gap-1.5 text-xs font-bold tracking-widest text-brand-warmGray hover:text-brand-espresso transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>BACK TO GALLERY</span>
          </button>
          <span className="text-[10px] text-brand-antiqueBronze font-bold tracking-[0.25em] uppercase">
            AADHYA {product.department.toUpperCase()}
          </span>
        </div>

        {/* Product details split */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
          {/* Left Column: Image Canvas (6 cols) */}
          <div className="md:col-span-6 bg-brand-white p-8 border border-brand-border/60 rounded-3xl relative flex items-center justify-center min-h-[350px] md:min-h-[450px]">
            {/* Rarity Tag */}
            <div className="absolute top-4 left-4">
              <span className="text-[9px] bg-brand-espresso text-brand-gold font-extrabold tracking-widest px-3 py-1 rounded-full shadow-sm">
                {product.rarity?.toUpperCase()}
              </span>
            </div>

            {/* Coin Detail Visual (Isolated) */}
            <div className="w-72 h-[350px] md:h-[400px] flex items-center justify-center">
              <ProductVisual
                type={product.visualType}
                color={product.visualColor}
                pattern={product.visualPattern}
                className="transform transition-transform hover:scale-103"
              />
            </div>
          </div>

          {/* Right Column: Spec sheet & cart addition controls (6 cols) */}
          <div className="md:col-span-6 space-y-6">
            <div className="space-y-2 text-left">
              <span className="text-[10px] text-brand-warmGray font-bold tracking-widest block uppercase">
                {product.category}
              </span>
              <h1 className="font-display font-bold text-3xl md:text-4xl text-brand-espresso leading-tight">
                {product.name}
              </h1>

              {/* Price row */}
              <div className="flex items-baseline space-x-3 pt-2">
                <span className="text-2xl font-bold text-brand-espresso">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
                <span className="text-base text-brand-warmGray line-through font-semibold">
                  ₹{product.mrp.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Description */}
            <p className="text-xs text-brand-warmGray leading-relaxed font-medium">
              {product.description}
            </p>

            {/* Historical Spec Sheet */}
            <div className="grid grid-cols-2 gap-4 bg-brand-softBeige/40 p-5 border border-brand-border/40 rounded-2xl text-[10px] tracking-wider font-semibold text-brand-espresso">
              <div>
                <span className="text-brand-warmGray block">HISTORIC ERA</span>
                <span className="font-extrabold text-xs">{product.era || 'Unknown'}</span>
              </div>
              <div>
                <span className="text-brand-warmGray block">MINT DATE / YEAR</span>
                <span className="font-extrabold text-xs">{product.year || 'Unknown'}</span>
              </div>
              <div>
                <span className="text-brand-warmGray block">RARITY GRADE</span>
                <span className="font-extrabold text-xs text-brand-antiqueBronze">{product.rarity || 'Common'}</span>
              </div>
              <div>
                <span className="text-brand-warmGray block">METALLIC GRADE</span>
                <span className="font-extrabold text-xs text-brand-success">100% Certified</span>
              </div>
            </div>

            <div className="bg-brand-softBeige/20 border border-brand-border/30 p-4 rounded-xl flex items-start gap-3">
              <Info className="w-4 h-4 text-brand-antiqueBronze flex-shrink-0 mt-0.5" />
              <p className="text-[10px] text-brand-warmGray leading-relaxed font-semibold">
                This historical artifact is certified by expert numismatists. It is housed in a secure display slab and ships with a certificate of provenance detailing its origin and history.
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-4 pt-6 border-t border-brand-border/40">
              <button
                onClick={handleAddToCart}
                disabled={added}
                className={`flex-grow py-4 px-6 rounded-xl flex items-center justify-center gap-2 font-bold text-xs tracking-widest uppercase transition-all shadow-md ${
                  added ? 'bg-brand-success text-brand-white' : 'bg-brand-antiqueBronze text-brand-warmWhite hover:bg-brand-antiqueBronze/90'
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
                className={`p-4 rounded-xl border transition-all flex items-center justify-center ${
                  inWishlist
                    ? 'bg-brand-blush/40 border-brand-dustyRose text-brand-dustyRose'
                    : 'border-brand-border hover:bg-brand-softBeige/30 text-brand-warmGray'
                }`}
                aria-label="Add to Wishlist"
              >
                <Heart className={`w-5 h-5 ${inWishlist ? 'fill-brand-dustyRose' : ''}`} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
