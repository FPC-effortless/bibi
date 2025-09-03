"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  BarChart3, 
  Settings,
  ChevronLeft,
  ChevronRight,
  Truck,
  CreditCard,
  MessageSquare,
  FileText,
  Mail,
  Percent,
  Star,
  Folder,
  Camera
} from "lucide-react"

interface AdminSidebarProps {
  className?: string
}

const navigationItems = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Products",
    href: "/admin/products",
    icon: Package,
  },
  {
    title: "New Arrivals",
    href: "/admin/new-arrivals",
    icon: Star,
  },
  {
    title: "Collections",
    href: "/admin/collections",
    icon: Folder,
  },
  {
    title: "Lookbook",
    href: "/admin/lookbook",
    icon: Camera,
  },
  {
    title: "Orders",
    href: "/admin/orders",
    icon: ShoppingCart,
  },
  {
    title: "Customers",
    href: "/admin/customers",
    icon: Users,
  },
  {
    title: "Emails",
    href: "/admin/emails",
    icon: Mail,
  },
  {
    title: "Coupons",
    href: "/admin/coupons",
    icon: Percent,
  },
  {
    title: "Analytics",
    href: "/admin/analytics",
    icon: BarChart3,
  },
  {
    title: "Inventory",
    href: "/admin/inventory",
    icon: Truck,
  },
  {
    title: "Payments",
    href: "/admin/payments",
    icon: CreditCard,
  },
  {
    title: "Reviews",
    href: "/admin/reviews",
    icon: MessageSquare,
  },
  {
    title: "Reports",
    href: "/admin/reports",
    icon: FileText,
  },
  {
    title: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
]

export function AdminSidebar({ className }: AdminSidebarProps) {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()

  return (
    <div className={cn(
      "relative flex flex-col bg-card border-r border-border transition-all duration-300",
      collapsed ? "w-16" : "w-64",
      className
    )}>
      {/* Toggle Button */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute -right-3 top-6 z-10 h-6 w-6 rounded-full border bg-background shadow-md"
        onClick={() => setCollapsed(!collapsed)}
      >
        {collapsed ? (
          <ChevronRight className="h-3 w-3" />
        ) : (
          <ChevronLeft className="h-3 w-3" />
        )}
      </Button>

      {/* Header */}
      <div className="flex h-16 items-center border-b border-border px-4">
        {!collapsed && (
          <h2 className="text-lg font-serif font-semibold text-foreground">
            Admin Panel
          </h2>
        )}
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-2">
          {navigationItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start gap-3 h-10",
                    collapsed && "justify-center px-2",
                    isActive && "bg-bibiere-burgundy/10 text-bibiere-burgundy hover:bg-bibiere-burgundy/20"
                  )}
                >
                  <item.icon className="h-4 w-4 flex-shrink-0" />
                  {!collapsed && (
                    <span className="truncate">{item.title}</span>
                  )}
                </Button>
              </Link>
            )
          })}
        </nav>
      </ScrollArea>

      {/* Footer */}
      {!collapsed && (
        <div className="border-t border-border p-4">
          <div className="text-xs text-muted-foreground">
            <p className="font-medium">Bibiere Admin</p>
            <p>v1.0.0</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminSidebar
