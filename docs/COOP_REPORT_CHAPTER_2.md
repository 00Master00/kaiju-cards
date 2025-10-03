# บทที่ 2
# ทฤษฎีและเทคโนโลยีที่เกี่ยวข้อง

---

## 2.1 ทฤษฎีและแนวคิดที่เกี่ยวข้อง

### 2.1.1 ระบบจัดการฐานข้อมูล (Database Management System - DBMS)

ระบบจัดการฐานข้อมูล คือ ซอฟต์แวร์ที่ใช้ในการจัดการข้อมูลในฐานข้อมูล ทำหน้าที่ในการเก็บ เรียกค้น อัพเดต และลบข้อมูล โดยมีคุณสมบัติหลักดังนี้:

**หลักการ ACID Properties:**
- **Atomicity:** ธุรกรรมต้องสำเร็จทั้งหมดหรือไม่สำเร็จเลย
- **Consistency:** ข้อมูลต้องอยู่ในสถานะที่สอดคล้องกันเสมอ
- **Isolation:** ธุรกรรมแต่ละรายการต้องแยกออกจากกัน
- **Durability:** เมื่อธุรกรรมสำเร็จแล้ว ข้อมูลต้องคงอยู่แม้เกิดความผิดพลาด

**ประเภทของ Database:**
1. **Relational Database (SQL):** ใช้ตารางเก็บข้อมูลที่มีความสัมพันธ์กัน
2. **NoSQL Database:** เก็บข้อมูลแบบ Document, Key-Value, หรือ Graph
3. **NewSQL Database:** รวมข้อดีของทั้ง SQL และ NoSQL

โครงงานนี้ใช้ **PostgreSQL** ซึ่งเป็น Relational Database

### 2.1.2 สถาปัตยกรรมแบบ Client-Server

**คำนิยาม:**
สถาปัตยกรรม Client-Server เป็นรูปแบบการออกแบบระบบที่แยกหน้าที่ออกเป็น 2 ส่วน:
- **Client:** ส่วนที่ผู้ใช้โต้ตอบด้วย (Frontend)
- **Server:** ส่วนที่จัดการข้อมูลและ Business Logic (Backend)

**ข้อดี:**
- แยกหน้าที่ความรับผิดชอบชัดเจน (Separation of Concerns)
- Scale ได้ง่ายทั้ง Client และ Server
- รักษาความปลอดภัยได้ดีกว่า (Logic อยู่ที่ Server)
- พัฒนาและดูแลรักษาง่าย

**การประยุกต์ใช้ในโครงงาน:**
```
Client (React + TypeScript)
        ↕ HTTP/HTTPS
Server (Supabase)
    ├── PostgreSQL Database
    ├── Authentication Service
    └── Storage Service
```

### 2.1.3 RESTful API Design Principles

**คำนิยาม:**
REST (Representational State Transfer) เป็นรูปแบบการออกแบบ API ที่ใช้ HTTP Methods

**HTTP Methods หลัก:**
- **GET:** อ่านข้อมูล (Read)
- **POST:** สร้างข้อมูลใหม่ (Create)
- **PUT/PATCH:** แก้ไขข้อมูล (Update)
- **DELETE:** ลบข้อมูล (Delete)

**หลักการออกแบบ:**
1. **Stateless:** แต่ละ Request ต้องมีข้อมูลครบสำหรับการประมวลผล
2. **Resource-based:** URL แทนทรัพยากร (เช่น `/anime`, `/genres`)
3. **Standard HTTP Status Codes:** ใช้ Status Code มาตรฐาน (200, 404, 500)
4. **JSON Format:** ส่งและรับข้อมูลในรูปแบบ JSON

**ตัวอย่างใน Supabase:**
```typescript
// GET all anime
supabase.from('anime').select('*')

// POST new anime
supabase.from('anime').insert([data])

// PATCH anime
supabase.from('anime').update(data).eq('id', id)

// DELETE anime
supabase.from('anime').delete().eq('id', id)
```

### 2.1.4 Single Page Application (SPA)

**คำนิยาม:**
SPA เป็นเว็บแอปพลิเคชันที่โหลดหน้าเดียว แล้วอัพเดตเนื้อหาแบบ Dynamic โดยไม่ต้อง Reload ทั้งหน้า

