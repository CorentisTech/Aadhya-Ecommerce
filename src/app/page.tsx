"use client";

import React from 'react';
import { Hero } from '@/components/home/Hero';
import { Marquee } from '@/components/home/Marquee';
import { Bestsellers } from '@/components/home/Bestsellers';
import { NewArrivals } from '@/components/home/NewArrivals';
import { Categories } from '@/components/home/Categories';
import { NumismaticsPromo } from '@/components/home/NumismaticsPromo';
import { Reviews } from '@/components/home/Reviews';

export default function HomePage() {
  return (
    <>
      {/* 1. HERO */}
      <Hero />
      <Marquee />

      {/* 2. BEST SELLERS */}
      <Bestsellers />

      {/* 3. NEW ARRIVALS */}
      <NewArrivals />

      {/* 4. SHOP BY CATEGORY */}
      <Categories />

      {/* Additional Curated Sections */}
      <NumismaticsPromo />
      <Reviews />
    </>
  );
}
