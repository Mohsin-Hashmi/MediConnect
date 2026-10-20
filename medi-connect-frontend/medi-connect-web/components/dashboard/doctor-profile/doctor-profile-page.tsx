"use client";

import { useFormik } from "formik";
import { toast } from "sonner";

import { PracticeQualificationsCard } from "@/components/dashboard/doctor-profile/sections/practice-qualifications-card";
import { PersonalInformationCard } from "@/components/dashboard/doctor-profile/sections/personal-information-card";
import { ProfessionalDetailsCard } from "@/components/dashboard/doctor-profile/sections/professional-details-card";
import { ProfileFormActions } from "@/components/dashboard/doctor-profile/sections/profile-form-actions";
import { ProfilePageHeader } from "@/components/dashboard/doctor-profile/sections/profile-page-header";
import { ProfileSummary } from "@/components/dashboard/doctor-profile/sections/profile-summary";
import { DOCTOR_PROFILE_FIXTURE } from "@/data/mock/doctor-profile";
import { doctorProfileSchema } from "@/schemas/doctor-profile.schema";
import type {
  DoctorProfileFormValues,
  DoctorProfileViewModel,
} from "@/types/doctor-profile";

const initialValues: DoctorProfileFormValues = {
  firstName: DOCTOR_PROFILE_FIXTURE.firstName,
  lastName: DOCTOR_PROFILE_FIXTURE.lastName,
  email: DOCTOR_PROFILE_FIXTURE.email,
  phone: DOCTOR_PROFILE_FIXTURE.phone,
  gender: DOCTOR_PROFILE_FIXTURE.gender,
  specialty: DOCTOR_PROFILE_FIXTURE.specialty,
  subspecialty: DOCTOR_PROFILE_FIXTURE.subspecialty,
  experienceYears: DOCTOR_PROFILE_FIXTURE.experienceYears,
  biography: DOCTOR_PROFILE_FIXTURE.biography,
  licenseNumber: DOCTOR_PROFILE_FIXTURE.licenseNumber,
  licensingAuthority: DOCTOR_PROFILE_FIXTURE.licensingAuthority,
  hospitalName: DOCTOR_PROFILE_FIXTURE.hospitalName,
  consultationFee: DOCTOR_PROFILE_FIXTURE.consultationFee,
  languages: DOCTOR_PROFILE_FIXTURE.languages,
  qualifications: DOCTOR_PROFILE_FIXTURE.qualifications,
};

export function DoctorProfilePage() {
  const formik = useFormik<DoctorProfileFormValues>({
    initialValues,
    validationSchema: doctorProfileSchema,
    onSubmit: (_values, helpers) => {
      toast.success(
        "Profile is valid. API persistence will be connected later.",
      );
      helpers.setSubmitting(false);
    },
  });

  async function handlePreview() {
    await formik.setTouched({
      firstName: true,
      lastName: true,
      email: true,
      phone: true,
      gender: true,
      specialty: true,
      subspecialty: true,
      experienceYears: true,
      biography: true,
      hospitalName: true,
      consultationFee: true,
    });
    const errors = await formik.validateForm();

    if (Object.keys(errors).length > 0) {
      toast.error("Complete the required profile fields before previewing.");
      return;
    }

    toast.info(
      "The patient-facing profile preview will be connected in a later phase.",
    );
  }

  const fullName = `${formik.values.firstName} ${formik.values.lastName}`.trim();
  const previewProfile: DoctorProfileViewModel = {
    ...DOCTOR_PROFILE_FIXTURE,
    ...formik.values,
    displayName: fullName ? `Dr. ${fullName}` : "Doctor",
    initials:
      [formik.values.firstName, formik.values.lastName]
        .filter(Boolean)
        .map((name) => name.charAt(0).toUpperCase())
        .join("") || "DR",
  };

  return (
    <section aria-label="Doctor profile" className="w-full flex-1 space-y-5 px-4 py-6 sm:px-5 lg:px-6 2xl:px-8">
      <ProfilePageHeader />
      <form className="space-y-5" onSubmit={formik.handleSubmit} noValidate>
        <div className="grid min-w-0 items-start gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
          <div className="min-w-0 space-y-5">
            <PersonalInformationCard
              profile={DOCTOR_PROFILE_FIXTURE}
              formik={formik}
            />
            <ProfessionalDetailsCard
              profile={DOCTOR_PROFILE_FIXTURE}
              formik={formik}
            />
            <PracticeQualificationsCard
              profile={DOCTOR_PROFILE_FIXTURE}
              formik={formik}
            />
            <ProfileFormActions
              onPreview={() => void handlePreview()}
              isSubmitting={formik.isSubmitting}
            />
          </div>
          <ProfileSummary profile={previewProfile} />
        </div>
      </form>
    </section>
  );
}
