import { useEffect, useRef } from 'react';
import { useAudioStore } from './audioStore';
import { apiPlayTrack } from './api';
import { useAuth } from './auth';

export function useAudioPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const {
    currentTrack,
    isPlaying,
    volume,
    setProgress,
    playNext
  } = useAudioStore();

  const { isAuthenticated } = useAuth();
  
  // Track reporting ref to avoid multiple API calls for the same play
  const reportedTrackId = useRef<number | null>(null);

  // Initialize audio element once
  useEffect(() => {
    if (!audioRef.current) {
      const audio = new Audio();
      audioRef.current = audio;

      // Event Listeners
      audio.addEventListener('timeupdate', () => {
        setProgress(audio.currentTime);
      });

      audio.addEventListener('ended', () => {
        playNext();
      });
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
    };
  }, [setProgress, playNext]);

  // Handle track changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;

    // Use a placeholder audio logic if no real URL is provided in db for now.
    // In a real app we would strictly use currentTrack.audio_url
    const audioSrc = currentTrack.audio_url || 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';

    if (audio.src !== audioSrc) {
      audio.src = audioSrc;
      audio.load();
    }

    if (isPlaying) {
      audio.play().catch(e => console.error("Audio play failed:", e));
      
      // API call to report listen ONLY IF changed track
      if (reportedTrackId.current !== currentTrack.id) {
        reportedTrackId.current = currentTrack.id;
        // Optional Auth play (increments global play count, and starts user listening session if authenticated)
        apiPlayTrack(currentTrack.id).catch(console.error);
      }
    } else {
      audio.pause();
    }
  }, [currentTrack, isPlaying, isAuthenticated]);

  // Handle volume changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Expose a method for manual seeking
  const seek = (time: number) => {
    if (audioRef.current && currentTrack) {
      const targetTime = Math.max(0, Math.min(time, currentTrack.duration_seconds));
      audioRef.current.currentTime = targetTime;
      setProgress(targetTime);
    }
  };

  return { seek };
}
