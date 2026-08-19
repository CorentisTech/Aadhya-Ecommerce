import React from 'react';

export const Marquee: React.FC = () => {
  const marqueeText = "BEST SELLERS ✦ AADHYA EDIT ✦ NEW ARRIVALS ✦ SHOP THE LOOK ✦ ";
  const repeatedText = Array(15).fill(marqueeText).join("");

  return (
    <div className="w-full bg-[#F4511E] py-4 overflow-hidden relative z-20 shadow-sm select-none">
      <div className="flex whitespace-nowrap group cursor-pointer">
        <div className="animate-marquee-slow flex whitespace-nowrap group-hover:[animation-play-state:paused] ease-linear">
          <span className="text-brand-white font-sans text-xs md:text-sm font-extrabold tracking-[0.25em] uppercase">
            {repeatedText}
          </span>
        </div>
      </div>
    </div>
  );
};
