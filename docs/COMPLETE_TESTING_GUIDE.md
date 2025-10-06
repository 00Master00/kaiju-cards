# คู่มือการทดสอบแบบสมบูรณ์ (Complete Testing Guide)
## Anime Management System

---

## 📚 Table of Contents

1. [บทนำ](#บทนำ)
2. [White Box Testing Guide](#white-box-testing-guide)
3. [Black Box Testing Guide](#black-box-testing-guide)
4. [Test Data Sets](#test-data-sets)
5. [Testing Tools & Setup](#testing-tools--setup)
6. [Step-by-Step Testing Procedures](#step-by-step-testing-procedures)
7. [Bug Reporting Guidelines](#bug-reporting-guidelines)
8. [Best Practices](#best-practices)

---

## บทนำ

### วัตถุประสงค์ของเอกสาร
เอกสารนี้เป็นคู่มือสำหรับการทดสอบระบบ Anime Management System แบบ Manual Testing ครอบคลุมทั้ง White Box และ Black Box Testing

### กลุ่มเป้าหมาย
- Software Testers
- QA Engineers
- นักศึกษาสหกิจศึกษา
- Developers ที่ต้องการทดสอบระบบ

### โครงสร้างระบบที่ทดสอบ
```
Anime Management System
│
├── Backend: Supabase (PostgreSQL + Auth + Storage)
├── Frontend: React + TypeScript + Tailwind CSS
├── State Management: Context API
└── Routing: React Router DOM
```

---

## White Box Testing Guide

### 1. ทำความเข้าใจ White Box Testing

**คำนิยาม:** การทดสอบโดยมองเห็นโค้ดและโครงสร้างภายใน ตรวจสอบ logic, data flow, และ code paths

**เป้าหมาย:**
- ✅ ทดสอบทุก code path
- ✅ ตรวจสอบ logic ถูกต้อง
- ✅ หา bugs ใน internal logic
- ✅ วัด code coverage

---

### 2. การเตรียมพร้อมสำหรับ White Box Testing

#### 2.1 เครื่องมือที่ต้องใช้

1. **Browser DevTools**
   - Network tab: ดู API calls
   - Console: ดู logs และ errors
   - Sources: debug โค้ด
   - Application: ดู localStorage, cookies

2. **React DevTools**
   - Components: ดู component tree, props, state
   - Profiler: วัด performance
   
3. **Supabase Dashboard**
   - Table Editor: ดูข้อมูลใน database
   - SQL Editor: รัน queries
   - Logs: ดู database logs
   - Storage: ดูไฟล์ที่อัพโหลด

#### 2.2 การศึกษา Source Code

ก่อนเริ่มทดสอบ ควรอ่านไฟล์เหล่านี้:
```
src/hooks/useAnimeData.ts        -> CRUD operations
src/hooks/useGenres.ts           -> Genre management
src/contexts/AuthContext.tsx     -> Authentication
src/contexts/AnimeContext.tsx    -> State management
src/pages/AnimeForm.tsx          -> Form validation
src/pages/GenreManagement.tsx    -> Genre logic
```

---

### 3. White Box Test Cases แบบละเอียด

#### 3.1 Testing useAnimeData Hook

**เป้าหมาย:** ทดสอบทุก function และ code path ใน useAnimeData

##### Test Case WB-001: fetchAnime() Success Path

**Code Path:**
```typescript
fetchAnime() {
  setLoading(true);           // Path 1
  try {
    const { data, error } = await supabase
      .from('anime')
      .select('*, genres(*)')
      .order('created_at', { ascending: false });
    
    if (error) throw error;    // Path 2 (not taken)
    setAnimeList(data);        // Path 3
  } catch (error) {
    toast.error(...);          // Path 4 (not taken)
  } finally {
    setLoading(false);         // Path 5 (always)
  }
}
```

**วิธีทดสอบ:**

1. เปิด DevTools → Network tab
2. เปิดหน้า Anime List
3. ดู XHR request ไปยัง Supabase
4. ตรวจสอบ:
   ```
   Request URL: https://[project-id].supabase.co/rest/v1/anime?select=*,genres(*)&order=created_at.desc
   Method: GET
   Status: 200 OK
   ```
5. ตรวจสอบ Response:
   ```json
   [
     {
       "id": "uuid",
       "title": "Attack on Titan",
       "genres": [{"id": "...", "name": "Action"}]
     }
   ]
   ```
6. เปิด React DevTools → Components → AnimeList
7. ตรวจสอบ state:
   ```
   animeList: [...] // มีข้อมูล
   loading: false
   ```

**Expected Results:**
- ✅ SELECT query ถูกต้อง
- ✅ JOIN กับ genres table
- ✅ ORDER BY created_at DESC
- ✅ State updated ด้วยข้อมูล
- ✅ Loading เป็น false

**Actual Results:** ________________________

---

##### Test Case WB-002: fetchAnime() Error Path

**Code Path:** ทดสอบเมื่อ API error

**วิธีทดสอบ:**

1. เปิด DevTools → Network tab
2. คลิกขวาที่ XHR request
3. เลือก "Block request URL"
4. Refresh หน้า
5. ดู Console errors
6. ตรวจสอบ toast notification

**Expected Results:**
- ✅ Error caught ใน catch block
- ✅ Toast error แสดง
- ✅ Loading เป็น false
- ✅ animeList เป็น [] หรือ old data

**Actual Results:** ________________________

---

##### Test Case WB-003: createAnime() with Validation

**Code Path:**
```typescript
createAnime(animeData) {
  // Validation
  if (!animeData.title) {              // Branch 1
    toast.error('กรุณากรอกชื่อ Anime');
    return;
  }
  if (!animeData.genres.length) {      // Branch 2
    toast.error('กรุณาเลือก Genre');
    return;
  }
  
  // Insert
  const { data, error } = await supabase
    .from('anime')
    .insert([animeData])
    .select();
    
  if (error) {                          // Branch 3
    toast.error('เกิดข้อผิดพลาด');
    return;
  }
  
  toast.success('เพิ่ม Anime สำเร็จ');  // Branch 4
}
```

**Test Matrix:**

| Test | Title | Genres | Expected Branch | Expected Result |
|------|-------|--------|----------------|-----------------|
| 1 | "" | ["Action"] | Branch 1 | Error toast "กรุณากรอกชื่อ" |
| 2 | "Naruto" | [] | Branch 2 | Error toast "กรุณาเลือก Genre" |
| 3 | "Naruto" | ["Action"] | Branch 4 | Success, INSERT |
| 4 | Simulate DB error | - | Branch 3 | Error toast |

**วิธีทดสอบ Test 1:**

1. ไปที่หน้า Add Anime
2. เว้นชื่อว่าง
3. เลือก Genre: Action
4. คลิก Submit
5. ดู toast message
6. ตรวจสอบว่าไม่มี INSERT query ใน Network tab

**Expected:** Toast error "กรุณากรอกชื่อ Anime", ไม่มี INSERT

**Actual:** ________________________

---

#### 3.2 Testing useGenres Hook

##### Test Case WB-004: addGenre() with Duplicate Check

**Code Path:**
```typescript
addGenre(name: string) {
  const trimmedName = name.trim();          // Step 1
  if (!trimmedName) {                       // Branch 1
    toast.error('กรุณากรอกชื่อ Genre');
    return;
  }
  
  try {
    const { error } = await supabase
      .from('genres')
      .insert([{ name: trimmedName }]);
    
    if (error?.code === '23505') {          // Branch 2 (UNIQUE violation)
      toast.error('Genre นี้มีอยู่แล้ว');
      return;
    }
    
    toast.success('เพิ่ม Genre สำเร็จ');     // Branch 3
    refreshGenres();
  } catch (error) {
    toast.error('เกิดข้อผิดพลาด');          // Branch 4
  }
}
```

**Test Cases:**

**Test 1: Empty Name**
```
Input: ""
Expected: Branch 1, Error toast "กรุณากรอกชื่อ Genre"
Steps:
1. ไปหน้า Genre Management
2. เว้นชื่อว่าง คลิก Add
3. ดู toast
```

**Test 2: Whitespace Trimming**
```
Input: "  Romance  "
Expected: trim เป็น "Romance", INSERT "Romance"
Steps:
1. พิมพ์ "  Romance  " (มี space)
2. คลิก Add
3. เปิด DevTools → Network → ดู POST request
4. ตรวจสอบ payload: {"name": "Romance"}
```

**Test 3: Duplicate Genre**
```
Input: "Action" (already exists)
Expected: Branch 2, Error toast "Genre นี้มีอยู่แล้ว"
Steps:
1. พิมพ์ "Action"
2. คลิก Add
3. ดู Network response: Status 409 หรือ error code 23505
4. ดู toast error
```

**Results:**

| Test | Input | Expected Branch | Actual Branch | Status |
|------|-------|----------------|---------------|--------|
| 1 | "" | Branch 1 | __________ | ⬜ |
| 2 | "  Romance  " | Trim + Insert | __________ | ⬜ |
| 3 | "Action" | Branch 2 | __________ | ⬜ |

---

#### 3.3 Testing Authentication Logic

##### Test Case WB-005: signIn() Flow

**Code to Inspect:**
```typescript
// src/contexts/AuthContext.tsx
const signIn = async (email: string, password: string) => {
  try {
    setLoading(true);                                    // Step 1
    
    const { data, error } = await supabase.auth
      .signInWithPassword({ email, password });          // Step 2
    
    if (error) {                                         // Branch 1
      toast.error('เข้าสู่ระบบไม่สำเร็จ');
      return;
    }
    
    setUser(data.user);                                  // Step 3
    setSession(data.session);                            // Step 4
    toast.success('เข้าสู่ระบบสำเร็จ');
    navigate('/admin');                                   // Step 5
  } catch (error) {
    toast.error('เกิดข้อผิดพลาด');                       // Branch 2
  } finally {
    setLoading(false);                                   // Step 6
  }
};
```

**วิธีทดสอบ Success Path:**

1. เปิด DevTools → Application → Storage → Local Storage
2. Clear all data
3. ไปหน้า Login
4. กรอก: admin@test.com / password123
5. เปิด Network tab
6. คลิก Login
7. **ตรวจสอบ Network:**
   ```
   Request URL: https://[id].supabase.co/auth/v1/token?grant_type=password
   Method: POST
   Payload: {"email": "admin@test.com", "password": "password123"}
   Response: {"access_token": "...", "user": {...}}
   ```
8. **ตรวจสอบ Local Storage:**
   ```
   Key: supabase.auth.token
   Value: {"access_token": "...", "refresh_token": "..."}
   ```
9. **ตรวจสอบ React DevTools:**
   ```
   AuthContext:
     user: { id: "...", email: "admin@test.com" }
     session: { access_token: "..." }
   ```
10. **ตรวจสอบ Navigation:**
    ```
    URL: http://localhost:5173/admin
    ```

**Expected Results:**
- ✅ POST request to auth API
- ✅ Response status 200
- ✅ Token stored in localStorage
- ✅ User state updated
- ✅ Navigate to /admin
- ✅ Toast success shown

**Actual Results:** ________________________

---

**วิธีทดสอบ Error Path:**

1. กรอก wrong password
2. คลิก Login
3. **ตรวจสอบ Console:**
   ```
   Error: Invalid login credentials
   ```
4. **ตรวจสอบ Toast:** Error message แสดง
5. **ตรวจสอบ URL:** ยังอยู่ที่หน้า login
6. **ตรวจสอบ State:**
   ```
   user: null
   session: null
   ```

---

#### 3.4 Testing Form Validation Logic

##### Test Case WB-006: AnimeForm Validation Paths

**Code:**
```typescript
const handleSubmit = (e: FormEvent) => {
  e.preventDefault();
  
  // Validation Path 1
  if (!title.trim()) {
    toast.error('กรุณากรอกชื่อ Anime');
    return;
  }
  
  // Validation Path 2
  if (selectedGenres.length === 0) {
    toast.error('กรุณาเลือกอย่างน้อย 1 Genre');
    return;
  }
  
  // Validation Path 3
  if (popularityScore < 0 || popularityScore > 100) {
    toast.error('คะแนนต้องอยู่ระหว่าง 0-100');
    return;
  }
  
  // Submit Path
  createAnime({...});
};
```

**Test Decision Table:**

| Test | Title | Genres | Score | Expected Path | Expected Result |
|------|-------|--------|-------|---------------|-----------------|
| 1 | "" | ["Action"] | 50 | Path 1 | Error: กรุณากรอกชื่อ |
| 2 | "Naruto" | [] | 50 | Path 2 | Error: เลือก Genre |
| 3 | "Naruto" | ["Action"] | -5 | Path 3 | Error: คะแนน 0-100 |
| 4 | "Naruto" | ["Action"] | 101 | Path 3 | Error: คะแนน 0-100 |
| 5 | "Naruto" | ["Action"] | 50 | Submit | Success |

**วิธีทดสอบ:**

สำหรับแต่ละ test:
1. ไปหน้า Add Anime
2. กรอกข้อมูลตาม Test Table
3. คลิก Submit
4. **ตรวจสอบ Console** เพื่อดู validation flow
5. **ตรวจสอบ Toast** message
6. **ตรวจสอบ Network tab** ว่ามี POST request หรือไม่

**Add Breakpoints (สำหรับ debugging):**
1. เปิด DevTools → Sources
2. หาไฟล์ `AnimeForm.tsx`
3. ใส่ breakpoint ที่แต่ละ if statement
4. Submit form และดู execution flow

---

### 4. White Box Testing Checklist สรุป

#### 4.1 Code Path Coverage Checklist

**useAnimeData:**
- [ ] fetchAnime() - success path
- [ ] fetchAnime() - error path
- [ ] createAnime() - valid data
- [ ] createAnime() - invalid title
- [ ] createAnime() - invalid genres
- [ ] createAnime() - database error
- [ ] updateAnime() - success
- [ ] updateAnime() - error
- [ ] getAnimeById() - found
- [ ] getAnimeById() - not found

**useGenres:**
- [ ] fetchGenres() - success
- [ ] addGenre() - valid name
- [ ] addGenre() - empty name
- [ ] addGenre() - duplicate name
- [ ] addGenre() - whitespace trim
- [ ] deleteGenre() - success
- [ ] deleteGenre() - error

**AuthContext:**
- [ ] signIn() - valid credentials
- [ ] signIn() - invalid email
- [ ] signIn() - invalid password
- [ ] signIn() - network error
- [ ] signOut() - success
- [ ] session persistence
- [ ] auto logout on expire

**Form Validation:**
- [ ] All required field checks
- [ ] All array/length checks
- [ ] All numeric range checks
- [ ] All string format checks
- [ ] All trim operations
- [ ] All error messages

---

## Black Box Testing Guide

### 1. ทำความเข้าใจ Black Box Testing

**คำนิยาม:** การทดสอบโดยไม่มองโค้ด เน้นทดสอบ functionality จากมุมมอง user

**เป้าหมาย:**
- ✅ ทดสอบทุก feature ตาม requirements
- ✅ ทดสอบ user interface
- ✅ ทดสอบ user experience
- ✅ หา bugs ที่ user จะพบ

---

### 2. Black Box Test Techniques

#### 2.1 Equivalence Partitioning

**คำนิยาม:** แบ่งข้อมูล input เป็นกลุ่มที่ได้ผลเหมือนกัน

**ตัวอย่าง: Popularity Score (0-100)**

| Partition | Range | Test Value | Expected |
|-----------|-------|------------|----------|
| Invalid (below) | < 0 | -5 | Error หรือ rejected |
| Valid (low) | 0-33 | 20 | Accept |
| Valid (mid) | 34-66 | 50 | Accept |
| Valid (high) | 67-100 | 90 | Accept |
| Invalid (above) | > 100 | 105 | Error หรือ rejected |

**การทดสอบ:**
- เลือกทดสอบ 1 ค่าจากแต่ละ partition
- ถ้า partition มีพฤติกรรมเหมือนกัน ไม่ต้องทดสอบทุกค่า

---

#### 2.2 Boundary Value Analysis

**คำนิยาม:** ทดสอบค่าขอบเขต (min, max, just inside, just outside)

**ตัวอย่าง: Title Length (1-200 chars)**

| Test | Value | Length | Expected |
|------|-------|--------|----------|
| 1 | "" | 0 | ❌ Error |
| 2 | "A" | 1 | ✅ Accept |
| 3 | "AB" | 2 | ✅ Accept |
| 4 | "A" * 199 | 199 | ✅ Accept |
| 5 | "A" * 200 | 200 | ✅ Accept |
| 6 | "A" * 201 | 201 | ❌ Error or truncate |

**วิธีทดสอบ:**
1. ใช้ Browser Console generate string:
   ```javascript
   "A".repeat(200)  // สร้าง string ยาว 200 ตัว
   ```
2. Copy paste ใส่ form
3. Submit และดูผล

---

#### 2.3 State Transition Testing

**ตัวอย่าง: Login State Machine**

```
States:
- LOGGED_OUT
- LOGGING_IN
- LOGGED_IN
- ERROR

Transitions:
1. LOGGED_OUT --[click login]--> LOGGING_IN
2. LOGGING_IN --[auth success]--> LOGGED_IN
3. LOGGING_IN --[auth fail]--> ERROR
4. ERROR --[retry]--> LOGGING_IN
5. LOGGED_IN --[logout]--> LOGGED_OUT
6. LOGGED_IN --[session expire]--> LOGGED_OUT
```

**Test Cases:**

| Test | Start State | Action | Expected End State |
|------|-------------|--------|--------------------|
| 1 | LOGGED_OUT | Click login with valid creds | LOGGED_IN |
| 2 | LOGGED_OUT | Click login with invalid creds | ERROR |
| 3 | ERROR | Click login again | LOGGING_IN |
| 4 | LOGGED_IN | Click logout | LOGGED_OUT |
| 5 | LOGGED_IN | Wait for timeout | LOGGED_OUT |

---

### 3. Black Box Test Cases แบบละเอียด

#### 3.1 Authentication Testing

##### BB-001: Login with Valid Credentials

**Objective:** ทดสอบการ login ที่ถูกต้อง

**Preconditions:**
- User account exists: admin@test.com / password123
- Currently logged out

**Test Steps:**

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | เปิดเว็บไซต์ | แสดงหน้า Login |
| 2 | กรอก Email: admin@test.com | ข้อความปรากฏใน input |
| 3 | กรอก Password: password123 | แสดงเป็น bullets (•••) |
| 4 | คลิกปุ่ม "เข้าสู่ระบบ" | Loading indicator ปรากฏ |
| 5 | รอ 1-2 วินาที | Login สำเร็จ |
| 6 | - | Redirect ไปหน้า /admin |
| 7 | - | แสดง toast "เข้าสู่ระบบสำเร็จ" |
| 8 | - | แสดงชื่อ user ที่ header |

**Test Data:**
```
Email: admin@test.com
Password: password123
```

**Expected Results:**
- ✅ Login สำเร็จภายใน 3 วินาที
- ✅ Redirect to /admin
- ✅ Toast notification แสดง
- ✅ User session active

**Actual Results:**
- Status: ⬜ Pass ⬜ Fail
- Time taken: _______ seconds
- Notes: _________________________

---

##### BB-002: Login with Invalid Password

**Test Steps:**

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | กรอก Email: admin@test.com | ข้อความปรากฏ |
| 2 | กรอก Password: wrongpassword | แสดงเป็น bullets |
| 3 | คลิก "เข้าสู่ระบบ" | Loading indicator |
| 4 | รอ response | Loading หยุด |
| 5 | - | แสดง error toast |
| 6 | - | ยังอยู่ที่หน้า login |
| 7 | - | Password field cleared (optional) |

**Test Data:**
```
Email: admin@test.com
Password: wrongpassword
```

**Expected Results:**
- ✅ Error message: "รหัสผ่านไม่ถูกต้อง" หรือ "เข้าสู่ระบบไม่สำเร็จ"
- ✅ ไม่ redirect
- ✅ ยังอยู่หน้า login
- ✅ ไม่มี session

**Actual Results:** _________________________

---

##### BB-003: Login Boundary Tests

**Test Matrix:**

| Test | Email | Password | Expected | Notes |
|------|-------|----------|----------|-------|
| 1 | "" | "" | Cannot submit | Empty validation |
| 2 | "invalid" | "pass" | Error | Invalid email format |
| 3 | "test@test.com" | "a" | Error | Password too short (ถ้ามี rule) |
| 4 | Valid | Very long (1000 chars) | Error or Handle | Length test |
| 5 | "admin@test.com " | "password123" | Success or trim | Trailing space |

**วิธีทดสอบ Test 4:**
```javascript
// ใช้ Console สร้าง long password
const longPassword = "a".repeat(1000);
// Copy และ paste ใน password field
```

---

#### 3.2 Anime CRUD Testing

##### BB-004: Add New Anime (Happy Path)

**Objective:** ทดสอบการเพิ่ม anime ด้วยข้อมูลครบถ้วนถูกต้อง

**Preconditions:**
- Logged in as admin
- อยู่ที่หน้า Anime List

**Test Data:**
```json
{
  "title": "Attack on Titan",
  "publisher": "Wit Studio",
  "description": "Humanity fights against mysterious titans who devour humans. Eren Yeager vows to eliminate them all.",
  "releaseDate": "2013-04-07",
  "format": "TV Series",
  "popularityScore": 95,
  "genres": ["Action", "Drama", "Fantasy"],
  "imageFile": "attack-on-titan.jpg"
}
```

**Test Steps:**

| Step | Action | Expected Result | Actual | ✓ |
|------|--------|-----------------|--------|---|
| 1 | คลิกปุ่ม "+ เพิ่ม Anime" | Navigate to /admin/anime/add | | ⬜ |
| 2 | หน้า Add Anime โหลด | แสดง form เปล่า | | ⬜ |
| 3 | กรอกชื่อ: "Attack on Titan" | ข้อความปรากฏใน input | | ⬜ |
| 4 | กรอกผู้จัดพิมพ์: "Wit Studio" | ข้อความปรากฏ | | ⬜ |
| 5 | กรอกเรื่องย่อ | ข้อความปรากฏใน textarea | | ⬜ |
| 6 | เลือกวันที่: 2013-04-07 | Date picker แสดงวันที่ | | ⬜ |
| 7 | เลือกรูปแบบ: "TV Series" | Dropdown แสดง selection | | ⬜ |
| 8 | กรอกคะแนน: 95 | ตัวเลขปรากฏใน input | | ⬜ |
| 9 | เลือก Genres: Action, Drama, Fantasy | แสดง 3 badges | | ⬜ |
| 10 | คลิก "Upload รูปภาพ" | File picker เปิด | | ⬜ |
| 11 | เลือกไฟล์ .jpg | Image preview แสดง | | ⬜ |
| 12 | ตรวจสอบข้อมูลทั้งหมด | ข้อมูลครบถ้วน | | ⬜ |
| 13 | คลิก "เพิ่ม Anime" | Loading indicator แสดง | | ⬜ |
| 14 | รอ 1-3 วินาที | Loading หยุด | | ⬜ |
| 15 | - | Toast "เพิ่ม Anime ใหม่เรียบร้อยแล้ว" | | ⬜ |
| 16 | - | Redirect to /admin/anime | | ⬜ |
| 17 | ดูรายการ Anime | "Attack on Titan" ปรากฏในรายการ | | ⬜ |
| 18 | คลิกที่ anime card | Popup แสดงข้อมูลครบถ้วน | | ⬜ |
| 19 | ไปหน้า Recent Updates | Anime ปรากฏใน updates | | ⬜ |
| 20 | ไปหน้า Popular Rankings | Anime ปรากฏในอันดับที่เหมาะสม | | ⬜ |

**Post-conditions:**
- Anime ใหม่ถูกบันทึกใน database
- Anime ปรากฏในทุกหน้าที่เกี่ยวข้อง
- รูปภาพถูก upload ไป storage

**Expected Total Time:** < 30 วินาที (ไม่นับเวลากรอกข้อมูล)

**Actual Results:**
- Status: ⬜ Pass ⬜ Fail
- Time taken: _______ seconds
- Issues found: _________________________

---

##### BB-005: Add Anime - Validation Tests

**Test Matrix:**

| Test ID | Title | Publisher | Description | Genres | Score | Expected Result |
|---------|-------|-----------|-------------|--------|-------|-----------------|
| BB-005-1 | "" | "Studio" | "Desc" | ["Action"] | 50 | ❌ Error: กรุณากรอกชื่อ |
| BB-005-2 | "Naruto" | "" | "Desc" | ["Action"] | 50 | ✅ Accept (optional) |
| BB-005-3 | "Naruto" | "Studio" | "" | ["Action"] | 50 | ✅ Accept (optional) |
| BB-005-4 | "Naruto" | "Studio" | "Desc" | [] | 50 | ❌ Error: เลือก Genre |
| BB-005-5 | "Naruto" | "Studio" | "Desc" | ["Action"] | -5 | ❌ Error or prevent |
| BB-005-6 | "Naruto" | "Studio" | "Desc" | ["Action"] | 105 | ❌ Error or prevent |
| BB-005-7 | "A" * 300 | "Studio" | "Desc" | ["Action"] | 50 | ⚠️ Truncate or error |
| BB-005-8 | `<script>alert('xss')</script>` | "Studio" | "Desc" | ["Action"] | 50 | ✅ Escaped/sanitized |

**วิธีทดสอบ BB-005-1 (Empty Title):**

1. ไปหน้า Add Anime
2. เว้นชื่อว่าง
3. กรอกฟิลด์อื่นให้ครบ
4. คลิก Submit
5. **ตรวจสอบ:**
   - ❌ Form ไม่ถูก submit
   - ❌ แสดง error message "กรุณากรอกชื่อ Anime"
   - ❌ Focus ไปที่ title input (nice to have)
   - ❌ ไม่มี API request ใน Network tab

**วิธีทดสอบ BB-005-7 (Very Long Title):**

1. เปิด Browser Console
2. พิมพ์:
   ```javascript
   const longTitle = "A".repeat(300);
   document.querySelector('input[name="title"]').value = longTitle;
   ```
3. กรอกฟิลด์อื่น
4. Submit
5. **ตรวจสอบ:**
   - Option A: ถูก reject ด้วย validation error
   - Option B: ถูก truncate เป็น max length
   - Option C: Accept ได้ (ถ้า database รองรับ)

**วิธีทดสอบ BB-005-8 (XSS):**

1. กรอกชื่อ: `<script>alert('xss')</script>`
2. Submit
3. ดู Anime ที่สร้าง
4. **ตรวจสอบ:**
   - ✅ ข้อความแสดงเป็น plain text `<script>alert('xss')</script>`
   - ✅ ไม่ execute script (ไม่เด้ง alert)
   - ✅ ใน Network response text ถูก escaped

---

##### BB-006: Edit Anime

**Objective:** ทดสอบการแก้ไข anime ที่มีอยู่

**Preconditions:**
- มี anime "Naruto" อยู่ในระบบ
- Logged in as admin

**Test Steps:**

| Step | Action | Expected Result | ✓ |
|------|--------|-----------------|---|
| 1 | ไปหน้า Anime List | แสดงรายการ anime | ⬜ |
| 2 | หา "Naruto" card | พบ Naruto | ⬜ |
| 3 | คลิกปุ่ม "แก้ไข" | Navigate to /admin/anime/edit/[id] | ⬜ |
| 4 | หน้า Edit โหลด | Form pre-fill ข้อมูลเดิม | ⬜ |
| 5 | ตรวจสอบข้อมูล | ข้อมูลตรงกับ Naruto | ⬜ |
| 6 | แก้ไขเรื่องย่อ | สามารถพิมพ์ได้ | ⬜ |
| 7 | เปลี่ยนคะแนนเป็น 88 | ตัวเลขเปลี่ยน | ⬜ |
| 8 | เพิ่ม Genre "Shounen" | Badge "Shounen" ปรากฏ | ⬜ |
| 9 | ลบ Genre "Action" | Badge "Action" หาย | ⬜ |
| 10 | คลิก "อัปเดตข้อมูล" | Loading แสดง | ⬜ |
| 11 | รอ response | Toast "อัปเดตข้อมูล Anime เรียบร้อยแล้ว" | ⬜ |
| 12 | - | Redirect to anime list | ⬜ |
| 13 | ดู "Naruto" card | ข้อมูลอัพเดตแล้ว | ⬜ |
| 14 | คลิกดู detail | แสดงข้อมูลใหม่ | ⬜ |

**Data Before:**
```
Title: Naruto
Score: 85
Genres: Action, Adventure
```

**Data After:**
```
Title: Naruto (same)
Score: 88 (changed)
Genres: Adventure, Shounen (changed)
```

**Expected Results:**
- ✅ ข้อมูลเดิม pre-fill ถูกต้อง
- ✅ สามารถแก้ไขได้
- ✅ บันทึกการเปลี่ยนแปลง
- ✅ ข้อมูลอัพเดตในระบบ

**Actual Results:** _________________________

---

#### 3.3 Genre Management Testing

##### BB-007: Add New Genre

**Test Cases:**

**Test 1: Valid Genre Name**
```
Input: "Isekai"
Expected: 
- Genre ถูกเพิ่ม
- แสดง toast "เพิ่ม Genre 'Isekai' เรียบร้อยแล้ว"
- Genre ปรากฏในรายการ (alphabetically)
- Count = 0 anime

Steps:
1. ไปหน้า Genre Management
2. พิมพ์ "Isekai" ใน input
3. คลิก "เพิ่ม"
4. ตรวจสอบรายการ genres
5. Verify "Isekai" อยู่ในตำแหน่งที่ถูก sort
```

**Test 2: Duplicate Genre**
```
Input: "Action" (exists)
Expected:
- แสดง error "Genre นี้มีอยู่ในระบบแล้ว"
- ไม่มีการเพิ่ม duplicate
- List ไม่เปลี่ยนแปลง

Steps:
1. พิมพ์ "Action"
2. คลิก "เพิ่ม"
3. ดู toast error
4. ตรวจสอบว่าไม่มี "Action" ซ้ำ
```

**Test 3: Whitespace Handling**
```
Inputs to test:
- "  Romance  " → should trim to "Romance"
- "Sci-Fi" → should accept hyphen
- "K-Drama" → should accept hyphen
- "Action!" → should accept (or reject special chars)

Expected: Trim whitespace, handle special chars consistently
```

**Test 4: Empty Name**
```
Input: ""
Expected: Error "กรุณากรอกชื่อ Genre" or button disabled
```

**Test 5: Very Long Name**
```
Input: "A".repeat(100)
Expected: Truncate or error
```

---

##### BB-008: Delete Genre

**Test Scenarios:**

**Scenario 1: Delete Unused Genre**
```
Precondition: มี Genre "TestGenre" ที่ไม่มี anime ใช้งาน

Steps:
1. ไปหน้า Genre Management
2. หา "TestGenre" (count = 0)
3. คลิกปุ่มลบ (🗑️)
4. Confirm dialog ปรากฏ
5. คลิก "ยืนยัน"
6. Toast "ลบ Genre เรียบร้อยแล้ว"
7. "TestGenre" หายจากรายการ

Expected: ลบสำเร็จ
```

**Scenario 2: Cannot Delete Genre in Use**
```
Precondition: มี Genre "Action" ที่มี anime ใช้งาน (count > 0)

Steps:
1. หา "Action" (count = 5)
2. ดูปุ่มลบ

Expected:
- ปุ่มลบ disabled (มีสี gray)
- Cursor แสดง "not-allowed"
- Hover แสดง tooltip "ไม่สามารถลบ Genre ที่มี Anime อยู่"
- ไม่สามารถคลิกได้
```

**Scenario 3: Cancel Delete**
```
Steps:
1. คลิกปุ่มลบ Genre ที่ count = 0
2. Confirm dialog ปรากฏ
3. คลิก "ยกเลิก"

Expected:
- Dialog ปิด
- Genre ยังคงอยู่
- ไม่มีการเปลี่ยนแปลง
```

---

##### BB-009: Search Genre

**Test Cases:**

| Test | Search Input | Expected Results |
|------|--------------|------------------|
| 1 | "act" | แสดง "Action" |
| 2 | "ACT" | แสดง "Action" (case-insensitive) |
| 3 | "drama" | แสดง "Drama", "K-Drama" ถ้ามี |
| 4 | "xyz123" | แสดง "ไม่พบ Genre" |
| 5 | "" | แสดง Genre ทั้งหมด (clear search) |

**วิธีทดสอบ:**

1. ไปหน้า Genre Management
2. พิมพ์ใน search box
3. **ตรวจสอบ:**
   - Filter ทันทีแบบ real-time (ไม่ต้องกด Enter)
   - แสดงเฉพาะ genres ที่ match
   - Case-insensitive search
   - Clear button ทำงาน

---

##### BB-010: View Anime in Genre

**Test Steps:**

| Step | Action | Expected | ✓ |
|------|--------|----------|---|
| 1 | ไปหน้า Genre Management | แสดงรายการ genres | ⬜ |
| 2 | หา Genre "Action" (count > 0) | พบ "Action" | ⬜ |
| 3 | คลิกที่ชื่อ "Action" หรือ "View" button | Dialog เปิด | ⬜ |
| 4 | - | Dialog title "Anime ใน Action" | ⬜ |
| 5 | - | แสดงรายการ anime cards | ⬜ |
| 6 | - | แต่ละ card แสดง title, image, score | ⬜ |
| 7 | นับจำนวน anime | ตรงกับ count ที่แสดง | ⬜ |
| 8 | คลิกที่ anime card | Navigate to detail page | ⬜ |
| 9 | กลับมา คลิก X ปิด dialog | Dialog ปิด | ⬜ |
| 10 | ทดสอบกับ Genre ที่ count = 0 | แสดง "ไม่มี Anime ใน [genre]" | ⬜ |

---

#### 3.4 Front Office Testing

##### BB-011: Homepage Display

**Test Checklist:**

**Hero Section:**
- [ ] แสดง hero banner
- [ ] แสดงข้อความต้อนรับ
- [ ] แสดงรูปภาพ hero
- [ ] Responsive บน mobile

**Popular Anime Section:**
- [ ] แสดงหัวข้อ "Anime ยอดนิยม"
- [ ] แสดง anime cards (6-10 cards)
- [ ] เรียงตาม popularity_score (สูง → ต่ำ)
- [ ] แต่ละ card แสดง:
  - [ ] รูปภาพ
  - [ ] ชื่อ anime
  - [ ] คะแนนความนิยม
  - [ ] Genres (badges)
- [ ] Hover effect บน cards
- [ ] คลิก card navigate to detail

**Layout & Design:**
- [ ] Responsive ทุกขนาดหน้าจอ
- [ ] Color scheme สวยงาม
- [ ] Typography อ่านง่าย
- [ ] Spacing เหมาะสม
- [ ] Dark/Light mode ทำงาน

---

##### BB-012: Search Functionality

**Test Matrix:**

**Search by Title:**

| Test | Input | Expected Results | Match Type |
|------|-------|------------------|------------|
| 1 | "Attack on Titan" | แสดง "Attack on Titan" | Exact match |
| 2 | "attack" | แสดงทุก anime ที่มี "attack" | Partial match |
| 3 | "ATTACK" | แสดงทุก anime ที่มี "attack" | Case-insensitive |
| 4 | "titan attack" | แสดงผล (ถ้า support) | Word order |
| 5 | "xyz123notfound" | "ไม่พบผลลัพธ์" | No match |
| 6 | "" | แสดงทั้งหมด | Empty |

**Filter by Genre:**

| Test | Selected Genres | Expected |
|------|-----------------|----------|
| 1 | ["Action"] | แสดงเฉพาะ Action anime |
| 2 | ["Action", "Drama"] | แสดง anime ที่มีทั้ง Action และ Drama (AND) |
| 3 | None | แสดงทั้งหมด |

**Combined Search:**

| Test | Title Search | Genre Filter | Expected |
|------|--------------|--------------|----------|
| 1 | "attack" | ["Action"] | แสดง anime ที่ชื่อมี "attack" AND genre = "Action" |
| 2 | "naruto" | ["Shounen"] | แสดง anime ที่ชื่อมี "naruto" AND genre = "Shounen" |
| 3 | "" | ["Drama"] | แสดงทุก Drama anime |

**วิธีทดสอบ Combined Search:**

1. ไปหน้า Search
2. พิมพ์ "attack" ใน search box
3. เลือก Genre "Action"
4. **ตรวจสอบ:**
   - แสดงเฉพาะ anime ที่ตรงทั้ง 2 เงื่อนไข
   - AND logic (ไม่ใช่ OR)
5. Clear filters
6. ตรวจสอบแสดงทั้งหมดอีกครั้ง

---

##### BB-013: Popular Rankings

**Test Checklist:**

**Top 3 Display:**
- [ ] แสดง Top 3 อันดับแยกพิเศษ
- [ ] Top 1: เหรียญทอง 🥇
- [ ] Top 2: เหรียญเงิน 🥈
- [ ] Top 3: เหรียญทองแดง 🥉
- [ ] Cards ใหญ่กว่าปกติ
- [ ] แสดงเลขอันดับชัดเจน

**Other Rankings (4+):**
- [ ] แสดงเป็น cards ปกติ
- [ ] แสดงเลขอันดับ
- [ ] เรียงตามคะแนน descending
- [ ] แสดงคะแนนความนิยม

**Verification:**
1. ดูคะแนนแต่ละ anime
2. ตรวจสอบเรียงถูกต้อง (สูง → ต่ำ)
3. ตรวจสอบเลขอันดับถูกต้อง

**Test Data:**
```
Expected Order:
1. Attack on Titan (95)
2. Death Note (92)
3. Naruto (88)
4. One Piece (85)
5. Tokyo Ghoul (82)
```

---

##### BB-014: Recent Updates

**Test Checklist:**

**Day Tabs:**
- [ ] แสดง 7 tabs (จันทร์-อาทิตย์)
- [ ] Tab active แสดงชัดเจน
- [ ] คลิก tab สลับได้

**Updates Display:**
- [ ] แสดง anime ที่อัพเดตในวันนั้น
- [ ] แสดงจำนวน updates ที่ tab
- [ ] Cards แสดงข้อมูลครบ
- [ ] ถ้าไม่มี updates: "ไม่มีการอัพเดต"

**Date Filtering:**
1. สร้าง test anime ใน Monday
2. ไปหน้า Recent Updates
3. คลิก tab "Monday"
4. **ตรวจสอบ:** Anime ปรากฏ
5. คลิก tab "Tuesday"
6. **ตรวจสอบ:** Anime ไม่ปรากฏ

---

#### 3.5 UI/UX Testing

##### BB-015: Responsive Design Testing

**Test Devices & Breakpoints:**

| Device | Resolution | Breakpoint | Tests |
|--------|------------|------------|-------|
| Desktop | 1920x1080 | xl | ทุก feature |
| Laptop | 1366x768 | lg | ทุก feature |
| Tablet (iPad) | 768x1024 | md | ทุก feature |
| Mobile (iPhone) | 375x667 | sm | ทุก feature |
| Small Mobile | 320x568 | xs | Critical features |

**วิธีทดสอบ:**

1. เปิด DevTools (F12)
2. คลิก Toggle device toolbar (Ctrl+Shift+M)
3. เลือก device หรือ custom resolution
4. **ทดสอบแต่ละหน้า:**
   - [ ] Homepage
   - [ ] Search
   - [ ] Rankings
   - [ ] Recent Updates
   - [ ] Admin Panel
   - [ ] Anime Form

**What to Check:**

**Desktop (1920x1080):**
- [ ] Layout ใช้พื้นที่เต็ม
- [ ] Navigation horizontal
- [ ] Cards แสดงหลายคอลัมน์ (3-4)
- [ ] รูปภาพชัดเจน

**Tablet (768x1024):**
- [ ] Cards ปรับเป็น 2 คอลัมน์
- [ ] Navigation ยังเป็น horizontal หรือ burger menu
- [ ] Font size เหมาะสม
- [ ] Touch-friendly buttons

**Mobile (375x667):**
- [ ] Cards แสดง 1 คอลัมน์
- [ ] Burger menu navigation
- [ ] Font size ใหญ่พอ
- [ ] Buttons ใหญ่พอสำหรับ touch
- [ ] No horizontal scroll
- [ ] Images scale properly

**Orientation Test:**
```
1. Landscape mode:
   - Content ปรับตาม
   - ไม่มี overflow
   
2. Portrait mode:
   - Stack vertically
   - Scrollable
```

---

##### BB-016: Navigation Testing

**Test Cases:**

**Menu Navigation:**

| From | To | Expected | Method |
|------|-----|----------|--------|
| Home | Search | Navigate to /search | Click menu |
| Home | Rankings | Navigate to /rankings | Click menu |
| Search | Home | Navigate to / | Click menu/logo |
| Admin | Front Office | Navigate to / | Click "View Site" |
| Front | Admin | Navigate to /admin | Click "Admin Panel" |

**Back/Forward Navigation:**
1. Home → Search → Rankings
2. กด Browser Back
3. **Expected:** กลับไป Search
4. กด Browser Back
5. **Expected:** กลับไป Home
6. กด Browser Forward
7. **Expected:** ไปที่ Search

**Active State:**
1. คลิกทุกเมนู
2. **ตรวจสอบ:** Active menu มีสี highlight
3. **ตรวจสอบ:** URL ตรงกับเมนู

---

##### BB-017: Loading States

**Test Scenarios:**

**Initial Page Load:**
```
1. Clear cache
2. โหลดหน้า Homepage
3. ตรวจสอบ:
   - [ ] Loading spinner แสดง
   - [ ] Skeleton screens (ถ้ามี)
   - [ ] Content โหลดเรียบร้อย
   - [ ] Loading หาย
```

**Data Fetching:**
```
1. ไปหน้า Anime List
2. ตรวจสอบ:
   - [ ] Loading indicator แสดงขณะ fetch
   - [ ] Content แสดงหลังโหลดเสร็จ
```

**Form Submission:**
```
1. กรอก form เพิ่ม anime
2. คลิก Submit
3. ตรวจสอบ:
   - [ ] Submit button แสดง loading
   - [ ] Button disabled ขณะ submit
   - [ ] Loading หายหลัง success/error
```

**Slow Network Test:**
```
1. DevTools → Network → Throttling → Slow 3G
2. โหลดหน้าต่างๆ
3. ตรวจสอบ:
   - [ ] Loading indicators แสดงเหมาะสม
   - [ ] ไม่ crash
   - [ ] User รู้ว่ากำลังโหลด
```

---

##### BB-018: Error Messages

**Test Error Scenarios:**

**Validation Errors:**
```
Test: Submit form with invalid data
Expected:
- [ ] Error message ชัดเจนเป็นภาษาไทย
- [ ] บอก field ไหนผิด
- [ ] บอกว่าต้องแก้ไขอย่างไร
- [ ] Toast notification หรือ inline error
- [ ] Error สี red เด่นชัด
```

**Network Errors:**
```
Test: Offline mode
Steps:
1. DevTools → Network → Offline
2. พยายาม fetch data
3. ตรวจสอบ:
   - [ ] แสดง error "ไม่สามารถเชื่อมต่อได้"
   - [ ] ไม่ crash
   - [ ] มีปุ่ม Retry
```

**404 Errors:**
```
Test: เข้า URL ที่ไม่มี
Steps:
1. Navigate to /nonexistent-page
2. ตรวจสอบ:
   - [ ] แสดงหน้า 404
   - [ ] มีปุ่มกลับหน้าหลัก
   - [ ] ไม่แสดง error stack
```

**API Errors:**
```
Test: Server error
(ต้อง simulate 500 error)
Expected:
- [ ] แสดง "เกิดข้อผิดพลาด กรุณาลองใหม่"
- [ ] Log error (ดูใน Console)
- [ ] User สามารถ retry
```

---

##### BB-019: Accessibility Testing

**Keyboard Navigation:**

| Action | Key | Expected |
|--------|-----|----------|
| Move focus | Tab | Focus ไปยัง element ถัดไป |
| Reverse focus | Shift+Tab | Focus กลับ |
| Activate button | Enter / Space | Button clicked |
| Close modal | Esc | Modal ปิด |
| Submit form | Enter (in input) | Form submit |

**Focus Indicators:**
```
Test:
1. กด Tab หลายๆ ครั้ง
2. ตรวจสอบ:
   - [ ] เห็น focus outline ชัดเจน
   - [ ] Focus ไม่หาย
   - [ ] Focus order สมเหตุสมผล
```

**Aria Labels (Basic Check):**
```
Test:
1. Right-click element → Inspect
2. ดู HTML attributes
3. ตรวจสอบ:
   - [ ] Buttons มี aria-label (ถ้าไม่มี text)
   - [ ] Form inputs มี label
   - [ ] Images มี alt text
```

**Screen Reader (Optional):**
```
Requirements:
- NVDA (Windows) หรือ VoiceOver (Mac)

Test:
1. เปิด screen reader
2. Navigate ด้วย keyboard
3. ฟังว่า screen reader อ่านอะไร
4. ตรวจสอบว่าเข้าใจได้
```

---

##### BB-020: Dark/Light Mode

**Test Cases:**

**Theme Switching:**
```
1. ดู theme ปัจจุบัน
2. คลิกปุ่ม toggle theme
3. ตรวจสอบ:
   - [ ] Theme เปลี่ยนทันที
   - [ ] ไม่มี flash/flicker
   - [ ] Animation smooth
```

**Color Contrast:**
```
Dark Mode:
- [ ] Text สีขาว/อ่อน บน background สีเข้ม
- [ ] Contrast ratio ≥ 4.5:1
- [ ] อ่านง่าย ไม่เมื่อยตา

Light Mode:
- [ ] Text สีเข้ม บน background สีอ่อน/ขาว
- [ ] Contrast ratio ≥ 4.5:1
- [ ] อ่านง่าย
```

**Test All Pages:**
```
ทดสอบทั้ง 2 modes ในหน้า:
- [ ] Homepage
- [ ] Search
- [ ] Rankings
- [ ] Admin Panel
- [ ] Forms
- [ ] Modals/Dialogs
```

**Theme Persistence:**
```
1. สลับเป็น Dark mode
2. Refresh หน้า
3. ตรวจสอบ: ยังเป็น Dark mode
4. ปิด browser
5. เปิดใหม่
6. ตรวจสอบ: ยังเป็น Dark mode
```

---

#### 3.6 Performance Testing

##### BB-021: Page Load Time

**Test Metrics:**

| Page | Target | Measured | Status |
|------|--------|----------|--------|
| Homepage | < 3s | ___ s | ⬜ |
| Search | < 3s | ___ s | ⬜ |
| Rankings | < 3s | ___ s | ⬜ |
| Admin List | < 3s | ___ s | ⬜ |
| Anime Detail | < 2s | ___ s | ⬜ |

**วิธีวัด:**

1. **Using Chrome DevTools:**
   ```
   1. F12 → Network tab
   2. Refresh page (Ctrl+R)
   3. ดูที่ Load: X.XX s (มุมล่างซ้าย)
   ```

2. **Using Lighthouse:**
   ```
   1. F12 → Lighthouse tab
   2. เลือก "Performance"
   3. Click "Analyze page load"
   4. ดู Performance score
   ```

**Performance Targets:**
- First Contentful Paint (FCP): < 1.8s
- Largest Contentful Paint (LCP): < 2.5s
- Time to Interactive (TTI): < 3.8s
- Cumulative Layout Shift (CLS): < 0.1

---

##### BB-022: API Response Time

**Test API Endpoints:**

| API Call | Target | Measured | Status |
|----------|--------|----------|--------|
| GET /anime | < 500ms | ___ ms | ⬜ |
| POST /anime | < 500ms | ___ ms | ⬜ |
| PUT /anime | < 500ms | ___ ms | ⬜ |
| GET /genres | < 300ms | ___ ms | ⬜ |
| Auth login | < 1s | ___ ms | ⬜ |

**วิธีวัด:**

1. เปิด DevTools → Network tab
2. Filter: XHR
3. Perform action (เช่น load anime list)
4. คลิกที่ request
5. ดูที่ Timing tab
6. **บันทึก:**
   - Waiting (TTFB): เวลารอ response
   - Content Download: เวลาดาวน์โหลด
   - Total: เวลารวม

---

##### BB-023: Large Dataset Performance

**Test Scenario:**

```
Objective: ทดสอบกับข้อมูลจำนวนมาก

Setup:
1. เพิ่ม anime 100+ รายการ
2. เพิ่ม genres 50+ items

Tests:
1. โหลด Anime List
   - [ ] โหลดไม่เกิน 5s
   - [ ] Scroll smooth
   - [ ] No lag

2. Search anime
   - [ ] Search responsive
   - [ ] Results instant
   
3. Filter by genres
   - [ ] Filter smooth
   - [ ] No freeze

4. View Rankings
   - [ ] Render complete list
   - [ ] Smooth scroll
```

---

#### 3.7 Cross-Browser Testing

##### BB-024: Browser Compatibility

**Test Matrix:**

| Feature | Chrome | Firefox | Safari | Edge |
|---------|--------|---------|--------|------|
| Login | ⬜ | ⬜ | ⬜ | ⬜ |
| Add Anime | ⬜ | ⬜ | ⬜ | ⬜ |
| Search | ⬜ | ⬜ | ⬜ | ⬜ |
| Responsive | ⬜ | ⬜ | ⬜ | ⬜ |
| Dark Mode | ⬜ | ⬜ | ⬜ | ⬜ |
| File Upload | ⬜ | ⬜ | ⬜ | ⬜ |
| Navigation | ⬜ | ⬜ | ⬜ | ⬜ |

**Browser Versions:**
- Chrome: 120+
- Firefox: 121+
- Safari: 17+ (Mac/iOS)
- Edge: 120+

**What to Check:**
- [ ] Layout consistency
- [ ] All features work
- [ ] No console errors
- [ ] Performance acceptable
- [ ] Fonts render correctly

---

## Test Data Sets

### 1. Valid Anime Data

```json
{
  "anime1": {
    "title": "Attack on Titan",
    "publisher": "Wit Studio",
    "description": "Humanity fights against mysterious titans.",
    "releaseDate": "2013-04-07",
    "format": "TV Series",
    "popularityScore": 95,
    "genres": ["Action", "Drama", "Fantasy"]
  },
  "anime2": {
    "title": "Death Note",
    "publisher": "Madhouse",
    "description": "Light Yagami finds a notebook that kills.",
    "releaseDate": "2006-10-04",
    "format": "TV Series",
    "popularityScore": 92,
    "genres": ["Mystery", "Thriller", "Supernatural"]
  }
}
```

### 2. Invalid Test Data

```json
{
  "emptyTitle": {
    "title": "",
    "genres": ["Action"]
  },
  "noGenres": {
    "title": "Test Anime",
    "genres": []
  },
  "invalidScore": {
    "title": "Test",
    "popularityScore": 150
  },
  "xssAttempt": {
    "title": "<script>alert('xss')</script>",
    "description": "<img src=x onerror=alert('xss')>"
  }
}
```

### 3. Genre Test Data

```javascript
const validGenres = ["Action", "Drama", "Comedy", "Romance", "Isekai"];
const duplicateTest = "Action"; // already exists
const whitespaceTest = "  Shounen  "; // should trim
const specialChars = "Sci-Fi"; // should accept
const veryLong = "A".repeat(100); // test max length
```

---

## Testing Tools & Setup

### Browser DevTools Setup

**Chrome DevTools:**
1. กด F12 หรือ Ctrl+Shift+I
2. Tabs ที่ใช้บ่อย:
   - **Elements**: Inspect DOM
   - **Console**: ดู logs, errors
   - **Network**: ดู API calls
   - **Application**: ดู localStorage, cookies
   - **Performance**: วัดประสิทธิภาพ
   - **Lighthouse**: Audit ครบเครื่อง

**Network Tab Tips:**
```
- Filter: XHR (API calls only)
- Preserve log: เก็บ logs ข้าม page reload
- Disable cache: ทดสอบโหลดครั้งแรก
- Throttling: จำลอง slow network
- Offline: ทดสอบ offline mode
```

**Console Commands:**
```javascript
// Clear console
clear()

// View localStorage
localStorage

// Mock long string
"A".repeat(1000)

// Get all forms
document.forms

// Trigger click
document.querySelector('button').click()
```

---

### React DevTools

**Installation:**
1. Chrome Web Store → "React Developer Tools"
2. เพิ่ม Extension

**Usage:**
1. F12 → Tab "Components"
2. Select component
3. ดู:
   - Props
   - State
   - Hooks
   - Rendered by

**Profiler:**
1. Tab "Profiler"
2. Click Record
3. Interact กับ app
4. Stop recording
5. ดู render times

---

### Supabase Dashboard

**Access:**
1. https://supabase.com/dashboard
2. Select project
3. Key sections:
   - Table Editor: ดูข้อมูล
   - SQL Editor: รัน queries
   - Database → Logs
   - Storage: ดูไฟล์

**Useful Queries:**
```sql
-- View all anime
SELECT * FROM anime ORDER BY created_at DESC;

-- View genres with counts
SELECT g.*, COUNT(ag.anime_id) as anime_count
FROM genres g
LEFT JOIN anime_genres ag ON g.id = ag.genre_id
GROUP BY g.id
ORDER BY g.name;

-- Recent updates
SELECT * FROM anime 
WHERE DATE(created_at) = CURRENT_DATE;

-- Clear test data
DELETE FROM anime WHERE title LIKE 'Test%';
```

---

## Step-by-Step Testing Procedures

### Procedure 1: Complete Smoke Test (30 minutes)

**Objective:** Quick test ของ critical features

**Steps:**

1. **Login (2 min)**
   - [ ] Login with valid credentials
   - [ ] Verify redirect to admin

2. **Add Anime (5 min)**
   - [ ] Add new anime with all data
   - [ ] Verify success message
   - [ ] Verify appears in list

3. **Edit Anime (3 min)**
   - [ ] Edit the anime just created
   - [ ] Change description
   - [ ] Verify changes saved

4. **Add Genre (2 min)**
   - [ ] Add new genre
   - [ ] Verify added to list

5. **Search (3 min)**
   - [ ] Search by title
   - [ ] Filter by genre
   - [ ] Verify results correct

6. **Front Office (5 min)**
   - [ ] Visit homepage
   - [ ] Check popular rankings
   - [ ] Check recent updates

7. **UI Check (5 min)**
   - [ ] Test responsive (mobile view)
   - [ ] Switch dark/light mode
   - [ ] Test navigation

8. **Logout (1 min)**
   - [ ] Logout
   - [ ] Verify redirect

9. **Final Check (4 min)**
   - [ ] Check console for errors
   - [ ] Check network for failed requests
   - [ ] Review test results

**Pass Criteria:**
- ทุก step สำเร็จ
- ไม่มี critical errors
- Core features ทำงาน

---

### Procedure 2: Complete Regression Test (2 hours)

**Objective:** ทดสอบทุก feature อย่างละเอียด

**Checklist:**

**Authentication (15 min)**
- [ ] BB-001 to BB-014

**Anime Management (30 min)**
- [ ] BB-015 to BB-044

**Genre Management (20 min)**
- [ ] BB-045 to BB-072

**Front Office (25 min)**
- [ ] BB-085 to BB-117

**UI/UX (20 min)**
- [ ] BB-118 to BB-149

**Performance (10 min)**
- [ ] BB-156 to BB-164

---

## Bug Reporting Guidelines

### Bug Report Template

```markdown
## Bug ID: BUG-XXX

**Title:** [สรุปปัญหาสั้นๆ]

**Severity:** Critical / High / Medium / Low

**Priority:** P0 / P1 / P2 / P3

**Status:** New / In Progress / Fixed / Closed

**Found in:** [Test Case ID]

**Environment:**
- OS: Windows 11 / macOS / Linux
- Browser: Chrome 120
- Screen Resolution: 1920x1080
- Date Found: 2025-10-05

**Description:**
[อธิบายปัญหาอย่างละเอียด]

**Steps to Reproduce:**
1. Step 1
2. Step 2
3. Step 3

**Expected Result:**
[ผลที่ควรเป็น]

**Actual Result:**
[ผลที่เกิดขึ้นจริง]

**Screenshots:**
[แนบภาพหน้าจอ]

**Console Errors:**
```
[Copy error messages from console]
```

**Network Logs:**
[แนบ relevant API calls]

**Additional Notes:**
[ข้อมูลเพิ่มเติม]
```

### Severity & Priority Definitions

**Severity:**
- **Critical**: Crash, data loss, security breach
- **High**: Major feature broken, blocking work
- **Medium**: Feature partially broken, has workaround
- **Low**: Minor issue, cosmetic, doesn't affect functionality

**Priority:**
- **P0**: Fix immediately (Critical blocker)
- **P1**: Fix in current sprint
- **P2**: Fix in next sprint
- **P3**: Fix when time allows

---

## Best Practices

### 1. Test Execution Tips

✅ **DO:**
- เริ่มด้วย smoke test ก่อนเสมอ
- ทดสอบ happy path ก่อน edge cases
- Document ทุกสิ่งที่พบ
- Take screenshots of bugs
- Test on clean data (clear browser cache)
- ใช้ test data ที่สม่ำเสมอ

❌ **DON'T:**
- ข้าม preconditions
- ทดสอบหลาย features พร้อมกัน
- Assume ว่า feature ทำงาน
- ทดสอบเร็วเกินไป (miss bugs)

### 2. Bug Reporting Tips

✅ **Good Bug Report:**
- ชื่อชัดเจน: "Login fails with valid credentials"
- Steps ละเอียด สามารถ reproduce ได้
- มี screenshots/videos
- บอก expected vs actual
- บอก severity และ priority ถูก

❌ **Bad Bug Report:**
- "ระบบไม่ทำงาน" (ไม่ชัดเจน)
- ไม่มี steps to reproduce
- ไม่มี screenshots
- ไม่บอกว่า expected อะไร

### 3. Test Documentation

**During Testing:**
- บันทึกผลทุก test case
- Mark Pass/Fail ทันที
- Note unexpected behavior
- Track time spent

**After Testing:**
- สรุปผลการทดสอบ
- Count defects by severity
- Calculate pass rate
- Update test cases ถ้าต้อง

---

## Appendix

### Keyboard Shortcuts

**Chrome DevTools:**
- F12: เปิด/ปิด DevTools
- Ctrl+Shift+C: Select element
- Ctrl+Shift+P: Command menu
- Ctrl+Shift+M: Toggle device toolbar
- Ctrl+]: Next panel
- Ctrl+[: Previous panel

**Browser:**
- Ctrl+R: Refresh
- Ctrl+Shift+R: Hard refresh
- Ctrl+T: New tab
- Ctrl+W: Close tab
- Ctrl+Shift+N: Incognito window

### Useful Links

**Documentation:**
- React: https://react.dev
- Supabase: https://supabase.com/docs
- Testing Library: https://testing-library.com
- Jest: https://jestjs.io

**Tools:**
- Can I Use: https://caniuse.com (browser compatibility)
- Lighthouse: Built into Chrome
- WAVE: https://wave.webaim.org (accessibility)

---

**Document Version:** 1.0  
**Last Updated:** [Date]  
**Author:** QA Team
