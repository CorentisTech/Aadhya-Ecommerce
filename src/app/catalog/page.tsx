"use client";

import React, { Suspense } from 'react';
import CatalogContent from '@/components/catalog/CatalogContent';

export default function CatalogPage() {
  return (
    <Suspense fallback={<div className="w-full min-h-screen bg-[#FDF9F3] flex items-center justify-center font-bold text-xs text-brand-espresso tracking-widest uppercase">Loading Catalogue...</div>}>
      <CatalogContent defaultDepartment="fashion" />
    </Suspense>
  );
}
