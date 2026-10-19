import React from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, ArrowUpRight } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface LandingFigmaConversationProps {
  onStartTalk: () => void;
}

export const LandingFigmaConversation: React.FC<LandingFigmaConversationProps> = ({
  onStartTalk,
}) => {
  const { isRtl } = useLanguage();

  return (
    <section
      id="start-a-sweet-conversation"
      className="relative w-full bg-[#FAF5EE] text-[#22120C] pb-20 sm:pb-28 px-6 sm:px-10 lg:px-16 overflow-hidden"
      aria-label="Official Contact and Inquiries"
    >
      <div className="max-w-7xl mx-auto rounded-3xl sm:rounded-[36px] overflow-hidden bg-[#E4AD70] p-8 sm:p-12 lg:p-16 shadow-[0_20px_50px_rgba(34,18,12,0.12)] border border-[#22120C]/10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Heading & Description */}
          <div className="lg:col-span-7 space-y-4 sm:space-y-5">
            <span className="text-[11px] sm:text-xs font-mono tracking-[0.2em] uppercase text-[#22120C]/75 font-semibold block">
              {isRtl ? 'بَيَانَاتُ التَّوَاصُلِ الرَّسْمِيَّة' : 'OFFICIAL CONTACT & INQUIRIES'}
            </span>

            <h2 className="font-serif text-3xl sm:text-5xl lg:text-[3.75rem] font-normal tracking-tight text-[#22120C] leading-[1.08]">
              {isRtl ? (
                <>
                  كُلُّ نَجَاحٍ يَبْدَأُ بِتَوَاصُل:
                  <br />
                  <span className="italic font-light">تَسْعَدُنَا خِدْمَتُكُمْ دَائِماً.</span>
                </>
              ) : (
                <>
                  Every Success Starts with a Talk:
                  <br />
                  <span className="italic font-light">We are Always at Your Service.</span>
                </>
              )}
            </h2>

            <p className="text-base sm:text-lg text-[#22120C]/85 font-light leading-relaxed max-w-xl">
              {isRtl
                ? 'استفسارات المنتجات، طلبيات الجملة والتوريد، عقود التصدير الدولي، أو زيارة مجمعنا بالعاشر من رمضان؛ فريق شركة الزهرة وتوماكت جاهز للإجابة السريعة.'
                : 'Product enquiries, wholesale distribution orders, international export contracts, or visiting our 10th of Ramadan complex; the Al-Zahra & TOOMAKT team is ready to assist.'}
            </p>

            {/* Direct Contact Links Strip */}
            <div className="flex flex-wrap items-center gap-2.5 pt-2">
              <a
                href="tel:01024542139"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#963725] text-white text-xs font-mono font-bold shadow-sm hover:bg-[#822E1E] transition-all"
                title={isRtl ? 'الرقم الرئيسي للموقع' : 'Main Website Line'}
              >
                <Phone className="w-3.5 h-3.5 text-[#FAF5EE]" />
                <span className="font-sans font-bold">{isRtl ? 'الرئيسي:' : 'Main:'}</span>
                <span dir="ltr">01024542139</span>
              </a>

              <a
                href="https://wa.me/201024542139?text=Hello%20Al-Zahra%20Toomakt!%20I%20have%20an%20inquiry."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-emerald-700 text-white text-xs font-mono font-medium hover:bg-emerald-800 transition-colors"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse" />
                <span>{isRtl ? 'واتساب مباشر' : 'WhatsApp'}</span>
                <span dir="ltr">01024542139</span>
              </a>

              <a
                href="tel:+201095288014"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-white/70 hover:bg-white text-[#22120C] border border-[#22120C]/15 text-xs font-mono font-medium transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-[#963725]" />
                <span dir="ltr">+20 10 95288014</span>
              </a>

              <a
                href="tel:+201277664957"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-white/70 hover:bg-white text-[#22120C] border border-[#22120C]/15 text-xs font-mono font-medium transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-[#963725]" />
                <span dir="ltr">+20 12 77664957</span>
              </a>

              <a
                href="mailto:alzahra.company23@gmail.com"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-white/70 hover:bg-white text-[#22120C] border border-[#22120C]/15 text-xs font-mono font-medium transition-colors"
              >
                <Mail className="w-3.5 h-3.5 text-[#963725]" />
                <span>alzahra.company23@gmail.com</span>
              </a>
            </div>
          </div>

          {/* Right Column: CTA & Official Social Channels */}
          <div className="lg:col-span-5 flex flex-col items-start lg:items-end gap-5">
            <button
              type="button"
              onClick={onStartTalk}
              className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-[#963725] hover:bg-[#822E1E] text-[#FAF5EE] font-medium text-sm sm:text-base shadow-[0_8px_24px_rgba(150,55,37,0.25)] hover:shadow-[0_12px_32px_rgba(232,144,168,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 ease-out cursor-pointer group will-change-transform"
            >
              <span>{isRtl ? 'إِرْسَالُ طَلَبٍ أَوْ اسْتِفْسَار' : 'Send an Inquiry'}</span>
              <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            </button>

            {/* Official Social Media Channels */}
            <div className="space-y-2 pt-2 text-left rtl:text-right w-full lg:w-auto">
              <span className="text-[11px] font-mono uppercase tracking-widest text-[#22120C]/70 font-semibold block">
                {isRtl ? 'تَابِعُونَا عَلَى وَسَائِلِ التَّوَاصُلِ الاِجْتِمَاعِيّ:' : 'OFFICIAL SOCIAL CHANNELS:'}
              </span>
              <div className="flex items-center gap-2.5">
                <a
                  href="https://facebook.com/share/1FViuqzzWy/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-1.5 rounded-full bg-white/70 hover:bg-white border border-[#22120C]/15 text-xs font-mono text-[#22120C] hover:text-[#963725] transition-all flex items-center gap-1.5"
                >
                  <span>Facebook</span>
                  <span className="text-[10px] opacity-60">↗</span>
                </a>
                <a
                  href="https://instagram.com/toomakt11"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-1.5 rounded-full bg-white/70 hover:bg-white border border-[#22120C]/15 text-xs font-mono text-[#22120C] hover:text-[#963725] transition-all flex items-center gap-1.5"
                >
                  <span>Instagram</span>
                  <span className="text-[10px] opacity-60">↗</span>
                </a>
                <a
                  href="https://tiktok.com/@alzahra.eg"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-1.5 rounded-full bg-white/70 hover:bg-white border border-[#22120C]/15 text-xs font-mono text-[#22120C] hover:text-[#963725] transition-all flex items-center gap-1.5"
                >
                  <span>TikTok</span>
                  <span className="text-[10px] opacity-60">↗</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LandingFigmaConversation;
