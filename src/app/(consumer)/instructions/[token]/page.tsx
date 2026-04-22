import { SecureViewer } from "@/components/secure-viewer";

interface PageProps {
  params: Promise<{ token: string }>;
}

export default async function InstructionsPage({ params }: PageProps) {
  const { token } = await params;

  return (
    <div className="py-6">
      <SecureViewer
        wireId={token}
        recipientName="Transaction Participant"
        bankName="Keystone Title Escrow"
        routingNumber="021000089"
        accountHolderName="Keystone Title Group LLC"
        amount={162400}
        expiresAt={new Date(Date.now() + 15 * 60 * 1000).toISOString()}
      />
    </div>
  );
}
