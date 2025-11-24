# Frontend API Contract (API v1)

All endpoints live under `http://localhost:3001/api/v1` unless noted. Responses use:

```jsonc
// success
{ "success": true, "data": { ... }, "message": "Localized optional text" }

// error
{ "success": false, "error": { "code": "ERROR_CODE", "message": "Localized", "details": { ... } } }
```

Localization honors `Accept-Language` / `x-locale` (`ar` default). `Content-Language` is set on every response. Locale packs for the UI are exported to `docs/locales/ar.json` and `docs/locales/en.json` (`npm run locales:export`).

## Seed / Test Accounts

| Role | Email | Password | Scope |
| --- | --- | --- | --- |
| Super Admin | `superadmin@impactcloud.io` | `SuperAdmin123!@#` | Full access |
| Org Admin | `admin@impactcloud.io` | `Admin123!@#` | Demo organization |
| Org Manager | `manager@impactcloud.io` | `Manager123!@#` | Org-scoped CRUD |
| Beneficiary | `beneficiary@impactcloud.io` | `Beneficiary123!@#` | Read-only |

## Authentication

| Method | Path | Description |
| --- | --- | --- |
| POST | `/auth/register` | { firstName, lastName, email, password } |
| POST | `/auth/login` | Returns user profile, access/refresh tokens |
| POST | `/auth/refresh` | Access/refresh rotation |
| POST | `/auth/logout` | Revoke refresh token |
| POST | `/auth/forgot-password` | Sends reset link |
| POST | `/auth/reset-password` | Reset with token |

Notes:
- Auth endpoints are rate-limited separately from general APIs.
- Credentials (email/password) are ASCII-only; all other text fields accept Arabic/English.

## Users

| Method | Path | Roles | Notes |
| --- | --- | --- | --- |
| GET | `/users` | super_admin, admin, org_manager | Filters: role, organizationId, page, limit |
| POST | `/users` | super_admin, admin | Create with optional password |
| PATCH | `/users/:id` | super_admin, admin | Update profile/role/status |
| DELETE | `/users/:id` | super_admin, admin | Soft delete (status→disabled/deleted) |

Returns `{ items, pagination: { page, limit, total, totalPages } }`.

## Organizations

| Method | Path | Description |
| --- | --- | --- |
| GET | `/organizations` | Org listing scoped by role |
| POST | `/organizations` | name, industry, country, city, contact, metadata, admin, captchaToken |
| PATCH | `/organizations/:id` | Update metadata/plan (role dependent) |
| POST | `/organizations/:id/approve` | Approve pending org |

## Beneficiaries

| Method | Path | Description |
| --- | --- | --- |
| GET | `/beneficiaries` | Filters: organizationId, status, pagination |
| POST | `/beneficiaries` | Create with metadata, org scoped |

## Surveys

| Method | Path | Description |
| --- | --- | --- |
| GET | `/surveys` | Filters: search, status[], categories[], organizations[], responseMin/Max, completionMin/Max, dateFrom/To, sortBy (`date|title|responses|completion`) |
| GET | `/surveys/summary` | `{ totalSurveys, activeSurveys, totalResponses, averageResponses }` (same filters) |
| GET | `/surveys/:id` | Single survey (org scoped) |
| POST | `/surveys` | Create |
| PATCH | `/surveys/:id` | Update |
| DELETE | `/surveys/:id` | Soft delete |
| POST | `/surveys/:id/publish` | Publish |
| POST | `/surveys/:id/responses` | Submit answers |
| GET | `/surveys/:id/responses` | Paginated responses |
| GET | `/surveys/:id/analytics` | Latest submission + counts |

## Transactions

| Method | Path | Notes |
| --- | --- | --- |
| GET | `/transactions` | Admins see all; managers scoped. Fields: amount, currency, type, status, metadata, processedAt |

## Analytics & Audit

| Method | Path | Description |
| --- | --- | --- |
| GET | `/analytics/dashboard` | Totals + recent surveys |
| GET | `/audit-logs` | Paginated logs, filterable by `action` |

## Billing & Subscription

| Method | Path | Description |
| --- | --- | --- |
| GET | `/subscriptions/plans` | Plan catalog + payment methods (public) |
| GET | `/billing/subscription` | Current org subscription (optional `organizationId` for super admins) |
| POST | `/billing/stripe/session` | `{ planId, paymentMethodId, organizationId? }` → { sessionId, checkoutUrl, expiresAt, plan, paymentMethod } |
| POST | `/billing/confirm` | `{ sessionId }` → completes subscription + audit log |

## AI Assistant

| Method | Path | Description |
| --- | --- | --- |
| POST | `/ai-assistant/ask` | `{ question, conversationHistory?, conversationId? }` |
| GET | `/ai-assistant/conversations` | List conversations |
| GET | `/ai-assistant/conversations/:id` | Conversation detail |
| DELETE | `/ai-assistant/conversations/:id` | Soft delete |
| POST | `/ai-assistant/feedback` | `{ messageId, rating, comment? }` |
| GET | `/ai-assistant/insights` | Proactive insights (org-scoped) |
| GET | `/ai-assistant/usage-stats?period=month` | Usage summary (`day|week|month|year`) |
| POST | `/ai-assistant/voice` | Multipart `audio` + optional `language`, `durationSeconds`, `transcriptionRequested` |

## Settings

| Method | Path | Description |
| --- | --- | --- |
| GET | `/settings/general` | Branding info |
| PUT | `/settings/general` | Update branding (`logoText`, `primaryColor`, etc.) |
| GET | `/settings/advanced` | Feature flags (`liveMode`, `betaAnalytics`, `aiAssistant`) |
| PUT | `/settings/advanced` | Update feature flags |
| GET | `/settings/system` | System toggles (`maintenanceMode`, etc.) |
| PUT | `/settings/system` | Update system toggles |

## Health & Utilities

| Method | Path | Description |
| --- | --- | --- |
| GET | `/health` | Status + DB connectivity |
| GET | `/docs/openapi.json` | OpenAPI spec |

## Error Codes

| Code | Meaning |
| --- | --- |
| `AUTH_*` | Authentication/authorization failures |
| `REQUEST_*` | Validation issues |
| `RESOURCE_001` | Entity not found |
| `SERVER_00*` | Unhandled server errors/timeouts |
| `RATE_LIMIT_001` | Too many requests |
| `AI_*` | AI module errors |
| `CORS_001` | Disallowed origin |

Render localized UI strings from `message` / `error.message`.

---

### Frontend wiring prompt (no UI/UX changes)
- Use `VITE_API_BASE_URL=http://localhost:3001/api/v1` (or env override) and set `Authorization: Bearer <accessToken>` for all private calls.
- Send `Accept-Language` or `x-locale` (`ar` default) on every request; read `Content-Language` for display.
- Use locale packs at `docs/locales/ar.json` and `docs/locales/en.json` for in-app copy; keep backend messages as source of truth for toasts/errors.
- Auth flows: store `accessToken`/`refreshToken` from `/auth/login`; call `/auth/refresh` on 401; clear on `/auth/logout`.
- For super-admin selects, pass `organizationId` where supported (e.g., `/billing/subscription`, survey filters).
- AI ask/voice: send requests to `/ai-assistant/ask` and `/ai-assistant/voice` with optional history/language; handle stubbed responses in non-AI environments.
- Billing: load `/subscriptions/plans` without auth; use `/billing/stripe/session` and `/billing/confirm` with authenticated requests.
- Surveys: use server-side filters/pagination; call `/surveys/summary` with the same filters as `/surveys`.
