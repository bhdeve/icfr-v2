import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';
import { AdminPageLayout } from './shared/AdminPageLayout';
import { StatCardGrid } from './shared/StatCard';
import { TablePagination } from './shared/TablePagination';
import { OrganizationDrawer } from './shared/OrganizationDrawer';
import { usePagination } from '../hooks/usePagination';
import { 
  Search,
  Plus,
  Building,
  Users,
  Eye,
  Edit,
  Ban,
  Calendar,
  CheckCircle,
  XCircle,
  AlertCircle,
  FileText,
  Trash2,
  AlertTriangle
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface Organization {
  id: string;
  name: string;
  type: 'NGO' | 'CSR' | 'Gov';
  email: string;
  phone?: string;
  address?: string;
  description?: string;
  status: 'Active' | 'Suspended' | 'Pending';
  subscriptionPlan: 'Basic' | 'Professional' | 'Enterprise';
  startDate: string;
  totalSurveys: number;
  activeSurveys: number;
  totalBeneficiaries: number;
  contactPerson?: string;
  website?: string;
}

const demoOrganizations: Organization[] = [
  {
    id: '1',
    name: 'مؤسسة الخير الإنساني',
    type: 'NGO',
    email: 'contact@khair.org',
    phone: '+966501234567',
    address: 'الرياض، المملكة العربية السعودية',
    description: 'مؤسسة خيرية تهدف إلى تقديم المساعدة الإنسانية للمحتاجين',
    status: 'Active',
    subscriptionPlan: 'Professional',
    startDate: '2024-01-15',
    totalSurveys: 25,
    activeSurveys: 20,
    totalBeneficiaries: 1200,
    contactPerson: 'أحمد محمد الخير',
    website: 'https://khair.org'
  },
  {
    id: '2',
    name: 'شركة المسؤولية الاجتماعية',
    type: 'CSR',
    email: 'csr@company.com',
    phone: '+966507654321',
    address: 'جدة، المملكة العربية السعودية',
    description: 'شركة تركز على برامج المسؤولية الاجتماعية وخدمة المجتمع',
    status: 'Active',
    subscriptionPlan: 'Enterprise',
    startDate: '2023-11-20',
    totalSurveys: 40,
    activeSurveys: 35,
    totalBeneficiaries: 2500,
    contactPerson: 'فاطمة أحمد العلي',
    website: 'https://company.com'
  },
  {
    id: '3',
    name: 'وزارة التنمية الاجتماعية',
    type: 'Gov',
    email: 'social@gov.sa',
    phone: '+966112345678',
    address: 'الرياض، المملكة العربية السعودية',
    description: 'جهة حكومية تعنى بالتنمية الاجتماعية ورعاية المحتاجين',
    status: 'Active',
    subscriptionPlan: 'Enterprise',
    startDate: '2023-08-10',
    totalSurveys: 65,
    activeSurveys: 60,
    totalBeneficiaries: 5000,
    contactPerson: 'محمد عبدالله الأحمد',
    website: 'https://gov.sa'
  },
  {
    id: '4',
    name: 'جمعية الرعاية الصحية',
    type: 'NGO',
    email: 'health@care.org',
    phone: '+966509876543',
    address: 'الدمام، المملكة العربية السعودية',
    description: 'جمعية تركز على تقديم الرعاية الصحية للمحتاجين',
    status: 'Suspended',
    subscriptionPlan: 'Basic',
    startDate: '2024-02-28',
    totalSurveys: 8,
    activeSurveys: 5,
    totalBeneficiaries: 300,
    contactPerson: 'سارة خالد الحسن',
    website: 'https://healthcare.org'
  },
  {
    id: '5',
    name: 'مؤسسة التعليم للجميع',
    type: 'NGO',
    email: 'education@forall.org',
    phone: '+966505555555',
    address: 'المدينة المنورة، المملكة العربية السعودية',
    description: 'مؤسسة تهتم بتوفير التعليم المجاني للجميع',
    status: 'Pending',
    subscriptionPlan: 'Professional',
    startDate: '2024-03-05',
    totalSurveys: 0,
    activeSurveys: 0,
    totalBeneficiaries: 0,
    contactPerson: 'عبدالرحمن علي السالم',
    website: 'https://educationforall.org'
  }
];

export function OrganizationsPage() {
  const [organizations, setOrganizations] = useState<Organization[]>(demoOrganizations);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  
  // Drawer states
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<'create' | 'edit' | 'view'>('create');
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);

  const filteredOrganizations = organizations.filter(org => {
    const matchesSearch = org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         org.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || org.type === filterType;
    const matchesStatus = filterStatus === 'all' || org.status === filterStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  // Pagination
  const {
    currentPage,
    totalPages,
    itemsPerPage,
    paginatedData,
    handlePageChange,
    handleItemsPerPageChange,
    totalItems
  } = usePagination({
    data: filteredOrganizations,
    initialItemsPerPage: 10,
    initialPage: 1
  });

  const handleOpenDrawer = (mode: 'create' | 'edit' | 'view', org?: Organization) => {
    setDrawerMode(mode);
    setSelectedOrg(org || null);
    setIsDrawerOpen(true);
  };

  const handleSaveOrganization = (orgData: any) => {
    if (drawerMode === 'create') {
      const newOrg: Organization = {
        ...orgData,
        id: (organizations.length + 1).toString(),
        status: 'Pending',
        startDate: new Date().toISOString().split('T')[0],
        totalSurveys: 0,
        activeSurveys: 0,
        totalBeneficiaries: 0
      };
      setOrganizations([...organizations, newOrg]);
      toast.success('تم إضافة المنظمة بنجاح');
    } else if (drawerMode === 'edit') {
      setOrganizations(organizations.map(org =>
        org.id === orgData.id ? orgData : org
      ));
      toast.success('تم تحديث بيانات المنظمة بنجاح');
    }
  };

  const handleDeleteOrganization = (orgId: string) => {
    const orgToDelete = organizations.find(org => org.id === orgId);
    if (!orgToDelete) return;

    setOrganizations(organizations.filter(org => org.id !== orgId));
    toast.success(`تم حذف المنظمة "${orgToDelete.name}" بنجاح من النظام`);
  };

  const handleStatusChange = (orgId: string, newStatus: Organization['status']) => {
    setOrganizations(organizations.map(org => 
      org.id === orgId ? { ...org, status: newStatus } : org
    ));
    toast.success(`تم تحديث حالة المنظمة إلى ${newStatus === 'Active' ? 'نشطة' : newStatus === 'Suspended' ? 'معلقة' : 'في الانتظار'}`);
  };

  const getStatusIcon = (status: Organization['status']) => {
    switch (status) {
      case 'Active':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'Suspended':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'Pending':
        return <AlertCircle className="h-4 w-4 text-yellow-600" />;
    }
  };

  const getStatusBadge = (status: Organization['status']) => {
    const statusConfig = {
      Active: { label: 'نشطة', variant: 'default' as const },
      Suspended: { label: 'معلقة', variant: 'destructive' as const },
      Pending: { label: 'في الانتظار', variant: 'secondary' as const }
    };
    
    const config = statusConfig[status];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getTypeLabel = (type: Organization['type']) => {
    const typeLabels = {
      NGO: 'منظمة غير ربحية',
      CSR: 'مسؤولية اجتماعية',
      Gov: 'جهة حكومية'
    };
    return typeLabels[type];
  };

  const getPlanLabel = (plan: Organization['subscriptionPlan']) => {
    const planLabels = {
      Basic: 'أساسي',
      Professional: 'احترافي',
      Enterprise: 'مؤسسي'
    };
    return planLabels[plan];
  };

  const stats = [
    {
      title: 'إجمالي المنظمات',
      value: organizations.length.toString(),
      icon: Building,
      iconColor: 'text-[#183259]',
      iconBgColor: 'bg-blue-50'
    },
    {
      title: 'منظمات نشطة',
      value: organizations.filter(o => o.status === 'Active').length.toString(),
      icon: CheckCircle,
      iconColor: 'text-green-600',
      iconBgColor: 'bg-green-50'
    },
    {
      title: 'إجمالي الاستبيانات',
      value: organizations.reduce((sum, o) => sum + o.totalSurveys, 0).toString(),
      icon: FileText,
      iconColor: 'text-purple-600',
      iconBgColor: 'bg-purple-50'
    },
    {
      title: 'إجمالي المستفيدين',
      value: organizations.reduce((sum, o) => sum + o.totalBeneficiaries, 0).toLocaleString(),
      icon: Users,
      iconColor: 'text-orange-600',
      iconBgColor: 'bg-orange-50'
    }
  ];

  const filtersAndActions = (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <Search className="h-4 w-4 text-gray-500" />
          <Input
            placeholder="البحث في المنظمات..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-64"
          />
        </div>
        
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="نوع المنظمة" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">جميع الأنواع</SelectItem>
            <SelectItem value="NGO">منظمة غير ربحية</SelectItem>
            <SelectItem value="CSR">مسؤولية اجتماعية</SelectItem>
            <SelectItem value="Gov">جهة حكومية</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="الحالة" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">جميع الحالات</SelectItem>
            <SelectItem value="Active">نشطة</SelectItem>
            <SelectItem value="Suspended">معلقة</SelectItem>
            <SelectItem value="Pending">في الانتظار</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button 
        onClick={() => handleOpenDrawer('create')}
        className="bg-[#183259] hover:bg-[#2a4a7a]"
      >
        <Plus className="h-4 w-4 ml-2" />
        إضافة منظمة
      </Button>
    </div>
  );

  return (
    <AdminPageLayout
      title="إدارة المنظمات"
      description="إدارة شاملة لجميع المنظمات المسجلة في النظام"
      icon={Building}
    >
      <div className="space-y-6">
        {/* Statistics */}
        <StatCardGrid stats={stats} columns={4} />

        {filtersAndActions}

      {/* Organizations Table */}
      <Card>
        <CardHeader>
          <CardTitle>المنظمات المسجلة ({filteredOrganizations.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>اسم المنظمة</TableHead>
                <TableHead>النوع</TableHead>
                <TableHead>الحالة</TableHead>
                <TableHead>خطة الاشتراك</TableHead>
                <TableHead>تاريخ التسجيل</TableHead>
                <TableHead>الاستبيانات</TableHead>
                <TableHead>المستفيدون</TableHead>
                <TableHead>الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.map((org) => (
                <TableRow key={org.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{org.name}</div>
                      <div className="text-sm text-gray-500">{org.email}</div>
                    </div>
                  </TableCell>
                  <TableCell>{getTypeLabel(org.type)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(org.status)}
                      {getStatusBadge(org.status)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{getPlanLabel(org.subscriptionPlan)}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      {new Date(org.startDate).toLocaleDateString('ar-SA')}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-center">
                      <div className="font-medium">{org.activeSurveys}/{org.totalSurveys}</div>
                      <div className="text-xs text-gray-500">نشطة/إجمالي</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-center">
                      <div className="font-medium">{org.totalBeneficiaries.toLocaleString()}</div>
                      <div className="text-xs text-gray-500">مستفيد</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleOpenDrawer('view', org)}
                        title="عرض التفاصيل"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleOpenDrawer('edit', org)}
                        title="تعديل"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      {org.status === 'Active' ? (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleStatusChange(org.id, 'Suspended')}
                          title="إيقاف"
                        >
                          <Ban className="h-4 w-4 text-red-600" />
                        </Button>
                      ) : (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleStatusChange(org.id, 'Active')}
                          title="تفعيل"
                        >
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        </Button>
                      )}
                      {/* Delete Organization Button */}
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            title="حذف المنظمة"
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent dir="rtl">
                          <AlertDialogHeader>
                            <AlertDialogTitle className="flex items-center gap-2">
                              <AlertTriangle className="h-5 w-5 text-red-600" />
                              تأكيد حذف المنظمة
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              هل أنت متأكد من رغبتك في حذف المنظمة "{org.name}" من النظام؟
                              <br /><br />
                              <span className="text-red-600 font-medium">تحذير:</span> سيتم حذف جميع البيانات المرتبطة بهذه المنظمة بما في ذلك:
                              <ul className="list-disc list-inside mt-2 space-y-1">
                                <li>{org.totalSurveys} استبيان</li>
                                <li>{org.totalBeneficiaries.toLocaleString()} مستفيد</li>
                                <li>جميع النتائج والتحليلات المرتبطة</li>
                              </ul>
                              <br />
                              هذا الإجراء لا يمكن التراجع عنه.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>إلغاء</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => handleDeleteOrganization(org.id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              <Trash2 className="h-4 w-4 ml-2" />
                              حذف المنظمة
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Pagination */}
          {filteredOrganizations.length > 0 && totalPages > 1 && (
            <TablePagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalItems}
              itemsPerPage={itemsPerPage}
              onPageChange={handlePageChange}
              onItemsPerPageChange={handleItemsPerPageChange}
            />
          )}
        </CardContent>
      </Card>

      {/* Organization Drawer */}
      <OrganizationDrawer
        open={isDrawerOpen}
        onOpenChange={setIsDrawerOpen}
        organization={selectedOrg}
        onSave={handleSaveOrganization}
        mode={drawerMode}
      />
      </div>
    </AdminPageLayout>
  );
}
