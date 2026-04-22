export default function TimelineLoading() {
  return (
    <div className="p-6 animate-pulse">
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-1">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-7 w-16 bg-border-card rounded-md" />
          ))}
        </div>
        <div className="flex gap-2">
          <div className="h-8 w-16 bg-border-card rounded-lg" />
          <div className="h-8 w-24 bg-border-card rounded-lg" />
        </div>
      </div>
      <div className="space-y-2">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl border border-border-card p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
            <div className="flex items-start gap-3">
              <div className="size-[30px] bg-border-subtle rounded-lg" />
              <div className="flex-1">
                <div className="h-4 w-48 bg-border-card rounded" />
                <div className="h-3 w-72 bg-border-subtle rounded mt-2" />
                <div className="flex gap-2 mt-2">
                  <div className="h-3 w-16 bg-border-subtle rounded" />
                  <div className="h-3 w-20 bg-border-subtle rounded" />
                </div>
              </div>
              <div className="h-3 w-24 bg-border-subtle rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
