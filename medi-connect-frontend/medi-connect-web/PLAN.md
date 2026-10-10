# MediConnect frontend plan

Updated: 2026-10-10. This is a working scope document, not a claim that the entire product is implemented. `AGENTS.md` contains the coding rules and boundaries.

## Product shape

MediConnect aims to help patients find care and help doctors manage onboarding, consultations, and scheduling. The present frontend focuses on the doctor journey: account registration, role selection, professional onboarding, and a doctor portal. Patient onboarding and most other portal modules are not yet built.

## What exists now

| Area | Current state |
| --- | --- |
| Register and login | UI, Formik/Yup validation, Sonner feedback, and TanStack Query/Axios calls to existing auth endpoints. |
| Doctor onboarding | Professional info, qualifications, practice/profile, review/submit; draft data is stored locally during the flow. Doctor creation uses an API mutation. |
| Doctor dashboard | Shared sidebar/topbar; overview cards, appointment summary, chart, and actions use demo data. |
| Appointments | Read-only mock list with filtering, sorting, pagination, details, create/edit/delete form previews, and PDF export. Submitting forms does not mutate records or call an API. |
| Calendar | Day/week/month views, date navigation, consultation filter, mock blocks, appointment details, and click-to-preview scheduling. It reads the same mock appointment source as the Appointments page. |
| Patients | Separate fictional read-only directory, derived metrics, search/filter/sort, 10-row pagination, details, create/edit/delete form previews, and PDF export. Submitting forms does not mutate records or call an API. |
| Other doctor portal links | Availability, Profile, Reviews, Earnings, Messages, Notifications, and Settings remain placeholders. |

The appointment form currently captures a patient's name and age for a UI preview; it does not create a booking or select a persisted patient record. Appointment and patient lists remain unchanged after submissions. Calendar blocks and available-time calculations are mock-only.

## Near-term priorities

1. **Review the current UI and code with the project owner.** Address specific feedback before expanding the module surface.
2. **Agree on scheduling workflows and backend contracts.** Define patient lookup/creation, doctor working hours, available slots, blocks/leave, appointment status transitions, conflict responses, timezone rules, and authorization. Do not infer these from the mock UI.
3. **Connect Appointments and Calendar to authoritative APIs when available.** Use TanStack Query hooks, shared query keys/invalidation, server-side validation, and clear loading/error/empty states. Keep both views synchronized from one server source.
4. **Build the next approved doctor module incrementally.** Availability remains a likely dependency for real calendar scheduling, but its scope requires owner approval. Connect Patients to an authoritative API only after the patient identity and authorization contract is defined.
5. **Add automated coverage for scheduling rules and key user flows.** No test runner is configured today; choose one as part of a specific approved task.

## Current scope and non-goals

- Current development is frontend-first and can use clearly labeled mock data for unfinished modules.
- No appointment, availability, patient-directory, payment, telemedicine, messaging, or notification backend integration is assumed to exist merely because UI controls or routes exist.
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
