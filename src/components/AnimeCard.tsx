import { Badge } from "@/components/ui/badge";

interface AnimeCardProps {
  anime: {
    id: string;
    title: string;
    image_url?: string;
    genres?: string[];
    description?: string;
    publisher?: string;
    popularity_score?: number;
  };
  size?: "small" | "medium" | "large";
  showRank?: number;
  onClick?: () => void;
}

export default function AnimeCard({ anime, size = "medium", showRank, onClick }: AnimeCardProps) {
  const sizeClasses = {
    small: "w-24 h-32",
    medium: "w-32 h-44",
    large: "w-40 h-56"
  };

  const cardClasses = {
    small: "space-y-1",
    medium: "space-y-2", 
    large: "space-y-3"
  };

  return (
    <div 
      className={`relative cursor-pointer group ${cardClasses[size]}`}
      onClick={onClick}
    >
      {/* Rank Badge */}
      {showRank && (
        <div className="absolute -top-2 -left-2 z-10">
          <div className={`
            w-8 h-8 rounded-full flex items-center justify-center font-bold text-white shadow-lg
            ${showRank === 1 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600 text-lg' : 
              showRank <= 3 ? 'bg-gradient-to-br from-gray-300 to-gray-500' : 
              'bg-gradient-to-br from-orange-400 to-orange-600'}
          `}>
            {showRank}
          </div>
        </div>
      )}

      {/* Image */}
      <div className={`${sizeClasses[size]} relative overflow-hidden rounded-lg shadow-card bg-muted`}>
        <img 
          src={anime.image_url || '/placeholder.svg'} 
          alt={anime.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Hover Info */}
        <div className="absolute bottom-0 left-0 right-0 p-2 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          {anime.genres && anime.genres.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-1">
              {anime.genres.slice(0, 2).map((genre) => (
                <Badge key={genre} variant="secondary" className="text-xs bg-white/20 text-white border-white/30">
                  {genre}
                </Badge>
              ))}
            </div>
          )}
          {anime.description && size !== "small" && (
            <p className="text-xs text-white/80 line-clamp-2">
              {anime.description}
            </p>
          )}
        </div>
      </div>

      {/* Title */}
      <div className="space-y-1">
        <h3 className={`font-medium text-foreground line-clamp-2 group-hover:text-primary transition-colors ${
          size === "small" ? "text-xs" : size === "medium" ? "text-sm" : "text-base"
        }`}>
          {anime.title}
        </h3>
        
        {size !== "small" && anime.publisher && (
          <p className="text-xs text-muted-foreground">
            {anime.publisher}
          </p>
        )}

        {anime.popularity_score && size === "large" && (
          <div className="flex items-center gap-1">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full ${
                    i < Math.floor(anime.popularity_score! / 20) 
                      ? "bg-yellow-400" 
                      : "bg-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-muted-foreground ml-1">
              {anime.popularity_score}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}