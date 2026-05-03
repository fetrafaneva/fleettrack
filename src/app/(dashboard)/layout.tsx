import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/dashboard/AppSidebar";
import AuthGuard from "@/components/AuthGuard";
import NotificationBell from "@/components/dashboard/NotificationBell";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <SidebarProvider>
        <div className="flex h-screen w-full overflow-hidden">
          <AppSidebar />
          <main className="flex-1 flex flex-col overflow-hidden">
            <header className="flex items-center justify-between px-6 py-4 border-b">
              <div className="flex items-center gap-2">
                <SidebarTrigger />
                <h1 className="text-lg font-semibold">FleetTrack</h1>
              </div>
              <NotificationBell />
            </header>
            <div className="flex-1 overflow-y-auto p-6">{children}</div>
          </main>
        </div>
      </SidebarProvider>
    </AuthGuard>
  );
}
