import React from 'react'
import Link from 'next/link'
import type { Job } from '@/types'
import { formatRelativeTime, formatSalary } from '@/lib/utils'
import { JobTypeBadge, Badge } from '@/components/ui/Badge'

async function getRecruiterJobs(): Promise<Job[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/jobs?recruiter=me`, {
      cache: 'no-store',
    })
    if (!res.ok) return []
    const data = await res.json()
    return data.data ?? data
  } catch {
    return []
  }
}

export default async function RecruiterJobsPage() {
  const jobs = await getRecruiterJobs()

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#e6edf3]">Posted Jobs</h1>
          <p className="text-sm text-[#8b949e] mt-1">{jobs.length} job postings</p>
        </div>
        <Link
          href="/recruiter/post-job"
          className="inline-flex items-center gap-2 rounded-md bg-blue-600 hover:bg-blue-500 px-4 py-2 text-sm font-medium text-white transition-colors"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Post a Job
        </Link>
      </div>

      <div className="rounded-xl border border-[#30363d] bg-[#161b22] overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#21262d]">
              <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-[#8b949e]">Job</th>
              <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-[#8b949e] hidden md:table-cell">Type</th>
              <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-[#8b949e] hidden lg:table-cell">Salary</th>
              <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-[#8b949e]">Status</th>
              <th className="text-right px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-[#8b949e]">Apps</th>
              <th className="text-right px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-[#8b949e]">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#21262d]">
            {jobs.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-12 text-center text-[#8b949e]">
                  No jobs posted yet.{' '}
                  <Link href="/recruiter/post-job" className="text-blue-400 hover:text-blue-300">
                    Post your first job
                  </Link>
                </td>
              </tr>
            ) : (
              jobs.map((job) => (
                <tr key={job.id} className="hover:bg-[#21262d]/40 transition-colors">
                  <td className="px-5 py-4">
                    <div>
                      <p className="font-medium text-[#e6edf3]">{job.title}</p>
                      <p className="text-xs text-[#8b949e] mt-0.5">
                        {job.location} · Posted {formatRelativeTime(job.createdAt)}
                      </p>
                    </div>
                  </td>
                  <td className="px-5 py-4 hidden md:table-cell">
                    <JobTypeBadge type={job.type} />
                  </td>
                  <td className="px-5 py-4 hidden lg:table-cell">
                    <span className="text-[#8b949e] text-xs">
                      {formatSalary(job.salaryMin, job.salaryMax)}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <Badge
                      variant={
                        job.status === 'ACTIVE' ? 'success' :
                        job.status === 'PAUSED' ? 'warning' :
                        job.status === 'DRAFT' ? 'default' : 'danger'
                      }
                    >
                      {job.status}
                    </Badge>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <span className="text-[#e6edf3] font-medium">{job.applicationCount}</span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/recruiter/jobs/${job.id}/edit`}
                        className="text-xs text-[#8b949e] hover:text-[#e6edf3] px-2 py-1 rounded hover:bg-[#21262d] transition-colors"
                      >
                        Edit
                      </Link>
                      <button className="text-xs text-red-400 hover:text-red-300 px-2 py-1 rounded hover:bg-red-500/10 transition-colors">
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
