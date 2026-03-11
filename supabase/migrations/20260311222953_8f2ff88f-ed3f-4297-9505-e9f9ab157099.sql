ALTER TABLE posts ADD COLUMN IF NOT EXISTS song_title text;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS song_artist text;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS interests text[] DEFAULT '{}'::text[];