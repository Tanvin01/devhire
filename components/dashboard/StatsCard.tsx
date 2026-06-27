import React from 'react'
import { cn } from '@/lib/utils'

interface StatsCardProps {
  title: string
  value: number | string
  change?: number
  icon: React.ReactNode
  description?: string
  className?: string
}

export function StatsCard({
  title,
  value,
  change,
  icon,
  description,
  className,
}: StatsCardProps) {
  const isPositive = (change ?? 0) >= 0

  return (
    <div
      className={cn(
        'rounded-xl border border-[#30363d] bg-[#161b22] p-5',
        className,
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <p className="text-sm text-[#8b949e] truncate">{title}</p>
          <p className="mt-1 text-2xl font-bold text-[#e6edf3] tabular-nums">
            {typeof value === 'number' ? value.toLocaleString() : value}
          </p>

          {change !== undefined && (
            <div className="mt-2 flex items-center gap-1">
              <span
                className={cn(
                  'inline-flex items-center gap-0.5 text-xs font-medium',
                  isPositive ? 'text-green-400' : 'text-red-400',
                )}
              >
                <svg
                  className="h-3 w-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  style={{ transform: isPositive ? 'none' : 'rotate(180deg)' }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M5 10l7-7m0 0l7 7m-7-7v18"
                  />
                </svg>
                {Math.abs(change)}%
              </span>
              <span className="text-xs text-[#8b949e]">from last month</span>
            </div>
          )}

          {description && !change && (
            <p className="mt-1.5 text-xs text-[#8b949e]">{description}</p>
          )}
        </div>

        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
          {icon}
        </div>
      </div>
    </div>
  )
}
