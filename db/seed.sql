PRAGMA foreign_keys = ON;

DROP TABLE IF EXISTS trails;
DROP TABLE IF EXISTS regions;

CREATE TABLE regions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  country TEXT NOT NULL,
  description TEXT
);

CREATE TABLE trails (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  region_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('easy', 'moderate', 'hard')),
  distance_km REAL NOT NULL,
  description TEXT,
  image_url TEXT,
  created_at INTEGER NOT NULL,
  FOREIGN KEY (region_id) REFERENCES regions(id)
);

INSERT INTO regions (name, slug, country, description) VALUES
  ('Bavarian Alps', 'bavarian-alps', 'Germany', 'A stretch of the Northern Limestone Alps shared with Austria, known for limestone peaks and alpine meadows.'),
  ('Scottish Highlands', 'scottish-highlands', 'United Kingdom', 'A mountainous region covering the northern half of Scotland, full of glens, lochs, and coastal moors.'),
  ('Dolomites', 'dolomites', 'Italy', 'A range in the eastern Italian Alps recognised by UNESCO for its pale, jagged peaks and via ferrata routes.');

INSERT INTO trails (region_id, title, slug, difficulty, distance_km, description, image_url, created_at) VALUES
  (1, 'Partnach Gorge Loop', 'partnach-gorge-loop', 'easy', 4.2, '<p>A short walk through a deeply cut limestone gorge near Garmisch-Partenkirchen. Stays close to river level and is well-shaded throughout.</p>', 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b', 1730000000),
  (1, 'Zugspitze via Reintal', 'zugspitze-via-reintal', 'hard', 21.0, '<p>The classic ascent of the Zugspitze from the Bavarian side. Long valley approach followed by a steep climb past the Knorrhuette.</p>', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4', 1731000000),
  (2, 'Old Man of Storr', 'old-man-of-storr', 'moderate', 3.8, '<p>A steep path on the Trotternish ridge of Skye that climbs to one of the most photographed rock pinnacles in Scotland.</p>', 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee', 1732000000),
  (2, 'Ben Nevis Mountain Track', 'ben-nevis-mountain-track', 'hard', 17.0, '<p>The standard route up the highest mountain in the British Isles. A long sustained climb that should not be underestimated in poor weather.</p>', 'https://images.unsplash.com/photo-1454942901704-3c44c11b2ad1', 1733000000),
  (3, 'Tre Cime di Lavaredo Loop', 'tre-cime-di-lavaredo-loop', 'moderate', 10.0, '<p>A circular hike around the three iconic peaks. Mostly on well-graded paths with continuously changing views of the rock walls.</p>', 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b', 1734000000),
  (3, 'Seceda Ridgeline', 'seceda-ridgeline', 'easy', 6.5, '<p>An easy walk along an exposed grassy ridge above Ortisei with sweeping views of the Odle group. Reachable by cable car.</p>', 'https://images.unsplash.com/photo-1519681393784-d120267933ba', 1735000000);
