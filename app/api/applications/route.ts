import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { jobId, coverLetter } = await req.json();
  if (!jobId) return NextResponse.json({ error: "jobId required" }, { status: 400 });
  const existing = await db.application.findUnique({
    where: { jobId_seekerId: { jobId, seekerId: session.user.id! } },
  });
  if (existing) return NextResponse.json({ error: "Already applied" }, { status: 409 });
  const application = await db.application.create({
    data: { jobId, seekerId: session.user.id!, coverLetter },
  });
  return NextResponse.json(application, { status: 201 });
}

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const apps = await db.application.findMany({
    where: { seekerId: session.user.id! },
    include: { job: { select: { title: true, company: true, location: true, type: true } } },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(apps);
}
