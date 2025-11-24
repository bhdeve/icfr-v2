import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter, DrawerClose } from '../ui/drawer';
import { Badge } from '../ui/badge';
import { Checkbox } from '../ui/checkbox';
import { ScrollArea } from '../ui/scroll-area';
import { Separator } from '../ui/separator';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { 
  X, 
  Download, 
  FileText,
  FileSpreadsheet,
  File,
  Image as ImageIcon,
  CheckCircle,
  AlertCircle,
  Loader
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface ExportDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data?: any;
  exportType: 'surveys' | 'users' | 'reports' | 'analytics';
  onExport: (format: string, options: ExportOptions) => Promise<void>;
}

interface ExportOptions {
  format: string;
  includeCharts: boolean;
  includeStats: boolean;
  includeRawData: boolean;
  includeFilters: boolean;
  dateRange?: { from: string; to: string };
}

const EXPORT_FORMATS = [
  {
    value: 'pdf',
    label: 'PDF',
    icon: FileText,
    description: 'ملف PDF للطباعة والمشاركة',
    color: 'text-red-600'
  },
  {
    value: 'excel',
    label: 'Excel',
    icon: FileSpreadsheet,
    description: 'جدول بيانات Excel للتحليل',
    color: 'text-green-600'
  },
  {
    value: 'csv',
    label: 'CSV',
    icon: File,
    description: 'ملف CSV للبيانات الخام',
    color: 'text-blue-600'
  },
  {
    value: 'png',
    label: 'PNG',
    icon: ImageIcon,
    description: 'صورة للمخططات فقط',
    color: 'text-purple-600'
  }
];

