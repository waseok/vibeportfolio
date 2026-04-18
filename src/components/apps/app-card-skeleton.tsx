export default function AppCardSkeleton() {
  return (
    <div className="bg-white border border-slate-200 rounded-lg overflow-hidden animate-pulse">
      <div className="aspect-video bg-slate-200" />
      <div className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="h-4 bg-slate-200 rounded w-3/4" />
          <div className="h-5 bg-slate-200 rounded-full w-12 flex-shrink-0" />
        </div>
        <div className="space-y-1.5">
          <div className="h-3 bg-slate-200 rounded w-full" />
          <div className="h-3 bg-slate-200 rounded w-4/5" />
        </div>
        <div className="flex items-center justify-between">
          <div className="flex gap-3">
            <div className="h-3 bg-slate-200 rounded w-10" />
            <div className="h-3 bg-slate-200 rounded w-10" />
          </div>
          <div className="h-3 bg-slate-200 rounded w-12" />
        </div>
      </div>
      <div className="px-4 pb-3">
        <div className="h-8 bg-slate-200 rounded-md" />
      </div>
    </div>
  );
}
