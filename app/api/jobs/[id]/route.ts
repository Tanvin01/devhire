import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

interface Params {
  params: { id: string }
}

export async function GET(_req: NextRequest, { params }: Params) {
  try {
    // In production: const job = await prisma.job.findUnique({
    //   where: { id: params.id },
    //   include: { company: true }
    // })
    // if (!job) return NextResponse.json({ message: 'Not found' }, { status: 404 })

    const job = {
      id: params.id,
      title: 'Senior Full Stack Engineer',
      description:
        'We are looking for an experienced Full Stack Engineer to join our growing team. You will work on our core product, building features that impact millions of users worldwide.',
      requirements: [
        '5+ years of experience with React and TypeScript',
        'Strong knowledge of Node.js and REST API design',
        'Experience with PostgreSQL and Redis',
        'Familiarity with Docker and CI/CD pipelines',
      ],
      responsibilities: [
        'Design and implement new product features end-to-end',
        'Collaborate with product managers and designers',
        'Conduct code reviews and mentor junior engineers',
        'Improve application performance and reliability',
      ],
      type: 'FULL_TIME',
      status: 'ACTIVE',
      location: 'San Francisco, CA',
      remote: true,
      salaryMin: 140000,
      salaryMax: 190000,
      salaryCurrency: 'USD',
      skills: ['TypeScript', 'React', 'Node.js', 'PostgreSQL', 'Docker', 'AWS'],
      experienceYears: 5,
      applicationCount: 47,
      companyId: 'co_1',
      company: {
        id: 'co_1',
        name: 'Acme Corp',
        logo: null,
        website: 'https://acme.example.com',
        description: 'Acme Corp builds innovative SaaS tools for engineering teams.',
        industry: 'Technology',
        size: '51-200',
        location: 'San Francisco, CA',
        foundedYear: 2018,
      },
      recruiterId: 'usr_rec1',
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString(),
    }

    return NextResponse.json(job)
  } catch (error) {
    console.error('[GET /api/jobs/:id]', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'RECRUITER') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await req.json()

    // Validate recruiter owns this job in production
    // const job = await prisma.job.findFirst({ where: { id: params.id, recruiterId: session.user.id } })
    // if (!job) return NextResponse.json({ message: 'Not found' }, { status: 404 })
    // const updated = await prisma.job.update({ where: { id: params.id }, data: body })

    return NextResponse.json({ id: params.id, ...body, updatedAt: new Date().toISOString() })
  } catch (error) {
    console.error('[PUT /api/jobs/:id]', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'RECRUITER') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  try {
    // In production:
    // await prisma.job.deleteMany({ where: { id: params.id, recruiterId: session.user.id } })

    return NextResponse.json({ message: 'Job deleted', id: params.id })
  } catch (error) {
    console.error('[DELETE /api/jobs/:id]', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}
