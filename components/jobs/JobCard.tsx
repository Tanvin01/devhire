"use client";

import Link from "next/link";
import { MapPin, Clock, DollarSign, Zap } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface Job {
  id: string;
  title: string;
  company: string;
  companyLogo?: string | null;
  location: string;
  remote: boolean;
  type: string;
  salaryMin?: number | null;
  salaryMax?: number | null;
  stack: string[];
  featured: boolean;
  createdAt: Date;
  recruiter: { name: string | null; image: string | null };
}

const JOB_TYPE_LABELS: Record<string, string> = {
  FULL_TIME: "Full-time",
  PART_TIME: "Part-time",
  CONTRACT: "Contract",
  REMOTE: "Remote",
  INTERNSHIP: "Internship",
};

export default function JobCard({ job }: { job: Job }) {
  const salaryText =
    job.salaryMin && job.salaryMax
      ? `$${(job.salaryMin / 1000).toFixed(0)}k – $${(job.salaryMax / 1000).toFixed(0)}k`
      : null;

  return (
    <Link href={`/jobs/${job.id}`}>
      <article
        className={`group relative bg-slate-900/60 border rounded-xl p-5 hover:border-blue-500/50 hover:bg-slate-900 transition-all duration-200 cursor-pointer ${
          job.featured
            ? "border-blue-500/30 shadow-[0_0_20px_rgba(59,130,246,0.1)]"
            : "border-slate-700/50"
        }`}
      >
        {job.featured && (
          <div className="absolute top-3 right-3 flex items-center gap-1 bg-blue-500/10 border border-blue-500/30 rounded-full px-2 py-0.5 text-xs text-blue-400">
            <Zap className="w-3 h-3" />
            Featured
          </div>
        )}

        <div className="flex items-start gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-lg font-bold text-blue-400 shrink-0">
            {job.company.charAt(0)}
          </div>
          <div className="min-w-0">
            <h3 className="font-semibold text-white group-hover:text-blue-300 transition-colors truncate">
              {job.title}
            </h3>
            <p className="text-sm text-slate-400">{job.company}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 text-xs text-slate-400 mb-4">
          <span className="flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            {job.remote ? "Remote" : job.location}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {JOB_TYPE_LABELS[job.type]}
          </span>
          {salaryText && (
            <span className="flex items-center gap-1 text-green-400">
              <DollarSign className="w-3 h-3" />
              {salaryText}
            </span>
          )}
        </div>

        <div className="flex flex-wrap gap-1.5 mb-4">
          {job.stack.slice(0, 4).map((tech) => (
            <span
              key={tech}
              className="bg-slate-800 border border-slate-700 rounded-md px-2 py-0.5 text-xs text-slate-300"
            >
              {tech}
            </span>
          ))}
          {job.stack.length > 4 && (
            <span className="text-xs text-slate-500">
              +{job.stack.length - 4} more
            </span>
          )}
        </div>

        <p className="text-xs text-slate-500">
          {formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}
        </p>
      </article>
    </Link>
  );
}
