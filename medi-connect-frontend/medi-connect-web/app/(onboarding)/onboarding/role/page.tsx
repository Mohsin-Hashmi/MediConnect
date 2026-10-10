import type { Metadata } from "next";

import { RoleSelection } from "@/components/onboarding/role-selection/role-selection";

export const metadata: Metadata = {
  title: "Choose Your Role",
  description: "Choose how you will use MediConnect to begin onboarding.",
};

export default function RoleSelectionPage() {
  return <RoleSelection />;
}
