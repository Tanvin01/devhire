'use client'

import React, { useState } from 'react'
import { cn, formatRelativeTime } from '@/lib/utils'
import { ApplicationStatusBadge } from '@/components/ui/Badge'
import type { Application, ApplicationStatus } from '@/types'

interface ApplicationKanbanProps {
  applications: Application[]
  onStatusChange?: (applicationId: string, newStatus: ApplicationStatus) => void
}

const COLUMNS: { status: ApplicationStatus; label: string; color: string }[] = [
  { status: 'APPLIED', label: 'Applied', color: 'border-blue-500/40' },
  { status: 'REVIEWING', label: 'Reviewing', color: 'border-yellow-500/40' },
  { status: 'INTERVIEWED', label: 'Interviewed', color: 'border-purple-500/40' },
  { status: 'OFFERED', label: 'Offered', color: 'border-green-500/40' },
  { status: 'REJECTED', label: 'Rejected', color: 'border-red-500/40' },
]

interface KanbanCardProps {
  application: Application
  onDragStart: () => void
}

function KanbanCard({ application, onDragStart }: KanbanCardProps) {
  return (
    <div
      draggable
      onDragStart={onDragStart}
      className="rounded-lg border border-[#30363d] bg-[#0d1117] p-3 cursor-grab active:cursor-grabbing hover:border-[#484f58] transition-colors"
    >
      <div className="flex items-start gap-2.5 mb-2">
        {application.job.company.logo ? (
          <img
            src={application.job.company.logo}
            alt={application.job.company.name}
            className="h-8 w-8 rounded object-contain flex-shrink-0"
          />
        ) : (
          <div className="h-8 w-8 rounded bg-[#21262d] flex items-center justify-center text-xs font-bold text-[#8b949e] flex-shrink-0">
            {application.job.company.name[0]}
          </div>
        )}
        <div className="min-w-0">
          <p className="text-sm font-medium text-[#e6edf3] truncate">
            {application.job.title}
          </p>
          <p className="text-xs text-[#8b949e] truncate">
            {application.job.company.name}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-xs text-[#8b949e]">
          {formatRelativeTime(application.appliedAt)}
        </span>
        <ApplicationStatusBadge status={application.status} />
      </div>
    </div>
  )
}

export function ApplicationKanban({
  applications,
  onStatusChange,
}: ApplicationKanbanProps) {
  const [dragging, setDragging] = useState<string | null>(null)
  const [dragOver, setDragOver] = useState<ApplicationStatus | null>(null)

  const grouped = COLUMNS.reduce<Record<ApplicationStatus, Application[]>>(
    (acc, col) => {
      acc[col.status] = applications.filter((a) => a.status === col.status)
      return acc
    },
    {} as Record<ApplicationStatus, Application[]>,
  )

  const handleDrop = (status: ApplicationStatus) => {
    if (dragging && onStatusChange) {
      onStatusChange(dragging, status)
    }
    setDragging(null)
    setDragOver(null)
  }

  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {COLUMNS.map((col) => (
        <div
          key={col.status}
          className={cn(
            'flex-shrink-0 w-56 rounded-xl border-t-2 bg-[#161b22] border-x border-b border-[#21262d] p-3',
            col.color,
            dragOver === col.status && 'ring-2 ring-blue-500/50',
          )}
          onDragOver={(e) => {
            e.preventDefault()
            setDragOver(col.status)
          }}
          onDragLeave={() => setDragOver(null)}
          onDrop={() => handleDrop(col.status)}
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-semibold text-[#8b949e] uppercase tracking-wide">
              {col.label}
            </h3>
            <span className="text-xs font-medium text-[#8b949e] bg-[#21262d] rounded-full px-2 py-0.5">
              {grouped[col.status].length}
            </span>
          </div>

          <div className="space-y-2">
            {grouped[col.status].map((app) => (
              <KanbanCard
                key={app.id}
                application={app}
                onDragStart={() => setDragging(app.id)}
              />
            ))}
            {grouped[col.status].length === 0 && (
              <p className="text-center text-xs text-[#484f58] py-6">
                No applications
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
