import { Eye, Save } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import type { ProfileFormActionsProps } from "@/types/doctor-profile";

export function ProfileFormActions({
  onPreview,
  isSubmitting,
}: ProfileFormActionsProps) {
  return (
    <div className="flex flex-col gap-4 rounded-xl bg-white px-5 py-4 shadow-sm ring-1 ring-slate-200/90 sm:flex-row sm:items-center sm:justify-between sm:px-6">
      <div>
        <p className="text-sm font-medium">Review your profile before saving</p>
        <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
          Changes are currently shown as a UI preview and are not persisted.
        </p>
      </div>
      <div className="flex flex-wrap gap-2 sm:justify-end">
        <Button
          type="button"
          variant="outline"
          className="h-10 flex-1 gap-2 px-4 sm:flex-none"
          onClick={onPreview}
        >
          <Eye className="size-4" />
          Preview profile
        </Button>
        <Button
          type="submit"
          className="h-10 flex-1 gap-2 px-4 sm:flex-none"
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
