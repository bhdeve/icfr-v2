# Common UI Components

هذا المجلد يحتوي على مكونات UI القابلة لإعادة الاستخدام عبر الصفحة الرئيسية (Landing) والبوابة (Portal).

## المكونات المتوفرة

### 1. FeatureCard
بطاقة عرض الميزات مع أيقونة وعنوان ووصف.

```tsx
import { FeatureCard } from './components/common';
import { BarChart3 } from 'lucide-react';

<FeatureCard
  icon={BarChart3}
  title="استطلاعات ذكية"
  description="أنشئ استطلاعات احترافية بسهولة"
  gradient="from-blue-500 to-cyan-500"
  index={0}
/>
```

### 2. TestimonialCard
بطاقة عرض آراء العملاء مع تقييم نجوم.

```tsx
import { TestimonialCard } from './components/common';

<TestimonialCard
  quote="منصة رائعة ومفيدة جداً"
  author="أحمد السعيد"
  role="مدير تنفيذي"
  rating={5}
  index={0}
/>
```

### 3. PricingCard
بطاقة عرض الأسعار والباقات.

```tsx
import { PricingCard } from './components/common';

<PricingCard
  name="المحترفة"
  price="299"
  description="للمنظمات المتوسطة"
  features={['ميزة 1', 'ميزة 2']}
  cta="ابدأ الآن"
  popular={true}
  onCtaClick={() => {}}
/>
```

### 4. StepCard
بطاقة عرض خطوات العمل.

```tsx
import { StepCard } from './components/common';
import { Users } from 'lucide-react';

<StepCard
  step="01"
  title="أنشئ حسابك"
  description="سجّل منظمتك"
  icon={Users}
  index={0}
  showConnector={true}
/>
```

### 5. SectionHeader
عنوان القسم مع عنوان فرعي.

```tsx
import { SectionHeader } from './components/common';

<SectionHeader
  title="المميزات"
  subtitle="كل ما تحتاجه في مكان واحد"
  centered={true}
/>
```

### 6. StatCard
بطاقة عرض الإحصائيات.

```tsx
import { StatCard } from './components/common';
import { Globe } from 'lucide-react';

<StatCard
  number="500+"
  label="منظمة نشطة"
  icon={Globe}
  variant="dark"
  index={0}
/>
```

### 7. FloatingCard
بطاقة عائمة متحركة للتأثيرات البصرية.

```tsx
import { FloatingCard } from './components/common';
import { TrendingUp } from 'lucide-react';

<FloatingCard
  icon={TrendingUp}
  position="top-right"
  gradient="from-green-400 to-emerald-500"
/>
```

### 8. AnimatedBadge
شارة متحركة للإشارة للمعلومات المهمة.

```tsx
import { AnimatedBadge } from './components/common';
import { Sparkles } from 'lucide-react';

<AnimatedBadge
  icon={Sparkles}
  text="منصة قياس الأثر الأذكى"
  variant="primary"
/>
```

### 9. BackgroundGradient
خلفية متدرجة للأقسام.

```tsx
import { BackgroundGradient } from './components/common';

<section className="relative">
  <BackgroundGradient variant="default" />
  {/* محتوى القسم */}
</section>
```

## الاستخدام

جميع المكونات مصممة لتكون:
- ✅ قابلة لإعادة الاستخدام
- ✅ متوافقة مع RTL
- ✅ متحركة باستخدام Motion
- ✅ قابلة للتخصيص
- ✅ responsive

## التخصيص

كل مكون يقبل prop `className` لتخصيص الأنماط:

```tsx
<FeatureCard
  className="custom-class"
  // ... props أخرى
/>
```

## الملاحظات

- جميع المكونات تستخدم `motion/react` للرسوم المتحركة
- الألوان الأساسية: `#18325a` (الأزرق الداكن) والبنفسجي
- جميع المكونات تدعم `whileInView` للظهور عند التمرير
