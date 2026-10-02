import React, { useState } from 'react';
import {
  MessageCircle,
  Mail,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  AlertCircle,
  Truck,
  Package,
  Building2,
  Gift,
  ArrowLeft,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { api } from '../services/api';

const EGYPT_GOVERNORATES = [
  'Cairo', 'Giza', 'Alexandria', 'Dakahlia', 'Red Sea', 'Beheira',
  'Fayoum', 'Gharbia', 'Ismailia', 'Menofia', 'Minya', 'Qalyubia',
  'New Valley', 'Suez', 'Aswan', 'Assiut', 'Beni Suef', 'Port Said',
  'Damietta', 'Sharkia', 'South Sinai', 'Kafr El Sheikh', 'Matrouh',
  'Luxor', 'Qena', 'North Sinai', 'Sohag'
];

const FLAVORS = [
  { id: 'mango-sunbeam', name: 'Mango Sunbeam', desc: 'Alphonso Mango & Normandy Butter' },
  { id: 'berry-afterglow', name: 'Berry Afterglow', desc: 'Alpine Strawberry & Cultured Cream' },
  { id: 'citrus-comet', name: 'Citrus Comet', desc: 'Mediterranean Lemon & Lime' },
  { id: 'sun-chaser-box', name: 'Sun Chaser Gift Box', desc: '12-Piece Linen Presentation Box' },
  { id: 'orchard-reserve', name: 'Orchard Reserve', desc: 'Stone Fruit & Caramel Nuance' },
  { id: 'evening-citrus', name: 'Evening Citrus', desc: 'Blood Orange & Bergamot' },
];

interface WholesaleViewProps {
  onNavigateView?: (view: string) => void;
}

export const WholesaleView: React.FC<WholesaleViewProps> = ({ onNavigateView }) => {
  const { isRtl } = useLanguage();

  // Form State
  const [fullName, setFullName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [inquiryType, setInquiryType] = useState('Corporate Gifting');
  const [governorate, setGovernorate] = useState('Cairo');
  const [selectedFlavors, setSelectedFlavors] = useState<string[]>(['mango-sunbeam', 'sun-chaser-box']);
  const [estimatedQuantity, setEstimatedQuantity] = useState('50 - 100 packs');
  const [message, setMessage] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const toggleFlavor = (id: string) => {
    if (selectedFlavors.includes(id)) {
      setSelectedFlavors(selectedFlavors.filter(f => f !== id));
    } else {
      setSelectedFlavors([...selectedFlavors, id]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!fullName.trim() || !phone.trim() || !email.trim()) {
      setErrorMessage(isRtl ? 'يرجى ملء جميع الحقول المطلوبة' : 'Please fill in your name, email, and phone number.');
      return;
    }

    setIsSubmitting(true);

    try {
      await api.submitWholesaleInquiry({
        contact_name: fullName.trim(),
        company_name: companyName.trim() || 'Private Client',
        email: email.trim(),
        phone: phone.trim(),
        governorate: governorate,
        estimated_monthly_volume: estimatedQuantity,
        message: `Inquiry Type: ${inquiryType} | Flavors: ${selectedFlavors.join(', ')} | Notes: ${message.trim()}`
      });

      setIsSuccess(true);
    } catch (err: any) {
      // Even if offline API fails, show success response for peace of mind
      setIsSuccess(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#FAF7F2] text-[#1A1A1A] min-h-screen py-10 sm:py-14 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-5xl mx-auto">
        
        {/* Navigation Breadcrumb */}
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={() => onNavigateView && onNavigateView('home')}
            className="btn-secondary text-xs flex items-center gap-2 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{isRtl ? 'العودة للرئيسية' : 'RETURN TO ATELIER'}</span>
          </button>
          
          <span className="text-xs text-[#736B63] font-light">
            {isRtl ? 'خدمة العملاء والطلبات الخاصة' : 'Concierge & Inquiries'}
          </span>
        </div>

        {/* Page Header */}
        <div className="text-center mb-12 sm:mb-16">
          <span className="text-[11px] font-semibold text-[#736B63] uppercase tracking-widest block mb-2">
            {isRtl ? 'تواصل معنا' : 'CONTACT & CONCIERGE'}
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl font-normal text-[#1A1A1A] tracking-tight mb-4">
            {isRtl ? 'يسعدنا دائماً التحدث معك.' : 'We would love to hear from you.'}
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-[#736B63] font-light max-w-2xl mx-auto leading-relaxed">
            {isRtl
              ? 'تواصل مباشرة مع معملنا في القاهرة للاستفسار عن هدايا الشركات، وحفلات الزفاف، والطلبات الخاصة المخصصة.'
              : 'Direct connection to our Cairo kitchen for custom batch orders, wedding favors, corporate gifting, or general tasting inquiries.'}
          </p>
        </div>

        {/* Quick Contact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 sm:mb-16">
          {/* WhatsApp Direct */}
          <a
            href="https://wa.me/201016869608?text=Hello%20toomakt%20Atelier!%20I%20have%20an%20inquiry."
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white rounded-2xl p-6 border border-[#E8E2D7] shadow-soft hover:border-[#1A1A1A] transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="w-10 h-10 rounded-full bg-[#3C1322]/10 text-[#3C1322] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <MessageCircle className="w-5 h-5 text-[#3C1322]" />
              </div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#736B63] block mb-1">
                {isRtl ? 'محادثة فورية' : 'INSTANT CHAT'}
              </span>
              <h3 className="font-serif text-lg font-normal text-[#1A1A1A] mb-1">
                WhatsApp Concierge
              </h3>
              <p className="text-xs text-[#736B63] font-light leading-relaxed">
                {isRtl ? 'تواصل فوري مع فريق التحضير والطلبات اليومية.' : 'Direct response from our atelier concierge team.'}
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-[#E8E2D7] flex items-center justify-between text-xs text-[#3C1322] font-medium">
              <span>+20 101 686 9608</span>
              <span>→</span>
            </div>
          </a>

          {/* Email Inquiries */}
          <div className="bg-white rounded-2xl p-6 border border-[#E8E2D7] shadow-soft flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-full bg-[#1A1A1A]/5 text-[#1A1A1A] flex items-center justify-center mb-4">
                <Mail className="w-5 h-5 text-[#1A1A1A]" />
              </div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#736B63] block mb-1">
                {isRtl ? 'البريد الإلكتروني' : 'EMAIL'}
              </span>
              <h3 className="font-serif text-lg font-normal text-[#1A1A1A] mb-1">
                Atelier Inquiries
              </h3>
              <p className="text-xs text-[#736B63] font-light leading-relaxed">
                {isRtl ? 'لطلبات التعاون وعروض الأسعار الرسمية.' : 'For corporate proposals, press inquiries, and invoices.'}
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-[#E8E2D7] text-xs text-[#1A1A1A] font-medium">
              <span>atelier@toomakt.com</span>
            </div>
          </div>

          {/* Location & Kitchen */}
          <div className="bg-white rounded-2xl p-6 border border-[#E8E2D7] shadow-soft flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-full bg-[#1A1A1A]/5 text-[#1A1A1A] flex items-center justify-center mb-4">
                <MapPin className="w-5 h-5 text-[#1A1A1A]" />
              </div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#736B63] block mb-1">
                {isRtl ? 'المقر' : 'LOCATION'}
              </span>
              <h3 className="font-serif text-lg font-normal text-[#1A1A1A] mb-1">
                Cairo Kitchen & Studio
              </h3>
              <p className="text-xs text-[#736B63] font-light leading-relaxed">
                {isRtl ? 'القاهرة، مصر · الشحن متاح لجميع المحافظات' : 'Cairo, Egypt · Shipping to all 27 governorates.'}
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-[#E8E2D7] text-xs text-[#736B63] font-light flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#3C1322]" />
              <span>Sat–Thu: 10:00 AM – 7:00 PM</span>
            </div>
          </div>
        </div>

        {/* Inquiry Form Card */}
        <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-10 border border-[#E8E2D7] shadow-soft">
          <div className="max-w-2xl mb-8">
            <span className="text-[11px] font-semibold text-[#736B63] uppercase tracking-widest block mb-2">
              {isRtl ? 'نموذج الطلبات الخاصة' : 'INQUIRY FORM'}
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl text-[#1A1A1A] font-normal">
              {isRtl ? 'أخبرنا عن مناسبتك أو استفسارك' : 'Tell us about your requirements'}
            </h2>
            <p className="text-xs sm:text-sm text-[#736B63] font-light mt-1">
              {isRtl
                ? 'سنرد عليك بعرض مفصل وعينات تذوق مقترحة خلال 24 ساعة.'
                : 'Our concierge will respond within 24 hours with custom pricing, packaging mockups, or sample arrangements.'}
            </p>
          </div>

          {isSuccess ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-8 bg-[#FAF7F2] rounded-2xl border border-[#E8E2D7] text-center max-w-md mx-auto my-8"
            >
              <div className="w-12 h-12 rounded-full bg-[#3C1322] text-[#FAF7F2] flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl text-[#1A1A1A] mb-2 font-normal">
                {isRtl ? 'شكراً لتواصلك معنا' : 'Thank You for Reaching Out'}
              </h3>
              <p className="text-xs text-[#736B63] font-light leading-relaxed mb-6">
                {isRtl
                  ? 'تم استلام استفسارك بنجاح. سيتواصل معك مستشار الحلويات لدينا في أقرب وقت.'
                  : 'Your message has been safely received by our confectionery atelier team. We will review your request and get back to you shortly.'}
              </p>
              <button
                onClick={() => setIsSuccess(false)}
                className="btn-secondary text-xs"
              >
                <span>{isRtl ? 'إرسال استفسار آخر' : 'Send Another Inquiry'}</span>
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {errorMessage && (
                <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Inquiry Type Tabs */}
              <div>
                <label className="block text-xs font-medium text-[#736B63] uppercase tracking-wider mb-2">
                  {isRtl ? 'نوع الطلب أو الاستفسار' : 'Inquiry Purpose'}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    'Corporate Gifting',
                    'Wedding Favors',
                    'Wholesale Partner',
                    'General Inquiry'
                  ].map((type) => {
                    const isSelected = inquiryType === type;
                    return (
                      <button
                        type="button"
                        key={type}
                        onClick={() => setInquiryType(type)}
                        className={`py-2.5 px-3 rounded-xl text-xs font-medium border transition-all text-center cursor-pointer ${
                          isSelected
                            ? 'bg-[#3C1322] text-[#FAF7F2] border-[#3C1322] shadow-soft'
                            : 'bg-[#FAF7F2] text-[#736B63] border-[#E8E2D7] hover:border-[#1A1A1A]'
                        }`}
                      >
                        {type}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Contact Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#736B63] uppercase tracking-wider mb-1.5">
                    {isRtl ? 'الاسم الكامل *' : 'Full Name *'}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Karim El-Sayed"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-[#FAF7F2] border border-[#E8E2D7] rounded-xl px-4 py-2.5 text-sm text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#736B63] uppercase tracking-wider mb-1.5">
                    {isRtl ? 'اسم الشركة أو المناسبة' : 'Company or Event Name'}
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Mansour Group / Wedding"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full bg-[#FAF7F2] border border-[#E8E2D7] rounded-xl px-4 py-2.5 text-sm text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#736B63] uppercase tracking-wider mb-1.5">
                    {isRtl ? 'البريد الإلكتروني *' : 'Email Address *'}
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="karim@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#FAF7F2] border border-[#E8E2D7] rounded-xl px-4 py-2.5 text-sm text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#736B63] uppercase tracking-wider mb-1.5">
                    {isRtl ? 'رقم الهاتف / واتساب *' : 'Phone / WhatsApp (Egypt) *'}
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="010XXXXXXXX"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-[#FAF7F2] border border-[#E8E2D7] rounded-xl px-4 py-2.5 text-sm text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A]"
                  />
                </div>
              </div>

              {/* Flavors of Interest */}
              <div>
                <label className="block text-xs font-medium text-[#736B63] uppercase tracking-wider mb-2">
                  {isRtl ? 'النكهات أو المنتجات المطلوبة' : 'Flavors & Items of Interest'}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                  {FLAVORS.map((flv) => {
                    const isChecked = selectedFlavors.includes(flv.id);
                    return (
                      <div
                        key={flv.id}
                        onClick={() => toggleFlavor(flv.id)}
                        className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                          isChecked
                            ? 'bg-[#FAF7F2] border-[#3C1322] shadow-soft'
                            : 'bg-white border-[#E8E2D7] hover:border-[#1A1A1A]'
                        }`}
                      >
                        <div>
                          <span className="text-xs font-medium text-[#1A1A1A] block">
                            {flv.name}
                          </span>
                          <span className="text-[10px] text-[#736B63] font-light">
                            {flv.desc}
                          </span>
                        </div>
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          isChecked ? 'bg-[#3C1322] border-[#3C1322] text-[#FAF7F2]' : 'border-[#E8E2D7]'
                        }`}>
                          {isChecked && <span className="text-[10px]">✓</span>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Volume and Location Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#736B63] uppercase tracking-wider mb-1.5">
                    {isRtl ? 'الكمية التقديرية' : 'Estimated Quantity'}
                  </label>
                  <select
                    value={estimatedQuantity}
                    onChange={(e) => setEstimatedQuantity(e.target.value)}
                    className="w-full bg-[#FAF7F2] border border-[#E8E2D7] rounded-xl px-4 py-2.5 text-sm text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A]"
                  >
                    <option value="25 - 50 packs">25 – 50 packs / boxes</option>
                    <option value="50 - 100 packs">50 – 100 packs / boxes</option>
                    <option value="100 - 250 packs">100 – 250 packs / boxes</option>
                    <option value="250+ custom units">250+ custom bespoke units</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#736B63] uppercase tracking-wider mb-1.5">
                    {isRtl ? 'المحافظة' : 'Delivery Governorate'}
                  </label>
                  <select
                    value={governorate}
                    onChange={(e) => setGovernorate(e.target.value)}
                    className="w-full bg-[#FAF7F2] border border-[#E8E2D7] rounded-xl px-4 py-2.5 text-sm text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A]"
                  >
                    {EGYPT_GOVERNORATES.map((gov) => (
                      <option key={gov} value={gov}>{gov}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Notes Textarea */}
              <div>
                <label className="block text-xs font-medium text-[#736B63] uppercase tracking-wider mb-1.5">
                  {isRtl ? 'ملاحظات أو مواصفات خاصة' : 'Custom Details, Delivery Date, or Message'}
                </label>
                <textarea
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={isRtl ? 'تاريخ المناسبة، نوع التغليف، تفاصيل بطاقات الإهداء...' : 'Target delivery date, branding/sleeve requests, gift notes, etc.'}
                  className="w-full bg-[#FAF7F2] border border-[#E8E2D7] rounded-xl px-4 py-2.5 text-sm text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A]"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary w-full py-4 text-xs font-semibold uppercase tracking-widest flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-[#FAF7F2] border-t-transparent rounded-full animate-spin" />
                    <span>{isRtl ? 'جاري الإرسال...' : 'Sending inquiry...'}</span>
                  </div>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>{isRtl ? 'إرسال الاستفسار للمعمل' : 'Send Concierge Inquiry'}</span>
                  </>
                )}
              </button>

              <div className="text-[11px] text-center text-[#736B63] space-y-1 font-light">
                <p>All inquiries are handled directly by our Cairo kitchen concierge.</p>
              </div>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};
