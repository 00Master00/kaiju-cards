import { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAnimeData, type AnimeFormData } from "@/hooks/useAnimeData";
import { useGenres } from "@/hooks/useGenres";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Upload, 
  X, 
  Plus, 
  Save,
  ArrowLeft,
  ImageIcon,
  Loader2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface FormData {
  title: string;
  description: string;
  publisher: string;
  first_aired: string;
  format: string;
  genres: string[];
  image_url: string;
  popularity_score: number;
}

const formatOptions = ["TV Series", "Movie", "OVA", "Special"];

export default function AnimeForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { getAnimeById, createAnime, updateAnime, createAnimeUpdate, loading } = useAnimeData();
  const { genres: dbGenres, addGenre } = useGenres();
  const isEditing = !!id;

  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    publisher: "",
    first_aired: "",
    format: "TV Series",
    genres: [],
    image_url: "",
    popularity_score: 0
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load existing anime data for editing
 const [isLoaded, setIsLoaded] = useState(false);

useEffect(() => {
  if (isEditing && id && !loading && !isLoaded) {
    const anime = getAnimeById(id);
    if (anime) {
      setFormData({
        title: anime.title,
        description: anime.description || "",
        publisher: anime.publisher || "",
        first_aired: anime.first_aired || "",
        format: anime.format || "TV Series",
        genres: anime.genres || [],
        image_url: anime.image_url || "",
        popularity_score: anime.popularity_score || 0
      });
      setImagePreview(anime.image_url || "");
      setIsLoaded(true); // ทำให้โหลดครั้งเดียว
    }
  }
}, [id, isEditing, getAnimeById, loading, isLoaded]);

  const [newGenre, setNewGenre] = useState("");
  const [imagePreview, setImagePreview] = useState<string>("");

  const handleInputChange = (field: keyof FormData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleGenreAdd = async (genre: string) => {
    if (!genre || formData.genres.includes(genre)) {
      setNewGenre("");
      return;
    }

    // ถ้า genre ยังไม่มีใน database ให้เพิ่ม
    const genreExists = dbGenres.some(g => g.name.toLowerCase() === genre.toLowerCase());
    if (!genreExists) {
      await addGenre(genre);
    }

    setFormData(prev => ({
      ...prev,
      genres: [...prev.genres, genre]
    }));
    setNewGenre("");
  };

  const handleGenreRemove = (genre: string) => {
    setFormData(prev => ({
      ...prev,
      genres: prev.genres.filter(g => g !== genre)
    }));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setImagePreview(result);
        setFormData(prev => ({
          ...prev,
          image_url: result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.title.trim()) {
      toast({
        title: "ข้อผิดพลาด",
        description: "กรุณากรอกชื่อ Anime",
        variant: "destructive"
      });
      return;
    }

    if (formData.genres.length === 0) {
      toast({
        title: "ข้อผิดพลาด", 
        description: "กรุณาเลือกอย่างน้อย 1 Genre",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare anime data for Supabase
      const animeData: AnimeFormData = {
        title: formData.title,
        description: formData.description,
        genres: formData.genres,
        publisher: formData.publisher,
        first_aired: formData.first_aired,
        format: formData.format,
        image_url: formData.image_url || null,
        popularity_score: formData.popularity_score
      };

      let result;
      if (isEditing && id) {
        result = await updateAnime(id, animeData);
      } else {
        result = await createAnime(animeData);
      }

      if (result.error) {
        throw result.error;
      }

      // Create anime update for new anime
      if (!isEditing && result.data) {
        await createAnimeUpdate({
          anime_id: result.data.id,
          update_date: new Date().toISOString().split('T')[0],
          update_type: 'new'
        });
      }

      toast({
        title: "สำเร็จ!",
        description: isEditing ? "อัปเดตข้อมูล Anime เรียบร้อยแล้ว" : "เพิ่ม Anime ใหม่เรียบร้อยแล้ว",
      });

      navigate("/admin/anime");
    } catch (error) {
      toast({
        title: "ข้อผิดพลาด",
        description: "ไม่สามารถบันทึกข้อมูลได้ กรุณาลองใหม่อีกครั้ง",
        variant: "destructive"
      });
      console.error('Error saving anime:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate("/admin/anime")}
          className="p-2"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            {isEditing ? "แก้ไข Anime" : "เพิ่ม Anime ใหม่"}
          </h1>
          <p className="text-muted-foreground">
            {isEditing ? "อัปเดตข้อมูล Anime ที่มีอยู่" : "เพิ่มข้อมูล Anime ใหม่เข้าสู่ระบบ"}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card className="bg-gradient-card border-border shadow-card">
              <CardHeader>
                <CardTitle>ข้อมูลพื้นฐาน</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div className="space-y-2">
                     <Label htmlFor="title">ชื่อ Anime *</Label>
                     <Input
                       id="title"
                       value={formData.title}
                       onChange={(e) => handleInputChange("title", e.target.value)}
                       placeholder="เช่น Attack on Titan"
                       required
                     />
                   </div>
                   <div className="space-y-2">
                     <Label htmlFor="publisher">ผู้จัดพิมพ์</Label>
                     <Input
                       id="publisher"
                       value={formData.publisher}
                       onChange={(e) => handleInputChange("publisher", e.target.value)}
                       placeholder="เช่น Kodansha"
                     />
                   </div>
                 </div>

                 <div className="space-y-2">
                   <Label htmlFor="description">เรื่องย่อ</Label>
                   <Textarea
                     id="description"
                     value={formData.description}
                     onChange={(e) => handleInputChange("description", e.target.value)}
                     placeholder="เขียนเรื่องย่อของ Anime..."
                     rows={4}
                   />
                 </div>

                 <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                   <div className="space-y-2">
                     <Label htmlFor="first_aired">วันที่เริ่มฉาย</Label>
                     <Input
                       id="first_aired"
                       type="date"
                       value={formData.first_aired}
                       onChange={(e) => handleInputChange("first_aired", e.target.value)}
                     />
                   </div>
                   <div className="space-y-2">
                     <Label htmlFor="format">รูปแบบ</Label>
                     <select
                       id="format"
                       value={formData.format}
                       onChange={(e) => handleInputChange("format", e.target.value)}
                       className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                     >
                       {formatOptions.map(format => (
                         <option key={format} value={format}>{format}</option>
                       ))}
                     </select>
                   </div>
                   <div className="space-y-2">
                     <Label htmlFor="popularity_score">คะแนนความนิยม</Label>
                     <Input
                       id="popularity_score"
                       type="number"
                       min="0"
                       max="100"
                       value={formData.popularity_score}
                       onChange={(e) => handleInputChange("popularity_score", parseInt(e.target.value) || 0)}
                     />
                   </div>
                 </div>
              </CardContent>
            </Card>

            {/* Genres */}
            <Card className="bg-gradient-card border-border shadow-card">
              <CardHeader>
                <CardTitle>Genres *</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Selected Genres */}
                <div className="flex flex-wrap gap-2">
                  {formData.genres.map((genre) => (
                    <Badge
                      key={genre}
                      variant="secondary"
                      className="flex items-center space-x-1 bg-primary/10 text-primary"
                    >
                      <span>{genre}</span>
                      <X
                        className="w-3 h-3 cursor-pointer hover:text-destructive"
                        onClick={() => handleGenreRemove(genre)}
                      />
                    </Badge>
                  ))}
                </div>

                {/* Add Genre */}
                <div className="flex flex-wrap gap-2">
                  {dbGenres
                    .filter(genre => !formData.genres.includes(genre.name))
                    .map((genre) => (
                      <Button
                        key={genre.id}
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleGenreAdd(genre.name)}
                        className="text-xs"
                      >
                        <Plus className="w-3 h-3 mr-1" />
                        {genre.name}
                      </Button>
                    ))}
                </div>

                {/* Custom Genre */}
                <div className="flex space-x-2">
                  <Input
                    value={newGenre}
                    onChange={(e) => setNewGenre(e.target.value)}
                    placeholder="เพิ่ม Genre ใหม่..."
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    onClick={() => handleGenreAdd(newGenre)}
                    disabled={!newGenre.trim()}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Image Upload */}
          <div className="space-y-6">
            <Card className="bg-gradient-card border-border shadow-card">
              <CardHeader>
                <CardTitle>รูปภาพ</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Image Preview */}
                <div className="aspect-[3/4] bg-muted rounded-lg flex items-center justify-center border-2 border-dashed border-border hover:border-primary transition-colors duration-200">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <div className="text-center">
                      <ImageIcon className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">
                        ไม่มีรูปภาพ
                      </p>
                    </div>
                  )}
                </div>

                {/* Upload Button */}
                <div className="space-y-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    อัปโหลดรูปภาพ
                  </Button>
                  {imagePreview && (
                     <Button
                       type="button"
                       variant="outline"
                       onClick={() => {
                         setImagePreview("");
                         setFormData(prev => ({ ...prev, image_url: "" }));
                       }}
                       className="w-full text-destructive hover:text-destructive"
                     >
                       <X className="w-4 h-4 mr-2" />
                       ลบรูปภาพ
                     </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Submit Button */}
             <Button
               type="submit"
               disabled={isSubmitting}
               className="w-full bg-gradient-primary hover:opacity-90 shadow-elegant"
               size="lg"
             >
               {isSubmitting ? (
                 <Loader2 className="w-4 h-4 mr-2 animate-spin" />
               ) : (
                 <Save className="w-4 h-4 mr-2" />
               )}
               {isSubmitting 
                 ? "กำลังบันทึก..." 
                 : isEditing 
                   ? "อัปเดตข้อมูล" 
                   : "เพิ่ม Anime"
               }
             </Button>
          </div>
        </div>
      </form>
    </div>
  );
}