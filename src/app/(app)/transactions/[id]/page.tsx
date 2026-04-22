import { redirect } from "next/navigation";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function TransactionDetailPage({ params }: PageProps) {
  const { id } = await params;
  redirect(`/transactions/${id}/timeline`);
}
