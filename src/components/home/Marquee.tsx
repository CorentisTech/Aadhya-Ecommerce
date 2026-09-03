import React from 'react';

export const Marquee: React.FC = () => {
  const marqueeText = "BEST SELLERS ✦ AADHYA EDIT ✦ NEW ARRIVALS ✦ SHOP THE LOOK ✦ COINS & NOTES ✦ ";
  const repeatedText = Array(12).fill(marqueeText).join("");

  return (
    <div className="w-full max-w-full overflow-hidden relative z-20 select-none py-2.5 sm:py-4">
      <div className="w-[105vw] -ml-[2.5vw] bg-[#F26A2E] py-2.5 md:py-3.5 border-y border-[#E0591D] rounded-none shadow-sm transform -rotate-2 md:-rotate-1">
        <div className="flex whitespace-nowrap group cursor-pointer overflow-hidden">
          <div className="animate-marquee-slow flex whitespace-nowrap group-hover:[animation-play-state:paused] ease-linear">
            <span className="text-brand-white font-sans text-[10px] md:text-sm font-extrabold tracking-[0.25em] uppercase">
              {repeatedText}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
