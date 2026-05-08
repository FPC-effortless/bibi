"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Globe, Check } from "lucide-react"
import { useTranslation, type Locale } from "@/lib/i18n"

interface LanguageSelectorProps {
  variant?: "header" | "footer" | "mobile"
  className?: string
}

export default function LanguageSelector({ 
  variant = "header", 
  className = "" 
}: LanguageSelectorProps) {
  const { locale, setLocale, supportedLocales } = useTranslation()
  const [isChanging, setIsChanging] = useState(false)

  const handleLocaleChange = async (newLocale: Locale) => {
    if (newLocale === locale || isChanging) return

    setIsChanging(true)
    try {
      await setLocale(newLocale)
      
      // Update URL without page reload
      const url = new URL(window.location.href)
      url.searchParams.set('lang', newLocale)
      window.history.replaceState({}, '', url.toString())
      
    } catch (error) {
      console.error('Failed to change language:', error)
    } finally {
      setIsChanging(false)
    }
  }

  const currentLocaleConfig = supportedLocales.find(l => l.code === locale)

  if (variant === "mobile") {
    return (
      <div className={`space-y-2 ${className}`}>
        <h4 className="font-medium text-sm text-foreground mb-3">Language</h4>
        <div className="space-y-1">
          {supportedLocales.map((localeConfig) => (
            <button
              key={localeConfig.code}
              onClick={() => handleLocaleChange(localeConfig.code)}
              disabled={isChanging}
              className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-lg transition-colors ${
                locale === localeConfig.code
                  ? 'bg-bibiere-burgundy text-white'
                  : 'text-foreground hover:bg-muted'
              }`}
            >
              <div className="flex items-center space-x-3">
                <span className="text-lg">{localeConfig.flag}</span>
                <span>{localeConfig.nativeName}</span>
              </div>
              {locale === localeConfig.code && (
                <Check className="h-4 w-4" />
              )}
            </button>
          ))}
        </div>
      </div>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={variant === "footer" ? "ghost" : "outline"}
          size="sm"
          disabled={isChanging}
          className={`${className} ${
            variant === "footer" 
              ? "text-muted-foreground hover:text-foreground" 
              : ""
          }`}
        >
          <Globe className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">
            {currentLocaleConfig?.nativeName || 'English'}
          </span>
          <span className="sm:hidden text-lg ml-1">
            {currentLocaleConfig?.flag || '🇺🇸'}
          </span>
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-48">
        {supportedLocales.map((localeConfig) => (
          <DropdownMenuItem
            key={localeConfig.code}
            onClick={() => handleLocaleChange(localeConfig.code)}
            disabled={isChanging}
            className={`flex items-center justify-between cursor-pointer ${
              locale === localeConfig.code ? 'bg-muted' : ''
            }`}
          >
            <div className="flex items-center space-x-3">
              <span className="text-lg">{localeConfig.flag}</span>
              <div className="flex flex-col">
                <span className="font-medium">{localeConfig.nativeName}</span>
                <span className="text-xs text-muted-foreground">
                  {localeConfig.name}
                </span>
              </div>
            </div>
            {locale === localeConfig.code && (
              <Check className="h-4 w-4 text-bibiere-burgundy" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
