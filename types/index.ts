export type UserRole = 'SEEKER' | 'RECRUITER' | 'ADMIN'

export type JobType = 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERNSHIP' | 'FREELANCE'

export type JobStatus = 'ACTIVE' | 'PAUSED' | 'CLOSED' | 'DRAFT'

export type ApplicationStatus =
  | 'APPLIED'
  | 'REVIEWING'
  | 'INTERVIEWED'
  | 'OFFERED'
  | 'REJECTED'
  | 'WITHDRAWN'

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  avatar?: string
  bio?: string
  location?: string
  website?: string
  github?: string
  linkedin?: string
  skills: string[]
  createdAt: Date
  updatedAt: Date
}

export interface Company {
  id: string
  name: string
  logo?: string
  website?: string
  description?: string
  industry?: string
  size?: string
  location?: string
  foundedYear?: number
}

export interface Job {
  id: string
  title: string
  description: string
  requirements: string[]
  responsibilities: string[]
  type: JobType
  status: JobStatus
  location: string
  remote: boolean
  salaryMin?: number
  salaryMax?: number
  salaryCurrency: string
  skills: string[]
  experienceYears?: number
  companyId: string
  company: Company
  recruiterId: string
  applicationCount: number
  createdAt: Date
  updatedAt: Date
  expiresAt?: Date
}

export interface Application {
  id: string
  jobId: string
  job: Job
  seekerId: string
  seeker: User
  status: ApplicationStatus
  coverLetter?: string
  resumeUrl?: string
  notes?: string
  appliedAt: Date
  updatedAt: Date
}

export interface Session {
  user: {
    id: string
    name: string
    email: string
    role: UserRole
    avatar?: string
  }
  expires: string
}

export interface JobFilters {
  search?: string
  type?: JobType[]
  location?: string
  remote?: boolean
  salaryMin?: number
  salaryMax?: number
  skills?: string[]
  experienceYears?: number
  page?: number
  limit?: number
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface ApiError {
  message: string
  code?: string
  status?: number
}

export interface DashboardStats {
  totalApplications: number
  pendingReviews: number
  interviews: number
  offers: number
  applicationsByStatus: Record<ApplicationStatus, number>
  recentApplications: Application[]
}

export interface RecruiterStats {
  totalJobs: number
  activeJobs: number
  totalApplications: number
  newApplicationsToday: number
  topJobs: Array<{ job: Job; applicationCount: number }>
}
