"use client";

import { useFormik } from "formik";

import {
  INITIAL_QUALIFICATIONS,
  QUALIFICATIONS_STORAGE_KEY,
} from "@/constants/qualification";
import { qualificationsSchema } from "@/schemas/doctor-onboarding.schema";
import type {
  DoctorQualificationsFormValues,
  Qualification,
} from "@/types/qualification";

export function useDoctorQualifications(onSuccess: () => void) {
  const formik = useFormik<DoctorQualificationsFormValues>({
    initialValues: { qualifications: [...INITIAL_QUALIFICATIONS] },
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
    window.sessionStorage.setItem(
      QUALIFICATIONS_STORAGE_KEY,
      JSON.stringify(qualifications),
    );
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
