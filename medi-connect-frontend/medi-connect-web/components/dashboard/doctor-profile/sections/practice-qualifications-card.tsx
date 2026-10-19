import { Building2, CalendarCheck2, GraduationCap, Languages, WalletCards } from "lucide-react";

import { ProfileField } from "@/components/common/profile-field";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { DoctorProfileFormSectionProps } from "@/types/doctor-profile";

export function PracticeQualificationsCard({
  formik,
}: DoctorProfileFormSectionProps) {
  return (
    <Card id="practice-qualifications" className="scroll-mt-24 gap-0 py-0 shadow-sm ring-slate-200/90">
      <CardHeader className="border-b px-5 py-5 sm:px-6">
        <CardTitle>Practice & qualifications</CardTitle>
        <CardDescription>
          Review your clinical affiliation, fees, languages, and education.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 px-5 py-5 sm:px-6">
        <div className="grid gap-5 sm:grid-cols-2">
          <ProfileField
            id="hospital-name"
            name="hospitalName"
            label="Primary hospital or clinic"
            value={formik.values.hospitalName}
            icon={Building2}
            required
            className="sm:col-span-2"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.hospitalName
                ? formik.errors.hospitalName
                : undefined
            }
          />
          <ProfileField
            id="experience-years"
            name="experienceYears"
            label="Clinical experience"
            value={formik.values.experienceYears}
            type="number"
            icon={CalendarCheck2}
            min={0}
            max={80}
            required
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.experienceYears
                ? formik.errors.experienceYears
                : undefined
            }
          />
          <ProfileField
            id="consultation-fee"
            name="consultationFee"
            label="Standard consultation fee (PKR)"
            value={formik.values.consultationFee}
            type="number"
            icon={WalletCards}
            min={1}
            required
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.consultationFee
                ? formik.errors.consultationFee
                : undefined
            }
          />
        </div>

        <div>
          <div className="mb-3 flex items-center gap-2">
            <GraduationCap className="size-4 text-primary" />
            <p className="font-semibold">Education & credentials</p>
          </div>
          <div className="space-y-3">
            {formik.values.qualifications.map((qualification) => (
              <div key={qualification.id} className="flex flex-col gap-2 rounded-xl border bg-slate-50/70 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-semibold">{qualification.degree}</p>
                  <p className="mt-0.5 text-sm text-muted-foreground">{qualification.institute}</p>
                </div>
                <Badge variant="outline" className="bg-white">Completed {qualification.year}</Badge>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="mb-3 flex items-center gap-2">
            <Languages className="size-4 text-primary" />
            <p className="font-semibold">Languages spoken</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {formik.values.languages.map((language) => (
              <Badge key={language} variant="secondary" className="h-7 px-3">{language}</Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
