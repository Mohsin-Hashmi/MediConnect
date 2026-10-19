import {
  BadgeCheck,
  Building2,
  Eye,
  Lightbulb,
  MapPin,
} from "lucide-react";

import { ChecklistItem } from "@/components/common/checklist-item";
import { IconText } from "@/components/common/icon-text";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Progress,
  ProgressLabel,
  ProgressValue,
} from "@/components/ui/progress";
import type { DoctorProfileSectionProps } from "@/types/doctor-profile";

export function ProfileSummary({ profile }: DoctorProfileSectionProps) {
  return (
    <aside className="space-y-4 xl:sticky xl:top-20 xl:self-start">
      <Card className="gap-0 py-0 shadow-sm ring-slate-200/90">
        <CardHeader className="border-b px-5 py-4">
          <CardTitle className="flex items-center gap-2">
            <Eye className="size-4 text-primary" />
            Patient preview
          </CardTitle>
        </CardHeader>
        <CardContent className="px-5 py-5">
          <div className="flex items-start gap-3">
            <Avatar className="size-14 bg-primary/10">
              <AvatarFallback className="bg-primary/10 font-semibold text-primary">
                {profile.initials}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-1.5">
                <p className="font-semibold">{profile.displayName}</p>
                {profile.isVerified ? (
                  <BadgeCheck className="size-4 fill-primary text-white" />
                ) : null}
              </div>
              <p className="mt-0.5 text-sm text-primary">{profile.specialty}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {profile.experienceYears} years of clinical experience
              </p>
            </div>
          </div>
          <div className="my-4 h-px bg-border" />
          <div className="space-y-3 text-sm">
            <IconText icon={Building2} text={profile.hospitalName} />
            <IconText
              icon={MapPin}
              text="Practice location available when booking"
            />
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <Badge variant="secondary">
              PKR {profile.consultationFee.toLocaleString()}
            </Badge>
            <Badge variant="outline">{profile.subspecialty}</Badge>
          </div>
        </CardContent>
      </Card>

      <Card className="gap-0 py-0 shadow-sm ring-slate-200/90">
        <CardHeader className="border-b px-5 py-4">
          <CardTitle>Profile readiness</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 px-5 py-5">
          <Progress value={profile.profileCompletion}>
            <ProgressLabel>Profile completion</ProgressLabel>
            <ProgressValue>
              {() => `${profile.profileCompletion}%`}
            </ProgressValue>
          </Progress>
          <div className="space-y-2.5">
            <ChecklistItem label="Identity details complete" />
            <ChecklistItem label="License information added" />
            <ChecklistItem label="Practice details added" />
          </div>
          <div className="flex gap-2 rounded-lg bg-amber-50 p-3 text-xs leading-relaxed text-amber-800 ring-1 ring-amber-200">
            <Lightbulb className="mt-0.5 size-4 shrink-0" />
            Add a professional headshot and practice address to strengthen your
            public profile.
          </div>
        </CardContent>
      </Card>
    </aside>
  );
}
