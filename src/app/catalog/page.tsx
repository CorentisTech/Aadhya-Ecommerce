"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { PRODUCTS, Product } from '@/data/mockData';
import { useApp } from '@/context/AppContext';
import { Heart, Star, SlidersHorizontal, X, Search, ChevronDown, Grid3X3, LayoutGrid } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { NavigationControls } from '@/components/ui/NavigationControls';
import { ProductVisual } from '@/components/ui/ProductVisual';

// Filter option lists
const FASHION_FILTER_CRITERIA = {
  fabric: ['Cotton', 'Silk', 'Wool Blend', 'Raw Silk', 'Chiffon', 'Linen'],
  neckType: ['Collared', 'V-Neck', 'Round Neck', 'Sweetheart', 'Boat Neck'],
  sleeves: ['Full Sleeves', 'Long Sleeves', 'Three-Quarter', 'Half Sleeves', 'Sleeveless'],
  occasion: ['Casual', 'Formal', 'Festive', 'Wedding', 'Evening'],
  fit: ['Relaxed', 'Slim Fit', 'Flared', 'Tailored', 'Oversized']
};

const NUMISMATICS_FILTER_CRITERIA = {
  material: ['Silver', 'Gold', 'Paper', 'Mixed Metal', 'Copper'],
  era: ['British India', 'Republic India', 'Mughal Empire', 'Ancient', 'East India Company'],
  rarity: ['Rare', 'Scarce', 'Very Rare', 'Extremely Rare', 'Standard'],
  visualType: ['coin', 'note']
};

const FASHION_PILLS = ['ALL', 'WESTERN', 'ETHNIC', 'DRESSES', 'BLOUSE', 'TROUSERS', 'TOPS'];

function CatalogContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // URL Params State
  const initialDepartment = searchParams.get('department') || 'fashion';
  const initialCategory = searchParams.get('category') || '';
  const initialSearch = searchParams.get('search') || '';
  const initialSort = searchParams.get('sort') || '';

  const { toggleWishlist, isInWishlist, addToCart } = useApp();

  // Toolbar & Filtering States
  const [department, setDepartment] = useState<'fashion' | 'numismatics'>(
    initialDepartment === 'numismatics' ? 'numismatics' : 'fashion'
  );
  const [selectedFashionPill, setSelectedFashionPill] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [activeSortTab, setActiveSortTab] = useState<string>(
    initialSort === 'newest' ? 'Newest' : initialSort === 'best-selling' ? 'Best Sellers' : 'Recommended'
  );
  const [gridColumns, setGridColumns] = useState<3 | 4>(4);
  const [isFilterOpen, setFilterOpen] = useState(false);

  // Top Dropdown Filters State for Numismatics
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
    } else if (searchParams.get('department') === 'fashion') {
      setDepartment('fashion');
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

    // 3. Fashion Pill filtering
    if (department === 'fashion' && selectedFashionPill !== 'ALL') {
      const pill = selectedFashionPill.toLowerCase();
      const cat = product.category.toLowerCase();
      const desc = product.description.toLowerCase();
      const name = product.name.toLowerCase();
      const visual = product.visualType?.toLowerCase() || '';

      if (pill === 'western') {
        const matches = cat.includes('dress') || cat.includes('pants') || cat.includes('western') || cat.includes('coord') || cat.includes('sweater') || name.includes('blazer') || name.includes('shirt');
        if (!matches) return false;
      } else if (pill === 'ethnic') {
        const matches = cat.includes('occasion') || cat.includes('saree') || visual.includes('saree') || visual.includes('ethnic') || name.includes('kurti') || name.includes('anarkali');
        if (!matches) return false;
      } else if (pill === 'dresses') {
        const matches = cat.includes('dress') || visual.includes('dress') || name.includes('dress');
        if (!matches) return false;
      } else if (pill === 'blouse') {
        const matches = cat.includes('blouse') || visual.includes('blouse') || name.includes('blouse') || name.includes('top');
        if (!matches) return false;
      } else if (pill === 'trousers') {
        const matches = cat.includes('pants') || cat.includes('coord') || name.includes('trousers');
        if (!matches) return false;
      } else if (pill === 'tops') {
        const matches = cat.includes('tops') || cat.includes('sweaters') || visual.includes('blouse') || name.includes('top') || name.includes('sweater');
        if (!matches) return false;
      }
    }

    // 4. Numismatics Dropdowns
    if (department === 'numismatics') {
      if (selectedType !== 'all') {
        if (selectedType === 'coins' && product.visualType !== 'coin') return false;
        if (selectedType === 'notes' && product.visualType !== 'note') return false;
        if (selectedType === 'rare-coins' && product.rarity !== 'Rare') return false;
        if (selectedType === 'british-india' && product.era !== 'British India') return false;
        if (selectedType === 'republic-india' && product.era !== 'Republic India') return false;
      }

      if (selectedPriceRange === 'under-5k' && product.price >= 5000) return false;
      if (selectedPriceRange === '5k-15k' && (product.price < 5000 || product.price > 15000)) return false;
      if (selectedPriceRange === '15k-30k' && (product.price < 15000 || product.price > 30000)) return false;
      if (selectedPriceRange === 'above-30k' && product.price <= 30000) return false;

      if (selectedMaterial !== 'all' && product.material?.toLowerCase() !== selectedMaterial.toLowerCase()) {
        return false;
      }

      if (selectedEra !== 'all' && product.era?.toLowerCase() !== selectedEra.toLowerCase()) {
        return false;
      }
    }

    // 5. Checkbox Filters
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
    return (b.rating || 5) - (a.rating || 5);
  });

  const isFashion = department === 'fashion';

  return (
    <div className="w-full max-w-full min-h-screen bg-[#FDF9F3] py-6 sm:py-10 md:py-14 px-4 md:px-12 lg:px-20 text-[#2B231D] select-none relative">
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
        
        {/* Navigation Controls */}
        <NavigationControls className="justify-start border-b border-[#EFE8DC] pb-3" />

        {/* ==================================================
            1. FASHION CATALOG HEADER (Exact Match: media_1788426604546.png)
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
                  className="px-4 py-2 bg-[#1A1A1A] text-white rounded-full text-xs font-bold hover:bg-black transition-colors flex items-center gap-1.5 shadow-xs"
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
                    placeholder="Search dresses, kurtis, tops..."
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

            {/* Filter Pills Row (ALL | WESTERN | ETHNIC | DRESSES | BLOUSE | TROUSERS | TOPS) */}
            <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto scrollbar-none pb-2 pt-1">
              {FASHION_PILLS.map((pill) => {
                const isSelected = selectedFashionPill === pill;
                return (
                  <button
                    key={pill}
                    onClick={() => setSelectedFashionPill(pill)}
                    className={`px-5 py-1.5 sm:py-2 rounded-full text-xs font-bold tracking-wider uppercase transition-all whitespace-nowrap shadow-xs ${
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
             1. NUMISMATICS CATALOG HEADER
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
              </div>

              {/* Department Switcher Pill */}
              <div className="flex items-center bg-[#FDF9F3] p-1.5 rounded-full border border-[#EAE2D5] shadow-xs">
                <button
                  onClick={() => setDepartment('numismatics')}
                  className="px-5 py-2 rounded-full text-xs font-extrabold bg-[#E0591D] text-white shadow-xs"
                >
                  Coins & Notes
                </button>
                <button
                  onClick={() => setDepartment('fashion')}
                  className="px-5 py-2 rounded-full text-xs font-extrabold text-brand-warmGray hover:text-[#2B231D]"
                >
                  Fashion
                </button>
              </div>
            </div>

            {/* Numismatics Filter Dropdowns Row */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
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

              <button
                onClick={() => setFilterOpen(true)}
                className="px-4 py-2 bg-[#2B231D] text-white border border-[#2B231D] rounded-full text-xs font-extrabold hover:bg-black transition-colors flex items-center gap-1.5 shadow-xs ml-auto"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-[#E0591D]" />
                <span>All filters</span>
              </button>
            </div>
          </div>
        )}

        {/* ==================================================
            2. PRODUCT GRID (Exact Layout: media_1788426604546.png for Fashion, Numismatics for Coins)
           ================================================== */}
        {isFashion ? (
          /* FASHION CARDS GRID: 4-COLUMNS, STRICTLY DRESSES */
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

                    {/* Details Below Image */}
                    <div className="p-3.5 sm:p-4 space-y-1">
                      <span className="text-[8px] sm:text-[9px] font-bold text-[#7D736A] uppercase tracking-wider block">
                        {product.occasion || 'SUMMER COLLECTION'}
                      </span>
                      <h3 className="font-sans font-bold text-xs sm:text-sm text-[#2B231D] group-hover:text-brand-dustyRose transition-colors line-clamp-1">
                        {product.name}
                      </h3>
                      
                      <div className="flex items-center justify-between pt-1.5">
                        <span className="font-sans font-bold text-xs sm:text-sm text-[#2B231D]">
                          ₹{product.price.toLocaleString('en-IN')}
                        </span>
                        <div className="flex items-center gap-1 text-[10px] sm:text-[11px] font-extrabold text-[#E0591D]">
                          <Star className="w-3 h-3 fill-current" />
                          <span>{product.rating || '4.8'}</span>
                        </div>
                      </div>
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
                      className="w-full mt-2 py-1.5 bg-white hover:bg-[#2B231D] text-[#2B231D] hover:text-white border border-[#2B231D] font-extrabold text-[9px] tracking-wider uppercase rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5"
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
                <h3 className="font-display font-bold text-lg text-[#2B231D] uppercase">
                  {isFashion ? 'Fashion Filters' : 'Numismatic Filters'}
                </h3>
                <button onClick={() => setFilterOpen(false)} className="p-2 hover:bg-[#FAF7F2] rounded-full">
                  <X className="w-5 h-5 text-[#2B231D]" />
                </button>
              </div>

              <div className="space-y-6">
                {isFashion ? (
                  <>
                    <div>
                      <h4 className="text-[10px] font-extrabold text-brand-warmGray uppercase tracking-widest mb-2">FABRIC</h4>
                      {FASHION_FILTER_CRITERIA.fabric.map(fab => (
                        <button
                          key={fab}
                          onClick={() => handleToggleFilter('fabric', fab)}
                          className={`block text-xs py-1.5 w-full text-left font-semibold ${selectedFilters.fabric?.includes(fab) ? 'text-[#1A1A1A] font-bold' : 'text-brand-warmGray'}`}
                        >
                          {fab}
                        </button>
                      ))}
                    </div>

                    <div className="pt-4 border-t border-[#EFE8DC]">
                      <h4 className="text-[10px] font-extrabold text-brand-warmGray uppercase tracking-widest mb-2">OCCASION</h4>
                      {FASHION_FILTER_CRITERIA.occasion.map(occ => (
                        <button
                          key={occ}
                          onClick={() => handleToggleFilter('occasion', occ)}
                          className={`block text-xs py-1.5 w-full text-left font-semibold ${selectedFilters.occasion?.includes(occ) ? 'text-[#1A1A1A] font-bold' : 'text-brand-warmGray'}`}
                        >
                          {occ}
                        </button>
                      ))}
                    </div>
                  </>
                ) : (
                  <>
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
                  </>
                )}
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
