import React, { useState, useEffect } from 'react';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from '../ui/drawer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { Card, CardContent } from '../ui/card';
import { Separator } from '../ui/separator';
import {
  CreditCard,
  Building2,
  Calendar,
  DollarSign,
  FileText,
  CheckCircle2,
  Info,
  Save,
  X,
  Receipt,
  User,
  Hash
} from 'lucide-react';

interface Transaction {
  id: string;
  organizationId: string;
  organizationName: string;
  amount: number;
  paymentMethod: string;
  date: string;
  time: string;
  status: 'completed' | 'pending' | 'failed';
  description?: string;
  type: 'subscription' | 'renewal' | 'upgrade';
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

interface TransactionDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transaction: Transaction | null;
  mode: 'view' | 'add' | 'edit';
  organizations?: Array<{ id: string; name: string }>;
  onSave?: (transaction: Transaction) => void;
}

export function TransactionDrawer({
  open,
  onOpenChange,
  transaction,
  mode,
  organizations = [],
  onSave
}: TransactionDrawerProps) {
  const [formData, setFormData] = useState<Partial<Transaction>>({
    organizationId: '',
    organizationName: '',
    amount: 0,
    paymentMethod: '',
    status: 'completed',
    description: '',
    type: 'subscription',
    paymentDetails: {}
  });

  useEffect(() => {
    if (transaction && mode !== 'add') {
      setFormData(transaction);
    } else if (mode === 'add') {
      setFormData({
        organizationId: '',
        organizationName: '',
        amount: 0,
        paymentMethod: '',
        status: 'completed',
        description: '',
        type: 'subscription',
        paymentDetails: {}
      });
    }
  }, [transaction, mode, open]);

  const handleSave = () => {
    if (!formData.organizationId || !formData.amount || !formData.paymentMethod) {
      return;
    }

    const selectedOrg = organizations.find(org => org.id === formData.organizationId);
    
    const transactionToSave: Transaction = {
      id: transaction?.id || `TXN-${Date.now()}`,
      organizationId: formData.organizationId,
      organizationName: selectedOrg?.name || formData.organizationName || '',
      amount: formData.amount,
      paymentMethod: formData.paymentMethod,
      date: transaction?.date || new Date().toLocaleDateString('ar-SA'),
      time: transaction?.time || new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
      status: formData.status || 'completed',
      description: formData.description || '',
      type: formData.type || 'subscription',
      paymentDetails: formData.paymentDetails
    };

    onSave?.(transactionToSave);
    onOpenChange(false);
  };

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const updatePaymentDetails = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      paymentDetails: { ...prev.paymentDetails, [field]: value }
    }));
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      completed: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      failed: 'bg-red-100 text-red-800'
    };
    const labels = {
      completed: 'مكتملة',
      pending: 'قيد المعالجة',
      failed: 'فاشلة'
    };
    return (
      <Badge className={colors[status as keyof typeof colors]}>
        {labels[status as keyof typeof labels]}
      </Badge>
    );
  };

  const renderPaymentDetailsFields = () => {
    const method = formData.paymentMethod;

    if (!method) return null;

    switch (method) {
      case 'بطاقة ائتمان':
      case 'بطاقة مدى':
        return (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>رقم البطاقة</Label>
              <Input
                value={formData.paymentDetails?.cardNumber || ''}
                onChange={(e) => updatePaymentDetails('cardNumber', e.target.value)}
                placeholder="**** **** **** ****"
                disabled={mode === 'view'}
                className="text-right"
              />
            </div>
            <div>
              <Label>اسم حامل البطاقة</Label>
              <Input
                value={formData.paymentDetails?.cardHolderName || ''}
                onChange={(e) => updatePaymentDetails('cardHolderName', e.target.value)}
                placeholder="الاسم الكامل"
                disabled={mode === 'view'}
                className="text-right"
              />
            </div>
            <div>
              <Label>تاريخ الانتهاء</Label>
              <Input
                value={formData.paymentDetails?.expiryDate || ''}
                onChange={(e) => updatePaymentDetails('expiryDate', e.target.value)}
                placeholder="MM/YY"
                disabled={mode === 'view'}
                className="text-right"
              />
            </div>
            <div>
              <Label>CVV</Label>
              <Input
                value={formData.paymentDetails?.cvv || ''}
                onChange={(e) => updatePaymentDetails('cvv', e.target.value)}
                placeholder="***"
                disabled={mode === 'view'}
                className="text-right"
                maxLength={3}
              />
            </div>
          </div>
        );

      case 'تحويل بنكي':
        return (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>اسم البنك</Label>
              <Input
                value={formData.paymentDetails?.bankName || ''}
                onChange={(e) => updatePaymentDetails('bankName', e.target.value)}
                placeholder="مثال: البنك الأهلي"
                disabled={mode === 'view'}
                className="text-right"
              />
            </div>
            <div>
              <Label>رقم الحساب</Label>
              <Input
                value={formData.paymentDetails?.accountNumber || ''}
                onChange={(e) => updatePaymentDetails('accountNumber', e.target.value)}
                placeholder="SA..."
                disabled={mode === 'view'}
                className="text-right"
              />
            </div>
            <div className="col-span-2">
              <Label>رقم التحويل</Label>
              <Input
                value={formData.paymentDetails?.transferNumber || ''}
                onChange={(e) => updatePaymentDetails('transferNumber', e.target.value)}
                placeholder="رقم مرجع التحويل"
                disabled={mode === 'view'}
                className="text-right"
              />
            </div>
          </div>
        );

      case 'PayTabs':
      case 'Apple Pay':
      case 'STC Pay':
        return (
          <div className="space-y-4">
            <div>
              <Label>معرّف المعاملة</Label>
              <Input
                value={formData.paymentDetails?.transactionId || ''}
                onChange={(e) => updatePaymentDetails('transactionId', e.target.value)}
                placeholder="Transaction ID"
                disabled={mode === 'view'}
                className="text-right"
              />
            </div>
            <div>
              <Label>البريد الإلكتروني</Label>
              <Input
                value={formData.paymentDetails?.email || ''}
                onChange={(e) => updatePaymentDetails('email', e.target.value)}
                placeholder="example@email.com"
                disabled={mode === 'view'}
                className="text-right"
                type="email"
              />
            </div>
          </div>
        );

      case 'نقدي':
        return (
          <div>
            <Label>رقم الإيصال</Label>
            <Input
              value={formData.paymentDetails?.receiptNumber || ''}
              onChange={(e) => updatePaymentDetails('receiptNumber', e.target.value)}
              placeholder="رقم الإيصال"
              disabled={mode === 'view'}
              className="text-right"
            />
          </div>
        );

      default:
        return null;
    }
  };

  const getDrawerTitle = () => {
    switch (mode) {
      case 'add': return 'إنشاء معاملة جديدة';
      case 'edit': return 'تعديل المعاملة';
      case 'view': return 'تفاصيل المعاملة';
      default: return 'المعاملة';
    }
  };

  const getDrawerDescription = () => {
    switch (mode) {
      case 'add': return 'قم بإنشاء معاملة مالية جديدة لصالح إحدى المنظمات';
      case 'edit': return 'قم بتحديث بيانات المعاملة المالية';
      case 'view': return 'عرض تفاصيل المعاملة المالية';
      default: return '';
    }
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange} direction="left">
      <DrawerContent className="h-full w-full sm:max-w-lg md:max-w-2xl lg:max-w-3xl">
        <div className="flex flex-col h-full">
          <DrawerHeader className="border-b">
            <div className="flex items-center justify-between">
              <div>
                <DrawerTitle className="text-2xl">{getDrawerTitle()}</DrawerTitle>
                <DrawerDescription className="mt-1">
                  {getDrawerDescription()}
                </DrawerDescription>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onOpenChange(false)}
                className="hover:bg-gray-100 rounded-full"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </DrawerHeader>

          <div className="flex-1 overflow-y-auto p-6">
            {mode === 'view' ? (
              <Tabs defaultValue="details" dir="rtl" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="details" className="gap-2">
                    <Info className="h-4 w-4" />
                    التفاصيل الأساسية
                  </TabsTrigger>
                  <TabsTrigger value="payment" className="gap-2">
                    <CreditCard className="h-4 w-4" />
                    بيانات الدفع
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="details" className="space-y-6">
                  <Card>
                    <CardContent className="p-6 space-y-4">
                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <Label className="text-sm font-medium text-gray-500 flex items-center gap-2">
                            <Building2 className="h-4 w-4" />
                            اسم المنظمة
                          </Label>
                          <p className="mt-1 text-lg font-medium">{transaction?.organizationName}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-500 flex items-center gap-2">
                            <Hash className="h-4 w-4" />
                            رقم المعاملة
                          </Label>
                          <p className="mt-1 font-mono text-sm">{transaction?.id}</p>
                        </div>
                      </div>

                      <Separator />

                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <Label className="text-sm font-medium text-gray-500 flex items-center gap-2">
                            <DollarSign className="h-4 w-4" />
                            المبلغ الإجمالي
                          </Label>
                          <p className="mt-1 text-2xl font-bold text-[#18325A]">
                            {transaction?.amount.toLocaleString()} ريال
                          </p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-500 flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4" />
                            الحالة
                          </Label>
                          <div className="mt-1">
                            {transaction?.status && getStatusBadge(transaction.status)}
                          </div>
                        </div>
                      </div>

                      <Separator />

                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <Label className="text-sm font-medium text-gray-500 flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            التاريخ
                          </Label>
                          <p className="mt-1">{transaction?.date}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-500">الوقت</Label>
                          <p className="mt-1">{transaction?.time}</p>
                        </div>
                      </div>

                      <Separator />

                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <Label className="text-sm font-medium text-gray-500 flex items-center gap-2">
                            <CreditCard className="h-4 w-4" />
                            طريقة الدفع
                          </Label>
                          <p className="mt-1">{transaction?.paymentMethod}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-500 flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            نوع المعاملة
                          </Label>
                          <p className="mt-1 capitalize">{transaction?.type}</p>
                        </div>
                      </div>

                      {transaction?.description && (
                        <>
                          <Separator />
                          <div>
                            <Label className="text-sm font-medium text-gray-500">الوصف</Label>
                            <p className="mt-1 text-gray-700">{transaction.description}</p>
                          </div>
                        </>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="payment" className="space-y-4">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-2 mb-4">
                        <CreditCard className="h-5 w-5 text-[#18325A]" />
                        <h4 className="font-semibold">بيانات الدفع - {transaction?.paymentMethod}</h4>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        {renderPaymentDetailsFields()}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            ) : (
              <div className="space-y-6">
                {/* Basic Information */}
                <Card>
                  <CardContent className="p-6 space-y-4">
                    <h3 className="font-semibold flex items-center gap-2 text-lg">
                      <Info className="h-5 w-5 text-[#18325A]" />
                      المعلومات الأساسية
                    </h3>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="organization">المنظمة *</Label>
                        <Select
                          value={formData.organizationId}
                          onValueChange={(value) => updateFormData('organizationId', value)}
                          disabled={mode === 'edit'}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="اختر المنظمة" />
                          </SelectTrigger>
                          <SelectContent>
                            {organizations.map((org) => (
                              <SelectItem key={org.id} value={org.id}>
                                {org.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="amount">المبلغ (ريال) *</Label>
                        <Input
                          id="amount"
                          type="number"
                          value={formData.amount}
                          onChange={(e) => updateFormData('amount', parseFloat(e.target.value) || 0)}
                          placeholder="0.00"
                          className="text-right"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="paymentMethod">طريقة الدفع *</Label>
                        <Select
                          value={formData.paymentMethod}
                          onValueChange={(value) => updateFormData('paymentMethod', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="اختر طريقة الدفع" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="بطاقة ائتمان">بطاقة ائتمان</SelectItem>
                            <SelectItem value="بطاقة مدى">بطاقة مدى</SelectItem>
                            <SelectItem value="تحويل بنكي">تحويل بنكي</SelectItem>
                            <SelectItem value="PayTabs">PayTabs</SelectItem>
                            <SelectItem value="Apple Pay">Apple Pay</SelectItem>
                            <SelectItem value="STC Pay">STC Pay</SelectItem>
                            <SelectItem value="نقدي">نقدي</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="status">الحالة</Label>
                        <Select
                          value={formData.status}
                          onValueChange={(value) => updateFormData('status', value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="completed">مكتملة</SelectItem>
                            <SelectItem value="pending">قيد المعالجة</SelectItem>
                            <SelectItem value="failed">فاشلة</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="description">الوصف</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => updateFormData('description', e.target.value)}
                        placeholder="وصف المعاملة (اختياري)"
                        className="text-right"
                        rows={3}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Payment Details */}
                {formData.paymentMethod && (
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="font-semibold flex items-center gap-2 text-lg mb-4">
                        <CreditCard className="h-5 w-5 text-[#18325A]" />
                        بيانات الدفع - {formData.paymentMethod}
                      </h3>
                      <div className="bg-gray-50 rounded-lg p-4">
                        {renderPaymentDetailsFields()}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </div>

          {mode !== 'view' && (
            <div className="border-t p-6 bg-gray-50">
              <div className="flex gap-3">
                <Button
                  onClick={handleSave}
                  className="flex-1 bg-[#18325A] hover:bg-[#2a4a7a]"
                >
                  <Save className="h-4 w-4 ml-2" />
                  {mode === 'add' ? 'إنشاء المعاملة' : 'حفظ التغييرات'}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  className="flex-1"
                >
                  إلغاء
                </Button>
              </div>
            </div>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
