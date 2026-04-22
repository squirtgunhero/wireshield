import { SecureViewerWrapper } from "./secure-viewer-wrapper";

interface PageProps {
  params: Promise<{ token: string }>;
}

export default async function InstructionsPage({ params }: PageProps) {
  const { token } = await params;
  // eslint-disable-next-line react-hooks/purity -- server component runs once; timestamp is intentionally unique per request
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();

  return (
    <div className="py-6">
      <SecureViewerWrapper
        wireId={token}
        recipientName="Transaction Participant"
        bankName="Keystone Title Escrow"
        routingNumber="021000089"
        accountHolderName="Keystone Title Group LLC"
        amount={162400}
        expiresAt={expiresAt}
      />
    </div>
  );
}
