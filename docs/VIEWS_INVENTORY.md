## Views Inventory (with API wiring)

Source of truth: `src/utils/routeUtils.tsx` (renderCurrentPage) plus unauthenticated branches in `src/App.tsx`. The table lists the page key, component, file, and known API/service calls (where implemented).

| Page key | Component | File | Known APIs / services (calls) |
| --- | --- | --- | --- |
| landing | LandingPageNew | `src/components/LandingPageNew.tsx` | None (marketing) |
| org-registration | OrganizationRegistrationPro | `src/components/OrganizationRegistrationPro.tsx` | Not inspected (likely submits org registration) |
| login | LoginPagePro | `src/components/LoginPagePro.tsx` | Auth handled via `AuthContext` login (see `context/AuthContext`) |
| dashboard | Dashboard | `src/components/Dashboard.tsx` | `analyticsService.getDashboard()` |
| surveys | SurveysPage | `src/components/SurveysPage.tsx` | Data fed via props; parent loads with `surveysService.list()` |
| survey-creation | SurveyCreationWizard | `src/components/SurveyCreationWizard.tsx` | Not inspected; typically creates/updates via `surveysService` |
| survey-view | SurveyViewPage | `src/components/SurveyViewPage.tsx` | `surveysService.getById()` |
| survey-results | SurveyResultsPage | `src/components/SurveyResultsPage.tsx` | `surveysService.getResponses()`, `surveysService.getAnalytics()` |
| survey-share | SurveySharePage | `src/components/SurveySharePage.tsx` | `surveysService.getResponses()` (to list beneficiaries) |
| survey-interface | SurveyInterface | `src/components/SurveyInterface.tsx` | Not inspected (likely submits responses) |
| enhanced-survey | EnhancedSurveyInterface | `src/components/EnhancedSurveyInterface.tsx` | Not inspected (likely submits responses) |
| thank-you | ThankYouPage | `src/components/ThankYouPage.tsx` | None (display) |
| subscription | SubscriptionPage | `src/components/SubscriptionPage.tsx` | Not inspected (subscription flow) |
| admin-billing | AdminBillingPage / SuperAdminBillingPage | `src/components/AdminBillingPage.tsx` / `src/components/SuperAdminBillingPage.tsx` | Not inspected; likely `billingService` |
| user-management | UserManagement | `src/components/UserManagement.tsx` | Not inspected (user CRUD) |
| beneficiaries | SuperAdminBeneficiariesPage / OrganizationsManagementPage / OrganizationBeneficiariesPage | `src/components/SuperAdminBeneficiariesPage.tsx` / `src/components/OrganizationsManagementPage.tsx` / `src/components/OrganizationBeneficiariesPage.tsx` | Not inspected (org/beneficiary services) |
| organization-surveys | OrganizationSurveysPage (PostSurveyInterface export) | `src/components/PostSurveyInterface.tsx` | Not inspected |
| organizations | OrganizationsPage | `src/components/OrganizationsPage.tsx` | Not inspected (org services) |
| system-settings | SystemSettingsPage | `src/components/SystemSettingsPage.tsx` | Not inspected (settings service) |
| admin-settings | AdminSettingsPage | `src/components/AdminSettingsPage.tsx` | Not inspected |
| activity-logs | ActivityLogsPage | `src/components/ActivityLogsPage.tsx` | Not inspected (audit logs service) |
| analysis | AnalysisPage | `src/components/AnalysisPage.tsx` | `analyticsService.getDashboard()`, `aiAssistantService.getInsights()` |
| organization-requests | OrganizationRequestsManagement | `src/components/OrganizationRequestsManagement.tsx` | Not inspected |
| global-survey-settings | GlobalSurveySettingsPage | `src/components/GlobalSurveySettingsPage.tsx` | Not inspected |
| profile | ProfilePage | `src/components/ProfilePage.tsx` | Not inspected |
| payment-method | PaymentMethodPage | `src/components/PaymentMethodPage.tsx` | Not inspected; driven by `billingService` data from parent |
| payment-details | PaymentDetailsPage | `src/components/PaymentDetailsPage.tsx` | Not inspected; driven by `billingService` data from parent |
| subscription-confirmation | SubscriptionConfirmationPage | `src/components/SubscriptionConfirmationPage.tsx` | Not inspected |
| default (fallback) | EnhancedSurveyInterface / Dashboard | `src/components/EnhancedSurveyInterface.tsx` / `src/components/Dashboard.tsx` | Same as above for each |

Legend:
- “Not inspected” = API wiring not verified yet; check component for exact calls.
- Parent-level loads: `App.tsx` uses `billingService.getPlans()` and `surveysService.list()`; auth flows use `AuthContext`.
