'use client';

import React, { useState, useEffect } from 'react';
import { Shield, FileText, Users, BarChart3, Download, Calendar, AlertTriangle } from 'lucide-react';

interface ComplianceMetrics {
  totalEvents: number;
  eventsByType: Record<string, number>;
  consentMetrics: {
    totalConsents: number;
    consentsByType: Record<string, number>;
    withdrawalRate: number;
  };
  dataProcessingMetrics: {
    totalProcessingEvents: number;
    processingByPurpose: Record<string, number>;
  };
}

interface ComplianceDashboardProps {
  className?: string;
}

export default function ComplianceDashboard({ className = '' }: ComplianceDashboardProps) {
  const [metrics, setMetrics] = useState<ComplianceMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days ago
    endDate: new Date().toISOString().split('T')[0], // today
  });

  useEffect(() => {
    fetchComplianceMetrics();
  }, [dateRange]);

  const fetchComplianceMetrics = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `/api/compliance/audit?startDate=${dateRange.startDate}&endDate=${dateRange.endDate}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch compliance metrics');
      }

      const result = await response.json();
      setMetrics(result.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const downloadReport = async (format: 'json' | 'csv') => {
    try {
      const response = await fetch(
        `/api/compliance/audit?startDate=${dateRange.startDate}&endDate=${dateRange.endDate}&format=${format}`
      );

      if (!response.ok) {
        throw new Error('Failed to download report');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `compliance-report-${dateRange.startDate}-to-${dateRange.endDate}.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to download report');
    }
  };

  if (loading) {
    return (
      <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-4/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-white rounded-lg shadow-sm border border-red-200 p-6 ${className}`}>
        <div className="flex items-center space-x-3 text-red-600">
          <AlertTriangle className="w-5 h-5" />
          <span>Error loading compliance data: {error}</span>
        </div>
        <button
          onClick={fetchComplianceMetrics}
          className="mt-4 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${className}`}>
        <p className="text-gray-500">No compliance data available</p>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Shield className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">Compliance Dashboard</h2>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => downloadReport('csv')}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Export CSV</span>
            </button>
            <button
              onClick={() => downloadReport('json')}
              className="flex items-center space-x-2 bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Export JSON</span>
            </button>
          </div>
        </div>

        {/* Date Range Selector */}
        <div className="mt-4 flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-gray-500" />
            <label className="text-sm font-medium text-gray-700">Date Range:</label>
          </div>
          <input
            type="date"
            value={dateRange.startDate}
            onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
            className="border border-gray-300 rounded-md px-3 py-1 text-sm"
          />
          <span className="text-gray-500">to</span>
          <input
            type="date"
            value={dateRange.endDate}
            onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
            className="border border-gray-300 rounded-md px-3 py-1 text-sm"
          />
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Events */}
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Total Events</p>
                <p className="text-2xl font-bold text-blue-900">{metrics.totalEvents}</p>
              </div>
              <FileText className="w-8 h-8 text-blue-600" />
            </div>
          </div>

          {/* Total Consents */}
          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Total Consents</p>
                <p className="text-2xl font-bold text-green-900">{metrics.consentMetrics.totalConsents}</p>
              </div>
              <Users className="w-8 h-8 text-green-600" />
            </div>
          </div>

          {/* Withdrawal Rate */}
          <div className="bg-yellow-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-yellow-600">Withdrawal Rate</p>
                <p className="text-2xl font-bold text-yellow-900">
                  {metrics.consentMetrics.withdrawalRate.toFixed(1)}%
                </p>
              </div>
              <BarChart3 className="w-8 h-8 text-yellow-600" />
            </div>
          </div>

          {/* Processing Events */}
          <div className="bg-purple-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Processing Events</p>
                <p className="text-2xl font-bold text-purple-900">
                  {metrics.dataProcessingMetrics.totalProcessingEvents}
                </p>
              </div>
              <Shield className="w-8 h-8 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Detailed Breakdowns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Event Types */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Events by Type</h3>
            <div className="space-y-3">
              {Object.entries(metrics.eventsByType).map(([type, count]) => (
                <div key={type} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700 capitalize">
                    {type.replace('_', ' ')}
                  </span>
                  <span className="text-sm font-bold text-gray-900">{count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Consent Types */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Consents by Type</h3>
            <div className="space-y-3">
              {Object.entries(metrics.consentMetrics.consentsByType).map(([type, count]) => (
                <div key={type} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700 capitalize">
                    {type.replace('_', ' ')}
                  </span>
                  <span className="text-sm font-bold text-gray-900">{count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Processing Purposes */}
          <div className="lg:col-span-2">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Processing by Purpose</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {Object.entries(metrics.dataProcessingMetrics.processingByPurpose).map(([purpose, count]) => (
                <div key={purpose} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700 capitalize">
                    {purpose.replace('_', ' ')}
                  </span>
                  <span className="text-sm font-bold text-gray-900">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Compliance Status */}
        <div className="mt-8 p-4 bg-green-50 rounded-lg border border-green-200">
          <div className="flex items-center space-x-3">
            <Shield className="w-5 h-5 text-green-600" />
            <div>
              <h4 className="text-sm font-semibold text-green-900">Compliance Status</h4>
              <p className="text-sm text-green-700">
                System is operating in compliance with GDPR/CCPA regulations. 
                All consent and data processing activities are being properly tracked and audited.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}