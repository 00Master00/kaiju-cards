# บทที่ 2: ทฤษฎีและเทคโนโลยีที่เกี่ยวข้อง

## 2.1 หลักการทดสอบซอฟต์แวร์ (Software Testing Principles)

### 2.1.1 ความหมายและความสำคัญของการทดสอบซอฟต์แวร์

การทดสอบซอฟต์แวร์ (Software Testing) เป็นกระบวนการตรวจสอบและประเมินคุณภาพของซอฟต์แวร์เพื่อให้มั่นใจว่าระบบทำงานได้ตามที่ออกแบบไว้และตอบสนองความต้องการของผู้ใช้งาน โดยมีวัตถุประสงค์หลักดังนี้:

1. **ค้นหาข้อบกพร่อง (Find Defects)** - ตรวจจับ Bug และข้อผิดพลาดก่อนนำระบบไปใช้งานจริง
2. **ประกันคุณภาพ (Quality Assurance)** - ยืนยันว่าระบบมีคุณภาพตามมาตรฐาน
3. **ตรวจสอบความถูกต้อง (Verification)** - ตรวจสอบว่าระบบถูกสร้างอย่างถูกต้อง
4. **ตรวจสอบความเหมาะสม (Validation)** - ตรวจสอบว่าระบบตอบโจทย์ผู้ใช้งาน
5. **ลดความเสี่ยง (Risk Mitigation)** - ลดโอกาสเกิดปัญหาในการใช้งานจริง

### 2.1.2 หลักการทดสอบ 7 ประการ (Seven Testing Principles)

**1. Testing Shows Presence of Defects**
- การทดสอบสามารถพิสูจน์ว่ามี Bug แต่ไม่สามารถพิสูจน์ว่าไม่มี Bug
- การทดสอบลดความเสี่ยงแต่ไม่ได้ทำให้ระบบปลอดข้อผิดพลาดทั้งหมด

**2. Exhaustive Testing is Impossible**
- การทดสอบทุกกรณีเป็นไปไม่ได้ เนื่องจากมี Test Case ที่เป็นไปได้ไม่จำกัด
- ต้องใช้ Risk-based และ Priority-based Testing

**3. Early Testing**
- ควรเริ่มทดสอบตั้งแต่ช่วง Requirements เพื่อลดต้นทุนในการแก้ไข
- ยิ่งพบปัญหาเร็ว ต้นทุนในการแก้ไขยิ่งต่ำ

**4. Defect Clustering**
- Bug มักจะกระจุกตัวในโมดูลเดิมๆ (80/20 Rule)
- โมดูลที่มี Bug มากมักจะมี Bug ซ่อนอยู่อีก

**5. Pesticide Paradox**
- การใช้ Test Case เดิมซ้ำๆ จะไม่พบ Bug ใหม่
- ต้องปรับปรุงและเพิ่ม Test Case อยู่เสมอ

**6. Testing is Context Dependent**
- วิธีการทดสอบขึ้นอยู่กับบริบทของโปรเจค
- ระบบ E-commerce กับ Banking มี Testing Strategy ที่ต่างกัน

**7. Absence of Errors Fallacy**
- ระบบที่ไม่มี Bug ไม่ได้หมายความว่าใช้งานได้ดี
- ต้องตรวจสอบว่าระบบตอบโจทย์ธุรกิจและผู้ใช้งานด้วย

## 2.2 ประเภทของการทดสอบ (Testing Types)

### 2.2.1 White Box Testing (โครงสร้างภายใน)

**ความหมาย**
White Box Testing เป็นการทดสอบที่ Tester รู้โครงสร้างภายในของโค้ด มองเห็น Logic และ Algorithm ทำการทดสอบเส้นทางการทำงาน (Code Path) ต่างๆ

**เทคนิคที่ใช้**
1. **Statement Coverage** - ทดสอบให้ทุกคำสั่งถูก Execute อย่างน้อย 1 ครั้ง
2. **Branch Coverage** - ทดสอบให้ทุก Branch (if-else) ถูก Execute
3. **Path Coverage** - ทดสอบทุกเส้นทางที่เป็นไปได้
4. **Condition Coverage** - ทดสอบทุกเงื่อนไขให้ได้ทั้ง True และ False

