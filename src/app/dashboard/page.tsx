"use client";

import { useEffect, useState } from 'react';
import { Search, ChevronRight, Play, Heart, Users, Pause } from 'lucide-react';
import { useAudioStore, type Track } from '@/lib/audioStore';
import { apiGetTracks, apiGetCommunities } from '@/lib/api';
import { motion } from 'framer-motion';
import Link from 'next/link';

// Section wrapper
function Section({ title, children, href, delay = 0 }: { title: string; children: React.ReactNode, href?: string, delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
    >
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-xl font-bold font-display text-moonlit tracking-tight">{title}</h3>
        {href && (
          <Link href={href} className="text-xs uppercase tracking-widest text-crimson font-bold hover:text-ember transition-colors flex items-center gap-1 group">
            See All
            <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        )}
      </div>
      {children}
    </motion.div>
  );
}

// Hero Banner
function HeroBanner({ track }: { track: Track | null }) {
  const { playTrack, currentTrack, isPlaying } = useAudioStore();

  if (!track) return null;

  const isCurrentPlaying = currentTrack?.id === track.id && isPlaying;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="relative h-64 md:h-80 rounded-3xl overflow-hidden glass crimson-border-glow cursor-pointer group"
    >
      <div className="absolute inset-0 bg-linear-to-r from-crimson/80 via-blood/60 to-void-900 opacity-90 z-10 transition-opacity duration-700 group-hover:opacity-100"></div>
      
      <div className="absolute inset-0 flex overflow-hidden">
        <div className="w-1/2 h-full">
          <img
            src="/lal-divane-avatar.png"
            alt="Lal Divane"
            className="w-full h-full object-cover opacity-40 group-hover:opacity-60 group-hover:scale-110 transition-all duration-1000"
          />
        </div>
        <div className="w-1/2 h-full bg-linear-to-l from-transparent to-void-900/80"></div>
      </div>
      
      <div className="absolute inset-0 bg-linear-to-t from-void-900 via-transparent to-transparent z-10"></div>
      
      <div className="relative h-full flex flex-col justify-end p-8 md:p-12 z-20">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <p className="text-[10px] md:text-xs uppercase tracking-[0.4em] text-white/60 mb-3 font-display font-medium">New Spiritual Awakening</p>
          <h2 className="text-3xl md:text-5xl font-bold mb-2 font-display text-moonlit text-shadow-crimson leading-tight">
            {track.title}
          </h2>
          <p className="text-sm md:text-base text-moonlit/60 mb-6 max-w-sm italic">"The echo of a thousand silent screams turned into melody."</p>
          <button 
            onClick={() => playTrack(track)}
            className="flex items-center gap-3 bg-moonlit text-void-bg hover:bg-white px-8 py-3.5 rounded-full text-sm font-bold transition-all hover:scale-105 active:scale-95 glow-crimson"
          >
            {isCurrentPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}
            {isCurrentPlaying ? "Listening to the Void" : "Open Your Soul"}
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
}

// Track Card
function TrackCard({ track, listeners, gradient }: { track: Track; listeners: string; gradient: string }) {
  const { playTrack, currentTrack, isPlaying } = useAudioStore();
  const isCurrentPlaying = currentTrack?.id === track.id && isPlaying;

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div 
      whileHover={{ y: -8 }}
      onClick={() => playTrack(track)}
      className={`relative group glass ${isCurrentPlaying ? 'border-crimson/50 shadow-[0_0_20px_rgba(200,16,46,0.15)]' : 'border-void-border'} rounded-2xl overflow-hidden cursor-pointer transition-all duration-300`}
    >
      <div className="relative h-44">
        <div className={`absolute inset-0 bg-linear-to-br ${gradient} opacity-50 group-hover:opacity-70 transition-opacity duration-500`}></div>
        {track.cover_url && (
          <img src={track.cover_url} alt={track.title} className="w-full h-full object-cover opacity-40 group-hover:opacity-60 group-hover:scale-110 transition-all duration-700" />
        )}
        
        <div className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ${isCurrentPlaying ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
          <div className="w-14 h-14 rounded-full bg-void-bg/60 backdrop-blur-md border border-white/10 flex items-center justify-center glow-crimson group-hover:scale-110 transition-transform">
            {isCurrentPlaying ? <Pause size={24} className="text-crimson" /> : <Play size={24} fill="white" className="text-white ml-1" />}
          </div>
        </div>

        <div className="absolute bottom-4 left-4 right-4 z-10">
          <h3 className="text-lg font-bold mb-0.5 font-display text-white text-shadow-crimson truncate">{track.title}</h3>
          <div className="flex items-center justify-between">
            <p className="text-[10px] uppercase tracking-widest text-white/50">{track.artist}</p>
            <p className="text-[10px] font-mono text-white/40">{formatTime(track.duration_seconds)}</p>
          </div>
        </div>
        
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-linear-to-t from-void-bg/90 to-transparent"></div>
      </div>
      
      <div className="p-4 flex items-center justify-between bg-void-900/40">
        <span className="text-[10px] uppercase tracking-tighter text-moonlit/30 flex items-center gap-1.5 font-bold">
          <Users size={12} className="text-crimson/60" />
          {listeners} Souls Listening
        </span>
        <button 
          onClick={(e) => { e.stopPropagation(); }} 
          className="text-moonlit/20 hover:text-crimson transition-all hover:scale-125"
        >
          <Heart size={16} fill={isCurrentPlaying ? "currentColor" : "none"} />
        </button>
      </div>
    </motion.div>
  );
}

