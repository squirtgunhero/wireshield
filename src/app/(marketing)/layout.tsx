import { MarketingHeader } from "@/components/layout/marketing-header";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#F6F5F0]">
      <MarketingHeader />
      <main>{children}</main>
    </div>
  );
}
