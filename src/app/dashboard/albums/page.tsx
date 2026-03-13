"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Disc, Calendar, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { apiGetAlbums } from '@/lib/api';

export interface Album {
  id: number;
  title: string;
  artist: string;
  description: string;
  cover_url: string;
  release_date: string;
}

export default function AlbumsPage() {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await apiGetAlbums();
        setAlbums(data as Album[]);
      } catch (err) {
        console.error('Failed to load albums', err);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center h-full bg-void-bg">
        <div className="w-10 h-10 border-2 border-crimson/30 border-t-crimson rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto scroll-smooth h-full custom-scrollbar p-8 bg-void-bg">
      <div className="max-w-6xl mx-auto">
        <header className="mb-12">
          <h1 className="text-4xl font-bold font-display text-moonlit mb-3 tracking-tight">
            The <span className="text-crimson">Archives</span>
          </h1>
          <p className="text-moonlit/40 text-sm font-medium uppercase tracking-[0.2em]">Curated Manifestations of the Void</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {albums.map((album, i) => (
            <AlbumCard key={album.id} album={album} index={i} />
          ))}
        </div>

        {albums.length === 0 && (
          <div className="text-center py-20 opacity-20">
            <Disc size={64} className="mx-auto mb-4 animate-spin-slow" />
            <p className="font-display text-xl uppercase tracking-widest">Abyss is currently empty...</p>
          </div>
        )}
      </div>
    </div>
  );
}

function AlbumCard({ album, index }: { album: Album; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="group"
    >
      <Link href={`/dashboard/albums/${album.id}`} className="block">
        <div className="relative aspect-square rounded-3xl overflow-hidden glass-crimson border border-white/5 mb-4 group-hover:glow-crimson transition-all duration-500">
          <img 
            src={album.cover_url || "/lal-divane-avatar.png"} 
            alt={album.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-linear-to-t from-void-bg via-transparent to-transparent opacity-60" />
          
          <div className="absolute inset-x-0 bottom-0 p-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
            <div className="flex items-center gap-2 text-crimson text-xs font-black uppercase tracking-widest mb-1">
              <Calendar size={12} />
              {new Date(album.release_date).getFullYear()}
            </div>
            <h3 className="text-xl font-bold text-moonlit leading-tight truncate">{album.title}</h3>
          </div>

          <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-void-bg/80 backdrop-blur-md flex items-center justify-center border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
            <ChevronRight size={20} className="text-crimson" />
          </div>
        </div>

        <div>
          <h3 className="text-lg font-bold text-moonlit mb-1 transition-colors group-hover:text-crimson">
            {album.title}
          </h3>
          <div className="flex items-center gap-2 text-moonlit/40 text-xs">
            <Disc size={12} className="text-crimson/50" />
            <span className="uppercase tracking-widest">{album.artist}</span>
            <span className="opacity-20">•</span>
            <span>Manifested in {new Date(album.release_date).getFullYear()}</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
