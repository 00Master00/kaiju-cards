# บทที่ 2: ทฤษฎีและเทคโนโลยีที่เกี่ยวข้อง

## 2.1 หลักการทดสอบซอฟต์แวร์ (Software Testing Principles)

### 2.1.1 ความหมายของการทดสอบซอฟต์แวร์

การทดสอบซอฟต์แวร์ (Software Testing) คือ กระบวนการตรวจสอบและประเมินคุณภาพของซอฟต์แวร์โดยการเปรียบเทียบผลลัพธ์ที่ได้จากการทำงานจริงกับผลลัพธ์ที่คาดหวัง เพื่อค้นหาข้อบกพร่อง (Defects) และยืนยันว่าระบบทำงานตรงตามความต้องการ (Requirements)

**วัตถุประสงค์หลักของการทดสอบซอฟต์แวร์:**
1. ตรวจสอบความถูกต้องของระบบ (Verification)
2. ยืนยันว่าระบบตรงตามความต้องการ (Validation)
3. ค้นหาข้อบกพร่องก่อนนำไปใช้งานจริง
4. รับรองคุณภาพของซอฟต์แวร์
5. เพิ่มความมั่นใจให้กับผู้ใช้งาน

### 2.1.2 หลักการทดสอบซอฟต์แวร์ 7 ข้อ (Seven Testing Principles)

#### 1. Testing Shows Presence of Defects
การทดสอบสามารถแสดงให้เห็นว่ามีข้อบกพร่องอยู่ แต่ไม่สามารถพิสูจน์ได้ว่าไม่มีข้อบกพร่องเลย

**ตัวอย่างในโครงการ:**
- เมื่อทดสอบฟังก์ชันการเพิ่มอนิเมะและพบ bug ในการอัพโหลดรูปภาพ แสดงว่ามีข้อบกพร่องในส่วนนั้น
- แต่ถึงแม้ทดสอบผ่านทั้งหมด ก็ไม่ได้หมายความว่าไม่มี bug อื่นๆ ที่ยังไม่ถูกค้นพบ

#### 2. Exhaustive Testing is Impossible
การทดสอบทุกกรณีที่เป็นไปได้เป็นไปไม่ได้ เพราะใช้เวลาและทรัพยากรมากเกินไป

**ตัวอย่างในโครงการ:**
- ฟิลด์ค้นหาสามารถรับ input ได้หลายล้านแบบ ไม่สามารถทดสอบทุกกรณีได้
- ต้องเลือกทดสอบกรณีที่สำคัญและมีความเสี่ยงสูง (Risk-based Testing)

#### 3. Early Testing
การทดสอบควรเริ่มตั้งแต่ช่วงต้นของการพัฒนา เพื่อลดต้นทุนในการแก้ไขข้อบกพร่อง

**ตัวอย่างในโครงการ:**
- เริ่มเขียน Unit Tests ตั้งแต่ขั้นตอนการพัฒนา Component
- Review Requirements และออกแบบ Test Cases ตั้งแต่ช่วงวางแผน

#### 4. Defect Clustering
ข้อบกพร่องมักจะรวมกลุ่มกันในบางส่วนของระบบ (80/20 Rule - 80% ของ bugs อยู่ใน 20% ของโมดูล)

**ตัวอย่างในโครงการ:**
- พบว่าฟังก์ชันการจัดการหมวดหมู่มี bugs มากกว่าส่วนอื่นๆ
- ควรเพิ่มการทดสอบเจาะจงในส่วนที่มีความซับซ้อนสูง

#### 5. Pesticide Paradox
การทดสอบซ้ำๆ ด้วย Test Cases เดิมจะไม่พบข้อบกพร่องใหม่ ต้องมีการปรับปรุงและเพิ่ม Test Cases

**ตัวอย่างในโครงการ:**
- Review และ Update Test Cases เป็นประจำ
- เพิ่ม Test Cases สำหรับ Features ใหม่
- ปรับ Test Data ให้หลากหลาย

#### 6. Testing is Context Dependent
วิธีการทดสอบขึ้นอยู่กับบริบทของระบบ (เว็บไซต์, Mobile App, Embedded System จะทดสอบแตกต่างกัน)

