import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { AdminPageLayout } from './shared/AdminPageLayout';
import { TransactionDrawer } from './shared/TransactionDrawer';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { 
  Check, 
  X, 
  Star, 
  CreditCard, 
  Users,
  BarChart3,
  Crown,
  Building,
  AlertCircle,
  Edit,
  Plus,
  Save,
  Trash2,
  Package,
  TrendingUp,
  Eye,
  MoreHorizontal,
  DollarSign
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

type UserRole = 'super_admin' | 'admin' | 'org_manager' | 'beneficiary';

interface SubscriptionPageProps {
  userRole?: UserRole;
}

interface PlanFeature {
  name: string;
  included: boolean;
  limit?: string;
}

interface Plan {
  id: string;
  name: string;
  description: string;
  monthlyPrice: number;
  yearlyPrice: number;
  popular?: boolean;
  features: PlanFeature[];
  icon: React.ComponentType<any>;
  color: string;
}

interface Organization {
  id: string;
  name: string;
  users: number;
  planType: string;
  surveyQuota: number;
  surveyConsumed: number;
  surveyRemaining: number;
  joinDate: string;
  status: 'active' | 'suspended' | 'pending';
}

interface Transaction {
  id: string;
  organizationId: string;
  organizationName: string;
  paymentMethod: string;
  date: string;
  time: string;
  amount: number;
  status: 'completed' | 'pending' | 'failed';
  type: 'subscription' | 'upgrade' | 'renewal';
  description?: string;
  paymentDetails?: {
    cardNumber?: string;
    cardHolderName?: string;
    expiryDate?: string;
    bankName?: string;
    accountNumber?: string;
    transferNumber?: string;
    [key: string]: any;
  };
}

// Demo organizations data
const demoOrganizations: Organization[] = [
  {
    id: '1',
    name: 'مؤسسة الخير الإنساني',
    users: 12,
    planType: 'احترافي',
    surveyQuota: 100,
    surveyConsumed: 45,
    surveyRemaining: 55,
    joinDate: '2024-01-15',
    status: 'active'
  },
  {
    id: '2',
    name: 'شركة المسؤولية الاجتماعية',
    users: 25,
    planType: 'مؤسسي',
    surveyQuota: 500,
    surveyConsumed: 320,
    surveyRemaining: 180,
    joinDate: '2023-11-20',
    status: 'active'
  },
  {
    id: '3',
    name: 'وزارة التنمية الاجتماعية',
    users: 50,
    planType: 'مؤسسي',
    surveyQuota: 1000,
    surveyConsumed: 650,
    surveyRemaining: 350,
    joinDate: '2023-08-10',
    status: 'active'
  },
  {
    id: '4',
    name: 'جمعية الرعاية الصحية',
    users: 8,
    planType: 'أساسي',
    surveyQuota: 20,
    surveyConsumed: 15,
    surveyRemaining: 5,
    joinDate: '2024-02-28',
    status: 'suspended'
  },
  {
    id: '5',
    name: 'مؤسسة التعليم للجميع',
    users: 6,
    planType: 'أساسي',
    surveyQuota: 20,
    surveyConsumed: 3,
    surveyRemaining: 17,
    joinDate: '2024-03-05',
    status: 'pending'
  }
];

// Demo transactions data
const demoTransactions: Transaction[] = [
  {
    id: '1',
    organizationId: '1',
    organizationName: 'مؤسسة الخير الإنساني',
    paymentMethod: 'بطاقة ائتمان',
    date: '2024-03-15',
    time: '14:30',
    amount: 299,
    status: 'completed',
    type: 'subscription',
    description: 'اشتراك شهري - الخطة الاحترافية'
  },
  {
    id: '2',
    organizationId: '2',
    organizationName: 'شركة المسؤولية الاجتماعية',
    paymentMethod: 'PayTabs',
    date: '2024-03-14',
    time: '09:15',
    amount: 7990,
    status: 'completed',
    type: 'subscription',
    description: 'اشتراك سنوي - خطة المؤسسات'
  },
  {
    id: '3',
    organizationId: '3',
    organizationName: 'وزارة التنمية الاجتماعية',
    paymentMethod: 'تحويل بنكي',
    date: '2024-03-13',
    time: '11:45',
    amount: 799,
    status: 'pending',
    type: 'renewal',
    description: 'تجديد الاشتراك - دفعة إضافية'
  },
  {
    id: '4',
    organizationId: '4',
    organizationName: 'جمعية الرعاية الصحية',
    paymentMethod: 'بطاقة مدى',
    date: '2024-03-12',
    time: '16:20',
    amount: 99,
    status: 'completed',
    type: 'subscription',
    description: 'اشتراك شهري - الخطة الأساسية'
  },
  {
    id: '5',
    organizationId: '5',
    organizationName: 'مؤسسة التعليم للجميع',
    paymentMethod: 'Apple Pay',
    date: '2024-03-11',
    time: '13:10',
    amount: 299,
    status: 'failed',
    type: 'upgrade',
    description: 'ترقية إلى الخطة الاحترافية'
  },
  {
    id: '6',
    organizationId: '1',
    organizationName: 'مركز التطوير المجتمعي',
    paymentMethod: 'PayTabs',
    date: '2024-03-10',
    time: '10:30',
    amount: 2990,
    status: 'completed',
    type: 'subscription',
    description: 'اشتراك سنوي - الخطة الاحترافية'
  }
];

export function SubscriptionPage({ userRole }: SubscriptionPageProps) {
  const [plans, setPlans] = useState<Plan[]>([
    {
      id: 'basic',
      name: 'الخطة الأساسية',
      description: 'مثالية للمنظمات الصغيرة والناشئة',
      monthlyPrice: 99,
      yearlyPrice: 990,
      icon: Users,
      color: 'text-blue-600',
      features: [
        { name: 'حتى 5 استبيانات شهرياً', included: true },
        { name: 'حتى 500 استجابة شهرياً', included: true },
        { name: 'التقارير الأساسية', included: true },
        { name: 'دعم فني عبر البريد الإلكتروني', included: true },
        { name: 'المساعد الذكي', included: false },
        { name: 'التحليلات المتقدمة', included: false },
        { name: 'التخصيص المتقدم', included: false },
        { name: 'API متقدم', included: false }
      ]
    },
    {
      id: 'professional',
      name: 'الخطة الاحترافية',
      description: 'للمنظمات المتوسطة التي تحتاج ميزات متقدمة',
      monthlyPrice: 299,
      yearlyPrice: 2990,
      popular: true,
      icon: BarChart3,
      color: 'text-[#183259]',
      features: [
        { name: 'استبيانات غير محدودة', included: true },
        { name: 'حتى 5,000 استجابة شهرياً', included: true },
        { name: 'التقارير المتقدمة', included: true },
        { name: 'المساعد الذكي', included: true },
        { name: 'التحليلات المتقدمة', included: true },
        { name: 'دعم فني عبر الهاتف والبريد', included: true },
        { name: 'التخصيص المتقدم', included: false },
        { name: 'API متقدم', included: false }
      ]
    },
    {
      id: 'enterprise',
      name: 'خطة المؤسسات',
      description: 'للمؤسسات الكبيرة مع احتياجات مخصصة',
      monthlyPrice: 799,
      yearlyPrice: 7990,
      icon: Crown,
      color: 'text-purple-600',
      features: [
        { name: 'استبيانات غير محدودة', included: true },
        { name: 'استجابات غير محدودة', included: true },
        { name: 'جميع أنواع التقارير', included: true },
        { name: 'المساعد الذكي المتقدم', included: true },
        { name: 'التحليلات المتقدمة والتنبؤية', included: true },
        { name: 'التخصيص الكامل', included: true },
        { name: 'API متقدم', included: true },
        { name: 'دعم فني مخصص 24/7', included: true }
      ]
    }
  ]);

  const [organizations] = useState<Organization[]>(demoOrganizations);
  const [transactions, setTransactions] = useState<Transaction[]>(demoTransactions);
  const [isYearly, setIsYearly] = useState(false);
  const [activeTab, setActiveTab] = useState('plans');
  const [isEditPlanOpen, setIsEditPlanOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  
  // Transaction Drawer states
  const [transactionDrawerOpen, setTransactionDrawerOpen] = useState(false);
  const [transactionDrawerMode, setTransactionDrawerMode] = useState<'view' | 'add' | 'edit'>('view');
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isDeleteTransactionOpen, setIsDeleteTransactionOpen] = useState(false);

  // Plan editing states
  const [editPlanData, setEditPlanData] = useState({
    name: '',
    description: '',
    monthlyPrice: 0,
    yearlyPrice: 0,
    features: [] as PlanFeature[]
  });

  const handleEditPlan = (plan: Plan) => {
    setEditingPlan(plan);
    setEditPlanData({
      name: plan.name,
      description: plan.description,
      monthlyPrice: plan.monthlyPrice,
      yearlyPrice: plan.yearlyPrice,
      features: [...plan.features]
    });
    setIsEditPlanOpen(true);
  };

  const handleSavePlanEdit = () => {
    if (!editingPlan) return;

    setPlans(prev => prev.map(plan => 
      plan.id === editingPlan.id ? {
        ...plan,
        name: editPlanData.name,
        description: editPlanData.description,
        monthlyPrice: editPlanData.monthlyPrice,
        yearlyPrice: editPlanData.yearlyPrice,
        features: editPlanData.features
      } : plan
    ));

    setIsEditPlanOpen(false);
    setEditingPlan(null);
    toast.success('تم تحديث الباقة بنجاح');
  };

  const handleAddFeature = () => {
    setEditPlanData(prev => ({
      ...prev,
      features: [...prev.features, { name: '', included: true }]
    }));
  };

  const handleUpdateFeature = (index: number, field: keyof PlanFeature, value: any) => {
    setEditPlanData(prev => ({
      ...prev,
      features: prev.features.map((feature, i) => 
        i === index ? { ...feature, [field]: value } : feature
      )
    }));
  };

  const handleRemoveFeature = (index: number) => {
    setEditPlanData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'نشط';
      case 'suspended': return 'معلق';
      case 'pending': return 'في الانتظار';
      default: return status;
    }
  };

  const getTransactionStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTransactionStatusLabel = (status: string) => {
    switch (status) {
      case 'completed': return 'مكتملة';
      case 'pending': return 'قيد المعالجة';
      case 'failed': return 'فاشلة';
      default: return status;
    }
  };

  const getTotalRevenue = () => {
    return transactions
      .filter(t => t.status === 'completed')
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const getCompletedTransactionsCount = () => {
    return transactions.filter(t => t.status === 'completed').length;
  };

  const resetTransactionData = () => {
    setNewTransactionData({
      organizationId: '',
      paymentMethod: '',
      amount: 0,
      description: '',
      // Payment details fields
      cardNumber: '',
      cardHolderName: '',
      expiryDate: '',
      cvv: '',
      bankName: '',
      accountNumber: '',
      routingNumber: '',
      paypalEmail: '',
      transactionId: ''
    });
  };

  const handleCreateTransaction = () => {
    if (!newTransactionData.organizationId || !newTransactionData.paymentMethod || newTransactionData.amount <= 0) {
      toast.error('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    const selectedOrg = organizations.find(org => org.id === newTransactionData.organizationId);
    if (!selectedOrg) {
      toast.error('المنظمة المحددة غير صحيحة');
      return;
    }

    // Validate payment details based on method
    if (newTransactionData.paymentMethod === 'بطاقة ائتمان' || newTransactionData.paymentMethod === 'بطاقة مدى') {
      if (!newTransactionData.cardNumber || !newTransactionData.cardHolderName || !newTransactionData.expiryDate || !newTransactionData.cvv) {
        toast.error('يرجى ملء جميع بيانات البطاقة');
        return;
      }
    } else if (newTransactionData.paymentMethod === 'تحويل بنكي') {
      if (!newTransactionData.bankName || !newTransactionData.accountNumber) {
        toast.error('يرجى ملء بيانات البنك');
        return;
      }
    }

    // Here you would normally send the data to your backend
    resetTransactionData();
    setIsNewTransactionOpen(false);
    toast.success('تم إنشاء المعاملة بنجاح');
  };

  // Function to render payment details fields based on selected method
  const renderPaymentDetailsFields = () => {
    switch (newTransactionData.paymentMethod) {
      case 'بطاقة ائتمان':
      case 'بطاقة مدى':
        return (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="card-number">رقم البطاقة *</Label>
                <Input
                  id="card-number"
                  value={newTransactionData.cardNumber}
                  onChange={(e) => setNewTransactionData(prev => ({ ...prev, cardNumber: e.target.value }))}
                  placeholder="1234 5678 9012 3456"
                  className="text-right"
                />
              </div>
              <div>
                <Label htmlFor="card-holder">اسم حامل البطاقة *</Label>
                <Input
                  id="card-holder"
                  value={newTransactionData.cardHolderName}
                  onChange={(e) => setNewTransactionData(prev => ({ ...prev, cardHolderName: e.target.value }))}
                  placeholder="اسم حامل البطاقة"
                  className="text-right"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="expiry">تاريخ الانتهاء *</Label>
                <Input
                  id="expiry"
                  value={newTransactionData.expiryDate}
                  onChange={(e) => setNewTransactionData(prev => ({ ...prev, expiryDate: e.target.value }))}
                  placeholder="MM/YY"
                  className="text-right"
                />
              </div>
              <div>
                <Label htmlFor="cvv">رمز الأمان *</Label>
                <Input
                  id="cvv"
                  value={newTransactionData.cvv}
                  onChange={(e) => setNewTransactionData(prev => ({ ...prev, cvv: e.target.value }))}
                  placeholder="123"
                  className="text-right"
                />
              </div>
            </div>
          </>
        );
      case 'تحويل بنكي':
        return (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="bank-name">اسم البنك *</Label>
                <Select 
                  value={newTransactionData.bankName} 
                  onValueChange={(value) => setNewTransactionData(prev => ({ ...prev, bankName: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر البنك" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="��لراجحي">الراجحي</SelectItem>
                    <SelectItem value="الأهلي">الأهلي</SelectItem>
                    <SelectItem value="الرياض">الرياض</SelectItem>
                    <SelectItem value="سامبا">سامبا</SelectItem>
                    <SelectItem value="البلاد">البلاد</SelectItem>
                    <SelectItem value="الإنماء">الإنماء</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="account-number">رقم الحساب *</Label>
                <Input
                  id="account-number"
                  value={newTransactionData.accountNumber}
                  onChange={(e) => setNewTransactionData(prev => ({ ...prev, accountNumber: e.target.value }))}
                  placeholder="SA0000000000000000000000"
                  className="text-right"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="routing-number">IBAN</Label>
              <Input
                id="routing-number"
                value={newTransactionData.routingNumber}
                onChange={(e) => setNewTransactionData(prev => ({ ...prev, routingNumber: e.target.value }))}
                placeholder="SA0000000000000000000000"
                className="text-right"
              />
            </div>
          </>
        );
      case 'PayTabs':
      case 'STC Pay':
      case 'Apple Pay':
        return (
          <div>
            <Label htmlFor="transaction-id">معرف المعاملة</Label>
            <Input
              id="transaction-id"
              value={newTransactionData.transactionId}
              onChange={(e) => setNewTransactionData(prev => ({ ...prev, transactionId: e.target.value }))}
              placeholder="TXN_123456789"
              className="text-right"
            />
          </div>
        );
      default:
        return null;
    }
  };

  const headerStats = (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
      <div className="bg-white/10 rounded-lg p-6">
        <div className="flex items-center gap-3">
          <Package className="h-8 w-8 text-white" />
          <div>
            <div className="text-3xl font-bold text-white">{plans.length}</div>
            <div className="text-blue-200">باقات متاحة</div>
          </div>
        </div>
      </div>
      <div className="bg-white/10 rounded-lg p-6">
        <div className="flex items-center gap-3">
          <DollarSign className="h-8 w-8 text-white" />
          <div>
            <div className="text-3xl font-bold text-white">{getTotalRevenue().toLocaleString()}</div>
            <div className="text-blue-200">إجمالي الإيرادات (ريال)</div>
          </div>
        </div>
      </div>
    </div>
  );

  // Transaction Drawer handlers
  const openAddTransactionDrawer = () => {
    setSelectedTransaction(null);
    setTransactionDrawerMode('add');
    setTransactionDrawerOpen(true);
  };

  const handleViewTransaction = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setTransactionDrawerMode('view');
    setTransactionDrawerOpen(true);
  };

  const handleEditTransaction = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setTransactionDrawerMode('edit');
    setTransactionDrawerOpen(true);
  };

  const handleDeleteTransaction = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsDeleteTransactionOpen(true);
  };

  const handleSaveTransaction = (transaction: Transaction) => {
    if (transactionDrawerMode === 'add') {
      setTransactions(prev => [transaction, ...prev]);
      toast.success('تم إضافة المعاملة بنجاح');
    } else if (transactionDrawerMode === 'edit') {
      setTransactions(prev => 
        prev.map(t => t.id === transaction.id ? transaction : t)
      );
      toast.success('تم تحديث المعاملة بنجاح');
    }
    setTransactionDrawerOpen(false);
  };

  const confirmDeleteTransaction = () => {
    if (selectedTransaction) {
      setTransactions(prev => prev.filter(t => t.id !== selectedTransaction.id));
      toast.success(`تم حذف المعاملة ${selectedTransaction.id} بنجاح`);
      setIsDeleteTransactionOpen(false);
      setSelectedTransaction(null);
    }
  };

  return (
    <AdminPageLayout
      title="إدارة الاشتراكات"
      description="إدارة الباقات ومراقبة اشتراكات المنظمات"
      icon={CreditCard}
    >
      <div className="space-y-6">
        {/* Tabs Navigation */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="plans" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              إدارة الباقات
            </TabsTrigger>
            <TabsTrigger value="transactions" className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              المعاملات
            </TabsTrigger>
          </TabsList>

          {/* Plans Management Tab */}
          <TabsContent value="plans" className="space-y-6">
            {/* Billing Toggle */}
            <div className="flex items-center justify-center gap-4">
              <Label htmlFor="billing-toggle" className={!isYearly ? 'font-semibold' : ''}>
                شهري
              </Label>
              <Switch
                id="billing-toggle"
                checked={isYearly}
                onCheckedChange={setIsYearly}
              />
              <Label htmlFor="billing-toggle" className={isYearly ? 'font-semibold' : ''}>
                سنوي
              </Label>
              {isYearly && (
                <Badge variant="destructive" className="mr-2">
                  وفر 17%
                </Badge>
              )}
            </div>

            {/* Plans Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto">
              {plans.map((plan) => (
                <Card 
                  key={plan.id} 
                  className={`relative ${plan.popular ? 'border-[#183259] border-2 shadow-xl' : ''}`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-[#183259] text-white px-4 py-1">
                        <Star className="h-3 w-3 ml-1" />
                        الأكثر شعبية
                      </Badge>
                    </div>
                  )}

                  <CardHeader className="text-center pb-6 pt-8">
                    <div className={`inline-flex p-3 rounded-full bg-gray-50 w-fit mx-auto mb-4`}>
                      <plan.icon className={`h-8 w-8 ${plan.color}`} />
                    </div>
                    <CardTitle className="text-xl">{plan.name}</CardTitle>
                    <p className="text-gray-600 text-sm mt-2">{plan.description}</p>
                    
                    <div className="mt-6">
                      <div className="flex items-baseline justify-center">
                        <span className={`text-4xl font-bold text-[#183259]`}>
                          {Math.round(isYearly ? plan.yearlyPrice : plan.monthlyPrice)}
                        </span>
                        <span className="text-gray-500 mr-1">ريال</span>
                        <span className="text-gray-500 text-sm">
                          /{isYearly ? 'سنة' : 'شهر'}
                        </span>
                      </div>
                      
                      {isYearly && (
                        <p className="text-sm text-gray-500 mt-1">
                          ({Math.round(plan.yearlyPrice / 12)} ريال/شهر)
                        </p>
                      )}
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <ul className="space-y-3">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-3">
                          {feature.included ? (
                            <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                          ) : (
                            <X className="h-5 w-5 text-gray-300 mt-0.5 flex-shrink-0" />
                          )}
                          <span className={`text-sm ${feature.included ? '' : 'text-gray-400'}`}>
                            {feature.name}
                          </span>
                        </li>
                      ))}
                    </ul>

                    <Button
                      onClick={() => handleEditPlan(plan)}
                      variant="outline"
                      className="w-full mt-6"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      تعديل الباقة
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Transactions Tab */}
          <TabsContent value="transactions" className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">إدارة المعاملات</h3>
              <Button 
                onClick={() => openAddTransactionDrawer()}
                className="bg-[#183259] hover:bg-[#2a4a7a] transition-all duration-200 hover:shadow-lg hover:scale-105"
              >
                <Plus className="h-4 w-4 mr-2" />
                إجراء معاملة جديدة
              </Button>
            </div>

            <Card className="overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50/50">
                      <TableHead className="text-right">اسم المنظمة</TableHead>
                      <TableHead className="text-right">طريقة الدفع</TableHead>
                      <TableHead className="text-right">التاريخ والوقت</TableHead>
                      <TableHead className="text-right">المبلغ الإجمالي</TableHead>
                      <TableHead className="text-right">الحالة</TableHead>
                      <TableHead className="text-right">الوصف</TableHead>
                      <TableHead className="text-right">الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.map((transaction) => (
                      <TableRow 
                        key={transaction.id}
                        className="group hover:bg-blue-50/50 transition-all duration-200 ease-in-out cursor-pointer"
                        onClick={() => handleViewTransaction(transaction)}
                      >
                        <TableCell className="font-medium group-hover:text-[#18325A] transition-colors duration-200">
                          {transaction.organizationName}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="group-hover:border-[#18325A]/30 transition-colors duration-200">
                            {transaction.paymentMethod}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span>{transaction.date}</span>
                            <span className="text-sm text-gray-500">{transaction.time}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="font-semibold text-[#18325A]">{transaction.amount.toLocaleString()} ريال</span>
                        </TableCell>
                        <TableCell>
                          <Badge className={`${getTransactionStatusColor(transaction.status)} group-hover:shadow-sm transition-shadow duration-200`}>
                            {getTransactionStatusLabel(transaction.status)}
                          </Badge>
                        </TableCell>
                        <TableCell className="max-w-xs truncate text-gray-600">
                          {transaction.description}
                        </TableCell>
                        <TableCell onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-blue-600 hover:text-blue-800 hover:bg-blue-50 hover:scale-110 transition-all duration-200"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleViewTransaction(transaction);
                              }}
                              title="عرض التفاصيل"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-green-600 hover:text-green-800 hover:bg-green-50 hover:scale-110 transition-all duration-200"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditTransaction(transaction);
                              }}
                              title="تعديل المعاملة"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-red-600 hover:text-red-800 hover:bg-red-50 hover:scale-110 transition-all duration-200"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteTransaction(transaction);
                              }}
                              title="حذف المعاملة"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Edit Plan Dialog */}
        <Dialog open={isEditPlanOpen} onOpenChange={setIsEditPlanOpen}>
          <DialogContent className="max-w-full sm:max-w-2xl mx-4" dir="rtl">
            <DialogHeader>
              <DialogTitle>تعديل الباقة</DialogTitle>
              <DialogDescription>
                قم بتعديل تفاصيل الباقة والميزات المتاحة
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="plan-name">اسم الباقة</Label>
                  <Input
                    id="plan-name"
                    value={editPlanData.name}
                    onChange={(e) => setEditPlanData(prev => ({ ...prev, name: e.target.value }))}
                    className="text-right"
                  />
                </div>
                <div>
                  <Label htmlFor="plan-description">الوصف</Label>
                  <Input
                    id="plan-description"
                    value={editPlanData.description}
                    onChange={(e) => setEditPlanData(prev => ({ ...prev, description: e.target.value }))}
                    className="text-right"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="monthly-price">السعر الشهري (ريال)</Label>
                  <Input
                    id="monthly-price"
                    type="number"
                    value={editPlanData.monthlyPrice}
                    onChange={(e) => setEditPlanData(prev => ({ ...prev, monthlyPrice: parseFloat(e.target.value) || 0 }))}
                    className="text-right"
                  />
                </div>
                <div>
                  <Label htmlFor="yearly-price">السعر السنوي (ريال)</Label>
                  <Input
                    id="yearly-price"
                    type="number"
                    value={editPlanData.yearlyPrice}
                    onChange={(e) => setEditPlanData(prev => ({ ...prev, yearlyPrice: parseFloat(e.target.value) || 0 }))}
                    className="text-right"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-3">
                  <Label>الميزات</Label>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm"
                    onClick={handleAddFeature}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    إضافة ميزة
                  </Button>
                </div>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {editPlanData.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2 p-3 border rounded-lg">
                      <Input
                        value={feature.name}
                        onChange={(e) => handleUpdateFeature(index, 'name', e.target.value)}
                        placeholder="اسم الميزة"
                        className="flex-1 text-right"
                      />
                      <div className="flex items-center gap-2">
                        <Label htmlFor={`feature-${index}`} className="text-sm">
                          متاحة
                        </Label>
                        <Switch
                          id={`feature-${index}`}
                          checked={feature.included}
                          onCheckedChange={(checked) => handleUpdateFeature(index, 'included', checked)}
                        />
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveFeature(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button onClick={handleSavePlanEdit} className="flex-1 bg-[#183259] hover:bg-[#2a4a7a]">
                  <Save className="h-4 w-4 mr-2" />
                  حفظ التغييرات
                </Button>
                <Button variant="outline" onClick={() => {
                  setIsEditPlanOpen(false);
                  setEditingPlan(null);
                }} className="flex-1">
                  إلغاء
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Transaction Drawer */}
        <TransactionDrawer
          open={transactionDrawerOpen}
          onOpenChange={setTransactionDrawerOpen}
          transaction={selectedTransaction}
          mode={transactionDrawerMode}
          organizations={organizations.map(org => ({ id: org.id, name: org.name }))}
          onSave={handleSaveTransaction}
        />

        {/* Delete Confirmation Dialog */}
        <Dialog open={isDeleteTransactionOpen} onOpenChange={setIsDeleteTransactionOpen}>
          <DialogContent className="max-w-full sm:max-w-md mx-4" dir="rtl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-red-600">
                <AlertCircle className="h-5 w-5" />
                تأكيد حذف المعاملة
              </DialogTitle>
              <DialogDescription>
                هل أنت ��تأكد من رغبتك في حذف هذه المعاملة؟ لا يمكن التراجع عن هذا الإجراء.
              </DialogDescription>
            </DialogHeader>
            {selectedTransaction && (
              <div className="space-y-4">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">المنظمة:</span>
                      <span className="text-sm">{selectedTransaction.organizationName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">المبلغ:</span>
                      <span className="text-sm font-semibold">{selectedTransaction.amount.toLocaleString()} ريال</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">التاريخ:</span>
                      <span className="text-sm">{selectedTransaction.date}</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button 
                    onClick={confirmDeleteTransaction}
                    variant="destructive"
                    className="flex-1"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    نعم، احذف المعاملة
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setIsDeleteTransactionOpen(false);
                      setSelectedTransaction(null);
                    }}
                    className="flex-1"
                  >
                    إلغاء
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminPageLayout>
  );
}