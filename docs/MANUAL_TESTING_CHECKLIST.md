# Manual Testing Checklist - ระบบจัดการ Anime

## 📋 Overview
เอกสารนี้เป็น Checklist สำหรับการทดสอบด้วยตนเอง (Manual Testing) ครอบคลุมทั้ง White Box และ Black Box Testing

**Target System:** Anime Management System  
**Testing Type:** Manual Testing  
**Testing Approach:** White Box + Black Box  
**Test Environment:** Development & Production

---

## 🎯 White Box Testing Checklist

### 1. Custom Hooks Testing

#### ✅ useAnimeData Hook
- [ ] **WB-001:** ทดสอบ fetchAnime() - ตรวจสอบ SELECT query
- [ ] **WB-002:** ทดสอบ createAnime() - ตรวจสอบ INSERT query และ validation
- [ ] **WB-003:** ทดสอบ updateAnime() - ตรวจสอบ UPDATE query และ WHERE clause
- [ ] **WB-004:** ทดสอบ getAnimeById() - ตรวจสอบ single record fetch
- [ ] **WB-005:** ทดสอบ error handling ทุก path (try-catch blocks)
- [ ] **WB-006:** ตรวจสอบ loading state changes
- [ ] **WB-007:** ตรวจสอบ state updates หลัง CRUD operations

**How to Test Manually:**
1. เปิด Browser DevTools → Network tab
2. ดูทุก API request และ response
3. ตรวจสอบ query parameters และ payload
4. ดู Redux DevTools หรือ React DevTools สำหรับ state changes
5. จำลอง network errors (DevTools → Offline mode)

---

#### ✅ useGenres Hook
- [ ] **WB-008:** ทดสอบ fetchGenres() - ตรวจสอบ ORDER BY clause
- [ ] **WB-009:** ทดสอบ addGenre() - ตรวจสอบ trim และ duplicate check
- [ ] **WB-010:** ทดสอบ deleteGenre() - ตรวจสอบ DELETE query
- [ ] **WB-011:** ทดสอบ refreshGenres() - ตรวจสอบการ refetch
- [ ] **WB-012:** ตรวจสอบ error messages และ toast notifications

---

### 2. Context Providers Testing

#### ✅ AuthContext
- [ ] **WB-013:** ทดสอบ signIn() flow - ตรวจสอบ auth token generation
- [ ] **WB-014:** ทดสอบ signOut() - ตรวจสอบ token cleanup
- [ ] **WB-015:** ทดสอบ session persistence - ตรวจสอบ localStorage
- [ ] **WB-016:** ทดสอบ onAuthStateChange callback
- [ ] **WB-017:** ตรวจสอบ auto logout เมื่อ token expire
- [ ] **WB-018:** ทดสอบ Protected Route logic

**Inspection Points:**
- localStorage → ดู session data
- Network → ดู auth API calls
- Console → ดู auth state changes
- Application → ดู cookies (ถ้ามี)

---

#### ✅ AnimeContext
- [ ] **WB-019:** ทดสอบ anime state management
- [ ] **WB-020:** ทดสอบ anime list updates
- [ ] **WB-021:** ตรวจสอบ context re-render optimization

---

### 3. Form Validation Logic

#### ✅ AnimeForm Validation
- [ ] **WB-022:** ทดสอบ required field validation (title)
- [ ] **WB-023:** ทดสอบ genres array validation (at least 1)
- [ ] **WB-024:** ทดสอบ popularity score range (0-100)
- [ ] **WB-025:** ทดสอบ date format validation
- [ ] **WB-026:** ทดสอบ trim whitespace
- [ ] **WB-027:** ทดสอบ maxLength constraints
- [ ] **WB-028:** ตรวจสอบ validation error messages

**Manual Check:**
1. กรอกข้อมูลที่ invalid แต่ละ field
2. ดู console errors
3. ตรวจสอบ form state ใน React DevTools
4. ดู DOM validation attributes (required, min, max, pattern)

---

### 4. Database Operations

