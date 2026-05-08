'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Search, 
  Plus, 
  Send, 
  Eye, 
  Edit, 
  Trash2, 
  Mail, 
  Users, 
  Calendar,
  BarChart3
} from "lucide-react"

// Mock email campaign data
const mockCampaigns = [
  {
    id: "CAM-001",
    name: "New Collection Launch",
    subject: "Discover Our Latest Luxury Collection",
    status: "sent",
    recipients: 2450,
    openRate: 68.5,
    clickRate: 12.3,
    sentDate: "2024-08-20",
    template: "product_launch"
  },
  {
    id: "CAM-002", 
    name: "Summer Sale",
    subject: "Exclusive 30% Off - Limited Time",
    status: "scheduled",
    recipients: 3200,
    openRate: 0,
    clickRate: 0,
    sentDate: "2024-08-25",
    template: "promotional"
  },
  {
    id: "CAM-003",
    name: "Welcome Series - Part 1",
    subject: "Welcome to Bibiere - Your Journey Begins",
    status: "active",
    recipients: 156,
    openRate: 85.2,
    clickRate: 23.1,
    sentDate: "2024-08-23",
    template: "welcome"
  }
]

// Mock email templates
const mockTemplates = [
  {
    id: "TPL-001",
    name: "Welcome Email",
    subject: "Welcome to Bibiere",
    type: "welcome",
    lastModified: "2024-08-15"
  },
  {
    id: "TPL-002",
    name: "Product Launch",
    subject: "New Collection Available",
    type: "product_launch", 
    lastModified: "2024-08-18"
  },
  {
    id: "TPL-003",
    name: "Promotional Sale",
    subject: "Special Offer Inside",
    type: "promotional",
    lastModified: "2024-08-10"
  }
]

const statusColors = {
  sent: "bg-green-100 text-green-800",
  scheduled: "bg-blue-100 text-blue-800",
  active: "bg-purple-100 text-purple-800",
  draft: "bg-gray-100 text-gray-800"
}

export default function EmailsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [campaigns] = useState(mockCampaigns)
  const [templates] = useState(mockTemplates)
  const [activeTab, setActiveTab] = useState("campaigns")

  const filteredCampaigns = campaigns.filter(campaign =>
    campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    campaign.subject.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredTemplates = templates.filter(template =>
    template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.subject.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-serif font-bold text-foreground mb-2">Email Management</h2>
          <p className="text-muted-foreground">Create and manage email campaigns and templates</p>
        </div>

        {/* Email Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Campaigns</CardTitle>
              <Mail className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{campaigns.length}</div>
              <p className="text-xs text-muted-foreground">Active email campaigns</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Recipients</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">5,806</div>
              <p className="text-xs text-muted-foreground">Across all campaigns</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Open Rate</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">76.9%</div>
              <p className="text-xs text-muted-foreground">+5.2% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Click Rate</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">17.7%</div>
              <p className="text-xs text-muted-foreground">+2.1% from last month</p>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="campaigns">Email Campaigns</TabsTrigger>
            <TabsTrigger value="templates">Email Templates</TabsTrigger>
            <TabsTrigger value="create">Create Campaign</TabsTrigger>
          </TabsList>

          <TabsContent value="campaigns" className="space-y-4">
            {/* Search and Actions */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search campaigns..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button className="bg-bibiere-burgundy hover:bg-bibiere-burgundy/90 text-white">
                <Plus className="mr-2 h-4 w-4" />
                New Campaign
              </Button>
            </div>

            {/* Campaigns Table */}
            <div className="rounded-lg border bg-card">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Campaign</TableHead>
                    <TableHead>Recipients</TableHead>
                    <TableHead>Open Rate</TableHead>
                    <TableHead>Click Rate</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Sent Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCampaigns.map((campaign) => (
                    <TableRow key={campaign.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{campaign.name}</p>
                          <p className="text-sm text-muted-foreground">{campaign.subject}</p>
                        </div>
                      </TableCell>
                      <TableCell>{campaign.recipients.toLocaleString()}</TableCell>
                      <TableCell>
                        {campaign.openRate > 0 ? `${campaign.openRate}%` : '-'}
                      </TableCell>
                      <TableCell>
                        {campaign.clickRate > 0 ? `${campaign.clickRate}%` : '-'}
                      </TableCell>
                      <TableCell>
                        <Badge className={statusColors[campaign.status as keyof typeof statusColors]}>
                          {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>{campaign.sentDate}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="templates" className="space-y-4">
            {/* Templates Table */}
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Email Templates</h3>
              <Button className="bg-bibiere-burgundy hover:bg-bibiere-burgundy/90 text-white">
                <Plus className="mr-2 h-4 w-4" />
                New Template
              </Button>
            </div>

            <div className="rounded-lg border bg-card">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Template Name</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Last Modified</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTemplates.map((template) => (
                    <TableRow key={template.id}>
                      <TableCell className="font-medium">{template.name}</TableCell>
                      <TableCell>{template.subject}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {template.type.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>{template.lastModified}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="create" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Create New Email Campaign</CardTitle>
                <CardDescription>Design and send email campaigns to your customers</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Campaign Name</label>
                    <Input placeholder="Enter campaign name" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email Template</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select template" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="welcome">Welcome Email</SelectItem>
                        <SelectItem value="promotional">Promotional</SelectItem>
                        <SelectItem value="product_launch">Product Launch</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Subject Line</label>
                  <Input placeholder="Enter email subject" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Email Content</label>
                  <Textarea 
                    placeholder="Enter email content..." 
                    rows={6}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Recipient List</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select recipients" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Customers</SelectItem>
                        <SelectItem value="vip">VIP Customers</SelectItem>
                        <SelectItem value="new">New Customers</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Send Time</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Send immediately" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="now">Send Now</SelectItem>
                        <SelectItem value="schedule">Schedule for Later</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button className="bg-bibiere-burgundy hover:bg-bibiere-burgundy/90 text-white">
                    <Send className="mr-2 h-4 w-4" />
                    Send Campaign
                  </Button>
                  <Button variant="outline">
                    Save as Draft
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
