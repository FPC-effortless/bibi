
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Bell, BellOff, Smartphone, Package, Tag, Heart, TrendingDown } from "lucide-react"
import { useMobileOptimization } from "@/hooks/use-mobile-optimization"

interface NotificationPreferences {
  orderUpdates: boolean
  promotions: boolean
  newArrivals: boolean
  backInStock: boolean
  priceDrops: boolean
}

export default function MobileNotificationSettings() {
  const {
    notificationPermission,
    isNotificationSupported,
    isSubscribedToNotifications,
    requestNotificationPermission,
    updateNotificationPreferences,
    getNotificationPreferences,
    triggerHapticFeedback
  } = useMobileOptimization()

  const [preferences, setPreferences] = useState<NotificationPreferences>({
    orderUpdates: true,
    promotions: false,
    newArrivals: false,
    backInStock: true,
    priceDrops: false
  })

  const [isLoading, setIsLoading] = useState(false)

  // Load preferences on mount
  useEffect(() => {
    const savedPreferences = getNotificationPreferences()
    if (savedPreferences) {
      setPreferences(savedPreferences as NotificationPreferences)
    }
  }, [getNotificationPreferences])

  const handleEnableNotifications = async () => {
    setIsLoading(true)
    triggerHapticFeedback('selection')

    try {
      const permission = await requestNotificationPermission()
      
      if (permission === 'granted') {
        triggerHapticFeedback('medium')
      }
    } catch (error) {
      console.error('Failed to enable notifications:', error)
      triggerHapticFeedback('heavy')
    } finally {
      setIsLoading(false)
    }
  }

  const handlePreferenceChange = async (key: keyof NotificationPreferences, value: boolean) => {
    const newPreferences = { ...preferences, [key]: value }
    setPreferences(newPreferences)
    triggerHapticFeedback('light')

    try {
      await updateNotificationPreferences(newPreferences)
    } catch (error) {
      console.error('Failed to update preferences:', error)
      // Revert on error
      setPreferences(preferences)
    }
  }

  const getPermissionBadge = () => {
    switch (notificationPermission) {
      case 'granted':
        return <Badge variant="default" className="bg-green-100 text-green-800">Enabled</Badge>
      case 'denied':
        return <Badge variant="destructive">Blocked</Badge>
      default:
        return <Badge variant="secondary">Not Set</Badge>
    }
  }

  const getPermissionIcon = () => {
    return notificationPermission === 'granted' ? (
      <Bell className="h-5 w-5 text-green-600" />
    ) : (
      <BellOff className="h-5 w-5 text-gray-400" />
    )
  }

  if (!isNotificationSupported) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BellOff className="h-5 w-5" />
            <span>Push Notifications</span>
          </CardTitle>
          <CardDescription>
            Push notifications are not supported on this device or browser.
          </CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {getPermissionIcon()}
            <span>Push Notifications</span>
          </div>
          {getPermissionBadge()}
        </CardTitle>
        <CardDescription>
          Stay updated with order status, new arrivals, and exclusive offers
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {notificationPermission !== 'granted' && (
          <div className="space-y-4">
            <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg">
              <Smartphone className="h-5 w-5 text-blue-600 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium text-blue-900">
                  Enable notifications for the best mobile experience
                </p>
                <p className="text-xs text-blue-700 mt-1">
                  Get instant updates about your orders and never miss exclusive offers
                </p>
              </div>
            </div>
            
            <Button 
              onClick={handleEnableNotifications}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? 'Requesting Permission...' : 'Enable Notifications'}
            </Button>
          </div>
        )}

        {notificationPermission === 'granted' && (
          <div className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Package className="h-4 w-4 text-bibiere-burgundy" />
                  <div>
                    <Label htmlFor="order-updates" className="text-sm font-medium">
                      Order Updates
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Notifications about order status, shipping, and delivery
                    </p>
                  </div>
                </div>
                <Switch
                  id="order-updates"
                  checked={preferences.orderUpdates}
                  onCheckedChange={(checked) => handlePreferenceChange('orderUpdates', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Heart className="h-4 w-4 text-bibiere-burgundy" />
                  <div>
                    <Label htmlFor="back-in-stock" className="text-sm font-medium">
                      Back in Stock
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Alerts when wishlist items become available
                    </p>
                  </div>
                </div>
                <Switch
                  id="back-in-stock"
                  checked={preferences.backInStock}
                  onCheckedChange={(checked) => handlePreferenceChange('backInStock', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Tag className="h-4 w-4 text-bibiere-burgundy" />
                  <div>
                    <Label htmlFor="new-arrivals" className="text-sm font-medium">
                      New Arrivals
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Be first to know about new luxury pieces
                    </p>
                  </div>
                </div>
                <Switch
                  id="new-arrivals"
                  checked={preferences.newArrivals}
                  onCheckedChange={(checked) => handlePreferenceChange('newArrivals', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <TrendingDown className="h-4 w-4 text-bibiere-burgundy" />
                  <div>
                    <Label htmlFor="price-drops" className="text-sm font-medium">
                      Price Drops
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Notifications when items go on sale
                    </p>
                  </div>
                </div>
                <Switch
                  id="price-drops"
                  checked={preferences.priceDrops}
                  onCheckedChange={(checked) => handlePreferenceChange('priceDrops', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Bell className="h-4 w-4 text-bibiere-burgundy" />
                  <div>
                    <Label htmlFor="promotions" className="text-sm font-medium">
                      Promotions & Offers
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Exclusive deals and promotional campaigns
                    </p>
                  </div>
                </div>
                <Switch
                  id="promotions"
                  checked={preferences.promotions}
                  onCheckedChange={(checked) => handlePreferenceChange('promotions', checked)}
                />
              </div>
            </div>

            <div className="pt-4 border-t">
              <p className="text-xs text-muted-foreground">
                You can change these preferences anytime. Notifications respect your device's 
                Do Not Disturb settings.
              </p>
            </div>
          </div>
        )}

        {notificationPermission === 'denied' && (
          <div className="space-y-4">
            <div className="flex items-center space-x-3 p-4 bg-red-50 rounded-lg">
              <BellOff className="h-5 w-5 text-red-600 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium text-red-900">
                  Notifications are blocked
                </p>
                <p className="text-xs text-red-700 mt-1">
                  To enable notifications, please allow them in your browser settings
                </p>
              </div>
            </div>
            
            <div className="text-xs text-muted-foreground space-y-2">
              <p><strong>Chrome/Edge:</strong> Click the lock icon in the address bar</p>
              <p><strong>Safari:</strong> Go to Safari → Settings → Websites → Notifications</p>
              <p><strong>Firefox:</strong> Click the shield icon in the address bar</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}