#### ✅ Supabase Queries
- [ ] **WB-029:** ตรวจสอบ SELECT queries - ดู columns ที่ถูก select
- [ ] **WB-030:** ตรวจสอบ JOIN operations (ถ้ามี)
- [ ] **WB-031:** ตรวจสอบ WHERE clauses
- [ ] **WB-032:** ตรวจสอบ ORDER BY และ sorting
- [ ] **WB-033:** ตรวจสอบ LIMIT และ pagination (future)
- [ ] **WB-034:** ทดสอบ transaction handling
- [ ] **WB-035:** ทดสอบ RLS policies

**Tools:**
- Supabase Dashboard → Table Editor → ดูข้อมูล
- Supabase Dashboard → Database → Logs
- Browser DevTools → Network → ดู API calls
- Supabase Dashboard → SQL Editor → รัน test queries

---

### 5. State Management & Data Flow

#### ✅ Data Flow Testing
- [ ] **WB-036:** ทดสอบ Context → Component data flow
- [ ] **WB-037:** ทดสอบ Props drilling (ถ้ามี)
- [ ] **WB-038:** ตรวจสอบ unnecessary re-renders
- [ ] **WB-039:** ทดสอบ memoization (useMemo, useCallback)
- [ ] **WB-040:** ตรวจสอบ side effects (useEffect dependencies)

**Tools:**
- React DevTools → Profiler
- React DevTools → Components → ดู props และ state
- Console → log render counts

---

### 6. Error Handling & Edge Cases

#### ✅ Error Paths
- [ ] **WB-041:** ทดสอบ network errors (offline mode)
- [ ] **WB-042:** ทดสอบ API errors (404, 500, etc.)
- [ ] **WB-043:** ทดสอบ null/undefined data handling
- [ ] **WB-044:** ทดสอบ empty array handling
- [ ] **WB-045:** ทดสอบ concurrent operations
- [ ] **WB-046:** ทดสอบ race conditions
- [ ] **WB-047:** ทดสอบ error boundary (ถ้ามี)

---

### 7. Performance & Optimization

#### ✅ Performance Checks
- [ ] **WB-048:** ตรวจสอบ initial load time
- [ ] **WB-049:** ตรวจสอบ query execution time
- [ ] **WB-050:** ตรวจสอบ component render time
- [ ] **WB-051:** ตรวจสอบ memory leaks (long session)
- [ ] **WB-052:** ตรวจสอบ bundle size

**Tools:**
- Chrome DevTools → Performance tab
- Chrome DevTools → Memory tab
- Lighthouse audit
- React DevTools → Profiler

---

## 🎨 Black Box Testing Checklist

### 8. Authentication & Authorization

#### ✅ Login Functionality
- [ ] **BB-001:** Login ด้วย valid credentials
- [ ] **BB-002:** Login ด้วย invalid email
- [ ] **BB-003:** Login ด้วย invalid password
- [ ] **BB-004:** Login ด้วย empty fields
- [ ] **BB-005:** ทดสอบ "Remember Me" (ถ้ามี)
- [ ] **BB-006:** ทดสอบ login redirect
- [ ] **BB-007:** ทดสอบ loading state ขณะ login

**Test Data:**
```
Valid: admin@test.com / password123
Invalid Email: wrong@test.com / password123
Invalid Password: admin@test.com / wrongpass
Empty: "" / ""
```

---

#### ✅ Logout Functionality
- [ ] **BB-008:** Logout จาก Admin Panel
- [ ] **BB-009:** ตรวจสอบ session cleanup
- [ ] **BB-010:** ทดสอบ redirect หลัง logout
- [ ] **BB-011:** ทดสอบว่า back button ไม่สามารถกลับไป admin ได้

---

#### ✅ Protected Routes
- [ ] **BB-012:** พยายามเข้า /admin โดยไม่ login
- [ ] **BB-013:** ทดสอบ auto redirect to login
- [ ] **BB-014:** ทดสอบว่า login แล้วเข้า /admin ได้

---

### 9. Admin Panel - Anime Management

