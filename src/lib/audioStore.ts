import { create } from 'zustand';

export interface Track {
  id: number;
  title: string;
  artist: string;
  duration_seconds: number;
  audio_url: string;
  cover_url: string;
}

interface AudioState {
  currentTrack: Track | null;
  playlist: Track[];
  isPlaying: boolean;
  volume: number;
  progress: number; // in seconds
  
  // Actions
  playTrack: (track: Track) => void;
  setPlaylist: (tracks: Track[]) => void;
  togglePlayPause: () => void;
  setVolume: (vol: number) => void;
  setProgress: (prog: number) => void;
  playNext: () => void;
  playPrev: () => void;
}

export const useAudioStore = create<AudioState>((set, get) => ({
  currentTrack: null,
  playlist: [],
  isPlaying: false,
  volume: 1, // 0.0 to 1.0
  progress: 0,

  playTrack: (track: Track) => {
    set({ currentTrack: track, isPlaying: true, progress: 0 });
    // Log play event to Supabase
    import('./api').then(({ apiPlayTrack }) => {
      apiPlayTrack(track.id).catch(console.error);
    });
  },

  setPlaylist: (tracks: Track[]) => {
    set({ playlist: tracks });
  },

  togglePlayPause: () => {
    const { currentTrack, isPlaying } = get();
    if (!currentTrack) return;
    set({ isPlaying: !isPlaying });
  },

  setVolume: (vol: number) => {
    set({ volume: Math.max(0, Math.min(1, vol)) });
  },

  setProgress: (prog: number) => {
    set({ progress: prog });
  },

  playNext: () => {
    const { currentTrack, playlist } = get();
    if (!currentTrack || playlist.length === 0) return;
    
    const currentIndex = playlist.findIndex((t) => t.id === currentTrack.id);
    const nextIndex = (currentIndex + 1) % playlist.length;
    set({ currentTrack: playlist[nextIndex], isPlaying: true, progress: 0 });
  },

  playPrev: () => {
    const { currentTrack, playlist, progress } = get();
    if (!currentTrack || playlist.length === 0) return;
    
    // If we're more than 3 seconds in, just restart the track
    if (progress > 3) {
      set({ progress: 0 });
      return;
    }

    const currentIndex = playlist.findIndex((t) => t.id === currentTrack.id);
    const prevIndex = currentIndex - 1 < 0 ? playlist.length - 1 : currentIndex - 1;
    set({ currentTrack: playlist[prevIndex], isPlaying: true, progress: 0 });
  },
}));
