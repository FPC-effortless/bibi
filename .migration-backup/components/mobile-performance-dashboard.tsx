"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Smartphone, 
  Wifi, 
  Zap, 
  Eye, 
  MousePointer, 
  BarChart3,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Minus
} from "lucide-react"
import { useMobileOptimization } from "@/hooks/use-mobile-optimization"

interface PerformanceMetric {
  name: string
  value: number
  rating: 'good' | 'needs-improvement' | 'poor'
  threshold: { good: number; poor: number }
  unit: string
  description: string
}

export default function MobilePerformanceDashboard() {
  const {
    deviceType,
    connectionType,
    isSlowConnection,
    getPerformanceMetrics,
    isMobile,
    isOptimized
  } = useMobileOptimization()

  const [metrics, setMetrics] = useState<PerformanceMetric[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const loadMetrics = async () => {
    setIsLoading(true)
    
    try {
      const rawMetrics = getPerformanceMetrics()
      
      if (rawMetrics) {
        const formattedMetrics: PerformanceMetric[] = [
          {
            name: 'LCP',
            value: rawMetrics.lcp || 0,
            rating: getRating(rawMetrics.lcp || 0, { good: 2500, poor: 4000 }),
            threshold: { good: 2500, poor: 4000 },
            unit: 'ms',
            description: 'Largest Contentful Paint - Time to render the largest content element'
          },
          {
            name: 'FID',
            value: rawMetrics.fid || 0,
            rating: getRating(rawMetrics.fid || 0, { good: 100, poor: 300 }),
            threshold: { good: 100, poor: 300 },
            unit: 'ms',
            description: 'First Input Delay - Time from first user interaction to browser response'
          },
          {
            name: 'CLS',
            value: rawMetrics.cls || 0,
            rating: getRating(rawMetrics.cls || 0, { good: 0.1, poor: 0.25 }),
            threshold: { good: 0.1, poor: 0.25 },
            unit: '',
            description: 'Cumulative Layout Shift - Visual stability of the page'
          },
          {
            name: 'FCP',
            value: rawMetrics.fcp || 0,
            rating: getRating(rawMetrics.fcp || 0, { good: 1800, poor: 3000 }),
            threshold: { good: 1800, poor: 3000 },
            unit: 'ms',
            description: 'First Contentful Paint - Time to render first content element'
          },
          {
            name: 'TTFB',
            value: rawMetrics.ttfb || 0,
            rating: getRating(rawMetrics.ttfb || 0, { good: 800, poor: 1800 }),
            threshold: { good: 800, poor: 1800 },
            unit: 'ms',
            description: 'Time to First Byte - Server response time'
          }
        ]
        
        setMetrics(formattedMetrics)
        setLastUpdated(new Date())
      }
    } catch (error) {
      console.error('Failed to load performance metrics:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadMetrics()
    
    // Refresh metrics every 30 seconds
    const interval = setInterval(loadMetrics, 30000)
    
    return () => clearInterval(interval)
  }, [getPerformanceMetrics])

  const getRating = (value: number, threshold: { good: number; poor: number }): 'good' | 'needs-improvement' | 'poor' => {
    if (value <= threshold.good) return 'good'
    if (value <= threshold.poor) return 'needs-improvement'
    return 'poor'
  }

  const getRatingColor = (rating: string) => {
    switch (rating) {
      case 'good':
        return 'bg-green-100 text-green-800'
      case 'needs-improvement':
        return 'bg-yellow-100 text-yellow-800'
      case 'poor':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getRatingIcon = (rating: string) => {
    switch (rating) {
      case 'good':
        return <TrendingUp className="h-3 w-3" />
      case 'needs-improvement':
        return <Minus className="h-3 w-3" />
      case 'poor':
        return <TrendingDown className="h-3 w-3" />
      default:
        return <BarChart3 className="h-3 w-3" />
    }
  }

  const getDeviceIcon = () => {
    switch (deviceType) {
      case 'mobile':
        return <Smartphone className="h-4 w-4" />
      case 'tablet':
        return <Smartphone className="h-4 w-4" />
      default:
        return <BarChart3 className="h-4 w-4" />
    }
  }

  const formatValue = (value: number, unit: string) => {
    if (unit === 'ms') {
      return `${Math.round(value)}${unit}`
    }
    if (unit === '') {
      return value.toFixed(3)
    }
    return `${value}${unit}`
  }

  return (
    <div className="space-y-6">
      {/* Device and Connection Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              {getDeviceIcon()}
              <div>
                <p className="text-sm font-medium capitalize">{deviceType}</p>
                <p className="text-xs text-muted-foreground">Device Type</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Wifi className="h-4 w-4" />
              <div>
                <p className="text-sm font-medium uppercase">{connectionType}</p>
                <p className="text-xs text-muted-foreground">Connection</p>
              </div>
              {isSlowConnection && (
                <Badge variant="secondary" className="ml-2">Slow</Badge>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Zap className="h-4 w-4" />
              <div>
                <p className="text-sm font-medium">{isOptimized ? 'Enabled' : 'Disabled'}</p>
                <p className="text-xs text-muted-foreground">Optimization</p>
              </div>
              <Badge variant={isOptimized ? "default" : "secondary"}>
                {isOptimized ? 'Active' : 'Inactive'}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5" />
                <span>Core Web Vitals</span>
              </CardTitle>
              <CardDescription>
                Mobile performance metrics for user experience optimization
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={loadMetrics}
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </CardHeader>
        
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-16 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {metrics.map((metric) => (
                <div key={metric.name} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <div className="font-mono text-lg font-bold">
                        {metric.name}
                      </div>
                      <Badge className={getRatingColor(metric.rating)}>
                        {getRatingIcon(metric.rating)}
                        <span className="ml-1 capitalize">{metric.rating.replace('-', ' ')}</span>
                      </Badge>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">
                        {formatValue(metric.value, metric.unit)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Target: ≤{formatValue(metric.threshold.good, metric.unit)}
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground">
                    {metric.description}
                  </p>
                  
                  {/* Progress bar */}
                  <div className="mt-3">
                    <div className="flex justify-between text-xs text-muted-foreground mb-1">
                      <span>Good</span>
                      <span>Needs Improvement</span>
                      <span>Poor</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          metric.rating === 'good' ? 'bg-green-500' :
                          metric.rating === 'needs-improvement' ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{
                          width: `${Math.min((metric.value / (metric.threshold.poor * 1.5)) * 100, 100)}%`
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {lastUpdated && (
            <div className="mt-4 pt-4 border-t">
              <p className="text-xs text-muted-foreground">
                Last updated: {lastUpdated.toLocaleTimeString()}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Mobile-specific recommendations */}
      {isMobile && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Eye className="h-5 w-5" />
              <span>Mobile Optimization Tips</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {metrics.some(m => m.rating === 'poor') && (
                <div className="p-3 bg-red-50 rounded-lg">
                  <p className="text-sm text-red-800">
                    <strong>Performance Issues Detected:</strong> Some metrics are in the poor range. 
                    Consider optimizing images, reducing JavaScript, and improving server response times.
                  </p>
                </div>
              )}
              
              {isSlowConnection && (
                <div className="p-3 bg-yellow-50 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    <strong>Slow Connection Detected:</strong> Optimizations are active to reduce data usage 
                    and improve loading times on your connection.
                  </p>
                </div>
              )}
              
              {!isOptimized && (
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Enable Optimizations:</strong> Mobile optimizations are available but not active. 
                    Refresh the page to enable enhanced mobile performance features.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}