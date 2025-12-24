import { Expense } from '@/types/expense';
import {
  ExportTemplate,
  ExportHistoryItem,
  CloudProvider,
  TemplateConfig,
  ScheduledExport
} from '@/types/cloudExport';

const EXPORT_HISTORY_KEY = 'expense-export-history';
const SCHEDULED_EXPORTS_KEY = 'expense-scheduled-exports';

export const EXPORT_TEMPLATES: TemplateConfig[] = [
  {
    id: 'tax-report',
    name: 'Tax Report',
    description: 'Organized by category with totals and dates for tax filing',
    icon: '📊',
    color: 'blue',
    fields: ['Date', 'Category', 'Amount', 'Description', 'Category Total'],
    bestFor: 'Tax preparation and annual filings'
  },
  {
    id: 'monthly-summary',
    name: 'Monthly Summary',
    description: 'Aggregated data by month with spending trends',
    icon: '📅',
    color: 'purple',
    fields: ['Month', 'Total Spent', 'Top Category', 'Transaction Count'],
    bestFor: 'Budget reviews and monthly planning'
  },
  {
    id: 'category-analysis',
    name: 'Category Analysis',
    description: 'Detailed breakdown by spending categories',
    icon: '🏷️',
    color: 'green',
    fields: ['Category', 'Total', 'Average', 'Count', 'Percentage'],
    bestFor: 'Understanding spending patterns'
  },
  {
    id: 'detailed-export',
    name: 'Detailed Export',
    description: 'Complete data export with all fields and metadata',
    icon: '📋',
    color: 'gray',
    fields: ['Date', 'Category', 'Amount', 'Description', 'ID', 'Created At'],
    bestFor: 'Backup and comprehensive record keeping'
  },
  {
    id: 'budget-review',
    name: 'Budget Review',
    description: 'Weekly and monthly comparison with averages',
    icon: '💰',
    color: 'yellow',
    fields: ['Period', 'Actual', 'Average', 'Variance', 'Trend'],
    bestFor: 'Budget tracking and variance analysis'
  }
];

export const generateShareLink = (expenses: Expense[]): string => {
  const data = btoa(JSON.stringify({
    count: expenses.length,
    total: expenses.reduce((sum, e) => sum + e.amount, 0),
    timestamp: new Date().toISOString()
  }));
  return `https://expense-tracker.app/share/${data.substring(0, 16)}`;
};

export const saveExportHistory = (item: ExportHistoryItem): void => {
  const history = getExportHistory();
  history.unshift(item);
  if (history.length > 50) history.pop();
  localStorage.setItem(EXPORT_HISTORY_KEY, JSON.stringify(history));
};

export const getExportHistory = (): ExportHistoryItem[] => {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(EXPORT_HISTORY_KEY);
  return data ? JSON.parse(data) : [];
};

export const clearExportHistory = (): void => {
  localStorage.removeItem(EXPORT_HISTORY_KEY);
};

export const saveScheduledExport = (schedule: ScheduledExport): void => {
  const schedules = getScheduledExports();
  const index = schedules.findIndex(s => s.id === schedule.id);
  if (index >= 0) {
    schedules[index] = schedule;
  } else {
    schedules.push(schedule);
  }
  localStorage.setItem(SCHEDULED_EXPORTS_KEY, JSON.stringify(schedules));
};

export const getScheduledExports = (): ScheduledExport[] => {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(SCHEDULED_EXPORTS_KEY);
  return data ? JSON.parse(data) : [];
};

export const deleteScheduledExport = (id: string): void => {
  const schedules = getScheduledExports().filter(s => s.id !== id);
  localStorage.setItem(SCHEDULED_EXPORTS_KEY, JSON.stringify(schedules));
};

export const simulateCloudExport = async (
  expenses: Expense[],
  template: ExportTemplate,
  provider: CloudProvider
): Promise<ExportHistoryItem> => {
  await new Promise(resolve => setTimeout(resolve, 2000));

  const historyItem: ExportHistoryItem = {
    id: `export-${Date.now()}`,
    timestamp: new Date().toISOString(),
    template,
    provider,
    status: 'completed',
    recordCount: expenses.length,
    fileName: `${template}-${new Date().toISOString().split('T')[0]}.csv`,
    size: `${Math.round(expenses.length * 0.15)}KB`
  };

  saveExportHistory(historyItem);
  return historyItem;
};

export const simulateEmailExport = async (
  email: string,
  template: ExportTemplate,
  expenses: Expense[]
): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 1500));

  const historyItem: ExportHistoryItem = {
    id: `export-${Date.now()}`,
    timestamp: new Date().toISOString(),
    template,
    provider: 'email',
    status: 'completed',
    recordCount: expenses.length,
    fileName: `Sent to ${email}`
  };

  saveExportHistory(historyItem);
};

export const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
};

export const getNextRunDate = (frequency: string): string => {
  const now = new Date();
  switch (frequency) {
    case 'daily':
      now.setDate(now.getDate() + 1);
      break;
    case 'weekly':
      now.setDate(now.getDate() + 7);
      break;
    case 'monthly':
      now.setMonth(now.getMonth() + 1);
      break;
    default:
      return 'Not scheduled';
  }
  return now.toISOString();
};
