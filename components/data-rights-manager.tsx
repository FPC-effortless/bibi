'use client';

import React, { useState, useEffect } from 'react';
import { 
  Download, 
  Trash2, 
  Share, 
  Shield, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  FileText,
  User,
  Globe
} from 'lucide-react';

interface DataRequest {
  id: string;
  requestType: 'export' | 'deletion' | 'portability';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  requestedAt: string;
  completedAt?: string;
  downloadUrl?: string;
  expiresAt?: string;
  statusMessage?: string;
  nextSteps?: string;
}

const requestTypes = [
  {
    id: 'export' as const,
    title: 'Export My Data',
    description: 'Download a copy of all your personal data we have collected.',
    icon: <Download className="w-6 h-6" />,
    color: 'blue',
    estimatedTime: '24-48 hours',
    details: [
      'Personal information (name, email, address)',
      'Account preferences and settings',
      'Order history and transaction data',
      'Browsing and interaction history',
      'Consent and communication preferences',
    ],
  },
  {
    id: 'deletion' as const,
    title: 'Delete My Data',
    description: 'Request deletion of your personal data (Right to be Forgotten).',
    icon: <Trash2 className="w-6 h-6" />,
    color: 'red',
    estimatedTime: '30 days',
    details: [
      'Personal information will be deleted',
      'Account will be permanently closed',
      'Order history may be retained for legal compliance',
      'Some data may be retained for fraud prevention',
      'Process is irreversible once completed',
    ],
  },
  {
    id: 'portability' as const,
    title: 'Data Portability',
    description: 'Get your data in a machine-readable format for transfer.',
    icon: <Share className="w-6 h-6" />,
    color: 'green',
    estimatedTime: '24-48 hours',
    details: [
      'Data provided in JSON format',
      'Structured for easy import to other services',
      'Includes all portable personal data',
      'Excludes proprietary algorithms and derived data',
      'Suitable for transferring to other platforms',
    ],
  },
];

export default function DataRightsManager() {
  const [activeTab, setActiveTab] = useState<'request' | 'status'>('request');
  const [selectedRequest, setSelectedRequest] = useState<string | null>(null);
  const [userRequests, setUserRequests] = useState<DataRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Mock user ID - in real implementation, get from auth context
  const userId = 'user123';

  useEffect(() => {
    if (activeTab === 'status') {
      fetchUserRequests();
    }
  }, [activeTab]);

  const fetchUserRequests = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/user-data-rights/request?userId=${userId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch requests');
      }

      const result = await response.json();
      setUserRequests(result.data.requests);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch requests');
    } finally {
      setLoading(false);
    }
  };

  const submitDataRequest = async (requestType: 'export' | 'deletion' | 'portability') => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/user-data-rights/request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          requestType,
          userLocation: 'EU', // In real implementation, detect user location
          requestDetails: {
            source: 'privacy_center',
            timestamp: new Date().toISOString(),
          },
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit request');
      }

      const result = await response.json();
      setSuccess(`Your ${requestType} request has been submitted successfully. Request ID: ${result.data.requestId}`);
      setSelectedRequest(null);
      
      // Refresh requests if on status tab
      if (activeTab === 'status') {
        fetchUserRequests();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit request');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'processing':
        return <Clock className="w-5 h-5 text-blue-500 animate-spin" />;
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'failed':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 px-6">
          <button
            onClick={() => setActiveTab('request')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'request'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center space-x-2">
              <FileText className="w-4 h-4" />
              <span>Make a Request</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('status')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'status'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center space-x-2">
              <User className="w-4 h-4" />
              <span>My Requests</span>
            </div>
          </button>
        </nav>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Error/Success Messages */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center space-x-3">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <span className="text-red-700">{error}</span>
            </div>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-green-700">{success}</span>
            </div>
          </div>
        )}

        {activeTab === 'request' && (
          <div>
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Exercise Your Data Rights
              </h2>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-blue-900">Your Privacy Rights</h3>
                    <p className="text-sm text-blue-700 mt-1">
                      Under GDPR, CCPA, and other privacy laws, you have the right to access, 
                      correct, delete, or port your personal data. All requests are processed 
                      securely and in compliance with applicable regulations.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Request Types */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {requestTypes.map((type) => (
                <div
                  key={type.id}
                  className={`border-2 rounded-lg p-6 cursor-pointer transition-all ${
                    selectedRequest === type.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedRequest(selectedRequest === type.id ? null : type.id)}
                >
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${
                    type.color === 'blue' ? 'bg-blue-100 text-blue-600' :
                    type.color === 'red' ? 'bg-red-100 text-red-600' :
                    'bg-green-100 text-green-600'
                  }`}>
                    {type.icon}
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {type.title}
                  </h3>
                  
                  <p className="text-gray-600 text-sm mb-4">
                    {type.description}
                  </p>
                  
                  <div className="text-xs text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>Estimated time: {type.estimatedTime}</span>
                    </div>
                  </div>

                  {selectedRequest === type.id && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <h4 className="font-medium text-gray-900 mb-2">What's included:</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {type.details.map((detail, index) => (
                          <li key={index} className="flex items-start space-x-2">
                            <span className="text-gray-400 mt-1">•</span>
                            <span>{detail}</span>
                          </li>
                        ))}
                      </ul>
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          submitDataRequest(type.id);
                        }}
                        disabled={loading}
                        className={`mt-4 w-full py-2 px-4 rounded-md font-medium transition-colors ${
                          type.color === 'blue' ? 'bg-blue-600 hover:bg-blue-700 text-white' :
                          type.color === 'red' ? 'bg-red-600 hover:bg-red-700 text-white' :
                          'bg-green-600 hover:bg-green-700 text-white'
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                        {loading ? 'Submitting...' : `Submit ${type.title} Request`}
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'status' && (
          <div>
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                My Data Requests
              </h2>
              <p className="text-gray-600">
                Track the status of your data rights requests and download completed exports.
              </p>
            </div>

            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-gray-500 mt-2">Loading your requests...</p>
              </div>
            ) : userRequests.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No requests found</h3>
                <p className="text-gray-500">You haven't made any data rights requests yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {userRequests.map((request) => (
                  <div key={request.id} className="border border-gray-200 rounded-lg p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        {getStatusIcon(request.status)}
                        <div>
                          <h3 className="font-medium text-gray-900 capitalize">
                            {request.requestType} Request
                          </h3>
                          <p className="text-sm text-gray-500">
                            Requested on {new Date(request.requestedAt).toLocaleDateString()}
                          </p>
                          {request.statusMessage && (
                            <p className="text-sm text-gray-700 mt-2">{request.statusMessage}</p>
                          )}
                          {request.nextSteps && (
                            <p className="text-sm text-blue-600 mt-1">{request.nextSteps}</p>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(request.status)}`}>
                          {request.status}
                        </span>
                        
                        {request.downloadUrl && request.status === 'completed' && (
                          <a
                            href={request.downloadUrl}
                            className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700 transition-colors"
                          >
                            Download
                          </a>
                        )}
                      </div>
                    </div>
                    
                    <div className="mt-4 text-xs text-gray-500">
                      Request ID: {request.id}
                      {request.expiresAt && (
                        <span className="ml-4">
                          Download expires: {new Date(request.expiresAt).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}