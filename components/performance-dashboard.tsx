/**
 * Performance Dashboard Component
 * Displays real-time performance metrics and Core Web Vitals
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Activity, Clock, Zap, Eye, AlertTriangle, CheckCircle } from 'lucide-react';

interface WebVitalMetric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  threshold: { good: number; poor: number };
  unit: string;
}

interface PerformanceData {
  webVitals: WebVitalMetric[];
  customMetrics: {
    pageLoadTime: number;
    apiResponseTime: number;
    imageLoadTime: number;
    navigationTime: number;
  };
  resourceTiming: {
    totalResources: number;
    totalSize: number;
    averageLoadTime: number;
  };
  memoryUsage?: {
    usedJSHeapSize: number;
    totalJSHeapSize: number;
    jsHeapSizeLimit: number;
  };
}

const PerformanceDashboard: React.FC = () => {
  const [performanceData, setPerformanceData] = useState<PerformanceData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  useEffect(() => {
    loadPerformanceData();
    
    // Update every 30 seconds
    const interval = setInterval(loadPerformanceData, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const loadPerformanceData = async () => {
    try {
      // In a real implementation, this would fetch from your analytics API
      const mockData: PerformanceData = {
        webVitals: [
          {
            name: 'LCP',
            value: 1800,
            rating: 'good',
            threshold: { good: 2500, poor: 4000 },
            unit: 'ms'
          },
          {
            name: 'FID',
            value: 85,
            rating: 'good',
            threshold: { good: 100, poor: 300 },
            unit: 'ms'
          },
          {
            name: 'CLS',
            value: 0.08,
            rating: 'good',
            threshold: { good: 0.1, poor: 0.25 },
            unit: ''
          },
          {
            name: 'FCP',
            value: 1200,
            rating: 'good',
            threshold: { good: 1800, poor: 3000 },
            unit: 'ms'
          },
          {
            name: 'TTFB',
            value: 450,
            rating: 'good',
            threshold: { good: 600, poor: 1500 },
            unit: 'ms'
          }
        ],
        customMetrics: {
          pageLoadTime: 2100,
          apiResponseTime: 320,
          imageLoadTime: 890,
          navigationTime: 1850,
        },
        resourceTiming: {
          totalResources: 45,
          totalSize: 2.8, // MB
          averageLoadTime: 245,
        },
        memoryUsage: {
          usedJSHeapSize: 15.2,
          totalJSHeapSize: 25.6,
          jsHeapSizeLimit: 2048,
        }
      };

      setPerformanceData(mockData);
      setLastUpdated(new Date());
      setIsLoading(false);
    } catch (error) {
      console.error('Failed to load performance data:', error);
      setIsLoading(false);
    }
  };

  const getRatingColor = (rating: string) => {
    switch (rating) {
      case 'good':
        return 'bg-green-500';
      case 'needs-improvement':
        return 'bg-yellow-500';
      case 'poor':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getRatingIcon = (rating: string) => {
    switch (rating) {
      case 'good':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'needs-improvement':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'poor':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default:
        return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  const formatBytes = (bytes: number) => {
    return `${bytes.toFixed(1)} MB`;
  };

  const formatTime = (ms: number) => {
    return `${ms.toFixed(0)}ms`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        <span className="ml-2">Loading performance data...</span>
      </div>
    );
  }

  if (!performanceData) {
    return (
      <div className="text-center p-8">
        <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
        <p>Failed to load performance data</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Performance Dashboard</h2>
        {lastUpdated && (
          <p className="text-sm text-gray-500">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </p>
        )}
      </div>

      <Tabs defaultValue="web-vitals" className="space-y-4">
        <TabsList>
          <TabsTrigger value="web-vitals">Core Web Vitals</TabsTrigger>
          <TabsTrigger value="custom-metrics">Custom Metrics</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
          <TabsTrigger value="memory">Memory</TabsTrigger>
        </TabsList>

        <TabsContent value="web-vitals" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {performanceData.webVitals.map((vital) => (
              <Card key={vital.name}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{vital.name}</CardTitle>
                  {getRatingIcon(vital.rating)}
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {vital.name === 'CLS' ? vital.value.toFixed(3) : formatTime(vital.value)}
                  </div>
                  <div className="flex items-center space-x-2 mt-2">
                    <Badge 
                      variant="secondary" 
                      className={`${getRatingColor(vital.rating)} text-white`}
                    >
                      {vital.rating.replace('-', ' ')}
                    </Badge>
                  </div>
                  <Progress 
                    value={Math.min((vital.value / vital.threshold.poor) * 100, 100)} 
                    className="mt-2"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Good: &lt; {vital.threshold.good}{vital.unit} | 
                    Poor: &gt; {vital.threshold.poor}{vital.unit}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="custom-metrics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Page Load Time</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatTime(performanceData.customMetrics.pageLoadTime)}
                </div>
                <p className="text-xs text-muted-foreground">
                  Total time to load the page
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">API Response Time</CardTitle>
                <Zap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatTime(performanceData.customMetrics.apiResponseTime)}
                </div>
                <p className="text-xs text-muted-foreground">
                  Average API response time
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Image Load Time</CardTitle>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatTime(performanceData.customMetrics.imageLoadTime)}
                </div>
                <p className="text-xs text-muted-foreground">
                  Average image loading time
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Navigation Time</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatTime(performanceData.customMetrics.navigationTime)}
                </div>
                <p className="text-xs text-muted-foreground">
                  Time to complete navigation
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="resources" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Total Resources</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {performanceData.resourceTiming.totalResources}
                </div>
                <p className="text-xs text-muted-foreground">
                  Number of loaded resources
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Total Size</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatBytes(performanceData.resourceTiming.totalSize)}
                </div>
                <p className="text-xs text-muted-foreground">
                  Total transfer size
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Average Load Time</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatTime(performanceData.resourceTiming.averageLoadTime)}
                </div>
                <p className="text-xs text-muted-foreground">
                  Average resource load time
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="memory" className="space-y-4">
          {performanceData.memoryUsage && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Used Heap Size</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {formatBytes(performanceData.memoryUsage.usedJSHeapSize)}
                  </div>
                  <Progress 
                    value={(performanceData.memoryUsage.usedJSHeapSize / performanceData.memoryUsage.totalJSHeapSize) * 100} 
                    className="mt-2"
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Total Heap Size</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {formatBytes(performanceData.memoryUsage.totalJSHeapSize)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Currently allocated heap
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Heap Limit</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {formatBytes(performanceData.memoryUsage.jsHeapSizeLimit)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Maximum heap size limit
                  </p>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PerformanceDashboard;