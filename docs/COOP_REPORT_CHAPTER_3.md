# บทที่ 3: การออกแบบระบบการทดสอบ

## 3.1 กลยุทธ์การทดสอบ (Test Strategy)

### 3.1.1 แนวทางการทดสอบโดยรวม

โครงการนี้ใช้แนวทาง **Hybrid Testing Approach** ที่ผสมผสานระหว่าง:

1. **White Box Testing (Automated)** - 63.3% ของการทดสอบทั้งหมด
   - Unit Testing สำหรับ Custom Hooks และ Utilities
   - Component Testing สำหรับ React Components
   - Integration Testing สำหรับการทำงานร่วมกันของส่วนประกอบ

2. **Black Box Testing (Manual)** - 36.7% ของการทดสอบทั้งหมด
   - Functional Testing สำหรับฟังก์ชันทั้งหมด
   - UI/UX Testing สำหรับประสบการณ์ผู้ใช้
   - Cross-browser และ Responsive Testing

### 3.1.2 หลักเกณฑ์การออกแบบ Test Cases

**เกณฑ์ความครอบคลุม (Coverage Criteria):**
- Code Coverage เป้าหมาย: ≥ 80%
- Branch Coverage เป้าหมาย: ≥ 75%
- Function Coverage เป้าหมาย: ≥ 85%
- ครอบคลุมทุก Critical และ High Priority Features: 100%

**เกณฑ์ความสำคัญ (Priority Criteria):**
- **P0 - Critical:** ฟังก์ชันหลักที่จำเป็นต่อการทำงาน (Authentication, CRUD)
- **P1 - High:** ฟังก์ชันสำคัญ (Search, Filter, Sort)
- **P2 - Medium:** ฟังก์ชันเสริม (UI Animations, Tooltips)
- **P3 - Low:** ฟังก์ชันรอง (Analytics, Logs)

---

## 3.2 การออกแบบ Test Cases

### 3.2.1 เทมเพลต Test Case

```markdown
Test Case ID: TC-[Module]-[Number]
Title: [ชื่อ Test Case]
Module: [ชื่อโมดูล]
Priority: [P0/P1/P2/P3]
Type: [Automated/Manual]
Testing Type: [White Box/Black Box]

Preconditions:
- [เงื่อนไขก่อนทดสอบ]

Test Steps:
1. [ขั้นตอนที่ 1]
2. [ขั้นตอนที่ 2]

Test Data:
- Input: [ข้อมูลที่ใช้ทดสอบ]

Expected Result:
- [ผลลัพธ์ที่คาดหวัง]

Actual Result:
- [ผลลัพธ์จริง]

Status: [Pass/Fail/Blocked]
Defect ID: [ถ้าพบข้อบกพร่อง]
```

### 3.2.2 Test Cases สำหรับ Authentication Module

#### TC-AUTH-001: Login with Valid Credentials (White Box)
```typescript
describe('Authentication - Login', () => {
  test('TC-AUTH-001: Should login successfully with valid credentials', async () => {
    // Arrange
    const email = 'admin@test.com';
    const password = 'Test1234';
    
    // Act
    const result = await signIn(email, password);
    
    // Assert
    expect(result.error).toBeNull();
    expect(result.data.user).toBeDefined();
    expect(result.data.session).toBeDefined();
  });
});
```

#### TC-AUTH-002: Login with Invalid Credentials (Black Box - Manual)
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Navigate to login page | Login form displayed |
| 2 | Enter email: "wrong@test.com" | Email accepted |
| 3 | Enter password: "wrong123" | Password hidden |
| 4 | Click "Login" button | Error message: "Invalid credentials" |
| 5 | User remains on login page | Not redirected |

---

## 3.3 การออกแบบ Test Data

### 3.3.1 Valid Test Data

**Anime Data:**
```json
{
  "title": "Test Anime",
  "description": "A test anime description with at least 50 characters for validation.",
  "score": 8.5,
  "episodes": 24,
  "status": "Completed",
  "aired_from": "2024-01-01",
  "aired_to": "2024-06-30",
  "image_url": "https://example.com/image.jpg",
  "genres": ["Action", "Adventure"]
}
```

**Genre Data:**
```json
{
  "name": "Action",
  "color": "#FF5733",
  "icon": "⚔️"
}
```

### 3.3.2 Invalid Test Data

**Boundary Value Testing:**
- Title: "" (empty), "A" (1 char), "A".repeat(256) (too long)
- Score: -1, 0, 10.1, 11 (out of range 1-10)
- Episodes: -1, 0, 10001 (negative, zero, too large)

**Special Characters Testing:**
- Title with SQL: "'; DROP TABLE animes; --"
- Title with XSS: "<script>alert('test')</script>"
- Title with Unicode: "テスト アニメ 🎌"

### 3.3.3 Edge Cases

```typescript
// Empty arrays
genres: []

// Null values
description: null
aired_to: null

// Maximum values
title: "A".repeat(255) // Max length

// Minimum values  
score: 1.0
episodes: 1

// Date edge cases
aired_from: "2024-12-31"
aired_to: "2024-01-01" // Invalid: end before start
```

---

## 3.4 Test Environment Setup

### 3.4.1 Automated Testing Environment

