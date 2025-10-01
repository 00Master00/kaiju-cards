# Test Plan - ระบบจัดการ Anime

## 1. ข้อมูลโครงการ
- **ชื่อโครงการ:** ระบบจัดการและแสดงข้อมูล Anime
- **เวอร์ชัน:** 1.0
- **วันที่จัดทำ:** 1 ตุลาคม 2025
- **ผู้จัดทำ:** Development Team

## 2. วัตถุประสงค์
การทดสอบมีวัตถุประสงค์เพื่อ:
- ตรวจสอบความถูกต้องของฟังก์ชันการทำงานทั้งหมด
- ตรวจสอบความปลอดภัยของข้อมูลและการเข้าถึง
- ยืนยันประสิทธิภาพและความเสถียรของระบบ
- ตรวจสอบ User Experience และ User Interface

## 3. ขอบเขตการทดสอบ

### 3.1 ส่วนที่จะทดสอบ
#### Admin Panel
- ระบบ Authentication (Login/Logout)
- Dashboard และสถิติ
- การจัดการข้อมูล Anime (CRUD)
- การจัดการ Genres
- การแสดงรายละเอียด Anime

#### Front Office
- หน้าแรก (Home) - แสดง Anime ยอดนิยม
- หน้า Search - ค้นหาและกรอง Anime
- หน้า Popular Rankings
- หน้า Recent Updates

### 3.2 ส่วนที่ไม่ทดสอบ
- Third-party libraries (React, Supabase, etc.)
- Browser compatibility แบบละเอียด
- Performance testing ภายใต้ load สูง

## 4. กลยุทธ์การทดสอบ

### 4.1 ประเภทการทดสอบ

#### White Box Testing
- Unit Testing สำหรับ Hooks และ Utilities
- Integration Testing สำหรับ Database Operations
- Code Review สำหรับ Security และ Best Practices

#### Black Box Testing
- Functional Testing ทุก Feature
- UI/UX Testing
- End-to-End Testing User Flows
- Boundary Testing สำหรับ Input Validation

### 4.2 เครื่องมือที่ใช้
- **Manual Testing:** การทดสอบด้วยมือ
- **Browser DevTools:** ตรวจสอบ Console, Network, Performance
- **Supabase Dashboard:** ตรวจสอบ Database และ Queries
- **React DevTools:** ตรวจสอบ Component State

## 5. Test Cases หลัก

### 5.1 Authentication
| Test ID | Test Case | Priority |
|---------|-----------|----------|
| AUTH-001 | Login ด้วย Email/Password ที่ถูกต้อง | สูง |
| AUTH-002 | Login ด้วยข้อมูลที่ผิด | สูง |
| AUTH-003 | Logout จากระบบ | สูง |
| AUTH-004 | Session Persistence หลัง Refresh | กลาง |

### 5.2 Anime Management (Admin)
| Test ID | Test Case | Priority |
|---------|-----------|----------|
| ANIME-001 | เพิ่ม Anime ใหม่พร้อมข้อมูลครบถ้วน | สูง |
| ANIME-002 | แก้ไขข้อมูล Anime ที่มีอยู่ | สูง |
| ANIME-003 | ลบ Anime | กลาง |
| ANIME-004 | แสดงรายละเอียด Anime | สูง |
| ANIME-005 | Upload รูปภาพ Anime | กลาง |

### 5.3 Genre Management
| Test ID | Test Case | Priority |
|---------|-----------|----------|
| GENRE-001 | เพิ่ม Genre ใหม่ | สูง |
| GENRE-002 | ลบ Genre ที่ไม่มีการใช้งาน | กลาง |
| GENRE-003 | ลบ Genre ที่มีการใช้งาน (ควรถูกปฏิเสธ) | สูง |
| GENRE-004 | ค้นหา Genre | ต่ำ |
| GENRE-005 | ดูรายการ Anime ใน Genre | กลาง |

