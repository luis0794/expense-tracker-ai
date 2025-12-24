export type ExpenseCategory =
  | 'Food'
  | 'Transportation'
  | 'Entertainment'
  | 'Shopping'
  | 'Bills'
  | 'Other';

export interface Expense {
  id: string;
  amount: number;
  category: ExpenseCategory;
  description: string;
  date: string;
  createdAt: string;
}

export interface ExpenseFormData {
  amount: string;
  category: ExpenseCategory;
  description: string;
  date: string;
}

export interface ExpenseFilters {
  category: ExpenseCategory | 'All';
  startDate: string;
  endDate: string;
  searchQuery: string;
}

export interface ExpenseSummary {
  totalExpenses: number;
  monthlyTotal: number;
  categoryTotals: Record<ExpenseCategory, number>;
  topCategory: {
    category: ExpenseCategory;
    amount: number;
  } | null;
}
