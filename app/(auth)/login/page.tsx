"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Github } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError("");
    const res = await signIn("credentials", { email, password, redirect: false });
    if (res?.error) { setError("Invalid email or password"); setLoading(false); return; }
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl p-8">
        <h1 className="text-2xl font-bold text-white mb-1">Welcome back</h1>
        <p className="text-slate-400 text-sm mb-6">Sign in to your DevHire account</p>

        <button onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
          className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white py-2.5 rounded-xl mb-4 text-sm font-medium transition-colors">
          <Github className="w-4 h-4" /> Continue with GitHub
        </button>

        <div className="flex items-center gap-3 my-4">
          <div className="flex-1 h-px bg-slate-700" />
          <span className="text-slate-500 text-xs">or</span>
          <div className="flex-1 h-px bg-slate-700" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-slate-300 mb-1.5">Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
              className="w-full bg-slate-800 border border-slate-600 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500 transition-colors" />
          </div>
          <div>
            <label className="block text-sm text-slate-300 mb-1.5">Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required
              className="w-full bg-slate-800 border border-slate-600 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500 transition-colors" />
          </div>
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button type="submit" disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white font-medium py-2.5 rounded-xl transition-colors">
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="text-center text-slate-500 text-sm mt-4">
          No account? <Link href="/register" className="text-blue-400 hover:underline">Sign up</Link>
        </p>
      </div>
    </div>
  );
}
