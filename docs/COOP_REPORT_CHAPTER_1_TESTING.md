# บทที่ 1: บทนำ

## 1.1 ความเป็นมาและความสำคัญของโครงการ

ในยุคดิจิทัลปัจจุบัน การพัฒนาเว็บแอปพลิเคชันได้กลายเป็นส่วนสำคัญของธุรกิจและองค์กรต่างๆ การทดสอบซอฟต์แวร์ (Software Testing) จึงมีบทบาทสำคัญยิ่งในการประกันคุณภาพของระบบก่อนนำไปใช้งานจริง การทดสอบที่มีประสิทธิภาพจะช่วยลดข้อผิดพลาดและความเสี่ยงที่อาจเกิดขึ้น เพิ่มความมั่นใจให้กับผู้ใช้งาน และประหยัดต้นทุนในระยะยาว

โครงการ Anime Management System เป็นเว็บแอปพลิเคชันที่พัฒนาขึ้นเพื่อจัดการข้อมูลอนิเมะ โดยมีฟังก์ชันการทำงานที่หลากหลาย ตั้งแต่การจัดการข้อมูลพื้นฐาน (CRUD Operations) การค้นหา การกรองข้อมูล ระบบสมาชิก และระบบหน้าแสดงผลสำหรับผู้ใช้ทั่วไป ความซับซ้อนของระบบนี้ทำให้จำเป็นต้องมีการทดสอบอย่างเป็นระบบเพื่อให้มั่นใจว่าระบบทำงานได้อย่างถูกต้องและมีประสิทธิภาพ

การฝึกสหกิจศึกษาในครั้งนี้ ผู้ปฏิบัติงานได้รับมอบหมายให้ทำหน้าที่เป็น Software Tester โดยมีหน้าที่หลักในการออกแบบ Test Case และวิเคราะห์ผลการทดสอบสำหรับระบบ Anime Management System ซึ่งเป็นโอกาสอันดีในการนำความรู้ทางทฤษฎีมาประยุกต์ใช้ในการทำงานจริง

## 1.2 วัตถุประสงค์ของโครงการ

### วัตถุประสงค์หลัก

1. **ออกแบบ Test Case ที่ครอบคลุมทั้ง White Box และ Black Box Testing**
   - ออกแบบ Test Case สำหรับการทดสอบ Component แต่ละส่วน
   - ออกแบบ Test Case สำหรับการทดสอบ Business Logic
   - ออกแบบ Test Case สำหรับการทดสอบ User Interface

2. **พัฒนา Automated Test Scripts**
   - เขียน Unit Tests สำหรับ Hooks และ Components
   - เขียน Integration Tests สำหรับ User Flow
   - ตั้งค่า Testing Environment ให้พร้อมใช้งาน

3. **ดำเนินการทดสอบระบบอย่างเป็นระบบ**
   - ทดสอบ Functional Requirements ทั้งหมด
   - ทดสอบ Non-Functional Requirements (Performance, Security, Usability)
   - ทดสอบ Edge Cases และ Error Handling

4. **วิเคราะห์และจัดทำรายงานผลการทดสอบ**
   - บันทึกผลการทดสอบแต่ละ Test Case
   - วิเคราะห์ Defect ที่พบและจัดลำดับความสำคัญ
   - จัดทำ Test Summary Report

### วัตถุประสงค์เฉพาะ

5. **ตรวจสอบความถูกต้องของ CRUD Operations**
   - ทดสอบการเพิ่ม แก้ไข ลบ และแสดงข้อมูลอนิเมะ
   - ทดสอบการจัดการข้อมูลหมวดหมู่ (Genres)
   - ทดสอบการ Validate ข้อมูล Input

6. **ทดสอบระบบค้นหาและกรองข้อมูล**
   - ทดสอบการค้นหาด้วย Keyword ต่างๆ
   - ทดสอบการกรองตามหมวดหมู่
   - ทดสอบการจัดเรียงข้อมูล (Sorting)

7. **ทดสอบระบบ Authentication และ Authorization**
   - ทดสอบการ Login/Logout
   - ทดสอบการป้องกัน Protected Routes
   - ทดสอบ Session Management

