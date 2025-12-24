'use client';

import React, { useState } from 'react';
import { useExpenses } from '@/lib/ExpenseContext';
import ExportCenter from './ExportCenter';

export default function ExportButton() {
  const { expenses } = useExpenses();
  const [isCenterOpen, setIsCenterOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsCenterOpen(true)}
        disabled={expenses.length === 0}
        className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white rounded-xl hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
          />
        </svg>
        <span className="font-bold">Export & Share</span>
        <span className="px-2 py-0.5 bg-white bg-opacity-20 rounded-full text-xs font-semibold">
          Cloud
        </span>
      </button>

      <ExportCenter isOpen={isCenterOpen} onClose={() => setIsCenterOpen(false)} />
    </>
  );
}
