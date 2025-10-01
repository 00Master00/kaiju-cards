import { useState, useEffect } from "react";
import { Search, Filter, X, CheckCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useToast } from "@/hooks/use-toast";
import AnimeCard from "@/components/AnimeCard";
import AnimeDetail from "@/components/AnimeDetail";
import { useAnimeData } from "@/hooks/useAnimeData";

export default function FrontSearch() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedAnime, setSelectedAnime] = useState<any>(null);
  const { animeList, loading, searchAnime, getAllGenres } = useAnimeData();
  const { toast } = useToast();

  const allGenres = getAllGenres();

  useEffect(() => {
    const results = searchAnime(searchQuery, selectedGenres);
    setSearchResults(results);
  }, [searchQuery, selectedGenres, animeList]);

  const handleGenreToggle = (genre: string) => {
    setSelectedGenres(prev => 
      prev.includes(genre) 
        ? prev.filter(g => g !== genre)
        : [...prev, genre]
    );
  };

  const clearFilters = () => {
    setSelectedGenres([]);
    setSearchQuery("");
  };

  const handleAnimeSelect = (anime: any) => {
    setSelectedAnime(anime);
  };

  const handleSubmit = () => {
    toast({
      title: "ค้นหาสำเร็จ",
      description: `พบ ${searchResults.length} รายการ`,
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="animate-pulse space-y-6">
          <div className="h-12 bg-muted rounded-lg" />
          <div className="h-10 bg-muted rounded-lg" />
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="h-48 bg-muted rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Search Header */}
      <Card className="shadow-card border-border">
        <CardContent className="p-4 space-y-4">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input 
              placeholder="ค้นหา anime..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-12 bg-muted/50 border-border text-base"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Filter Controls */}
          <div className="flex items-center gap-3">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <Filter className="w-4 h-4" />
                  Filters
                  {selectedGenres.length > 0 && (
                    <Badge variant="secondary" className="ml-1">
                      {selectedGenres.length}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Filter Anime</SheetTitle>
                  <SheetDescription>
                    เลือกประเภท anime ที่คุณสนใจ
                  </SheetDescription>
                </SheetHeader>
                <div className="py-6 space-y-4">
                  <div className="space-y-3">
                    <h4 className="font-medium text-sm">Genres</h4>
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {allGenres.map((genre) => (
                        <div key={genre} className="flex items-center space-x-2">
                          <Checkbox 
                            id={genre}
                            checked={selectedGenres.includes(genre)}
                            onCheckedChange={() => handleGenreToggle(genre)}
                          />
                          <label 
                            htmlFor={genre}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                          >
                            {genre}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {selectedGenres.length > 0 && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={clearFilters}
                      className="w-full"
                    >
                      Clear All
                    </Button>
                  )}
                </div>
              </SheetContent>
            </Sheet>

            {(selectedGenres.length > 0 || searchQuery) && (
              <>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={clearFilters}
                  className="text-muted-foreground hover:text-foreground"
                >
                  Clear All
                </Button>
                <Button 
                  size="sm"
                  onClick={handleSubmit}
                  className="bg-gradient-primary hover:opacity-90"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Submit
                </Button>
              </>
            )}
          </div>

          {/* Active Filters */}
          {selectedGenres.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {selectedGenres.map((genre) => (
                <Badge 
                  key={genre} 
                  variant="secondary" 
                  className="gap-1 cursor-pointer hover:bg-secondary/80"
                  onClick={() => handleGenreToggle(genre)}
                >
                  {genre}
                  <X className="w-3 h-3" />
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Search Results */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">
            {searchQuery || selectedGenres.length > 0 
              ? `Search Results (${searchResults.length})`
              : `All Anime (${animeList.length})`
            }
          </h2>
        </div>

        {searchResults.length > 0 ? (
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {searchResults.map((anime) => (
              <AnimeCard 
                key={anime.id}
                anime={anime}
                size="small"
                onClick={() => handleAnimeSelect(anime)}
              />
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center border-border">
            <Search className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-medium text-foreground mb-2">
              ไม่พบ anime ที่ตรงกับเงื่อนไข
            </h3>
            <p className="text-muted-foreground mb-4">
              ลองปรับเปลี่ยนคำค้นหาหรือ filter ดูนะ
            </p>
            <Button variant="outline" onClick={clearFilters}>
              Clear Filters
            </Button>
          </Card>
        )}
      </div>

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