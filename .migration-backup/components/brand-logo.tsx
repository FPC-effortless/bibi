"use client"

import { cn } from "@/lib/utils"
import Link from "next/link"

interface BrandLogoProps {
  variant?: "header" | "footer" | "mobile" | "large"
  className?: string
  href?: string
  showText?: boolean
}

const sizeVariants = {
  header: {
    container: "h-8 w-auto",
    text: "text-2xl",
    svg: "h-8 w-8"
  },
  footer: {
    container: "h-6 w-auto",
    text: "text-xl",
    svg: "h-6 w-6"
  },
  mobile: {
    container: "h-7 w-auto",
    text: "text-xl",
    svg: "h-7 w-7"
  },
  large: {
    container: "h-12 w-auto",
    text: "text-4xl",
    svg: "h-12 w-12"
  }
}

const BibiereIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 120 100"
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Elegant B letterform with luxury styling */}
    <path
      d="M15 10 L15 90 L60 90 C72 90 80 82 80 70 C80 63 75 57 68 55 C74 53 78 47 78 40 C78 28 70 20 58 20 L15 20 L15 10 Z M25 30 L55 30 C62 30 66 34 66 40 C66 46 62 50 55 50 L25 50 L25 30 Z M25 60 L58 60 C65 60 69 64 69 70 C69 76 65 80 58 80 L25 80 L25 60 Z"
      fill="currentColor"
    />
    {/* Decorative flourish - elegant dots pattern */}
    <g opacity="0.8">
      <circle cx="90" cy="25" r="2.5" fill="currentColor" />
      <circle cx="96" cy="30" r="2" fill="currentColor" opacity="0.8" />
      <circle cx="102" cy="35" r="1.5" fill="currentColor" opacity="0.6" />
      <circle cx="90" cy="65" r="2.5" fill="currentColor" />
      <circle cx="96" cy="70" r="2" fill="currentColor" opacity="0.8" />
      <circle cx="102" cy="75" r="1.5" fill="currentColor" opacity="0.6" />
    </g>
    {/* Subtle underline accent */}
    <rect x="15" y="92" width="45" height="1.5" fill="currentColor" opacity="0.4" rx="0.75" />
  </svg>
)

export function BrandLogo({ 
  variant = "header", 
  className, 
  href = "/",
  showText = true 
}: BrandLogoProps) {
  const sizes = sizeVariants[variant]
  
  const logoContent = (
    <div className={cn(
      "flex items-center gap-2 transition-all duration-300 group",
      sizes.container,
      className
    )}>
      <BibiereIcon className={cn(
        sizes.svg,
        "text-bibiere-burgundy group-hover:text-bibiere-gold transition-colors duration-300"
      )} />
      {showText && (
        <span className={cn(
          "font-serif font-bold tracking-wide text-bibiere-burgundy group-hover:text-bibiere-gold transition-colors duration-300",
          sizes.text
        )}>
          bibiere
        </span>
      )}
    </div>
  )

  if (href) {
    return (
      <Link href={href} className="inline-block">
        {logoContent}
      </Link>
    )
  }

  return logoContent
}

export default BrandLogo