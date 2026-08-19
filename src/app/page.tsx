"use client";

import React from 'react';
import { Hero } from '@/components/home/Hero';
import { Marquee } from '@/components/home/Marquee';
import { Categories } from '@/components/home/Categories';
import { NewArrivals } from '@/components/home/NewArrivals';
import { AadhyaEdit } from '@/components/home/AadhyaEdit';
import { NumismaticsPromo } from '@/components/home/NumismaticsPromo';
import { Reviews } from '@/components/home/Reviews';

export default function HomePage() {
  return (
    <>
      <Hero />
      <Marquee />
      <Categories />
      <NewArrivals />
      <AadhyaEdit />
      <NumismaticsPromo />
      <Reviews />
    </>
  );
}
