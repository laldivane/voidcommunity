"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth";
import { AudioPlayer } from "@/components/audio/AudioPlayer";

export function Providers({ children }: { children: React.ReactNode }) {
  const { checkAuth } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      useAuth.setState({
        user: session?.user || null,
        isAuthenticated: !!session,
        isLoading: false
      });
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [checkAuth]);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-void-bg flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-crimson/30 border-t-crimson rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <>
      {children}
      <AudioPlayer />
    </>
  );
}
