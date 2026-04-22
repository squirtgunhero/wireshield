import type { AuditLog, FinCENReport, User } from "@prisma/client";

export type AuditLogWithUser = AuditLog & {
  user?: Pick<User, "id" | "fullName" | "email"> | null;
};

export type FinCENReportWithTransaction = FinCENReport & {
  transaction: { id: string; propertyAddress: string };
};

export type { AuditLog, FinCENReport };
