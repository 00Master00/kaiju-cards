import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAnime } from "@/contexts/AnimeContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Trash2, 
  Tag,
  Search,
  Eye
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const initialGenres = [
  { id: 1, name: "Action", count: 45 },
  { id: 2, name: "Adventure", count: 32 },
  { id: 3, name: "Comedy", count: 28 },
  { id: 4, name: "Drama", count: 67 },
  { id: 5, name: "Fantasy", count: 38 },
  { id: 6, name: "Horror", count: 12 },
  { id: 7, name: "Mystery", count: 15 },
  { id: 8, name: "Romance", count: 42 },
  { id: 9, name: "Sci-Fi", count: 23 },
  { id: 10, name: "Supernatural", count: 19 },
];

export default function GenreManagement() {
  const navigate = useNavigate();
  const { animeList } = useAnime();
  const [newGenre, setNewGenre] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  // Calculate actual genre counts from anime data
  const getAllGenres = () => {
    const genreCounts: { [key: string]: number } = {};
    animeList.forEach(anime => {
      anime.genre.forEach(genre => {
        genreCounts[genre] = (genreCounts[genre] || 0) + 1;
      });
    });
    
    const allGenres = Array.from(new Set([
      ...initialGenres.map(g => g.name),
      ...Object.keys(genreCounts)
    ]));
    
    return allGenres.map((genreName, index) => ({
      id: index + 1,
      name: genreName,
      count: genreCounts[genreName] || 0
    }));
  };

  const [genres, setGenres] = useState(getAllGenres());

  const filteredGenres = genres.filter(genre =>
    genre.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddGenre = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newGenre.trim()) {
      toast({
        title: "ข้อผิดพลาด",
        description: "กรุณากรอกชื่อ Genre",
        variant: "destructive"
      });
      return;
    }

    if (genres.some(genre => genre.name.toLowerCase() === newGenre.trim().toLowerCase())) {
      toast({
        title: "ข้อผิดพลาด",
        description: "Genre นี้มีอยู่ในระบบแล้ว",
        variant: "destructive"
      });
      return;
    }

    const newId = Math.max(...genres.map(g => g.id)) + 1;
    setGenres(prev => [...prev, {
      id: newId,
      name: newGenre.trim(),
      count: 0
    }]);

    setNewGenre("");
    toast({
      title: "สำเร็จ!",
      description: `เพิ่ม Genre "${newGenre.trim()}" เรียบร้อยแล้ว`,
    });
  };

  const handleDeleteGenre = (id: number, name: string, count: number) => {
    if (count > 0) {
      toast({
        title: "ไม่สามารถลบได้",
        description: `Genre "${name}" ถูกใช้งานอยู่ใน ${count} Anime`,
        variant: "destructive"
      });
      return;
    }

    if (confirm(`คุณแน่ใจหรือไม่ที่จะลบ Genre "${name}"?`)) {
      setGenres(prev => prev.filter(genre => genre.id !== id));
      toast({
        title: "สำเร็จ!",
        description: `ลบ Genre "${name}" เรียบร้อยแล้ว`,
      });
    }
  };

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
                  onClick={() => navigate(`/genres/${genre.name}/anime`)}
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
                      onClick={() => navigate(`/genres/${genre.name}/anime`)}
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
              {genres.length}
            </div>
            <div className="text-sm text-muted-foreground">
              จำนวน Genres ทั้งหมด
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border shadow-card">
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-success mb-1">
              {genres.filter(g => g.count > 0).length}
            </div>
            <div className="text-sm text-muted-foreground">
              Genres ที่ใช้งาน
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border shadow-card">
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-warning mb-1">
              {genres.filter(g => g.count === 0).length}
            </div>
            <div className="text-sm text-muted-foreground">
              Genres ที่ไม่ใช้งาน
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}