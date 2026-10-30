"use client";

import { useEffect } from "react";

import { Card, CardContent } from "@/components/ui/card";
import type {
  SettingsNavigationProps,
  SettingsSectionId,
} from "@/types/settings";

export function SettingsNavigation({ items }: SettingsNavigationProps) {
  useEffect(() => {
    const sectionId = window.location.hash.slice(1) as SettingsSectionId;

    if (!sectionId) return;

    window.history.replaceState(
      window.history.state,
      "",
      `${window.location.pathname}${window.location.search}`,
    );

    if (!items.some((item) => item.id === sectionId)) return;

    window.requestAnimationFrame(() => {
      document.getElementById(sectionId)?.scrollIntoView({ block: "start" });
    });
  }, [items]);

  function scrollToSection(sectionId: SettingsSectionId) {
    window.history.replaceState(
      window.history.state,
      "",
      `${window.location.pathname}${window.location.search}`,
    );

    document.getElementById(sectionId)?.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
      block: "start",
    });
  }

  return (
    <Card className="gap-0 border-0 py-0 shadow-sm ring-1 ring-slate-200/90 lg:sticky lg:top-23 lg:self-start">
      <CardContent className="p-3">
        <p className="px-3 pt-1.5 pb-2.5 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
          Settings sections
        </p>
        <nav
          aria-label="Settings sections"
          className="grid gap-1.5 sm:grid-cols-2 lg:grid-cols-1"
        >
          {items.map((item) => {
            const Icon = item.icon;

            return (
              <button
                type="button"
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="group flex w-full min-w-0 cursor-pointer items-start gap-3 rounded-lg px-3 py-2.5 text-left outline-none transition-colors hover:bg-primary/5 focus-visible:ring-2 focus-visible:ring-primary/40"
              >
                <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600 transition-colors group-hover:bg-primary/10 group-hover:text-primary">
                  <Icon className="size-4.5" aria-hidden="true" />
                </span>
                <span className="min-w-0 pt-0.5">
                  <span className="block truncate text-sm font-semibold text-foreground">
                    {item.label}
                  </span>
                  <span className="block truncate text-xs text-muted-foreground">
                    {item.description}
                  </span>
                </span>
              </button>
            );
          })}
        </nav>
      </CardContent>
    </Card>
  );
}
