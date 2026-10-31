import { BadgeCheck, Building2, FileBadge2 } from "lucide-react";

import { LabeledValueCard } from "@/components/common/labeled-value-card";
import { ProfileField } from "@/components/common/profile-field";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { DOCTOR_SPECIALTIES } from "@/constants/onboarding";
import type { DoctorProfileFormSectionProps } from "@/types/doctor-profile";

export function ProfessionalDetailsCard({
  formik,
}: DoctorProfileFormSectionProps) {
  const { doctor } = formik.values;

  return (
    <Card id="professional-details" className="scroll-mt-24 gap-0 py-0 shadow-sm ring-slate-200/90">
      <CardHeader className="border-b px-5 py-5 sm:px-6">
        <CardTitle>Professional details</CardTitle>
        <CardDescription>
          Present your experience, focus areas, and licensing information.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 px-5 py-5 sm:px-6">
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="specialty">
              Primary specialty
              <span className="ml-1 text-destructive" aria-hidden="true">*</span>
            </Label>
            <Select
              value={doctor.specialization}
              onValueChange={(value) => {
                void formik.setFieldValue("doctor.specialization", value);
                void formik.setFieldTouched(
                  "doctor.specialization",
                  true,
                  false,
                );
              }}
            >
              <SelectTrigger
                id="specialty"
                size="lg"
                className="w-full bg-white data-[size=lg]:h-11 data-[size=lg]:px-2.5"
                aria-invalid={Boolean(
                  formik.touched.doctor?.specialization &&
                    formik.errors.doctor?.specialization,
                )}
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent align="start" alignItemWithTrigger={false} className="p-1">
                {DOCTOR_SPECIALTIES.map((specialty) => (
                  <SelectItem key={specialty} value={specialty} className="px-3 py-2">
                    {specialty}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {formik.touched.doctor?.specialization &&
            formik.errors.doctor?.specialization ? (
              <p className="text-xs text-destructive">
                {formik.errors.doctor.specialization}
              </p>
            ) : null}
          </div>
          <ProfileField
            id="subspecialty"
            name="doctor.subspecialty"
            label="Area of focus"
            value={doctor.subspecialty ?? ""}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.doctor?.subspecialty
                ? formik.errors.doctor?.subspecialty
                : undefined
            }
          />
          <div className="space-y-2 sm:col-span-2">
            <div className="flex items-center justify-between gap-3">
              <Label htmlFor="biography">Professional biography</Label>
              <span className="text-xs text-muted-foreground">
                {doctor.bio?.length ?? 0} / 600
              </span>
            </div>
            <Textarea
              id="biography"
              name="doctor.bio"
              value={doctor.bio ?? ""}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              maxLength={600}
              aria-invalid={Boolean(
                formik.touched.doctor?.bio && formik.errors.doctor?.bio,
              )}
              className="min-h-32 resize-y bg-white leading-relaxed"
            />
            {formik.touched.doctor?.bio && formik.errors.doctor?.bio ? (
              <p className="text-xs text-destructive">
                {formik.errors.doctor.bio}
              </p>
            ) : null}
          </div>
        </div>

        <div className="rounded-xl border border-blue-100 bg-blue-50/60 p-4">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <FileBadge2 className="size-5 text-primary" />
              <p className="font-semibold">Medical registration</p>
            </div>
            {doctor.isVerified ? (
              <Badge className="bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200">
                <BadgeCheck className="size-3.5" />
                Verified record
              </Badge>
            ) : (
              <Badge variant="outline" className="bg-white text-slate-600">
                Verification pending
              </Badge>
            )}
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <LabeledValueCard
              label="License number"
              value={doctor.licenseNumber || "Not provided"}
            />
            <LabeledValueCard
              label="Licensing authority"
              value={doctor.licensingAuthority || "Not provided"}
            />
          </div>
          <div className="mt-3 flex items-start gap-2 text-xs leading-relaxed text-muted-foreground">
            <Building2 className="mt-0.5 size-3.5 shrink-0" />
            Registration details are read-only and managed through the credential verification workflow.
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
