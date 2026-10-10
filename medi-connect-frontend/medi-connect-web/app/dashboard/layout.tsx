import type { ReactNode } from "react";

import { DashboardSidebar } from "@/components/dashboard/doctor-dashboard/layout/dashboard-sidebar";
import { DashboardTopbar } from "@/components/dashboard/doctor-dashboard/layout/dashboard-topbar";
import { AppointmentsProvider } from "@/context/appointments-context";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <TooltipProvider>
      <AppointmentsProvider>
        <SidebarProvider open={true}>
          <DashboardSidebar />
          <SidebarInset className="min-w-0 bg-[#f8faff]">
            <DashboardTopbar />
            {children}
          </SidebarInset>
        </SidebarProvider>
      </AppointmentsProvider>
    </TooltipProvider>
  );
}
