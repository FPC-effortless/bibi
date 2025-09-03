import type React from "react"
import type { Metadata } from "next"
import { DM_Sans } from "next/font/google"
import { Playfair_Display } from "next/font/google"
import "./globals.css"
import Header from "@/components/header"
import Footer from "@/components/footer"
import ErrorBoundary from "@/components/error-boundary"
import PWAInstallPrompt from "@/components/pwa-install-prompt"
import MobileOptimizationProvider from "@/components/mobile-optimization-provider"
import CookieConsentBanner from "@/components/cookie-consent-banner"

const dmSans = DM_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-dm-sans",
})

const playfair = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-playfair",
})

export const metadata: Metadata = {
  title: "bibiere - Timeless Luxury Redefined",
  description: "Timeless luxury redefined. Discover bibiere's collection of exquisite pieces crafted for the discerning individual.",
  generator: "bibiere",
  keywords: "bibiere, timeless luxury, elegant fashion, sophisticated style, premium craftsmanship",
  authors: [{ name: "bibiere" }],
  creator: "bibiere",
  publisher: "bibiere",
  manifest: "/manifest.json",
  themeColor: "#8B1538",
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${dmSans.variable} ${playfair.variable}`}>
      <body className="font-sans antialiased">
        <ErrorBoundary>
          <MobileOptimizationProvider>
            <Header />
            {children}
            <Footer />
            <PWAInstallPrompt />
            <CookieConsentBanner />
          </MobileOptimizationProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}
