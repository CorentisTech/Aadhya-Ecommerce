"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { PRODUCTS, Product } from '@/data/mockData';
import { useApp } from '@/context/AppContext';
import { Heart, Star, SlidersHorizontal, X, Search, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { NavigationControls } from '@/components/ui/NavigationControls';
import { ProductVisual } from '@/components/ui/ProductVisual';

// Exact filter criteria updated for the strict 7 categories and fabrics
const FASHION_FILTER_CRITERIA = {
  category: { label: 'CATEGORY', options: ['Palazzo', 'Pants', 'Salwar', 'Blouse', 'Kurti & Pants', 'Saree Shaper', 'Nighty'] },
  fabric: { label: 'FABRIC', options: ['AV Cotton', 'Rayon', 'Raw Silk', 'Cotton', 'Silk'] },
  pattern: { label: 'PATTERN', options: ['Plain', 'Printed'] },
  occasion: { label: 'OCCASION', options: ['Casual', 'Formal', 'Festive', 'Evening'] },
  length: { label: 'LENGTH', options: ['Ankle Length', 'Floor Length', 'Full Length', 'Midi Length', 'Regular Length'] },
  fit: { label: 'FIT', options: ['Relaxed', 'Slim Fit', 'Flared', 'Tailored', 'Oversized'] }
};

// Exact numismatics filter criteria
const NUMISMATICS_FILTER_CRITERIA = {
  material: { label: 'MATERIAL', options: ['Silver', 'Gold', 'Paper', 'Mixed Metal', 'Copper', 'Nickel'] },
  era: { label: 'ERA / PERIOD', options: ['British India', 'Republic India', 'Mughal Empire', 'Ancient', 'East India Company'] },
  rarity: { label: 'RARITY', options: ['Rare', 'Scarce', 'Very Rare', 'Extremely Rare', 'Standard'] },
  visualType: { label: 'TYPE', options: ['Coins', 'Notes'] },
  priceRange: { label: 'PRICE RANGE', options: ['Under ₹5,000', '₹5,000 - ₹15,000', '₹15,000 - ₹30,000', 'Above ₹30,000'] }
};

const FASHION_PILLS = ['ALL', 'PALAZZO', 'PANTS', 'SALWAR', 'BLOUSE', 'KURTI & PANTS', 'SAREE SHAPER', 'NIGHTY'];

// Normalizes category strings from URL to match Fashion Pills
function mapCategoryToFashionPill(cat: string): string {
  if (!cat) return 'ALL';
  const clean = cat.trim().toLowerCase().replace(/[-_]/g, ' ');
  if (clean.includes('palazzo')) return 'PALAZZO';
  if (clean.includes('pant') && !clean.includes('kurti')) return 'PANTS';
  if (clean.includes('salwar')) return 'SALWAR';
  if (clean.includes('blouse')) return 'BLOUSE';
  if (clean.includes('kurti')) return 'KURTI & PANTS';
  if (clean.includes('shaper') || clean.includes('saree')) return 'SAREE SHAPER';
  if (clean.includes('nighty') || clean.includes('night')) return 'NIGHTY';
  return 'ALL';
}

interface CatalogContentProps {
  defaultDepartment?: 'fashion' | 'numismatics';
}

export default function CatalogContent({ defaultDepartment = 'fashion' }: CatalogContentProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // URL Params State
  const initialCategory = searchParams.get('category') || '';
  const initialSearch = searchParams.get('search') || '';
  const initialSort = searchParams.get('sort') || '';

  const { toggleWishlist, isInWishlist, addToCart } = useApp();

  // Department state locked to defaultDepartment
  const department = defaultDepartment;

  // Category filter state
  const [selectedFashionPill, setSelectedFashionPill] = useState<string>(() => 
    defaultDepartment === 'fashion' && initialCategory ? mapCategoryToFashionPill(initialCategory) : 'ALL'
  );
  const [activeNumisCategory, setActiveNumisCategory] = useState<string>(() =>
    defaultDepartment === 'numismatics' ? initialCategory : ''
  );

  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [activeSortTab, setActiveSortTab] = useState<string>(
    initialSort === 'newest' ? 'Newest' : initialSort === 'best-selling' ? 'Best Sellers' : 'Recommended'
  );
  const [isFilterOpen, setFilterOpen] = useState(false);

  // Selected Filter Pills State (Drawer)
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({
    category: [],
    fabric: [],
    pattern: [],
    occasion: [],
    length: [],
    fit: [],
    material: [],
    era: [],
    rarity: [],
    visualType: [],
    priceRange: []
  });

  // Guard against accidental cross-department routing if department=numismatics query hits /catalog
  useEffect(() => {
    if (defaultDepartment === 'fashion' && searchParams.get('department') === 'numismatics') {
      const params = new URLSearchParams(searchParams.toString());
      params.delete('department');
      const targetUrl = `/numismatics/catalog${params.toString() ? `?${params.toString()}` : ''}`;
      router.replace(targetUrl);
    }
  }, [searchParams, defaultDepartment, router]);

  // Sync category param if updated dynamically
  useEffect(() => {
    const cat = searchParams.get('category') || '';
    if (defaultDepartment === 'fashion' && cat) {
      setSelectedFashionPill(mapCategoryToFashionPill(cat));
    } else if (defaultDepartment === 'numismatics' && cat) {
      setActiveNumisCategory(cat);
    }
  }, [searchParams, defaultDepartment]);

  // Toggle filter option
  const handleToggleFilter = (group: string, value: string) => {
    setSelectedFilters(prev => {
      const current = prev[group] || [];
      const active = current.includes(value)
        ? current.filter(item => item !== value)
        : [...current, value];
      return { ...prev, [group]: active };
    });
  };

  // Reset all filters
  const handleResetFilters = () => {
    setSelectedFilters({
      category: [],
      fabric: [],
      pattern: [],
      occasion: [],
      length: [],
      fit: [],
      material: [],
      era: [],
      rarity: [],
      visualType: [],
      priceRange: []
    });
    setSelectedFashionPill('ALL');
    setActiveNumisCategory('');
    setSearchQuery('');
  };

  // Filter products strictly by department, search, category, and drawer filters
  const filteredProducts = PRODUCTS.filter(product => {
    // 1. Department match: strictly isolated
    if (product.department !== department) return false;

    // 2. Search query match
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesName = product.name.toLowerCase().includes(query);
      const matchesDesc = product.description.toLowerCase().includes(query);
      const matchesCat = product.category.toLowerCase().includes(query);
      if (!matchesName && !matchesDesc && !matchesCat) return false;
    }

    // 3. Fashion Category Pills (7 strict categories)
    if (department === 'fashion' && selectedFashionPill !== 'ALL') {
      const pill = selectedFashionPill.toLowerCase();
      const cat = product.category.toLowerCase();
      const name = product.name.toLowerCase();

      if (pill === 'palazzo') {
        if (!cat.includes('palazzo') && !name.includes('palazzo')) return false;
      } else if (pill === 'pants') {
        if (!cat.includes('pants') && !name.includes('pants') && !name.includes('trouser')) return false;
      } else if (pill === 'salwar') {
        if (!cat.includes('salwar') && !name.includes('salwar')) return false;
      } else if (pill === 'blouse') {
        if (!cat.includes('blouse') && !name.includes('blouse')) return false;
      } else if (pill === 'kurti & pants') {
        if (!cat.includes('kurti') && !name.includes('kurti')) return false;
      } else if (pill === 'saree shaper') {
        if (!cat.includes('shaper') && !name.includes('shaper')) return false;
      } else if (pill === 'nighty') {
        if (!cat.includes('nighty') && !name.includes('nighty')) return false;
      }
    }

    // 4. Numismatics Category Filtering (e.g. from category cards on numismatics home)
    if (department === 'numismatics' && activeNumisCategory) {
      const norm = activeNumisCategory.toLowerCase().replace(/[-_]/g, ' ');
      const cat = product.category.toLowerCase();
      const era = (product.era || '').toLowerCase();
      const name = product.name.toLowerCase();

      const matches = 
        cat.includes(norm) || 
        era.includes(norm) || 
        name.includes(norm) ||
        (norm.includes('note') && (product.visualType === 'note' || cat.includes('paper'))) ||
        (norm.includes('paper') && (product.visualType === 'note' || cat.includes('paper'))) ||
        (norm.includes('east india') && (cat.includes('east india') || era.includes('east india') || name.includes('east india'))) ||
        (norm.includes('mughal') && (cat.includes('mughal') || era.includes('mughal') || name.includes('mughal'))) ||
        (norm.includes('british') && (cat.includes('british') || era.includes('british') || name.includes('british'))) ||
        (norm.includes('ancient') && (cat.includes('ancient') || era.includes('ancient') || name.includes('ancient'))) ||
        (norm.includes('princely') && (cat.includes('princely') || era.includes('princely') || name.includes('princely'))) ||
        (norm.includes('commemorative') && (cat.includes('commemorative') || era.includes('commemorative') || name.includes('commemorative'))) ||
        (norm.includes('square') && (name.includes('square') || cat.includes('square')));

      if (!matches) return false;
    }

    // 5. Drawer Filter Checks for Fashion
    if (department === 'fashion') {
      if (selectedFilters.category?.length > 0) {
        if (!selectedFilters.category.some(c => product.category.toLowerCase().includes(c.toLowerCase()))) return false;
      }
      if (selectedFilters.fabric?.length > 0 && product.fabric) {
        if (!selectedFilters.fabric.some(f => product.fabric?.toLowerCase().includes(f.toLowerCase()))) return false;
      }
      if (selectedFilters.pattern?.length > 0 && product.pattern) {
        if (!selectedFilters.pattern.some(p => product.pattern?.toLowerCase().includes(p.toLowerCase()))) return false;
      }
      if (selectedFilters.occasion?.length > 0 && product.occasion) {
        if (!selectedFilters.occasion.some(o => product.occasion?.toLowerCase().includes(o.toLowerCase()))) return false;
      }
      if (selectedFilters.length?.length > 0 && product.length) {
        if (!selectedFilters.length.some(l => product.length?.toLowerCase().includes(l.toLowerCase()))) return false;
      }
      if (selectedFilters.fit?.length > 0 && product.fit) {
        if (!selectedFilters.fit.some(f => product.fit?.toLowerCase().includes(f.toLowerCase()))) return false;
      }
    }

    // 6. Drawer Filter Checks for Numismatics
    if (department === 'numismatics') {
      if (selectedFilters.material.length > 0 && product.material) {
        if (!selectedFilters.material.some(m => product.material?.toLowerCase().includes(m.toLowerCase()))) return false;
      }
      if (selectedFilters.era.length > 0 && product.era) {
        if (!selectedFilters.era.some(e => product.era?.toLowerCase().includes(e.toLowerCase()))) return false;
      }
      if (selectedFilters.rarity.length > 0 && product.rarity) {
        if (!selectedFilters.rarity.some(r => product.rarity?.toLowerCase().includes(r.toLowerCase()))) return false;
      }
      if (selectedFilters.visualType.length > 0) {
        const matchesType = selectedFilters.visualType.some(vt => 
          (vt === 'Coins' && product.visualType === 'coin') || 
          (vt === 'Notes' && product.visualType === 'note')
        );
        if (!matchesType) return false;
      }
      if (selectedFilters.priceRange.length > 0) {
        const matchesPrice = selectedFilters.priceRange.some(pr => {
          if (pr === 'Under ₹5,000') return product.price < 5000;
          if (pr === '₹5,000 - ₹15,000') return product.price >= 5000 && product.price <= 15000;
          if (pr === '₹15,000 - ₹30,000') return product.price >= 15000 && product.price <= 30000;
          if (pr === 'Above ₹30,000') return product.price > 30000;
          return true;
        });
        if (!matchesPrice) return false;
      }
    }

    return true;
  });

  // Apply Sorting
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (activeSortTab === 'Lowest prices') return a.price - b.price;
    if (activeSortTab === 'Highest prices') return b.price - a.price;
    if (activeSortTab === 'Best Sellers') return (b.bestseller ? 1 : 0) - (a.bestseller ? 1 : 0);
    if (activeSortTab === 'Newest') return b.id.localeCompare(a.id);
    return (b.rating || 5) - (a.rating || 5);
  });

  const isFashion = department === 'fashion';

  return (
    <div className="w-full max-w-full min-h-screen bg-[#FDF9F3] py-6 sm:py-10 md:py-14 px-4 md:px-12 lg:px-20 text-[#2B231D] select-none relative">
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
        
        {/* Navigation Controls */}
        <NavigationControls className="justify-start border-b border-[#EFE8DC] pb-3" />

        {/* ==================================================
            1. CATALOG HEADER (Fashion vs Numismatics)
           ================================================== */}
        {isFashion ? (
          <div className="space-y-6 text-left">
            
            {/* Top Row: Title on Left, Controls on Right */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-2">
              <div>
                <h1 className="font-display font-medium text-3xl sm:text-4xl md:text-5xl text-[#1A1A1A] tracking-tight">
                  Ready-to-Wear Catalog
                </h1>
                <p className="text-xs sm:text-sm text-[#7D736A] font-medium pt-1.5">
                  Discover Handcrafted Ethnic Silhouettes & Contemporary Western Pieces
                </p>
              </div>

              {/* Right Controls: Filters Button, Search Bar, Recommended Dropdown */}
              <div className="flex flex-wrap items-center gap-3">
                {/* Filters Pill Button */}
                <button
                  onClick={() => setFilterOpen(true)}
                  className="px-4 py-2 bg-[#1A1A1A] text-white rounded-full text-xs font-bold hover:bg-black transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span>Filters</span>
                </button>

                {/* Search Bar Input */}
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-warmGray" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search palazzo, pants, salwar, blouse, kurti..."
                    className="pl-9 pr-4 py-2 text-xs bg-white border border-[#EAE2D5] rounded-full focus:outline-none focus:border-[#1A1A1A] w-48 sm:w-64 text-[#2B231D] shadow-xs placeholder:text-[#A09890]"
                  />
                </div>

                {/* Recommended Sort Dropdown */}
                <div className="relative">
                  <select
                    value={activeSortTab}
                    onChange={(e) => setActiveSortTab(e.target.value)}
                    className="px-4 py-2 bg-white border border-[#EAE2D5] rounded-full text-xs font-bold text-[#2B231D] focus:outline-none appearance-none pr-8 cursor-pointer shadow-xs"
                  >
                    <option value="Recommended">Recommended</option>
                    <option value="Lowest prices">Price: Low to High</option>
                    <option value="Highest prices">Price: High to Low</option>
                    <option value="Best Sellers">Best Sellers</option>
                    <option value="Newest">Newest</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-brand-warmGray" />
                </div>
              </div>
            </div>

            {/* Filter Pills Row (ALL | PALAZZO | PANTS | SALWAR | BLOUSE | KURTI & PANTS | SAREE SHAPER | NIGHTY) */}
            <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto scrollbar-none pb-2 pt-1">
              {FASHION_PILLS.map((pill) => {
                const isSelected = selectedFashionPill === pill;
                return (
                  <button
                    key={pill}
                    onClick={() => setSelectedFashionPill(pill)}
                    className={`px-5 py-1.5 sm:py-2 rounded-full text-xs font-bold tracking-wider uppercase transition-all whitespace-nowrap shadow-xs cursor-pointer ${
                      isSelected
                        ? 'bg-[#1A1A1A] text-white'
                        : 'bg-white border border-[#EAE2D5] text-[#2B231D] hover:bg-[#FAF7F2]'
                    }`}
                  >
                    {pill}
                  </button>
                );
              })}
            </div>

          </div>
        ) : (
          /* ==================================================
             NUMISMATICS CATALOG HEADER
             ================================================== */
          <div className="space-y-6 text-left">
            <div className="w-full bg-white rounded-3xl p-6 sm:p-10 border border-[#EFE8DC] shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-2 max-w-2xl">
                <span className="text-[10px] font-extrabold tracking-[0.25em] text-[#E0591D] uppercase block">
                  AADHYA NUMISMATICS COLLECTION
                </span>
                <h1 className="font-display font-black text-3xl sm:text-4xl md:text-5xl text-[#2B231D] tracking-tight">
                  Numismatics & Archival Coins
                </h1>
                <p className="text-xs sm:text-sm text-[#7D736A] font-medium leading-relaxed">
                  Explore rare historical coins, preserved banknotes, and certified museum specimens with verified provenance registers.
                </p>

                {/* Active Category Filter Badge (If redirected from category card) */}
                {activeNumisCategory && (
                  <div className="flex items-center gap-2 pt-2">
                    <span className="text-xs font-bold text-[#7D736A]">Selected Category:</span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#2B231D] text-[#FFEBC2] text-xs font-extrabold rounded-full shadow-xs">
                      <span>{activeNumisCategory.replace(/[-_]/g, ' ').toUpperCase()}</span>
                      <button 
                        onClick={() => setActiveNumisCategory('')}
                        className="w-3.5 h-3.5 rounded-full bg-white/20 hover:bg-white/40 flex items-center justify-center text-white text-[10px] ml-1 transition-colors cursor-pointer"
                        title="Clear category filter"
                      >
                        ✕
                      </button>
                    </span>
                  </div>
                )}
              </div>

              {/* Filters Button and Search */}
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => setFilterOpen(true)}
                  className="px-5 py-2.5 bg-[#E0591D] hover:bg-[#C84B15] text-white rounded-full text-xs font-extrabold transition-colors flex items-center gap-2 shadow-xs cursor-pointer"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span>Filters</span>
                </button>

                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-warmGray" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search coins, banknotes, eras..."
                    className="pl-9 pr-4 py-2 text-xs bg-white border border-[#EAE2D5] rounded-full focus:outline-none focus:border-[#E0591D] w-52 sm:w-64 text-[#2B231D] shadow-xs placeholder:text-[#A09890]"
                  />
                </div>

                {/* Sort Dropdown */}
                <div className="relative">
                  <select
                    value={activeSortTab}
                    onChange={(e) => setActiveSortTab(e.target.value)}
                    className="px-4 py-2 bg-white border border-[#EAE2D5] rounded-full text-xs font-bold text-[#2B231D] focus:outline-none appearance-none pr-8 cursor-pointer shadow-xs"
                  >
                    <option value="Recommended">Recommended</option>
                    <option value="Lowest prices">Price: Low to High</option>
                    <option value="Highest prices">Price: High to Low</option>
                    <option value="Best Sellers">Best Sellers</option>
                    <option value="Newest">Newest</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-brand-warmGray" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================================================
            2. PRODUCT GRID (Fashion vs Numismatics)
           ================================================== */}
        {sortedProducts.length === 0 ? (
          <div className="py-20 text-center bg-white rounded-3xl border border-[#EAE2D5]/80 space-y-3">
            <p className="text-sm font-bold text-brand-warmGray uppercase tracking-wider">
              No products found matching your current filter criteria.
            </p>
            <button
              onClick={handleResetFilters}
              className="px-5 py-2 bg-[#2B231D] text-white text-xs font-bold rounded-full hover:bg-black transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : isFashion ? (
          /* FASHION CARDS GRID */
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 pt-2">
            {sortedProducts.map((product) => {
              const inWishlist = isInWishlist(product.id);
              const slug = product.name.toLowerCase().replace(/ /g, '-');

              return (
                <div
                  key={product.id}
                  onClick={() => router.push(`/product/${slug}`)}
                  className="flex flex-col text-left group cursor-pointer bg-white border border-[#EAE2D5]/80 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-shadow justify-between"
                >
                  <div>
                    {/* Portrait Fashion Image with Top-Left Category Badge */}
                    <div className="w-full aspect-[3/4] relative overflow-hidden bg-[#FAF7F2]">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />

                      {/* Top-Left Category Badge */}
                      <div className="absolute top-3 left-3">
                        <span className="text-[9px] font-extrabold px-3 py-1 bg-white/95 backdrop-blur-xs text-[#2B231D] rounded-full uppercase shadow-xs">
                          {product.category}
                        </span>
                      </div>

                      {/* Wishlist Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleWishlist(product);
                        }}
                        className={`absolute top-3 right-3 p-1.5 rounded-full border transition-all shadow-xs ${
                          inWishlist
                            ? 'bg-brand-blush border-brand-dustyRose text-brand-dustyRose'
                            : 'bg-white/95 border-[#EAE2D5] text-brand-warmGray hover:bg-white'
                        }`}
                        aria-label="Wishlist"
                      >
                        <Heart className={`w-3.5 h-3.5 ${inWishlist ? 'fill-brand-dustyRose' : ''}`} />
                      </button>
                    </div>

                    {/* Content Details */}
                    <div className="p-3 sm:p-4 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-bold text-[#E0591D] tracking-wider uppercase">
                          {product.fabric || 'AV Cotton'}
                        </span>
                        {product.bestseller && (
                          <span className="text-[8px] font-extrabold px-2 py-0.5 bg-[#FAF7F2] text-[#2B231D] rounded uppercase">
                            Bestseller
                          </span>
                        )}
                      </div>

                      <h3 className="font-display font-extrabold text-xs sm:text-sm text-[#2B231D] group-hover:text-[#E0591D] transition-colors line-clamp-1">
                        {product.name}
                      </h3>

                      <p className="text-[10px] text-brand-warmGray line-clamp-1">
                        {product.description}
                      </p>

                      <div className="flex items-center space-x-1.5 pt-1 text-amber-500">
                        <Star className="w-3 h-3 fill-current" />
                        <span className="text-[10px] font-extrabold text-[#2B231D]">{product.rating || '4.8'}</span>
                        <span className="text-[9px] text-brand-warmGray font-medium">({product.reviewsCount || 84})</span>
                      </div>
                    </div>
                  </div>

                  {/* Price & Action */}
                  <div className="p-3 sm:p-4 pt-0">
                    <div className="flex items-baseline space-x-2 pt-2 border-t border-[#F0EAE1]">
                      <span className="font-sans font-black text-sm sm:text-base text-[#2B231D]">
                        ₹{product.price.toLocaleString('en-IN')}
                      </span>
                      {product.mrp && product.mrp > product.price && (
                        <span className="text-[10px] text-brand-warmGray line-through font-medium">
                          ₹{product.mrp.toLocaleString('en-IN')}
                        </span>
                      )}
                      {product.discount && (
                        <span className="text-[9px] font-extrabold text-[#E0591D]">
                          {product.discount}% OFF
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* NUMISMATICS CARDS GRID: STRICTLY COINS & BANKNOTES */
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 pt-2">
            {sortedProducts.map((product) => {
              const inWishlist = isInWishlist(product.id);
              const slug = product.name.toLowerCase().replace(/ /g, '-');

              return (
                <div
                  key={product.id}
                  onClick={() => router.push(`/numismatics/${slug}`)}
                  className="flex flex-col text-left group cursor-pointer bg-white border border-[#EAE2D5] rounded-2xl p-3 sm:p-4 hover:shadow-lg transition-all relative justify-between"
                >
                  <div>
                    {/* Visual Container */}
                    <div className="w-full aspect-[4/5] bg-[#FAF7F2] overflow-hidden relative rounded-xl p-3 flex items-center justify-center border border-[#F0EAE1]">
                      {product.visualType === 'note' ? (
                        <img 
                          src={product.image} 
                          alt={product.name} 
                          className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105" 
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ProductVisual 
                            type="coin" 
                            color={product.visualColor || '#B89A67'} 
                            pattern={product.visualPattern || 'antique-metallic'} 
                            className="w-full h-full scale-110"
                            isRotating={false} 
                          />
                        </div>
                      )}

                      {/* Top Left Badge */}
                      <div className="absolute top-2.5 left-2.5 pointer-events-none">
                        <span className="text-[7px] bg-white/95 border border-[#EAE2D5] text-[#2B231D] font-extrabold tracking-widest px-2 py-0.5 rounded shadow-xs uppercase">
                          {product.rarity || 'RARE'}
                        </span>
                      </div>

                      {/* Wishlist Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleWishlist(product);
                        }}
                        className={`absolute top-2.5 right-2.5 p-1.5 rounded-full border transition-all shadow-xs pointer-events-auto ${
                          inWishlist
                            ? 'bg-brand-blush border-brand-dustyRose text-brand-dustyRose'
                            : 'bg-white/95 border-[#EAE2D5] text-brand-warmGray hover:bg-white'
                        }`}
                        aria-label="Wishlist"
                      >
                        <Heart className={`w-3.5 h-3.5 ${inWishlist ? 'fill-brand-dustyRose' : ''}`} />
                      </button>
                    </div>

                    {/* Details Area */}
                    <div className="pt-3 space-y-1.5">
                      <h3 className="font-display font-extrabold text-xs sm:text-sm text-[#2B231D] group-hover:text-[#E0591D] transition-colors line-clamp-1">
                        {product.name}
                      </h3>
                      
                      <p className="text-[10px] text-brand-warmGray line-clamp-1">
                        {product.description}
                      </p>

                      {/* Spec Pill Chips */}
                      <div className="flex flex-wrap items-center gap-1.5 pt-1">
                        {product.material && (
                          <span className="text-[8px] bg-[#FAF7F2] border border-[#EAE2D5] px-2 py-0.5 rounded-full font-bold text-[#2B231D]">
                            {product.material}
                          </span>
                        )}
                        {product.year && (
                          <span className="text-[8px] bg-[#FAF7F2] border border-[#EAE2D5] px-2 py-0.5 rounded-full font-bold text-[#2B231D]">
                            {product.year}
                          </span>
                        )}
                        {product.condition && (
                          <span className="text-[8px] bg-[#FAF7F2] border border-[#EAE2D5] px-2 py-0.5 rounded-full font-bold text-[#2B231D]">
                            {product.condition}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center space-x-1.5 pt-1 text-amber-500">
                        <Star className="w-3 h-3 fill-current" />
                        <span className="text-[10px] font-extrabold text-[#2B231D]">{product.rating || '4.8'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Price & Buy Now Action */}
                  <div className="pt-3 border-t border-[#F0EAE1] mt-3">
                    <div className="flex items-baseline space-x-2">
                      <span className="font-sans font-black text-sm sm:text-base text-[#2B231D]">
                        ₹{product.price.toLocaleString('en-IN')}
                      </span>
                      <span className="text-[10px] text-brand-warmGray line-through font-medium">
                        ₹{product.mrp.toLocaleString('en-IN')}
                      </span>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(product, 1);
                      }}
                      className="w-full mt-2 py-1.5 bg-white hover:bg-[#2B231D] text-[#2B231D] hover:text-white border border-[#2B231D] font-extrabold text-[9px] tracking-wider uppercase rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span>Buy now</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* ==================================================
          SLIDE-OVER FILTERS DRAWER
         ================================================== */}
      <AnimatePresence>
        {isFilterOpen && (
          <div className="fixed inset-0 z-50 flex justify-start">
            
            {/* Backdrop Dark Tint Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setFilterOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-xs"
            />

            {/* Left Slide-over Panel */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 260 }}
              className="relative z-10 w-full max-w-[320px] sm:max-w-[360px] md:max-w-[390px] h-full bg-white shadow-2xl flex flex-col justify-between text-left select-none"
            >
              {/* Header */}
              <div className="p-6 border-b border-[#EAE2D5] flex items-center justify-between">
                <div>
                  <h3 className="font-display font-bold text-2xl text-[#1A1A1A]">
                    Filters
                  </h3>
                  <p className="text-xs text-[#7D736A] pt-0.5">
                    {filteredProducts.length} Products Available
                  </p>
                </div>
                
                <button
                  onClick={() => setFilterOpen(false)}
                  className="p-1.5 hover:bg-[#FAF7F2] rounded-full transition-colors cursor-pointer"
                  aria-label="Close Filters"
                >
                  <X className="w-5 h-5 text-[#2B231D]" />
                </button>
              </div>

              {/* Scrollable Filter Body */}
              <div className="flex-grow overflow-y-auto p-6 space-y-6 scrollbar-none">
                {isFashion ? (
                  /* Fashion Filter Criteria */
                  Object.entries(FASHION_FILTER_CRITERIA).map(([key, group]) => (
                    <div key={key} className="space-y-2.5">
                      <span className="text-[11px] font-extrabold text-[#1A1A1A] tracking-wider uppercase block">
                        {group.label}
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {group.options.map(option => {
                          const isSelected = selectedFilters[key]?.includes(option);
                          return (
                            <button
                              key={option}
                              onClick={() => handleToggleFilter(key, option)}
                              className={`px-3.5 py-1.5 rounded-full text-xs transition-all cursor-pointer ${
                                isSelected
                                  ? 'bg-[#1A1A1A] text-white border border-[#1A1A1A] font-bold shadow-xs'
                                  : 'bg-white text-[#2B231D] border border-[#EAE2D5] font-medium hover:border-[#1A1A1A]'
                              }`}
                            >
                              {option}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))
                ) : (
                  /* Numismatics Filter Criteria */
                  Object.entries(NUMISMATICS_FILTER_CRITERIA).map(([key, group]) => (
                    <div key={key} className="space-y-2.5">
                      <span className="text-[11px] font-extrabold text-[#1A1A1A] tracking-wider uppercase block">
                        {group.label}
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {group.options.map(option => {
                          const isSelected = selectedFilters[key]?.includes(option);
                          return (
                            <button
                              key={option}
                              onClick={() => handleToggleFilter(key, option)}
                              className={`px-3.5 py-1.5 rounded-full text-xs transition-all cursor-pointer ${
                                isSelected
                                  ? 'bg-[#E0591D] text-white border border-[#E0591D] font-bold shadow-xs'
                                  : 'bg-white text-[#2B231D] border border-[#EAE2D5] font-medium hover:border-[#E0591D]'
                              }`}
                            >
                              {option}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Fixed Footer Buttons (Reset & Show Results) */}
              <div className="p-5 border-t border-[#EAE2D5] flex items-center gap-3 bg-white">
                <button
                  onClick={handleResetFilters}
                  className="px-6 py-3 border border-[#EAE2D5] rounded-full text-xs font-bold text-[#2B231D] hover:bg-[#FAF7F2] transition-colors cursor-pointer"
                >
                  Reset
                </button>

                <button
                  onClick={() => setFilterOpen(false)}
                  className="flex-1 py-3 bg-[#E0591D] hover:bg-[#C84B15] text-white rounded-full text-xs font-extrabold text-center transition-colors shadow-sm cursor-pointer"
                >
                  Show Results ({filteredProducts.length})
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
