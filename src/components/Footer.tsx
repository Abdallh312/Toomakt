import React, { useState } from 'react';
import { ArrowRight, Check } from 'lucide-react';
import { api } from '../services/api';
import { useLanguage } from '../context/LanguageContext';

interface FooterProps {
  onNavigateView?: (view: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigateView }) => {
  const { isRtl } = useLanguage();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    try {
      await api.subscribeNewsletter(email);
      setSubscribed(true);
    } catch {
      setSubscribed(true);
    }
  };

  const nav = (v: string) => {
    if (onNavigateView) {
      onNavigateView(v);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-[#1A1512] text-[#FAF7F2] pt-16 sm:pt-20 pb-12 border-t border-[#2A221C] select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Manifesto & Newsletter */}
        <div className="pb-16 border-b border-[#2A221C] grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-6">
            <span className="font-serif text-3xl sm:text-4xl text-[#FAF7F2] font-semibold tracking-tight lowercase block mb-4">
              toomakt
            </span>
            <p className="text-sm sm:text-base text-[#FAF7F2]/70 font-light max-w-md leading-relaxed">
              {isRtl
                ? 'حلوى توفي مصنوعة ببطء من بيوريه الفاكهة الطبيعية والزبدة الأوروبية. دفعات صغيرة طازجة من معملنا بالقاهرة.'
                : 'Artisanal fruit toffee crafted slowly with real fruit purée and European butter. Made in small batches in Cairo, Egypt.'}
            </p>
          </div>

          <div className="lg:col-span-6 flex flex-col lg:items-end">
            <span className="text-xs font-semibold text-[#FAF7F2] uppercase tracking-wider mb-2 block">
              {isRtl ? 'النشرة الحرفية' : 'THE ATELIER JOURNAL'}
            </span>
            <p className="text-xs text-[#FAF7F2]/60 mb-4 font-light lg:text-right rtl:lg:text-left">
              {isRtl
                ? 'انضم لقائمتنا للحصول على أول وصول للإصدارات الموسمية وهدية أول طلب.'
                : 'Receive early access to seasonal fruit releases and private tastings.'}
            </p>

            {subscribed ? (
              <div className="inline-flex items-center gap-2 bg-[#FAF7F2]/10 border border-[#FAF7F2]/20 text-[#FAF7F2] px-4 py-2.5 rounded-full text-xs font-medium">
                <Check className="w-3.5 h-3.5 text-[#88C057]" />
                <span>{isRtl ? 'تم اشتراكك بنجاح!' : 'Welcome to the atelier.'}</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex w-full max-w-md gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={isRtl ? 'بريدك الإلكتروني...' : 'your.email@example.com'}
                  required
                  className="flex-1 bg-[#261E1A] text-[#FAF7F2] placeholder-[#FAF7F2]/40 text-xs px-4 py-2.5 rounded-full border border-[#3A2D27] focus:outline-none focus:border-[#FAF7F2]/60 font-light"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#FAF7F2] text-[#1A1512] hover:bg-[#FFD147] rounded-full text-xs font-medium transition-colors cursor-pointer shrink-0"
                >
                  {isRtl ? 'اشتراك' : 'Subscribe'}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Links Navigation Grid */}
        <div className="py-12 border-b border-[#2A221C] grid grid-cols-2 md:grid-cols-4 gap-8 text-xs font-light">
          {/* Col 1: Shop */}
          <div>
            <h4 className="font-semibold text-xs tracking-wider uppercase text-[#FAF7F2] mb-4">
              {isRtl ? 'المجموعة' : 'COLLECTION'}
            </h4>
            <ul className="space-y-2.5 text-[#FAF7F2]/70">
              <li>
                <button onClick={() => nav('shop')} className="hover:text-[#FAF7F2] transition-colors">
                  {isRtl ? 'كل المنتجات' : 'All Collection'}
                </button>
              </li>
              <li>
                <button onClick={() => nav('shop')} className="hover:text-[#FAF7F2] transition-colors">
                  {isRtl ? 'مانجو سن بيم' : 'Mango Sunbeam'}
                </button>
              </li>
              <li>
                <button onClick={() => nav('shop')} className="hover:text-[#FAF7F2] transition-colors">
                  {isRtl ? 'بيري أفترجلو' : 'Berry Afterglow'}
                </button>
              </li>
              <li>
                <button onClick={() => nav('shop')} className="hover:text-[#FAF7F2] transition-colors">
                  {isRtl ? 'صناديق الهدايا الفاخرة' : 'Deluxe Gift Boxes'}
                </button>
              </li>
            </ul>
          </div>

          {/* Col 2: About */}
          <div>
            <h4 className="font-semibold text-xs tracking-wider uppercase text-[#FAF7F2] mb-4">
              {isRtl ? 'عن توماكت' : 'ABOUT'}
            </h4>
            <ul className="space-y-2.5 text-[#FAF7F2]/70">
              <li>
                <button onClick={() => nav('our-story')} className="hover:text-[#FAF7F2] transition-colors">
                  {isRtl ? 'قصتنا وحرفتنا' : 'Our Story & Atelier'}
                </button>
              </li>
              <li>
                <button onClick={() => nav('ingredients')} className="hover:text-[#FAF7F2] transition-colors">
                  {isRtl ? 'المكونات والزبدة' : 'Ingredients & Origins'}
                </button>
              </li>
              <li>
                <button onClick={() => nav('wholesale')} className="hover:text-[#FAF7F2] transition-colors">
                  {isRtl ? 'طلبات الجملة والشركات' : 'Corporate Gifting & Wholesale'}
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Assistance */}
          <div>
            <h4 className="font-semibold text-xs tracking-wider uppercase text-[#FAF7F2] mb-4">
              {isRtl ? 'المساعدة' : 'ASSISTANCE'}
            </h4>
            <ul className="space-y-2.5 text-[#FAF7F2]/70">
              <li>
                <button onClick={() => nav('track')} className="hover:text-[#FAF7F2] transition-colors">
                  {isRtl ? 'تتبع طلبك' : 'Track Your Order'}
                </button>
              </li>
              <li>
                <button onClick={() => nav('shipping')} className="hover:text-[#FAF7F2] transition-colors">
                  {isRtl ? 'الشحن والتوصيل' : 'Shipping & Delivery'}
                </button>
              </li>
              <li>
                <button onClick={() => nav('faq')} className="hover:text-[#FAF7F2] transition-colors">
                  {isRtl ? 'الأسئلة الشائعة' : 'FAQ'}
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Atelier & Admin */}
          <div>
            <h4 className="font-semibold text-xs tracking-wider uppercase text-[#FAF7F2] mb-4">
              {isRtl ? 'المقر' : 'ATELIER'}
            </h4>
            <p className="text-[#FAF7F2]/70 leading-relaxed mb-4">
              {isRtl ? 'القاهرة · جمهورية مصر العربية' : 'Cairo, Egypt'}<br />
              <span className="text-[11px] text-[#FAF7F2]/50">WhatsApp: +20 101 686 9608</span>
            </p>
            <div>
              <a
                href="#admin/login"
                className="text-[11px] text-[#FAF7F2]/40 hover:text-[#FAF7F2] transition-colors"
              >
                {isRtl ? 'بوابة إدارة المتجر' : 'Admin Portal →'}
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Copyright & Guarantee */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#FAF7F2]/50 font-light">
          <div>
            © {new Date().getFullYear()} toomakt. {isRtl ? 'جميع الحقوق محفوظة.' : 'All rights reserved.'}
          </div>
          <div className="flex items-center gap-4">
            <span>{isRtl ? 'الدفع عند الاستلام' : 'Cash on Delivery'}</span>
            <span>·</span>
            <span>{isRtl ? 'إنستاباي' : 'InstaPay'}</span>
            <span>·</span>
            <span>{isRtl ? 'شحن لجميع المحافظات' : 'All Egyptian Governorates'}</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
