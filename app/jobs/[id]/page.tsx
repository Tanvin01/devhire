import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import ApplyButton from "@/components/jobs/ApplyButton";
import { MapPin, Clock, DollarSign, Briefcase, Calendar, Users } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export async function generateMetadata({ params }: { params: { id: string } }) {
  const job = await db.job.findUnique({ where: { id: params.id }, select: { title: true, company: true } });
  if (!job) return { title: "Job Not Found" };
  return { title: `${job.title} at ${job.company} — DevHire`, description: `Apply for ${job.title} at ${job.company}` };
}

export default async function JobDetailPage({ params }: { params: { id: string } }) {
  const session = await auth();
  const job = await db.job.findUnique({
    where: { id: params.id },
    include: {
      recruiter: { select: { name: true, image: true, email: true } },
      _count: { select: { applications: true } },
    },
  });
  if (!job) notFound();

  const alreadyApplied = session?.user?.id
    ? !!(await db.application.findUnique({ where: { jobId_seekerId: { jobId: job.id, seekerId: session.user.id } } }))
    : false;

  const salary = job.salaryMin && job.salaryMax
    ? `$${(job.salaryMin / 1000).toFixed(0)}k – $${(job.salaryMax / 1000).toFixed(0)}k`
    : "Competitive";

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="container mx-auto px-4 py-10 max-w-4xl">
        <div className="bg-slate-900 border border-slate-700 rounded-2xl p-8 mb-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-white mb-1">{job.title}</h1>
              <p className="text-blue-400 font-medium text-lg">{job.company}</p>
            </div>
            <ApplyButton jobId={job.id} alreadyApplied={alreadyApplied} isLoggedIn={!!session} />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {[
              { icon: MapPin, label: job.remote ? "Remote" : job.location },
              { icon: Clock, label: job.type.replace("_", " ") },
              { icon: DollarSign, label: salary },
              { icon: Users, label: `${job._count.applications} applicants` },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2 text-sm text-slate-400">
                <Icon className="w-4 h-4 text-blue-400 shrink-0" />
                <span>{label}</span>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {job.stack.map((tech) => (
              <span key={tech} className="bg-blue-500/10 border border-blue-500/20 text-blue-300 rounded-full px-3 py-1 text-xs font-medium">
                {tech}
              </span>
            ))}
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-700 rounded-2xl p-8 mb-6">
          <h2 className="text-lg font-semibold text-white mb-4">Job Description</h2>
          <div className="prose prose-invert prose-sm max-w-none text-slate-300 leading-relaxed whitespace-pre-wrap">
            {job.description}
          </div>
        </div>

        {job.requirements.length > 0 && (
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-8 mb-6">
            <h2 className="text-lg font-semibold text-white mb-4">Requirements</h2>
            <ul className="space-y-2">
              {job.requirements.map((req, i) => (
                <li key={i} className="flex items-start gap-2 text-slate-300 text-sm">
                  <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 shrink-0" />
                  {req}
                </li>
              ))}
            </ul>
          </div>
        )}

        {job.benefits.length > 0 && (
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-8">
            <h2 className="text-lg font-semibold text-white mb-4">Benefits</h2>
            <ul className="space-y-2">
              {job.benefits.map((b, i) => (
                <li key={i} className="flex items-start gap-2 text-slate-300 text-sm">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2 shrink-0" />
                  {b}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