#### ✅ Create Anime
- [ ] **BB-015:** เพิ่ม Anime ใหม่ด้วยข้อมูลครบถ้วน
- [ ] **BB-016:** เพิ่ม Anime โดยไม่มีชื่อ (validation error)
- [ ] **BB-017:** เพิ่ม Anime โดยไม่เลือก genre (validation error)
- [ ] **BB-018:** เพิ่ม Anime ด้วยคะแนนนอก range (0-100)
- [ ] **BB-019:** Upload รูปภาพ (valid formats)
- [ ] **BB-020:** Upload รูปภาพ (invalid formats)
- [ ] **BB-021:** ทดสอบ image preview
- [ ] **BB-022:** ทดสอบ loading state ขณะบันทึก
- [ ] **BB-023:** ทดสอบ success message
- [ ] **BB-024:** ทดสอบ redirect หลังเพิ่มสำเร็จ

**Test Data Sets:**
```json
Valid Anime:
{
  "title": "Attack on Titan",
  "publisher": "Wit Studio",
  "description": "Humanity fights against titans...",
  "release_date": "2013-04-07",
  "format": "TV Series",
  "popularity_score": 95,
  "genres": ["Action", "Drama"]
}

Invalid - No Title:
{
  "title": "",
  "genres": ["Action"]
}

Invalid - No Genre:
{
  "title": "Test Anime",
  "genres": []
}

Edge Case - Max Score:
{
  "title": "Test",
  "popularity_score": 100,
  "genres": ["Action"]
}
```

---

#### ✅ Read/View Anime
- [ ] **BB-025:** ดูรายการ Anime ทั้งหมด
- [ ] **BB-026:** ตรวจสอบข้อมูลแสดงครบถ้วน
- [ ] **BB-027:** ดู Anime detail popup
- [ ] **BB-028:** ตรวจสอบรูปภาพแสดงถูกต้อง
- [ ] **BB-029:** ตรวจสอบ genres แสดงเป็น badges
- [ ] **BB-030:** ปิด popup และเปิดใหม่

---

#### ✅ Update Anime
- [ ] **BB-031:** แก้ไข Anime ที่มีอยู่
- [ ] **BB-032:** ตรวจสอบข้อมูลเดิม pre-fill ถูกต้อง
- [ ] **BB-033:** เปลี่ยนชื่อ
- [ ] **BB-034:** เปลี่ยน genres
- [ ] **BB-035:** เปลี่ยนคะแนนความนิยม
- [ ] **BB-036:** เปลี่ยนรูปภาพ
- [ ] **BB-037:** บันทึกการเปลี่ยนแปลง
- [ ] **BB-038:** ตรวจสอบข้อมูลอัพเดตในรายการ
- [ ] **BB-039:** ตรวจสอบ success message

---

#### ✅ Delete Anime
- [ ] **BB-040:** ลบ Anime (ถ้ามี feature)
- [ ] **BB-041:** ตรวจสอบ confirm dialog
- [ ] **BB-042:** ยืนยันการลบ
- [ ] **BB-043:** ยกเลิกการลบ
- [ ] **BB-044:** ตรวจสอบ Anime หายจากรายการ

**Note:** ปัจจุบันยังไม่มี delete feature ใน UI

---

### 10. Genre Management

#### ✅ Add Genre
- [ ] **BB-045:** เพิ่ม Genre ใหม่
- [ ] **BB-046:** เพิ่ม Genre ที่มีอยู่แล้ว (duplicate error)
- [ ] **BB-047:** เพิ่ม Genre ด้วยชื่อว่าง (validation error)
- [ ] **BB-048:** เพิ่ม Genre ด้วยช่องว่าง leading/trailing (trim test)
- [ ] **BB-049:** ตรวจสอบ Genre เรียงตาม alphabetical order
- [ ] **BB-050:** ตรวจสอบ count = 0 สำหรับ Genre ใหม่

**Test Cases:**
```
Valid: "Isekai"
Duplicate: "Action" (already exists)
Empty: ""
Whitespace: "  Romance  " (should trim to "Romance")
Special Chars: "Sci-Fi" (should accept)
```

---

#### ✅ View Genres
- [ ] **BB-051:** ดูรายการ Genres ทั้งหมด
- [ ] **BB-052:** ตรวจสอบ count แสดงถูกต้อง
- [ ] **BB-053:** ดู total genres count
- [ ] **BB-054:** ดู total anime count
- [ ] **BB-055:** ดู Genre ที่มี anime มากที่สุด

---

