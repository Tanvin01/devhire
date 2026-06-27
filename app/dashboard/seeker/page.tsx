import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import Link from "next/link";

const STATUS_STYLES: Record<string, string> = {
  APPLIED: "bg-blue-500/10 text-blue-400",
  SCREENING: "bg-yellow-500/10 text-yellow-400",
  INTERVIEW: "bg-purple-500/10 text-purple-400",
  OFFER: "bg-green-500/10 text-green-400",
  REJECTED: "bg-red-500/10 text-red-400",
};

export default async function SeekerDashboard() {
  const session = await auth();
  if (!session || session.user.role !== "SEEKER") redirect("/login");

  const applications = await db.application.findMany({
    where: { seekerId: session.user.id! },
    include: { job: { select: { id: true, title: true, company: true, location: true, type: true, remote: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-slate-950 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-white">My Applications</h1>
          <Link href="/jobs" className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl text-sm font-medium">
            Browse Jobs
          </Link>
        </div>

        {applications.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-slate-400 mb-4">You haven't applied to any jobs yet.</p>
            <Link href="/jobs" className="text-blue-400 hover:underline">Browse open positions</Link>
          </div>
        ) : (
          <div className="space-y-3">
            {applications.map(app => (
              <div key={app.id} className="bg-slate-900 border border-slate-700 rounded-xl p-5 flex items-center justify-between">
                <div>
                  <Link href={`/jobs/${app.job.id}`} className="font-semibold text-white hover:text-blue-400">
                    {app.job.title}
                  </Link>
                  <p className="text-slate-400 text-sm">{app.job.company} · {app.job.remote ? "Remote" : app.job.location}</p>
                  <p className="text-slate-500 text-xs mt-1">Applied {new Date(app.createdAt).toLocaleDateString()}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${STATUS_STYLES[app.status] ?? "bg-slate-700 text-slate-300"}`}>
                  {app.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
