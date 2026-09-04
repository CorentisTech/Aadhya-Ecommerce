"use client";

import React, { useState, useRef, useEffect } from 'react';

interface ZoomableImageProps {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  aspectRatio?: string;
  showHint?: boolean;
  hintText?: string;
  onClick?: (e: React.MouseEvent) => void;
  children?: React.ReactNode;
}

export const ZoomableImage: React.FC<ZoomableImageProps> = ({
  src,
  alt,
  className = '',
  imgClassName = '',
  aspectRatio = 'aspect-[3/4]',
  showHint = true,
  hintText = 'Press & hold to zoom',
  onClick,
  children
}) => {
  const [isZoomed, setIsZoomed] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const isHoldingRef = useRef(false);

  const startHold = (e: React.SyntheticEvent) => {
    isHoldingRef.current = false;
    if (timerRef.current) clearTimeout(timerRef.current);
    
    timerRef.current = setTimeout(() => {
      isHoldingRef.current = true;
      setIsZoomed(true);
    }, 180);
  };

  const endHold = (e: React.MouseEvent | React.TouchEvent) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    
    if (isZoomed) {
      setIsZoomed(false);
      // Suppress click trigger if user was holding to zoom
      e.stopPropagation();
    } else if (!isHoldingRef.current && onClick) {
      // Execute normal tap/click if released quickly
      onClick(e as React.MouseEvent);
    }
    
    isHoldingRef.current = false;
  };

  useEffect(() => {
    setIsZoomed(false);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    isHoldingRef.current = false;
  }, [src]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <div className="flex flex-col items-center w-full">
      {/* Clipped Fixed Image Container */}
      <div 
        className={`w-full ${aspectRatio} overflow-hidden relative select-none touch-pan-y ${className}`}
        onMouseDown={startHold}
        onMouseUp={endHold}
        onMouseLeave={endHold}
        onTouchStart={startHold}
        onTouchEnd={endHold}
        onTouchCancel={endHold}
      >
        <img
          src={src}
          alt={alt}
          className={`w-full h-full object-cover pointer-events-none transition-transform duration-300 ease-out ${
            isZoomed ? 'scale-[1.38]' : 'scale-100'
          } ${imgClassName}`}
          loading="lazy"
        />

        {children}
      </div>

      {/* Subtle User Hint */}
      {showHint && (
        <span className="text-[9px] sm:text-[10px] text-brand-warmGray/80 font-medium tracking-wider mt-1 select-none pointer-events-none text-center block">
          {hintText}
        </span>
      )}
    </div>
  );
};
