# Creation Flows Backend Requirements

Backend expectations for all creation flows the frontend supports. Use this to ensure the platform can create and submit data end-to-end.

## Auth & Identity
- `POST /auth/register` → create org + admin user (fields: firstName, lastName, email, password, organizationName?, industry?, country?, city?, phone?, acceptTerms, captchaToken). Returns user + `accessToken`, `refreshToken`.
- `POST /auth/login` → returns tokens + user (needed for subsequent creates).

## Organizations
- `POST /organizations` (super_admin) → create org with metadata, contact, admin user (if supported), captchaToken.
- `POST /organizations/:id/approve` (super_admin) → approve pending org.

## Users
- `POST /users` (super_admin, admin) → create user with fields: email, firstName, lastName, role, organizationId?, password?, sendInviteEmail?, metadata?.

## Beneficiaries
- `POST /beneficiaries` (admin/org_manager) → create beneficiary: nationalId, firstName, lastName, phone, dateOfBirth, gender, organizationId?, category?, metadata?, email?.
- `POST /beneficiaries/import` (multipart) → `file` + optional `organizationId`; same validations as manual create.

## Surveys
- `POST /surveys` (admin/org_manager/super_admin as applicable) → create survey (title, description, questions, categories, status draft by default).
- `POST /surveys/:id/publish` → publish survey.
- `POST /surveys/:id/responses` → submit responses (auth required for internal flow; shape matches questions).
- (If public sharing is supported) `POST /surveys/:id/public/responses` → submit without auth; must validate against survey schema.

## Billing & Subscription
- `POST /billing/stripe/session` → `{ planId, paymentMethodId, organizationId? }` → returns session info and checkout URL.
- `POST /billing/confirm` → `{ sessionId }` to complete subscription.

## AI Assistant (creation/submission)
- `POST /ai-assistant/ask` → `{ question, conversationHistory?, conversationId?, context? }` creates/stores a message (and conversation if new).
- `POST /ai-assistant/voice` (multipart) → `audio` + optional `language`, `transcriptionRequested`, `conversationId`.
- `POST /ai-assistant/feedback` → `{ messageId, rating, comment?, categories? }`.

## Settings (write operations)
- `PUT /settings/general` → create/update branding (logoText, primaryColor, etc.).
- `PUT /settings/advanced` → update feature flags (liveMode, betaAnalytics, aiAssistant).
- `PUT /settings/system` → update system toggles (maintenanceMode, etc.).

## Transactions (if manually created)
- If the UI supports creating transactions/charges: `POST /transactions` with amount, currency, type, status, metadata, processedAt. (If not in UI, this can be omitted.)

## Permissions & Scoping
- Super_admin can create orgs and users across orgs; can pass `organizationId`.
- Admins create within their org; org managers limited to their org scope (beneficiaries/surveys as allowed).
- Beneficiaries cannot create entities (read-only).

## Common Requirements
- Authenticated calls require `Authorization: Bearer <accessToken>`.
- Honor `Accept-Language`/`x-locale`; set `Content-Language` on responses.
- Error shape: `{ success: false, error: { code, message, details? } }`.
- Success shape: `{ success: true, data, message? }`.
- Validate required fields server-side; return meaningful codes/messages.
