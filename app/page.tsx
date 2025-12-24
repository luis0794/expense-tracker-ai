'use client';

import { useState } from 'react';
import Dashboard from '@/components/Dashboard';
import ExpenseForm from '@/components/ExpenseForm';
import ExpenseList from '@/components/ExpenseList';
import ExpenseFilters from '@/components/ExpenseFilters';
import CategoryChart from '@/components/CategoryChart';
import ExportButton from '@/components/ExportButton';
import { ExpenseFormData } from '@/types/expense';

export default function Home() {
  const [editingExpense, setEditingExpense] = useState<{
    id: string;
    data: ExpenseFormData;
  } | null>(null);

  const handleEdit = (id: string, data: ExpenseFormData) => {
    setEditingExpense({ id, data });
  };

  const handleCancelEdit = () => {
    setEditingExpense(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Expense Tracker</h1>
              <p className="text-gray-600 mt-1">Manage your personal finances with ease</p>
            </div>
            <ExportButton />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          <Dashboard />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <ExpenseForm editingExpense={editingExpense} onCancelEdit={handleCancelEdit} />
              <ExpenseList onEdit={handleEdit} />
            </div>

            <div className="space-y-8">
              <ExpenseFilters />
              <CategoryChart />
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-gray-600">
          <p>Expense Tracker - Track your spending, achieve your goals</p>
        </div>
      </footer>
    </div>
  );
}
