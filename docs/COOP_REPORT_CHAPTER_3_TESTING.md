# บทที่ 3: การออกแบบระบบการทดสอบ

## 3.1 กลยุทธ์การทดสอบ (Testing Strategy)

### 3.1.1 ภาพรวมกลยุทธ์การทดสอบ

โครงการ Anime Management System ใช้กลยุทธ์การทดสอบแบบหลายระดับ (Multi-level Testing Strategy) โดยผสมผสานทั้ง White Box Testing และ Black Box Testing เพื่อให้ครอบคลุมการทดสอบทั้งโครงสร้างภายในและพฤติกรรมภายนอกของระบบ

**Testing Pyramid สำหรับโครงการนี้**
```
           /\
          /E2E\         10% - Manual Testing (Full User Flows)
         /______\
        /        \
       /Integrate\      30% - Integration Tests (Component Interaction)
      /____________\
     /              \
    /   Unit Tests   \   60% - Unit Tests (Hooks, Components, Utilities)
   /__________________\
```

### 3.1.2 Test Levels และ Coverage Goals

| Test Level | Coverage Goal | Tools | Time Budget |
|-----------|---------------|-------|-------------|
| **Unit Tests** | 85%+ | Jest, RTL | 60% ของเวลา |
| **Integration Tests** | 70%+ | Jest, RTL, MSW | 30% ของเวลา |
| **System Tests** | 100% Features | Manual Testing | 10% ของเวลา |
| **Performance Tests** | Key Flows | Chrome DevTools | As needed |

### 3.1.3 Testing Priorities

**Priority 1: Critical Features (ต้องทดสอบก่อน)**
1. Authentication และ Authorization
2. CRUD Operations สำหรับ Anime
3. CRUD Operations สำหรับ Genres
4. Data Validation
5. Error Handling

**Priority 2: Important Features**
1. Search Functionality
2. Filtering และ Sorting
3. Image Upload
4. Navigation
5. Responsive Design

**Priority 3: Nice-to-Have Features**
1. Statistics Dashboard
2. Recent Updates Display
3. Popular Anime Ranking
4. UI Animations

## 3.2 Test Case Design

### 3.2.1 Test Case Template

แต่ละ Test Case จะใช้รูปแบบดังนี้:

```
TC-[Module]-[Number]: [Test Case Title]

Objective: วัตถุประสงค์ของการทดสอบ
Type: Unit/Integration/System
Priority: High/Medium/Low
Prerequisites: เงื่อนไขเบื้องต้น

Test Steps:
1. [Step 1]
2. [Step 2]
...

Test Data:
- Input: [Test data used]
- Expected Output: [Expected result]

Pass Criteria:
- [Criterion 1]
- [Criterion 2]

Actual Result: [จะกรอกหลังทดสอบ]
Status: Pass/Fail
Notes: [หมายเหตุเพิ่มเติม]
```

### 3.2.2 Test Case Categories

#### A. Authentication Test Cases

**TC-AUTH-001: Successful Login**
```
Objective: ตรวจสอบการ Login ด้วย Email และ Password ที่ถูกต้อง
Type: Integration
Priority: High

Test Steps:
1. เปิดหน้า Login
2. กรอก Email: "admin@example.com"
3. กรอก Password: "correctPassword"
4. คลิกปุ่ม "Login"

Expected Output:
- Redirect ไปหน้า Dashboard
- แสดงข้อความ "Login successful"
- Session ถูกสร้างใน localStorage

Pass Criteria:
✓ User ถูก redirect ไปหน้า Dashboard
✓ Token ถูกเก็บใน session
✓ Protected routes สามารถเข้าถึงได้
```

**TC-AUTH-002: Login with Invalid Credentials**
```
Objective: ตรวจสอบการจัดการ Login ที่ล้มเหลว
Type: Integration
Priority: High

Test Steps:
1. เปิดหน้า Login
2. กรอก Email: "admin@example.com"
3. กรอก Password: "wrongPassword"
4. คลิกปุ่ม "Login"

Expected Output:
- แสดง Error message: "Invalid credentials"
- ยังคงอยู่ที่หน้า Login
- ไม่มี Session ถูกสร้าง

Pass Criteria:
✓ แสดง Error message ที่เหมาะสม
✓ ไม่มีการ redirect
✓ Form ยังคงมีข้อมูลอยู่
```