**ข้อดี:**
- User Experience ที่ดีกว่า (ไม่มีการกระพริบหน้าจอ)
- เร็วกว่าเพราะโหลดครั้งเดียว
- สามารถทำงานแบบ Offline ได้บางส่วน
- แยก Frontend และ Backend ออกจากกันได้

**ข้อเสีย:**
- Initial Load Time อาจช้า
- SEO ทำได้ยากกว่า (แต่มีวิธีแก้)
- จัดการ State ซับซ้อน

**เทคโนโลยีที่ใช้สร้าง SPA:**
- React (ที่ใช้ในโครงงานนี้)
- Vue.js
- Angular
- Svelte

### 2.1.5 Component-Based Architecture

**คำนิยาม:**
การออกแบบ UI เป็น Components ย่อยๆ ที่สามารถนำมาใช้ซ้ำได้

**หลักการ:**
1. **Reusability:** Component สามารถใช้ซ้ำได้หลายที่
2. **Isolation:** แต่ละ Component ทำงานแยกอิสระ
3. **Composability:** รวม Components เล็กๆ เป็น Component ใหญ่ได้
4. **Maintainability:** แก้ไขและดูแลรักษาง่าย

**ตัวอย่าง Component Hierarchy ในโครงงาน:**
```
App
├── Layout
│   ├── Header
│   │   └── Navigation
│   ├── Sidebar
│   └── Footer
├── Pages
│   ├── Dashboard
│   │   ├── StatCard
│   │   └── ChartComponent
│   ├── AnimeList
│   │   └── AnimeCard
│   └── GenreManagement
└── Common Components
    ├── Button
    ├── Input
    ├── Dialog
    └── Toast
```

### 2.1.6 State Management

**คำนิยาม:**
การจัดการสถานะข้อมูลในแอปพลิเคชันให้สอดคล้องและถูกต้อง

**ประเภทของ State:**
1. **Local State:** State ที่ใช้เฉพาะใน Component เดียว
2. **Global State:** State ที่ใช้ร่วมกันหลาย Components
3. **Server State:** ข้อมูลจาก Server/Database
4. **URL State:** ข้อมูลใน URL (Query params, Path params)

**การจัดการ State ในโครงงาน:**
- **React useState:** สำหรับ Local State
- **React Context API:** สำหรับ Global State (AuthContext, AnimeContext)
- **Custom Hooks:** สำหรับ Reusable Logic (useAnimeData, useGenres)

### 2.1.7 Authentication & Authorization

**Authentication (การยืนยันตัวตน):**
- **คือ:** กระบวนการตรวจสอบว่าผู้ใช้เป็นใคร
- **วิธีการ:** Email/Password, OAuth, Biometric
- **ในโครงงาน:** ใช้ Supabase Authentication พร้อม Email/Password

**Authorization (การควบคุมสิทธิ์):**
- **คือ:** กระบวนการตรวจสอบว่าผู้ใช้มีสิทธิ์ทำอะไรได้บ้าง
- **วิธีการ:** Role-Based Access Control (RBAC), Row Level Security (RLS)
- **ในโครงงาน:** ใช้ RLS Policies ของ Supabase

**Security Best Practices:**
1. เก็บ Password แบบ Hashed เท่านั้น
2. ใช้ HTTPS สำหรับการส่งข้อมูล
3. Validate Input ทั้ง Client และ Server
4. ใช้ JWT Tokens สำหรับ Session
5. Implement Rate Limiting

---

## 2.2 เทคโนโลยี Frontend

### 2.2.1 React

**คำนิยาม:**
React เป็น JavaScript Library สำหรับสร้าง User Interface ที่พัฒนาโดย Facebook (Meta)

**คุณสมบัติหลัก:**
1. **Component-Based:** สร้าง UI จาก Components ย่อยๆ
2. **Virtual DOM:** ทำให้การ Update UI เร็วขึ้น
3. **Declarative:** เขียนโค้ดบอกว่าต้องการ UI แบบไหน ไม่ใช่วิธีสร้าง
4. **Learn Once, Write Anywhere:** ใช้ได้ทั้ง Web, Mobile, Desktop

**React Hooks ที่ใช้ในโครงงาน:**

