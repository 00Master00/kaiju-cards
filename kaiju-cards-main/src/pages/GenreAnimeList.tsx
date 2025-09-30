import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAnime } from "@/contexts/AnimeContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  Star, 
  Calendar, 
  Tv, 
  Eye,
  Edit,
  Trash2
} from "lucide-react";

export default function GenreAnimeList() {
  const { genreName } = useParams();
  const navigate = useNavigate();
  const { animeList } = useAnime();
  
  const genreAnime = animeList.filter(anime => 
    anime.genre.includes(genreName || "")
  );

  if (!genreName) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-2">ไม่พบ Genre</h2>
          <p className="text-muted-foreground mb-4">Genre ที่คุณค้นหาไม่ถูกต้อง</p>
          <Button onClick={() => navigate("/genres")} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            กลับไปจัดการ Genres
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Button 
            variant="outline" 
            onClick={() => navigate("/genres")}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            กลับ
          </Button>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Anime ประเภท "{genreName}"
          </h1>
          <p className="text-muted-foreground">
            พบ {genreAnime.length} รายการ
          </p>
        </div>
      </div>

      {/* Anime List */}
      {genreAnime.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {genreAnime.map((anime) => (
            <Card key={anime.id} className="bg-gradient-card border-border shadow-card hover:shadow-lg transition-all duration-300">
              <CardContent className="p-0">
                {/* Image */}
                <div className="aspect-[16/9] bg-muted rounded-t-lg overflow-hidden">
                  {anime.image && anime.image !== "/placeholder.svg" ? (
                    <img 
                      src={anime.image} 
                      alt={anime.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Tv className="w-12 h-12 text-muted-foreground" />
                    </div>
                  )}
                </div>
                
                {/* Content */}
                <div className="p-4 space-y-3">
                  <div>
                    <h3 className="font-semibold text-lg text-foreground line-clamp-1">
                      {anime.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-1">
                      {anime.titleJapanese}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {anime.genre.slice(0, 3).map((genre, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {genre}
                      </Badge>
                    ))}
                    {anime.genre.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{anime.genre.length - 3}
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <Star className="w-3 h-3 text-yellow-500" />
                        <span>{anime.rating}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3" />
                        <span>{anime.year}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Tv className="w-3 h-3" />
                        <span>{anime.episodes}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <Badge 
                      variant={anime.status === "Completed" ? "default" : 
                               anime.status === "Ongoing" ? "destructive" : "secondary"}
                      className="text-xs"
                    >
                      {anime.status}
                    </Badge>
                    
                    <div className="flex space-x-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => navigate(`/anime/${anime.id}`)}
                        className="h-8 w-8 p-0"
                      >
                        <Eye className="w-3 h-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => navigate(`/anime/edit/${anime.id}`)}
                        className="h-8 w-8 p-0"
                      >
                        <Edit className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="bg-gradient-card border-border shadow-card">
          <CardContent className="text-center py-12">
            <Tv className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">
              ไม่มี Anime ในประเภทนี้
            </h3>
            <p className="text-muted-foreground mb-6">
              ยังไม่มี Anime ในประเภท "{genreName}" ในระบบ
            </p>
            <Button 
              onClick={() => navigate("/anime/add")}
              className="bg-gradient-primary hover:opacity-90"
            >
              เพิ่ม Anime ใหม่
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}