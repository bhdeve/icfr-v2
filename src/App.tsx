import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Layout } from "./components/Layout";
import { LandingPageNew as LandingPage } from "./components/LandingPageNew";
import { LoginPagePro } from "./components/LoginPagePro";
import { OrganizationRegistrationPro } from "./components/OrganizationRegistrationPro";
import { ForgotPasswordModal } from "./components/ForgotPasswordModal";
import { FaviconUpdater } from "./components/FaviconUpdater";
import { Toaster } from "./components/ui/sonner";
import { toast } from "sonner@2.0.3";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import { LanguageProvider } from "./context/LanguageContext";
import { billingService } from "./api/services";
import { performStartupHealthCheck } from "./utils/backendHealthCheck";

// Import database functions
import {
  getAllSurveys,
  addSurveyToDatabase,
  deleteSurveyFromDatabase,
} from "./components/surveys/constants";

// Import types and constants
import type {
  User,
  Survey,
  SubscriptionFlow,
} from "./constants/types";
import { pagePermissions } from "./constants/permissions";
import { renderCurrentPage } from "./utils/routeUtils";
import {
  initializeUrlRouting,
  updateUrl,
  getCurrentPageFromUrl,
} from "./utils/urlUtils";
import type { PaymentMethod } from "./components/PaymentMethodPage";
import type { PaymentFormData } from "./components/PaymentDetailsPage";

export type { UserRole, User, Survey } from "./constants/types";

// Helper function to get default page for role
const getDefaultPageForRole = (role: string): string => {
  return role === 'beneficiary' ? 'enhanced-survey' : 'dashboard';
};

