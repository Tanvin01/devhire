'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import type { Job, JobFilters, PaginatedResponse } from '@/types'
import { buildQueryString } from '@/lib/utils'

interface UseJobsResult {
  jobs: Job[]
  total: number
  totalPages: number
  page: number
  loading: boolean
  error: string | null
  filters: JobFilters
  setFilters: (filters: JobFilters) => void
  setPage: (page: number) => void
  refresh: () => void
}

export function useJobs(initialFilters: JobFilters = {}): UseJobsResult {
  const [filters, setFiltersState] = useState<JobFilters>({
    page: 1,
    limit: 20,
    ...initialFilters,
  })
  const [data, setData] = useState<PaginatedResponse<Job>>({
    data: [],
    total: 0,
    page: 1,
    limit: 20,
    totalPages: 0,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const abortRef = useRef<AbortController | null>(null)

  const fetchJobs = useCallback(async (currentFilters: JobFilters) => {
    if (abortRef.current) abortRef.current.abort()
    abortRef.current = new AbortController()

    setLoading(true)
    setError(null)

    try {
      const qs = buildQueryString(currentFilters as Record<string, unknown>)
      const res = await fetch(`/api/jobs?${qs}`, {
        signal: abortRef.current.signal,
      })

      if (!res.ok) throw new Error('Failed to fetch jobs')

      const json: PaginatedResponse<Job> = await res.json()
      setData(json)
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') return
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchJobs(filters)
  }, [filters, fetchJobs])

  const setFilters = useCallback((newFilters: JobFilters) => {
    setFiltersState({ ...newFilters, page: 1, limit: filters.limit ?? 20 })
  }, [filters.limit])

  const setPage = useCallback((page: number) => {
    setFiltersState((prev) => ({ ...prev, page }))
  }, [])

  const refresh = useCallback(() => {
    fetchJobs(filters)
  }, [filters, fetchJobs])

  return {
    jobs: data.data,
    total: data.total,
    totalPages: data.totalPages,
    page: data.page,
    loading,
    error,
    filters,
    setFilters,
    setPage,
    refresh,
  }
}
