import { Camera, CircleCheckBig } from "lucide-react";

import { ProfileField } from "@/components/common/profile-field";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import type { DoctorProfileFormSectionProps } from "@/types/doctor-profile";

export function PersonalInformationCard({
  profile,
  formik,
}: DoctorProfileFormSectionProps) {
  return (
    <Card
      id="personal-information"
      className="scroll-mt-24 gap-0 py-0 shadow-sm ring-slate-200/90"
    >
      <CardHeader className="border-b px-5 py-5 sm:px-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <CardTitle>Personal information</CardTitle>
            <CardDescription className="mt-1">
              Keep your identity and contact details accurate.
            </CardDescription>
          </div>
          {profile.isVerified ? (
            <Badge className="bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200">
              <CircleCheckBig className="size-3.5" />
              Identity verified
            </Badge>
          ) : null}
        </div>
      </CardHeader>
      <CardContent className="space-y-6 px-5 py-5 sm:px-6">
        <div className="flex flex-col gap-4 rounded-xl bg-slate-50 p-4 sm:flex-row sm:items-center">
          <Avatar className="size-20 bg-primary/10 text-primary">
            <AvatarFallback className="bg-primary/10 text-lg font-semibold text-primary">
              {profile.initials}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="font-semibold">Profile photo</p>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
              Use a clear, professional headshot. JPG, PNG, or WebP up to 5 MB.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Button type="button" variant="outline" size="sm">
                <Camera className="size-4" />
                Change photo
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-muted-foreground"
              >
                Remove
              </Button>
            </div>
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <ProfileField
            id="first-name"
            name="firstName"
            label="First name"
            value={formik.values.firstName}
            required
            autoComplete="given-name"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.firstName ? formik.errors.firstName : undefined
            }
          />
          <ProfileField
            id="last-name"
            name="lastName"
            label="Last name"
            value={formik.values.lastName}
            required
            autoComplete="family-name"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.lastName ? formik.errors.lastName : undefined
            }
          />
          <ProfileField
            id="email"
            name="email"
            label="Work email"
            value={formik.values.email}
            type="email"
            required
            autoComplete="email"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.email ? formik.errors.email : undefined}
          />
          <ProfileField
            id="phone"
            name="phone"
            label="Phone number"
            value={formik.values.phone}
            type="tel"
            autoComplete="tel"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.phone ? formik.errors.phone : undefined}
          />
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="gender">Gender</Label>
            <Select
              value={formik.values.gender}
              onValueChange={(value) => {
                void formik.setFieldValue("gender", value);
                void formik.setFieldTouched("gender", true, false);
              }}
            >
              <SelectTrigger
                id="gender"
                size="lg"
                className="w-full bg-white"
                aria-invalid={Boolean(
                  formik.touched.gender && formik.errors.gender,
                )}
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent
                align="start"
                alignItemWithTrigger={false}
                className="p-1"
              >
                <SelectItem value="Female" className="px-3 py-2">
                  Female
                </SelectItem>
                <SelectItem value="Male" className="px-3 py-2">
                  Male
                </SelectItem>
                <SelectItem value="Other" className="px-3 py-2">
                  Other
                </SelectItem>
              </SelectContent>
            </Select>
            {formik.touched.gender && formik.errors.gender ? (
              <p className="text-xs text-destructive">
                {formik.errors.gender}
              </p>
            ) : null}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
