export default function JobCardSkeleton() {
  return (
    <div className="bg-slate-900 border border-slate-700 rounded-xl p-5 animate-pulse">
      <div className="flex items-start gap-3 mb-4">
        <div className="w-10 h-10 bg-slate-700 rounded-lg" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-slate-700 rounded w-3/4" />
          <div className="h-3 bg-slate-700 rounded w-1/2" />
        </div>
      </div>
      <div className="flex gap-3 mb-4">
        <div className="h-3 bg-slate-700 rounded w-20" />
        <div className="h-3 bg-slate-700 rounded w-16" />
        <div className="h-3 bg-slate-700 rounded w-14" />
      </div>
      <div className="flex gap-2 mb-4">
        {[1,2,3].map(i => <div key={i} className="h-5 bg-slate-700 rounded-md w-14" />)}
      </div>
      <div className="h-3 bg-slate-700 rounded w-24" />
    </div>
  );
}
