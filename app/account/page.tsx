"use client"

import { useState } from "react"
import AccountSidebar from "@/components/account-sidebar"
import WishlistView from "@/components/wishlist-view"
import WardrobeView from "@/components/wardrobe-view"

export default function AccountPage() {
  const [activeView, setActiveView] = useState<"wishlist" | "wardrobe">("wishlist")

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        <AccountSidebar activeView={activeView} onViewChange={setActiveView} />

        <div className="flex-1">
          {activeView === "wishlist" && <WishlistView />}
          {activeView === "wardrobe" && <WardrobeView />}
        </div>
      </div>
    </div>
  )
}
