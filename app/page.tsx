import Link from "next/link";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import JobCard from "@/components/jobs/JobCard";
import SearchBar from "@/components/jobs/SearchBar";
import { Briefcase, Users, Building2, ArrowRight } from "lucide-react";

async function getFeaturedJobs() {
  return db.job.findMany({
    where: { featured: true, active: true },
    include: { recruiter: { select: { name: true, image: true } } },
    orderBy: { createdAt: "desc" },
    take: 6,
  });
}

async function getStats() {
  const [jobs, users, companies] = await Promise.all([
    db.job.count({ where: { active: true } }),
    db.user.count({ where: { role: "SEEKER" } }),
    db.user.count({ where: { role: "RECRUITER" } }),
  ]);
  return { jobs, users, companies };
}

export default async function HomePage() {
  const session = await auth();
  const [featuredJobs, stats] = await Promise.all([
    getFeaturedJobs(),
    getStats(),
  ]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950">
      {/* Hero */}
      <section className="container mx-auto px-4 pt-24 pb-16 text-center">
        <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-1.5 text-sm text-blue-400 mb-6">
          <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
          {stats.jobs} active jobs right now
        </div>
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
          Find Your Next
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
            {" "}Tech Role
          </span>
        </h1>
        <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10">
          Thousands of jobs from top tech companies. Built by developers,
          for developers.
        </p>
        <SearchBar />

        <div className="flex justify-center gap-10 mt-14">
          {[
            { icon: Briefcase, label: "Open Roles", value: stats.jobs },
            { icon: Users, label: "Developers", value: stats.users },
            { icon: Building2, label: "Companies", value: stats.companies },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="text-center">
              <div className="flex items-center justify-center gap-2 text-3xl font-bold text-white">
                <Icon className="w-6 h-6 text-blue-400" />
                {value.toLocaleString()}+
              </div>
              <p className="text-slate-500 text-sm mt-1">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Jobs */}
      <section className="container mx-auto px-4 pb-24">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-semibold text-white">Featured Jobs</h2>
          <Link
            href="/jobs"
            className="flex items-center gap-1 text-blue-400 hover:text-blue-300 text-sm transition-colors"
          >
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {featuredJobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      </section>
    </main>
  );
}
