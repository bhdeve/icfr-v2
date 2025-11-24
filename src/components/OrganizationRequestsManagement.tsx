import React, { useState, useEffect } from 'react';






import { motion } from 'motion/react';







import { AdminPageLayout } from './shared/AdminPageLayout';







import { TablePagination } from './shared/TablePagination';







import { usePagination } from '../hooks/usePagination';







import { Button } from './ui/button';







import { Badge } from './ui/badge';







import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';







import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';







import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';







import { Textarea } from './ui/textarea';







import { Label } from './ui/label';







import { Input } from './ui/input';







import { toast } from 'sonner@2.0.3';







import { organizationsService } from '../api/services';







import {







  Eye,







  Check,







  X,







  Building,







  User,







  Mail,







  Phone,







  Globe,







  Users,







  Calendar,







  FileText,







  Clock,







  CheckCircle2,







  XCircle,







  Search,







  Filter,







  Download,







  ClipboardList







} from 'lucide-react';















interface OrganizationRequest {







  id: string;







  organizationName: string;







  managerName: string;







  email: string;







  phone: string;







  country: string;







  city: string;







  expectedBeneficiaries: number;







  workFields: string[];







  description: string;







  website?: string;







  status: 'pending' | 'approved' | 'rejected';







  submittedAt: string;







  reviewedAt?: string;







  reviewedBy?: string;







  rejectionReason?: string;







}















// Mock data for demonstration







const mockRequests: OrganizationRequest[] = [







  {







    id: '1',







    organizationName: 'جمعية الخير للتنمية الاجتماعية',







    managerName: 'أحمد محمد الأحمد',







    email: 'ahmed@alkhayr.org',







    phone: '+966501234567',







    country: 'المملكة العربية السعودية',







    city: 'الرياض',







    expectedBeneficiaries: 2500,







    workFields: ['social', 'education', 'health'],







    description: 'جمعية خيرية تهدف إلى تقديم الخدمات الاجتماعية والتعليمية والصحية للمحتاجين في المجتمع المحلي من خلال برامج متنوعة تشمل كفالة الأيتام وتقديم المساعدات الطبية والتعليمية',







    website: 'https://alkhayr.org',







    status: 'pending',







    submittedAt: '2024-01-15T10:30:00Z'







  },







  {







    id: '2',







    organizationName: 'مؤسسة البيئة المستدامة',







    managerName: 'فاطمة علي السالم',







    email: 'fatima@sustainable-env.org',







    phone: '+966505678901',







    country: 'المملكة العربية السعودية',







    city: 'جدة',







    expectedBeneficiaries: 1800,







    workFields: ['environmental', 'education'],







    description: 'مؤسسة تعمل على نشر الوعي البيئي وحماية البيئة من خلال برامج تعليمية وتطوعية تهدف إلى المحافظة على البيئة والموارد الطبيعية',







    status: 'approved',







    submittedAt: '2024-01-12T14:20:00Z',







    reviewedAt: '2024-01-14T09:15:00Z',







    reviewedBy: 'مدير النظام'







  },







  {







    id: '3',







    organizationName: 'مركز الشباب للإبداع والتقنية',







    managerName: 'محمد عبدالله النهدي',







    email: 'mohammed@youth-tech.com',







    phone: '+966503456789',







    country: 'المملكة العربية السعودية',







    city: 'الدمام',







    expectedBeneficiaries: 800,







    workFields: ['technology', 'education'],







    description: 'مركز يهدف إلى تطوير مهارات الشباب في مجال التقنية والإبداع من خلال دورات تدريبية متخصصة في البرمجة والتصميم',







    status: 'rejected',







    submittedAt: '2024-01-10T16:45:00Z',







    reviewedAt: '2024-01-13T11:30:00Z',







    reviewedBy: 'مدير النظام',







    rejectionReason: 'المعلومات المقدمة غير كافية ولا تتضمن تفاصيل ��اضحة عن البرامج المقدمة'







  },







  {







    id: '4',







    organizationName: 'جمعية المرأة الخيرية',







    managerName: 'نورا سعد الدوسري',







    email: 'nora@womencharity.org',







    phone: '+966504567890',







    country: 'المملكة العربية السعودية',







    city: 'مكة المكرمة',







    expectedBeneficiaries: 3200,







    workFields: ['social', 'education', 'economic'],







    description: 'جمعية تعمل على تمكين المرأة اجتماعياً واقتصادياً من خلال برامج التدريب والتأهيل المهني ودعم المشاريع الصغيرة',







    website: 'https://womencharity.org',







    status: 'pending',







    submittedAt: '2024-01-16T09:15:00Z'







  },







  {







    id: '5',







    organizationName: 'مبادرة الصحة للجميع',







    managerName: 'د. خالد أحمد العتيبي',







    email: 'khaled@healthforall.org',







    phone: '+966502345678',







    country: 'المملكة العربية السعودية',







    city: 'المدينة المنورة',







    expectedBeneficiaries: 5000,







    workFields: ['health', 'social'],







    description: 'مبادرة طبية تهدف إلى تقديم الخدمات الصحية المجانية للمحتاجين وتوعيتهم بأهمية الرعاية الصحية الوقائية',







    status: 'approved',







    submittedAt: '2024-01-11T13:45:00Z',







    reviewedAt: '2024-01-13T16:20:00Z',







    reviewedBy: 'مدير النظام'







  },







  {







    id: '6',







    organizationName: 'رابطة الرياضة المجتمعية',







    managerName: 'سلطان محمد الغامدي',







    email: 'sultan@communitysports.sa',







    phone: '+966507654321',







    country: 'المملكة العربية السعودية',







    city: 'الطائف',







    expectedBeneficiaries: 1200,







    workFields: ['sports', 'social'],







    description: 'رابطة تعمل على تطوير الرياضة المجتمعية وإقامة البطولات المحلية لجميع الفئات العمرية',







    status: 'pending',







    submittedAt: '2024-01-17T11:00:00Z'







  }







];















