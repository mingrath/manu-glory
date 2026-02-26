CREATE TABLE votes (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  match_id   TEXT NOT NULL,
  vote       TEXT NOT NULL CHECK (vote IN ('yes', 'no')),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_votes_match ON votes(match_id);

-- Enable Row Level Security
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts (public voting)
CREATE POLICY "Allow anonymous inserts" ON votes
  FOR INSERT TO anon
  WITH CHECK (true);

-- Allow anonymous reads (public vote counts)
CREATE POLICY "Allow anonymous reads" ON votes
  FOR SELECT TO anon
  USING (true);
