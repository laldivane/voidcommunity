-- Add is_featured column to tracks and albums
ALTER TABLE public.tracks ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT FALSE;
ALTER TABLE public.albums ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT FALSE;

-- Optional: Index for performance
CREATE INDEX IF NOT EXISTS idx_tracks_featured ON public.tracks(is_featured) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS idx_albums_featured ON public.albums(is_featured) WHERE is_featured = true;
