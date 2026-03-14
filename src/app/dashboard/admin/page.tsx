"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Disc, Music, AlertCircle, CheckCircle2, 
  Loader2, ArrowLeft, Archive, Edit3, Trash2, 
  Search, X, Users, MessageSquare, Shield, Globe
} from 'lucide-react';
import { 
  apiCreateAlbum, apiCreateTrack, apiGetAlbums, apiGetTracks,
  apiUpdateAlbum, apiDeleteAlbum, apiUpdateTrack, apiDeleteTrack,
  apiGetCommunities, apiCreateCommunity, apiUpdateCommunity, apiDeleteCommunity,
  apiGetAllPosts, apiAdminDeletePost
} from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

type Tab = 'releases' | 'archives' | 'sanctuaries' | 'moderation';

export default function AdminPage() {
  const { isAdmin, isLoading: authLoading } = useAuth();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<Tab>('releases');
  const [albums, setAlbums] = useState<any[]>([]);
  const [tracks, setTracks] = useState<any[]>([]);
  const [communities, setCommunities] = useState<any[]>([]);
  const [allPosts, setAllPosts] = useState<any[]>([]);
  
  const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingList, setIsLoadingList] = useState(false);
  
  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  
  // Edit state
  const [editingItem, setEditingItem] = useState<{ type: 'album' | 'track' | 'community', data: any } | null>(null);

  // Form States
  const [albumForm, setAlbumForm] = useState({
    title: '',
    artist: 'Lal Divane',
    description: '',
    cover_url: '',
    release_date: new Date().toISOString().split('T')[0]
  });

  const [trackForm, setTrackForm] = useState({
    title: '',
    artist: 'Lal Divane',
    album_id: '' as string | number,
    duration_seconds: 0,
    audio_url: '',
    cover_url: ''
  });

  const [communityForm, setCommunityForm] = useState({
    name: '',
    slug: '',
    description: '',
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
  }, [isAdmin, activeTab]);

  async function loadInitialData() {
    setIsLoadingList(true);
    try {
      const [albumsData, tracksData, communitiesData, postsData] = await Promise.all([
        apiGetAlbums(),
        apiGetTracks(),
        apiGetCommunities(),
        activeTab === 'moderation' ? apiGetAllPosts() : Promise.resolve([])
      ]);
      setAlbums(albumsData);
      setTracks(tracksData);
      setCommunities(communitiesData);
      setAllPosts(postsData);
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
        title: '', artist: 'Lal Divane', description: '',
        cover_url: '', release_date: new Date().toISOString().split('T')[0]
      });
      loadInitialData();
    } catch (err: any) {
      setStatus({ type: 'error', message: err.message || 'Void rejection.' });
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
        title: '', artist: 'Lal Divane', album_id: '',
        duration_seconds: 0, audio_url: '', cover_url: ''
      });
      loadInitialData();
    } catch (err: any) {
      setStatus({ type: 'error', message: err.message || 'Void rejection.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCommunitySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus(null);
    try {
      if (editingItem && editingItem.type === 'community') {
        await apiUpdateCommunity(editingItem.data.id, communityForm);
        setStatus({ type: 'success', message: 'Sanctuary expanded and updated.' });
        setEditingItem(null);
      } else {
        await apiCreateCommunity(communityForm);
        setStatus({ type: 'success', message: 'New Sanctuary manifested.' });
      }
      setCommunityForm({ name: '', slug: '', description: '', cover_url: '' });
      loadInitialData();
    } catch (err: any) {
      setStatus({ type: 'error', message: err.message || 'Sanctuary creation failed.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (type: 'album' | 'track' | 'community' | 'post', id: number) => {
    if (!confirm('Are you sure you want to banish this from reality?')) return;
    try {
      if (type === 'album') await apiDeleteAlbum(id);
      else if (type === 'track') await apiDeleteTrack(id);
      else if (type === 'community') await apiDeleteCommunity(id);
      else if (type === 'post') await apiAdminDeletePost(id);
      
      setStatus({ type: 'success', message: 'Item banished from the void.' });
      loadInitialData();
    } catch (err: any) {
      setStatus({ type: 'error', message: err.message || 'Banishment failed.' });
    }
  };

  const startEdit = (type: 'album' | 'track' | 'community', item: any) => {
    setEditingItem({ type, data: item });
    if (type === 'album') {
      setAlbumForm({
        title: item.title, artist: item.artist, description: item.description || '',
        cover_url: item.cover_url || '', release_date: item.release_date || ''
      });
      setActiveTab('releases');
    } else if (type === 'track') {
      setTrackForm({
        title: item.title, artist: item.artist, album_id: item.album_id || '',
        duration_seconds: item.duration_seconds, audio_url: item.audio_url || '',
        cover_url: item.cover_url || ''
      });
      setActiveTab('releases');
    } else if (type === 'community') {
      setCommunityForm({
        name: item.name, slug: item.slug, description: item.description || '',
        cover_url: item.cover_url || ''
      });
      setActiveTab('sanctuaries');
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
  const filteredCommunities = communities.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="flex-1 overflow-y-auto scroll-smooth h-full custom-scrollbar bg-void-bg text-moonlit p-8 lg:p-12 pb-32">
      <div className="max-w-5xl mx-auto">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm text-moonlit/40 hover:text-crimson transition-colors mb-8 group">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Return to Dashboard
        </Link>

        <header className="mb-12 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold font-display mb-2">
              Void <span className="text-crimson">Command Center</span>
            </h1>
            <p className="text-moonlit/40 text-sm tracking-widest uppercase">Absolute Project Sovereignty • Admin Session</p>
          </div>
          <div className="w-12 h-12 rounded-full border border-crimson/20 p-1">
            <div className="w-full h-full rounded-full bg-crimson/10 flex items-center justify-center text-crimson animate-pulse">
              <Shield size={20} />
            </div>
          </div>
        </header>

        {/* Universal Tabs */}
        <div className="flex flex-wrap gap-2 mb-10 p-1.5 bg-white/5 rounded-2xl w-fit">
          <button
            onClick={() => { setActiveTab('releases'); setEditingItem(null); setStatus(null); }}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest transition-all flex items-center gap-3 ${activeTab === 'releases' ? 'bg-crimson text-white shadow-lg glow-crimson' : 'text-moonlit/40 hover:text-white'}`}
          >
            <Plus size={16} /> Releases
          </button>
          <button
            onClick={() => { setActiveTab('archives'); setStatus(null); }}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest transition-all flex items-center gap-3 ${activeTab === 'archives' ? 'bg-crimson text-white shadow-lg glow-crimson' : 'text-moonlit/40 hover:text-white'}`}
          >
            <Archive size={16} /> Archives
          </button>
          <button
            onClick={() => { setActiveTab('sanctuaries'); setEditingItem(null); setStatus(null); }}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest transition-all flex items-center gap-3 ${activeTab === 'sanctuaries' ? 'bg-crimson text-white shadow-lg glow-crimson' : 'text-moonlit/40 hover:text-white'}`}
          >
            <Globe size={16} /> Sanctuaries
          </button>
          <button
            onClick={() => { setActiveTab('moderation'); setStatus(null); }}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest transition-all flex items-center gap-3 ${activeTab === 'moderation' ? 'bg-crimson text-white shadow-lg glow-crimson' : 'text-moonlit/40 hover:text-white'}`}
          >
            <MessageSquare size={16} /> Echoes
          </button>
        </div>

        {editingItem && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-8 flex items-center justify-between bg-crimson/10 border border-crimson/30 p-5 rounded-2xl backdrop-blur-md"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-crimson flex items-center justify-center shadow-lg glow-crimson">
                <Edit3 size={20} className="text-white" />
              </div>
              <div>
                <span className="text-xs uppercase font-black tracking-widest text-crimson block mb-0.5">Manifesting Changes</span>
                <span className="text-sm font-bold text-moonlit">Editing {editingItem.type}: <span className="text-crimson">{editingItem.data.title || editingItem.data.name}</span></span>
              </div>
            </div>
            <button 
              onClick={() => {
                setEditingItem(null);
                setAlbumForm({ title: '', artist: 'Lal Divane', description: '', cover_url: '', release_date: new Date().toISOString().split('T')[0] });
                setTrackForm({ title: '', artist: 'Lal Divane', album_id: '', duration_seconds: 0, audio_url: '', cover_url: '' });
                setCommunityForm({ name: '', slug: '', description: '', cover_url: '' });
              }}
              className="p-2.5 hover:bg-white/10 rounded-xl transition-colors text-moonlit/40 hover:text-white"
            >
              <X size={20} />
            </button>
          </motion.div>
        )}

        {status && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`mb-8 p-5 rounded-2xl flex items-center gap-4 border ${status.type === 'success' ? 'bg-green-500/5 border-green-500/20 text-green-400' : 'bg-crimson/5 border-crimson/20 text-crimson'}`}
          >
            <div className={`p-2 rounded-lg ${status.type === 'success' ? 'bg-green-500/10' : 'bg-crimson/10'}`}>
              {status.type === 'success' ? <CheckCircle2 size={24} /> : <AlertCircle size={24} />}
            </div>
            <span className="text-sm font-bold tracking-wide">{status.message}</span>
          </motion.div>
        )}

        <div className="glass rounded-[2rem] border border-void-border/50 p-8 md:p-12 relative overflow-hidden min-h-[500px] shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-crimson/5 rounded-full blur-[120px] -mr-48 -mt-48" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-crimson/5 rounded-full blur-[100px] -ml-32 -mb-32" />
          
          {/* RELEASES TAB */}
          {activeTab === 'releases' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 relative z-10">
              {/* Add Album Form */}
              <section className="space-y-8">
                <h3 className="text-lg font-bold flex items-center gap-3 decoration-crimson decoration-2">
                  <Disc className="text-crimson" size={24} />
                  {editingItem?.type === 'album' ? 'Manifest Changes' : 'Manifest Album'}
                </h3>
                <form onSubmit={handleAlbumSubmit} className="space-y-5">
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-black tracking-widest text-moonlit/30 ml-1">Album Title</label>
                    <input
                      type="text" required value={albumForm.title}
                      onChange={(e) => setAlbumForm({...albumForm, title: e.target.value})}
                      placeholder="Rituals of the Digital Void"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 text-sm focus:outline-none focus:border-crimson/50 transition-all font-medium"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-black tracking-widest text-moonlit/30 ml-1">Description</label>
                    <textarea
                      value={albumForm.description}
                      onChange={(e) => setAlbumForm({...albumForm, description: e.target.value})}
                      placeholder="The lore of this resonance..."
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 text-sm focus:outline-none focus:border-crimson/50 transition-all min-h-[100px] resize-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-black tracking-widest text-moonlit/30 ml-1">Cover URL</label>
                    <input
                      type="url" required value={albumForm.cover_url}
                      onChange={(e) => setAlbumForm({...albumForm, cover_url: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 text-xs font-mono focus:outline-none focus:border-crimson/50 transition-all"
                    />
                  </div>
                  <button type="submit" disabled={isSubmitting} className="w-full bg-crimson hover:bg-ember text-white py-4 rounded-2xl font-black uppercase text-xs tracking-[0.3em] transition-all shadow-xl glow-crimson flex items-center justify-center gap-3">
                    {isSubmitting ? <Loader2 className="animate-spin" /> : <Plus size={16} />}
                    {editingItem?.type === 'album' ? 'Update' : 'Manifest'}
                  </button>
                </form>
              </section>

              {/* Add Track Form */}
              <section className="space-y-8 lg:border-l lg:border-white/5 lg:pl-12">
                <h3 className="text-lg font-bold flex items-center gap-3">
                  <Music className="text-crimson" size={24} />
                  {editingItem?.type === 'track' ? 'Resonate Changes' : 'Echo Track'}
                </h3>
                <form onSubmit={handleTrackSubmit} className="space-y-5">
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-black tracking-widest text-moonlit/30 ml-1">Track Title</label>
                    <input
                      type="text" required value={trackForm.title}
                      onChange={(e) => setTrackForm({...trackForm, title: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 text-sm focus:outline-none focus:border-crimson/50 transition-all font-medium"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase font-black tracking-widest text-moonlit/30 ml-1">Album</label>
                      <select
                        value={trackForm.album_id}
                        onChange={(e) => setTrackForm({...trackForm, album_id: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3.5 text-xs focus:outline-none focus:border-crimson/50 transition-all"
                      >
                        <option value="">None (Single)</option>
                        {albums.map(a => <option key={a.id} value={a.id}>{a.title}</option>)}
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase font-black tracking-widest text-moonlit/30 ml-1">Seconds</label>
                      <input
                        type="number" required value={trackForm.duration_seconds}
                        onChange={(e) => setTrackForm({...trackForm, duration_seconds: parseInt(e.target.value)})}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 text-sm focus:outline-none focus:border-crimson/50 transition-all font-medium"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-black tracking-widest text-crimson ml-1">Audio URL (Raw)</label>
                    <input
                      type="url" required value={trackForm.audio_url}
                      onChange={(e) => setTrackForm({...trackForm, audio_url: e.target.value})}
                      className="w-full bg-white/5 border border-crimson/10 rounded-2xl px-5 py-3.5 text-xs font-mono focus:outline-none focus:border-crimson/50 transition-all"
                    />
                  </div>
                  <button type="submit" disabled={isSubmitting} className="w-full border-2 border-crimson/50 hover:bg-crimson text-white py-4 rounded-2xl font-black uppercase text-xs tracking-[0.3em] transition-all flex items-center justify-center gap-3">
                    {isSubmitting ? <Loader2 className="animate-spin" /> : <Plus size={16} />}
                    {editingItem?.type === 'track' ? 'Update' : 'Echo'}
                  </button>
                </form>
              </section>
            </div>
          )}

          {/* ARCHIVES TAB */}
          {activeTab === 'archives' && (
            <div className="space-y-10 relative z-10">
              <div className="relative max-w-xl">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-moonlit/20" size={20} />
                <input 
                  type="text" placeholder="Search the void archives..." value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-[2rem] pl-14 pr-6 py-5 text-sm font-medium focus:outline-none focus:border-crimson/30 transition-all"
                />
              </div>

              {isLoadingList ? (
                <div className="py-20 flex flex-col items-center justify-center gap-4">
                  <Loader2 className="animate-spin text-crimson w-10 h-10" />
                  <span className="text-xs uppercase tracking-[0.4em] text-moonlit/20">Accessing memory banks...</span>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                  {/* Albums Archives */}
                  <section>
                    <header className="flex items-center justify-between mb-6 px-2">
                       <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-crimson flex items-center gap-2">
                        <Disc size={16} /> Manifested Albums
                       </h4>
                       <span className="text-[10px] text-moonlit/20 font-bold">{filteredAlbums.length} Count</span>
                    </header>
                    <div className="space-y-3 custom-scrollbar max-h-[600px] overflow-y-auto pr-2">
                      {filteredAlbums.map(album => (
                        <div key={album.id} className="group glass p-4 rounded-3xl border border-white/5 flex items-center gap-5 hover:bg-white/[0.03] transition-all">
                          <img src={album.cover_url} className="w-14 h-14 rounded-xl object-cover shadow-2xl group-hover:scale-105 transition-transform" alt="" />
                          <div className="flex-1 min-w-0">
                            <h5 className="font-bold text-sm truncate">{album.title}</h5>
                            <p className="text-[10px] text-moonlit/30 uppercase tracking-[0.2em] mt-0.5">{album.artist} • {new Date(album.release_date).getFullYear()}</p>
                          </div>
                          <div className="flex gap-2">
                            <button onClick={() => startEdit('album', album)} className="p-3 rounded-xl bg-white/5 hover:bg-crimson/10 text-moonlit/20 hover:text-crimson transition-all"><Edit3 size={16}/></button>
                            <button onClick={() => handleDelete('album', album.id)} className="p-3 rounded-xl bg-white/5 hover:bg-crimson/10 text-moonlit/20 hover:text-crimson transition-all"><Trash2 size={16}/></button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>

                  {/* Tracks Archives */}
                  <section>
                    <header className="flex items-center justify-between mb-6 px-2">
                       <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-crimson flex items-center gap-2">
                        <Music size={16} /> Echoed Tracks
                       </h4>
                       <span className="text-[10px] text-moonlit/20 font-bold">{filteredTracks.length} Count</span>
                    </header>
                    <div className="space-y-3 custom-scrollbar max-h-[600px] overflow-y-auto pr-2">
                      {filteredTracks.map(track => (
                        <div key={track.id} className="group glass p-4 rounded-3xl border border-white/5 flex items-center gap-5 hover:bg-white/[0.03] transition-all">
                          <img src={track.cover_url} className="w-14 h-14 rounded-xl object-cover shadow-2xl group-hover:scale-105 transition-transform" alt="" />
                          <div className="flex-1 min-w-0">
                            <h5 className="font-bold text-sm truncate">{track.title}</h5>
                            <p className="text-[10px] text-moonlit/30 uppercase tracking-[0.2em] mt-0.5">{track.artist} • {Math.floor(track.duration_seconds/60)}:{String(track.duration_seconds%60).padStart(2,'0')}</p>
                          </div>
                          <div className="flex gap-2">
                            <button onClick={() => startEdit('track', track)} className="p-3 rounded-xl bg-white/5 hover:bg-crimson/10 text-moonlit/20 hover:text-crimson transition-all"><Edit3 size={16}/></button>
                            <button onClick={() => handleDelete('track', track.id)} className="p-3 rounded-xl bg-white/5 hover:bg-crimson/10 text-moonlit/20 hover:text-crimson transition-all"><Trash2 size={16}/></button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                </div>
              )}
            </div>
          )}

          {/* SANCTUARIES TAB */}
          {activeTab === 'sanctuaries' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 relative z-10">
              <section className="space-y-8">
                <h3 className="text-lg font-bold flex items-center gap-3">
                  <Globe className="text-crimson" size={24} />
                  {editingItem?.type === 'community' ? 'Modify Sanctuary' : 'Expand Sanctuary'}
                </h3>
                <form onSubmit={handleCommunitySubmit} className="space-y-5">
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-black tracking-widest text-moonlit/30 ml-1">Sanctuary Name</label>
                    <input
                      type="text" required value={communityForm.name}
                      onChange={(e) => setCommunityForm({...communityForm, name: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 text-sm focus:outline-none focus:border-crimson/50 transition-all font-medium"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-black tracking-widest text-moonlit/30 ml-1">Slug (URL identity)</label>
                    <input
                      type="text" required value={communityForm.slug}
                      onChange={(e) => setCommunityForm({...communityForm, slug: e.target.value.toLowerCase().replace(/ /g, '-')})}
                      placeholder="e.g. dark-lore"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 text-xs font-mono focus:outline-none focus:border-crimson/50 transition-all"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-black tracking-widest text-moonlit/30 ml-1">Description</label>
                    <textarea
                      value={communityForm.description}
                      onChange={(e) => setCommunityForm({...communityForm, description: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 text-sm focus:outline-none focus:border-crimson/50 transition-all min-h-[100px] resize-none"
                    />
                  </div>
                  <button type="submit" disabled={isSubmitting} className="w-full bg-white text-void-bg py-4 rounded-2xl font-black uppercase text-xs tracking-[0.3em] transition-all hover:bg-crimson hover:text-white glow-white/10 flex items-center justify-center gap-3">
                    {isSubmitting ? <Loader2 className="animate-spin" /> : <Plus size={16} />}
                    {editingItem ? 'Update Layer' : 'Manifest Space'}
                  </button>
                </form>
              </section>

              <section className="space-y-6 lg:border-l lg:border-white/5 lg:pl-12">
                <header className="flex items-center justify-between px-2">
                   <h4 className="text-[11px] font-black uppercase tracking-[0.4em] text-crimson">Existing Sanctuaries</h4>
                   <span className="text-[10px] text-moonlit/20 font-bold">{communities.length}</span>
                </header>
                <div className="space-y-3 custom-scrollbar max-h-[600px] overflow-y-auto pr-2">
                  {communities.map(c => (
                    <div key={c.id} className="group glass p-5 rounded-3xl border border-white/5 flex items-center gap-5 hover:bg-white/[0.03] transition-all">
                      <div className="w-12 h-12 rounded-xl bg-crimson/10 flex items-center justify-center text-crimson"><Users size={20}/></div>
                      <div className="flex-1 min-w-0">
                        <h5 className="font-bold text-sm truncate">{c.name}</h5>
                        <p className="text-[10px] text-moonlit/30 uppercase tracking-[0.1em] mt-0.5">/{c.slug}</p>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => startEdit('community', c)} className="p-3 rounded-xl bg-white/5 hover:bg-crimson/10 text-moonlit/20 hover:text-crimson transition-all"><Edit3 size={16}/></button>
                        <button onClick={() => handleDelete('community', c.id)} className="p-3 rounded-xl bg-white/5 hover:bg-crimson/10 text-moonlit/20 hover:text-crimson transition-all"><Trash2 size={16}/></button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          )}

          {/* MODERATION TAB */}
          {activeTab === 'moderation' && (
            <div className="space-y-10 relative z-10">
              <header className="flex flex-col gap-2 border-b border-white/5 pb-8">
                <h3 className="text-2xl font-bold flex items-center gap-4">
                  <Shield className="text-crimson" size={28} />
                  Banish Echoes
                </h3>
                <p className="text-moonlit/30 text-xs uppercase tracking-[0.4em]">Silence unwanted resonances across the platform</p>
              </header>

              {isLoadingList ? (
                <div className="py-20 flex justify-center"><Loader2 className="animate-spin text-crimson w-8 h-8" /></div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {allPosts.map(post => (
                    <div key={post.id} className="glass p-6 rounded-[2rem] border border-white/5 flex items-start gap-6 hover:bg-white/[0.02] transition-colors group">
                      <div className="w-12 h-12 rounded-full bg-crimson/10 flex items-center justify-center flex-shrink-0 text-crimson/40">
                        <MessageSquare size={20} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <span className="font-bold text-moonlit text-sm">{post.profiles?.display_name || 'Lost Soul'}</span>
                            <span className="text-[10px] text-crimson font-black uppercase tracking-widest bg-crimson/5 px-2 py-0.5 rounded-full">{post.communities?.name}</span>
                            <span className="text-[10px] text-moonlit/20 font-bold tracking-tighter">{new Date(post.created_at).toLocaleString()}</span>
                          </div>
                          <button 
                            onClick={() => handleDelete('post', post.id)}
                            className="p-3 bg-crimson/5 hover:bg-crimson text-crimson hover:text-white rounded-2xl transition-all shadow-lg glow-crimson/10"
                            title="Banish Post"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                        <p className="text-sm text-moonlit/60 leading-relaxed italic border-l-2 border-crimson/20 pl-4 py-1">
                          "{post.content}"
                        </p>
                      </div>
                    </div>
                  ))}
                  {allPosts.length === 0 && (
                    <div className="py-20 text-center text-moonlit/10 flex flex-col items-center gap-4">
                      <Shield size={40} className="opacity-10" />
                      <p className="italic uppercase tracking-[0.5em] text-xs">The echoes are currently silent.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
