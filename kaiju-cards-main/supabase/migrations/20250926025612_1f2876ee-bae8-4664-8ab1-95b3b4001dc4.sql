-- Create anime table
CREATE TABLE public.anime (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  image_url TEXT,
  genres TEXT[] DEFAULT '{}',
  publisher TEXT,
  first_aired DATE,
  format TEXT,
  description TEXT,
  popularity_score INTEGER DEFAULT 0,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create update schedule table for tracking daily updates
CREATE TABLE public.anime_updates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  anime_id UUID NOT NULL REFERENCES public.anime(id) ON DELETE CASCADE,
  update_date DATE NOT NULL DEFAULT CURRENT_DATE,
  episode_number INTEGER,
  update_type TEXT DEFAULT 'episode',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.anime ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.anime_updates ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (no auth required for front office)
CREATE POLICY "Allow public read access to anime" 
ON public.anime 
FOR SELECT 
USING (true);

CREATE POLICY "Allow public read access to anime_updates" 
ON public.anime_updates 
FOR SELECT 
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
NEW.updated_at = now();
RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_anime_updated_at
BEFORE UPDATE ON public.anime
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample anime data
INSERT INTO public.anime (title, image_url, genres, publisher, first_aired, format, description, popularity_score) VALUES 
('Attack on Titan', 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400', ARRAY['Action', 'Drama', 'Fantasy'], 'Kodansha', '2013-04-07', 'TV Series', 'Humans fight against giant humanoid Titans in a walled city.', 95),
('Demon Slayer', 'https://images.unsplash.com/photo-1620121692029-d088224ddc74?w=400', ARRAY['Action', 'Supernatural'], 'Shueisha', '2019-04-06', 'TV Series', 'A young boy becomes a demon slayer to save his sister.', 92),
('My Hero Academia', 'https://images.unsplash.com/photo-1626618012641-bfdf229e7b9d?w=400', ARRAY['Action', 'School', 'Superhero'], 'Shueisha', '2016-04-03', 'TV Series', 'In a world of superpowers, a boy without powers dreams of becoming a hero.', 88),
('One Piece', 'https://images.unsplash.com/photo-1543832923-44667a44c804?w=400', ARRAY['Action', 'Adventure', 'Comedy'], 'Shueisha', '1999-10-20', 'TV Series', 'A pirate crew searches for the ultimate treasure.', 90),
('Naruto', 'https://images.unsplash.com/photo-1613376023733-0a73315d9b06?w=400', ARRAY['Action', 'Martial Arts'], 'Shueisha', '2002-10-03', 'TV Series', 'A young ninja seeks recognition and dreams of becoming Hokage.', 87),
('Death Note', 'https://images.unsplash.com/photo-1596727147705-61a532a659bd?w=400', ARRAY['Thriller', 'Supernatural'], 'Shueisha', '2006-10-04', 'TV Series', 'A high school student finds a supernatural notebook.', 89),
('Dragon Ball Z', 'https://images.unsplash.com/photo-1578632767196-d6fd8a52b6c2?w=400', ARRAY['Action', 'Martial Arts'], 'Shueisha', '1989-04-26', 'TV Series', 'Goku and friends defend Earth from powerful enemies.', 86),
('Spirited Away', 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400', ARRAY['Adventure', 'Family', 'Fantasy'], 'Studio Ghibli', '2001-07-20', 'Movie', 'A girl enters a world ruled by gods and witches.', 93),
('Your Name', 'https://images.unsplash.com/photo-1534777410147-084a460870fc?w=400', ARRAY['Romance', 'Drama', 'Fantasy'], 'CoMix Wave Films', '2016-08-26', 'Movie', 'Two teenagers share a profound, magical connection.', 91),
('Akira', 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400', ARRAY['Action', 'Sci-Fi', 'Thriller'], 'Akira Committee', '1988-07-16', 'Movie', 'In a dystopian future, bikers battle against government forces.', 85);

-- Insert sample update data for current week
INSERT INTO public.anime_updates (anime_id, update_date, episode_number) 
SELECT id, CURRENT_DATE - (RANDOM() * 6)::INTEGER, (RANDOM() * 20 + 1)::INTEGER
FROM public.anime 
WHERE RANDOM() < 0.7;