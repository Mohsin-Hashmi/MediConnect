import { Eye, Save } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import type { ProfileFormActionsProps } from "@/types/doctor-profile";

export function ProfileFormActions({
  onPreview,
  isSubmitting,
}: ProfileFormActionsProps) {
  return (
    <div className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:px-5">
      <div className="min-w-0">
        <p className="text-sm font-semibold">Ready to review your profile?</p>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
          Check the patient preview, then validate your required information.
        </p>
      </div>
      <div className="flex shrink-0 flex-wrap gap-2 sm:justify-end">
        <Button
          type="button"
          variant="outline"
          className="h-10 flex-1 gap-2 px-4 shadow-none sm:flex-none"
          onClick={onPreview}
        >
          <Eye className="size-4" />
          Preview profile
        </Button>
        <Button
          type="submit"
          className="h-10 flex-1 gap-2 px-5 shadow-sm sm:flex-none"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <Spinner aria-label="Validating profile" />
          ) : (
            <>
              <Save className="size-4" />
              Save changes
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