8. **ตรวจสอบ User Experience และ Interface**
   - ทดสอบ Responsive Design บนหน้าจอขนาดต่างๆ
   - ทดสอบ Navigation และ User Flow
   - ทดสอบ Error Messages และ Feedback

9. **ทดสอบ Performance และ Loading**
   - ทดสอบเวลาในการโหลดข้อมูล
   - ทดสอบการทำงานกับข้อมูลจำนวนมาก
   - ทดสอบ Caching Mechanism

10. **ประเมินคุณภาพของ Code และ Architecture**
    - ทดสอบ Code Coverage
    - ตรวจสอบ Best Practices
    - วิเคราะห์ Test Maintainability

## 1.3 ขอบเขตของโครงการ

### 3.1 ระบบที่อยู่ในขอบเขตการทดสอบ

**3.1.1 ส่วนของ Back Office (Admin Panel)**
- Dashboard และ Statistics
- Anime Management (CRUD Operations)
- Genre Management (CRUD Operations)
- การอัพโหลดและจัดการรูปภาพ
- Form Validation
- Error Handling

**3.1.2 ส่วนของ Front Office (User Interface)**
- หน้าแรก (Homepage)
- หน้ารายการอนิเมะยอดนิยม (Popular Anime)
- หน้าแสดงอนิเมะที่อัพเดทล่าสุด (Recent Updates)
- หน้าค้นหา (Search)
- หน้ารายละเอียดอนิเมะ (Anime Detail)
- ระบบกรองและเรียงลำดับ

**3.1.3 ระบบ Authentication และ Authorization**
- Login Page
- Protected Routes
- Session Management
- Logout Functionality

**3.1.4 ระบบ Database และ Backend**
- Supabase Integration
- CRUD Operations
- Data Validation
- Row Level Security (RLS) Policies

### 3.2 ประเภทการทดสอบที่ดำเนินการ

**3.2.1 White Box Testing**
- Unit Testing สำหรับ Custom Hooks
- Component Testing
- Code Coverage Analysis
- Logic Path Testing

**3.2.2 Black Box Testing**
- Functional Testing
- User Interface Testing
- Integration Testing
- System Testing
- Acceptance Testing

**3.2.3 Non-Functional Testing**
- Performance Testing
- Usability Testing
- Security Testing (Basic)
- Compatibility Testing

### 3.3 ขอบเขตที่ไม่อยู่ในการทดสอบ

1. **Load Testing และ Stress Testing** - เนื่องจากเป็นระบบขนาดเล็ก ไม่ได้คาดการณ์ผู้ใช้งานจำนวนมาก
2. **Penetration Testing** - เนื่องจากต้องใช้เครื่องมือและความเชี่ยวชาญเฉพาะด้าน
3. **Cross-Browser Testing แบบครอบคลุม** - จำกัดเฉพาะ Chrome และ Firefox เท่านั้น
4. **Mobile App Testing** - เนื่องจากเป็น Web Application เท่านั้น
5. **Third-party Integration Testing** - ไม่มีการเชื่อมต่อกับระบบภายนอก
6. **Backup และ Recovery Testing** - จัดการโดยทีม DevOps/Infrastructure

## 1.4 ประโยชน์ที่คาดว่าจะได้รับ

### 4.1 ประโยชน์ต่อระบบ Anime Management System

1. **เพิ่มความมั่นใจในคุณภาพของระบบ**
   - ลดโอกาสเกิด Bug และ Defect ในการใช้งานจริง
   - มั่นใจว่าฟังก์ชันทุกอย่างทำงานได้ตามที่ออกแบบไว้
   - ป้องกันปัญหาที่อาจเกิดขึ้นในอนาคต

2. **ชุด Test Cases ที่สามารถนำกลับมาใช้ได้**
   - มี Test Documentation ที่สมบูรณ์สำหรับการทดสอบในอนาคต
   - มี Automated Tests ที่สามารถ Run ซ้ำได้เมื่อมีการแก้ไขหรือเพิ่มฟีเจอร์
   - เป็นเอกสารอ้างอิงสำหรับ Tester คนต่อไป

