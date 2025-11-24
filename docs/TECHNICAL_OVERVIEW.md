# Technical Overview

This document captures the current architecture, tooling, and integration strategy for the Impact Cloud Frontend.

## Stack
- **Framework:** React 18 + TypeScript
- **Bundler:** Vite (plugin-react-swc)
- **Styling:** Tailwind utility output (in `src/index.css`), RTL-first layouts, motion/react for animations
- **UI libs:** Radix UI, Lucide icons, Sonner toasts
- **HTTP:** Axios (`src/shared/api/apiClient.ts`) with request/response interceptors
- **State/Context:** Custom contexts for Auth, Theme, and Language

## Configuration
- `.env` / `.env.example`
  - `VITE_API_BASE_URL` (primary), fallback `VITE_BACKEND_BASE_URL`
  - `VITE_API_TIMEOUT`
  - Supabase keys (if used), debug flag
- Trailing slashes are trimmed in `config/env.config.ts`.
- Vite aliases pin some dependency versions (e.g., `sonner@2.0.3` → `sonner`).

## Architecture & Flows
- **Entry:** `src/main.tsx` mounts `App` and imports global styles.
- **Routing:** Custom URL utilities (`src/utils/urlUtils.ts`) maintain history and page state; `renderCurrentPage` chooses the active view. No external router.
- **Layout:** `App` renders unauthenticated pages (Landing/Login/Org Registration) or the authenticated `Layout` wrapper with navigation + content.
- **Auth:**
  - `auth.service.ts` handles `/auth/login|register|refresh|logout`, stores tokens via `tokenManager`, and seeds the default Axios `Authorization` header.
  - `AuthContext` loads `/users/me` on startup if a token exists and keeps `currentUser` / `isLoading`.
  - 401 handling in the Axios client attempts refresh; logout clears tokens and the default header.
- **API client (`apiClient.ts`):**
  - Base URL/timeout from `envConfig`.
  - Request interceptor adds `Authorization`, `Accept-Language`, `x-locale`.
  - Response interceptor saves `Content-Language` to localStorage.
- **Localization:** Backend messages are surfaced in toasts; locale packs live in `docs/locales/ar.json` and `docs/locales/en.json` if exported.
- **Assets/Styles:** Tailwind output is bundled in `src/index.css`; design is RTL by default.

## Security & Hardening
- Tokens are stored/cleared by `tokenManager`; Axios default auth header is set on login/refresh and re-seeded on app start when a token exists.
- Deprecated HTTP client removed (`src/shared/api/http.ts`); only Axios is used.
- Localization headers enforced; `Content-Language` respected.
- Production env requires `VITE_API_BASE_URL` (or `VITE_BACKEND_BASE_URL` as fallback).

## Expected Backend Contract (critical)
- `/auth/login` and `/auth/refresh` must return **both** `accessToken` and `refreshToken` (in `data.tokens` or at root) and a `user` object with `id, email, firstName, lastName, role, organizationId, avatar, status`.
- `/users/me` must return the same user shape.
- Endpoints for users, orgs, beneficiaries, surveys (list/summary/responses/analytics), transactions, billing/subscription, AI assistant, settings, audit logs, health, and optional public survey sharing should exist (see API integration guide for details).

## Working Practices
- Keep a single HTTP path (Axios client); avoid reintroducing fetch/legacy clients for authenticated flows.
- Don’t change UI/UX/animations; focus on data wiring, headers, and error handling.
- Use backend messages for toasts; fall back to locale packs when absent.
- For super-admin context switching, ensure endpoints support `organizationId` where applicable.
