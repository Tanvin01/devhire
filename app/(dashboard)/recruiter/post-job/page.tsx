'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { JOB_TYPES, SKILLS_LIST } from '@/lib/constants'
import type { JobType } from '@/types'
import { cn } from '@/lib/utils'

interface JobForm {
  title: string
  description: string
  requirements: string
  responsibilities: string
  type: JobType
  location: string
  remote: boolean
  salaryMin: string
  salaryMax: string
  skills: string[]
  experienceYears: string
}

export default function PostJobPage() {
  const router = useRouter()
  const [form, setForm] = useState<JobForm>({
    title: '',
    description: '',
    requirements: '',
    responsibilities: '',
    type: 'FULL_TIME',
    location: '',
    remote: false,
    salaryMin: '',
    salaryMax: '',
    skills: [],
    experienceYears: '',
  })
  const [errors, setErrors] = useState<Partial<Record<keyof JobForm | 'general', string>>>({})
  const [loading, setLoading] = useState(false)
  const [skillSearch, setSkillSearch] = useState('')

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }))
    if (errors[name as keyof JobForm]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  const toggleSkill = (skill: string) => {
    setForm((prev) => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter((s) => s !== skill)
        : [...prev.skills, skill],
    }))
  }

  const validate = (): boolean => {
    const e: typeof errors = {}
    if (!form.title.trim()) e.title = 'Job title is required'
    if (!form.description.trim() || form.description.length < 50)
      e.description = 'Description must be at least 50 characters'
    if (!form.location.trim() && !form.remote) e.location = 'Location is required'
    if (form.skills.length === 0) e.skills = 'Select at least one skill'
    if (Object.keys(e).length) { setErrors(e); return false }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      const res = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          requirements: form.requirements.split('\n').filter(Boolean),
          responsibilities: form.responsibilities.split('\n').filter(Boolean),
          salaryMin: form.salaryMin ? Number(form.salaryMin) : undefined,
          salaryMax: form.salaryMax ? Number(form.salaryMax) : undefined,
          experienceYears: form.experienceYears ? Number(form.experienceYears) : undefined,
        }),
      })
      if (!res.ok) {
        const data = await res.json()
        setErrors({ general: data.message ?? 'Failed to post job' })
        return
      }
      router.push('/recruiter/jobs')
    } catch {
      setErrors({ general: 'Unexpected error. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  const filtered = SKILLS_LIST.filter((s) =>
    s.toLowerCase().includes(skillSearch.toLowerCase()),
  ).slice(0, 20)

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#e6edf3]">Post a Job</h1>
        <p className="text-sm text-[#8b949e] mt-1">Fill in the details to reach top developers</p>
      </div>

      {errors.general && (
        <div className="mb-6 rounded-md bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
          {errors.general}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="rounded-xl border border-[#30363d] bg-[#161b22] p-6 space-y-4">
          <h2 className="text-base font-semibold text-[#e6edf3]">Basic Information</h2>

          <Input
            label="Job Title"
            name="title"
            value={form.title}
            onChange={handleChange}
            error={errors.title}
            placeholder="e.g. Senior Full Stack Engineer"
            required
          />

          <div>
            <label className="block text-sm font-medium text-[#e6edf3] mb-1.5">Job Type</label>
            <div className="flex flex-wrap gap-2">
              {JOB_TYPES.map((t) => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => setForm((p) => ({ ...p, type: t.value }))}
                  className={cn(
                    'rounded-md px-3 py-1.5 text-sm border transition-colors',
                    form.type === t.value
                      ? 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                      : 'bg-[#0d1117] text-[#8b949e] border-[#30363d] hover:border-[#484f58]',
                  )}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Location"
              name="location"
              value={form.location}
              onChange={handleChange}
              error={errors.location}
              placeholder="e.g. New York, NY"
              disabled={form.remote}
            />
            <div className="flex items-end pb-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="remote"
                  checked={form.remote}
                  onChange={handleChange}
                  className="h-4 w-4 rounded accent-blue-500"
                />
                <span className="text-sm text-[#e6edf3]">Remote position</span>
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Min Salary (USD)"
              name="salaryMin"
              type="number"
              value={form.salaryMin}
              onChange={handleChange}
              placeholder="e.g. 80000"
            />
            <Input
              label="Max Salary (USD)"
              name="salaryMax"
              type="number"
              value={form.salaryMax}
              onChange={handleChange}
              placeholder="e.g. 150000"
            />
          </div>

          <Input
            label="Years of Experience"
            name="experienceYears"
            type="number"
            value={form.experienceYears}
            onChange={handleChange}
            placeholder="e.g. 3"
            hint="Minimum years required"
          />
        </div>

        {/* Description */}
        <div className="rounded-xl border border-[#30363d] bg-[#161b22] p-6 space-y-4">
          <h2 className="text-base font-semibold text-[#e6edf3]">Job Description</h2>

          <div>
            <label className="block text-sm font-medium text-[#e6edf3] mb-1.5">
              Description <span className="text-red-400">*</span>
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={6}
              placeholder="Describe the role, team, and what you're looking for..."
              className="w-full rounded-md border border-[#30363d] bg-[#0d1117] text-sm text-[#e6edf3] px-3 py-2.5 placeholder:text-[#6e7681] focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
            {errors.description && (
              <p className="text-xs text-red-400 mt-1">{errors.description}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-[#e6edf3] mb-1.5">
              Requirements <span className="text-xs text-[#8b949e]">(one per line)</span>
            </label>
            <textarea
              name="requirements"
              value={form.requirements}
              onChange={handleChange}
              rows={4}
              placeholder="5+ years React experience&#10;TypeScript proficiency&#10;Experience with REST APIs"
              className="w-full rounded-md border border-[#30363d] bg-[#0d1117] text-sm text-[#e6edf3] px-3 py-2.5 placeholder:text-[#6e7681] focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#e6edf3] mb-1.5">
              Responsibilities <span className="text-xs text-[#8b949e]">(one per line)</span>
            </label>
            <textarea
              name="responsibilities"
              value={form.responsibilities}
              onChange={handleChange}
              rows={4}
              placeholder="Build and maintain React applications&#10;Collaborate with design and backend teams&#10;Participate in code reviews"
              className="w-full rounded-md border border-[#30363d] bg-[#0d1117] text-sm text-[#e6edf3] px-3 py-2.5 placeholder:text-[#6e7681] focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>
        </div>

        {/* Skills */}
        <div className="rounded-xl border border-[#30363d] bg-[#161b22] p-6 space-y-3">
          <h2 className="text-base font-semibold text-[#e6edf3]">Required Skills</h2>
          {errors.skills && <p className="text-xs text-red-400">{errors.skills}</p>}

          {form.skills.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {form.skills.map((s) => (
                <span
                  key={s}
                  className="flex items-center gap-1 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 px-2.5 py-0.5 text-xs"
                >
                  {s}
                  <button type="button" onClick={() => toggleSkill(s)} className="hover:text-blue-200">×</button>
                </span>
              ))}
            </div>
          )}

          <input
            type="text"
            placeholder="Search skills..."
            value={skillSearch}
            onChange={(e) => setSkillSearch(e.target.value)}
            className="w-full rounded border border-[#30363d] bg-[#0d1117] text-sm text-[#e6edf3] px-3 py-2 placeholder:text-[#6e7681] focus:ring-1 focus:ring-blue-500 focus:outline-none"
          />
          <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto">
            {filtered.map((skill) => (
              <button
                key={skill}
                type="button"
                onClick={() => toggleSkill(skill)}
                className={cn(
                  'rounded-full px-2.5 py-0.5 text-xs border transition-colors',
                  form.skills.includes(skill)
                    ? 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                    : 'bg-[#21262d] text-[#8b949e] border-[#30363d] hover:border-[#484f58]',
                )}
              >
                {skill}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-end gap-3">
          <Button variant="secondary" type="button" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" loading={loading}>
            Post Job
          </Button>
        </div>
      </form>
    </div>
  )
}
