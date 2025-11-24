import React, { useState } from 'react';
import { AdminPageLayout } from './shared/AdminPageLayout';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import {
  BarChart3,
  Users,
  FileText,
  TrendingUp,
  Calendar,
  Target,
  CheckCircle2,
  Clock,
  AlertCircle,
  ArrowUp,
  ArrowDown,
  Activity,
  Building2,
  UserCheck,
  Download
} from 'lucide-react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import type { UserRole } from '../constants/types';
import { Button } from './ui/button';

interface DashboardProps {
  userRole: UserRole;
}

export const Dashboard: React.FC<DashboardProps> = ({ userRole }) => {
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('month');

  // بيانات الإحصائيات الرئيسية
  const mainStats = [
    {
      title: 'إجمالي الاستطلاعات',
      value: '247',
      change: '+12.5%',
      trend: 'up',
      icon: FileText,
      color: '#18325A',
      bgColor: 'bg-[#18325A]/10',
      description: 'استطلاع نشط'
    },
    {
      title: 'المستفيدون الكلي',
      value: '3,842',
      change: '+23.1%',
      trend: 'up',
      icon: Users,
      color: '#10b981',
      bgColor: 'bg-green-50',
      description: 'مستفيد مسجل'
    },
    {
      title: 'معدل الاستجابة',
      value: '87.4%',
      change: '+5.2%',
      trend: 'up',
      icon: TrendingUp,
      color: '#8b5cf6',
      bgColor: 'bg-purple-50',
      description: 'متوسط الاستجابة'
    },
    {
      title: 'المنظمات النشطة',
      value: '42',
      change: '+8',
      trend: 'up',
      icon: Building2,
      color: '#f59e0b',
      bgColor: 'bg-amber-50',
      description: 'منظمة مسجلة'
    }
  ];

  // بيانات النشاط حسب الأدوار
  const activityByRole = {
    super_admin: [
      { title: 'تمت الموافقة على منظمة جديدة', time: 'منذ 30 دقيقة', type: 'success', icon: CheckCircle2 },
      { title: 'تحديث إعدادات النظام', time: 'منذ ساعتين', type: 'info', icon: Activity },
      { title: 'مراجعة تقارير المنظمات', time: 'منذ 3 ساعات', type: 'warning', icon: AlertCircle },
      { title: 'إضافة مدير جديد (أثرونا)', time: 'منذ 5 ساعات', type: 'success', icon: UserCheck },
      { title: 'تصدير التقارير الشهرية', time: 'منذ يوم واحد', type: 'info', icon: Download }
    ],
    admin: [
      { title: 'تم إنشاء استطلاع جديد', time: 'منذ ساعة', type: 'success', icon: FileText },
      { title: 'مراجعة نتائج الاستطلاعات', time: 'منذ ساعتين', type: 'info', icon: BarChart3 },
      { title: 'إضافة مدير منظمة جديد', time: 'منذ 4 ساعات', type: 'success', icon: Users },
      { title: 'تحليل البيانات الجديدة', time: 'منذ 6 ساعات', type: 'info', icon: Activity },
      { title: 'تصدير تقرير الأثر', time: 'منذ يوم واحد', type: 'success', icon: Download }
    ],
    org_manager: [
      { title: 'تم إكمال 15 استجابة جديدة', time: 'منذ 30 دقيقة', type: 'success', icon: CheckCircle2 },
      { title: 'مشاركة استطلاع مع المستفيدين', time: 'منذ ساعتين', type: 'info', icon: FileText },
      { title: 'تحديث معلومات المستفيدين', time: 'منذ 4 ساعات', type: 'info', icon: Users },
      { title: 'مراجعة نتائج الاستطلاع', time: 'منذ 5 ساعات', type: 'info', icon: BarChart3 },
      { title: 'طلب ترقية الباقة', time: 'منذ يوم واحد', type: 'warning', icon: TrendingUp }
    ],
    beneficiary: [
      { title: 'تم إكمال استطلاع جديد', time: 'منذ ساعة', type: 'success', icon: CheckCircle2 },
      { title: 'استلام استطلاع جديد', time: 'منذ 3 ساعات', type: 'info', icon: FileText }
    ]
  };

  // بيانات الرسوم البيانية - الاستطلاعات الشهرية
  const surveysByMonth = [
    { month: 'يناير', surveys: 18, responses: 345, completed: 298 },
    { month: 'فبراير', surveys: 22, responses: 423, completed: 389 },
    { month: 'مارس', surveys: 25, responses: 512, completed: 467 },
    { month: 'أبريل', surveys: 28, responses: 589, completed: 534 },
    { month: 'مايو', surveys: 32, responses: 678, completed: 612 },
    { month: 'يونيو', surveys: 29, responses: 634, completed: 587 }
  ];

  // بيانات معدل الاستجابة
  const responseRateData = [
    { week: 'الأسبوع 1', rate: 82 },
    { week: 'الأسبوع 2', rate: 85 },
    { week: 'الأسبوع 3', rate: 88 },
    { week: 'الأسبوع 4', rate: 87 }
  ];

  // بيانات توزيع الاستطلاعات حسب الحالة
  const surveyStatusData = [
    { name: 'نشط', value: 124, color: '#10b981' },
    { name: 'مكتمل', value: 98, color: '#8b5cf6' },
    { name: 'مسودة', value: 25, color: '#f59e0b' }
  ];

  // بيانات المنظمات الأكثر نشاطاً
  const topOrganizations = [
    { name: 'جمعية الأمل الخيرية', surveys: 45, responses: 823, rate: 92 },
    { name: 'مؤسسة التنمية المجتمعية', surveys: 38, responses: 712, rate: 89 },
    { name: 'جمعية الرعاية الاجتماعية', surveys: 32, responses: 645, rate: 86 },
    { name: 'مركز الدعم المجتمعي', surveys: 28, responses: 534, rate: 84 },
    { name: 'جمعية البر والإحسان', surveys: 24, responses: 467, rate: 81 }
  ];

  // بيانات النمو الشهري للمستفيدين
  const beneficiariesGrowth = [
    { month: 'يناير', total: 2845, new: 234 },
    { month: 'فبراير', total: 3079, new: 289 },
    { month: 'مارس', total: 3368, new: 312 },
    { month: 'أبريل', total: 3680, new: 345 },
    { month: 'مايو', total: 4025, new: 378 },
    { month: 'يونيو', total: 3842, new: 298 }
  ];

  const renderStatsCard = (stat: typeof mainStats[0], index: number) => {
    const Icon = stat.icon;
    const isPositive = stat.trend === 'up';

    return (
      <Card key={index} className="hover:shadow-lg transition-shadow duration-200">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
              <div className="flex items-baseline gap-2 mb-2">
                <h3 className="text-3xl" style={{ color: stat.color }}>
                  {stat.value}
                </h3>
                <div className={`flex items-center text-sm ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                  {isPositive ? (
                    <ArrowUp className="w-4 h-4 ml-1" />
                  ) : (
                    <ArrowDown className="w-4 h-4 ml-1" />
                  )}
                  <span>{stat.change}</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </div>
            <div className={`p-3 rounded-lg ${stat.bgColor}`}>
              <Icon className="w-6 h-6" style={{ color: stat.color }} />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderActivityItem = (activity: any, index: number) => {
    const Icon = activity.icon;
    const colors = {
      success: 'bg-green-100 text-green-800',
      info: 'bg-blue-100 text-blue-800',
      warning: 'bg-amber-100 text-amber-800'
    };

    return (
      <div key={index} className="flex items-start gap-3 pb-4 mb-4 border-b last:border-b-0 last:pb-0 last:mb-0">
        <div className={`p-2 rounded-lg ${colors[activity.type as keyof typeof colors]}`}>
          <Icon className="w-4 h-4" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm">{activity.title}</p>
          <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
        </div>
      </div>
    );
  };

  const currentActivities = activityByRole[userRole] || activityByRole.org_manager;

  return (
    <AdminPageLayout
      title="لوحة التحكم"
      description="نظرة شاملة على أداء المنصة والأنشطة الحالية"
    >
      <div className="space-y-6">
        {/* فلتر الفترة الزمنية */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">عرض البيانات:</span>
          </div>
          <div className="flex gap-2">
            {(['week', 'month', 'year'] as const).map((period) => (
              <Button
                key={period}
                variant={selectedPeriod === period ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedPeriod(period)}
              >
                {period === 'week' ? 'أسبوعي' : period === 'month' ? 'شهري' : 'سنوي'}
              </Button>
            ))}
          </div>
        </div>

        {/* البطاقات الإحصائية الرئيسية */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {mainStats.map((stat, index) => renderStatsCard(stat, index))}
        </div>

        {/* التبويبات */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 lg:w-auto">
            <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
            <TabsTrigger value="surveys">الاستطلاعات</TabsTrigger>
            <TabsTrigger value="organizations">المنظمات</TabsTrigger>
            <TabsTrigger value="beneficiaries">المستفيدون</TabsTrigger>
          </TabsList>

          {/* نظرة عامة */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* الرسم البياني الرئيسي */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    أداء الاستطلاعات - آخر 6 أشهر
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={surveysByMonth}>
                      <defs>
                        <linearGradient id="colorSurveys" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#18325A" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#18325A" stopOpacity={0.1}/>
                        </linearGradient>
                        <linearGradient id="colorResponses" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Area 
                        type="monotone" 
                        dataKey="surveys" 
                        stroke="#18325A" 
                        fillOpacity={1} 
                        fill="url(#colorSurveys)"
                        name="الاستطلاعات"
                      />
                      <Area 
                        type="monotone" 
                        dataKey="completed" 
                        stroke="#10b981" 
                        fillOpacity={1} 
                        fill="url(#colorResponses)"
                        name="المكتملة"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* النشاطات الأخيرة */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    النشاطات الأخيرة
                  </CardTitle>
                </CardHeader>
                <CardContent className="max-h-[300px] overflow-y-auto">
                  <div className="space-y-4">
                    {currentActivities.map((activity, index) => renderActivityItem(activity, index))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* صف ثاني من الرسوم البيانية */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* معدل الاستجابة */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    معدل الاستجابة الأسبوعي
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={responseRateData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="week" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip />
                      <Line 
                        type="monotone" 
                        dataKey="rate" 
                        stroke="#8b5cf6" 
                        strokeWidth={3}
                        dot={{ fill: '#8b5cf6', r: 5 }}
                        name="معدل الاستجابة (%)"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* توزيع حالة الاستطلاعات */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    توزيع حالة الاستطلاعات
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={surveyStatusData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {surveyStatusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* تبويب الاستطلاعات */}
          <TabsContent value="surveys" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>الاستطلاعات الشهرية - التفاصيل</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={surveysByMonth}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="surveys" fill="#18325A" name="الاستطلاعات" />
                    <Bar dataKey="responses" fill="#10b981" name="الاستجابات" />
                    <Bar dataKey="completed" fill="#8b5cf6" name="المكتملة" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {/* تبويب المنظمات */}
          <TabsContent value="organizations" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>المنظمات الأكثر نشاطاً</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topOrganizations.map((org, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#18325A] text-white">
                            {index + 1}
                          </div>
                          <div>
                            <p className="font-medium">{org.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {org.surveys} استطلاع • {org.responses} استجابة
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="text-left">
                        <p className="text-2xl font-bold text-green-600">{org.rate}%</p>
                        <p className="text-xs text-muted-foreground">معدل الاستجابة</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* تبويب المستفيدين */}
          <TabsContent value="beneficiaries" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>نمو قاعدة المستفيدين</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <AreaChart data={beneficiariesGrowth}>
                    <defs>
                      <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#18325A" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#18325A" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area 
                      type="monotone" 
                      dataKey="total" 
                      stroke="#18325A" 
                      fillOpacity={1} 
                      fill="url(#colorTotal)"
                      name="إجمالي المستفيدين"
                    />
                    <Bar dataKey="new" fill="#10b981" name="المستفيدون الجدد" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* إحصائيات سريعة إضافية */}
        {userRole === 'super_admin' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-blue-50">
                    <Clock className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">متوسط وقت الاستجابة</p>
                    <p className="text-2xl">4.2 دقيقة</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-green-50">
                    <CheckCircle2 className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">معدل الإكمال</p>
                    <p className="text-2xl">91.2%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-purple-50">
                    <Target className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">مؤشر رضا المستخدمين</p>
                    <p className="text-2xl">4.7/5</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </AdminPageLayout>
  );
};
