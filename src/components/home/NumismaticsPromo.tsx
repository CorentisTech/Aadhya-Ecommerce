"use client";

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ProductVisual } from '../ui/ProductVisual';
import { ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export const NumismaticsPromo: React.FC = () => {
  const { setPage } = useApp();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <section className="w-full max-w-full py-20 px-6 md:px-12 lg:px-24 bg-brand-softBeige/40 border-t border-b border-brand-border/60 overflow-hidden relative">
      
      {/* Background Subtle Highlights */}
      <div className="absolute top-1/2 left-0 w-96 h-96 rounded-full bg-brand-antiqueBronze/5 blur-3xl pointer-events-none" />
      
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
        
        {/* Left Side: Editorial Invites & Marketing Copy (7 cols) */}
        <div className="lg:col-span-7 space-y-6 text-center lg:text-left flex flex-col items-center lg:items-start">
          
          <div className="flex items-center space-x-2 px-3 py-1 bg-brand-antiqueBronze/10 text-brand-antiqueBronze border border-brand-antiqueBronze/20 rounded-full text-[9px] font-extrabold tracking-[0.25em] uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            <span>BEYOND FASHION</span>
          </div>

          <h2 className="font-display font-bold text-4xl md:text-5xl text-brand-espresso tracking-wide leading-tight uppercase max-w-lg">
            THE COLLECTOR'S EDIT
          </h2>

          <p className="text-xs md:text-sm text-brand-warmGray leading-relaxed font-semibold tracking-wider max-w-md">
            From historic Indian silver coinage minted under royal dynasties to rare paper currency notes preserved through time, explore authentic objects that carry Indian heritage through generations.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center gap-4 pt-4 w-full sm:w-auto">
            <button
              onClick={() => setPage('numismatics')}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              className="w-full sm:w-auto py-3.5 px-8 bg-brand-espresso text-brand-white text-xs font-bold tracking-[0.2em] uppercase hover:bg-brand-espresso/90 transition-colors shadow-lg flex items-center justify-center gap-2 rounded-xl border border-brand-espresso"
            >
              <span>EXPLORE NUMISMATICS</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setPage('numismatics')}
              className="w-full sm:w-auto py-3.5 px-8 border border-brand-antiqueBronze text-brand-antiqueBronze text-xs font-bold tracking-[0.2em] uppercase hover:bg-brand-softBeige transition-colors flex items-center justify-center gap-2 rounded-xl"
            >
              <span>VIEW COINS & NOTES</span>
            </button>
          </div>

        </div>

        {/* Right Side: Large 3D Coin Visualizer (5 cols) */}
        <div 
          className="lg:col-span-5 flex justify-center items-center"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="relative w-64 h-64 md:w-80 md:h-80 flex items-center justify-center perspective-1000 preserve-3d">
            
            {/* Spinning Coin halo/shadow */}
            <div className="absolute w-[90%] h-[90%] rounded-full bg-brand-gold/5 blur-3xl pointer-events-none transition-all duration-500 scale-105" 
              style={{
                opacity: isHovered ? 0.7 : 0.3
              }}
            />

            <motion.div
              animate={{ 
                rotateY: 360,
                scale: isHovered ? 1.05 : 1
              }}
              transition={{
                rotateY: {
                  repeat: Infinity,
                  duration: isHovered ? 3.5 : 8,
                  ease: 'linear'
                },
                scale: {
                  duration: 0.3
                }
              }}
              className="w-full h-full preserve-3d flex items-center justify-center cursor-pointer"
              onClick={() => setPage('numismatics')}
            >
              <ProductVisual
                type="coin"
                pattern="antique-metallic"
                color="#B89A67"
                className="w-full h-full"
              />
            </motion.div>

          </div>
        </div>

      </div>

    </section>
  );
};
