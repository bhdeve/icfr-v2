# Backend Requirements (to satisfy current frontend wiring)

This document lists the concrete backend APIs the frontend expects so every view is fully data‑driven (no mocks). Align responses with the contract in `src/api_frontend_contract.md` (success/error envelopes, localization headers).

## Cross‑cutting
- Base URL: `VITE_API_BASE_URL` (e.g., `http://localhost:3001/api/v1`).
- Headers: `Authorization: Bearer <accessToken>` for private calls, `Accept-Language` + `x-locale` (default `ar`), and set `Content-Language` on responses.
- Pagination shape: `{ items, pagination: { page, limit, total, totalPages, hasMore } }`.
- Roles: `super_admin` (global), `admin` / `org_manager` (org-scoped), `beneficiary` (read-only). `organizationId` query is required for super-admin context switching where applicable.

## Auth & Identity
- `POST /auth/register` — register org + admin user (used by `OrganizationRegistrationPro`).
- `POST /auth/login` — returns `user` + `tokens { accessToken, refreshToken, expiresIn }` (used in `AuthContext`).
- `POST /auth/refresh` — returns both tokens.
- `POST /auth/forgot-password` and `POST /auth/reset-password` — used by `ForgotPasswordModal`.
- `POST /auth/logout` — revoke refresh token.
- `GET /users/me` — current profile for startup load.
- `GET /users` — filters: `role`, `organizationId`, `status`, pagination; powers User Management.
- `POST /users`, `PATCH /users/:id`, `DELETE /users/:id` — manage users.

## Surveys (replace all mocks in survey list/view/results/share/creation)
- `GET /surveys` — filters: `search`, `status[]`, `categories[]`, `organizations[]`, `responseMin/Max`, `completionMin/Max`, `dateFrom/To`, `sortBy (date|title|responses|completion)`, `sortOrder`, `page`, `limit`.
- `GET /surveys/summary` — same filters; returns `{ totalSurveys, activeSurveys, totalResponses, averageResponses }`.
- `GET /surveys/:id` — survey detail (sections/questions/settings).
- `POST /surveys` — create; `PATCH /surveys/:id` — update; `DELETE /surveys/:id` — soft delete; `POST /surveys/:id/publish`.
- Responses & analytics: `POST /surveys/:id/responses` (submit), `GET /surveys/:id/responses` (paginated, filters align with analytics), optional `GET /surveys/:id/responses/export`.
- `GET /surveys/:id/analytics` — per-survey stats for charts.

## Dashboard & Analytics
- `GET /analytics/dashboard` — per `docs/DASHBOARD_ANALYTICS_REQUIREMENTS.md` (totals, recent surveys, trends, charts). Accepts `organizationId`, `period (day|week|month|quarter|year)`, `dateFrom`, `dateTo`.
- `GET /surveys/summary` + `GET /surveys` (above) are reused by dashboard cards/lists.

## AI Assistant (Analysis page & chat widget)
- `POST /ai-assistant/ask` — `{ question, conversationHistory?, conversationId? }` → `{ messages, conversationId }`.
- `GET /ai-assistant/insights` — insight cards (org-scoped).
- `GET /ai-assistant/usage-stats?period=day|week|month|year` — usage charts.
- Optional: `POST /ai-assistant/voice` for audio inputs; `POST /ai-assistant/feedback`.

## Organizations & Beneficiaries
- Organizations: `GET /organizations` (filters: `status`, `search`, `type`, `organizationId` for super-admin override), `POST /organizations` (create), `PATCH /organizations/:id` (update), `POST /organizations/:id/approve` (approve pending).
- Beneficiaries: `GET /beneficiaries` (filters: `organizationId`, `status`, `gender`, `ageMin/Max`, `category`, `search`, pagination), `POST /beneficiaries`, `PATCH /beneficiaries/:id`, `DELETE /beneficiaries/:id`.
- Import/export: `POST /beneficiaries/import` (multipart file, optional `organizationId`), `GET /beneficiaries/export?format=csv|excel` with same filters as list.
- These power Organization Beneficiaries, Super Admin Beneficiaries, Organization Requests, and Organization Surveys pages.

## Billing & Subscription
- Catalog: `GET /subscriptions/plans` — plan list with `price.monthly/yearly`, `currency`, `features`, `limits`, `recommended`, `paymentMethods` (public).
- Current subscription: `GET /billing/subscription` (optional `organizationId` for super_admin).
- Checkout: `POST /billing/stripe/session` (or equivalent) — `{ planId, paymentMethodId, organizationId? }` → `{ sessionId, checkoutUrl, expiresAt, plan, paymentMethod }`.
- Confirmation: `POST /billing/confirm` — `{ sessionId }` → final status.
- Transactions: `GET /transactions` — filters: `status`, `type`, `dateFrom/To`, `amountMin/Max`, pagination. Used in Admin/Super Admin Billing and Subscription history.

## Settings & Audit Logs
- Settings: `GET /settings/general`, `PUT /settings/general`; `GET /settings/advanced`, `PUT /settings/advanced`; `GET /settings/system`, `PUT /settings/system` (super_admin). Fields should cover branding, locale defaults, feature flags, security toggles, maintenance mode.
- Audit logs: `GET /audit-logs` — filters: `action`, `userId`, `organizationId`, `resource`, `dateFrom/To`, pagination. Used by Activity Logs page.

## Health & Utilities
- `GET /health` — app + DB connectivity (used on startup and the backend connection page).
- Optional: `GET /docs/openapi.json` for tooling parity with `api_frontend_contract.md`.

## Wiring map (frontend → API)
- Dashboard (`components/Dashboard.tsx`): `GET /analytics/dashboard`, `GET /surveys/summary`, `GET /surveys` (recent).
- Surveys list/view/results/share (`components/SurveysPage.tsx`, `SurveyViewPage.tsx`, `SurveyResultsPage.tsx`, `SurveySharePage.tsx`, `PostSurveyInterface.tsx`): all survey endpoints above + responses/analytics/export.
- Survey creation wizard (`components/SurveyCreationWizard.tsx`): `GET /organizations` (super admin context), `POST /surveys`, `PATCH /surveys/:id`, `POST /surveys/:id/publish`.
- Beneficiaries/org management (`components/OrganizationBeneficiariesPage.tsx`, `OrganizationsManagementPage.tsx`, `SuperAdminBeneficiariesPage.tsx`, `OrganizationRequestsManagement.tsx`): organizations + beneficiaries endpoints.
- Auth & entry (`components/LoginPagePro.tsx`, `OrganizationRegistrationPro.tsx`, `ForgotPasswordModal.tsx`): auth/register/forgot/reset/login/logout/me.
- Billing/subscription (`components/SubscriptionPage.tsx`, `AdminBillingPage.tsx`, `SuperAdminBillingPage.tsx`, `ProfilePage.tsx`, `PaymentMethodPage.tsx`, `PaymentDetailsPage.tsx`, `SubscriptionConfirmationPage.tsx`): plans, subscription status, checkout session, confirm, transactions.
- Settings & audit (`components/SystemSettingsPage.tsx`, `AdminSettingsPage.tsx`, `GlobalSurveySettingsPage.tsx`, `ActivityLogsPage.tsx`): settings endpoints and `GET /audit-logs`.
- Analytics/AI (`components/AnalysisPage.tsx`, `AIChatWidget.tsx`): analytics dashboard plus AI assistant endpoints.
