import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { User, Lock, LogIn, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const {
    login,
    isLoading
  } = useAuth();
  const navigate = useNavigate();
  const {
    toast
  } = useToast();
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("กรุณากรอกอีเมลและรหัสผ่าน");
      return;
    }
    const success = await login(email, password);
    if (success) {
      toast({
        title: "เข้าสู่ระบบสำเร็จ!",
        description: "ยินดีต้อนรับเข้าสู่ MasterAniview"
      });

      // Redirect based on user role
      if (email === 'admin@anime.com') {
        navigate("/admin");
      } else {
        navigate("/front");
      }
    } else {
      setError("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
    }
  };
  return <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-4">
      <Card className="w-full max-w-md bg-gradient-card border-border shadow-elegant">
        <CardHeader className="space-y-4 text-center">
          <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto">
            <User className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-foreground">
            เข้าสู่ระบบ
          </CardTitle>
          <p className="text-muted-foreground">
            MasterAniview - เว็บจัดการอนิเมะ
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          {error && <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>}

          {/* Demo Account Info */}
          

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">อีเมล</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input id="email" type="email" placeholder="กรอกอีเมลของคุณ" value={email} onChange={e => setEmail(e.target.value)} className="pl-10" disabled={isLoading} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">รหัสผ่าน</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input id="password" type={showPassword ? "text" : "password"} placeholder="กรอกรหัสผ่านของคุณ" value={password} onChange={e => setPassword(e.target.value)} className="pl-10 pr-10" disabled={isLoading} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground" disabled={isLoading}>
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full bg-gradient-primary hover:opacity-90 shadow-elegant" disabled={isLoading}>
              {isLoading ? <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>กำลังเข้าสู่ระบบ...</span>
                </div> : <div className="flex items-center space-x-2">
                  <LogIn className="w-4 h-4" />
                  <span>เข้าสู่ระบบ</span>
                </div>}
            </Button>
          </form>

          <div className="text-center text-sm text-muted-foreground">
            <p>ระบบ Demo</p>
          </div>
        </CardContent>
      </Card>
    </div>;
}