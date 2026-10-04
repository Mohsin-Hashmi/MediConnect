"use client";

import { useFormik } from "formik";

import {
  INITIAL_QUALIFICATIONS,
  QUALIFICATIONS_STORAGE_KEY,
} from "@/constants/qualification";
import { qualificationsSchema } from "@/schemas/doctor-onboarding.schema";
import { useSessionStorageValue } from "@/hooks/use-session-storage-value";
import { writeSessionStorage } from "@/lib/session-storage";
import type {
  DoctorQualificationsFormValues,
  Qualification,
} from "@/types/qualification";

function isStoredQualificationList(value: unknown): value is Qualification[] {
  return (
    Array.isArray(value) &&
    value.every(
      (qualification) =>
        typeof qualification === "object" &&
        qualification !== null &&
        typeof qualification.id === "string" &&
        typeof qualification.heading === "string" &&
        typeof qualification.tier === "string" &&
        typeof qualification.degree === "string" &&
        typeof qualification.institution === "string" &&
        typeof qualification.graduationYear === "string" &&
        ["indexed", "pending", "new"].includes(qualification.status),
    )
  );
}

export function useDoctorQualifications(onSuccess: () => void) {
  const savedQualifications =
    useSessionStorageValue<unknown>(QUALIFICATIONS_STORAGE_KEY);
  const restoredQualifications = isStoredQualificationList(
    savedQualifications,
  )
    ? savedQualifications
    : [...INITIAL_QUALIFICATIONS];
  const formik = useFormik<DoctorQualificationsFormValues>({
    initialValues: { qualifications: restoredQualifications },
    enableReinitialize: true,
    validationSchema: qualificationsSchema,
    onSubmit: (values, helpers) => {
      saveQualifications(values.qualifications);
      helpers.setStatus("");
      helpers.setSubmitting(false);
      onSuccess();
    },
  });

  const saveQualifications = (
    qualifications = formik.values.qualifications,
  ) => {
    writeSessionStorage(QUALIFICATIONS_STORAGE_KEY, qualifications);
  };

  const updateQualification = <Field extends keyof Qualification>(
    id: string,
    field: Field,
    value: Qualification[Field],
  ) => {
    const index = formik.values.qualifications.findIndex(
      (qualification) => qualification.id === id,
    );
    if (index === -1) return;

    void formik.setFieldValue(`qualifications.${index}.${field}`, value);
    formik.setStatus("");
  };

  const addQualification = () => {
    const isPrimaryCredential = formik.values.qualifications.length === 0;
    const qualification: Qualification = {
      id: crypto.randomUUID(),
      heading: isPrimaryCredential
        ? "Primary Medical Degree"
        : "Additional Medical Qualification",
      tier: isPrimaryCredential
        ? "Primary Credential"
        : "Additional Credential",
      degree: "",
      institution: "",
      graduationYear: "",
      status: "new",
    };

    void formik.setFieldValue("qualifications", [
      ...formik.values.qualifications,
      qualification,
    ]);
    formik.setStatus("");
  };

  const removeQualification = (id: string) => {
    void formik.setFieldValue(
      "qualifications",
      formik.values.qualifications.filter(
        (qualification) => qualification.id !== id,
      ),
    );
    formik.setStatus("");
  };

  return {
    formik,
    qualifications: formik.values.qualifications,
    message: typeof formik.status === "string" ? formik.status : "",
    setMessage: formik.setStatus,
    updateQualification,
    saveQualifications,
    addQualification,
    removeQualification,
  };
}
