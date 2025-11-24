import React, { lazy, Suspense } from 'react';
import type { User, SubscriptionFlow } from '../constants/types';
import type { PaymentMethod } from '../components/PaymentMethodPage';
import type { PaymentFormData } from '../components/PaymentDetailsPage';

// Lazy load all page components for better performance
const Dashboard = lazy(() => import('../components/Dashboard').then(m => ({ default: m.Dashboard })));
const SurveysPage = lazy(() => import('../components/SurveysPage').then(m => ({ default: m.SurveysPage })));
const SurveyCreationWizard = lazy(() => import('../components/SurveyCreationWizard'));
const SurveyViewPage = lazy(() => import('../components/SurveyViewPage').then(m => ({ default: m.SurveyViewPage })));
const SurveyResultsPage = lazy(() => import('../components/SurveyResultsPage').then(m => ({ default: m.SurveyResultsPage })));
const SurveyInterface = lazy(() => import('../components/SurveyInterface').then(m => ({ default: m.SurveyInterface })));
const EnhancedSurveyInterface = lazy(() => import('../components/EnhancedSurveyInterface').then(m => ({ default: m.EnhancedSurveyInterface })));
const SurveySharePage = lazy(() => import('../components/SurveySharePage').then(m => ({ default: m.SurveySharePage })));
const ThankYouPage = lazy(() => import('../components/ThankYouPage').then(m => ({ default: m.ThankYouPage })));
const SubscriptionPage = lazy(() => import('../components/SubscriptionPage').then(m => ({ default: m.SubscriptionPage })));
const AdminBillingPage = lazy(() => import('../components/AdminBillingPage').then(m => ({ default: m.AdminBillingPage })));
const SuperAdminBillingPage = lazy(() => import('../components/SuperAdminBillingPage').then(m => ({ default: m.SuperAdminBillingPage })));
const SuperAdminBeneficiariesPage = lazy(() => import('../components/SuperAdminBeneficiariesPage').then(m => ({ default: m.SuperAdminBeneficiariesPage })));
const UserManagement = lazy(() => import('../components/UserManagement').then(m => ({ default: m.UserManagement })));
const OrganizationBeneficiariesPage = lazy(() => import('../components/OrganizationBeneficiariesPage').then(m => ({ default: m.OrganizationBeneficiariesPage })));
const OrganizationsManagementPage = lazy(() => import('../components/OrganizationsManagementPage').then(m => ({ default: m.OrganizationsManagementPage })));
const OrganizationsPage = lazy(() => import('../components/OrganizationsPage').then(m => ({ default: m.OrganizationsPage })));
const SystemSettingsPage = lazy(() => import('../components/SystemSettingsPage').then(m => ({ default: m.SystemSettingsPage })));
const AdminSettingsPage = lazy(() => import('../components/AdminSettingsPage').then(m => ({ default: m.AdminSettingsPage })));
const ActivityLogsPage = lazy(() => import('../components/ActivityLogsPage').then(m => ({ default: m.ActivityLogsPage })));
const GlobalSurveySettingsPage = lazy(() => import('../components/GlobalSurveySettingsPage').then(m => ({ default: m.GlobalSurveySettingsPage })));
const ProfilePage = lazy(() => import('../components/ProfilePage').then(m => ({ default: m.ProfilePage })));
const PaymentMethodPage = lazy(() => import('../components/PaymentMethodPage').then(m => ({ default: m.PaymentMethodPage })));
const PaymentDetailsPage = lazy(() => import('../components/PaymentDetailsPage').then(m => ({ default: m.PaymentDetailsPage })));
const SubscriptionConfirmationPage = lazy(() => import('../components/SubscriptionConfirmationPage').then(m => ({ default: m.SubscriptionConfirmationPage })));
const OrganizationSurveysPage = lazy(() => import('../components/PostSurveyInterface').then(m => ({ default: m.OrganizationSurveysPage })));
const AnalysisPage = lazy(() => import('../components/AnalysisPage').then(m => ({ default: m.AnalysisPage })));
const OrganizationRequestsManagement = lazy(() => import('../components/OrganizationRequestsManagement').then(m => ({ default: m.OrganizationRequestsManagement })));

// Loading component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-12 border-4 border-[#18325A] border-t-transparent rounded-full animate-spin" />
      <p className="text-[#18325A]">جاري التحميل...</p>
    </div>
  </div>
);

