# Toomakt Atelier · Paymob Custom Iframe Configuration Guide

هذا الدليل يوضح البيانات والأكواد الخمسة المطلوبة لإنشاء فريم Paymob المخصص (**Add Iframe**) متوافقاً تماماً وبمرونة مع التصميم الفاخر لمتجر **Toomakt**.

---

## 1. حقول نافذة Add Iframe في Paymob

### الحقل 1: Name (الاسم)
```text
Toomakt Atelier Luxury Iframe
```

### الحقل 2: Description (الوصف)
```text
Custom bespoke luxury French confectionery atelier card checkout theme for Toomakt e-commerce platform. Features responsive layout, deep plum & warm gold palette, and 3D-Secure trust badges.
```

---

### الحقل 3: HTML
انسخ الكود بالكامل من ملف: [`paymob_custom_iframe/HTML.html`](./HTML.html)

---

### الحقل 4: CSS
انسخ الكود بالكامل من ملف: [`paymob_custom_iframe/CSS.css`](./CSS.css)

---

### الحقل 5: JavaScript
انسخ الكود بالكامل من ملف: [`paymob_custom_iframe/JAVASCRIPT.js`](./JAVASCRIPT.js)

---

## الخطوة التالية بعد الحفظ في Paymob:
1. اضغط على زر **Confirm** الأزرق في نافذة Paymob.
2. ستظهر لك قائمة الـ Iframes وبجوار الفريم الجديد ستجد رقم تعريفي جديد (مثال: `1084xxx`).
3. انسخ هذا الرقم وضعه في ملف `.env`:
   ```env
   VITE_PAYMOB_IFRAME_ID=1084xxx
   PAYMOB_IFRAME_ID=1084xxx
   ```
4. سيتم تحميل هذا التصميم الفاخر تلقائياً داخل نافذة الدفع بالفيزا في المتجر.
