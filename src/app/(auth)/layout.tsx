import { Shield } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-wash px-4">
      <div className="w-full max-w-[380px]">
        <div className="flex items-center justify-center gap-2.5 mb-8">
          <div className="size-9 rounded-lg bg-indigo flex items-center justify-center">
            <Shield className="size-5 text-white" strokeWidth={2.5} />
          </div>
          <span className="text-lg font-semibold text-navy tracking-[-0.02em]">
            WireShield
          </span>
        </div>
        {children}
      </div>
    </div>
  );
}