**ตัวอย่างใน Project**
```typescript
// Custom Hook ที่ทดสอบ
function useAnimeData() {
  const [animes, setAnimes] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchAnimes();
  }, []);
  
  const fetchAnimes = async () => {
    try {
      setLoading(true);
      const data = await supabase.from('animes').select('*');
      setAnimes(data); // Path 1: Success
    } catch (error) {
      console.error(error); // Path 2: Error
    } finally {
      setLoading(false); // ทุก Path ต้องผ่านที่นี่
    }
  };
  
  return { animes, loading, fetchAnimes };
}
```

**Test Cases สำหรับ White Box**
- ✅ ทดสอบ Path Success (fetchAnimes สำเร็จ)
- ✅ ทดสอบ Path Error (fetchAnimes ล้มเหลว)
- ✅ ตรวจสอบว่า loading เป็น true ระหว่างโหลด
- ✅ ตรวจสอบว่า loading เป็น false หลังเสร็จ

### 2.2.2 Black Box Testing (พฤติกรรมภายนอก)

**ความหมาย**
Black Box Testing เป็นการทดสอบที่ Tester ไม่รู้โครงสร้างภายใน มองเห็นแค่ Input และ Output ทดสอบว่าระบบทำงานตาม Specification หรือไม่

**เทคนิคที่ใช้**
1. **Equivalence Partitioning** - แบ่งข้อมูล Input เป็นกลุ่มที่ได้ผลลัพธ์เดียวกัน
2. **Boundary Value Analysis** - ทดสอบค่าขอบเขต (Min, Max, Just Inside, Just Outside)
3. **Decision Table Testing** - ใช้ตารางแสดงเงื่อนไขและผลลัพธ์
4. **State Transition Testing** - ทดสอบการเปลี่ยนสถานะของระบบ
5. **Use Case Testing** - ทดสอบตาม User Scenarios

**ตัวอย่างใน Project**

**Equivalence Partitioning สำหรับการค้นหาอนิเมะ**
| Input Group | Example | Expected Result |
|------------|---------|-----------------|
| Valid Search | "Naruto" | แสดงผลลัพธ์ที่เกี่ยวข้อง |
| Empty Search | "" | แสดงอนิเมะทั้งหมด |
| Special Characters | "@#$%" | แสดงผลลัพธ์ว่างหรือ Error |
| Very Long Text | "a" * 1000 | Handle gracefully |

**Boundary Value Analysis สำหรับ Anime Rating**
- Minimum Invalid: -1 ❌
- Minimum Valid: 0 ✅
- Normal: 5 ✅
- Maximum Valid: 10 ✅
- Maximum Invalid: 11 ❌

**State Transition สำหรับ Login**
```
[Logged Out] --[Login Success]--> [Logged In]
[Logged Out] --[Login Fail]--> [Logged Out]
[Logged In] --[Logout]--> [Logged Out]
[Logged In] --[Session Expire]--> [Logged Out]
```

### 2.2.3 Unit Testing

**ความหมาย**
การทดสอบหน่วยย่อยเล็กที่สุดของโค้ด (Function, Method, Component) แยกส่วนจากส่วนอื่น

**เป้าหมาย**
- ตรวจสอบว่าแต่ละหน่วยทำงานถูกต้อง
- แยก Dependencies ด้วย Mocking
- รวดเร็วและ Run บ่อยๆ ได้

**ตัวอย่าง Unit Test ใน Project**
```typescript
// useGenres.test.ts
describe('useGenres Hook', () => {
  it('should fetch genres successfully', async () => {
    const { result } = renderHook(() => useGenres());
    
    await waitFor(() => {
      expect(result.current.genres).toHaveLength(5);
      expect(result.current.loading).toBe(false);
    });
  });
  
  it('should handle error when fetch fails', async () => {
    // Mock API failure
    mockSupabase.from().select.mockRejectedValue(new Error('Network error'));
    
    const { result } = renderHook(() => useGenres());
    
    await waitFor(() => {
      expect(result.current.error).toBeDefined();
      expect(result.current.genres).toEqual([]);
    });
  });
});
```

