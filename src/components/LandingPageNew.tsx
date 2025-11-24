import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { Button } from './ui/button';
import { Logo } from './layout/Logo';
import { 
  BarChart3, 
  Users, 
  Target, 
  TrendingUp, 
  Shield, 
  Zap,
  CheckCircle2,
  ArrowLeft,
  Menu,
  X,
  Star,
  Quote,
  Sparkles,
  Globe,
  Clock,
  Award
} from 'lucide-react';

interface LandingPageNewProps {
  onLogin: () => void;
  onRegisterOrganization: () => void;
}

export function LandingPageNew({ onLogin, onRegisterOrganization }: LandingPageNewProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

  // Close mobile menu on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (mobileMenuOpen) setMobileMenuOpen(false);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [mobileMenuOpen]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white" dir="rtl">
      {/* Header */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 right-0 left-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Logo />
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8">
              <button
                onClick={() => scrollToSection('features')}
                className="text-gray-700 hover:text-[#18325a] transition-colors"
              >
                المميزات
              </button>
              <button
                onClick={() => scrollToSection('how-it-works')}
                className="text-gray-700 hover:text-[#18325a] transition-colors"
              >
                كيف يعمل
              </button>
              <button
                onClick={() => scrollToSection('pricing')}
                className="text-gray-700 hover:text-[#18325a] transition-colors"
              >
                الأسعار
              </button>
              <button
                onClick={() => scrollToSection('testimonials')}
                className="text-gray-700 hover:text-[#18325a] transition-colors"
              >
                آراء العملاء
              </button>
            </nav>

            {/* CTA Buttons */}
            <div className="hidden lg:flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={onLogin}
                className="text-[#18325a]"
              >
                تسجيل الدخول
              </Button>
              <Button
                onClick={onRegisterOrganization}
                className="bg-gradient-to-r from-[#18325a] to-[#2a4a7a] hover:from-[#0f1f3a] hover:to-[#18325a]"
              >
                ابدأ مجاناً
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="lg:hidden py-4 space-y-4"
            >
              <button
                onClick={() => scrollToSection('features')}
                className="block w-full text-right px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                المميزات
              </button>
              <button
                onClick={() => scrollToSection('how-it-works')}
                className="block w-full text-right px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                كيف يعمل
              </button>
              <button
                onClick={() => scrollToSection('pricing')}
                className="block w-full text-right px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                الأسعار
              </button>
              <button
                onClick={() => scrollToSection('testimonials')}
                className="block w-full text-right px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                آراء العملاء
              </button>
              <div className="flex flex-col gap-2 px-4 pt-4 border-t">
                <Button variant="outline" onClick={onLogin} className="w-full">
                  تسجيل الدخول
                </Button>
                <Button
                  onClick={onRegisterOrganization}
                  className="w-full bg-gradient-to-r from-[#18325a] to-[#2a4a7a]"
                >
                  ابدأ مجاناً
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      </motion.header>

      {/* Hero Section */}
      <section className="relative pt-28 pb-16 lg:pt-36 lg:pb-24 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#18325a]/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Text Content */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#18325a]/10 to-purple-500/10 rounded-full mb-6"
              >
                <Sparkles className="w-4 h-4 text-[#18325a]" />
                <span className="text-sm text-[#18325a]">منصة قياس الأثر الأذكى في المنطقة</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-4xl lg:text-6xl mb-6 text-gray-900"
              >
                قِس أثرك الاجتماعي
                <span className="block mt-2 bg-gradient-to-r from-[#18325a] to-purple-600 bg-clip-text text-transparent">
                  بذكاء وسهولة
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-xl text-gray-600 mb-8 leading-relaxed"
              >
                حوّل بياناتك إلى قصص نجاح ملهمة. منصة سحابة الأثر تساعدك على قياس وتحليل الأثر الاجتماعي لمنظمتك بطريقة احترافية ومبتكرة.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <Button
                  onClick={onRegisterOrganization}
                  size="lg"
                  className="bg-gradient-to-r from-[#18325a] to-[#2a4a7a] hover:from-[#0f1f3a] hover:to-[#18325a] text-lg px-8"
                >
                  ابدأ تجربتك المجانية
                  <ArrowLeft className="w-5 h-5 mr-2" />
                </Button>
                <Button
                  onClick={() => scrollToSection('how-it-works')}
                  size="lg"
                  variant="outline"
                  className="text-lg px-8 border-2"
                >
                  شاهد كيف يعمل
                </Button>
              </motion.div>

              {/* Trust Badges */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="flex items-center gap-8 mt-12 pt-8 border-t"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  <span className="text-sm text-gray-600">بدون بطاقة ائتمانية</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  <span className="text-sm text-gray-600">إعداد في 5 دقائق</span>
                </div>
              </motion.div>
            </motion.div>

            {/* Hero Image/Visual */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative">
                {/* Main Dashboard Preview */}
                <motion.div
                  style={{ opacity, scale }}
                  className="bg-white rounded-2xl shadow-2xl p-6 border border-gray-200"
                >
                  {/* Dashboard Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-[#18325a] to-purple-600" />
                      <div>
                        <div className="h-3 w-24 bg-gray-200 rounded" />
                        <div className="h-2 w-16 bg-gray-100 rounded mt-2" />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <div className="w-8 h-8 rounded-lg bg-gray-100" />
                      <div className="w-8 h-8 rounded-lg bg-gray-100" />
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    {[1, 2, 3, 4].map((i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 + i * 0.1 }}
                        className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4"
                      >
                        <div className="h-2 w-12 bg-gray-300 rounded mb-2" />
                        <div className="h-6 w-20 bg-gradient-to-r from-[#18325a] to-purple-600 rounded" />
                      </motion.div>
                    ))}
                  </div>

                  {/* Chart Preview */}
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 h-48 flex items-end justify-between gap-2">
                    {[40, 70, 50, 90, 60, 80, 55].map((height, i) => (
                      <motion.div
                        key={i}
                        initial={{ height: 0 }}
                        animate={{ height: `${height}%` }}
                        transition={{ delay: 1 + i * 0.1, duration: 0.5 }}
                        className="flex-1 bg-gradient-to-t from-[#18325a] to-purple-600 rounded-t-lg"
                      />
                    ))}
                  </div>
                </motion.div>

                {/* Floating Elements */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="absolute -top-6 -right-6 bg-white rounded-xl shadow-xl p-4 border border-gray-200"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="h-2 w-16 bg-gray-200 rounded mb-1" />
                      <div className="h-3 w-12 bg-gradient-to-r from-green-400 to-emerald-500 rounded" />
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="absolute -bottom-4 -left-4 bg-white rounded-xl shadow-xl p-4 border border-gray-200"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-400 to-purple-600 flex items-center justify-center">
                      <Users className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="h-2 w-16 bg-gray-200 rounded mb-1" />
                      <div className="h-3 w-12 bg-gradient-to-r from-purple-400 to-purple-600 rounded" />
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 lg:py-16 bg-gradient-to-r from-[#18325a] to-[#2a4a7a]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { number: '500+', label: 'منظمة نشطة', icon: Globe },
              { number: '50K+', label: 'استطلاع منجز', icon: BarChart3 },
              { number: '1M+', label: 'مستفيد مباشر', icon: Users },
              { number: '99%', label: 'رضا العملاء', icon: Award },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-3"
              >
                <stat.icon className="w-10 h-10 lg:w-12 lg:h-12 text-white/80 flex-shrink-0" />
                <div>
                  <div className="text-3xl lg:text-4xl text-white mb-1">{stat.number}</div>
                  <div className="text-sm text-white/80">{stat.label}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl lg:text-5xl mb-3 text-gray-900">
              كل ما تحتاجه لقياس الأثر
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              أدوات متكاملة ومتطورة لمساعدتك على فهم وتحسين أثرك الاجتماعي
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: BarChart3,
                title: 'استطلاعات ذكية',
                description: 'أنشئ استطلاعات احترافية بسهولة مع قوالب جاهزة وتخصيص كامل',
                gradient: 'from-blue-500 to-cyan-500',
              },
              {
                icon: Target,
                title: 'تحليلات متقدمة',
                description: 'احصل على رؤى عميقة من بياناتك مع تقارير تفاعلية ومخططات بيانية',
                gradient: 'from-purple-500 to-pink-500',
              },
              {
                icon: Users,
                title: 'إدارة المستفيدين',
                description: 'تتبع وإدارة المستفيدين بسهولة مع قاعدة بيانات متكاملة',
                gradient: 'from-green-500 to-emerald-500',
              },
              {
                icon: TrendingUp,
                title: 'قياس التقدم',
                description: 'راقب تقدمك نحو أهدافك مع مؤشرات أداء واضحة',
                gradient: 'from-orange-500 to-red-500',
              },
              {
                icon: Shield,
                title: 'أمان وخصوصية',
                description: 'بياناتك محمية بأعلى معايير الأمان والخصوصية',
                gradient: 'from-indigo-500 to-purple-500',
              },
              {
                icon: Zap,
                title: 'سريع وسهل',
                description: 'واجهة بسيطة وسريعة تساعدك على إنجاز المهام بكفاءة',
                gradient: 'from-yellow-500 to-orange-500',
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all border border-gray-100"
              >
                <div className="flex gap-4 items-start">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${feature.gradient} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl mb-2 text-gray-900">{feature.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-16 lg:py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl lg:text-5xl mb-3 text-gray-900">
              ابدأ في 3 خطوات بسيطة
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              من التسجيل إلى النتائج في دقائق
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
            {[
              {
                step: '01',
                title: 'أنشئ حسابك',
                description: 'سجّل منظمتك واحصل على وصول فوري لجميع الميزات',
                icon: Users,
              },
              {
                step: '02',
                title: 'صمم استطلاعك',
                description: 'استخدم قوالبنا الجاهزة أو صمم استطلاع مخصص بالكامل',
                icon: BarChart3,
              },
              {
                step: '03',
                title: 'احصل على النتائج',
                description: 'شارك الاستطلاع واحصل على تحليلات فورية ومفصلة',
                icon: TrendingUp,
              },
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="relative"
              >
                {/* Connector Line */}
                {index < 2 && (
                  <div className="hidden lg:block absolute top-20 right-0 w-full h-0.5 bg-gradient-to-l from-[#18325a]/20 to-transparent transform translate-x-1/2 -z-10" />
                )}

                <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-lg border border-gray-100">
                  <div className="flex gap-4 items-center mb-4">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-r from-[#18325a]/10 to-purple-600/10 flex items-center justify-center flex-shrink-0">
                      <step.icon className="w-7 h-7 text-[#18325a]" />
                    </div>
                    <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-[#18325a] to-purple-600 text-white text-2xl flex-shrink-0">
                      {step.step}
                    </div>
                  </div>
                  <div className="mr-[72px]">
                    <h3 className="text-2xl mb-3 text-gray-900">{step.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{step.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Button
              onClick={onRegisterOrganization}
              size="lg"
              className="bg-gradient-to-r from-[#18325a] to-[#2a4a7a] hover:from-[#0f1f3a] hover:to-[#18325a] text-lg px-8"
            >
              ابدأ الآن مجاناً
              <ArrowLeft className="w-5 h-5 mr-2" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-16 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl lg:text-5xl mb-3 text-gray-900">
              ماذا يقول عملاؤنا
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              قصص نجاح من منظمات تثق بسحابة الأثر
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                quote: 'منصة سحابة الأثر غيرت طريقة قياسنا للأثر بشكل كامل. البيانات أصبحت أكثر وضوحاً والتقارير أسهل بكثير.',
                author: 'أحمد السعيد',
                role: 'مدير تنفيذي، جمعية خيرية',
                rating: 5,
              },
              {
                quote: 'أداة رائعة وسهلة الاستخدام. وفرت علينا الكثير من الوقت في إعداد التقارير والاستطلاعات.',
                author: 'فاطمة الزهراني',
                role: 'مديرة البرامج، مؤسسة اجتماعية',
                rating: 5,
              },
              {
                quote: 'الدعم الفني ممتاز والميزات قوية. أنصح بها لأي منظمة تريد قياس أثرها بطريقة احترافية.',
                author: 'محمد العتيبي',
                role: 'رئيس قسم التطوير، منظمة غير ربحية',
                rating: 5,
              },
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 relative"
              >
                <Quote className="w-10 h-10 text-[#18325a]/20 mb-4" />
                <p className="text-gray-700 mb-6 leading-relaxed">{testimonial.quote}</p>
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <div>
                  <div className="text-gray-900 mb-1">{testimonial.author}</div>
                  <div className="text-sm text-gray-500">{testimonial.role}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Barq Assistant Section */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-[#18325a] via-[#2a4a7a] to-purple-900 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-400/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Text Content */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full mb-6"
              >
                <Sparkles className="w-4 h-4 text-yellow-400" />
                <span className="text-sm text-white">مساعد ذكي بالذكاء الاصطناعي</span>
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="text-3xl lg:text-5xl mb-6 text-white"
              >
                تعرّف على
                <span className="block mt-2 bg-gradient-to-r from-yellow-400 to-amber-300 bg-clip-text text-transparent">
                  مساعد برق الذكي
                </span>
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="text-xl text-white/90 mb-8 leading-relaxed"
              >
                مساعدك الذكي الذي يعمل بالذكاء الاصطناعي لتحليل البيانات وإنشاء التقارير وتقديم الرؤى القيّمة حول أثرك الاجتماعي بسرعة ودقة فائقة.
              </motion.p>

              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
                className="space-y-4"
              >
                {[
                  {
                    icon: Sparkles,
                    title: 'تحليل ذكي للبيانات',
                    description: 'يحلل بياناتك تلقائياً ويستخرج الرؤى المهمة',
                  },
                  {
                    icon: Zap,
                    title: 'تقارير فورية',
                    description: 'ينشئ تقارير احترافية في ثوانٍ',
                  },
                  {
                    icon: Target,
                    title: 'توصيات مخصصة',
                    description: 'يقدم توصيات لتحسين أثرك الاجتماعي',
                  },
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    className="flex items-start gap-4 bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10"
                  >
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-yellow-400 to-amber-300 flex items-center justify-center flex-shrink-0">
                      <feature.icon className="w-5 h-5 text-[#18325a]" />
                    </div>
                    <div>
                      <h3 className="text-lg text-white mb-1">{feature.title}</h3>
                      <p className="text-white/70 text-sm leading-relaxed">{feature.description}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            {/* Visual/Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              {/* AI Assistant Chat Preview */}
              <div className="relative">
                <motion.div
                  className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                >
                  {/* Chat Header */}
                  <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/10">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-yellow-400 to-amber-300 flex items-center justify-center">
                      <Sparkles className="w-6 h-6 text-[#18325a]" />
                    </div>
                    <div>
                      <h4 className="text-white mb-1">مساعد برق</h4>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                        <span className="text-xs text-white/60">متصل الآن</span>
                      </div>
                    </div>
                  </div>

                  {/* Chat Messages */}
                  <div className="space-y-4">
                    {/* User Message */}
                    <motion.div
                      initial={{ opacity: 0, x: 50 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.8 }}
                      className="flex justify-end"
                    >
                      <div className="bg-white/90 rounded-2xl rounded-bl-sm px-4 py-3 max-w-[80%]">
                        <p className="text-[#18325a] text-sm">ما هي أبرز النتائج من آخر استطلاع؟</p>
                      </div>
                    </motion.div>

                    {/* AI Response */}
                    <motion.div
                      initial={{ opacity: 0, x: -50 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 1 }}
                      className="flex justify-start"
                    >
                      <div className="bg-gradient-to-r from-yellow-400/90 to-amber-300/90 rounded-2xl rounded-br-sm px-4 py-3 max-w-[80%]">
                        <p className="text-[#18325a] text-sm">تشير النتائج إلى:</p>
                        <ul className="text-[#18325a] text-sm mt-2 space-y-1 mr-3">
                          <li>• 92% رضا المستفيدين</li>
                          <li>• تحسن بنسبة 15% عن الفترة السابقة</li>
                          <li>• أعلى تقييم في مجال التدريب</li>
                        </ul>
                      </div>
                    </motion.div>

                    {/* Typing Indicator */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 1.3 }}
                      className="flex items-center gap-2"
                    >
                      <div className="bg-white/20 rounded-full px-3 py-2">
                        <div className="flex gap-1">
                          <motion.div
                            className="w-2 h-2 rounded-full bg-white/60"
                            animate={{ scale: [1, 1.3, 1] }}
                            transition={{ duration: 1, repeat: Infinity, delay: 0 }}
                          />
                          <motion.div
                            className="w-2 h-2 rounded-full bg-white/60"
                            animate={{ scale: [1, 1.3, 1] }}
                            transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                          />
                          <motion.div
                            className="w-2 h-2 rounded-full bg-white/60"
                            animate={{ scale: [1, 1.3, 1] }}
                            transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                          />
                        </div>
                      </div>
                      <span className="text-xs text-white/60">برق يكتب...</span>
                    </motion.div>
                  </div>
                </motion.div>

                {/* Floating Stats */}
                <motion.div
                  animate={{ y: [0, -15, 0], rotate: [0, 5, 0] }}
                  transition={{ duration: 5, repeat: Infinity }}
                  className="absolute -top-4 -right-4 bg-white rounded-xl shadow-2xl p-4 border border-gray-100"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">معدل الدقة</p>
                      <p className="text-lg text-[#18325a]">98.5%</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  animate={{ y: [0, 15, 0], rotate: [0, -5, 0] }}
                  transition={{ duration: 6, repeat: Infinity }}
                  className="absolute -bottom-4 -left-4 bg-white rounded-xl shadow-2xl p-4 border border-gray-100"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-400 to-purple-600 flex items-center justify-center">
                      <Zap className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">توفير الوقت</p>
                      <p className="text-lg text-[#18325a]">85%</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-16 lg:py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl lg:text-5xl mb-3 text-gray-900">
              خطط تناسب احتياجاتك
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              ابدأ مجاناً وانتقل للخطة المناسبة عند الحاجة
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                name: 'المجانية',
                price: '0',
                description: 'للمنظمات الصغيرة والتجربة',
                features: [
                  'حتى 5 استطلاعات شهرياً',
                  '100 مستفيد',
                  'تقارر أساسية',
                  'دعم عبر البريد',
                ],
                cta: 'ابدأ مجاناً',
                popular: false,
              },
              {
                name: 'المحترفة',
                price: '299',
                description: 'للمنظمات المتوسطة',
                features: [
                  'استطلاعات غير محدودة',
                  '1000 مستفيد',
                  'تقارير متقدمة وتحليلات',
                  'تكامل مع الأنظمة',
                  'دعم ذو أولوية',
                  'تخصيص العلامة التجارية',
                ],
                cta: 'ابدأ الآن',
                popular: true,
              },
              {
                name: 'المؤسسية',
                price: 'مخصص',
                description: 'للمنظمات الكبرى',
                features: [
                  'كل مميزات الخطة المحترفة',
                  'مستفيدين غير محدود',
                  'مدير حساب مخصص',
                  'تدريب ودعم متقدم',
                  'SLA مضمون',
                  'تخصيص كامل',
                ],
                cta: 'تواصل معنا',
                popular: false,
              },
            ].map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`relative bg-white rounded-2xl p-8 shadow-lg border-2 ${
                  plan.popular ? 'border-[#18325a] scale-105' : 'border-gray-200'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 right-1/2 transform translate-x-1/2">
                    <span className="bg-gradient-to-r from-[#18325a] to-purple-600 text-white px-4 py-1 rounded-full text-sm">
                      الأكثر شعبية
                    </span>
                  </div>
                )}

                <div className="text-center mb-8">
                  <h3 className="text-2xl mb-2 text-gray-900">{plan.name}</h3>
                  <p className="text-gray-600 mb-4">{plan.description}</p>
                  <div className="mb-2">
                    <span className="text-4xl text-gray-900">{plan.price}</span>
                    {plan.price !== 'مخصص' && (
                      <span className="text-gray-600 mr-2">ريال/شهرياً</span>
                    )}
                  </div>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  onClick={onRegisterOrganization}
                  className={`w-full ${
                    plan.popular
                      ? 'bg-gradient-to-r from-[#18325a] to-[#2a4a7a]'
                      : 'bg-gray-900'
                  }`}
                >
                  {plan.cta}
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24 bg-gradient-to-r from-[#18325a] to-[#2a4a7a] relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-3xl lg:text-5xl mb-6 text-white">
              جاهز لقياس أثرك الاجتماعي؟
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              انضم لمئات المنظمات التي تستخدم سحابة الأثر لقياس وتحسين أثرها الاجتماعي
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={onRegisterOrganization}
                size="lg"
                className="bg-white text-[#18325a] hover:bg-gray-100 text-lg px-8"
              >
                ابدأ تجربتك المجانية
                <ArrowLeft className="w-5 h-5 mr-2" />
              </Button>
              <Button
                onClick={onLogin}
                size="lg"
                variant="outline"
                className="border-2 border-white text-white hover:bg-white/10 text-lg px-8"
              >
                تسجيل الدخول
              </Button>
            </div>

            <div className="flex items-center justify-center gap-8 mt-12 pt-8 border-t border-white/20">
              <div className="flex items-center gap-2 text-white/80">
                <Clock className="w-5 h-5" />
                <span className="text-sm">إعداد سريع</span>
              </div>
              <div className="flex items-center gap-2 text-white/80">
                <Shield className="w-5 h-5" />
                <span className="text-sm">آمن ومحمي</span>
              </div>
              <div className="flex items-center gap-2 text-white/80">
                <Award className="w-5 h-5" />
                <span className="text-sm">دعم مميز</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 lg:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="mb-6">
                <Logo />
              </div>
              <p className="text-gray-400 leading-relaxed">
                منصة قياس الأثر الاجتماعي الأذكى في المنطقة
              </p>
            </div>

            <div>
              <h4 className="text-lg mb-4">المنصة</h4>
              <ul className="space-y-3">
                <li>
                  <button onClick={() => scrollToSection('features')} className="text-gray-400 hover:text-white transition-colors">
                    المميزات
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection('pricing')} className="text-gray-400 hover:text-white transition-colors">
                    الأسعار
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection('how-it-works')} className="text-gray-400 hover:text-white transition-colors">
                    كيف يعمل
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg mb-4">الدعم</h4>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    مركز المساعدة
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    التوثيق
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    تواصل معنا
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg mb-4">الشركة</h4>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    من نحن
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    المدونة
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    الوظائف
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              © 2024 سحابة الأثر. جميع الحقوق محفوظة.
            </p>
            <div className="flex gap-6 text-sm">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                سياسة الخصوصية
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                شروط الاستخدام
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}