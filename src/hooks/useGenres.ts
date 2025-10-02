import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface Genre {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
  anime_genres?: {
    anime: {
      id: string;
      title: string;
      image_url?: string;
    };
  }[];
}

export function useGenres() {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Fetch all genres with linked anime
  const fetchGenres = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("genres")
        .select(`
          *,
          anime_genres (
            anime (
              id,
              title,
              image_url
            )
          )
        `)
        .order("name");

      if (error) throw error;
      setGenres(data as unknown as Genre[]);
    } catch (err) {
      console.error("Error fetching genres:", err);
      toast({
        title: "ข้อผิดพลาด",
        description: "ไม่สามารถโหลดข้อมูล Genres ได้",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Add a single genre
  const addGenre = async (name: string) => {
    try {
      const { data, error } = await supabase
        .from("genres")
        .insert([{ name: name.trim() }])
        .select()
        .single();

      if (error) {
        if ((error as any).code === "23505") {
          toast({
            title: "ข้อผิดพลาด",
            description: "Genre นี้มีอยู่แล้ว",
            variant: "destructive",
          });
          return null;
        }
        throw error;
      }

      setGenres((prev) =>
        [...prev, data].sort((a, b) => a.name.localeCompare(b.name))
      );
      toast({
        title: "สำเร็จ!",
        description: `เพิ่ม Genre "${name}" เรียบร้อยแล้ว`,
      });
      return data;
    } catch (error) {
      console.error("Error adding genre:", error);
      toast({
        title: "ข้อผิดพลาด",
        description: "ไม่สามารถเพิ่ม Genre ได้",
        variant: "destructive",
      });
      return null;
    }
  };

  // Delete a genre
  const deleteGenre = async (id: string, name: string) => {
    try {
      const { error } = await supabase.from("genres").delete().eq("id", id);
      if (error) throw error;

      setGenres((prev) => prev.filter((g) => g.id !== id));
      toast({
        title: "สำเร็จ!",
        description: `ลบ Genre "${name}" เรียบร้อยแล้ว`,
      });
      return true;
    } catch (error) {
      console.error("Error deleting genre:", error);
      toast({
        title: "ข้อผิดพลาด",
        description: "ไม่สามารถลบ Genre ได้",
        variant: "destructive",
      });
      return false;
    }
  };

  // Upsert multiple genres (used when creating/updating Anime)
  const updateGenresList = async (animeGenres: string[] = []) => {
    try {
      if (animeGenres.length === 0) return;

      const genresToUpsert = animeGenres.map((name) => ({ name }));

      const { error } = await supabase
        .from("genres")
        .upsert(genresToUpsert, { onConflict: "name", ignoreDuplicates: true });

      if (error) throw error;

      // Refresh genres state
      fetchGenres();
    } catch (err) {
      console.error("Error updating genres list:", err);
      toast({
        title: "ข้อผิดพลาด",
        description: "ไม่สามารถอัปเดต Genres ได้",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchGenres();
  }, []);

  return {
    genres,
    loading,
    addGenre,
    deleteGenre,
    refreshGenres: fetchGenres,
    updateGenresList,
  };
}
