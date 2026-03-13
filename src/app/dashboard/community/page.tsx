"use client";

import { useEffect, useState } from 'react';
import { Users, ChevronRight, MessageSquare } from 'lucide-react';
import { apiGetCommunities } from '@/lib/api';
import Link from 'next/link';

export default function CommunityHubPage() {
  const [communities, setCommunities] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadCommunities() {
      try {
        const data = await apiGetCommunities();
        setCommunities(data);
      } catch (err) {
        console.error("Failed to load communities", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadCommunities();
  }, []);

  if (isLoading) {
    return (
      <div className="flex-1 overflow-y-auto scroll-smooth h-full flex items-center justify-center bg-void-bg text-moonlit">
        <div className="w-12 h-12 border-4 border-crimson/20 border-t-crimson rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto scroll-smooth h-full p-8 lg:p-12 bg-void-bg text-moonlit">
      <div className="max-w-5xl mx-auto">
        <header className="mb-12 text-center lg:text-left">
          <h1 className="text-4xl lg:text-5xl font-bold font-display text-moonlit mb-4 drop-shadow-lg">
            Community <span className="text-crimson">Hub</span>
          </h1>
          <p className="text-moonlit/60 max-w-2xl text-lg">
            Join the whispers in the dark. Connect with other souls, share your thoughts, and dive deep into the void of Lal Divane's lore.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {communities.map((community, i) => (
            <Link 
              href={`/dashboard/community/${community.slug}`} 
              key={community.id}
              className="group glass rounded-2xl p-6 hover-lift border border-void-border hover:border-crimson/30 transition-all flex flex-col h-full"
            >
              <div 
                className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 
                  ${i % 3 === 0 ? 'bg-crimson/20 text-crimson' : i % 3 === 1 ? 'bg-blood/20 text-blood' : 'bg-accent-purple/20 text-accent-purple'}
                `}
              >
                <MessageSquare size={28} />
              </div>
              
              <h3 className="text-xl font-bold font-display text-moonlit mb-2 group-hover:text-crimson transition-colors">
                {community.name}
              </h3>
              
              <p className="text-sm text-moonlit/50 mb-6 flex-1 line-clamp-3">
                {community.description}
              </p>
              
              <div className="flex items-center justify-between mt-auto pt-4 border-t border-void-border/50">
                <span className="text-xs font-semibold text-moonlit/40 flex items-center gap-1.5">
                  <Users size={14} />
                  {community.member_count?.toLocaleString() || 0} members
                </span>
                <ChevronRight size={16} className="text-moonlit/30 group-hover:text-crimson group-hover:-translate-x-1 transition-all" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