#### ✅ Search Genre
- [ ] **BB-056:** ค้นหา Genre ด้วยชื่อเต็ม
- [ ] **BB-057:** ค้นหา Genre ด้วยชื่อบางส่วน
- [ ] **BB-058:** ค้นหาแบบ case-insensitive
- [ ] **BB-059:** ค้นหาด้วยคำที่ไม่มี (no results)
- [ ] **BB-060:** Clear search

**Test Searches:**
```
Full: "Action"
Partial: "act" (should find "Action")
Case: "ACTION" (should find "Action")
Not Found: "xyz123"
```

---

#### ✅ Delete Genre
- [ ] **BB-061:** ลบ Genre ที่ count = 0
- [ ] **BB-062:** พยายามลบ Genre ที่ count > 0 (should be disabled)
- [ ] **BB-063:** ตรวจสอบ confirm dialog
- [ ] **BB-064:** ยืนยันการลบ
- [ ] **BB-065:** ยกเลิกการลบ
- [ ] **BB-066:** ตรวจสอบ success message
- [ ] **BB-067:** ตรวจสอบ Genre หายจากรายการ

---

#### ✅ View Anime in Genre
- [ ] **BB-068:** คลิก Genre ที่มี anime
- [ ] **BB-069:** ดู Dialog แสดง anime list
- [ ] **BB-070:** ตรวจสอบข้อมูล anime แสดงถูกต้อง
- [ ] **BB-071:** คลิกที่ anime card เพื่อดูรายละเอียด
- [ ] **BB-072:** ปิด Dialog

---

### 11. Dashboard

#### ✅ Statistics Display
- [ ] **BB-073:** ดูจำนวน Anime ทั้งหมด
- [ ] **BB-074:** ดูจำนวน Genres ทั้งหมด
- [ ] **BB-075:** ดูค่าเฉลี่ยคะแนนความนิยม
- [ ] **BB-076:** ตรวจสอบตัวเลขถูกต้อง

---

#### ✅ Top Anime Section
- [ ] **BB-077:** ดู Top 5 Anime ยอดนิยม
- [ ] **BB-078:** ตรวจสอบเรียงตามคะแนน
- [ ] **BB-079:** คลิกที่ Anime card
- [ ] **BB-080:** ดู Anime detail popup

---

#### ✅ Recent Activities
- [ ] **BB-081:** ดูกิจกรรมล่าสุด
- [ ] **BB-082:** ตรวจสอบ timestamp
- [ ] **BB-083:** คลิกปุ่ม "ดู"
- [ ] **BB-084:** ดู Anime detail

---

### 12. Front Office - Homepage

#### ✅ Homepage Display
- [ ] **BB-085:** ดู Hero section
- [ ] **BB-086:** ดูรายการ Anime ยอดนิยม
- [ ] **BB-087:** ตรวจสอบ Cards layout responsive
- [ ] **BB-088:** ทดสอบ Hover effects
- [ ] **BB-089:** คลิกที่ Anime card
- [ ] **BB-090:** ดูรายละเอียด Anime

---

### 13. Front Office - Search

#### ✅ Search by Title
- [ ] **BB-091:** ค้นหาด้วยชื่อเต็ม
- [ ] **BB-092:** ค้นหาด้วยชื่อบางส่วน
- [ ] **BB-093:** ค้นหาแบบ case-insensitive
- [ ] **BB-094:** ค้นหาด้วย special characters
- [ ] **BB-095:** ค้นหาด้วยคำที่ไม่มี
- [ ] **BB-096:** ดู "No results" message

**Test Searches:**
```
Full: "Attack on Titan"
Partial: "attack"
Case: "ATTACK ON TITAN"
Special: "@#$%"
Not Found: "xyz123abc"
Empty: "" (should show all)
```

---

#### ✅ Filter by Genre
- [ ] **BB-097:** เลือก 1 Genre
- [ ] **BB-098:** เลือกหลาย Genres
- [ ] **BB-099:** ตรวจสอบผลลัพธ์ถูกต้อง
- [ ] **BB-100:** ยกเลิกการเลือก Genre
- [ ] **BB-101:** Clear all filters

---

#### ✅ Combined Search
- [ ] **BB-102:** ค้นหาด้วยชื่อ + filter genre
- [ ] **BB-103:** ตรวจสอบ AND logic ทำงานถูกต้อง
- [ ] **BB-104:** ดูจำนวนผลลัพธ์
- [ ] **BB-105:** Clear filters

