import React from 'react';
import { useLanguage } from '../context/LanguageContext';

interface AnnouncementBarProps {
  onNavigateView?: (view: string) => void;
}

export const AnnouncementBar: React.FC<AnnouncementBarProps> = ({ onNavigateView }) => {
  const { isRtl } = useLanguage();

  const handleShopClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onNavigateView) {
      onNavigateView('shop');
    } else {
      window.location.hash = '#shop';
    }
  };

  return (
    <div className="bg-[#3C1322] text-[#FAF7F2] text-xs py-2.5 px-4 overflow-hidden relative z-50 select-none border-b border-[#4D1B2D]">
      <div className="max-w-7xl mx-auto flex items-center justify-center text-center">
        <div className="flex items-center justify-center gap-2 sm:gap-3 text-[11px] sm:text-xs font-medium tracking-wide">
          <span>
            {isRtl ? 'عالم التوفي بالفاكهة الطبيعية مفتوح الآن' : 'THE FRUIT TOFFEE UNIVERSE IS OPEN'}
          </span>
          <span className="opacity-60">·</span>
          <span>
            {isRtl ? 'شحن مجاني للطلبات أكثر من 2,000 ج.م' : 'FREE SHIPPING OVER EGP 2,000'}
          </span>
          <span className="opacity-60">|</span>
          <button
            onClick={handleShopClick}
            className="underline underline-offset-4 hover:text-[#FFD147] transition-colors font-semibold"
          >
            {isRtl ? 'تسوق الآن' : 'Shop'}
          </button>
        </div>
      </div>
    </div>
  );
};
