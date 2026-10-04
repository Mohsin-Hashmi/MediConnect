import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default function DashboardPage() {
  return (
    <main className="flex min-h-svh items-center justify-center bg-[#f8f8ff] px-6">
      <div className="max-w-lg text-center">
        <h1 className="font-heading text-3xl font-bold tracking-tight text-foreground">
          Doctor Dashboard
        </h1>
        <p className="mt-3 text-base leading-relaxed text-muted-foreground">
          Your profile has been submitted successfully. The doctor dashboard
          experience will be added in the next phase.
        </p>
      </div>
    </main>
  );
}
