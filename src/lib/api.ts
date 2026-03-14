import { supabase } from './supabase';
import type { Track } from './audioStore';

/**
 * Frontend API client layer migrating from Express fetch to Supabase direct client calls.
 */

// ═══════════ TRACKS ═══════════

export async function apiGetTracks(): Promise<Track[]> {
  const { data, error } = await supabase
    .from('tracks')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching tracks:', error);
    return [];
  }
  return data || [];
}

export async function apiGetTrack(id: number) {
  const { data, error } = await supabase
    .from('tracks')
    .select('*')
    .eq('id', id)
    .maybeSingle();
    
  if (error) throw error;
  return data;
}

export async function apiLikeTrack(id: number) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  // Check if liked
  const { data: existing } = await supabase
    .from('favorites')
    .select('*')
    .eq('user_id', user.id)
    .eq('track_id', id)
    .maybeSingle();

  if (existing) {
    // Delete like
    await supabase.from('favorites').delete().eq('user_id', user.id).eq('track_id', id);
    return { liked: false };
  } else {
    // Add like
    await supabase.from('favorites').insert([{ user_id: user.id, track_id: id }]);
    return { liked: true };
  }
}

export async function apiPlayTrack(id: number) {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (user) {
    // Mark previous as disconnected
    await supabase
      .from('listening_activity')
      .update({ is_active: false })
      .eq('user_id', user.id)
      .eq('is_active', true);

    // Insert new
    await supabase
      .from('listening_activity')
      .insert([{ user_id: user.id, track_id: id, is_active: true }]);
  }
  return { success: true };
}

// ═══════════ USERS ═══════════

export async function apiGetUser(id: string) {
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', id)
    .maybeSingle();
    
  if (error) throw error;

  // Get favorites
  const { data: favorites, error: favError } = await supabase
    .from('favorites')
    .select('*, tracks(*)')
    .eq('user_id', id);
    
  if (favError) throw favError;

  return { ...profile, favorites: favorites.map(f => f.tracks) };
}

export async function apiGetListeningStatus(id: string) {
  const { data, error } = await supabase
    .from('listening_activity')
    .select('*, tracks(*)')
    .eq('user_id', id)
    .eq('is_active', true)
    .order('started_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error || !data) return { isListening: false };
  return { isListening: true, track: { ...data, ...data.tracks } };
}

export async function apiGetActiveListeners() {
  const { data, error } = await supabase
    .from('listening_activity')
    .select('*, profiles(username, display_name, avatar_url), tracks(title)')
    .eq('is_active', true)
    .order('started_at', { ascending: false })
    .limit(20);

  if (error) return [];
  
  return data.map(item => ({
    username: item.profiles?.username,
    display_name: item.profiles?.display_name,
    avatar_url: item.profiles?.avatar_url,
    track_title: item.tracks?.title,
    started_at: item.started_at,
  }));
}

// ═══════════ COMMUNITIES ═══════════

export async function apiGetCommunities() {
  const { data, error } = await supabase
    .from('communities')
    .select('*')
    .order('member_count', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function apiCreateCommunity(community: { name: string; slug: string; description: string; cover_url?: string }) {
  const { data, error } = await supabase.from('communities').insert([community]).select().maybeSingle();
  if (error) throw error;
  return data;
}

export async function apiUpdateCommunity(id: number, community: Partial<{ name: string; slug: string; description: string; cover_url: string }>) {
  const { data, error } = await supabase.from('communities').update(community).eq('id', id).select().maybeSingle();
  if (error) throw error;
  return data;
}

export async function apiDeleteCommunity(id: number) {
  const { error } = await supabase.from('communities').delete().eq('id', id);
  if (error) throw error;
  return { success: true };
}

export async function apiGetCommunity(slug: string) {
  const { data, error } = await supabase
    .from('communities')
    .select('*')
    .eq('slug', slug)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function apiGetPosts(communityId: number) {
  const { data, error } = await supabase
    .from('posts')
    .select('*, profiles(username, display_name, avatar_url)')
    .eq('community_id', communityId)
    .order('created_at', { ascending: false })
    .limit(50);
  if (error) throw error;
  return data || [];
}

export async function apiCreatePost(communityId: number, content: string) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('posts')
    .insert([{ community_id: communityId, user_id: user.id, content }])
    .select()
    .single();
    
  if (error) throw error;
  return data;
}

export async function apiAdminDeletePost(postId: number) {
  const { error } = await supabase.from('posts').delete().eq('id', postId);
  if (error) throw error;
  return { success: true };
}

export async function apiGetAllPosts() {
  const { data, error } = await supabase
    .from('posts')
    .select('*, profiles(username, display_name), communities(name)')
    .order('created_at', { ascending: false })
    .limit(100);
  if (error) throw error;
  return data || [];
}

// ═══════════ ALBUMS ═══════════

export async function apiGetAlbums() {
  const { data, error } = await supabase
    .from('albums')
    .select('*')
    .order('release_date', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function apiGetAlbum(id: number) {
  const { data, error } = await supabase
    .from('albums')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function apiGetTracksByAlbum(albumId: number) {
  const { data, error } = await supabase
    .from('tracks')
    .select('*')
    .eq('album_id', albumId)
    .order('created_at', { ascending: true });
  if (error) throw error;
  return data || [];
}

// ═══════════ ADMIN ACTIONS ═══════════

export async function apiCreateAlbum(album: {
  title: string;
  artist: string;
  description: string;
  cover_url: string;
  release_date: string;
}) {
  const { data, error } = await supabase
    .from('albums')
    .insert([album])
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function apiCreateTrack(track: {
  title: string;
  artist: string;
  album_id: number | null;
  duration_seconds: number;
  audio_url: string;
  cover_url: string;
}) {
  const { data, error } = await supabase
    .from('tracks')
    .insert([track])
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function apiUpdateAlbum(id: number, album: Partial<{
  title: string;
  artist: string;
  description: string;
  cover_url: string;
  release_date: string;
  is_featured?: boolean;
}>) {
  const { data, error } = await supabase
    .from('albums')
    .update(album)
    .eq('id', id)
    .select()
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function apiDeleteAlbum(id: number) {
  const { error } = await supabase
    .from('albums')
    .delete()
    .eq('id', id);
  if (error) throw error;
  return { success: true };
}

export async function apiUpdateTrack(id: number, track: Partial<{
  title: string;
  artist: string;
  album_id: number | null;
  duration_seconds: number;
  audio_url: string;
  cover_url: string;
  is_featured?: boolean;
}>) {
  const { data, error } = await supabase
    .from('tracks')
    .update(track)
    .eq('id', id)
    .select()
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function apiDeleteTrack(id: number) {
  const { error } = await supabase
    .from('tracks')
    .delete()
    .eq('id', id);
  if (error) throw error;
  return { success: true };
}

export async function apiSetFeatured(type: 'track' | 'album', id: number) {
  const table = type === 'track' ? 'tracks' : 'albums';
  
  // Unset all others globally to ensure 1 hero
  await Promise.all([
    supabase.from('tracks').update({ is_featured: false }),
    supabase.from('albums').update({ is_featured: false })
  ]);

  const { data, error } = await supabase
    .from(table)
    .update({ is_featured: true })
    .eq('id', id)
    .select()
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function apiGetFeaturedContent() {
  const { data: track } = await supabase.from('tracks').select('*').eq('is_featured', true).maybeSingle();
  if (track) return { type: 'track', data: track };
  
  const { data: album } = await supabase.from('albums').select('*').eq('is_featured', true).maybeSingle();
  if (album) return { type: 'album', data: album };
  
  return null;
}
