import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAnimeData } from "@/hooks/useAnimeData";
import { useGenres } from "@/hooks/useGenres";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  Plus, 
  Trash2, 
  Tag,
  Search,
  Eye,
  Loader2
} from "lucide-react";

export default function GenreManagement() {
  const navigate = useNavigate();
  const { animeList } = useAnimeData();
  const { genres, loading, addGenre, deleteGenre } = useGenres();
  const [newGenre, setNewGenre] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);

  // Calculate genre counts from anime data
  const getGenreCount = (genreName: string) => {
    return animeList.filter(anime => anime.genres?.includes(genreName)).length;
  };

  const genresWithCount = genres.map(genre => ({
    ...genre,
    count: getGenreCount(genre.name)
  }));

  const filteredGenres = genresWithCount.filter(genre =>
    genre.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddGenre = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newGenre.trim()) return;

    const result = await addGenre(newGenre);
    if (result) {
      setNewGenre("");
    }
  };

  const handleDeleteGenre = async (id: string, name: string, count: number) => {
    if (count > 0) {
      return;
    }

    if (confirm(`คุณแน่ใจหรือไม่ที่จะลบ Genre "${name}"?`)) {
      await deleteGenre(id, name);
    }
  };

  const getAnimeByGenre = (genreName: string) => {
    return animeList.filter(anime => anime.genres?.includes(genreName));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">
          จัดการ Genres
        </h1>
        <p className="text-muted-foreground">
          เพิ่ม แก้ไข หรือลบ Genres สำหรับจัดหมวดหมู่ Anime
        </p>
      </div>

      {/* Add New Genre */}
      <Card className="bg-gradient-card border-border shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Plus className="w-5 h-5 text-primary" />
            <span>เพิ่ม Genre ใหม่</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddGenre} className="flex space-x-2">
            <Input
              value={newGenre}
              onChange={(e) => setNewGenre(e.target.value)}
              placeholder="ชื่อ Genre ใหม่..."
              className="flex-1"
            />
            <Button type="submit" className="bg-gradient-primary hover:opacity-90">
              <Plus className="w-4 h-4 mr-2" />
              เพิ่ม
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Search */}
      <Card className="bg-gradient-card border-border shadow-card">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="ค้นหา Genre..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Genres List */}
      <Card className="bg-gradient-card border-border shadow-card">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center space-x-2">
              <Tag className="w-5 h-5 text-primary" />
              <span>รายการ Genres</span>
            </CardTitle>
            <Badge variant="secondary">
              ทั้งหมด {filteredGenres.length} genres
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredGenres.map((genre) => (
              <div
                key={genre.id}
                className="flex items-center justify-between p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors duration-200 group"
              >
                <div 
                  className="flex items-center space-x-3 flex-1 cursor-pointer"
                  onClick={() => genre.count > 0 && setSelectedGenre(genre.name)}
                >
                  <div className="w-3 h-3 bg-primary rounded-full"></div>
                  <div>
                    <h3 className="font-medium text-foreground">
                      {genre.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      ใช้ใน {genre.count} anime
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {genre.count > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedGenre(genre.name)}
                      className="p-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteGenre(genre.id, genre.name, genre.count)}
                    className={`p-2 ${
                      genre.count > 0 
                        ? "text-muted-foreground cursor-not-allowed opacity-50" 
                        : "text-destructive hover:text-destructive hover:bg-destructive/10"
                    }`}
                    disabled={genre.count > 0}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {filteredGenres.length === 0 && (
            <div className="text-center py-12">
              <Tag className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">
                ไม่พบ Genre ที่ค้นหา
              </h3>
              <p className="text-muted-foreground mb-4">
                ลองเปลี่ยนคำค้นหาดู
              </p>
              <Button 
                variant="outline" 
                onClick={() => setSearchTerm("")}
              >
                ล้างการค้นหา
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-card border-border shadow-card">
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-primary mb-1">
              {genresWithCount.length}
            </div>
            <div className="text-sm text-muted-foreground">
              จำนวน Genres ทั้งหมด
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border shadow-card">
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-success mb-1">
              {genresWithCount.filter(g => g.count > 0).length}
            </div>
            <div className="text-sm text-muted-foreground">
              Genres ที่ใช้งาน
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border shadow-card">
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-warning mb-1">
              {genresWithCount.filter(g => g.count === 0).length}
            </div>
            <div className="text-sm text-muted-foreground">
              Genres ที่ไม่ใช้งาน
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Dialog for showing anime by genre */}
      <Dialog open={!!selectedGenre} onOpenChange={() => setSelectedGenre(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Anime ใน Genre: {selectedGenre}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {selectedGenre && getAnimeByGenre(selectedGenre).length > 0 ? (
              <div className="grid gap-4">
                  {getAnimeByGenre(selectedGenre).map((anime) => (
                  <div
                    key={anime.id}
                    className="flex items-center space-x-4 p-4 bg-muted/30 rounded-lg"
                  >
                    {anime.image_url && (
                      <img
                        src={anime.image_url}
                        alt={anime.title}
                        className="w-16 h-20 object-cover rounded"
                      />
                    )}
                    <div className="flex-1">
                      <h3 className="font-medium text-foreground">
                        {anime.title}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {anime.description}
                      </p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {anime.genres?.map((g) => (
                          <Badge key={g} variant="secondary" className="text-xs">
                            {g}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">ไม่มี Anime ใน Genre นี้</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
