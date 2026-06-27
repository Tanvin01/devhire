"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

const JOB_TYPES = ["FULL_TIME","PART_TIME","CONTRACT","REMOTE","INTERNSHIP"];
const LOCATIONS = ["Remote","New York","San Francisco","London","Berlin","Bangalore","Toronto"];

export default function JobFilters() {
  const router = useRouter();
  const params = useSearchParams();

  const update = useCallback((key: string, value: string) => {
    const p = new URLSearchParams(params.toString());
    value ? p.set(key, value) : p.delete(key);
    p.delete("page");
    router.push(`/jobs?${p.toString()}`);
  }, [params, router]);

  return (
    <div className="bg-slate-900 border border-slate-700 rounded-xl p-5 space-y-5">
      <h3 className="font-semibold text-white">Filters</h3>
      <div>
        <p className="text-xs text-slate-400 uppercase tracking-wide mb-2">Job Type</p>
        {JOB_TYPES.map((t) => (
          <label key={t} className="flex items-center gap-2 py-1 cursor-pointer">
            <input type="radio" name="type" value={t}
              checked={params.get("type") === t}
              onChange={() => update("type", t)}
              className="accent-blue-500" />
            <span className="text-sm text-slate-300">{t.replace("_"," ")}</span>
          </label>
        ))}
        {params.get("type") && (
          <button onClick={() => update("type","")} className="text-xs text-blue-400 mt-1 hover:underline">
            Clear
          </button>
        )}
      </div>
      <div>
        <p className="text-xs text-slate-400 uppercase tracking-wide mb-2">Location</p>
        <select
          value={params.get("location") ?? ""}
          onChange={(e) => update("location", e.target.value)}
          className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
        >
          <option value="">All locations</option>
          {LOCATIONS.map((l) => <option key={l} value={l}>{l}</option>)}
        </select>
      </div>
    </div>
  );
}
