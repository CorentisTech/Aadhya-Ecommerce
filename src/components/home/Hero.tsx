"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowUpRight, Sparkles, Heart } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PRODUCTS } from '../../data/mockData';
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

  // Curated editorial showcase using actual AADHYA Fashion products
  const editorialCards: HeroCardItem[] = [
    {
      id: 'f-prod-1',
      slug: 'f-prod-1',
      name: 'Floral Kurti & Pants Set',
      productNo: 'FP-108',
      price: 2999,
      mrp: 4499,
      editorialTitle: 'EASY LIKE SUNDAY',
      editorialSubtitle: 'FOREVER IN COMFORT • AV COTTON',
      editorialAccent: 'SOFT COZY HOURS',
      image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1200&auto=format&fit=crop',
      insetPhoto: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?q=80&w=500&auto=format&fit=crop'
    },
    {
      id: 'f-prod-cat-1',
      slug: 'f-prod-cat-1',
      name: 'Flared Rayon Palazzo',
      productNo: 'FP-101',
      price: 2499,
      mrp: 3499,
      editorialTitle: 'SPOTTED IN',
      editorialScript: 'Style',
      editorialSubtitle: 'EFFORTLESS DRAPE • PURE RAYON',
      editorialAccent: 'NEW SILHOUETTES',
      image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=1200&auto=format&fit=crop'
    },
    {
      id: 'f-prod-4',
      slug: 'f-prod-4',
      name: 'Classic Kurti & Pants Ensemble',
      productNo: 'FP-111',
      price: 3999,
      mrp: 5999,
      editorialTitle: 'CO-ORDS',
      editorialSubtitle: 'CONTEMPORARY TAILORING • TIMELESS COMFORT',
      editorialAccent: 'DAY-TO-EVENING EDIT',
      image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=1200&auto=format&fit=crop'
    },
    {
      id: 'f-prod-cat-4',
      slug: 'f-prod-cat-4',
      name: 'Handcrafted Zari Silk Blouse',
      productNo: 'FP-104',
      price: 2499,
      mrp: 3299,
      editorialTitle: 'ROYAL HERITAGE',
      editorialScript: 'Atelier',
      editorialSubtitle: 'ARTISANAL GOLD ZARI • PURE SILK',
      editorialAccent: 'FESTIVE EDIT',
      image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=1200&auto=format&fit=crop'
    },
    {
      id: 'f-new-1',
      slug: 'f-new-1',
      name: 'Emerald Flared Palazzo Pants',
      productNo: 'FP-105',
      price: 2799,
      mrp: 3899,
      editorialTitle: 'AUTUMN TONES',
      editorialSubtitle: 'DEEP EMERALD • FLUID RUNWAY MOTION',
      editorialAccent: 'LIMITED EDITION',
      image: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=1200&auto=format&fit=crop'
    }
  ];

  // Triplicate array to guarantee continuous, infinite, gap-free carousel motion
  const carouselItems = [...editorialCards, ...editorialCards, ...editorialCards];

  const formatPrice = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

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
                    const prod = PRODUCTS.find((p) => p.id === card.id);
                    if (prod) toggleWishlist(prod);
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
