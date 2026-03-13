"use client";

import { useState } from 'react';
import { X, Eye, EyeOff, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToLogin: () => void;
}

export function RegisterModal({ isOpen, onClose, onSwitchToLogin }: RegisterModalProps) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username || !email || !password || !confirmPassword) {
      setError('Tüm alanları doldur.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Şifreler eşleşmiyor.');
      return;
    }
    if (password.length < 6) {
      setError('Şifre en az 6 karakter olmalı.');
      return;
    }

    setIsLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username: username,
          display_name: username,
        }
      }
    });
    setIsLoading(false);

    if (error) {
      setError(error.message);
    } else {
      // Supabase email confirmation might be turned off for local dev, so we can just close
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose}></div>

      {/* Modal */}
      <div className="relative w-full max-w-md mx-4 bg-void-900/95 backdrop-blur-xl border border-crimson/10 rounded-2xl shadow-2xl overflow-hidden">
        {/* Crimson glow top edge */}
        <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-crimson/60 to-transparent"></div>

        {/* Close button */}
        <button onClick={onClose} className="absolute top-4 right-4 text-moonlit/30 hover:text-moonlit transition-colors">
          <X size={20} />
        </button>

        <div className="p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold font-display gradient-text mb-2">Boşluğa Katıl</h2>
            <p className="text-sm text-moonlit/40">Karanlığın bir parçası ol</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-moonlit/50 mb-2 uppercase tracking-wider">Kullanıcı Adı</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="void_walker"
                className="w-full bg-white/3 border border-void-border rounded-xl px-4 py-3 text-moonlit placeholder-moonlit/20 outline-none focus:border-crimson/30 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-moonlit/50 mb-2 uppercase tracking-wider">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="void@laldivane.com"
                className="w-full bg-white/3 border border-void-border rounded-xl px-4 py-3 text-moonlit placeholder-moonlit/20 outline-none focus:border-crimson/30 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-moonlit/50 mb-2 uppercase tracking-wider">Şifre</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white/3 border border-void-border rounded-xl px-4 py-3 pr-12 text-moonlit placeholder-moonlit/20 outline-none focus:border-crimson/30 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-moonlit/30 hover:text-moonlit"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-moonlit/50 mb-2 uppercase tracking-wider">Şifre Tekrar</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-white/3 border border-void-border rounded-xl px-4 py-3 text-moonlit placeholder-moonlit/20 outline-none focus:border-crimson/30 transition-colors"
              />
            </div>

            {error && (
              <p className="text-xs text-crimson">{error}</p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-linear-to-r from-crimson to-blood hover:from-crimson/80 hover:to-blood/80 text-white py-3 rounded-xl font-semibold transition-colors glow-crimson disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading ? <Loader2 size={18} className="animate-spin" /> : null}
              {isLoading ? 'Kayıt yapılıyor...' : 'Kayıt Ol'}
            </button>
          </form>

          {/* Switch to login */}
          <p className="text-center text-sm text-moonlit/40 mt-6">
            Zaten hesabın var mı?{' '}
            <button onClick={onSwitchToLogin} className="text-crimson hover:text-ember transition-colors font-semibold">
              Giriş yap
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
