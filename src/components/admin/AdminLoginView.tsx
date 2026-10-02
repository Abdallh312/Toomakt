import React, { useState } from 'react';
import { Shield, Eye, EyeOff, Lock, Mail, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import { api } from '../../services/api';

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim() || !password.trim()) {
      setErrorMessage('Please provide both administrative email and password.');
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
      setErrorMessage(err.message || 'Authentication service unreachable.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#24130A] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden font-sans">
      {/* Background aesthetic styling */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#C26715]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-[#994709]/20 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 text-center px-4">
        <img
          src="/images/logos/logo_toomakt_main.webp"
          alt="Toomakt"
          className="h-16 w-auto mx-auto mb-4 object-contain drop-shadow-xl"
        />
        <h2 className="text-2xl sm:text-3xl font-serif font-black text-[#FAF6F0] tracking-tight">
          toomakt Atelier
        </h2>
        <p className="mt-1 text-xs text-amber-200/70 tracking-widest uppercase font-mono">
          Security Console & Management Gateway
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 relative z-10">
        <div className="bg-[#2E180E] py-8 px-6 sm:px-10 shadow-2xl rounded-3xl border border-amber-900/50 backdrop-blur-md">
          {errorMessage && (
            <div className="mb-5 p-3.5 bg-red-950/60 border border-red-800/80 rounded-xl text-xs text-red-200 flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-amber-200/90 uppercase tracking-wider mb-1.5">
                Admin Email / Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-amber-400/50">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  placeholder="admin@toomakt.com"
                  className="w-full bg-[#1F0E07] border border-amber-900/60 rounded-xl pl-10 pr-4 py-2.5 text-sm text-[#FAF6F0] placeholder-stone-500 focus:outline-none focus:border-[#C26715] focus:ring-1 focus:ring-[#C26715]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-amber-200/90 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-amber-400/50">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  placeholder="••••••••••••"
                  className="w-full bg-[#1F0E07] border border-amber-900/60 rounded-xl pl-10 pr-10 py-2.5 text-sm text-[#FAF6F0] placeholder-stone-500 focus:outline-none focus:border-[#C26715] focus:ring-1 focus:ring-[#C26715]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-amber-400/60 hover:text-amber-200"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 cursor-pointer text-amber-200/80">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={e => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded bg-[#1F0E07] border-amber-900 text-[#C26715] focus:ring-[#C26715]"
                />
                <span>Remember session</span>
              </label>
              <span className="text-amber-400/60 text-[11px]">Protected Portal</span>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-[#C26715] to-[#994709] hover:from-[#D97724] hover:to-[#B8580D] disabled:opacity-50 text-white py-3 rounded-xl font-bold text-xs uppercase tracking-wider shadow-lg transition-all flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Verifying Authorization...</span>
                </div>
              ) : (
                <>
                  <span>Sign In to Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-amber-900/40 text-center">
            <div className="text-[11px] text-amber-200/50">
              Atelier superuser demo: <code className="text-amber-300">admin@toomakt.com</code> / <code className="text-amber-300">admin123456</code>
            </div>
            {onBackToShop && (
              <button
                onClick={onBackToShop}
                className="mt-3 text-xs text-amber-300/70 hover:text-amber-200 underline transition-colors"
              >
                Return to Storefront
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
