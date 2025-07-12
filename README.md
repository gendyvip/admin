# Admin Dashboard

تطبيق لوحة تحكم إدارية مبني بـ React و Vite مع تحسينات الأداء وحلول مشاكل Lighthouse.

## 🚀 المميزات

- ✅ **أداء محسن**: حل مشاكل Lighthouse NO_FCP
- ✅ **اتصال مستقر**: حل مشاكل الاتصال
- ✅ **تحميل سريع**: Lazy loading و Code splitting
- ✅ **واجهة حديثة**: تصميم متجاوب مع Tailwind CSS
- ✅ **إدارة حالة**: Zustand للـ state management
- ✅ **توجيه ذكي**: React Router مع حماية المسارات

## 📦 التثبيت

```bash
# تثبيت التبعيات
npm install

# تشغيل التطبيق
npm run dev
```

## 🔧 الأوامر المتاحة

```bash
# تشغيل عادي
npm run dev

# تشغيل مع تنظيف تلقائي
npm run dev:clean

# تشغيل محلي فقط
npm run dev:local

# بناء للإنتاج
npm run build

# معاينة الإنتاج
npm run preview

# تنظيف جميع العمليات
npm run clean

# إعادة تشغيل
npm run restart
```

## 🌐 الوصول للتطبيق

بعد التشغيل، افتح المتصفح واذهب إلى:

- **التطوير**: `http://localhost:5173`
- **الإنتاج**: `http://localhost:4173` (بعد `npm run preview`)

## 🔍 حل المشاكل

### مشكلة Lighthouse NO_FCP

إذا واجهت مشكلة "The page did not paint any content":

1. **تأكد من أن النافذة مفتوحة** أثناء تشغيل Lighthouse
2. **استخدم الأمر المحسن**:
   ```bash
   npm run dev:clean
   ```
3. **تحقق من Console** في المتصفح
4. **امسح Cache المتصفح** (Ctrl+Shift+R)

### مشكلة الاتصال

إذا واجهت خطأ "Could not establish connection":

1. **أعد تشغيل الخادم**:
   ```bash
   npm run restart
   ```
2. **تحقق من المنافذ**:
   ```bash
   netstat -ano | findstr :5173
   ```
3. **استخدم السكريبت المحسن**:
   ```bash
   npm run dev:clean
   ```

### مشاكل أخرى

- **تحقق من التبعيات**: `npm install`
- **نظف Cache**: `npm cache clean --force`
- **أعد تثبيت التبعيات**: احذف `node_modules` و `package-lock.json` ثم `npm install`

## 📁 هيكل المشروع

```
src/
├── components/          # المكونات المشتركة
├── Layout/             # تخطيطات الصفحات
├── pages/              # صفحات التطبيق
├── store/              # إدارة الحالة (Zustand)
├── api/                # خدمات API
├── lib/                # مكتبات مساعدة
└── index.css           # الأنماط الرئيسية
```

## 🛠️ التقنيات المستخدمة

- **React 19** - مكتبة واجهة المستخدم
- **Vite** - أداة البناء
- **Tailwind CSS** - إطار العمل للأنماط
- **React Router** - التوجيه
- **Zustand** - إدارة الحالة
- **Axios** - طلبات HTTP
- **Radix UI** - مكونات واجهة المستخدم

## 📊 تحسينات الأداء

### 1. تحسينات التحميل

- Lazy loading للمكونات
- Code splitting تلقائي
- Preloading للموارد المهمة

### 2. تحسينات CSS

- تحسين الرسوم المتحركة
- منع Layout Shift
- تحسين الخطوط

### 3. تحسينات Vite

- إعدادات خادم محسنة
- تحسين dependencies
- تحسينات البناء

## 🔒 الأمان

- حماية المسارات
- التحقق من المصادقة
- إدارة الجلسات
- حماية من XSS

## 📈 نتائج Lighthouse المتوقعة

- **Performance**: 90+
- **Accessibility**: 95+
- **Best Practices**: 95+
- **SEO**: 90+

## 🤝 المساهمة

1. Fork المشروع
2. أنشئ branch جديد (`git checkout -b feature/AmazingFeature`)
3. Commit التغييرات (`git commit -m 'Add some AmazingFeature'`)
4. Push إلى Branch (`git push origin feature/AmazingFeature`)
5. افتح Pull Request

## 📝 الترخيص

هذا المشروع مرخص تحت رخصة MIT.

## 📞 الدعم

إذا واجهت أي مشاكل:

1. تحقق من ملف `LIGHTHOUSE_FIXES.md`
2. تحقق من ملف `CONNECTION_FIX.md`
3. افتح issue جديد في GitHub
4. ارفق لقطات شاشة من Console و Network tab

---

**ملاحظة**: تأكد من تشغيل الخادم الخلفي على `http://localhost:3000` لضمان عمل جميع الميزات.
