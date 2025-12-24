'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Expense, ExpenseFormData, ExpenseFilters, ExpenseSummary } from '@/types/expense';
import { loadExpensesFromStorage, saveExpensesToStorage } from '@/utils/localStorage';
import { v4 as uuidv4 } from 'uuid';

interface ExpenseContextType {
  expenses: Expense[];
  filteredExpenses: Expense[];
  filters: ExpenseFilters;
  summary: ExpenseSummary;
  addExpense: (expenseData: ExpenseFormData) => void;
  updateExpense: (id: string, expenseData: ExpenseFormData) => void;
  deleteExpense: (id: string) => void;
  setFilters: (filters: Partial<ExpenseFilters>) => void;
  resetFilters: () => void;
  isLoading: boolean;
}

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

const defaultFilters: ExpenseFilters = {
  category: 'All',
  startDate: '',
  endDate: '',
  searchQuery: '',
};

export const ExpenseProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [filters, setFiltersState] = useState<ExpenseFilters>(defaultFilters);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadedExpenses = loadExpensesFromStorage();
    setExpenses(loadedExpenses);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (!isLoading) {
      saveExpensesToStorage(expenses);
    }
  }, [expenses, isLoading]);

  const addExpense = (expenseData: ExpenseFormData) => {
    const newExpense: Expense = {
      id: uuidv4(),
      amount: parseFloat(expenseData.amount),
      category: expenseData.category,
      description: expenseData.description,
      date: expenseData.date,
      createdAt: new Date().toISOString(),
    };
    setExpenses(prev => [newExpense, ...prev]);
  };

  const updateExpense = (id: string, expenseData: ExpenseFormData) => {
    setExpenses(prev =>
      prev.map(expense =>
        expense.id === id
          ? {
              ...expense,
              amount: parseFloat(expenseData.amount),
              category: expenseData.category,
              description: expenseData.description,
              date: expenseData.date,
            }
          : expense
      )
    );
  };

  const deleteExpense = (id: string) => {
    setExpenses(prev => prev.filter(expense => expense.id !== id));
  };

  const setFilters = (newFilters: Partial<ExpenseFilters>) => {
    setFiltersState(prev => ({ ...prev, ...newFilters }));
  };

  const resetFilters = () => {
    setFiltersState(defaultFilters);
  };

  const filteredExpenses = expenses.filter(expense => {
    if (filters.category !== 'All' && expense.category !== filters.category) {
      return false;
    }

    if (filters.startDate && expense.date < filters.startDate) {
      return false;
    }

    if (filters.endDate && expense.date > filters.endDate) {
      return false;
    }

    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      return (
        expense.description.toLowerCase().includes(query) ||
        expense.category.toLowerCase().includes(query)
      );
    }

    return true;
  });

  const summary: ExpenseSummary = React.useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const categoryTotals = expenses.reduce(
      (acc, expense) => {
        acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
        return acc;
      },
      {} as Record<string, number>
    );

    const monthlyTotal = expenses
      .filter(expense => {
        const expenseDate = new Date(expense.date);
        return (
          expenseDate.getMonth() === currentMonth &&
          expenseDate.getFullYear() === currentYear
        );
      })
      .reduce((sum, expense) => sum + expense.amount, 0);

    const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);

    let topCategory = null;
    if (Object.keys(categoryTotals).length > 0) {
      const [category, amount] = Object.entries(categoryTotals).reduce((a, b) =>
        a[1] > b[1] ? a : b
      );
      topCategory = { category: category as any, amount };
    }

    return {
      totalExpenses,
      monthlyTotal,
      categoryTotals: categoryTotals as any,
      topCategory,
    };
  }, [expenses]);

  return (
    <ExpenseContext.Provider
      value={{
        expenses,
        filteredExpenses,
        filters,
        summary,
        addExpense,
        updateExpense,
        deleteExpense,
        setFilters,
        resetFilters,
        isLoading,
      }}
    >
      {children}
    </ExpenseContext.Provider>
  );
};

export const useExpenses = () => {
  const context = useContext(ExpenseContext);
  if (context === undefined) {
    throw new Error('useExpenses must be used within an ExpenseProvider');
  }
  return context;
};
