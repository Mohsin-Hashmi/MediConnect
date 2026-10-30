import Link from "next/link";
import {
  ArrowUpRight,
  KeyRound,
  Laptop2,
  LogOut,
  ShieldCheck,
  UserRound,
} from "lucide-react";

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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import type { AccountSecuritySettingsProps } from "@/types/settings";

export function AccountSecuritySettings({
  account,
  onPreviewAction,
}: AccountSecuritySettingsProps) {
  return (
    <Card
      id="account"
      className="scroll-mt-24 gap-0 border-0 py-0 shadow-sm ring-1 ring-slate-200/90"
    >
      <CardHeader className="border-b px-5 py-5 sm:px-6">
        <div className="flex items-start gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-primary">
            <UserRound className="size-5" aria-hidden="true" />
          </span>
          <div>
            <CardTitle>Account &amp; security</CardTitle>
            <CardDescription className="mt-1">
              Review your account identity and sign-in protection.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6 px-5 py-5 sm:px-6">
        <div className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-slate-50/70 p-4 sm:flex-row sm:items-center">
          <Avatar className="size-12 shrink-0">
            <AvatarFallback className="bg-primary/10 font-semibold text-primary">
              {account.initials}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <p className="truncate font-semibold text-foreground">
                {account.name}
              </p>
              <Badge variant="outline" className="bg-white font-normal">
                {account.role}
              </Badge>
            </div>
            <p className="mt-1 truncate text-sm text-muted-foreground">
              {account.email} · Joined {account.joinedAt}
            </p>
          </div>
          <Button
            render={<Link href="/dashboard/profile" />}
            nativeButton={false}
            type="button"
            variant="outline"
            className="shrink-0"
          >
            Open doctor profile
            <ArrowUpRight className="size-4" aria-hidden="true" />
          </Button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="settings-account-name">Account name</Label>
            <Input
              id="settings-account-name"
              value={account.name}
              readOnly
              className="h-11 bg-slate-50"
            />
            <p className="text-xs text-muted-foreground">
              Professional identity is managed from Doctor Profile.
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="settings-account-email">Login email</Label>
            <Input
              id="settings-account-email"
              type="email"
              value={account.email}
              readOnly
              className="h-11 bg-slate-50"
            />
            <p className="text-xs text-muted-foreground">
              Email changes require a future verification workflow.
            </p>
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <ShieldCheck className="mt-0.5 size-5 text-primary" aria-hidden="true" />
            <div>
              <h3 className="font-semibold">Sign-in security</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Password and session controls will use dedicated security APIs.
              </p>
            </div>
          </div>

          <div className="divide-y rounded-xl border border-slate-200">
            <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <KeyRound className="mt-0.5 size-4.5 text-slate-500" aria-hidden="true" />
                <div>
                  <p className="text-sm font-semibold">Password</p>
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    Change your password after identity verification.
                  </p>
                </div>
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={() => onPreviewAction("Password changes")}
              >
                Change password
              </Button>
            </div>
            <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <Laptop2 className="mt-0.5 size-4.5 text-slate-500" aria-hidden="true" />
                <div>
                  <p className="text-sm font-semibold">Current session</p>
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    This browser · Active now
                  </p>
                </div>
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={() => onPreviewAction("Signing out")}
              >
                <LogOut className="size-4" aria-hidden="true" />
                Sign out
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
