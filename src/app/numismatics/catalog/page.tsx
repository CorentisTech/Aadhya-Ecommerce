"use client";

import React, { Suspense } from 'react';
import CatalogContent from '@/components/catalog/CatalogContent';

export default function NumismaticsCatalogPage() {
  return (
    <Suspense fallback={<div className="w-full min-h-screen bg-[#FDF9F3] flex items-center justify-center font-bold text-xs text-[#2B231D] tracking-widest uppercase">Loading Numismatics Archive...</div>}>
      <CatalogContent defaultDepartment="numismatics" />
    </Suspense>
  );
}
