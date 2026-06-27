# DevHire — Full-Stack Job Board Platform

![Next.js](https://img.shields.io/badge/Next.js_14-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![NextAuth](https://img.shields.io/badge/NextAuth.js-black?style=for-the-badge&logo=next.js)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)

A production-grade job board platform connecting developers with top tech companies. Features role-based authentication, real-time job listings, application tracking, and a recruiter dashboard.

## ✨ Features

- **Role-based Auth** — Separate flows for Job Seekers and Recruiters via NextAuth.js + Prisma Adapter
- **Job Listings** — Full CRUD for job posts with rich filtering (location, salary, type, stack)
- **Application Tracker** — Kanban-style board to track application stages
- **Recruiter Dashboard** — Post jobs, manage applicants, view analytics
- **Resume Upload** — PDF upload with preview stored in cloud storage
- **Email Notifications** — Automated emails on application status changes
- **Search & Filter** — Debounced full-text search with advanced filters
- **Responsive UI** — Mobile-first design with Tailwind CSS + Radix UI

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript (strict) |
| Database | PostgreSQL |
| ORM | Prisma 5 |
| Auth | NextAuth.js v5 + bcryptjs |
| UI Components | Radix UI + shadcn/ui |
| Styling | Tailwind CSS 3 |
| Validation | Zod |
| Deployment | Vercel + Supabase |

## 🗂 Project Structure

```
devhire/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── (dashboard)/
│   │   ├── recruiter/
│   │   │   ├── jobs/page.tsx
│   │   │   ├── applicants/page.tsx
│   │   │   └── analytics/page.tsx
│   │   └── seeker/
│   │       ├── browse/page.tsx
│   │       ├── applications/page.tsx
│   │       └── profile/page.tsx
│   ├── api/
│   │   ├── auth/[...nextauth]/route.ts
│   │   ├── jobs/route.ts
│   │   └── applications/route.ts
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ui/              # shadcn/ui components
│   ├── jobs/
│   ├── auth/
│   └── dashboard/
├── lib/
│   ├── auth.ts          # NextAuth config
│   ├── db.ts            # Prisma client singleton
│   ├── validations.ts   # Zod schemas
│   └── utils.ts
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
└── middleware.ts        # Route protection
```

## 🚀 Getting Started

### Prerequisites
- Node.js ≥ 18
- PostgreSQL database (local or [Supabase](https://supabase.com) free tier)

### Setup

```bash
git clone https://github.com/Tanvin01/devhire.git
cd devhire
npm install
```

### Environment Variables

```bash
cp .env.example .env.local
```

```env
DATABASE_URL="postgresql://user:password@localhost:5432/devhire"
NEXTAUTH_SECRET="your-secret-here"
NEXTAUTH_URL="http://localhost:3000"
GITHUB_CLIENT_ID="your-github-oauth-id"
GITHUB_CLIENT_SECRET="your-github-oauth-secret"
CLOUDINARY_CLOUD_NAME="your-cloudinary-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
```

### Database Setup

```bash
npx prisma db push
npx prisma db seed
npx prisma studio   # optional: visual DB browser
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 📐 Database Schema

```prisma
model User {
  id            String   @id @default(cuid())
  name          String?
  email         String   @unique
  role          Role     @default(SEEKER)
  jobs          Job[]
  applications  Application[]
}

model Job {
  id           String   @id @default(cuid())
  title        String
  company      String
  location     String
  type         JobType
  salary_min   Int
  salary_max   Int
  stack        String[]
  description  String   @db.Text
  recruiter    User     @relation(fields: [recruiterId], references: [id])
  applications Application[]
  createdAt    DateTime @default(now())
}

model Application {
  id        String   @id @default(cuid())
  status    AppStatus @default(APPLIED)
  job       Job      @relation(fields: [jobId], references: [id])
  seeker    User     @relation(fields: [seekerId], references: [id])
  createdAt DateTime @default(now())
}
```

## 🔐 Authentication Flow

1. Users register with email/password (bcrypt hashed) or OAuth (GitHub/Google)
2. NextAuth session stored in PostgreSQL via Prisma Adapter
3. Middleware protects `/dashboard/*` routes
4. Role-based redirects after login (seeker → browse, recruiter → post jobs)

## 📊 Key Engineering Decisions

- **Server Components by default** — data fetching at the component level, no unnecessary client waterfalls
- **Optimistic UI updates** — application status changes reflect instantly before server confirmation
- **Connection pooling** — Prisma singleton pattern prevents connection exhaustion in serverless
- **Type-safe API** — Zod schemas shared between client validation and server-side parsing

## 🚢 Deployment

```bash
# Vercel
vercel deploy

# Set env vars in Vercel dashboard or:
vercel env add DATABASE_URL
```

Supabase free tier works perfectly as the PostgreSQL host.
