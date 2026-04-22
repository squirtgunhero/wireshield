export default function DashboardLoading() {
  return (
    <div className="p-6 space-y-6 max-w-[1120px] animate-pulse">
      <div className="flex items-center justify-between">
        <div>
          <div className="h-7 w-40 bg-border-card rounded-lg" />
          <div className="h-4 w-64 bg-border-subtle rounded-lg mt-2" />
        </div>
        <div className="flex gap-2">
          <div className="h-9 w-20 bg-border-card rounded-lg" />
          <div className="h-9 w-36 bg-border-card rounded-lg" />
        </div>
      </div>
      <div className="grid grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl border border-border-card p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
            <div className="h-3 w-20 bg-border-subtle rounded" />
            <div className="h-6 w-12 bg-border-card rounded mt-2" />
          </div>
        ))}
      </div>
      <div>
        <div className="h-5 w-36 bg-border-card rounded-lg mb-3" />
        <div className="grid grid-cols-3 gap-4">
          {[...Array(1)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-border-card p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
              <div className="h-3 w-16 bg-border-subtle rounded" />
              <div className="h-5 w-40 bg-border-card rounded mt-2" />
              <div className="h-[3px] w-full bg-border-subtle rounded-full mt-3" />
              <div className="flex gap-3 mt-3">
                <div className="h-3 w-16 bg-border-subtle rounded" />
                <div className="h-3 w-20 bg-border-subtle rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
