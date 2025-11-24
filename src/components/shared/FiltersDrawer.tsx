import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter, DrawerClose } from '../ui/drawer';
import { Badge } from '../ui/badge';
import { Checkbox } from '../ui/checkbox';
import { ScrollArea } from '../ui/scroll-area';
import { Separator } from '../ui/separator';
import { Slider } from '../ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  X, 
  Filter, 
  RotateCcw,
  Save,
  Calendar,
  Users,
  Building,
  FileText,
  Activity,
  TrendingUp,
  Search,
  Sparkles,
  Clock,
  Star,
  Tag
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { motion } from 'motion/react';

interface FilterConfig {
  dateRange?: { from: string; to: string };
  status?: string[];
  organizations?: string[];
  categories?: string[];
  responseRange?: { min: number; max: number };
  completionRate?: { min: number; max: number };
  searchText?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  quickFilter?: string;
}

interface FiltersDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filters: FilterConfig;
  onApplyFilters: (filters: FilterConfig) => void;
  filterType?: 'surveys' | 'users' | 'organizations' | 'dashboard';
}

const STATUS_OPTIONS = {
  surveys: [
    { value: 'active', label: 'نشط', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    { value: 'draft', label: 'مسودة', color: 'bg-slate-50 text-slate-700 border-slate-200' },
    { value: 'completed', label: 'مكتمل', color: 'bg-blue-50 text-blue-700 border-blue-200' },
    { value: 'archived', label: 'مؤرشف', color: 'bg-amber-50 text-amber-700 border-amber-200' }
  ],
  users: [
    { value: 'active', label: 'نشط', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    { value: 'inactive', label: 'غير نشط', color: 'bg-slate-50 text-slate-700 border-slate-200' },
    { value: 'pending', label: 'معلق', color: 'bg-amber-50 text-amber-700 border-amber-200' }
  ],
  organizations: [
    { value: 'active', label: 'نشط', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    { value: 'inactive', label: 'غير نشط', color: 'bg-slate-50 text-slate-700 border-slate-200' },
    { value: 'pending', label: 'قيد المراجعة', color: 'bg-amber-50 text-amber-700 border-amber-200' }
  ]
};

const CATEGORIES = [
  { value: 'general', label: 'عام', icon: '📊' },
  { value: 'education', label: 'تعليم', icon: '🎓' },
  { value: 'health', label: 'صحة', icon: '🏥' },
  { value: 'social', label: 'اجتماعي', icon: '👥' },
  { value: 'economic', label: 'اقتصادي', icon: '💼' },
  { value: 'environment', label: 'بيئي', icon: '🌱' }
];

const ORGANIZATIONS = [
  'جمعية الخير للتنمية',
  'مؤسسة الأمل الصحية',
  'جمعية المستقبل التعليمية',
  'مؤسسة البناء والتطوير',
  'جمعية الرحمة الخيرية'
];

const SORT_OPTIONS = {
  surveys: [
    { value: 'date', label: 'التاريخ', icon: Calendar },
    { value: 'title', label: 'العنوان', icon: FileText },
    { value: 'responses', label: 'عدد الردود', icon: Users },
    { value: 'completion', label: 'معدل الإكمال', icon: TrendingUp }
  ],
  users: [
    { value: 'name', label: 'الاسم', icon: Users },
    { value: 'email', label: 'البريد الإلكتروني', icon: FileText },
    { value: 'date', label: 'تاريخ التسجيل', icon: Calendar },
    { value: 'lastLogin', label: 'آخر تسجيل دخول', icon: Clock }
  ],
  organizations: [
    { value: 'name', label: 'الاسم', icon: Building },
    { value: 'date', label: 'تاريخ التسجيل', icon: Calendar },
    { value: 'users', label: 'عدد المستخدمين', icon: Users },
    { value: 'surveys', label: 'عدد الاستطلاعات', icon: FileText }
  ],
  dashboard: [
    { value: 'date', label: 'التاريخ', icon: Calendar },
    { value: 'impact', label: 'الأثر', icon: TrendingUp },
    { value: 'responses', label: 'عدد الردود', icon: Users }
  ]
};

// Quick Filters
const QUICK_FILTERS = {
  surveys: [
    { value: 'trending', label: 'الأكثر نشاطاً', icon: TrendingUp },
    { value: 'recent', label: 'الأحدث', icon: Clock },
    { value: 'high-response', label: 'استجابة عالية', icon: Users },
    { value: 'starred', label: 'المميزة', icon: Star }
  ],
  users: [
    { value: 'active-today', label: 'نشط اليوم', icon: Activity },
    { value: 'new-users', label: 'مستخدمون جدد', icon: Sparkles },
    { value: 'top-contributors', label: 'الأكثر مساهمة', icon: Star }
  ],
  organizations: [
    { value: 'active', label: 'الأكثر نشاطاً', icon: TrendingUp },
    { value: 'new', label: 'منظمات جديدة', icon: Sparkles },
    { value: 'premium', label: 'خطة مميزة', icon: Star }
  ]
};

export function FiltersDrawer({ 
  open, 
  onOpenChange, 
  filters, 
  onApplyFilters,
  filterType = 'surveys'
}: FiltersDrawerProps) {
  const [localFilters, setLocalFilters] = useState<FilterConfig>(filters);
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);
  const [savedFilters, setSavedFilters] = useState<FilterConfig[]>([]);

  // Calculate active filters
  useEffect(() => {
    let count = 0;
    if (localFilters.dateRange?.from) count++;
    if (localFilters.status && localFilters.status.length > 0) count++;
    if (localFilters.organizations && localFilters.organizations.length > 0) count++;
    if (localFilters.categories && localFilters.categories.length > 0) count++;
    if (localFilters.responseRange) count++;
    if (localFilters.completionRate) count++;
    if (localFilters.searchText) count++;
    if (localFilters.quickFilter) count++;
    setActiveFiltersCount(count);
  }, [localFilters]);

  const handleApply = () => {
    onApplyFilters(localFilters);
    onOpenChange(false);
    toast.success(`تم تطبيق ${activeFiltersCount} فلتر بنجاح`, {
      description: 'يتم الآن تحديث النتائج...'
    });
  };

  const handleReset = () => {
    const resetFilters: FilterConfig = {
      dateRange: { from: '', to: '' },
      status: [],
      organizations: [],
      categories: [],
      responseRange: undefined,
      completionRate: undefined,
      searchText: '',
      sortBy: 'date',
      sortOrder: 'desc',
      quickFilter: undefined
    };
    setLocalFilters(resetFilters);
    toast.info('تم إعادة تعيين جميع الفلاتر', {
      description: 'يمكنك الآن تطبيق فلاتر جديدة'
    });
  };

  const handleSaveFilter = () => {
    setSavedFilters(prev => [...prev, localFilters]);
    toast.success('تم حفظ الفلتر بنجاح', {
      description: 'يمكنك استخدامه لاحقاً'
    });
  };

  const toggleStatus = (status: string) => {
    setLocalFilters(prev => {
      const current = prev.status || [];
      const updated = current.includes(status)
        ? current.filter(s => s !== status)
        : [...current, status];
      return { ...prev, status: updated };
    });
  };

  const toggleOrganization = (org: string) => {
    setLocalFilters(prev => {
      const current = prev.organizations || [];
      const updated = current.includes(org)
        ? current.filter(o => o !== org)
        : [...current, org];
      return { ...prev, organizations: updated };
    });
  };

  const toggleCategory = (category: string) => {
    setLocalFilters(prev => {
      const current = prev.categories || [];
      const updated = current.includes(category)
        ? current.filter(c => c !== category)
        : [...current, category];
      return { ...prev, categories: updated };
    });
  };

  const applyQuickFilter = (quickFilterValue: string) => {
    setLocalFilters(prev => ({
      ...prev,
      quickFilter: prev.quickFilter === quickFilterValue ? undefined : quickFilterValue
    }));
  };

  const statusOptions = STATUS_OPTIONS[filterType === 'dashboard' ? 'surveys' : filterType] || STATUS_OPTIONS.surveys;
  const sortOptions = SORT_OPTIONS[filterType] || SORT_OPTIONS.surveys;
  const quickFilters = QUICK_FILTERS[filterType] || QUICK_FILTERS.surveys;

  return (
    <Drawer open={open} onOpenChange={onOpenChange} direction="left">
      <DrawerContent className="h-full w-full sm:max-w-2xl border-l-2 border-[#18325a]/10" dir="rtl">
        <DrawerHeader className="border-b bg-gradient-to-l from-[#18325a]/5 via-white to-white pb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <motion.div 
                className="p-3 bg-gradient-to-br from-[#18325a] to-[#2a4a7a] rounded-2xl shadow-lg"
                whileHover={{ scale: 1.05, rotate: 5 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <Filter className="h-6 w-6 text-white" />
              </motion.div>
              <div>
                <DrawerTitle className="text-2xl text-[#18325a]">الفلاتر المتقدمة</DrawerTitle>
                <DrawerDescription className="flex items-center gap-2 mt-2">
                  {activeFiltersCount > 0 ? (
                    <Badge 
                      variant="secondary" 
                      className="bg-[#18325a]/10 text-[#18325a] border-[#18325a]/20 px-3 py-1"
                    >
                      <Sparkles className="h-3 w-3 ml-1" />
                      {activeFiltersCount} فلتر نشط
                    </Badge>
                  ) : (
                    <span className="text-gray-500">لا يوجد فلاتر نشطة</span>
                  )}
                </DrawerDescription>
              </div>
            </div>
            <DrawerClose asChild>
              <Button variant="ghost" size="icon" className="hover:bg-red-50 hover:text-red-600">
                <X className="h-5 w-5" />
              </Button>
            </DrawerClose>
          </div>
        </DrawerHeader>

        <Tabs defaultValue="quick" className="flex-1 flex flex-col" dir="rtl">
          <div className="border-b bg-gray-50/50 px-6 pt-4">
            <TabsList className="grid w-full grid-cols-3 bg-white border">
              <TabsTrigger value="quick" className="data-[state=active]:bg-[#18325a] data-[state=active]:text-white">
                <Sparkles className="h-4 w-4 ml-2" />
                فلاتر سريعة
              </TabsTrigger>
              <TabsTrigger value="advanced" className="data-[state=active]:bg-[#18325a] data-[state=active]:text-white">
                <Filter className="h-4 w-4 ml-2" />
                فلاتر متقدمة
              </TabsTrigger>
              <TabsTrigger value="saved" className="data-[state=active]:bg-[#18325a] data-[state=active]:text-white">
                <Save className="h-4 w-4 ml-2" />
                محفوظة
              </TabsTrigger>
            </TabsList>
          </div>

          <ScrollArea className="flex-1 px-6">
            {/* Quick Filters Tab */}
            <TabsContent value="quick" className="space-y-6 py-6">
              {/* Search */}
              <motion.div 
                className="space-y-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Label className="flex items-center gap-2 text-base">
                  <Search className="h-5 w-5 text-[#18325a]" />
                  البحث السريع
                </Label>
                <Input
                  value={localFilters.searchText || ''}
                  onChange={(e) => setLocalFilters(prev => ({ ...prev, searchText: e.target.value }))}
                  placeholder="ابحث بالاسم، العنوان، أو أي كلمة مفتاحية..."
                  className="h-12 text-base border-2 focus:border-[#18325a]"
                />
              </motion.div>

              <Separator />

              {/* Quick Filter Buttons */}
              <div className="space-y-3">
                <Label className="text-base">فلاتر سريعة</Label>
                <div className="grid grid-cols-2 gap-3">
                  {quickFilters.map((filter, index) => {
                    const Icon = filter.icon;
                    const isActive = localFilters.quickFilter === filter.value;
                    return (
                      <motion.button
                        key={filter.value}
                        onClick={() => applyQuickFilter(filter.value)}
                        className={`p-4 rounded-xl border-2 transition-all text-right ${
                          isActive 
                            ? 'bg-[#18325a] text-white border-[#18325a] shadow-lg' 
                            : 'bg-white hover:bg-gray-50 border-gray-200 hover:border-[#18325a]/30'
                        }`}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className={`h-5 w-5 ${isActive ? 'text-white' : 'text-[#18325a]'}`} />
                          <span className="font-medium">{filter.label}</span>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              <Separator />

              {/* Status Quick Select */}
              <div className="space-y-3">
                <Label className="text-base flex items-center gap-2">
                  <Activity className="h-5 w-5 text-[#18325a]" />
                  الحالة
                </Label>
                <div className="grid grid-cols-2 gap-3">
                  {statusOptions.map((status, index) => (
                    <motion.button
                      key={status.value}
                      onClick={() => toggleStatus(status.value)}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        localFilters.status?.includes(status.value)
                          ? 'border-[#18325a] shadow-md scale-105'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ scale: 1.02 }}
                    >
                      <Badge className={`${status.color} border w-full justify-center py-2`}>
                        {status.label}
                      </Badge>
                    </motion.button>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Advanced Filters Tab */}
            <TabsContent value="advanced" className="space-y-6 py-6">
              {/* Date Range */}
              <motion.div 
                className="space-y-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Label className="flex items-center gap-2 text-base">
                  <Calendar className="h-5 w-5 text-[#18325a]" />
                  النطاق الزمني
                </Label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dateFrom" className="text-sm text-gray-600">من تاريخ</Label>
                    <Input
                      id="dateFrom"
                      type="date"
                      className="border-2 focus:border-[#18325a]"
                      value={localFilters.dateRange?.from || ''}
                      onChange={(e) => setLocalFilters(prev => ({
                        ...prev,
                        dateRange: { ...prev.dateRange, from: e.target.value, to: prev.dateRange?.to || '' }
                      }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dateTo" className="text-sm text-gray-600">إلى تاريخ</Label>
                    <Input
                      id="dateTo"
                      type="date"
                      className="border-2 focus:border-[#18325a]"
                      value={localFilters.dateRange?.to || ''}
                      onChange={(e) => setLocalFilters(prev => ({
                        ...prev,
                        dateRange: { ...prev.dateRange, to: e.target.value, from: prev.dateRange?.from || '' }
                      }))}
                    />
                  </div>
                </div>
              </motion.div>

              <Separator />

              {/* Categories (for surveys) */}
              {filterType === 'surveys' && (
                <>
                  <div className="space-y-3">
                    <Label className="flex items-center gap-2 text-base">
                      <Tag className="h-5 w-5 text-[#18325a]" />
                      التصنيفات
                    </Label>
                    <div className="grid grid-cols-2 gap-3">
                      {CATEGORIES.map((category, index) => (
                        <motion.button
                          key={category.value}
                          onClick={() => toggleCategory(category.value)}
                          className={`p-3 rounded-xl border-2 transition-all text-right ${
                            localFilters.categories?.includes(category.value)
                              ? 'bg-[#18325a]/5 border-[#18325a] shadow-sm'
                              : 'bg-white border-gray-200 hover:border-gray-300'
                          }`}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.05 }}
                          whileHover={{ scale: 1.02 }}
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-xl">{category.icon}</span>
                            <span className="text-sm font-medium">{category.label}</span>
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  <Separator />
                </>
              )}

              {/* Organizations */}
              {(filterType === 'surveys' || filterType === 'users') && (
                <>
                  <div className="space-y-3">
                    <Label className="flex items-center gap-2 text-base">
                      <Building className="h-5 w-5 text-[#18325a]" />
                      المنظمات
                    </Label>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {ORGANIZATIONS.map((org, index) => (
                        <motion.div
                          key={org}
                          className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                            localFilters.organizations?.includes(org)
                              ? 'bg-[#18325a]/5 border-[#18325a]'
                              : 'bg-white border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => toggleOrganization(org)}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          whileHover={{ scale: 1.01 }}
                        >
                          <Checkbox
                            id={`org-${org}`}
                            checked={localFilters.organizations?.includes(org) || false}
                            onCheckedChange={() => toggleOrganization(org)}
                          />
                          <Label htmlFor={`org-${org}`} className="cursor-pointer flex-1 text-sm">
                            {org}
                          </Label>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  <Separator />
                </>
              )}

              {/* Response Range (for surveys) */}
              {filterType === 'surveys' && (
                <>
                  <div className="space-y-3">
                    <Label className="flex items-center gap-2 text-base">
                      <Users className="h-5 w-5 text-[#18325a]" />
                      نطاق عدد الردود
                    </Label>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="minResponses" className="text-sm text-gray-600">الحد الأدنى</Label>
                        <Input
                          id="minResponses"
                          type="number"
                          placeholder="0"
                          className="border-2 focus:border-[#18325a]"
                          value={localFilters.responseRange?.min || ''}
                          onChange={(e) => setLocalFilters(prev => ({
                            ...prev,
                            responseRange: { 
                              ...prev.responseRange, 
                              min: parseInt(e.target.value) || 0,
                              max: prev.responseRange?.max || 1000
                            }
                          }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="maxResponses" className="text-sm text-gray-600">الحد الأقصى</Label>
                        <Input
                          id="maxResponses"
                          type="number"
                          placeholder="1000"
                          className="border-2 focus:border-[#18325a]"
                          value={localFilters.responseRange?.max || ''}
                          onChange={(e) => setLocalFilters(prev => ({
                            ...prev,
                            responseRange: { 
                              ...prev.responseRange, 
                              max: parseInt(e.target.value) || 1000,
                              min: prev.responseRange?.min || 0
                            }
                          }))}
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Completion Rate */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label className="flex items-center gap-2 text-base">
                        <TrendingUp className="h-5 w-5 text-[#18325a]" />
                        معدل الإكمال
                      </Label>
                      <Badge variant="secondary" className="bg-[#18325a]/10 text-[#18325a]">
                        {localFilters.completionRate?.min || 0}% - {localFilters.completionRate?.max || 100}%
                      </Badge>
                    </div>
                    <div className="px-2">
                      <Slider
                        value={[localFilters.completionRate?.min || 0, localFilters.completionRate?.max || 100]}
                        min={0}
                        max={100}
                        step={5}
                        className="w-full"
                        onValueChange={([min, max]) => setLocalFilters(prev => ({
                          ...prev,
                          completionRate: { min, max }
                        }))}
                      />
                    </div>
                  </div>

                  <Separator />
                </>
              )}

              {/* Sort Options */}
              <div className="space-y-3">
                <Label className="text-base">خيارات الترتيب</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="sortBy" className="text-sm text-gray-600">ترتيب حسب</Label>
                    <Select
                      value={localFilters.sortBy || 'date'}
                      onValueChange={(value) => setLocalFilters(prev => ({ ...prev, sortBy: value }))}
                    >
                      <SelectTrigger id="sortBy" className="border-2 focus:ring-[#18325a]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {sortOptions.map(option => {
                          const Icon = option.icon;
                          return (
                            <SelectItem key={option.value} value={option.value}>
                              <div className="flex items-center gap-2">
                                <Icon className="h-4 w-4" />
                                {option.label}
                              </div>
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sortOrder" className="text-sm text-gray-600">الاتجاه</Label>
                    <Select
                      value={localFilters.sortOrder || 'desc'}
                      onValueChange={(value: 'asc' | 'desc') => setLocalFilters(prev => ({ ...prev, sortOrder: value }))}
                    >
                      <SelectTrigger id="sortOrder" className="border-2 focus:ring-[#18325a]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="desc">تنازلي ↓</SelectItem>
                        <SelectItem value="asc">تصاعدي ↑</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Saved Filters Tab */}
            <TabsContent value="saved" className="space-y-6 py-6">
              <div className="text-center py-12">
                <Save className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد فلاتر محفوظة</h3>
                <p className="text-gray-500 mb-4">قم بإنشاء وحفظ الفلاتر المخصصة للوصول السريع</p>
                <Button 
                  onClick={handleSaveFilter}
                  disabled={activeFiltersCount === 0}
                  className="bg-[#18325a] hover:bg-[#2a4a7a]"
                >
                  <Save className="h-4 w-4 ml-2" />
                  حفظ الفلتر الحالي
                </Button>
              </div>
            </TabsContent>
          </ScrollArea>
        </Tabs>

        <DrawerFooter className="border-t bg-gray-50/50">
          <div className="flex gap-3 w-full">
            <Button 
              variant="outline" 
              onClick={handleReset} 
              className="flex-1 h-12 border-2 hover:bg-gray-100"
            >
              <RotateCcw className="h-4 w-4 ml-2" />
              إعادة تعيين
            </Button>
            <Button 
              onClick={handleApply} 
              className="flex-1 h-12 bg-gradient-to-r from-[#18325a] to-[#2a4a7a] hover:from-[#2a4a7a] hover:to-[#18325a] text-white shadow-lg"
            >
              <Filter className="h-4 w-4 ml-2" />
              تطبيق الفلاتر ({activeFiltersCount})
            </Button>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
