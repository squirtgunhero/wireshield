import Link from "next/link";
import { TxHeader } from "@/components/transaction/tx-header";
import { prisma } from "@/lib/db";
import { DEMO_TRANSACTION, DEMO_ALERTS } from "@/lib/seed-data";

const TABS = [
  { href: "timeline", label: "Timeline" },
  { href: "parties", label: "Parties" },
  { href: "wires", label: "Wires" },
  { href: "documents", label: "Documents" },
  { href: "alerts", label: "Alerts" },
];

async function getTxData(id: string) {
  try {
    const tx = await prisma.transaction.findUnique({
      where: { id },
      include: {
        alerts: { select: { severity: true, status: true } },
        events: { where: { flagged: true }, select: { phase: true } },
      },
    });
    if (!tx) return null;

    const alertCounts = {
      critical: tx.alerts.filter((a) => a.severity === "CRITICAL").length,
      high: tx.alerts.filter((a) => a.severity === "HIGH").length,
      medium: tx.alerts.filter((a) => a.severity === "MEDIUM").length,
      clear: 0,
    };
    const threatPhases = [...new Set(tx.events.map((e) => e.phase))];

    return {
      displayId: tx.id.slice(0, 8).toUpperCase(),
      address: tx.propertyAddress,
      city: tx.propertyCity ?? "",
      state: tx.propertyState ?? "",
      contractPrice: tx.purchasePrice ? Number(tx.purchasePrice) : null,
      closingDate: tx.expectedCloseDate?.toISOString() ?? null,
      currentPhase: tx.currentPhase,
      threatPhases,
      alertCounts,
      alertTotal: tx.alerts.filter((a) => ["ACTIVE", "INVESTIGATING"].includes(a.status)).length,
    };
  } catch {
    return null;
  }
}

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}

export default async function TransactionLayout({ children, params }: LayoutProps) {
  const { id } = await params;
  const data = await getTxData(id);

  const headerProps = data ?? {
    displayId: DEMO_TRANSACTION.displayId,
    address: DEMO_TRANSACTION.propertyAddress,
    city: DEMO_TRANSACTION.propertyCity,
    state: DEMO_TRANSACTION.propertyState,
    contractPrice: DEMO_TRANSACTION.contractPrice,
    closingDate: DEMO_TRANSACTION.closingDate,
    currentPhase: DEMO_TRANSACTION.currentPhase,
    threatPhases: ["UNDERWRITING"],
    alertCounts: {
      critical: DEMO_ALERTS.filter((a) => a.severity === "CRITICAL").length,
      high: DEMO_ALERTS.filter((a) => a.severity === "HIGH").length,
      medium: DEMO_ALERTS.filter((a) => a.severity === "MEDIUM").length,
      clear: 0,
    },
    alertTotal: DEMO_ALERTS.length,
  };

  return (
    <div>
      <TxHeader
        displayId={headerProps.displayId}
        address={headerProps.address}
        city={headerProps.city}
        state={headerProps.state}
        contractPrice={headerProps.contractPrice}
        closingDate={headerProps.closingDate}
        currentPhase={headerProps.currentPhase}
        threatPhases={headerProps.threatPhases}
        alertCounts={headerProps.alertCounts}
      />

      <div className="border-b border-border-card bg-white overflow-x-auto">
        <nav className="flex gap-0 -mb-px px-4 sm:px-6 min-w-max">
          {TABS.map((tab) => {
            const href = `/transactions/${id}/${tab.href}`;
            return (
              <Link key={tab.href} href={href} className="relative px-4 py-2.5 text-[13px] text-slate-muted hover:text-slate-body transition-colors">
                {tab.label}
                {tab.href === "alerts" && headerProps.alertTotal > 0 && (
                  <span className="ml-1 inline-flex h-[16px] min-w-[16px] items-center justify-center rounded-full bg-severity-critical px-1 text-[10px] font-semibold text-white">
                    {headerProps.alertTotal}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {children}
    </div>
  );
}
