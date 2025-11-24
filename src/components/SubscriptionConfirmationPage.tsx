import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { AdminPageLayout } from './shared/AdminPageLayout';
import type { PaymentMethod } from './PaymentMethodPage';
import type { PaymentFormData } from './PaymentDetailsPage';
import { 
  CheckCircle,
  Download,
  Mail,
  Calendar,
  CreditCard,
  Package,
  Star,
  Crown,
  Shield,
  ArrowRight,
  FileText,
  Bell,
  ExternalLink
} from 'lucide-react';

interface SubscriptionConfirmationPageProps {
  userRole: 'org_manager';
  selectedPackage: {
    id: string;
    name: string;
    nameEn: string;
    price: number;
    currency: string;
    duration: string;
    isPremium?: boolean;
    isPopular?: boolean;
    color: string;
    features: string[];
    limits: {
      surveys: number;
      beneficiaries: number;
      responses: number;
      storage: string;
      support: string;
    };
  };
  selectedMethod: PaymentMethod;
  paymentData: PaymentFormData;
  onBackToProfile: () => void;
  onStartUsingPlatform: () => void;
}

const generateTransactionId = () => {
  return 'TXN-' + Date.now().toString().slice(-8) + '-' + Math.random().toString(36).substr(2, 4).toUpperCase();
};

const generateInvoiceNumber = () => {
  return 'INV-' + new Date().getFullYear() + '-' + (Date.now().toString().slice(-6));
};

