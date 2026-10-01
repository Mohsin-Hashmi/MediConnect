import Link from "next/link";

import { cn } from "@/lib/utils";

interface AuthTabsProps {
  active: "login" | "register";
}

const tabs = [
  { id: "login" as const, label: "Sign In", href: "/login" },
  { id: "register" as const, label: "Create Account", href: "/register" },
];

export function AuthTabs({ active }: AuthTabsProps) {
  return (
    <nav className="mb-6 grid grid-cols-2 rounded-xl bg-primary/8 p-1.5" aria-label="Authentication">
      {tabs.map((tab) => (
        <Link
          key={tab.id}
          href={tab.href}
          aria-current={active === tab.id ? "page" : undefined}
          className={cn(
            "rounded-lg px-3 py-2.5 text-center text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
            active === tab.id
              ? "bg-white text-primary shadow-sm ring-1 ring-black/5"
              : "text-foreground/70 hover:text-primary",
          )}
        >
          {tab.label}
        </Link>
      ))}
    </nav>
  );
}
