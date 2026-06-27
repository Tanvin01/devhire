import type { ApplicationStatus, JobType } from '@/types'

export const JOB_TYPES: { value: JobType; label: string }[] = [
  { value: 'FULL_TIME', label: 'Full Time' },
  { value: 'PART_TIME', label: 'Part Time' },
  { value: 'CONTRACT', label: 'Contract' },
  { value: 'INTERNSHIP', label: 'Internship' },
  { value: 'FREELANCE', label: 'Freelance' },
]

export const APP_STATUSES: { value: ApplicationStatus; label: string; color: string }[] = [
  { value: 'APPLIED', label: 'Applied', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
  { value: 'REVIEWING', label: 'Reviewing', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
  { value: 'INTERVIEWED', label: 'Interviewed', color: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
  { value: 'OFFERED', label: 'Offered', color: 'bg-green-500/20 text-green-400 border-green-500/30' },
  { value: 'REJECTED', label: 'Rejected', color: 'bg-red-500/20 text-red-400 border-red-500/30' },
  { value: 'WITHDRAWN', label: 'Withdrawn', color: 'bg-gray-500/20 text-gray-400 border-gray-500/30' },
]

export const SKILLS_LIST = [
  'JavaScript', 'TypeScript', 'React', 'Next.js', 'Vue.js', 'Angular',
  'Node.js', 'Express', 'Fastify', 'NestJS', 'Python', 'Django', 'FastAPI',
  'Go', 'Rust', 'Java', 'Spring Boot', 'Kotlin', 'Swift', 'Objective-C',
  'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Elasticsearch', 'DynamoDB',
  'AWS', 'GCP', 'Azure', 'Docker', 'Kubernetes', 'Terraform', 'CI/CD',
  'GraphQL', 'REST', 'gRPC', 'WebSockets', 'Prisma', 'Drizzle ORM',
  'TailwindCSS', 'CSS', 'HTML', 'Sass', 'Figma', 'UI/UX Design',
  'React Native', 'Flutter', 'iOS', 'Android', 'Machine Learning', 'AI/ML',
  'System Design', 'Microservices', 'Testing', 'Jest', 'Cypress', 'Playwright',
]

export const SALARY_RANGES = [
  { label: 'Under $50k', min: 0, max: 50000 },
  { label: '$50k – $80k', min: 50000, max: 80000 },
  { label: '$80k – $120k', min: 80000, max: 120000 },
  { label: '$120k – $160k', min: 120000, max: 160000 },
  { label: '$160k – $200k', min: 160000, max: 200000 },
  { label: '$200k+', min: 200000, max: undefined },
]

export const EXPERIENCE_LEVELS = [
  { label: 'Entry Level', value: 0 },
  { label: '1+ years', value: 1 },
  { label: '3+ years', value: 3 },
  { label: '5+ years', value: 5 },
  { label: '8+ years', value: 8 },
  { label: '10+ years', value: 10 },
]

export const LOCATIONS = [
  'Remote', 'New York, NY', 'San Francisco, CA', 'Seattle, WA',
  'Austin, TX', 'Boston, MA', 'Chicago, IL', 'Los Angeles, CA',
  'Denver, CO', 'Atlanta, GA', 'Toronto, Canada', 'London, UK',
  'Berlin, Germany', 'Amsterdam, Netherlands', 'Singapore',
]

export const INDUSTRIES = [
  'Technology', 'Finance & Fintech', 'Healthcare', 'E-Commerce',
  'Education', 'Media & Entertainment', 'Travel', 'Gaming',
  'Cybersecurity', 'AI & Machine Learning', 'Blockchain', 'SaaS',
]

export const NAV_LINKS_SEEKER = [
  { href: '/seeker/browse', label: 'Browse Jobs', icon: 'briefcase' },
  { href: '/seeker/applications', label: 'My Applications', icon: 'file-text' },
  { href: '/seeker/saved', label: 'Saved Jobs', icon: 'bookmark' },
  { href: '/seeker/profile', label: 'Profile', icon: 'user' },
]

export const NAV_LINKS_RECRUITER = [
  { href: '/recruiter/jobs', label: 'Posted Jobs', icon: 'briefcase' },
  { href: '/recruiter/post-job', label: 'Post a Job', icon: 'plus-circle' },
  { href: '/recruiter/applications', label: 'Applications', icon: 'users' },
  { href: '/recruiter/analytics', label: 'Analytics', icon: 'bar-chart' },
]
