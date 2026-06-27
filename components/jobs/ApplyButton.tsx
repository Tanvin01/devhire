"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface Props { jobId: string; alreadyApplied: boolean; isLoggedIn: boolean; }

export default function ApplyButton({ jobId, alreadyApplied, isLoggedIn }: Props) {
  const [loading, setLoading] = useState(false);
  const [applied, setApplied] = useState(alreadyApplied);
  const router = useRouter();

  const handleApply = async () => {
    if (!isLoggedIn) { router.push("/login"); return; }
    if (applied) return;
    setLoading(true);
    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId }),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      setApplied(true);
      toast.success("Application submitted!");
      router.refresh();
    } catch (err: any) {
      toast.error(err.message ?? "Failed to apply");
    } finally {
      setLoading(false);
    }
  };

  if (applied) {
    return (
      <span className="bg-green-500/10 border border-green-500/30 text-green-400 px-5 py-2.5 rounded-xl text-sm font-medium">
        Applied
      </span>
    );
  }

  return (
    <button
      onClick={handleApply}
      disabled={loading}
      className="bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white font-semibold px-6 py-2.5 rounded-xl transition-colors text-sm"
    >
      {loading ? "Applying..." : "Apply Now"}
    </button>
  );
}
