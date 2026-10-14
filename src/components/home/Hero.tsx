"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowUpRight, Sparkles, Heart } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { motion } from 'framer-motion';

interface HeroCardItem {
  id: string;
  slug: string;
  name: string;
  productNo: string;
  price: number;
  mrp: number;
  editorialTitle: string;
  editorialScript?: string;
  editorialSubtitle: string;
  editorialAccent: string;
  image: string;
  insetPhoto?: string;
}

export const Hero: React.FC = () => {
  const router = useRouter();
  const { toggleWishlist, isInWishlist } = useApp();
  const [isPaused, setIsPaused] = useState(false);

  // Editorial overlay presets for card styling variety
  const editorialPresets = [
    { editorialTitle: 'TRENDING NOW', editorialSubtitle: 'PREMIUM COLLECTION • HANDCRAFTED', editorialAccent: 'NEW ARRIVAL' },
    { editorialTitle: 'SPOTTED IN', editorialScript: 'Style', editorialSubtitle: 'EFFORTLESS DRAPE • PURE FABRIC', editorialAccent: 'NEW SILHOUETTES' },
    { editorialTitle: 'CO-ORDS', editorialSubtitle: 'CONTEMPORARY TAILORING • TIMELESS COMFORT', editorialAccent: 'DAY-TO-EVENING EDIT' },
    { editorialTitle: 'ROYAL HERITAGE', editorialScript: 'Atelier', editorialSubtitle: 'ARTISANAL CRAFT • PREMIUM SILK', editorialAccent: 'FESTIVE EDIT' },
    { editorialTitle: 'AUTUMN TONES', editorialSubtitle: 'FLUID MOTION • RUNWAY INSPIRATION', editorialAccent: 'LIMITED EDITION' },
  ];

  const [cards, setCards] = useState<HeroCardItem[]>([]);

  // Dynamically load products from database — NO static/mock fallback
  useEffect(() => {
    // First try hero products, then fall back to all fashion products
    const fetchHeroData = async () => {
      try {
        // Try hero products first
        let res = await fetch('/api/products?is_hero=true&department=fashion');
        let result = await res.json();
        let items = result?.data || [];

        // If no hero products, fetch all fashion products
        if (!Array.isArray(items) || items.length === 0) {
          res = await fetch('/api/products?department=fashion&limit=8');
          result = await res.json();
          items = result?.data || [];
        }

        if (Array.isArray(items) && items.length > 0) {
          const dynamicCards: HeroCardItem[] = items.map((p: any, idx: number) => {
            const preset = editorialPresets[idx % editorialPresets.length];
            const primaryMedia = p.product_media?.find((m: any) => m.is_primary)?.media_url 
              || p.product_media?.[0]?.media_url 
              || '/images/placeholder.jpg';
            const categoryName = p.categories?.name || '';
            
            return {
              id: p.id,
              slug: p.slug || p.product_no || p.id,
              name: p.name,
              productNo: p.product_no || `FP-${idx + 100}`,
              price: Number(p.base_price) || 0,
              mrp: Number(p.base_mrp) || 0,
              editorialTitle: preset.editorialTitle,
              editorialScript: preset.editorialScript,
              editorialSubtitle: categoryName ? `${categoryName.toUpperCase()} • AADHYA COLLECTION` : preset.editorialSubtitle,
              editorialAccent: preset.editorialAccent,
              image: primaryMedia
            };
          });
          setCards(dynamicCards);
        }
      } catch (err) {
        console.warn('Hero fetch error:', err);
      }
    };
    fetchHeroData();
  }, []);

  // Triplicate array to guarantee continuous, infinite, gap-free carousel motion
  const carouselItems = [...cards, ...cards, ...cards];

  const formatPrice = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  if (cards.length === 0) {
    return (
      <section className="w-full bg-[#FAF7F2] py-8 sm:py-12 border-b border-[#E5DACB]">
        <div className="flex gap-4 overflow-hidden px-4 justify-center">
          {[1, 2, 3, 4].map(n => (
            <div key={n} className="w-[180px] sm:w-[240px] h-[280px] sm:h-[340px] rounded-[24px] bg-[#E8DFD3]/40 animate-pulse flex-shrink-0" />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section 
      className="w-full max-w-full relative overflow-hidden bg-[#FAF7F2] py-6 sm:py-8 md:py-10 select-none border-b border-[#E5DACB]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Infinite Horizontal Floating Showcase (Reference 2 Inspiration) */}
      <div className="w-full overflow-hidden flex relative">
        <motion.div
          animate={{ x: isPaused ? undefined : ['0%', '-33.333%'] }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: 'loop',
              duration: 38,
              ease: 'linear'
            }
          }}
          className="flex gap-4 sm:gap-6 md:gap-8 flex-nowrap will-change-transform py-2 px-2"
        >
          {carouselItems.map((card, index) => {
            const inWishlist = isInWishlist(card.id);

            return (
              <div
                key={`${card.id}-${index}`}
                onClick={() => router.push(`/product/${card.slug}`)}
                className="group relative flex-shrink-0 w-[290px] sm:w-[350px] md:w-[410px] lg:w-[450px] h-[460px] sm:h-[530px] md:h-[600px] lg:h-[640px] rounded-[24px] sm:rounded-[32px] overflow-hidden bg-[#181818] shadow-md hover:shadow-2xl cursor-pointer transition-all duration-500 transform hover:-translate-y-1.5"
              >
                {/* Full Card Editorial Fashion Photo */}
                <img
                  src={card.image}
                  alt={card.name}
                  className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
                  loading={index < 5 ? 'eager' : 'lazy'}
                />

                {/* Subtle Cinematic Vignette Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/35 pointer-events-none" />

                {/* TOP EDITORIAL HEADLINES (Inspired by Reference 2) */}
                <div className="absolute top-5 sm:top-7 left-5 sm:left-7 right-5 sm:right-7 z-10 pointer-events-none">
                  {card.editorialScript ? (
                    <div className="flex items-baseline space-x-2">
                      <span className="font-serif font-black text-2xl sm:text-4xl lg:text-5xl text-[#FAF7F2] tracking-wider uppercase drop-shadow-md">
                        {card.editorialTitle}
                      </span>
                      <span className="font-serif italic font-normal text-3xl sm:text-5xl lg:text-6xl text-[#E91E63] tracking-normal drop-shadow-md -ml-1">
                        {card.editorialScript}
                      </span>
                    </div>
                  ) : (
                    <div className="flex flex-col">
                      <span className="font-sans font-black text-2xl sm:text-4xl lg:text-5xl text-[#FAF7F2] tracking-[0.06em] uppercase drop-shadow-md leading-[0.95]">
                        {card.editorialTitle}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center space-x-2 mt-2">
                    <span className="text-[9px] sm:text-[10px] font-sans font-bold tracking-[0.22em] text-[#EFE6DA]/90 uppercase">
                      {card.editorialAccent}
                    </span>
                  </div>
                </div>

                {/* Floating Polaroid Inset (Present in Reference 2 Card 1) */}
                {card.insetPhoto && (
                  <div className="absolute bottom-24 sm:bottom-28 left-5 sm:left-7 z-10 hidden sm:block p-1 bg-white rounded-lg shadow-xl transform -rotate-4 group-hover:rotate-0 transition-transform duration-300 pointer-events-none">
                    <img
                      src={card.insetPhoto}
                      alt="Detail"
                      className="w-16 h-20 sm:w-20 sm:h-24 object-cover rounded"
                    />
                  </div>
                )}

                {/* Wishlist Quick Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    const prod = {
                      id: card.id,
                      name: card.name,
                      productNo: card.productNo,
                      department: 'fashion',
                      price: card.price,
                      mrp: card.mrp,
                      discount: Math.round(((card.mrp - card.price) / card.mrp) * 100),
                      description: '',
                      category: 'Fashion',
                      image: card.image,
                      images: [card.image],
                      rating: 4.8,
                      reviewsCount: 15,
                      isBestseller: true
                    };
                    toggleWishlist(prod as any);
                  }}
                  aria-label="Add to wishlist"
                  className="absolute top-5 right-5 z-20 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-md border border-white/30 flex items-center justify-center transition-all text-white"
                >
                  <Heart className={`w-4 h-4 sm:w-4.5 sm:h-4.5 ${inWishlist ? 'fill-rose-500 text-rose-500' : 'text-white stroke-[2]'}`} />
                </button>

                {/* BOTTOM PRODUCT DETAILS & CTA */}
                <div className="absolute bottom-5 sm:bottom-7 left-5 sm:left-7 right-5 sm:right-7 z-10 flex items-end justify-between">
                  <div className="space-y-1 text-left max-w-[70%]">
                    <span className="text-[9px] sm:text-[10px] font-sans font-semibold tracking-widest text-[#EFE6DA]/80 uppercase block">
                      {card.editorialSubtitle}
                    </span>
                    <h3 className="font-serif font-bold text-base sm:text-xl lg:text-2xl text-white tracking-wide leading-tight truncate">
                      {card.name}
                    </h3>
                    <div className="flex items-center space-x-2 pt-0.5">
                      <span className="text-xs sm:text-sm font-sans font-bold text-[#FAF7F2]">
                        {formatPrice(card.price)}
                      </span>
                      <span className="text-[10px] sm:text-xs font-sans text-gray-400 line-through">
                        {formatPrice(card.mrp)}
                      </span>
                    </div>
                  </div>

                  {/* Explore Pill Button */}
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white text-[#181818] flex items-center justify-center shadow-lg group-hover:bg-[#EFE6DA] group-hover:scale-110 transition-all">
                      <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.2]" />
                    </div>
                  </div>
                </div>

              </div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};
