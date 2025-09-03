'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Wrench, Clock, RefreshCw, Bell } from 'lucide-react'
import Link from 'next/link'

interface MaintenanceInfo {
  estimatedDuration: string
  startTime: string
  endTime: string
  reason: string
  affectedServices: string[]
}

export default function MaintenancePage() {
  const [timeRemaining, setTimeRemaining] = useState<string>('')
  const [maintenanceInfo] = useState<MaintenanceInfo>({
    estimatedDuration: '2 hours',
    startTime: '2:00 AM EST',
    endTime: '4:00 AM EST',
    reason: 'System upgrades and performance improvements',
    affectedServices: ['Shopping Cart', 'User Accounts', 'Payment Processing']
  })

  useEffect(() => {
    // Calculate time remaining (this would typically come from an API)
    const updateTimeRemaining = () => {
      const now = new Date()
      const endTime = new Date()
      endTime.setHours(4, 0, 0, 0) // 4:00 AM
      
      if (endTime < now) {
        endTime.setDate(endTime.getDate() + 1)
      }
      
      const diff = endTime.getTime() - now.getTime()
      const hours = Math.floor(diff / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      
      setTimeRemaining(`${hours}h ${minutes}m`)
    }

    updateTimeRemaining()
    const interval = setInterval(updateTimeRemaining, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [])

  const handleNotifyWhenReady = () => {
    // This would typically integrate with a notification service
    if ('Notification' in window) {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          alert('You will be notified when maintenance is complete!')
        }
      })
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-background via-muted/10 to-bibiere-gold/5">
      <div className="text-center max-w-2xl">
        <div className="w-24 h-24 bg-bibiere-gold/10 rounded-full flex items-center justify-center mx-auto mb-8">
          <Wrench className="w-12 h-12 text-bibiere-gold" />
        </div>
        
        <h1 className="text-4xl font-serif font-semibold text-foreground mb-4">
          Scheduled Maintenance
        </h1>
        
        <p className="text-lg text-muted-foreground mb-8">
          We're currently performing scheduled maintenance to improve your shopping experience.
        </p>

        <div className="bg-card border rounded-lg p-8 mb-8 text-left">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <Clock className="w-5 h-5 text-bibiere-gold" />
                Maintenance Window
              </h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p><strong>Start:</strong> {maintenanceInfo.startTime}</p>
                <p><strong>Estimated End:</strong> {maintenanceInfo.endTime}</p>
                <p><strong>Duration:</strong> {maintenanceInfo.estimatedDuration}</p>
                {timeRemaining && (
                  <p className="text-bibiere-gold font-medium">
                    <strong>Time Remaining:</strong> ~{timeRemaining}
                  </p>
                )}
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold text-foreground mb-3">
                What We're Improving
              </h3>
              <p className="text-sm text-muted-foreground mb-3">
                {maintenanceInfo.reason}
              </p>
              <div className="text-sm text-muted-foreground">
                <p className="font-medium mb-2">Affected Services:</p>
                <ul className="space-y-1">
                  {maintenanceInfo.affectedServices.map((service, index) => (
                    <li key={index}>• {service}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-muted/50 rounded-lg p-6 mb-8">
          <h3 className="font-medium text-foreground mb-3">During Maintenance:</h3>
          <div className="grid sm:grid-cols-2 gap-4 text-sm text-muted-foreground">
            <div>
              <p className="font-medium text-green-600 mb-1">✓ Available:</p>
              <ul className="space-y-1">
                <li>• Browse products</li>
                <li>• View collections</li>
                <li>• Read content</li>
                <li>• Contact information</li>
              </ul>
            </div>
            <div>
              <p className="font-medium text-amber-600 mb-1">⚠ Limited:</p>
              <ul className="space-y-1">
                <li>• User login/registration</li>
                <li>• Shopping cart</li>
                <li>• Checkout process</li>
                <li>• Account management</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button onClick={() => window.location.reload()} className="gap-2">
              <RefreshCw className="w-4 h-4" />
              Check Status
            </Button>
            <Button variant="outline" onClick={handleNotifyWhenReady} className="gap-2">
              <Bell className="w-4 h-4" />
              Notify When Ready
            </Button>
          </div>
          
          <Button variant="ghost" asChild>
            <Link href="/collections">
              Browse Collections (Read-Only)
            </Link>
          </Button>
        </div>

        <div className="mt-8 pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground mb-4">
            Stay updated on our progress:
          </p>
          <div className="flex flex-wrap gap-4 justify-center text-sm">
            <Link 
              href="/status" 
              className="text-bibiere-gold hover:text-bibiere-burgundy transition-colors"
            >
              System Status
            </Link>
            <Link 
              href="/contact" 
              className="text-bibiere-gold hover:text-bibiere-burgundy transition-colors"
            >
              Contact Support
            </Link>
            <a 
              href="https://twitter.com/bibiere" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-bibiere-gold hover:text-bibiere-burgundy transition-colors"
            >
              @bibiere
            </a>
          </div>
        </div>

        <div className="mt-6 text-xs text-muted-foreground">
          Last Updated: {new Date().toLocaleString()}
        </div>
      </div>
    </div>
  )
}