```typescript
// useState - จัดการ Local State
const [count, setCount] = useState(0);

// useEffect - Side Effects (API calls, subscriptions)
useEffect(() => {
  fetchData();
}, [dependency]);

// useContext - เข้าถึง Context
const auth = useContext(AuthContext);

// useMemo - Memoize ค่าที่คำนวณแล้ว
const expensiveValue = useMemo(() => computeExpensive(a, b), [a, b]);

// useCallback - Memoize ฟังก์ชัน
const handleClick = useCallback(() => {
  doSomething(a, b);
}, [a, b]);

// Custom Hooks - สร้าง Hook เอง
function useAnimeData() {
  const [data, setData] = useState([]);
  // ... logic
  return { data, loading, error };
}
```

**Component Lifecycle:**
```
Mounting → Updating → Unmounting
   ↓          ↓          ↓
render → re-render → cleanup
```

**เหตุผลในการเลือกใช้:**
- มี Community และ Ecosystem ใหญ่
- Documentation ครบถ้วน
- Performance ดี ด้วย Virtual DOM
- เรียนรู้และใช้งานง่าย
- มี UI Libraries มากมาย (shadcn/ui, Material-UI)

### 2.2.2 TypeScript

**คำนิยาม:**
TypeScript เป็น Superset ของ JavaScript ที่เพิ่ม Static Type Checking

**ข้อดีของ TypeScript:**
1. **Type Safety:** ป้องกัน Type Errors ตั้งแต่ Compile Time
2. **Better IDE Support:** Autocomplete, IntelliSense
3. **Self-Documenting:** Code อธิบายตัวเองได้ดีขึ้น
4. **Refactoring ง่าย:** IDE ช่วย Refactor ได้อัตโนมัติ
5. **Catch Errors Early:** หา Bug ได้ก่อน Runtime

**ตัวอย่างการใช้งาน:**

```typescript
// Type Annotations
let name: string = "Attack on Titan";
let score: number = 95;
let isPopular: boolean = true;

// Interface
interface Anime {
  id: string;
  title: string;
  description: string;
  genres: string[];
  popularity_score: number;
  created_at: string;
}

// Type Alias
type AnimeFormat = 'TV Series' | 'Movie' | 'OVA' | 'ONA';

// Function Types
function createAnime(data: Anime): Promise<Anime> {
  return supabase.from('anime').insert([data]);
}

// Generics
function fetchData<T>(table: string): Promise<T[]> {
  return supabase.from(table).select('*');
}

// Union Types
type Status = 'loading' | 'success' | 'error';

// Optional Properties
interface AnimeForm {
  title: string;
  description?: string;  // Optional
  publisher?: string;
}
```

**Utility Types:**
```typescript
// Partial - ทำทุก property เป็น optional
type PartialAnime = Partial<Anime>;

// Required - ทำทุก property เป็น required
type RequiredAnime = Required<Anime>;

// Pick - เลือกเฉพาะบาง properties
type AnimePreview = Pick<Anime, 'id' | 'title' | 'image_url'>;

// Omit - ยกเว้นบาง properties
type AnimeWithoutDates = Omit<Anime, 'created_at' | 'updated_at'>;
```

### 2.2.3 Vite

**คำนิยาม:**
Vite เป็น Build Tool และ Development Server รุ่นใหม่ที่เร็วกว่า Create React App

**คุณสมบัติหลัก:**
1. **Lightning Fast HMR:** Hot Module Replacement ที่เร็วมาก
2. **Instant Server Start:** เริ่ม Dev Server ทันที
3. **Optimized Build:** Production Build ที่เล็กและเร็ว
4. **Native ESM:** ใช้ ES Modules ของ Browser
5. **Plugin Ecosystem:** มี Plugins มากมาย

**การตั้งค่า vite.config.ts:**
```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 8080,
    host: true,
  },
});
```

**เปรียบเทียบกับ Create React App:**

| Feature | Vite | CRA |
|---------|------|-----|
| Dev Server Start | <1s | 10-30s |
| HMR Speed | <100ms | 1-3s |
| Production Build | Faster | Slower |
| Bundle Size | Smaller | Larger |

### 2.2.4 Tailwind CSS

**คำนิยาม:**
Tailwind CSS เป็น Utility-first CSS Framework

**หลักการทำงาน:**
- ไม่มี Pre-built Components
- ใช้ Utility Classes เล็กๆ มาประกอบกัน
- Customizable ได้ทุกอย่าง

