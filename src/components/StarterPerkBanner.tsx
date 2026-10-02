import React, { useState } from 'react';
import { Gift, Sparkles, Check, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useCart } from '../context/CartContext';

export const StarterPerkBanner: React.FC = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const { applyPromoCode } = useCart();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    applyPromoCode('TOOMAKT10');
    setSubmitted(true);

    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#C26715', '#E89228', '#C2293E', '#FAF6F0']
      });
    } catch (e) {
      // ignore
    }
  };

  return (
    <section className="py-8 bg-[#FAF6F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#8A3F0B] rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-medium border border-[#A65012]">
          {/* Background decorative glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#C26715]/40 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            {/* Left text */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center shrink-0 text-[#FCE6D2]">
                <Gift className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#FBD4B5] block">
                  Sweet Starter Perk
                </span>
                <h3 className="mt-1 text-2xl sm:text-3xl font-serif font-bold text-white">
                  Unlock 10% Off + Free Mango Chew Pouch
                </h3>
                <p className="mt-1 text-xs sm:text-sm text-[#F6DEC9] max-w-xl">
                  Join our tasting circle and receive a complimentary 100g sample in your first dispatch.
                </p>
              </div>
            </div>

            {/* Right form */}
            <div className="w-full lg:w-auto shrink-0">
              {submitted ? (
                <div className="inline-flex items-center gap-2 bg-white text-[#2B170E] px-6 py-3 rounded-full text-xs font-bold shadow-md">
                  <Check className="w-4 h-4 text-[#2E7D32]" />
                  <span>Promo code TOOMAKT10 applied at checkout!</span>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email for the code..."
                    required
                    className="w-full sm:w-72 bg-black/20 text-white placeholder-white/60 text-xs px-4 py-3 rounded-full border border-white/20 focus:outline-none focus:border-white transition-colors"
                  />
                  <button
                    type="submit"
                    className="w-full sm:w-auto bg-[#F49320] hover:bg-[#E58514] text-[#2B170E] px-6 py-3 rounded-full text-xs font-bold transition-all whitespace-nowrap shadow-sm hover:shadow"
                  >
                    Claim Free Pouch
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
