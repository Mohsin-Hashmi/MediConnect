"use client";

import { useFormik } from "formik";
import { Save } from "lucide-react";

import { StatusBadge } from "@/components/common/status-badge";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { SheetFooter } from "@/components/ui/sheet";
import { patientSchema } from "@/schemas/patient.schema";
import type { PatientFormProps, PatientFormValues } from "@/types/patient";

export function PatientForm({
  patient,
  variant,
  onClose,
  onSave,
}: PatientFormProps) {
  const isDrawer = variant === "drawer";
  const formik = useFormik<PatientFormValues>({
    enableReinitialize: true,
    initialValues: {
      name: patient?.name ?? "",
      age: patient ? String(patient.age) : "",
      gender: patient?.gender ?? "Female",
      email: patient?.email ?? "",
      careFocus: patient?.careFocus ?? "",
      status: patient?.status ?? "active",
    },
    validationSchema: patientSchema,
    onSubmit(values) {
      onSave(values, patient);
    },
  });
  const fieldError = (field: keyof PatientFormValues) =>
    formik.touched[field] && formik.errors[field]
      ? String(formik.errors[field])
      : null;

  return (
    <form
      onSubmit={formik.handleSubmit}
      noValidate
      className={isDrawer ? "flex min-h-0 flex-1 flex-col" : "space-y-4"}
    >
      <div
        className={
          isDrawer
            ? "flex-1 space-y-7 overflow-y-auto px-5 py-6 sm:px-7"
            : "space-y-4"
        }
      >
        {isDrawer && patient ? (
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-blue-100 bg-blue-50/60 px-4 py-3">
            <div>
              <p className="text-sm font-semibold text-foreground">
                {patient.name}
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Patient ID: {patient.id}
              </p>
            </div>
            <StatusBadge
              status={formik.values.status}
              tone={formik.values.status === "active" ? "success" : "neutral"}
            />
          </div>
        ) : null}

        <section
          className="space-y-4"
          aria-labelledby={isDrawer ? "edit-patient-info-heading" : undefined}
        >
          {isDrawer ? (
            <div>
              <h3
                id="edit-patient-info-heading"
                className="text-sm font-semibold text-foreground"
              >
                Patient information
              </h3>
              <p className="mt-1 text-xs text-muted-foreground">
                Review the patient&apos;s identity and contact information.
              </p>
            </div>
          ) : null}
          <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_8rem]">
            <div className="space-y-2">
              <Label htmlFor="patient-name">
                Full name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="patient-name"
                name="name"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                aria-invalid={Boolean(fieldError("name"))}
                className="h-10"
                placeholder="Enter patient name"
              />
              {fieldError("name") ? (
                <p className="text-xs text-destructive">{fieldError("name")}</p>
              ) : null}
            </div>
            <div className="space-y-2">
              <Label htmlFor="patient-age">
                Age <span className="text-destructive">*</span>
              </Label>
              <Input
                id="patient-age"
                name="age"
                type="number"
                min="0"
                max="120"
                value={formik.values.age}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                aria-invalid={Boolean(fieldError("age"))}
                className="h-10"
              />
              {fieldError("age") ? (
                <p className="text-xs text-destructive">{fieldError("age")}</p>
              ) : null}
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="patient-gender">
                Gender <span className="text-destructive">*</span>
              </Label>
              <Select
                items={{ Female: "Female", Male: "Male", Other: "Other" }}
                value={formik.values.gender}
                onValueChange={(value) =>
                  void formik.setFieldValue("gender", value ?? "Female")
                }
              >
                <SelectTrigger
                  id="patient-gender"
                  aria-label="Gender"
                  className="w-full bg-white px-2.5 text-sm data-[size=default]:h-10"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent align="start" alignItemWithTrigger={false}>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="patient-email">
                Email <span className="text-destructive">*</span>
              </Label>
              <Input
                id="patient-email"
                name="email"
                type="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                aria-invalid={Boolean(fieldError("email"))}
                className="h-10"
                placeholder="patient@example.test"
              />
              {fieldError("email") ? (
                <p className="text-xs text-destructive">
                  {fieldError("email")}
                </p>
              ) : null}
            </div>
          </div>
        </section>

        {isDrawer ? <Separator /> : null}

        <section
          className="space-y-4"
          aria-labelledby={isDrawer ? "edit-patient-care-heading" : undefined}
        >
          {isDrawer ? (
            <div>
              <h3
                id="edit-patient-care-heading"
                className="text-sm font-semibold text-foreground"
              >
                Care profile
              </h3>
              <p className="mt-1 text-xs text-muted-foreground">
                Review the care focus and directory status.
              </p>
            </div>
          ) : null}
          <div className="space-y-2">
            <Label htmlFor="patient-focus">
              Care focus <span className="text-destructive">*</span>
            </Label>
            <Input
              id="patient-focus"
              name="careFocus"
              value={formik.values.careFocus}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              aria-invalid={Boolean(fieldError("careFocus"))}
              className="h-10"
              placeholder="e.g. Routine health review"
            />
            {fieldError("careFocus") ? (
              <p className="text-xs text-destructive">
                {fieldError("careFocus")}
              </p>
            ) : null}
          </div>
          <div className="space-y-2">
            <Label htmlFor="patient-status">
              Status <span className="text-destructive">*</span>
            </Label>
            <Select
              items={{ active: "Active", inactive: "Inactive" }}
              value={formik.values.status}
              onValueChange={(value) =>
                void formik.setFieldValue("status", value ?? "active")
              }
            >
              <SelectTrigger
                id="patient-status"
                aria-label="Status"
                className="w-full bg-white px-2.5 text-sm data-[size=default]:h-10"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent align="start" alignItemWithTrigger={false}>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </section>
      </div>

      {isDrawer ? (
        <SheetFooter className="mt-0 border-t bg-white px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-7">
          <p className="text-xs text-muted-foreground">
            UI preview only. No changes will be saved.
          </p>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              className="h-10 flex-1 px-4 sm:flex-none"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="h-10 flex-1 gap-2 px-4 sm:flex-none"
              disabled={!formik.dirty || formik.isSubmitting}
            >
              <Save className="size-4" aria-hidden="true" />
              Save changes
            </Button>
          </div>
        </SheetFooter>
      ) : (
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">Add patient</Button>
        </DialogFooter>
      )}
    </form>
  );
}