**ตัวอย่างการใช้งาน:**
```tsx
// แทนที่จะเขียน CSS แบบนี้
<div className="custom-card">
  <h2 className="custom-title">Title</h2>
</div>

// ใช้ Tailwind แบบนี้
<div className="p-6 bg-white rounded-lg shadow-md">
  <h2 className="text-2xl font-bold text-gray-800">Title</h2>
</div>
```

**Responsive Design:**
```tsx
// Mobile-first approach
<div className="
  w-full          // Base: Full width
  md:w-1/2        // Tablet: Half width
  lg:w-1/3        // Desktop: One third
  xl:w-1/4        // Large: One fourth
">
```

**Dark Mode:**
```tsx
<div className="
  bg-white        // Light mode
  dark:bg-gray-800  // Dark mode
  text-gray-900
  dark:text-white
">
```

**การปรับแต่งใน tailwind.config.ts:**
```typescript
export default {
  theme: {
    extend: {
      colors: {
        primary: 'hsl(var(--primary))',
        secondary: 'hsl(var(--secondary))',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
};
```

**ข้อดีของ Tailwind:**
- พัฒนาเร็วขึ้น (ไม่ต้องตั้งชื่อ class)
- Bundle Size เล็ก (PurgeCSS ลบ classes ที่ไม่ได้ใช้)
- Consistent Design System
- Responsive ง่าย

### 2.2.5 shadcn/ui

**คำนิยาม:**
shadcn/ui เป็นชุด Pre-built Components ที่ใช้ Radix UI + Tailwind CSS

**คุณสมบัติหลัก:**
1. **Copy-Paste Components:** Copy โค้ดมาใช้ได้เลย
2. **Fully Customizable:** แก้ไขได้ทุกอย่าง
3. **Accessible:** รองรับ ARIA attributes
4. **Beautiful Design:** สวยงามและทันสมัย

**Components ที่ใช้ในโครงงาน:**
```tsx
// Button
import { Button } from '@/components/ui/button';
<Button variant="default">Click me</Button>

// Input
import { Input } from '@/components/ui/input';
<Input type="text" placeholder="Search..." />

// Dialog
import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog';
<Dialog>
  <DialogContent>
    <DialogHeader>Title</DialogHeader>
    Content here
  </DialogContent>
</Dialog>

// Select
import { Select, SelectContent, SelectItem } from '@/components/ui/select';
<Select>
  <SelectContent>
    <SelectItem value="action">Action</SelectItem>
  </SelectContent>
</Select>

// Toast
import { useToast } from '@/components/ui/use-toast';
const { toast } = useToast();
toast({ title: "Success!", description: "Data saved" });

// Card
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>Content</CardContent>
</Card>
```

### 2.2.6 React Router

**คำนิยาม:**
React Router เป็น Library สำหรับจัดการ Routing ใน React Application

**คุณสมบัติหลัก:**
1. **Client-side Routing:** Navigate ไม่ต้อง Reload หน้า
2. **Nested Routes:** Route ซ้อน Route ได้
3. **Dynamic Routes:** Route ที่มี Parameters
4. **Protected Routes:** Route ที่ต้อง Authentication

**ตัวอย่างการใช้งาน:**
```tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<FrontHome />} />
        <Route path="/search" element={<FrontSearch />} />
        <Route path="/login" element={<Login />} />
        
        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/admin" element={<Dashboard />} />
          <Route path="/admin/anime" element={<AnimeList />} />
          <Route path="/admin/anime/new" element={<AnimeForm />} />
          <Route path="/admin/anime/:id/edit" element={<AnimeForm />} />
          <Route path="/admin/genres" element={<GenreManagement />} />
        </Route>
        
        {/* 404 Page */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
```

**Navigation:**
```tsx
import { useNavigate, Link } from 'react-router-dom';

// useNavigate Hook
function MyComponent() {
  const navigate = useNavigate();
  
  const handleClick = () => {
    navigate('/admin/anime');
  };
}

// Link Component
<Link to="/admin/anime">Go to Anime List</Link>
```

**URL Parameters:**
```tsx
import { useParams } from 'react-router-dom';

function AnimeDetail() {
  const { id } = useParams();
  // Use id to fetch anime data
}
```

---

## 2.3 เทคโนโลยี Backend

### 2.3.1 Supabase

**คำนิยาม:**
Supabase เป็น Open Source Backend-as-a-Service (BaaS) ที่เรียกว่า "Firebase Alternative"

