import { OnboardingRole } from "@/types/auth";
import { CalendarDays } from "lucide-react";
export interface RoleOption {
  value: OnboardingRole;
  eyebrow: string;
  title: string;
  description: string;
  icon: typeof CalendarDays;
  features: string[];
  recommendation: string;
  accent: "primary" | "secondary";
}
