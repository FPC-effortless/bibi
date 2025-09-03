'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Activity, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle, 
  Server,
  Zap,
  Clock,
  BarChart3
} from 'lucide-react';

interface ScalingStatus {
  currentInstances: number;
  minInstances: number;
  maxInstances: number;
  lastScalingAction: string | null;
  activeRules: number;
  recentActions: number;
}

interface PerformanceSummary {
  status: 'healthy' | 'warning' | 'critical';
  activeAlerts: number;
  criticalAlerts: number;
  lastUpdated: string;
}

interface ScalingRecommendation {
  currentInstances: number;
  recommendedInstances: number;
  reasoning: string[];
  costImpact: string;
  performanceImpact: string;
}

interface BottleneckAlert {
  id: string;
  type: 'warning' | 'critical';
  metric: string;
  currentValue: number;
  threshold: number;
  message: string;
  timestamp: string;
  suggestions: string[];
}

interface ScalingAction {
  id: string;
  action: 'scale_up' | 'scale_down' | 'alert';
  timestamp: string;
  reason: string;
  previousValue: number;
  newValue: number;
  success: boolean;
}

export default function AutoScalingDashboard() {
  const [scalingStatus, setScalingStatus] = useState<ScalingStatus | null>(null);
  const [performanceSummary, setPerformanceSummary] = useState<PerformanceSummary | null>(null);
  const [recommendations, setRecommendations] = useState<ScalingRecommendation | null>(null);
  const [alerts, setAlerts] = useState<BottleneckAlert[]>([]);
  const [history, setHistory] = useState<ScalingAction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch status and performance summary
      const statusResponse = await fetch('/api/performance/scaling?action=status');
      const statusData = await statusResponse.json();
      
      setScalingStatus(statusData.scaling);
      setPerformanceSummary(statusData.performance);

      // Fetch recommendations
      const recommendationsResponse = await fetch('/api/performance/scaling?action=recommendations');
      const recommendationsData = await recommendationsResponse.json();
      setRecommendations(recommendationsData.recommendations);

      // Fetch alerts
      const alertsResponse = await fetch('/api/performance/scaling?action=alerts');
      const alertsData = await alertsResponse.json();
      setAlerts(alertsData.alerts);

      // Fetch history
      const historyResponse = await fetch('/api/performance/scaling?action=history&limit=10');
      const historyData = await historyResponse.json();
      setHistory(historyData.history);

      setError(null);
    } catch (err) {
      setError('Failed to fetch dashboard data');
      console.error('Dashboard fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const resolveAlert = async (alertId: string) => {
    try {
      await fetch('/api/performance/scaling', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'resolve_alert',
          data: { alertId }
        })
      });
      
      // Refresh alerts
      fetchDashboardData();
    } catch (err) {
      console.error('Failed to resolve alert:', err);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-600';
      case 'warning': return 'text-yellow-600';
      case 'critical': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'warning': return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      case 'critical': return <AlertTriangle className="h-5 w-5 text-red-600" />;
      default: return <Activity className="h-5 w-5 text-gray-600" />;
    }
  };

  if (loading && !scalingStatus) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Auto-scaling Dashboard</h1>
        <Button onClick={fetchDashboardData} disabled={loading}>
          {loading ? 'Refreshing...' : 'Refresh'}
        </Button>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Instances</CardTitle>
            <Server className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{scalingStatus?.currentInstances || 0}</div>
            <p className="text-xs text-muted-foreground">
              Min: {scalingStatus?.minInstances} | Max: {scalingStatus?.maxInstances}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Performance Status</CardTitle>
            {performanceSummary && getStatusIcon(performanceSummary.status)}
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold capitalize ${performanceSummary ? getStatusColor(performanceSummary.status) : ''}`}>
              {performanceSummary?.status || 'Unknown'}
            </div>
            <p className="text-xs text-muted-foreground">
              {performanceSummary?.activeAlerts || 0} active alerts
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Rules</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{scalingStatus?.activeRules || 0}</div>
            <p className="text-xs text-muted-foreground">
              {scalingStatus?.recentActions || 0} recent actions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Last Action</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-sm font-medium">
              {scalingStatus?.lastScalingAction 
                ? new Date(scalingStatus.lastScalingAction).toLocaleString()
                : 'None'
              }
            </div>
            <p className="text-xs text-muted-foreground">
              Last scaling action
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recommendations */}
      {recommendations && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Scaling Recommendations
            </CardTitle>
            <CardDescription>
              AI-powered recommendations based on current performance metrics
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Current Instances</p>
                <p className="text-2xl font-bold">{recommendations.currentInstances}</p>
              </div>
              <div className="text-center">
                {recommendations.recommendedInstances > recommendations.currentInstances ? (
                  <TrendingUp className="h-8 w-8 text-green-600 mx-auto" />
                ) : recommendations.recommendedInstances < recommendations.currentInstances ? (
                  <TrendingDown className="h-8 w-8 text-red-600 mx-auto" />
                ) : (
                  <Activity className="h-8 w-8 text-gray-600 mx-auto" />
                )}
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Recommended</p>
                <p className="text-2xl font-bold">{recommendations.recommendedInstances}</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium">Reasoning:</h4>
              <ul className="text-sm space-y-1">
                {recommendations.reasoning.map((reason, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-muted-foreground">•</span>
                    {reason}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
              <div>
                <h4 className="font-medium text-sm">Cost Impact</h4>
                <p className="text-sm text-muted-foreground">{recommendations.costImpact}</p>
              </div>
              <div>
                <h4 className="font-medium text-sm">Performance Impact</h4>
                <p className="text-sm text-muted-foreground">{recommendations.performanceImpact}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Active Alerts */}
      {alerts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Active Performance Alerts
            </CardTitle>
            <CardDescription>
              Performance issues requiring attention
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {alerts.map((alert) => (
              <div key={alert.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge variant={alert.type === 'critical' ? 'destructive' : 'secondary'}>
                        {alert.type}
                      </Badge>
                      <span className="font-medium">{alert.metric}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{alert.message}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(alert.timestamp).toLocaleString()}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => resolveAlert(alert.id)}
                  >
                    Resolve
                  </Button>
                </div>
                
                {alert.suggestions.length > 0 && (
                  <div>
                    <h5 className="text-sm font-medium mb-2">Suggestions:</h5>
                    <ul className="text-sm space-y-1">
                      {alert.suggestions.map((suggestion, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-muted-foreground">•</span>
                          {suggestion}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Scaling History */}
      {history.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Scaling Actions</CardTitle>
            <CardDescription>
              History of automatic scaling decisions and actions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {history.map((action) => (
                <div key={action.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge variant={action.success ? 'default' : 'destructive'}>
                        {action.action.replace('_', ' ')}
                      </Badge>
                      <span className="text-sm">
                        {action.previousValue} → {action.newValue} instances
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{action.reason}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">
                      {new Date(action.timestamp).toLocaleString()}
                    </p>
                    {action.success ? (
                      <CheckCircle className="h-4 w-4 text-green-600 ml-auto mt-1" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-red-600 ml-auto mt-1" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}