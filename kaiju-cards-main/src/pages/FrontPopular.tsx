import { useState } from "react";
import { TrendingUp, Crown, Medal, Award } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import AnimeDetail from "@/components/AnimeDetail";
import { useAnimeData } from "@/hooks/useAnimeData";

export default function FrontPopular() {
  const [selectedAnime, setSelectedAnime] = useState<any>(null);
  const { loading, getPopularAnime } = useAnimeData();

  const popularAnime = getPopularAnime(10);
  const [first, second, third, ...rest] = popularAnime;

  const handleAnimeSelect = (anime: any) => {
    setSelectedAnime(anime);
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="w-6 h-6 text-yellow-500" />;
    if (rank === 2) return <Medal className="w-5 h-5 text-gray-400" />;
    if (rank === 3) return <Award className="w-5 h-5 text-orange-500" />;
    return null;
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="animate-pulse space-y-6">
          <div className="h-10 bg-muted rounded-lg w-32" />
          <div className="h-80 bg-muted rounded-lg" />
          <div className="space-y-4">
            {[...Array(7)].map((_, i) => (
              <div key={i} className="h-20 bg-muted rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 space-y-8">
      {/* Header */}
      <div className="flex items-center gap-2">
        <TrendingUp className="w-6 h-6 text-primary" />
        <h1 className="text-2xl font-bold text-foreground">Popular Rankings</h1>
      </div>

      {/* Top 3 Podium */}
      {popularAnime.length >= 3 && (
        <Card className="shadow-card border-border overflow-hidden">
          <CardContent className="p-8">
            <div className="flex items-end justify-center gap-4 mb-8 mt-8">
              {/* 2nd Place */}
              <div 
                className="flex flex-col items-center cursor-pointer group"
                onClick={() => handleAnimeSelect(second)}
              >
                <div className="relative mb-4">
                  <div className="w-24 h-32 rounded-lg overflow-hidden shadow-lg bg-muted">
                    <img 
                      src={second?.image_url || '/placeholder.svg'} 
                      alt={second?.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-gray-300 to-gray-500 rounded-full flex items-center justify-center font-bold text-white text-sm shadow-lg">
                    2
                  </div>
                </div>
                <div className="text-center space-y-1">
                  <p className="font-semibold text-sm text-foreground line-clamp-2 w-28">
                    {second?.title}
                  </p>
                  <Badge variant="secondary" className="text-xs">
                    {second?.popularity_score}
                  </Badge>
                </div>
              </div>

              {/* 1st Place */}
              <div 
                className="flex flex-col items-center cursor-pointer group transform scale-110"
                onClick={() => handleAnimeSelect(first)}
              >
                <div className="relative mb-4">
                  <div className="w-32 h-44 rounded-lg overflow-hidden shadow-xl bg-muted ring-4 ring-yellow-400/50">
                    <img 
                      src={first?.image_url || '/placeholder.svg'} 
                      alt={first?.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="absolute -top-3 -right-3 w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center font-bold text-white shadow-lg">
                    1
                  </div>
                  <Crown className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-8 h-8 text-yellow-500" />
                </div>
                <div className="text-center space-y-2">
                  <p className="font-bold text-base text-foreground line-clamp-2 w-36">
                    {first?.title}
                  </p>
                  <Badge className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white border-0">
                    {first?.popularity_score}
                  </Badge>
                </div>
              </div>

              {/* 3rd Place */}
              <div 
                className="flex flex-col items-center cursor-pointer group"
                onClick={() => handleAnimeSelect(third)}
              >
                <div className="relative mb-4">
                  <div className="w-24 h-32 rounded-lg overflow-hidden shadow-lg bg-muted">
                    <img 
                      src={third?.image_url || '/placeholder.svg'} 
                      alt={third?.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center font-bold text-white text-sm shadow-lg">
                    3
                  </div>
                </div>
                <div className="text-center space-y-1">
                  <p className="font-semibold text-sm text-foreground line-clamp-2 w-28">
                    {third?.title}
                  </p>
                  <Badge variant="secondary" className="text-xs">
                    {third?.popularity_score}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Rankings 4-10 */}
      {rest.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Top 4-10</h2>
          <div className="space-y-3">
            {rest.map((anime, index) => {
              const rank = index + 4;
              return (
                <Card 
                  key={anime.id}
                  className="cursor-pointer hover:shadow-hover transition-all duration-300 border-border"
                  onClick={() => handleAnimeSelect(anime)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      {/* Rank */}
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-muted text-foreground font-bold">
                        {rank}
                      </div>

                      {/* Image */}
                      <div className="w-12 h-16 rounded-md overflow-hidden bg-muted flex-shrink-0">
                        <img 
                          src={anime.image_url || '/placeholder.svg'} 
                          alt={anime.title}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Info */}
                      <div className="flex-1 space-y-2">
                        <h3 className="font-semibold text-foreground line-clamp-1">
                          {anime.title}
                        </h3>
                        <div className="flex items-center gap-3">
                          <Badge variant="secondary">
                            Score: {anime.popularity_score}
                          </Badge>
                          {anime.genres && anime.genres.length > 0 && (
                            <div className="flex gap-1">
                              {anime.genres.slice(0, 2).map((genre) => (
                                <Badge key={genre} variant="outline" className="text-xs">
                                  {genre}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                        {anime.publisher && (
                          <p className="text-sm text-muted-foreground">
                            {anime.publisher}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Anime Detail Modal */}
      {selectedAnime && (
        <AnimeDetail 
          anime={selectedAnime}
          isOpen={!!selectedAnime}
          onClose={() => setSelectedAnime(null)}
        />
      )}
    </div>
  );
}