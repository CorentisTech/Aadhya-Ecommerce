import React from 'react';

export const Marquee: React.FC = () => {
  const marqueeText = "BEST SELLERS ✦ AADHYA EDIT ✦ NEW ARRIVALS ✦ SHOP THE LOOK ✦ COINS & NOTES ✦ ";
  const repeatedText = Array(12).fill(marqueeText).join("");

  return (
    <div className="w-full max-w-full overflow-hidden relative z-20 select-none bg-[#F26A2E] py-3 md:py-4 border-y border-[#E0591D] rounded-none">
      <div className="flex whitespace-nowrap group cursor-pointer overflow-hidden">
        <div className="animate-marquee-slow flex whitespace-nowrap group-hover:[animation-play-state:paused] ease-linear">
          <span className="text-brand-white font-sans text-[10px] md:text-sm font-extrabold tracking-[0.25em] uppercase">
            {repeatedText}
          </span>
        </div>
      </div>
    </div>
  );
};