function AppContent(): JSX.Element {
  const { currentUser: authUser, login, logout, isLoading } = useAuth();
  const [currentUser, setCurrentUser] = useState<User | null>(authUser);
  const [currentPage, setCurrentPage] = useState<string>("landing");
  const [selectedSurveyId, setSelectedSurveyId] = useState<string>("");
  const [selectedOrganizationId, setSelectedOrganizationId] = useState<string>("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [subscriptionFlow, setSubscriptionFlow] = useState<SubscriptionFlow>({
    selectedPackage: null,
    selectedMethod: null,
    paymentData: null,
  });
  const [createdSurveys, setCreatedSurveys] = useState<Survey[]>([]);
  const [databaseVersion, setDatabaseVersion] = useState(0);
  const [availablePackages, setAvailablePackages] = useState<any[]>([]);

  // Load available packages from API
  useEffect(() => {
    const loadPackages = async () => {
      try {
        const response = await billingService.getPlans();
        if (response.success && response.data) {
          // Convert backend plans to frontend format
          const packages = response.data.plans.map(plan => ({
            id: plan.id,
            name: plan.name,
            nameEn: plan.nameEn,
            description: plan.description,
            price: plan.price.monthly || 0,
            yearlyPrice: plan.price.yearly,
            currency: plan.price.currency || 'SAR',
            features: plan.features,
            limits: plan.limits,
            recommended: plan.recommended
          }));
          setAvailablePackages(packages);
        }
      } catch (error) {
        console.error('Failed to load subscription plans:', error);
        // Set default empty array on error
        setAvailablePackages([]);
      }
    };

    loadPackages();
  }, []);

  // Sync auth user with local state and redirect on first login
  useEffect(() => {
    setCurrentUser(authUser);

    if (authUser) {
      const isAuthEntryPage = ["landing", "login", "org-registration"].includes(currentPage);
      if (isAuthEntryPage) {
        const defaultPage = getDefaultPageForRole(authUser.role);
        setCurrentPage(defaultPage);
        updateUrl(defaultPage);
      }
    }
  }, [authUser, currentPage]);

  // Initialize URL routing
  useEffect(() => {
    const cleanup = initializeUrlRouting((page: string) => {
      setCurrentPage(page);
    });

    return cleanup;
  }, []);

  // Scroll to top whenever page changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  // Update URL when page changes (but not on initial load from URL)
  useEffect(() => {
    if (currentPage !== getCurrentPageFromUrl()) {
      updateUrl(currentPage);
    }
  }, [currentPage]);

  const handleGoToLanding = useCallback((): void => {
    setCurrentPage("landing");
    updateUrl("landing");
  }, []);

  const handleGoToLogin = useCallback((): void => {
    setCurrentPage("login");
    updateUrl("login");
  }, []);

  const handleGoToOrgRegistration = useCallback((): void => {
    setCurrentPage("org-registration");
    updateUrl("org-registration");
  }, []);

  const handleLogin = useCallback(async (
    email: string,
    password: string,
  ): Promise<void> => {
    try {
      const success = await login(email, password);

      if (success) {
        // User will be set via useEffect when authUser updates
        // Wait a bit for state to update
        setTimeout(() => {
          if (authUser) {
            const defaultPage = getDefaultPageForRole(authUser.role);
            setCurrentPage(defaultPage);
            updateUrl(defaultPage);
            toast.success(`مرحباً ${authUser.name}! تم تسجيل الدخول بنجاح`);
          }
        }, 100);
      } else {
        toast.error("بيانات تسجيل الدخول غير صحيحة");
      }
    } catch (error: any) {
      console.error('Login error:', error);
      // Show the error message from AuthContext
      toast.error(error.message || "حدث خطأ أثناء تسجيل الدخول");
    }
  }, [login, authUser]);

  const handleLogout = useCallback(async (): Promise<void> => {
    try {
      await logout();
      setCurrentPage("landing");
      setSubscriptionFlow({
        selectedPackage: null,
        selectedMethod: null,
        paymentData: null,
      });
      updateUrl("landing");
      toast.info("تم تسجيل الخروج بنجاح");
    } catch (error) {
      console.error('Logout error:', error);
      toast.error("حدث خطأ أثناء تسجيل الخروج");
    }
  }, [logout]);

  const handleNavigate = useCallback((page: string): void => {
    if (!currentUser) return;

    const allowedRoles = pagePermissions[page as keyof typeof pagePermissions];
    if (allowedRoles && allowedRoles.includes(currentUser.role)) {
      setCurrentPage(page);
      updateUrl(page);
    } else {
      toast.error("ليس لديك صلاحية للوصول لهذه الصفحة");
    }
  }, [currentUser]);

  // Subscription flow handlers
  const handleStartSubscription = (packageId: string): void => {
    const selectedPackage = availablePackages.find(
      (pkg) => pkg.id === packageId,
    );
    if (selectedPackage) {
      setSubscriptionFlow((prev) => ({
        ...prev,
        selectedPackage,
      }));
      setCurrentPage("payment-method");
      updateUrl("payment-method");
    }
  };

  const handlePaymentMethodSelected = (method: PaymentMethod): void => {
    setSubscriptionFlow((prev) => ({
      ...prev,
      selectedMethod: method,
    }));
    setCurrentPage("payment-details");
    updateUrl("payment-details");
  };

  const handleBackToPaymentMethod = (): void => {
    setSubscriptionFlow((prev) => ({
      ...prev,
      paymentData: null,
    }));
    setCurrentPage("payment-method");
    updateUrl("payment-method");
  };

  const handlePaymentSubmit = (paymentData: PaymentFormData): void => {
    setSubscriptionFlow((prev) => ({ ...prev, paymentData }));
    setCurrentPage("subscription-confirmation");
    updateUrl("subscription-confirmation");
  };

  const handleBackToProfile = (): void => {
    setCurrentPage("profile");
    setSubscriptionFlow({
      selectedPackage: null,
      selectedMethod: null,
      paymentData: null,
    });
    updateUrl("profile");
  };

  // Survey handlers
  const handleCreateSurvey = (): void => {
    setCurrentPage("survey-creation");
    updateUrl("survey-creation");
  };

  const handleEditSurvey = (surveyId: string): void => {
    setSelectedSurveyId(surveyId);
    setCurrentPage("survey-creation");
    updateUrl("survey-creation");
  };

  const handleViewSurvey = (surveyId: string): void => {
    setSelectedSurveyId(surveyId);
    setCurrentPage("survey-view");
    updateUrl("survey-view");
  };

  const handleViewResults = (surveyId: string): void => {
    setSelectedSurveyId(surveyId);
    setCurrentPage("survey-results");
    updateUrl("survey-results");
  };

  const handleDuplicateSurvey = (surveyId: string): void => {
    toast.success("تم نسخ الاستبيان بنجاح");
  };

  const handleDeleteSurvey = (surveyId: string): void => {
    try {
      setCreatedSurveys((prev) =>
        prev.filter((survey) => survey.id !== surveyId),
      );
      const deleted = deleteSurveyFromDatabase(surveyId);

      if (deleted) {
        setDatabaseVersion((prev) => prev + 1);
        toast.success("تم حذف الاستبيان بنجاح من قاعدة البيانات");
      } else {
        toast.success("تم حذف الاستبيان بنجاح");
      }
    } catch (error) {
      console.error("Error deleting survey:", error);
      toast.error("حدث خطأ أثناء حذف الاستبيان");
    }
  };

  const handleShareSurvey = (surveyId: string): void => {
    setSelectedSurveyId(surveyId);
    setCurrentPage("survey-share");
    updateUrl("survey-share");
  };

  const handleBackToSurveys = (): void => {
    setCurrentPage("surveys");
    setSelectedSurveyId("");
    updateUrl("surveys");
  };

  const handleBackToSurvey = (surveyId: string): void => {
    setSelectedSurveyId(surveyId);
    setCurrentPage("survey-view");
    updateUrl("survey-view");
  };

  const handleSurveyComplete = (responses: Record<string, any>): void => {
    if (currentUser?.role !== "beneficiary") {
      setCurrentPage("thank-you");
      updateUrl("thank-you");
    }
  };

  const handleSurveyCreated = (survey: Survey): void => {
    setCreatedSurveys((prev) => [survey, ...prev]);
    addSurveyToDatabase(survey);
    setDatabaseVersion((prev) => prev + 1);
    toast.success(`تم إنشاء الاستبيان "${survey.title}" بنجاح!`);
  };

  const getAllSurveysFromDatabase = (): Survey[] => getAllSurveys();

  const handleViewOrganizationSurveys = (organizationId: string): void => {
    setSelectedOrganizationId(organizationId);
    setCurrentPage("organization-surveys");
    updateUrl("organization-surveys");
  };

  const handleBackToOrganizations = (): void => {
    setCurrentPage("beneficiaries");
    setSelectedOrganizationId("");
    updateUrl("beneficiaries");
  };

  const handleBackToDashboard = (): void => {
    setCurrentPage("dashboard");
    updateUrl("dashboard");
  };

  const handleStartUsingPlatform = (): void => {
    setCurrentPage("dashboard");
    updateUrl("dashboard");
    toast.success("مرحباً بك! ابدأ في استكشاف منصة أثرنا");
  };

  const handleReturnToLanding = (): void => {
    handleLogout();
  };

  const handleLanguageChange = (language: string): void => {
    // Language change logic handled by LanguageContext
  };

  const renderPage = (): React.ReactNode => {
    // Show loading state
    if (isLoading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#18325a] mx-auto mb-4"></div>
            <p className="text-gray-600">جاري التحميل...</p>
          </div>
        </div>
      );
    }

    if (!currentUser && currentPage === "landing") {
      return (
        <LandingPage
          onLogin={handleGoToLogin}
          onRegisterOrganization={handleGoToOrgRegistration}
        />
      );
    }

    if (!currentUser && currentPage === "org-registration") {
      return (
        <OrganizationRegistrationPro
          onBackToLanding={handleGoToLanding}
          onLoginClick={handleGoToLogin}
        />
      );
    }

    if (!currentUser) {
      return (
        <LoginPagePro
          onLogin={handleLogin}
          onLogoClick={handleGoToLanding}
          onForgotPassword={() => setShowForgotPassword(true)}
        />
      );
    }

    return renderCurrentPage({
      currentPage,
      currentUser,
      selectedSurveyId,
      selectedOrganizationId,
      subscriptionFlow,
      handlers: {
        handleCreateSurvey,
        handleEditSurvey,
        handleViewResults,
        handleViewSurvey,
        handleDuplicateSurvey,
        handleDeleteSurvey,
        handleShareSurvey,
        handleBackToSurveys,
        handleBackToSurvey,
        handleSurveyComplete,
        handleSurveyCreated,
        handleViewOrganizationSurveys,
        handleBackToOrganizations,
        handleBackToDashboard,
        handleStartSubscription,
        handlePaymentMethodSelected,
        handleBackToPaymentMethod,
        handlePaymentSubmit,
        handleBackToProfile,
        handleStartUsingPlatform,
        handleReturnToLanding,
        getAllSurveysFromDatabase,
      },
    });
  };

  // Initialize startup checks on mount
  useEffect(() => {
    // Perform backend health check on startup
    performStartupHealthCheck();

    // Listen for session expired events
    const handleSessionExpired = () => {
      toast.error('انتهت جلستك. يرجى تسجيل الدخول مرة أخرى');
      handleLogout();
    };

    window.addEventListener('auth:session-expired', handleSessionExpired);

    return () => {
      window.removeEventListener('auth:session-expired', handleSessionExpired);
    };
  }, [handleLogout]);

  return (
    <div
      className="min-h-screen bg-background transition-colors duration-300"
      dir="rtl"
    >
      <FaviconUpdater />
      {!currentUser &&
      (currentPage === "landing" ||
        currentPage === "org-registration") ? (
        <>
          {renderPage()}
          <Toaster
            position="top-center"
            dir="rtl"
            toastOptions={{
              style: {
                fontFamily:
                  "Cairo, IBM Plex Arabic, Noto Sans Arabic, Inter, sans-serif",
                textAlign: "right",
                direction: "rtl",
              },
            }}
          />
        </>
      ) : (
        <Layout
          currentPage={currentPage}
          userRole={currentUser?.role || "beneficiary"}
          userName={currentUser?.name || ""}
          onNavigate={handleNavigate}
          onLogout={handleLogout}
          onGoToLanding={handleGoToLanding}
        >
          {renderPage()}
        </Layout>
      )}

      {currentUser && (
        <Toaster
          position="top-center"
          dir="rtl"
          toastOptions={{
            style: {
              fontFamily:
                "Cairo, IBM Plex Arabic, Noto Sans Arabic, Inter, sans-serif",
              textAlign: "right",
              direction: "rtl",
            },
          }}
        />
      )}

      <ForgotPasswordModal
        isOpen={showForgotPassword}
        onClose={() => setShowForgotPassword(false)}
      />
    </div>
  );
}

export default function App(): JSX.Element {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
