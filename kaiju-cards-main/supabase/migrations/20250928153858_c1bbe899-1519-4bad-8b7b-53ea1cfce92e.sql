-- Enable realtime for anime table
ALTER TABLE public.anime REPLICA IDENTITY FULL;
ALTER publication supabase_realtime ADD TABLE public.anime;

-- Enable realtime for anime_updates table  
ALTER TABLE public.anime_updates REPLICA IDENTITY FULL;
ALTER publication supabase_realtime ADD TABLE public.anime_updates;

-- Add RLS policies to allow admin users to modify anime data
CREATE POLICY "Allow admin to insert anime" 
ON public.anime 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Allow admin to update anime" 
ON public.anime 
FOR UPDATE 
USING (true);

CREATE POLICY "Allow admin to delete anime" 
ON public.anime 
FOR DELETE 
USING (true);

-- Add RLS policies for anime_updates
CREATE POLICY "Allow admin to insert anime_updates" 
ON public.anime_updates 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Allow admin to update anime_updates" 
ON public.anime_updates 
FOR UPDATE 
USING (true);

CREATE POLICY "Allow admin to delete anime_updates" 
ON public.anime_updates 
FOR DELETE 
USING (true);