### 5.4 Front Office
| Test ID | Test Case | Priority |
|---------|-----------|----------|
| FRONT-001 | แสดงหน้าแรกพร้อม Anime ยอดนิยม | สูง |
| FRONT-002 | ค้นหา Anime ตามชื่อ | สูง |
| FRONT-003 | กรองตาม Genre | กลาง |
| FRONT-004 | แสดง Popular Rankings | กลาง |
| FRONT-005 | แสดง Recent Updates | กลาง |

## 6. Acceptance Criteria

### 6.1 Functional Requirements
- ✅ ระบบ Login/Logout ทำงานถูกต้อง
- ✅ สามารถเพิ่ม แก้ไข ลบ Anime ได้
- ✅ สามารถจัดการ Genres ได้
- ✅ แสดงข้อมูลถูกต้องทั้ง Admin และ Front Office
- ✅ ระบบค้นหาและกรองทำงานถูกต้อง

### 6.2 Non-Functional Requirements
- ✅ ระบบตอบสนองภายใน 3 วินาที
- ✅ UI ใช้งานง่าย สวยงาม
- ✅ Responsive ทำงานได้บนหน้าจอทุกขนาด
- ✅ Error messages ชัดเจนและเป็นภาษาไทย
- ✅ ข้อมูลถูกเก็บอย่างปลอดภัยด้วย RLS

## 7. Test Environment

### 7.1 Hardware
- Computer: Standard Desktop/Laptop
- Mobile Device: สำหรับทดสอบ Responsive

### 7.2 Software
- **Browsers:** Chrome, Firefox, Safari, Edge (Latest versions)
- **Operating Systems:** Windows, macOS, Linux
- **Database:** Supabase PostgreSQL
- **Backend:** Supabase Edge Functions

### 7.3 Test Data
- User accounts สำหรับทดสอบ
- Anime test data (10-20 รายการ)
- Genres test data
- รูปภาพทดสอบ

## 8. Schedule

| Phase | Duration | Date |
|-------|----------|------|
| Test Planning | 1 วัน | วันที่ 1 |
| Test Case Creation | 1 วัน | วันที่ 2 |
| White Box Testing | 2 วัน | วันที่ 3-4 |
| Black Box Testing | 2 วัน | วันที่ 5-6 |
| Bug Fixing | 2 วัน | วันที่ 7-8 |
| Regression Testing | 1 วัน | วันที่ 9 |
| Final Report | 1 วัน | วันที่ 10 |

## 9. Roles & Responsibilities

| Role | Name | Responsibility |
|------|------|----------------|
| Test Lead | TBD | จัดการและประสานงานการทดสอบ |
| Test Engineer | TBD | ดำเนินการทดสอบตาม Test Cases |
| Developer | TBD | แก้ไข Bugs ที่พบ |
| Product Owner | TBD | อนุมัติ Test Results |

## 10. Risk Analysis

### 10.1 Risks
| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Database Connection ล้มเหลว | สูง | ต่ำ | มี Fallback และ Error Handling |
| Session หมดอายุขณะใช้งาน | กลาง | กลาง | Auto-refresh Token |
| Upload รูปภาพขนาดใหญ่ | กลาง | กลาง | จำกัดขนาดไฟล์ |
| Concurrent Users | ต่ำ | ต่ำ | Database Locking |

## 11. Deliverables
- Test Plan Document (เอกสารนี้)
- White Box Testing Report
- Black Box Testing Report
- Bug Reports
- Test Summary Report

## 12. Approval

| Role | Name | Signature | Date |
|------|------|-----------|------|
| Test Lead | _________ | _________ | __/__/__ |
| Project Manager | _________ | _________ | __/__/__ |
| Product Owner | _________ | _________ | __/__/__ |

---

**หมายเหตุ:** เอกสารนี้เป็น Living Document และจะถูกปรับปรุงตามความจำเป็น
