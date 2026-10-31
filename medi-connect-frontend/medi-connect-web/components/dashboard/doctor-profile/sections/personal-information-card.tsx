import { Camera, CircleCheckBig } from "lucide-react";

import { ProfileField } from "@/components/common/profile-field";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  formik,
}: DoctorProfileFormSectionProps) {
  const { user, doctor } = formik.values;
  const initials =
    user.name
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((name) => name.charAt(0).toUpperCase())
      .join("") || "DR";

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
          {doctor.isVerified ? (
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
            {doctor.profilePicture ? (
              <AvatarImage
                src={doctor.profilePicture}
                alt={`${user.name} profile`}
              />
            ) : null}
            <AvatarFallback className="bg-primary/10 text-lg font-semibold text-primary">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="font-semibold">Profile photo</p>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
              The current professional headshot is loaded from your doctor profile.
              Uploading a replacement requires the media storage API.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Button type="button" variant="outline" size="sm" disabled>
                <Camera className="size-4" />
                Change photo
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-muted-foreground"
                disabled={!doctor.profilePicture}
                onClick={() =>
                  void formik.setFieldValue("doctor.profilePicture", null)
                }
              >
                Remove
              </Button>
            </div>
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <ProfileField
            id="name"
            name="user.name"
            label="Full name"
            value={user.name}
            required
            autoComplete="name"
            className="sm:col-span-2"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.user?.name ? formik.errors.user?.name : undefined}
          />
          <ProfileField
            id="email"
            name="user.email"
            label="Work email"
            value={user.email}
            type="email"
            required
            readOnly
            autoComplete="email"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.user?.email ? formik.errors.user?.email : undefined}
            inputClassName="bg-slate-50 text-muted-foreground"
          />
          <ProfileField
            id="phone"
            name="user.phone"
            label="Phone number"
            value={user.phone ?? ""}
            type="tel"
            autoComplete="tel"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.user?.phone ? formik.errors.user?.phone : undefined}
          />
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="gender">Gender</Label>
            <Select
              value={user.gender}
              onValueChange={(value) => {
                void formik.setFieldValue("user.gender", value);
                void formik.setFieldTouched("user.gender", true, false);
              }}
            >
              <SelectTrigger
                id="gender"
                size="lg"
                className="w-full bg-white data-[size=lg]:h-11 data-[size=lg]:px-2.5"
                aria-invalid={Boolean(
                  formik.touched.user?.gender && formik.errors.user?.gender,
                )}
            >
              <SelectValue placeholder="Select gender" />
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
            {formik.touched.user?.gender && formik.errors.user?.gender ? (
              <p className="text-xs text-destructive">
                {formik.errors.user.gender}
              </p>
            ) : null}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