// Community Card
function CommunityCard({ title, description, members, icon: Icon }: { title: string; description: string; members: string, icon: any }) {
  return (
    <motion.div 
      whileHover={{ y: -5, borderColor: 'rgba(200, 16, 46, 0.4)' }}
      className="glass rounded-2xl p-5 border border-void-border cursor-pointer transition-all group"
    >
      <div className="w-12 h-12 rounded-xl bg-crimson/10 flex items-center justify-center mb-4 group-hover:glow-crimson transition-all">
        <Icon size={24} className="text-crimson" />
      </div>
      <h4 className="text-base font-bold mb-1 font-display text-moonlit group-hover:text-crimson transition-colors">{title}</h4>
      <p className="text-xs text-moonlit/40 mb-4 line-clamp-2 leading-relaxed">{description}</p>
      <div className="flex items-center justify-between pt-4 border-t border-void-border/30">
        <span className="text-[10px] uppercase font-bold tracking-widest text-moonlit/20">{members}</span>
        <ChevronRight size={14} className="text-moonlit/30 group-hover:translate-x-1 transition-transform" />
      </div>
    </motion.div>
  );
}

export default function Dashboard() {
  const [tracks, setTracks] = useState<Track[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [communities, setCommunities] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function loadData() {
      try {
        const [fetchedTracks, fetchedCommunities] = await Promise.all([
          apiGetTracks(),
          apiGetCommunities()
        ]);
        setTracks(fetchedTracks);
        setCommunities(fetchedCommunities);
      } catch (err) {
        console.error("Failed to load feed data", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex-1 overflow-y-auto scroll-smooth h-full flex items-center justify-center bg-void-bg">
        <div className="w-12 h-12 rounded-full border-4 border-crimson/20 border-t-crimson animate-spin"></div>
      </div>
    );
  }

  const filteredTracks = tracks.filter(t => 
    t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    t.artist.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const filteredCommunities = communities.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
              <div className="w-2 h-2 rounded-full bg-crimson animate-pulse" />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-8 py-10 space-y-12 pb-32">
        {filteredTracks.length > 0 && <HeroBanner track={filteredTracks[0]} />}

        {filteredTracks.length > 0 && (
          <Section 
            title={searchQuery ? "Matches from the Abyss" : "Echos of the Void"} 
            href="/dashboard/tracks"
            delay={0.1}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {filteredTracks.slice(1, 5).map((track, i) => (
                <TrackCard
                  key={track.id}
                  track={track}
                  listeners={(track as any).play_count?.toLocaleString() || "1,205"}
                  gradient={i % 2 === 0 ? "from-crimson/40 via-blood/30 to-void-bg" : "from-accent-purple/30 via-void-700 to-crimson/20"}
                />
              ))}
            </div>
          </Section>
        )}

        {filteredCommunities.length > 0 && (
          <Section title="Sanctuary Spaces" href="/dashboard/community" delay={0.2}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {filteredCommunities.map((c) => (
                <CommunityCard
                  key={c.id}
                  icon={Users}
                  title={c.name}
                  description={c.description}
                  members={`${c.member_count?.toLocaleString() || 0} SOULS`}
                />
              ))}
            </div>
          </Section>
        )}

        {filteredTracks.length === 0 && filteredCommunities.length === 0 && (
          <div className="py-20 text-center opacity-30 italic font-display text-xl">
            The abyss is silent... no matches found.
          </div>
        )}
      </div>
    </div>
  );
}
