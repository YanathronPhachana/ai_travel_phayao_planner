-- Accommodations: lodging per trip
CREATE TABLE IF NOT EXISTS accommodations (
  id TEXT PRIMARY KEY,
  trip_id TEXT NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  price_per_night REAL,
  check_in TEXT,
  check_out TEXT,
  total_cost REAL,
  address TEXT NOT NULL DEFAULT '',
  phone TEXT NOT NULL DEFAULT '',
  notes TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL,
  FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_accommodations_trip_id ON accommodations(trip_id);