**คุณสมบัติหลัก:**
1. **PostgreSQL Database:** Database ที่ทรงพลัง
2. **Authentication:** ระบบยืนยันตัวตนสำเร็จรูป
3. **Storage:** เก็บไฟล์และรูปภาพ
4. **Real-time:** อัพเดตข้อมูลแบบ Real-time
5. **Row Level Security:** ความปลอดภัยระดับแถว
6. **Auto-generated APIs:** สร้าง API อัตโนมัติ

**Architecture:**
```
Client Application
        ↓
Supabase Client Library
        ↓
┌─────────────────┐
│   Supabase      │
│   ┌──────────┐  │
│   │PostgREST │  │ → Auto REST API
│   └──────────┘  │
│   ┌──────────┐  │
│   │ GoTrue   │  │ → Authentication
│   └──────────┘  │
│   ┌──────────┐  │
│   │PostgreSQL│  │ → Database
│   └──────────┘  │
│   ┌──────────┐  │
│   │ Storage  │  │ → File Storage
│   └──────────┘  │
└─────────────────┘
```

**การเชื่อมต่อ:**
```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://yrpxaloyaeikodlhssmj.supabase.co';
const supabaseAnonKey = 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

**CRUD Operations:**
```typescript
// CREATE
const { data, error } = await supabase
  .from('anime')
  .insert([{ title: 'New Anime', genres: ['Action'] }])
  .select();

// READ
const { data, error } = await supabase
  .from('anime')
  .select('*')
  .eq('id', animeId)
  .single();

// UPDATE
const { data, error } = await supabase
  .from('anime')
  .update({ title: 'Updated Title' })
  .eq('id', animeId)
  .select();

// DELETE
const { error } = await supabase
  .from('anime')
  .delete()
  .eq('id', animeId);
```

**ข้อดีของ Supabase:**
- Setup ง่ายและเร็ว
- Free Tier ใช้งานได้เลย
- Open Source สามารถ Self-host ได้
- Real-time capabilities
- Automatic API generation
- Built-in Authentication

### 2.3.2 PostgreSQL

**คำนิยาม:**
PostgreSQL เป็น Open Source Relational Database Management System ที่ทรงพลังและเสถียร

**คุณสมบัติหลัก:**
1. **ACID Compliance:** รับประกัน Data Integrity
2. **Complex Queries:** รองรับ Query ที่ซับซ้อน
3. **Triggers & Functions:** สร้าง Business Logic ใน Database
4. **JSON Support:** เก็บและ Query JSON ได้
5. **Full-text Search:** ค้นหา Text ได้
6. **Extensions:** ขยายความสามารถได้

**Data Types ที่ใช้ในโครงงาน:**
```sql
-- Text Types
title TEXT NOT NULL
description TEXT

-- Numeric Types
popularity_score INTEGER DEFAULT 0

-- Date/Time Types
created_at TIMESTAMPTZ DEFAULT now()
first_aired DATE

-- UUID Type
id UUID PRIMARY KEY DEFAULT gen_random_uuid()

-- Array Type
genres TEXT[] DEFAULT '{}'
```

**Indexes:**
```sql
-- สร้าง Index สำหรับเร็วขึ้น
CREATE INDEX idx_anime_title ON anime(title);
CREATE INDEX idx_anime_genres ON anime USING GIN(genres);
CREATE INDEX idx_anime_popularity ON anime(popularity_score DESC);
```

**Triggers:**
```sql
-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_anime_updated_at
  BEFORE UPDATE ON anime
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

### 2.3.3 Row Level Security (RLS)

**คำนิยาม:**
RLS เป็นฟีเจอร์ของ PostgreSQL ที่ควบคุมการเข้าถึงข้อมูลในระดับแถว (Row)

**หลักการทำงาน:**
- กำหนด Policies สำหรับแต่ละ Operation (SELECT, INSERT, UPDATE, DELETE)
- ตรวจสอบเงื่อนไขก่อนอนุญาตให้เข้าถึงข้อมูล
- ป้องกันการเข้าถึงข้อมูลที่ไม่ได้รับอนุญาต

**ตัวอย่าง RLS Policies ในโครงงาน:**