**ตัวอย่างในโครงการ:**
- ทดสอบเว็บแอปพลิเคชันต้องคำนึงถึง Cross-browser Compatibility
- ทดสอบ Responsive Design บนหน้าจอขนาดต่างๆ
- ทดสอบ Performance สำหรับการโหลดข้อมูลจำนวนมาก

#### 7. Absence of Errors Fallacy
การที่ระบบไม่มี bug ไม่ได้หมายความว่าระบบนั้นใช้งานได้ดี ถ้าระบบไม่ตรงกับความต้องการของผู้ใช้

**ตัวอย่างในโครงการ:**
- แม้ระบบจะทดสอบผ่านทั้งหมด แต่ถ้า UI/UX ไม่ดี ผู้ใช้ก็อาจไม่พอใจ
- ต้องทดสอบทั้ง Functional และ Non-functional Requirements

---

## 2.2 ประเภทของการทดสอบซอฟต์แวร์

### 2.2.1 White Box Testing (การทดสอบแบบกล่องขาว)

**คำจำกัดความ:**
White Box Testing หรือ Structural Testing เป็นการทดสอบที่ผู้ทดสอบรู้โครงสร้างภายใน รู้ Source Code และ Logic ของระบบ เน้นการทดสอบ Code Path, Conditions, และ Loops

**ลักษณะเด่น:**
- มองเห็นโครงสร้างภายในของโค้ด
- ทดสอบ Logic และ Algorithm
- ต้องมีความรู้ด้านการเขียนโปรแกรม
- มักใช้ Automated Testing Tools

**เทคนิคการทดสอบ:**

#### 1. Statement Coverage
ทดสอบให้ครอบคลุมทุก Statement ในโค้ด

```typescript
// ตัวอย่าง: ฟังก์ชันตรวจสอบสถานะอนิเมะ
function getAnimeStatus(score: number): string {
  let status = "Unknown";  // Statement 1
  
  if (score >= 8.0) {      // Statement 2
    status = "Excellent";   // Statement 3
  } else if (score >= 6.0) { // Statement 4
    status = "Good";        // Statement 5
  } else {
    status = "Average";     // Statement 6
  }
  
  return status;           // Statement 7
}

// Test Cases สำหรับ Statement Coverage
test('Statement Coverage', () => {
  expect(getAnimeStatus(9.0)).toBe('Excellent');  // ครอบคลุม: 1,2,3,7
  expect(getAnimeStatus(7.0)).toBe('Good');       // ครอบคลุม: 1,2,4,5,7
  expect(getAnimeStatus(5.0)).toBe('Average');    // ครอบคลุม: 1,2,4,6,7
});
```

#### 2. Branch Coverage
ทดสอบให้ครอบคลุมทุก Branch (True/False) ของ Condition

```typescript
// ตัวอย่าง: ฟังก์ชันตรวจสอบการแสดงอนิเมะ
function canDisplayAnime(anime: Anime): boolean {
  if (anime.isPublished && anime.imageUrl) {  // Branch 1 & 2
    return true;
  }
  return false;
}

// Test Cases สำหรับ Branch Coverage
test('Branch Coverage', () => {
  // True Branch
  expect(canDisplayAnime({ 
    isPublished: true, 
    imageUrl: 'image.jpg' 
  })).toBe(true);
  
  // False Branches
  expect(canDisplayAnime({ 
    isPublished: false, 
    imageUrl: 'image.jpg' 
  })).toBe(false);
  
  expect(canDisplayAnime({ 
    isPublished: true, 
    imageUrl: '' 
  })).toBe(false);
});
```

#### 3. Path Coverage
ทดสอบให้ครอบคลุมทุก Path ที่เป็นไปได้ในโค้ด

```typescript
// ตัวอย่าง: ฟังก์ชันคำนวณราคาตามประเภท
function calculatePrice(
  basePrice: number, 
  isPremium: boolean, 
  isNewRelease: boolean
): number {
  let price = basePrice;
  
  if (isPremium) {         // Path decision 1
    price *= 1.5;
  }
  
  if (isNewRelease) {      // Path decision 2
    price *= 1.2;
  }
  
  return price;
}

// Test Cases สำหรับ Path Coverage (4 paths)
test('Path Coverage', () => {
  // Path 1: isPremium=false, isNewRelease=false
  expect(calculatePrice(100, false, false)).toBe(100);
  
  // Path 2: isPremium=true, isNewRelease=false
  expect(calculatePrice(100, true, false)).toBe(150);
  
  // Path 3: isPremium=false, isNewRelease=true
  expect(calculatePrice(100, false, true)).toBe(120);
  
  // Path 4: isPremium=true, isNewRelease=true
  expect(calculatePrice(100, true, true)).toBe(180);
});
```

