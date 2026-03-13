"use client";

import { useState, useEffect, use } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Play, Clock, Heart, Share2, Disc } from 'lucide-react';
import { apiGetAlbum, apiGetTracksByAlbum } from '@/lib/api';
import { useAudioStore, type Track } from '@/lib/audioStore';
import Link from 'next/link';

export default function AlbumDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [album, setAlbum] = useState<any>(null);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { currentTrack, playTrack } = useAudioStore();

  useEffect(() => {
    async function load() {
      if (!id) return;
      try {
        const [albumData, tracksData] = await Promise.all([
          apiGetAlbum(parseInt(id)),
          apiGetTracksByAlbum(parseInt(id))
        ]);
        setAlbum(albumData);
        setTracks(tracksData as Track[]);
      } catch (err) {
        console.error('Failed to load album details', err);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [id]);

  if (isLoading || !album) {
    return (
      <div className="flex-1 flex items-center justify-center h-full bg-void-bg text-moonlit">
        <div className="w-10 h-10 border-2 border-crimson/30 border-t-crimson rounded-full animate-spin"></div>
      </div>
    );
  }

  const handlePlayAlbum = () => {
    if (tracks.length > 0) {
      playTrack(tracks[0]);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto scroll-smooth h-full custom-scrollbar relative bg-void-bg text-moonlit">
      {/* Dynamic Background Blur */}
      <div className="absolute top-0 left-0 w-full h-[50vh] overflow-hidden -z-10 text-moonlit">
        <div 
          className="w-full h-full bg-cover bg-center blur-[120px] opacity-20 scale-110"
          style={{ backgroundImage: `url(${album.cover_url || "/lal-divane-avatar.png"})` }}
        />
        <div className="absolute inset-0 bg-linear-to-b from-transparent via-void-bg/50 to-void-bg" />
      </div>

      <div className="max-w-6xl mx-auto p-8 relative">
        <Link href="/dashboard/albums" className="flex items-center gap-2 text-moonlit/40 hover:text-crimson transition-colors mb-12 group">
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-xs font-bold uppercase tracking-widest">Back to Archives</span>
        </Link>

        {/* Hero Header */}
        <div className="flex flex-col md:flex-row gap-12 items-end mb-16">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-64 h-64 md:w-80 md:h-80 shrink-0 rounded-4xl overflow-hidden glow-crimson ring-4 ring-void-900/50 shadow-2xl"
          >
            <img 
              src={album.cover_url || "/lal-divane-avatar.png"} 
              alt={album.title}
              className="w-full h-full object-cover"
            />
          </motion.div>

          <div className="flex-1">
            <div className="flex items-center gap-2 text-crimson text-sm font-black uppercase tracking-[0.3em] mb-4">
              <Disc size={16} />
              Manifested Reality
            </div>
            <h1 className="text-5xl md:text-7xl font-bold font-display text-moonlit mb-6 tracking-tight leading-none">
              {album.title}
            </h1>
            <div className="flex flex-wrap items-center gap-6 text-moonlit/50 text-sm font-medium">
              <span className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-crimson/20 border border-crimson/50" />
                <span className="text-moonlit uppercase tracking-widest">{album.artist}</span>
              </span>
              <span className="opacity-20">•</span>
              <span>{tracks.length} Echoes</span>
              <span className="opacity-20">•</span>
              <span>Released {new Date(album.release_date).toLocaleDateString()}</span>
            </div>

            <div className="flex items-center gap-4 mt-10">
              <button 
                onClick={handlePlayAlbum}
                className="bg-crimson hover:bg-ember text-moonlit px-8 py-4 rounded-full font-bold uppercase tracking-widest flex items-center gap-3 transition-all active:scale-95 glow-crimson"
              >
                <Play size={20} fill="currentColor" />
                Play All
              </button>
              <button className="w-14 h-14 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/5 transition-colors text-moonlit/60 hover:text-crimson">
                <Heart size={20} />
              </button>
              <button className="w-14 h-14 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/5 transition-colors text-moonlit/60 hover:text-moonlit">
                <Share2 size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Tracklist Table */}
        <div className="glass rounded-4xl border border-white/5 p-4 md:p-8">
          <div className="grid grid-cols-[3rem_2fr_1fr_3rem] px-6 py-4 border-b border-white/5 text-[10px] uppercase font-bold tracking-[0.2em] text-moonlit/20">
            <span>#</span>
            <span>Title</span>
            <span className="hidden md:block">Abyss Resonance</span>
            <div className="flex justify-end"><Clock size={14} /></div>
          </div>

          <div className="mt-4">
            {tracks.map((track, i) => {
              const isCurrent = currentTrack?.id === track.id;

              return (
                <div 
                  key={track.id}
                  onClick={() => playTrack(track)}
                  className={`grid grid-cols-[3rem_2fr_1fr_3rem] items-center px-6 py-4 rounded-2xl cursor-pointer transition-all group ${isCurrent ? 'bg-crimson/10 text-crimson' : 'hover:bg-white/5 text-moonlit/60 hover:text-moonlit'}`}
                >
                  <div className="text-sm font-medium opacity-20 group-hover:hidden">
                    {i + 1}
                  </div>
                  <div className="hidden group-hover:flex items-center text-crimson">
                    <Play size={14} fill="currentColor" />
                  </div>

                  <div>
                    <div className={`text-base font-bold tracking-tight mb-0.5 ${isCurrent ? 'text-crimson' : 'text-moonlit'}`}>
                      {track.title}
                    </div>
                    <div className="text-xs opacity-40 uppercase tracking-widest font-medium">
                      {track.artist}
                    </div>
                  </div>

                  <div className="hidden md:block text-xs font-mono opacity-20">
                    {(track as any).play_count?.toLocaleString() || "0"} READS
                  </div>

                  <div className="flex justify-end text-xs font-mono opacity-40">
                    {Math.floor(track.duration_seconds / 60)}:{(track.duration_seconds % 60).toString().padStart(2, '0')}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
