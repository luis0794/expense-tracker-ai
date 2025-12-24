'use client';

import React, { useState, useEffect } from 'react';
import { useExpenses } from '@/lib/ExpenseContext';
import {
  EXPORT_TEMPLATES,
  generateShareLink,
  getExportHistory,
  simulateCloudExport,
  simulateEmailExport,
  saveScheduledExport,
  getScheduledExports,
  deleteScheduledExport,
  getNextRunDate
} from '@/utils/cloudExportUtils';
import {
  ExportTemplate,
  CloudProvider,
  ExportHistoryItem,
  CloudIntegration,
  ScheduledExport,
  ExportFrequency
} from '@/types/cloudExport';
import QRCode from 'react-qr-code';

interface ExportCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

type Tab = 'templates' | 'integrations' | 'schedule' | 'history' | 'share';

const CLOUD_INTEGRATIONS: CloudIntegration[] = [
  { provider: 'google-sheets', connected: true, lastSync: '2 hours ago', status: 'connected' },
  { provider: 'google-drive', connected: true, lastSync: '1 day ago', status: 'connected' },
  { provider: 'dropbox', connected: false, status: 'disconnected' },
  { provider: 'onedrive', connected: false, status: 'disconnected' },
  { provider: 'email', connected: true, lastSync: 'Just now', status: 'connected' },
];

