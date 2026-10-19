import { ShieldCheck } from "lucide-react";
import { CardHeader, CardTitle } from "@/components/ui/card";
import type { PatientDirectoryHeaderProps } from "@/types/patient";

export function PatientDirectoryHeader({
  matchingCount,
}: PatientDirectoryHeaderProps) {
  return (
    <CardHeader className="gap-0 border-b px-5 py-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <CardTitle className="font-semibold">Patient directory</CardTitle>
          <p className="mt-1 inline-flex items-center gap-1.5 text-xs text-muted-foreground">
            <ShieldCheck className="size-3.5" />
            Patient accounts are managed by patients and shown here as
            read-only.
          </p>
        </div>
        <span className="text-sm text-muted-foreground">
          {matchingCount} matching patients
        </span>
      </div>
    </CardHeader>
  );
}