3. **ข้อมูล Metrics สำหรับการปรับปรุงระบบ**
   - Code Coverage Report
   - Defect Density Analysis
   - Performance Benchmarks
   - User Experience Issues

4. **ลดต้นทุนในการบำรุงรักษา**
   - ค้นหาปัญหาตั้งแต่ระยะ Development
   - ลดเวลาในการแก้ไข Bug ในระยะ Production
   - ป้องกันปัญหาที่อาจกระทบต่อผู้ใช้งาน

### 4.2 ประโยชน์ต่อผู้ปฏิบัติงาน (นักศึกษาสหกิจ)

1. **พัฒนาทักษะด้านการทดสอบซอฟต์แวร์**
   - เรียนรู้การออกแบบ Test Case แบบมืออาชีพ
   - ฝึกฝนการใช้เครื่องมือทดสอบสมัยใหม่ (Jest, React Testing Library)
   - เข้าใจ Testing Methodologies และ Best Practices

2. **ประสบการณ์การทำงานจริง**
   - ทำงานกับ Real-world Application
   - เรียนรู้ Workflow ของการทดสอบในโครงการจริง
   - พัฒนาทักษะการวิเคราะห์และแก้ปัญหา

3. **ความรู้ด้านเทคโนโลยีสมัยใหม่**
   - เข้าใจ Architecture ของ Modern Web Applications
   - เรียนรู้ React, TypeScript, และ Supabase
   - ประสบการณ์กับ CI/CD และ Automated Testing

4. **พัฒนาทักษะด้านเอกสาร**
   - ฝึกการเขียน Test Documentation
   - การจัดทำ Test Report
   - การนำเสนอผลการทดสอบ

### 4.3 ประโยชน์ต่อทีมพัฒนา

1. **Feedback รวดเร็วเกี่ยวกับคุณภาพของ Code**
   - ทราบปัญหาทันทีผ่าน Automated Tests
   - ได้รับ Test Report ที่ชัดเจน
   - มีข้อมูล Code Coverage เพื่อปรับปรุง

2. **ลด Regression Bugs**
   - มั่นใจว่าการแก้ไขส่วนหนึ่งไม่กระทบส่วนอื่น
   - มี Test Suite ที่ครอบคลุมเพื่อป้องกันปัญหาซ้ำ
   - สามารถ Refactor Code ได้อย่างมั่นใจ

3. **Documentation ที่เป็นประโยชน์**
   - Test Cases เป็น Living Documentation
   - แสดงให้เห็น Expected Behavior ของระบบ
   - ช่วยในการ Onboard Developer ใหม่

### 4.4 ประโยชน์ต่อองค์กร/สถาบันการศึกษา

1. **แสดงมาตรฐานการพัฒนาซอฟต์แวร์**
   - มีกระบวนการ QA ที่เป็นมาตรฐาน
   - ยกระดับคุณภาพของผลงาน
   - สร้างความน่าเชื่อถือให้กับองค์กร

2. **เป็นตัวอย่างสำหรับโครงการอื่นๆ**
   - Test Documentation เป็นแม่แบบให้โครงการอื่น
   - Best Practices ที่สามารถนำไปใช้ต่อได้
   - สร้าง Testing Culture ในองค์กร

## 1.5 แผนการดำเนินงาน

### ตารางแผนการดำเนินงาน (12 สัปดาห์)

