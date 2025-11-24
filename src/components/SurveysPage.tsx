import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { AdminPageLayout } from './shared/AdminPageLayout';
import { StatCardGrid } from './shared/StatCard';
import { TablePagination } from './shared/TablePagination';
import { FiltersDrawer } from './shared/FiltersDrawer';
import { SurveyDrawer } from './shared/SurveyDrawer';
import { ExportDrawer } from './shared/ExportDrawer';
import { usePagination } from '../hooks/usePagination';
import { fadeInUp, staggerContainer, staggerItem } from '../utils/animations';
import { 
  Plus,
  Search,
  FileText,
  Filter,
  X,
  RefreshCw,
  CheckCircle,
  Users,
  BarChart3,
  Download
} from 'lucide-react';
import { Survey, UserRole } from '../App';
import { SurveyCard } from './surveys/SurveyCard';
import { SurveyStats } from './surveys/SurveyStats';

interface SurveysPageProps {
  userRole: UserRole;
  onCreateSurvey: () => void;
  onEditSurvey: (surveyId: string) => void;
  onViewResults: (surveyId: string) => void;
  onViewSurvey: (surveyId: string) => void;
  onDuplicateSurvey: (surveyId: string) => void;
  onDeleteSurvey?: (surveyId: string) => void;
  onShareSurvey: (surveyId: string) => void;
  createdSurveys?: Survey[];
}