```sql
-- เปิดใช้งาน RLS
ALTER TABLE anime ENABLE ROW LEVEL SECURITY;
ALTER TABLE genres ENABLE ROW LEVEL SECURITY;

-- Policy: ทุกคนอ่านได้ (SELECT)
CREATE POLICY "Allow public read access to anime"
  ON anime
  FOR SELECT
  USING (true);

-- Policy: เฉพาะ Authenticated users INSERT ได้
CREATE POLICY "Allow admin to insert anime"
  ON anime
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Policy: เฉพาะ Authenticated users UPDATE ได้
CREATE POLICY "Allow admin to update anime"
  ON anime
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Policy: เฉพาะ Authenticated users DELETE ได้
CREATE POLICY "Allow admin to delete anime"
  ON anime
  FOR DELETE
  TO authenticated
  USING (true);
```

**ประโยชน์ของ RLS:**
1. **Security by Default:** ปลอดภัยมากขึ้น
2. **Granular Control:** ควบคุมได้ละเอียด
3. **Database-level Security:** Security อยู่ที่ Database
4. **No Code Changes Needed:** ไม่ต้องแก้ไขโค้ด

### 2.3.4 Supabase Authentication

**คำนิยาม:**
Supabase Auth เป็นระบบการยืนยันตัวตนที่สร้างบน GoTrue

**คุณสมบัติ:**
1. **Email/Password Authentication**
2. **OAuth Providers:** Google, GitHub, etc.
3. **Magic Links:** Login ผ่าน Email
4. **Phone Authentication**
5. **JWT Tokens:** ใช้ JSON Web Tokens

**การใช้งานใน React:**

```typescript
// Sign In
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password123'
});

// Sign Out
const { error } = await supabase.auth.signOut();

// Get Current User
const { data: { user } } = await supabase.auth.getUser();

// Auth State Change
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_IN') {
    console.log('User signed in');
  } else if (event === 'SIGNED_OUT') {
    console.log('User signed out');
  }
});

// Check Session
const { data: { session } } = await supabase.auth.getSession();
```

**JWT Token Structure:**
```
Header.Payload.Signature

Payload contains:
- sub: User ID
- email: User email
- role: User role (authenticated, anon)
- exp: Expiration time
```

---

## 2.4 เครื่องมือทดสอบ

### 2.4.1 Jest

**คำนิยาม:**
Jest เป็น JavaScript Testing Framework ที่พัฒนาโดย Facebook

**คุณสมบัติหลัก:**
1. **Zero Config:** ใช้งานได้ทันทีโดยไม่ต้อง Config มาก
2. **Snapshot Testing:** เปรียบเทียบ Output
3. **Mocking:** Mock Functions, Modules
4. **Coverage Reports:** รายงาน Code Coverage
5. **Fast:** รัน Tests แบบ Parallel

**ตัวอย่างการเขียน Test:**
```typescript
// useAnimeData.test.ts
describe('useAnimeData Hook', () => {
  it('should fetch all anime successfully', async () => {
    const { result } = renderHook(() => useAnimeData());
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    
    expect(result.current.animeList).toHaveLength(3);
  });

  it('should create new anime', async () => {
    const { result } = renderHook(() => useAnimeData());
    
    const newAnime = {
      title: 'Test Anime',
      genres: ['Action']
    };
    
    await act(async () => {
      await result.current.createAnime(newAnime);
    });
    
    expect(result.current.animeList).toContainEqual(
      expect.objectContaining({ title: 'Test Anime' })
    );
  });
});
```

### 2.4.2 React Testing Library

**คำนิยาม:**
Library สำหรับทดสอบ React Components แบบเน้น User Behavior

**หลักการ:**
- ทดสอบแบบที่ User ใช้งานจริง
- ไม่ทดสอบ Implementation Details
- เน้น Accessibility

**Queries หลัก:**
```typescript
// getByText - หา Element จาก Text
const button = screen.getByText('เพิ่ม Anime');

// getByRole - หาจาก ARIA role
const heading = screen.getByRole('heading', { name: 'Dashboard' });

// getByLabelText - หาจาก Label
const input = screen.getByLabelText('ชื่อ Anime');

// getByPlaceholderText
const search = screen.getByPlaceholderText('ค้นหา...');

// getByTestId
const element = screen.getByTestId('anime-card');
```

