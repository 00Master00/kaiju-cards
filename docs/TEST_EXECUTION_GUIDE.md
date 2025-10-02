# คู่มือการ Execute Tests

## การติดตั้งและเตรียมการ

### 1. ติดตั้ง Dependencies

```bash
# ติดตั้ง testing libraries
npm install --save-dev @testing-library/react @testing-library/jest-dom @testing-library/user-event
npm install --save-dev jest ts-jest @types/jest
npm install --save-dev identity-obj-proxy
```

### 2. ตรวจสอบ Configuration

ตรวจสอบว่าไฟล์ต่อไปนี้ถูกสร้างแล้ว:
- `jest.config.js` - Jest configuration
- `src/__tests__/setup.ts` - Test setup file

---

## การรัน Tests

### รัน Tests ทั้งหมด
```bash
npm test
```

### รัน Tests แบบ Watch Mode
```bash
npm test -- --watch
```

### รัน Tests เฉพาะไฟล์
```bash
# Hook tests
npm test -- useAnimeData

# Component tests
npm test -- AnimeForm

# Integration tests
npm test -- animeFlow
```

### รัน Tests พร้อม Coverage
```bash
npm test -- --coverage
```

### รัน Tests แบบ Verbose
```bash
npm test -- --verbose
```

---

## การทดสอบแต่ละส่วน

### 1. White Box Testing - Hooks

```bash
# Test useAnimeData hook
npm test -- hooks/useAnimeData.test.ts

# Test useGenres hook
npm test -- hooks/useGenres.test.ts
```

**ตัวอย่างผลลัพธ์:**
```
PASS  src/__tests__/hooks/useAnimeData.test.ts
  useAnimeData Hook - White Box Testing
    TC-WB-001: fetchAnime()
      ✓ should fetch all anime from database (152ms)
      ✓ should handle fetch error gracefully (45ms)
    TC-WB-002: createAnime()
      ✓ should create new anime with valid data (89ms)
      ✓ should validate required fields (23ms)
```

### 2. Black Box Testing - Components

```bash
# Test AnimeForm component
npm test -- components/AnimeForm.test.tsx

# Test GenreManagement component
npm test -- components/GenreManagement.test.tsx
```

**ตัวอย่างผลลัพธ์:**
```
PASS  src/__tests__/components/AnimeForm.test.tsx
  AnimeForm Component - Black Box Testing
    TC-BB-004: Add New Anime
      ✓ should render form with all required fields (245ms)
      ✓ should submit form with valid data (387ms)
    TC-BB-005: Form Validation
      ✓ should show error when title is empty (156ms)
      ✓ should show error when no genres selected (178ms)
```

### 3. Integration Testing

```bash
# Test complete flows
npm test -- integration/animeFlow.test.tsx
```

---

## การอ่านผลลัพธ์

### ผลลัพธ์ที่ Pass
```
✓ should fetch all anime from database (152ms)
```
- ✓ = Test ผ่าน
- (152ms) = เวลาที่ใช้ในการรัน test

### ผลลัพธ์ที่ Fail
```
✕ should create anime with valid data (245ms)

Expected: { id: '1', title: 'Test' }
Received: { id: '1', title: '' }
```

### Coverage Report
```
-----------------|---------|----------|---------|---------|
File             | % Stmts | % Branch | % Funcs | % Lines |
-----------------|---------|----------|---------|---------|
hooks/           |   92.31 |    83.33 |   90.00 |   92.31 |
 useAnimeData.ts |   95.45 |    87.50 |   92.31 |   95.45 |
 useGenres.ts    |   89.47 |    75.00 |   87.50 |   89.47 |
components/      |   87.50 |    80.00 |   85.00 |   87.50 |
 AnimeForm.tsx   |   88.24 |    81.25 |   86.67 |   88.24 |
-----------------|---------|----------|---------|---------|
```

---

## Debugging Tests

