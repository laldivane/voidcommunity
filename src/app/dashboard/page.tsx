"use client";

import { useEffect, useState } from 'react';
import { Search, ChevronRight, Play, Heart, Users, Pause, Loader2 } from 'lucide-react';
import { useAudioStore, type Track } from '@/lib/audioStore';
import { apiGetTracks, apiGetCommunities, apiGetFeaturedContent } from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

// Section wrapper
function Section({ title, children, href }: { title: string, children: React.ReactNode, href?: string }) {
  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-black uppercase tracking-[0.4em] text-crimson decoration-crimson decoration-2">{title}</h2>
        {href && (
          <Link href={href} className="text-[10px] font-bold uppercase tracking-widest text-moonlit/20 hover:text-crimson transition-colors flex items-center gap-1 group">
            See All <ChevronRight size={12} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        )}
      </div>
      {children}
    </section>
  );
}

// Hero Banner
function HeroBanner({ track, type }: { track: Track | null, type?: string }) {
  const { playTrack, currentTrack, isPlaying } = useAudioStore();

  if (!track) return null;

  const isCurrentPlaying = currentTrack?.id === track.id && isPlaying;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative group h-[400px] md:h-[500px] rounded-[3rem] overflow-hidden border border-white/5 shadow-2xl glow-crimson/5"
    >
      {/* Background with parallax effect */}
      <div className="absolute inset-0 flex overflow-hidden">
        <div className="w-1/2 h-full">
          <img
            src={type === 'community' ? "/community-banner.png" : "/lal-divane-avatar.png"}
            alt={type === 'community' ? "Community Banner" : "Lal Divane"}
            className="w-full h-full object-cover opacity-40 group-hover:opacity-60 group-hover:scale-110 transition-all duration-1000"
          />
        </div>
        <div className="w-1/2 h-full bg-void-bg" />
        <div className="absolute inset-0 bg-gradient-to-r from-void-bg via-void-bg/60 to-transparent" />
      </div>

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-center px-10 md:px-20 z-10">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <p className="text-[10px] md:text-xs uppercase tracking-[0.4em] text-white/60 mb-3 font-display font-medium">
            {type === 'community' ? "Featured Community" : "New Spiritual Awakening"}
          </p>
          <h2 className="text-3xl md:text-5xl font-bold mb-2 font-display text-moonlit text-shadow-crimson leading-tight">
            {type === 'community' ? (track as any).name : track.title}
          </h2>
          <p className="text-sm md:text-base text-moonlit/60 mb-6 max-w-sm italic">
            {type === 'community' ? (track as any).description : `"The echo of a thousand silent screams turned into melody."`}
          </p>
          <button 
            onClick={() => playTrack(track)}
            className="flex items-center gap-3 bg-moonlit text-void-bg hover:bg-white px-8 py-3.5 rounded-full text-sm font-bold transition-all hover:scale-105 active:scale-95 glow-crimson"
          >
            {type === 'community' ? (
              <>
                <Users size={18} fill="currentColor" />
                Join the Collective
              </>
            ) : (
              <>
                {isCurrentPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}
                {isCurrentPlaying ? "Listening to the Void" : "Open Your Soul"}
              </>
            )}
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
}

