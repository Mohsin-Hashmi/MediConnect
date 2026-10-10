"use client";

import Link from "next/link";
import { Bell, Search, UserRound } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";

export function DashboardTopbar() {
  return (
    <header className="sticky top-0 z-10 flex h-17 items-center gap-3 border-b border-border bg-white px-4 sm:px-6 lg:px-8">
      <SidebarTrigger
        className="size-9 border border-border text-muted-foreground hover:text-foreground md:hidden"
        aria-label="Open dashboard navigation"
      />

      <div className="ml-auto flex min-w-0 items-center gap-2 sm:gap-3">
        <div className="relative w-32 min-w-0 sm:w-56 lg:w-72">
          <Search
            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            aria-label="Search portal (coming soon)"
            placeholder="Search portal..."
            readOnly
            title="Search will be available when dashboard modules are built"
            className="h-9 border-border bg-slate-50 pl-9 text-sm"
          />
        </div>
        <Button
          render={<Link href="/dashboard/notifications" />}
          nativeButton={false}
          variant="outline"
          size="icon"
          className="size-9"
          aria-label="Notifications"
        >
          <Bell className="size-4" aria-hidden="true" />
        </Button>
        <Link
          href="/dashboard/profile"
          className="rounded-full outline-none focus-visible:ring-2 focus-visible:ring-primary"
          aria-label="Doctor profile"
        >
          <Avatar className="size-9">
            <AvatarFallback className="bg-primary/10 text-primary">
              <UserRound className="size-4" aria-hidden="true" />
            </AvatarFallback>
          </Avatar>
        </Link>
      </div>
    </header>
  );
}
