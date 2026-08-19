import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ProductVisual } from './ProductVisual';
import { X, Heart, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const ProductModal: React.FC = () => {
  const {
    selectedProduct,
    setSelectedProduct,
    addToCart,
    toggleWishlist,
    isInWishlist,
  } = useApp();

  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [addedSuccess, setAddedSuccess] = useState(false);

  if (!selectedProduct) return null;

  // Initialize selections
  const product = selectedProduct;
  const inWishlist = isInWishlist(product.id);

  // Set default selection values once when product changes
  React.useEffect(() => {
    if (product) {
      setSelectedSize(product.sizes && product.sizes.length > 0 ? product.sizes[0] : '');
      setSelectedColor(product.colors && product.colors.length > 0 ? product.colors[0] : '');
      setQuantity(1);
      setAddedSuccess(false);
    }
  }, [product]);

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedSize, selectedColor);
    setAddedSuccess(true);
    setTimeout(() => {
      setAddedSuccess(false);
      setSelectedProduct(null); // Auto close modal on successful add
    }, 800);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setSelectedProduct(null)}
        className="fixed inset-0 z-50 bg-brand-espresso/50 backdrop-blur-sm flex items-center justify-center p-4 md:p-6"
      >
        {/* Modal Window */}
        <motion.div
          initial={{ scale: 0.95, y: 15 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.95, y: 15 }}
          transition={{ type: 'spring', damping: 25, stiffness: 220 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-brand-warmWhite w-full max-w-4xl rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row relative border border-brand-border"
        >
          {/* Close button */}
          <button
            onClick={() => setSelectedProduct(null)}
            className="absolute top-4 right-4 z-10 p-2 text-brand-espresso hover:text-brand-dustyRose bg-brand-white/80 hover:bg-brand-white border border-brand-border/60 rounded-full transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Left: Graphic Visualizer */}
          <div className="flex-1 bg-brand-white p-8 flex items-center justify-center border-b md:border-b-0 md:border-r border-brand-border/60 relative min-h-[300px] md:min-h-[400px]">
            {/* Department tag overlay */}
            <div className="absolute top-4 left-4 flex gap-2">
              <span className={`text-[9px] font-extrabold tracking-[0.2em] px-2.5 py-1 rounded-full ${
                product.department === 'fashion'
                  ? 'bg-brand-blush/60 text-brand-dustyRose'
                  : 'bg-brand-softBeige text-brand-antiqueBronze border border-brand-antiqueBronze/20'
              }`}>
                {product.department.toUpperCase()}
              </span>
              {product.rarity && (
                <span className="text-[9px] font-extrabold bg-brand-espresso text-brand-gold px-2.5 py-1 rounded-full tracking-widest">
                  {product.rarity.toUpperCase()}
                </span>
              )}
            </div>

            {/* Visual with slow rotation option */}
            <div className="w-64 h-80 flex items-center justify-center">
              <ProductVisual
                type={product.visualType}
                color={product.visualColor}
                pattern={product.visualPattern}
                className="transform transition-transform hover:scale-105"
              />
            </div>
          </div>

          {/* Right: Info and controls */}
          <div className="flex-1 p-6 md:p-8 flex flex-col justify-between space-y-6">
            
            {/* Header info */}
            <div className="space-y-2">
              <span className="text-[10px] text-brand-warmGray font-bold tracking-[0.2em] uppercase">
                {product.category}
              </span>
              <h3 className="font-display font-bold text-2xl md:text-3xl text-brand-espresso leading-tight">
                {product.name}
              </h3>
              
              {/* Price details */}
              <div className="flex items-baseline space-x-3 pt-2">
                <span className="text-xl font-bold text-brand-espresso">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
                <span className="text-sm text-brand-warmGray line-through font-semibold">
                  ₹{product.mrp.toLocaleString('en-IN')}
                </span>
                <span className="text-xs bg-brand-sale/10 text-brand-sale border border-brand-sale/20 px-2 py-0.5 rounded font-bold tracking-wider">
                  {product.discount}% OFF
                </span>
              </div>
            </div>

            {/* Description */}
            <p className="text-xs text-brand-warmGray leading-relaxed font-medium">
              {product.description}
            </p>

            {/* Historical Spec Sheet if Coin/Note */}
            {product.department === 'numismatics' && (
              <div className="grid grid-cols-2 gap-4 bg-brand-softBeige/40 p-4 border border-brand-border/40 rounded-xl text-[10px] tracking-wider font-semibold text-brand-espresso">
                <div>
                  <span className="text-brand-warmGray block">HISTORIC ERA</span>
                  <span className="font-extrabold">{product.era || 'Unknown'}</span>
                </div>
                <div>
                  <span className="text-brand-warmGray block">MINT DATE</span>
                  <span className="font-extrabold">{product.year || 'Unknown'}</span>
                </div>
                <div>
                  <span className="text-brand-warmGray block">RARITY GRADE</span>
                  <span className="font-extrabold text-brand-antiqueBronze">{product.rarity || 'Common'}</span>
                </div>
                <div>
                  <span className="text-brand-warmGray block">GENUINENESS</span>
                  <span className="font-extrabold text-brand-success">100% Certified</span>
                </div>
              </div>
            )}

            {/* Sizes & Colors controls if Fashion */}
            {product.department === 'fashion' && (
              <div className="space-y-4">
                
                {/* Colors list */}
                {product.colors && product.colors.length > 0 && (
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold text-brand-warmGray tracking-widest block uppercase">
                      SELECT SHADE:
                    </span>
                    <div className="flex space-x-2">
                      {product.colors.map((colorHex) => (
                        <button
                          key={colorHex}
                          onClick={() => setSelectedColor(colorHex)}
                          className={`w-6 h-6 rounded-full border transition-all ${
                            selectedColor === colorHex
                              ? 'scale-110 border-brand-espresso ring-2 ring-brand-blush'
                              : 'border-brand-border hover:opacity-80'
                          }`}
                          style={{ backgroundColor: colorHex }}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Sizes list */}
                {product.sizes && product.sizes.length > 0 && (
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold text-brand-warmGray tracking-widest block uppercase">
                      SELECT SIZE:
                    </span>
                    <div className="flex flex-wrap gap-2 text-xs font-bold text-brand-espresso">
                      {product.sizes.map((sz) => (
                        <button
                          key={sz}
                          onClick={() => setSelectedSize(sz)}
                          className={`px-3 py-1.5 border rounded-lg transition-all ${
                            selectedSize === sz
                              ? 'border-brand-espresso bg-brand-espresso text-brand-white shadow-sm'
                              : 'border-brand-border hover:bg-brand-softBeige/40'
                          }`}
                        >
                          {sz}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            )}

            {/* CTAs */}
            <div className="flex gap-4 pt-4 border-t border-brand-border/40">
              
              {/* Add to bag button */}
              <button
                onClick={handleAddToCart}
                disabled={addedSuccess}
                className={`flex-grow py-3 px-6 rounded-xl flex items-center justify-center gap-2 font-bold text-xs tracking-widest uppercase transition-all ${
                  addedSuccess
                    ? 'bg-brand-success text-brand-white'
                    : 'bg-brand-espresso text-brand-white hover:bg-brand-espresso/90 shadow-md'
                }`}
              >
                {addedSuccess ? (
                  <span>✓ ADDED SUCCESSFULLY</span>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>ADD TO SHOPPING BAG</span>
                  </>
                )}
              </button>

              {/* Wishlist toggle */}
              <button
                onClick={() => toggleWishlist(product)}
                aria-label="Toggle Wishlist"
                className={`p-3 rounded-xl border transition-all flex items-center justify-center ${
                  inWishlist
                    ? 'bg-brand-blush/40 border-brand-dustyRose text-brand-dustyRose'
                    : 'border-brand-border hover:bg-brand-softBeige/30 text-brand-warmGray'
                }`}
              >
                <Heart className={`w-5 h-5 ${inWishlist ? 'fill-brand-dustyRose' : ''}`} />
              </button>

            </div>

          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
