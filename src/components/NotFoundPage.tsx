import React from 'react';
import { motion } from 'framer-motion';
import { Home, ShoppingBag, Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface NotFoundPageProps {
  onNavigateHome: () => void;
  onNavigateShop: () => void;
  onNavigateTrack?: () => void;
  onOpenSearch?: () => void;
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({
  onNavigateHome,
  onNavigateShop,
}) => {
  const { isRtl } = useLanguage();

  return (
    <div className="min-h-[75vh] bg-[#FAF7F2] dark:bg-[#120D11] flex items-center justify-center py-16 px-4 select-none transition-colors duration-300">
      <div className="max-w-2xl w-full text-center">
        {/* Animated 404 Badge */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="relative inline-block mb-6"
        >
          <div className="w-32 h-32 rounded-3xl bg-white dark:bg-[#1B1419] border border-[#E8E2D7] dark:border-[#33242E] shadow-soft-lg flex items-center justify-center mx-auto">
            <span className="font-serif text-5xl font-normal text-[#3C1322] dark:text-[#E8BD6D]">
              404
            </span>
          </div>

          <div className="absolute -top-2 -right-2 w-10 h-10 rounded-full bg-[#3C1322] text-[#FAF7F2] flex items-center justify-center shadow-soft">
            <Sparkles className="w-5 h-5 text-[#E8BD6D]" />
          </div>
        </motion.div>

        {/* Headline */}
        <span className="inline-block text-[10px] font-mono uppercase tracking-[0.2em] text-[#736B63] dark:text-[#C8BEB5] mb-2">
          {isRtl ? 'خطأ 404 — الصفحة غير موجودة' : 'ERROR 404 — PAGE NOT FOUND'}
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-normal text-[#1A1A1A] dark:text-[#F7F3EC] tracking-tight leading-tight mt-1 mb-3">
          {isRtl ? 'الصفحة المطلوبة غير متوفرة' : 'Page Not Found'}
        </h1>
        <p className="text-xs sm:text-sm text-[#736B63] dark:text-[#C8BEB5] font-light max-w-md mx-auto mb-8 leading-relaxed">
          {isRtl
            ? 'يبدو أن الرابط الذي تبحث عنه غير متوفر أو تم نقله. يمكنك العودة إلى المتجر الرئيسي أو التواصل معنا.'
            : 'The page or confectionery collection you are looking for has been moved or does not exist. Return to our boutique collection below.'}
        </p>

        {/* Actions */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={onNavigateHome}
            className="btn-secondary text-xs flex items-center gap-2 cursor-pointer shadow-soft"
          >
            <Home className="w-4 h-4" />
            <span>{isRtl ? 'الرئيسية' : 'Return Home'}</span>
          </button>

          <button
            type="button"
            onClick={onNavigateShop}
            className="btn-primary text-xs flex items-center gap-2 cursor-pointer shadow-soft"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>{isRtl ? 'تصفح المجموعة' : 'Explore Collection'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
