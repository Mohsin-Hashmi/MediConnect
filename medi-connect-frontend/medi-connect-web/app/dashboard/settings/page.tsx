import type { Metadata } from "next";

import { SettingsPage } from "@/components/dashboard/settings/settings-page";

export const metadata: Metadata = {
  title: "Settings",
  description: "Manage doctor account and workspace preferences.",
};

export default function SettingsRoutePage() {
  return <SettingsPage />;
}
