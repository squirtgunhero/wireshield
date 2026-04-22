import type { User, Organization } from "@prisma/client";

export type UserProfile = Pick<User,
  "id" | "email" | "fullName" | "phone" | "role" | "avatarUrl" |
  "identityVerified" | "identityVerifiedAt" | "identityProvider" | "identityConfidenceScore" |
  "organizationId" | "createdAt"
> & {
  organization?: Pick<Organization, "id" | "name" | "type"> | null;
};

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: string;
  organizationId?: string | null;
}

export type { User, Organization };
