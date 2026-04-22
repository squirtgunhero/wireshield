import Link from "next/link";
import { Plus } from "lucide-react";
import { TxCard } from "@/components/transaction/tx-card";
import { prisma } from "@/lib/db";
import { DEMO_TRANSACTION, DEMO_PARTIES, DEMO_ALERTS } from "@/lib/seed-data";

async function getTransactions() {
  try {
    const txs = await prisma.transaction.findMany({
      include: {
        parties: { select: { id: true, name: true, role: true } },
        _count: { select: { alerts: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    return { txs, fromDb: true };
  } catch {
    return { txs: [], fromDb: false };
  }
}

export default async function TransactionsPage() {
  const { txs, fromDb } = await getTransactions();

  const cards = fromDb && txs.length > 0
    ? txs.map((tx) => ({
        id: tx.id,
        displayId: tx.id.slice(0, 8).toUpperCase(),
        address: tx.propertyAddress,
        city: tx.propertyCity ?? "",
        state: tx.propertyState ?? "",
        currentPhase: tx.currentPhase,
        closingDate: tx.expectedCloseDate?.toISOString() ?? null,
        contractPrice: tx.purchasePrice ? Number(tx.purchasePrice) : null,
        alertCount: tx._count.alerts,
        partyCount: tx.parties.length,
      }))
    : [{
        id: DEMO_TRANSACTION.id,
        displayId: DEMO_TRANSACTION.displayId,
        address: DEMO_TRANSACTION.propertyAddress,
        city: DEMO_TRANSACTION.propertyCity,
        state: DEMO_TRANSACTION.propertyState,
        currentPhase: DEMO_TRANSACTION.currentPhase,
        closingDate: DEMO_TRANSACTION.closingDate,
        contractPrice: DEMO_TRANSACTION.contractPrice,
        alertCount: DEMO_ALERTS.length,
        partyCount: DEMO_PARTIES.length,
      }];

  return (
    <div className="p-4 sm:p-6 space-y-5 max-w-[1120px]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-[22px] font-semibold text-navy tracking-[-0.03em]">Transactions</h1>
          <p className="text-[13px] text-slate-light mt-0.5">Manage and monitor all real estate transactions</p>
        </div>
        <Link href="/transactions/new" className="inline-flex h-9 items-center gap-2 px-3.5 rounded-lg bg-indigo text-white text-[13px] font-medium hover:bg-indigo-light shadow-[0_1px_3px_rgba(0,166,126,0.3)] transition-all">
          <Plus className="size-[14px]" /> New transaction
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {cards.map((tx) => <TxCard key={tx.id} {...tx} />)}
      </div>
    </div>
  );
}
