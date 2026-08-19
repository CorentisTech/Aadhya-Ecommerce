import React from 'react';
import { PRODUCTS, Product } from '../../data/mockData';
import { ProductVisual } from '../ui/ProductVisual';
import { useApp } from '../../context/AppContext';
import { Heart, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';

export const NewArrivals: React.FC = () => {
  const { toggleWishlist, isInWishlist, setSelectedProduct, addToCart } = useApp();
  
  // Filter new arrivals for fashion
  const newArrivals = PRODUCTS.filter((p) => p.department === 'fashion' && !p.bestseller);

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
  };

  return (
    <section id="new-arrivals" className="w-full py-20 px-6 md:px-12 lg:px-24 bg-brand-warmWhite border-t border-brand-border/40">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* Header Block */}
        <div className="flex flex-col md:flex-row items-baseline justify-between border-b border-brand-border pb-4 gap-4">
          <div className="space-y-1">
            <span className="text-[10px] text-brand-warmGray font-bold tracking-[0.2em] uppercase">
              JUST IN
            </span>
            <h2 className="font-display font-bold text-3xl md:text-4xl text-brand-espresso uppercase tracking-wider">
              NEW ARRIVALS
            </h2>
            <p className="font-display italic text-brand-warmGray text-sm">
              "Fresh silhouettes, timeless details."
            </p>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
          {newArrivals.map((product, index) => {
            const inWishlist = isInWishlist(product.id);
            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 35 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.08 }}
                className="flex flex-col text-left group cursor-pointer"
                onClick={() => handleProductClick(product)}
              >
                
                {/* Visual Canvas (Aspect Ratio 4/5) */}
                <div className="w-full aspect-[4/5] bg-brand-white border border-brand-border/50 rounded-2xl p-6 relative flex items-center justify-center overflow-hidden hover:shadow-md transition-shadow">
                  
                  {/* Product Silhouette */}
                  <div className="w-full h-full transform group-hover:scale-103 transition-transform duration-500">
                    <ProductVisual
                      type={product.visualType}
                      color={product.visualColor}
                      pattern={product.visualPattern}
                    />
                  </div>

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 flex flex-col gap-1">
                    <span className="text-[8px] bg-brand-sale text-brand-warmWhite font-extrabold tracking-widest px-2 py-0.5 rounded">
                      {product.discount}% OFF
                    </span>
                  </div>

                  {/* Wishlist Icon Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Stop click modal
                      toggleWishlist(product);
                    }}
                    className={`absolute top-3 right-3 p-2 rounded-full border transition-all ${
                      inWishlist
                        ? 'bg-brand-blush border-brand-dustyRose text-brand-dustyRose'
                        : 'bg-brand-warmWhite/80 border-brand-border/60 text-brand-warmGray hover:bg-brand-white'
                    }`}
                    aria-label="Add to Wishlist"
                  >
                    <Heart className={`w-3.5 h-3.5 ${inWishlist ? 'fill-brand-dustyRose' : ''}`} />
                  </button>

                  {/* Quick add bag button on hover */}
                  <div className="absolute bottom-3 right-3 translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(product, 1, 'Free Size');
                      }}
                      className="p-2.5 bg-brand-espresso text-brand-white rounded-full hover:bg-brand-espresso/90 shadow-md transition-colors"
                      aria-label="Quick Add to Bag"
                    >
                      <ShoppingBag className="w-4 h-4" />
                    </button>
                  </div>

                </div>

                {/* Meta details */}
                <div className="mt-3 space-y-1">
                  <span className="text-[9px] text-brand-warmGray font-bold tracking-widest uppercase">
                    {product.category}
                  </span>
                  
                  <h3 className="font-display font-bold text-sm text-brand-espresso leading-snug group-hover:text-brand-dustyRose transition-colors line-clamp-1">
                    {product.name}
                  </h3>
                  
                  {/* Prices */}
                  <div className="flex items-center space-x-2.5 pt-0.5">
                    <span className="text-xs font-bold text-brand-espresso">
                      ₹{product.price.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[10px] text-brand-warmGray line-through font-semibold">
                      ₹{product.mrp.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