### 2.2.4 Integration Testing

**ความหมาย**
การทดสอบการทำงานร่วมกันของหลายหน่วยหรือหลาย Component

**เป้าหมาย**
- ตรวจสอบการส่งข้อมูลระหว่าง Components
- ทดสอบ API Integration
- ทดสอบ Data Flow ใน Application

**ตัวอย่าง Integration Test**
```typescript
// animeFlow.test.tsx
describe('Anime Management Flow', () => {
  it('should create, edit, and delete anime', async () => {
    render(<App />);
    
    // Navigate to Anime List
    const addButton = screen.getByText('Add New Anime');
    fireEvent.click(addButton);
    
    // Fill Form
    fireEvent.change(screen.getByLabelText('Title'), {
      target: { value: 'Test Anime' }
    });
    
    // Submit
    fireEvent.click(screen.getByText('Save'));
    
    // Verify anime appears in list
    await waitFor(() => {
      expect(screen.getByText('Test Anime')).toBeInTheDocument();
    });
    
    // Edit anime
    fireEvent.click(screen.getByText('Edit'));
    // ... edit flow
    
    // Delete anime
    fireEvent.click(screen.getByText('Delete'));
    // ... verify deletion
  });
});
```

### 2.2.5 System Testing

**ความหมาย**
การทดสอบระบบทั้งหมดรวมกัน ทดสอบว่าระบบทำงานตาม Requirements หรือไม่

**ครอบคลุม**
- Functional Testing
- Non-Functional Testing (Performance, Security, Usability)
- End-to-End Scenarios

### 2.2.6 Acceptance Testing

**ความหมาย**
การทดสอบเพื่อยืนยันว่าระบบพร้อมใช้งานและตอบโจทย์ User Requirements

**ประเภท**
- **User Acceptance Testing (UAT)** - ทดสอบโดยผู้ใช้จริง
- **Business Acceptance Testing (BAT)** - ทดสอบว่าตอบโจทย์ธุรกิจ
- **Alpha/Beta Testing** - ทดสอบในสภาพแวดล้อมจริง

## 2.3 เครื่องมือทดสอบที่ใช้ในโครงการ

### 2.3.1 Jest - JavaScript Testing Framework

**ความหมาย**
Jest เป็น Testing Framework ที่พัฒนาโดย Facebook สำหรับทดสอบ JavaScript และ TypeScript Applications

**คุณสมบัติเด่น**
1. **Zero Configuration** - ใช้งานได้ทันทีโดยไม่ต้องตั้งค่ามาก
2. **Fast and Parallel** - รัน Tests แบบ Parallel เพื่อความเร็ว
3. **Snapshot Testing** - เก็บ Snapshot ของ Component UI
4. **Built-in Mocking** - มี Mocking System ในตัว
5. **Code Coverage** - สร้าง Coverage Report ได้ทันที
6. **Watch Mode** - รัน Tests เฉพาะไฟล์ที่เปลี่ยน

**โครงสร้างของ Test**
```typescript
describe('Test Suite Name', () => {
  // Setup ก่อนแต่ละ test
  beforeEach(() => {
    // เตรียมข้อมูล
  });
  
  // Cleanup หลังแต่ละ test
  afterEach(() => {
    // ทำความสะอาด
  });
  
  it('should do something', () => {
    // Arrange: เตรียมข้อมูล
    const input = 'test';
    
    // Act: ทำการทดสอบ
    const result = someFunction(input);
    
    // Assert: ตรวจสอบผลลัพธ์
    expect(result).toBe('expected');
  });
  
  test('another test case', () => {
    // test() เหมือนกับ it()
  });
});
```

