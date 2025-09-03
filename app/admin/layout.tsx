'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { isAdminAuthenticated, redirectToLogin } from '@/lib/admin-auth'
import { LoadingSpinner } from '@/components/loading-spinner'
import AdminHeader from '@/components/admin-header'
import AdminSidebar from '@/components/admin-sidebar'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const checkAuth = () => {
      // Skip auth check for login page
      if (pathname === '/admin/login') {
        setIsLoading(false)
        return
      }

      const authenticated = isAdminAuthenticated()
      
      if (!authenticated) {
        redirectToLogin()
        return
      }
      
      setIsAuthenticated(true)
      setIsLoading(false)
    }

    checkAuth()
  }, [router, pathname])

  // Show loading for non-login pages
  if (isLoading && pathname !== '/admin/login') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  // Show login page without layout
  if (pathname === '/admin/login') {
    return children
  }

  // Redirect if not authenticated
  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader />
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
