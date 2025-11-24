import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter, DrawerClose } from '../ui/drawer';
import { ScrollArea } from '../ui/scroll-area';
import { Separator } from '../ui/separator';
import { Badge } from '../ui/badge';
import { 
  Mail, 
  User, 
  Building2, 
  MessageCircle, 
  Send, 
  X,
  Phone,
  MapPin,
  Clock,
  Sparkles
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface ContactDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ContactDrawer({ open, onOpenChange }: ContactDrawerProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    organization: '',
    phone: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message) {
      toast.error('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast.success('تم إرسال رسالتك بنجاح! سنتواصل معك قريباً');
    setFormData({
      name: '',
      email: '',
      organization: '',
      phone: '',
      message: ''
    });
    setIsSubmitting(false);
    onOpenChange(false);
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange} direction="left">
      <DrawerContent 
        className="h-full w-full sm:max-w-lg" 
        dir="rtl"
      >
        <DrawerHeader className="border-b">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#18325A]/10">
              <MessageCircle className="h-6 w-6 text-[#18325A]" />
            </div>
            <div className="flex-1">
              <DrawerTitle className="text-xl">تواصل معنا</DrawerTitle>
              <DrawerDescription>
                نحن هنا للإجابة على أسئلتك ومساعدتك
              </DrawerDescription>
            </div>
          </div>
        </DrawerHeader>

        <ScrollArea className="flex-1 p-6">
          <div className="space-y-6">
            {/* Info Cards */}
            <div className="grid gap-3">
              <div className="flex items-center gap-3 rounded-lg bg-blue-50 p-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white">
                  <Mail className="h-5 w-5 text-[#18325A]" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">البريد الإلكتروني</p>
                  <p className="font-medium">info@sahabat-alathar.com</p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-lg bg-green-50 p-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white">
                  <Phone className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">الهاتف</p>
                  <p className="font-medium">+970-123-456-789</p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-lg bg-purple-50 p-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white">
                  <Clock className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">ساعات العمل</p>
                  <p className="font-medium">الأحد - الخميس، 9 صباحاً - 5 مساءً</p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Contact Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  الاسم الكامل
                  <Badge variant="destructive" className="mr-auto text-xs">مطلوب</Badge>
                </Label>
                <Input
                  id="name"
                  placeholder="أدخل اسمك الكامل"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  className="text-base"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  البريد الإلكتروني
                  <Badge variant="destructive" className="mr-auto text-xs">مطلوب</Badge>
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="example@email.com"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className="text-base"
                  dir="ltr"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  رقم الهاتف
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+970-123-456-789"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  className="text-base"
                  dir="ltr"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="organization" className="flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  المنظمة / الجهة
                </Label>
                <Input
                  id="organization"
                  placeholder="اسم المنظمة أو الجهة"
                  value={formData.organization}
                  onChange={(e) => handleChange('organization', e.target.value)}
                  className="text-base"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message" className="flex items-center gap-2">
                  <MessageCircle className="h-4 w-4" />
                  الرسالة
                  <Badge variant="destructive" className="mr-auto text-xs">مطلوب</Badge>
                </Label>
                <Textarea
                  id="message"
                  placeholder="اكتب رسالتك هنا..."
                  value={formData.message}
                  onChange={(e) => handleChange('message', e.target.value)}
                  className="min-h-[120px] resize-none text-base"
                  required
                />
                <p className="text-xs text-gray-500">
                  {formData.message.length} / 500 حرف
                </p>
              </div>

              {/* Info Note */}
              <div className="rounded-lg bg-gradient-to-br from-[#18325A]/5 to-blue-50 p-4">
                <div className="flex items-start gap-3">
                  <Sparkles className="h-5 w-5 text-[#18325A] mt-0.5" />
                  <div className="space-y-1">
                    <p className="font-medium text-sm">وعد سحابة الأثر</p>
                    <p className="text-xs text-gray-600">
                      سنرد على رسالتك خلال 24 ساعة عمل. نقدر وقتك ونسعى لتقديم أفضل دعم ممكن.
                    </p>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </ScrollArea>

        <DrawerFooter className="border-t">
          <div className="flex gap-3 w-full">
            <Button
              type="submit"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex-1 bg-[#18325A] hover:bg-[#18325A]/90"
            >
              {isSubmitting ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent ml-2" />
                  جاري الإرسال...
                </>
              ) : (
                <>
                  <Send className="ml-2 h-4 w-4" />
                  إرسال الرسالة
                </>
              )}
            </Button>
            <DrawerClose asChild>
              <Button variant="outline" className="flex-shrink-0">
                <X className="ml-2 h-4 w-4" />
                إلغاء
              </Button>
            </DrawerClose>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
