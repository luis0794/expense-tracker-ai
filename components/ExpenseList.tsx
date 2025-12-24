'use client';

import React, { useState } from 'react';
import { useExpenses } from '@/lib/ExpenseContext';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { ExpenseCategory, ExpenseFormData } from '@/types/expense';

interface ExpenseListProps {
  onEdit: (id: string, data: ExpenseFormData) => void;
}

const categoryColors: Record<ExpenseCategory, string> = {
  Food: 'bg-orange-100 text-orange-800',
  Transportation: 'bg-blue-100 text-blue-800',
  Entertainment: 'bg-purple-100 text-purple-800',
  Shopping: 'bg-pink-100 text-pink-800',
  Bills: 'bg-red-100 text-red-800',
  Other: 'bg-gray-100 text-gray-800',
};

const categoryIcons: Record<ExpenseCategory, string> = {
  Food: '🍽️',
  Transportation: '🚗',
  Entertainment: '🎬',
  Shopping: '🛍️',
  Bills: '📄',
  Other: '📌',
};

export default function ExpenseList({ onEdit }: ExpenseListProps) {
  const { filteredExpenses, deleteExpense } = useExpenses();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      setDeletingId(id);
      setTimeout(() => {
        deleteExpense(id);
        setDeletingId(null);
      }, 200);
    }
  };

  const handleEdit = (id: string) => {
    const expense = filteredExpenses.find(e => e.id === id);
    if (expense) {
      onEdit(id, {
        amount: expense.amount.toString(),
        category: expense.category,
        description: expense.description,
        date: expense.date,
      });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (filteredExpenses.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <div className="text-6xl mb-4">📊</div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">No expenses found</h3>
        <p className="text-gray-500">
          Start tracking your expenses by adding your first entry above
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-800">
          Recent Expenses ({filteredExpenses.length})
        </h2>
      </div>

      <div className="divide-y divide-gray-200">
        {filteredExpenses.map(expense => (
          <div
            key={expense.id}
            className={`p-4 hover:bg-gray-50 transition-all ${
              deletingId === expense.id ? 'opacity-50 scale-95' : 'opacity-100 scale-100'
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <span className="text-2xl mt-1 flex-shrink-0">
                  {categoryIcons[expense.category]}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-gray-900 truncate">
                      {expense.description}
                    </h3>
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        categoryColors[expense.category]
                      } flex-shrink-0`}
                    >
                      {expense.category}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">{formatDate(expense.date)}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 flex-shrink-0">
                <span className="text-lg font-bold text-gray-900">
                  {formatCurrency(expense.amount)}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(expense.id)}
                    className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                    title="Edit expense"
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
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDelete(expense.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete expense"
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
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