| สัปดาห์ | กิจกรรม | ผลลัพธ์ที่คาดหวัง |
|---------|---------|-------------------|
| **1-2** | **ศึกษาและวิเคราะห์ระบบ** | |
| | - ศึกษา Requirements และ User Stories | เอกสาร Requirements |
| | - วิเคราะห์ System Architecture | System Architecture Diagram |
| | - ทำความเข้าใจ Codebase | Code Understanding Document |
| | - ศึกษาเครื่องมือทดสอบ (Jest, RTL) | Environment Setup Complete |
| **3-4** | **ออกแบบ Test Cases** | |
| | - ออกแบบ Test Scenarios | Test Scenario Document |
| | - สร้าง Test Case สำหรับ White Box Testing | White Box Test Cases |
| | - สร้าง Test Case สำหรับ Black Box Testing | Black Box Test Cases |
| | - ออกแบบ Test Data | Test Data Sets |
| | - Review Test Cases กับทีม | Reviewed Test Cases |
| **5-6** | **เขียน Automated Tests (Unit & Component)** | |
| | - เขียน Unit Tests สำหรับ Custom Hooks | useAnimeData.test.ts |
| | | useGenres.test.ts |
| | - เขียน Component Tests | AnimeForm.test.tsx |
| | | GenreManagement.test.tsx |
| | - ตั้งค่า Test Coverage | Coverage Report Setup |
| **7-8** | **เขียน Integration Tests** | |
| | - เขียน Integration Tests สำหรับ User Flows | animeFlow.test.tsx |
| | - ทดสอบ Navigation และ Routing | Navigation Tests |
| | - ทดสอบ API Integration | API Integration Tests |
| | - ทดสอบ State Management | State Tests |
| **9** | **Manual Testing (Black Box)** | |
| | - ทดสอบ UI/UX ทุกหน้า | UI Test Results |
| | - ทดสอบ Cross-browser | Compatibility Report |
| | - ทดสอบ Responsive Design | Responsiveness Report |
| | - ทดสอบ Error Scenarios | Error Handling Report |
| **10** | **Performance & Security Testing** | |
| | - ทดสอบ Performance | Performance Metrics |
| | - ทดสอบ Security (Basic) | Security Checklist |
| | - ทดสอบ Accessibility | Accessibility Report |
| **11** | **วิเคราะห์ผลและจัดทำรายงาน** | |
| | - รวบรวมผลการทดสอบทั้งหมด | Complete Test Results |
| | - วิเคราะห์ Defects และจัดลำดับความสำคัญ | Defect Analysis Report |
| | - จัดทำ Test Summary Report | Test Summary Report |
| | - สร้าง Recommendations | Improvement Suggestions |
| **12** | **สรุปและนำเสนอ** | |
| | - เตรียมเอกสารสหกิจ | Coop Report |
| | - จัดทำ Presentation | Presentation Slides |
| | - นำเสนอผลงานต่อที่ปรึกษา | Final Presentation |
| | - ส่งมอบเอกสารทั้งหมด | Complete Documentation |

### Gantt Chart

```
สัปดาห์:  1  2  3  4  5  6  7  8  9 10 11 12
────────────────────────────────────────────
ศึกษาระบบ   ████████
Test Design      ████████
Unit Tests           ████████
Integration              ████████
Manual Test                  ████
Perf/Sec                         ████
Analysis                             ████
Report                                   ████
```

## 1.6 เครื่องมือและเทคโนโลยีที่ใช้

### 6.1 เครื่องมือสำหรับการทดสอบ

| เครื่องมือ | วัตถุประสงค์ | เวอร์ชัน |
|-----------|-------------|---------|
| **Jest** | JavaScript Testing Framework สำหรับ Unit และ Integration Testing | 29.x |
| **React Testing Library** | ทดสอบ React Components แบบ User-centric | 14.x |
| **@testing-library/jest-dom** | Custom Matchers สำหรับ DOM Testing | 6.x |
| **@testing-library/user-event** | จำลอง User Interactions | 14.x |
| **MSW (Mock Service Worker)** | Mock API Requests | - |

### 6.2 เทคโนโลยีของระบบที่ทดสอบ

**Frontend**
- React 18.3.1 - JavaScript Library สำหรับสร้าง UI
- TypeScript - Type-safe JavaScript
- Vite - Build Tool และ Development Server
- Tailwind CSS - Utility-first CSS Framework
- React Router DOM - Client-side Routing
- React Hook Form - Form Management
- Zod - Schema Validation

**Backend**
- Supabase - Backend as a Service (BaaS)
- PostgreSQL - Relational Database
- Supabase Auth - Authentication System
- Row Level Security (RLS) - Database Security