**ข้อดีของ White Box Testing:**
- ทดสอบได้อย่างละเอียดและครอบคลุม
- ค้นพบ Hidden Errors และ Logic Errors
- เหมาะกับการทดสอบอัตโนมัติ
- วัด Code Coverage ได้

**ข้อจำกัด:**
- ต้องใช้ความรู้ด้านการเขียนโปรแกรม
- ใช้เวลาในการเตรียม Test Cases
- ไม่ครอบคลุม Missing Functions

### 2.2.2 Black Box Testing (การทดสอบแบบกล่องดำ)

**คำจำกัดความ:**
Black Box Testing หรือ Functional Testing เป็นการทดสอบที่ผู้ทดสอบไม่จำเป็นต้องรู้โครงสร้างภายใน เน้นการทดสอบ Functionality ตาม Requirements และ Specifications จากมุมมองของผู้ใช้งาน

**ลักษณะเด่น:**
- ไม่มองเห็นโครงสร้างภายใน
- ทดสอบ Input/Output และ Functionality
- ไม่จำเป็นต้องมีความรู้ด้านการเขียนโปรแกรม
- มักใช้ Manual Testing

**เทคนิคการทดสอบ:**

#### 1. Equivalence Partitioning
แบ่งข้อมูล Input ออกเป็นกลุ่มที่มีพฤติกรรมเหมือนกัน แล้วทดสอบตัวแทนจากแต่ละกลุ่ม

**ตัวอย่าง: การให้คะแนนอนิเมะ (1-10)**

| Partition | Range | Test Value | Expected Result |
|-----------|-------|------------|-----------------|
| Invalid (ต่ำเกิน) | < 1 | 0, -5 | Error message |
| Valid | 1-10 | 1, 5, 10 | Accept input |
| Invalid (สูงเกิน) | > 10 | 11, 15 | Error message |

```typescript
// Test Cases ตาม Equivalence Partitioning
describe('Anime Score Input', () => {
  test('should reject score less than 1', () => {
    expect(validateScore(0)).toBe(false);
  });
  
  test('should accept valid score', () => {
    expect(validateScore(5)).toBe(true);
  });
  
  test('should reject score greater than 10', () => {
    expect(validateScore(11)).toBe(false);
  });
});
```

#### 2. Boundary Value Analysis
ทดสอบค่าที่อยู่บนขอบเขต (Boundary) ของแต่ละ Partition เพราะมักพบ bugs บริเวณนี้

**ตัวอย่าง: การให้คะแนนอนิเมะ (1-10)**

| Test Case | Input Value | Expected Result |
|-----------|-------------|-----------------|
| TC-001 | 0 (ต่ำกว่า min) | Error |
| TC-002 | 1 (min value) | Valid |
| TC-003 | 2 (min + 1) | Valid |
| TC-004 | 9 (max - 1) | Valid |
| TC-005 | 10 (max value) | Valid |
| TC-006 | 11 (สูงกว่า max) | Error |

#### 3. Decision Table Testing
สร้างตารางแสดงความสัมพันธ์ระหว่าง Conditions และ Actions

**ตัวอย่าง: การแสดงอนิเมะบนหน้าหลัก**

| Rule | Condition 1: Published | Condition 2: Has Image | Condition 3: Has Genre | Action: Display |
|------|------------------------|------------------------|------------------------|-----------------|
| 1 | ✓ | ✓ | ✓ | Yes |
| 2 | ✓ | ✓ | ✗ | No |
| 3 | ✓ | ✗ | ✓ | No |
| 4 | ✗ | ✓ | ✓ | No |
| 5 | ✗ | ✗ | ✗ | No |

#### 4. State Transition Testing
ทดสอบการเปลี่ยนสถานะของระบบ

**ตัวอย่าง: สถานะของอนิเมะ**

```
Draft → Review → Published → Archived

Draft:
  - Event: Submit for Review → Review
  
Review:
  - Event: Approve → Published
  - Event: Reject → Draft
  
Published:
  - Event: Archive → Archived
  - Event: Edit → Review
  
Archived:
  - Event: Restore → Published
```

