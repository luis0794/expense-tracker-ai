import { Expense } from '@/types/expense';
import { formatCurrency, formatDate } from './formatters';

export const exportToCSV = (expenses: Expense[]): void => {
  if (expenses.length === 0) {
    alert('No expenses to export');
    return;
  }

  const headers = ['Date', 'Category', 'Description', 'Amount'];
  const csvContent = [
    headers.join(','),
    ...expenses.map(expense => [
      formatDate(expense.date),
      expense.category,
      `"${expense.description.replace(/"/g, '""')}"`,
      expense.amount.toFixed(2),
    ].join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', `expenses_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
