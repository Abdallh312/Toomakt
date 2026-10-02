import React from 'react';
import { useLanguage } from '../context/LanguageContext';

interface AnnouncementBarProps {
  onNavigateView?: (view: string) => void;
}

export const AnnouncementBar: React.FC<AnnouncementBarProps> = () => {
  const { isRtl } = useLanguage();

  return (
    <div className="bg-[#1F1127] text-[#F5EFE6] text-xs font-bold py-2.5 px-3 sm:px-6 border-b-2 border-[#1F1127] overflow-hidden relative z-50 select-none">
      <div className="max-w-7xl mx-auto flex items-center justify-center text-center">
        <div className="flex items-center justify-center gap-3 whitespace-nowrap text-[11px] sm:text-xs tracking-wider uppercase font-black">
          <span className="inline-block w-2 h-2 rounded-full bg-[#FFE842] animate-ping" />
          <span className="text-[#FFE842]">
            {isRtl ? 'عالم طقس الفواكه مفتوح الآن' : 'THE FRUIT WEATHER UNIVERSE IS OPEN'}
          </span>
          <span>•</span>
          <span className="text-[#F5EFE6]">
            {isRtl ? 'شحن مجاني للطلبات فوق 2,500 ج.م' : 'FREE SHIPPING OVER EGP 2,500'}
          </span>
          <span className="hidden md:inline">•</span>
          <span className="hidden md:inline text-[#C4E86E]">
            {isRtl ? 'فاكهة طبيعية 100% • مضغة خفيفة تدوم 45 ثانية' : '100% REAL FRUIT • 45S SOFT CHEW'}
          </span>
        </div>
      </div>
    </div>
  );
};

