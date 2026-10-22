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
    <div className="min-h-[75vh] bg-white text-[#22120C] flex items-center justify-center py-24 px-4 select-none">
      <div className="max-w-2xl w-full text-center">
        {/* Animated 404 Badge */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="relative inline-block mb-6"
        >
          <div className="w-32 h-32 rounded-[28px] bg-[#FDF2F5] border border-[#E890A8]/20 flex items-center justify-center mx-auto shadow-sm">
            <span className="font-serif text-5xl font-normal text-[#E890A8]">
              404
            </span>
          </div>

          <div className="absolute -top-2 -right-2 w-10 h-10 rounded-full bg-[#E890A8] text-white flex items-center justify-center shadow-md">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
        </motion.div>

        {/* Headline */}
        <p className="font-serif italic text-[#E890A8] text-sm mb-2">
          {isRtl ? 'خطأ 404 — الصفحة غير موجودة' : 'Error 404 — Page Not Found'}
        </p>
        <h1 className="font-serif text-3xl sm:text-5xl font-normal text-[#22120C] tracking-tight leading-tight mt-1 mb-3">
          {isRtl ? 'الصفحة المطلوبة غير متوفرة' : 'Page Not Found'}
        </h1>
        <p className="text-xs sm:text-sm text-[#22120C]/70 font-light max-w-md mx-auto mb-8 leading-relaxed">
          {isRtl
            ? 'يبدو أن الرابط الذي تبحث عنه غير متوفر أو تم نقله. يمكنك العودة إلى المتجر الرئيسي أو تصفح التشكيلة الكاملة.'
            : 'The page or confectionery collection you are looking for has been moved or does not exist. Return to our boutique collection below.'}
        </p>

        {/* Actions */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={onNavigateHome}
            className="text-xs flex items-center gap-2 cursor-pointer border border-[#22120C]/20 text-[#22120C] hover:border-[#6AACE9] hover:text-[#6AACE9] px-6 py-3 rounded-full font-mono transition-all"
          >
            <Home className="w-4 h-4" />
            <span>{isRtl ? 'الرئيسية' : 'Return Home'}</span>
          </button>

          <button
            type="button"
            onClick={onNavigateShop}
            className="text-xs flex items-center gap-2 cursor-pointer bg-[#E890A8] text-white hover:bg-[#6AACE9] px-6 py-3 rounded-full font-serif font-medium transition-all shadow-[0_4px_14px_rgba(232,144,168,0.25)] hover:shadow-[0_6px_20px_rgba(106,172,233,0.35)]"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>{isRtl ? 'تصفح التشكيلة' : 'Explore Collection'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
