import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  // ตรวจสอบว่าอยู่ในส่วนของ admin หรือ front
  const isAdminRoute = location.pathname.startsWith('/admin');
  const homeLink = isAdminRoute ? '/admin/' : '/front/';
  
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-background">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-6xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-4">
            404
          </h1>
          <h2 className="text-2xl font-semibold text-foreground mb-2">
            ไม่พบหน้าที่ต้องการ
          </h2>
          <p className="text-muted-foreground">
            ขออภัย หน้าที่คุณกำลังค้นหาไม่มีอยู่ในระบบ
          </p>
        </div>
        <Link to={homeLink}>
          <Button className="bg-gradient-primary hover:opacity-90 shadow-elegant">
            กลับหน้าหลัก
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;