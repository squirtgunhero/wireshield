import { FileText, Shield, Clock, AlertTriangle } from "lucide-react";
import { prisma } from "@/lib/db";
import { StatCard } from "@/components/ui/stat-card";
import { formatRelativeTime } from "@/lib/utils/format";

async function getComplianceData() {
  try {
    const [auditCount, fincenReports, recentLogs, activeAlerts] = await Promise.all([
      prisma.auditLog.count(),
      prisma.finCENReport.findMany({ orderBy: { createdAt: "desc" }, take: 10, include: { transaction: { select: { propertyAddress: true } } } }),
      prisma.auditLog.findMany({ orderBy: { createdAt: "desc" }, take: 20, include: { user: { select: { fullName: true } } } }),
      prisma.alert.count({ where: { status: { in: ["ACTIVE", "INVESTIGATING"] } } }),
    ]);
    return { auditCount, fincenReports, recentLogs, activeAlerts, fromDb: true };
  } catch {
    return { auditCount: 0, fincenReports: [], recentLogs: [], activeAlerts: 0, fromDb: false };
  }
}

export default async function CompliancePage() {
  const { auditCount, fincenReports, recentLogs, activeAlerts } = await getComplianceData();

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-[1120px]">
      <div>
        <h1 className="text-[22px] font-semibold text-navy tracking-[-0.03em]">Compliance</h1>
        <p className="text-[13px] text-slate-light mt-0.5">Audit trails, FinCEN reports, and compliance monitoring</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard label="Audit entries" value={auditCount} icon={FileText} />
        <StatCard label="FinCEN reports" value={fincenReports.length} icon={Shield} />
        <StatCard label="Active alerts" value={activeAlerts} icon={AlertTriangle} />
        <StatCard label="Last activity" value="Now" icon={Clock} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h2 className="text-[15px] font-semibold text-navy mb-3">FinCEN reports</h2>
          {fincenReports.length === 0 ? (
            <div className="bg-white rounded-xl border border-border-card p-6 text-center">
              <Shield className="size-8 text-slate-muted mx-auto mb-2" />
              <p className="text-[13px] text-slate-body">No FinCEN reports generated yet</p>
            </div>
          ) : (
            <div className="space-y-2">
              {fincenReports.map((r) => (
                <div key={r.id} className="bg-white rounded-xl border border-border-card p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[13px] font-medium text-navy">{r.reportType}</p>
                      <p className="text-[11px] text-slate-muted mt-0.5">{r.transaction.propertyAddress}</p>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                      r.status === "FILED" ? "bg-severity-safe-bg text-severity-safe border border-severity-safe-border"
                        : r.status === "DRAFT" ? "bg-wash text-slate-muted border border-border-card"
                        : "bg-indigo-bg text-indigo border border-info-blue-border"
                    }`}>
                      {r.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <h2 className="text-[15px] font-semibold text-navy mb-3">Recent audit log</h2>
          <div className="bg-white rounded-xl border border-border-card divide-y divide-border-subtle overflow-hidden">
            {recentLogs.length === 0 ? (
              <div className="p-6 text-center">
                <p className="text-[13px] text-slate-muted">No audit entries yet</p>
              </div>
            ) : (
              recentLogs.slice(0, 15).map((log) => (
                <div key={log.id} className="px-4 py-3 hover:bg-wash transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[12px] font-medium text-navy">{log.action.replace(/_/g, " ")}</p>
                      {log.user && <p className="text-[11px] text-slate-muted">{log.user.fullName}</p>}
                    </div>
                    <span className="text-[10px] text-slate-muted font-mono">{formatRelativeTime(log.createdAt.toISOString())}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