**State Management**
- React Context API - Global State Management
- TanStack Query - Server State Management และ Caching

### 6.3 เครื่องมือสนับสนุน

| เครื่องมือ | วัตถุประสงค์ |
|-----------|-------------|
| **VS Code** | Code Editor และ IDE |
| **Chrome DevTools** | Browser Developer Tools สำหรับ Debug |
| **React DevTools** | React-specific Debugging Tools |
| **Supabase Dashboard** | จัดการ Database และ Backend |
| **Git/GitHub** | Version Control |
| **npm/bun** | Package Manager |
| **Markdown** | เขียนเอกสาร Test Cases และ Reports |

### 6.4 เครื่องมือสำหรับ Code Quality

- **ESLint** - Linting และ Code Quality Checking
- **Prettier** - Code Formatting
- **TypeScript Compiler** - Type Checking

## 1.7 คำศัพท์และคำย่อ

| คำศัพท์/คำย่อ | ความหมาย |
|--------------|---------|
| **CRUD** | Create, Read, Update, Delete - การดำเนินการพื้นฐานกับข้อมูล |
| **UI/UX** | User Interface / User Experience - ส่วนติดต่อผู้ใช้และประสบการณ์การใช้งาน |
| **SPA** | Single Page Application - แอปพลิเคชันที่ทำงานในหน้าเดียว |
| **API** | Application Programming Interface - ส่วนติดต่อโปรแกรม |
| **RLS** | Row Level Security - การรักษาความปลอดภัยระดับแถวในฐานข้อมูล |
| **QA** | Quality Assurance - การประกันคุณภาพ |
| **Test Case** | กรณีทดสอบ - ชุดของเงื่อนไขเพื่อตรวจสอบการทำงานของระบบ |
| **Test Suite** | ชุดทดสอบ - กลุ่มของ Test Cases ที่เกี่ยวข้องกัน |
| **Test Coverage** | ความครอบคลุมการทดสอบ - เปอร์เซ็นต์ของโค้ดที่ถูกทดสอบ |
| **Defect/Bug** | ข้อบกพร่อง - พฤติกรรมที่ไม่ตรงตาม Requirements |
| **Regression** | การถดถอย - ปัญหาที่เกิดขึ้นหลังจากแก้ไขส่วนอื่น |
| **Mock** | การจำลอง - การสร้างวัตถุปลอมเพื่อทดสอบ |
| **Assertion** | การยืนยัน - คำสั่งที่ตรวจสอบว่าผลลัพธ์ตรงตามที่คาดหวัง |
| **Edge Case** | กรณีขอบเขต - สถานการณ์พิเศษหรือสุดขีด |
| **Integration Testing** | การทดสอบรวมระบบ - ทดสอบการทำงานร่วมกันของหลายส่วน |
| **Unit Testing** | การทดสอบหน่วย - ทดสอบส่วนเล็กๆ แยกส่วน |
| **E2E Testing** | End-to-End Testing - ทดสอบระบบทั้งหมดตั้งแต่ต้นจนจบ |
| **Component** | ส่วนประกอบ - หน่วยย่อยของ UI ใน React |
| **Hook** | ฟังก์ชันพิเศษใน React เพื่อใช้ State และ Lifecycle |
| **Props** | Properties - ข้อมูลที่ส่งให้ Component |
| **State** | สถานะ - ข้อมูลที่เปลี่ยนแปลงได้ใน Component |
| **Render** | การแสดงผล - การแปลง Component เป็น UI จริง |
| **Query** | การสอบถาม - คำสั่งเพื่อดึงข้อมูล |
| **Mutation** | การเปลี่ยนแปลง - คำสั่งเพื่อแก้ไขข้อมูล |

---

**หมายเหตุ:** เอกสารบทที่ 1 นี้เป็นส่วนเริ่มต้นของรายงานสหกิจศึกษา โดยมุ่งเน้นการออกแบบ Test Case และการวิเคราะห์ผลการทดสอบสำหรับเว็บแอปพลิเคชัน Anime Management System
