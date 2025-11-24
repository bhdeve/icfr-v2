import React from 'react';
import { AlertCircle, RefreshCw, Server } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Button } from './ui/button';
import { envConfig } from '../config/env.config';

interface BackendStatusAlertProps {
  onRetry?: () => void;
}

/**
 * Backend Connection Status Alert
 * Displays a warning when backend is not available
 */
export function BackendStatusAlert({ onRetry }: BackendStatusAlertProps) {
  return (
    <Alert className="border-amber-500 bg-amber-50 text-amber-900">
      <AlertCircle className="h-5 w-5 text-amber-600" />
      <AlertTitle className="flex items-center gap-2">
        <Server className="h-4 w-4" />
        لا يمكن الاتصال بالخادم
      </AlertTitle>
      <AlertDescription className="mt-3 space-y-3">
        <p className="text-sm">
          تعذّر الاتصال بالخادم الخلفي. يرجى التحقق من:
        </p>
        <ul className="text-sm space-y-1 mr-4">
          <li>• اتصال الإنترنت</li>
          <li>• تشغيل الخادم على: <code className="bg-amber-100 px-2 py-0.5 rounded text-xs">{envConfig.backendBaseUrl}</code></li>
          <li>• إعدادات الـ CORS والجدار الناري</li>
        </ul>
        
        {onRetry && (
          <Button
            onClick={onRetry}
            variant="outline"
            size="sm"
            className="mt-2 border-amber-600 text-amber-700 hover:bg-amber-100"
          >
            <RefreshCw className="h-4 w-4 ml-2" />
            إعادة المحاولة
          </Button>
        )}

        <div className="mt-3 pt-3 border-t border-amber-200">
          <p className="text-xs text-amber-700">
            💡 <strong>ملاحظة:</strong> هذا التطبيق يتطلب اتصال بالـ Backend API. 
            يرجى التأكد من تشغيل خادم Backend قبل استخدام المنصة.
          </p>
        </div>
      </AlertDescription>
    </Alert>
  );
}