**TC-AUTH-003: Protected Route Access**
```
Objective: ตรวจสอบการป้องกัน Protected Routes
Type: Integration
Priority: High

Test Steps:
1. Clear session/cookies
2. พยายามเข้าถึง "/dashboard" โดยตรง

Expected Output:
- Redirect ไปหน้า Login
- แสดงข้อความ "Please login to continue"

Pass Criteria:
✓ ไม่สามารถเข้าถึงหน้าได้
✓ Redirect ไป Login page
✓ แสดง appropriate message
```

#### B. Anime CRUD Test Cases

**TC-ANIME-001: Create New Anime**
```
Objective: ทดสอบการสร้างอนิเมะใหม่
Type: Integration
Priority: High

Prerequisites: User ต้อง Login แล้ว

Test Steps:
1. ไปที่ Anime Management
2. คลิก "Add New Anime"
3. กรอกข้อมูล:
   - Title: "Demon Slayer"
   - Japanese Title: "鬼滅の刃"
   - Episodes: 26
   - Rating: 8.7
   - Status: "Completed"
   - Genres: ["Action", "Fantasy"]
4. Upload รูปภาพ
5. คลิก "Save"

Expected Output:
- อนิเมะใหม่ถูกสร้างในฐานข้อมูล
- Redirect กลับไปที่ Anime List
- แสดงข้อความ "Anime created successfully"
- เห็นอนิเมะใหม่ใน list

Pass Criteria:
✓ ข้อมูลถูกบันทึกถูกต้อง
✓ รูปภาพถูก upload
✓ แสดง success message
✓ อนิเมะปรากฏใน list
```

**TC-ANIME-002: Edit Existing Anime**
```
Objective: ทดสอบการแก้ไขข้อมูลอนิเมะ
Type: Integration
Priority: High

Prerequisites: มีอนิเมะอยู่ในระบบแล้ว

Test Steps:
1. เลือกอนิเมะที่ต้องการแก้ไข
2. คลิก "Edit"
3. แก้ไข Rating จาก 8.5 เป็น 9.0
4. แก้ไข Status จาก "Ongoing" เป็น "Completed"
5. คลิก "Update"

Expected Output:
- ข้อมูลถูกอัพเดทในฐานข้อมูล
- แสดงข้อความ "Anime updated successfully"
- ข้อมูลใหม่แสดงใน list

Pass Criteria:
✓ ข้อมูลถูกอัพเดท
✓ Changes reflected ทันที
✓ ไม่กระทบข้อมูลอื่น
```

**TC-ANIME-003: Delete Anime**
```
Objective: ทดสอบการลบอนิเมะ
Type: Integration
Priority: High

Test Steps:
1. เลือกอนิเมะที่ต้องการลบ
2. คลิก "Delete"
3. ยืนยันการลบใน Confirmation Dialog
4. คลิก "Confirm"

Expected Output:
- อนิเมะถูกลบจากฐานข้อมูล
- หายจาก list
- แสดงข้อความ "Anime deleted successfully"

Pass Criteria:
✓ อนิเมะถูกลบจาก database
✓ UI อัพเดททันที
✓ แสดง confirmation dialog
```

**TC-ANIME-004: View Anime Detail**
```
Objective: ทดสอบการแสดงรายละเอียดอนิเมะ
Type: Integration
Priority: Medium

Test Steps:
1. คลิกที่การ์ดอนิเมะ
2. ดูรายละเอียดที่แสดง

Expected Output:
- แสดงข้อมูลครบถ้วน: Title, Rating, Episodes, Genres, Description
- แสดงรูปภาพ
- แสดง Navigation กลับ

Pass Criteria:
✓ ข้อมูลครบถ้วนและถูกต้อง
✓ รูปภาพโหลดได้
✓ Layout responsive
```

#### C. Genre Management Test Cases

**TC-GENRE-001: Create New Genre**
```
Objective: ทดสอบการสร้างหมวดหมู่ใหม่
Type: Unit
Priority: High

Test Steps:
1. ไปที่ Genre Management
2. คลิก "Add Genre"
3. กรอก Name: "Isekai"
4. กรอก Description: "Another world fantasy"
5. คลิก "Save"

Expected Output:
- Genre ใหม่ถูกสร้าง
- แสดงใน genre list
- สามารถนำไปใช้กับอนิเมะได้

Pass Criteria:
✓ Genre ถูกสร้างสำเร็จ
✓ Available ในฟอร์มสร้างอนิเมะ
✓ แสดง success message
```

