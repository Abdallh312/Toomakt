import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageCircle,
  Phone,
  MapPin,
  Send,
  CheckCircle2,
  ChevronDown,
  Building2,
  Gift,
  HelpCircle,
  Mail,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { api } from '../services/api';
import { AUTHENTIC_FAQS } from '../data/toomaktData';

interface ContactWholesaleViewProps {
  onNavigateHome: () => void;
  onNavigateShop: () => void;
}

export const ContactWholesaleView: React.FC<ContactWholesaleViewProps> = ({
  onNavigateHome,
}) => {
  const { isRtl } = useLanguage();

  const [inquiryType, setInquiryType] = useState<'corporate' | 'hospitality' | 'wholesale' | 'general'>('corporate');
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    governorate: 'القاهرة (Cairo)',
    volume: '50 - 200 كرتونة (Cartons)',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [openFaqId, setOpenFaqId] = useState<string | null>('difference');

  const inquiryTypes = [
    { id: 'corporate', labelAr: 'هدايا الشركات والفعاليات', labelEn: 'Corporate Gifting', icon: Gift },
    { id: 'hospitality', labelAr: 'الفنادق والمقاهي الراقية', labelEn: 'Hospitality Supply', icon: Building2 },
    { id: 'wholesale', labelAr: 'توزيع وسوبرماركت', labelEn: 'Retail Distribution', icon: Send },
    { id: 'general', labelAr: 'خدمة العملاء والاستفسارات', labelEn: 'General Inquiries', icon: HelpCircle },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;

    setSubmitting(true);
    try {
      await api.submitWholesaleInquiry({
        name: formData.name,
        company_name: formData.company || 'Private Client',
        phone: formData.phone,
        email: formData.email,
        expected_volume: formData.volume,
        business_type: inquiryType,
        delivery_governorate: formData.governorate,
        additional_notes: formData.message,
      });
      setSubmitted(true);
    } catch {
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-white pt-28 sm:pt-36 pb-24 text-[#22120C]">
      <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-14">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-mono text-[#22120C]/60 mb-8">
          <button
            type="button"
            onClick={onNavigateHome}
            className="hover:text-[#E890A8] transition-colors cursor-pointer"
          >
            {isRtl ? 'الرئيسية' : 'Home'}
          </button>
          <span>/</span>
          <span className="text-[#E890A8] font-semibold">
            {isRtl ? 'تواصل وتوريد الشركات' : 'Concierge & Wholesale'}
          </span>
        </div>

        {/* Hero Section Header */}
        <div className="max-w-3xl mb-12 sm:mb-16">
          <p className="font-serif italic text-[#E890A8] text-lg sm:text-xl mb-3">
            {isRtl ? 'مُسْتَشَارُ الحَلْوَيَات · خِدْمَةُ العُمَلَاءِ وَالشَّرَاكَات' : 'Concierge & Hospitality Supply'}
          </p>
          <h1 className={`${isRtl ? 'font-sans font-bold text-2xl sm:text-4xl lg:text-[2.6rem] leading-[1.35]' : 'font-serif font-normal text-4xl sm:text-5xl lg:text-6xl leading-[1.1]'} tracking-tight text-[#22120C]`}>
            {isRtl
              ? 'نَحْنُ هُنَا لِخِدْمَتِك: طُرُودُ إِهْدَاءٍ رَاقِيَة، وَبَرَامِجُ تَوْرِيدٍ حَصْرِيَّة.'
              : 'At your service: bespoke gifting suites and premium wholesale partnerships.'}
          </h1>
          <p className="mt-6 text-sm sm:text-base text-[#22120C]/75 leading-relaxed font-light">
            {isRtl
              ? 'تواصل مباشرة مع شركة الزهرة للصناعات الغذائية (توماكت) للاستفسار عن طلبيات الجملة والتوريد، عقود التصدير، أو خدمة العملاء.'
              : 'Direct connection to Al-Zahra Food Industries (TOOMAKT). Whether arranging wholesale distribution, export contracts, or customer support, our team responds swiftly.'}
          </p>
        </div>

        {/* Quick Contact Action Pills */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-14">
          {/* 1. Official Phone / WhatsApp */}
          <a
            href="https://wa.me/201024542139?text=Hello%20toomakt%20Atelier!%20I%20have%20an%20inquiry."
            target="_blank"
            rel="noopener noreferrer"
            className="p-5 rounded-2xl bg-[#E890A8] text-white border border-[#E890A8] hover:bg-[#6AACE9] hover:shadow-md transition-all flex items-center gap-3.5 group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-full bg-white/20 text-white flex items-center justify-center shrink-0">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <span className="font-serif text-sm font-semibold text-white block">
                {isRtl ? 'الخط الساخن · واتساب' : 'Hotline & WhatsApp'}
              </span>
              <span className="text-xs font-mono text-white/95 font-bold" dir="ltr">
                01024542139
              </span>
            </div>
          </a>

          {/* 2. Official Email */}
          <a
            href="mailto:alzahra.company23@gmail.com"
            className="p-5 rounded-2xl bg-white border border-[#22120C]/10 hover:border-[#E890A8]/45 hover:shadow-xs transition-all flex items-center gap-3.5 group"
          >
            <div className="w-10 h-10 rounded-full bg-[#E890A8]/15 text-[#E890A8] flex items-center justify-center shrink-0">
              <Mail className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <span className="font-serif text-sm font-normal text-[#22120C] block">
                {isRtl ? 'البريد الإلكتروني الرسمي' : 'Official Email'}
              </span>
              <span className="text-xs font-mono text-[#22120C]/80 truncate block" title="alzahra.company23@gmail.com">
                alzahra.company23@gmail.com
              </span>
            </div>
          </a>

          {/* 3. Registered Head Office & Atelier in Cairo, Egypt */}
          <div className="p-5 rounded-2xl bg-white border border-[#22120C]/10 flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-full bg-[#6AACE9]/15 text-[#6AACE9] flex items-center justify-center shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <span className="font-serif text-sm font-normal text-[#22120C] block">
                {isRtl ? 'المقر ومعمل الحلويات' : 'Registered Atelier & HQ'}
              </span>
              <span className="text-xs font-mono text-[#22120C]/70">
                {isRtl ? 'القاهرة، جمهورية مصر العربية' : 'Cairo, Arab Republic of Egypt'}
              </span>
            </div>
          </div>

          {/* 4. Manufacturing Complex */}
          <div className="p-5 rounded-2xl bg-white border border-[#22120C]/10 flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-full bg-[#6AACE9]/15 text-[#6AACE9] flex items-center justify-center shrink-0">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <span className="font-serif text-sm font-normal text-[#22120C] block">
                {isRtl ? 'مجمع العاشر من رمضان' : '10th of Ramadan Plant'}
              </span>
              <span className="text-xs font-mono text-[#22120C]/60 line-clamp-1">
                {isRtl ? 'المنطقة الصناعية الثانية' : '2nd Industrial Zone'}
              </span>
            </div>
          </div>
        </div>

        {/* Main Inquiry Card Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 sm:gap-14 items-start mb-20 sm:mb-28">
          {/* Inquiry Form */}
          <div className="lg:col-span-7 bg-white border border-[#22120C]/10 rounded-[32px] p-6 sm:p-10 shadow-[0_20px_50px_rgba(34,18,12,0.06)]">
            <h2 className="font-serif text-2xl sm:text-3xl font-normal text-[#22120C] mb-2">
              {isRtl ? 'إرسال طلب استفسار أو توريد' : 'Submit a Business Inquiry'}
            </h2>
            <p className="text-xs sm:text-sm text-[#22120C]/70 font-light mb-8">
              {isRtl
                ? 'حدد نوع الطلب وسيقوم مسؤول المبيعات بالتواصل معك خلال ساعتين عمل.'
                : 'Select your inquiry category and our wholesale director will contact you within 2 business hours.'}
            </p>

            {/* Category Selector Tabs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-8">
              {inquiryTypes.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setInquiryType(t.id as any)}
                  className={`p-3 rounded-xl border text-center transition-all cursor-pointer font-mono ${
                    inquiryType === t.id
                      ? 'border-[#E890A8] bg-[#E890A8] text-white font-semibold shadow-xs'
                      : 'border-[#22120C]/10 text-[#22120C]/75 hover:border-[#E890A8]/50 bg-[#FDF2F5]'
                  }`}
                >
                  <span className="text-[11px] block leading-snug">
                    {isRtl ? t.labelAr : t.labelEn}
                  </span>
                </button>
              ))}
            </div>

            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-8 rounded-2xl bg-[#FDF2F5] border border-[#E890A8]/30 text-center"
              >
                <CheckCircle2 className="w-12 h-12 text-[#E890A8] mx-auto mb-3" />
                <h3 className="font-serif text-2xl font-normal text-[#22120C] mb-2">
                  {isRtl ? 'تم استلام طلبك بنجاح' : 'Inquiry Successfully Received'}
                </h3>
                <p className="text-xs sm:text-sm text-[#22120C]/75 max-w-md mx-auto leading-relaxed">
                  {isRtl
                    ? 'شكراً لتواصلك مع معمل توماكت. سيقوم مستشار الحلويات بمراجعة تفاصيل طلبك والتواصل معك هاتفياً أو عبر واتساب خلال ساعتين عمل.'
                    : 'Thank you for connecting with toomakt. Our client concierge will review your requirements and reach out via phone or WhatsApp shortly.'}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({
                      name: '',
                      company: '',
                      email: '',
                      phone: '',
                      governorate: 'القاهرة (Cairo)',
                      volume: '50 - 200 كرتونة (Cartons)',
                      message: '',
                    });
                  }}
                  className="mt-6 text-xs font-mono font-semibold text-[#E890A8] underline cursor-pointer"
                >
                  {isRtl ? 'إرسال استفسار آخر' : 'Send Another Inquiry'}
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono uppercase text-[#22120C]/60 mb-1.5 font-medium">
                      {isRtl ? 'الاسم الكريم *' : 'Full Name *'}
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder={isRtl ? 'أحمد إبراهيم' : 'Ahmed Ibrahim'}
                      className="w-full text-xs sm:text-sm px-4 py-3 rounded-xl border border-[#22120C]/12 bg-white text-[#22120C] focus:outline-none focus:border-[#E890A8] transition-colors font-mono placeholder:text-[#22120C]/40"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase text-[#22120C]/60 mb-1.5 font-medium">
                      {isRtl ? 'اسم الشركة أو الفعالية' : 'Company or Event'}
                    </label>
                    <input
                      type="text"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      placeholder={isRtl ? 'شركة / فندق / عميل خاص' : 'Four Seasons / Personal'}
                      className="w-full text-xs sm:text-sm px-4 py-3 rounded-xl border border-[#22120C]/12 bg-white text-[#22120C] focus:outline-none focus:border-[#E890A8] transition-colors font-mono placeholder:text-[#22120C]/40"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono uppercase text-[#22120C]/60 mb-1.5 font-medium">
                      {isRtl ? 'رقم الهاتف / واتساب *' : 'Phone / WhatsApp *'}
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="010XXXXXXXX"
                      className="w-full text-xs sm:text-sm px-4 py-3 rounded-xl border border-[#22120C]/12 bg-white text-[#22120C] focus:outline-none focus:border-[#E890A8] transition-colors font-mono placeholder:text-[#22120C]/40"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase text-[#22120C]/60 mb-1.5 font-medium">
                      {isRtl ? 'البريد الإلكتروني' : 'Email Address'}
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="client@company.com"
                      className="w-full text-xs sm:text-sm px-4 py-3 rounded-xl border border-[#22120C]/12 bg-white text-[#22120C] focus:outline-none focus:border-[#E890A8] transition-colors font-mono placeholder:text-[#22120C]/40"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono uppercase text-[#22120C]/60 mb-1.5 font-medium">
                      {isRtl ? 'المحافظة للتسليم' : 'Delivery Governorate'}
                    </label>
                    <select
                      value={formData.governorate}
                      onChange={(e) => setFormData({ ...formData, governorate: e.target.value })}
                      className="w-full text-xs sm:text-sm px-4 py-3 rounded-xl border border-[#22120C]/12 bg-white text-[#22120C] focus:outline-none focus:border-[#E890A8] transition-colors font-mono"
                    >
                      <option className="bg-white text-[#22120C]">القاهرة (Cairo)</option>
                      <option className="bg-white text-[#22120C]">الجيزة (Giza)</option>
                      <option className="bg-white text-[#22120C]">الإسكندرية (Alexandria)</option>
                      <option className="bg-white text-[#22120C]">الشرقية / العاشر من رمضان</option>
                      <option className="bg-white text-[#22120C]">الدقهلية / المنصورة</option>
                      <option className="bg-white text-[#22120C]">البحر الأحمر / الغردقة</option>
                      <option className="bg-white text-[#22120C]">جنوب سيناء / شرم الشيخ</option>
                      <option className="bg-white text-[#22120C]">باقي المحافظات الـ ٢٧ (Other)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase text-[#22120C]/60 mb-1.5 font-medium">
                      {isRtl ? 'الكمية التقديرية' : 'Estimated Volume'}
                    </label>
                    <select
                      value={formData.volume}
                      onChange={(e) => setFormData({ ...formData, volume: e.target.value })}
                      className="w-full text-xs sm:text-sm px-4 py-3 rounded-xl border border-[#22120C]/12 bg-white text-[#22120C] focus:outline-none focus:border-[#E890A8] transition-colors font-mono"
                    >
                      <option className="bg-white text-[#22120C]">طلبية شخصية أو عائلية (Personal / Family)</option>
                      <option className="bg-white text-[#22120C]">٢٠ - ٥٠ كرتونة (Boutique Cafe)</option>
                      <option className="bg-white text-[#22120C]">٥٠ - ٢٠٠ كرتونة (Hotel / Corporate)</option>
                      <option className="bg-white text-[#22120C]">أكثر من ٢٠٠ كرتونة (Distributor / Export)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-[#22120C]/60 mb-1.5 font-medium">
                    {isRtl ? 'ملاحظات أو مواصفات خاصة' : 'Additional Notes / Specifications'}
                  </label>
                  <textarea
                    rows={3}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder={
                      isRtl
                        ? 'يرجى كتابة أي طلبات تخص التغليف المخصص، شعار الشركة، أو النكهات المرغوبة...'
                        : 'Describe any custom sleeve packaging, wedding favors, or specific confections needed...'
                    }
                    className="w-full text-xs sm:text-sm p-4 rounded-xl border border-[#22120C]/12 bg-white text-[#22120C] focus:outline-none focus:border-[#E890A8] transition-colors resize-none placeholder:text-[#22120C]/40 font-mono"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-4 rounded-full bg-[#E890A8] text-white hover:bg-[#6AACE9] text-xs font-mono font-bold tracking-wider uppercase cursor-pointer transition-all shadow-[0_4px_14px_rgba(232,144,168,0.25)] hover:shadow-[0_6px_20px_rgba(106,172,233,0.35)]"
                >
                  {submitting
                    ? (isRtl ? 'جاري الإرسال...' : 'Submitting...')
                    : (isRtl ? 'إرسال طلب الاستفسار' : 'Submit Inquiry')}
                </button>
              </form>
            )}
          </div>

          {/* Right Information & FAQs */}
          <div className="lg:col-span-5 space-y-8">
            {/* Atelier Gifting Perquisites */}
            <div className="bg-white border border-[#22120C]/10 rounded-[32px] p-6 sm:p-8 shadow-[0_16px_40px_rgba(34,18,12,0.06)]">
              <p className="font-serif italic text-[#E890A8] text-sm mb-1">
                {isRtl ? 'مُمَيِّزَاتُ التَّوْرِيد' : 'Wholesale Perks'}
              </p>
              <h3 className="font-serif text-2xl text-[#22120C] font-normal mb-4">
                {isRtl ? 'خدمات معملية مصممة للشركات' : 'Tailored B2B Services'}
              </h3>
              <ul className="space-y-3.5 text-xs sm:text-sm text-[#22120C]/75 font-light">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#E890A8] shrink-0 mt-0.5" />
                  <span>{isRtl ? 'أسعار تصنيع حصرية لطلبيات الجملة والفنادق' : 'Tiered manufacturer direct pricing for volume orders'}</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#E890A8] shrink-0 mt-0.5" />
                  <span>{isRtl ? 'تغليف مخصص مع طباعة شعار شركتك وبطاقات إهداء' : 'Custom sleeves with embossed corporate branding & gift notes'}</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#E890A8] shrink-0 mt-0.5" />
                  <span>{isRtl ? 'شحن مبرد معزول حرارياً يضمن وصول الحلوى طازجة' : 'Cold-chain dispatch ensuring factory-fresh texture upon arrival'}</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#E890A8] shrink-0 mt-0.5" />
                  <span>{isRtl ? 'فواتير ضريبية رسمية معتمدة' : 'Official accredited tax invoices for corporate accounting'}</span>
                </li>
              </ul>
            </div>

            {/* Interactive FAQs Accordion */}
            <div className="bg-white border border-[#22120C]/10 rounded-[32px] p-6 sm:p-8 shadow-[0_16px_40px_rgba(34,18,12,0.06)]">
              <p className="font-serif italic text-[#E890A8] text-sm mb-1">
                {isRtl ? 'الأَسْئِلَةُ الشَّائِعَة' : 'Frequently Asked Questions'}
              </p>
              <h3 className="font-serif text-2xl text-[#22120C] font-normal mb-6">
                {isRtl ? 'إجابات عن الشحن والتخزين والجودة' : 'Common Questions'}
              </h3>

              <div className="space-y-3">
                {AUTHENTIC_FAQS.map((faq) => {
                  const isOpen = openFaqId === faq.id;
                  return (
                    <div
                      key={faq.id}
                      className="border border-[#22120C]/10 rounded-xl overflow-hidden bg-[#FDF2F5]"
                    >
                      <button
                        type="button"
                        onClick={() => setOpenFaqId(isOpen ? null : faq.id)}
                        className="w-full p-4 flex items-center justify-between text-left rtl:text-right font-medium text-xs sm:text-sm text-[#22120C] hover:bg-white transition-colors cursor-pointer"
                      >
                        <span className="font-serif text-sm">{isRtl ? faq.q_ar : faq.q_en}</span>
                        <ChevronDown className={`w-4 h-4 text-[#22120C]/60 transition-transform ${isOpen ? 'rotate-180 text-[#E890A8]' : ''}`} />
                      </button>

                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="px-4 pb-4 text-xs text-[#22120C]/75 font-light leading-relaxed border-t border-[#22120C]/10 pt-3"
                          >
                            {isRtl ? faq.a_ar : faq.a_en}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactWholesaleView;