**Matchers ที่ใช้บ่อย**
```typescript
// Equality
expect(value).toBe(expected);           // Strict equality (===)
expect(value).toEqual(expected);        // Deep equality
expect(value).not.toBe(expected);       // Negation

// Truthiness
expect(value).toBeTruthy();
expect(value).toBeFalsy();
expect(value).toBeNull();
expect(value).toBeUndefined();
expect(value).toBeDefined();

// Numbers
expect(value).toBeGreaterThan(3);
expect(value).toBeGreaterThanOrEqual(3.5);
expect(value).toBeLessThan(5);
expect(value).toBeCloseTo(0.3);         // Floating point

// Strings
expect(string).toMatch(/pattern/);
expect(string).toContain('substring');

// Arrays and Iterables
expect(array).toContain(item);
expect(array).toHaveLength(3);
expect(array).toContainEqual(object);

// Objects
expect(object).toHaveProperty('key');
expect(object).toMatchObject({ key: 'value' });

// Exceptions
expect(() => fn()).toThrow();
expect(() => fn()).toThrow(Error);
expect(() => fn()).toThrow('error message');

// Async
await expect(promise).resolves.toBe(value);
await expect(promise).rejects.toThrow();
```

**Mock Functions**
```typescript
// สร้าง Mock Function
const mockFn = jest.fn();

// Mock Implementation
mockFn.mockImplementation((x) => x * 2);
mockFn.mockReturnValue(42);
mockFn.mockResolvedValue('async result');

// ตรวจสอบการเรียกใช้
expect(mockFn).toHaveBeenCalled();
expect(mockFn).toHaveBeenCalledTimes(2);
expect(mockFn).toHaveBeenCalledWith(arg1, arg2);
```

### 2.3.2 React Testing Library (RTL)

**ความหมาย**
React Testing Library เป็น Library สำหรับทดสอบ React Components โดยเน้นการทดสอบจากมุมมองของ User

**หลักการสำคัญ**
> "The more your tests resemble the way your software is used, the more confidence they can give you."

**Core Principles**
1. **Test User Behavior, Not Implementation** - ทดสอบสิ่งที่ User เห็นและทำ
2. **Query by Accessibility** - ใช้ queries ที่เน้น Accessibility
3. **No Access to Internal State** - ไม่เข้าถึง State หรือ Props โดยตรง

**Rendering Components**
```typescript
import { render, screen } from '@testing-library/react';

test('renders component', () => {
  render(<MyComponent />);
  
  // Query elements
  const element = screen.getByText('Hello');
  expect(element).toBeInTheDocument();
});
```

**Query Methods (Priority Order)**

**1. Accessible to Everyone**
```typescript
// ByRole - ดีที่สุด, เน้น Accessibility
screen.getByRole('button', { name: 'Submit' });
screen.getByRole('textbox', { name: 'Username' });
screen.getByRole('heading', { level: 1 });

// ByLabelText - สำหรับ Form Inputs
screen.getByLabelText('Email Address');
```

**2. Semantic Queries**
```typescript
// ByPlaceholderText
screen.getByPlaceholderText('Enter your name');

// ByText
screen.getByText('Hello World');
screen.getByText(/hello/i); // Case insensitive

// ByDisplayValue - ค่าใน Input
screen.getByDisplayValue('current value');
```

**3. Test IDs (Last Resort)**
```typescript
// ByTestId - ใช้เมื่อไม่มีทางเลือกอื่น
screen.getByTestId('custom-element');
```

**Query Variants**
```typescript
// getBy* - หาไม่เจอจะ throw error
screen.getByText('text');

// queryBy* - หาไม่เจอจะ return null (สำหรับ assert ว่าไม่มี)
expect(screen.queryByText('not exist')).not.toBeInTheDocument();

// findBy* - สำหรับ Async, รอจนเจอหรือ timeout
await screen.findByText('async text');

// getAllBy*, queryAllBy*, findAllBy* - หาหลายตัว
const buttons = screen.getAllByRole('button');
expect(buttons).toHaveLength(3);
```

**User Interactions**
```typescript
import userEvent from '@testing-library/user-event';

test('user interactions', async () => {
  const user = userEvent.setup();
  render(<Form />);
  
  // Type in input
  await user.type(screen.getByRole('textbox'), 'Hello');
  
  // Click button
  await user.click(screen.getByRole('button'));
  
  // Select from dropdown
  await user.selectOptions(screen.getByRole('combobox'), 'option1');
  
  // Keyboard interactions
  await user.keyboard('{Enter}');
  await user.keyboard('{Escape}');
});
```

