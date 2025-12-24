'use client';

import React from 'react';
import { useExpenses } from '@/lib/ExpenseContext';
import { formatCurrency } from '@/utils/formatters';

export default function Dashboard() {
  const { summary, expenses } = useExpenses();

  const cards = [
    {
      title: 'Total Expenses',
      value: formatCurrency(summary.totalExpenses),
      icon: '💰',
      color: 'bg-blue-500',
      description: `${expenses.length} transaction${expenses.length !== 1 ? 's' : ''}`,
    },
    {
      title: 'This Month',
      value: formatCurrency(summary.monthlyTotal),
      icon: '📅',
      color: 'bg-green-500',
      description: 'Current month spending',
    },
    {
      title: 'Top Category',
      value: summary.topCategory ? summary.topCategory.category : 'N/A',
      icon: '🏆',
      color: 'bg-purple-500',
      description: summary.topCategory
        ? formatCurrency(summary.topCategory.amount)
        : 'No expenses yet',
    },
    {
      title: 'Average per Transaction',
      value:
        expenses.length > 0
          ? formatCurrency(summary.totalExpenses / expenses.length)
          : formatCurrency(0),
      icon: '📊',
      color: 'bg-orange-500',
      description: 'Overall average',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, index) => (
        <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className={`${card.color} p-4`}>
            <div className="flex items-center justify-between">
              <h3 className="text-white font-semibold text-sm">{card.title}</h3>
              <span className="text-2xl">{card.icon}</span>
            </div>
          </div>
          <div className="p-4">
            <p className="text-2xl font-bold text-gray-900 mb-1">{card.value}</p>
            <p className="text-sm text-gray-500">{card.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
