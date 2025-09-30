import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAnime } from "@/contexts/AnimeContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  Star, 
  Calendar, 
  Tv, 
  Building,
  Globe
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AnimeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getAnimeById, deleteAnime } = useAnime();
  const { toast } = useToast();
  const [anime, setAnime] = useState(getAnimeById(Number(id)));

  useEffect(() => {
    setAnime(getAnimeById(Number(id)));
  }, [id, getAnimeById]);

  if (!anime) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-2">ไม่พบ Anime</h2>
          <p className="text-muted-foreground mb-4">Anime ที่คุณค้นหาไม่พบในระบบ</p>
          <Button onClick={() => navigate("/anime")} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            กลับไปรายการ
          </Button>
        </div>
      </div>
    );
  }

  const handleDelete = () => {
    if (confirm(`คุณแน่ใจหรือไม่ที่จะลบ "${anime.title}"?`)) {
      deleteAnime(anime.id);
      toast({
        title: "สำเร็จ!",
        description: `ลบ Anime "${anime.title}" เรียบร้อยแล้ว`,
      });
      navigate("/anime");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button 
          variant="outline" 
          onClick={() => navigate(-1)}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          กลับ
        </Button>
        
        <div className="flex space-x-2">
          <Button 
            onClick={() => navigate(`/anime/edit/${anime.id}`)}
            className="bg-gradient-primary hover:opacity-90"
          >
            <Edit className="w-4 h-4 mr-2" />
            แก้ไข
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleDelete}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            ลบ
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Image */}
        <Card className="bg-gradient-card border-border shadow-card">
          <CardContent className="p-6">
            <div className="aspect-[3/4] bg-muted rounded-lg overflow-hidden">
              {anime.image && anime.image !== "/placeholder.svg" ? (
                <img 
                  src={anime.image} 
                  alt={anime.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Tv className="w-16 h-16 text-muted-foreground" />
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <Card className="bg-gradient-card border-border shadow-card">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-2xl mb-2">{anime.title}</CardTitle>
                  <p className="text-lg text-muted-foreground mb-4">{anime.titleJapanese}</p>
                </div>
                <Badge variant="secondary" className="text-sm">
                  <Star className="w-3 h-3 mr-1" />
                  {anime.rating}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {anime.description && (
                <div>
                  <h3 className="font-semibold mb-2">เรื่องย่อ</h3>
                  <p className="text-muted-foreground leading-relaxed">{anime.description}</p>
                </div>
              )}
              
              <div className="flex flex-wrap gap-2">
                {anime.genre.map((g, index) => (
                  <Badge key={index} variant="outline">
                    {g}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Additional Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-gradient-card border-border shadow-card">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <Tv className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">จำนวนตอน</p>
                    <p className="font-semibold">{anime.episodes} ตอน</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card border-border shadow-card">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">ปีที่ออกอากาศ</p>
                    <p className="font-semibold">{anime.year}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card border-border shadow-card">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <Building className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">สตูดิโอ</p>
                    <p className="font-semibold">{anime.studio}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card border-border shadow-card">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <Globe className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">สถานะ</p>
                    <Badge 
                      variant={anime.status === "Completed" ? "default" : 
                               anime.status === "Ongoing" ? "destructive" : "secondary"}
                      className="mt-1"
                    >
                      {anime.status}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}