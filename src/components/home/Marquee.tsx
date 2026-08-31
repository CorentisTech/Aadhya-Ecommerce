import React from 'react';

export const Marquee: React.FC = () => {
  const marqueeText = "BEST SELLERS ✦ AADHYA EDIT ✦ NEW ARRIVALS ✦ SHOP THE LOOK ✦ ";
  const repeatedText = Array(15).fill(marqueeText).join("");

  return (
    <div className="w-full max-w-full overflow-hidden relative z-20 select-none -mt-6 md:-mt-10 py-1">
      <div className="w-[102%] -ml-[1%] bg-[#F26A2E] py-2 md:py-3.5 shadow-sm transform -rotate-2 md:-rotate-1 overflow-hidden">
        <div className="flex whitespace-nowrap group cursor-pointer">
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
