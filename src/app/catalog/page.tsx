"use client";

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { PRODUCTS, CATEGORIES, Product } from '@/data/mockData';
import { useApp } from '@/context/AppContext';
import { Heart, Star, SlidersHorizontal, X, Search, Check, ChevronDown, ShoppingBag, Grid3X3, LayoutGrid } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { NavigationControls } from '@/components/ui/NavigationControls';
import { ProductVisual } from '@/components/ui/ProductVisual';

// Filter option lists
const FASHION_FILTER_CRITERIA = {
  fabric: ['Cotton', 'Silk', 'Wool Blend', 'Raw Silk', 'Chiffon', 'Linen'],
  neckType: ['Collared', 'V-Neck', 'Round Neck', 'Sweetheart', 'Boat Neck'],
  sleeves: ['Full Sleeves', 'Long Sleeves', 'Three-Quarter', 'Half Sleeves', 'Sleeveless'],
  occasion: ['Casual', 'Formal', 'Festive', 'Wedding', 'Evening'],
  length: ['Short', 'Midi', 'Maxi', 'Crop'],
  fit: ['Relaxed', 'Slim Fit', 'Flared', 'Tailored', 'Oversized']
};

const NUMISMATICS_FILTER_CRITERIA = {
  material: ['Silver', 'Gold', 'Paper', 'Mixed Metal', 'Copper'],
  era: ['British India', 'Republic India', 'Mughal Empire', 'Ancient', 'East India Company'],
  rarity: ['Rare', 'Scarce', 'Very Rare', 'Extremely Rare', 'Standard'],
  visualType: ['coin', 'note']
};

function CatalogContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // URL Params State
  const initialDepartment = searchParams.get('department') || 'fashion';
  const initialCategory = searchParams.get('category') || '';
  const initialCollection = searchParams.get('collection') || '';
  const initialSearch = searchParams.get('search') || '';
  const initialSort = searchParams.get('sort') || '';

  const { toggleWishlist, isInWishlist, addToCart } = useApp();

  // Toolbar & Filtering States
  const [department, setDepartment] = useState<'fashion' | 'numismatics'>(
    initialDepartment === 'numismatics' ? 'numismatics' : 'fashion'
  );
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [activeSortTab, setActiveSortTab] = useState<string>(
    initialSort === 'newest' ? 'Newest' : initialSort === 'best-selling' ? 'Best Sellers' : 'Recommended'
  );
  const [gridColumns, setGridColumns] = useState<3 | 4>(4);
  const [isFilterOpen, setFilterOpen] = useState(false);

  // Top Dropdown Filters State (Matching Wireframe)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>('all');
  const [selectedMaterial, setSelectedMaterial] = useState<string>('all');
  const [selectedEra, setSelectedEra] = useState<string>('all');

  // Selected Checkbox Filters
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({
    fabric: [],
    material: [],
    era: [],
    rarity: []
  });

  useEffect(() => {
    if (searchParams.get('department') === 'numismatics') {
      setDepartment('numismatics');
    }
    if (initialCategory) {
      setSelectedType(initialCategory);
    }
  }, [searchParams, initialCategory]);

  const handleToggleFilter = (group: string, value: string) => {
    setSelectedFilters(prev => {
      const current = prev[group] || [];
      const active = current.includes(value)
        ? current.filter(item => item !== value)
        : [...current, value];
      return { ...prev, [group]: active };
    });
  };

  // Filter products by department, search, category, dropdowns, and checkboxes
  const filteredProducts = PRODUCTS.filter(product => {
    // 1. Department match
    if (product.department !== department) return false;

    // 2. Search query match
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesName = product.name.toLowerCase().includes(query);
      const matchesDesc = product.description.toLowerCase().includes(query);
      const matchesCat = product.category.toLowerCase().includes(query);
      if (!matchesName && !matchesDesc && !matchesCat) return false;
    }

    // 3. Top Dropdown Type Filter
    if (selectedType !== 'all') {
      if (selectedType === 'coins' && product.visualType !== 'coin') return false;
      if (selectedType === 'notes' && product.visualType !== 'note') return false;
      if (selectedType === 'rare-coins' && product.rarity !== 'Rare') return false;
      if (selectedType === 'british-india' && product.era !== 'British India') return false;
      if (selectedType === 'republic-india' && product.era !== 'Republic India') return false;
    }

    // 4. Price range filter
    if (selectedPriceRange === 'under-5k' && product.price >= 5000) return false;
    if (selectedPriceRange === '5k-15k' && (product.price < 5000 || product.price > 15000)) return false;
    if (selectedPriceRange === '15k-30k' && (product.price < 15000 || product.price > 30000)) return false;
    if (selectedPriceRange === 'above-30k' && product.price <= 30000) return false;

    // 5. Material Filter
    if (selectedMaterial !== 'all' && product.material?.toLowerCase() !== selectedMaterial.toLowerCase()) {
      return false;
    }

    // 6. Era Filter
    if (selectedEra !== 'all' && product.era?.toLowerCase() !== selectedEra.toLowerCase()) {
      return false;
    }

    // 7. Checkbox Filters
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

  // Apply Sorting
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (activeSortTab === 'Lowest prices') return a.price - b.price;
    if (activeSortTab === 'Highest prices') return b.price - a.price;
    if (activeSortTab === 'Best Sellers') return (b.bestseller ? 1 : 0) - (a.bestseller ? 1 : 0);
    if (activeSortTab === 'Newest') return b.id.localeCompare(a.id);
    // Default 'Recommended'
    return (b.rating || 5) - (a.rating || 5);
  });

  const renderStars = (rating = 5) => (
    <div className="flex items-center space-x-0.5 text-amber-500">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`w-3 h-3 ${i < rating ? 'fill-current' : 'text-brand-border stroke-[1.5]'}`}
        />
      ))}
    </div>
  );

  return (
    <div className="w-full max-w-full min-h-screen bg-[#FDF9F3] py-8 md:py-14 px-4 md:px-12 lg:px-20 text-[#2B231D] select-none relative">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Navigation Controls */}
        <NavigationControls className="justify-start border-b border-[#EFE8DC] pb-3" />

        {/* 1. Category Header Banner (Matching Wireframe media_1788273805665.jpg) */}
        <div className="w-full bg-white rounded-3xl p-8 md:p-12 border border-[#EFE8DC] shadow-xs flex flex-col md:flex-row items-center justify-between gap-6 text-left">
          <div className="space-y-3 max-w-2xl">
            <span className="text-[10px] font-extrabold tracking-[0.25em] text-[#E0591D] uppercase block">
              {department === 'numismatics' ? 'AADHYA NUMISMATICS COLLECTION' : 'AADHYA FASHION ATELIER'}
            </span>
            <h1 className="font-display font-black text-3xl sm:text-4xl md:text-5xl text-[#2B231D] tracking-tight">
              {department === 'numismatics' ? 'Numismatics & Archival Coins' : 'Ready-to-Wear Catalog'}
            </h1>
            <p className="text-xs sm:text-sm text-[#7D736A] font-medium leading-relaxed">
              {department === 'numismatics' 
                ? 'Explore rare historical coins, preserved banknotes, and certified museum specimens with verified provenance registers.'
                : 'Discover handcrafted ethnic silhouettes and contemporary western pieces designed for modern luxury.'}
            </p>
          </div>

          {/* Department Switcher Pill */}
          <div className="flex items-center bg-[#FDF9F3] p-1.5 rounded-full border border-[#EAE2D5] shadow-xs">
            <button
              onClick={() => setDepartment('numismatics')}
              className={`px-5 py-2 rounded-full text-xs font-extrabold transition-all ${
                department === 'numismatics' ? 'bg-[#E0591D] text-white shadow-xs' : 'text-brand-warmGray hover:text-[#2B231D]'
              }`}
            >
              Coins & Notes
            </button>
            <button
              onClick={() => setDepartment('fashion')}
              className={`px-5 py-2 rounded-full text-xs font-extrabold transition-all ${
                department === 'fashion' ? 'bg-[#2B231D] text-white shadow-xs' : 'text-brand-warmGray hover:text-[#2B231D]'
              }`}
            >
              Fashion
            </button>
          </div>
        </div>

        {/* 2. Top Filter Dropdowns Row (Matching Wireframe media_1788273805665.jpg) */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          
          {/* Type Dropdown */}
          <div className="relative">
            <button
              onClick={() => setActiveDropdown(activeDropdown === 'type' ? null : 'type')}
              className="px-4 py-2 bg-white border border-[#EAE2D5] rounded-full text-xs font-extrabold text-[#2B231D] hover:bg-[#FAF7F2] transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <span>Type {selectedType !== 'all' ? `(${selectedType})` : ''}</span>
              <ChevronDown className="w-3.5 h-3.5 text-brand-warmGray" />
            </button>
            {activeDropdown === 'type' && (
              <div className="absolute left-0 mt-2 w-48 bg-white border border-[#EAE2D5] rounded-2xl shadow-xl z-30 p-2 space-y-1">
                {['all', 'coins', 'notes', 'rare-coins', 'british-india', 'republic-india'].map(t => (
                  <button
                    key={t}
                    onClick={() => { setSelectedType(t); setActiveDropdown(null); }}
                    className={`w-full text-left px-3 py-2 text-xs font-bold rounded-lg uppercase ${selectedType === t ? 'bg-[#FFF3EC] text-[#E0591D]' : 'hover:bg-brand-softBeige/40 text-[#2B231D]'}`}
                  >
                    {t.replace('-', ' ')}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Price Dropdown */}
          <div className="relative">
            <button
              onClick={() => setActiveDropdown(activeDropdown === 'price' ? null : 'price')}
              className="px-4 py-2 bg-white border border-[#EAE2D5] rounded-full text-xs font-extrabold text-[#2B231D] hover:bg-[#FAF7F2] transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <span>Price {selectedPriceRange !== 'all' ? `(${selectedPriceRange})` : ''}</span>
              <ChevronDown className="w-3.5 h-3.5 text-brand-warmGray" />
            </button>
            {activeDropdown === 'price' && (
              <div className="absolute left-0 mt-2 w-48 bg-white border border-[#EAE2D5] rounded-2xl shadow-xl z-30 p-2 space-y-1">
                {[
                  { id: 'all', label: 'All Prices' },
                  { id: 'under-5k', label: 'Under ₹5,000' },
                  { id: '5k-15k', label: '₹5,000 - ₹15,000' },
                  { id: '15k-30k', label: '₹15,000 - ₹30,000' },
                  { id: 'above-30k', label: 'Above ₹30,000' },
                ].map(p => (
                  <button
                    key={p.id}
                    onClick={() => { setSelectedPriceRange(p.id); setActiveDropdown(null); }}
                    className={`w-full text-left px-3 py-2 text-xs font-bold rounded-lg ${selectedPriceRange === p.id ? 'bg-[#FFF3EC] text-[#E0591D]' : 'hover:bg-brand-softBeige/40 text-[#2B231D]'}`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Material Dropdown */}
          <div className="relative">
            <button
              onClick={() => setActiveDropdown(activeDropdown === 'material' ? null : 'material')}
              className="px-4 py-2 bg-white border border-[#EAE2D5] rounded-full text-xs font-extrabold text-[#2B231D] hover:bg-[#FAF7F2] transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <span>Material {selectedMaterial !== 'all' ? `(${selectedMaterial})` : ''}</span>
              <ChevronDown className="w-3.5 h-3.5 text-brand-warmGray" />
            </button>
            {activeDropdown === 'material' && (
              <div className="absolute left-0 mt-2 w-48 bg-white border border-[#EAE2D5] rounded-2xl shadow-xl z-30 p-2 space-y-1">
                {['all', 'silver', 'gold', 'paper', 'mixed metal', 'copper'].map(m => (
                  <button
                    key={m}
                    onClick={() => { setSelectedMaterial(m); setActiveDropdown(null); }}
                    className={`w-full text-left px-3 py-2 text-xs font-bold rounded-lg uppercase ${selectedMaterial === m ? 'bg-[#FFF3EC] text-[#E0591D]' : 'hover:bg-brand-softBeige/40 text-[#2B231D]'}`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* All Filters Button (Opens slide-over) */}
          <button
            onClick={() => setFilterOpen(true)}
            className="px-4 py-2 bg-[#2B231D] text-white border border-[#2B231D] rounded-full text-xs font-extrabold hover:bg-black transition-colors flex items-center gap-1.5 shadow-xs ml-auto"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#E0591D]" />
            <span>All filters</span>
          </button>

        </div>

        {/* 3. Sorting Tabs & Counter Row (Matching Wireframe media_1788273805665.jpg) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#EFE8DC] pb-3 gap-4 text-left">
          
          {/* Left Sort Tabs */}
          <div className="flex items-center gap-6 overflow-x-auto scrollbar-none py-1">
            {['Recommended', 'Lowest prices', 'Highest prices', 'Best Sellers', 'Newest'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveSortTab(tab)}
                className={`text-xs font-extrabold whitespace-nowrap transition-colors relative pb-1 ${
                  activeSortTab === tab 
                    ? 'text-[#2B231D] font-black' 
                    : 'text-brand-warmGray hover:text-[#2B231D]'
                }`}
              >
                <span>{tab}</span>
                {activeSortTab === tab && (
                  <motion.div layoutId="sortUnderline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#E0591D]" />
                )}
              </button>
            ))}
          </div>

          {/* Right Counter & Grid Toggle */}
          <div className="flex items-center justify-between sm:justify-end gap-4">
            <span className="text-xs font-extrabold text-[#7D736A]">
              Showing 1 - {sortedProducts.length} of {PRODUCTS.filter(p => p.department === department).length}
            </span>

            {/* Desktop Grid Switcher (3 cols vs 4 cols) */}
            <div className="hidden md:flex items-center bg-white border border-[#EAE2D5] rounded-full p-1 shadow-xs">
              <button
                onClick={() => setGridColumns(3)}
                className={`p-1.5 rounded-full transition-colors ${gridColumns === 3 ? 'bg-[#2B231D] text-white' : 'text-brand-warmGray'}`}
                aria-label="3 columns grid"
              >
                <Grid3X3 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setGridColumns(4)}
                className={`p-1.5 rounded-full transition-colors ${gridColumns === 4 ? 'bg-[#2B231D] text-white' : 'text-brand-warmGray'}`}
                aria-label="4 columns grid"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>

        {/* 4. Products Grid (4-cols / 3-cols Desktop, 2-cols Mobile) (Matching Wireframe media_1788273805665.jpg) */}
        <div className={`grid grid-cols-2 ${gridColumns === 3 ? 'md:grid-cols-3' : 'md:grid-cols-3 lg:grid-cols-4'} gap-4 sm:gap-6 pt-2`}>
          {sortedProducts.map((product) => {
            const inWishlist = isInWishlist(product.id);
            const slug = product.name.toLowerCase().replace(/ /g, '-');

            return (
              <div
                key={product.id}
                onClick={() => router.push(`/product/${slug}`)}
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
                        {product.rarity || 'BEST'}
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

                  {/* Details Area (Matching Wireframe) */}
                  <div className="pt-3 space-y-2">
                    <h3 className="font-display font-extrabold text-xs sm:text-sm text-[#2B231D] group-hover:text-[#E0591D] transition-colors line-clamp-1">
                      {product.name}
                    </h3>
                    
                    <p className="text-[10px] text-brand-warmGray line-clamp-1">
                      {product.description}
                    </p>

                    {/* Spec Pill Chips (Matching Wireframe Chips) */}
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

                    {/* Star Rating */}
                    <div className="flex items-center space-x-1.5 pt-1">
                      {renderStars(product.rating || 5)}
                      <span className="text-[10px] font-extrabold text-[#2B231D]">4.8</span>
                    </div>
                  </div>
                </div>

                {/* Price & Buy Now Action (Matching Wireframe) */}
                <div className="pt-4 space-y-2.5 border-t border-[#F0EAE1] mt-3">
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
                    className="w-full py-2 bg-white hover:bg-[#2B231D] text-[#2B231D] hover:text-white border border-[#2B231D] font-extrabold text-[10px] tracking-wider uppercase rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5"
                  >
                    <span>Buy now</span>
                  </button>
                </div>

              </div>
            );
          })}
        </div>

      </div>

      {/* Slide-over Filter Drawer */}
      <AnimatePresence>
        {isFilterOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex justify-end"
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 26, stiffness: 240 }}
              className="w-full max-w-md h-full bg-white p-6 overflow-y-auto space-y-6 text-left"
            >
              <div className="flex items-center justify-between border-b border-[#EFE8DC] pb-4">
                <h3 className="font-display font-bold text-lg text-[#2B231D] uppercase">All Filters</h3>
                <button onClick={() => setFilterOpen(false)} className="p-2 hover:bg-[#FAF7F2] rounded-full">
                  <X className="w-5 h-5 text-[#2B231D]" />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="text-[10px] font-extrabold text-brand-warmGray uppercase tracking-widest mb-2">MATERIAL</h4>
                  {NUMISMATICS_FILTER_CRITERIA.material.map(mat => (
                    <button
                      key={mat}
                      onClick={() => handleToggleFilter('material', mat)}
                      className={`block text-xs py-1.5 w-full text-left font-semibold ${selectedFilters.material?.includes(mat) ? 'text-[#E0591D] font-bold' : 'text-brand-warmGray'}`}
                    >
                      {mat}
                    </button>
                  ))}
                </div>

                <div className="pt-4 border-t border-[#EFE8DC]">
                  <h4 className="text-[10px] font-extrabold text-brand-warmGray uppercase tracking-widest mb-2">ERA / PERIOD</h4>
                  {NUMISMATICS_FILTER_CRITERIA.era.map(era => (
                    <button
                      key={era}
                      onClick={() => handleToggleFilter('era', era)}
                      className={`block text-xs py-1.5 w-full text-left font-semibold ${selectedFilters.era?.includes(era) ? 'text-[#E0591D] font-bold' : 'text-brand-warmGray'}`}
                    >
                      {era}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

export default function CatalogPage() {
  return (
    <Suspense fallback={<div className="w-full min-h-screen bg-[#FDF9F3] flex items-center justify-center">Loading Catalogue...</div>}>
      <CatalogContent />
    </Suspense>
  );
}
