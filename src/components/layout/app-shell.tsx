import { Sidebar } from "./sidebar";
import { AppHeader } from "./header";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="flex min-h-screen bg-wash">
      <Sidebar />
      <div className="flex-1 ml-[232px] flex flex-col">
        <AppHeader />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
