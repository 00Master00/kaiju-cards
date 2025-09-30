import { useState } from "react";
import { Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import AnimeCard from "@/components/AnimeCard";
import AnimeDetail from "@/components/AnimeDetail";
import { useAnimeData } from "@/hooks/useAnimeData";

export default function FrontUpdates() {
  const [selectedAnime, setSelectedAnime] = useState<any>(null);
  const [selectedDay, setSelectedDay] = useState<string>("Su");
  const { loading, getUpdatesByDay } = useAnimeData();

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
      <div className="flex items-center gap-2 mb-6">
        <Calendar className="w-6 h-6 text-primary" />
        <h1 className="text-2xl font-bold text-foreground">Weekly Updates</h1>
      </div>

      {/* Day Selector Tabs */}
      <Tabs value={selectedDay} onValueChange={setSelectedDay}>
        <TabsList className="grid w-full grid-cols-7 gap-2">
          {days.map((day) => {
            const dayUpdates = updatesByDay[day.key] || [];
            return (
              <TabsTrigger 
                key={day.key} 
                value={day.key}
                className="flex flex-col items-center gap-1"
              >
                <span className="font-bold">{day.key}</span>
                <Badge variant="secondary" className="text-xs">
                  {dayUpdates.length}
                </Badge>
              </TabsTrigger>
            );
          })}
        </TabsList>

        {/* Day Content */}
        {days.map((day) => {
          const dayUpdates = updatesByDay[day.key] || [];
          
          return (
            <TabsContent key={day.key} value={day.key} className="mt-0">
              <Card className="shadow-card border-border">
                <CardHeader className="pb-4">
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
          </TabsContent>
          );
        })}
      </Tabs>

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