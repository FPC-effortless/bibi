import type React from "react"
import type { Metadata, Viewport } from "next"
import "./globals.css"
import Header from "@/components/header"
import Footer from "@/components/footer"
import ErrorBoundary from "@/components/error-boundary"
import PWAInstallPrompt from "@/components/pwa-install-prompt"
import MobileOptimizationProvider from "@/components/mobile-optimization-provider"
import CookieConsentBanner from "@/components/cookie-consent-banner"
import { CommerceProvider } from "@/components/commerce-provider"

export const metadata: Metadata = {
  title: "bibiere - Timeless Luxury Redefined",
  description: "Timeless luxury redefined. Discover bibiere's collection of exquisite pieces crafted for the discerning individual.",
  generator: "bibiere",
  keywords: "bibiere, timeless luxury, elegant fashion, sophisticated style, premium craftsmanship",
  authors: [{ name: "bibiere" }],
  creator: "bibiere",
  publisher: "bibiere",
  manifest: "/manifest.json",
  openGraph: {
    title: "bibiere - Timeless Luxury Redefined",
    description: "Timeless luxury redefined. Discover bibiere's collection of exquisite pieces crafted for the discerning individual.",
    siteName: "bibiere",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "bibiere - Timeless Luxury Redefined",
    description: "Timeless luxury redefined. Discover bibiere's collection of exquisite pieces crafted for the discerning individual.",
    creator: "@bibiere",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "bibiere",
  },
}

export const viewport: Viewport = {
  themeColor: "#8B1538",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <ErrorBoundary>
          <MobileOptimizationProvider>
            <CommerceProvider>
              <Header />
              {children}
              <Footer />
              <PWAInstallPrompt />
              <CookieConsentBanner />
            </CommerceProvider>
          </MobileOptimizationProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}
