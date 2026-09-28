"use client";

import React from 'react';
import { Download } from 'lucide-react';

interface ExportButtonProps {
  type: string;
  label?: string;
}

export function ExportButton({ type, label }: ExportButtonProps) {
  const handleExport = () => {
    window.open(`/api/admin/export?type=${type}`, '_blank');
  };

  return (
    <button
      onClick={handleExport}
      className="inline-flex items-center space-x-1.5 px-3 py-2 text-[10px] font-bold text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:text-black shadow-sm transition-colors uppercase tracking-wider"
      title={`Download ${label || type} as CSV`}
    >
      <Download className="w-3.5 h-3.5" />
      <span>{label || 'Export'}</span>
    </button>
  );
}
