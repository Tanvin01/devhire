'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
  leftElement?: React.ReactNode
  rightElement?: React.ReactNode
  containerClassName?: string
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      label,
      error,
      hint,
      leftElement,
      rightElement,
      containerClassName,
      id,
      ...props
    },
    ref,
  ) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')

    return (
      <div className={cn('flex flex-col gap-1.5', containerClassName)}>
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-[#e6edf3]"
          >
            {label}
            {props.required && (
              <span className="ml-1 text-red-400" aria-hidden>
                *
              </span>
            )}
          </label>
        )}

        <div className="relative flex items-center">
          {leftElement && (
            <div className="absolute left-3 text-[#8b949e] pointer-events-none">
              {leftElement}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            className={cn(
              'w-full rounded-md border bg-[#0d1117] text-[#e6edf3] text-sm',
              'placeholder:text-[#6e7681] transition-colors',
              'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              error
                ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                : 'border-[#30363d] hover:border-[#484f58]',
              leftElement ? 'pl-10' : 'pl-3',
              rightElement ? 'pr-10' : 'pr-3',
              'py-2 h-9',
              className,
            )}
            aria-invalid={!!error}
            aria-describedby={
              error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined
            }
            {...props}
          />

          {rightElement && (
            <div className="absolute right-3 text-[#8b949e]">{rightElement}</div>
          )}
        </div>

        {error && (
          <p id={`${inputId}-error`} className="text-xs text-red-400" role="alert">
            {error}
          </p>
        )}

        {hint && !error && (
          <p id={`${inputId}-hint`} className="text-xs text-[#8b949e]">
            {hint}
          </p>
        )}
      </div>
    )
  },
)

Input.displayName = 'Input'
