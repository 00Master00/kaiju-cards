import { useState } from "react";
import { ArrowLeft, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import AnimeCard from "@/components/AnimeCard";
import AnimeDetail from "@/components/AnimeDetail";
import { useAnimeData } from "@/hooks/useAnimeData";
import { useNavigate } from "react-router-dom";

export default function FrontUpdates() {
  const [selectedAnime, setSelectedAnime] = useState<any>(null);
  const { loading, getUpdatesByDay } = useAnimeData();
  const navigate = useNavigate();

  const updatesByDay = getUpdatesByDay();
  const days = [
    { key: 'Su', name: 'Sunday' },
    { key: 'M', name: 'Monday' },
    { key: 'Tu', name: 'Tuesday' },
    { key: 'W', name: 'Wednesday' },
    { key: 'Th', name: 'Thursday' },
    { key: 'F', name: 'Friday' },
    { key: 'Sa', name: 'Saturday' }
  ];

  const handleBack = () => {
    navigate('/front');
  };

  const handleAnimeSelect = (anime: any) => {
    setSelectedAnime(anime);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="animate-pulse space-y-6">
          <div className="h-10 bg-muted rounded-lg w-32" />
          {[...Array(7)].map((_, i) => (
            <div key={i} className="h-48 bg-muted rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={handleBack}
          className="text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <div className="flex items-center gap-2">
          <Calendar className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-bold text-foreground">Weekly Updates</h1>
        </div>
      </div>

      {/* Days of the Week */}
      <div className="space-y-6">
        {days.map((day) => {
          const dayUpdates = updatesByDay[day.key] || [];
          
          return (
            <Card key={day.key} className="shadow-card border-border">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-primary font-bold text-lg">
                        {day.key}
                      </span>
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-foreground">
                        {day.name}
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        {dayUpdates.length} updates
                      </p>
                    </div>
                  </CardTitle>
                  
                  {dayUpdates.length > 0 && (
                    <Badge variant="secondary" className="bg-primary/10 text-primary">
                      {dayUpdates.length}
                    </Badge>
                  )}
                </div>
              </CardHeader>

              <CardContent>
                {dayUpdates.length > 0 ? (
                  <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
                    {dayUpdates.map((update) => (
                      <AnimeCard
                        key={update.id}
                        anime={update.anime}
                        size="small"
                        onClick={() => handleAnimeSelect(update.anime)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No updates for {day.name}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
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