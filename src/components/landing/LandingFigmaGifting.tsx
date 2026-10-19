import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Handshake, Users, Store, Building2 } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface LandingFigmaGiftingProps {
  onTalkGifting: () => void;
}

export const LandingFigmaGifting: React.FC<LandingFigmaGiftingProps> = ({
  onTalkGifting,
}) => {
  const { isRtl } = useLanguage();

  const partnerTiers = [
    { en: 'Wholesalers & Bulk Distributors', ar: 'تجار الجملة والموزعين' },
    { en: 'Commercial Agents & Exporters', ar: 'الوكلاء التجاريين والتصدير' },
    { en: 'Retail Chains & Supermarkets', ar: 'سلاسل التجزئة والمتاجر' },
  ];

  return (
    <section
      id="sweetness-worth-sharing"
      className="relative w-full bg-white text-[#22120C] py-24 sm:py-36 px-6 sm:px-10 lg:px-16 overflow-hidden"
      aria-label="Wholesale and Trade Partnerships"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        {/* Left Column: Commercial Trade Message */}
        <div className="lg:col-span-6 space-y-6 sm:space-y-8">
          <span className="text-[11px] sm:text-xs font-mono tracking-[0.2em] uppercase text-[#E890A8] font-semibold block">
            {isRtl ? 'شَرَاكَاتُ النَّجَاحِ وَالتَّوْزِيعِ التِّجَارِيّ' : 'WHOLESALE & TRADE PARTNERSHIPS'}
          </span>

          <h2 className="font-serif text-3xl sm:text-5xl lg:text-[3.75rem] font-normal tracking-tight text-[#22120C] leading-[1.08]">
            {isRtl ? (
              <>
                عَلَاقَاتٌ طَوِيلَةُ الأَمَد:
                <br />
                <span className="italic font-light text-[#E890A8]">
                  مَعَ شُرَكَاءِ النَّجَاحِ حَوْلَ العَالَم.
                </span>
              </>
            ) : (
              <>
                Enduring Alliances:
                <br />
                <span className="italic font-light text-[#E890A8]">
                  With Trade Partners Globally.
                </span>
              </>
            )}
          </h2>

          <p className="text-base sm:text-lg text-[#22120C]/80 font-light leading-relaxed max-w-lg">
            {isRtl
              ? 'نعمل على بناء علاقات طويلة الأمد مع تجار الجملة والموزعين والوكلاء ومحلات التجزئة، مع السعي إلى تلبية تطلعات المستهلكين وتقديم منتجات تلائم احتياجات الأسواق المختلفة بمذاق مميز وأسعار تنافسية.'
              : 'We forge long-term partnerships with wholesalers, distributors, trade agents, and retail chains, dedicated to satisfying consumer demand with products tailored to diverse market requirements at reliable quality and competitive pricing.'}
          </p>

          <div className="pt-2 space-y-5">
            <button
              type="button"
              onClick={onTalkGifting}
              className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-[#E890A8] hover:bg-[#6AACE9] text-white font-medium text-sm sm:text-base shadow-[0_8px_24px_rgba(232,144,168,0.35)] hover:shadow-[0_12px_32px_rgba(106,172,233,0.45)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 ease-out cursor-pointer group will-change-transform"
            >
              <span>{isRtl ? 'تَوَاصَلْ لِطَلَبَاتِ الجُمْلَةِ وَالتَّوْزِيع' : 'Inquire for Wholesale & Trade'}</span>
              <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            </button>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              {partnerTiers.map((tier, idx) => {
                const isBlue = idx % 2 !== 0;
                return (
                  <span
                    key={idx}
                    className={`px-3.5 py-1.5 rounded-full bg-white text-xs font-mono text-[#22120C]/80 shadow-xs transition-colors border ${
                      isBlue
                        ? 'border-[#6AACE9]/35 hover:border-[#6AACE9] hover:text-[#6AACE9]'
                        : 'border-[#E890A8]/35 hover:border-[#E890A8] hover:text-[#E890A8]'
                    }`}
                  >
                    {isRtl ? tier.ar : tier.en}
                  </span>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Arched Still Life Showcase Image */}
        <div className="lg:col-span-6 relative flex justify-center lg:justify-end">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.8 }}
            className="relative w-full max-w-[500px] aspect-[4/3.4] rounded-t-[140px] rounded-b-3xl overflow-hidden shadow-[0_20px_50px_rgba(34,18,12,0.12)] border border-[#22120C]/10 bg-[#E890A8]/10 group"
          >
            <img
              src="/images/figma/7a1d2bd79e3da9ebae2f6943a53ec8be937f6d5e.jpg"
              alt="TOOMAKT commercial confectionery cartons and export assortments"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-out"
              loading="lazy"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default LandingFigmaGifting;
