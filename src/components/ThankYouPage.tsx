import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  CheckCircle, 
  Download, 
  Share2, 
  Star,
  Award,
  Calendar,
  Clock,
  MessageSquare,
  ArrowRight
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface ThankYouPageProps {
  surveyTitle?: string;
  organizationName?: string;
  organizationLogo?: string;
  completionTime?: string;
  responseId?: string;
  enableCertificate?: boolean;
  enableFeedback?: boolean;
  onBackToSurveys?: () => void;
  onNewSurvey?: () => void;
}

export function ThankYouPage({
  surveyTitle = "استبيان قياس الأثر الاجتماعي",
  organizationName = "مؤسسة خيرية",
  organizationLogo,
  completionTime = "3 دقائق و 24 ثانية",
  responseId = "RSP-2024-0001",
  enableCertificate = true,
  enableFeedback = true,
  onBackToSurveys,
  onNewSurvey
}: ThankYouPageProps) {
  const [certificateLoading, setCertificateLoading] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [rating, setRating] = useState(0);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  const handleDownloadCertificate = async () => {
    setCertificateLoading(true);
    try {
      // Simulate certificate generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create certificate content
      const certificateContent = `
شهادة إتمام الاستبيان

هذا يشهد بأن المستفيد قد أتم بنجاح استبيان:
${surveyTitle}

المقدم من: ${organizationName}
تاريخ الإتمام: ${new Date().toLocaleDateString('ar-SA')}
معرف الاستجابة: ${responseId}
وقت الإكمال: ${completionTime}

نشكركم على مشاركتكم القيمة في تحسين خدماتنا
      `;

      const blob = new Blob([certificateContent], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `شهادة-إتمام-الاستبيان-${responseId}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success('تم تحميل الشهادة بنجاح! 🎉');
    } catch (error) {
      toast.error('حدث خطأ أثناء تحميل الشهادة');
    } finally {
      setCertificateLoading(false);
    }
  };

  const handleShareSurvey = () => {
    const shareText = `شاركت في استبيان "${surveyTitle}" من ${organizationName}. انضم لنا في قياس الأثر الاجتماعي!`;
    
    if (navigator.share) {
      navigator.share({
        title: 'مشاركة الاستبيان',
        text: shareText,
        url: window.location.origin
      });
    } else {
      navigator.clipboard.writeText(shareText);
      toast.success('تم نسخ النص للمشاركة!');
    }
  };

  const handleSubmitFeedback = () => {
    if (!feedback.trim() && rating === 0) {
      toast.error('يرجى إضافة تقييم أو تعليق');
      return;
    }

    // Submit feedback
    setFeedbackSubmitted(true);
    toast.success('شكراً لك على تقييمك! 🌟');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white arabic-text" dir="rtl">
      <div className="container mx-auto px-6 py-12 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          {organizationLogo && (
            <div className="mb-4">
              <img 
                src={organizationLogo} 
                alt={organizationName}
                className="h-16 w-16 mx-auto rounded-full object-cover"
              />
            </div>
          )}
          <h1 className="text-3xl font-bold text-[#183259] mb-2">
            {organizationName}
          </h1>
          <Badge variant="secondary" className="text-sm">
            {surveyTitle}
          </Badge>
        </div>

        {/* Success Message */}
        <Card className="mb-8 border-green-200 bg-green-50">
          <CardContent className="p-8 text-center">
            <div className="mb-4">
              <CheckCircle className="h-16 w-16 text-green-600 mx-auto" />
            </div>
            <h2 className="text-2xl font-bold text-green-800 mb-2">
              شكراً لك على مشاركتك! 🎉
            </h2>
            <p className="text-green-700 text-lg mb-4">
              تم إرسال إجاباتك بنجاح وستساهم في تحسين خدماتنا
            </p>
            <div className="flex items-center justify-center gap-6 text-sm text-green-600">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>وقت الإكمال: {completionTime}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{new Date().toLocaleDateString('ar-SA')}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Response Details */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-[#183259]" />
              تفاصيل الاستجابة
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div>
                  <span className="text-sm text-gray-600">معرف الاستجابة:</span>
                  <div className="font-mono font-medium">{responseId}</div>
                </div>
                <div>
                  <span className="text-sm text-gray-600">حالة الإرسال:</span>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-green-600 font-medium">تم بنجاح</span>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <span className="text-sm text-gray-600">تاريخ الإكمال:</span>
                  <div className="font-medium">{new Date().toLocaleDateString('ar-SA')}</div>
                </div>
                <div>
                  <span className="text-sm text-gray-600">الوقت المستغرق:</span>
                  <div className="font-medium">{completionTime}</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Certificate Download */}
          {enableCertificate && (
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <Award className="h-12 w-12 text-yellow-600 mx-auto mb-3" />
                  <h3 className="font-medium mb-2">شهادة إتمام الاستبيان</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    احصل على شهادة تؤكد مشاركتك في الاستبيان
                  </p>
                  <Button
                    onClick={handleDownloadCertificate}
                    disabled={certificateLoading}
                    className="w-full bg-yellow-600 hover:bg-yellow-700 text-white"
                  >
                    <Download className={`h-4 w-4 mr-2 ${certificateLoading ? 'animate-spin' : ''}`} />
                    {certificateLoading ? 'جاري التحضير...' : 'تحميل الشهادة'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Share Survey */}
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <Share2 className="h-12 w-12 text-blue-600 mx-auto mb-3" />
                <h3 className="font-medium mb-2">مشاركة الاستبيان</h3>
                <p className="text-sm text-gray-600 mb-4">
                  ساعد في نشر الاستبيان لأصدقائك
                </p>
                <Button
                  onClick={handleShareSurvey}
                  variant="outline"
                  className="w-full border-blue-600 text-blue-600 hover:bg-blue-50"
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  مشاركة الاستبيان
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Feedback Section */}
        {enableFeedback && !feedbackSubmitted && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-[#183259]" />
                تقييم تجربتك
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Rating */}
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    كيف تقيم تجربة الاستبيان؟
                  </label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setRating(star)}
                        className={`p-1 rounded transition-colors ${
                          rating >= star ? 'text-yellow-500' : 'text-gray-300 hover:text-yellow-400'
                        }`}
                      >
                        <Star className="h-6 w-6 fill-current" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Feedback Text */}
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    تعليقات إضافية (اختياري)
                  </label>
                  <textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="شاركنا رأيك حول الاستبيان..."
                    className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-[#183259] focus:border-transparent"
                    rows={3}
                  />
                </div>

                <Button
                  onClick={handleSubmitFeedback}
                  className="bg-[#183259] hover:bg-[#2a4a7a] text-white"
                >
                  إرسال التقييم
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Feedback Success */}
        {feedbackSubmitted && (
          <Card className="mb-8 border-green-200 bg-green-50">
            <CardContent className="p-6 text-center">
              <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <h3 className="font-medium text-green-800 mb-1">شكراً لك على تقييمك!</h3>
              <p className="text-sm text-green-700">
                سنستخدم ملاحظاتك لتحسين تجربة الاستبيانات
              </p>
            </CardContent>
          </Card>
        )}

        {/* Navigation Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {onNewSurvey && (
            <Button
              onClick={onNewSurvey}
              className="bg-[#183259] hover:bg-[#2a4a7a] text-white"
            >
              <ArrowRight className="h-4 w-4 mr-2" />
              استبيان جديد
            </Button>
          )}
          {onBackToSurveys && (
            <Button
              onClick={onBackToSurveys}
              variant="outline"
              className="border-[#183259] text-[#183259] hover:bg-blue-50"
            >
              العودة للاستبيانات
            </Button>
          )}
        </div>

        {/* Footer Message */}
        <div className="text-center mt-12 pt-8 border-t border-gray-200">
          <p className="text-gray-600 text-sm">
            مشاركتك تساعدنا في فهم الأثر الحقيقي لخدماتنا وتطويرها
          </p>
          <p className="text-gray-500 text-xs mt-2">
            © 2024 {organizationName} - منصة قياس الأثر الاجتماعي
          </p>
        </div>
      </div>
    </div>
  );
}