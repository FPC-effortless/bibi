export function isAdminAuthenticated(): boolean {
  if (typeof window === 'undefined') return false
  
  const token = localStorage.getItem('adminToken')
  return !!token
}

export function getAdminToken(): string | null {
  if (typeof window === 'undefined') return null
  
  return localStorage.getItem('adminToken')
}

export function clearAdminAuth(): void {
  if (typeof window === 'undefined') return
  
  localStorage.removeItem('adminToken')
}

export function redirectToLogin(): void {
  if (typeof window === 'undefined') return
  
  window.location.href = '/admin/login'
}