#### 5. Use Case Testing
ทดสอบตาม Use Cases หรือ User Stories

**ตัวอย่าง: Use Case "เพิ่มอนิเมะใหม่"**

```
Use Case: Add New Anime
Actor: Admin
Precondition: Admin logged in

Main Flow:
1. Admin clicks "Add Anime" button
2. System displays anime form
3. Admin fills in anime details
4. Admin uploads anime image
5. Admin selects genres
6. Admin clicks "Save" button
7. System validates input
8. System saves anime data
9. System displays success message

Alternative Flow:
7a. Validation fails
    7a1. System displays error message
    7a2. Return to step 3
```

**ข้อดีของ Black Box Testing:**
- ไม่ต้องมีความรู้ด้านการเขียนโปรแกรม
- ทดสอบจากมุมมองของผู้ใช้งานจริง
- เหมาะกับการทดสอบ Functionality
- ค้นหา Missing Functions ได้

**ข้อจำกัด:**
- อาจพลาดข้อบกพร่องในโค้ด
- ไม่สามารถวัด Code Coverage ได้
- ใช้เวลามากในการทดสอบด้วยตนเอง

---

## 2.3 ระดับของการทดสอบ (Testing Levels)

### 2.3.1 Unit Testing

**คำจำกัดความ:**
การทดสอบหน่วยย่อยที่สุดของโค้ด เช่น Function, Method, Class แยกส่วนออกจากส่วนอื่นๆ

**วัตถุประสงค์:**
- ตรวจสอบว่าแต่ละหน่วยทำงานถูกต้อง
- ค้นหา bugs ตั้งแต่ระดับต้น
- อำนวยความสะดวกในการ Refactor Code

**ตัวอย่างใน Anime Management System:**

```typescript
// src/hooks/useAnimeData.ts - Custom Hook
export const useAnimeData = () => {
  const [animes, setAnimes] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(true);
  
  const fetchAnimes = async () => {
    setLoading(true);
    const data = await getAnimes();
    setAnimes(data);
    setLoading(false);
  };
  
  return { animes, loading, fetchAnimes };
};

// Test
describe('useAnimeData Hook', () => {
  test('should fetch animes successfully', async () => {
    const { result } = renderHook(() => useAnimeData());
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.animes.length).toBeGreaterThan(0);
    });
  });
});
```

**Best Practices:**
- แต่ละ Unit Test ควรเป็นอิสระจากกัน
- ใช้ Mock สำหรับ Dependencies
- ทดสอบทั้ง Normal Cases และ Edge Cases
- เขียน Test ให้อ่านง่ายและเข้าใจง่าย

### 2.3.2 Integration Testing

**คำจำกัดความ:**
การทดสอบการทำงานร่วมกันระหว่างหลายๆ Unit หรือ Module

**วัตถุประสงค์:**
- ตรวจสอบการ Integrate ระหว่าง Components
- ตรวจสอบ Data Flow ระหว่างส่วนประกอบ
- ค้นหา Interface Defects

**ตัวอย่างใน Anime Management System:**

```typescript
// การทดสอบการทำงานร่วมกันของ Form และ API
describe('Anime Form Integration', () => {
  test('should submit form and create anime', async () => {
    render(<AnimeForm />);
    
    // Fill form
    fireEvent.change(screen.getByLabelText('Title'), {
      target: { value: 'Test Anime' }
    });
    
    // Submit
    fireEvent.click(screen.getByText('Save'));
    
    // Verify API call
    await waitFor(() => {
      expect(mockCreateAnime).toHaveBeenCalledWith({
        title: 'Test Anime'
      });
    });
    
    // Verify success message
    expect(screen.getByText('Anime created successfully')).toBeInTheDocument();
  });
});
```

**Strategies:**
- **Big Bang Integration:** รวมทุก Module แล้วทดสอบพร้อมกัน
- **Top-Down Integration:** เริ่มจาก Module บนสุดลงมาล่าง
- **Bottom-Up Integration:** เริ่มจาก Module ล่างสุดขึ้นไปบน
- **Sandwich Integration:** ผสมระหว่าง Top-Down และ Bottom-Up

### 2.3.3 System Testing

**คำจำกัดความ:**
การทดสอบระบบโดยรวมเพื่อตรวจสอบว่าตรงตามความต้องการ (Requirements) ทั้งหมด

