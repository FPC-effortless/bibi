"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Settings, Save, Shield, Bell, Palette, Globe, CreditCard, Mail } from "lucide-react"

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState({
    // General Settings
    siteName: "bibiere",
    siteDescription: "Luxury fashion e-commerce platform",
    adminEmail: "admin@bibiere.com",
    timezone: "UTC",
    currency: "USD",
    
    // Notifications
    emailNotifications: true,
    orderNotifications: true,
    lowStockAlerts: true,
    customerNotifications: true,
    
    // Security
    twoFactorAuth: false,
    sessionTimeout: 30,
    passwordExpiry: 90,
    
    // Appearance
    theme: "light",
    sidebarCollapsed: false,
    
    // Business Settings
    taxRate: 8.5,
    shippingRate: 15.00,
    freeShippingThreshold: 100,
    returnPeriod: 30
  })

  const handleSave = () => {
    // Mock save functionality
    console.log("Saving settings:", settings)
  }

  const updateSetting = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold">Settings</h1>
          <p className="text-muted-foreground">Configure system preferences and business settings</p>
        </div>
        <Button onClick={handleSave}>
          <Save className="w-4 h-4 mr-2" />
          Save Changes
        </Button>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="business">Business</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                General Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="siteName">Site Name</Label>
                  <Input
                    id="siteName"
                    value={settings.siteName}
                    onChange={(e) => updateSetting("siteName", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="adminEmail">Admin Email</Label>
                  <Input
                    id="adminEmail"
                    type="email"
                    value={settings.adminEmail}
                    onChange={(e) => updateSetting("adminEmail", e.target.value)}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="siteDescription">Site Description</Label>
                <Textarea
                  id="siteDescription"
                  value={settings.siteDescription}
                  onChange={(e) => updateSetting("siteDescription", e.target.value)}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select value={settings.timezone} onValueChange={(value) => updateSetting("timezone", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UTC">UTC</SelectItem>
                      <SelectItem value="EST">Eastern Time</SelectItem>
                      <SelectItem value="PST">Pacific Time</SelectItem>
                      <SelectItem value="GMT">Greenwich Mean Time</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency">Default Currency</Label>
                  <Select value={settings.currency} onValueChange={(value) => updateSetting("currency", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD ($)</SelectItem>
                      <SelectItem value="EUR">EUR (€)</SelectItem>
                      <SelectItem value="GBP">GBP (£)</SelectItem>
                      <SelectItem value="CAD">CAD (C$)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Notification Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="emailNotifications">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive email notifications for important events</p>
                  </div>
                  <Switch
                    id="emailNotifications"
                    checked={settings.emailNotifications}
                    onCheckedChange={(checked) => updateSetting("emailNotifications", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="orderNotifications">Order Notifications</Label>
                    <p className="text-sm text-muted-foreground">Get notified when new orders are placed</p>
                  </div>
                  <Switch
                    id="orderNotifications"
                    checked={settings.orderNotifications}
                    onCheckedChange={(checked) => updateSetting("orderNotifications", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="lowStockAlerts">Low Stock Alerts</Label>
                    <p className="text-sm text-muted-foreground">Receive alerts when inventory is running low</p>
                  </div>
                  <Switch
                    id="lowStockAlerts"
                    checked={settings.lowStockAlerts}
                    onCheckedChange={(checked) => updateSetting("lowStockAlerts", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="customerNotifications">Customer Notifications</Label>
                    <p className="text-sm text-muted-foreground">Notifications for customer inquiries and reviews</p>
                  </div>
                  <Switch
                    id="customerNotifications"
                    checked={settings.customerNotifications}
                    onCheckedChange={(checked) => updateSetting("customerNotifications", checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Security Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="twoFactorAuth">Two-Factor Authentication</Label>
                  <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                </div>
                <Switch
                  id="twoFactorAuth"
                  checked={settings.twoFactorAuth}
                  onCheckedChange={(checked) => updateSetting("twoFactorAuth", checked)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                  <Input
                    id="sessionTimeout"
                    type="number"
                    value={settings.sessionTimeout}
                    onChange={(e) => updateSetting("sessionTimeout", parseInt(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="passwordExpiry">Password Expiry (days)</Label>
                  <Input
                    id="passwordExpiry"
                    type="number"
                    value={settings.passwordExpiry}
                    onChange={(e) => updateSetting("passwordExpiry", parseInt(e.target.value))}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <Button variant="outline">Change Password</Button>
                <Button variant="outline">Download Security Log</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="w-5 h-5" />
                Appearance Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="theme">Theme</Label>
                <Select value={settings.theme} onValueChange={(value) => updateSetting("theme", value)}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="sidebarCollapsed">Collapsed Sidebar</Label>
                  <p className="text-sm text-muted-foreground">Start with sidebar collapsed by default</p>
                </div>
                <Switch
                  id="sidebarCollapsed"
                  checked={settings.sidebarCollapsed}
                  onCheckedChange={(checked) => updateSetting("sidebarCollapsed", checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="business" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5" />
                Business Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="taxRate">Tax Rate (%)</Label>
                  <Input
                    id="taxRate"
                    type="number"
                    step="0.1"
                    value={settings.taxRate}
                    onChange={(e) => updateSetting("taxRate", parseFloat(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="shippingRate">Shipping Rate ($)</Label>
                  <Input
                    id="shippingRate"
                    type="number"
                    step="0.01"
                    value={settings.shippingRate}
                    onChange={(e) => updateSetting("shippingRate", parseFloat(e.target.value))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="freeShippingThreshold">Free Shipping Threshold ($)</Label>
                  <Input
                    id="freeShippingThreshold"
                    type="number"
                    value={settings.freeShippingThreshold}
                    onChange={(e) => updateSetting("freeShippingThreshold", parseFloat(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="returnPeriod">Return Period (days)</Label>
                  <Input
                    id="returnPeriod"
                    type="number"
                    value={settings.returnPeriod}
                    onChange={(e) => updateSetting("returnPeriod", parseInt(e.target.value))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Payment Integrations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <CreditCard className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">Stripe</h3>
                      <p className="text-sm text-muted-foreground">Credit card processing</p>
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <CreditCard className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">PayPal</h3>
                      <p className="text-sm text-muted-foreground">PayPal payments</p>
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="w-5 h-5" />
                Email Integrations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                    <Mail className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">SendGrid</h3>
                    <p className="text-sm text-muted-foreground">Transactional emails</p>
                  </div>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
