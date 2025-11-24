import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  ArrowRight,
  FileText,
  Users,
  Calendar,
  Target,
  BarChart3,
  Edit,
  Eye,
  CheckCircle,
  AlertCircle,
  Briefcase,
  Building,
  Heart,
  GraduationCap,
  Settings
} from 'lucide-react';
import { AdminPageLayout } from './shared/AdminPageLayout';
import { toast } from 'sonner@2.0.3';
import { surveysService } from '../api/services';
import type { SurveyDetail } from '../api/services/surveys.service';

interface SurveyViewPageProps {
  surveyId: string;
  onBack: () => void;
  onEdit: (surveyId: string) => void;
  onViewResults: (surveyId: string) => void;
}

const impactSectors = [
  {
    id: 'income_work',
    title: 'الدخل والعمل',
    icon: Briefcase,
    color: '#183259'
  },
  {
    id: 'housing_infrastructure', 
    title: 'الإسكان والبنية التحتية',
    icon: Building,
    color: '#2a4a7a'
  },
  {
    id: 'health_environment',
    title: 'الصحة والبيئة', 
    icon: Heart,
    color: '#4a6ba3'
  },
  {
    id: 'education_culture',
    title: 'التعليم والثقافة',
    icon: GraduationCap,
    color: '#6b85cc'
  }
];

const filters = [
  { id: 'gender', title: 'النوع' },
  { id: 'age', title: 'العمر' },
  { id: 'region', title: 'المنطقة' },
  { id: 'marital_status', title: 'الحالة الاجتماعية' },
  { id: 'education', title: 'التعليم' },
  { id: 'income', title: 'الدخل' },
  { id: 'program', title: 'البرنامج' },
  { id: 'participation', title: 'العلاقات والمشاركة' }
];