**TC-GENRE-002: Delete Genre with Associated Animes**
```
Objective: ทดสอบการลบ Genre ที่มีอนิเมะเชื่อมโยง
Type: Integration
Priority: High

Prerequisites: Genre "Action" มีอนิเมะ 5 เรื่องเชื่อมโยง

Test Steps:
1. พยายามลบ Genre "Action"
2. ตรวจสอบ warning message

Expected Output:
- แสดง Warning: "This genre is used by 5 animes"
- ขอ confirmation
- หากยืนยัน: Genre ถูกลบแต่อนิเมะยังคงอยู่

Pass Criteria:
✓ แสดง warning message
✓ ต้องการ confirmation
✓ ไม่กระทบ animes ที่เกี่ยวข้อง
```

#### D. Search and Filter Test Cases

**TC-SEARCH-001: Basic Search**
```
Objective: ทดสอบการค้นหาอนิเมะด้วย keyword
Type: Integration
Priority: High

Test Steps:
1. กรอก "Naruto" ในช่องค้นหา
2. กด Enter หรือคลิกปุ่มค้นหา

Expected Output:
- แสดงอนิเมะที่มี "Naruto" ใน title
- Results updated ทันที
- แสดงจำนวนผลลัพธ์

Pass Criteria:
✓ ผลลัพธ์ถูกต้อง
✓ Case-insensitive search
✓ แสดง "No results" ถ้าไม่เจอ
```

**TC-SEARCH-002: Empty Search**
```
Objective: ทดสอบการค้นหาด้วย empty string
Type: Integration
Priority: Medium

Test Steps:
1. ล้างช่องค้นหา
2. กด Enter

Expected Output:
- แสดงอนิเมะทั้งหมด
- หรือแสดง placeholder message

Pass Criteria:
✓ ไม่ error
✓ แสดงผลที่เหมาะสม
```

**TC-FILTER-001: Filter by Genre**
```
Objective: ทดสอบการกรองตามหมวดหมู่
Type: Integration
Priority: High

Test Steps:
1. เลือก Genre: "Action"
2. ตรวจสอบผลลัพธ์

Expected Output:
- แสดงเฉพาะอนิเมะประเภท Action
- สามารถเลือกหลาย genres ได้
- แสดงจำนวนผลลัพธ์

Pass Criteria:
✓ Filter ทำงานถูกต้อง
✓ สามารถใช้ multiple filters
✓ สามารถ clear filters ได้
```

**TC-SORT-001: Sort by Rating**
```
Objective: ทดสอบการเรียงลำดับตาม rating
Type: Integration
Priority: Medium

Test Steps:
1. เลือก Sort: "Rating (High to Low)"
2. ตรวจสอบผลลัพธ์

Expected Output:
- อนิเมะถูกเรียงจาก rating สูงไปต่ำ
- การเรียงลำดับถูกต้อง

Pass Criteria:
✓ เรียงลำดับถูกต้อง
✓ UI อัพเดททันที
```

#### E. Form Validation Test Cases

**TC-VAL-001: Required Fields Validation**
```
Objective: ทดสอบการ validate required fields
Type: Unit
Priority: High

Test Steps:
1. เปิดฟอร์มสร้างอนิเมะ
2. ปล่อยฟิลด์ Title ว่าง
3. พยายาม submit

Expected Output:
- แสดง Error: "Title is required"
- Form ไม่ submit
- Focus ไปที่ field ที่ผิดพลาด

Pass Criteria:
✓ แสดง error message
✓ ไม่ submit form
✓ Focus management ถูกต้อง
```

**TC-VAL-002: Rating Range Validation**
```
Objective: ทดสอบการ validate rating range (0-10)
Type: Unit
Priority: High

Test Data:
- Input 1: -1 (Invalid)
- Input 2: 0 (Valid, Min)
- Input 3: 5 (Valid, Normal)
- Input 4: 10 (Valid, Max)
- Input 5: 11 (Invalid)

Expected Output:
- -1: Error "Rating must be between 0 and 10"
- 11: Error "Rating must be between 0 and 10"
- 0, 5, 10: No error

Pass Criteria:
✓ Invalid values rejected
✓ Valid values accepted
✓ Appropriate error messages
```

