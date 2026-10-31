"use client";

import { useFormik } from "formik";
import { toast } from "sonner";

import { Error } from "@/components/common/error";
import { ProfilePageSkeleton } from "@/components/dashboard/doctor-profile/profile-page-skeleton";
import { PracticeQualificationsCard } from "@/components/dashboard/doctor-profile/sections/practice-qualifications-card";
import { PersonalInformationCard } from "@/components/dashboard/doctor-profile/sections/personal-information-card";
import { ProfessionalDetailsCard } from "@/components/dashboard/doctor-profile/sections/professional-details-card";
import { ProfileFormActions } from "@/components/dashboard/doctor-profile/sections/profile-form-actions";
import { ProfilePageHeader } from "@/components/dashboard/doctor-profile/sections/profile-page-header";
import { ProfileSummary } from "@/components/dashboard/doctor-profile/sections/profile-summary";
import { Card } from "@/components/ui/card";
import {
  useDoctorProfile,
  useUpdateDoctorProfile,
} from "@/hooks/apis/doctor/use-doctor-profile";
import { getApiErrorMessage } from "@/lib/api-error";
import { doctorProfileSchema } from "@/schemas/doctor-profile.schema";
import type { DoctorProfileResponse } from "@/types/doctor";
import type { DoctorProfileFormValues } from "@/types/doctor-profile";

interface DoctorProfileFormProps {
  profile: DoctorProfileResponse["data"];
}

function DoctorProfileForm({ profile }: DoctorProfileFormProps) {
  const updateMutation = useUpdateDoctorProfile();
  const formik = useFormik<DoctorProfileFormValues>({
    initialValues: profile,
    enableReinitialize: true,
    validationSchema: doctorProfileSchema,
    onSubmit: async (values, helpers) => {
      const { user, doctor } = values;

      try {
        await updateMutation.mutateAsync({
          account: {
            name: user.name.trim(),
            phone: user.phone?.trim() || null,
            gender: user.gender,
          },
          doctor: {
            specialization: doctor.specialization,
            subspecialty: doctor.subspecialty?.trim() || null,
            profilePicture: doctor.profilePicture,
            experience: Number(doctor.experience),
            hospitalName: doctor.hospitalName?.trim() || null,
            consultationFee:
              doctor.consultationFee === null
                ? null
                : Number(doctor.consultationFee),
            bio: doctor.bio?.trim() || null,
            languages: [
              ...new Set(
                doctor.languages.map((language) => language.trim()),
              ),
            ].filter(Boolean),
          },
        });
        helpers.resetForm({ values });
        toast.success("Doctor profile updated successfully.");
      } catch (error) {
        toast.error(
          getApiErrorMessage(error, "Doctor profile could not be updated."),
        );
      } finally {
        helpers.setSubmitting(false);
      }
    },
  });

  async function handlePreview() {
    await formik.setTouched({
      user: {
        name: true,
        email: true,
        phone: true,
        gender: true,
      },
      doctor: {
        specialization: true,
        subspecialty: true,
        experience: true,
        bio: true,
        hospitalName: true,
        consultationFee: true,
      },
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

  return (
    <form className="space-y-5" onSubmit={formik.handleSubmit} noValidate>
      <div className="grid min-w-0 items-start gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="min-w-0 space-y-5">
          <PersonalInformationCard formik={formik} />
          <ProfessionalDetailsCard formik={formik} />
          <PracticeQualificationsCard formik={formik} />
          <ProfileFormActions
            onPreview={() => void handlePreview()}
            isSubmitting={formik.isSubmitting || updateMutation.isPending}
          />
        </div>
        <ProfileSummary profile={formik.values} />
      </div>
    </form>
  );
}

export function DoctorProfilePage() {
  const profileQuery = useDoctorProfile();

  return (
    <section
      aria-label="Doctor profile"
      className="w-full flex-1 space-y-5 px-4 py-6 sm:px-5 lg:px-6 2xl:px-8"
    >
      <ProfilePageHeader />
      {profileQuery.isLoading ? <ProfilePageSkeleton /> : null}
      {profileQuery.isError ? (
        <Card className="gap-0 border-0 py-0 shadow-sm ring-1 ring-slate-200/90">
          <Error
            title="Could not load doctor profile"
            message={getApiErrorMessage(
              profileQuery.error,
              "Your profile information could not be loaded.",
            )}
            onRetry={() => void profileQuery.refetch()}
          />
        </Card>
      ) : null}
      {profileQuery.data ? (
        <DoctorProfileForm profile={profileQuery.data} />
      ) : null}
    </section>
  );
}
