import type { WireInstruction, TransactionParty } from "@prisma/client";

export type WireInstructionWithRelations = WireInstruction & {
  fromParty?: Pick<TransactionParty, "id" | "name" | "role"> | null;
  toParty?: Pick<TransactionParty, "id" | "name" | "role"> | null;
  submittedBy?: { id: string; fullName: string } | null;
  transaction?: { id: string; propertyAddress: string } | null;
};

export interface WireCreateInput {
  transactionId: string;
  direction: "INCOMING" | "OUTGOING";
  bankName: string;
  routingNumber: string;
  accountNumberEncrypted: string;
  accountHolderName: string;
  bankAddress?: string;
  swiftCode?: string;
  amount?: number;
  fromPartyId?: string;
  toPartyId?: string;
}