**Testing Async Code**
```typescript
import { waitFor, waitForElementToBeRemoved } from '@testing-library/react';

test('async operations', async () => {
  render(<AsyncComponent />);
  
  // รอจนกว่า element จะปรากฏ
  const element = await screen.findByText('Loaded');
  
  // รอจนกว่าเงื่อนไขเป็นจริง
  await waitFor(() => {
    expect(screen.getByText('Updated')).toBeInTheDocument();
  });
  
  // รอจนกว่า element จะหายไป
  await waitForElementToBeRemoved(() => screen.getByText('Loading...'));
});
```

**Custom Matchers จาก jest-dom**
```typescript
expect(element).toBeInTheDocument();
expect(element).toBeVisible();
expect(element).toBeDisabled();
expect(element).toBeEnabled();
expect(element).toHaveTextContent('text');
expect(element).toHaveValue('value');
expect(element).toHaveClass('className');
expect(element).toHaveStyle({ color: 'red' });
expect(element).toHaveAttribute('attr', 'value');
expect(checkbox).toBeChecked();
```

### 2.3.3 MSW (Mock Service Worker)

**ความหมาย**
MSW เป็น Library สำหรับ Mock API Requests โดยใช้ Service Worker intercept requests

**ข้อดี**
- Mock ใกล้เคียง Real API มาก
- ใช้ได้ทั้ง Testing และ Development
- ไม่ต้องแก้ไข Application Code

**ตัวอย่าง Setup**
```typescript
// src/__tests__/mocks/handlers.ts
import { rest } from 'msw';

export const handlers = [
  rest.get('/api/animes', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json([
        { id: 1, title: 'Naruto', rating: 8.5 },
        { id: 2, title: 'One Piece', rating: 9.0 },
      ])
    );
  }),
  
  rest.post('/api/animes', async (req, res, ctx) => {
    const newAnime = await req.json();
    return res(
      ctx.status(201),
      ctx.json({ ...newAnime, id: 3 })
    );
  }),
];

// src/__tests__/mocks/server.ts
import { setupServer } from 'msw/node';
import { handlers } from './handlers';

export const server = setupServer(...handlers);
```

## 2.4 เทคโนโลยีของระบบที่ทดสอบ

### 2.4.1 React และ Component Architecture

**React Components**
- Functional Components with Hooks
- Props-based Communication
- Component Composition
- Reusability และ Maintainability

**React Hooks**
```typescript
// useState - จัดการ Local State
const [count, setCount] = useState(0);

// useEffect - Side Effects
useEffect(() => {
  fetchData();
}, [dependency]);

// useContext - Global State
const theme = useContext(ThemeContext);

// Custom Hooks - Reusable Logic
const { data, loading } = useAnimeData();
```

### 2.4.2 TypeScript

**ข้อดีในการทดสอบ**
- Type Safety ช่วยจับ Error ก่อน Runtime
- Autocomplete ช่วยเขียน Test ได้เร็วขึ้น
- Refactoring ปลอดภัยมากขึ้น
- Self-documenting Code

**Interface สำหรับ Testing**
```typescript
interface Anime {
  id: string;
  title: string;
  rating: number;
  genres: string[];
}

// Type-safe Test Data
const mockAnime: Anime = {
  id: '1',
  title: 'Test Anime',
  rating: 8.5,
  genres: ['Action', 'Adventure'],
};
```

### 2.4.3 Supabase Backend

**Supabase Client**
```typescript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(url, key);

// CRUD Operations
await supabase.from('animes').select('*');
await supabase.from('animes').insert(data);
await supabase.from('animes').update(data).eq('id', id);
await supabase.from('animes').delete().eq('id', id);
```

**การ Mock Supabase ใน Tests**
```typescript
jest.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn().mockResolvedValue({ data: mockData }),
      insert: jest.fn().mockResolvedValue({ data: mockData }),
      update: jest.fn().mockResolvedValue({ data: mockData }),
      delete: jest.fn().mockResolvedValue({ data: null }),
    })),
  },
}));
```

