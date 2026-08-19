import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { PRODUCTS, Product } from '../../data/mockData';
import { ProductVisual } from '../ui/ProductVisual';
import { X, Search as SearchIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const SearchOverlay: React.FC = () => {
  const {
    isSearchOpen,
    setSearchOpen,
    searchQuery,
    setSearchQuery,
    setSelectedProduct,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'all' | 'fashion' | 'numismatics'>('all');
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input on open
  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setSearchQuery('');
    }
  }, [isSearchOpen, setSearchQuery]);

  // Handle ESC key closing
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isSearchOpen) {
        setSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, setSearchOpen]);

  // Filtering products
  const filteredProducts = PRODUCTS.filter((product) => {
    const matchesQuery =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product.era && product.era.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesQuery) return false;

    if (activeTab === 'all') return true;
    return product.department === activeTab;
  });

  const handleProductClick = (product: Product) => {
    setSearchOpen(false);
    setSelectedProduct(product); // Opens detail modal
  };

  return (
    <AnimatePresence>
      {isSearchOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-brand-warmWhite/98 flex flex-col pt-24 px-6 md:px-12 lg:px-24"
        >
          {/* Header row: Title and close button */}
          <div className="flex items-center justify-between max-w-6xl mx-auto w-full mb-8">
            <span className="font-display text-sm font-bold tracking-[0.25em] text-brand-espresso">
              SEARCH DIRECTORY
            </span>
            <button
              onClick={() => setSearchOpen(false)}
              className="p-2 text-brand-espresso hover:text-brand-dustyRose transition-colors rounded-full border border-brand-border"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Large Editorial Search Bar */}
          <div className="max-w-6xl mx-auto w-full border-b-2 border-brand-espresso/60 py-4 flex items-center mb-6">
            <SearchIcon className="w-8 h-8 text-brand-warmGray mr-4 stroke-[1.5]" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search fashion, coins & collections..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent outline-none text-2xl md:text-3xl font-display font-light placeholder-brand-warmGray/40 text-brand-espresso"
            />
          </div>

          {/* Filtering Tabs */}
          <div className="max-w-6xl mx-auto w-full flex space-x-6 border-b border-brand-border pb-4 mb-8 text-xs font-bold tracking-widest text-brand-warmGray">
            <button
              onClick={() => setActiveTab('all')}
              className={`pb-1 ${activeTab === 'all' ? 'text-brand-espresso border-b-2 border-brand-espresso font-extrabold' : 'hover:text-brand-espresso'}`}
            >
              ALL ITEMS
            </button>
            <button
              onClick={() => setActiveTab('fashion')}
              className={`pb-1 ${activeTab === 'fashion' ? 'text-brand-espresso border-b-2 border-brand-espresso font-extrabold' : 'hover:text-brand-espresso'}`}
            >
              FASHION
            </button>
            <button
              onClick={() => setActiveTab('numismatics')}
              className={`pb-1 ${activeTab === 'numismatics' ? 'text-brand-espresso border-b-2 border-brand-espresso font-extrabold' : 'hover:text-brand-espresso'}`}
            >
              NUMISMATICS
            </button>
          </div>

          {/* Search Results Display Area */}
          <div className="max-w-6xl mx-auto w-full flex-grow overflow-y-auto pb-16">
            {searchQuery === '' ? (
              <div className="text-center py-20 text-brand-warmGray/70 font-semibold tracking-wider text-xs">
                BEGIN TYPING TO DISCOVER COLLECTIONS...
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-20 text-brand-warmGray/70 font-semibold tracking-wider text-xs">
                NO RESULTS MATCHING "{searchQuery.toUpperCase()}" FOUND.
              </div>
            ) : (
              <motion.div
                layout
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {filteredProducts.map((product) => (
                  <motion.button
                    layout
                    key={product.id}
                    onClick={() => handleProductClick(product)}
                    className="flex items-center gap-4 p-4 rounded-xl border border-brand-border/60 bg-brand-white hover:shadow-md transition-shadow text-left w-full group"
                  >
                    {/* SVG Garment/Coin Preview */}
                    <div className="w-16 h-20 bg-brand-warmWhite rounded-lg flex-shrink-0 flex items-center justify-center p-1 border border-brand-border/30">
                      <ProductVisual type={product.visualType} color={product.visualColor} pattern={product.visualPattern} />
                    </div>

                    {/* Metadata */}
                    <div className="flex-grow space-y-1">
                      <div className="flex items-center justify-between">
                        <span className={`text-[8px] font-extrabold tracking-[0.2em] px-2 py-0.5 rounded-full ${
                          product.department === 'fashion'
                            ? 'bg-brand-blush/60 text-brand-dustyRose'
                            : 'bg-brand-softBeige text-brand-antiqueBronze border border-brand-antiqueBronze/20'
                        }`}>
                          {product.department.toUpperCase()}
                        </span>
                        {product.rarity && (
                          <span className="text-[8px] font-bold text-brand-gold tracking-wider">
                            ✦ {product.rarity}
                          </span>
                        )}
                      </div>
                      
                      <h4 className="font-display font-bold text-sm text-brand-espresso group-hover:text-brand-dustyRose transition-colors line-clamp-1">
                        {product.name}
                      </h4>
                      <p className="text-[10px] text-brand-warmGray font-semibold tracking-wider">
                        {product.category}
                      </p>
                      
                      <div className="flex items-center space-x-2 pt-1">
                        <span className="text-xs font-bold text-brand-espresso">
                          ₹{product.price.toLocaleString('en-IN')}
                        </span>
                        <span className="text-[10px] text-brand-warmGray line-through">
                          ₹{product.mrp.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
