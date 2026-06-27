import { cn } from '@/lib/utils'

interface SkeletonProps {
  className?: string
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-md bg-[#21262d]',
        'after:absolute after:inset-0 after:-translate-x-full',
        'after:bg-gradient-to-r after:from-transparent after:via-white/5 after:to-transparent',
        'after:animate-shimmer',
        className,
      )}
    />
  )
}

export function JobCardSkeleton() {
  return (
    <div className="rounded-xl border border-[#30363d] bg-[#161b22] p-5 space-y-4">
      <div className="flex items-start gap-3">
        <Skeleton className="h-12 w-12 rounded-lg flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>
      <div className="space-y-2">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-5/6" />
      </div>
      <div className="flex gap-2">
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="h-6 w-20 rounded-full" />
        <Skeleton className="h-6 w-14 rounded-full" />
      </div>
      <div className="flex items-center justify-between pt-2 border-t border-[#21262d]">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-8 w-20 rounded-md" />
      </div>
    </div>
  )
}

export function ApplicationRowSkeleton() {
  return (
    <div className="flex items-center gap-4 p-4 border-b border-[#21262d]">
      <Skeleton className="h-10 w-10 rounded-lg flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-3 w-32" />
      </div>
      <Skeleton className="h-6 w-20 rounded-full" />
      <Skeleton className="h-3 w-16" />
    </div>
  )
}
