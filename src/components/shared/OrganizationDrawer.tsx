import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter, DrawerClose } from '../ui/drawer';
import { Badge } from '../ui/badge';
import { ScrollArea } from '../ui/scroll-area';
import { Separator } from '../ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  X, 
  Save, 
  Building2, 
  Package,
  User,
  Key,
  MapPin,
  TrendingUp,
  Users,
  FileText,
  BarChart3,
  Calendar,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface Organization {
  id: string;
  name: string;
  type: 'company' | 'nonprofit' | 'government' | 'educational';
  manager: string[];
  username: string;
  password: string;
  region: string;
  userCount?: number;
  packageType: 'free' | 'basic' | 'professional' | 'custom';
  quota?: number;
  consumed?: number;
  remaining?: number;
  surveys?: number;
  activeSurveys?: number;
  completedSurveys?: number;
  joinDate: string;
  status: 'active' | 'inactive';
}

interface OrganizationDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  organization: Organization | null;
  mode: 'view' | 'add' | 'edit';
  onSave: (organization: Organization) => void;
}

export function OrganizationDrawer({ 
  open, 
  onOpenChange, 
  organization, 
  mode,
  onSave
}: OrganizationDrawerProps) {
  const [formData, setFormData] = useState<Partial<Organization>>({
    name: '',
    type: 'company',
    manager: [],
    username: '',
    password: '',
    region: '',
    userCount: 0,
    packageType: 'free',
    quota: 100,
    consumed: 0,
    remaining: 100,
    status: 'active'
  });

  const [managerInput, setManagerInput] = useState('');
  const isViewMode = mode === 'view';

  // Update form data when organization changes
  useEffect(() => {
    if (organization && (mode === 'view' || mode === 'edit')) {
      setFormData(organization);
    } else if (mode === 'add') {
      setFormData({
        name: '',
        type: 'company',
        manager: [],
        username: '',
        password: '',
        region: '',
        userCount: 0,
        packageType: 'free',
        quota: 100,
        consumed: 0,
        remaining: 100,
        status: 'active'
      });
      setManagerInput('');
    }
  }, [organization, mode, open]);

  const handleSave = () => {
    // Validation
    if (!formData.name || !formData.username || !formData.password || !formData.region) {
      toast.error('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    if (!formData.manager || formData.manager.length === 0) {
      toast.error('يرجى إضافة مدير واحد على الأقل');
      return;
    }

    const organizationData: Organization = {
      id: organization?.id || `org-${Date.now()}`,
      name: formData.name!,
      type: formData.type || 'company',
      manager: formData.manager || [],
      username: formData.username!,
      password: formData.password!,
      region: formData.region!,
      userCount: formData.userCount || 0,
      packageType: formData.packageType || 'free',
      quota: formData.quota || 100,
      consumed: organization?.consumed || 0,
      remaining: formData.quota || 100,
      surveys: organization?.surveys || 0,
      activeSurveys: organization?.activeSurveys || 0,
      completedSurveys: organization?.completedSurveys || 0,
      joinDate: organization?.joinDate || new Date().toISOString().split('T')[0],
      status: formData.status || 'active'
    };

    onSave(organizationData);
  };

  const addManager = () => {
    if (managerInput.trim() && formData.manager) {
      setFormData(prev => ({
        ...prev,
        manager: [...(prev.manager || []), managerInput.trim()]
      }));
      setManagerInput('');
    }
  };

  const removeManager = (index: number) => {
    setFormData(prev => ({
      ...prev,
      manager: prev.manager?.filter((_, i) => i !== index) || []
    }));
  };

  const getTypeLabel = (type: string) => {
    const types = {
      company: 'شركة',
      nonprofit: 'مؤسسة غير ربحية',
      government: 'جهة حكومية',
      educational: 'مؤسسة تعليمية'
    };
    return types[type as keyof typeof types] || type;
  };

  const getPackageLabel = (pkg: string) => {
    const packages = {
      free: 'مجاني',
      basic: 'أساسي',
      professional: 'احترافي',
      custom: 'مخصص'
    };
    return packages[pkg as keyof typeof packages] || pkg;
  };

  const getPackageBadgeColor = (pkg: string) => {
    const colors = {
      free: 'bg-gray-100 text-gray-800',
      basic: 'bg-blue-100 text-blue-800',
      professional: 'bg-purple-100 text-purple-800',
      custom: 'bg-amber-100 text-amber-800'
    };
    return colors[pkg as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getUsagePercentage = () => {
    const quota = organization?.quota || formData.quota || 0;
    const consumed = organization?.consumed || formData.consumed || 0;
    if (!quota) return 0;
    return Math.round((consumed / quota) * 100);
  };

  if (!open) return null;

  return (
    <Drawer open={open} onOpenChange={onOpenChange} direction="left">
      <DrawerContent className="h-full w-full sm:max-w-3xl" dir="rtl">
        <DrawerHeader className="border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-[#18325A] to-[#2a4a7a] flex items-center justify-center">
                <Building2 className="h-6 w-6 text-white" />
              </div>
              <div>
                <DrawerTitle className="text-xl">
                  {mode === 'add' && 'إضافة منظمة جديدة'}
                  {mode === 'edit' && 'تعديل المنظمة'}
                  {mode === 'view' && formData.name}
                </DrawerTitle>
                <DrawerDescription>
                  {mode === 'view' && formData.status === 'active' ? (
                    <span className="inline-flex items-center gap-2 mt-1">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <Badge className="bg-green-100 text-green-800">نشط</Badge>
                    </span>
                  ) : mode === 'view' ? (
                    <span className="inline-flex items-center gap-2 mt-1">
                      <AlertCircle className="h-4 w-4 text-gray-600" />
                      <Badge className="bg-gray-100 text-gray-800">معطل</Badge>
                    </span>
                  ) : (
                    mode === 'add' ? 'أدخل بيانات المنظمة الجديدة' : 'قم بتعديل بيانات المنظمة'
                  )}
                </DrawerDescription>
              </div>
            </div>
            <DrawerClose asChild>
              <Button variant="ghost" size="icon">
                <X className="h-4 w-4" />
              </Button>
            </DrawerClose>
          </div>
        </DrawerHeader>

        <Tabs defaultValue="info" className="flex-1" dir="rtl">
          <div className="border-b px-6">
            <TabsList className="w-full justify-start">
              <TabsTrigger value="info" className="gap-2">
                <Building2 className="h-4 w-4" />
                المعلومات الأساسية
              </TabsTrigger>
              {isViewMode && organization && (
                <TabsTrigger value="stats" className="gap-2">
                  <BarChart3 className="h-4 w-4" />
                  الإحصائيات
                </TabsTrigger>
              )}
            </TabsList>
          </div>

          <ScrollArea className="flex-1 h-[calc(100vh-220px)]">
            <div className="p-6">
              <TabsContent value="info" className="space-y-6 mt-0">
                {/* Organization Info Alert for View Mode */}
                {isViewMode && organization && (
                  <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <AlertCircle className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                    <div className="text-sm text-blue-900">
                      <p className="font-medium mb-1">معلومات المنظمة</p>
                      <p className="text-blue-700">
                        مسجلة منذ {new Date(organization.joinDate).toLocaleDateString('ar-SA')}
                      </p>
                      <p className="text-blue-700">
                        نوع المنظمة: {getTypeLabel(organization.type)}
                      </p>
                    </div>
                  </div>
                )}

                {/* Name */}
                <div className="space-y-2">
                  <Label htmlFor="name">اسم المنظمة *</Label>
                  <div className="relative">
                    <Building2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="name"
                      value={formData.name || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="مؤسسة التنمية الاجتماعية"
                      className="pr-10"
                      disabled={isViewMode}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Type */}
                  <div className="space-y-2">
                    <Label htmlFor="type">نوع المنظمة *</Label>
                    <Select
                      value={formData.type}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, type: value as Organization['type'] }))}
                      disabled={isViewMode}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="company">شركة</SelectItem>
                        <SelectItem value="nonprofit">مؤسسة غير ربحية</SelectItem>
                        <SelectItem value="government">جهة حكومية</SelectItem>
                        <SelectItem value="educational">مؤسسة تعليمية</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Package */}
                  <div className="space-y-2">
                    <Label htmlFor="package">خطة الاشتراك *</Label>
                    <Select
                      value={formData.packageType}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, packageType: value as Organization['packageType'] }))}
                      disabled={isViewMode}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="free">مجاني</SelectItem>
                        <SelectItem value="basic">أساسي</SelectItem>
                        <SelectItem value="professional">احترافي</SelectItem>
                        <SelectItem value="custom">مخصص</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Managers */}
                <div className="space-y-2">
                  <Label>مديرو المنظمة *</Label>
                  {!isViewMode && (
                    <div className="flex gap-2">
                      <Input
                        value={managerInput}
                        onChange={(e) => setManagerInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && addManager()}
                        placeholder="أدخل اسم المدير واضغط Enter"
                        className="flex-1"
                      />
                      <Button type="button" onClick={addManager} variant="outline">
                        إضافة
                      </Button>
                    </div>
                  )}
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.manager?.map((manager, index) => (
                      <Badge key={index} variant="secondary" className="gap-2">
                        <User className="h-3 w-3" />
                        {manager}
                        {!isViewMode && (
                          <button
                            type="button"
                            onClick={() => removeManager(index)}
                            className="ml-1 hover:text-red-600"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        )}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-4">
                  {/* Username */}
                  <div className="space-y-2">
                    <Label htmlFor="username">اسم المستخدم *</Label>
                    <div className="relative">
                      <User className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="username"
                        value={formData.username || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                        placeholder="social_dev_org"
                        className="pr-10"
                        disabled={isViewMode}
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div className="space-y-2">
                    <Label htmlFor="password">كلمة المرور *</Label>
                    <div className="relative">
                      <Key className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="password"
                        type={isViewMode ? "password" : "text"}
                        value={formData.password || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                        placeholder="••••••••"
                        className="pr-10"
                        disabled={isViewMode}
                      />
                    </div>
                  </div>
                </div>

                {/* Region */}
                <div className="space-y-2">
                  <Label htmlFor="region">المنطقة *</Label>
                  <div className="relative">
                    <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="region"
                      value={formData.region || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, region: e.target.value }))}
                      placeholder="الرياض"
                      className="pr-10"
                      disabled={isViewMode}
                    />
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-4">
                  {/* Quota */}
                  <div className="space-y-2">
                    <Label htmlFor="quota">الحصة الشهرية</Label>
                    <div className="relative">
                      <Package className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="quota"
                        type="number"
                        value={formData.quota || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, quota: Number(e.target.value) }))}
                        placeholder="1000"
                        className="pr-10"
                        disabled={isViewMode}
                      />
                    </div>
                  </div>

                  {/* User Count */}
                  <div className="space-y-2">
                    <Label htmlFor="userCount">عدد المستخدمين</Label>
                    <div className="relative">
                      <Users className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="userCount"
                        type="number"
                        value={formData.userCount || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, userCount: Number(e.target.value) }))}
                        placeholder="15"
                        className="pr-10"
                        disabled={isViewMode}
                      />
                    </div>
                  </div>
                </div>

                {/* Status - Only for edit mode */}
                {mode === 'edit' && (
                  <>
                    <Separator />
                    <div className="space-y-2">
                      <Label htmlFor="status">حالة المنظمة</Label>
                      <Select
                        value={formData.status}
                        onValueChange={(value) => setFormData(prev => ({ ...prev, status: value as Organization['status'] }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">نشط</SelectItem>
                          <SelectItem value="inactive">معطل</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}
              </TabsContent>

              {/* Statistics Tab - View Mode Only */}
              {isViewMode && organization && (
                <TabsContent value="stats" className="space-y-6 mt-0">
                  <div className="grid grid-cols-2 gap-4">
                    {/* Surveys Stats */}
                    <div className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="h-10 w-10 rounded-lg bg-purple-600 flex items-center justify-center">
                          <FileText className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <p className="text-sm text-purple-700">إجمالي الاستطلاعات</p>
                          <p className="text-2xl font-bold text-purple-900">{organization.surveys || 0}</p>
                        </div>
                      </div>
                      <div className="text-xs text-purple-600">
                        {organization.activeSurveys || 0} نشط | {organization.completedSurveys || 0} مكتمل
                      </div>
                    </div>

                    {/* Users Stats */}
                    <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="h-10 w-10 rounded-lg bg-blue-600 flex items-center justify-center">
                          <Users className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <p className="text-sm text-blue-700">عدد المستخدمين</p>
                          <p className="text-2xl font-bold text-blue-900">{organization.userCount || 0}</p>
                        </div>
                      </div>
                      <div className="text-xs text-blue-600">
                        مستخدم نشط
                      </div>
                    </div>
                  </div>

                  {/* Usage Stats */}
                  <div className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl border border-orange-200">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-orange-600 flex items-center justify-center">
                          <TrendingUp className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <p className="text-sm text-orange-700">الاستخدام الشهري</p>
                          <p className="text-2xl font-bold text-orange-900">{getUsagePercentage()}%</p>
                        </div>
                      </div>
                      <Badge className={getPackageBadgeColor(organization.packageType)}>
                        {getPackageLabel(organization.packageType)}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm text-orange-700">
                        <span>مستهلك: {(organization.consumed || 0).toLocaleString()}</span>
                        <span>متبقي: {(organization.remaining || 0).toLocaleString()}</span>
                      </div>
                      <div className="w-full bg-orange-200 rounded-full h-2">
                        <div 
                          className="h-2 rounded-full bg-orange-600"
                          style={{ width: `${getUsagePercentage()}%` }}
                        />
                      </div>
                      <div className="text-xs text-orange-600">
                        من أصل {(organization.quota || 0).toLocaleString()} حصة
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Organization Details */}
                  <div className="space-y-4">
                    <h3 className="font-medium flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      تفاصيل إضافية
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 border rounded-lg">
                        <Label className="text-sm text-muted-foreground">تاريخ الانضمام</Label>
                        <p className="text-sm font-medium mt-1">
                          {new Date(organization.joinDate).toLocaleDateString('ar-SA')}
                        </p>
                      </div>
                      <div className="p-4 border rounded-lg">
                        <Label className="text-sm text-muted-foreground">المنطقة</Label>
                        <p className="text-sm font-medium mt-1">{organization.region}</p>
                      </div>
                      <div className="p-4 border rounded-lg">
                        <Label className="text-sm text-muted-foreground">اسم المستخدم</Label>
                        <p className="text-sm font-medium mt-1">{organization.username}</p>
                      </div>
                      <div className="p-4 border rounded-lg">
                        <Label className="text-sm text-muted-foreground">نوع المنظمة</Label>
                        <p className="text-sm font-medium mt-1">{getTypeLabel(organization.type)}</p>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              )}
            </div>
          </ScrollArea>
        </Tabs>

        {!isViewMode && (
          <DrawerFooter className="border-t">
            <div className="flex gap-3 w-full">
              <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
                إلغاء
              </Button>
              <Button onClick={handleSave} className="flex-1 bg-[#18325A] hover:bg-[#2a4a7a]">
                <Save className="h-4 w-4 ml-2" />
                {mode === 'add' ? 'إضافة المنظمة' : 'حفظ التعديلات'}
              </Button>
            </div>
          </DrawerFooter>
        )}

        {isViewMode && (
          <DrawerFooter className="border-t">
            <Button variant="outline" onClick={() => onOpenChange(false)} className="w-full">
              إغلاق
            </Button>
          </DrawerFooter>
        )}
      </DrawerContent>
    </Drawer>
  );
}
