import React, { useState, useEffect } from 'react';



import { Button } from './ui/button';



import { Card, CardContent } from './ui/card';



import { Input } from './ui/input';



import { Badge } from './ui/badge';



import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';



import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';



import {



  DropdownMenu,



  DropdownMenuContent,



  DropdownMenuItem,



  DropdownMenuTrigger,



} from './ui/dropdown-menu';



import { AdminPageLayout } from './shared/AdminPageLayout';



import { TablePagination } from './shared/TablePagination';



import { usePagination } from '../hooks/usePagination';



import { OrganizationDrawer } from './shared/OrganizationDrawer';



import { 



  Building,



  Building2, 



  Search, 



  Users,



  FileText,



  TrendingUp,



  Plus,



  Eye,



  Edit,



  Trash2,



  MoreVertical,



  BarChart3



} from 'lucide-react';



import { toast } from 'sonner@2.0.3';



import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog';







interface Organization {



  id: string;



  name: string;



  type: 'company' | 'nonprofit' | 'government' | 'educational';



  manager: string[];



  username: string;



  password: string;



  region: string;



  userCount: number;



  packageType: 'free' | 'basic' | 'professional' | 'custom';



  quota: number;



  consumed: number;



  remaining: number;



  surveys: number;



  activeSurveys: number;



  completedSurveys: number;



  joinDate: string;



  status: 'active' | 'inactive';



}







// Mock organizations data



const mockOrganizations: Organization[] = [



  {



    id: '1',



    name: 'مؤسسة التنمية الاجتماعية',



    type: 'nonprofit',



    manager: ['أحمد محمد الشريف', 'سارة علي الزهراني'],



    username: 'social_dev_org',



    password: 'SecurePass123',



    region: 'الرياض',



    userCount: 15,



    packageType: 'professional',



    quota: 1000,



    consumed: 780,



    remaining: 220,



    surveys: 25,



    activeSurveys: 8,



    completedSurveys: 17,



    joinDate: '2024-01-15',



    status: 'active'



  },



  {



    id: '2',



    name: 'شركة الابتكار التقني',



    type: 'company',



    manager: ['فاطمة سالم القحطاني'],



    username: 'tech_innovation',



    password: 'TechPass@2024',



    region: 'جدة',



    userCount: 32,



    packageType: 'custom',



    quota: 2500,



    consumed: 1850,



    remaining: 650,



    surveys: 45,



    activeSurveys: 12,



    completedSurveys: 33,



    joinDate: '2024-02-20',



    status: 'active'



  },



  {



    id: '3',



    name: 'الهيئة الحكومية للتطوير',



    type: 'government',



    manager: ['خالد عبدالله المطيري'],



    username: 'gov_dev_agency',



    password: 'GovPass@456',



    region: 'الدمام',



    userCount: 28,



    packageType: 'custom',



    quota: 3000,



    consumed: 2100,



    remaining: 900,



    surveys: 38,



    activeSurveys: 15,



    completedSurveys: 23,



    joinDate: '2024-03-10',



    status: 'active'



  },



  {



    id: '4',



    name: 'جامعة المعرفة',



    type: 'educational',



    manager: ['نورة حسن الغامدي', 'محمد أحمد العمري'],



    username: 'knowledge_university',



    password: 'EduPass789',



    region: 'مكة المكرمة',



    userCount: 42,



    packageType: 'professional',



    quota: 1500,



    consumed: 890,



    remaining: 610,



    surveys: 52,



    activeSurveys: 20,



    completedSurveys: 32,



    joinDate: '2024-01-28',



    status: 'active'



  },



  {



    id: '5',



    name: 'مؤسسة الخير الإنساني',



    type: 'nonprofit',



    manager: ['عبدالرحمن سعيد النجار'],



    username: 'charity_foundation',



    password: 'CharityPass321',



    region: 'المدينة المنورة',



    userCount: 12,



    packageType: 'basic',



    quota: 500,



    consumed: 420,



    remaining: 80,



    surveys: 18,



    activeSurveys: 6,



    completedSurveys: 12,



    joinDate: '2024-04-05',



    status: 'active'



  }



];







