import React from 'react';

export const Marquee: React.FC = () => {
  const marqueeText = "NEW ARRIVALS ✦ SHOP THE LOOK ✦ BESTSELLERS ✦ ";
  const repeatedText = Array(12).fill(marqueeText).join("");

  return (
    <div className="w-full bg-brand-sale py-4 overflow-hidden relative z-20 shadow-md select-none transform -rotate-1 md:-rotate-0.5 translate-y-[-10px]">
      <div 
        className="flex whitespace-nowrap group cursor-pointer"
      >
        <div className="animate-marquee-slow flex whitespace-nowrap group-hover:[animation-play-state:paused]">
          <span className="text-brand-warmWhite font-display text-sm md:text-lg font-bold tracking-[0.25em] uppercase">
            {repeatedText}
          </span>
        </div>
      </div>
    </div>
  );
};
