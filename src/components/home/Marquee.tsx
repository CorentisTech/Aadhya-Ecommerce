import React from 'react';

export const Marquee: React.FC = () => {
  const marqueeText = "✦ NEW ARRIVALS ✦ SHOP THE LOOK ✦ BEST SELLERS ✦ AADHYA EDIT ";
  const repeatedText = Array(15).fill(marqueeText).join(" ");

  return (
    <div className="w-full bg-[#E85B2A] py-3.5 overflow-hidden relative z-20 shadow-md select-none rounded-xl md:rounded-2xl mx-auto max-w-[96%] translate-y-[-10px]">
      <div className="flex whitespace-nowrap group cursor-pointer">
        <div className="animate-marquee-slow flex whitespace-nowrap group-hover:[animation-play-state:paused] ease-linear">
          <span className="text-brand-white font-sans text-xs md:text-sm font-bold tracking-[0.25em] uppercase">
            {repeatedText}
          </span>
        </div>
      </div>
    </div>
  );
};
