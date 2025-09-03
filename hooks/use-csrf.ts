import { useState, useEffect, useCallback } from 'react'

interface CSRFTokenData {
  csrfToken: string
  expiresIn: number
}

interface UseCSRFReturn {
  token: string | null
  loading: boolean
  error: string | null
  refreshToken: () => Promise<void>
  getHeaders: () => Record<string, string>
}

export function useCSRF(): UseCSRFReturn {
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [expiresAt, setExpiresAt] = useState<number | null>(null)

  const fetchToken = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/csrf-token', {
        method: 'GET',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch CSRF token: ${response.status}`)
      }

      const data: CSRFTokenData = await response.json()
      setToken(data.csrfToken)
      setExpiresAt(Date.now() + (data.expiresIn * 1000))
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch CSRF token'
      setError(errorMessage)
      console.error('CSRF token fetch error:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  const refreshToken = useCallback(async () => {
    await fetchToken()
  }, [fetchToken])

  const getHeaders = useCallback((): Record<string, string> => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }

    if (token) {
      headers['X-CSRF-Token'] = token
    }

    return headers
  }, [token])

  // Initial token fetch
  useEffect(() => {
    fetchToken()
  }, [fetchToken])

  // Auto-refresh token before expiration
  useEffect(() => {
    if (!expiresAt) return

    const timeUntilExpiry = expiresAt - Date.now()
    const refreshTime = Math.max(timeUntilExpiry - 5 * 60 * 1000, 1000) // Refresh 5 minutes before expiry, minimum 1 second

    const timeoutId = setTimeout(() => {
      fetchToken()
    }, refreshTime)

    return () => clearTimeout(timeoutId)
  }, [expiresAt, fetchToken])

  return {
    token,
    loading,
    error,
    refreshToken,
    getHeaders,
  }
}

// Hook for making secure API requests
export function useSecureRequest() {
  const { getHeaders, token, loading } = useCSRF()

  const secureRequest = useCallback(async (
    url: string,
    options: RequestInit = {}
  ): Promise<Response> => {
    if (loading || !token) {
      throw new Error('CSRF token not available')
    }

    const headers = {
      ...getHeaders(),
      ...options.headers,
    }

    return fetch(url, {
      ...options,
      headers,
      credentials: 'same-origin',
    })
  }, [getHeaders, token, loading])

  const securePost = useCallback(async (
    url: string,
    data: any,
    options: RequestInit = {}
  ): Promise<Response> => {
    return secureRequest(url, {
      method: 'POST',
      body: JSON.stringify(data),
      ...options,
    })
  }, [secureRequest])

  const securePut = useCallback(async (
    url: string,
    data: any,
    options: RequestInit = {}
  ): Promise<Response> => {
    return secureRequest(url, {
      method: 'PUT',
      body: JSON.stringify(data),
      ...options,
    })
  }, [secureRequest])

  const secureDelete = useCallback(async (
    url: string,
    options: RequestInit = {}
  ): Promise<Response> => {
    return secureRequest(url, {
      method: 'DELETE',
      ...options,
    })
  }, [secureRequest])

  return {
    secureRequest,
    securePost,
    securePut,
    secureDelete,
    token,
    loading,
    ready: !loading && !!token,
  }
}