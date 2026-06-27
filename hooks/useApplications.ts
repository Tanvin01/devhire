'use client'

import { useState, useEffect, useCallback } from 'react'
import type { Application, ApplicationStatus } from '@/types'

interface UseApplicationsResult {
  applications: Application[]
  loading: boolean
  error: string | null
  apply: (jobId: string, coverLetter: string) => Promise<void>
  updateStatus: (applicationId: string, status: ApplicationStatus) => Promise<void>
  withdraw: (applicationId: string) => Promise<void>
  refresh: () => void
}

export function useApplications(): UseApplicationsResult {
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchApplications = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/applications')
      if (!res.ok) throw new Error('Failed to load applications')
      const json = await res.json()
      setApplications(json.data ?? json)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchApplications()
  }, [fetchApplications])

  const apply = async (jobId: string, coverLetter: string) => {
    const res = await fetch('/api/applications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jobId, coverLetter }),
    })
    if (!res.ok) {
      const data = await res.json()
      throw new Error(data.message ?? 'Failed to apply')
    }
    const newApp: Application = await res.json()
    setApplications((prev) => [newApp, ...prev])
  }

  const updateStatus = async (applicationId: string, status: ApplicationStatus) => {
    const res = await fetch(`/api/applications/${applicationId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    if (!res.ok) throw new Error('Failed to update status')
    setApplications((prev) =>
      prev.map((a) => (a.id === applicationId ? { ...a, status } : a)),
    )
  }

  const withdraw = async (applicationId: string) => {
    await updateStatus(applicationId, 'WITHDRAWN')
  }

  return {
    applications,
    loading,
    error,
    apply,
    updateStatus,
    withdraw,
    refresh: fetchApplications,
  }
}
