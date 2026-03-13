"use client";

import { useState, useEffect } from 'react';
import { Music } from 'lucide-react';
import { apiGetActiveListeners } from '@/lib/api';
import { supabase } from '@/lib/supabase';

interface ActiveListener {
  username?: string;
  display_name?: string;
  avatar_url?: string;
  track_title?: string;
}

export function RightSidebar() {
  const [activeListeners, setActiveListeners] = useState<ActiveListener[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Use Supabase Realtime for listeners
  useEffect(() => {
    let mounted = true;

    async function fetchListeners() {
      try {
        const listeners = await apiGetActiveListeners();
        if (mounted) setActiveListeners(listeners);
      } catch (err) {
        console.error("Error fetching listeners", err);
      } finally {
        if (mounted) setIsLoading(false);
      }
    }

    fetchListeners();

    // Subscribe to changes in listening_activity
    const channel = supabase
      .channel('listening_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'listening_activity' },
        () => {
          fetchListeners(); // Re-fetch on any activity change
        }
      )
      .subscribe();

    return () => {
      mounted = false;
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="w-80 bg-void-900 border-l border-void-border p-6 flex flex-col h-full overflow-y-auto">
      {/* Lal Divane Artist Profile */}
      <div className="mb-8 text-center">
        <div className="relative w-24 h-24 mx-auto mb-4">
          <div className="w-full h-full rounded-full glow-crimson pulse-glow overflow-hidden border-2 border-crimson/30">
            <img
              src="/lal-divane-avatar.png"
              alt="Lal Divane"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        <h3 className="font-bold font-display text-moonlit text-lg mb-0.5">Lal Divane</h3>
        <p className="text-xs text-moonlit/40 mb-3 italic">"Where whispers turn to ash..."</p>

        <div className="flex gap-2">
          <div className="flex-1 glass rounded-lg py-2 text-center">
            <p className="text-sm font-bold text-crimson">12.4K</p>
            <p className="text-xs text-moonlit/40">Listeners</p>
          </div>
          <div className="flex-1 glass rounded-lg py-2 text-center">
            <p className="text-sm font-bold text-ember">8</p>
            <p className="text-xs text-moonlit/40">Tracks</p>
          </div>
        </div>
      </div>

      {/* Listeners — Now Listening */}
      <div>
        <h4 className="text-sm font-semibold text-moonlit/60 mb-4 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-crimson animate-pulse"></div>
          Listening Now
        </h4>
        
        {isLoading ? (
          <div className="flex justify-center py-4">
            <div className="w-6 h-6 border-2 border-crimson/30 border-t-crimson rounded-full animate-spin"></div>
          </div>
        ) : activeListeners.length === 0 ? (
          <p className="text-xs text-moonlit/40 text-center py-4">The void is silent...</p>
        ) : (
          <div className="space-y-3">
            {activeListeners.map((listener, index) => (
              <div key={index} className="flex items-center gap-3 p-2 rounded-lg hover:bg-crimson/5 transition-colors cursor-pointer group">
                <div className="profile-avatar now-listening relative w-10 h-10 rounded-full bg-linear-to-br from-crimson/60 to-blood/60 shrink-0 flex items-center justify-center overflow-hidden">
                  {listener.avatar_url ? (
                    <img src={listener.avatar_url} alt={listener.display_name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-xs font-bold text-moonlit">
                      {(listener.display_name || listener.username || 'V')[0].toUpperCase()}
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate text-moonlit">
                    {listener.display_name || listener.username || 'Anonymous'}
                  </p>
                  <p className="text-xs text-crimson/80 truncate flex items-center gap-1">
                    <Music size={10} />
                    {listener.track_title || 'Unknown sound'}
                  </p>
                </div>
                <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="w-0.5 bg-crimson rounded-full"
                      style={{
                        height: `${6 + i * 3}px`,
                        animation: 'audio-bar 0.6s ease-in-out infinite alternate',
                        animationDelay: `${i * 0.1}s`,
                      }}
                    ></div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
