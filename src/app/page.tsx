"use client";

import { useState, useEffect } from 'react';
import { Play, ChevronRight, Music, Users, Headphones } from 'lucide-react';
import { LoginModal } from '@/components/auth/LoginModal';
import { RegisterModal } from '@/components/auth/RegisterModal';
import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';

const PREVIEW_TRACKS = [
  { title: 'Whispers of Ash', duration: '4:23', listeners: '3.4K' },
  { title: 'Kül ve Aşk', duration: '3:58', listeners: '9.3K' },
  { title: 'Void Lullaby', duration: '5:12', listeners: '7.2K' },
];

export default function Home() {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace('/dashboard');
    }
  }, [isAuthenticated, isLoading, router]);

  const switchToRegister = () => { setShowLogin(false); setShowRegister(true); };
  const switchToLogin = () => { setShowRegister(false); setShowLogin(true); };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-void-bg flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-crimson/30 border-t-crimson rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-void-bg text-moonlit overflow-x-hidden">
      {/* ═══════════════════════ HERO SECTION ═══════════════════════ */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background layers */}
        <div className="absolute inset-0 bg-linear-to-b from-void-bg via-blood/5 to-void-bg"></div>
        
        {/* Radial crimson glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-crimson/8 blur-[120px] smoke-drift"></div>
        <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] rounded-full bg-accent-purple/5 blur-[80px] smoke-drift" style={{ animationDelay: '2s' }}></div>

        {/* Avatar large silhouette */}
        <div className="absolute left-0 bottom-0 w-[55%] h-full opacity-20 pointer-events-none">
          <img 
            src="/lal-divane-avatar.png" 
            alt="" 
            className="w-full h-full object-cover object-top"
            style={{ maskImage: 'linear-gradient(to right, black 40%, transparent)', WebkitMaskImage: 'linear-gradient(to right, black 40%, transparent)' }}
          />
        </div>

        {/* Content */}
        <div className="relative z-10 text-center max-w-3xl mx-auto px-6">
          {/* Logo */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-14 h-14 rounded-2xl overflow-hidden glow-crimson border border-crimson/20">
              <img src="/lal-divane-avatar.png" alt="Lal Divane" className="w-full h-full object-cover" />
            </div>
          </div>

          <p className="text-xs uppercase tracking-[0.5em] text-crimson/70 mb-4 font-display">Where Whispers Turn to Ash</p>
          
          <h1 className="text-7xl font-bold font-display mb-6 leading-tight">
            <span className="gradient-text">Lal Divane</span>
          </h1>

          <p className="text-lg text-moonlit/50 mb-10 max-w-xl mx-auto leading-relaxed">
            Karanlığın ve kırmızının buluştuğu yerde, müziğiyle seni bekliyor. 
            Boşluğa adım at, sesini bul.
          </p>

          {/* CTA Buttons */}
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => setShowRegister(true)}
              className="bg-linear-to-r from-crimson to-blood hover:from-crimson/80 hover:to-blood/80 text-white px-8 py-4 rounded-full font-semibold transition-colors glow-crimson flex items-center gap-2 text-lg"
            >
              Boşluğa Gir
              <ChevronRight size={20} />
            </button>
            <button
              onClick={() => setShowLogin(true)}
              className="bg-white/5 border border-crimson/20 hover:border-crimson/40 text-moonlit px-8 py-4 rounded-full font-semibold transition-colors flex items-center gap-2"
            >
              Giriş Yap
            </button>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-moonlit/20">
          <span className="text-xs uppercase tracking-widest">Keşfet</span>
          <div className="w-px h-8 bg-linear-to-b from-crimson/40 to-transparent animate-bounce"></div>
        </div>
      </section>

      {/* ═══════════════════ STATS SECTION ═══════════════════ */}
      <section className="relative py-20 border-y border-void-border">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-3 gap-8 text-center">
          <div className="group">
            <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-crimson/10 border border-crimson/10 flex items-center justify-center group-hover:glow-crimson transition-all">
              <Headphones size={24} className="text-crimson" />
            </div>
            <p className="text-3xl font-bold font-display text-moonlit mb-1">12.4K</p>
            <p className="text-sm text-moonlit/40">Aktif Dinleyici</p>
          </div>
          <div className="group">
            <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-crimson/10 border border-crimson/10 flex items-center justify-center group-hover:glow-crimson transition-all">
              <Music size={24} className="text-crimson" />
            </div>
            <p className="text-3xl font-bold font-display text-moonlit mb-1">8</p>
            <p className="text-sm text-moonlit/40">Şarkı</p>
          </div>
          <div className="group">
            <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-crimson/10 border border-crimson/10 flex items-center justify-center group-hover:glow-crimson transition-all">
              <Users size={24} className="text-crimson" />
            </div>
            <p className="text-3xl font-bold font-display text-moonlit mb-1">3</p>
            <p className="text-sm text-moonlit/40">Topluluk</p>
          </div>
        </div>
      </section>

      {/* ═══════════════════ TRACK PREVIEW ═══════════════════ */}
      <section className="relative py-24">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-xs uppercase tracking-[0.4em] text-crimson/60 mb-3">Boşluktan Sesler</p>
            <h2 className="text-3xl font-bold font-display text-moonlit">Son Parçalar</h2>
          </div>

          <div className="space-y-3">
            {PREVIEW_TRACKS.map((track, i) => (
              <div
                key={i}
                className="glass rounded-2xl px-6 py-5 flex items-center gap-6 group cursor-pointer hover:border-crimson/20 transition-all"
              >
                <span className="text-lg font-bold text-moonlit/20 w-8 font-display">{String(i + 1).padStart(2, '0')}</span>
                <div className="w-12 h-12 rounded-xl bg-linear-to-br from-crimson/20 to-blood/20 flex items-center justify-center shrink-0 group-hover:glow-crimson transition-all">
                  <Play size={18} className="text-crimson ml-0.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-moonlit group-hover:text-crimson transition-colors">{track.title}</p>
                  <p className="text-xs text-moonlit/30">Lal Divane</p>
                </div>
                <span className="text-sm text-moonlit/30 hidden sm:block">{track.listeners} dinleyici</span>
                <span className="text-sm text-moonlit/20">{track.duration}</span>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center mt-10">
            <button
              onClick={() => setShowRegister(true)}
              className="text-crimson hover:text-ember transition-colors font-semibold flex items-center gap-2 mx-auto"
            >
              Tümünü dinlemek için giriş yap
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* ═══════════════════ FOOTER ═══════════════════ */}
      <footer className="border-t border-void-border py-8">
        <div className="max-w-5xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg overflow-hidden">
              <img src="/lal-divane-avatar.png" alt="Lal Divane" className="w-full h-full object-cover" />
            </div>
            <span className="text-sm font-display gradient-text font-bold">Lal Divane</span>
          </div>
          <p className="text-xs text-moonlit/20">&copy; 2026 Lal Divane. All rights reserved.</p>
        </div>
      </footer>

      {/* ═══════════════════ MODALS ═══════════════════ */}
      <LoginModal isOpen={showLogin} onClose={() => setShowLogin(false)} onSwitchToRegister={switchToRegister} />
      <RegisterModal isOpen={showRegister} onClose={() => setShowRegister(false)} onSwitchToLogin={switchToLogin} />
    </div>
  );
}