### 1. รัน Single Test
```bash
# รัน test เดียว
npm test -- -t "should fetch all anime from database"
```

### 2. Debug ด้วย console.log
```typescript
test('debug example', () => {
  console.log('Current state:', result.current);
  expect(result.current.loading).toBe(false);
});
```

### 3. Debug ด้วย VS Code
เพิ่มใน `.vscode/launch.json`:
```json
{
  "type": "node",
  "request": "launch",
  "name": "Jest Debug",
  "program": "${workspaceFolder}/node_modules/.bin/jest",
  "args": ["--runInBand", "--no-cache"],
  "console": "integratedTerminal",
  "internalConsoleOptions": "neverOpen"
}
```

---

## Test Scenarios

### Scenario 1: ทดสอบ Anime Creation Flow

**Steps:**
```bash
1. npm test -- animeFlow.test.tsx -t "Complete Anime Creation Flow"
```

**Verification:**
- ✅ Genre ถูกสร้าง
- ✅ Anime ถูกสร้างพร้อม genre
- ✅ Genre count อัพเดต
- ✅ Anime ปรากฏในรายการ

---

### Scenario 2: ทดสอบ Form Validation

**Steps:**
```bash
1. npm test -- AnimeForm.test.tsx -t "Form Validation"
```

**Test Cases:**
- Empty title → Error
- No genres → Error
- Invalid score → Prevented
- Valid data → Success

---

### Scenario 3: ทดสอบ Genre Management

**Steps:**
```bash
1. npm test -- GenreManagement.test.tsx
```

**Test Cases:**
- Add genre → Success
- Delete unused genre → Success
- Delete used genre → Blocked
- Search genre → Filtered results

---

## Continuous Integration

### GitHub Actions Workflow

สร้างไฟล์ `.github/workflows/test.yml`:

```yaml
name: Run Tests

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '18'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run tests
      run: npm test -- --coverage
    
    - name: Upload coverage
      uses: codecov/codecov-action@v2
      with:
        files: ./coverage/lcov.info
```

---

## Best Practices

### 1. Test Organization
```
src/__tests__/
├── hooks/           # Hook tests
├── components/      # Component tests
├── integration/     # Integration tests
├── utils/          # Utility tests
└── setup.ts        # Test setup
```

### 2. Naming Convention
```typescript
// ✅ Good
describe('useAnimeData Hook', () => {
  it('should fetch all anime from database', () => {});
});

// ❌ Bad
describe('test', () => {
  it('test 1', () => {});
});
```

### 3. Test Independence
```typescript
// ✅ Good - Each test is independent
beforeEach(() => {
  jest.clearAllMocks();
});

// ❌ Bad - Tests depend on each other
let sharedState;
test('first', () => { sharedState = 1; });
test('second', () => { expect(sharedState).toBe(1); });
```

---

## Troubleshooting

### ปัญหา: Tests ไม่รัน

**Solution:**
```bash
# ลบ cache
npm test -- --clearCache

# ติดตั้ง dependencies ใหม่
rm -rf node_modules
npm install
```

### ปัญหา: Import errors

**Solution:**
ตรวจสอบ `jest.config.js`:
```javascript
moduleNameMapper: {
  '^@/(.*)$': '<rootDir>/src/$1',
}
```

### ปัญหา: Timeout errors

**Solution:**
เพิ่ม timeout ใน test:
```typescript
test('slow test', async () => {
  // test code
}, 10000); // 10 seconds
```

---

## Checklist ก่อนส่ง PR

- [ ] รัน `npm test` ผ่านทั้งหมด
- [ ] Coverage ≥ 80%
- [ ] ไม่มี console warnings/errors
- [ ] Tests มี descriptions ที่ชัดเจน
- [ ] Mock data เหมาะสม
- [ ] Edge cases ถูกทดสอบ

---

## Resources

- [Jest Documentation](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/react)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

---

**Last Updated:** 2 ตุลาคม 2025  
**Maintainer:** Development Team
