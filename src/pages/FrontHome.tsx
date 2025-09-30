import { useState } from "react";
import { Search, TrendingUp, Clock, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import AnimeCard from "@/components/AnimeCard";
import SearchPopup from "@/components/SearchPopup";
import AnimeDetail from "@/components/AnimeDetail";
import { useAnimeData } from "@/hooks/useAnimeData";
import { useNavigate } from "react-router-dom";

export default function FrontHome() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedAnime, setSelectedAnime] = useState<any>(null);
  const { animeList, loading, getPopularAnime, getTodayUpdates } = useAnimeData();
  const navigate = useNavigate();

  const popularAnime = getPopularAnime(10);
  const todayUpdates = getTodayUpdates();

  const handleSearchClick = () => {
    setIsSearchOpen(true);
  };

  const handleAnimeSelect = (anime: any) => {
    setSelectedAnime(anime);
  };

  const handleSeeAllPopular = () => {
    navigate('/front/popular');
  };

  const handleSeeAllUpdates = () => {
    navigate('/front/updates');
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="animate-pulse space-y-6">
          <div className="h-12 bg-muted rounded-lg" />
          <div className="h-64 bg-muted rounded-lg" />
          <div className="h-64 bg-muted rounded-lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 space-y-8">
      {/* Search Bar */}
      <Card className="shadow-card border-border">
        <CardContent className="p-4">
          <div 
            className="relative cursor-pointer"
            onClick={handleSearchClick}
          >
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input 
              placeholder="ค้นหา anime ที่คุณสนใจ..."
              className="pl-12 h-12 bg-muted/50 border-border text-base cursor-pointer"
              readOnly
            />
          </div>
        </CardContent>
      </Card>

      {/* Popular Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-primary" />
            <h2 className="text-xl font-bold text-foreground">Popular</h2>
          </div>
          <Button 
            variant="ghost" 
            className="text-primary hover:text-primary hover:bg-primary/10"
            onClick={handleSeeAllPopular}
          >
            See All
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>

        <Carousel className="w-full">
          <CarouselContent className="-ml-2 md:-ml-4">
            {popularAnime.map((anime) => (
              <CarouselItem key={anime.id} className="pl-2 md:pl-4 basis-auto">
                <AnimeCard 
                  anime={anime}
                  size="medium"
                  onClick={() => handleAnimeSelect(anime)}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-2" />
          <CarouselNext className="right-2" />
        </Carousel>
      </section>

      {/* Recent Updates Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-6 h-6 text-primary" />
            <h2 className="text-xl font-bold text-foreground">Recent Updates</h2>
          </div>
          <Button 
            variant="ghost" 
            className="text-primary hover:text-primary hover:bg-primary/10"
            onClick={handleSeeAllUpdates}
          >
            See All
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>

        {todayUpdates.length > 0 ? (
          <Carousel className="w-full">
            <CarouselContent className="-ml-2 md:-ml-4">
              {todayUpdates.map((update) => (
                <CarouselItem key={update.id} className="pl-2 md:pl-4 basis-auto">
                  <AnimeCard 
                    anime={update.anime}
                    size="medium"
                    onClick={() => handleAnimeSelect(update.anime)}
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-2" />
            <CarouselNext className="right-2" />
          </Carousel>
        ) : (
          <Card className="p-8 text-center border-border">
            <Clock className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <p className="text-muted-foreground">ยังไม่มีการอัปเดตในวันนี้</p>
          </Card>
        )}
      </section>

      {/* Search Popup */}
      <SearchPopup 
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        animeList={animeList}
        onAnimeSelect={handleAnimeSelect}
      />

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