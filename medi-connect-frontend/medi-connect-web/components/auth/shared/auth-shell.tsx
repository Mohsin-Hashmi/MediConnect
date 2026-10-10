import { Card, CardContent } from "@/components/ui/card";
import type { AuthShellProps } from "@/types/auth";


export function AuthShell({ children }: AuthShellProps) {
  return (
    <main className="relative flex min-h-svh items-center justify-center overflow-x-hidden bg-[#f8f8ff] px-4 py-10 sm:px-6 sm:py-14">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(circle_at_50%_28%,rgba(37,99,235,0.09),transparent_34%),linear-gradient(to_bottom,rgba(255,255,255,0.65),rgba(238,242,255,0.7))]"
      />

      <section className="relative z-10 w-full max-w-lg" aria-labelledby="auth-title">
        <header className="mb-7 text-center">
          
          <h1 id="auth-title" className="font-heading text-3xl font-bold tracking-tight text-foreground sm:text-[2rem]">
            Access Your Health Records
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-[15px]">
            Sign in securely or set up your digital healthcare profile
          </p>
        </header>

        <Card className="gap-0 rounded-2xl border-0 bg-card/95 py-0 shadow-[0_24px_70px_rgba(30,41,59,0.13)] ring-1 ring-primary/8 backdrop-blur">
          <CardContent className="p-6 sm:p-8">{children}</CardContent>
        </Card>
        <div aria-hidden="true" className="mx-auto mt-6 h-1 w-24 rounded-full bg-primary/20" />
      </section>
    </main>
  );
}
