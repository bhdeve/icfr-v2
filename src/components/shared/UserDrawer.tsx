import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter, DrawerClose } from '../ui/drawer';
import { Badge } from '../ui/badge';
import { Checkbox } from '../ui/checkbox';
import { ScrollArea } from '../ui/scroll-area';
import { Separator } from '../ui/separator';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  X, 
  Save, 
  User, 
  Mail, 
  Phone, 
  Building, 
  Shield,
  Key,
  Eye,
  EyeOff,
  AlertCircle
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface UserDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user?: any | null;
  onSave: (user: any) => void;
  userRole: 'super_admin' | 'admin' | 'org_manager';
  mode?: 'create' | 'edit' | 'view';
}

const ROLES = [
  { value: 'super_admin', label: 'مدير النظام', color: 'bg-red-100 text-red-800' },
  { value: 'admin', label: 'مدير المنصة', color: 'bg-purple-100 text-purple-800' },
  { value: 'org_manager', label: 'مدير منظمة', color: 'bg-blue-100 text-blue-800' },
  { value: 'beneficiary', label: 'مستفيد', color: 'bg-green-100 text-green-800' }
];

const PERMISSIONS = {
  surveys: {
    label: 'الاستبيانات',
    items: ['create', 'read', 'update', 'delete', 'share', 'export']
  },
  users: {
    label: 'المستخدمين',
    items: ['create', 'read', 'update', 'delete', 'permissions']
  },
  organizations: {
    label: 'المنظمات',
    items: ['create', 'read', 'update', 'delete', 'manage']
  },
  reports: {
    label: 'التقارير',
    items: ['view', 'export', 'create', 'delete']
  },
  settings: {
    label: 'الإعدادات',
    items: ['view', 'update', 'system', 'billing']
  }
};

const PERMISSION_LABELS: Record<string, string> = {
  create: 'إنشاء',
  read: 'قراءة',
  update: 'تعديل',
  delete: 'حذف',
  share: 'مشاركة',
  export: 'تصدير',
  permissions: 'إدارة الصلاحيات',
  manage: 'إدارة',
  view: 'عرض',
  system: 'إعدادات النظام',
  billing: 'الفواتير'
};

