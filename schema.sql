CREATE TABLE IF NOT EXISTS news (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  title        TEXT NOT NULL,
  link         TEXT,
  description  TEXT,
  content      TEXT,
  image_url    TEXT,
  source       TEXT,
  published_at DATETIME,
  created_at   DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX news_published_at_idx (published_at DESC, created_at DESC)
);
