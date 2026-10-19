import { ShieldCheck } from "lucide-react";

import { DataSectionHeader } from "@/components/common/data-section-header";
import type { PatientDirectoryHeaderProps } from "@/types/patient";

export function PatientDirectoryHeader({
  matchingCount,
}: PatientDirectoryHeaderProps) {
  return (
    <DataSectionHeader
      title="Patient directory"
      description={
        <span className="inline-flex items-center gap-1.5">
            <ShieldCheck className="size-3.5" />
            Patient accounts are managed by patients and shown here as
            read-only.
        </span>
      }
      countLabel={`${matchingCount} matching patients`}
    />
  );
}