export function SubscriptionConfirmationPage({ 
  userRole, 
  selectedPackage, 
  selectedMethod,
  paymentData,
  onBackToProfile, 
  onStartUsingPlatform 
}: SubscriptionConfirmationPageProps) {
  const transactionId = generateTransactionId();
  const invoiceNumber = generateInvoiceNumber();
  const currentDate = new Date();
  const nextBillingDate = new Date(currentDate);
  nextBillingDate.setMonth(nextBillingDate.getMonth() + 1);

  const getPackageIcon = (packageId: string) => {
    switch (packageId) {
      case 'starter': return <Package className="h-5 w-5" />;
      case 'professional': return <Star className="h-5 w-5" />;
      case 'premium': return <Crown className="h-5 w-5" />;
      case 'enterprise': return <Shield className="h-5 w-5" />;
      default: return <Package className="h-5 w-5" />;
    }
  };

  const headerStats = (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
      <div className="bg-white/10 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <CheckCircle className="h-6 w-6 text-green-300" />
          <div>
            <div className="text-2xl font-bold text-white">نجح</div>
            <div className="text-blue-200">حالة الدفع</div>
          </div>
        </div>
      </div>
      <div className="bg-white/10 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <CreditCard className="h-6 w-6 text-white" />
          <div>
            <div className="text-2xl font-bold text-white">{paymentData.finalAmount.toFixed(2)} {selectedPackage.currency}</div>
            <div className="text-blue-200">المبلغ المدفوع</div>
          </div>
        </div>
      </div>
      <div className="bg-white/10 rounded-lg p-4">
        <div className="flex items-center gap-3">
          {getPackageIcon(selectedPackage.id)}
          <div className="text-white">
            <div className="text-2xl font-bold text-white">{selectedPackage.name}</div>
            <div className="text-blue-200">الباقة النشطة</div>
          </div>
        </div>
      </div>
      <div className="bg-white/10 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <Calendar className="h-6 w-6 text-white" />
          <div>
            <div className="text-2xl font-bold text-white">{nextBillingDate.toLocaleDateString('ar-SA', { day: 'numeric', month: 'short' })}</div>
            <div className="text-blue-200">التجديد القادم</div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <EnhancedPageLayout
      pageId="subscription-confirmation"
      userRole={userRole}
      description="تم تأكيد اشتراكك بنجاح! مرحباً بك في عائلة أثرنا"
      icon={<CheckCircle className="h-8 w-8" />}
      headerContent={headerStats}
    >
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Success Message */}
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-8 text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-green-800 mb-2">
                  🎉 تهانينا! تم تأكيد اشتراكك بنجاح
                </h2>
                <p className="text-green-700">
                  مرحباً بك في عائلة أثرنا. يمكنك الآن الاستفادة من جميع مميزات باقة {selectedPackage.name}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Transaction Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                تفاصيل المعاملة
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">رقم المعاملة:</span>
                  <p className="font-mono font-medium">{transactionId}</p>
                </div>
                <div>
                  <span className="text-gray-600">رقم الفاتورة:</span>
                  <p className="font-mono font-medium">{invoiceNumber}</p>
                </div>
                <div>
                  <span className="text-gray-600">تاريخ الدفع:</span>
                  <p className="font-medium">{currentDate.toLocaleDateString('ar-SA', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}</p>
                </div>
                <div>
                  <span className="text-gray-600">وقت الدفع:</span>
                  <p className="font-medium">{currentDate.toLocaleTimeString('ar-SA', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}</p>
                </div>
                <div>
                  <span className="text-gray-600">طريقة الدفع:</span>
                  <div className="flex items-center gap-2">
                    <selectedMethod.icon className="h-4 w-4" />
                    <span className="font-medium">{selectedMethod.name}</span>
                  </div>
                </div>
                <div>
                  <span className="text-gray-600">الحالة:</span>
                  <Badge className="bg-green-500 text-white">مكتمل</Badge>
                </div>
              </div>

              <Separator />

              {/* Payment Breakdown */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>سعر الباقة</span>
                  <span>{selectedPackage.price} {selectedPackage.currency}</span>
                </div>
                
                {paymentData.promoDiscount && (
                  <div className="flex justify-between text-green-600">
                    <span>خصم ({paymentData.promoCode})</span>
                    <span>-{((selectedPackage.price * paymentData.promoDiscount) / 100).toFixed(2)} {selectedPackage.currency}</span>
                  </div>
                )}
                
                <div className="flex justify-between text-sm text-gray-600">
                  <span>ضريبة القيمة المضافة (15%)</span>
                  <span>مشمولة</span>
                </div>
                
                <Separator />
                
                <div className="flex justify-between font-bold text-lg">
                  <span>المجموع المدفوع</span>
                  <span style={{ color: selectedPackage.color }}>
                    {paymentData.finalAmount.toFixed(2)} {selectedPackage.currency}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Subscription Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {getPackageIcon(selectedPackage.id)}
                تفاصيل الاشتراك
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium">{selectedPackage.name}</h3>
                  <Badge 
                    style={{ backgroundColor: selectedPackage.color }}
                    className="text-white"
                  >
                    نشط
                  </Badge>
                </div>
                <p className="text-sm text-gray-600">{selectedPackage.duration}</p>
              </div>

              {/* Package Limits */}
              <div className="space-y-3">
                <h4 className="font-medium">حدود الباقة:</h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex justify-between">
                    <span>الاستبيانات:</span>
                    <span className="font-medium">
                      {selectedPackage.limits.surveys === -1 ? 'غير محدود' : selectedPackage.limits.surveys}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>المستفيدين:</span>
                    <span className="font-medium">
                      {selectedPackage.limits.beneficiaries === -1 ? 'غير محدود' : selectedPackage.limits.beneficiaries.toLocaleString('ar-SA')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>الاستجابات:</span>
                    <span className="font-medium">
                      {selectedPackage.limits.responses === -1 ? 'غير محدود' : selectedPackage.limits.responses.toLocaleString('ar-SA')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>التخزين:</span>
                    <span className="font-medium">{selectedPackage.limits.storage}</span>
                  </div>
                  <div className="flex justify-between col-span-2">
                    <span>الدعم:</span>
                    <span className="font-medium">{selectedPackage.limits.support}</span>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Billing Dates */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>تاريخ البدء:</span>
                  <span className="font-medium">{currentDate.toLocaleDateString('ar-SA')}</span>
                </div>
                <div className="flex justify-between">
                  <span>التجديد التلقائي:</span>
                  <span className="font-medium">{nextBillingDate.toLocaleDateString('ar-SA')}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Next Steps */}
        <Card>
          <CardHeader>
            <CardTitle>الخطوات التالية</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-start gap-3 p-4 border rounded-lg">
                <div className="w-8 h-8 bg-[#183259] text-white rounded-full flex items-center justify-center text-sm font-bold">
                  1
                </div>
                <div>
                  <h4 className="font-medium mb-1">ابدأ في إنشاء الاستبيانات</h4>
                  <p className="text-sm text-gray-600">يمكنك الآن إنشاء استبياناتك الأولى وقياس الأثر الاجتماعي</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-4 border rounded-lg">
                <div className="w-8 h-8 bg-[#183259] text-white rounded-full flex items-center justify-center text-sm font-bold">
                  2
                </div>
                <div>
                  <h4 className="font-medium mb-1">أضف المستفيدين</h4>
                  <p className="text-sm text-gray-600">قم بإضافة وإدارة المستفيدين في نظامك</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-4 border rounded-lg">
                <div className="w-8 h-8 bg-[#183259] text-white rounded-full flex items-center justify-center text-sm font-bold">
                  3
                </div>
                <div>
                  <h4 className="font-medium mb-1">استخدم تحليل برق</h4>
                  <p className="text-sm text-gray-600">احصل على تحليلات ذكية ورؤى قيمة من بياناتك</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={onStartUsingPlatform}
            className="bg-[#183259] hover:bg-[#2a4a7a]"
            size="lg"
          >
            ابدأ في استخدام المنصة
            <ArrowRight className="h-4 w-4 mr-2" />
          </Button>
          
          <Button variant="outline" size="lg">
            <Download className="h-4 w-4 ml-2" />
            تحميل الفاتورة
          </Button>
          
          <Button variant="outline" onClick={onBackToProfile} size="lg">
            العودة للملف الشخصي
          </Button>
        </div>

        {/* Notification Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-blue-600" />
                <div className="text-sm">
                  <p className="font-medium text-blue-800">تأكيد بالبريد الإلكتروني</p>
                  <p className="text-blue-700">سيتم إرسال تأكيد الاشتراك والفاتورة إلى بريدك الإلكتروني</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-green-50 border-green-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Bell className="h-5 w-5 text-green-600" />
                <div className="text-sm">
                  <p className="font-medium text-green-800">التذكيرات التلقائية</p>
                  <p className="text-green-700">ستتلقى تذكيراً قبل موعد التجديد بـ 7 أيام</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Support Information */}
        <Card className="bg-gray-50">
          <CardContent className="p-6 text-center">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Shield className="h-5 w-5 text-[#183259]" />
              <h3 className="font-medium">هل تحتاج مساعدة؟</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              فريق الدعم الفني متاح لمساعدتك في بداية رحلتك مع أثرنا
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button variant="outline" size="sm">
                <ExternalLink className="h-4 w-4 ml-2" />
                مركز المساعدة
              </Button>
              <Button variant="outline" size="sm">
                <Mail className="h-4 w-4 ml-2" />
                تواصل معنا
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </EnhancedPageLayout>
  );
}