---

### 14. Front Office - Popular Rankings

#### ✅ Rankings Display
- [ ] **BB-106:** ดู Top 3 แบบพิเศษ
- [ ] **BB-107:** ตรวจสอบเหรียญรางวัล (🥇🥈🥉)
- [ ] **BB-108:** ดู Anime อันดับ 4+
- [ ] **BB-109:** ตรวจสอบเรียงตามคะแนน
- [ ] **BB-110:** ดูคะแนนความนิยมแต่ละอันดับ
- [ ] **BB-111:** คลิกที่ Anime card

---

### 15. Front Office - Recent Updates

#### ✅ Updates by Day
- [ ] **BB-112:** ดู updates วันปัจจุบัน
- [ ] **BB-113:** เปลี่ยน tab เป็นวันอื่น (จันทร์-อาทิตย์)
- [ ] **BB-114:** ตรวจสอบ filter ถูกต้อง
- [ ] **BB-115:** ดูจำนวน updates แต่ละวัน
- [ ] **BB-116:** ดู "No updates" message (ถ้าไม่มี)
- [ ] **BB-117:** ตรวจสอบ date format

---

### 16. UI/UX Testing

#### ✅ Responsive Design
- [ ] **BB-118:** ทดสอบบน Desktop (1920x1080)
- [ ] **BB-119:** ทดสอบบน Laptop (1366x768)
- [ ] **BB-120:** ทดสอบบน Tablet (768x1024)
- [ ] **BB-121:** ทดสอบบน Mobile (375x667)
- [ ] **BB-122:** ทดสอบ Landscape orientation
- [ ] **BB-123:** ทดสอบ Portrait orientation

**Devices to Test:**
- Desktop: Full HD monitor
- Laptop: Standard laptop screen
- Tablet: iPad
- Mobile: iPhone SE, iPhone 14, Android phone

---

#### ✅ Navigation
- [ ] **BB-124:** ทดสอบ Navigation menu
- [ ] **BB-125:** คลิกทุกเมนู
- [ ] **BB-126:** ตรวจสอบ active state
- [ ] **BB-127:** ทดสอบ breadcrumbs (ถ้ามี)
- [ ] **BB-128:** ทดสอบ back button
- [ ] **BB-129:** ทดสอบ browser forward/back

---

#### ✅ Loading States
- [ ] **BB-130:** ดู loading indicator ขณะ fetch data
- [ ] **BB-131:** ดู loading ขณะ submit form
- [ ] **BB-132:** ตรวจสอบ skeleton screens (ถ้ามี)
- [ ] **BB-133:** ทดสอบ slow 3G network

---

#### ✅ Error Messages
- [ ] **BB-134:** ตรวจสอบ validation error messages ชัดเจน
- [ ] **BB-135:** ตรวจสอบ API error messages
- [ ] **BB-136:** ดู network error messages
- [ ] **BB-137:** ตรวจสอบ error toast notifications
- [ ] **BB-138:** ทดสอบ error recovery

---

#### ✅ Accessibility
- [ ] **BB-139:** ทดสอบ keyboard navigation (Tab)
- [ ] **BB-140:** ทดสอบ Enter key submit forms
- [ ] **BB-141:** ทดสอบ Esc key close modals
- [ ] **BB-142:** ตรวจสอบ focus states
- [ ] **BB-143:** ตรวจสอบ aria labels (ถ้ามี)
- [ ] **BB-144:** ทดสอบ screen reader (basic)

---

#### ✅ Dark/Light Mode
- [ ] **BB-145:** สลับ Dark mode
- [ ] **BB-146:** สลับ Light mode
- [ ] **BB-147:** ตรวจสอบสีทุกหน้าเหมาะสม
- [ ] **BB-148:** ตรวจสอบ contrast เพียงพอ
- [ ] **BB-149:** ทดสอบ theme persistence

---

### 17. Cross-Browser Testing

