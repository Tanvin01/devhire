import React from 'react'
import { ApplicationStatusBadge } from '@/components/ui/Badge'
import { formatDate } from '@/lib/utils'
import type { Application } from '@/types'

async function getApplications(): Promise<Application[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/applications`, {
      cache: 'no-store',
    })
    if (!res.ok) return []
    const data = await res.json()
    return data.data ?? data
  } catch {
    return []
  }
}

const STATUS_STEPS = ['APPLIED', 'REVIEWING', 'INTERVIEWED', 'OFFERED'] as const

function ApplicationRow({ application }: { application: Application }) {
  const currentStep = STATUS_STEPS.indexOf(application.status as typeof STATUS_STEPS[number])

  return (
    <div className="rounded-xl border border-[#30363d] bg-[#161b22] p-5">
      <div className="flex items-start gap-4">
        {application.job.company.logo ? (
          <img
            src={application.job.company.logo}
            alt={application.job.company.name}
            className="h-12 w-12 rounded-lg border border-[#30363d] object-contain flex-shrink-0"
          />
        ) : (
          <div className="h-12 w-12 rounded-lg bg-[#21262d] flex items-center justify-center text-lg font-bold text-[#8b949e] flex-shrink-0">
            {application.job.company.name[0]}
          </div>
        )}

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 flex-wrap">
            <div>
              <h3 className="font-semibold text-[#e6edf3]">{application.job.title}</h3>
              <p className="text-sm text-[#8b949e]">{application.job.company.name} · {application.job.location}</p>
            </div>
            <ApplicationStatusBadge status={application.status} />
          </div>

          {/* Progress bar */}
          {!['REJECTED', 'WITHDRAWN'].includes(application.status) && (
            <div className="mt-3">
              <div className="flex items-center gap-0">
                {STATUS_STEPS.map((step, i) => (
                  <React.Fragment key={step}>
                    <div
                      className={`flex-shrink-0 h-2 w-2 rounded-full transition-colors ${
                        i <= currentStep ? 'bg-blue-500' : 'bg-[#30363d]'
                      }`}
                    />
                    {i < STATUS_STEPS.length - 1 && (
                      <div
                        className={`flex-1 h-0.5 mx-0.5 ${
                          i < currentStep ? 'bg-blue-500' : 'bg-[#30363d]'
                        }`}
                      />
                    )}
                  </React.Fragment>
                ))}
              </div>
              <div className="flex justify-between mt-1">
                {STATUS_STEPS.map((step) => (
                  <span key={step} className="text-[10px] text-[#8b949e] capitalize">
                    {step.charAt(0) + step.slice(1).toLowerCase()}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="mt-3 flex items-center gap-4 text-xs text-[#8b949e]">
            <span>Applied {formatDate(application.appliedAt)}</span>
            <span>·</span>
            <span>{application.job.type.replace('_', ' ')}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default async function ApplicationsPage() {
  const applications = await getApplications()

  const active = applications.filter((a) => !['REJECTED', 'WITHDRAWN'].includes(a.status))
  const closed = applications.filter((a) => ['REJECTED', 'WITHDRAWN'].includes(a.status))

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#e6edf3]">My Applications</h1>
        <p className="text-sm text-[#8b949e] mt-1">
          {applications.length} total · {active.length} active
        </p>
      </div>

      {applications.length === 0 ? (
        <div className="rounded-xl border border-[#30363d] bg-[#161b22] p-12 text-center">
          <svg className="mx-auto h-12 w-12 text-[#484f58] mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <p className="text-[#8b949e]">No applications yet</p>
          <a href="/seeker/browse" className="mt-3 inline-block text-sm text-blue-400 hover:text-blue-300">
            Browse jobs →
          </a>
        </div>
      ) : (
        <div className="space-y-8">
          {active.length > 0 && (
            <section>
              <h2 className="text-sm font-semibold text-[#8b949e] uppercase tracking-wider mb-4">
                Active ({active.length})
              </h2>
              <div className="space-y-3">
                {active.map((app) => (
                  <ApplicationRow key={app.id} application={app} />
                ))}
              </div>
            </section>
          )}

          {closed.length > 0 && (
            <section>
              <h2 className="text-sm font-semibold text-[#8b949e] uppercase tracking-wider mb-4">
                Closed ({closed.length})
              </h2>
              <div className="space-y-3 opacity-60">
                {closed.map((app) => (
                  <ApplicationRow key={app.id} application={app} />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  )
}
