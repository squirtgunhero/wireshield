import type { Transaction, TransactionParty, WireInstruction, Event, Document, Alert, RiskEvent } from "@prisma/client";

export type TransactionWithRelations = Transaction & {
  parties: TransactionParty[];
  wireInstructions: WireInstruction[];
  events: Event[];
  documents: Document[];
  alerts: Alert[];
  riskEvents: RiskEvent[];
  createdBy?: { id: string; fullName: string; email: string } | null;
  _count?: {
    events: number;
    documents: number;
    alerts: number;
    wireInstructions: number;
  };
};

export type TransactionListItem = Transaction & {
  parties: Pick<TransactionParty, "id" | "name" | "role" | "status">[];
  _count: { alerts: number; wireInstructions: number };
  createdBy?: { id: string; fullName: string } | null;
};

export interface TransactionCreateInput {
  propertyAddress: string;
  propertyCity?: string;
  propertyState?: string;
  propertyZip?: string;
  purchasePrice?: number;
  expectedCloseDate?: string;
  transactionType?: "PURCHASE" | "REFINANCE" | "SALE";
}

export interface TransactionUpdateInput {
  status?: string;
  currentPhase?: string;
  purchasePrice?: number;
  expectedCloseDate?: string;
  propertyAddress?: string;
  propertyCity?: string;
  propertyState?: string;
  propertyZip?: string;
  transactionType?: string;
  insuranceTier?: string;
}
