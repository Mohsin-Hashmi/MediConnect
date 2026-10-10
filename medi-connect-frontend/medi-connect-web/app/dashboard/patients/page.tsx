import type { Metadata } from "next";

import { PatientsPage } from "@/components/dashboard/patients/patients-page";

export const metadata: Metadata = { title: "Patients" };

export default function Page() { return <PatientsPage />; }
