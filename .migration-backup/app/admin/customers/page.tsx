'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Eye, Mail, Phone, MapPin } from "lucide-react"

// Mock customer data
const mockCustomers = [
  {
    id: "CUST-001",
    name: "Emma Thompson",
    email: "emma@example.com",
    phone: "+1 (555) 123-4567",
    location: "New York, NY",
    orders: 12,
    totalSpent: 2899.99,
    status: "active",
    joinDate: "2023-06-15",
    lastOrder: "2024-08-24"
  },
  {
    id: "CUST-002",
    name: "James Wilson", 
    email: "james@example.com",
    phone: "+1 (555) 234-5678",
    location: "Los Angeles, CA",
    orders: 8,
    totalSpent: 1599.99,
    status: "active",
    joinDate: "2023-08-22",
    lastOrder: "2024-08-23"
  },
  {
    id: "CUST-003",
    name: "Sarah Davis",
    email: "sarah@example.com",
    phone: "+1 (555) 345-6789", 
    location: "Chicago, IL",
    orders: 15,
    totalSpent: 3499.99,
    status: "vip",
    joinDate: "2023-03-10",
    lastOrder: "2024-08-22"
  },
  {
    id: "CUST-004",
    name: "Michael Brown",
    email: "michael@example.com",
    phone: "+1 (555) 456-7890",
    location: "Houston, TX", 
    orders: 5,
    totalSpent: 899.99,
    status: "active",
    joinDate: "2024-01-18",
    lastOrder: "2024-08-21"
  },
  {
    id: "CUST-005",
    name: "Lisa Garcia",
    email: "lisa@example.com",
    phone: "+1 (555) 567-8901",
    location: "Phoenix, AZ",
    orders: 2,
    totalSpent: 399.99,
    status: "inactive",
    joinDate: "2024-05-03",
    lastOrder: "2024-06-15"
  }
]

const statusColors = {
  active: "bg-green-100 text-green-800",
  vip: "bg-purple-100 text-purple-800",
  inactive: "bg-gray-100 text-gray-800"
}

export default function CustomersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [customers] = useState(mockCustomers)

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.id.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-serif font-bold text-foreground mb-2">Customer Management</h2>
          <p className="text-muted-foreground">View and manage customer accounts</p>
        </div>

        {/* Search */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button className="bg-bibiere-burgundy hover:bg-bibiere-burgundy/90 text-white">
            Export Customer Data
          </Button>
        </div>

        {/* Customer Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-card rounded-lg border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Customers</p>
                <p className="text-2xl font-bold">{customers.length}</p>
              </div>
              <div className="h-8 w-8 bg-bibiere-burgundy/10 rounded-full flex items-center justify-center">
                <span className="text-bibiere-burgundy text-sm">👥</span>
              </div>
            </div>
          </div>
          
          <div className="bg-card rounded-lg border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Customers</p>
                <p className="text-2xl font-bold">{customers.filter(c => c.status === 'active').length}</p>
              </div>
              <div className="h-8 w-8 bg-green-500/10 rounded-full flex items-center justify-center">
                <span className="text-green-500 text-sm">✅</span>
              </div>
            </div>
          </div>
          
          <div className="bg-card rounded-lg border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">VIP Customers</p>
                <p className="text-2xl font-bold">{customers.filter(c => c.status === 'vip').length}</p>
              </div>
              <div className="h-8 w-8 bg-purple-500/10 rounded-full flex items-center justify-center">
                <span className="text-purple-500 text-sm">👑</span>
              </div>
            </div>
          </div>
          
          <div className="bg-card rounded-lg border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg. Order Value</p>
                <p className="text-2xl font-bold">$289</p>
              </div>
              <div className="h-8 w-8 bg-bibiere-gold/10 rounded-full flex items-center justify-center">
                <span className="text-bibiere-gold text-sm">💰</span>
              </div>
            </div>
          </div>
        </div>

        {/* Customers Table */}
        <div className="rounded-lg border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Orders</TableHead>
                <TableHead>Total Spent</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Order</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={`/avatars/${customer.id}.jpg`} />
                        <AvatarFallback className="bg-bibiere-burgundy/10 text-bibiere-burgundy">
                          {getInitials(customer.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{customer.name}</p>
                        <p className="text-sm text-muted-foreground">{customer.id}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <Mail className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm">{customer.email}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Phone className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm">{customer.phone}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-3 w-3 text-muted-foreground" />
                      <span className="text-sm">{customer.location}</span>
                    </div>
                  </TableCell>
                  <TableCell>{customer.orders}</TableCell>
                  <TableCell>${customer.totalSpent.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge className={statusColors[customer.status as keyof typeof statusColors]}>
                      {customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>{customer.lastOrder}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Mail className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}