**TC-VAL-003: URL Format Validation**
```
Objective: ทดสอบการ validate URL format
Type: Unit
Priority: Medium

Test Data:
- "not-a-url" ❌
- "http://example" ❌
- "http://example.com" ✅
- "https://example.com/image.jpg" ✅

Pass Criteria:
✓ Invalid URLs rejected
✓ Valid URLs accepted
```

## 3.3 Test Data Design

### 3.3.1 Test Data Sets

#### Valid Test Data (Happy Path)

**Anime Data**
```json
{
  "valid_anime_1": {
    "title": "Attack on Titan",
    "title_japanese": "進撃の巨人",
    "episodes": 75,
    "rating": 9.0,
    "status": "Completed",
    "genres": ["Action", "Drama", "Fantasy"],
    "description": "Humanity fights against giant humanoid creatures.",
    "image_url": "https://example.com/aot.jpg"
  },
  "valid_anime_2": {
    "title": "Death Note",
    "title_japanese": "デスノート",
    "episodes": 37,
    "rating": 8.6,
    "status": "Completed",
    "genres": ["Mystery", "Thriller"],
    "description": "Light Yagami finds a supernatural notebook.",
    "image_url": "https://example.com/deathnote.jpg"
  }
}
```

**Genre Data**
```json
{
  "valid_genres": [
    { "name": "Action", "description": "Fast-paced, exciting content" },
    { "name": "Romance", "description": "Love and relationships" },
    { "name": "Comedy", "description": "Humorous and entertaining" }
  ]
}
```

#### Invalid Test Data (Negative Testing)

**Boundary Values**
```json
{
  "invalid_anime": {
    "empty_title": {
      "title": "",
      "expected_error": "Title is required"
    },
    "rating_too_low": {
      "title": "Test",
      "rating": -1,
      "expected_error": "Rating must be between 0 and 10"
    },
    "rating_too_high": {
      "title": "Test",
      "rating": 11,
      "expected_error": "Rating must be between 0 and 10"
    },
    "episodes_negative": {
      "title": "Test",
      "episodes": -5,
      "expected_error": "Episodes must be positive"
    }
  }
}
```

#### Edge Cases

```json
{
  "edge_cases": {
    "very_long_title": {
      "title": "A".repeat(500),
      "test": "Should handle or truncate long titles"
    },
    "special_characters": {
      "title": "Test<>\"'&@#$%",
      "test": "Should handle special characters safely"
    },
    "unicode_characters": {
      "title": "Test 日本語 한국어 中文 العربية",
      "test": "Should support international characters"
    },
    "max_genres": {
      "genres": ["G1", "G2", "G3", "G4", "G5", "G6", "G7", "G8"],
      "test": "Should handle maximum genre selections"
    }
  }
}
```

### 3.3.2 Test Database Setup

**Development Test Database**
```sql
-- Mock data สำหรับ Development
INSERT INTO animes (title, rating, episodes, status) VALUES
  ('Naruto', 8.3, 220, 'Completed'),
  ('One Piece', 8.7, 1000, 'Ongoing'),
  ('Demon Slayer', 8.6, 26, 'Completed'),
  ('Attack on Titan', 9.0, 75, 'Completed'),
  ('My Hero Academia', 8.4, 113, 'Ongoing');

INSERT INTO genres (name, description) VALUES
  ('Action', 'Fast-paced, exciting anime'),
  ('Adventure', 'Journey and exploration'),
  ('Comedy', 'Humorous content'),
  ('Drama', 'Serious storytelling'),
  ('Fantasy', 'Magical and supernatural');
```

## 3.4 Test Environment Setup

### 3.4.1 Testing Environment Layers

**1. Unit Testing Environment**
```typescript
// jest.config.cjs
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/__tests__/setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/main.tsx',
  ],
  coverageThresholds: {
    global: {
      statements: 80,
      branches: 75,
      functions: 80,
      lines: 80,
    },
  },
};
```

**2. Test Setup File**
```typescript
// src/__tests__/setup.ts
import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach } from '@jest/globals';

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Mock Supabase
jest.mock('@/integrations/supabase/client');

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});
```