**วัตถุประสงค์:**
- ตรวจสอบ End-to-End Functionality
- ทดสอบในสภาพแวดล้อมที่ใกล้เคียงกับการใช้งานจริง
- ตรวจสอบ Non-functional Requirements (Performance, Security)

**ประเภทของ System Testing:**

1. **Functional Testing** - ทดสอบฟังก์ชันการทำงาน
2. **Performance Testing** - ทดสอบความเร็วและประสิทธิภาพ
3. **Security Testing** - ทดสอบความปลอดภัย
4. **Compatibility Testing** - ทดสอบความเข้ากันได้
5. **Usability Testing** - ทดสอบความสะดวกในการใช้งาน

**ตัวอย่าง User Flow Testing:**

```
Test Case: Complete User Journey - Search and View Anime

Steps:
1. User opens front office homepage
2. User sees featured animes displayed
3. User clicks on search icon
4. User enters "Naruto" in search box
5. System displays search results
6. User filters by "Action" genre
7. Results are filtered accordingly
8. User clicks on an anime card
9. System displays anime detail page
10. User can see all anime information

Expected Results:
✓ All pages load within 2 seconds
✓ Images are displayed correctly
✓ Navigation works smoothly
✓ Data is accurate and complete
```

### 2.3.4 Acceptance Testing

**คำจำกัดความ:**
การทดสอบเพื่อตรวจสอบว่าระบบพร้อมใช้งานจริงและตรงตามความต้องการของผู้ใช้

**ประเภท:**
- **User Acceptance Testing (UAT):** ทดสอบโดยผู้ใช้งานจริง
- **Business Acceptance Testing (BAT):** ทดสอบตามเป้าหมายทางธุรกิจ
- **Alpha Testing:** ทดสอบโดยทีมภายใน
- **Beta Testing:** ทดสอบโดยผู้ใช้กลุ่มจำกัดก่อนเปิดตัว

---

## 2.4 เทคโนโลยีและเครื่องมือที่ใช้

### 2.4.1 Jest - JavaScript Testing Framework

**ภาพรวม:**
Jest เป็น Testing Framework ที่พัฒนาโดย Facebook สำหรับทดสอบ JavaScript และ TypeScript โดยเฉพาะ

**คุณสมบัติหลัก:**
- **Zero Configuration:** ใช้งานได้ทันทีโดยไม่ต้อง config มาก
- **Snapshot Testing:** บันทึกและเปรียบเทียบ Component Output
- **Code Coverage:** วัดเปอร์เซ็นต์โค้ดที่ถูกทดสอบ
- **Mocking:** สร้าง Mock Functions และ Modules ได้ง่าย
- **Parallel Testing:** รัน Tests แบบ Parallel เพื่อความเร็ว

**การติดตั้ง:**
```bash
npm install --save-dev jest @types/jest
```

**การ Config - jest.config.cjs:**
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
    '!src/vite-env.d.ts',
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
};
```

**ตัวอย่างการใช้งาน:**

```typescript
// Basic Test
describe('Calculator', () => {
  test('adds 1 + 2 to equal 3', () => {
    expect(sum(1, 2)).toBe(3);
  });
  
  test('subtracts 5 - 2 to equal 3', () => {
    expect(subtract(5, 2)).toBe(3);
  });
});

// Async Test
test('fetches anime data', async () => {
  const data = await fetchAnime(1);
  expect(data.title).toBeDefined();
});

// Mock Test
test('calls API with correct parameters', () => {
  const mockFn = jest.fn();
  mockFn('test', 123);
  
  expect(mockFn).toHaveBeenCalledWith('test', 123);
  expect(mockFn).toHaveBeenCalledTimes(1);
});
```

### 2.4.2 React Testing Library

**ภาพรวม:**
React Testing Library เป็น Library สำหรับทดสอบ React Components โดยเน้นการทดสอบจากมุมมองของผู้ใช้งาน

**ปรัชญา:**
> "The more your tests resemble the way your software is used, the more confidence they can give you."

**คุณสมบัติหลัก:**
- **User-centric Testing:** ทดสอบเหมือนผู้ใช้ใช้งาน
- **Accessibility-first:** Query Elements ตาม Accessibility
- **No Implementation Details:** ไม่ทดสอบ Internal State
- **Best Practices Encouraged:** ส่งเสริมการเขียน Test ที่ดี

**การติดตั้ง:**
```bash
npm install --save-dev @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

