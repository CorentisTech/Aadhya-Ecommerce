"use client";

import React from 'react';
import DOMPurify from 'isomorphic-dompurify';
import { ShieldCheck } from 'lucide-react';

interface PolicyPageProps {
  title: string;
  subtitle: string;
  content: string;
}

export function PolicyPage({ title, subtitle, content }: PolicyPageProps) {
  // Sanitize the HTML content provided by the admin editor
  const sanitizedContent = DOMPurify.sanitize(content || '<p>Content is being updated. Please check back later.</p>', {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'u', 's', 'a', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'br', 'span', 'div', 'blockquote', 'pre', 'code', 'sub', 'sup', 'hr', 'img'],
    ALLOWED_ATTR: ['href', 'target', 'rel', 'class', 'style', 'src', 'alt', 'width', 'height']
  });

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#181818] pt-24 pb-20 px-4 sm:px-6 md:px-12 flex flex-col items-center">
      <div className="w-full max-w-4xl space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <ShieldCheck className="w-12 h-12 text-[#7A6B5C] mx-auto opacity-80" />
          <h1 className="font-serif font-black text-3xl md:text-5xl text-[#181818] tracking-tight">
            {title}
          </h1>
          <p className="text-sm text-[#7A6B5C] font-semibold tracking-wide max-w-xl mx-auto uppercase">
            {subtitle}
          </p>
        </div>

        {/* Content Box */}
        <div className="bg-white border border-[#EFE6DA] shadow-sm rounded-3xl p-6 sm:p-10 md:p-16 overflow-hidden max-w-full">
          <div 
            className="prose prose-sm md:prose-base prose-stone max-w-none break-words overflow-hidden [&_*]:break-words w-full
              prose-headings:font-serif prose-headings:font-bold prose-headings:text-[#181818]
              prose-a:text-[#F26A2E] prose-a:font-semibold hover:prose-a:text-[#cca05b]
              prose-p:text-gray-600 prose-p:leading-relaxed prose-p:whitespace-pre-wrap
              prose-li:text-gray-600 prose-li:leading-relaxed"
            dangerouslySetInnerHTML={{ __html: sanitizedContent }}
          />
        </div>
        
      </div>
    </div>
  );
}
