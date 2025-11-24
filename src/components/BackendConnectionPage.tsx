import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  Server, 
  Wifi, 
  WifiOff, 
  RefreshCw, 
  CheckCircle, 
  XCircle,
  AlertTriangle,
  ExternalLink
} from 'lucide-react';
import { envConfig } from '../config/env.config';
import { api } from '../shared/api/apiClient';

interface BackendConnectionPageProps {
  onBack?: () => void;
}

export function BackendConnectionPage({ onBack }: BackendConnectionPageProps) {
  const [isChecking, setIsChecking] = useState(false);
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);
  const [errorDetails, setErrorDetails] = useState<string>('');

  const checkConnection = async () => {
    setIsChecking(true);
    setErrorDetails('');
    
    try {
      // Try to ping the backend health endpoint
      const response = await api.get('/health');
      setIsConnected(true);
      setLastChecked(new Date());
    } catch (error: any) {
      setIsConnected(false);
      setLastChecked(new Date());
      
      if (error.code === 'ERR_NETWORK') {
        setErrorDetails('فشل الاتصال بالشبكة - تأكد من تشغيل الخادم وإعدادات CORS');
      } else if (error.response) {
        setErrorDetails(`خطأ HTTP: ${error.response.status} - ${error.response.statusText}`);
      } else {
        setErrorDetails(error.message || 'خطأ غير معروف');
      }
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    checkConnection();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6" dir="rtl">
      <div className="max-w-3xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full shadow-lg mb-4">
            <Server className="h-10 w-10 text-[#18325a]" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            حالة الاتصال بالخادم
          </h1>
          <p className="text-gray-600">
            التحقق من اتصال Frontend بـ Backend API
          </p>
        </div>

        {/* Connection Status Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {isConnected === null ? (
                  <Wifi className="h-6 w-6 text-gray-400 animate-pulse" />
                ) : isConnected ? (
                  <CheckCircle className="h-6 w-6 text-green-500" />
                ) : (
                  <WifiOff className="h-6 w-6 text-red-500" />
                )}
                <div>
                  <CardTitle>حالة الاتصال</CardTitle>
                  <CardDescription>
                    {lastChecked && `آخر فحص: ${lastChecked.toLocaleTimeString('ar-SA')}`}
                  </CardDescription>
                </div>
              </div>
              
              <Badge 
                variant={isConnected ? 'default' : 'destructive'}
                className={isConnected ? 'bg-green-500' : ''}
              >
                {isConnected === null ? 'جاري الفحص...' : isConnected ? 'متصل' : 'غير متصل'}
              </Badge>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {/* Backend URL */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-1">عنوان الخادم:</p>
                  <code className="text-sm bg-white px-3 py-2 rounded border block break-all">
                    {envConfig.backendBaseUrl}
                  </code>
                </div>
                <a 
                  href={envConfig.backendBaseUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#18325a] hover:underline flex items-center gap-1 text-sm mt-6"
                >
                  <ExternalLink className="h-4 w-4" />
                  فتح
                </a>
              </div>
            </div>

            {/* Error Details */}
            {!isConnected && errorDetails && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex gap-3">
                  <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-red-900 mb-1">تفاصيل الخطأ:</p>
                    <p className="text-sm text-red-700">{errorDetails}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Retry Button */}
            <Button
              onClick={checkConnection}
              disabled={isChecking}
              className="w-full bg-[#18325a] hover:bg-[#2a4a7a]"
            >
              {isChecking ? (
                <>
                  <RefreshCw className="h-4 w-4 ml-2 animate-spin" />
                  جاري الفحص...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4 ml-2" />
                  إعادة الفحص
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Troubleshooting Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-600" />
              خطوات استكشاف الأخطاء
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-sm">
              <div>
                <p className="font-medium text-gray-900 mb-2">1. تحقق من تشغيل الخادم:</p>
                <code className="block bg-gray-900 text-green-400 p-3 rounded-lg">
                  cd backend<br/>
                  npm run dev
                </code>
              </div>

              <div>
                <p className="font-medium text-gray-900 mb-2">2. تحقق من متغيرات البيئة:</p>
                <p className="text-gray-600 mr-4">
                  تأكد من وجود ملف <code className="bg-gray-100 px-2 py-0.5 rounded">.env</code> في جذر المشروع:
                </p>
                <code className="block bg-gray-100 p-3 rounded-lg mt-2">
                  VITE_BACKEND_BASE_URL={envConfig.backendBaseUrl}
                </code>
              </div>

              <div>
                <p className="font-medium text-gray-900 mb-2">3. تحقق من اتصال الإنترنت:</p>
                <p className="text-gray-600 mr-4">
                  تأكد من اتصالك بالإنترنت وأن الخادم يقبل الاتصالات من localhost
                </p>
              </div>

              <div>
                <p className="font-medium text-gray-900 mb-2">4. تحقق من إعدادات CORS:</p>
                <p className="text-gray-600 mr-4">
                  تأكد من أن Backend يسمح بالطلبات من <code className="bg-gray-100 px-2 py-0.5 rounded">http://localhost:5173</code>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Configuration Card */}
        <Card>
          <CardHeader>
            <CardTitle>معلومات التكوين</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600 mb-1">البيئة:</p>
                <Badge variant="outline">
                  {envConfig.isDevelopment ? 'Development' : 'Production'}
                </Badge>
              </div>
              <div>
                <p className="text-gray-600 mb-1">Timeout:</p>
                <Badge variant="outline">{envConfig.apiTimeout}ms</Badge>
              </div>
              <div className="col-span-2">
                <p className="text-gray-600 mb-1">Debug Logs:</p>
                <Badge variant={envConfig.enableDebugLogs ? 'default' : 'outline'}>
                  {envConfig.enableDebugLogs ? 'Enabled' : 'Disabled'}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Back Button */}
        {onBack && (
          <Button
            onClick={onBack}
            variant="outline"
            className="w-full"
          >
            العودة
          </Button>
        )}
      </div>
    </div>
  );
}
