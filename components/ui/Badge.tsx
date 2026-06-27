import * as React from 'react'
import { cn } from '@/lib/utils'
import type { ApplicationStatus, JobType } from '@/types'

type BadgeVariant =
  | 'default'
  | 'primary'
  | 'success'
  | 'warning'
  | 'danger'
  | 'purple'
  | 'outline'

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant
}

const variantClasses: Record<BadgeVariant, string> = {
  default: 'bg-[#21262d] text-[#8b949e] border border-[#30363d]',
  primary: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
  success: 'bg-green-500/20 text-green-400 border border-green-500/30',
  warning: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
  danger: 'bg-red-500/20 text-red-400 border border-red-500/30',
  purple: 'bg-purple-500/20 text-purple-400 border border-purple-500/30',
  outline: 'bg-transparent text-[#e6edf3] border border-[#30363d]',
}

export function Badge({ variant = 'default', className, children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium',
        variantClasses[variant],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  )
}

export function ApplicationStatusBadge({ status }: { status: ApplicationStatus }) {
  const map: Record<ApplicationStatus, { variant: BadgeVariant; label: string }> = {
    APPLIED: { variant: 'primary', label: 'Applied' },
    REVIEWING: { variant: 'warning', label: 'Reviewing' },
    INTERVIEWED: { variant: 'purple', label: 'Interviewed' },
    OFFERED: { variant: 'success', label: 'Offered' },
    REJECTED: { variant: 'danger', label: 'Rejected' },
    WITHDRAWN: { variant: 'default', label: 'Withdrawn' },
  }
  const { variant, label } = map[status]
  return <Badge variant={variant}>{label}</Badge>
}

export function JobTypeBadge({ type }: { type: JobType }) {
  const map: Record<JobType, { variant: BadgeVariant; label: string }> = {
    FULL_TIME: { variant: 'success', label: 'Full Time' },
    PART_TIME: { variant: 'warning', label: 'Part Time' },
    CONTRACT: { variant: 'primary', label: 'Contract' },
    INTERNSHIP: { variant: 'purple', label: 'Internship' },
    FREELANCE: { variant: 'default', label: 'Freelance' },
  }
  const { variant, label } = map[type]
  return <Badge variant={variant}>{label}</Badge>
}
