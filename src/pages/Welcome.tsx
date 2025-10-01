import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Sparkles, LogIn } from "lucide-react";

export default function Welcome() {
  return (
    <div className="min-h-screen bg-gradient-background flex items-center justify-center">
      <Card className="max-w-md w-full mx-4 p-8 bg-gradient-card border-border shadow-elegant">
        <div className="text-center space-y-6">
          {/* Logo */}
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-gradient-primary rounded-2xl flex items-center justify-center shadow-elegant">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
          </div>

          {/* Welcome Text */}
          <div className="space-y-3">
            <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Welcome
            </h1>
            <p className="text-muted-foreground text-lg">
              ยินดีต้อนรับสู่ระบบจัดการ Anime
            </p>
          </div>

          {/* Login Button */}
          <Link to="/login" className="block">
            <Button 
              className="w-full bg-gradient-primary hover:opacity-90 shadow-elegant h-12 text-base"
              size="lg"
            >
              <LogIn className="w-5 h-5 mr-2" />
              เข้าสู่หน้า Login
            </Button>
          </Link>

          {/* Additional Info */}
          <p className="text-sm text-muted-foreground">
            ระบบจัดการและแสดงข้อมูล Anime ที่ครบครัน
          </p>
        </div>
      </Card>
    </div>
  );
}