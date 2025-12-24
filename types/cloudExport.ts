export type ExportTemplate =
  | 'tax-report'
  | 'monthly-summary'
  | 'category-analysis'
  | 'detailed-export'
  | 'budget-review';

export type CloudProvider =
  | 'google-sheets'
  | 'google-drive'
  | 'dropbox'
  | 'onedrive'
  | 'email';

export type ExportFrequency =
  | 'once'
  | 'daily'
  | 'weekly'
  | 'monthly';

export interface ExportHistoryItem {
  id: string;
  timestamp: string;
  template: ExportTemplate;
  provider: CloudProvider;
  status: 'completed' | 'pending' | 'failed';
  recordCount: number;
  fileName: string;
  size?: string;
}

export interface ScheduledExport {
  id: string;
  template: ExportTemplate;
  provider: CloudProvider;
  frequency: ExportFrequency;
  nextRun: string;
  enabled: boolean;
  recipients?: string[];
}

export interface CloudIntegration {
  provider: CloudProvider;
  connected: boolean;
  lastSync?: string;
  status: 'connected' | 'disconnected' | 'syncing' | 'error';
}

export interface TemplateConfig {
  id: ExportTemplate;
  name: string;
  description: string;
  icon: string;
  color: string;
  fields: string[];
  bestFor: string;
}
