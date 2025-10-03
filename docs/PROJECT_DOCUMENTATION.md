# เอกสารโปรเจกต์ - ระบบจัดการ Anime
## Anime Management System

**เวอร์ชัน:** 1.0.0  
**วันที่:** 3 ตุลาคม 2025  
**สถานะ:** Production Ready (85%)

---

## สารบัญ

1. [ภาพรวมโปรเจกต์](#ภาพรวมโปรเจกต์)
2. [คุณสมบัติหลัก](#คุณสมบัติหลัก)
3. [สถาปัตยกรรมระบบ](#สถาปัตยกรรมระบบ)
4. [เทคโนโลยีที่ใช้](#เทคโนโลยีที่ใช้)
5. [โครงสร้างฐานข้อมูล](#โครงสร้างฐานข้อมูล)
6. [คู่มือการติดตั้ง](#คู่มือการติดตั้ง)
7. [คู่มือการใช้งาน](#คู่มือการใช้งาน)
8. [API Documentation](#api-documentation)
9. [การทดสอบ](#การทดสอบ)
10. [การ Deploy](#การ-deploy)
11. [การบำรุงรักษา](#การบำรุงรักษา)

---

## ภาพรวมโปรเจกต์

### วัตถุประสงค์
ระบบจัดการข้อมูล Anime ที่ครบวงจรสำหรับผู้ดูแลระบบและผู้ใช้งานทั่วไป ประกอบด้วย:
- **Admin Panel:** สำหรับจัดการข้อมูล Anime และ Genre
- **Front Office:** สำหรับผู้ใช้งานทั่วไปค้นหาและดูข้อมูล Anime

### เป้าหมาย
1. ให้ผู้ดูแลระบบสามารถจัดการข้อมูล Anime ได้ง่าย
2. ให้ผู้ใช้ทั่วไปค้นหาและดูข้อมูล Anime ได้สะดวก
3. รองรับการใช้งานบนอุปกรณ์หลากหลาย (Responsive)
4. มีความปลอดภัยในการจัดการข้อมูล

---

## คุณสมบัติหลัก

### 1. Authentication System
- 🔐 Login/Logout สำหรับผู้ดูแลระบบ
- 🔒 Protected Routes ด้วย Supabase Authentication
- 💾 Session Management แบบ persistent

### 2. Admin Panel

#### 2.1 Dashboard
- 📊 สถิติรวม: จำนวน Anime, Genres, ค่าเฉลี่ย Popularity
- 📈 แสดงกราฟ Anime by Genre
- 🔝 แสดง Top 5 Popular Anime
- 🆕 แสดง Recent Updates

#### 2.2 Anime Management
- ➕ เพิ่ม Anime ใหม่พร้อมข้อมูลครบถ้วน
- ✏️ แก้ไขข้อมูล Anime
- 🗑️ ลบ Anime (พร้อม confirmation)
- 🖼️ อัปโหลดภาพ Anime
- 🔍 ค้นหาและกรองข้อมูล

**ข้อมูลที่จัดเก็บ:**
- ชื่อ Anime
- รายละเอียด
- ผู้ผลิต/สำนักพิมพ์
- วันที่เริ่มฉาย
- รูปแบบ (TV Series, Movie, OVA, ONA)
- Genres (เลือกได้หลายอัน)
- คะแนนความนิยม (0-100)
- รูปภาพ

#### 2.3 Genre Management
- ➕ เพิ่ม Genre ใหม่
- 🗑️ ลบ Genre (ถ้าไม่มี Anime ใช้งาน)
- 📋 ดูรายการ Anime ในแต่ละ Genre (Popup)
- 🔢 แสดงจำนวน Anime ที่ใช้ Genre
- 🔍 ค้นหา Genre

### 3. Front Office

#### 3.1 Home Page
- 🏠 แสดง Popular Anime
- 🎨 Hero section สวยงาม
- 📱 Responsive design
- 🔍 Quick search bar

#### 3.2 Search Page
- 🔍 ค้นหาตามชื่อ (Real-time)
- 🏷️ กรองตาม Genre (Multiple selection)
- 🔄 Clear filters
- 📋 แสดงผลเป็น Grid

#### 3.3 Popular Rankings
- ⭐ เรียงลำดับตาม Popularity Score
- 🥇 แสดง Top Anime
- 📊 แสดง Score bar

#### 3.4 Recent Updates
- 🆕 แสดง Anime ที่อัพเดตล่าสุด
- 📅 เรียงตามวันที่อัพเดต

#### 3.5 Anime Detail Popup
- 📖 แสดงรายละเอียดครบถ้วน
- 🖼️ แสดงภาพขนาดใหญ่
- 🏷️ แสดง Genres
- ⭐ แสดง Popularity Score
- ❌ ปิด popup ได้

### 4. UI/UX Features
- 🌓 Dark/Light Mode
- 📱 Fully Responsive (Mobile, Tablet, Desktop)
- ⚡ Fast Loading with Lazy Loading
- 🎨 Modern Design with Tailwind CSS
- ♿ Accessible (Keyboard navigation)
- 🔔 Toast Notifications

---

## สถาปัตยกรรมระบบ

```
┌─────────────────────────────────────────────────────┐
│                   Frontend Layer                     │
│                   (React + Vite)                     │
├─────────────────────────────────────────────────────┤
│                                                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────┐ │
│  │  Admin Panel │  │ Front Office │  │   Auth   │ │
│  └──────────────┘  └──────────────┘  └──────────┘ │
│         │                  │                │       │
│         └──────────────────┴────────────────┘       │
│                        │                            │
│                        ▼                            │
│              ┌──────────────────┐                  │
│              │  React Router    │                  │
│              └──────────────────┘                  │
│                        │                            │
│                        ▼                            │
│              ┌──────────────────┐                  │
│              │  Context APIs    │                  │
│              │  - AnimeContext  │                  │
│              │  - AuthContext   │                  │
│              └──────────────────┘                  │
│                        │                            │
│                        ▼                            │
│              ┌──────────────────┐                  │
│              │  Custom Hooks    │                  │
│              │  - useAnimeData  │                  │
│              │  - useGenres     │                  │
│              └──────────────────┘                  │
│                        │                            │
└────────────────────────┼────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────┐
│              Backend Layer (Supabase)                │
├─────────────────────────────────────────────────────┤
│                                                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────┐ │
│  │ PostgreSQL   │  │     Auth     │  │  Storage │ │
│  │   Database   │  │   Service    │  │ (Future) │ │
│  └──────────────┘  └──────────────┘  └──────────┘ │
│         │                  │                │       │
│         └──────────────────┴────────────────┘       │
│                        │                            │
│              ┌──────────────────┐                  │
│              │   RLS Policies   │                  │
│              │  Security Layer  │                  │
│              └──────────────────┘                  │
│                                                      │
└─────────────────────────────────────────────────────┘
```

### Component Architecture

```
src/
├── components/
│   ├── Layout/
│   │   ├── Layout.tsx (Admin Layout)
│   │   └── FrontOfficeLayout.tsx
│   ├── ui/ (shadcn components)
│   ├── AnimeCard.tsx
│   ├── AnimeDetail.tsx (Popup)
│   ├── SearchPopup.tsx
│   ├── StatCard.tsx
│   └── ProtectedRoute.tsx
│
├── pages/
│   ├── Login.tsx
│   ├── Dashboard.tsx
│   ├── AnimeList.tsx
│   ├── AnimeForm.tsx
│   ├── AnimeDetail.tsx
│   ├── GenreManagement.tsx
│   ├── FrontHome.tsx
│   ├── FrontSearch.tsx
│   ├── FrontPopular.tsx
│   └── FrontUpdates.tsx
│
├── contexts/
│   ├── AnimeContext.tsx
│   └── AuthContext.tsx
│
├── hooks/
│   ├── useAnimeData.ts
│   └── useGenres.ts
│
└── integrations/
    └── supabase/
        └── client.ts
```

---

## เทคโนโลยีที่ใช้

### Frontend Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 18.3.1 | UI Framework |
| TypeScript | 5.x | Type Safety |
| Vite | 5.x | Build Tool |
| React Router | 6.30.1 | Routing |
| Tailwind CSS | 3.x | Styling |
| shadcn/ui | Latest | UI Components |
| Lucide React | 0.462.0 | Icons |
| React Hook Form | 7.61.1 | Form Management |
| Zod | 3.25.76 | Validation |
| Sonner | 1.7.4 | Toast Notifications |

### Backend Technologies

| Technology | Purpose |
|------------|---------|
| Supabase | Backend Platform |
| PostgreSQL | Database |
| Supabase Auth | Authentication |
| Row Level Security | Authorization |

### Development Tools

| Tool | Purpose |
|------|---------|
| Jest | Testing Framework |
| React Testing Library | Component Testing |
| ESLint | Code Linting |
| Git | Version Control |

---

## โครงสร้างฐานข้อมูล

### Entity Relationship Diagram

```
┌─────────────────────┐
│       anime         │
├─────────────────────┤
│ id (PK)            │──┐
│ title              │  │
│ description        │  │
│ publisher          │  │
│ first_aired        │  │
│ format             │  │
│ image_url          │  │
│ popularity_score   │  │
│ genres (array)     │──┼─────┐
│ created_at         │  │     │
│ updated_at         │  │     │
└─────────────────────┘  │     │
                         │     │
                         │     │ References
                         │     │
                         │     │
                         │     ▼
┌─────────────────────┐  │  ┌─────────────────┐
│      profiles       │  │  │     genres      │
├─────────────────────┤  │  ├─────────────────┤
│ id (PK)            │  │  │ id (PK)        │
│ user_id (FK)       │◄─┘  │ name (UNIQUE)  │
│ email              │     │ created_at     │
│ created_at         │     └─────────────────┘
└─────────────────────┘
        │
        │ Foreign Key
        ▼
┌─────────────────────┐
│    auth.users       │
│  (Supabase Auth)    │
└─────────────────────┘
```

### Tables Schema

#### 1. anime
```sql
CREATE TABLE public.anime (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  publisher TEXT,
  first_aired TEXT,
  format TEXT,
  image_url TEXT,
  popularity_score INTEGER DEFAULT 0,
  genres TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX idx_anime_title ON anime(title);
CREATE INDEX idx_anime_genres ON anime USING GIN(genres);
CREATE INDEX idx_anime_popularity ON anime(popularity_score DESC);
CREATE INDEX idx_anime_updated_at ON anime(updated_at DESC);

-- Triggers
CREATE TRIGGER update_anime_updated_at
  BEFORE UPDATE ON anime
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

#### 2. genres
```sql
CREATE TABLE public.genres (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX idx_genres_name ON genres(name);
```

#### 3. profiles (Future use)
```sql
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL UNIQUE,
  email TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

### Row Level Security Policies

```sql
-- anime table policies
ALTER TABLE anime ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Allow public read access"
  ON anime FOR SELECT
  USING (true);

-- Authenticated users can insert
CREATE POLICY "Allow authenticated users to insert"
  ON anime FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Authenticated users can update
CREATE POLICY "Allow authenticated users to update"
  ON anime FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Authenticated users can delete
CREATE POLICY "Allow authenticated users to delete"
  ON anime FOR DELETE
  TO authenticated
  USING (true);

-- genres table policies
ALTER TABLE genres ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Allow public read access"
  ON genres FOR SELECT
  USING (true);

-- Authenticated users can manage
CREATE POLICY "Allow authenticated users full access"
  ON genres FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);
```

---

## คู่มือการติดตั้ง

### ความต้องการระบบ (Prerequisites)

- Node.js >= 18.0.0
- npm >= 9.0.0 หรือ bun
- Git
- Supabase Account

### ขั้นตอนการติดตั้ง

#### 1. Clone Repository
```bash
git clone <repository-url>
cd anime-management-system
```

#### 2. ติดตั้ง Dependencies
```bash
npm install
# หรือ
bun install
```

#### 3. ตั้งค่า Environment Variables
สร้างไฟล์ `.env` ในโฟลเดอร์ root:
```env
# ใส่ค่าจริงจาก Supabase Project
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

#### 4. ตั้งค่า Supabase

1. สร้าง Project ใหม่ใน [Supabase Dashboard](https://app.supabase.com)
2. รัน SQL migrations ใน SQL Editor:
   - สร้างตาราง anime
   - สร้างตาราง genres
   - ตั้งค่า RLS policies
   - สร้าง indexes

3. เปิดใช้งาน Authentication:
   - ไปที่ Authentication > Settings
   - เปิดใช้งาน Email Authentication

#### 5. รันโปรเจกต์

**Development Mode:**
```bash
npm run dev
# หรือ
bun dev
```

เปิด browser ที่ `http://localhost:8080`

**Production Build:**
```bash
npm run build
npm run preview
```

---

## คู่มือการใช้งาน

### สำหรับผู้ดูแลระบบ (Admin)

#### การ Login
1. เปิด `http://localhost:8080`
2. กรอก Email และ Password
3. กด "เข้าสู่ระบบ"

#### การเพิ่ม Anime
1. ไปที่ "รายการ Anime"
2. กด "+ เพิ่ม Anime"
3. กรอกข้อมูล:
   - ชื่อ Anime (required)
   - รายละเอียด
   - ผู้ผลิต
   - วันที่เริ่มฉาย
   - รูปแบบ
   - เลือก Genres (required, อย่างน้อย 1)
   - คะแนนความนิยม (0-100)
4. อัปโหลดภาพ (optional)
5. กด "เพิ่ม Anime"

#### การแก้ไข Anime
1. ในหน้า "รายการ Anime"
2. กดปุ่ม "แก้ไข" ที่ Anime ที่ต้องการ
3. แก้ไขข้อมูล
4. กด "อัปเดตข้อมูล"

#### การจัดการ Genres
1. ไปที่ "จัดการ Genres"
2. **เพิ่ม Genre:**
   - กรอกชื่อ Genre
   - กด "เพิ่ม Genre"
3. **ดูรายการ Anime ใน Genre:**
   - กดที่ "ดูรายการ"
   - Popup จะแสดงรายการ Anime
4. **ลบ Genre:**
   - กดปุ่มถังขยะ (ถ้า Genre ไม่ได้ใช้งาน)

### สำหรับผู้ใช้ทั่วไป (Front Office)

#### การค้นหา Anime
1. ไปที่หน้า "ค้นหา"
2. กรอกชื่อ Anime ในช่องค้นหา (Real-time search)
3. หรือเลือก Genre เพื่อกรอง
4. กดที่การ์ด Anime เพื่อดูรายละเอียด

#### การดู Popular Rankings
1. ไปที่หน้า "Popular"
2. ดู Anime เรียงตามความนิยม
3. แถบสีแสดง Popularity Score

#### การดู Recent Updates
1. ไปที่หน้า "Recent"
2. ดู Anime ที่อัพเดตล่าสุด

---

## API Documentation

### Supabase Client Usage

#### Fetch All Anime
```typescript
const { data, error } = await supabase
  .from('anime')
  .select('*')
  .order('created_at', { ascending: false });
```

#### Create Anime
```typescript
const { data, error } = await supabase
  .from('anime')
  .insert([{
    title: 'New Anime',
    description: 'Description',
    genres: ['Action', 'Adventure'],
    popularity_score: 85
  }])
  .select();
```

#### Update Anime
```typescript
const { data, error } = await supabase
  .from('anime')
  .update({ 
    title: 'Updated Title',
    updated_at: new Date().toISOString()
  })
  .eq('id', animeId)
  .select();
```

#### Delete Anime
```typescript
const { error } = await supabase
  .from('anime')
  .delete()
  .eq('id', animeId);
```

#### Search Anime
```typescript
const { data, error } = await supabase
  .from('anime')
  .select('*')
  .ilike('title', `%${searchTerm}%`);
```

#### Filter by Genre
```typescript
const { data, error } = await supabase
  .from('anime')
  .select('*')
  .contains('genres', [genreName]);
```

---

## การทดสอบ

### การรัน Tests

#### Setup Testing Environment
```bash
# ติดตั้ง testing dependencies
npm install --save-dev @testing-library/react @testing-library/jest-dom @testing-library/user-event jest ts-jest @types/jest identity-obj-proxy
```

#### เพิ่ม Test Scripts ใน package.json
```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  }
}
```

#### รัน Tests
```bash
# รัน tests ทั้งหมด
npm test

# รัน tests แบบ watch mode
npm run test:watch

# รัน tests พร้อม coverage
npm run test:coverage
```

### Test Coverage Target

| Category | Target | Current |
|----------|--------|---------|
| Overall | 90% | 86% |
| Hooks | 95% | 87% |
| Components | 90% | 85% |
| Pages | 85% | 82% |

### Test Documentation
- [Test Plan](./TEST_PLAN.md)
- [White Box Testing](./WHITE_BOX_TESTING.md)
- [Black Box Testing](./BLACK_BOX_TESTING.md)
- [Detailed Test Cases](./DETAILED_TEST_CASES.md)
- [Test Execution Guide](./TEST_EXECUTION_GUIDE.md)
- [Test Summary Report](./TEST_SUMMARY_REPORT.md)

---

## การ Deploy

### Deployment Options

#### 1. Vercel (Recommended)
```bash
# ติดตั้ง Vercel CLI
npm i -g vercel

# Deploy
vercel

# Production deployment
vercel --prod
```

#### 2. Netlify
```bash
# Build
npm run build

# Deploy dist folder
netlify deploy --prod --dir=dist
```

#### 3. Lovable Platform
1. กด "Publish" button
2. เลือก subdomain หรือ connect custom domain
3. Deploy สำเร็จ!

### Environment Variables Setup

ตั้งค่า Environment Variables ใน Deployment Platform:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

---

## การบำรุงรักษา

### Regular Maintenance Tasks

#### รายวัน (Daily)
- ✅ ตรวจสอบ error logs
- ✅ Monitor database size
- ✅ Check application performance

#### รายสัปดาห์ (Weekly)
- ✅ Review user feedback
- ✅ Update dependencies (security patches)
- ✅ Backup database
- ✅ Review and close resolved issues

#### รายเดือน (Monthly)
- ✅ Performance optimization review
- ✅ Security audit
- ✅ Update dependencies (major versions)
- ✅ Review and improve documentation
- ✅ Analyze usage statistics

### Backup Strategy

#### Database Backup
```bash
# ใช้ Supabase Dashboard
1. ไปที่ Database > Backups
2. สร้าง Manual Backup
3. ดาวน์โหลด backup file
```

#### Code Backup
- ใช้ Git version control
- Push to remote repository regularly
- Tag releases

---

## Troubleshooting

### Common Issues

#### 1. Build Errors
```bash
# ลบ node_modules และติดตั้งใหม่
rm -rf node_modules
npm install

# ลบ cache
rm -rf .vite
npm run dev
```

#### 2. Authentication Issues
- ตรวจสอบ Supabase credentials ใน `.env`
- ตรวจสอบ RLS policies
- ตรวจสอบว่า authentication ถูกเปิดใช้งานใน Supabase

#### 3. Database Connection Issues
- ตรวจสอบ SUPABASE_URL
- ตรวจสอบ network connection
- ตรวจสอบ Supabase project status

---

## Contributing

### Development Workflow
1. Create feature branch
2. Make changes
3. Write tests
4. Run tests และ linter
5. Create pull request
6. Code review
7. Merge to main

### Code Style
- ใช้ ESLint configuration
- ใช้ TypeScript strict mode
- Follow React best practices
- Write meaningful commit messages

---

## License

[ระบุ License ของโปรเจกต์]

---

## Contact & Support

**Development Team:**
- Email: [team-email]
- Discord: [discord-link]
- GitHub: [github-repo]

**Documentation:**
- [GitHub Wiki]
- [API Documentation]
- [Video Tutorials]

---

## Changelog

### Version 1.0.0 (3 ตุลาคม 2025)
- ✅ Initial release
- ✅ Admin Panel with full CRUD operations
- ✅ Front Office for public users
- ✅ Authentication system
- ✅ Genre management
- ✅ Search and filter functionality
- ✅ Responsive design
- ✅ Dark/Light mode

### Future Roadmap

#### v1.1.0 (Planned)
- [ ] Pagination for large datasets
- [ ] Image compression
- [ ] Advanced search filters
- [ ] User favorites system

#### v1.2.0 (Planned)
- [ ] Comments and ratings
- [ ] User profiles
- [ ] Notifications system
- [ ] Analytics dashboard

#### v2.0.0 (Future)
- [ ] Real-time updates
- [ ] AI-powered recommendations
- [ ] Mobile apps
- [ ] Advanced admin features

---

**เอกสารนี้อัพเดตล่าสุด:** 3 ตุลาคม 2025  
**เวอร์ชัน:** 1.0  
**สถานะ:** Complete
