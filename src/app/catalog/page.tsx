"use client";

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { PRODUCTS, Product } from '@/data/mockData';
import { useApp } from '@/context/AppContext';
import { Heart, Star, SlidersHorizontal, X, Search, Check, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { NavigationControls } from '@/components/ui/NavigationControls';
import { ProductVisual } from '@/components/ui/ProductVisual';

// Defined filter option lists matching the exact product dataset attributes
const FILTER_CRITERIA = {
  fabric: ['Cotton', 'Silk', 'Wool Blend', 'Raw Silk', 'Chiffon', 'Linen'],
  neckType: ['Collared', 'V-Neck', 'Round Neck', 'Sweetheart', 'Boat Neck'],
  sleeves: ['Full Sleeves', 'Long Sleeves', 'Three-Quarter', 'Half Sleeves', 'Sleeveless'],
  occasion: ['Casual', 'Formal', 'Festive', 'Wedding', 'Evening'],
  length: ['Short', 'Midi', 'Maxi', 'Crop'],
  fit: ['Relaxed', 'Slim Fit', 'Flared', 'Tailored', 'Oversized']
};

function CatalogContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // URL Params State
  const initialCategory = searchParams.get('category') || '';
  const initialCollection = searchParams.get('collection') || '';
  const initialSearch = searchParams.get('search') || '';

  const { toggleWishlist, isInWishlist } = useApp();

  // Toolbar & Filtering States
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedCategoryTab, setSelectedCategoryTab] = useState<'ALL' | 'WESTERN' | 'ETHNIC' | 'DRESSES' | 'BLOUSE' | 'TROUSERS' | 'TOPS'>('ALL');
  const [sortBy, setSortBy] = useState('Top Rated');
  const [isFilterOpen, setFilterOpen] = useState(false);
  const [isSortOpen, setSortOpen] = useState(false);

  // Selected Checkbox Filters state
  const [selectedFilters, setSelectedFilters] = useState<{
    fabric: string[];
    neckType: string[];
    sleeves: string[];
    occasion: string[];
    length: string[];
    fit: string[];
  }>({
    fabric: [],
    neckType: [],
    sleeves: [],
    occasion: [],
    length: [],
    fit: []
  });

  // Track initial category and collection query updates
  useEffect(() => {
    if (initialCategory) {
      // Map category ID to the visual catalog tabs
      if (initialCategory === 'dresses') setSelectedCategoryTab('DRESSES');
      else if (initialCategory === 'tops-blouses') setSelectedCategoryTab('BLOUSE');
      else if (initialCategory === 'pants') setSelectedCategoryTab('TROUSERS');
      else if (initialCategory === 'occasion-wear') setSelectedCategoryTab('ETHNIC');
      else setSelectedCategoryTab('ALL');
    } else {
      setSelectedCategoryTab('ALL');
    }
    
    if (initialSearch) {
      setSearchQuery(initialSearch);
    }
  }, [initialCategory, initialSearch]);

  // Handle body scroll freeze on drawer open
  useEffect(() => {
    if (isFilterOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isFilterOpen]);

  // Reset Filters
  const handleResetFilters = () => {
    setSelectedFilters({
      fabric: [],
      neckType: [],
      sleeves: [],
      occasion: [],
      length: [],
      fit: []
    });
  };

  // Toggle filter checkbox selection
  const handleToggleFilter = (group: keyof typeof selectedFilters, value: string) => {
    setSelectedFilters(prev => {
      const active = prev[group].includes(value)
        ? prev[group].filter(item => item !== value)
        : [...prev[group], value];
      return { ...prev, [group]: active };
    });
  };

  // Check if a product matches the category tab
  const matchesCategoryTab = (product: Product, tab: typeof selectedCategoryTab) => {
    if (tab === 'ALL') return true;
    if (tab === 'WESTERN') {
      return ['Dresses', 'Sweaters', 'Pants', 'Co-ord Sets'].includes(product.category);
    }
    if (tab === 'ETHNIC') {
      return ['Occasion Wear'].includes(product.category);
    }
    if (tab === 'DRESSES') {
      return product.category === 'Dresses';
    }
    if (tab === 'BLOUSE') {
      return product.category === 'Tops & Blouses';
    }
    if (tab === 'TROUSERS') {
      return product.category === 'Pants';
    }
    if (tab === 'TOPS') {
      return ['Tops & Blouses', 'Co-ord Sets'].includes(product.category);
    }
    return true;
  };

  // Apply all filters and return matching products
  const getFilteredProducts = () => {
    return PRODUCTS.filter(product => {
      // 1. Department Filter (Only fashion for this catalog view)
      if (product.department !== 'fashion') return false;

      // 2. Collection Query Filter (e.g. bestseller / new arrival)
      if (initialCollection === 'best-sellers' && !product.bestseller) return false;
      if (initialCollection === 'new-arrivals' && product.bestseller) return false; // assuming non-bestsellers for variety in demo

      // 3. Category Tab Filter
      if (!matchesCategoryTab(product, selectedCategoryTab)) return false;

      // 4. Search Filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesName = product.name.toLowerCase().includes(query);
        const matchesDesc = product.description.toLowerCase().includes(query);
        const matchesCat = product.category.toLowerCase().includes(query);
        if (!matchesName && !matchesDesc && !matchesCat) return false;
      }

      // 5. Faceted Checkbox Filters
      for (const [key, selectedValues] of Object.entries(selectedFilters)) {
        if (selectedValues.length > 0) {
          const productValue = product[key as keyof Product];
          if (!productValue || !selectedValues.includes(String(productValue))) {
            return false;
          }
        }
      }

      return true;
    });
  };

  const filteredProducts = getFilteredProducts();

  // Apply sorting
  const getSortedProducts = (items: Product[]) => {
    const list = [...items];
    if (sortBy === 'Price: Low to High') {
      return list.sort((a, b) => a.price - b.price);
    }
    if (sortBy === 'Price: High to Low') {
      return list.sort((a, b) => b.price - a.price);
    }
    if (sortBy === 'Newest') {
      // Sort by id descending
      return list.sort((a, b) => b.id.localeCompare(a.id));
    }
    if (sortBy === 'Best Selling') {
      return list.sort((a, b) => (b.bestseller ? 1 : 0) - (a.bestseller ? 1 : 0));
    }
    // Default 'Top Rated'
    return list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
  };

  const sortedProducts = getSortedProducts(filteredProducts);

  return (
    <div className="w-full max-w-full min-h-screen bg-[#FFFFFF] py-10 md:py-16 px-4 md:px-12 lg:px-24 text-brand-espresso select-none relative">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Navigation Controls (← Back & Back to Home) */}
        <NavigationControls className="justify-start border-b border-brand-border/30 pb-3" />

        {/* Editorial Header */}
        <div className="space-y-2 text-center">
          <h1 className="font-display font-bold text-3xl md:text-5xl tracking-wide uppercase text-brand-espresso">
            Ready-to-Wear Catalog
          </h1>
          <p className="text-xs md:text-sm text-brand-warmGray font-medium max-w-lg mx-auto">
            Discover Handcrafted Ethnic Silhouettes & Contemporary Western Pieces designed for modern luxury.
          </p>
        </div>

        {/* Toolbar panel: Filters, Search, Sort */}
        <div className="flex flex-col gap-4 border-b border-brand-border/40 pb-6 md:flex-row md:items-center md:justify-between">
          
          {/* Filters & Sort Group (Side-by-side on mobile, standalone on desktop) */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            {/* Filters Toggle Button */}
            <button
              onClick={() => setFilterOpen(true)}
              className="flex-1 md:flex-none flex items-center justify-center space-x-2 px-6 py-3 border border-brand-border rounded-full text-xs font-bold tracking-widest hover:bg-brand-softBeige/40 transition-colors uppercase shadow-sm"
            >
              <SlidersHorizontal className="w-4 h-4 stroke-[1.75]" />
              <span>Filters</span>
            </button>

            {/* Sorting custom dropdown */}
            <div className="relative flex-1 md:flex-none">
              <button
                onClick={() => setSortOpen(!isSortOpen)}
                className="w-full flex items-center justify-between space-x-2 px-5 py-3 border border-brand-border rounded-full text-xs font-bold tracking-widest bg-transparent hover:bg-brand-softBeige/25 transition-colors uppercase shadow-sm"
              >
                <span>{sortBy}</span>
                <ChevronDown className="w-4 h-4 text-brand-warmGray stroke-[2]" />
              </button>
              <AnimatePresence>
                {isSortOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setSortOpen(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-48 bg-white border border-brand-border rounded-2xl shadow-xl z-20 py-2 overflow-hidden text-left"
                    >
                      {['Top Rated', 'Newest', 'Price: Low to High', 'Price: High to Low', 'Best Selling'].map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => {
                            setSortBy(opt);
                            setSortOpen(false);
                          }}
                          className={`w-full text-left px-4 py-2.5 text-[11px] font-extrabold tracking-wider uppercase transition-colors ${
                            sortBy === opt
                              ? 'bg-brand-espresso text-white'
                              : 'text-brand-espresso hover:bg-brand-softBeige/40'
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Search bar input */}
          <div className="w-full md:flex-grow md:max-w-md relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-warmGray stroke-[2]" />
            <input
              type="text"
              placeholder="Search dresses, kurtis, tops..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-brand-softBeige/25 border border-brand-border/60 rounded-full text-xs font-medium outline-none placeholder-brand-warmGray/60 text-brand-espresso focus:border-brand-espresso transition-colors shadow-sm"
            />
          </div>

        </div>

        {/* Category selector tabs */}
        <div className="flex overflow-x-auto pb-2 gap-3 scrollbar-none snap-x snap-mandatory">
          {(['ALL', 'WESTERN', 'ETHNIC', 'DRESSES', 'BLOUSE', 'TROUSERS', 'TOPS'] as const).map((tab) => {
            const isSelected = selectedCategoryTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setSelectedCategoryTab(tab)}
                className={`px-6 py-2 rounded-full text-[10px] font-extrabold tracking-widest border transition-all flex-shrink-0 snap-start ${
                  isSelected
                    ? 'bg-brand-espresso border-brand-espresso text-brand-white shadow-sm'
                    : 'bg-transparent border-brand-border text-brand-warmGray hover:text-brand-espresso hover:border-brand-warmGray'
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>

        {/* Products Grid list */}
        {sortedProducts.length === 0 ? (
          <div className="w-full py-24 text-center space-y-3">
            <h3 className="font-display font-bold text-lg tracking-widest text-brand-espresso uppercase">
              NO PIECES FOUND
            </h3>
            <p className="text-xs text-brand-warmGray font-medium">
              Try adjusting your search criteria or resetting your active filters.
            </p>
            <button
              onClick={() => { setSearchQuery(''); handleResetFilters(); setSelectedCategoryTab('ALL'); }}
              className="px-6 py-2.5 border border-brand-espresso rounded-full text-[10px] font-bold tracking-widest text-brand-espresso hover:bg-brand-espresso hover:text-[#FFFFFF] transition-all uppercase mt-4"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
            {sortedProducts.map((product) => {
              const inWishlist = isInWishlist(product.id);
              const slug = product.name.toLowerCase().replace(/ /g, '-');
              
              return (
                <div
                  key={product.id}
                  onClick={() => router.push(`/product/${slug}`)}
                  className="flex flex-col text-left group cursor-pointer bg-brand-white border border-brand-border/40 rounded-2xl p-2.5 hover:shadow-md transition-shadow relative"
                >
                  {/* Image Aspect ratio container */}
                  <div className="w-full aspect-[4/5] bg-brand-softBeige/20 overflow-hidden relative rounded-xl">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />

                    {/* Collection badge label */}
                    <div className="absolute top-2 left-2 pointer-events-none">
                      <span className="text-[7px] md:text-[8px] bg-[#FFFFFF]/90 border border-brand-border/40 text-brand-espresso font-extrabold tracking-widest px-2 py-0.5 rounded shadow-sm uppercase">
                        {product.category}
                      </span>
                    </div>

                    {/* Wishlist interactive button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleWishlist(product);
                      }}
                      className="absolute top-2 right-2 p-2 bg-brand-white/85 hover:bg-brand-white border border-brand-border/20 text-brand-warmGray rounded-full transition-all shadow-sm z-10 pointer-events-auto"
                      aria-label="Wishlist"
                    >
                      <Heart className={`w-3.5 h-3.5 ${inWishlist ? 'fill-brand-dustyRose stroke-brand-dustyRose' : 'text-brand-warmGray'}`} />
                    </button>
                  </div>

                  {/* Metadata underneath image */}
                  <div className="pt-4 pb-2 px-1 flex-grow flex flex-col justify-between">
                    <div>
                      <span className="text-[8px] font-bold text-brand-warmGray tracking-widest uppercase block mb-1">
                        ARTISAN WEAVES
                      </span>
                      <h4 className="font-display font-bold text-xs md:text-sm text-brand-espresso group-hover:text-brand-dustyRose transition-colors line-clamp-1">
                        {product.name}
                      </h4>
                    </div>

                    <div className="flex items-center justify-between mt-3 pt-2 border-t border-brand-border/20">
                      <span className="text-xs md:text-sm font-bold text-brand-espresso">
                        ₹{product.price.toLocaleString('en-IN')}
                      </span>
                      <div className="flex items-center space-x-1 text-amber-500">
                        <Star className="w-3 h-3 fill-current" />
                        <span className="text-[10px] font-bold text-brand-espresso">
                          {product.rating || 4.5}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* Glossy Faceted Filters Side Drawer */}
      <AnimatePresence>
        {isFilterOpen && (
          <>
            {/* Translucent blurred backdrop dim panel */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setFilterOpen(false)}
              className="fixed inset-0 z-50 bg-[#2C2522]/60 backdrop-blur-md"
            />

            {/* Left slide modal container */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 220 }}
              className="fixed left-0 top-0 bottom-0 z-50 w-full max-w-sm bg-brand-white border-r border-brand-border/60 shadow-2xl flex flex-col justify-between"
            >
              {/* Header drawer */}
              <div className="px-6 py-6 border-b border-brand-border/40 flex items-center justify-between">
                <div>
                  <h2 className="font-display text-xl font-bold tracking-wider text-brand-espresso">Filters</h2>
                  <span className="text-[10px] text-brand-warmGray font-semibold tracking-wider block mt-1">
                    {filteredProducts.length} Products Available
                  </span>
                </div>
                <button
                  onClick={() => setFilterOpen(false)}
                  className="p-2 hover:bg-brand-softBeige/50 rounded-full border border-brand-border transition-all"
                >
                  <X className="w-4 h-4 text-brand-espresso" />
                </button>
              </div>

              {/* Filter checkboxes scrolling contents */}
              <div className="flex-grow overflow-y-auto px-6 py-4 space-y-6">
                
                {/* Loop over filter groups */}
                {Object.entries(FILTER_CRITERIA).map(([groupKey, options]) => {
                  const label = groupKey.toUpperCase().replace(/([A-Z])/g, ' $1');
                  const typedGroupKey = groupKey as keyof typeof selectedFilters;

                  return (
                    <div key={groupKey} className="space-y-3">
                      <h4 className="text-[10px] md:text-[11px] font-extrabold tracking-widest text-brand-espresso border-b border-brand-border/20 pb-1 uppercase">
                        {label}
                      </h4>
                      <div className="flex flex-wrap gap-2 pt-1">
                        {options.map((val) => {
                          const isSelected = selectedFilters[typedGroupKey].includes(val);
                          return (
                            <button
                              key={val}
                              onClick={() => handleToggleFilter(typedGroupKey, val)}
                              className={`px-4 py-2 border rounded-full text-[10px] font-bold tracking-wider transition-all flex items-center space-x-1.5 ${
                                isSelected
                                  ? 'bg-brand-espresso border-brand-espresso text-brand-white'
                                  : 'bg-transparent border-brand-border text-brand-warmGray hover:border-brand-warmGray hover:text-brand-espresso'
                              }`}
                            >
                              {isSelected && <Check className="w-3 h-3 stroke-[2.5]" />}
                              <span>{val}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}

              </div>

              {/* Bottom drawer specs: Reset and Show Results CTA */}
              <div className="px-6 py-6 border-t border-brand-border/40 grid grid-cols-3 gap-4 items-center bg-brand-warmWhite/40">
                <button
                  onClick={handleResetFilters}
                  className="col-span-1 py-3 text-center border border-brand-border rounded-xl text-[10px] font-extrabold tracking-widest text-brand-espresso hover:bg-brand-softBeige/30 transition-colors uppercase"
                >
                  Reset
                </button>
                <button
                  onClick={() => setFilterOpen(false)}
                  className="col-span-2 py-3 bg-[#F26A2E] text-white text-[10px] font-extrabold tracking-widest text-center rounded-xl hover:bg-[#F26A2E]/90 transition-colors uppercase"
                >
                  Show Results ({filteredProducts.length})
                </button>
              </div>

            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function CatalogPage() {
  return (
    <Suspense fallback={
      <div className="w-full min-h-screen flex items-center justify-center bg-white text-brand-espresso">
        <div className="text-center space-y-2">
          <span className="text-[10px] text-brand-warmGray font-bold tracking-[0.2em] uppercase block animate-pulse">
            LOADING CATALOG...
          </span>
        </div>
      </div>
    }>
      <CatalogContent />
    </Suspense>
  );
}
