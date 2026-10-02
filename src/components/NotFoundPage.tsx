import React from 'react';
import { motion } from 'framer-motion';
import { Home, ShoppingBag, Sparkles, CloudSun } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface NotFoundPageProps {
  onNavigateHome: () => void;
  onNavigateShop: () => void;
  onNavigateTrack: () => void;
  onOpenSearch?: () => void;
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({
  onNavigateHome,
  onNavigateShop,
}) => {
  const { isRtl } = useLanguage();

  return (
    <div className="min-h-[75vh] bg-[#F5EFE6] flex items-center justify-center py-16 px-4 select-none">
      <div className="max-w-2xl w-full text-center">
        {/* Animated 404 Weather Cloud */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="relative inline-block mb-6"
        >
          <div className="w-36 h-36 rounded-full bg-[#FFE842] border-3 border-[#1F1127] shadow-neo-lg flex items-center justify-center mx-auto">
            <span className="font-display font-black text-5xl text-[#1F1127]">
              404
            </span>
          </div>

          <div className="absolute -top-2 -right-2 w-12 h-12 rounded-full bg-[#FF5E2B] border-2 border-[#1F1127] flex items-center justify-center text-white shadow-neo-sm">
            <CloudSun className="w-6 h-6" />
          </div>
        </motion.div>

        {/* Headline */}
        <span className="badge-neo bg-[#C4E86E] text-[#1F1127] mb-3">
          {isRtl ? 'غيوم خارج التوقعات' : 'OFF THE FORECAST'}
        </span>
        <h1 className="font-display text-3xl sm:text-5xl font-black text-[#1F1127] uppercase tracking-tight leading-tight mt-2 mb-3">
          {isRtl ? 'الصفحة ضائعة في سحب الفواكه' : 'LOST IN THE FRUIT CLOUDS.'}
        </h1>
        <p className="text-xs sm:text-sm font-bold text-[#1F1127]/75 max-w-md mx-auto mb-8">
          {isRtl
            ? 'يبدو أن هذه الصفحة غير موجودة حالياً. دعنا نعيدك إلى معمل النكهات الرئيسي.'
            : 'The page you are looking for has floated away. Let’s navigate back to today’s forecast of 100% joy.'}
        </p>

        {/* Actions */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          <button
            type="button"
            onClick={onNavigateHome}
            className="btn-neo bg-[#FFE842] text-[#1F1127] px-6 py-3 text-xs sm:text-sm flex items-center gap-2 hover:bg-[#FF5E2B] hover:text-white cursor-pointer shadow-neo"
          >
            <Home className="w-4 h-4" />
            <span>RETURN HOME</span>
          </button>

          <button
            type="button"
            onClick={onNavigateShop}
            className="btn-neo bg-[#FF5E2B] text-white px-6 py-3 text-xs sm:text-sm flex items-center gap-2 hover:bg-black cursor-pointer shadow-neo"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>ENTER TASTE LAB</span>
          </button>
        </div>
      </div>
    </div>
  );
};
