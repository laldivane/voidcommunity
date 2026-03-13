"use client";

import { Home, Music, Disc3, Radio, Flame, Users, LogOut, ShieldCheck } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { useAudioStore } from '@/lib/audioStore';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavItem {
  icon: LucideIcon;
  label: string;
  path: string;
}

const navItems: NavItem[] = [
  { icon: Home, label: 'Home', path: '/dashboard' },
  { icon: Music, label: 'Tracks', path: '/dashboard/tracks' },
  { icon: Disc3, label: 'Albums', path: '/dashboard/albums' },
  { icon: Radio, label: 'Live', path: '/dashboard/live' },
  { icon: Flame, label: 'Trending', path: '/dashboard/trending' },
  { icon: Users, label: 'Community', path: '/dashboard/community' },
];

export function LeftSidebar() {
  const { logout, user, isAdmin } = useAuth();
  const { currentTrack, isPlaying } = useAudioStore();
  const pathname = usePathname();
  
  // Create profile link using metadata or fallback to id
  const username = user?.user_metadata?.username || user?.id || 'me';

  return (
    <div className="w-64 bg-void-900 border-r border-void-border flex flex-col h-full relative z-20">
      {/* Logo Area / Profile Link */}
      <div className="p-6 border-b border-void-border">
        <Link href={`/dashboard/profile/${username}`} className="flex items-center gap-3 group hover-lift">
          <div className="w-10 h-10 rounded-xl overflow-hidden glow-crimson transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 ring-1 ring-crimson/20">
            <img
              src={user?.user_metadata?.avatar_url || "/lal-divane-avatar.png"}
              alt="Lal Divane"
              className="w-full h-full object-cover bg-void-800"
            />
          </div>
          <div className="min-w-0">
            <h1 className="text-sm font-bold font-display gradient-text truncate group-hover:text-shadow-crimson transition-all">
              {user?.user_metadata?.display_name || user?.user_metadata?.username || 'Lal Divane'}
            </h1>
            <p className="text-[10px] uppercase tracking-widest text-moonlit/40 group-hover:text-crimson/60 transition-colors">Digital Soul</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto custom-scrollbar">
        {navItems.map((item) => {
          const isActive = pathname === item.path || (item.path !== '/dashboard' && pathname?.startsWith(item.path));
          return (
            <Link
              key={item.label}
              href={item.path}
              className={`nav-item w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-300 ${
                isActive
                  ? 'active bg-crimson/10 text-crimson shadow-[inset_0_0_15px_rgba(200,16,46,0.1)]'
                  : 'text-moonlit/50 hover:text-moonlit hover:bg-white/5 hover:translate-x-1'
              }`}
            >
              <item.icon size={20} className="shrink-0" />
              <span className="font-medium text-sm">{item.label}</span>
            </Link>
          );
        })}

        {isAdmin && (
          <Link
            href="/dashboard/admin"
            className={`nav-item w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-300 mt-6 border border-crimson/20 ${
              pathname === '/dashboard/admin'
                ? 'active bg-crimson/20 text-crimson shadow-lg glow-crimson'
                : 'text-crimson/60 hover:text-crimson hover:bg-crimson/5'
            }`}
          >
            <ShieldCheck size={20} className="shrink-0" />
            <span className="font-bold text-sm uppercase tracking-widest">Admin</span>
          </Link>
        )}
      </nav>

      {/* Now Playing Mini (Connected) */}
      <div className="p-4 border-t border-void-border bg-void-bg/50 backdrop-blur-md">
        {currentTrack ? (
          <div className="glass-crimson rounded-xl p-3 flex items-center gap-3 mb-4 animate-in fade-in slide-in-from-bottom-2">
            <div className="w-10 h-10 rounded-lg bg-void-800 overflow-hidden shrink-0 relative group">
              {currentTrack.cover_url && <img src={currentTrack.cover_url} alt={currentTrack.title} className="w-full h-full object-cover" />}
              {isPlaying && (
                <div className="absolute inset-0 bg-crimson/20 flex items-center justify-center">
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="w-0.5 bg-white rounded-full"
                        style={{
                          height: `${6 + i * 3}px`,
                          animation: 'audio-bar 0.6s ease-in-out infinite alternate',
                          animationDelay: `${i * 0.1}s`,
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-moonlit truncate">{currentTrack.title}</p>
              <p className="text-[10px] text-moonlit/40 truncate">{currentTrack.artist}</p>
            </div>
          </div>
        ) : (
          <div className="p-3 mb-4 text-center border border-dashed border-void-border rounded-xl">
             <p className="text-[10px] text-moonlit/20 italic tracking-tighter">The void is waiting...</p>
          </div>
        )}

        {/* Logout Button */}
        <button
          onClick={() => logout()}
          className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-medium text-moonlit/30 hover:text-crimson transition-all rounded-xl hover:bg-crimson/5 hover:crimson-border-glow group"
        >
          <LogOut size={16} className="group-hover:rotate-12 transition-transform" />
          <span>Çıkış Yap</span>
        </button>
      </div>
    </div>
  );
}
