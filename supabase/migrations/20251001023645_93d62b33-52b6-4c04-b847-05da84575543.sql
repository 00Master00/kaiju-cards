-- สร้างตาราง genres สำหรับเก็บข้อมูล genres
CREATE TABLE IF NOT EXISTS public.genres (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL UNIQUE,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.genres ENABLE ROW LEVEL SECURITY;

-- สร้าง policies สำหรับ genres
CREATE POLICY "Allow public read access to genres"
  ON public.genres
  FOR SELECT
  USING (true);

CREATE POLICY "Allow admin to insert genres"
  ON public.genres
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow admin to update genres"
  ON public.genres
  FOR UPDATE
  USING (true);

CREATE POLICY "Allow admin to delete genres"
  ON public.genres
  FOR DELETE
  USING (true);

-- สร้าง trigger สำหรับ updated_at
CREATE TRIGGER update_genres_updated_at
  BEFORE UPDATE ON public.genres
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- เพิ่ม initial genres
INSERT INTO public.genres (name) VALUES
  ('Action'),
  ('Adventure'),
  ('Comedy'),
  ('Drama'),
  ('Fantasy'),
  ('Horror'),
  ('Mystery'),
  ('Romance'),
  ('Sci-Fi'),
  ('Supernatural'),
  ('Thriller'),
  ('Historical'),
  ('Sports'),
  ('Music'),
  ('School'),
  ('Military'),
  ('Mecha')
ON CONFLICT (name) DO NOTHING;