export default function ExportCenter({ isOpen, onClose }: ExportCenterProps) {
  const { expenses } = useExpenses();
  const [activeTab, setActiveTab] = useState<Tab>('templates');
  const [selectedTemplate, setSelectedTemplate] = useState<ExportTemplate | null>(null);
  const [selectedProvider, setSelectedProvider] = useState<CloudProvider | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [exportHistory, setExportHistory] = useState<ExportHistoryItem[]>([]);
  const [scheduledExports, setScheduledExports] = useState<ScheduledExport[]>([]);
  const [shareLink, setShareLink] = useState('');
  const [showQR, setShowQR] = useState(false);

  const [emailForm, setEmailForm] = useState({ email: '', subject: '', message: '' });
  const [scheduleForm, setScheduleForm] = useState({
    template: '' as ExportTemplate,
    provider: '' as CloudProvider,
    frequency: 'weekly' as ExportFrequency,
    recipients: ''
  });

  useEffect(() => {
    if (isOpen) {
      setExportHistory(getExportHistory());
      setScheduledExports(getScheduledExports());
      setShareLink(generateShareLink(expenses));
    }
  }, [isOpen, expenses]);

  const handleTemplateExport = async () => {
    if (!selectedTemplate || !selectedProvider) return;

    setIsExporting(true);
    try {
      await simulateCloudExport(expenses, selectedTemplate, selectedProvider);
      setExportHistory(getExportHistory());
      setSelectedTemplate(null);
      setSelectedProvider(null);
      alert('Export completed successfully!');
    } catch (error) {
      alert('Export failed. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleEmailExport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailForm.email || !selectedTemplate) return;

    setIsExporting(true);
    try {
      await simulateEmailExport(emailForm.email, selectedTemplate, expenses);
      setExportHistory(getExportHistory());
      setEmailForm({ email: '', subject: '', message: '' });
      setSelectedTemplate(null);
      alert(`Export sent to ${emailForm.email}!`);
    } catch (error) {
      alert('Failed to send email. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleScheduleExport = () => {
    if (!scheduleForm.template || !scheduleForm.provider || !scheduleForm.frequency) return;

    const schedule: ScheduledExport = {
      id: `schedule-${Date.now()}`,
      template: scheduleForm.template,
      provider: scheduleForm.provider,
      frequency: scheduleForm.frequency,
      nextRun: getNextRunDate(scheduleForm.frequency),
      enabled: true,
      recipients: scheduleForm.recipients ? scheduleForm.recipients.split(',').map(e => e.trim()) : []
    };

    saveScheduledExport(schedule);
    setScheduledExports(getScheduledExports());
    setScheduleForm({ template: '' as ExportTemplate, provider: '' as CloudProvider, frequency: 'weekly', recipients: '' });
    alert('Export scheduled successfully!');
  };

  const handleDeleteSchedule = (id: string) => {
    deleteScheduledExport(id);
    setScheduledExports(getScheduledExports());
  };

  const copyShareLink = () => {
    navigator.clipboard.writeText(shareLink);
    alert('Link copied to clipboard!');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />

      <div className="absolute right-0 top-0 h-full w-full max-w-4xl bg-white shadow-2xl transform transition-transform">
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 px-6 py-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                  <span className="text-3xl">☁️</span>
                  Export Center
                </h2>
                <p className="text-indigo-100 text-sm mt-1">Cloud-powered export and sharing</p>
              </div>
              <button
                onClick={onClose}
                className="text-white hover:text-indigo-100 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mt-4 overflow-x-auto">
              {[
                { id: 'templates' as Tab, label: 'Templates', icon: '📑' },
                { id: 'integrations' as Tab, label: 'Integrations', icon: '🔗' },
                { id: 'schedule' as Tab, label: 'Schedule', icon: '⏰' },
                { id: 'history' as Tab, label: 'History', icon: '📜' },
                { id: 'share' as Tab, label: 'Share', icon: '🔗' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-all ${
                    activeTab === tab.id
                      ? 'bg-white text-indigo-700 shadow-md'
                      : 'bg-indigo-500 bg-opacity-30 text-white hover:bg-opacity-50'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {/* Templates Tab */}
            {activeTab === 'templates' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Choose an Export Template</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {EXPORT_TEMPLATES.map(template => (
                      <button
                        key={template.id}
                        onClick={() => setSelectedTemplate(template.id)}
                        className={`p-5 rounded-xl border-2 text-left transition-all ${
                          selectedTemplate === template.id
                            ? 'border-indigo-600 bg-indigo-50 shadow-md'
                            : 'border-gray-200 hover:border-indigo-300 bg-white'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <span className="text-4xl">{template.icon}</span>
                          <div className="flex-1">
                            <h4 className="font-bold text-gray-900">{template.name}</h4>
                            <p className="text-sm text-gray-600 mt-1">{template.description}</p>
                            <div className="mt-3">
                              <span className="text-xs font-semibold text-gray-500">Best for:</span>
                              <p className="text-xs text-gray-600 mt-1">{template.bestFor}</p>
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {selectedTemplate && (
                  <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-200">
                    <h4 className="font-bold text-gray-900 mb-4">Select Export Destination</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {['google-sheets', 'google-drive', 'dropbox', 'onedrive', 'email'].map(provider => (
                        <button
                          key={provider}
                          onClick={() => setSelectedProvider(provider as CloudProvider)}
                          disabled={isExporting}
                          className={`p-4 rounded-lg border-2 font-medium transition-all ${
                            selectedProvider === provider
                              ? 'border-indigo-600 bg-white shadow-md'
                              : 'border-gray-200 bg-white hover:border-indigo-300'
                          } disabled:opacity-50`}
                        >
                          {provider === 'google-sheets' && '📊 Sheets'}
                          {provider === 'google-drive' && '📁 Drive'}
                          {provider === 'dropbox' && '📦 Dropbox'}
                          {provider === 'onedrive' && '☁️ OneDrive'}
                          {provider === 'email' && '✉️ Email'}
                        </button>
                      ))}
                    </div>

                    {selectedProvider === 'email' && (
                      <form onSubmit={handleEmailExport} className="mt-4 space-y-3">
                        <input
                          type="email"
                          placeholder="Email address"
                          value={emailForm.email}
                          onChange={e => setEmailForm({ ...emailForm, email: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                          required
                        />
                        <input
                          type="text"
                          placeholder="Subject (optional)"
                          value={emailForm.subject}
                          onChange={e => setEmailForm({ ...emailForm, subject: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                        />
                        <button
                          type="submit"
                          disabled={isExporting}
                          className="w-full px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50"
                        >
                          {isExporting ? 'Sending...' : 'Send Export via Email'}
                        </button>
                      </form>
                    )}

                    {selectedProvider && selectedProvider !== 'email' && (
                      <button
                        onClick={handleTemplateExport}
                        disabled={isExporting}
                        className="mt-4 w-full px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50"
                      >
                        {isExporting ? 'Exporting...' : `Export to ${selectedProvider}`}
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Integrations Tab */}
            {activeTab === 'integrations' && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Connected Services</h3>
                {CLOUD_INTEGRATIONS.map(integration => (
                  <div
                    key={integration.provider}
                    className="flex items-center justify-between p-5 bg-white rounded-xl border border-gray-200 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${
                        integration.connected ? 'bg-green-100' : 'bg-gray-100'
                      }`}>
                        {integration.provider === 'google-sheets' && '📊'}
                        {integration.provider === 'google-drive' && '📁'}
                        {integration.provider === 'dropbox' && '📦'}
                        {integration.provider === 'onedrive' && '☁️'}
                        {integration.provider === 'email' && '✉️'}
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 capitalize">
                          {integration.provider.replace('-', ' ')}
                        </h4>
                        {integration.connected && (
                          <p className="text-sm text-gray-500">Last sync: {integration.lastSync}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        integration.connected
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {integration.status}
                      </span>
                      <button className={`px-4 py-2 rounded-lg font-medium text-sm ${
                        integration.connected
                          ? 'bg-red-100 text-red-700 hover:bg-red-200'
                          : 'bg-indigo-600 text-white hover:bg-indigo-700'
                      }`}>
                        {integration.connected ? 'Disconnect' : 'Connect'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Schedule Tab */}
            {activeTab === 'schedule' && (
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Schedule Automatic Export</h3>
                  <div className="space-y-4">
                    <select
                      value={scheduleForm.template}
                      onChange={e => setScheduleForm({ ...scheduleForm, template: e.target.value as ExportTemplate })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="">Select Template</option>
                      {EXPORT_TEMPLATES.map(t => (
                        <option key={t.id} value={t.id}>{t.icon} {t.name}</option>
                      ))}
                    </select>

                    <select
                      value={scheduleForm.provider}
                      onChange={e => setScheduleForm({ ...scheduleForm, provider: e.target.value as CloudProvider })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="">Select Destination</option>
                      <option value="google-sheets">📊 Google Sheets</option>
                      <option value="google-drive">📁 Google Drive</option>
                      <option value="email">✉️ Email</option>
                    </select>

                    <select
                      value={scheduleForm.frequency}
                      onChange={e => setScheduleForm({ ...scheduleForm, frequency: e.target.value as ExportFrequency })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                    </select>

                    {scheduleForm.provider === 'email' && (
                      <input
                        type="text"
                        placeholder="Recipients (comma-separated)"
                        value={scheduleForm.recipients}
                        onChange={e => setScheduleForm({ ...scheduleForm, recipients: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      />
                    )}

                    <button
                      onClick={handleScheduleExport}
                      disabled={!scheduleForm.template || !scheduleForm.provider}
                      className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 disabled:opacity-50"
                    >
                      Create Schedule
                    </button>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-gray-900 mb-3">Active Schedules</h4>
                  {scheduledExports.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No scheduled exports yet</p>
                  ) : (
                    <div className="space-y-3">
                      {scheduledExports.map(schedule => (
                        <div key={schedule.id} className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
                          <div>
                            <p className="font-semibold text-gray-900">
                              {EXPORT_TEMPLATES.find(t => t.id === schedule.template)?.name}
                            </p>
                            <p className="text-sm text-gray-600">
                              {schedule.frequency} to {schedule.provider}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              Next run: {new Date(schedule.nextRun).toLocaleDateString()}
                            </p>
                          </div>
                          <button
                            onClick={() => handleDeleteSchedule(schedule.id)}
                            className="px-3 py-1 bg-red-100 text-red-700 rounded-lg text-sm font-medium hover:bg-red-200"
                          >
                            Delete
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* History Tab */}
            {activeTab === 'history' && (
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">Export History</h3>
                {exportHistory.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No export history yet</p>
                ) : (
                  <div className="space-y-3">
                    {exportHistory.map(item => (
                      <div key={item.id} className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl ${
                            item.status === 'completed' ? 'bg-green-100' : 'bg-yellow-100'
                          }`}>
                            {item.status === 'completed' ? '✓' : '⏳'}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">
                              {EXPORT_TEMPLATES.find(t => t.id === item.template)?.name}
                            </p>
                            <p className="text-sm text-gray-600">{item.fileName}</p>
                            <p className="text-xs text-gray-500">
                              {new Date(item.timestamp).toLocaleString()} • {item.recordCount} records
                              {item.size && ` • ${item.size}`}
                            </p>
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          item.status === 'completed'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {item.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Share Tab */}
            {activeTab === 'share' && (
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-200">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Share Your Data</h3>
                  <p className="text-gray-600 mb-4">Generate a secure, read-only link to share your expense summary</p>

                  <div className="flex gap-2 mb-4">
                    <input
                      type="text"
                      value={shareLink}
                      readOnly
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-white"
                    />
                    <button
                      onClick={copyShareLink}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
                    >
                      Copy
                    </button>
                  </div>

                  <button
                    onClick={() => setShowQR(!showQR)}
                    className="w-full px-4 py-2 bg-white border-2 border-blue-300 text-blue-700 rounded-lg font-medium hover:bg-blue-50"
                  >
                    {showQR ? 'Hide QR Code' : 'Show QR Code'}
                  </button>

                  {showQR && (
                    <div className="mt-6 flex justify-center">
                      <div className="p-4 bg-white rounded-lg shadow-lg">
                        <QRCode value={shareLink} size={200} />
                        <p className="text-center text-xs text-gray-500 mt-2">Scan to view summary</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">⚠️</span>
                    <div>
                      <h4 className="font-semibold text-yellow-900">Privacy Notice</h4>
                      <p className="text-sm text-yellow-800 mt-1">
                        Share links contain a summary of your data. They expire after 30 days and can be revoked at any time.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <button className="p-4 bg-white border-2 border-gray-200 rounded-lg hover:border-indigo-400 transition-colors">
                    <div className="text-2xl mb-2">📱</div>
                    <p className="font-semibold text-gray-900">Share via SMS</p>
                    <p className="text-xs text-gray-600 mt-1">Send link via text message</p>
                  </button>
                  <button className="p-4 bg-white border-2 border-gray-200 rounded-lg hover:border-indigo-400 transition-colors">
                    <div className="text-2xl mb-2">💬</div>
                    <p className="font-semibold text-gray-900">Share via Chat</p>
                    <p className="text-xs text-gray-600 mt-1">Send to Slack or Teams</p>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