export function SurveyViewPage({ surveyId, onBack, onEdit, onViewResults }: SurveyViewPageProps) {
  const [currentView, setCurrentView] = useState<'overview' | 'questions' | 'settings'>('overview');
  const [survey, setSurvey] = useState<SurveyDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;
    const loadSurvey = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await surveysService.getById(surveyId);
        if (!isActive) return;
        if (response.success) {
          setSurvey(response.data);
        } else {
          setError(response.error?.message || 'O-O_O� OrO�O� O�O�U+OO� O�U,O" U+O�OO�O� OU,OO3O�O\"USOU+');
          toast.error('O-O_O� OrO�O� O�O�U+OO� O�U,O" U+O�OO�O� OU,OO3O�O\"USOU+');
        }
      } catch (err) {
        console.error('Failed to load survey details:', err);
        if (isActive) {
          setError('O-O_O� OrO�O� O�O�U+OO� O�U,O" U+O�OO�O� OU,OO3O�O\"USOU+');
          toast.error('O-O_O� OrO�O� O�O�U+OO� O�U,O" U+O�OO�O� OU,OO3O�O\"USOU+');
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    loadSurvey();

    return () => {
      isActive = false;
    };
  }, [surveyId]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-700 text-base px-4 py-2">نشط</Badge>;
      case 'draft':
        return <Badge variant="secondary" className="text-base px-4 py-2">مسودة</Badge>;
      case 'completed':
        return <Badge className="bg-blue-100 text-blue-700 text-base px-4 py-2">مكتمل</Badge>;
      default:
        return <Badge variant="outline" className="text-base px-4 py-2">{status}</Badge>;
    }
  };

  const responses = survey?.responsesCount ?? (survey as any)?.responses ?? 0;
  const totalBeneficiaries = (survey as any)?.totalBeneficiaries ?? (survey as any)?.beneficiaries ?? 0;
  const completionRate = Math.round(
    survey?.completionRate ?? (totalBeneficiaries ? (responses / totalBeneficiaries) * 100 : 0)
  );
  const questionsCount =
    survey?.sections?.reduce((sum, section) => sum + (section.questions?.length || 0), 0) ??
    ((survey as any)?.preQuestions?.length || 0) +
      ((survey as any)?.postQuestions?.length || 0);
  const selectedSectors = (survey as any)?.selectedSectors ?? (survey?.category ? [survey.category] : []);
  const selectedFilters = (survey as any)?.selectedFilters ?? [];
  const surveyTitle = survey?.title ?? 'O?USO? U.O-O_O_';
  const organizationName = (survey as any)?.organization ?? (survey as any)?.organizationName ?? 'O?USO? U.O-O_O_';
  const createdAt = survey?.createdAt ? new Date(survey.createdAt).toLocaleDateString('ar-SA') : '';
  const status = survey?.status ?? 'draft';
  const description = survey?.description ?? '';
  const surveyIdentifier = survey?.id ?? surveyId;
  const surveySections = survey?.sections ?? [];
  const legacyPreQuestions = (survey as any)?.preQuestions ?? [];
  const legacyPostQuestions = (survey as any)?.postQuestions ?? [];
  const startDate = survey?.createdAt ? new Date(survey.createdAt) : null;
  const endDate = (survey as any)?.updatedAt ? new Date((survey as any).updatedAt) : (survey as any)?.closedAt ? new Date((survey as any).closedAt) : null;
  const settings = (survey as any)?.settings ?? {};
  const allowPartialResponses = settings.allowPartialResponses ?? false;
  const requireBeneficiaryInfo = settings.requireBeneficiaryInfo ?? false;
  const autoReminders = settings.autoReminders ?? false;
  const reminderFrequency = settings.reminderFrequency ?? '';
  const organizationEmail = (survey as any)?.organizationEmail ?? '';
  const beneficiariesCount = totalBeneficiaries;

  // Header stats for the page layout
  const headerStats = (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
      <div className="bg-white/10 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <Users className="h-6 w-6 text-white" />
          <div>
            <div className="text-2xl font-bold text-white arabic-numbers">{responses}</div>
            <div className="text-blue-200">إجمالي الردود</div>
          </div>
        </div>
      </div>
      <div className="bg-white/10 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <CheckCircle className="h-6 w-6 text-white" />
          <div>
            <div className="text-2xl font-bold text-white arabic-numbers">{completionRate}%</div>
            <div className="text-blue-200">معدل الإكمال</div>
          </div>
        </div>
      </div>
      <div className="bg-white/10 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <FileText className="h-6 w-6 text-white" />
          <div>
            <div className="text-2xl font-bold text-white arabic-numbers">{questionsCount}</div>
            <div className="text-blue-200">إجمالي الأسئلة</div>
          </div>
        </div>
      </div>
      <div className="bg-white/10 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <Target className="h-6 w-6 text-white" />
          <div>
            <div className="text-2xl font-bold text-white arabic-numbers">{selectedSectors.length}</div>
            <div className="text-blue-200">مجالات الأثر</div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <AdminPageLayout
      title="عرض الاستبيان"
      description="تفاصيل ومعلومات الاستبيان"
      icon={Eye}
    >
      <div className="space-y-4">
        {loading && (
          <div className="p-4 rounded-lg bg-blue-50 text-blue-700 border border-blue-200">
            O�OO�US O�U,O" U+O�OO�O� OU,OO3O�O"USOU+...
          </div>
        )}
        {error && (
          <div className="p-4 rounded-lg bg-red-50 text-red-700 border border-red-200">
            {error}
          </div>
        )}
        {/* Back Button and Actions */}
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={onBack}
            className="flex items-center gap-2"
          >
            <ArrowRight className="h-4 w-4" />
            رجوع
          </Button>
          
          <div className="flex gap-3">
            <Button
              variant="outline"
              disabled={!surveyIdentifier || loading}
              onClick={() => onViewResults(surveyIdentifier)}
              className="gap-2"
            >
              <BarChart3 className="h-4 w-4" />
              عرض النتائج
            </Button>
            <Button
              disabled={!surveyIdentifier || loading}
              onClick={() => onEdit(surveyIdentifier)}
              className="gap-2 bg-[#183259] hover:bg-[#2a4a7a]"
            >
              <Edit className="h-4 w-4" />
              تعديل
            </Button>
          </div>
        </div>

        {/* Survey Basic Info */}
        <Card className="shadow-lg border-0 bg-white/95 backdrop-blur-sm">
          <CardHeader className="border-b border-[#183259]/10 pb-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-2xl text-[#183259] mb-4">{surveyTitle}</CardTitle>
                <div className="flex items-center gap-6 text-base text-gray-600 mb-6">
                  <span className="flex items-center gap-2">
                    <Building className="h-5 w-5" />
                    {organizationName}
                  </span>
                  <span className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    {createdAt || 'O?USO? U.O-O_O_'}
                  </span>
                  {getStatusBadge(status)}
                </div>
                <p className="text-gray-700 text-lg leading-relaxed">{description}</p>
              </div>
            </div>
          </CardHeader>
        </Card>



        {/* Navigation Tabs */}
        <div className="flex gap-2 bg-[#183259]/5 p-2 rounded-2xl border border-[#183259]/10">
          <button
            onClick={() => setCurrentView('overview')}
            className={`flex-1 px-6 py-4 rounded-xl text-base font-semibold transition-all duration-200 ${
              currentView === 'overview'
                ? 'bg-[#183259] text-white shadow-lg'
                : 'text-[#183259] hover:bg-[#183259]/10'
            }`}
          >
            نظرة عامة
          </button>
          <button
            onClick={() => setCurrentView('questions')}
            className={`flex-1 px-6 py-4 rounded-xl text-base font-semibold transition-all duration-200 ${
              currentView === 'questions'
                ? 'bg-[#183259] text-white shadow-lg'
                : 'text-[#183259] hover:bg-[#183259]/10'
            }`}
          >
            الأسئلة
          </button>

        </div>

        {/* Content based on current view */}
        {currentView === 'overview' && (
          <div className="space-y-4">
            {/* Sectors */}
            <Card className="shadow-lg border-0 bg-white/95 backdrop-blur-sm">
              <CardHeader className="border-b border-[#183259]/10 pb-6">
                <CardTitle className="text-2xl text-[#183259]">مجالات الأثر المختارة</CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedSectors.map(sectorId => {
                    const sector = impactSectors.find(s => s.id === sectorId);
                    if (!sector) return null;
                    
                    return (
                      <div key={sector.id} className="flex items-center gap-4 p-6 border-2 border-gray-200 rounded-2xl hover:border-[#183259]/30 transition-colors">
                        <div className="p-4 rounded-2xl" style={{ backgroundColor: `${sector.color}15` }}>
                          <sector.icon className="h-8 w-8" style={{ color: sector.color }} />
                        </div>
                        <span className="font-semibold text-lg">{sector.title}</span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Filters */}
            <Card className="shadow-lg border-0 bg-white/95 backdrop-blur-sm">
              <CardHeader className="border-b border-[#183259]/10 pb-6">
                <CardTitle className="text-2xl text-[#183259]">الفلاتر المستخدمة</CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <div className="flex flex-wrap gap-4">
                  {selectedFilters.map(filterId => {
                    const filter = filters.find(f => f.id === filterId);
                    return filter ? (
                      <Badge key={filterId} variant="outline" className="text-base px-4 py-2 border-[#183259]/30 text-[#183259]">
                        {filter.title}
                      </Badge>
                    ) : null;
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Timeline */}
            <Card className="shadow-lg border-0 bg-white/95 backdrop-blur-sm">
              <CardHeader className="border-b border-[#183259]/10 pb-6">
                <CardTitle className="text-2xl text-[#183259]">جدولة الاستبيان</CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                    <div>
                      <p className="font-semibold text-lg">تاريخ البداية</p>
                      <p className="text-base text-gray-600 arabic-numbers">{startDate ? startDate.toLocaleDateString('ar-SA') : 'O?USO? U.O-O_O_'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                    <div>
                      <p className="font-semibold text-lg">تاريخ الانتهاء</p>
                      <p className="text-base text-gray-600 arabic-numbers">{endDate ? endDate.toLocaleDateString('ar-SA') : 'O?USO? U.O-O_O_'}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {currentView === 'questions' && (
          <div className="space-y-4">
            <Card className="shadow-lg border-0 bg-white/95 backdrop-blur-sm">
              <CardHeader className="border-b border-[#183259]/10 pb-6">
                <CardTitle className="text-2xl text-[#183259]">O?O?O?O?U,O?</CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                {loading && (
                  <div className="flex items-center gap-3 text-[#183259]">
                    <div className="w-5 h-5 border-2 border-[#183259] border-t-transparent rounded-full animate-spin" />
                    <span>O?O?O?US O?U,O\" U+O?O?O?O? O?U,O?O3O?U,O?...</span>
                  </div>
                )}

                {!loading && surveySections.length === 0 && !(legacyPreQuestions.length || legacyPostQuestions.length) && (
                  <p className="text-gray-600">O?USO? U.O-O_O_ O?O?O?O? O?U,O?O3O?U,O?.</p>
                )}

                {!loading && surveySections.length > 0 && surveySections.map((section, sectionIndex) => (
                  <div key={section.id || sectionIndex} className="border-2 border-gray-200 rounded-2xl p-6 hover:border-[#183259]/30 transition-colors space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-lg">{section.title || `O?O1O_O?O_O?O? ${sectionIndex + 1}`}</h4>
                      <Badge variant="outline" className="text-sm px-3 py-1">
                        {section.questions?.length ?? 0} O?U,O?O3O?U,O?
                      </Badge>
                    </div>
                    <div className="space-y-4">
                      {(section.questions || []).map((question, index) => (
                        <div key={question.id || index} className="p-4 rounded-xl bg-gray-50 border">
                          <div className="flex justify-between items-start mb-2">
                            <span className="font-semibold text-base">{index + 1}. {question.title || question.text}</span>
                            <Badge variant={question.required ? 'default' : 'outline'} className="text-xs px-2 py-1">
                              {question.required ? 'U.O?U,U^O"' : 'O?OrO?USO?O?US'}
                            </Badge>
                          </div>
                          {question.options && question.options.length > 0 && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-3">
                              {question.options.map((option: any, optIndex: number) => (
                                <div key={option.id || optIndex} className="text-sm bg-white p-2 rounded-lg border">
                                  {option.label || option}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

                {!loading && surveySections.length === 0 && (legacyPreQuestions.length > 0 || legacyPostQuestions.length > 0) && (
                  <div className="space-y-4">
                    {[...legacyPreQuestions, ...legacyPostQuestions].map((question: any, index: number) => (
                      <div key={question.id || index} className="border-2 border-gray-200 rounded-2xl p-6 hover:border-[#183259]/30 transition-colors">
                        <div className="flex justify-between items-start mb-4">
                          <h4 className="font-semibold text-lg">{index + 1}. {question.text}</h4>
                          <Badge variant={question.required ? 'default' : 'outline'} className="text-sm px-3 py-1">
                            {question.required ? 'U.O?U,U^O"' : 'O?OrO?USO?O?US'}
                          </Badge>
                        </div>
                        {question.options && (
                          <div className="mt-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {question.options.map((option: any, optIndex: number) => (
                                <div key={optIndex} className="text-base bg-gray-50 p-3 rounded-xl border">
                                  {option}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
{currentView === 'settings' && (
          <Card className="shadow-lg border-0 bg-white/95 backdrop-blur-sm">
            <CardHeader className="border-b border-[#183259]/10 pb-6">
              <CardTitle className="flex items-center gap-4 text-2xl text-[#183259]">
                <div className="p-3 bg-[#183259] rounded-2xl">
                  <Settings className="h-6 w-6 text-white" />
                </div>
                إعدادات الاستبيان
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-bold text-xl text-[#183259] mb-4">التواريخ</h4>
                  <div className="space-y-4 text-base">
                    <div className="flex justify-between p-4 bg-gray-50 rounded-xl">
                      <span className="text-gray-600">تاريخ البداية:</span>
                      <span className="font-semibold arabic-numbers">{startDate ? startDate.toLocaleDateString('ar-SA') : 'O?USO? U.O-O_O_'}</span>
                    </div>
                    <div className="flex justify-between p-4 bg-gray-50 rounded-xl">
                      <span className="text-gray-600">تاريخ الانتهاء:</span>
                      <span className="font-semibold arabic-numbers">{endDate ? endDate.toLocaleDateString('ar-SA') : 'O?USO? U.O-O_O_'}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-xl text-[#183259] mb-4">إعدادات الاستجابة</h4>
                  <div className="space-y-4 text-base">
                    <div className="flex justify-between p-4 bg-gray-50 rounded-xl">
                      <span className="text-gray-600">الردود الجزئية:</span>
                      <span className="font-semibold">{allowPartialResponses ? 'مسموحة' : 'غير مسموحة'}</span>
                    </div>
                    <div className="flex justify-between p-4 bg-gray-50 rounded-xl">
                      <span className="text-gray-600">معلومات المستفيد:</span>
                      <span className="font-semibold">{requireBeneficiaryInfo ? 'مطلوبة' : 'غير مطلوبة'}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-xl text-[#183259] mb-4">التذكيرات</h4>
                  <div className="space-y-4 text-base">
                    <div className="flex justify-between p-4 bg-gray-50 rounded-xl">
                      <span className="text-gray-600">التذكيرات التلقائية:</span>
                      <span className="font-semibold">{autoReminders ? 'مفعلة' : 'معطلة'}</span>
                    </div>
                    {autoReminders && (
                      <div className="flex justify-between p-4 bg-gray-50 rounded-xl">
                        <span className="text-gray-600">تكرار التذكيرات:</span>
                        <span className="font-semibold arabic-numbers">كل {reminderFrequency} أيام</span>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-xl text-[#183259] mb-4">معلومات إضافية</h4>
                  <div className="space-y-4 text-base">
                    <div className="flex justify-between p-4 bg-gray-50 rounded-xl">
                      <span className="text-gray-600">البريد الإلكتروني:</span>
                      <span className="font-semibold">{organizationEmail || 'غير محدد'}</span>
                    </div>
                    <div className="flex justify-between p-4 bg-gray-50 rounded-xl">
                      <span className="text-gray-600">إجمالي المستفيدين:</span>
                      <span className="font-semibold arabic-numbers">{beneficiariesCount}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminPageLayout>
  );
}

export default SurveyViewPage;