#### ✅ Browser Compatibility
- [ ] **BB-150:** ทดสอบบน Chrome (latest)
- [ ] **BB-151:** ทดสอบบน Firefox (latest)
- [ ] **BB-152:** ทดสอบบน Safari (latest)
- [ ] **BB-153:** ทดสอบบน Edge (latest)
- [ ] **BB-154:** ตรวจสอบ layout consistency
- [ ] **BB-155:** ตรวจสอบ functionality ทำงานเหมือนกัน

**Browsers:**
- Chrome 120+
- Firefox 120+
- Safari 17+
- Edge 120+

---

### 18. Performance Testing

#### ✅ Load Time
- [ ] **BB-156:** วัดเวลา initial page load (< 3s)
- [ ] **BB-157:** วัดเวลา navigation between pages
- [ ] **BB-158:** วัดเวลา API response (< 500ms)
- [ ] **BB-159:** ทดสอบกับข้อมูลจำนวนมาก (100+ anime)

**Tools:**
- Chrome DevTools → Network tab
- Lighthouse audit
- Performance tab

---

#### ✅ User Experience
- [ ] **BB-160:** ทดสอบ smooth animations
- [ ] **BB-161:** ทดสอบ hover effects
- [ ] **BB-162:** ทดสอบ transitions
- [ ] **BB-163:** ตรวจสอบไม่มี janky scrolling
- [ ] **BB-164:** ทดสอบ image loading progressive

---

### 19. Security Testing (Basic)

#### ✅ Authentication Security
- [ ] **BB-165:** ตรวจสอบ session timeout
- [ ] **BB-166:** ทดสอบ multiple sessions
- [ ] **BB-167:** ตรวจสอบ password ไม่แสดงใน plain text
- [ ] **BB-168:** ทดสอบ protected routes ไม่สามารถ bypass ได้

---

#### ✅ Input Validation
- [ ] **BB-169:** ทดสอบ XSS (Cross-site Scripting) - กรอก `<script>alert('xss')</script>`
- [ ] **BB-170:** ทดสอบ SQL Injection - กรอก `' OR '1'='1`
- [ ] **BB-171:** ทดสอบ special characters ใน input
- [ ] **BB-172:** ทดสอบ very long input (1000+ chars)

**Test Inputs:**
```
XSS: <script>alert('xss')</script>
SQL: ' OR '1'='1
Special: !@#$%^&*()_+-={}[]|:";'<>?,./
Long: "a" * 1000
```

---

### 20. Edge Cases & Boundary Testing

#### ✅ Edge Cases
- [ ] **BB-173:** ทดสอบกับข้อมูลว่าง (empty database)
- [ ] **BB-174:** ทดสอบกับข้อมูล 1 รายการ
- [ ] **BB-175:** ทดสอบกับข้อมูลจำนวนมาก (500+ items)
- [ ] **BB-176:** ทดสอบ concurrent operations (2 users แก้ไขพร้อมกัน)
- [ ] **BB-177:** ทดสอบ offline mode
- [ ] **BB-178:** ทดสอบ slow network (3G)
- [ ] **BB-179:** ทดสอบ browser refresh ระหว่างทำงาน
- [ ] **BB-180:** ทดสอบ back button หลัง submit form

---

## 📊 Test Execution Tracking

### Execution Summary

| Category | Total Tests | Passed | Failed | Blocked | Skipped |
|----------|-------------|--------|--------|---------|---------|
| White Box | 52 | - | - | - | - |
| Black Box | 180 | - | - | - | - |
| **Total** | **232** | - | - | - | - |

### Priority Distribution

| Priority | Count |
|----------|-------|
| P0 - Critical | 30 |
| P1 - High | 80 |
| P2 - Medium | 90 |
| P3 - Low | 32 |

---

## 📝 Test Execution Notes

### Testing Environment
- **OS:** _____________
- **Browser:** _____________
- **Screen Resolution:** _____________
- **Date:** _____________
- **Tester:** _____________

### Issues Found
1. _______________________________________________
2. _______________________________________________
3. _______________________________________________

### Blockers
1. _______________________________________________
2. _______________________________________________

### Notes
_______________________________________________
_______________________________________________
_______________________________________________

---

## ✅ Sign-off

**Tested by:** _________________  
**Date:** _________________  
**Status:** [ ] Pass [ ] Pass with Issues [ ] Fail  
**Approved by:** _________________
