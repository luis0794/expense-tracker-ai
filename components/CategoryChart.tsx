'use client';

import React from 'react';
import { useExpenses } from '@/lib/ExpenseContext';
import { formatCurrency } from '@/utils/formatters';
import { ExpenseCategory } from '@/types/expense';

const categoryColors: Record<ExpenseCategory, string> = {
  Food: '#f97316',
  Transportation: '#3b82f6',
  Entertainment: '#a855f7',
  Shopping: '#ec4899',
  Bills: '#ef4444',
  Other: '#6b7280',
};

export default function CategoryChart() {
  const { summary, expenses } = useExpenses();

  const chartData = Object.entries(summary.categoryTotals)
    .map(([category, amount]) => ({
      category: category as ExpenseCategory,
      amount,
      percentage: summary.totalExpenses > 0 ? (amount / summary.totalExpenses) * 100 : 0,
    }))
    .filter(item => item.amount > 0)
    .sort((a, b) => b.amount - a.amount);

  if (expenses.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <div className="text-6xl mb-4">📈</div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">No data to display</h3>
        <p className="text-gray-500">Add some expenses to see spending patterns</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-6">Spending by Category</h2>

      <div className="space-y-4">
        {chartData.map(({ category, amount, percentage }) => (
          <div key={category}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">{category}</span>
              <div className="text-right">
                <span className="text-sm font-bold text-gray-900">
                  {formatCurrency(amount)}
                </span>
                <span className="text-xs text-gray-500 ml-2">({percentage.toFixed(1)}%)</span>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500 ease-out"
                style={{
                  width: `${percentage}%`,
                  backgroundColor: categoryColors[category],
                }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold text-gray-700">Total</span>
          <span className="text-lg font-bold text-gray-900">
            {formatCurrency(summary.totalExpenses)}
          </span>
        </div>
      </div>
    </div>
  );
}
