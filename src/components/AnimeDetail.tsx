import { X, Calendar, Building, Monitor, Star } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface AnimeDetailProps {
  anime: {
    id: string;
    title: string;
    image_url?: string;
    genres?: string[];
    publisher?: string;
    first_aired?: string;
    format?: string;
    description?: string;
    popularity_score?: number;
  };
  isOpen: boolean;
  onClose: () => void;
}

export default function AnimeDetail({ anime, isOpen, onClose }: AnimeDetailProps) {
  const handleImageClick = () => {
    if (anime.image_url) {
      window.open(anime.image_url, '_blank');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0 bg-card border-border overflow-hidden">
        <div className="relative">
          {/* Close Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full w-8 h-8 p-0"
          >
            <X className="w-4 h-4" />
          </Button>

          {/* Content */}
          <div className="grid md:grid-cols-5 gap-6 p-6">
            {/* Image */}
            <div className="md:col-span-2">
              <Card className="overflow-hidden border-border">
                <div 
                  className="aspect-[3/4] cursor-pointer group"
                  onClick={handleImageClick}
                >
                  <img 
                    src={anime.image_url || '/placeholder.svg'} 
                    alt={anime.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center">
                    <div className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-sm bg-black/50 px-3 py-1 rounded-full">
                      Click to view full image
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Details */}
            <div className="md:col-span-3 space-y-6">
              {/* Title and Rating */}
              <div className="space-y-3">
                <h1 className="text-2xl md:text-3xl font-bold text-foreground leading-tight">
                  {anime.title}
                </h1>
                
                {anime.popularity_score && (
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <Star className="w-5 h-5 text-yellow-400 fill-current" />
                      <span className="font-semibold text-foreground">
                        {(anime.popularity_score / 20).toFixed(1)}
                      </span>
                      <span className="text-muted-foreground text-sm">
                        ({anime.popularity_score}/100)
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Genres */}
              {anime.genres && anime.genres.length > 0 && (
                <div className="space-y-2">
                  <h3 className="font-semibold text-foreground">Genres</h3>
                  <div className="flex flex-wrap gap-2">
                    {anime.genres.map((genre) => (
                      <Badge key={genre} variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                        {genre}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {anime.publisher && (
                  <Card className="border-border">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <Building className="w-5 h-5 text-primary" />
                        <div>
                          <p className="text-sm text-muted-foreground">Publisher</p>
                          <p className="font-medium text-foreground">{anime.publisher}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {anime.first_aired && (
                  <Card className="border-border">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <Calendar className="w-5 h-5 text-primary" />
                        <div>
                          <p className="text-sm text-muted-foreground">First Aired</p>
                          <p className="font-medium text-foreground">
                            {new Date(anime.first_aired).toLocaleDateString('th-TH')}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {anime.format && (
                  <Card className="border-border">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <Monitor className="w-5 h-5 text-primary" />
                        <div>
                          <p className="text-sm text-muted-foreground">Format</p>
                          <p className="font-medium text-foreground">{anime.format}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Description */}
              {anime.description && (
                <div className="space-y-3">
                  <h3 className="font-semibold text-foreground">Description</h3>
                  <Card className="border-border">
                    <CardContent className="p-4">
                      <p className="text-muted-foreground leading-relaxed">
                        {anime.description}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}