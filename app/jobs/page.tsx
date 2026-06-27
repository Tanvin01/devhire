import { Suspense } from "react";
import { db } from "@/lib/db";
import JobCard from "@/components/jobs/JobCard";
import SearchBar from "@/components/jobs/SearchBar";
import JobFilters from "@/components/jobs/JobFilters";
import JobCardSkeleton from "@/components/jobs/JobCardSkeleton";

interface PageProps {
  searchParams: { q?: string; type?: string; location?: string; page?: string };
}

async function getJobs(params: PageProps["searchParams"]) {
  const page = parseInt(params.page ?? "1");
  const limit = 12;
  const where = {
    active: true,
    ...(params.type && { type: params.type as any }),
    ...(params.location && { location: { contains: params.location, mode: "insensitive" as const } }),
    ...(params.q && {
      OR: [
        { title: { contains: params.q, mode: "insensitive" as const } },
        { company: { contains: params.q, mode: "insensitive" as const } },
        { stack: { has: params.q } },
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
  return { jobs, total, pages: Math.ceil(total / limit), page };
}

export default async function JobsPage({ searchParams }: PageProps) {
  const { jobs, total, pages, page } = await getJobs(searchParams);

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="container mx-auto px-4 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Browse Jobs</h1>
          <p className="text-slate-400">{total.toLocaleString()} open positions</p>
        </div>
        <div className="flex flex-col lg:flex-row gap-6">
          <aside className="lg:w-64 shrink-0">
            <JobFilters />
          </aside>
          <div className="flex-1">
            <div className="mb-6"><SearchBar /></div>
            <Suspense fallback={<div className="grid md:grid-cols-2 gap-4">{Array(6).fill(0).map((_, i) => <JobCardSkeleton key={i} />)}</div>}>
              {jobs.length === 0 ? (
                <div className="text-center py-16 text-slate-500">No jobs found matching your criteria.</div>
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  {jobs.map((job) => <JobCard key={job.id} job={job as any} />)}
                </div>
              )}
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
