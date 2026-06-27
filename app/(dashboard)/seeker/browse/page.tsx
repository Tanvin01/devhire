import React from 'react'
import type { Job, PaginatedResponse } from '@/types'
import { formatSalary, formatRelativeTime } from '@/lib/utils'
import { JobTypeBadge } from '@/components/ui/Badge'
import { JobCardSkeleton } from '@/components/ui/Skeleton'

async function getJobs(): Promise<PaginatedResponse<Job>> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/jobs?page=1&limit=20`, {
      next: { revalidate: 60 },
    })
    if (!res.ok) throw new Error('Failed to fetch')
    return res.json()
  } catch {
    return { data: [], total: 0, page: 1, limit: 20, totalPages: 0 }
  }
}

function JobCard({ job }: { job: Job }) {
  return (
    <div className="rounded-xl border border-[#30363d] bg-[#161b22] p-5 hover:border-[#484f58] transition-colors group">
      <div className="flex items-start gap-3 mb-3">
        {job.company.logo ? (
          <img
            src={job.company.logo}
            alt={job.company.name}
            width={48}
            height={48}
            className="h-12 w-12 rounded-lg object-contain border border-[#30363d]"
          />
        ) : (
          <div className="h-12 w-12 rounded-lg bg-[#21262d] flex items-center justify-center text-lg font-bold text-[#8b949e] flex-shrink-0">
            {job.company.name[0]}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h2 className="font-semibold text-[#e6edf3] group-hover:text-blue-400 transition-colors truncate">
            <a href={`/jobs/${job.id}`}>{job.title}</a>
          </h2>
          <p className="text-sm text-[#8b949e] truncate">{job.company.name}</p>
        </div>
        <JobTypeBadge type={job.type} />
      </div>

      <p className="text-sm text-[#8b949e] line-clamp-2 mb-3">
        {job.description.slice(0, 150)}...
      </p>

      <div className="flex flex-wrap gap-1.5 mb-4">
        {job.skills.slice(0, 4).map((skill) => (
          <span
            key={skill}
            className="rounded-full bg-[#21262d] px-2 py-0.5 text-xs text-[#8b949e] border border-[#30363d]"
          >
            {skill}
          </span>
        ))}
        {job.skills.length > 4 && (
          <span className="text-xs text-[#6e7681]">+{job.skills.length - 4} more</span>
        )}
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-[#21262d]">
        <div className="flex items-center gap-3 text-xs text-[#8b949e]">
          <span className="flex items-center gap-1">
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {job.location}
          </span>
          {(job.salaryMin || job.salaryMax) && (
            <span className="text-green-400">
              {formatSalary(job.salaryMin, job.salaryMax)}
            </span>
          )}
        </div>
        <span className="text-xs text-[#8b949e]">{formatRelativeTime(job.createdAt)}</span>
      </div>
    </div>
  )
}

export default async function BrowseJobsPage() {
  const { data: jobs } = await getJobs()

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#e6edf3]">Browse Jobs</h1>
        <p className="text-sm text-[#8b949e] mt-1">
          {jobs.length > 0 ? `${jobs.length} positions available` : 'Loading positions...'}
        </p>
      </div>

      {jobs.length === 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 9 }).map((_, i) => (
            <JobCardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      )}
    </div>
  )
}
