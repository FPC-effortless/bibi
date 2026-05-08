"use client"

import { createContext, useContext } from "react"
import { useCommerce as useCommerceHook } from "@/hooks/use-commerce"

const CommerceContext = createContext<ReturnType<typeof useCommerceHook> | null>(null)

export function CommerceProvider({ children }: { children: React.ReactNode }) {
  const commerce = useCommerceHook()
  return <CommerceContext.Provider value={commerce}>{children}</CommerceContext.Provider>
}

export function useCommerce() {
  const context = useContext(CommerceContext)
  if (!context) {
    throw new Error("useCommerce must be used within CommerceProvider")
  }
  return context
}