interface RouteHandlers {
  handleCreateSurvey: () => void;
  handleEditSurvey: (surveyId: string) => void;
  handleViewResults: (surveyId: string) => void;
  handleViewSurvey: (surveyId: string) => void;
  handleDuplicateSurvey: (surveyId: string) => void;
  handleDeleteSurvey: (surveyId: string) => void;
  handleShareSurvey: (surveyId: string) => void;
  handleBackToSurveys: () => void;
  handleBackToSurvey: (surveyId: string) => void;
  handleSurveyComplete: (responses: Record<string, any>) => void;
  handleSurveyCreated: (survey: any) => void;
  handleViewOrganizationSurveys: (organizationId: string) => void;
  handleBackToOrganizations: () => void;
  handleBackToDashboard: () => void;
  handleStartSubscription: (packageId: string) => void;
  handlePaymentMethodSelected: (method: PaymentMethod) => void;
  handleBackToPaymentMethod: () => void;
  handlePaymentSubmit: (paymentData: PaymentFormData) => void;
  handleBackToProfile: () => void;
  handleStartUsingPlatform: () => void;
  handleReturnToLanding: () => void;
  getAllSurveysFromDatabase: () => any[];
}

interface RouteRenderProps {
  currentPage: string;
  currentUser: User;
  selectedSurveyId: string;
  selectedOrganizationId: string;
  subscriptionFlow: SubscriptionFlow;
  handlers: RouteHandlers;
}

