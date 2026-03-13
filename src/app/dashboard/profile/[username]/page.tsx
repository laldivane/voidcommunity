"use client";

import { useEffect, useState, use } from 'react';
import { supabase } from '@/lib/supabase';
import { useAudioStore, type Track } from '@/lib/audioStore';
import { Play, Heart, Music, Calendar, Share2, Settings } from 'lucide-react';
import { motion } from 'framer-motion';

interface ProfileData {
  id: string;
  username: string;
  display_name: string;
  avatar_url: string | null;
  bio: string | null;
  created_at: string;
}

export default function ProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = use(params);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [favorites, setFavorites] = useState<Track[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { playTrack, currentTrack, isPlaying } = useAudioStore();

  useEffect(() => {
    async function loadProfile() {
      try {
        setIsLoading(true);
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('username', username)
          .single();

        if (profileError) throw profileError;
        setProfile(profileData);

        const { data: favData, error: favError } = await supabase
          .from('favorites')
          .select(`
            track_id,
            tracks:track_id (*)
          `)
          .eq('user_id', profileData.id);

        if (favError) throw favError;
        
        const fetchedTracks = favData.map((f: any) => f.tracks).filter(Boolean);
        setFavorites(fetchedTracks);

      } catch (err) {
        console.error("Profile load failed:", err);
      } finally {
        setIsLoading(false);
      }
    }

    if (username) loadProfile();
  }, [username]);

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center h-full bg-void-bg text-moonlit">
        <div className="w-12 h-12 border-4 border-crimson/20 border-t-crimson rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex-1 flex items-center justify-center h-full text-moonlit/40 italic bg-void-bg">
        The soul you seek resides in the void...
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto scroll-smooth h-full custom-scrollbar relative bg-void-bg text-moonlit">
      <div className="absolute top-0 left-0 w-full h-96 bg-linear-to-b from-crimson/10 to-transparent -z-10" />
      
      <div className="max-w-5xl mx-auto px-8 py-12">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7 }}
          className="glass rounded-[2.5rem] p-8 md:p-12 mb-12 flex flex-col md:flex-row items-center gap-8 md:gap-12 crimson-border-glow shadow-2xl relative overflow-hidden"
        >
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-crimson/10 rounded-full blur-[80px] animate-pulse" />
          
          <div className="relative group shrink-0">
            <div className="w-40 h-40 md:w-56 md:h-56 rounded-4xl overflow-hidden glow-crimson ring-4 ring-void-900 shadow-2xl transition-transform duration-700 group-hover:scale-105 group-hover:rotate-2">
              <img 
                src={profile.avatar_url || "/lal-divane-avatar.png"} 
                alt={profile.display_name} 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-crimson rounded-full border-4 border-void-900 flex items-center justify-center glow-ember">
               <Music size={16} className="text-white" />
            </div>
          </div>

          <div className="flex-1 text-center md:text-left z-10">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h1 className="text-4xl md:text-6xl font-bold font-display text-moonlit mb-2 tracking-tight">
                {profile.display_name}
              </h1>
              <p className="text-lg text-crimson font-medium mb-6 uppercase tracking-widest leading-none">@{profile.username}</p>
              
              <div className="flex flex-wrap justify-center md:justify-start gap-4 md:gap-8 mb-8">
                <div className="flex flex-col">
                  <span className="text-2xl font-bold text-moonlit">{favorites.length}</span>
                  <span className="text-[10px] uppercase tracking-widest text-moonlit/30 font-bold">Resonances</span>
                </div>
                <div className="h-10 w-px bg-white/5 hidden md:block" />
                <div className="flex flex-col">
                   <span className="text-2xl font-bold text-moonlit">1.2k</span>
                   <span className="text-[10px] uppercase tracking-widest text-moonlit/30 font-bold">Soul Mates</span>
                </div>
                <div className="h-10 w-px bg-white/5 hidden md:block" />
                <div className="flex items-center gap-2 text-moonlit/40 text-xs">
                  <Calendar size={14} className="text-crimson/50" />
                  Joined {new Date(profile.created_at).toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' })}
                </div>
              </div>

              <p className="text-moonlit/60 leading-relaxed mb-8 max-w-xl italic">
                {profile.bio || "This soul has not yet whispered its story to the void..."}
              </p>

              <div className="flex items-center justify-center md:justify-start gap-4">
                <button className="bg-crimson hover:bg-ember text-white px-8 py-3 rounded-full text-sm font-bold transition-all hover:scale-105 active:scale-95 glow-crimson">
                  Bond with Soul
                </button>
                <button className="p-3 bg-white/5 hover:bg-white/10 rounded-full transition-colors group">
                  <Share2 size={20} className="text-moonlit group-hover:text-crimson transition-colors" />
                </button>
                <button className="p-3 bg-white/5 hover:bg-white/10 rounded-full transition-colors group">
                  <Settings size={20} className="text-moonlit group-hover:text-crimson transition-colors" />
                </button>
              </div>
            </motion.div>
          </div>
        </motion.div>

        <section className="mt-16 pb-32">
          <div className="flex items-center justify-between mb-8 px-4">
            <h2 className="text-2xl font-bold font-display text-moonlit tracking-tight">Favorite <span className="text-crimson">Resonances</span></h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {favorites.length === 0 ? (
              <div className="col-span-full py-20 text-center glass rounded-3xl border-dashed border-void-border/30">
                <p className="text-moonlit/20 font-display italic">This soul's list of favorites is currently a void...</p>
              </div>
            ) : (
              favorites.map((track, i) => {
                const isCurrentPlaying = currentTrack?.id === track.id && isPlaying;
                return (
                  <motion.div
                    key={track.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => playTrack(track)}
                    className={`glass p-4 rounded-3xl flex items-center gap-5 cursor-pointer hover:border-crimson/30 transition-all group ${isCurrentPlaying ? 'border-crimson shadow-lg' : 'border-white/5'}`}
                  >
                    <div className="relative w-16 h-16 rounded-2xl overflow-hidden shrink-0 group-hover:glow-crimson transition-all duration-500">
                      {track.cover_url && <img src={track.cover_url} alt={track.title} className="w-full h-full object-cover" />}
                      <div className={`absolute inset-0 flex items-center justify-center bg-black/40 transition-opacity ${isCurrentPlaying ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                        {isCurrentPlaying ? (
                           <div className="flex items-center gap-0.5 h-3">
                              {[1,2,3].map(j => (
                                <div key={j} className="w-0.5 bg-crimson animate-pulse" style={{ height: '100%', animation: 'audio-bar 0.6s infinite alternate' }} />
                              ))}
                           </div>
                        ) : <Play size={20} fill="white" className="text-white" />}
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h4 className={`font-bold text-base truncate transition-colors ${isCurrentPlaying ? 'text-crimson' : 'text-moonlit group-hover:text-white'}`}>{track.title}</h4>
                      <p className="text-xs text-moonlit/40 uppercase tracking-widest font-medium">{track.artist}</p>
                    </div>

                    <button className={`p-2 rounded-full transition-colors ${isCurrentPlaying ? 'text-crimson' : 'text-moonlit/20 hover:text-crimson'}`}>
                      <Heart size={20} fill={isCurrentPlaying ? "currentColor" : "none"} />
                    </button>
                  </motion.div>
                );
              })
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
