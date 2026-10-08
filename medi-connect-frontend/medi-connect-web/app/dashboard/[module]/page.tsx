import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { DashboardPlaceholder } from "@/components/dashboard/doctor-dashboard/dashboard-placeholder";
import { DASHBOARD_MODULES } from "@/constants/dashboard";

export function generateStaticParams() {
  return DASHBOARD_MODULES.filter(({ slug }) => slug !== "appointments").map(
    ({ slug }) => ({ module: slug }),
  );
}

export async function generateMetadata({
  params,
}: PageProps<"/dashboard/[module]">): Promise<Metadata> {
  const { module } = await params;
  const currentModule = DASHBOARD_MODULES.find((item) => item.slug === module);

  return { title: currentModule?.title ?? "Dashboard" };
}

export default async function DashboardModulePage({
  params,
}: PageProps<"/dashboard/[module]">) {
  const { module } = await params;
  const currentModule = DASHBOARD_MODULES.find((item) => item.slug === module);

  if (!currentModule) notFound();

  return (
    <DashboardPlaceholder title={currentModule.title} icon={currentModule.icon} />
  );
}