export const renderCurrentPage = ({
  currentPage,
  currentUser,
  selectedSurveyId,
  selectedOrganizationId,
  subscriptionFlow,
  handlers
}: RouteRenderProps): React.ReactNode => {
  const renderWithSuspense = (component: React.ReactNode) => (
    <Suspense fallback={<PageLoader />}>
      {component}
    </Suspense>
  );

  switch (currentPage) {
    case 'dashboard':
      return renderWithSuspense(<Dashboard userRole={currentUser.role} />);
    
    case 'surveys':
      return renderWithSuspense(
        <SurveysPage 
          userRole={currentUser.role}
          onCreateSurvey={handlers.handleCreateSurvey}
          onEditSurvey={handlers.handleEditSurvey}
          onViewResults={handlers.handleViewResults}
          onViewSurvey={handlers.handleViewSurvey}
          onDuplicateSurvey={handlers.handleDuplicateSurvey}
          onDeleteSurvey={handlers.handleDeleteSurvey}
          onShareSurvey={handlers.handleShareSurvey}
          createdSurveys={handlers.getAllSurveysFromDatabase()}
        />
      );
    
    case 'survey-creation':
      return renderWithSuspense(
        <SurveyCreationWizard 
          onBack={handlers.handleBackToSurveys} 
          onSurveyCreated={handlers.handleSurveyCreated}
          userRole={currentUser.role as 'admin' | 'org_manager'}
        />
      );
    
    case 'survey-view':
      return renderWithSuspense(
        <SurveyViewPage 
          surveyId={selectedSurveyId}
          onBack={handlers.handleBackToSurveys}
          onEdit={handlers.handleEditSurvey}
          onViewResults={handlers.handleViewResults}
        />
      );
    
    case 'survey-results':
      return renderWithSuspense(
        <SurveyResultsPage 
          surveyId={selectedSurveyId}
          onBack={handlers.handleBackToSurveys}
          onBackToSurvey={handlers.handleBackToSurvey}
        />
      );
    
    case 'survey-share':
      const selectedSurvey = handlers.getAllSurveysFromDatabase().find(s => s.id === selectedSurveyId);
      if (selectedSurvey) {
        return renderWithSuspense(
          <SurveySharePage 
            survey={selectedSurvey}
            onBackToSurveys={handlers.handleBackToSurveys}
          />
        );
      }
      return renderWithSuspense(<Dashboard userRole={currentUser.role} />);
    
    case 'survey-interface':
      return renderWithSuspense(<SurveyInterface />);
    
    case 'enhanced-survey':
      return renderWithSuspense(
        <EnhancedSurveyInterface 
          onComplete={handlers.handleSurveyComplete}
          onBack={() => {}}
          onReturnToLanding={handlers.handleReturnToLanding}
        />
      );
    
    case 'thank-you':
      return renderWithSuspense(
        <ThankYouPage 
          onBackToSurveys={() => {}}
          onNewSurvey={() => {}}
        />
      );
    
    case 'subscription':
      return renderWithSuspense(<SubscriptionPage userRole={currentUser.role} />);
    
    case 'admin-billing':
      if (currentUser.role === 'super_admin') {
        return renderWithSuspense(<SuperAdminBillingPage userRole={currentUser.role} />);
      } else {
        return renderWithSuspense(<AdminBillingPage userRole={currentUser.role} />);
      }
    
    case 'user-management':
      return renderWithSuspense(<UserManagement userRole={currentUser.role as 'super_admin' | 'admin' | 'org_manager'} />);
    
    case 'beneficiaries':
      if (currentUser.role === 'super_admin') {
        return renderWithSuspense(<SuperAdminBeneficiariesPage userRole={currentUser.role} />);
      } else if (currentUser.role === 'admin') {
        return renderWithSuspense(<OrganizationsManagementPage onViewSurveys={handlers.handleViewOrganizationSurveys} />);
      } else {
        return renderWithSuspense(<OrganizationBeneficiariesPage onViewSurveys={handlers.handleViewOrganizationSurveys} />);
      }
    
    case 'organization-surveys':
      return renderWithSuspense(
        <OrganizationSurveysPage 
          organizationId={selectedOrganizationId}
          onBack={handlers.handleBackToOrganizations}
        />
      );
    

    
    case 'organizations':
      return renderWithSuspense(<OrganizationsPage />);
    
    case 'system-settings':
      return renderWithSuspense(<SystemSettingsPage />);
    
    case 'admin-settings':
      return renderWithSuspense(<AdminSettingsPage userRole={currentUser.role as 'admin'} />);
    
    case 'activity-logs':
      return renderWithSuspense(<ActivityLogsPage />);
    
    case 'analysis':
      return renderWithSuspense(<AnalysisPage userRole={currentUser.role as 'admin' | 'org_manager'} />);
    
    case 'organization-requests':
      return renderWithSuspense(<OrganizationRequestsManagement />);
    
    case 'global-survey-settings':
      return renderWithSuspense(<GlobalSurveySettingsPage userRole={currentUser.role as 'admin'} />);
    
    case 'profile':
      return renderWithSuspense(
        <ProfilePage 
          userRole={currentUser.role as 'org_manager'}
          userName={currentUser.name}
          userEmail={currentUser.email}
          organization={currentUser.organization || ''}
          onBack={handlers.handleBackToDashboard}
          onStartSubscription={handlers.handleStartSubscription}
        />
      );
    
    case 'payment-method':
      if (subscriptionFlow.selectedPackage) {
        return renderWithSuspense(
          <PaymentMethodPage 
            userRole={currentUser.role as 'org_manager'}
            selectedPackage={subscriptionFlow.selectedPackage}
            onBack={handlers.handleBackToProfile}
            onMethodSelected={handlers.handlePaymentMethodSelected}
          />
        );
      }
      break;
    
    case 'payment-details':
      if (subscriptionFlow.selectedPackage && subscriptionFlow.selectedMethod) {
        return renderWithSuspense(
          <PaymentDetailsPage 
            userRole={currentUser.role as 'org_manager'}
            selectedPackage={subscriptionFlow.selectedPackage}
            selectedMethod={subscriptionFlow.selectedMethod}
            onBack={handlers.handleBackToPaymentMethod}
            onPaymentSubmit={handlers.handlePaymentSubmit}
          />
        );
      }
      break;
    
    case 'subscription-confirmation':
      if (subscriptionFlow.selectedPackage && subscriptionFlow.selectedMethod && subscriptionFlow.paymentData) {
        return renderWithSuspense(
          <SubscriptionConfirmationPage 
            userRole={currentUser.role as 'org_manager'}
            selectedPackage={subscriptionFlow.selectedPackage}
            selectedMethod={subscriptionFlow.selectedMethod}
            paymentData={subscriptionFlow.paymentData}
            onBackToProfile={handlers.handleBackToProfile}
            onStartUsingPlatform={handlers.handleStartUsingPlatform}
          />
        );
      }
      break;
    
    default:
      if (currentUser.role === 'beneficiary') {
        return renderWithSuspense(
          <EnhancedSurveyInterface 
            onComplete={handlers.handleSurveyComplete}
            onBack={() => {}}
            onReturnToLanding={handlers.handleReturnToLanding}
          />
        );
      } else {
        return renderWithSuspense(<Dashboard userRole={currentUser.role} />);
      }
  }
  
  return null;
};