const workFieldLabels: Record<string, { label: string; icon: string }> = {







  'health': { label: 'صحي', icon: '🏥' },







  'education': { label: 'تعليمي', icon: '📚' },







  'social': { label: 'اجتماعي', icon: '👥' },







  'environmental': { label: 'بيئي', icon: '🌱' },







  'economic': { label: 'اقتصادي', icon: '💼' },







  'cultural': { label: 'ثقافي', icon: '🎭' },







  'sports': { label: 'رياضي', icon: '⚽' },







  'technology': { label: 'تقني', icon: '💻' }







};















export function OrganizationRequestsManagement() {







  const [requests, setRequests] = useState<OrganizationRequest[]>([]);

  useEffect(() => {

    const loadRequests = async () => {

      try {

        const response = await organizationsService.list({ status: "pending", page: 1, limit: 50 });

        if (response.success && response.data) {

          const items = response.data.items || [];

          const mapped = items.map((item: any) => ({

            id: item.id,

            name: item.name,

            email: item.contactEmail,

            phone: item.contactPhone || "",

            type: item.industry || "general",

            expectedBeneficiaries: item.metadata?.expectedBeneficiaries || "",

            description: item.metadata?.description || "",

            documents: [],

            status: item.status as any,

            submittedAt: item.createdAt,

          }));

          setRequests(mapped as any);

        } else {

          setRequests(mockRequests);

        }

      } catch (error) {

        console.error("Failed to load organization requests:", error);

        setRequests(mockRequests);

      }

    };

    loadRequests();

  }, []);









  const [selectedRequest, setSelectedRequest] = useState<OrganizationRequest | null>(null);







  const [isViewModalOpen, setIsViewModalOpen] = useState(false);







  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);







  const [rejectionReason, setRejectionReason] = useState('');







  const [filterStatus, setFilterStatus] = useState<string>('all');







  const [searchTerm, setSearchTerm] = useState('');















  const formatDate = (dateString: string) => {







    return new Date(dateString).toLocaleDateString('ar-SA', {







      year: 'numeric',







      month: 'long',







      day: 'numeric',







      hour: '2-digit',







      minute: '2-digit'







    });







  };















  const getStatusBadge = (status: OrganizationRequest['status']) => {







    switch (status) {







      case 'pending':







        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800"><Clock className="w-3 h-3 ml-1" />قيد المراجعة</Badge>;







      case 'approved':







        return <Badge variant="secondary" className="bg-green-100 text-green-800"><CheckCircle2 className="w-3 h-3 ml-1" />مقبول</Badge>;







      case 'rejected':







        return <Badge variant="secondary" className="bg-red-100 text-red-800"><XCircle className="w-3 h-3 ml-1" />مرفوض</Badge>;







      default:







        return null;







    }







  };















  const handleViewRequest = (request: OrganizationRequest) => {







    setSelectedRequest(request);







    setIsViewModalOpen(true);







  };















  const handleApproveRequest = async (requestId: string) => {







    try {







      setRequests(prev => prev.map(req => 







        req.id === requestId 







          ? { 







              ...req, 







              status: 'approved', 







              reviewedAt: new Date().toISOString(),







              reviewedBy: 'مدير النظام'







            }







          : req







      ));







      







      toast.success('تم قبول الطلب بنجاح! سيتم إرسال بيانات الدخول للمنظمة');







      







      // Here you would typically:







      // 1. Create organization account







      // 2. Send welcome email with login credentials







      // 3. Update database







      







    } catch (error) {







      console.error('Error approving request:', error);







      toast.error('حدث خطأ أثناء قبول الطلب');







    }







  };















  const handleRejectRequest = async () => {







    if (!selectedRequest || !rejectionReason.trim()) {







      toast.error('يرجى إدخال سبب الرفض');







      return;







    }















    try {







      setRequests(prev => prev.map(req => 







        req.id === selectedRequest.id 







          ? { 







              ...req, 







              status: 'rejected', 







              reviewedAt: new Date().toISOString(),







              reviewedBy: 'مدير النظام',







              rejectionReason: rejectionReason







            }







          : req







      ));







      







      setIsRejectModalOpen(false);







      setRejectionReason('');







      setSelectedRequest(null);







      







      toast.success('تم رفض الطلب وإرسال إشعار للمنظمة');







      







      // Here you would typically send rejection email







      







    } catch (error) {







      console.error('Error rejecting request:', error);







      toast.error('حدث خطأ أثناء رفض الطلب');







    }







  };















  const handleExportData = () => {







    try {







      // التحقق من وجود بيانات للتصدير







      if (filteredRequests.length === 0) {







        toast.error('لا توجد بيانات للتصدير');







        return;







      }















      // تحضير البيانات للتصدير







      const exportData = filteredRequests.map(request => ({







        'اسم المنظمة': request.organizationName,







        'اسم المسؤول': request.managerName,







        'البريد الإلكتروني': request.email,







        'رقم الهاتف': request.phone,







        'الدولة': request.country,







        'المدينة': request.city,







        'عدد المستفيدين ��لمتوقع': request.expectedBeneficiaries.toLocaleString(),







        'مجالات العمل': request.workFields.map(field => workFieldLabels[field]?.label).join(', '),







        'وصف المنظمة': request.description,







        'الموقع الإلكتروني': request.website || 'غير محدد',







        'الحالة': request.status === 'pending' ? 'قيد المراجعة' : request.status === 'approved' ? 'مقبول' : 'مرفوض',







        'تاريخ التقديم': formatDate(request.submittedAt),







        'تاريخ المراجعة': request.reviewedAt ? formatDate(request.reviewedAt) : 'غير محدد',







        'تمت المراجعة بواسطة': request.reviewedBy || 'غير محدد',







        'سبب الرفض': request.rejectionReason || 'غير محدد'







      }));















      // تحويل البيانات إلى CSV







      const headers = Object.keys(exportData[0]);







      const csvContent = [







        headers.join(','),







        ...exportData.map(row => 







          headers.map(header => {







            const value = row[header] || '';







            // إضافة علامات اقتباس للحقول التي تحتوي على فواصل أو أسطر جديدة







            return `"${String(value).replace(/"/g, '""')}"`;







          }).join(',')







        )







      ].join('\n');















      // إنشاء ملف CSV وتحميله







      const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });







      const link = document.createElement('a');







      const url = URL.createObjectURL(blob);







      link.setAttribute('href', url);







      







      // تحديد اسم الملف مع التاريخ والفلتر







      const currentDate = new Date().toLocaleDateString('ar-SA').replace(/\//g, '-');







      const filterSuffix = filterStatus === 'all' ? '' : `_${filterStatus}`;







      const searchSuffix = searchTerm ? `_بحث` : '';







      link.setAttribute('download', `طلبات_التسجيل${filterSuffix}${searchSuffix}_${currentDate}.csv`);







      







      link.style.visibility = 'hidden';







      document.body.appendChild(link);







      link.click();







      document.body.removeChild(link);







      







      toast.success(`تم تصدير ${exportData.length} طلب بنجاح`);







      







    } catch (error) {







      console.error('Error exporting data:', error);







      toast.error('حدث خطأ أثناء تصدير البيانات');







    }







  };















  const filteredRequests = requests.filter(request => {







    const matchesSearch = 







      request.organizationName.toLowerCase().includes(searchTerm.toLowerCase()) ||







      request.managerName.toLowerCase().includes(searchTerm.toLowerCase()) ||







      request.email.toLowerCase().includes(searchTerm.toLowerCase());







    







    const matchesFilter = filterStatus === 'all' || request.status === filterStatus;







    







    return matchesSearch && matchesFilter;







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







    data: filteredRequests,







    initialItemsPerPage: 10,







    initialPage: 1







  });















  const pendingCount = requests.filter(req => req.status === 'pending').length;







  const approvedCount = requests.filter(req => req.status === 'approved').length;







  const rejectedCount = requests.filter(req => req.status === 'rejected').length;















  // Header stats content for AdminPageLayout







  const headerStats = (







    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">







      <div className="bg-white/10 rounded-lg p-4">







        <div className="flex items-center gap-3">







          <Clock className="h-6 w-6 text-yellow-300" />







          <div>







            <div className="text-2xl font-bold text-white arabic-numbers">{pendingCount}</div>







            <div className="text-blue-200">قيد المراجعة</div>







          </div>







        </div>







      </div>







      <div className="bg-white/10 rounded-lg p-4">







        <div className="flex items-center gap-3">







          <CheckCircle2 className="h-6 w-6 text-green-300" />







          <div>







            <div className="text-2xl font-bold text-white arabic-numbers">{approvedCount}</div>







            <div className="text-blue-200">مقبولة</div>







          </div>







        </div>







      </div>







      <div className="bg-white/10 rounded-lg p-4">







        <div className="flex items-center gap-3">







          <XCircle className="h-6 w-6 text-red-300" />







          <div>







            <div className="text-2xl font-bold text-white arabic-numbers">{rejectedCount}</div>







            <div className="text-blue-200">مرفوضة</div>







          </div>







        </div>







      </div>







      <div className="bg-white/10 rounded-lg p-4">







        <div className="flex items-center gap-3">







          <Building className="h-6 w-6 text-blue-300" />







          <div>







            <div className="text-2xl font-bold text-white arabic-numbers">{requests.length}</div>







            <div className="text-blue-200">إجمالي الطلبات</div>







          </div>







        </div>







      </div>







    </div>







  );















  return (







    <AdminPageLayout







      title="طلبات المنظمات"







      description="مراجعة وإدارة طلبات تسجيل المنظمات الجديدة في سحابة الأثر"







      icon={ClipboardList}







    >







      <div className="space-y-4">







        {/* Filters and Search */}







        <Card className="border-0 shadow-md">







          <CardContent className="p-4">







            <div className="flex flex-col md:flex-row gap-3">







              <div className="flex-1">







                <div className="relative">







                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />







                  <Input







                    placeholder="البحث بالاسم أو البريد الإلكتروني..."







                    value={searchTerm}







                    onChange={(e) => setSearchTerm(e.target.value)}







                    className="pr-10"







                  />







                </div>







              </div>







              







              <div className="flex gap-2">







                <Button







                  variant={filterStatus === 'all' ? 'default' : 'outline'}







                  onClick={() => setFilterStatus('all')}







                  className="gap-2"







                >







                  <Filter className="h-4 w-4" />







                  الكل







                </Button>







                <Button







                  variant={filterStatus === 'pending' ? 'default' : 'outline'}







                  onClick={() => setFilterStatus('pending')}







                  className="gap-2"







                >







                  <Clock className="h-4 w-4" />







                  قيد المراجعة







                </Button>







                <Button







                  variant={filterStatus === 'approved' ? 'default' : 'outline'}







                  onClick={() => setFilterStatus('approved')}







                  className="gap-2"







                >







                  <CheckCircle2 className="h-4 w-4" />







                  مقبولة







                </Button>







                <Button







                  variant={filterStatus === 'rejected' ? 'default' : 'outline'}







                  onClick={() => setFilterStatus('rejected')}







                  className="gap-2"







                >







                  <XCircle className="h-4 w-4" />







                  مرفوضة







                </Button>







              </div>















              <Button variant="outline" className="gap-2" onClick={handleExportData}>







                <Download className="h-4 w-4" />







                تصدير







              </Button>







            </div>







          </CardContent>







        </Card>















        {/* Requests Table */}







        <Card className="border-0 shadow-md">







          <CardHeader>







            <CardTitle>طلبات التسجيل</CardTitle>







            <CardDescription>







              جميع طلبات تسجيل المنظمات مع إمكانية المراجعة والموافقة أو الرفض







            </CardDescription>







          </CardHeader>







          <CardContent>







            <div className="overflow-x-auto">







              <Table>







                <TableHeader>







                  <TableRow>







                    <TableHead>اسم المنظمة</TableHead>







                    <TableHead>اسم المسؤول</TableHead>







                    <TableHead>البريد الإلكتروني</TableHead>







                    <TableHead>الدولة / المدينة</TableHead>







                    <TableHead>تاريخ التقديم</TableHead>







                    <TableHead>الحالة</TableHead>







                    <TableHead>الإجراءات</TableHead>







                  </TableRow>







                </TableHeader>







                <TableBody>







                  {paginatedData.map((request) => (







                    <TableRow key={request.id}>







                      <TableCell className="font-medium">







                        {request.organizationName}







                      </TableCell>







                      <TableCell>{request.managerName}</TableCell>







                      <TableCell className="text-left" dir="ltr">







                        {request.email}







                      </TableCell>







                      <TableCell>{request.country} / {request.city}</TableCell>







                      <TableCell>{formatDate(request.submittedAt)}</TableCell>







                      <TableCell>{getStatusBadge(request.status)}</TableCell>







                      <TableCell>







                        <div className="flex gap-2">







                          <Button







                            variant="outline"







                            size="sm"







                            onClick={() => handleViewRequest(request)}







                            className="gap-1"







                          >







                            <Eye className="h-3 w-3" />







                            عرض التفاصيل







                          </Button>







                          







                          {request.status === 'pending' && (







                            <>







                              <Button







                                variant="outline"







                                size="sm"







                                onClick={() => handleApproveRequest(request.id)}







                                className="gap-1 text-green-600 hover:text-green-700 hover:bg-green-50"







                              >







                                <Check className="h-3 w-3" />







                                قبول







                              </Button>







                              <Button







                                variant="outline"







                                size="sm"







                                onClick={() => {







                                  setSelectedRequest(request);







                                  setIsRejectModalOpen(true);







                                }}







                                className="gap-1 text-red-600 hover:text-red-700 hover:bg-red-50"







                              >







                                <X className="h-3 w-3" />







                                رفض







                              </Button>







                            </>







                          )}







                        </div>







                      </TableCell>







                    </TableRow>







                  ))}







                </TableBody>







              </Table>







            </div>















            {/* Pagination */}







            {filteredRequests.length > 0 && totalPages > 1 && (







              <TablePagination







                currentPage={currentPage}







                totalPages={totalPages}







                totalItems={totalItems}







                itemsPerPage={itemsPerPage}







                onPageChange={handlePageChange}







                onItemsPerPageChange={handleItemsPerPageChange}







              />







            )}















            {filteredRequests.length === 0 && (







              <div className="text-center py-12">







                <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />







                <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد طلبات</h3>







                <p className="text-gray-500">لا توجد طلبات تسجيل تطابق المعايير المحددة</p>







              </div>







            )}







          </CardContent>







        </Card>







      </div>















      {/* View Request Modal */}







      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>







        <DialogContent className="max-w-full sm:max-w-4xl max-h-[90vh] overflow-y-auto mx-4">







          <DialogHeader>







            <DialogTitle className="flex items-center gap-3">







              <Building className="h-6 w-6" />







              تفاصيل طلب التسجيل







            </DialogTitle>







            <DialogDescription>







              معلومات تفصيلية عن طلب تسجيل المنظمة







            </DialogDescription>







          </DialogHeader>







          







          {selectedRequest && (







            <div className="space-y-6">







              {/* Status and Basic Info */}







              <div className="flex items-center justify-between">







                {getStatusBadge(selectedRequest.status)}







                <div className="text-sm text-gray-500">







                  تاريخ التقديم: {formatDate(selectedRequest.submittedAt)}







                </div>







              </div>















              {/* Organization Information */}







              <div className="grid md:grid-cols-2 gap-6">







                <div className="space-y-4">







                  <div>







                    <Label className="flex items-center gap-2 text-sm font-medium text-gray-700">







                      <Building className="h-4 w-4" />







                      اسم المنظمة







                    </Label>







                    <p className="mt-1 text-sm text-gray-900">{selectedRequest.organizationName}</p>







                  </div>















                  <div>







                    <Label className="flex items-center gap-2 text-sm font-medium text-gray-700">







                      <User className="h-4 w-4" />







                      الشخص المسؤول







                    </Label>







                    <p className="mt-1 text-sm text-gray-900">{selectedRequest.managerName}</p>







                  </div>















                  <div>







                    <Label className="flex items-center gap-2 text-sm font-medium text-gray-700">







                      <Mail className="h-4 w-4" />







                      البريد الإلكتروني







                    </Label>







                    <p className="mt-1 text-sm text-gray-900" dir="ltr">{selectedRequest.email}</p>







                  </div>















                  <div>







                    <Label className="flex items-center gap-2 text-sm font-medium text-gray-700">







                      <Phone className="h-4 w-4" />







                      رقم الهاتف







                    </Label>







                    <p className="mt-1 text-sm text-gray-900" dir="ltr">{selectedRequest.phone}</p>







                  </div>







                </div>















                <div className="space-y-4">







                  <div>







                    <Label className="flex items-center gap-2 text-sm font-medium text-gray-700">







                      <Globe className="h-4 w-4" />







                      الموقع







                    </Label>







                    <p className="mt-1 text-sm text-gray-900">{selectedRequest.country} - {selectedRequest.city}</p>







                  </div>















                  <div>







                    <Label className="flex items-center gap-2 text-sm font-medium text-gray-700">







                      <Users className="h-4 w-4" />







                      عدد المستفيدين المتوقع







                    </Label>







                    <p className="mt-1 text-sm text-gray-900">{selectedRequest.expectedBeneficiaries.toLocaleString()} مستفيد</p>







                  </div>















                  {selectedRequest.website && (







                    <div>







                      <Label className="flex items-center gap-2 text-sm font-medium text-gray-700">







                        <Globe className="h-4 w-4" />







                        الموقع الإلكتروني







                      </Label>







                      <a 







                        href={selectedRequest.website} 







                        target="_blank" 







                        rel="noopener noreferrer"







                        className="mt-1 text-sm text-blue-600 hover:text-blue-800 underline block"







                        dir="ltr"







                      >







                        {selectedRequest.website}







                      </a>







                    </div>







                  )}















                  {selectedRequest.reviewedAt && (







                    <div>







                      <Label className="flex items-center gap-2 text-sm font-medium text-gray-700">







                        <Calendar className="h-4 w-4" />







                        تاريخ المراجعة







                      </Label>







                      <p className="mt-1 text-sm text-gray-900">







                        {formatDate(selectedRequest.reviewedAt)} بواسطة {selectedRequest.reviewedBy}







                      </p>







                    </div>







                  )}







                </div>







              </div>















              {/* Work Fields */}







              <div>







                <Label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">







                  <FileText className="h-4 w-4" />







                  مجالات العمل







                </Label>







                <div className="flex flex-wrap gap-2">







                  {selectedRequest.workFields.map((fieldId) => {







                    const field = workFieldLabels[fieldId];







                    return (







                      <Badge key={fieldId} variant="secondary" className="gap-1">







                        <span>{field?.icon}</span>







                        {field?.label}







                      </Badge>







                    );







                  })}







                </div>







              </div>















              {/* Description */}







              <div>







                <Label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">







                  <FileText className="h-4 w-4" />







                  وصف المنظمة







                </Label>







                <p className="text-sm text-gray-900 leading-relaxed bg-gray-50 p-4 rounded-lg">







                  {selectedRequest.description}







                </p>







              </div>















              {/* Rejection Reason */}







              {selectedRequest.status === 'rejected' && selectedRequest.rejectionReason && (







                <div>







                  <Label className="flex items-center gap-2 text-sm font-medium text-red-700 mb-3">







                    <XCircle className="h-4 w-4" />







                    سبب الرفض







                  </Label>







                  <p className="text-sm text-red-900 leading-relaxed bg-red-50 p-4 rounded-lg border border-red-200">







                    {selectedRequest.rejectionReason}







                  </p>







                </div>







              )}















              {/* Action Buttons */}







              {selectedRequest.status === 'pending' && (







                <div className="flex gap-3 pt-4 border-t">







                  <Button







                    onClick={() => {







                      setIsViewModalOpen(false);







                      handleApproveRequest(selectedRequest.id);







                    }}







                    className="bg-green-600 hover:bg-green-700 text-white gap-2"







                  >







                    <Check className="h-4 w-4" />







                    قبول الطلب







                  </Button>







                  <Button







                    variant="outline"







                    onClick={() => {







                      setIsViewModalOpen(false);







                      setIsRejectModalOpen(true);







                    }}







                    className="text-red-600 hover:text-red-700 hover:bg-red-50 gap-2"







                  >







                    <X className="h-4 w-4" />







                    رفض الطلب







                  </Button>







                </div>







              )}







            </div>







          )}







        </DialogContent>







      </Dialog>















      {/* Reject Request Modal */}







      <Dialog open={isRejectModalOpen} onOpenChange={setIsRejectModalOpen}>







        <DialogContent className="max-w-full sm:max-w-md mx-4">







          <DialogHeader>







            <DialogTitle className="text-red-700">رفض طلب التسجيل</DialogTitle>







            <DialogDescription>







              ير��ى إدخال سبب رفض طلب التسجيل. سيتم إرسال هذا السبب للمنظمة المتقدمة.







            </DialogDescription>







          </DialogHeader>







          







          <div className="space-y-4">







            <div>







              <Label htmlFor="rejectionReason">سبب الرفض</Label>







              <Textarea







                id="rejectionReason"







                value={rejectionReason}







                onChange={(e) => setRejectionReason(e.target.value)}







                placeholder="اكتب سبب رفض الطلب بشكل واضح ومفصل..."







                className="mt-2 min-h-24"







                required







              />







            </div>







            







            <div className="flex gap-3 justify-end">







              <Button







                variant="outline"







                onClick={() => {







                  setIsRejectModalOpen(false);







                  setRejectionReason('');







                }}







              >







                إلغاء







              </Button>







              <Button







                onClick={handleRejectRequest}







                className="bg-red-600 hover:bg-red-700 text-white"







                disabled={!rejectionReason.trim()}







              >







                رفض الطلب







              </Button>







            </div>







          </div>







        </DialogContent>







      </Dialog>







    </AdminPageLayout>







  );







}