### 2.4.4 State Management

**React Context API**
- Global State Management
- ลด Props Drilling
- Provider Pattern

**TanStack Query (React Query)**
- Server State Management
- Automatic Caching
- Background Refetching
- Optimistic Updates

## 2.5 Test Coverage และ Metrics

### 2.5.1 Code Coverage

**ประเภทของ Coverage**

**1. Statement Coverage**
- เปอร์เซ็นต์ของคำสั่งที่ถูก Execute
- เป้าหมาย: 80%+

**2. Branch Coverage**
- เปอร์เซ็นต์ของ if-else branches ที่ถูกทดสอบ
- เป้าหมาย: 75%+

**3. Function Coverage**
- เปอร์เซ็นต์ของ Functions ที่ถูกเรียกใช้
- เป้าหมาย: 90%+

**4. Line Coverage**
- เปอร์เซ็นต์ของบรรทัดที่ถูก Execute
- เป้าหมาย: 80%+

**ตัวอย่าง Coverage Report**
```
-------------------------|---------|----------|---------|---------|
File                     | % Stmts | % Branch | % Funcs | % Lines |
-------------------------|---------|----------|---------|---------|
All files                |   85.5  |   78.2   |   90.1  |   84.8  |
 hooks/                  |   92.3  |   85.7   |   95.0  |   91.5  |
  useAnimeData.ts        |   95.0  |   90.0   |  100.0  |   94.2  |
  useGenres.ts           |   89.5  |   81.2   |   90.0  |   88.9  |
 components/             |   78.9  |   70.5   |   85.2  |   78.1  |
  AnimeForm.tsx          |   82.1  |   75.0   |   88.8  |   81.5  |
  GenreManagement.tsx    |   75.6  |   66.0   |   81.5  |   74.7  |
-------------------------|---------|----------|---------|---------|
```

### 2.5.2 Test Metrics

**Defect Metrics**
- **Defect Density** = จำนวน Defects / Lines of Code
- **Defect Removal Efficiency** = Defects Found Before Release / Total Defects
- **Defect Leakage** = Defects Found in Production

**Test Execution Metrics**
- **Test Pass Rate** = Passed Tests / Total Tests
- **Test Execution Time** - เวลาที่ใช้รัน Test Suite
- **Test Stability** - จำนวน Flaky Tests

## 2.6 งานวิจัยและบทความที่เกี่ยวข้อง

### 2.6.1 Best Practices ในการทดสอบ React Applications

**Martin Fowler - Test Pyramid**
- Unit Tests (มากที่สุด) - 70%
- Integration Tests (ปานกลาง) - 20%
- E2E Tests (น้อยที่สุด) - 10%

**Kent C. Dodds - Testing Trophy**
- Static (Types, Linting)
- Unit Tests
- Integration Tests (เน้นที่นี่)
- E2E Tests

### 2.6.2 Common Testing Anti-patterns

**1. Testing Implementation Details**
❌ Bad: `expect(component.state.count).toBe(1)`
✅ Good: `expect(screen.getByText('Count: 1')).toBeInTheDocument()`

**2. Too Many Mocks**
- Mock เฉพาะสิ่งที่จำเป็น (External APIs, Time, Random)
- ไม่ควร Mock ส่วนที่เป็น Application Code

**3. Slow Tests**
- ทำให้ Developer ไม่อยากรัน Tests
- ควรเร็วกว่า 1 วินาทีต่อ Test

**4. Flaky Tests**
- Tests ที่บางครั้งผ่าน บางครั้งไม่ผ่าน
- มักเกิดจาก Async timing issues

**5. Testing Too Much in One Test**
- แต่ละ Test ควรทดสอบสิ่งเดียว
- ชื่อ Test ควรบอกได้ชัดเจนว่าทดสอบอะไร

---

**หมายเหตุ:** เอกสารบทที่ 2 นี้ครอบคลุมทฤษฎีและเทคโนโลยีที่ใช้ในการทดสอบซอฟต์แวร์ โดยเน้นการประยุกต์ใช้กับโครงการ Anime Management System
