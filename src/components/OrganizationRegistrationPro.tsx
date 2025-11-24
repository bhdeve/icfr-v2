import React, { useState } from 'react';



import { motion, AnimatePresence } from 'motion/react';



import { Button } from './ui/button';



import { Input } from './ui/input';



import { Textarea } from './ui/textarea';



import { Label } from './ui/label';



import { Checkbox } from './ui/checkbox';



import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';



import { Card, CardContent } from './ui/card';



import { Badge } from './ui/badge';



import { Logo } from './layout/Logo';



import { Progress } from './ui/progress';



import { toast } from 'sonner@2.0.3';



import { organizationsService } from '../api/services';



import {



  Building,



  User,



  Mail,



  Phone,



  Globe,



  Users,



  CheckCircle2,



  ArrowRight,



  ArrowLeft,



  FileText,



  MapPin,



  Sparkles,



  Check



} from 'lucide-react';







interface OrganizationRegistrationData {



  organizationName: string;



  managerName: string;



  email: string;



  phone: string;



  country: string;



  city: string;



  expectedBeneficiaries: string;



  workFields: string[];



  description: string;



  website: string;



}







interface OrganizationRegistrationProProps {



  onBackToLanding: () => void;



  onLoginClick: () => void;



}







const workFieldOptions = [



  { id: 'health', label: 'صحي', icon: '🏥', gradient: 'from-red-500 to-pink-500' },



  { id: 'education', label: 'تعليمي', icon: '📚', gradient: 'from-blue-500 to-cyan-500' },



  { id: 'social', label: 'اجتماعي', icon: '👥', gradient: 'from-purple-500 to-indigo-500' },



  { id: 'environmental', label: 'بيئي', icon: '🌱', gradient: 'from-emerald-500 to-teal-500' },



  { id: 'economic', label: 'اقتصادي', icon: '💼', gradient: 'from-orange-500 to-amber-500' },



  { id: 'cultural', label: 'ثقافي', icon: '🎭', gradient: 'from-pink-500 to-rose-500' },



  { id: 'sports', label: 'رياضي', icon: '⚽', gradient: 'from-green-500 to-lime-500' },



  { id: 'technology', label: 'تقني', icon: '💻', gradient: 'from-violet-500 to-purple-500' }



];







const countries = [



  'المملكة العربية السعودية',



  'الإمارات العربية المتحدة',



  'قطر',



  'الكويت',



  'البحرين',



  'عمان'



];







