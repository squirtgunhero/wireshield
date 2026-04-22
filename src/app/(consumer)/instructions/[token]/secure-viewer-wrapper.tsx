"use client";

import { SecureViewer } from "@/components/secure-viewer";

interface Props {
  wireId: string;
  recipientName: string;
  bankName: string;
  routingNumber: string;
  accountHolderName: string;
  amount?: number;
  expiresAt: string;
}

export function SecureViewerWrapper(props: Props) {
  return <SecureViewer {...props} />;
}
