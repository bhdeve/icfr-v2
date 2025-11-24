# Analytics & Dashboard Backend Requirements

This document lists the backend endpoints and behaviors needed for the frontend dashboard and analytics views to be fully functional.

## Core Endpoints

- `GET /analytics/dashboard`
  - Should return totals and recent items used by dashboard cards/sections. Suggested shape:
    ```json
    {
      "totals": {
        "surveys": 0,
        "activeSurveys": 0,
        "responses": 0,
        "beneficiaries": 0,
        "organizations": 0
      },
      "recentSurveys": [
        { "id": "string", "title": "string", "status": "published|draft|closed", "updatedAt": "ISO", "responses": 0 }
      ],
      "trends": {
        "responsesOverTime": [ { "date": "YYYY-MM-DD", "count": 0 } ],
        "completionRate": [ { "date": "YYYY-MM-DD", "rate": 0 } ]
      }
    }
    ```

- `GET /surveys/summary`
  - Accept the same filters as `/surveys` (search, status[], categories[], organizations[], responseMin/Max, completionMin/Max, dateFrom/To, sortBy, page/limit).
  - Return `{ totalSurveys, activeSurveys, totalResponses, averageResponses }` (optionally completion rate).

- `GET /surveys/:id/analytics`
  - Return latest submission info and counts per question/option for survey analytics/results.

- `GET /surveys/:id/responses` (paginated)
  - Support filters/pagination for response lists used in analytics and result tables.

## Filters & Scoping

- All analytics endpoints should accept the same filter set used on list pages to keep cards/charts consistent with lists.
- Support `organizationId` for super-admin context switching wherever applicable (dashboard/analytics when viewing specific orgs).
- Admins (org-level) should be scoped automatically to their organization; super-admins can pass `organizationId` explicitly; org managers/beneficiaries should only see data within their org scope.

## AI Usage (if shown on dashboard)

- `GET /ai-assistant/usage-stats?period=day|week|month|year`
  - Return counts, success/failure rates, tokens used, and usage-over-time arrays for charts.

- `GET /ai-assistant/insights`
  - Return insights with fields: `id, type, priority, title, description, recommendation, action, createdAt`.

## Transactions (if displayed)

- `GET /transactions`
  - Pagination + filters: amount, currency, type, status, metadata, date range.

## Health

- `GET /health`
  - Should remain available for startup checks.

## Exports

- `GET /beneficiaries/export`
  - Query: `format=csv|excel` + same filters as `/beneficiaries` (organizationId, status, search, gender, ageMin/Max, category, pagination params).
  - Returns a file stream.

- `GET /surveys/:id/responses/export` (if supported)
  - Query: align with `/surveys/:id/responses` filters so exported data matches what’s shown in the responses/analytics tabs.

## Sub-tabs & Lists Alignment

- If dashboard sub-tabs display users, beneficiaries, orgs, or surveys, they should reuse the same filters/pagination as their respective list endpoints to keep counts/cards/charts consistent.
- For transaction/revenue widgets, ensure `/transactions` supports date/status/type filtering consistent with what’s shown in the UI widgets or charts.

## Response Shape & Localization

- Use `{ success: true, data, message? }` and `{ success: false, error: { code, message, details? } }`.
- Honor `Accept-Language`/`x-locale`; set `Content-Language` on responses.
- Authenticated endpoints require `Authorization: Bearer <accessToken>`.
