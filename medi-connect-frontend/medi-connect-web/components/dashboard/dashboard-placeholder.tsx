import type { LucideIcon } from "lucide-react";

interface DashboardPlaceholderProps {
  title: string;
  icon: LucideIcon;
}

export function DashboardPlaceholder({ title, icon: Icon }: DashboardPlaceholderProps) {
  return (
    <section className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-7">
        <p className="text-xs font-medium text-muted-foreground">Doctor Portal / {title}</p>
        <h1 className="mt-2 font-heading text-2xl font-bold tracking-tight sm:text-3xl">
          {title}
        </h1>
      </div>
      <div className="flex min-h-72 flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-white/80 px-6 py-12 text-center shadow-sm">
        <span className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Icon className="size-6" aria-hidden="true" />
        </span>
        <h2 className="mt-5 text-base font-semibold">{title} workspace</h2>
        <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
          This section is ready for its upcoming dashboard features.
        </p>
      </div>
    </section>
  );
}
