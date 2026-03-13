"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Disc, Music, AlertCircle, CheckCircle2, Loader2, ArrowLeft, Archive, Edit3, Trash2, Search, X } from 'lucide-react';
import { 
  apiCreateAlbum, apiCreateTrack, apiGetAlbums, apiGetTracks,
  apiUpdateAlbum, apiDeleteAlbum, apiUpdateTrack, apiDeleteTrack 
} from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

type Tab = 'album' | 'track' | 'archives';

export default function AdminPage() {
  const { isAdmin, isLoading: authLoading } = useAuth();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<Tab>('album');
  const [albums, setAlbums] = useState<any[]>([]);
  const [tracks, setTracks] = useState<any[]>([]);
  const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingList, setIsLoadingList] = useState(false);
  
  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  
  // Edit state
  const [editingItem, setEditingItem] = useState<{ type: 'album' | 'track', data: any } | null>(null);

  // Album Form State
  const [albumForm, setAlbumForm] = useState({
    title: '',
    artist: 'Lal Divane',
    description: '',
    cover_url: '',
    release_date: new Date().toISOString().split('T')[0]
  });

  // Track Form State
  const [trackForm, setTrackForm] = useState({
    title: '',
    artist: 'Lal Divane',
    album_id: '' as string | number,
    duration_seconds: 0,
    audio_url: '',
    cover_url: ''
  });

  useEffect(() => {
    if (!authLoading && !isAdmin) {
      router.replace('/dashboard');
    }
  }, [isAdmin, authLoading, router]);

  useEffect(() => {
    if (isAdmin) {
      loadInitialData();
    }
  }, [isAdmin]);

  async function loadInitialData() {
    setIsLoadingList(true);
    try {
      const [albumsData, tracksData] = await Promise.all([
        apiGetAlbums(),
        apiGetTracks()
      ]);
      setAlbums(albumsData);
      setTracks(tracksData);
    } catch (err) {
      console.error('Failed to load void data', err);
    } finally {
      setIsLoadingList(false);
    }
  }

  const handleAlbumSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus(null);
    try {
      if (editingItem && editingItem.type === 'album') {
        await apiUpdateAlbum(editingItem.data.id, albumForm);
        setStatus({ type: 'success', message: 'Album updated in the void.' });
        setEditingItem(null);
      } else {
        await apiCreateAlbum(albumForm);
        setStatus({ type: 'success', message: 'Album manifested successfully.' });
      }
      setAlbumForm({
        title: '',
        artist: 'Lal Divane',
        description: '',
        cover_url: '',
        release_date: new Date().toISOString().split('T')[0]
      });
      loadInitialData();
    } catch (err: any) {
      setStatus({ type: 'error', message: err.message || 'Void rejection occurred.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTrackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus(null);
    try {
      const trackData = {
        ...trackForm,
        album_id: trackForm.album_id === '' ? null : Number(trackForm.album_id)
      };
      if (editingItem && editingItem.type === 'track') {
        await apiUpdateTrack(editingItem.data.id, trackData);
        setStatus({ type: 'success', message: 'Track resonance updated.' });
        setEditingItem(null);
      } else {
        await apiCreateTrack(trackData);
        setStatus({ type: 'success', message: 'Track echoed successfully.' });
      }
      setTrackForm({
        title: '',
        artist: 'Lal Divane',
        album_id: '',
        duration_seconds: 0,
        audio_url: '',
        cover_url: ''
      });
      loadInitialData();
    } catch (err: any) {
      setStatus({ type: 'error', message: err.message || 'Void rejection occurred.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (type: 'album' | 'track', id: number) => {
    if (!confirm('Are you sure you want to banish this from reality?')) return;
    try {
      if (type === 'album') await apiDeleteAlbum(id);
      else await apiDeleteTrack(id);
      setStatus({ type: 'success', message: 'Item banished from the void.' });
      loadInitialData();
    } catch (err: any) {
      setStatus({ type: 'error', message: err.message || 'Banishment failed.' });
    }
  };

  const startEdit = (type: 'album' | 'track', item: any) => {
    setEditingItem({ type, data: item });
    if (type === 'album') {
      setAlbumForm({
        title: item.title,
        artist: item.artist,
        description: item.description || '',
        cover_url: item.cover_url || '',
        release_date: item.release_date || new Date().toISOString().split('T')[0]
      });
      setActiveTab('album');
    } else {
      setTrackForm({
        title: item.title,
        artist: item.artist,
        album_id: item.album_id || '',
        duration_seconds: item.duration_seconds,
        audio_url: item.audio_url || '',
        cover_url: item.cover_url || ''
      });
      setActiveTab('track');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (authLoading || !isAdmin) {
    return (
      <div className="flex-1 flex items-center justify-center bg-void-bg">
        <Loader2 className="w-10 h-10 text-crimson animate-spin" />
      </div>
    );
  }

  const filteredAlbums = albums.filter(a => a.title.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredTracks = tracks.filter(t => t.title.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="flex-1 overflow-y-auto scroll-smooth h-full custom-scrollbar bg-void-bg text-moonlit p-8 lg:p-12">
      <div className="max-w-4xl mx-auto">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm text-moonlit/40 hover:text-crimson transition-colors mb-8 group">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Return to Dashboard
        </Link>

        <header className="mb-12">
          <h1 className="text-4xl font-bold font-display mb-2">
            Void <span className="text-crimson">Management</span>
          </h1>
          <p className="text-moonlit/40">Manifest new realities. Resonate with the shadows.</p>
        </header>

        {/* Tabs */}
        <div className="flex flex-wrap gap-4 mb-10 p-1.5 bg-white/5 rounded-2xl w-fit">
          <button
            onClick={() => { setActiveTab('album'); if (!editingItem) setStatus(null); }}
            className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${activeTab === 'album' ? 'bg-crimson text-white shadow-lg glow-crimson' : 'text-moonlit/40 hover:text-moonlit'}`}
          >
            <Disc size={18} />
            {editingItem && editingItem.type === 'album' ? 'Edit Album' : 'Add Album'}
          </button>
          <button
            onClick={() => { setActiveTab('track'); if (!editingItem) setStatus(null); }}
            className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${activeTab === 'track' ? 'bg-crimson text-white shadow-lg glow-crimson' : 'text-moonlit/40 hover:text-moonlit'}`}
          >
            <Music size={18} />
            {editingItem && editingItem.type === 'track' ? 'Edit Track' : 'Add Track'}
          </button>
          <button
            onClick={() => { setActiveTab('archives'); setStatus(null); setEditingItem(null); }}
            className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${activeTab === 'archives' ? 'bg-crimson text-white shadow-lg glow-crimson' : 'text-moonlit/40 hover:text-moonlit'}`}
          >
            <Archive size={18} />
            Archives
          </button>
        </div>

        {editingItem && (
          <div className="mb-6 flex items-center justify-between bg-crimson/10 border border-crimson/20 p-4 rounded-xl">
            <div className="flex items-center gap-3">
              <Edit3 size={18} className="text-crimson" />
              <span className="text-sm font-bold">Currently manifesting changes for: <span className="text-crimson">{editingItem.data.title}</span></span>
            </div>
            <button 
              onClick={() => {
                setEditingItem(null);
                setAlbumForm({ title: '', artist: 'Lal Divane', description: '', cover_url: '', release_date: new Date().toISOString().split('T')[0] });
                setTrackForm({ title: '', artist: 'Lal Divane', album_id: '', duration_seconds: 0, audio_url: '', cover_url: '' });
              }}
              className="p-1.5 hover:bg-white/5 rounded-lg transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        )}

        {/* Content Area */}
        <div className="glass rounded-4xl border border-void-border p-8 md:p-10 relative overflow-hidden min-h-[400px]">
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-crimson/5 rounded-full blur-[80px]" />
          
          {status && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mb-8 p-4 rounded-xl flex items-center gap-3 border ${status.type === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-crimson/10 border-crimson/20 text-crimson'}`}
            >
              {status.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
              <span className="text-sm font-medium">{status.message}</span>
            </motion.div>
          )}

          {activeTab === 'album' && (
            <form onSubmit={handleAlbumSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-moonlit/40 px-1">Album Title</label>
                  <input
                    type="text"
                    required
                    value={albumForm.title}
                    onChange={(e) => setAlbumForm({...albumForm, title: e.target.value})}
                    placeholder="e.g. Rituals of the Digital Void"
                    className="w-full bg-white/5 border border-void-border rounded-xl px-4 py-3 text-moonlit focus:outline-none focus:border-crimson/50 transition-all shadow-inner"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-moonlit/40 px-1">Artist</label>
                  <input
                    type="text"
                    required
                    value={albumForm.artist}
                    onChange={(e) => setAlbumForm({...albumForm, artist: e.target.value})}
                    className="w-full bg-white/5 border border-void-border rounded-xl px-4 py-3 text-moonlit focus:outline-none focus:border-crimson/50 transition-all opacity-50 cursor-not-allowed"
                    readOnly
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-moonlit/40 px-1">Description</label>
                <textarea
                  value={albumForm.description}
                  onChange={(e) => setAlbumForm({...albumForm, description: e.target.value})}
                  placeholder="Envision the lore of this album..."
                  className="w-full bg-white/5 border border-void-border rounded-xl px-4 py-3 text-moonlit focus:outline-none focus:border-crimson/50 transition-all min-h-[100px] resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-moonlit/40 px-1">Cover URL</label>
                  <input
                    type="url"
                    required
                    value={albumForm.cover_url}
                    onChange={(e) => setAlbumForm({...albumForm, cover_url: e.target.value})}
                    placeholder="GitHub raw link or high-res image URL"
                    className="w-full bg-white/5 border border-void-border rounded-xl px-4 py-3 text-moonlit focus:outline-none focus:border-crimson/50 transition-all font-mono text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-moonlit/40 px-1">Release Date</label>
                  <input
                    type="date"
                    required
                    value={albumForm.release_date}
                    onChange={(e) => setAlbumForm({...albumForm, release_date: e.target.value})}
                    className="w-full bg-white/5 border border-void-border rounded-xl px-4 py-3 text-moonlit focus:outline-none focus:border-crimson/50 transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-crimson hover:bg-ember text-white py-4 rounded-xl font-bold uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 glow-crimson active:scale-95 disabled:opacity-50"
              >
                {isSubmitting ? <Loader2 className="animate-spin" /> : <Plus size={20} />}
                {editingItem ? 'Update Album' : 'Manifest Album'}
              </button>
            </form>
          )}

          {activeTab === 'track' && (
            <form onSubmit={handleTrackSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-moonlit/40 px-1">Track Title</label>
                  <input
                    type="text"
                    required
                    value={trackForm.title}
                    onChange={(e) => setTrackForm({...trackForm, title: e.target.value})}
                    placeholder="e.g. Whispers of Ash"
                    className="w-full bg-white/5 border border-void-border rounded-xl px-4 py-3 text-moonlit focus:outline-none focus:border-crimson/50 transition-all shadow-inner"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-moonlit/40 px-1">Artist</label>
                  <input
                    type="text"
                    required
                    value={trackForm.artist}
                    onChange={(e) => setTrackForm({...trackForm, artist: e.target.value})}
                    className="w-full bg-white/5 border border-void-border rounded-xl px-4 py-3 text-moonlit focus:outline-none focus:border-crimson/50 transition-all opacity-50 cursor-not-allowed"
                    readOnly
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-moonlit/40 px-1">Linked Album (Optional)</label>
                  <select
                    value={trackForm.album_id}
                    onChange={(e) => setTrackForm({...trackForm, album_id: e.target.value})}
                    className="w-full bg-white/5 border border-void-border rounded-xl px-4 py-3 text-moonlit focus:outline-none focus:border-crimson/50 transition-all appearance-none"
                  >
                    <option value="" className="bg-void-900">None (Single)</option>
                    {albums.map(a => (
                      <option key={a.id} value={a.id} className="bg-void-900">{a.title}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-moonlit/40 px-1">Duration (Seconds)</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={trackForm.duration_seconds}
                    onChange={(e) => setTrackForm({...trackForm, duration_seconds: parseInt(e.target.value)})}
                    placeholder="e.g. 215"
                    className="w-full bg-white/5 border border-void-border rounded-xl px-4 py-3 text-moonlit focus:outline-none focus:border-crimson/50 transition-all shadow-inner"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-crimson px-1">Audio URL (Raw Content)</label>
                <input
                  type="url"
                  required
                  value={trackForm.audio_url}
                  onChange={(e) => setTrackForm({...trackForm, audio_url: e.target.value})}
                  placeholder="https://raw.githubusercontent.com/.../audio.mp3"
                  className="w-full bg-white/5 border border-crimson/10 rounded-xl px-4 py-3 text-moonlit focus:outline-none focus:border-crimson/50 transition-all font-mono text-sm"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-moonlit/40 px-1">Cover/Thumbnail URL</label>
                <input
                  type="url"
                  required
                  value={trackForm.cover_url}
                  onChange={(e) => setTrackForm({...trackForm, cover_url: e.target.value})}
                  placeholder="https://raw.githubusercontent.com/.../cover.jpg"
                  className="w-full bg-white/5 border border-void-border rounded-xl px-4 py-3 text-moonlit focus:outline-none focus:border-crimson/50 transition-all font-mono text-sm shadow-inner"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-crimson hover:bg-ember text-white py-4 rounded-xl font-bold uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 glow-crimson active:scale-95 disabled:opacity-50"
              >
                {isSubmitting ? <Loader2 className="animate-spin" /> : <Plus size={20} />}
                {editingItem ? 'Update Track' : 'Echo Track'}
              </button>
            </form>
          )}

          {activeTab === 'archives' && (
            <div className="space-y-8">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-moonlit/20" size={20} />
                <input 
                  type="text"
                  placeholder="Search the void archives..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white/5 border border-void-border rounded-2xl pl-12 pr-4 py-4 text-moonlit focus:outline-none focus:border-crimson/50 transition-all"
                />
              </div>

              {isLoadingList ? (
                <div className="py-20 flex justify-center"><Loader2 className="animate-spin text-crimson" /></div>
              ) : (
                <div className="grid grid-cols-1 gap-10">
                  {/* Albums Section */}
                  <section>
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-crimson mb-6 px-1 flex items-center gap-2">
                      <Disc size={14} /> Manifested Albums
                    </h3>
                    <div className="space-y-3">
                      {filteredAlbums.map(album => (
                        <div key={album.id} className="glass p-4 rounded-2xl border border-white/5 flex items-center gap-4 group hover:border-crimson/20 transition-all">
                          <img src={album.cover_url || "/lal-divane-avatar.png"} alt={album.title} className="w-12 h-12 rounded-lg object-cover bg-void-800" />
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-moonlit truncate">{album.title}</h4>
                            <p className="text-[10px] text-moonlit/30 uppercase tracking-widest">{new Date(album.release_date).getFullYear()} • {album.artist}</p>
                          </div>
                          <div className="flex gap-2">
                            <button 
                              onClick={() => startEdit('album', album)}
                              className="p-2.5 bg-white/5 hover:bg-crimson/10 text-moonlit/40 hover:text-crimson rounded-xl transition-all"
                            >
                              <Edit3 size={18} />
                            </button>
                            <button 
                              onClick={() => handleDelete('album', album.id)}
                              className="p-2.5 bg-white/5 hover:bg-crimson/10 text-moonlit/40 hover:text-crimson rounded-xl transition-all"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>
                      ))}
                      {filteredAlbums.length === 0 && <p className="text-center py-10 text-moonlit/20 text-sm italic">No albums found in this specific layer of the void.</p>}
                    </div>
                  </section>

                  {/* Tracks Section */}
                  <section>
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-crimson mb-6 px-1 flex items-center gap-2">
                      <Music size={14} /> Echoed Tracks
                    </h3>
                    <div className="space-y-3">
                      {filteredTracks.map(track => (
                        <div key={track.id} className="glass p-4 rounded-2xl border border-white/5 flex items-center gap-4 group hover:border-crimson/20 transition-all">
                          <img src={track.cover_url || "/lal-divane-avatar.png"} alt={track.title} className="w-12 h-12 rounded-lg object-cover bg-void-800" />
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-moonlit truncate">{track.title}</h4>
                            <p className="text-[10px] text-moonlit/30 uppercase tracking-widest">
                              {Math.floor(track.duration_seconds / 60)}:{(track.duration_seconds % 60).toString().padStart(2, '0')} • {track.artist}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <button 
                              onClick={() => startEdit('track', track)}
                              className="p-2.5 bg-white/5 hover:bg-crimson/10 text-moonlit/40 hover:text-crimson rounded-xl transition-all"
                            >
                              <Edit3 size={18} />
                            </button>
                            <button 
                              onClick={() => handleDelete('track', track.id)}
                              className="p-2.5 bg-white/5 hover:bg-crimson/10 text-moonlit/40 hover:text-crimson rounded-xl transition-all"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>
                      ))}
                      {filteredTracks.length === 0 && <p className="text-center py-10 text-moonlit/20 text-sm italic">No track echoes found here.</p>}
                    </div>
                  </section>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
