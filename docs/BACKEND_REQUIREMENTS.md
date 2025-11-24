# Backend Requirements (UI/UX Coverage)

Backend expectations inferred from the frontend flows. Use this as the single source to build/validate all needed APIs and payloads.

## Conventions
- Base URL: `/api/v1`
- Success: `{ success: true, data, message? }`
- Error: `{ success: false, error: { code, message, details? } }`
- Headers: `Authorization: Bearer <accessToken>` for private calls; honor `Accept-Language`/`x-locale` (default `ar`); set `Content-Language` on responses.

## Auth & Identity
- `POST /auth/register` → create org + admin (firstName, lastName, email, password, organizationName?, industry?, country?, city?, phone?, acceptTerms, captchaToken). Returns user + `accessToken`, `refreshToken`, `expiresIn`.
- `POST /auth/login` → tokens + user (id, email, firstName, lastName, role, organizationId, avatar, status).
- `POST /auth/refresh` → rotated tokens (must include accessToken + refreshToken).
- `POST /auth/logout` → revoke refresh; clear tokens client-side.
- `POST /auth/forgot-password`, `POST /auth/reset-password`, `POST /auth/change-password`.
- `GET /users/me` → same user shape as login.
- Roles: super_admin (global), admin (org-scoped), org_manager (org-scoped), beneficiary (read-only). Admins/managers scoped to their org; super_admin can pass `organizationId`.

## Organizations
- `GET /organizations` (scoped by role; pagination/search if available).
- `POST /organizations` (super_admin) → metadata/contact/admin user (if supported), captchaToken.
- `PATCH /organizations/:id` → update metadata/plan.
- `POST /organizations/:id/approve` (super_admin) → approve pending org.
- Optional: `GET /organizations/:id` for detail views.

## Users
- `GET /users` (filters: role, organizationId, search, status, page, limit).
- `POST /users` (super_admin/admin) → email, firstName, lastName, role, organizationId?, password?, sendInviteEmail?, metadata?.
- `PATCH /users/:id` → update profile/role/status.
- `DELETE /users/:id` → soft delete.

## Beneficiaries
- `GET /beneficiaries` (filters: organizationId, status, search, gender, ageMin/Max, category, page, limit).
- `GET /beneficiaries/:id`
- `POST /beneficiaries` (admin/org_manager) → nationalId, firstName, lastName, phone, dateOfBirth, gender, organizationId?, category?, metadata?, email?.
- `PATCH /beneficiaries/:id`
- `DELETE /beneficiaries/:id`
- `POST /beneficiaries/import` (multipart) → file + optional organizationId.
- `GET /beneficiaries/export` → format=csv|excel + same filters as list; returns file stream.

## Surveys (Builder, Publish, Responses, Analytics)
- `GET /surveys` (filters: search, status[], categories[], organizations[], responseMin/Max, completionMin/Max, dateFrom/To, sortBy=date|title|responses|completion, page, limit).
- `GET /surveys/summary` (same filters) → `{ totalSurveys, activeSurveys, totalResponses, averageResponses }` (optionally completion rate).
- `GET /surveys/:id`
- `POST /surveys` (admin/org_manager/super_admin as applicable) → creates draft survey (title, description, questions, categories, status default draft).
- `PATCH /surveys/:id`
- `DELETE /surveys/:id`
- `POST /surveys/:id/publish`
- `POST /surveys/:id/responses` → submit responses (auth flow).
- `GET /surveys/:id/responses` (paginated; filters align with analytics).
- `GET /surveys/:id/analytics` → counts per question/option, latest submission info.
- Public sharing (if enabled): `GET /surveys/:id/public` and `POST /surveys/:id/public/responses` for unauthenticated view/submit.
- Optional export: `GET /surveys/:id/responses/export` aligned with `/responses` filters.

## Dashboard & Analytics
- `GET /analytics/dashboard` → totals, recent surveys, trends (see `docs/ANALYTICS_BACKEND_REQUIREMENTS.md` for suggested shape).
- Reuse `/surveys/summary`, `/surveys/:id/analytics`, `/surveys/:id/responses`, `/transactions`, `/ai-assistant/usage-stats`, `/ai-assistant/insights`, `/beneficiaries` for cards/lists/charts.
- Filters must match list pages; super_admin may pass `organizationId`; admin/manager auto-scoped.

## Billing & Subscription
- `GET /subscriptions/plans` (public).
- `GET /billing/subscription` (optional `organizationId` for super_admin).
- `POST /billing/stripe/session` → `{ planId, paymentMethodId, organizationId? }` → sessionId, checkoutUrl, expiresAt, plan, paymentMethod.
- `POST /billing/confirm` → `{ sessionId }`.

## Transactions
- `GET /transactions` (filters: amount, currency, type, status, metadata, date range, pagination).
- If UI creates transactions: `POST /transactions` with amount, currency, type, status, metadata, processedAt.

## AI Assistant
- `POST /ai-assistant/ask` → `{ question, conversationHistory?, conversationId?, context? }`.
- `POST /ai-assistant/voice` (multipart) → audio + optional language, transcriptionRequested, conversationId.
- `GET /ai-assistant/conversations`, `GET /ai-assistant/conversations/:id`, `PATCH /ai-assistant/conversations/:id`, `DELETE /ai-assistant/conversations/:id`.
- `POST /ai-assistant/feedback`
- `GET /ai-assistant/insights`
- `GET /ai-assistant/usage-stats?period=day|week|month|year`

## Settings
- `GET/PUT /settings/general` (branding: logoText, primaryColor, etc.).
- `GET/PUT /settings/advanced` (feature flags: liveMode, betaAnalytics, aiAssistant).
- `GET/PUT /settings/system` (maintenance/system toggles).

## Audit Logs
- `GET /audit-logs` (pagination; filter by `action`, optionally actor/organization/date range).

## Health & Docs
- `GET /health` (used on startup).
- `GET /docs/openapi.json` (optional).

## Exports (summary)
- Beneficiaries export: `/beneficiaries/export` with full filters.
- Survey responses export (if supported): `/surveys/:id/responses/export` with the same filters as `/surveys/:id/responses`.

## Seed/Test Data (for E2E readiness)
- One org with: super_admin, org admin, org manager, beneficiary accounts.
- Surveys: published with responses, draft, (optional) closed.
- Beneficiaries: enough to paginate and exercise filters (status/gender/age/category).
- Transactions: sample entries across statuses/types/dates (if displayed).
- AI: usage data + insights to populate charts/cards.

