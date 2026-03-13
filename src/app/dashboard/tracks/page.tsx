"use client";

import { useEffect, useState } from 'react';
import { Play, Clock, Heart, Search } from 'lucide-react';
import { apiGetTracks } from '@/lib/api';
import { useAudioStore, type Track } from '@/lib/audioStore';
import { motion, AnimatePresence } from 'framer-motion';

export default function TracksPage() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [filteredTracks, setFilteredTracks] = useState<Track[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  
  const { playTrack, currentTrack, isPlaying } = useAudioStore();

  useEffect(() => {
    async function loadTracks() {
      try {
        const data = await apiGetTracks();
        setTracks(data);
        setFilteredTracks(data);
      } catch (err) {
        console.error("Failed to fetch tracks", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadTracks();
  }, []);

  useEffect(() => {
    const q = searchQuery.toLowerCase();
    setFilteredTracks(
      tracks.filter(t => 
        t.title.toLowerCase().includes(q) || 
        (t.artist && t.artist.toLowerCase().includes(q))
      )
    );
  }, [searchQuery, tracks]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  if (isLoading) {
    return (
      <div className="flex-1 overflow-y-auto h-full flex items-center justify-center bg-void-bg">
        <div className="w-12 h-12 border-4 border-crimson/20 border-t-crimson rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto scroll-smooth h-full custom-scrollbar relative">
      <div className="absolute top-0 right-0 w-96 h-96 bg-crimson/5 blur-[120px] -z-10 pointer-events-none" />
      
      <div className="max-w-6xl mx-auto px-8 py-12">
        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-xs uppercase tracking-[0.4em] text-crimson mb-3 font-bold">The Archives</p>
            <h1 className="text-5xl font-bold font-display text-moonlit mb-2 tracking-tight">
              All <span className="gradient-text">Tracks</span>
            </h1>
            <p className="text-sm text-moonlit/40 italic font-medium">"Every whisper recorded in the annals of the void."</p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="relative group min-w-[320px]"
          >
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-moonlit/20 group-focus-within:text-crimson transition-colors" size={20} />
            <input 
              type="text" 
              placeholder="Search echos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-void-border rounded-2xl pl-12 pr-4 py-3.5 text-sm text-moonlit placeholder-moonlit/20 outline-none focus:border-crimson/30 focus:bg-white/10 transition-all shadow-lg"
            />
          </motion.div>
        </header>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="glass rounded-3xl border border-void-border/50 overflow-hidden mb-24 shadow-2xl relative z-10"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 text-moonlit/20 text-[10px] uppercase tracking-[0.2em] font-black">
                  <th className="px-8 py-6 w-16">#</th>
                  <th className="px-8 py-6">Title</th>
                  <th className="px-8 py-6 hidden md:table-cell">Artist</th>
                  <th className="px-8 py-6 w-24 text-right"><Clock size={14} className="inline mr-1" /></th>
                  <th className="px-8 py-6 w-16"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/3">
                <AnimatePresence>
                  {filteredTracks.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-8 py-32 text-center text-moonlit/10 text-xl font-display italic">
                        The archives are silent...
                      </td>
                    </tr>
                  ) : (
                    filteredTracks.map((track, i) => {
                      const isCurrentPlaying = currentTrack?.id === track.id && isPlaying;
                      return (
                        <motion.tr 
                          key={track.id}
                          layout
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.3, delay: i * 0.05 }}
                          className={`group hover:bg-crimson/3 transition-colors cursor-pointer relative ${isCurrentPlaying ? 'bg-crimson/5' : ''}`}
                          onClick={() => playTrack(track)}
                        >
                          <td className="px-8 py-5 text-moonlit/20 font-mono text-sm">
                            {isCurrentPlaying ? (
                              <div className="flex items-center gap-0.5 h-4">
                                {[1, 2, 3].map(j => (
                                  <div key={j} className="w-0.5 bg-crimson animate-[audio-bar_0.6s_ease-in-out_infinite_alternate]" style={{ animationDelay: `${j*0.1}s` }} />
                                ))}
                              </div>
                            ) : (
                              <span className="group-hover:hidden">{String(i + 1).padStart(2, '0')}</span>
                            )}
                            {!isCurrentPlaying && <Play size={16} className="hidden group-hover:block text-crimson" fill="currentColor" />}
                          </td>
                          <td className="px-8 py-5">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-xl bg-void-800 overflow-hidden shrink-0 shadow-lg border border-white/5 group-hover:scale-105 transition-transform duration-500">
                                {track.cover_url && <img src={track.cover_url} alt={track.title} className="w-full h-full object-cover group-hover:opacity-80 transition-opacity" />}
                              </div>
                              <div className="min-w-0">
                                  <p className={`font-bold text-base truncate transition-colors ${isCurrentPlaying ? 'text-crimson' : 'text-moonlit group-hover:text-white'}`}>
                                    {track.title}
                                  </p>
                                  <p className="md:hidden text-xs text-moonlit/40 truncate">{track.artist}</p>
                                </div>
                            </div>
                          </td>
                          <td className="px-8 py-5 hidden md:table-cell">
                             <span className="text-sm font-medium text-moonlit/40 group-hover:text-moonlit/60 transition-colors uppercase tracking-widest text-[10px]">
                                {track.artist}
                             </span>
                          </td>
                          <td className="px-8 py-5 text-moonlit/30 font-mono text-xs text-right group-hover:text-moonlit/50 transition-colors">
                            {formatTime(track.duration_seconds)}
                          </td>
                          <td className="px-8 py-5 text-right">
                            <button 
                              onClick={(e) => { e.stopPropagation(); }}
                              className="text-moonlit/10 hover:text-crimson transition-all hover:scale-125"
                            >
                              <Heart size={18} fill={isCurrentPlaying ? "currentColor" : "none"} />
                            </button>
                          </td>
                        </motion.tr>
                      );
                    })
                  )}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
