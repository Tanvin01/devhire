'use client'

import React, { useState } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import type { Job } from '@/types'

interface ApplyModalProps {
  job: Job | null
  open: boolean
  onClose: () => void
  onSubmit: (jobId: string, coverLetter: string) => Promise<void>
}

export function ApplyModal({ job, open, onClose, onSubmit }: ApplyModalProps) {
  const [coverLetter, setCoverLetter] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  if (!job) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!coverLetter.trim()) {
      setError('Please write a short cover letter to stand out.')
      return
    }
    setLoading(true)
    setError('')
    try {
      await onSubmit(job.id, coverLetter)
      setCoverLetter('')
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to apply. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`Apply to ${job.title}`}
      description={`${job.company.name} · ${job.location}`}
      size="lg"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button loading={loading} onClick={handleSubmit}>
            Submit Application
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="rounded-lg border border-[#30363d] bg-[#0d1117] p-4 text-sm text-[#8b949e]">
          <p className="font-medium text-[#e6edf3] mb-1">{job.title}</p>
          <p>{job.company.name} · {job.location}</p>
          {job.salaryMin && (
            <p className="mt-1 text-green-400">
              ${job.salaryMin.toLocaleString()} – ${job.salaryMax?.toLocaleString()} / yr
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-[#e6edf3] mb-1.5">
            Cover Letter <span className="text-red-400">*</span>
          </label>
          <textarea
            value={coverLetter}
            onChange={(e) => {
              setCoverLetter(e.target.value)
              if (error) setError('')
            }}
            rows={8}
            placeholder={`Hi ${job.company.name} team,\n\nI'm excited to apply for the ${job.title} position...`}
            className="w-full rounded-md border border-[#30363d] bg-[#0d1117] text-sm text-[#e6edf3] px-3 py-2.5 placeholder:text-[#6e7681] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
          />
          <div className="flex items-center justify-between mt-1">
            {error ? (
              <p className="text-xs text-red-400">{error}</p>
            ) : (
              <p className="text-xs text-[#8b949e]">
                Tip: Mention why you're excited about this specific role.
              </p>
            )}
            <span className="text-xs text-[#8b949e]">{coverLetter.length} / 2000</span>
          </div>
        </div>
      </form>
    </Modal>
  )
}
