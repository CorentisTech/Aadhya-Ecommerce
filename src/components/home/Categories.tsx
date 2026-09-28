"use client";

import React from 'react';
import { CATEGORIES } from '../../data/mockData';
import { useRouter } from 'next/navigation';
import { ArrowRight } from 'lucide-react';

export const Categories: React.FC = () => {
  const router = useRouter();
  
  // Display strictly the 7 fashion categories
  const fashionCategories = CATEGORIES.filter((c) => c.department === 'fashion');

  return (
    <section id="categories" className="w-full max-w-full py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-10 lg:px-12 bg-[#FFFFFF] border-b border-[#EAE3D6] overflow-hidden select-none">
      <div className="max-w-[1560px] mx-auto space-y-8 sm:space-y-12">
        
        {/* Header Block (Reference 3: SHOP BY CATEGORY + Find Your Perfect Style) */}
        <div className="space-y-2 text-center max-w-xl mx-auto">
          <span className="text-xs sm:text-sm text-[#7A6B5C] font-bold tracking-[0.25em] uppercase block">
            SHOP BY CATEGORY
          </span>
          <h2 className="font-serif font-bold text-3xl sm:text-4xl md:text-5xl text-[#181818] tracking-tight">
            Find Your Perfect Style
          </h2>
          <div className="w-12 h-0.5 bg-[#E2D7C9] mx-auto mt-3" />
        </div>

        {/* 7 Arched Editorial Category Cards (Reference 3 Layout) */}
        <div className="w-full">
          {/* Desktop: Dynamic 7-Column Grid; Mobile/Tablet: Smooth Snap Horizontal Scroll */}
          <div className="flex lg:grid lg:grid-cols-7 overflow-x-auto lg:overflow-visible pb-4 lg:pb-0 gap-4 sm:gap-5 lg:gap-5 xl:gap-6 scrollbar-none snap-x snap-mandatory items-start justify-start lg:justify-between">
            {fashionCategories.map((category) => (
              <div
                key={category.id}
                onClick={() => router.push(`/catalog?category=${category.id}`)}
                className="group flex flex-col text-center cursor-pointer space-y-3.5 focus:outline-none flex-shrink-0 w-[160px] sm:w-[190px] md:w-[210px] lg:w-full snap-start transition-all duration-300"
              >
                {/* Arched Dome Top Image Frame (Reference 3 Exact Shape) */}
                <div className="w-full aspect-[3/4.8] rounded-t-full overflow-hidden bg-[#FAF7F2] border border-[#EAE3D6] relative shadow-sm group-hover:shadow-xl transition-all duration-500 transform group-hover:-translate-y-1">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-106"
                    loading="lazy"
                  />
                  {/* Subtle luxury sheen hover overlay */}
                  <div className="absolute inset-0 bg-[#181818]/0 group-hover:bg-[#181818]/8 transition-colors duration-300" />
                </div>

                {/* Category Name & Subtle Arrow (Reference 3 Text Presentation) */}
                <div className="flex items-center justify-center space-x-1.5 pt-1 group-hover:text-[#8C6D46] transition-colors">
                  <span className="font-sans font-bold text-xs sm:text-sm text-[#181818] tracking-wide group-hover:text-[#8C6D46] transition-colors">
                    {category.name}
                  </span>
                  <span className="text-[#8C6D46] font-sans text-xs sm:text-sm font-bold transform transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </div>

              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
