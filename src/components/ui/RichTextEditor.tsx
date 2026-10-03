"use client";

import React, { useMemo } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill-new'), { 
  ssr: false,
  loading: () => <div className="w-full h-48 bg-gray-50 border border-gray-200 rounded-xl animate-pulse flex items-center justify-center text-xs text-gray-400">Loading editor...</div>
});

import 'react-quill-new/dist/quill.snow.css';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  label: string;
  placeholder?: string;
  minHeight?: string;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({ 
  value, 
  onChange, 
  label, 
  placeholder = 'Start writing...',
  minHeight = '200px'
}) => {
  const modules = useMemo(() => ({
    toolbar: [
      [{ 'header': [1, 2, 3, 4, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'indent': '-1' }, { 'indent': '+1' }],
      [{ 'align': [] }],
      ['link'],
      ['blockquote'],
      ['clean']
    ],
  }), []);

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list',
    'indent',
    'align',
    'link',
    'blockquote'
  ];

  return (
    <div className="space-y-1.5">
      <label className="text-[10px] font-bold text-gray-600 uppercase block">{label}</label>
      <div className="admin-rich-editor rounded-xl overflow-hidden border border-gray-200 bg-white">
        <ReactQuill
          theme="snow"
          value={value}
          onChange={onChange}
          modules={modules}
          formats={formats}
          placeholder={placeholder}
          style={{ minHeight }}
        />
      </div>
      <style jsx global>{`
        .admin-rich-editor .ql-toolbar {
          border: none !important;
          border-bottom: 1px solid #e5e7eb !important;
          background: #f9fafb;
          padding: 8px 12px !important;
        }
        .admin-rich-editor .ql-container {
          border: none !important;
          font-family: inherit;
          font-size: 13px;
          min-height: ${minHeight};
        }
        .admin-rich-editor .ql-editor {
          min-height: ${minHeight};
          padding: 16px 20px;
          line-height: 1.8;
          color: #1f2937;
        }
        .admin-rich-editor .ql-editor h1 {
          font-size: 1.5em;
          font-weight: 800;
          margin-bottom: 0.5em;
          color: #111;
        }
        .admin-rich-editor .ql-editor h2 {
          font-size: 1.25em;
          font-weight: 700;
          margin-bottom: 0.5em;
          color: #111;
        }
        .admin-rich-editor .ql-editor h3 {
          font-size: 1.1em;
          font-weight: 700;
          margin-bottom: 0.4em;
          color: #222;
        }
        .admin-rich-editor .ql-editor ul,
        .admin-rich-editor .ql-editor ol {
          padding-left: 1.5em;
          margin-bottom: 0.75em;
        }
        .admin-rich-editor .ql-editor li {
          margin-bottom: 0.3em;
        }
        .admin-rich-editor .ql-editor p {
          margin-bottom: 0.75em;
        }
        .admin-rich-editor .ql-editor blockquote {
          border-left: 4px solid #cca05b;
          padding-left: 1em;
          color: #6b7280;
          font-style: italic;
          margin: 1em 0;
        }
        .admin-rich-editor .ql-editor a {
          color: #F26A2E;
          text-decoration: underline;
        }
        .admin-rich-editor .ql-snow .ql-picker {
          font-size: 12px;
        }
        .admin-rich-editor .ql-snow button {
          width: 28px !important;
          height: 28px !important;
        }
        [data-theme="dark"] .admin-rich-editor .ql-toolbar {
          background: #1e1e2e;
          border-bottom-color: #333 !important;
        }
        [data-theme="dark"] .admin-rich-editor .ql-container {
          background: #15171c;
        }
        [data-theme="dark"] .admin-rich-editor .ql-editor {
          color: #e5e7eb;
        }
        [data-theme="dark"] .admin-rich-editor .ql-snow .ql-stroke {
          stroke: #9ca3af;
        }
        [data-theme="dark"] .admin-rich-editor .ql-snow .ql-fill {
          fill: #9ca3af;
        }
        [data-theme="dark"] .admin-rich-editor .ql-snow .ql-picker-label {
          color: #9ca3af;
        }
      `}</style>
    </div>
  );
};
