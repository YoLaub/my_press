CREATE TABLE IF NOT EXISTS news (
  id           SERIAL PRIMARY KEY,
  title        TEXT NOT NULL,
  link         TEXT,
  description  TEXT,
  content      TEXT,
  image_url    TEXT,
  source       TEXT,
  published_at TIMESTAMPTZ,
  created_at   TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS news_published_at_idx
  ON news (published_at DESC NULLS LAST, created_at DESC);
