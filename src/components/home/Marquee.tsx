"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export const Marquee: React.FC = () => {
  const [marqueeItems, setMarqueeItems] = useState<string[]>([
    "SUSTAINABLE FASHION",
    "EASY 7-DAY RETURNS",
    "NATURALLY SOURCED FABRICS",
    "FREE SHIPPING ABOVE ₹2,999",
    "HANDCRAFTED WITH LUXURY",
    "100% ARTISANAL AUTHENTICITY",
    "ETHICAL CRAFTSMANSHIP",
    "TIMELESS INDIAN SILHOUETTES"
  ]);

  const [isVisible, setIsVisible] = useState(true);

  // Fetch marquee strip messages from DB
  useEffect(() => {
    const fetchMarquee = async () => {
      try {
        const res = await fetch('/api/strips?department=fashion&type=marquee');
        const data = await res.json();
        if (data.success && data.strips) {
          if (data.strips.length === 0) {
            setIsVisible(false);
            return;
          }
          const strip = data.strips[0];
          if (!strip.is_active) {
            setIsVisible(false);
            return;
          }
          const content = typeof strip.text_content === 'string' ? JSON.parse(strip.text_content) : strip.text_content;
          if (Array.isArray(content) && content.length > 0) {
            setMarqueeItems(content);
            setIsVisible(true);
          } else {
            setIsVisible(false);
          }
        }
      } catch {}
    };
    fetchMarquee();
  }, []);

  if (!isVisible || marqueeItems.length === 0) return null;

  // Repeat for continuous seamless loop
  const repeatedItems = [...marqueeItems, ...marqueeItems, ...marqueeItems];

  return (
    <div className="w-full max-w-full overflow-hidden relative z-20 select-none bg-[#001F3D] py-3 md:py-3.5 border-y border-[#001428]">
      <div className="flex whitespace-nowrap overflow-hidden">
        <motion.div
          animate={{ x: ['0%', '-50%'] }}
          transition={{
            repeat: Infinity,
            repeatType: 'loop',
            duration: 28,
            ease: 'linear'
          }}
          className="flex items-center space-x-6 sm:space-x-8 whitespace-nowrap will-change-transform"
        >
          {repeatedItems.map((item, idx) => (
            <div key={idx} className="flex items-center space-x-6 sm:space-x-8">
              <span className="text-[#F7F4EE] font-sans text-[11px] sm:text-xs md:text-sm font-bold tracking-[0.25em] uppercase">
                {item}
              </span>
              <span className="text-[#C89B5C] text-xs sm:text-sm select-none">
                ✦
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};
