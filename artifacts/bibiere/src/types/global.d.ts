// Global type declarations for the application

declare global {
  interface Window {
    gtag?: (
      command: 'config' | 'set' | 'event' | 'consent',
      targetId: string,
      config?: Record<string, any>
    ) => void
  }
}

export {}