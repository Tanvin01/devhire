'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { cn } from '@/lib/utils'

type Role = 'SEEKER' | 'RECRUITER'

interface FormData {
  name: string
  email: string
  password: string
  confirmPassword: string
  role: Role
}

interface FormErrors {
  name?: string
  email?: string
  password?: string
  confirmPassword?: string
  general?: string
}

function validate(data: FormData): FormErrors {
  const errors: FormErrors = {}
  if (!data.name.trim()) errors.name = 'Full name is required'
  else if (data.name.trim().length < 2) errors.name = 'Name must be at least 2 characters'
  if (!data.email.trim()) errors.email = 'Email is required'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errors.email = 'Enter a valid email'
  if (!data.password) errors.password = 'Password is required'
  else if (data.password.length < 8) errors.password = 'Password must be at least 8 characters'
  else if (!/[A-Z]/.test(data.password)) errors.password = 'Include at least one uppercase letter'
  if (!data.confirmPassword) errors.confirmPassword = 'Please confirm your password'
  else if (data.password !== data.confirmPassword) errors.confirmPassword = 'Passwords do not match'
  return errors
}

export default function RegisterPage() {
  const router = useRouter()
  const [form, setForm] = useState<FormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'SEEKER',
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const validationErrors = validate(form)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
          role: form.role,
        }),
      })
      if (!res.ok) {
        const data = await res.json()
        setErrors({ general: data.message ?? 'Registration failed' })
        return
      }
      router.push(form.role === 'RECRUITER' ? '/recruiter/jobs' : '/seeker/browse')
    } catch {
      setErrors({ general: 'An unexpected error occurred.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12 bg-[#0d1117]">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-blue-600 mb-4">
            <svg className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-[#e6edf3]">Create your account</h1>
          <p className="mt-1 text-sm text-[#8b949e]">Join thousands of developers on DevHire</p>
        </div>

        <div className="rounded-xl border border-[#30363d] bg-[#161b22] p-6 shadow-2xl">
          {errors.general && (
            <div className="mb-4 rounded-md bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
              {errors.general}
            </div>
          )}

          {/* Role selector */}
          <div className="mb-5">
            <p className="text-sm font-medium text-[#e6edf3] mb-2">I am a...</p>
            <div className="grid grid-cols-2 gap-2">
              {(['SEEKER', 'RECRUITER'] as Role[]).map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => setForm((p) => ({ ...p, role }))}
                  className={cn(
                    'flex items-center justify-center gap-2 rounded-md border px-3 py-2.5 text-sm font-medium transition-colors',
                    form.role === role
                      ? 'border-blue-500 bg-blue-500/10 text-blue-400'
                      : 'border-[#30363d] bg-[#0d1117] text-[#8b949e] hover:border-[#484f58]',
                  )}
                >
                  {role === 'SEEKER' ? (
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  ) : (
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                      />
                    </svg>
                  )}
                  {role === 'SEEKER' ? 'Job Seeker' : 'Recruiter'}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <Input
              label="Full name"
              name="name"
              type="text"
              autoComplete="name"
              value={form.name}
              onChange={handleChange}
              error={errors.name}
              placeholder="Jane Smith"
              required
            />
            <Input
              label="Email address"
              name="email"
              type="email"
              autoComplete="email"
              value={form.email}
              onChange={handleChange}
              error={errors.email}
              placeholder="you@example.com"
              required
            />
            <Input
              label="Password"
              name="password"
              type="password"
              autoComplete="new-password"
              value={form.password}
              onChange={handleChange}
              error={errors.password}
              hint="Min 8 chars, include uppercase"
              placeholder="••••••••"
              required
            />
            <Input
              label="Confirm password"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              value={form.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
              placeholder="••••••••"
              required
            />

            <Button type="submit" className="w-full" loading={loading}>
              Create account
            </Button>
          </form>
        </div>

        <p className="mt-6 text-center text-sm text-[#8b949e]">
          Already have an account?{' '}
          <Link href="/login" className="text-blue-400 hover:text-blue-300 font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
