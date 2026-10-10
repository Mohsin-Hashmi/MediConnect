"use client";

import { useFormik } from "formik";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { patientSchema } from "@/schemas/patient.schema";
import type { PatientFormValues, PatientRecord } from "@/types/patient";

interface Props {
  open: boolean;
  patient: PatientRecord | null;
  onClose: () => void;
  onSave: (values: PatientFormValues, patient: PatientRecord | null) => void;
}

export function PatientFormDialog({ open, patient, onClose, onSave }: Props) {
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
  const error = (field: keyof PatientFormValues) =>
    formik.touched[field] ? formik.errors[field] : undefined;
  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        if (!value) onClose();
      }}
    >
      <DialogContent className="max-h-[calc(100dvh-2rem)] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{patient ? "Edit patient" : "Add patient"}</DialogTitle>
          <DialogDescription>
            This is a form preview. Nothing is saved until the patient API is
            connected. Do not enter real patient information yet.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={formik.handleSubmit} noValidate className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-[1fr_8rem]">
            <div className="space-y-2">
              <Label htmlFor="patient-name">
                Full name <span className="text-red-600">*</span>
              </Label>
              <Input
                id="patient-name"
                name="name"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                aria-invalid={!!error("name")}
                className="h-10"
                placeholder="Enter patient name"
              />
              {error("name") ? (
                <p className="text-xs text-red-600">{error("name")}</p>
              ) : null}
            </div>
            <div className="space-y-2">
              <Label htmlFor="patient-age">
                Age <span className="text-red-600">*</span>
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
                aria-invalid={!!error("age")}
                className="h-10"
              />
              {error("age") ? (
                <p className="text-xs text-red-600">{error("age")}</p>
              ) : null}
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="patient-gender">
                Gender <span className="text-red-600">*</span>
              </Label>
              <Select
                items={{ Female: "Female", Male: "Male", Other: "Other" }}
                value={formik.values.gender}
                onValueChange={(value) =>
                  formik.setFieldValue("gender", value ?? "Female")
                }
              >
                <SelectTrigger
                  id="patient-gender"
                  aria-label="Gender"
                  className="w-full data-[size=default]:h-10"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="patient-status">
                Status <span className="text-red-600">*</span>
              </Label>
              <Select
                items={{ active: "Active", inactive: "Inactive" }}
                value={formik.values.status}
                onValueChange={(value) =>
                  formik.setFieldValue("status", value ?? "active")
                }
              >
                <SelectTrigger
                  id="patient-status"
                  aria-label="Status"
                  className="w-full data-[size=default]:h-10"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="patient-email">
              Email <span className="text-red-600">*</span>
            </Label>
            <Input
              id="patient-email"
              name="email"
              type="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              aria-invalid={!!error("email")}
              className="h-10"
              placeholder="patient@example.test"
            />
            {error("email") ? (
              <p className="text-xs text-red-600">{error("email")}</p>
            ) : null}
          </div>
          <div className="space-y-2">
            <Label htmlFor="patient-focus">
              Care focus <span className="text-red-600">*</span>
            </Label>
            <Input
              id="patient-focus"
              name="careFocus"
              value={formik.values.careFocus}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              aria-invalid={!!error("careFocus")}
              className="h-10"
              placeholder="e.g. Routine health review"
            />
            {error("careFocus") ? (
              <p className="text-xs text-red-600">{error("careFocus")}</p>
            ) : null}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {patient ? "Save changes" : "Add patient"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
