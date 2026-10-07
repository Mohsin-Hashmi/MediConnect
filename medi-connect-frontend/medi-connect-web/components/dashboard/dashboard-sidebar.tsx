"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HeartPulse, UserRound } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  useSidebar,
} from "@/components/ui/sidebar";
import { DASHBOARD_NAVIGATION } from "@/constants/dashboard";

export function DashboardSidebar() {
  const pathname = usePathname();
  const { setOpenMobile } = useSidebar();

  return (
    <Sidebar side="left" collapsible="offcanvas" className="border-r border-sidebar-border">
      <SidebarHeader className="h-17 justify-center px-4">
        <Link
          href="/dashboard"
          onClick={() => setOpenMobile(false)}
          className="flex min-w-0 items-center gap-2.5 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring"
          aria-label="MediConnect doctor dashboard"
        >
          <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <HeartPulse className="size-5" aria-hidden="true" />
          </span>
          <span className="min-w-0 group-data-[collapsible=icon]:hidden">
            <span className="block truncate text-sm font-bold tracking-tight">MediConnect</span>
            <span className="block truncate text-[11px] text-muted-foreground">Doctor Portal</span>
          </span>
        </Link>
      </SidebarHeader>
      <SidebarSeparator className="mx-0" />

      <SidebarContent className="px-2 py-4">
        <nav aria-label="Doctor dashboard navigation">
          {DASHBOARD_NAVIGATION.map((group) => (
            <SidebarGroup key={group.label} className="mb-3 p-1">
              <SidebarGroupLabel className="px-3 text-[11px] font-semibold tracking-[0.12em] uppercase">
                {group.label}
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu className="gap-1">
                  {group.items.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;

                    return (
                      <SidebarMenuItem key={item.href}>
                        <SidebarMenuButton
                          render={<Link href={item.href} />}
                          tooltip={item.label}
                          isActive={isActive}
                          onClick={() => setOpenMobile(false)}
                          className="h-10 gap-3 rounded-lg px-3 text-[13px] text-sidebar-foreground/75 data-active:bg-primary/10 data-active:font-semibold data-active:text-primary hover:bg-primary/5 hover:text-primary"
                          aria-current={isActive ? "page" : undefined}
                        >
                          <Icon className="size-4.5" aria-hidden="true" />
                          <span>{item.label}</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ))}
        </nav>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-3">
        <Link
          href="/dashboard/profile"
          onClick={() => setOpenMobile(false)}
          className="flex items-center gap-2.5 rounded-lg border border-sidebar-border bg-sidebar-accent/45 p-2.5 outline-none transition-colors hover:bg-sidebar-accent focus-visible:ring-2 focus-visible:ring-sidebar-ring"
        >
          <Avatar className="size-9">
            <AvatarFallback className="bg-primary/10 text-primary">
              <UserRound className="size-4" aria-hidden="true" />
            </AvatarFallback>
          </Avatar>
          <span className="min-w-0 group-data-[collapsible=icon]:hidden">
            <span className="block truncate text-xs font-semibold">Doctor workspace</span>
            <span className="block truncate text-[11px] text-muted-foreground">View profile</span>
          </span>
        </Link>
      </SidebarFooter>
    </Sidebar>
  );
}
