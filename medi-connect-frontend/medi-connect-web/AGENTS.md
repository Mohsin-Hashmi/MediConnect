<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# MediConnect frontend agent guide

This file applies to this Next.js application (`medi-connect-frontend/medi-connect-web`). Read `PLAN.md` before proposing or implementing a feature. Keep both documents aligned with the code; distinguish implemented behavior from planned behavior.

## Purpose and current reality

MediConnect is a healthcare scheduling frontend with account access, doctor onboarding, and a doctor portal. The portal currently has a dashboard overview, an appointments module, a calendar, and a fictional Patients directory. Other sidebar destinations are placeholders. Authentication (register/login) and doctor creation have API mutations; appointments, calendar blocks, patient records, metrics, and most dashboard content are mock data. Appointment and patient create/edit/delete forms are UI previews only: they validate and show feedback but do not change records or call an API. A mock appointment is not a server booking or a patient-directory record.

## Stack and commands

- Next.js 16 App Router, React 19, TypeScript (strict), Tailwind CSS 4.
- shadcn/ui `base-nova` components built on Base UI; Lucide icons.
- Formik + Yup for forms, TanStack Query + Axios for API operations, Sonner for notifications, date-fns for date handling, Recharts for the dashboard chart, jsPDF for schedule export.
- From this directory: `npm install`, `npm run dev`, `npm run lint`, `npm run build`, and `npm run start` (after a build). There is no automated test script yet; do not report tests as passing unless they exist and were run.
- Copy `.env.example` to a local environment file and set `NEXT_PUBLIC_API_URL` for backend calls. Never commit secrets or real credentials.
- Before changing Next.js routing, rendering, or APIs, follow the generated rule above and read the relevant installed documentation in `node_modules/next/dist/docs/`.

## Code map and architecture rules

- `app/`: routes and route layouts. Keep page files thin; the dashboard layout owns the shared sidebar, topbar, and read-only appointment provider.
- `components/ui/`: installed shadcn primitives. Compose these before adding new UI dependencies or recreating a primitive. Keep feature-specific styling in feature components; do not casually rewrite generated primitives.
- `components/auth/`, `components/onboarding/`, and `components/dashboard/{doctor-dashboard,appointments,calendar,patients}/`: feature UI. Keep each feature's entry component at its feature root, then group implementation details into focused subfolders such as `dialogs/`, `filters/`, `list/`, `sections/`, `views/`, `layout/`, or `shared/` as appropriate. Do not add a subfolder for a single component without a clear feature boundary. Give each component one responsibility and avoid oversized page components. Put only genuinely cross-feature UI in `components/common/`.
- `hooks/apis/`: TanStack Query API hooks. `lib/axios.ts` owns the shared Axios client and token-refresh behavior. Do not put direct endpoint calls in presentation components.
- `hooks/onboarding/`: onboarding form state and flow. `context/`: cross-feature React contexts. `providers/`: other application-level providers.
- `types/`: shared TypeScript types and component prop interfaces. `schemas/`: Yup validation schemas. `constants/`: reusable static options and keys. `data/mock/`: clearly labeled demo fixtures. `lib/`: pure formatting, filtering, scheduling, and storage utilities.
- Reuse the existing Formik/Yup/Sonner patterns for new forms and validation. Keep mock fixtures out of production API hooks. Use the `@/` import alias and preserve the project's existing naming conventions.
- Appointments and Calendar must read the same appointment source. Today that source is the read-only mock fixture exposed by `context/appointments-context.tsx`; its mutation callbacks are preview-only integration points. A future API integration should replace this source deliberately, not create a parallel calendar-only appointment list.
- Keep date and time handling consistent with the existing `YYYY-MM-DD` and `HH:mm` appointment fields. Account for timezone and overlapping/blocked slots when changing scheduling behavior.

## Strict boundaries

- Do not present mock data or preview-only form submissions as persisted backend state. Do not create a patient-directory record merely by entering a name in an appointment form.
- Do not claim PMDC verification, HIPAA compliance, clinical approval, actual payments, telemedicine availability, or patient notifications unless the corresponding backend workflow has been confirmed and implemented.
- Do not put real patient information, credentials, or secrets in mock fixtures, screenshots, logs, or documentation. Browser session storage used elsewhere in onboarding is not an approved production store for protected health data.
- Do not invent API endpoints, response shapes, authorization rules, or server-side booking guarantees. Confirm contracts before wiring new clinical workflows. Client-side collision checks are only a UX guard.
- Do not silently broaden scope, implement placeholder modules, install packages, or refactor unrelated code while handling a focused request. Preserve existing user changes in the worktree.
- Do not bypass form validation or suppress TypeScript/lint errors to make a build pass. Run `npm run lint` and `npm run build` after code changes when feasible, and report anything not verified.
