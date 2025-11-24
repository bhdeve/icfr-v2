import React, { createContext, useContext, useEffect } from 'react';

type Language = 'ar';
type Direction = 'rtl';

interface LanguageContextType {
  language: Language;
  direction: Direction;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translations dictionary (Arabic only)
const translations: Record<string, string> = {
  // Navigation
  'nav.dashboard': 'لوحة التحكم',
  'nav.surveys': 'الاستبيانات',
  'nav.organizations': 'المنظمات',
  'nav.users': 'المستخدمين',
  'nav.settings': 'الإعدادات',
  'nav.profile': 'الملف الشخصي',
  'nav.logout': 'تسجيل الخروج',
  
  // Common
  'common.save': 'حفظ',
  'common.cancel': 'إلغاء',
  'common.delete': 'حذف',
  'common.edit': 'تعديل',
  'common.add': 'إضافة',
  'common.search': 'بحث',
  'common.filter': 'تصفية',
  'common.export': 'تصدير',
  'common.import': 'استيراد',
  'common.loading': 'جاري التحميل...',
  'common.error': 'حدث خطأ',
  'common.success': 'تمت العملية بنجاح',
  'common.confirm': 'تأكيد',
  'common.back': 'رجوع',
  'common.next': 'التالي',
  'common.previous': 'السابق',
  'common.submit': 'إرسال',
  'common.close': 'إغلاق',
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Always use Arabic
  const language: Language = 'ar';
  const direction: Direction = 'rtl';

  useEffect(() => {
    const root = window.document.documentElement;
    
    // Set direction
    root.setAttribute('dir', direction);
    
    // Set language
    root.setAttribute('lang', language);
  }, []);

  const t = (key: string): string => {
    return translations[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, direction, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};
