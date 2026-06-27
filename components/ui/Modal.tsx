'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

interface ModalProps {
  open: boolean
  onClose: () => void
  title?: string
  description?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  children: React.ReactNode
  footer?: React.ReactNode
}

const sizeClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-2xl',
}

export function Modal({
  open,
  onClose,
  title,
  description,
  size = 'md',
  children,
  footer,
}: ModalProps) {
  // Close on Escape key
  React.useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open, onClose])

  // Prevent body scroll
  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [open])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
      aria-describedby={description ? 'modal-description' : undefined}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />

      {/* Panel */}
      <div
        className={cn(
          'relative w-full rounded-xl border border-[#30363d] bg-[#161b22] shadow-2xl',
          'animate-fadeIn',
          sizeClasses[size],
        )}
      >
        {/* Header */}
        {(title || description) && (
          <div className="flex items-start justify-between gap-4 border-b border-[#21262d] p-5">
            <div>
              {title && (
                <h2 id="modal-title" className="text-base font-semibold text-[#e6edf3]">
                  {title}
                </h2>
              )}
              {description && (
                <p id="modal-description" className="mt-1 text-sm text-[#8b949e]">
                  {description}
                </p>
              )}
            </div>
            <button
              onClick={onClose}
              className="text-[#8b949e] hover:text-[#e6edf3] transition-colors"
              aria-label="Close dialog"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        {/* Body */}
        <div className="p-5">{children}</div>

        {/* Footer */}
        {footer && (
          <div className="flex items-center justify-end gap-3 border-t border-[#21262d] p-5">
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}
