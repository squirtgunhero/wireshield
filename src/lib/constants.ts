export const PARTY_COLORS: Record<string, { color: string; abbr: string; label: string }> = {
  BUYER:         { color: "#1E40AF", abbr: "BY", label: "Buyer" },
  SELLER:        { color: "#065F46", abbr: "SL", label: "Seller" },
  BUYER_AGENT:   { color: "#6D28D9", abbr: "BA", label: "Buyer's agent" },
  LISTING_AGENT: { color: "#7C3AED", abbr: "LA", label: "Listing agent" },
  TITLE_ESCROW:  { color: "#92400E", abbr: "TE", label: "Title/Escrow" },
  LENDER:        { color: "#991B1B", abbr: "LO", label: "Lender" },
  ATTORNEY:      { color: "#115E59", abbr: "AT", label: "Attorney" },
  BROKERAGE:     { color: "#3730A3", abbr: "BR", label: "Brokerage" },
  OTHER:         { color: "#6B7280", abbr: "??", label: "Other" },
};

export const PHASES = [
  { key: "LISTING",        label: "Listing" },
  { key: "OFFER",          label: "Offer" },
  { key: "EARNEST_MONEY",  label: "Earnest money" },
  { key: "DUE_DILIGENCE",  label: "Due diligence" },
  { key: "UNDERWRITING",   label: "Underwriting" },
  { key: "CLOSING",        label: "Closing" },
  { key: "POST_CLOSING",   label: "Post-closing" },
] as const;

export const PHASE_INDEX: Record<string, number> = Object.fromEntries(
  PHASES.map((p, i) => [p.key, i])
);

export const SEVERITY_CONFIG = {
  CRITICAL: { color: "#CD3D64", bg: "#FEF0F4", border: "#FCCFDB", label: "Critical" },
  HIGH:     { color: "#D97706", bg: "#FFFBEB", border: "#FDE68A", label: "High" },
  MEDIUM:   { color: "#CA8A04", bg: "#FEFCE8", border: "#FEF08A", label: "Medium" },
  LOW:      { color: "#00A67E", bg: "#ECFDF5", border: "#A7F3D0", label: "Low" },
  SAFE:     { color: "#16A34A", bg: "#F0FDF4", border: "#BBF7D0", label: "Clear" },
} as const;

export const WIRE_STATUS_LABELS: Record<string, string> = {
  PENDING: "Pending",
  PENDING_VERIFICATION: "Pending verification",
  VERIFIED: "Verified",
  SENT: "Sent",
  COMPLETED: "Completed",
  FLAGGED: "Flagged",
  CANCELLED: "Cancelled",
};

export const DOC_STATUS_LABELS: Record<string, string> = {
  PENDING: "Pending",
  SUBMITTED: "Submitted",
  UNDER_REVIEW: "Under review",
  VERIFIED: "Verified",
  FLAGGED: "Flagged",
  REJECTED: "Rejected",
};

export const ALERT_STATUS_LABELS: Record<string, string> = {
  ACTIVE: "Active",
  INVESTIGATING: "Investigating",
  RESOLVED: "Resolved",
  FALSE_POSITIVE: "False positive",
  ESCALATED: "Escalated",
};

export const VERIFICATION_METHODS = [
  "Government ID",
  "MLS license",
  "State Bar verification",
  "ALTA membership",
  "NMLS registry",
  "Callback verification",
  "In-person verification",
  "Other",
];
