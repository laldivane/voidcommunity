import { Volume2, Heart, SkipBack, Play, Pause, SkipForward } from 'lucide-react';
import { useAudioStore } from '../../lib/audioStore';
import { useAudioPlayer } from '../../lib/useAudioPlayer';

export function AudioPlayer() {
  const { 
    currentTrack, 
    isPlaying, 
    progress, 
    togglePlayPause, 
    playNext, 
    playPrev 
  } = useAudioStore();

  const { seek } = useAudioPlayer();

  if (!currentTrack) {
    return null; // Don't show player if nothing is playing
  }

  const formatTime = (timeInSeconds: number) => {
    const m = Math.floor(timeInSeconds / 60);
    const s = Math.floor(timeInSeconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const progressPercent = currentTrack.duration_seconds > 0 
    ? (progress / currentTrack.duration_seconds) * 100 
    : 0;

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    seek(percentage * currentTrack.duration_seconds);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 h-20 bg-void-900/95 backdrop-blur-xl border-t border-void-border flex items-center px-8 z-20">
      <div className="flex items-center gap-6 flex-1">
        {/* Track Info */}
        <div className="flex items-center gap-3 w-56 shrink-0">
          <div className="w-12 h-12 rounded-lg overflow-hidden glow-crimson shrink-0">
            <img 
              src={currentTrack.cover_url || "/lal-divane-avatar.png"} 
              alt={currentTrack.title} 
              className="w-full h-full object-cover" 
            />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-moonlit truncate">{currentTrack.title}</p>
            <p className="text-xs text-moonlit/40 truncate">{currentTrack.artist}</p>
          </div>
        </div>

        {/* Audio Visualization - pulse based on real playing state */}
        <div className="flex items-center gap-1 h-8">
          {[1,2,3,4,5].map((i, index) => (
            <div
              key={i}
              className="w-1 bg-linear-to-t from-crimson to-ember rounded-full transition-all duration-300"
              style={{
                height: isPlaying ? `${[60, 80, 40, 90, 50][index]}%` : '20%',
                animation: isPlaying
                  ? `audio-bar 0.8s ease-in-out ${i * 0.1}s infinite alternate`
                  : 'none',
              }}
            ></div>
          ))}
        </div>

        {/* Controls */}
        <div className="flex items-center gap-4">
          <button onClick={playPrev} className="text-moonlit/40 hover:text-moonlit transition-colors">
            <SkipBack size={20} />
          </button>
          <button
            onClick={togglePlayPause}
            className="w-10 h-10 rounded-full bg-linear-to-r from-crimson to-blood hover:from-crimson/80 hover:to-blood/80 flex items-center justify-center transition-colors glow-crimson"
          >
            {isPlaying ? <Pause size={18} className="text-white" /> : <Play size={18} className="ml-0.5 text-white" />}
          </button>
          <button onClick={playNext} className="text-moonlit/40 hover:text-moonlit transition-colors">
            <SkipForward size={20} />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="flex-1 max-w-md">
          <div className="flex items-center gap-2">
            <span className="text-xs text-moonlit/30 w-10 text-right">{formatTime(progress)}</span>
            <div 
              className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden cursor-pointer group"
              onClick={handleSeek}
            >
              <div 
                className="h-full bg-linear-to-r from-crimson to-ember rounded-full group-hover:from-ember group-hover:to-crimson transition-all"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
            <span className="text-xs text-moonlit/30 w-10">{formatTime(currentTrack.duration_seconds)}</span>
          </div>
        </div>

        {/* Volume & Actions */}
        <div className="flex items-center gap-4">
          <button className="text-moonlit/30 hover:text-crimson transition-colors">
            <Heart size={18} />
          </button>
          <button className="text-moonlit/30 hover:text-moonlit transition-colors flex items-center gap-2">
            <Volume2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
