import React from 'react';

export const Marquee: React.FC = () => {
  const marqueeText = "BEST SELLERS ✦ AADHYA EDIT ✦ NEW ARRIVALS ✦ SHOP THE LOOK ✦ ";
  const repeatedText = Array(15).fill(marqueeText).join("");

  return (
    <div className="w-[105vw] -ml-[2.5vw] bg-[#F4511E] py-2 md:py-3.5 overflow-hidden relative z-20 shadow-sm select-none transform -rotate-2 md:-rotate-1 hover:rotate-0 transition-all duration-300">
      <div className="flex whitespace-nowrap group cursor-pointer">
        <div className="animate-marquee-slow flex whitespace-nowrap group-hover:[animation-play-state:paused] ease-linear">
          <span className="text-brand-white font-sans text-[10px] md:text-sm font-extrabold tracking-[0.25em] uppercase">
            {repeatedText}
          </span>
        </div>
      </div>
    </div>
  );
};
