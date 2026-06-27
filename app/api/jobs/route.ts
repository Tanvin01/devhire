import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { jobSchema } from "@/lib/validations";

// GET /api/jobs — list with filters
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");
    const location = searchParams.get("location");
    const search = searchParams.get("q");
    const page = parseInt(searchParams.get("page") ?? "1");
    const limit = parseInt(searchParams.get("limit") ?? "10");

    const where = {
      active: true,
      ...(type && { type: type as any }),
      ...(location && { location: { contains: location, mode: "insensitive" as const } }),
      ...(search && {
        OR: [
          { title: { contains: search, mode: "insensitive" as const } },
          { company: { contains: search, mode: "insensitive" as const } },
          { description: { contains: search, mode: "insensitive" as const } },
        ],
      }),
    };

    const [jobs, total] = await Promise.all([
      db.job.findMany({
        where,
        include: { recruiter: { select: { name: true, image: true } }, _count: { select: { applications: true } } },
        orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
        skip: (page - 1) * limit,
        take: limit,
      }),
      db.job.count({ where }),
    ]);

    return NextResponse.json({ jobs, total, pages: Math.ceil(total / limit) });
  } catch (error) {
    console.error("[JOBS_GET]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST /api/jobs — create job (recruiter only)
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "RECRUITER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const validated = jobSchema.safeParse(body);
    if (!validated.success) {
      return NextResponse.json({ error: validated.error.flatten() }, { status: 400 });
    }

    const job = await db.job.create({
      data: { ...validated.data, recruiterId: session.user.id! },
    });

    return NextResponse.json(job, { status: 201 });
  } catch (error) {
    console.error("[JOBS_POST]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