**Query Methods:**

| Type | Returns | Wait? | Multiple? |
|------|---------|-------|-----------|
| getBy... | Element | No | No |
| getAllBy... | Array | No | Yes |
| queryBy... | Element/null | No | No |
| queryAllBy... | Array | No | Yes |
| findBy... | Promise | Yes | No |
| findAllBy... | Promise | Yes | Yes |

**ตัวอย่างการใช้งาน:**

```typescript
// Component Test
import { render, screen, fireEvent } from '@testing-library/react';
import AnimeCard from '@/components/AnimeCard';

describe('AnimeCard', () => {
  const mockAnime = {
    id: '1',
    title: 'Test Anime',
    imageUrl: 'test.jpg',
    score: 8.5
  };
  
  test('renders anime information', () => {
    render(<AnimeCard anime={mockAnime} />);
    
    expect(screen.getByText('Test Anime')).toBeInTheDocument();
    expect(screen.getByText('8.5')).toBeInTheDocument();
    expect(screen.getByAltText('Test Anime')).toHaveAttribute('src', 'test.jpg');
  });
  
  test('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<AnimeCard anime={mockAnime} onClick={handleClick} />);
    
    fireEvent.click(screen.getByRole('article'));
    expect(handleClick).toHaveBeenCalledWith('1');
  });
});
```

**Best Practices:**
- ใช้ `getByRole` เป็นตัวเลือกแรก (Accessibility)
- ใช้ `getByLabelText` สำหรับ Form Elements
- ใช้ `getByText` สำหรับข้อความที่ผู้ใช้เห็น
- หลีกเลี่ยง `getByTestId` เว้นแต่จำเป็น

### 2.4.3 MSW (Mock Service Worker)

**ภาพรวม:**
MSW เป็น Library สำหรับ Mock API Requests โดยทำงานที่ระดับ Network Level

**คุณสมบัติหลัก:**
- **Network Level Mocking:** Intercept requests ที่ระดับ Network
- **Reusable Handlers:** ใช้ Mock Handlers ซ้ำได้ทั้งการทดสอบและการพัฒนา
- **TypeScript Support:** รองรับ TypeScript อย่างเต็มรูปแบบ
- **REST & GraphQL:** รองรับทั้ง REST API และ GraphQL

**การติดตั้ง:**
```bash
npm install --save-dev msw
```

**การ Setup:**

```typescript
// src/__tests__/setup.ts
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';

// Define handlers
export const handlers = [
  http.get('/api/animes', () => {
    return HttpResponse.json([
      { id: '1', title: 'Anime 1', score: 8.5 },
      { id: '2', title: 'Anime 2', score: 9.0 }
    ]);
  }),
  
  http.post('/api/animes', async ({ request }) => {
    const newAnime = await request.json();
    return HttpResponse.json(
      { id: '3', ...newAnime },
      { status: 201 }
    );
  }),
  
  http.delete('/api/animes/:id', ({ params }) => {
    return HttpResponse.json(
      { message: 'Deleted successfully' },
      { status: 200 }
    );
  })
];

// Setup server
export const server = setupServer(...handlers);

// Establish API mocking before all tests
beforeAll(() => server.listen());

// Reset handlers after each test
afterEach(() => server.resetHandlers());

// Clean up after all tests
afterAll(() => server.close());
```

**ตัวอย่างการใช้งาน:**

```typescript
// Test with MSW
import { server } from './setup';
import { http, HttpResponse } from 'msw';

describe('Anime API', () => {
  test('fetches animes successfully', async () => {
    const { result } = renderHook(() => useAnimeData());
    
    await waitFor(() => {
      expect(result.current.animes).toHaveLength(2);
      expect(result.current.animes[0].title).toBe('Anime 1');
    });
  });
  
  test('handles API error', async () => {
    // Override handler for this test
    server.use(
      http.get('/api/animes', () => {
        return HttpResponse.json(
          { error: 'Server error' },
          { status: 500 }
        );
      })
    );
    
    const { result } = renderHook(() => useAnimeData());
    
    await waitFor(() => {
      expect(result.current.error).toBe('Failed to fetch animes');
    });
  });
});
```

---

## 2.5 Test Coverage และ Metrics

### 2.5.1 Code Coverage

