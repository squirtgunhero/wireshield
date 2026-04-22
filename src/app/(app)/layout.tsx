"use client";

import { useState } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { AppHeader } from "@/components/layout/header";
import { ErrorBoundary } from "@/components/error-boundary";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-wash">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 lg:ml-[232px] flex flex-col min-w-0">
        <AppHeader onMenuToggle={() => setSidebarOpen(true)} />
        <main className="flex-1">
          <ErrorBoundary>{children}</ErrorBoundary>
        </main>
      </div>
    </div>
  );
}
