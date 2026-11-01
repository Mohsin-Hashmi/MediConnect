# MediConnect backend agent guide

This file applies to `medi-connect-backend`.

## Purpose and stack

The backend provides authenticated healthcare scheduling APIs for patient and doctor workflows. It uses Node.js, Express 5, TypeScript in strict mode, MongoDB with Mongoose, Zod validation, and JWT authentication.

Run `npm run dev` for local development, `npm run lint` for ESLint, and `npx tsc --noEmit` for TypeScript validation. The repository does not currently have an automated test suite; never report tests as passing unless a test runner is added and executed.

## Architecture rules

- Keep code clean, scalable, secure, modular, and readable. Prefer straightforward domain code over unnecessary abstraction.
- Follow the existing feature flow: route -> authentication/role/validation middleware -> controller -> service -> model. Controllers own HTTP concerns; services own authorization and business rules; models own persistence constraints.
- Organize files by backend responsibility under `routes/`, `controllers/`, `services/`, `schemas/`, `models/`, and `types/`. Do not place business logic in routes or controllers.
- Use strict TypeScript types and Zod validation. Never use unsafe casts, `any`, or unvalidated request data to bypass compiler or validation errors.
- Return the established `{ success, message, data }` response envelope and use `ServiceError` for expected domain failures.
- Keep API response field names and nesting authoritative and stable so the frontend can consume backend contracts directly without alias mappers.

## Security and data integrity

- Authenticate protected routes and enforce role checks before the controller.
- Derive ownership fields such as patient and doctor IDs from the authenticated user and authoritative records. Never trust ownership identifiers supplied by a client.
- Enforce critical invariants in both service logic and database indexes when concurrency could bypass a pre-check.
- Return only fields needed by the workflow. Do not expose passwords, tokens, private credentials, or unrelated patient data.
- Validate ObjectIds, enums, strings, pagination limits, and state transitions. Store plain text for user-authored content unless a reviewed sanitization workflow exists.
- Do not log protected health information, credentials, access tokens, or review content.

## Change discipline

- Inspect related models, schemas, routes, authorization, response contracts, and frontend expectations before adding or changing an API.
- Preserve unrelated worktree changes and avoid broad refactors during focused feature work.
- Run backend lint and TypeScript validation after changes. Document any missing automated coverage or unresolved contract dependency.
