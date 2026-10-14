import React from 'react';
import Link from 'next/link';
import { ArrowLeft, RotateCcw, Sparkles } from 'lucide-react';
import { BlueMonsterCharacter } from './BlueMonsterCharacter';

interface StatusLayoutProps {
  codePrefix?: string; // e.g. "4"
  codeSuffix?: string; // e.g. "4"
  fullCode?: string;   // e.g. "404", "500", "503"
  title: string;
  subtitle: string;
  actionText?: string;
  actionHref?: string;
  onActionClick?: () => void;
  actionIcon?: 'home' | 'refresh';
  mood?: 'confused' | 'worried' | 'offline' | 'fixing';
}

export const StatusLayout: React.FC<StatusLayoutProps> = ({
  codePrefix = "4",
  codeSuffix = "4",
  fullCode,
  title,
  subtitle,
  actionText = "Back to home",
  actionHref = "/",
  onActionClick,
  actionIcon = 'home',
  mood = 'confused',
}) => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-3 sm:p-6 md:p-8 bg-[#E6EFF6] select-none">
      {/* Sky Blue Container Card matching Image 4 Reference */}
      <div className="relative w-full max-w-4xl min-h-[580px] sm:min-h-[640px] md:min-h-[680px] rounded-[28px] sm:rounded-[36px] bg-gradient-to-b from-[#81BAE8] via-[#9DC8EC] to-[#C0DEF6] shadow-2xl shadow-blue-900/10 border border-white/60 p-6 sm:p-10 flex flex-col justify-between items-center overflow-hidden">
        
        {/* Soft Background Clouds matching Reference Image */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
          {/* Cloud 1 Top-Left */}
          <div className="absolute -top-10 -left-12 w-64 sm:w-80 h-36 bg-white/40 rounded-full blur-2xl" />
          {/* Cloud 2 Top-Right */}
          <div className="absolute top-10 -right-16 w-72 sm:w-96 h-40 bg-white/35 rounded-full blur-2xl" />
          {/* Cloud 3 Center-Left */}
          <div className="absolute top-1/3 -left-20 w-80 h-44 bg-white/30 rounded-full blur-2xl" />
          {/* Cloud 4 Center-Right */}
          <div className="absolute top-1/2 -right-10 w-80 h-44 bg-white/35 rounded-full blur-2xl" />
          {/* Cloud 5 Bottom */}
          <div className="absolute -bottom-16 left-1/4 w-[500px] h-48 bg-white/50 rounded-full blur-3xl" />
        </div>

        {/* Top Bar: Brand (Left) + Log In (Right) */}
        <div className="relative z-20 w-full flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center space-x-1.5 text-white/95 hover:text-white transition-opacity font-bold text-base sm:text-lg tracking-wide drop-shadow-xs"
          >
            <Sparkles className="w-4 h-4 fill-white text-white" />
            <span className="font-serif tracking-widest uppercase">AADHYA</span>
          </Link>

          <Link
            href="/account"
            className="px-4 py-1.5 rounded-xl border border-white/70 bg-white/40 hover:bg-white/70 text-xs font-bold text-[#1E293B] shadow-2xs transition-all backdrop-blur-xs"
          >
            Log In
          </Link>
        </div>

        {/* Center Stage: Giant 3D Numbers + Blue Monster */}
        <div className="relative z-10 w-full flex flex-col items-center justify-center my-auto py-4">
          <div className="relative flex items-center justify-center">
            
            {/* Giant White Digits (Behind & Beside Character) */}
            <div className="flex items-center justify-center select-none pointer-events-none">
              <span className="text-[130px] xs:text-[160px] sm:text-[210px] md:text-[260px] font-black text-white/90 leading-none tracking-tighter drop-shadow-sm -mr-6 sm:-mr-12 md:-mr-16">
                {codePrefix}
              </span>

              {/* Monster Character (Standing in Center) */}
              <div className="relative z-10 mx-[-15px] sm:mx-[-25px]">
                <BlueMonsterCharacter mood={mood} className="w-36 h-48 sm:w-48 sm:h-64 md:w-56 md:h-72" />
              </div>

              <span className="text-[130px] xs:text-[160px] sm:text-[210px] md:text-[260px] font-black text-white/90 leading-none tracking-tighter drop-shadow-sm -ml-6 sm:-ml-12 md:-ml-16">
                {codeSuffix}
              </span>
            </div>

          </div>

          {/* Heading & Subtitle (matching reference image typography) */}
          <div className="text-center mt-3 sm:mt-5 max-w-md px-4">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-[#1E293B] tracking-tight">
              {title}
            </h1>
            <p className="mt-1.5 text-xs sm:text-sm text-[#475569] font-medium leading-relaxed">
              {subtitle}
            </p>
          </div>

          {/* Clean Pill Button (matching reference image: Back to home) */}
          <div className="mt-5 sm:mt-6">
            {onActionClick ? (
              <button
                onClick={onActionClick}
                className="px-5 py-2 sm:px-6 sm:py-2.5 bg-white border border-[#CBD5E1] shadow-md shadow-blue-950/5 rounded-full text-xs sm:text-sm font-bold text-[#1E293B] hover:bg-slate-50 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center space-x-2 cursor-pointer"
              >
                {actionIcon === 'refresh' ? (
                  <RotateCcw className="w-3.5 h-3.5 stroke-[2.2]" />
                ) : (
                  <ArrowLeft className="w-3.5 h-3.5 stroke-[2.2]" />
                )}
                <span>{actionText}</span>
              </button>
            ) : (
              <Link
                href={actionHref}
                className="px-5 py-2 sm:px-6 sm:py-2.5 bg-white border border-[#CBD5E1] shadow-md shadow-blue-950/5 rounded-full text-xs sm:text-sm font-bold text-[#1E293B] hover:bg-slate-50 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center space-x-2"
              >
                {actionIcon === 'refresh' ? (
                  <RotateCcw className="w-3.5 h-3.5 stroke-[2.2]" />
                ) : (
                  <ArrowLeft className="w-3.5 h-3.5 stroke-[2.2]" />
                )}
                <span>{actionText}</span>
              </Link>
            )}
          </div>
        </div>

        {/* Bottom subtle space */}
        <div className="relative z-10 text-[10px] text-white/60 font-medium">
          © AADHYA Storefront Systems
        </div>

      </div>
    </div>
  );
};