export function OrganizationsManagementPage() {



  const [organizations, setOrganizations] = useState<Organization[]>([]);
  useEffect(() => {
    const loadOrganizations = async () => {
      try {
        const response = await organizationsService.list({ page: 1, limit: 50 });
        if (response.success && response.data) {
          setOrganizations(response.data.items as any || []);
        } else {
          setOrganizations(mockOrganizations);
        }
      } catch (error) {
        console.error("Failed to load organizations:", error);
        setOrganizations(mockOrganizations);
      }
    };
    loadOrganizations();
  }, []);




  const [searchTerm, setSearchTerm] = useState('');



  const [statusFilter, setStatusFilter] = useState('all');



  const [packageFilter, setPackageFilter] = useState('all');



  const [showDeleteDialog, setShowDeleteDialog] = useState(false);



  const [selectedOrganization, setSelectedOrganization] = useState<Organization | null>(null);



  



  // Drawer states



  const [drawerOpen, setDrawerOpen] = useState(false);



  const [drawerMode, setDrawerMode] = useState<'view' | 'add' | 'edit'>('view');







  // Filter organizations



  const filteredOrganizations = organizations.filter(org => {



    const matchesSearch = org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||



                         org.manager.some(m => m.toLowerCase().includes(searchTerm.toLowerCase()));



    const matchesStatus = statusFilter === 'all' || org.status === statusFilter;



    const matchesPackage = packageFilter === 'all' || org.packageType === packageFilter;



    return matchesSearch && matchesStatus && matchesPackage;



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







  const getTypeDisplayName = (type: string) => {



    switch (type) {



      case 'company': return 'شركة';



      case 'nonprofit': return 'مؤسسة غير ربحية';



      case 'government': return 'جهة حكومية';



      case 'educational': return 'مؤسسة تعليمية';



      default: return type;



    }



  };







  const getPackageDisplayName = (packageType: string) => {



    switch (packageType) {



      case 'free': return 'مجاني';



      case 'basic': return 'أساسي';



      case 'professional': return 'احترافي';



      case 'custom': return 'مخصص';



      default: return packageType;



    }



  };







  const getPackageBadgeColor = (packageType: string) => {



    switch (packageType) {



      case 'free': return 'bg-gray-100 text-gray-800';



      case 'basic': return 'bg-blue-100 text-blue-800';



      case 'professional': return 'bg-purple-100 text-purple-800';



      case 'custom': return 'bg-amber-100 text-amber-800';



      default: return 'bg-gray-100 text-gray-800';



    }



  };







  const getStatusBadge = (status: string) => {



    return status === 'active' ? (



      <Badge className="bg-green-100 text-green-800">نشط</Badge>



    ) : (



      <Badge className="bg-gray-100 text-gray-800">معطل</Badge>



    );



  };







  const getUsagePercentage = (consumed: number, quota: number) => {



    return Math.round((consumed / quota) * 100);



  };







  const getUsageColor = (percentage: number) => {



    if (percentage >= 90) return 'text-red-600';



    if (percentage >= 70) return 'text-orange-600';



    return 'text-green-600';



  };







  // Drawer handlers



  const openAddDrawer = () => {



    setSelectedOrganization(null);



    setDrawerMode('add');



    setDrawerOpen(true);



  };







  const openViewDrawer = (org: Organization) => {



    setSelectedOrganization(org);



    setDrawerMode('view');



    setDrawerOpen(true);



  };







  const openEditDrawer = (org: Organization) => {



    setSelectedOrganization(org);



    setDrawerMode('edit');



    setDrawerOpen(true);



  };







  const openDeleteDialog = (org: Organization) => {



    setSelectedOrganization(org);



    setShowDeleteDialog(true);



  };







  const handleSaveOrganization = (org: Organization) => {



    if (drawerMode === 'add') {



      setOrganizations(prev => [org, ...prev]);



      toast.success('تم إضافة المنظمة بنجاح');



    } else if (drawerMode === 'edit') {



      setOrganizations(prev => 



        prev.map(o => o.id === org.id ? org : o)



      );



      toast.success('تم تحديث المنظمة بنجاح');



    }



    setDrawerOpen(false);



  };







  const handleDeleteOrganization = () => {



    if (!selectedOrganization) return;







    setOrganizations(prev => prev.filter(org => org.id !== selectedOrganization.id));



    setShowDeleteDialog(false);



    setSelectedOrganization(null);



    toast.success('تم حذف المنظمة بنجاح');



  };







  return (



    <AdminPageLayout



      title="إدارة المنظمات"



      description="إدارة وتتبع المنظمات المشتركة في المنصة"



      icon={Building}



    >



      {/* شريط الأدوات العلوي */}



      <div className="mb-6 space-y-4">



        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">



          <Button 



            onClick={openAddDrawer} 



            className="bg-[#18325A] hover:bg-[#2a4a7a] text-white transition-all duration-200 hover:shadow-lg hover:scale-105"



          >



            <Plus className="h-4 w-4 ml-2" />



            إضافة منظمة



          </Button>







          <div className="flex items-center gap-3 w-full sm:w-auto">



            {/* البحث */}



            <div className="relative flex-1 sm:w-80">



              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />



              <Input



                placeholder="البحث عن منظمة..."



                value={searchTerm}



                onChange={(e) => setSearchTerm(e.target.value)}



                className="pr-10 transition-all duration-200 focus:ring-2 focus:ring-[#18325A]/20"



              />



            </div>







            {/* الفلاتر */}



            <Select value={statusFilter} onValueChange={setStatusFilter}>



              <SelectTrigger className="w-32 transition-all duration-200 hover:border-[#18325A]/30">



                <SelectValue placeholder="الحالة" />



              </SelectTrigger>



              <SelectContent>



                <SelectItem value="all">الكل</SelectItem>



                <SelectItem value="active">نشط</SelectItem>



                <SelectItem value="inactive">معطل</SelectItem>



              </SelectContent>



            </Select>







            <Select value={packageFilter} onValueChange={setPackageFilter}>



              <SelectTrigger className="w-32 transition-all duration-200 hover:border-[#18325A]/30">



                <SelectValue placeholder="الباقة" />



              </SelectTrigger>



              <SelectContent>



                <SelectItem value="all">الكل</SelectItem>



                <SelectItem value="free">مجاني</SelectItem>



                <SelectItem value="basic">أساسي</SelectItem>



                <SelectItem value="professional">احترافي</SelectItem>



                <SelectItem value="custom">مخصص</SelectItem>



              </SelectContent>



            </Select>



          </div>



        </div>



      </div>







      {/* الجدول المحسّن */}



      <Card className="overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">



        <CardContent className="p-0">



          <div className="overflow-x-auto">



            <Table>



              <TableHeader>



                <TableRow className="bg-gray-50/50">



                  <TableHead className="text-right w-[250px]">المنظمة</TableHead>



                  <TableHead className="text-right w-[120px]">النوع</TableHead>



                  <TableHead className="text-right w-[100px]">الحالة</TableHead>



                  <TableHead className="text-right w-[120px]">الباقة</TableHead>



                  <TableHead className="text-right w-[150px]">الاستخدام</TableHead>



                  <TableHead className="text-right w-[100px]">المستخدمين</TableHead>



                  <TableHead className="text-right w-[100px]">الاستطلاعات</TableHead>



                  <TableHead className="text-right w-[80px]">إجراءات</TableHead>



                </TableRow>



              </TableHeader>



              <TableBody>



                {paginatedData.map((org) => {



                  const usagePercentage = getUsagePercentage(org.consumed, org.quota);



                  



                  return (



                    <TableRow 



                      key={org.id} 



                      className="group hover:bg-blue-50/50 transition-all duration-200 ease-in-out"



                      onClick={() => openViewDrawer(org)}



                      style={{ cursor: 'pointer' }}



                    >



                      {/* المنظمة */}



                      <TableCell>



                        <div className="flex items-center gap-3">



                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#18325A] to-[#2a4a7a] flex items-center justify-center text-white flex-shrink-0 group-hover:shadow-lg group-hover:scale-110 transition-all duration-200">



                            <Building2 className="w-5 h-5" />



                          </div>



                          <div>



                            <div className="font-medium text-gray-900 group-hover:text-[#18325A] transition-colors duration-200">{org.name}</div>



                            <div className="text-sm text-gray-500 group-hover:text-gray-700 transition-colors duration-200">{org.region}</div>



                          </div>



                        </div>



                      </TableCell>







                      {/* النوع */}



                      <TableCell>



                        <Badge variant="outline" className="text-xs group-hover:border-[#18325A]/30 transition-colors duration-200">



                          {getTypeDisplayName(org.type)}



                        </Badge>



                      </TableCell>







                      {/* الحالة */}



                      <TableCell>



                        {getStatusBadge(org.status)}



                      </TableCell>







                      {/* الباقة */}



                      <TableCell>



                        <Badge className={`${getPackageBadgeColor(org.packageType)} group-hover:shadow-sm transition-shadow duration-200`}>



                          {getPackageDisplayName(org.packageType)}



                        </Badge>



                      </TableCell>







                      {/* الاستخدام */}



                      <TableCell>



                        <div>



                          <div className="flex items-center justify-between mb-1">



                            <span className={`text-sm font-medium ${getUsageColor(usagePercentage)}`}>



                              {usagePercentage}%



                            </span>



                            <span className="text-xs text-gray-500">



                              {org.consumed.toLocaleString()} / {org.quota.toLocaleString()}



                            </span>



                          </div>



                          <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">



                            <div 



                              className={`h-1.5 rounded-full transition-all duration-300 ${



                                usagePercentage >= 90 ? 'bg-red-500' : 



                                usagePercentage >= 70 ? 'bg-orange-500' : 



                                'bg-green-500'



                              }`}



                              style={{ width: `${usagePercentage}%` }}



                            />



                          </div>



                        </div>



                      </TableCell>







                      {/* المستخدمين */}



                      <TableCell>



                        <div className="flex items-center gap-2">



                          <Users className="h-4 w-4 text-gray-400 group-hover:text-[#18325A] transition-colors duration-200" />



                          <span className="font-medium">{org.userCount}</span>



                        </div>



                      </TableCell>







                      {/* الاستطلاعات */}



                      <TableCell>



                        <div className="flex items-center gap-2">



                          <FileText className="h-4 w-4 text-[#18325A] group-hover:scale-110 transition-transform duration-200" />



                          <div>



                            <div className="font-medium text-[#18325A]">{org.surveys}</div>



                            <div className="text-xs text-gray-500">{org.activeSurveys} نشط</div>



                          </div>



                        </div>



                      </TableCell>







                      {/* الإجراءات */}



                      <TableCell onClick={(e) => e.stopPropagation()}>



                        <DropdownMenu dir="rtl">



                          <DropdownMenuTrigger asChild>



                            <Button 



                              variant="ghost" 



                              size="sm" 



                              className="h-8 w-8 p-0 hover:bg-[#18325A]/10 hover:scale-110 transition-all duration-200"



                            >



                              <MoreVertical className="h-4 w-4" />



                            </Button>



                          </DropdownMenuTrigger>



                          <DropdownMenuContent align="end" className="w-48 shadow-lg">



                            <DropdownMenuItem 



                              onClick={(e) => {



                                e.stopPropagation();



                                openViewDrawer(org);



                              }}



                              className="hover:bg-blue-50 transition-colors duration-150"



                            >



                              <Eye className="h-4 w-4 ml-2" />



                              عرض التفاصيل



                            </DropdownMenuItem>



                            <DropdownMenuItem 



                              onClick={(e) => {



                                e.stopPropagation();



                                openEditDrawer(org);



                              }}



                              className="hover:bg-blue-50 transition-colors duration-150"



                            >



                              <Edit className="h-4 w-4 ml-2" />



                              تعديل



                            </DropdownMenuItem>



                            <DropdownMenuItem 



                              onClick={(e) => {



                                e.stopPropagation();



                                openDeleteDialog(org);



                              }}



                              className="text-red-600 hover:bg-red-50 transition-colors duration-150"



                            >



                              <Trash2 className="h-4 w-4 ml-2" />



                              حذف



                            </DropdownMenuItem>



                          </DropdownMenuContent>



                        </DropdownMenu>



                      </TableCell>



                    </TableRow>



                  );



                })}



              </TableBody>



            </Table>



          </div>







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







      {/* رسالة عدم وجود نتائج */}



      {filteredOrganizations.length === 0 && (



        <Card className="mt-6">



          <CardContent className="p-12 text-center">



            <Building2 className="h-12 w-12 text-gray-300 mx-auto mb-4" />



            <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد منظمات</h3>



            <p className="text-gray-600 mb-6">



              {searchTerm || statusFilter !== 'all' || packageFilter !== 'all'



                ? 'لم يتم العثور على منظمات تطابق معايير البحث'



                : 'لا توجد منظمات مسجلة في المنصة حالياً'



              }



            </p>



            <Button onClick={openAddDrawer} className="bg-[#18325A] hover:bg-[#2a4a7a] text-white">



              <Plus className="h-4 w-4 ml-2" />



              إضافة منظمة جديدة



            </Button>



          </CardContent>



        </Card>



      )}







      {/* Organization Drawer */}



      <OrganizationDrawer



        open={drawerOpen}



        onOpenChange={setDrawerOpen}



        organization={selectedOrganization}



        mode={drawerMode}



        onSave={handleSaveOrganization}



      />







      {/* Delete Confirmation Dialog */}



      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>



        <DialogContent>



          <DialogHeader>



            <DialogTitle>تأكيد الحذف</DialogTitle>



            <DialogDescription>



              هل أنت متأكد من حذف منظمة "{selectedOrganization?.name}"؟ لا يمكن التراجع عن هذا الإجراء.



            </DialogDescription>



          </DialogHeader>



          <DialogFooter className="gap-2">



            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>



              إلغاء



            </Button>



            <Button 



              onClick={handleDeleteOrganization}



              className="bg-red-600 hover:bg-red-700 text-white"



            >



              حذف



            </Button>



          </DialogFooter>



        </DialogContent>



      </Dialog>



    </AdminPageLayout>



  );



}



