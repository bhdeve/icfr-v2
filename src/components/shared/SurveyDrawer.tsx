import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter, DrawerClose } from '../ui/drawer';
import { Badge } from '../ui/badge';
import { Checkbox } from '../ui/checkbox';
import { Progress } from '../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { ScrollArea } from '../ui/scroll-area';
import { Separator } from '../ui/separator';
import { 
  Plus, 
  Trash2, 
  Save, 
  X, 
  FileText, 
  Users, 
  Target,
  Settings,
  Eye,
  Sparkles,
  ChevronRight,
  Check
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import type { Survey } from '../../App';

interface SurveyDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  survey?: Survey | null;
  onSave: (survey: Survey) => void;
  userRole?: 'admin' | 'org_manager';
}

const STEPS = [
  { id: 'basic', label: 'المعلومات الأساسية', icon: FileText },
  { id: 'questions', label: 'الأسئلة', icon: Users },
  { id: 'demographics', label: 'البيانات الديموغرافية', icon: Target },
  { id: 'settings', label: 'الإعدادات', icon: Settings }
];

const QUESTION_TYPES = [
  { value: 'rating', label: 'تقييم بالنجوم' },
  { value: 'text', label: 'نص طويل' },
  { value: 'multiple', label: 'اختيار من متعدد' },
  { value: 'yes_no', label: 'نعم/لا' },
  { value: 'scale', label: 'مقياس رقمي' }
];

const DEMOGRAPHIC_FILTERS = [
  { id: '1', name: 'الجنس', type: 'radio', options: ['ذكر', 'أنثى'] },
  { id: '2', name: 'العمر', type: 'select', options: ['أقل من 25', '25-35', '35-45', 'أكثر من 45'] },
  { id: '3', name: 'المستوى التعليمي', type: 'select', options: ['ابتدائي', 'متوسط', 'ثانوي', 'جامعي', 'دراسات عليا'] },
  { id: '4', name: 'الحالة الاجتماعية', type: 'radio', options: ['أعزب', 'متزوج', 'مطلق', 'أرمل'] },
  { id: '5', name: 'الحالة المهنية', type: 'select', options: ['طالب', 'موظف', 'متقاعد', 'ربة منزل', 'عاطل', 'أعمال حرة'] }
];

