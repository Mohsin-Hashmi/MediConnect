"use client";

import { useState } from "react";
import { useFormik } from "formik";
import { Info, RotateCcw, Save, Settings2 } from "lucide-react";
import { toast } from "sonner";

import { ConfirmActionDialog } from "@/components/common/confirm-action-dialog";
import { DashboardPageHeader } from "@/components/common/dashboard-page-header";
import { AccountManagementSettings } from "@/components/dashboard/settings/sections/account-management-settings";
import { AccountSecuritySettings } from "@/components/dashboard/settings/sections/account-security-settings";
import { NotificationSettings } from "@/components/dashboard/settings/sections/notification-settings";
import { WorkspacePreferences } from "@/components/dashboard/settings/sections/workspace-preferences";
import { SettingsNavigation } from "@/components/dashboard/settings/settings-navigation";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SETTINGS_NAVIGATION } from "@/constants/settings";
import {
  SETTINGS_ACCOUNT_FIXTURE,
  SETTINGS_INITIAL_VALUES,
} from "@/data/mock/settings";
import { settingsSchema } from "@/schemas/settings.schema";
import type { SettingsFormValues } from "@/types/settings";

export function SettingsPage() {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const formik = useFormik<SettingsFormValues>({
    initialValues: SETTINGS_INITIAL_VALUES,
    validationSchema: settingsSchema,
    onSubmit: (_values, helpers) => {
      toast.info(
        "Settings are valid. Persistence will be enabled after the settings API is connected.",
      );
      helpers.setSubmitting(false);
    },
  });

  function showPreviewAction(action: string) {
    toast.info(
      `${action} will be available after its backend workflow is connected.`,
    );
  }

  function handleDeletePreview() {
    toast.info(
      "Account deletion remains unavailable until linked scheduling data is handled safely.",
    );
  }

  return (
    <section
      aria-label="Doctor workspace settings"
      className="w-full flex-1 space-y-6 px-4 py-6 sm:px-5 lg:px-6 2xl:px-8"
    >
      <DashboardPageHeader
        title="Settings"
        description="Manage how your doctor account and workspace should behave."
        actions={
          <Badge
            variant="outline"
            className="h-10 gap-2 rounded-lg bg-white px-3 text-muted-foreground"
          >
            <Settings2 className="size-4 text-primary" aria-hidden="true" />
            Interface preview
          </Badge>
        }
      />

      <Alert className="border-blue-200 bg-blue-50/70 px-4 py-3 text-blue-950">
        <Info className="size-4.5 text-primary" aria-hidden="true" />
        <AlertTitle>Preferences are not persisted yet</AlertTitle>
        <AlertDescription className="text-blue-900/75">
          This page establishes the settings experience while account,
          notification, scheduling-default, and security contracts are
          finalized.
        </AlertDescription>
      </Alert>

      <form onSubmit={formik.handleSubmit} noValidate>
        <div className="grid min-w-0 items-start gap-6 lg:grid-cols-[240px_minmax(0,1fr)] xl:grid-cols-[260px_minmax(0,1fr)]">
          <SettingsNavigation items={SETTINGS_NAVIGATION} />

          <div className="min-w-0 space-y-6">
            <AccountSecuritySettings
              account={SETTINGS_ACCOUNT_FIXTURE}
              onPreviewAction={showPreviewAction}
            />
            <NotificationSettings
              formik={formik}
              onPreviewAction={showPreviewAction}
            />
            <WorkspacePreferences
              formik={formik}
              onPreviewAction={showPreviewAction}
            />
            <AccountManagementSettings
              onExport={() => showPreviewAction("Data export")}
              onDelete={() => setDeleteDialogOpen(true)}
            />

            <Card className="gap-0 border-0 py-0 shadow-sm ring-1 ring-slate-200/90">
              <CardContent className="flex flex-col gap-4 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                <div>
                  <p className="text-sm font-semibold">
                    Review your preferences
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Changes remain in this page only until settings persistence
                    is connected.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    disabled={!formik.dirty}
                    onClick={() => formik.resetForm()}
                  >
                    <RotateCcw className="size-4" aria-hidden="true" />
                    Reset changes
                  </Button>
                  <Button type="submit">
                    <Save className="size-4" aria-hidden="true" />
                    Validate preferences
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>

      <ConfirmActionDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Account deletion is not available"
        description="Deleting a doctor account requires an approved workflow for linked appointments, availability, and retained records."
        confirmLabel="Close"
        consequence="No account data will be changed from this interface preview."
        onConfirm={handleDeletePreview}
      />
    </section>
  );
}
