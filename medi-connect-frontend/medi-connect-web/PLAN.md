# MediConnect frontend plan

Updated: 2026-10-21. This is a working scope document, not a claim that the entire product is implemented. `AGENTS.md` contains the coding rules and boundaries.

## Product shape

MediConnect aims to help patients find care and help doctors manage onboarding, consultations, and scheduling. The present frontend focuses on the doctor journey: account registration, role selection, professional onboarding, and a doctor portal. Patient onboarding and most other portal modules are not yet built.

## What exists now

| Area | Current state |
| --- | --- |
| Register and login | UI, Formik/Yup validation, Sonner feedback, and TanStack Query/Axios calls to existing auth endpoints. |
| Doctor onboarding | Professional info, qualifications, practice/profile, review/submit; draft data is stored locally during the flow. Doctor creation uses an API mutation. |
| Doctor dashboard | Shared sidebar/topbar with API-backed appointment metrics, today’s schedule, next appointment, and weekly activity. |
| Appointments | Doctor-scoped API list/detail data with filtering, sorting, pagination, PDF export, and confirm/complete/cancel actions. Doctors cannot create, arbitrarily edit, or delete patient bookings. |
| Calendar | Day/week/month views and appointment details backed by the same TanStack Query appointment cache as Appointments. Blocked-time data is not displayed until an authoritative API is connected. |
| Patients | Read-only doctor-scoped API directory of patients connected through assigned appointments, with metrics, search/filter/sort, 10-row pagination, details, and PDF export. Patient account creation and profile management stay in the patient flow. |
| Availability | Doctor-scoped API list/create/update/delete for dated bookable windows, with Formik/Yup validation, status, slot capacity, loading/error/empty states, and confirmation before deletion. |
| Doctor profile | Responsive profile-management UI built with isolated mock data; API persistence and public-profile preview are not connected yet. |
| Reviews | Responsive patient-feedback preview with isolated mock data, rating metrics and distribution, filters, pagination, PDF export, and non-persisting reply controls; the reviews API is not connected yet. |
| Earnings | Responsive financial reporting preview with isolated mock data, revenue metrics, chart, filters, pagination, and PDF export; payout and settlement APIs are not connected. |
| Messages | Responsive messaging workspace preview with isolated mock conversations, searchable All/Unread inbox views, appointment context, accessible message history, and non-sending composer controls; REST history and Socket.IO are not connected yet. |
| Notifications | Responsive activity-center preview with isolated mock events, summary metrics, filters, date-grouped rows, pagination, related-module links, and non-persisting read/remove controls; notification APIs and real-time delivery are not connected yet. |
| Other doctor portal links | Settings remains a placeholder. |

Patients own appointment creation through the patient-only backend booking endpoint. The doctor portal reads assigned bookings, exposes connected patients as read-only, manages dated availability, and performs only supported appointment status transitions. The patient dashboard booking UI is not built yet.

## Near-term priorities

1. **Review the current UI and code with the project owner.** Address specific feedback before expanding the module surface.
2. **Build the patient booking journey.** Use the existing patient-only booking contract and authoritative doctor availability; keep booking validation on the server.
3. **Finish scheduling contracts.** Define visit mode, fee snapshots, timezone behavior, conflict guarantees, and patient notification rules before displaying those fields as authoritative appointment data.
4. **Build the patient booking experience.** Consume doctor availability from the patient dashboard and keep booking ownership outside the doctor portal.
5. **Add automated coverage for scheduling rules and key user flows.** No test runner is configured today; choose one as part of a specific approved task.

## Current scope and non-goals

- Current development is frontend-first and can use clearly labeled mock data for unfinished modules.
- Appointment reads, doctor status actions, dated availability, and the appointment-derived read-only patient directory are integrated. Payment, telemedicine, messaging, and notification UI must not be treated as integrated merely because controls or routes exist.
- Do not treat browser session storage as a secure health-record store or as multi-device persistence.
- Do not make regulatory, security, or verification promises in product copy without confirmed implementation and review.
- Do not build all sidebar modules at once or expand the patient experience without a specific approved design and workflow.

## Decision points before the next scheduling phase

- Should a doctor book only existing patient records, create a patient inline, or support both? What minimum identity fields are required?
- Which actions may create or modify available time, breaks, and leave, and how should conflicting booked appointments be handled?
- What timezone and clinic-hours rules govern the Calendar? Is the doctor allowed to override a blocked/full slot?
- Which appointment statuses and transitions are valid, and what should trigger patient notifications?
- Which backend endpoints and response contracts are authoritative for appointments, patients, and availability?

Update this file after the owner confirms a decision or a module becomes real, and keep the "What exists now" table honest.
