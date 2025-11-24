# API Integration Guide

Complete integration guide for connecting the frontend with the backend API (API v1).

## Overview
Frontend (React + TypeScript) → Axios API client → Backend API → DB (Supabase PostgreSQL).

## Project Structure (API-related)
```
/
└── .env.example
└── config/
    └── env.config.ts          # Env loading (base URL, timeout)
└── shared/
    └── api/
        └── apiClient.ts       # Axios instance with interceptors (single HTTP path)
    └── auth/
        └── tokenManager.ts    # JWT token storage/reading
└── api/
    └── services/              # Endpoint wrappers
        ├── auth.service.ts
        ├── users.service.ts
        ├── organizations.service.ts
        ├── beneficiaries.service.ts
        ├── surveys.service.ts
        ├── billing.service.ts
        ├── ai-assistant.service.ts
        ├── analytics.service.ts
        ├── settings.service.ts
        ├── transactions.service.ts
        └── audit-logs.service.ts
└── context/
    └── AuthContext.tsx        # Authentication context
```

## Setup
1) Copy env: `cp .env.example .env`  
2) Set required vars:
```env
VITE_API_BASE_URL=http://localhost:3001/api/v1
VITE_API_TIMEOUT=30000
VITE_RECAPTCHA_SITE_KEY=your_key_here
VITE_STRIPE_PUBLISHABLE_KEY=your_key_here
```
3) Install deps: `npm install`  
4) Run dev: `npm run dev`

## Authentication Flow
- Login: `authService.login()` stores tokens via `tokenManager` and seeds Axios default `Authorization` header.
- Refresh: Axios response interceptor attempts `/auth/refresh` on 401 using the stored refresh token; tokens are updated and the original request is retried.
- Logout: `authService.logout()` revokes refresh token (if present) and clears tokens + default auth header.
- Startup: `AuthContext` checks stored token, seeds the auth header, then fetches `/users/me` to populate `currentUser`.

### Expected Auth Payloads
- `/auth/login` and `/auth/refresh` must return both `accessToken` and `refreshToken` (either in `data.tokens` or at root) and a `user` object with `id, email, firstName, lastName, role, organizationId, avatar, status`.
- `/users/me` returns the same user shape.

## Headers & Localization
- Every request sends `Accept-Language` and `x-locale` (default `ar`).
- Responses should set `Content-Language`; the Axios response interceptor saves it to localStorage.
- Authenticated calls include `Authorization: Bearer <accessToken>`.

## API Usage Examples
```typescript
import { authService, usersService, surveysService } from '@/api/services';

// Login
await authService.login({ email: 'admin@impactcloud.io', password: 'Admin123!@#' });

// Current user profile
const profile = await usersService.getProfile();

// List surveys with filters
const surveys = await surveysService.list({
  search: 'impact',
  status: ['published'],
  page: 1,
  limit: 20,
});

// Submit survey responses
await surveysService.submitResponses('surveyId', { answers: {/* ... */} });
```

## Endpoint Expectations (per contract)
- Auth: `/auth/login|register|refresh|logout|forgot-password|reset-password|change-password`
- Users: `/users`, `/users/me`
- Organizations: `/organizations`, `/organizations/:id`, `/organizations/:id/approve`
- Beneficiaries: `/beneficiaries` CRUD, `/beneficiaries/import` (multipart), `/beneficiaries/export` (csv|excel + filters)
- Surveys: list/summary, CRUD, publish, responses, analytics, optional public share endpoints
- Transactions: `/transactions`
- Billing/Subscription: `/subscriptions/plans`, `/billing/subscription`, `/billing/stripe/session`, `/billing/confirm`
- AI Assistant: `/ai-assistant/ask`, `/ai-assistant/voice`, conversations CRUD, feedback, insights, usage-stats
- Settings: `/settings/general|advanced|system`
- Audit Logs: `/audit-logs`
- Health/Docs: `/health`, `/docs/openapi.json`

## Notes
- Use the single Axios client (`apiClient.ts`); legacy HTTP utilities were removed.
- Ensure backend error shape is `{ success: false, error: { code, message, details } }` to surface messages in toasts.
- Super-admin context: endpoints should accept `organizationId` where applicable (billing, surveys, beneficiaries, transactions).