export function SurveyDrawer({ open, onOpenChange, survey, onSave, userRole = 'org_manager' }: SurveyDrawerProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    title: survey?.title || '',
    description: survey?.description || '',
    organization: survey?.organization || '',
    category: survey?.category || 'general',
    targetAudience: survey?.targetAudience || 'all',
    questions: survey?.questions || [],
    demographicFilters: DEMOGRAPHIC_FILTERS.map(f => ({ ...f, enabled: true })),
    settings: {
      allowAnonymous: true,
      requireLogin: false,
      multipleResponses: false,
      showResults: false,
      validFrom: '',
      validTo: ''
    }
  });

  const [newQuestion, setNewQuestion] = useState({
    text: '',
    type: 'rating' as const,
    required: true,
    options: [] as string[]
  });

  const calculateProgress = () => {
    return ((currentStep + 1) / STEPS.length) * 100;
  };

  const addQuestion = () => {
    if (!newQuestion.text) {
      toast.error('يرجى إدخال نص السؤال');
      return;
    }

    setFormData(prev => ({
      ...prev,
      questions: [...prev.questions, { ...newQuestion, id: Date.now().toString() }]
    }));

    setNewQuestion({
      text: '',
      type: 'rating',
      required: true,
      options: []
    });

    toast.success('تم إضافة السؤال بنجاح');
  };

  const removeQuestion = (questionId: string) => {
    setFormData(prev => ({
      ...prev,
      questions: prev.questions.filter(q => q.id !== questionId)
    }));
    toast.success('تم حذف السؤال');
  };

  const handleSave = () => {
    if (!formData.title) {
      toast.error('يرجى إدخال عنوان الاستبيان');
      setCurrentStep(0);
      return;
    }

    if (formData.questions.length === 0) {
      toast.error('يرجى إضافة سؤال واحد على الأقل');
      setCurrentStep(1);
      return;
    }

    const newSurvey: Survey = {
      id: survey?.id || `survey-${Date.now()}`,
      title: formData.title,
      description: formData.description,
      organization: formData.organization || 'منظمتي',
      status: 'draft',
      responses: survey?.responses || 0,
      completionRate: survey?.completionRate || 0,
      createdAt: survey?.createdAt || new Date().toISOString(),
      questions: formData.questions,
      category: formData.category,
      targetAudience: formData.targetAudience
    };

    onSave(newSurvey);
    onOpenChange(false);
    toast.success(survey ? 'تم تحديث الاستبيان بنجاح' : 'تم إنشاء الاستبيان بنجاح');
  };

  const nextStep = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange} direction="left">
      <DrawerContent className="h-full w-full sm:max-w-3xl" dir="rtl">
        <DrawerHeader className="border-b">
          <div className="flex items-center justify-between">
            <div>
              <DrawerTitle className="text-2xl">
                {survey ? 'تعديل الاستبيان' : 'إنشاء استبيان جديد'}
              </DrawerTitle>
              <DrawerDescription>
                {STEPS[currentStep].label}
              </DrawerDescription>
            </div>
            <DrawerClose asChild>
              <Button variant="ghost" size="icon">
                <X className="h-4 w-4" />
              </Button>
            </DrawerClose>
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <Progress value={calculateProgress()} className="h-2" />
            <div className="flex justify-between mt-2 text-xs text-muted-foreground">
              <span>الخطوة {currentStep + 1} من {STEPS.length}</span>
              <span>{Math.round(calculateProgress())}%</span>
            </div>
          </div>

          {/* Steps Navigation */}
          <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
            {STEPS.map((step, index) => {
              const StepIcon = step.icon;
              return (
                <button
                  key={step.id}
                  onClick={() => setCurrentStep(index)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all whitespace-nowrap ${
                    currentStep === index
                      ? 'bg-primary text-primary-foreground'
                      : currentStep > index
                      ? 'bg-green-100 text-green-700'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {currentStep > index ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <StepIcon className="h-4 w-4" />
                  )}
                  <span className="text-sm">{step.label}</span>
                </button>
              );
            })}
          </div>
        </DrawerHeader>

        <ScrollArea className="flex-1 p-6">
          {/* Step 1: Basic Info */}
          {currentStep === 0 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">عنوان الاستبيان *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="مثال: استبيان قياس رضا المستفيدين"
                  className="text-lg"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">الوصف</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="وصف مختصر عن الاستبيان وأهدافه..."
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">التصنيف</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">عام</SelectItem>
                      <SelectItem value="education">تعليم</SelectItem>
                      <SelectItem value="health">صحة</SelectItem>
                      <SelectItem value="social">اجتماعي</SelectItem>
                      <SelectItem value="economic">اقتصادي</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="audience">الفئة المستهدفة</Label>
                  <Select
                    value={formData.targetAudience}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, targetAudience: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">الجميع</SelectItem>
                      <SelectItem value="students">طلاب</SelectItem>
                      <SelectItem value="employees">موظ��ين</SelectItem>
                      <SelectItem value="families">عائلات</SelectItem>
                      <SelectItem value="seniors">كبار السن</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {userRole === 'admin' && (
                <div className="space-y-2">
                  <Label htmlFor="organization">المنظمة</Label>
                  <Input
                    id="organization"
                    value={formData.organization}
                    onChange={(e) => setFormData(prev => ({ ...prev, organization: e.target.value }))}
                    placeholder="اسم المنظمة"
                  />
                </div>
              )}
            </div>
          )}

          {/* Step 2: Questions */}
          {currentStep === 1 && (
            <div className="space-y-6">
              {/* Add New Question */}
              <div className="p-4 border rounded-lg bg-muted/50">
                <h3 className="font-medium mb-4 flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  إضافة سؤال جديد
                </h3>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>نص السؤال *</Label>
                    <Textarea
                      value={newQuestion.text}
                      onChange={(e) => setNewQuestion(prev => ({ ...prev, text: e.target.value }))}
                      placeholder="اكتب سؤالك هنا..."
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>نوع السؤال</Label>
                      <Select
                        value={newQuestion.type}
                        onValueChange={(value: any) => setNewQuestion(prev => ({ ...prev, type: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {QUESTION_TYPES.map(type => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center space-x-2 pt-8">
                      <Checkbox
                        id="required"
                        checked={newQuestion.required}
                        onCheckedChange={(checked) => 
                          setNewQuestion(prev => ({ ...prev, required: !!checked }))
                        }
                      />
                      <Label htmlFor="required" className="cursor-pointer">
                        سؤال إجباري
                      </Label>
                    </div>
                  </div>

                  <Button onClick={addQuestion} className="w-full">
                    <Plus className="h-4 w-4 ml-2" />
                    إضافة السؤال
                  </Button>
                </div>
              </div>

              <Separator />

              {/* Questions List */}
              <div className="space-y-3">
                <h3 className="font-medium flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  الأسئلة المضافة ({formData.questions.length})
                </h3>

                {formData.questions.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>لم تتم إضافة أي أسئلة بعد</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {formData.questions.map((question, index) => (
                      <div
                        key={question.id}
                        className="p-4 border rounded-lg bg-card hover:border-primary/50 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="outline">{index + 1}</Badge>
                              <Badge>{QUESTION_TYPES.find(t => t.value === question.type)?.label}</Badge>
                              {question.required && (
                                <Badge variant="destructive">إجباري</Badge>
                              )}
                            </div>
                            <p className="text-sm">{question.text}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeQuestion(question.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 3: Demographics */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="p-4 border rounded-lg bg-blue-50 border-blue-200">
                <p className="text-sm text-blue-900">
                  <Sparkles className="h-4 w-4 inline ml-2" />
                  البيانات الديموغرافية تساعد في تحليل نتائج الاستبيان بشكل أفضل
                </p>
              </div>

              <div className="space-y-4">
                {formData.demographicFilters.map((filter) => (
                  <div
                    key={filter.id}
                    className="flex items-center justify-between p-4 border rounded-lg bg-card"
                  >
                    <div className="flex items-center gap-3">
                      <Checkbox
                        id={`filter-${filter.id}`}
                        checked={filter.enabled}
                        onCheckedChange={(checked) => {
                          setFormData(prev => ({
                            ...prev,
                            demographicFilters: prev.demographicFilters.map(f =>
                              f.id === filter.id ? { ...f, enabled: !!checked } : f
                            )
                          }));
                        }}
                      />
                      <div>
                        <Label htmlFor={`filter-${filter.id}`} className="cursor-pointer font-medium">
                          {filter.name}
                        </Label>
                        <p className="text-xs text-muted-foreground">
                          {filter.type === 'radio' ? 'اختيار واحد' : 'اختيار من قائمة'}
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline">{filter.options.length} خيار</Badge>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Settings */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg bg-card">
                  <div>
                    <Label className="font-medium">السماح بالردود المجهولة</Label>
                    <p className="text-xs text-muted-foreground">
                      يمكن للمستخدمين الإجابة بدون تسجيل الدخول
                    </p>
                  </div>
                  <Checkbox
                    checked={formData.settings.allowAnonymous}
                    onCheckedChange={(checked) =>
                      setFormData(prev => ({
                        ...prev,
                        settings: { ...prev.settings, allowAnonymous: !!checked }
                      }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg bg-card">
                  <div>
                    <Label className="font-medium">إظهار النتائج</Label>
                    <p className="text-xs text-muted-foreground">
                      عرض النتائج للمستفيدين بعد الإجابة
                    </p>
                  </div>
                  <Checkbox
                    checked={formData.settings.showResults}
                    onCheckedChange={(checked) =>
                      setFormData(prev => ({
                        ...prev,
                        settings: { ...prev.settings, showResults: !!checked }
                      }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg bg-card">
                  <div>
                    <Label className="font-medium">السماح بالردود المتعددة</Label>
                    <p className="text-xs text-muted-foreground">
                      يمكن للمستخدم الإجابة أكثر من مرة
                    </p>
                  </div>
                  <Checkbox
                    checked={formData.settings.multipleResponses}
                    onCheckedChange={(checked) =>
                      setFormData(prev => ({
                        ...prev,
                        settings: { ...prev.settings, multipleResponses: !!checked }
                      }))
                    }
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="font-medium">فترة صلاحية الاستبيان</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>من تاريخ</Label>
                    <Input
                      type="date"
                      value={formData.settings.validFrom}
                      onChange={(e) =>
                        setFormData(prev => ({
                          ...prev,
                          settings: { ...prev.settings, validFrom: e.target.value }
                        }))
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>إلى تاريخ</Label>
                    <Input
                      type="date"
                      value={formData.settings.validTo}
                      onChange={(e) =>
                        setFormData(prev => ({
                          ...prev,
                          settings: { ...prev.settings, validTo: e.target.value }
                        }))
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Preview Card */}
              <div className="p-4 border-2 border-dashed rounded-lg bg-muted/30">
                <div className="flex items-center gap-2 mb-3">
                  <Eye className="h-4 w-4 text-muted-foreground" />
                  <h3 className="font-medium">معاينة الاستبيان</h3>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">العنوان:</span>
                    <span className="font-medium">{formData.title || 'غير محدد'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">عدد الأسئلة:</span>
                    <span className="font-medium">{formData.questions.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">البيانات الديموغرافية:</span>
                    <span className="font-medium">
                      {formData.demographicFilters.filter(f => f.enabled).length} حقل
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">الحالة:</span>
                    <Badge>مسودة</Badge>
                  </div>
                </div>
              </div>
            </div>
          )}
        </ScrollArea>

        <DrawerFooter className="border-t">
          <div className="flex gap-3 w-full">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 0}
              className="flex-1"
            >
              <ChevronRight className="h-4 w-4 ml-2" />
              السابق
            </Button>

            {currentStep < STEPS.length - 1 ? (
              <Button onClick={nextStep} className="flex-1">
                التالي
                <ChevronRight className="h-4 w-4 mr-2 rotate-180" />
              </Button>
            ) : (
              <Button onClick={handleSave} className="flex-1">
                <Save className="h-4 w-4 ml-2" />
                {survey ? 'حفظ التعديلات' : 'إنشاء الاستبيان'}
              </Button>
            )}
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
