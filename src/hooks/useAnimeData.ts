import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface Anime {
  id: string;
  title: string;
  image_url?: string;
  genres?: string[];
  publisher?: string;
  first_aired?: string;
  format?: string;
  description?: string;
  popularity_score?: number;
  last_updated?: string;
  created_at?: string;
  updated_at?: string;
}

export interface AnimeUpdate {
  id: string;
  anime_id: string;
  update_date: string;
  episode_number?: number;
  update_type: string;
  anime?: Anime;
}

export interface AnimeFormData {
  title: string;
  image_url?: string | null;
  genres?: string[];
  publisher?: string | null;
  first_aired?: string | null;
  format?: string | null;
  description?: string | null;
  popularity_score?: number;
}

export function useAnimeData() {
  const [animeList, setAnimeList] = useState<Anime[]>([]);
  const [recentUpdates, setRecentUpdates] = useState<AnimeUpdate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAnimeData();
    const cleanup = setupRealtimeSubscriptions();
    return cleanup;
  }, []);

  const setupRealtimeSubscriptions = () => {
    const animeChannel = supabase
      .channel("anime-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "anime" },
        () => fetchAnimeData()
      )
      .subscribe();

    const updatesChannel = supabase
      .channel("updates-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "anime_updates" },
        () => fetchAnimeData()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(animeChannel);
      supabase.removeChannel(updatesChannel);
    };
  };

  const fetchAnimeData = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: anime, error: animeError } = await supabase
        .from("anime")
        .select("*")
        .order("popularity_score", { ascending: false });
      if (animeError) throw animeError;

      const { data: updates, error: updatesError } = await supabase
        .from("anime_updates")
        .select(`
          *,
          anime:anime_id (
            id,
            title,
            image_url,
            genres,
            publisher,
            description
          )
        `)
        .gte(
          "update_date",
          new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split("T")[0]
        )
        .order("update_date", { ascending: false });
      if (updatesError) throw updatesError;

      setAnimeList(anime || []);
      setRecentUpdates(updates || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "เกิดข้อผิดพลาด");
      console.error("Error fetching anime data:", err);
    } finally {
      setLoading(false);
    }
  };

  // --- Admin functions ---

 const updateGenresList = async (animeGenres: string[] = []) => {
  try {
    if (animeGenres.length === 0) return;
    const genresToUpsert: { name: string; created_at?: string; id?: string; updated_at?: string }[] =
      animeGenres.map((name) => ({ name }));
    const { error } = await supabase
      .from("genres")
      .upsert(genresToUpsert, { onConflict: "name", ignoreDuplicates: true }); // <-- เปลี่ยนตรงนี้
    if (error) throw error;
  } catch (err) {
    console.error("Error updating genres list:", err);
  }
};

  const createAnime = async (animeData: AnimeFormData) => {
    try {
      const { data, error } = await supabase
        .from("anime")
        .insert([animeData])
        .select()
        .single();
      if (error) throw error;

      if (animeData.genres) {
        await updateGenresList(animeData.genres);
      }

      return { data, error: null };
    } catch (error) {
      console.error("Error creating anime:", error);
      return { data: null, error };
    }
  };

  const updateAnime = async (id: string, animeData: Partial<AnimeFormData>) => {
    try {
      const { data, error } = await supabase
        .from("anime")
        .update(animeData)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;

      if (animeData.genres) {
        await updateGenresList(animeData.genres);
      }

      return { data, error: null };
    } catch (error) {
      console.error("Error updating anime:", error);
      return { data: null, error };
    }
  };

  const deleteAnime = async (id: string) => {
    try {
      const { error } = await supabase.from("anime").delete().eq("id", id);
      if (error) throw error;
      return { error: null };
    } catch (error) {
      console.error("Error deleting anime:", error);
      return { error };
    }
  };

  const createAnimeUpdate = async (updateData: {
    anime_id: string;
    update_date: string;
    episode_number?: number;
    update_type?: string;
  }) => {
    try {
      const { data, error } = await supabase
        .from("anime_updates")
        .insert([updateData])
        .select()
        .single();
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error("Error creating anime update:", error);
      return { data: null, error };
    }
  };

  const getAnimeById = (id: string) => {
    return animeList.find((anime) => anime.id === id);
  };

  const getPopularAnime = (limit = 10) => {
    return animeList
      .sort((a, b) => (b.popularity_score || 0) - (a.popularity_score || 0))
      .slice(0, limit);
  };

  const getTodayUpdates = () => {
    const today = new Date().toISOString().split("T")[0];
    return recentUpdates.filter((update) => update.update_date === today);
  };

  const getUpdatesByDay = () => {
    const days = ["Su", "M", "Tu", "W", "Th", "F", "Sa"];
    const updatesByDay: { [key: string]: AnimeUpdate[] } = {};
    days.forEach((day) => (updatesByDay[day] = []));
    recentUpdates.forEach((update) => {
      const date = new Date(update.update_date);
      const dayName = days[date.getDay()];
      updatesByDay[dayName].push(update);
    });
    return updatesByDay;
  };

  const searchAnime = (query: string, genres?: string[]) => {
    let filtered = animeList;
    if (query.trim()) {
      filtered = filtered.filter(
        (anime) =>
          anime.title.toLowerCase().includes(query.toLowerCase()) ||
          anime.description?.toLowerCase().includes(query.toLowerCase()) ||
          anime.publisher?.toLowerCase().includes(query.toLowerCase())
      );
    }
    if (genres && genres.length > 0) {
      filtered = filtered.filter((anime) =>
        anime.genres?.some((genre) => genres.includes(genre))
      );
    }
    return filtered;
  };

  const getAllGenres = () => {
    const genresSet = new Set<string>();
    animeList.forEach((anime) => {
      anime.genres?.forEach((genre) => genresSet.add(genre));
    });
    return Array.from(genresSet).sort();
  };

  return {
    animeList,
    recentUpdates,
    loading,
    error,
    getPopularAnime,
    getTodayUpdates,
    getUpdatesByDay,
    searchAnime,
    getAllGenres,
    getAnimeById,
    createAnime,
    updateAnime,
    deleteAnime,
    createAnimeUpdate,
    refetch: fetchAnimeData,
  };
}