**คำจำกัดความ:**
Code Coverage คือ เปอร์เซ็นต์ของโค้ดที่ถูกทดสอบโดย Test Cases

**ประเภทของ Coverage:**

1. **Statement Coverage** - เปอร์เซ็นต์ของ Statements ที่ถูกทดสอบ
2. **Branch Coverage** - เปอร์เซ็นต์ของ Branches (if/else) ที่ถูกทดสอบ
3. **Function Coverage** - เปอร์เซ็นต์ของ Functions ที่ถูกเรียกใช้
4. **Line Coverage** - เปอร์เซ็นต์ของ Lines ที่ถูก Execute

**การวัด Coverage ด้วย Jest:**

```bash
# Run tests with coverage
npm test -- --coverage

# ผลลัพธ์
---------------------|---------|----------|---------|---------|
File                 | % Stmts | % Branch | % Funcs | % Lines |
---------------------|---------|----------|---------|---------|
All files            |   87.3  |   82.5   |   85.0  |   87.1  |
 hooks/              |   92.5  |   88.0   |   90.0  |   92.3  |
  useAnimeData.ts    |   95.0  |   90.0   |   92.0  |   94.8  |
  useGenres.ts       |   90.0  |   86.0   |   88.0  |   89.9  |
 components/         |   85.0  |   80.0   |   82.0  |   84.8  |
  AnimeCard.tsx      |   88.0  |   84.0   |   85.0  |   87.9  |
  AnimeForm.tsx      |   82.0  |   76.0   |   79.0  |   81.7  |
---------------------|---------|----------|---------|---------|
```

**เป้าหมาย Coverage:**
- **Good:** 70-80%
- **Very Good:** 80-90%
- **Excellent:** 90%+

**หมายเหตุ:** Coverage 100% ไม่ได้หมายความว่าไม่มี bugs แต่เป็นตัวบ่งชี้คุณภาพของ Tests

### 2.5.2 Test Metrics

**Test Metrics สำคัญ:**

#### 1. Test Pass Rate
```
Pass Rate = (Passed Tests / Total Tests) × 100%
```

#### 2. Defect Density
```
Defect Density = Total Defects / Size of Application (KLOC หรือ Function Points)
```

#### 3. Test Execution Time
```
Average Execution Time = Total Execution Time / Number of Tests
```

#### 4. Defect Detection Rate
```
Detection Rate = (Defects Found in Testing / Total Defects) × 100%
```

#### 5. Test Coverage
```
Test Coverage = (Tested Items / Total Items) × 100%
```

**ตัวอย่างการใช้ Metrics ในโครงการ:**

```
Project: Anime Management System
Duration: 12 weeks

Test Metrics Summary:
├─ Total Test Cases: 450
├─ Automated Tests: 285 (63.3%)
├─ Manual Tests: 165 (36.7%)
├─ Test Pass Rate: 94.87%
├─ Code Coverage: 87.3%
├─ Defects Found: 47
├─ Critical Defects: 8 (17%)
├─ High Priority: 15 (32%)
├─ Medium Priority: 18 (38%)
└─ Low Priority: 6 (13%)

Quality Score: 92/100
```

---

## สรุป

บทที่ 2 นี้ได้กล่าวถึงทฤษฎีและเทคโนโลยีที่เกี่ยวข้องกับการทดสอบซอฟต์แวร์ โดยครอบคลุม:

1. **หลักการทดสอบซอฟต์แวร์** - 7 หลักการพื้นฐานที่สำคัญ
2. **ประเภทการทดสอบ** - White Box และ Black Box Testing พร้อมเทคนิคต่างๆ
3. **ระดับการทดสอบ** - Unit, Integration, System, และ Acceptance Testing
4. **เครื่องมือ** - Jest, React Testing Library, และ MSW
5. **Metrics** - Code Coverage และ Test Metrics สำหรับวัดคุณภาพ

ความรู้เหล่านี้เป็นพื้นฐานสำคัญในการออกแบบและดำเนินการทดสอบซอฟต์แวร์อย่างมีประสิทธิภาพ ซึ่งจะนำไปสู่การพัฒนาระบบที่มีคุณภาพและน่าเชื่อถือ

ในบทถัดไปจะกล่าวถึงการออกแบบระบบการทดสอบ รวมถึงการออกแบบ Test Cases และ Test Strategy สำหรับระบบจัดการข้อมูลอนิเมะ