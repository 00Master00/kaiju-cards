import { useState, useEffect } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import AnimeCard from "./AnimeCard";

interface SearchPopupProps {
  isOpen: boolean;
  onClose: () => void;
  animeList: any[];
  onAnimeSelect: (anime: any) => void;
}

export default function SearchPopup({ isOpen, onClose, animeList, onAnimeSelect }: SearchPopupProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredAnime, setFilteredAnime] = useState<any[]>([]);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredAnime([]);
      return;
    }

    const filtered = animeList.filter(anime =>
      anime.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      anime.genres?.some((genre: string) => genre.toLowerCase().includes(searchQuery.toLowerCase())) ||
      anime.publisher?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    setFilteredAnime(filtered.slice(0, 8)); // Show max 8 results
  }, [searchQuery, animeList]);

  const handleAnimeClick = (anime: any) => {
    onAnimeSelect(anime);
    onClose();
    setSearchQuery("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] p-0 bg-card border-border">
        {/* Search Header */}
        <div className="p-4 border-b border-border bg-card">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="ค้นหา anime..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-10 border-border focus:ring-primary"
              autoFocus
            />
            <button
              onClick={onClose}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Search Results */}
        <div className="p-4 overflow-y-auto max-h-96">
          {searchQuery.trim() === "" ? (
            <div className="text-center py-8 text-muted-foreground">
              <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>เริ่มพิมพ์เพื่อค้นหา anime</p>
            </div>
          ) : filteredAnime.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>ไม่พบ anime ที่ตรงกับคำค้นหา "{searchQuery}"</p>
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-4">
              {filteredAnime.map((anime) => (
                <AnimeCard
                  key={anime.id}
                  anime={anime}
                  size="small"
                  onClick={() => handleAnimeClick(anime)}
                />
              ))}
            </div>
          )}
        </div>

        {filteredAnime.length > 0 && (
          <div className="p-4 border-t border-border text-center text-sm text-muted-foreground">
            แสดง {filteredAnime.length} รายการ
            {animeList.length > 8 && " (แสดงเพียงส่วนหนึ่ง)"}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}