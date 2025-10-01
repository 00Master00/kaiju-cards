import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface Genre {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
}

export function useGenres() {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchGenres = async () => {
    try {
      const { data, error } = await supabase
        .from('genres')
        .select('*')
        .order('name');

      if (error) throw error;
      setGenres(data || []);
    } catch (error) {
      console.error('Error fetching genres:', error);
      toast({
        title: "ข้อผิดพลาด",
        description: "ไม่สามารถโหลดข้อมูล Genres ได้",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const addGenre = async (name: string) => {
    try {
      const { data, error } = await supabase
        .from('genres')
        .insert([{ name: name.trim() }])
        .select()
        .single();

      if (error) {
        if (error.code === '23505') {
          toast({
            title: "ข้อผิดพลาด",
            description: "Genre นี้มีอยู่ในระบบแล้ว",
            variant: "destructive"
          });
          return null;
        }
        throw error;
      }

      setGenres(prev => [...prev, data].sort((a, b) => a.name.localeCompare(b.name)));
      toast({
        title: "สำเร็จ!",
        description: `เพิ่ม Genre "${name}" เรียบร้อยแล้ว`,
      });
      return data;
    } catch (error) {
      console.error('Error adding genre:', error);
      toast({
        title: "ข้อผิดพลาด",
        description: "ไม่สามารถเพิ่ม Genre ได้",
        variant: "destructive"
      });
      return null;
    }
  };

  const deleteGenre = async (id: string, name: string) => {
    try {
      const { error } = await supabase
        .from('genres')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setGenres(prev => prev.filter(g => g.id !== id));
      toast({
        title: "สำเร็จ!",
        description: `ลบ Genre "${name}" เรียบร้อยแล้ว`,
      });
      return true;
    } catch (error) {
      console.error('Error deleting genre:', error);
      toast({
        title: "ข้อผิดพลาด",
        description: "ไม่สามารถลบ Genre ได้",
        variant: "destructive"
      });
      return false;
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
    refreshGenres: fetchGenres
  };
}