export function OrganizationRegistrationPro({ 



  onBackToLanding, 



  onLoginClick 



}: OrganizationRegistrationProProps) {



  const [currentStep, setCurrentStep] = useState(1);



  const [isLoading, setIsLoading] = useState(false);



  const [formData, setFormData] = useState<OrganizationRegistrationData>({



    organizationName: '',



    managerName: '',



    email: '',



    phone: '',



    country: '',



    city: '',



    expectedBeneficiaries: '',



    workFields: [],



    description: '',



    website: ''



  });







  const totalSteps = 3;



  const progress = (currentStep / totalSteps) * 100;







  const updateFormData = (field: keyof OrganizationRegistrationData, value: any) => {



    setFormData(prev => ({ ...prev, [field]: value }));



  };







  const toggleWorkField = (fieldId: string) => {



    setFormData(prev => ({



      ...prev,



      workFields: prev.workFields.includes(fieldId)



        ? prev.workFields.filter(f => f !== fieldId)



        : [...prev.workFields, fieldId]



    }));



  };







  const validateStep = (step: number): boolean => {



    switch (step) {



      case 1:



        if (!formData.organizationName || !formData.country || !formData.city) {



          toast.error('يرجى إكمال جميع الحقول المطلوبة');



          return false;



        }



        break;



      case 2:



        if (!formData.managerName || !formData.email || !formData.phone) {



          toast.error('يرجى إكمال جميع الحقول المطلوبة');



          return false;



        }



        if (!formData.email.includes('@')) {



          toast.error('يرجى إدخال بريد إلكتروني صحيح');



          return false;



        }



        break;



      case 3:



        if (formData.workFields.length === 0) {



          toast.error('يرجى اختيار مجال عمل واحد على الأقل');



          return false;



        }



        break;



    }



    return true;



  };







  const handleNext = () => {



    if (validateStep(currentStep)) {



      setCurrentStep(prev => Math.min(prev + 1, totalSteps));



      window.scrollTo({ top: 0, behavior: 'smooth' });



    }



  };







  const handleBack = () => {



    setCurrentStep(prev => Math.max(prev - 1, 1));



    window.scrollTo({ top: 0, behavior: 'smooth' });



  };







  const handleSubmit = async () => {

    if (!validateStep(3)) return;



    setIsLoading(true);

    try {

      const payload = {

        name: formData.organizationName,

        industry: formData.workFields[0] || 'general',

        country: formData.country,

        city: formData.city,

        contactEmail: formData.email,

        contactPhone: formData.phone,

        website: formData.website,

        admin: {

          firstName: formData.managerName.split(' ')[0] || formData.managerName,

          lastName: formData.managerName.split(' ').slice(1).join(' ') || formData.managerName,

          email: formData.email,

          password: 'TempPass123!',

        },

        captchaToken: 'frontend-placeholder',

        acceptTerms: true,

        metadata: {

          expectedBeneficiaries: formData.expectedBeneficiaries,

          workFields: formData.workFields,

          description: formData.description,

        },

      } as any;



      const response = await organizationsService.create(payload);

      if (response.success) {

        toast.success('?? ????? ??? ??????? ?????! ???? ?????? ?????? ??????.');

        setTimeout(() => {

          onLoginClick();

        }, 1500);

      } else {

        toast.error(response.error?.message || '???? ????? ?????? ???? ???????? ??????.');

      }

    } catch (error: any) {

      console.error('Registration error:', error);

      toast.error(error?.message || '???? ????? ?????? ???? ???????? ??????.');

    } finally {

      setIsLoading(false);

    }

  };



  const renderStep = () => {



    switch (currentStep) {



      case 1:



        return (



          <motion.div



            key="step1"



            initial={{ opacity: 0, x: 50 }}



            animate={{ opacity: 1, x: 0 }}



            exit={{ opacity: 0, x: -50 }}



            className="space-y-6"



          >



            <div className="text-center mb-8">



              <div className="w-16 h-16 bg-gradient-to-br from-[#18325a] to-[#2a4a7a] rounded-2xl flex items-center justify-center mx-auto mb-4">



                <Building className="w-8 h-8 text-white" />



              </div>



              <h3 className="text-2xl font-bold text-gray-900 mb-2">معلومات المنظمة</h3>



              <p className="text-gray-600">أخبرنا عن منظمتك</p>



            </div>







            <div className="space-y-4">



              <div className="space-y-2">



                <Label htmlFor="organizationName">



                  اسم المنظمة <span className="text-red-500">*</span>



                </Label>



                <div className="relative">



                  <Building className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />



                  <Input



                    id="organizationName"



                    value={formData.organizationName}



                    onChange={(e) => updateFormData('organizationName', e.target.value)}



                    className="pr-10 h-12 border-2 focus:border-[#18325a]"



                    placeholder="مثال: مؤسسة الخير للتنمية"



                  />



                </div>



              </div>







              <div className="grid md:grid-cols-2 gap-4">



                <div className="space-y-2">



                  <Label htmlFor="country">



                    الدولة <span className="text-red-500">*</span>



                  </Label>



                  <Select 



                    value={formData.country}



                    onValueChange={(value) => updateFormData('country', value)}



                  >



                    <SelectTrigger className="h-12 border-2 focus:ring-[#18325a]">



                      <SelectValue placeholder="اختر الدولة" />



                    </SelectTrigger>



                    <SelectContent>



                      {countries.map((country) => (



                        <SelectItem key={country} value={country}>



                          {country}



                        </SelectItem>



                      ))}



                    </SelectContent>



                  </Select>



                </div>







                <div className="space-y-2">



                  <Label htmlFor="city">



                    المدينة <span className="text-red-500">*</span>



                  </Label>



                  <div className="relative">



                    <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />



                    <Input



                      id="city"



                      value={formData.city}



                      onChange={(e) => updateFormData('city', e.target.value)}



                      className="pr-10 h-12 border-2 focus:border-[#18325a]"



                      placeholder="مثال: الرياض"



                    />



                  </div>



                </div>



              </div>







              <div className="space-y-2">



                <Label htmlFor="website">



                  الموقع الإلكتروني (اختياري)



                </Label>



                <div className="relative">



                  <Globe className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />



                  <Input



                    id="website"



                    value={formData.website}



                    onChange={(e) => updateFormData('website', e.target.value)}



                    className="pr-10 h-12 border-2 focus:border-[#18325a]"



                    placeholder="https://example.com"



                  />



                </div>



              </div>



            </div>



          </motion.div>



        );







      case 2:



        return (



          <motion.div



            key="step2"



            initial={{ opacity: 0, x: 50 }}



            animate={{ opacity: 1, x: 0 }}



            exit={{ opacity: 0, x: -50 }}



            className="space-y-6"



          >



            <div className="text-center mb-8">



              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4">



                <User className="w-8 h-8 text-white" />



              </div>



              <h3 className="text-2xl font-bold text-gray-900 mb-2">بيانات التواصل</h3>



              <p className="text-gray-600">معلومات مسؤول المنظمة</p>



            </div>







            <div className="space-y-4">



              <div className="space-y-2">



                <Label htmlFor="managerName">



                  اسم المسؤول <span className="text-red-500">*</span>



                </Label>



                <div className="relative">



                  <User className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />



                  <Input



                    id="managerName"



                    value={formData.managerName}



                    onChange={(e) => updateFormData('managerName', e.target.value)}



                    className="pr-10 h-12 border-2 focus:border-[#18325a]"



                    placeholder="مثال: أحمد محمد"



                  />



                </div>



              </div>







              <div className="space-y-2">



                <Label htmlFor="email">



                  البريد الإلكتروني <span className="text-red-500">*</span>



                </Label>



                <div className="relative">



                  <Mail className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />



                  <Input



                    id="email"



                    type="email"



                    value={formData.email}



                    onChange={(e) => updateFormData('email', e.target.value)}



                    className="pr-10 h-12 border-2 focus:border-[#18325a]"



                    placeholder="example@organization.com"



                  />



                </div>



              </div>







              <div className="space-y-2">



                <Label htmlFor="phone">



                  رقم الجوال <span className="text-red-500">*</span>



                </Label>



                <div className="relative">



                  <Phone className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />



                  <Input



                    id="phone"



                    type="tel"



                    value={formData.phone}



                    onChange={(e) => updateFormData('phone', e.target.value)}



                    className="pr-10 h-12 border-2 focus:border-[#18325a]"



                    placeholder="+966 XX XXX XXXX"



                  />



                </div>



              </div>







              <div className="space-y-2">



                <Label htmlFor="expectedBeneficiaries">



                  العدد المتوقع للمستفيدين (اختياري)



                </Label>



                <div className="relative">



                  <Users className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />



                  <Input



                    id="expectedBeneficiaries"



                    value={formData.expectedBeneficiaries}



                    onChange={(e) => updateFormData('expectedBeneficiaries', e.target.value)}



                    className="pr-10 h-12 border-2 focus:border-[#18325a]"



                    placeholder="مثال: 100-500"



                  />



                </div>



              </div>



            </div>



          </motion.div>



        );







      case 3:



        return (



          <motion.div



            key="step3"



            initial={{ opacity: 0, x: 50 }}



            animate={{ opacity: 1, x: 0 }}



            exit={{ opacity: 0, x: -50 }}



            className="space-y-6"



          >



            <div className="text-center mb-8">



              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">



                <FileText className="w-8 h-8 text-white" />



              </div>



              <h3 className="text-2xl font-bold text-gray-900 mb-2">مجالات العمل</h3>



              <p className="text-gray-600">حدد مجالات عمل منظمتك</p>



            </div>







            <div className="space-y-6">



              <div className="space-y-3">



                <Label>



                  اختر مجال أو أكثر <span className="text-red-500">*</span>



                </Label>



                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">



                  {workFieldOptions.map((field) => (



                    <motion.button



                      key={field.id}



                      type="button"



                      onClick={() => toggleWorkField(field.id)}



                      className={`p-4 rounded-xl border-2 transition-all ${



                        formData.workFields.includes(field.id)



                          ? 'border-[#18325a] bg-[#18325a]/5 shadow-md'



                          : 'border-gray-200 hover:border-gray-300'



                      }`}



                      whileHover={{ scale: 1.05 }}



                      whileTap={{ scale: 0.95 }}



                    >



                      <div className="text-3xl mb-2">{field.icon}</div>



                      <div className="text-sm font-medium text-gray-900">{field.label}</div>



                      {formData.workFields.includes(field.id) && (



                        <motion.div



                          initial={{ scale: 0 }}



                          animate={{ scale: 1 }}



                          className="mt-2"



                        >



                          <div className="w-6 h-6 bg-[#18325a] rounded-full flex items-center justify-center mx-auto">



                            <Check className="w-4 h-4 text-white" />



                          </div>



                        </motion.div>



                      )}



                    </motion.button>



                  ))}



                </div>



              </div>







              <div className="space-y-2">



                <Label htmlFor="description">



                  نبذة عن المنظمة (اختياري)



                </Label>



                <Textarea



                  id="description"



                  value={formData.description}



                  onChange={(e) => updateFormData('description', e.target.value)}



                  className="min-h-32 border-2 focus:border-[#18325a]"



                  placeholder="أخبرنا المزيد عن أهداف منظمتك وأنشطتها..."



                />



              </div>







              <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-xl">



                <Sparkles className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />



                <div className="text-sm text-blue-900">



                  <p className="font-medium mb-1">نصيحة:</p>



                  <p className="text-blue-700">



                    كلما كانت معلوماتك أكثر دقة، كلما كانت الأدوات والتحليلات أكثر ملاءمة لاحتياجاتك



                  </p>



                </div>



              </div>



            </div>



          </motion.div>



        );



    }



  };







  return (



    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 relative overflow-hidden" dir="rtl">



      {/* Background Pattern */}



      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>



      <div className="absolute top-0 right-0 w-96 h-96 bg-[#18325a]/5 rounded-full blur-3xl"></div>



      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>







      {/* Header */}



      <header className="fixed top-0 w-full bg-white/95 backdrop-blur-xl border-b border-gray-200 z-50 shadow-sm">



        <div className="container mx-auto px-4 sm:px-6 lg:px-8">



          <div className="flex items-center justify-between h-16 lg:h-20">



            <Logo 



              onClick={onBackToLanding}



              size="md"



              showText={true}



              variant="dark"



              className="cursor-pointer"



            />



            



            <div className="flex items-center gap-3">



              <span className="hidden sm:inline text-gray-600 text-sm">لديك حساب بالفعل؟</span>



              <Button 



                variant="ghost"



                onClick={onLoginClick}



                className="hover:text-[#18325a] hover:bg-[#18325a]/5"



              >



                تسجيل الدخول



              </Button>



            </div>



          </div>



        </div>



      </header>







      {/* Content */}



      <div className="py-24 px-4">



        <div className="max-w-4xl mx-auto relative z-10">



          {/* Title */}



          <div className="text-center mb-8">



            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">تسجيل منظمة جديدة</h1>



            <p className="text-gray-600 text-lg">أكمل الخطوات التالية لإنشاء حساب منظمتك</p>



          </div>







          {/* Progress Bar */}



          <div className="mb-8">



          <div className="flex items-center justify-between mb-2">



            <span className="text-sm font-medium text-gray-700">



              الخطوة {currentStep} من {totalSteps}



            </span>



            <span className="text-sm text-gray-500">{Math.round(progress)}%</span>



          </div>



            <Progress value={progress} className="h-2" />



          </div>







          {/* Steps Indicator */}



          <div className="flex items-center justify-between mb-8 px-4">



          {[1, 2, 3].map((step) => (



            <div key={step} className="flex flex-col items-center flex-1">



              <div



                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${



                  step === currentStep



                    ? 'bg-gradient-to-br from-[#18325a] to-[#2a4a7a] text-white scale-110'



                    : step < currentStep



                    ? 'bg-emerald-500 text-white'



                    : 'bg-gray-200 text-gray-500'



                }`}



              >



                {step < currentStep ? (



                  <CheckCircle2 className="w-6 h-6" />



                ) : (



                  <span className="text-lg font-bold">{step}</span>



                )}



              </div>



              <div className={`text-xs mt-2 text-center ${



                step === currentStep ? 'text-[#18325a] font-medium' : 'text-gray-500'



              }`}>



                {step === 1 ? 'المنظمة' : step === 2 ? 'التواصل' : 'المجالات'}



              </div>



              {step < totalSteps && (



                <div



                  className={`h-0.5 w-full mx-4 mt-6 ${



                    step < currentStep ? 'bg-emerald-500' : 'bg-gray-200'



                  }`}



                />



              )}



              </div>



            ))}



          </div>







          {/* Form Card */}



          <Card className="border-2 shadow-xl">



            <CardContent className="p-8">



              <AnimatePresence mode="wait">



                {renderStep()}



              </AnimatePresence>







              {/* Navigation Buttons */}



              <div className="flex gap-4 mt-8">



                {currentStep > 1 && (



                  <Button



                    variant="outline"



                    onClick={handleBack}



                    className="flex-1 h-12 border-2"



                    disabled={isLoading}



                    >



                    <ArrowLeft className="h-5 w-5 ml-2" />



                    السابق



                  </Button>



                )}







                {currentStep < totalSteps ? (



                  <Button



                    onClick={handleNext}



                    className="flex-1 h-12 bg-gradient-to-r from-[#18325a] to-[#2a4a7a]"



                  >



                    التالي



                    <ArrowRight className="h-5 w-5 mr-2" />



                  </Button>



                ) : (



                  <Button



                    onClick={handleSubmit}



                    className="flex-1 h-12 bg-gradient-to-r from-emerald-500 to-teal-500"



                    disabled={isLoading}



                  >



                    {isLoading ? (



                      <div className="flex items-center gap-2">



                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>



                        <span>جاري التسجيل...</span>



                      </div>



                    ) : (



                      <div className="flex items-center gap-2">



                        <CheckCircle2 className="h-5 w-5" />



                        <span>إتمام التسجيل</span>



                      </div>



                    )}



                  </Button>



                )}



              </div>



            </CardContent>



          </Card>



        </div>



      </div>







      <style>{`



        .bg-grid-pattern {



          background-image: 



            linear-gradient(to right, rgba(0,0,0,0.1) 1px, transparent 1px),



            linear-gradient(to bottom, rgba(0,0,0,0.1) 1px, transparent 1px);



          background-size: 40px 40px;



        }



      `}</style>



    </div>



  );



}