// Compact Track Card
function TrackCard({ track, onLoreClick }: { track: Track, onLoreClick: (track: Track) => void }) {
  const { playTrack, currentTrack, isPlaying } = useAudioStore();
  const isCurrentPlaying = currentTrack?.id === track.id && isPlaying;

  return (
    <div className="glass group p-3 rounded-2xl border border-white/5 hover:border-crimson/20 transition-all duration-500 hover:-translate-y-1">
      <div className="relative aspect-square rounded-xl overflow-hidden mb-4">
        <img 
          src={track.cover_url || "/lal-divane-avatar.png"} 
          alt={track.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-crimson/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
          <div className="w-12 h-12 rounded-full bg-moonlit/90 flex items-center justify-center text-void-bg scale-75 group-hover:scale-100 transition-transform duration-500 shadow-xl glow-crimson">
            {isCurrentPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-1" />}
          </div>
        </div>
        <button 
          onClick={(e) => { e.stopPropagation(); playTrack(track); }}
          className="absolute inset-0 z-10" 
        />
      </div>
      <div>
        <h4 className="text-sm font-bold truncate text-moonlit group-hover:text-crimson transition-colors">{track.title}</h4>
        <div className="mt-1 flex items-center justify-between">
          <p className="text-[10px] text-moonlit/30 uppercase tracking-widest font-black">{track.artist}</p>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => onLoreClick(track)}
              className="p-1.5 hover:bg-white/5 rounded-lg text-moonlit/20 hover:text-crimson transition-all"
              title="Void Lore"
            >
              <Pause className="rotate-90" size={12} />
            </button>
            <button className="p-1.5 hover:bg-white/5 rounded-lg text-moonlit/20 hover:text-crimson transition-all">
              <Heart size={12} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [communities, setCommunities] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [voidLore, setVoidLore] = useState<string | null>(null);
  const [isLoreLoading, setIsLoreLoading] = useState(false);
  const [featuredContent, setFeaturedContent] = useState<any>(null);

  const fetchLore = async (track: Track) => {
    setIsLoreLoading(true);
    setVoidLore(null);
    try {
      const res = await fetch('/api/lore?track=' + encodeURIComponent(track.title));
      const data = await res.json();
      setVoidLore(data.lore);
    } catch (err) {
      console.error("Failed to hear the void", err);
    } finally {
      setIsLoreLoading(false);
    }
  };

  useEffect(() => {
    async function loadData() {
      try {
        const [fetchedTracks, fetchedCommunities, featured] = await Promise.all([
          apiGetTracks(),
          apiGetCommunities(),
          apiGetFeaturedContent()
        ]);
        setTracks(fetchedTracks);
        setCommunities(fetchedCommunities);
        setFeaturedContent(featured);
      } catch (err) {
        console.error("Failed to load feed data", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const filteredTracks = tracks.filter(track => 
    track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    track.artist.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredCommunities = communities.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-void-bg overflow-hidden h-full">
        <div className="relative">
          <div className="w-16 h-16 border-t-2 border-r-2 border-crimson rounded-full animate-spin shadow-2xl shadow-crimson/50" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-2 h-2 bg-crimson rounded-full animate-ping" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto scroll-smooth h-full custom-scrollbar">
      <div className="sticky top-0 z-30 bg-void-bg/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-5xl mx-auto px-8 py-4 flex items-center justify-between">
          <div className="relative w-64 md:w-96 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-moonlit/20 group-focus-within:text-crimson transition-colors" size={18} />
            <input
              type="text"
              placeholder="Search the void..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-transparent rounded-full pl-11 pr-4 py-2.5 text-sm text-moonlit placeholder-moonlit/20 outline-none focus:bg-white/10 focus:border-crimson/20 transition-all"
            />
          </div>
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-full bg-crimson/10 flex items-center justify-center cursor-pointer hover:bg-crimson/20 transition-colors">
              <Play size={14} className="text-crimson ml-0.5" />
            </div>
            <div className="w-8 h-8 rounded-full bg-white/5 border border-white/5 flex items-center justify-center cursor-pointer hover:bg-white/10 transition-colors">
              <Users size={14} className="text-moonlit/40" />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-8 py-10 space-y-12 pb-32">
        {featuredContent ? (
          <HeroBanner track={featuredContent.data} type={featuredContent.type} />
        ) : filteredTracks.length > 0 ? (
          <HeroBanner track={filteredTracks[0]} />
        ) : null}

        {/* Void Whispers (AI Lore) */}
        {(voidLore || isLoreLoading) && (
          <AnimatePresence mode="wait">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass p-8 rounded-[2.5rem] border border-crimson/20 bg-gradient-to-br from-crimson/5 via-void-bg/80 to-void-bg relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-2">
                <button onClick={() => setVoidLore(null)} className="p-2 hover:bg-white/5 rounded-full text-moonlit/20 hover:text-crimson transition-colors">
                  <Heart size={16} className="rotate-45" />
                </button>
              </div>
              <div className="flex items-start gap-6 relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-crimson flex items-center justify-center flex-shrink-0 animate-pulse-slow shadow-lg glow-crimson">
                  <Pause className="text-white rotate-90" size={24} />
                </div>
                <div>
                  <h3 className="text-xs font-black uppercase tracking-[0.4em] text-crimson mb-4">Void Whispers</h3>
                  {isLoreLoading ? (
                    <div className="flex items-center gap-3 text-moonlit/40 italic">
                      <Loader2 className="animate-spin text-crimson" size={16} />
                      Translating the echoes...
                    </div>
                  ) : (
                    <p className="text-sm md:text-base text-moonlit/70 leading-relaxed font-light first-letter:text-3xl first-letter:text-crimson first-letter:font-black first-letter:mr-1">
                      {voidLore}
                    </p>
                  )}
                </div>
              </div>
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-crimson/5 rounded-full blur-3xl" />
            </motion.div>
          </AnimatePresence>
        )}

        <Section title="Echoes of the Void" href="/dashboard/tracks">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {filteredTracks.map(track => (
              <TrackCard key={track.id} track={track} onLoreClick={fetchLore} />
            ))}
          </div>
        </Section>

        <Section title="Sanctuaries" href="/dashboard/community">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredCommunities.map(c => (
              <Link key={c.id} href={`/dashboard/community/${c.slug}`} className="glass group p-6 rounded-3xl border border-white/5 flex items-center gap-6 hover:border-crimson/20 transition-all duration-500 overflow-hidden relative">
                <div className="absolute inset-0 bg-crimson/5 translate-x-full group-hover:translate-x-0 transition-transform duration-700" />
                <div className="w-14 h-14 rounded-2xl bg-crimson/10 flex items-center justify-center flex-shrink-0 group-hover:bg-crimson group-hover:text-white transition-all duration-500 shadow-xl relative z-10">
                  <Users size={24} />
                </div>
                <div className="relative z-10">
                  <h4 className="font-bold text-moonlit group-hover:text-white transition-colors uppercase tracking-widest text-sm">{c.name}</h4>
                  <p className="text-xs text-moonlit/30 mt-1 uppercase tracking-widest font-black leading-tight">/{c.slug} • {c.member_count} Members</p>
                </div>
                <div className="ml-auto relative z-10">
                  <div className="w-8 h-8 rounded-full border border-white/5 flex items-center justify-center text-moonlit/20 group-hover:text-crimson group-hover:border-crimson/20 transition-all">
                    <ChevronRight size={16} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </Section>
      </div>
    </div>
  );
}
