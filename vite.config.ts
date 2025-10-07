import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: "/Welcome", // 👈 ต้องตรงกับชื่อ repo
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // แยก React ออกไปเป็นไฟล์แยก
          react: ["react", "react-dom"],
          // แยก library อื่นๆ ได้ถ้ามี
          vendor: ["react-router-dom"],
        },
      },
    },
    chunkSizeWarningLimit: 1000, // ปรับ limit ไม่ให้ warning ง่ายๆ (ค่า default คือ 500kb)
  },
}));