export function ExportDrawer({ open, onOpenChange, data, exportType, onExport }: ExportDrawerProps) {
  const [selectedFormat, setSelectedFormat] = useState('pdf');
  const [options, setOptions] = useState<ExportOptions>({
    format: 'pdf',
    includeCharts: true,
    includeStats: true,
    includeRawData: true,
    includeFilters: false
  });
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    setExportSuccess(false);

    try {
      await onExport(selectedFormat, options);
      setExportSuccess(true);
      toast.success(`تم التصدير بنجاح بصيغة ${EXPORT_FORMATS.find(f => f.value === selectedFormat)?.label}`);
      
      // Auto close after success
      setTimeout(() => {
        onOpenChange(false);
        setExportSuccess(false);
      }, 2000);
    } catch (error) {
      toast.error('فشل التصدير. يرجى المحاولة مرة أخرى');
    } finally {
      setIsExporting(false);
    }
  };

  const getExportTypeLabel = () => {
    const labels = {
      surveys: 'الاستطلاعات',
      users: 'المستخدمين',
      reports: 'التقارير',
      analytics: 'التحليلات'
    };
    return labels[exportType] || exportType;
  };

  const toggleOption = (option: keyof ExportOptions) => {
    setOptions(prev => ({
      ...prev,
      [option]: !prev[option as string]
    }));
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange} direction="left">
      <DrawerContent className="h-full w-full sm:max-w-lg" dir="rtl">
        <DrawerHeader className="border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Download className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <DrawerTitle className="text-xl">تصدير البيانات</DrawerTitle>
                <DrawerDescription>
                  تصدير {getExportTypeLabel()}
                </DrawerDescription>
              </div>
            </div>
            <DrawerClose asChild>
              <Button variant="ghost" size="icon" disabled={isExporting}>
                <X className="h-4 w-4" />
              </Button>
            </DrawerClose>
          </div>
        </DrawerHeader>

        <ScrollArea className="flex-1 p-6">
          <div className="space-y-6">
            {/* Success Message */}
            {exportSuccess && (
              <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-lg animate-fade-in">
                <CheckCircle className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                <div className="text-sm text-green-900">
                  <p className="font-medium mb-1">تم التصدير بنجاح!</p>
                  <p>تم تنزيل الملف على جهازك</p>
                </div>
              </div>
            )}

            {/* Info Alert */}
            <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <AlertCircle className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
              <div className="text-sm text-blue-900">
                <p className="font-medium mb-1">ملاحظة</p>
                <p>سيتم تصدير البيانات بناءً على الفلاتر المطبقة حالياً</p>
              </div>
            </div>

            {/* Export Format Selection */}
            <div className="space-y-3">
              <Label className="text-base font-medium">اختر صيغة التصدير</Label>
              <RadioGroup value={selectedFormat} onValueChange={setSelectedFormat}>
                <div className="space-y-2">
                  {EXPORT_FORMATS.map((format) => {
                    const FormatIcon = format.icon;
                    return (
                      <div
                        key={format.value}
                        className={`relative flex items-start p-4 border-2 rounded-lg transition-all cursor-pointer ${
                          selectedFormat === format.value
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/50'
                        }`}
                        onClick={() => setSelectedFormat(format.value)}
                      >
                        <RadioGroupItem
                          value={format.value}
                          id={format.value}
                          className="mt-1"
                        />
                        <div className="mr-3 flex-1">
                          <Label 
                            htmlFor={format.value} 
                            className="flex items-center gap-2 cursor-pointer"
                          >
                            <FormatIcon className={`h-5 w-5 ${format.color}`} />
                            <span className="font-medium">{format.label}</span>
                            {selectedFormat === format.value && (
                              <CheckCircle className="h-4 w-4 text-primary" />
                            )}
                          </Label>
                          <p className="text-sm text-muted-foreground mt-1">
                            {format.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </RadioGroup>
            </div>

            <Separator />

            {/* Export Options */}
            <div className="space-y-3">
              <Label className="text-base font-medium">خيارات التصدير</Label>
              
              <div className="space-y-3">
                {selectedFormat !== 'png' && (
                  <>
                    <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="includeStats"
                          checked={options.includeStats}
                          onCheckedChange={() => toggleOption('includeStats')}
                        />
                        <Label htmlFor="includeStats" className="cursor-pointer">
                          تضمين الإحصائيات
                        </Label>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="includeCharts"
                          checked={options.includeCharts}
                          onCheckedChange={() => toggleOption('includeCharts')}
                        />
                        <Label htmlFor="includeCharts" className="cursor-pointer">
                          تضمين المخططات البيانية
                        </Label>
                      </div>
                    </div>
                  </>
                )}

                {(selectedFormat === 'excel' || selectedFormat === 'csv') && (
                  <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="includeRawData"
                        checked={options.includeRawData}
                        onCheckedChange={() => toggleOption('includeRawData')}
                      />
                      <Label htmlFor="includeRawData" className="cursor-pointer">
                        تضمين البيانات الخام
                      </Label>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="includeFilters"
                      checked={options.includeFilters}
                      onCheckedChange={() => toggleOption('includeFilters')}
                    />
                    <Label htmlFor="includeFilters" className="cursor-pointer">
                      تضمين معلومات الفلاتر
                    </Label>
                  </div>
                </div>
              </div>
            </div>

            {/* Preview Card */}
            <div className="p-4 border-2 border-dashed rounded-lg bg-muted/30">
              <h3 className="font-medium mb-3 flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                معاينة التصدير
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">الصيغة:</span>
                  <Badge>{EXPORT_FORMATS.find(f => f.value === selectedFormat)?.label}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">النوع:</span>
                  <span className="font-medium">{getExportTypeLabel()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">الخيارات المفعلة:</span>
                  <span className="font-medium">
                    {Object.values(options).filter(Boolean).length - 1}
                  </span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">التاريخ:</span>
                  <span className="font-medium text-xs">
                    {new Date().toLocaleDateString('ar-SA')}
                  </span>
                </div>
              </div>
            </div>

            {/* File Size Estimate */}
            <div className="text-xs text-muted-foreground text-center p-3 bg-muted/50 rounded-lg">
              الحجم المتوقع للملف: ~{selectedFormat === 'pdf' ? '2-5' : selectedFormat === 'png' ? '0.5-2' : '0.5-3'} MB
            </div>
          </div>
        </ScrollArea>

        <DrawerFooter className="border-t">
          <div className="flex gap-3 w-full">
            <Button 
              variant="outline" 
              onClick={() => onOpenChange(false)} 
              className="flex-1"
              disabled={isExporting}
            >
              إلغاء
            </Button>
            <Button 
              onClick={handleExport} 
              className="flex-1"
              disabled={isExporting}
            >
              {isExporting ? (
                <>
                  <Loader className="h-4 w-4 ml-2 animate-spin" />
                  جاري التصدير...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 ml-2" />
                  تصدير الآن
                </>
              )}
            </Button>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