**Jest Configuration (jest.config.cjs):**
```javascript
module.exports = {
  preset: 'ts-jest',
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
  coverageThreshold: {
    global: {
      branches: 75,
      functions: 85,
      lines: 80,
      statements: 80,
    },
  },
};
```

**Test Setup (src/__tests__/setup.ts):**
```typescript
import '@testing-library/jest-dom';
import { setupServer } from 'msw/node';
import { handlers } from './mocks/handlers';

export const server = setupServer(...handlers);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

### 3.4.2 Manual Testing Environment

**Test Browsers:**
- Chrome (Latest)
- Firefox (Latest)  
- Safari (Latest)
- Edge (Latest)

**Test Devices:**
- Desktop: 1920x1080, 1366x768
- Tablet: iPad (768x1024)
- Mobile: iPhone 12 (390x844)

**Test Data Setup:**
```sql
-- Seed data for testing
INSERT INTO genres (name, color, icon) VALUES
  ('Action', '#FF5733', '⚔️'),
  ('Romance', '#FF69B4', '💕'),
  ('Comedy', '#FFD700', '😄');

INSERT INTO animes (title, score, episodes, status) VALUES
  ('Test Anime 1', 8.5, 24, 'Completed'),
  ('Test Anime 2', 9.0, 12, 'Ongoing');
```

---

## 3.5 Test Execution Plan

### 3.5.1 Automated Testing Schedule

**Daily:**
- Run Unit Tests on every code commit (CI/CD)
- Code Coverage Report generation

**Weekly:**
- Full Regression Testing
- Integration Testing for new features

**Before Release:**
- Complete Test Suite execution
- Performance Testing
- Security Scanning

### 3.5.2 Manual Testing Schedule

**Week 8:**
- Functional Testing (All modules)
- UI/UX Testing

**Week 9:**  
- Cross-browser Testing
- Responsive Design Testing
- Usability Testing

**Week 10:**
- Final Verification Testing
- Bug Retesting

---

## 3.6 Defect Management

### 3.6.1 Defect Classification

**Severity Levels:**
- **Critical:** ระบบไม่สามารถใช้งานได้, Data Loss
- **High:** ฟังก์ชันหลักไม่ทำงาน, Crash
- **Medium:** ฟังก์ชันทำงานผิดพลาด, UI Issues
- **Low:** Text errors, Minor UI issues

**Priority Levels:**
- **P0:** แก้ไขทันที (< 24 ชั่วโมง)
- **P1:** แก้ไขเร็ว (< 3 วัน)
- **P2:** แก้ไขปกติ (< 1 สัปดาห์)
- **P3:** แก้ไขเมื่อมีเวลา (Backlog)

### 3.6.2 Bug Report Template

```markdown
Bug ID: BUG-[Number]
Title: [ชื่อข้อบกพร่อง]
Severity: [Critical/High/Medium/Low]
Priority: [P0/P1/P2/P3]
Status: [New/In Progress/Fixed/Verified/Closed]

Environment:
- Browser: [Chrome 120]
- OS: [Windows 11]
- Screen Size: [1920x1080]

Steps to Reproduce:
1. [ขั้นตอน 1]
2. [ขั้นตอน 2]

Expected Result:
[ผลที่ควรได้]

Actual Result:
[ผลที่ได้จริง]

Screenshots/Videos:
[แนบไฟล์]

Additional Notes:
[หมายเหตุเพิ่มเติม]
```

---

## 3.7 Test Metrics และ KPIs

### 3.7.1 Test Metrics

**Quality Metrics:**
```
Test Pass Rate = (Passed Tests / Total Tests) × 100%
Target: ≥ 95%

Code Coverage = (Covered Lines / Total Lines) × 100%
Target: ≥ 80%

Defect Density = Total Defects / KLOC
Target: ≤ 5 defects per KLOC

Defect Detection Efficiency = (Defects Found in Testing / Total Defects) × 100%
Target: ≥ 90%
```

**Productivity Metrics:**
```
Test Execution Rate = Tests Executed / Time Period
Average Test Execution Time = Total Time / Number of Tests
Test Automation Rate = (Automated Tests / Total Tests) × 100%
```

### 3.7.2 KPIs (Key Performance Indicators)

| KPI | Target | Actual | Status |
|-----|--------|--------|--------|
| Test Pass Rate | ≥ 95% | 94.87% | ⚠️ Near Target |
| Code Coverage | ≥ 80% | 87.3% | ✅ Achieved |
| Critical Bugs | 0 | 2 | ❌ Need Fix |
| High Priority Bugs | ≤ 5 | 6 | ⚠️ Acceptable |
| Test Automation | ≥ 60% | 63.3% | ✅ Achieved |

---

## สรุป

บทที่ 3 นี้ได้นำเสนอการออกแบบระบบการทดสอบที่ครอบคลุม ตั้งแต่กลยุทธ์การทดสอบ การออกแบบ Test Cases การเตรียม Test Data การ Setup Test Environment แผนการทดสอบ และการจัดการข้อบกพร่อง

การออกแบบที่ดีจะช่วยให้การทดสอบมีประสิทธิภาพและสามารถค้นพบข้อบกพร่องได้อย่างครอบคลุม ซึ่งจะนำไปสู่ระบบที่มีคุณภาพสูง

ในบทถัดไปจะกล่าวถึงการพัฒนาและดำเนินการทดสอบจริง รวมถึงเครื่องมือและเทคนิคที่ใช้ในการทดสอบ