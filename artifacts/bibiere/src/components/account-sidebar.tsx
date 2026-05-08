
import { cn } from "@/lib/utils"
import { Heart, ShirtIcon, User, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"

interface AccountSidebarProps {
  activeView: "wishlist" | "wardrobe"
  onViewChange: (view: "wishlist" | "wardrobe") => void
}

export default function AccountSidebar({ activeView, onViewChange }: AccountSidebarProps) {
  const menuItems = [
    {
      id: "wishlist" as const,
      label: "Wishlist",
      icon: Heart,
    },
    {
      id: "wardrobe" as const,
      label: "My Wardrobe",
      icon: ShirtIcon,
    },
  ]

  return (
    <div className="w-64 bg-sidebar border-r border-sidebar-border h-full">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-sidebar-accent rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-sidebar-accent-foreground" />
          </div>
          <div>
            <h2 className="font-serif text-lg font-semibold text-sidebar-foreground">My Account</h2>
            <p className="text-sm text-sidebar-foreground/70">Welcome back</p>
          </div>
        </div>

        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            return (
              <Button
                key={item.id}
                variant="ghost"
                className={cn(
                  "w-full justify-start gap-3 h-12 text-sidebar-foreground hover:bg-sidebar-primary hover:text-sidebar-primary-foreground",
                  activeView === item.id &&
                    "bg-sidebar-accent text-sidebar-accent-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                )}
                onClick={() => onViewChange(item.id)}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </Button>
            )
          })}
        </nav>

        <div className="mt-8 pt-8 border-t border-sidebar-border">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 h-12 text-sidebar-foreground hover:bg-sidebar-primary hover:text-sidebar-primary-foreground"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  )
}
