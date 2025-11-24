# Dashboard & Analytics Requirements (Backend + E2E)

Combined checklist for backend expectations and end-to-end testing of the dashboard/analytics experiences.

## Auth & Identity
- `/auth/login` returns `accessToken`, `refreshToken`, and `user` (id, email, firstName, lastName, role, organizationId, avatar, status).
- `/auth/refresh` returns both tokens.
- `/users/me` returns the same user shape.
- Roles: super_admin (global), admin (org-scoped), org_manager (org-scoped), beneficiary (read-only). Admins/managers are scoped to their org; super_admin can pass `organizationId`.

## Core Dashboard/Analytics Calls
- `GET /analytics/dashboard` → totals, recent surveys, trends (see suggested shape in `ANALYTICS_BACKEND_REQUIREMENTS.md`).
- `GET /surveys/summary` with list filters → `{ totalSurveys, activeSurveys, totalResponses, averageResponses }`.
- `GET /surveys` (list) with filters/pagination to power survey lists/cards.
- `GET /surveys/:id/analytics` → per-survey analytics for charts.
- `GET /surveys/:id/responses` (paginated, same filters as analytics) → tables/detail views.
- `GET /transactions` (if shown) → filters for amount/currency/type/status/date range.
- `GET /ai-assistant/usage-stats?period=` → usage charts; `GET /ai-assistant/insights` → insight cards.
- `GET /beneficiaries` (for counts/cards), and `GET /beneficiaries/export` if export is surfaced.
- Optional: `GET /surveys/:id/responses/export` aligned with responses filters if export is surfaced.

## Filters & Scoping
- All analytics endpoints accept the same filters as their list counterparts (status[], search, categories, organizations, date ranges, response/complete ranges, sort, page/limit).
- `organizationId` query for super_admin context switching; admins/managers auto-scoped to their org.

## Localization & Headers
- Every call should honor `Accept-Language`/`x-locale` (default `ar`); responses set `Content-Language`.
- Authenticated calls require `Authorization: Bearer <accessToken>`.

## Error Shape
- `{ success: true, data, message? }` and `{ success: false, error: { code, message, details? } }` so frontend can surface backend messages directly.

## Exports
- `GET /beneficiaries/export`
  - Query: `format=csv|excel` + same filters as `/beneficiaries` (organizationId, status, search, gender, ageMin/Max, category, pagination params).
  - Returns a file stream.
- `GET /surveys/:id/responses/export` (if supported)
  - Query: align with `/surveys/:id/responses` filters so exported data matches what’s shown in the responses/analytics tabs.

## Seed/Test Data (recommended for E2E)
- At least one org with:
  - Super admin account (global).
  - Org admin account (scoped).
  - Org manager account (scoped).
  - Beneficiary account (read-only).
- Surveys:
  - Published survey with responses (for analytics/responses lists/charts).
  - Draft survey (for status filtering).
  - Closed survey (optional, for status coverage).
- Beneficiaries: Enough records to paginate; varied status/gender/age/category for filter testing.
- Transactions (if displayed): Sample entries across statuses/types/dates.
- AI: Some usage data and insights to populate charts/cards.

## E2E Test Flow (high-level)
1) Login as super_admin → verify dashboard totals, recent surveys, trends load; switch `organizationId` where applicable.
2) Login as admin → verify data is scoped to their org; dashboard numbers and lists match org data.
3) Surveys: list with filters, summary cards, per-survey analytics, responses pagination/export (if present).
4) Beneficiaries: list/filter/export (if present on dashboard widgets).
5) Transactions: filter by date/status/type and match expected counts (if widgets are shown).
6) AI widgets: usage-stats and insights render with returned data.
7) Localization: set locale header and ensure `Content-Language` is respected.
8) Error handling: simulate missing/expired token (401) and ensure refresh → retry; simulate failure to confirm backend error messages surface.
