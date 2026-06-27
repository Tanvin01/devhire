import Link from "next/link";
import { auth } from "@/lib/auth";
import { signOut } from "@/lib/auth";
import { Briefcase } from "lucide-react";

export default async function Navbar() {
  const session = await auth();
  return (
    <nav className="border-b border-slate-800 bg-slate-950/80 backdrop-blur sticky top-0 z-50">
      <div className="container mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-white">
          <Briefcase className="w-5 h-5 text-blue-400" />
          DevHire
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/jobs" className="text-sm text-slate-400 hover:text-white transition-colors">Jobs</Link>
          {session ? (
            <>
              <Link href="/dashboard" className="text-sm text-slate-400 hover:text-white transition-colors">Dashboard</Link>
              <form action={async () => { "use server"; await signOut({ redirectTo: "/" }); }}>
                <button className="text-sm bg-slate-800 hover:bg-slate-700 text-white px-3 py-1.5 rounded-lg transition-colors">Sign out</button>
              </form>
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm text-slate-400 hover:text-white transition-colors">Sign in</Link>
              <Link href="/register" className="text-sm bg-blue-600 hover:bg-blue-500 text-white px-4 py-1.5 rounded-lg transition-colors">Get started</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