**User Events:**
```typescript
import userEvent from '@testing-library/user-event';

// Click
await userEvent.click(button);

// Type
await userEvent.type(input, 'Attack on Titan');

// Select
await userEvent.selectOptions(select, 'Action');

// Clear
await userEvent.clear(input);
```

**ตัวอย่าง Component Test:**
```typescript
describe('AnimeForm Component', () => {
  it('should render all form fields', () => {
    render(<AnimeForm />);
    
    expect(screen.getByLabelText('ชื่อ Anime')).toBeInTheDocument();
    expect(screen.getByLabelText('รายละเอียด')).toBeInTheDocument();
    expect(screen.getByLabelText('Genres')).toBeInTheDocument();
  });

  it('should submit form with valid data', async () => {
    const onSubmit = jest.fn();
    render(<AnimeForm onSubmit={onSubmit} />);
    
    await userEvent.type(
      screen.getByLabelText('ชื่อ Anime'),
      'Attack on Titan'
    );
    
    await userEvent.click(screen.getByText('เพิ่ม Anime'));
    
    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Attack on Titan'
        })
      );
    });
  });
});
```

---

## 2.5 งานวิจัยที่เกี่ยวข้อง

### 2.5.1 ระบบจัดการข้อมูลภาพยนตร์และซีรีส์

**ชื่องานวิจัย:** "Movie and Series Management System using MERN Stack"  
**ผู้วิจัย:** Smith, J. (2022)  
**สถาบัน:** University of Technology

**สรุป:**
พัฒนาระบบจัดการข้อมูลภาพยนตร์ด้วย MongoDB, Express, React, และ Node.js มีระบบ CRUD สำหรับ Admin และหน้าค้นหาสำหรับ User

**จุดเด่น:**
- ใช้ MERN Stack
- มี RESTful API
- Responsive Design

**ความแตกต่าง:**
- โครงงานนี้ใช้ Supabase แทน Custom Backend
- เน้น TypeScript และ Type Safety
- มีระบบทดสอบที่ครบถ้วนกว่า

### 2.5.2 การประยุกต์ใช้ Row Level Security

**ชื่องานวิจัย:** "Implementing Row-Level Security in Multi-tenant SaaS Applications"  
**ผู้วิจัย:** Johnson, M. (2023)  
**สถาบัน:** Tech University

**สรุป:**
ศึกษาการใช้ RLS ในแอปพลิเคชัน SaaS เพื่อแยกข้อมูลของ Tenants แต่ละรายโดยไม่ต้องเขียนโค้ด Security ซ้ำๆ

**ประโยชน์ที่ได้:**
- เข้าใจหลักการทำงานของ RLS
- นำไปประยุกต์ในโครงงาน
- ทำให้ระบบปลอดภัยขึ้น

### 2.5.3 การทดสอบซอฟต์แวร์แบบอัตโนมัติ

**ชื่องานวิจัย:** "Automated Testing Strategies for React Applications"  
**ผู้วิจัย:** Lee, K. (2023)  
**สถาบัน:** Software Engineering Institute

**สรุป:**
เปรียบเทียบวิธีการทดสอบต่างๆ ใน React และเสนอ Best Practices

**การประยุกต์ใช้:**
- ใช้ Jest และ React Testing Library
- เขียน Test Cases ตาม Best Practices
- ทำ Integration Testing

---

## สรุปบทที่ 2

บทนี้ได้อธิบายทฤษฎีและเทคโนโลยีที่เกี่ยวข้องกับการพัฒนาระบบจัดการข้อมูล Anime ครอบคลุมทั้ง:

1. **ทฤษฎีพื้นฐาน:** DBMS, Client-Server, RESTful API, SPA, Component-based Architecture, State Management, Authentication & Authorization

2. **เทคโนโลยี Frontend:** React, TypeScript, Vite, Tailwind CSS, shadcn/ui, React Router

3. **เทคโนโลยี Backend:** Supabase, PostgreSQL, Row Level Security, Supabase Authentication

4. **เครื่องมือทดสอบ:** Jest, React Testing Library

5. **งานวิจัยที่เกี่ยวข้อง:** ระบบจัดการข้อมูลคล้ายกัน, การใช้ RLS, การทดสอบซอฟต์แวร์

ความรู้เหล่านี้เป็นพื้นฐานสำคัญในการพัฒนาระบบในบทถัดไป

---

**บทที่ 2 สิ้นสุด**
