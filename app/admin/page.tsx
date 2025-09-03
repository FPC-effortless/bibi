'use client'

import ProductTable from "@/components/product-table"

export default function AdminDashboard() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-serif font-bold text-foreground mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage your product catalog and inventory</p>
        </div>
        
        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-card rounded-lg border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Products</p>
                <p className="text-2xl font-bold">24</p>
              </div>
              <div className="h-8 w-8 bg-bibiere-burgundy/10 rounded-full flex items-center justify-center">
                <span className="text-bibiere-burgundy text-sm">📦</span>
              </div>
            </div>
          </div>
          
          <div className="bg-card rounded-lg border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Products</p>
                <p className="text-2xl font-bold">18</p>
              </div>
              <div className="h-8 w-8 bg-green-500/10 rounded-full flex items-center justify-center">
                <span className="text-green-500 text-sm">✅</span>
              </div>
            </div>
          </div>
          
          <div className="bg-card rounded-lg border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Low Stock</p>
                <p className="text-2xl font-bold">3</p>
              </div>
              <div className="h-8 w-8 bg-orange-500/10 rounded-full flex items-center justify-center">
                <span className="text-orange-500 text-sm">⚠️</span>
              </div>
            </div>
          </div>
          
          <div className="bg-card rounded-lg border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Value</p>
                <p className="text-2xl font-bold">$12.4K</p>
              </div>
              <div className="h-8 w-8 bg-bibiere-gold/10 rounded-full flex items-center justify-center">
                <span className="text-bibiere-gold text-sm">💰</span>
              </div>
            </div>
          </div>
        </div>
        
        <ProductTable />
      </div>
    </div>
  )
}
