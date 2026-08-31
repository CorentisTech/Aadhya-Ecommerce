"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Home } from 'lucide-react';

interface NavigationControlsProps {
  showBack?: boolean;
  showHome?: boolean;
  className?: string;
}

export const NavigationControls: React.FC<NavigationControlsProps> = ({
  showBack = true,
  showHome = true,
  className = ''
}) => {
  const router = useRouter();

  const handleBack = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back();
    } else {
      router.push('/');
    }
  };

  const handleHome = () => {
    router.push('/');
  };

  return (
    <div className={`flex items-center gap-3 text-xs font-bold tracking-widest text-brand-warmGray uppercase select-none py-2 ${className}`}>
      {showBack && (
        <button
          type="button"
          onClick={handleBack}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-brand-border/60 hover:border-brand-espresso hover:text-brand-espresso transition-colors bg-brand-white/80 shadow-xs active:scale-95"
          aria-label="Go Back"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-[#F26A2E]" />
          <span>Back</span>
        </button>
      )}

      {showHome && (
        <button
          type="button"
          onClick={handleHome}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-brand-border/60 hover:border-brand-espresso hover:text-brand-espresso transition-colors bg-brand-white/80 shadow-xs active:scale-95 text-[10px]"
          aria-label="Back to Home"
        >
          <Home className="w-3.5 h-3.5 text-brand-warmGray" />
          <span>Back to Home</span>
        </button>
      )}
    </div>
  );
};
