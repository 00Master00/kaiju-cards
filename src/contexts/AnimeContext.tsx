import { createContext, useContext, useState, ReactNode } from 'react';

export interface Anime {
  id: number;
  title: string;
  titleJapanese: string;
  description?: string;
  genre: string[];
  rating: number;
  episodes: number;
  status: string;
  year: number;
  studio: string;
  image: string;
}

export interface Activity {
  id: number;
  type: 'add' | 'update' | 'delete';
  animeTitle: string;
  timestamp: Date;
  description: string;
}

interface AnimeContextType {
  animeList: Anime[];
  activities: Activity[];
  addAnime: (anime: Omit<Anime, 'id'>) => void;
  updateAnime: (id: number, anime: Partial<Anime>) => void;
  deleteAnime: (id: number) => void;
  getAnimeById: (id: number) => Anime | undefined;
}

const AnimeContext = createContext<AnimeContextType | undefined>(undefined);

const initialAnimeData: Anime[] = [
  {
    id: 1,
    title: "Attack on Titan",
    titleJapanese: "進撃の巨人",
    description: "เรื่องราวของมนุษย์ที่ต้องต่อสู้กับยักษ์ที่กินคนเพื่อความอยู่รอด",
    genre: ["Action", "Drama", "Fantasy"],
    rating: 9.0,
    episodes: 75,
    status: "Completed",
    year: 2013,
    studio: "Mappa",
    image: "/placeholder.svg"
  },
  {
    id: 2,
    title: "Demon Slayer",
    titleJapanese: "鬼滅の刃",
    description: "การผจญภัยของ Tanjiro ในการกลายเป็นนักฆ่าปีศาจเพื่อช่วยน้องสาว",
    genre: ["Action", "Supernatural", "Historical"],
    rating: 8.7,
    episodes: 32,
    status: "Ongoing",
    year: 2019,
    studio: "Ufotable",
    image: "/placeholder.svg"
  },
  {
    id: 3,
    title: "Your Name",
    titleJapanese: "君の名は",
    description: "เรื่องราวรักโรแมนติกระหว่างชายหญิงที่สลับร่างกัน",
    genre: ["Romance", "Drama", "Fantasy"],
    rating: 8.4,
    episodes: 1,
    status: "Movie",
    year: 2016,
    studio: "CoMix Wave Films",
    image: "/placeholder.svg"
  },
  {
    id: 4,
    title: "One Piece",
    titleJapanese: "ワンピース",
    description: "การผจญภัยของ Monkey D. Luffy และลูกเรือในการค้นหา One Piece",
    genre: ["Action", "Adventure", "Comedy"],
    rating: 8.9,
    episodes: 1000,
    status: "Ongoing",
    year: 1999,
    studio: "Toei Animation",
    image: "/placeholder.svg"
  }
];

export function AnimeProvider({ children }: { children: ReactNode }) {
  const [animeList, setAnimeList] = useState<Anime[]>(initialAnimeData);
  const [activities, setActivities] = useState<Activity[]>([
    {
      id: 1,
      type: 'add',
      animeTitle: 'Jujutsu Kaisen Season 2',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      description: 'ถูกเพิ่มเข้าระบบ'
    },
    {
      id: 2,
      type: 'update',
      animeTitle: 'One Piece',
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
      description: 'มีการอัปเดตจำนวนตอน'
    },
    {
      id: 3,
      type: 'delete',
      animeTitle: 'Test Anime',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      description: 'ถูกลบออกจากระบบ'
    }
  ]);

  const addAnime = (newAnime: Omit<Anime, 'id'>) => {
    const id = Math.max(...animeList.map(a => a.id), 0) + 1;
    const anime: Anime = {
      ...newAnime,
      id
    };
    setAnimeList(prev => [anime, ...prev]);
    
    // Add activity
    const activityId = Math.max(...activities.map(a => a.id), 0) + 1;
    setActivities(prev => [{
      id: activityId,
      type: 'add',
      animeTitle: anime.title,
      timestamp: new Date(),
      description: 'ถูกเพิ่มเข้าระบบ'
    }, ...prev.slice(0, 9)]); // Keep only 10 latest activities
  };

  const updateAnime = (id: number, updates: Partial<Anime>) => {
    const anime = animeList.find(a => a.id === id);
    setAnimeList(prev => 
      prev.map(anime => 
        anime.id === id ? { ...anime, ...updates } : anime
      )
    );
    
    // Add activity
    if (anime) {
      const activityId = Math.max(...activities.map(a => a.id), 0) + 1;
      setActivities(prev => [{
        id: activityId,
        type: 'update',
        animeTitle: anime.title,
        timestamp: new Date(),
        description: 'มีการอัปเดตข้อมูล'
      }, ...prev.slice(0, 9)]); // Keep only 10 latest activities
    }
  };

  const deleteAnime = (id: number) => {
    const anime = animeList.find(a => a.id === id);
    setAnimeList(prev => prev.filter(anime => anime.id !== id));
    
    // Add activity
    if (anime) {
      const activityId = Math.max(...activities.map(a => a.id), 0) + 1;
      setActivities(prev => [{
        id: activityId,
        type: 'delete',
        animeTitle: anime.title,
        timestamp: new Date(),
        description: 'ถูกลบออกจากระบบ'
      }, ...prev.slice(0, 9)]); // Keep only 10 latest activities
    }
  };

  const getAnimeById = (id: number) => {
    return animeList.find(anime => anime.id === id);
  };

  return (
    <AnimeContext.Provider value={{
      animeList,
      activities,
      addAnime,
      updateAnime,
      deleteAnime,
      getAnimeById
    }}>
      {children}
    </AnimeContext.Provider>
  );
}

export function useAnime() {
  const context = useContext(AnimeContext);
  if (context === undefined) {
    throw new Error('useAnime must be used within an AnimeProvider');
  }
  return context;
}