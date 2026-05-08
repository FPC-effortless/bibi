
import React, { createContext, useContext, useEffect, useState } from 'react'

interface CSPNonceContextType {
  nonce: string | null
  loading: boolean
}

const CSPNonceContext = createContext<CSPNonceContextType>({
  nonce: null,
  loading: true,
})

export function useCSPNonce(): CSPNonceContextType {
  return useContext(CSPNonceContext)
}

interface CSPNonceProviderProps {
  children: React.ReactNode
  initialNonce?: string
}

export function CSPNonceProvider({ children, initialNonce }: CSPNonceProviderProps) {
  const [nonce, setNonce] = useState<string | null>(initialNonce || null)
  const [loading, setLoading] = useState(!initialNonce)

  useEffect(() => {
    // If no initial nonce provided, try to get it from meta tag or header
    if (!initialNonce) {
      // Check for nonce in meta tag (set by server)
      const metaNonce = document.querySelector('meta[name="csp-nonce"]')?.getAttribute('content')
      if (metaNonce) {
        setNonce(metaNonce)
        setLoading(false)
        return
      }

      // Check for nonce in response headers (if available)
      const headerNonce = document.querySelector('meta[name="x-csp-nonce"]')?.getAttribute('content')
      if (headerNonce) {
        setNonce(headerNonce)
        setLoading(false)
        return
      }

      // If no nonce found, set loading to false anyway
      setLoading(false)
    }
  }, [initialNonce])

  const contextValue: CSPNonceContextType = {
    nonce,
    loading,
  }

  return (
    <CSPNonceContext.Provider value={contextValue}>
      {children}
    </CSPNonceContext.Provider>
  )
}

// Hook for creating inline scripts with nonce
export function useInlineScript(script: string, dependencies: any[] = []) {
  const { nonce } = useCSPNonce()

  useEffect(() => {
    if (!nonce || !script) return

    const scriptElement = document.createElement('script')
    scriptElement.nonce = nonce
    scriptElement.textContent = script
    document.head.appendChild(scriptElement)

    return () => {
      if (scriptElement.parentNode) {
        scriptElement.parentNode.removeChild(scriptElement)
      }
    }
  }, [script, nonce, ...dependencies])
}

// Hook for creating inline styles with nonce
export function useInlineStyle(css: string, dependencies: any[] = []) {
  const { nonce } = useCSPNonce()

  useEffect(() => {
    if (!nonce || !css) return

    const styleElement = document.createElement('style')
    styleElement.nonce = nonce
    styleElement.textContent = css
    document.head.appendChild(styleElement)

    return () => {
      if (styleElement.parentNode) {
        styleElement.parentNode.removeChild(styleElement)
      }
    }
  }, [css, nonce, ...dependencies])
}

// Component for inline scripts with nonce
interface InlineScriptProps {
  children: string
  id?: string
}

export function InlineScript({ children, id }: InlineScriptProps) {
  const { nonce } = useCSPNonce()

  if (!nonce) {
    return null
  }

  return (
    <script
      id={id}
      nonce={nonce}
      dangerouslySetInnerHTML={{ __html: children }}
    />
  )
}

// Component for inline styles with nonce
interface InlineStyleProps {
  children: string
  id?: string
}

export function InlineStyle({ children, id }: InlineStyleProps) {
  const { nonce } = useCSPNonce()

  if (!nonce) {
    return null
  }

  return (
    <style
      id={id}
      nonce={nonce}
      dangerouslySetInnerHTML={{ __html: children }}
    />
  )
}