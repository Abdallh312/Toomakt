import React, { useState } from 'react';
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  ArrowRight,
  AlertCircle,
  ShieldCheck,
  ArrowLeft,
  KeyRound,
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../../services/api';
import { navigateTo } from '../../utils/navigation';

interface AdminLoginViewProps {
  onLoginSuccess: () => void;
  onBackToShop?: () => void;
}

export const AdminLoginView: React.FC<AdminLoginViewProps> = ({ onLoginSuccess, onBackToShop }) => {
  const [email, setEmail] = useState('admin@toomakt.com');
  const [password, setPassword] = useState('admin123456');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [demoCopied, setDemoCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim() || !password.trim()) {
      setErrorMessage('Please enter your administrative email and password.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await api.adminLogin(email.trim(), password.trim());
      if (res.success && res.access) {
        if (rememberMe) {
          localStorage.setItem('toomakt_admin_token', res.access);
          localStorage.setItem('toomakt_admin_user', JSON.stringify(res.user || { email }));
        } else {
          sessionStorage.setItem('toomakt_admin_token', res.access);
        }
        onLoginSuccess();
      } else {
        setErrorMessage(res.error || 'Access denied. Invalid administrator credentials.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Atelier authentication gateway unreachable.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFillDemo = () => {
    setEmail('admin@toomakt.com');
    setPassword('admin123456');
    setDemoCopied(true);
    setTimeout(() => setDemoCopied(false), 2000);
  };

  const handleReturnHome = () => {
    if (onBackToShop) {
      onBackToShop();
    } else {
      navigateTo('');
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#FAF7F2] text-[#1A1A1A] flex flex-col justify-between relative overflow-hidden font-sans selection:bg-[#3C1322] selection:text-white">
      
      {/* Subtle Warm Luxury Atelier Ambient Lights */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-gradient-to-b from-[#3C1322]/[0.04] via-[#FFD147]/[0.03] to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#3C1322]/[0.02] rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#FFD147]/[0.04] rounded-full blur-3xl pointer-events-none" />

      {/* Top Header / Return Storefront Navigation */}
      <header className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between">
        <button
          onClick={handleReturnHome}
          className="inline-flex items-center gap-2 text-xs font-medium text-[#736B63] hover:text-[#1A1A1A] px-3.5 py-1.5 rounded-full border border-[#E8E2D7] bg-white/80 hover:bg-white backdrop-blur-xs transition cursor-pointer shadow-soft"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Storefront</span>
        </button>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#E8E2D7] text-[10px] font-mono uppercase tracking-wider text-[#736B63] shadow-soft">
          <span className="w-2 h-2 rounded-full bg-[#2E7D32] animate-pulse" />
          <span>Gateway Active</span>
        </div>
      </header>

      {/* Main Centered Content */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 sm:px-6 py-8 sm:py-12">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="w-full max-w-md"
        >
          {/* Atelier Brand Badge & Title */}
          <div className="text-center mb-8">
            <div className="inline-flex items-baseline gap-1.5 mb-2 cursor-pointer" onClick={handleReturnHome}>
              <span className="font-serif text-3xl sm:text-4xl font-normal tracking-tight text-[#1A1A1A] lowercase">
                toomakt
              </span>
              <span className="w-2 h-2 rounded-full bg-[#3C1322]" />
            </div>

            <div className="flex items-center justify-center gap-2 mt-1">
              <span className="text-[10px] font-mono tracking-widest uppercase text-[#736B63] font-semibold">
                ATELIER CONSOLE & MANAGEMENT
              </span>
            </div>

            <p className="mt-2 text-xs text-[#736B63] font-light max-w-xs mx-auto leading-relaxed">
              Restricted administrative environment for confectionery orders, real-time inventory, and dispatch telemetry.
            </p>
          </div>

          {/* Crisp Quiet Luxury Form Card */}
          <div className="bg-white rounded-3xl border border-[#E8E2D7] p-6 sm:p-9 shadow-[0_20px_50px_rgba(60,19,34,0.06)] relative backdrop-blur-xs">
            
            {/* Error Message Notice */}
            <AnimatePresence>
              {errorMessage && (
                <motion.div
                  initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                  animate={{ opacity: 1, height: 'auto', marginBottom: 16 }}
                  exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                  className="overflow-hidden"
                >
                  <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-800 flex items-start gap-2.5">
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
                    <span className="leading-snug">{errorMessage}</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Email / Username Field */}
              <div>
                <label className="block text-xs font-semibold text-[#1A1A1A] uppercase tracking-wider mb-1.5">
                  Admin Email / Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#736B63]">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    autoComplete="username"
                    placeholder="admin@toomakt.com"
                    className="w-full bg-[#FAF7F2] border border-[#E8E2D7] focus:border-[#3C1322] rounded-xl pl-10 pr-4 py-2.5 text-sm text-[#1A1A1A] placeholder-[#736B63]/60 focus:outline-none focus:ring-1 focus:ring-[#3C1322] transition-colors"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-[#1A1A1A] uppercase tracking-wider">
                    Password
                  </label>
                  <span className="text-[10px] text-[#736B63] font-mono">256-bit encrypted</span>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#736B63]">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                    placeholder="••••••••••••"
                    className="w-full bg-[#FAF7F2] border border-[#E8E2D7] focus:border-[#3C1322] rounded-xl pl-10 pr-10 py-2.5 text-sm text-[#1A1A1A] placeholder-[#736B63]/60 focus:outline-none focus:ring-1 focus:ring-[#3C1322] transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#736B63] hover:text-[#1A1A1A] transition-colors cursor-pointer"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Session & Security Badge */}
              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-[#736B63] hover:text-[#1A1A1A] transition-colors">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={e => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-[#E8E2D7] text-[#3C1322] focus:ring-[#3C1322] cursor-pointer"
                  />
                  <span className="text-xs font-medium">Remember session</span>
                </label>
                <div className="flex items-center gap-1 text-[11px] text-[#736B63]">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#2E7D32]" />
                  <span>Authorized Personnel</span>
                </div>
              </div>

              {/* Submit Action Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 bg-[#3C1322] hover:bg-[#280A15] disabled:opacity-50 text-[#FAF7F2] py-3 px-4 rounded-xl font-medium text-xs uppercase tracking-wider transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2 group cursor-pointer"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-[#FAF7F2] border-t-transparent rounded-full animate-spin" />
                    <span>Verifying Authorization...</span>
                  </div>
                ) : (
                  <>
                    <span>Enter Atelier Dashboard</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </form>

            {/* Quick Demo Autofill Helper */}
            <div className="mt-6 pt-5 border-t border-[#E8E2D7] text-center">
              <div className="bg-[#FAF7F2] rounded-2xl p-3 border border-[#E8E2D7] text-left flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#736B63] block font-semibold">
                    Superuser Credentials Demo
                  </span>
                  <div className="text-xs text-[#1A1A1A] font-mono truncate mt-0.5">
                    <span>admin@toomakt.com</span>
                    <span className="text-[#736B63] mx-1.5">•</span>
                    <span>admin123456</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleFillDemo}
                  className="shrink-0 text-xs px-2.5 py-1 rounded-lg bg-white border border-[#E8E2D7] hover:border-[#1A1A1A] text-[#1A1A1A] font-medium transition flex items-center gap-1 cursor-pointer shadow-2xs"
                  title="Auto-fill form with superuser credentials"
                >
                  {demoCopied ? (
                    <>
                      <Check className="w-3 h-3 text-[#2E7D32]" />
                      <span className="text-[#2E7D32]">Filled</span>
                    </>
                  ) : (
                    <>
                      <KeyRound className="w-3 h-3 text-[#736B63]" />
                      <span>Fill</span>
                    </>
                  )}
                </button>
              </div>

              {onBackToShop && (
                <button
                  onClick={onBackToShop}
                  className="mt-3.5 inline-block text-xs text-[#736B63] hover:text-[#1A1A1A] underline underline-offset-4 transition-colors cursor-pointer"
                >
                  Back to Storefront
                </button>
              )}
            </div>

          </div>

          {/* Security Reassurance */}
          <div className="mt-6 text-center text-[10px] text-[#736B63] space-y-1">
            <p>toomakt Confectionery Co. • Cairo Atelier Operations Gateway</p>
            <p className="text-[9px] opacity-75">All authentication attempts and session tokens are cryptographically monitored.</p>
          </div>
        </motion.div>
      </main>

      {/* Footer copyright */}
      <footer className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 text-center text-[11px] text-[#736B63]/60">
        © {new Date().getFullYear()} toomakt. All rights reserved.
      </footer>

    </div>
  );
};