export function UserDrawer({ open, onOpenChange, user, onSave, userRole, mode = 'create' }: UserDrawerProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    username: user?.username || '',
    password: user?.password || '',
    role: user?.role || 'beneficiary',
    organization: user?.organization || '',
    status: user?.status || 'active',
    permissions: user?.permissions || {}
  });

  const isViewMode = mode === 'view';
  const canEditRole = userRole === 'super_admin' || (userRole === 'admin' && formData.role !== 'super_admin');

  const handleSave = () => {
    // Validation
    if (!formData.name || !formData.email) {
      toast.error('يرجى إدخال الاسم والبريد الإلكتروني');
      return;
    }

    if (mode === 'create' && !formData.password) {
      toast.error('يرجى إدخال كلمة المرور');
      return;
    }

    const userData = {
      id: user?.id || `user-${Date.now()}`,
      ...formData,
      createdAt: user?.createdAt || new Date().toISOString(),
      lastLogin: user?.lastLogin
    };

    onSave(userData);
    onOpenChange(false);
    toast.success(mode === 'create' ? 'تم إضافة المستخدم بنجاح' : 'تم تحديث المستخدم بنجاح');
  };

  const getRoleLabel = (roleValue: string) => {
    return ROLES.find(r => r.value === roleValue)?.label || roleValue;
  };

  const getRoleColor = (roleValue: string) => {
    return ROLES.find(r => r.value === roleValue)?.color || 'bg-gray-100 text-gray-800';
  };

  const togglePermission = (category: string, permission: string) => {
    setFormData(prev => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [category]: {
          ...prev.permissions[category],
          [permission]: !prev.permissions[category]?.[permission]
        }
      }
    }));
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange} direction="left">
      <DrawerContent className="h-full w-full sm:max-w-2xl" dir="rtl">
        <DrawerHeader className="border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="h-12 w-12">
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {formData.name ? formData.name.charAt(0) : <User className="h-6 w-6" />}
                </AvatarFallback>
              </Avatar>
              <div>
                <DrawerTitle className="text-xl">
                  {mode === 'create' && 'إضافة مستخدم جديد'}
                  {mode === 'edit' && 'تعديل المستخدم'}
                  {mode === 'view' && formData.name}
                </DrawerTitle>
                <DrawerDescription>
                  {mode === 'view' && (
                    <Badge className={getRoleColor(formData.role)}>
                      {getRoleLabel(formData.role)}
                    </Badge>
                  )}
                  {mode !== 'view' && 'أدخل معلومات المستخدم'}
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
                <User className="h-4 w-4" />
                المعلومات الأساسية
              </TabsTrigger>
              {!isViewMode && canEditRole && (
                <TabsTrigger value="permissions" className="gap-2">
                  <Shield className="h-4 w-4" />
                  الصلاحيات
                </TabsTrigger>
              )}
            </TabsList>
          </div>

          <ScrollArea className="flex-1">
            <div className="p-6">
              <TabsContent value="info" className="space-y-6 mt-0">
                {/* User Info Alert for View Mode */}
                {isViewMode && (
                  <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <AlertCircle className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                    <div className="text-sm text-blue-900">
                      <p className="font-medium mb-1">معلومات المستخدم</p>
                      <p className="text-blue-700">
                        عضو منذ {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('ar-SA') : 'غير محدد'}
                      </p>
                      {user?.lastLogin && (
                        <p className="text-blue-700">
                          آخر تسجيل دخول: {new Date(user.lastLogin).toLocaleString('ar-SA')}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Name */}
                <div className="space-y-2">
                  <Label htmlFor="name">الاسم الكامل *</Label>
                  <div className="relative">
                    <User className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="محمد أحمد الشريف"
                      className="pr-10"
                      disabled={isViewMode}
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email">البريد الإلكتروني *</Label>
                  <div className="relative">
                    <Mail className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="user@example.com"
                      className="pr-10"
                      disabled={isViewMode}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Phone */}
                  <div className="space-y-2">
                    <Label htmlFor="phone">رقم الهاتف</Label>
                    <div className="relative">
                      <Phone className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                        placeholder="+966501234567"
                        className="pr-10"
                        disabled={isViewMode}
                      />
                    </div>
                  </div>

                  {/* Username */}
                  <div className="space-y-2">
                    <Label htmlFor="username">اسم المستخدم</Label>
                    <Input
                      id="username"
                      value={formData.username}
                      onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                      placeholder="mohammed_ahmed"
                      disabled={isViewMode}
                    />
                  </div>
                </div>

                {/* Password */}
                {!isViewMode && (
                  <div className="space-y-2">
                    <Label htmlFor="password">
                      كلمة المرور {mode === 'create' && '*'}
                    </Label>
                    <div className="relative">
                      <Key className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        value={formData.password}
                        onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                        placeholder={mode === 'edit' ? 'اتركه فارغاً للاحتفاظ بالقديم' : '••••••••'}
                        className="pr-10 pl-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                )}

                <Separator />

                <div className="grid grid-cols-2 gap-4">
                  {/* Role */}
                  <div className="space-y-2">
                    <Label htmlFor="role">الدور الوظيفي</Label>
                    <Select
                      value={formData.role}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, role: value }))}
                      disabled={isViewMode || !canEditRole}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {ROLES.map(role => (
                          <SelectItem 
                            key={role.value} 
                            value={role.value}
                            disabled={userRole === 'admin' && role.value === 'super_admin'}
                          >
                            <div className="flex items-center gap-2">
                              <Badge className={role.color}>{role.label}</Badge>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Status */}
                  <div className="space-y-2">
                    <Label htmlFor="status">الحالة</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
                      disabled={isViewMode}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">
                          <Badge className="bg-green-100 text-green-800">نشط</Badge>
                        </SelectItem>
                        <SelectItem value="inactive">
                          <Badge className="bg-gray-100 text-gray-800">غير نشط</Badge>
                        </SelectItem>
                        <SelectItem value="pending">
                          <Badge className="bg-yellow-100 text-yellow-800">معلق</Badge>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Organization */}
                {(formData.role === 'org_manager' || formData.role === 'beneficiary') && (
                  <div className="space-y-2">
                    <Label htmlFor="organization">المنظمة</Label>
                    <div className="relative">
                      <Building className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="organization"
                        value={formData.organization}
                        onChange={(e) => setFormData(prev => ({ ...prev, organization: e.target.value }))}
                        placeholder="اسم المنظمة"
                        className="pr-10"
                        disabled={isViewMode}
                      />
                    </div>
                  </div>
                )}
              </TabsContent>

              {/* Permissions Tab */}
              {!isViewMode && canEditRole && (
                <TabsContent value="permissions" className="space-y-6 mt-0">
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-start gap-3">
                      <Shield className="h-5 w-5 text-yellow-600 shrink-0 mt-0.5" />
                      <div className="text-sm text-yellow-900">
                        <p className="font-medium mb-1">إدارة الصلاحيات</p>
                        <p>حدد الصلاحيات التي يمكن للمستخدم الوصول إليها</p>
                      </div>
                    </div>
                  </div>

                  {Object.entries(PERMISSIONS).map(([category, data]) => (
                    <div key={category} className="space-y-3">
                      <h3 className="font-medium flex items-center gap-2">
                        <Shield className="h-4 w-4" />
                        {data.label}
                      </h3>
                      <div className="grid grid-cols-2 gap-3">
                        {data.items.map(permission => (
                          <div
                            key={permission}
                            className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                          >
                            <Checkbox
                              id={`${category}-${permission}`}
                              checked={formData.permissions[category]?.[permission] || false}
                              onCheckedChange={() => togglePermission(category, permission)}
                            />
                            <Label
                              htmlFor={`${category}-${permission}`}
                              className="cursor-pointer flex-1"
                            >
                              {PERMISSION_LABELS[permission]}
                            </Label>
                          </div>
                        ))}
                      </div>
                      <Separator />
                    </div>
                  ))}
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
              <Button onClick={handleSave} className="flex-1">
                <Save className="h-4 w-4 ml-2" />
                {mode === 'create' ? 'إضافة المستخدم' : 'حفظ التعديلات'}
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
