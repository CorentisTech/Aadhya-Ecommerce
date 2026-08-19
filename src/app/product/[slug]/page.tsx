"use client";

import React, { use, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { PRODUCTS, Product } from '@/data/mockData';
import { ProductVisual } from '@/components/ui/ProductVisual';
import { Heart, ShoppingBag, ArrowLeft } from 'lucide-react';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function ProductDetailPage({ params }: PageProps) {
  const router = useRouter();
  const { slug } = use(params);
  const { addToCart, toggleWishlist, isInWishlist, setSelectedProduct } = useApp();

  // Find product by slug name
  const product = PRODUCTS.find(
    (p) => p.name.toLowerCase().replace(/ /g, '-') === slug
  );

  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  // Set default selection values once product is loaded
  React.useEffect(() => {
    if (product) {
      setSelectedSize(product.sizes && product.sizes.length > 0 ? product.sizes[0] : '');
      setSelectedColor(product.colors && product.colors.length > 0 ? product.colors[0] : '');
      setQuantity(1);
    }
  }, [product]);

  if (!product) {
    return (
      <div className="w-full min-h-screen flex flex-col items-center justify-center bg-brand-warmWhite text-brand-espresso p-6">
        <h2 className="font-display font-bold text-lg tracking-widest uppercase">PRODUCT NOT FOUND</h2>
        <button
          onClick={() => router.push('/')}
          className="mt-4 px-6 py-2.5 bg-brand-espresso text-brand-white text-xs font-bold tracking-widest uppercase rounded-lg"
        >
          RETURN TO CATALOG
        </button>
      </div>
    );
  }

  const inWishlist = isInWishlist(product.id);

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedSize, selectedColor);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  return (
    <div className="w-full min-h-screen bg-brand-warmWhite py-16 px-6 md:px-12 lg:px-24 text-brand-espresso">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Back navigation */}
        <div className="flex items-center justify-between border-b border-brand-border pb-4">
          <button
            onClick={() => router.push('/')}
            className="flex items-center gap-1.5 text-xs font-bold tracking-widest text-brand-warmGray hover:text-brand-espresso transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>BACK TO COLLECTIONS</span>
          </button>
          <span className="text-[10px] text-brand-warmGray font-bold tracking-[0.25em] uppercase">
            AADHYA {product.department.toUpperCase()}
          </span>
        </div>

        {/* Product details split */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
          {/* Left Column: Image Canvas (6 cols) */}
          <div className="md:col-span-6 bg-brand-white p-8 border border-brand-border/60 rounded-3xl relative flex items-center justify-center min-h-[350px] md:min-h-[450px]">
            {/* Discount Badge */}
            <div className="absolute top-4 left-4">
              <span className="text-[9px] bg-brand-sale text-brand-warmWhite font-extrabold tracking-widest px-2.5 py-1 rounded-full">
                {product.discount}% OFF
              </span>
            </div>

            {/* Model Cutout (Isolated) */}
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

            {/* Color & Size selection */}
            {product.colors && product.colors.length > 0 && (
              <div className="space-y-2 text-left">
                <span className="text-[10px] font-bold text-brand-warmGray tracking-widest block uppercase">
                  SELECT COLOR:
                </span>
                <div className="flex space-x-2">
                  {product.colors.map((colorHex) => (
                    <button
                      key={colorHex}
                      onClick={() => setSelectedColor(colorHex)}
                      className={`w-6 h-6 rounded-full border transition-all ${
                        selectedColor === colorHex
                          ? 'scale-110 border-brand-espresso ring-2 ring-brand-blush'
                          : 'border-brand-border hover:opacity-85'
                      }`}
                      style={{ backgroundColor: colorHex }}
                    />
                  ))}
                </div>
              </div>
            )}

            {product.sizes && product.sizes.length > 0 && (
              <div className="space-y-2 text-left">
                <span className="text-[10px] font-bold text-brand-warmGray tracking-widest block uppercase">
                  SELECT SIZE:
                </span>
                <div className="flex flex-wrap gap-2 text-xs font-bold text-brand-espresso">
                  {product.sizes.map((sz) => (
                    <button
                      key={sz}
                      onClick={() => setSelectedSize(sz)}
                      className={`px-4 py-2 border rounded-lg transition-all ${
                        selectedSize === sz
                          ? 'border-brand-espresso bg-brand-espresso text-brand-white'
                          : 'border-brand-border hover:bg-brand-softBeige/40'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-4 pt-6 border-t border-brand-border/40">
              <button
                onClick={handleAddToCart}
                disabled={added}
                className={`flex-grow py-4 px-6 rounded-xl flex items-center justify-center gap-2 font-bold text-xs tracking-widest uppercase transition-all shadow-md ${
                  added ? 'bg-brand-success text-brand-white' : 'bg-brand-espresso text-brand-white hover:bg-brand-espresso/90'
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
