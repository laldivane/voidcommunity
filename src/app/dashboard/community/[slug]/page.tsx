"use client";

import { useEffect, useState, use } from 'react';
import { ArrowLeft, Send, MessageCircle } from 'lucide-react';
import { apiGetCommunity, apiGetPosts, apiCreatePost } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function CommunityDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { user } = useAuth();
  
  const [community, setCommunity] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [newPostContent, setNewPostContent] = useState('');
  const [isSubmitting, setIsLoadingSubmitting] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function loadCommunityAndPosts() {
      try {
        if (!slug) return;
        
        const commData = await apiGetCommunity(slug);
        if (mounted) setCommunity(commData);
        
        if (commData) {
          const postsData = await apiGetPosts(commData.id);
          if (mounted) setPosts(postsData);
        }
      } catch (err) {
        console.error("Failed to load community details", err);
      } finally {
        if (mounted) setIsLoading(false);
      }
    }

    loadCommunityAndPosts();

    const channel = supabase
      .channel(`community_posts_${slug}`)
      .on(
        'postgres_changes',
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'posts'
        },
        async (payload) => {
          if (community?.id && payload.new.community_id === community.id) {
            const postsData = await apiGetPosts(community.id);
            if (mounted) setPosts(postsData);
          }
        }
      )
      .subscribe();

    return () => {
      mounted = false;
      supabase.removeChannel(channel);
    };
  }, [slug, community?.id]);

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostContent.trim() || !community || !user) return;
    
    setIsLoadingSubmitting(true);
    try {
      const newPost = await apiCreatePost(community.id, newPostContent.trim());
      
      const postWithProfile = {
        ...newPost,
        profiles: {
          username: user.user_metadata?.username,
          display_name: user.user_metadata?.display_name,
          avatar_url: user.user_metadata?.avatar_url
        }
      };
      
      setPosts([postWithProfile, ...posts]);
      setNewPostContent('');
    } catch (err) {
      console.error("Failed to post:", err);
    } finally {
      setIsLoadingSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 overflow-y-auto scroll-smooth h-full flex items-center justify-center bg-void-bg text-moonlit">
        <div className="w-12 h-12 border-4 border-crimson/20 border-t-crimson rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!community) {
    return (
      <div className="flex-1 overflow-y-auto scroll-smooth h-full flex flex-col items-center justify-center p-8 text-center bg-void-bg">
        <MessageCircle size={48} className="text-moonlit/20 mb-4" />
        <h2 className="text-2xl font-bold font-display text-moonlit mb-2">Community Not Found</h2>
        <p className="text-moonlit/50 mb-6">This void doesn't seem to exist.</p>
        <Link href="/dashboard/community" className="text-crimson hover:text-crimson/80 flex items-center gap-2">
          <ArrowLeft size={16} /> Back to Hub
        </Link>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto scroll-smooth h-full flex flex-col bg-void-bg text-moonlit">
      <div className="sticky top-0 z-10 bg-void-bg/90 backdrop-blur-lg border-b border-void-border px-8 py-6">
        <div className="max-w-4xl mx-auto">
          <Link href="/dashboard/community" className="inline-flex items-center gap-2 text-sm text-moonlit/40 hover:text-crimson transition-colors mb-4">
            <ArrowLeft size={16} /> All Communities
          </Link>
          <div className="flex items-end justify-between">
            <div>
              <h1 className="text-3xl font-bold font-display text-moonlit mb-1">
                {community.name}
              </h1>
              <p className="text-sm text-moonlit/60 max-w-2xl">{community.description}</p>
            </div>
            <div className="text-xs font-semibold text-moonlit/40 bg-white/5 px-3 py-1.5 rounded-full">
              {community.member_count?.toLocaleString() || 0} members
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 max-w-4xl w-full mx-auto px-8 py-8 flex flex-col gap-8 pb-28">
        <div className="glass rounded-xl p-4 border border-void-border">
          <form onSubmit={handleCreatePost} className="flex gap-4">
            <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 glow-crimson bg-void-800">
              <img 
                src={user?.user_metadata?.avatar_url || "/lal-divane-avatar.png"} 
                alt="Me" 
                className="w-full h-full object-cover" 
              />
            </div>
            <div className="flex-1 relative">
              <textarea
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                placeholder="Share your thoughts with the void..."
                className="w-full bg-white/5 border border-transparent rounded-xl px-4 py-3 text-moonlit placeholder-moonlit/30 focus:outline-none focus:border-crimson/40 focus:bg-white/10 transition-all resize-none min-h-[50px] max-h-32"
                rows={2}
                disabled={isSubmitting}
              />
              <button 
                type="submit"
                disabled={!newPostContent.trim() || isSubmitting}
                className="absolute bottom-3 right-3 p-1.5 bg-crimson hover:bg-crimson/80 disabled:bg-crimson/30 text-white rounded-lg transition-colors"
              >
                {isSubmitting ? (
                   <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <Send size={16} />
                )}
              </button>
            </div>
          </form>
        </div>

        <div className="space-y-6">
          {posts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-moonlit/30">No voices here yet... Be the first to whisper.</p>
            </div>
          ) : (
            posts.map((post) => (
              <div key={post.id} className="glass rounded-xl p-5 border border-void-border hover:border-void-border/80 transition-colors">
                <div className="flex items-start gap-4">
                  <Link href={`/dashboard/profile/${post.profiles?.username}`} className="w-10 h-10 rounded-full overflow-hidden shrink-0 bg-void-800 hover:ring-2 ring-crimson/50 transition-all">
                    <img 
                      src={post.profiles?.avatar_url || "/lal-divane-avatar.png"} 
                      alt={post.profiles?.display_name || "User"} 
                      className="w-full h-full object-cover" 
                    />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-2 mb-1">
                      <Link href={`/dashboard/profile/${post.profiles?.username}`} className="font-bold text-moonlit hover:underline">
                        {post.profiles?.display_name || post.profiles?.username || 'Unknown'}
                      </Link>
                      <span className="text-xs text-moonlit/40">
                        @{post.profiles?.username}
                      </span>
                      <span className="text-xs text-moonlit/30 ml-auto">
                        {new Date(post.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-moonlit/80 whitespace-pre-wrap text-sm leading-relaxed">
                      {post.content}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
