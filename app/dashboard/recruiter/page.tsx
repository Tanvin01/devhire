import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import Link from "next/link";
import { Briefcase, Users, TrendingUp, Plus } from "lucide-react";

export default async function RecruiterDashboard() {
  const session = await auth();
  if (!session || session.user.role !== "RECRUITER") redirect("/login");

  const [jobs, applications] = await Promise.all([
    db.job.findMany({
      where: { recruiterId: session.user.id! },
      include: { _count: { select: { applications: true } } },
      orderBy: { createdAt: "desc" },
      take: 10,
    }),
    db.application.count({
      where: { job: { recruiterId: session.user.id! } },
    }),
  ]);

  const stats = [
    { label: "Active Jobs", value: jobs.filter(j => j.active).length, icon: Briefcase, color: "blue" },
    { label: "Total Applications", value: applications, icon: Users, color: "green" },
    { label: "Total Jobs Posted", value: jobs.length, icon: TrendingUp, color: "purple" },
  ];

  return (
    <div className="min-h-screen bg-slate-950 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">Recruiter Dashboard</h1>
            <p className="text-slate-400 text-sm mt-1">Welcome back, {session.user.name}</p>
          </div>
          <Link href="/dashboard/recruiter/jobs/new"
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors">
            <Plus className="w-4 h-4" /> Post Job
          </Link>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-8">
          {stats.map(({ label, value, icon: Icon }) => (
            <div key={label} className="bg-slate-900 border border-slate-700 rounded-xl p-5">
              <div className="flex items-center gap-3">
                <Icon className="w-5 h-5 text-blue-400" />
                <span className="text-slate-400 text-sm">{label}</span>
              </div>
              <p className="text-3xl font-bold text-white mt-2">{value}</p>
            </div>
          ))}
        </div>

        <div className="bg-slate-900 border border-slate-700 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-700">
            <h2 className="font-semibold text-white">Your Job Postings</h2>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700">
                {["Title","Type","Applicants","Status","Posted"].map(h => (
                  <th key={h} className="text-left px-6 py-3 text-slate-400 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {jobs.map(job => (
                <tr key={job.id} className="border-b border-slate-800 hover:bg-slate-800/50">
                  <td className="px-6 py-4">
                    <Link href={`/jobs/${job.id}`} className="text-white hover:text-blue-400 font-medium">{job.title}</Link>
                    <p className="text-slate-500 text-xs">{job.company}</p>
                  </td>
                  <td className="px-6 py-4 text-slate-300">{job.type.replace("_"," ")}</td>
                  <td className="px-6 py-4 text-slate-300">{job._count.applications}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${job.active ? "bg-green-500/10 text-green-400" : "bg-slate-700 text-slate-400"}`}>
                      {job.active ? "Active" : "Closed"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-400 text-xs">
                    {new Date(job.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