export function SurveysPage({ 
  userRole,
  onCreateSurvey, 
  onEditSurvey, 
  onViewResults, 
  onViewSurvey, 
  onDuplicateSurvey,
  onDeleteSurvey,
  onShareSurvey,
  createdSurveys = []
}: SurveysPageProps) {
  // Drawer states
  const [filtersDrawerOpen, setFiltersDrawerOpen] = useState(false);
  const [surveyDrawerOpen, setSurveyDrawerOpen] = useState(false);
  const [exportDrawerOpen, setExportDrawerOpen] = useState(false);
  const [selectedSurvey, setSelectedSurvey] = useState<Survey | null>(null);
  
  // Filter states
  const [filters, setFilters] = useState({
    searchText: '',
    status: [] as string[],
    organizations: [] as string[],
    categories: [] as string[],
    responseRange: undefined as { min: number; max: number } | undefined,
    completionRate: undefined as { min: number; max: number } | undefined,
    dateRange: { from: '', to: '' },
    sortBy: 'date',
    sortOrder: 'desc' as 'asc' | 'desc'
  });
  
  // Legacy states for backward compatibility
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [minResponses, setMinResponses] = useState('');
  const [titleFilter, setTitleFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  // Use the surveys passed from parent (includes both created and existing surveys)
  const allSurveys = createdSurveys;

  // Enhanced filter and sort surveys
  const filteredSurveys = allSurveys
    .filter(survey => {
      const matchesSearch = survey.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           survey.organization.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || survey.status === statusFilter;
      
      const matchesMinResponses = minResponses === '' || 
                                 survey.responses >= parseInt(minResponses);
      
      const matchesTitle = titleFilter === '' || 
                          survey.title.toLowerCase().includes(titleFilter.toLowerCase());
      
      const matchesDate = dateFilter === '' || 
                         new Date(survey.createdAt).toISOString().substr(0, 10) >= dateFilter;
      
      return matchesSearch && matchesStatus && matchesMinResponses && matchesTitle && matchesDate;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'title':
          return a.title.localeCompare(b.title);
        case 'responses':
          return b.responses - a.responses;
        default:
          return 0;
      }
    });

  const handleShareSurvey = (surveyId: string) => {
    onShareSurvey(surveyId);
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setSortBy('date');
    setMinResponses('');
    setTitleFilter('');
    setDateFilter('');
  };

  const hasActiveFilters = searchTerm !== '' || statusFilter !== 'all' || 
                          minResponses !== '' || titleFilter !== '' || dateFilter !== '';

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
    data: filteredSurveys,
    initialItemsPerPage: 12,
    initialPage: 1
  });

  const handleCreateSurvey = () => {
    setSelectedSurvey(null);
    setSurveyDrawerOpen(true);
  };

  const handleEditSurvey = (survey: Survey) => {
    setSelectedSurvey(survey);
    setSurveyDrawerOpen(true);
  };

  const handleSaveSurvey = (survey: Survey) => {
    // Handle save logic here
    if (selectedSurvey) {
      onEditSurvey(survey.id);
    } else {
      onCreateSurvey();
    }
  };

  const handleApplyFilters = (newFilters: typeof filters) => {
    setFilters(newFilters);
    // Update legacy states for compatibility
    setSearchTerm(newFilters.searchText || '');
    setStatusFilter(newFilters.status && newFilters.status.length > 0 ? newFilters.status[0] : 'all');
    setSortBy(newFilters.sortBy || 'date');
  };

  const handleExport = async (format: string, options: any) => {
    // Simulate export
    await new Promise(resolve => setTimeout(resolve, 1500));
    // Export completed successfully
    toast.success(`تم تصدير الاستطلاعات بصيغة ${format} بنجاح`);
  };

  const activeFiltersCount = [
    filters.searchText,
    filters.status?.length,
    filters.organizations?.length,
    filters.categories?.length,
    filters.responseRange,
    filters.completionRate,
    filters.dateRange?.from
  ].filter(Boolean).length;

  // Calculate statistics for header
  const stats = [
    {
      title: 'إجمالي الاستبيانات',
      value: allSurveys.length,
      icon: FileText,
      color: 'text-[#183259]'
    },
    {
      title: 'الاستبيانات النشطة',
      value: allSurveys.filter(s => s.status === 'active').length,
      icon: CheckCircle,
      color: 'text-green-600'
    },
    {
      title: 'إجمالي الاستجابات',
      value: allSurveys.reduce((sum, s) => sum + s.responses, 0),
      icon: Users,
      color: 'text-purple-600'
    },
    {
      title: 'متوسط الاستجابة',
      value: `${Math.round(allSurveys.reduce((sum, s) => sum + s.responses, 0) / Math.max(allSurveys.length, 1))}`,
      icon: BarChart3,
      color: 'text-orange-600'
    }
  ];

  return (
    <AdminPageLayout
      title="الاستبيانات"
      description="إدارة ومتابعة استبيانات قياس الأثر الاجتماعي"
      icon={FileText}
      actions={
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => setExportDrawerOpen(true)}>
            <Download className="h-4 w-4 ml-2" />
            تصدير
          </Button>
          <Button onClick={handleCreateSurvey}>
            <Plus className="h-4 w-4 ml-2" />
            إنشاء استبيان جديد
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        {/* Statistics */}
        <StatCardGrid 
          stats={stats.map(stat => ({
            title: stat.title,
            value: stat.value,
            icon: stat.icon,
            iconColor: stat.color,
            iconBgColor: stat.color.replace('text-', 'bg-').replace('-600', '-50')
          }))} 
          columns={4} 
        />

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-500" />
                <span className="font-medium">الفلاتر والبحث</span>
                {hasActiveFilters && (
                  <span className="text-sm text-blue-600 bg-blue-50 px-2 py-1 rounded">
                    {filteredSurveys.length} نتيجة
                  </span>
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setFiltersDrawerOpen(true)}
                >
                  <Filter className="h-4 w-4 ml-1" />
                  فلاتر متقدمة
                  {activeFiltersCount > 0 && (
                    <span className="bg-primary text-primary-foreground rounded-full w-5 h-5 text-xs flex items-center justify-center mr-1">
                      {activeFiltersCount}
                    </span>
                  )}
                </Button>
                {hasActiveFilters && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearAllFilters}
                  >
                    <X className="h-4 w-4 ml-1" />
                    مسح الفلاتر
                  </Button>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
              {/* Main Search Field */}
              <div className="lg:col-span-2">
                <div className="relative">
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="البحث الشامل..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pr-10"
                  />
                </div>
              </div>
              
              {/* Response Count Filter */}
              <div>
                <Input
                  type="number"
                  placeholder="أدنى عدد ردود"
                  value={minResponses}
                  onChange={(e) => setMinResponses(e.target.value)}
                  className="text-center"
                />
              </div>

              {/* Title Filter */}
              <div>
                <Input
                  placeholder="فلترة بالعنوان"
                  value={titleFilter}
                  onChange={(e) => setTitleFilter(e.target.value)}
                />
              </div>

              {/* Date Filter */}
              <div>
                <Input
                  type="date"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="text-center"
                />
              </div>

              {/* Status and Sort Filters Row */}
              <div className="lg:col-span-6 grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 border-t">
                {/* Status Filter */}
                <div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="حالة الاستبيان" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">جميع الحالات</SelectItem>
                      <SelectItem value="active">نشط</SelectItem>
                      <SelectItem value="draft">مسودة</SelectItem>
                      <SelectItem value="completed">مكتمل</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Sort Filter */}
                <div>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger>
                      <SelectValue placeholder="ترتيب النتائج" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="date">الأحدث أولاً</SelectItem>
                      <SelectItem value="title">الترتيب الأبجدي</SelectItem>
                      <SelectItem value="responses">الأكثر رداً</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Quick Actions */}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearAllFilters}
                    className="flex-1"
                  >
                    <RefreshCw className="h-4 w-4 ml-1" />
                    إعادة تعيين
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Summary */}
        {hasActiveFilters && (
          <div className="flex items-center gap-4 text-sm text-gray-600 bg-blue-50 border border-blue-200 rounded-lg p-3">
            <span>عرض {filteredSurveys.length} من أصل {allSurveys.length} استبيان</span>
            <div className="flex gap-2 text-xs">
              {searchTerm && <span className="bg-white px-2 py-1 rounded">البحث: {searchTerm}</span>}
              {statusFilter !== 'all' && <span className="bg-white px-2 py-1 rounded">الحالة: {statusFilter}</span>}
              {minResponses && <span className="bg-white px-2 py-1 rounded">الردود: {minResponses}+</span>}
              {titleFilter && <span className="bg-white px-2 py-1 rounded">العنوان: {titleFilter}</span>}
              {dateFilter && <span className="bg-white px-2 py-1 rounded">التاريخ: {dateFilter}</span>}
            </div>
          </div>
        )}

        {/* Surveys Grid */}
        {filteredSurveys.length > 0 && (
          <>
            <motion.div 
              className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6"
              variants={staggerContainer}
              initial="initial"
              animate="animate"
            >
              {paginatedData.map((survey, index) => (
                <motion.div key={survey.id} variants={staggerItem}>
                  <SurveyCard 
                    survey={survey}
                    onViewSurvey={onViewSurvey}
                    onViewResults={onViewResults}
                    onEditSurvey={onEditSurvey}
                    onShareSurvey={handleShareSurvey}
                    onDeleteSurvey={onDeleteSurvey}
                  />
                </motion.div>
              ))}
            </motion.div>

            {/* Pagination */}
            {totalPages > 1 && (
              <TablePagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={totalItems}
                itemsPerPage={itemsPerPage}
                onPageChange={handlePageChange}
                onItemsPerPageChange={handleItemsPerPageChange}
                itemsPerPageOptions={[6, 12, 24, 48]}
              />
            )}
          </>
        )}

        {filteredSurveys.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {hasActiveFilters ? 'لا توجد نتائج' : 'لا توجد استبيانات'}
              </h3>
              <p className="text-gray-600 mb-6">
                {hasActiveFilters
                  ? 'لم يتم العثور على استبيانات تطابق معايير البحث والفلترة المحددة'
                  : 'ابدأ بإنشاء أول استبيان لقياس الأثر الاجتماعي'
                }
              </p>
              <div className="flex gap-3 justify-center">
                {hasActiveFilters && (
                  <Button onClick={clearAllFilters} variant="outline">
                    <X className="h-4 w-4 ml-2" />
                    مسح الفلاتر
                  </Button>
                )}
                {!hasActiveFilters && (
                  <Button onClick={onCreateSurvey}>
                    <Plus className="h-4 w-4 ml-2" />
                    إنشاء استبيان جديد
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Drawers */}
      <FiltersDrawer
        open={filtersDrawerOpen}
        onOpenChange={setFiltersDrawerOpen}
        filters={filters}
        onApplyFilters={handleApplyFilters}
        filterType="surveys"
      />

      <SurveyDrawer
        open={surveyDrawerOpen}
        onOpenChange={setSurveyDrawerOpen}
        survey={selectedSurvey}
        onSave={handleSaveSurvey}
        userRole={userRole === 'admin' ? 'admin' : 'org_manager'}
      />

      <ExportDrawer
        open={exportDrawerOpen}
        onOpenChange={setExportDrawerOpen}
        onExport={handleExport}
        exportType="surveys"
        data={{
          surveys: filteredSurveys,
          stats: stats,
          totalSurveys: allSurveys.length,
          activeSurveys: allSurveys.filter(s => s.status === 'active').length
        }}
      />
    </AdminPageLayout>
  );
}