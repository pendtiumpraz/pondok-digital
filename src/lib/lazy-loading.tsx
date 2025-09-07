'use client'

import React, { Suspense, ComponentType, lazy } from 'react'
import { Skeleton } from '@/components/ui/skeleton'

// Generic lazy loading wrapper with loading states
export function withLazyLoading<T = any>(
  importFn: () => Promise<{ default: ComponentType<any> }>,
  fallback?: React.ReactNode
) {
  const LazyComponent = lazy(importFn)
  
  return React.forwardRef<any, T>((props, ref) => {
    return (
      <Suspense fallback={fallback || <ComponentLoading />}>
        <LazyComponent {...(props as any)} ref={ref} />
      </Suspense>
    )
  })
}

// Default loading component
const ComponentLoading = () => (
  <div className="space-y-4">
    <Skeleton className="h-8 w-full" />
    <Skeleton className="h-4 w-3/4" />
    <Skeleton className="h-4 w-1/2" />
  </div>
)

// Loading states for different component types
export const LoadingStates = {
  Card: () => (
    <div className="border rounded-lg p-4 space-y-3">
      <Skeleton className="h-6 w-1/3" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
    </div>
  ),
  
  Table: () => (
    <div className="space-y-2">
      <Skeleton className="h-10 w-full" />
      {Array.from({ length: 5 }).map((_, i) => (
        <Skeleton key={i} className="h-8 w-full" />
      ))}
    </div>
  ),
  
  Form: () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-10 w-full" />
      </div>
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-full" />
        </div>
      ))}
    </div>
  ),
  
  Dashboard: () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="border rounded-lg p-4 space-y-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-8 w-20" />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Skeleton className="h-64 w-full rounded-lg" />
        <Skeleton className="h-64 w-full rounded-lg" />
      </div>
    </div>
  )
}

// Route-based code splitting helpers
export const LazyRoutes = {
  // Administrative routes
  Dashboard: withLazyLoading(
    () => import('@/app/(authenticated)/dashboard/DashboardClient'),
    <LoadingStates.Dashboard />
  ),
  
  Students: withLazyLoading(
    () => import('@/components/siswa/student-edit-form').then(mod => ({ default: (mod as any).default || (mod as any).StudentEditForm || (() => null) }) as any),
    <LoadingStates.Form />
  ),
  
  Activities: withLazyLoading(
    () => import('@/components/kegiatan/activity-form').then(mod => ({ default: (mod as any).default || (mod as any).ActivityForm || (() => null) }) as any),
    <LoadingStates.Form />
  ),
  
  Finance: withLazyLoading(
    () => import('@/components/keuangan/transaction-form').then(mod => ({ default: (mod as any).default || (mod as any).TransactionForm || (() => null) }) as any),
    <LoadingStates.Form />
  ),
  
  Hafalan: withLazyLoading(
    () => import('@/components/hafalan/quick-record-modal').then(mod => ({ default: (mod as any).default || (mod as any).QuickRecordModal || (() => null) }) as any),
    <LoadingStates.Form />
  ),
  
  // Public routes - Commented out as these are now under /yayasan/[slug]/
  // Donations: withLazyLoading(
  //   () => import('@/app/yayasan/[slug]/donasi/donate/DonatePageClient'),
  //   <LoadingStates.Card />
  // ),
  
  // PPDB: withLazyLoading(
  //   () => import('@/app/yayasan/[slug]/ppdb/PPDBPageClient'),
  //   <LoadingStates.Form />
  // )
}

// Dynamic component loader with error boundary
interface DynamicComponentProps<T = {}> {
  loader: () => Promise<{ default: ComponentType<T> }>
  loading?: React.ReactNode
  error?: React.ReactNode
  props?: T
}

export function DynamicComponent<T = {}>({ 
  loader, 
  loading = <ComponentLoading />, 
  error = <div>Error loading component</div>,
  props = {} as T
}: DynamicComponentProps<T>) {
  const [Component, setComponent] = React.useState<ComponentType<T> | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)
  const [hasError, setHasError] = React.useState(false)
  
  React.useEffect(() => {
    loader()
      .then(({ default: LoadedComponent }) => {
        setComponent(() => LoadedComponent)
        setIsLoading(false)
      })
      .catch(() => {
        setHasError(true)
        setIsLoading(false)
      })
  }, [loader])
  
  if (isLoading) return <>{loading}</>
  if (hasError) return <>{error}</>
  if (!Component) return null
  
  return <Component {...(props as any)} />
}

// Intersection Observer based lazy loading
export function useIntersectionObserver(
  elementRef: React.RefObject<Element>,
  callback: () => void,
  options: IntersectionObserverInit = {}
) {
  React.useEffect(() => {
    const element = elementRef.current
    if (!element) return
    
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        callback()
        observer.unobserve(element)
      }
    }, {
      threshold: 0.1,
      rootMargin: '50px',
      ...options
    })
    
    observer.observe(element)
    
    return () => observer.disconnect()
  }, [elementRef, callback, options])
}

// Lazy loading wrapper for heavy components
export function LazySection({ 
  children, 
  fallback = <ComponentLoading />,
  className = '' 
}: {
  children: React.ReactNode
  fallback?: React.ReactNode
  className?: string
}) {
  const ref = React.useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = React.useState(false)
  
  useIntersectionObserver(ref, () => setIsVisible(true))
  
  return (
    <div ref={ref} className={className}>
      {isVisible ? children : fallback}
    </div>
  )
}

// Code splitting for chart components (heavy dependencies)
export const LazyCharts = {
  LineChart: withLazyLoading(
    () => import('recharts').then(mod => ({ default: (mod as any).LineChart || (() => null) }) as any),
    <Skeleton className="h-64 w-full" />
  ),
  
  BarChart: withLazyLoading(
    () => import('recharts').then(mod => ({ default: (mod as any).BarChart || (() => null) }) as any),
    <Skeleton className="h-64 w-full" />
  ),
  
  PieChart: withLazyLoading(
    () => import('recharts').then(mod => ({ default: (mod as any).PieChart || (() => null) }) as any),
    <Skeleton className="h-64 w-full" />
  )
}

// Bundle analyzer helper for development
export const BundleAnalyzer = {
  log: (componentName: string) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`🚀 Lazy loading: ${componentName}`)
    }
  }
}

// Preload critical components
export const preloadComponents = {
  dashboard: () => import('@/app/(authenticated)/dashboard/DashboardClient'),
  students: () => import('@/components/siswa/student-edit-form'),
  activities: () => import('@/components/kegiatan/activity-form')
}

// Preload on hover/focus
export const usePreload = (preloadFn: () => Promise<any>) => {
  const preloadedRef = React.useRef(false)
  
  const preload = React.useCallback(() => {
    if (!preloadedRef.current) {
      preloadedRef.current = true
      preloadFn().catch(() => {
        preloadedRef.current = false
      })
    }
  }, [preloadFn])
  
  return {
    onMouseEnter: preload,
    onFocus: preload
  }
}