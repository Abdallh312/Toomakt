import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Truck,
  RotateCcw,
  FileText,
  Building2,
  Mail,
  Phone,
  Printer,
  ArrowLeft,
  CheckCircle2,
  Lock,
  Clock,
  Sparkles,
  MapPin,
  ExternalLink,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';

export type PolicyTab = 'privacy' | 'shipping' | 'refund' | 'terms' | 'about';

interface LegalPoliciesViewProps {
  initialTab?: PolicyTab | string;
  onBackHome?: () => void;
  onNavigateView?: (view: string) => void;
}

export const LegalPoliciesView: React.FC<LegalPoliciesViewProps> = ({
  initialTab = 'privacy',
  onBackHome,
  onNavigateView,
}) => {
  const { isRtl } = useLanguage();

  const normalizeTab = (tabStr?: string): PolicyTab => {
    if (!tabStr) return 'privacy';
    const clean = tabStr.toLowerCase();
    if (clean.includes('refund') || clean.includes('cancel')) return 'refund';
    if (clean.includes('ship') || clean.includes('deliver')) return 'shipping';
    if (clean.includes('term')) return 'terms';
    if (clean.includes('about') || clean.includes('story')) return 'about';
    return 'privacy';
  };

  const [activeTab, setActiveTab] = useState<PolicyTab>(normalizeTab(initialTab));

  useEffect(() => {
    setActiveTab(normalizeTab(initialTab));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [initialTab]);

  const tabs: Array<{ id: PolicyTab; labelEn: string; labelAr: string; icon: any }> = [
    {
      id: 'privacy',
      labelEn: 'Privacy Policy',
      labelAr: 'سياسة الخصوصية',
      icon: ShieldCheck,
    },
    {
      id: 'refund',
      labelEn: 'Refund & Cancellation',
      labelAr: 'سياسة الاسترجاع والإلغاء',
      icon: RotateCcw,
    },
    {
      id: 'shipping',
      labelEn: 'Delivery & Shipping',
      labelAr: 'سياسة الشحن والتوصيل',
      icon: Truck,
    },
    {
      id: 'terms',
      labelEn: 'Terms & Conditions',
      labelAr: 'الشروط والأحكام',
      icon: FileText,
    },
    {
      id: 'about',
      labelEn: 'About Toomakt',
      labelAr: 'عن توماكت',
      icon: Building2,
    },
  ];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-white text-[#22120C] font-sans py-10 sm:py-14 px-4 sm:px-6 lg:px-8 selection:bg-[#E890A8] selection:text-white">
      <div className="max-w-5xl mx-auto">
        
        {/* Navigation Breadcrumb Bar */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4 no-print">
          <button
            type="button"
            onClick={onBackHome || (() => onNavigateView && onNavigateView('home'))}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#22120C]/15 hover:border-[#E890A8] hover:text-[#E890A8] text-xs font-mono transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5 rtl:rotate-180" />
            <span>{isRtl ? 'العودة للمتجر الرئيسي' : 'Return to Home'}</span>
          </button>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#22120C]/[0.04] hover:bg-[#22120C]/[0.08] text-xs font-mono text-[#22120C]/80 transition-colors cursor-pointer"
              title={isRtl ? 'طباعة هذه الوثيقة' : 'Print Policy Document'}
            >
              <Printer className="w-3.5 h-3.5 text-[#E890A8]" />
              <span>{isRtl ? 'طباعة المستند' : 'Print'}</span>
            </button>
          </div>
        </div>

        {/* Page Hero Header */}
        <div className="text-center mb-10 sm:mb-12">
          <div className="inline-flex items-center justify-center gap-2 px-4 py-1.5 rounded-full bg-[#FDF2F5] border border-[#E890A8]/30 text-xs font-mono text-[#E890A8] font-bold uppercase tracking-wider mb-3">
            <Lock className="w-3.5 h-3.5" />
            <span>{isRtl ? 'وثائق المعاملات والسياسات الرسمية' : 'Official Legal & Compliance Policies'}</span>
          </div>
          
          <h1 className="font-serif text-3xl sm:text-5xl font-normal text-[#22120C] tracking-tight">
            {isRtl ? 'سياسات الشفافية وحماية العميل' : 'Legal Compliance & Customer Care'}
          </h1>
          
          <p className="mt-3 text-xs sm:text-sm text-[#22120C]/70 max-w-2xl mx-auto font-light leading-relaxed">
            {isRtl
              ? 'تلتزم شركة توماكت للحلويات والكراميل بأعلى معايير الشفافية، سلامة الأغذية، والأمان المالي وفق القوانين المصرية المنظمة وبوابات الدفع الإلكتروني المعتمدة.'
              : 'toomakt Confectionery Atelier is dedicated to the highest standards of food safety, consumer transparency, and secure electronic transactions.'}
          </p>
        </div>

        {/* Registered Merchant Summary Banner (Essential for Paymob Compliance) */}
        <div className="mb-10 p-5 sm:p-6 bg-[#FAF7F2] rounded-3xl border border-[#22120C]/10 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-serif font-bold text-base text-[#22120C]">
                {isRtl
                  ? 'شركة توماكت للحلويات والكراميل (toomakt Atelier)'
                  : 'toomakt Confectionery Atelier (شركة توماكت للحلويات والكراميل)'}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 text-[10px] font-mono font-bold uppercase">
                {isRtl ? 'معتمد رسمي' : 'Verified Merchant'}
              </span>
            </div>
            <p className="text-xs text-[#22120C]/70 font-light">
              <MapPin className="w-3.5 h-3.5 inline mr-1 text-[#E890A8]" />
              <span>{isRtl ? 'القاهرة، جمهورية مصر العربية' : 'Cairo, Arab Republic of Egypt'}</span>
              <span className="mx-2">•</span>
              <span>{isRtl ? 'سلامة الغذاء NFSA #017' : 'NFSA White-List #017'}</span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
            <a
              href="mailto:alzahra.company23@gmail.com"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-[#22120C]/15 hover:border-[#E890A8] text-[#22120C] transition-colors"
            >
              <Mail className="w-3.5 h-3.5 text-[#E890A8]" />
              <span>alzahra.company23@gmail.com</span>
            </a>
            <a
              href="tel:01024542139"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#E890A8] text-white font-bold hover:bg-[#6AACE9] transition-colors"
            >
              <Phone className="w-3.5 h-3.5" />
              <span dir="ltr">01024542139</span>
            </a>
          </div>
        </div>

        {/* Tab Selector Navigation */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none no-print border-b border-[#22120C]/10">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 sm:px-5 py-2.5 rounded-full text-xs font-mono font-semibold transition-all shrink-0 flex items-center gap-2 cursor-pointer ${
                  active
                    ? 'bg-[#E890A8] text-white shadow-xs'
                    : 'bg-[#22120C]/[0.04] text-[#22120C]/80 hover:bg-[#22120C]/[0.08] hover:text-[#22120C]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${active ? 'text-white' : 'text-[#E890A8]'}`} />
                <span>{isRtl ? tab.labelAr : tab.labelEn}</span>
              </button>
            );
          })}
        </div>

        {/* Dynamic Policy Content Section */}
        <div className="bg-white rounded-3xl border border-[#22120C]/10 p-6 sm:p-10 shadow-[0_16px_50px_rgba(34,18,12,0.04)] leading-relaxed">
          <AnimatePresence mode="wait">
            
            {/* ======================================================== */}
            {/* TAB 1: PRIVACY POLICY                                    */}
            {/* ======================================================== */}
            {activeTab === 'privacy' && (
              <motion.div
                key="privacy"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                <div className="border-b border-[#22120C]/10 pb-5">
                  <h2 className="font-serif text-2xl sm:text-3xl text-[#22120C] font-normal">
                    {isRtl ? 'سياسة الخصوصية وحماية البيانات' : 'Privacy & Data Protection Policy'}
                  </h2>
                  <p className="text-xs text-[#22120C]/60 font-mono mt-1">
                    {isRtl ? 'آخر تحديث: أكتوبر 2026 · متوافق مع قانون حماية البيانات المصري رقم 151 لسنة 2020' : 'Last Updated: October 2026 · Fully Compliant with Egyptian Data Protection Law No. 151 of 2020'}
                  </p>
                </div>

                <div className="space-y-4 text-xs sm:text-sm text-[#22120C]/85 font-light">
                  <h3 className="font-serif text-lg text-[#22120C] font-semibold pt-2">
                    {isRtl ? '1. التزامنا تجاه خصوصيتك' : '1. Our Commitment to Your Privacy'}
                  </h3>
                  <p>
                    {isRtl
                      ? 'تُدرك شركة توماكت للحلويات والكراميل (toomakt Atelier) أهمية خصوصية بيانات عملائنا. توضح هذه السياسة كيفية جمع بياناتك الشخصية، واستخدامها، وحمايتها عند زيارة موقعنا الإلكتروني أو الشراء عبره.'
                      : 'toomakt Confectionery Atelier values the trust you place in us. This policy outlines how your personal data is collected, utilized, and safeguarded when using our digital atelier and online ordering system.'}
                  </p>

                  <h3 className="font-serif text-lg text-[#22120C] font-semibold pt-2">
                    {isRtl ? '2. البيانات التي نقوم بجمعها' : '2. Information We Collect'}
                  </h3>
                  <p>
                    {isRtl
                      ? 'عند إتمامك لأي طلب شراء، نقوم بجمع المعلومات اللازمة فقط لإتمام عملية الشحن والتواصل معك، وتشمل: الاسم بالكامل، رقم الهاتف المحمول، البريد الإلكتروني، المحافظة والعنوان التفصيلي للتوصيل.'
                      : 'When you place an order, we collect only the necessary data to process and deliver your confections: full name, contact mobile number, email address, and precise delivery destination.'}
                  </p>

                  <h3 className="font-serif text-lg text-[#22120C] font-semibold pt-2">
                    {isRtl ? '3. أمن بطاقات الدفع وبوابة Paymob المشفرة' : '3. Card Security & Paymob Gateway Integration'}
                  </h3>
                  <div className="p-4 rounded-2xl bg-[#FDF2F5] border border-[#E890A8]/30 space-y-2">
                    <div className="flex items-center gap-2 font-semibold text-[#22120C]">
                      <Lock className="w-4 h-4 text-[#E890A8]" />
                      <span>{isRtl ? 'معالجة مشفرة بالكامل 3D-Secure ولا نخزن بيانات البطاقات' : 'Zero Card Data Storage & 256-bit SSL Paymob Encryption'}</span>
                    </div>
                    <p className="text-xs text-[#22120C]/75">
                      {isRtl
                        ? 'تتم جميع معاملات البطاقات البنكية (فيزا، ماستركارد، وميزة) من خلال اتصال مباشر وآمن مع بوابة بيموب (Paymob) المعتمدة من البنك المركزي المصري والخاضعة لمعايير الأمان العالمية PCI-DSS Level 1. لا يطلع موقع توماكت ولا يحتفظ بأي أرقام لبطاقتك الائتمانية أو رموز التحقق CVV على أي من خوادمنا على الإطلاق.'
                        : 'All credit, debit, and Meeza card transactions are processed directly through Paymob, a Payment Service Provider authorized by the Central Bank of Egypt and certified PCI-DSS Level 1. toomakt never stores, views, or records your credit card numbers or CVV codes.'}
                    </p>
                  </div>

                  <h3 className="font-serif text-lg text-[#22120C] font-semibold pt-2">
                    {isRtl ? '4. مشاركة البيانات مع جهات التوصيل' : '4. Shipping & Logistics Partner Data Sharing'}
                  </h3>
                  <p>
                    {isRtl
                      ? 'نشارك فقط اسم العميل، عنوان التوصيل، ورقم الهاتف مع مندوب الشحن المبرد أو شركة الشحن الرسمية لضمان تسليم الشحنة في الموعد المحدد. لا نبيع أو نؤجر أي بيانات شخصية لأي طرف ثالث لأغراض إعلانية.'
                      : 'We only share delivery contact details (name, phone, delivery address) with our licensed express cold-chain courier to facilitate safe arrival. We never sell, lease, or distribute customer records to third parties for commercial advertising.'}
                  </p>

                  <h3 className="font-serif text-lg text-[#22120C] font-semibold pt-2">
                    {isRtl ? '5. التواصل وحقوق العميل' : '5. Customer Rights & Inquiries'}
                  </h3>
                  <p>
                    {isRtl
                      ? 'يحق للعميل طلب تعديل أو حذف بياناته من سجلاتنا في أي وقت بالتواصل عبر البريد الرسمي: alzahra.company23@gmail.com أو عبر الخط الساخن المعتمد: 01024542139.'
                      : 'You maintain the right to inspect, amend, or delete your contact records at any time by writing to our compliance officer at alzahra.company23@gmail.com or calling +20 10 2454 2139.'}
                  </p>
                </div>
              </motion.div>
            )}

            {/* ======================================================== */}
            {/* TAB 2: REFUND & CANCELLATION POLICY                      */}
            {/* ======================================================== */}
            {activeTab === 'refund' && (
              <motion.div
                key="refund"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                <div className="border-b border-[#22120C]/10 pb-5">
                  <h2 className="font-serif text-2xl sm:text-3xl text-[#22120C] font-normal">
                    {isRtl ? 'سياسة الاسترجاع، الاستبدال، وإلغاء الطلبات' : 'Refund, Return & Cancellation Policy'}
                  </h2>
                  <p className="text-xs text-[#22120C]/60 font-mono mt-1">
                    {isRtl ? 'متوافقة مع قانون حماية المستهلك المصري رقم 181 لسنة 2018 ومعايير سلامة الأغذية NFSA' : 'Fully Compliant with Egyptian Consumer Protection Law No. 181/2018 & NFSA Standards'}
                  </p>
                </div>

                <div className="space-y-4 text-xs sm:text-sm text-[#22120C]/85 font-light">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-3">
                    <div className="p-4 rounded-2xl bg-[#FDF2F5] border border-[#E890A8]/20">
                      <span className="font-mono text-xs font-bold text-[#E890A8] block mb-1">
                        {isRtl ? 'مهلة الاسترجاع' : 'RETURN WINDOW'}
                      </span>
                      <p className="font-serif text-base text-[#22120C] font-medium">
                        {isRtl ? '14 يوماً من الاستلام' : '14 Calendar Days'}
                      </p>
                      <span className="text-[11px] text-[#22120C]/60 block mt-1">
                        {isRtl ? 'في حالات التلف أو العيب' : 'For transit defect or wrong items'}
                      </span>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#22120C]/10">
                      <span className="font-mono text-xs font-bold text-[#6AACE9] block mb-1">
                        {isRtl ? 'مدة رد الأموال' : 'REFUND TIMELINE'}
                      </span>
                      <p className="font-serif text-base text-[#22120C] font-medium">
                        {isRtl ? '7 إلى 14 يوم عمل' : '7 to 14 Business Days'}
                      </p>
                      <span className="text-[11px] text-[#22120C]/60 block mt-1">
                        {isRtl ? 'إلى البطاقة البنكية الأصلية' : 'Credited to original card / Paymob'}
                      </span>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#FDF2F5] border border-[#E890A8]/20">
                      <span className="font-mono text-xs font-bold text-[#E890A8] block mb-1">
                        {isRtl ? 'إلغاء الطلب' : 'CANCELLATION'}
                      </span>
                      <p className="font-serif text-base text-[#22120C] font-medium">
                        {isRtl ? 'مجاني 100%' : '100% Free of Charge'}
                      </p>
                      <span className="text-[11px] text-[#22120C]/60 block mt-1">
                        {isRtl ? 'قبل خروج مندوب التوصيل' : 'Before courier dispatch'}
                      </span>
                    </div>
                  </div>

                  <h3 className="font-serif text-lg text-[#22120C] font-semibold pt-2">
                    {isRtl ? '1. شروط استرجاع واستبدال المنتجات الغذائية' : '1. Eligibility & Food Hygiene Requirements'}
                  </h3>
                  <p>
                    {isRtl
                      ? 'حرصاً على الصحة العامة والتزاماً بمعايير الهيئة القومية لسلامة الغذاء (NFSA)، تُقبل طلبات الاسترجاع أو الاستبدال خلال 14 يوماً من تاريخ استلام الطلب في الحالات التالية:'
                      : 'In strict adherence to public health guidelines and National Food Safety Authority (NFSA) protocols, return and refund claims are eligible within 14 days under the following circumstances:'}
                  </p>
                  <ul className="list-disc list-inside space-y-1.5 text-xs sm:text-sm pl-2 rtl:pr-2">
                    <li>{isRtl ? 'تلف العبوة أو كسر الغلاف أثناء عمليات الشحن والنقل.' : 'Packaging damaged, broken, or compromised during transit.'}</li>
                    <li>{isRtl ? 'استلام منتج أو نكهة غير مطابقة لما تم طلبه في الفاتورة.' : 'Receipt of incorrect item or flavor differing from the order confirmation.'}</li>
                    <li>{isRtl ? 'وجود أي عيب مصنعي ملحوظ في جودة الحلوى.' : 'Verified manufacturing anomaly in confectionery consistency.'}</li>
                  </ul>
                  <p className="text-xs text-[#E890A8] font-mono">
                    {isRtl
                      ? '* ملحوظة: نظراً لطبيعة المنتجات الغذائية السريعة التأثر، يجب أن تكون العبوة بحالتها الأصلية ومغلقة بشريط الأمان دون فتح أو استخدام جزئي.'
                      : '* Important: For hygiene and safety reasons, food items must remain in their original unopened packaging with security seals fully intact.'}
                  </p>

                  <h3 className="font-serif text-lg text-[#22120C] font-semibold pt-2">
                    {isRtl ? '2. آلية استرداد الأموال (Refund Methods)' : '2. Refund Processing Channels'}
                  </h3>
                  <p>
                    {isRtl
                      ? 'يتم رد المبالغ المالية للعملاء بالوسيلة نفسها المستخدمة في الدفع:'
                      : 'Refunds are issued directly via the original channel of payment:'}
                  </p>
                  <ul className="list-disc list-inside space-y-1.5 text-xs sm:text-sm pl-2 rtl:pr-2">
                    <li>
                      <strong>{isRtl ? 'الدفع بالفيزا / الماستركارد عبر Paymob:' : 'Card Payments via Paymob:'}</strong>{' '}
                      {isRtl
                        ? 'يتم إصدار أمر الاسترداد الإلكتروني فور الموافقة على الطلب، وتصل القيمة إلى حساب بطاقتك البنكية خلال 7 إلى 14 يوم عمل وفقاً لدورة التسوية في بنك العميل.'
                        : 'Electronic refund authorization is initiated immediately upon approval; the funds appear in your card statement within 7–14 business days.'}
                    </li>
                    <li>
                      <strong>{isRtl ? 'الدفع عند الاستلام (COD) أو إنستاباي:' : 'Cash on Delivery or InstaPay:'}</strong>{' '}
                      {isRtl
                        ? 'يتم تحويل المبلغ عبر تطبيق إنستاباي (InstaPay) أو المحفظة الإلكترونية فور استلام المنتج المرتجع وفحصه خلال 24 - 48 ساعة.'
                        : 'Processed via InstaPay or official mobile wallet within 24–48 hours following parcel inspection.'}
                    </li>
                  </ul>

                  <h3 className="font-serif text-lg text-[#22120C] font-semibold pt-2">
                    {isRtl ? '3. سياسة إلغاء الطلبات (Cancellation)' : '3. Order Cancellation'}
                  </h3>
                  <p>
                    {isRtl
                      ? 'يمكن للعميل إلغاء طلبه مجاناً وبدون أي رسوم طالما أن الطلب في مرحلة التجهيز ولم يتم تسليمه لمندوب الشحن بعد. إذا تم تسليم الطلب للمندوب بالفعل، يُرجى التنسيق مع خدمة العملاء لرفض الاستلام وسداد رسوم الشحن فقط.'
                      : 'Orders may be cancelled completely free of charge before physical handover to our express courier. If the courier has already departed, please notify our team to initiate return protocols.'}
                  </p>

                  <h3 className="font-serif text-lg text-[#22120C] font-semibold pt-2">
                    {isRtl ? '4. كيفية تقديم طلب الاسترجاع' : '4. How to Initiate a Claim'}
                  </h3>
                  <p>
                    {isRtl
                      ? 'لتقديم طلب، يُرجى التواصل معنا مع ذكر رقم الطلب وصورة واضحة للمنتج عبر:'
                      : 'To request an exchange or refund, contact our concierge with your order reference and clear photos via:'}
                  </p>
                  <div className="flex flex-wrap gap-3 pt-1">
                    <a
                      href="https://wa.me/201024542139"
                      className="px-4 py-2 rounded-full bg-[#E890A8] text-white text-xs font-mono font-bold hover:bg-[#6AACE9] transition-colors"
                    >
                      WhatsApp: 01024542139
                    </a>
                    <a
                      href="mailto:alzahra.company23@gmail.com"
                      className="px-4 py-2 rounded-full bg-white border border-[#22120C]/15 text-xs font-mono text-[#22120C] hover:border-[#E890A8] transition-colors"
                    >
                      Email: alzahra.company23@gmail.com
                    </a>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ======================================================== */}
            {/* TAB 3: DELIVERY & SHIPPING POLICY                        */}
            {/* ======================================================== */}
            {activeTab === 'shipping' && (
              <motion.div
                key="shipping"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                <div className="border-b border-[#22120C]/10 pb-5">
                  <h2 className="font-serif text-2xl sm:text-3xl text-[#22120C] font-normal">
                    {isRtl ? 'سياسة الشحن والتوصيل المبرد' : 'Delivery & Cold-Chain Shipping Policy'}
                  </h2>
                  <p className="text-xs text-[#22120C]/60 font-mono mt-1">
                    {isRtl ? 'شحن مبرد معزول لجميع المحافظات الـ 27 في جمهورية مصر العربية' : 'Insulated climate-controlled dispatch across all 27 Egyptian governorates'}
                  </p>
                </div>

                <div className="space-y-4 text-xs sm:text-sm text-[#22120C]/85 font-light">
                  <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#22120C]/10 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <Sparkles className="w-4 h-4 text-[#E890A8]" />
                      <span className="font-serif font-bold text-sm text-[#22120C]">
                        {isRtl ? 'عرض الشحن المجاني' : 'Complimentary Delivery Tier'}
                      </span>
                    </div>
                    <span className="font-mono text-xs font-bold text-[#E890A8] bg-white px-3 py-1 rounded-full border border-[#E890A8]/30">
                      {isRtl ? 'شحن مجاني لكافة الطلبات بقيمة 500 ج.م فما فوق' : 'Free Shipping on all orders of 500.00 EGP or more'}
                    </span>
                  </div>

                  <h3 className="font-serif text-lg text-[#22120C] font-semibold pt-2">
                    {isRtl ? '1. تكاليف ومواعيد التوصيل حسب المحافظة' : '1. Regional Rates & Delivery Windows'}
                  </h3>

                  <div className="overflow-x-auto">
                    <table className="w-full text-xs font-sans border-collapse border border-[#22120C]/10 rounded-xl overflow-hidden">
                      <thead className="bg-[#FAF7F2] text-[#22120C] font-mono">
                        <tr>
                          <th className="p-3 text-left rtl:text-right border-b border-[#22120C]/10">{isRtl ? 'المنطقة والمحافظة' : 'Region & Governorate'}</th>
                          <th className="p-3 text-center border-b border-[#22120C]/10">{isRtl ? 'تكلفة الشحن' : 'Courier Fee'}</th>
                          <th className="p-3 text-center border-b border-[#22120C]/10">{isRtl ? 'مدة التوصيل' : 'Transit Window'}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#22120C]/10">
                        <tr>
                          <td className="p-3 font-medium">{isRtl ? 'القاهرة الكبرى والجيزة' : 'Cairo & Giza Courier'}</td>
                          <td className="p-3 text-center font-mono font-bold text-[#E890A8]">45.00 EGP</td>
                          <td className="p-3 text-center text-[#22120C]/70">{isRtl ? 'خلال 24 - 48 ساعة' : '24 - 48 Business Hours'}</td>
                        </tr>
                        <tr>
                          <td className="p-3 font-medium">{isRtl ? 'الإسكندرية، محافظات الدلتا والقناة' : 'Alexandria, Delta & Canal'}</td>
                          <td className="p-3 text-center font-mono">60.00 - 65.00 EGP</td>
                          <td className="p-3 text-center text-[#22120C]/70">{isRtl ? 'خلال 48 ساعة' : '48 Hours'}</td>
                        </tr>
                        <tr>
                          <td className="p-3 font-medium">{isRtl ? 'محافظات الصعيد وسيناء والمحافظات الحدودية' : 'Upper Egypt, Sinai & Red Sea'}</td>
                          <td className="p-3 text-center font-mono">75.00 - 85.00 EGP</td>
                          <td className="p-3 text-center text-[#22120C]/70">{isRtl ? '2 إلى 3 أيام عمل' : '2 - 3 Business Days'}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <h3 className="font-serif text-lg text-[#22120C] font-semibold pt-2">
                    {isRtl ? '2. نظام التغليف الحراري المعزول' : '2. Insulated Cold-Chain Packaging'}
                  </h3>
                  <p>
                    {isRtl
                      ? 'نظراً لأن حلوى توماكت مصنوعة من الزبدة الأوروبية الطبيعية وبيوريه الفاكهة 100% بدون أي مواد حافظة أو زيوت مهدرجة، يتم تجهيز كل طلب داخل صناديق حرارية معزولة مزودة بعبوات تبريد مخصصة لسلامة الأغذية، مما يضمن وصول التوفي بقوامه الطازج الفاخر حتى في درجات حرارة الصيف المرتفعة.'
                      : 'Because our toffee is prepared with natural European butterfat and whole fruit purée without hydrogenated oils, every order is dispatched in temperature-regulated insulated shipping boxes with food-safe cooling packs, guaranteeing cellar-fresh consistency upon arrival.'}
                  </p>

                  <h3 className="font-serif text-lg text-[#22120C] font-semibold pt-2">
                    {isRtl ? '3. تتبع الشحنة' : '3. Real-Time Tracking'}
                  </h3>
                  <p>
                    {isRtl
                      ? 'فور تسليم الشحنة لمندوب التوصيل، يتلقى العميل إشعاراً برقم الشحنة ورابط التتبع المباشر عبر صفحة تتبع الطلب (/track) أو عبر الواتساب.'
                      : 'Once dispatched, you receive a direct tracking link via SMS / WhatsApp, enabling live status monitoring directly on our tracking portal.'}
                  </p>
                </div>
              </motion.div>
            )}

            {/* ======================================================== */}
            {/* TAB 4: TERMS & CONDITIONS                                */}
            {/* ======================================================== */}
            {activeTab === 'terms' && (
              <motion.div
                key="terms"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                <div className="border-b border-[#22120C]/10 pb-5">
                  <h2 className="font-serif text-2xl sm:text-3xl text-[#22120C] font-normal">
                    {isRtl ? 'شروط وأحكام الاستخدام والبيع' : 'Terms & Conditions of Sale'}
                  </h2>
                  <p className="text-xs text-[#22120C]/60 font-mono mt-1">
                    {isRtl ? 'شركة توماكت للحلويات والكراميل · خاضعة لأحكام القوانين المعمول بها في جمهورية مصر العربية' : 'toomakt Confectionery Atelier · Governed by the Laws of the Arab Republic of Egypt'}
                  </p>
                </div>

                <div className="space-y-4 text-xs sm:text-sm text-[#22120C]/85 font-light">
                  <h3 className="font-serif text-lg text-[#22120C] font-semibold pt-2">
                    {isRtl ? '1. قبول الشروط والتعريفات' : '1. Acceptance & Operator Identity'}
                  </h3>
                  <p>
                    {isRtl
                      ? 'يُدار هذا الموقع الإلكتروني بالكامل بواسطة شركة توماكت للحلويات والكراميل (toomakt Atelier) ومقرها المسجل في القاهرة، جمهورية مصر العربية. يشكل استخدامك لهذا الموقع أو تقديم أي طلب شراء موافقة كاملة وصريحة على هذه الشروط والأحكام.'
                      : 'This website is operated by toomakt Confectionery Atelier, registered in Cairo, Egypt. By accessing our platform or placing an order, you agree unconditionally to these Terms of Service.'}
                  </p>

                  <h3 className="font-serif text-lg text-[#22120C] font-semibold pt-2">
                    {isRtl ? '2. دقة الأسعار والعملة الرسمية' : '2. Pricing & Currency'}
                  </h3>
                  <p>
                    {isRtl
                      ? 'جميع الأسعار المعروضة على الموقع مدونة بالجنيه المصري (EGP) وشاملة للضرائب المقررة. نحتفظ بحق تعديل الأسعار أو تصحيح أي خطأ غير مقصود في التسعير في أي وقت دون إشعار مسبق.'
                      : 'All prices quoted across the storefront are denominated in Egyptian Pounds (EGP) and inclusive of statutory value taxes. We reserve the right to correct typographical pricing discrepancies if required.'}
                  </p>

                  <h3 className="font-serif text-lg text-[#22120C] font-semibold pt-2">
                    {isRtl ? '3. الدفع الإلكتروني وبوابة Paymob' : '3. Electronic Payment Terms'}
                  </h3>
                  <p>
                    {isRtl
                      ? 'يُتاح الدفع عبر البطاقات البنكية المعتمدة (فيزا، ماستركارد، ميزة) بالتعاون مع بوابة بيموب Paymob مع اشتراط اجتياز خطوة الأمان ثلاثي الأبعاد (3D-Secure OTP) من بنك العميل المصدر للبطاقة. كما يُتاح الدفع عند الاستلام نقداً في المحافظات المغطاة.'
                      : 'Electronic payment is facilitated via authorized cards (Visa, Mastercard, Meeza) through Paymob, requiring standard 3D-Secure bank OTP verification. Cash on Delivery is also supported across designated regions.'}
                  </p>

                  <h3 className="font-serif text-lg text-[#22120C] font-semibold pt-2">
                    {isRtl ? '4. حقوق الملكية الفكرية والعلامات التجارية' : '4. Intellectual Property'}
                  </h3>
                  <p>
                    {isRtl
                      ? 'العلامة التجارية "TOOMAKT – توماكت"، وتصاميم المنتجات، والشعارات، والتركيبات، والمواد المرئية مملوكة حصرياً للشركة ولا يجوز نسخها أو إعادة إنتاجها بدون تصريح كتابي مسبق.'
                      : 'The trademark "TOOMAKT", its logo emblem, proprietary toffee recipes, visual packaging, and creative assets are the exclusive intellectual property of the operator.'}
                  </p>

                  <h3 className="font-serif text-lg text-[#22120C] font-semibold pt-2">
                    {isRtl ? '5. الاختصاص القضائي' : '5. Governing Law & Jurisdiction'}
                  </h3>
                  <p>
                    {isRtl
                      ? 'تخضع هذه الشروط والأحكام وتُفسر وفقاً للقوانين السارية في جمهورية مصر العربية، وتختص محاكم القاهرة بنظر أي نزاع قد ينشأ بخصوصها.'
                      : 'These terms are governed by and construed in accordance with the laws of the Arab Republic of Egypt, with Cairo courts holding exclusive jurisdiction.'}
                  </p>
                </div>
              </motion.div>
            )}

            {/* ======================================================== */}
            {/* TAB 5: ABOUT TOOMAKT                                     */}
            {/* ======================================================== */}
            {activeTab === 'about' && (
              <motion.div
                key="about"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                <div className="border-b border-[#22120C]/10 pb-5">
                  <h2 className="font-serif text-2xl sm:text-3xl text-[#22120C] font-normal">
                    {isRtl ? 'عن توماكت · قصة التوفي والطهي البطيء' : 'About toomakt · Heritage & Craft'}
                  </h2>
                  <p className="text-xs text-[#22120C]/60 font-mono mt-1">
                    {isRtl ? 'حِرْفَةُ التَّوْفِي الفَاخِرَة · سُورْيَا ١٩٧٠ · مِصْر ٢٠١٢' : 'Artisanal Toffee Atelier · Syria 1970 · Egypt 2012'}
                  </p>
                </div>

                <div className="space-y-4 text-xs sm:text-sm text-[#22120C]/85 font-light leading-relaxed">
                  <p>
                    {isRtl
                      ? 'شركة توماكت للحلويات والكراميل (toomakt Atelier) هي استمرار لإرث عائلي أصيل في صناعة السكاكر والتوفي بدأ منذ عام 1970، وانتقل بمرافقه التصنيعية الحديثة إلى مصر عام 2012 ليقدم أرقى مستوى من حلوى التوفي الفرنسي والبونبوني المحشي.'
                      : 'toomakt Confectionery Atelier carries forward a heritage of artisanal sugar confectionery founded in 1970 and established in Egypt in 2012, crafting French fruit toffee and filled bonbons.'}
                  </p>

                  <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#22120C]/10 space-y-2">
                    <span className="font-mono text-xs font-bold text-[#E890A8] uppercase tracking-wider block">
                      {isRtl ? 'فلسفة الطهي في مراجل النحاس' : 'OUR COPPER KETTLE PHILOSOPHY'}
                    </span>
                    <p className="text-xs text-[#22120C]/75">
                      {isRtl
                        ? 'تُطهى دفعات التوفي ببطء شديد على نار هادئة داخل مراجل نحاسية تقليدية مع بيوريه الفاكهة الطبيعية 100% والزبدة الأوروبية الفاخرة، دون إضافة أي ملونات صناعية أو زيوت نخيل أو جيلاتين تجاري.'
                        : 'Every small batch is simmered slowly inside copper kettles using 100% real fruit purées and European cultured butter, completely free of artificial coloring or palm oil.'}
                    </p>
                  </div>

                  <h3 className="font-serif text-lg text-[#22120C] font-semibold pt-2">
                    {isRtl ? 'اعتماد الهيئة القومية لسلامة الغذاء (NFSA #017)' : 'NFSA White-List Accreditation #017'}
                  </h3>
                  <p>
                    {isRtl
                      ? 'منشآتنا مدرجة رسمياً ضمن القائمة البيضاء للهيئة القومية لسلامة الغذاء بمصر (NFSA White-List No. 017)، مع تطبيق برامج رقابة جودة صارمة وشهادات ISO 22000 في جميع مراحل الإنتاج والتعبئة والتغليف المبرد.'
                      : 'Our manufacturing facilities are accredited on the Egyptian National Food Safety Authority (NFSA) White-List (No. 017), complying with rigorous ISO 22000 food safety management.'}
                  </p>

                  <div className="pt-4 border-t border-[#22120C]/10 flex flex-wrap items-center gap-4">
                    <button
                      type="button"
                      onClick={() => onNavigateView && onNavigateView('shop')}
                      className="px-6 py-2.5 rounded-full bg-[#E890A8] hover:bg-[#6AACE9] text-white text-xs font-mono font-bold tracking-wider uppercase transition-colors"
                    >
                      {isRtl ? 'تصفح تشكيلة الحلويات' : 'Explore The Collection'}
                    </button>
                    <button
                      type="button"
                      onClick={() => onNavigateView && onNavigateView('contact')}
                      className="px-6 py-2.5 rounded-full bg-white border border-[#22120C]/15 text-[#22120C] hover:border-[#E890A8] text-xs font-mono font-medium transition-colors"
                    >
                      {isRtl ? 'تواصل مع المعمل' : 'Contact Concierge'}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

        {/* Official Contact & Compliance Bar */}
        <div className="mt-10 p-6 rounded-3xl bg-[#FDF2F5] border border-[#E890A8]/20 text-center space-y-3">
          <h4 className="font-serif text-lg text-[#22120C] font-normal">
            {isRtl ? 'هل لديك أي استفسار بخصوص سياساتنا أو طلبك؟' : 'Have questions regarding our compliance policies or an order?'}
          </h4>
          <p className="text-xs text-[#22120C]/70 font-light max-w-lg mx-auto">
            {isRtl
              ? 'فريق خدمة العملاء والامتثال بشركة توماكت جاهز لمساعدتك يومياً من الساعة 9 صباحاً حتى 9 مساءً.'
              : 'Our customer support and compliance team is available daily from 9:00 AM to 9:00 PM.'}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <a
              href="mailto:alzahra.company23@gmail.com"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white border border-[#22120C]/15 text-xs font-mono text-[#22120C] hover:border-[#E890A8] transition-colors"
            >
              <Mail className="w-3.5 h-3.5 text-[#E890A8]" />
              <span>alzahra.company23@gmail.com</span>
            </a>
            <a
              href="https://wa.me/201024542139"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#E890A8] text-white text-xs font-mono font-bold hover:bg-[#6AACE9] transition-colors"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>WhatsApp / Hotline: 01024542139</span>
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};

export default LegalPoliciesView;
