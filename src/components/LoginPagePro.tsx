import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Logo } from './layout/Logo';
import { BackendStatusAlert } from './BackendStatusAlert';
import { 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  LogIn, 
  ArrowLeft,
  CheckCircle
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface LoginPageProProps {
  onLogin: (loginInput: string, password: string) => void;
  onLogoClick: () => void;
  onForgotPassword?: () => void;
}

export function LoginPagePro({ onLogin, onLogoClick, onForgotPassword }: LoginPageProProps) {
  const [loginInput, setLoginInput] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!loginInput || !password) {
      toast.error('يرجى إدخال بيانات تسجيل الدخول وكلمة المرور');
      return;
    }

    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));

    try {
      onLogin(loginInput, password);
    } catch (error) {
      toast.error('حدث خطأ أثناء تسجيل الدخول');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 relative overflow-hidden" dir="rtl">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#18325a]/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>

      {/* Header */}
      <header className="fixed top-0 w-full bg-white/95 backdrop-blur-xl border-b border-gray-200 z-50 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            <Logo 
              onClick={onLogoClick}
              size="md"
              showText={true}
              variant="dark"
              className="cursor-pointer"
            />
            
            <Button 
              variant="ghost"
              onClick={onLogoClick}
              className="hover:text-[#18325a] hover:bg-[#18325a]/5"
            >
              <ArrowLeft className="w-4 h-4 ml-2" />
              العودة للرئيسية
            </Button>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="flex items-center justify-center min-h-screen p-4 pt-24 pb-8">
        <div className="w-full max-w-6xl relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Left Side - Branding */}
          <motion.div
            className="hidden lg:block"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="space-y-8">
              <div>
                <Logo 
                  onClick={onLogoClick}
                  size="xl"
                  showText={true}
                  variant="dark"
                  className="cursor-pointer mb-6"
                />
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                  مرحباً بك في
                  <br />
                  <span className="bg-gradient-to-r from-[#18325a] to-[#2a4a7a] bg-clip-text text-transparent">
                    سحابة الأثر
                  </span>
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  منصتك المتكاملة لقياس وإدارة الأثر الاجتماعي بذكاء وفعالية
                </p>
              </div>

              <div className="space-y-4">
                {[
                  { icon: CheckCircle, text: 'تحليلات متقدمة بالذكاء الاصطناعي' },
                  { icon: CheckCircle, text: 'لوحات تحكم تفاعلية ومخصصة' },
                  { icon: CheckCircle, text: 'تقارير شاملة وتصدير مرن' },
                  { icon: CheckCircle, text: 'أمان وخصوصية على أعلى مستوى' }
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center gap-3"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-5 h-5 text-white" />
                    </div>
                    <p className="text-gray-700">{item.text}</p>
                  </motion.div>
                ))}
              </div>

              <div className="flex items-center gap-8 pt-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#18325a] mb-1">500+</div>
                  <div className="text-sm text-gray-600">منظمة</div>
                </div>
                <div className="w-px h-12 bg-gray-200"></div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#18325a] mb-1">100K+</div>
                  <div className="text-sm text-gray-600">مستفيد</div>
                </div>
                <div className="w-px h-12 bg-gray-200"></div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#18325a] mb-1">98%</div>
                  <div className="text-sm text-gray-600">رضا</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Side - Login Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Card className="border-2 shadow-2xl">
              <CardContent className="p-8">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    تسجيل الدخول
                  </h2>
                  <p className="text-gray-600">
                    أدخل بياناتك للوصول إلى حسابك
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Email/Username Input */}
                  <div className="space-y-2">
                    <Label htmlFor="loginInput" className="text-sm font-medium">
                      البريد الإلكتروني أو اسم المستخدم
                    </Label>
                    <div className="relative">
                      <Mail className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        id="loginInput"
                        type="text"
                        value={loginInput}
                        onChange={(e) => setLoginInput(e.target.value)}
                        className="pr-10 h-12 border-2 focus:border-[#18325a]"
                        placeholder="أدخل بريدك الإلكتروني أو اسم المستخدم"
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  {/* Password Input */}
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium">
                      كلمة المرور
                    </Label>
                    <div className="relative">
                      <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pr-10 pl-10 h-12 border-2 focus:border-[#18325a]"
                        placeholder="أدخل كلمة المرور"
                        disabled={isLoading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Remember Me & Forgot Password */}
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="w-4 h-4 rounded border-gray-300 text-[#18325a] focus:ring-[#18325a]"
                      />
                      <span className="text-sm text-gray-600">تذكرني</span>
                    </label>
                    {onForgotPassword && (
                      <button
                        type="button"
                        onClick={onForgotPassword}
                        className="text-sm text-[#18325a] hover:underline"
                      >
                        نسيت كلمة المرور؟
                      </button>
                    )}
                  </div>

                  {/* Login Button */}
                  <Button
                    type="submit"
                    className="w-full h-12 bg-gradient-to-r from-[#18325a] to-[#2a4a7a] hover:shadow-lg transition-all text-base"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>جاري تسجيل الدخول...</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <LogIn className="h-5 w-5" />
                        <span>تسجيل الدخول</span>
                      </div>
                    )}
                  </Button>

                  {/* Back to Landing */}
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={onLogoClick}
                    className="w-full"
                  >
                    <ArrowLeft className="h-4 w-4 ml-2" />
                    العودة للصفحة الرئيسية
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
          </div>
        </div>
      </div>

      <style>{`
        .bg-grid-pattern {
          background-image: 
            linear-gradient(to right, rgba(0,0,0,0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0,0,0,0.1) 1px, transparent 1px);
          background-size: 40px 40px;
        }
      `}</style>
    </div>
  );
}