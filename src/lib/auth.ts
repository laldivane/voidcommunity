import { create } from 'zustand';
import { supabase } from './supabase';
import type { User } from '@supabase/supabase-js';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  
  checkAuth: () => Promise<void>;
  logout: () => Promise<void>;
  // login/register functions are often handled directly in modals now since Supabase returns errors natively,
  // but we can expose a few helpers if we want, though simpler to just react to onAuthStateChange.
}

export const useAuth = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isAdmin: false,
  isLoading: true, // Start loading

  logout: async () => {
    set({ isLoading: true });
    await supabase.auth.signOut();
    set({ user: null, isAuthenticated: false, isAdmin: false, isLoading: false });
  },

  checkAuth: async () => {
    // Note: Supabase onAuthStateChange in App.tsx typically handles this better,
    // but we can initialize here.
    const { data: { session } } = await supabase.auth.getSession();
    
    set({ 
      user: session?.user || null, 
      isAuthenticated: !!session, 
      isAdmin: session?.user?.email === 'laldivanemusic@gmail.com',
      isLoading: false 
    });
  },
}));

// Initialize the event listener outside the store to update it automatically
supabase.auth.onAuthStateChange((_event, session) => {
  useAuth.setState({
    user: session?.user || null,
    isAuthenticated: !!session,
    isAdmin: session?.user?.email === 'laldivanemusic@gmail.com',
    isLoading: false
  });
});
