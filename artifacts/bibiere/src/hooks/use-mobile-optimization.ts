import { useState, useEffect, useCallback } from "react"

type NotificationPermission = "granted" | "denied" | "default"
type HapticFeedbackType = "light" | "medium" | "heavy" | "selection"

interface NotificationPreferences {
  [key: string]: boolean
}

interface MobileOptimizationResult {
  isMobile: boolean
  isOptimized: boolean
  notificationPermission: NotificationPermission
  isNotificationSupported: boolean
  isSubscribedToNotifications: boolean
  requestNotificationPermission: () => Promise<NotificationPermission>
  updateNotificationPreferences: (prefs: NotificationPreferences) => Promise<void>
  getNotificationPreferences: () => NotificationPreferences | null
  triggerHapticFeedback: (type: HapticFeedbackType) => void
  preloadCriticalResources: (urls: string[]) => void
  optimizeImagesForMobile: () => void
  addButtonAnimation: (element: HTMLElement) => void
}

const MOBILE_BREAKPOINT = 768
const PREFS_STORAGE_KEY = "bibiere_notification_prefs"

export function useMobileOptimization(): MobileOptimizationResult {
  const [isMobile, setIsMobile] = useState(false)
  const [isOptimized, setIsOptimized] = useState(false)
  const [notificationPermission, setNotificationPermission] =
    useState<NotificationPermission>("default")
  const [isSubscribedToNotifications, setIsSubscribedToNotifications] =
    useState(false)

  const isNotificationSupported =
    typeof window !== "undefined" && "Notification" in window

  // Track mobile state
  useEffect(() => {
    if (typeof window === "undefined") return
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    mql.addEventListener("change", onChange)
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  // Sync notification permission
  useEffect(() => {
    if (!isNotificationSupported) return
    setNotificationPermission(Notification.permission as NotificationPermission)
    setIsSubscribedToNotifications(Notification.permission === "granted")
    setIsOptimized(true)
  }, [isNotificationSupported])

  const requestNotificationPermission =
    useCallback(async (): Promise<NotificationPermission> => {
      if (!isNotificationSupported) return "denied"
      const result = await Notification.requestPermission()
      const permission = result as NotificationPermission
      setNotificationPermission(permission)
      setIsSubscribedToNotifications(permission === "granted")
      return permission
    }, [isNotificationSupported])

  const updateNotificationPreferences = useCallback(
    async (prefs: NotificationPreferences): Promise<void> => {
      try {
        localStorage.setItem(PREFS_STORAGE_KEY, JSON.stringify(prefs))
      } catch {
        // ignore storage errors
      }
    },
    []
  )

  const getNotificationPreferences =
    useCallback((): NotificationPreferences | null => {
      try {
        const raw = localStorage.getItem(PREFS_STORAGE_KEY)
        return raw ? (JSON.parse(raw) as NotificationPreferences) : null
      } catch {
        return null
      }
    }, [])

  const triggerHapticFeedback = useCallback(
    (type: HapticFeedbackType): void => {
      if (typeof window === "undefined" || !("vibrate" in navigator)) return
      const patterns: Record<HapticFeedbackType, number | number[]> = {
        light: 10,
        medium: 20,
        heavy: 40,
        selection: [5, 5, 5],
      }
      navigator.vibrate(patterns[type])
    },
    []
  )

  const preloadCriticalResources = useCallback((urls: string[]): void => {
    if (typeof document === "undefined") return
    urls.forEach((url) => {
      const link = document.createElement("link")
      link.rel = "preload"
      link.href = url
      if (url.endsWith(".woff2")) link.setAttribute("as", "font")
      else if (url.match(/\.(png|jpg|webp|avif)$/)) link.setAttribute("as", "image")
      document.head.appendChild(link)
    })
  }, [])

  const optimizeImagesForMobile = useCallback((): void => {
    if (typeof document === "undefined") return
    document.querySelectorAll<HTMLImageElement>("img:not([loading])").forEach((img) => {
      img.loading = "lazy"
      img.decoding = "async"
    })
  }, [])

  const addButtonAnimation = useCallback((element: HTMLElement): void => {
    if (element.dataset.mobileAnimated) return
    element.dataset.mobileAnimated = "true"
    element.addEventListener("touchstart", () => {
      element.style.transform = "scale(0.97)"
      element.style.transition = "transform 0.1s ease"
    }, { passive: true })
    element.addEventListener("touchend", () => {
      element.style.transform = ""
    }, { passive: true })
  }, [])

  return {
    isMobile,
    isOptimized,
    notificationPermission,
    isNotificationSupported,
    isSubscribedToNotifications,
    requestNotificationPermission,
    updateNotificationPreferences,
    getNotificationPreferences,
    triggerHapticFeedback,
    preloadCriticalResources,
    optimizeImagesForMobile,
    addButtonAnimation,
  }
}
