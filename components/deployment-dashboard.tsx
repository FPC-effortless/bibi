'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

/**
 * Deployment monitoring dashboard
 * Displays deployment status, metrics, and controls
 */

interface DeploymentInfo {
  id: string;
  timestamp: string;
  environment: string;
  version: string;
  status: 'success' | 'failed' | 'in-progress' | 'rolled-back';
  url?: string;
  strategy: string;
  commit: string;
  duration?: number;
}

interface SystemMetrics {
  uptime: number;
  responseTime: number;
  errorRate: number;
  throughput: number;
  memoryUsage: number;
  cpuUsage: number;
}

interface DeploymentDashboardProps {
  environment?: string;
}

export function DeploymentDashboard({ environment = 'production' }: DeploymentDashboardProps) {
  const [deployments, setDeployments] = useState<DeploymentInfo[]>([]);
  const [metrics, setMetrics] = useState<SystemMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDeploymentData();
    fetchSystemMetrics();
    
    // Refresh data every 30 seconds
    const interval = setInterval(() => {
      fetchDeploymentData();
      fetchSystemMetrics();
    }, 30000);
    
    return () => clearInterval(interval);
  }, [environment]);

  const fetchDeploymentData = async () => {
    try {
      // In a real implementation, this would fetch from your deployment API
      const mockDeployments: DeploymentInfo[] = [
        {
          id: 'deploy-1703123456-abc123',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          environment: 'production',
          version: '1.2.3',
          status: 'success',
          url: 'https://bibiere.com',
          strategy: 'blue-green',
          commit: 'a1b2c3d4',
          duration: 180,
        },
        {
          id: 'deploy-1703119856-def456',
          timestamp: new Date(Date.now() - 7200000).toISOString(),
          environment: 'staging',
          version: '1.2.2',
          status: 'success',
          url: 'https://staging.bibiere.com',
          strategy: 'rolling',
          commit: 'e5f6g7h8',
          duration: 120,
        },
        {
          id: 'deploy-1703116256-ghi789',
          timestamp: new Date(Date.now() - 10800000).toISOString(),
          environment: 'production',
          version: '1.2.1',
          status: 'rolled-back',
          url: 'https://bibiere.com',
          strategy: 'canary',
          commit: 'i9j0k1l2',
          duration: 45,
        },
      ];
      
      setDeployments(mockDeployments.filter(d => d.environment === environment));
    } catch (err) {
      setError('Failed to fetch deployment data');
    }
  };

  const fetchSystemMetrics = async () => {
    try {
      // In a real implementation, this would fetch from your monitoring API
      const mockMetrics: SystemMetrics = {
        uptime: 99.9,
        responseTime: 245,
        errorRate: 0.1,
        throughput: 1250,
        memoryUsage: 68,
        cpuUsage: 23,
      };
      
      setMetrics(mockMetrics);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch system metrics');
      setLoading(false);
    }
  };

  const handleRollback = async (deploymentId: string) => {
    try {
      // In a real implementation, this would trigger a rollback
      console.log(`Triggering rollback for deployment: ${deploymentId}`);
      
      // Update deployment status
      setDeployments(prev => prev.map(d => 
        d.id === deploymentId 
          ? { ...d, status: 'in-progress' as const }
          : d
      ));
      
      // Simulate rollback process
      setTimeout(() => {
        setDeployments(prev => prev.map(d => 
          d.id === deploymentId 
            ? { ...d, status: 'rolled-back' as const }
            : d
        ));
      }, 3000);
    } catch (err) {
      setError('Failed to trigger rollback');
    }
  };

  const getStatusColor = (status: DeploymentInfo['status']) => {
    switch (status) {
      case 'success':
        return 'bg-green-500';
      case 'failed':
        return 'bg-red-500';
      case 'in-progress':
        return 'bg-yellow-500';
      case 'rolled-back':
        return 'bg-orange-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusText = (status: DeploymentInfo['status']) => {
    switch (status) {
      case 'success':
        return 'Success';
      case 'failed':
        return 'Failed';
      case 'in-progress':
        return 'In Progress';
      case 'rolled-back':
        return 'Rolled Back';
      default:
        return 'Unknown';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-600">{error}</p>
        <Button onClick={() => window.location.reload()} className="mt-4">
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* System Metrics */}
      {metrics && (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Uptime</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{metrics.uptime}%</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Response Time</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.responseTime}ms</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Error Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{metrics.errorRate}%</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Throughput</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.throughput}/min</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Memory</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.memoryUsage}%</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">CPU</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.cpuUsage}%</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Deployment History */}
      <Card>
        <CardHeader>
          <CardTitle>Deployment History - {environment}</CardTitle>
          <CardDescription>
            Recent deployments and their status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {deployments.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No deployments found</p>
            ) : (
              deployments.map((deployment) => (
                <div
                  key={deployment.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <div className={`w-3 h-3 rounded-full ${getStatusColor(deployment.status)}`} />
                    
                    <div>
                      <div className="font-medium">{deployment.version}</div>
                      <div className="text-sm text-gray-500">
                        {new Date(deployment.timestamp).toLocaleString()}
                      </div>
                    </div>
                    
                    <Badge variant="outline">
                      {getStatusText(deployment.status)}
                    </Badge>
                    
                    <Badge variant="secondary">
                      {deployment.strategy}
                    </Badge>
                    
                    <div className="text-sm text-gray-500">
                      {deployment.commit.substring(0, 8)}
                    </div>
                    
                    {deployment.duration && (
                      <div className="text-sm text-gray-500">
                        {deployment.duration}s
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {deployment.url && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(deployment.url, '_blank')}
                      >
                        View
                      </Button>
                    )}
                    
                    {deployment.status === 'success' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRollback(deployment.id)}
                      >
                        Rollback
                      </Button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Common deployment operations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4">
            <Button variant="outline">
              Trigger Deployment
            </Button>
            <Button variant="outline">
              Run Health Check
            </Button>
            <Button variant="outline">
              View Logs
            </Button>
            <Button variant="outline">
              Performance Report
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}