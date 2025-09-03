"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { FileText, Download, Calendar as CalendarIcon, TrendingUp, Users, ShoppingCart, DollarSign } from "lucide-react"
import { format } from "date-fns"

// Mock reports data
const reportTypes = [
  { id: "sales", name: "Sales Report", description: "Revenue, orders, and sales performance" },
  { id: "customers", name: "Customer Report", description: "Customer acquisition and retention metrics" },
  { id: "inventory", name: "Inventory Report", description: "Stock levels and inventory turnover" },
  { id: "products", name: "Product Performance", description: "Best sellers and product analytics" },
  { id: "financial", name: "Financial Report", description: "Profit, expenses, and financial overview" }
]

const recentReports = [
  {
    id: "rpt-001",
    name: "Monthly Sales Report - January 2024",
    type: "Sales",
    generatedAt: "2024-01-25 09:00",
    size: "2.3 MB",
    status: "completed"
  },
  {
    id: "rpt-002", 
    name: "Customer Acquisition Report - Q4 2023",
    type: "Customer",
    generatedAt: "2024-01-20 14:30",
    size: "1.8 MB",
    status: "completed"
  },
  {
    id: "rpt-003",
    name: "Inventory Status Report - January 2024",
    type: "Inventory",
    generatedAt: "2024-01-18 11:15",
    size: "956 KB",
    status: "completed"
  },
  {
    id: "rpt-004",
    name: "Product Performance Report - 2023 Annual",
    type: "Product",
    generatedAt: "2024-01-15 16:45",
    size: "3.1 MB",
    status: "completed"
  }
]

const quickStats = {
  totalRevenue: 145750,
  totalOrders: 324,
  totalCustomers: 1247,
  avgOrderValue: 450
}

export default function AdminReportsPage() {
  const [selectedReportType, setSelectedReportType] = useState("sales")
  const [dateRange, setDateRange] = useState("30days")
  const [startDate, setStartDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()

  const generateReport = () => {
    // Mock report generation
    console.log("Generating report:", { selectedReportType, dateRange, startDate, endDate })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold">Reports</h1>
          <p className="text-muted-foreground">Generate and download business reports</p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Total Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${quickStats.totalRevenue.toLocaleString()}</div>
            <div className="text-sm text-green-600 flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3" />
              +12.5% from last month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <ShoppingCart className="w-4 h-4" />
              Total Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{quickStats.totalOrders}</div>
            <div className="text-sm text-green-600 flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3" />
              +8.2% from last month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Users className="w-4 h-4" />
              Total Customers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{quickStats.totalCustomers}</div>
            <div className="text-sm text-green-600 flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3" />
              +15.3% from last month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Avg Order Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${quickStats.avgOrderValue}</div>
            <div className="text-sm text-red-600 flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3 rotate-180" />
              -2.1% from last month
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="generate" className="space-y-6">
        <TabsList>
          <TabsTrigger value="generate">Generate Reports</TabsTrigger>
          <TabsTrigger value="recent">Recent Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="generate" className="space-y-6">
          {/* Report Generator */}
          <Card>
            <CardHeader>
              <CardTitle>Generate New Report</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Report Type Selection */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {reportTypes.map((type) => (
                  <div
                    key={type.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      selectedReportType === type.id
                        ? "border-bibiere-burgundy bg-bibiere-burgundy/5"
                        : "border-border hover:border-bibiere-burgundy/50"
                    }`}
                    onClick={() => setSelectedReportType(type.id)}
                  >
                    <div className="flex items-start gap-3">
                      <FileText className="w-5 h-5 text-bibiere-burgundy mt-0.5" />
                      <div>
                        <h3 className="font-medium">{type.name}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{type.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Date Range Selection */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Date Range</h3>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Select value={dateRange} onValueChange={setDateRange}>
                    <SelectTrigger className="w-full sm:w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7days">Last 7 days</SelectItem>
                      <SelectItem value="30days">Last 30 days</SelectItem>
                      <SelectItem value="90days">Last 90 days</SelectItem>
                      <SelectItem value="1year">Last year</SelectItem>
                      <SelectItem value="custom">Custom range</SelectItem>
                    </SelectContent>
                  </Select>

                  {dateRange === "custom" && (
                    <div className="flex gap-2">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-48 justify-start text-left font-normal">
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {startDate ? format(startDate, "PPP") : "Start date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={startDate}
                            onSelect={setStartDate}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>

                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-48 justify-start text-left font-normal">
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {endDate ? format(endDate, "PPP") : "End date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={endDate}
                            onSelect={setEndDate}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  )}
                </div>
              </div>

              {/* Generate Button */}
              <div className="flex justify-end">
                <Button onClick={generateReport} className="px-8">
                  <FileText className="w-4 h-4 mr-2" />
                  Generate Report
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recent" className="space-y-6">
          {/* Recent Reports */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentReports.map((report) => (
                  <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-bibiere-burgundy" />
                      <div>
                        <h3 className="font-medium">{report.name}</h3>
                        <div className="text-sm text-muted-foreground">
                          {report.type} • Generated {report.generatedAt} • {report.size}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-1" />
                        Download
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Report Templates */}
      <Card>
        <CardHeader>
          <CardTitle>Popular Report Templates</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium mb-2">Monthly Business Review</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Comprehensive monthly overview including sales, customers, and inventory
              </p>
              <Button variant="outline" size="sm">Use Template</Button>
            </div>

            <div className="p-4 border rounded-lg">
              <h3 className="font-medium mb-2">Quarterly Financial Summary</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Financial performance and profitability analysis for quarterly reviews
              </p>
              <Button variant="outline" size="sm">Use Template</Button>
            </div>

            <div className="p-4 border rounded-lg">
              <h3 className="font-medium mb-2">Product Performance Analysis</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Detailed analysis of product sales, returns, and customer feedback
              </p>
              <Button variant="outline" size="sm">Use Template</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
