"use client";

import { Form, Formik } from "formik";
import { ArrowRight, AtSign, ShieldCheck } from "lucide-react";
import Link from "next/link";

import { AuthTabs } from "@/components/auth/auth-tabs";
import { PasswordInput } from "@/components/auth/password-input";
import { SocialLogin } from "@/components/auth/social-login";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginSchema } from "@/schemas/auth.schema";
import type { LoginFormValues } from "@/types/auth";

const initialValues: LoginFormValues = {
  email: "",
  password: "",
  remember: false,
};

export function LoginForm() {
  return (
    <>
      <AuthTabs active="login" />

      <Formik
        initialValues={initialValues}
        validationSchema={loginSchema}
        onSubmit={(_, helpers) => helpers.setSubmitting(false)}
      >
        {({ errors, touched, values, handleBlur, handleChange, setFieldValue }) => (
          <Form className="space-y-5" noValidate>
            <div className="space-y-2.5">
              <div className="flex items-center justify-between gap-3">
                <Label htmlFor="email">Email Address</Label>
                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-secondary">
                  <ShieldCheck className="size-3.5" aria-hidden="true" />
                  Verified ID
                </span>
              </div>
              <div className="relative">
                <AtSign
                  className="pointer-events-none absolute top-1/2 left-3.5 size-4.5 -translate-y-1/2 text-muted-foreground"
                  aria-hidden="true"
                />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="dr.alexander@mediconnect.org"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  aria-invalid={Boolean(touched.email && errors.email)}
                  aria-describedby={touched.email && errors.email ? "email-error" : undefined}
                  className="h-11.5 pl-10 text-sm"
                />
              </div>
              {touched.email && errors.email ? (
                <p id="email-error" className="text-xs text-destructive">{errors.email}</p>
              ) : null}
            </div>

            <div className="space-y-2.5">
              <div className="flex items-center justify-between gap-3">
                <Label htmlFor="password">Password</Label>
                <Link href="#" className="text-xs font-semibold text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>
              <PasswordInput
                id="password"
                name="password"
                autoComplete="current-password"
                placeholder="Enter your password"
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                aria-invalid={Boolean(touched.password && errors.password)}
                aria-describedby={touched.password && errors.password ? "password-error" : undefined}
              />
              {touched.password && errors.password ? (
                <p id="password-error" className="text-xs text-destructive">{errors.password}</p>
              ) : null}
            </div>

            <div className="flex items-center justify-between gap-3">
              <label className="flex cursor-pointer items-center gap-2.5 text-xs text-muted-foreground">
                <Checkbox
                  name="remember"
                  checked={values.remember}
                  onCheckedChange={(checked) => void setFieldValue("remember", checked)}
                />
                Remember for 30 days
              </label>
              <span className="inline-flex items-center gap-1.5 text-xs text-secondary">
                <ShieldCheck className="size-3.5" aria-hidden="true" />
                Auto-logout enabled
              </span>
            </div>

            <Button type="submit" size="lg" className="h-11.5 w-full text-sm shadow-sm">
              Sign In
              <ArrowRight aria-hidden="true" className="size-4" />
            </Button>
          </Form>
        )}
      </Formik>

      <SocialLogin />
    </>
  );
}