### 3.4.2 Continuous Integration Setup

**GitHub Actions Workflow**
```yaml
name: Test Suite

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm install
      
      - name: Run linter
        run: npm run lint
      
      - name: Run tests
        run: npm test -- --coverage
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
```

## 3.5 Test Execution Plan

### 3.5.1 Test Execution Schedule

**Daily Testing**
- Run Unit Tests (Automated)
- Quick Smoke Tests (Manual)
- Review Test Results

**Weekly Testing**
- Full Integration Test Suite
- Regression Testing
- Performance Spot Checks
- Review Coverage Reports

**Before Release**
- Complete Test Suite
- Manual System Testing
- Security Scan
- Cross-browser Testing
- UAT Preparation

### 3.5.2 Test Automation Strategy

**Automated Tests (90%)**
- ✅ Unit Tests
- ✅ Integration Tests
- ✅ Component Tests
- ✅ API Tests (Mocked)

**Manual Tests (10%)**
- ⚡ UI/UX Verification
- ⚡ Cross-browser Testing
- ⚡ Exploratory Testing
- ⚡ Usability Testing

### 3.5.3 Defect Management Process

**1. Defect Reporting**
```
Defect ID: DEF-[Date]-[Number]
Title: [Short description]
Severity: Critical / High / Medium / Low
Priority: P1 / P2 / P3 / P4

Description:
[Detailed description of the issue]

Steps to Reproduce:
1. [Step 1]
2. [Step 2]
...

Expected Result:
[What should happen]

Actual Result:
[What actually happens]

Environment:
- Browser: Chrome 120
- OS: Windows 11
- User Role: Admin

Attachments:
- Screenshot
- Console logs
- Network logs
```

**2. Severity Classification**

| Severity | Definition | Example |
|----------|-----------|---------|
| **Critical** | System crash, data loss | Database corruption, app won't start |
| **High** | Major feature broken | Cannot create anime, login fails |
| **Medium** | Feature partially works | Search returns incorrect results |
| **Low** | Minor UI issue | Button misalignment, typo |

**3. Priority Classification**

| Priority | Definition | Action Timeline |
|----------|-----------|----------------|
| **P1** | Must fix immediately | Same day |
| **P2** | Should fix soon | Within 1 week |
| **P3** | Can fix later | Within sprint |
| **P4** | Nice to have | Backlog |

## 3.6 Test Documentation Structure

### 3.6.1 เอกสารที่จัดทำ

**1. Test Plan Document**
- Testing scope and objectives
- Test strategy
- Resources and timeline
- Entry and exit criteria

**2. Test Case Specifications**
- Detailed test cases (TC-XXX-YYY format)
- Test data sets
- Expected results

**3. Test Execution Log**
- Test run records
- Pass/Fail results
- Defect references

**4. Defect Reports**
- Bug tracking
- Severity and priority
- Resolution status

**5. Test Summary Report**
- Overall test results
- Metrics and statistics
- Quality assessment
- Recommendations

### 3.6.2 Test Traceability Matrix

| Requirement | Test Case(s) | Status | Comments |
|------------|-------------|--------|----------|
| REQ-001: User Login | TC-AUTH-001, TC-AUTH-002 | ✅ Pass | |
| REQ-002: Create Anime | TC-ANIME-001 | ✅ Pass | |
| REQ-003: Edit Anime | TC-ANIME-002 | ✅ Pass | |
| REQ-004: Delete Anime | TC-ANIME-003 | ✅ Pass | |
| REQ-005: Search Anime | TC-SEARCH-001, TC-SEARCH-002 | ✅ Pass | |
| REQ-006: Filter by Genre | TC-FILTER-001 | ✅ Pass | |
| REQ-007: Form Validation | TC-VAL-001, TC-VAL-002 | ✅ Pass | |

---

**สรุป:** บทนี้ครอบคลุมการออกแบบระบบการทดสอบอย่างละเอียด ตั้งแต่กลยุทธ์การทดสอบ การออกแบบ Test Cases การเตรียม Test Data การจัดการสภาพแวดล้อมการทดสอบ แผนการดำเนินการทดสอบ และโครงสร้างเอกสาร เพื่อให้การทดสอบเป็นไปอย่างเป็นระบบและมีประสิทธิภาพ
