'use client'

import { useEffect, useState, createContext, useContext, ReactNode } from 'react'
import { useRouter } from 'next/navigation'

export interface ClientTenantInfo {
  id: string
  name: string
  slug: string
  prefix: string
  subdomain?: string
  domain?: string
  isActive: boolean
  settings?: Record<string, any>
}

export interface TenantHookState {
  tenant: ClientTenantInfo | null
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

/**
 * Custom hook for managing tenant context on the client side
 * Automatically fetches tenant info and handles loading/error states
 */
export function useTenant(): TenantHookState {
  const [tenant, setTenant] = useState<ClientTenantInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const fetchTenantInfo = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/tenant/info', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        if (response.status === 404) {
          setError('Tenant not found')
          setTenant(null)
          return
        }
        
        if (response.status === 403) {
          setError('Tenant access denied')
          setTenant(null)
          return
        }

        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      
      if (data.tenant) {
        setTenant(data.tenant)
        setError(null)
      } else {
        throw new Error('Invalid response format')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch tenant information'
      setError(errorMessage)
      console.error('Tenant fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTenantInfo()
  }, [])

  return {
    tenant,
    loading,
    error,
    refetch: fetchTenantInfo
  }
}

/**
 * Custom hook for tenant-specific settings
 */
export function useTenantSettings<T = Record<string, any>>(defaultSettings?: T) {
  const { tenant, loading, error } = useTenant()
  
  const settings = (tenant?.settings as T) || defaultSettings || ({} as T)
  
  const updateSettings = async (newSettings: Partial<T>): Promise<boolean> => {
    try {
      const response = await fetch('/api/tenant/info', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          settings: {
            ...settings,
            ...newSettings
          }
        }),
      })

      if (!response.ok) {
        throw new Error(`Failed to update settings: ${response.statusText}`)
      }

      // Refresh tenant data after update
      window.location.reload()
      return true
    } catch (err) {
      console.error('Settings update error:', err)
      return false
    }
  }

  return {
    settings,
    loading,
    error,
    updateSettings,
    tenant
  }
}

/**
 * Hook to check if current user has access to the tenant
 */
export function useTenantAccess() {
  const { tenant, loading, error } = useTenant()
  const [hasAccess, setHasAccess] = useState<boolean | null>(null)
  const router = useRouter()

  useEffect(() => {
    if (!loading && !error) {
      if (tenant && tenant.isActive) {
        setHasAccess(true)
      } else {
        setHasAccess(false)
        // Redirect to tenant selection or error page
        // router.push('/tenant-not-found')
      }
    }
  }, [tenant, loading, error, router])

  return {
    hasAccess,
    tenant,
    loading,
    error
  }
}

/**
 * Hook for tenant branding and customization
 */
export function useTenantBranding() {
  const { tenant, loading, error } = useTenant()

  const getBrandingValue = <T,>(key: string, defaultValue: T): T => {
    if (!tenant?.settings?.branding) {
      return defaultValue
    }
    
    return tenant.settings.branding[key] ?? defaultValue
  }

  const branding = {
    primaryColor: getBrandingValue('primaryColor', '#3B82F6'),
    secondaryColor: getBrandingValue('secondaryColor', '#10B981'),
    logo: getBrandingValue('logo', null),
    favicon: getBrandingValue('favicon', null),
    companyName: tenant?.name || 'Pondok Digital',
    tagline: getBrandingValue('tagline', ''),
    customCSS: getBrandingValue('customCSS', ''),
  }

  return {
    branding,
    tenant,
    loading,
    error,
    getBrandingValue
  }
}

/**
 * Hook for tenant-specific feature flags
 */
export function useTenantFeatures() {
  const { tenant, loading, error } = useTenant()

  const isFeatureEnabled = (featureName: string): boolean => {
    if (!tenant?.settings?.features) {
      return false
    }
    
    return tenant.settings.features[featureName] === true
  }

  const getFeatureConfig = <T,>(featureName: string, defaultConfig: T): T => {
    if (!tenant?.settings?.features?.[featureName]) {
      return defaultConfig
    }
    
    return tenant.settings.features[featureName] ?? defaultConfig
  }

  return {
    isFeatureEnabled,
    getFeatureConfig,
    tenant,
    loading,
    error
  }
}

/**
 * Context provider component for tenant information
 */

const TenantContext = createContext<TenantHookState | null>(null)

export function TenantProvider({ children }: { children: ReactNode }) {
  const tenantState = useTenant()

  return (
    <TenantContext.Provider value={tenantState}>
      {children}
    </TenantContext.Provider>
  )
}

export function useTenantContext() {
  const context = useContext(TenantContext)
  
  if (!context) {
    throw new Error('useTenantContext must be used within a TenantProvider')
  }
  
  return context
}

export default useTenant