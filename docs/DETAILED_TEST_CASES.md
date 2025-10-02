# Detailed Test Cases - ระบบจัดการ Anime

## สารบัญ
1. [White Box Testing Cases](#white-box-testing-cases)
2. [Black Box Testing Cases](#black-box-testing-cases)
3. [Integration Testing Cases](#integration-testing-cases)
4. [Performance Testing Cases](#performance-testing-cases)
5. [Security Testing Cases](#security-testing-cases)

---

## White Box Testing Cases

### WB-001: useAnimeData Hook - Fetch Operations

#### WB-001.1: Fetch All Anime
**วัตถุประสงค์:** ทดสอบการดึงข้อมูล Anime ทั้งหมดจาก Database

**Code Path:**
```
useAnimeData.ts
├── fetchAnime()
│   ├── supabase.from('anime').select('*')
│   ├── Handle response
│   ├── setAnimeList(data)
│   └── setLoading(false)
```

**Test Steps:**
1. เรียก fetchAnime()
2. ตรวจสอบ Supabase query
3. ตรวจสอบ state updates
4. ตรวจสอบ loading state

**Input Data:**
```typescript
// Mock Supabase response
{
  data: [
    {
      id: 'uuid-1',
      title: 'Attack on Titan',
      description: 'Humanity vs Titans',
      genres: ['Action', 'Drama'],
      popularity_score: 95
    }
  ],
  error: null
}
```

**Expected Results:**
- Query: `SELECT * FROM anime`
- State: `animeList` มีข้อมูล
- Loading: `false`
- Error: `null`

**Test Code:**
```typescript
test('should fetch all anime successfully', async () => {
  const { result } = renderHook(() => useAnimeData());
  
  await waitFor(() => {
    expect(result.current.loading).toBe(false);
  });
  
  expect(result.current.animeList.length).toBeGreaterThan(0);
  expect(result.current.animeList[0]).toHaveProperty('id');
  expect(result.current.animeList[0]).toHaveProperty('title');
});
```

**Pass Criteria:**
- ✅ Query ถูกต้อง
- ✅ Data structure ตรงกับ schema
- ✅ Loading state เปลี่ยนถูกต้อง
- ✅ No console errors

---

#### WB-001.2: Handle Fetch Errors
**วัตถุประสงค์:** ทดสอบการจัดการ error เมื่อดึงข้อมูลล้มเหลว

**Test Steps:**
1. Mock Supabase error
2. เรียก fetchAnime()
3. ตรวจสอบ error handling

**Input Data:**
```typescript
{
  data: null,
  error: {
    message: 'Connection timeout',
    code: 'PGRST301'
  }
}
```

**Expected Results:**
- animeList: `[]` (empty array)
- loading: `false`
- ไม่ throw error
- Console error logged

**Test Code:**
```typescript
test('should handle fetch errors gracefully', async () => {
  // Mock error response
  mockSupabase.from.mockReturnValue({
    select: jest.fn().mockResolvedValue({
      data: null,
      error: new Error('Network error')
    })
  });

  const { result } = renderHook(() => useAnimeData());
  
  await waitFor(() => {
    expect(result.current.loading).toBe(false);
  });
  
  expect(result.current.animeList).toEqual([]);
});
```

---

### WB-002: useAnimeData Hook - Create Operations

#### WB-002.1: Create Anime with Valid Data
**วัตถุประสงค์:** ทดสอบการสร้าง Anime ใหม่ด้วยข้อมูลที่ถูกต้อง

**Code Path:**
```
createAnime(animeData)
├── Validate data structure
├── supabase.from('anime').insert([animeData])
├── Handle response
└── Return result
```

**Test Steps:**
1. เตรียม valid anime data
2. เรียก createAnime()
3. ตรวจสอบ INSERT query
4. ตรวจสอบ response

**Input Data:**
```typescript
{
  title: 'New Anime',
  description: 'Test description',
  genres: ['Action', 'Adventure'],
  publisher: 'Test Studio',
  first_aired: '2024-01-01',
  format: 'TV Series',
  image_url: 'http://example.com/image.jpg',
  popularity_score: 85
}
```

**Expected Results:**
- INSERT query executed
- Response contains new anime with id
- created_at timestamp set
- No errors

**Boundary Values:**
- Title: 1-500 characters
- Genres: 1-10 items
- Popularity: 0-100
- Description: 0-5000 characters

---

#### WB-002.2: Create Anime with Minimal Data
**วัตถุประสงค์:** ทดสอบการสร้างด้วยข้อมูลขั้นต่ำ

**Input Data:**
```typescript
{
  title: 'Minimal Anime',
  description: '',
  genres: ['Action'],
  publisher: '',
  first_aired: '',
  format: 'TV Series',
  image_url: null,
  popularity_score: 0
}
```

**Expected Results:**
- สร้างสำเร็จ
- Optional fields เป็น null หรือ empty
- Required fields (title, genres) มีค่า

---

### WB-003: useAnimeData Hook - Update Operations

#### WB-003.1: Update All Fields
**วัตถุประสงค์:** ทดสอบการอัพเดตข้อมูลทุกฟิลด์

**Code Path:**
```
updateAnime(id, updateData)
├── Check anime exists
├── supabase.from('anime').update(updateData).eq('id', id)
├── Auto-update updated_at
└── Return result
```

**Test Steps:**
1. สร้าง anime
2. อัพเดตทุกฟิลด์
3. ตรวจสอบการเปลี่ยนแปลง

**Input Data:**
```typescript
{
  title: 'Updated Title',
  description: 'Updated description',
  genres: ['Mystery', 'Thriller'],
  popularity_score: 90
}
```

**Expected Results:**
- ข้อมูลอัพเดตถูกต้อง
- updated_at timestamp เปลี่ยน
- created_at ไม่เปลี่ยน

---

#### WB-003.2: Partial Update
**วัตถุประสงค์:** ทดสอบการอัพเดตบางฟิลด์

**Input Data:**
```typescript
{
  popularity_score: 95
}
```

**Expected Results:**
- เฉพาะ popularity_score เปลี่ยน
- ฟิลด์อื่นคงเดิม
- updated_at อัพเดต

---

### WB-004: useGenres Hook - Genre Management

#### WB-004.1: Add New Genre
**วัตถุประสงค์:** ทดสอบการเพิ่ม Genre ใหม่

**Code Path:**
```
addGenre(name)
├── Trim whitespace
├── Check name not empty
├── supabase.from('genres').insert([{ name }])
├── Handle duplicate error (23505)
└── Refresh genres list
```

**Test Data:**

| Input | Trimmed | Expected | Note |
|-------|---------|----------|------|
| "Action" | "Action" | Success | ปกติ |
| "  Isekai  " | "Isekai" | Success | มี space |
| "" | "" | Error | Empty |
| "   " | "" | Error | Only spaces |
| "Action" (ซ้ำ) | "Action" | Error | Duplicate |

**Test Code:**
```typescript
describe('Genre Addition', () => {
  test.each([
    ['Action', 'Action', true],
    ['  Isekai  ', 'Isekai', true],
    ['', '', false],
    ['   ', '', false],
  ])('addGenre(%s) should trim to %s and return %s', 
    async (input, trimmed, shouldSucceed) => {
      const result = await addGenre(input);
      
      if (shouldSucceed) {
        expect(result).toBeTruthy();
        expect(mockInsert).toHaveBeenCalledWith([{ name: trimmed }]);
      } else {
        expect(result).toBeFalsy();
      }
  });
});
```

---

#### WB-004.2: Delete Genre
**วัตถุประสงค์:** ทดสอบการลบ Genre

**Scenarios:**

1. **Delete Unused Genre**
   - Input: Genre ID with 0 anime
   - Expected: Success
   
2. **Delete Genre in Use**
   - Input: Genre ID with anime
   - Expected: Should be prevented by UI
   
3. **Delete Non-existent Genre**
   - Input: Invalid ID
   - Expected: Error

---

### WB-005: Form Validation Logic

#### WB-005.1: Title Validation
**Test Cases:**

| Input | Valid | Error Message |
|-------|-------|---------------|
| "Valid Title" | ✅ | - |
| "" | ❌ | "กรุณากรอกชื่อ Anime" |
| "   " | ❌ | "กรุณากรอกชื่อ Anime" |
| "A".repeat(500) | ✅ | - |
| "A".repeat(501) | ⚠️ | คำเตือน |

---

#### WB-005.2: Genres Validation

**Test Cases:**
1. No genres selected → Error
2. 1 genre → Valid
3. Multiple genres → Valid
4. 10+ genres → Valid but warn

---

#### WB-005.3: Popularity Score Validation

**Equivalence Classes:**
- Valid: 0-100
- Invalid: <0 or >100

**Boundary Values:**
```typescript
const testCases = [
  { score: -1, valid: false },
  { score: 0, valid: true },   // Lower boundary
  { score: 1, valid: true },
  { score: 50, valid: true },
  { score: 99, valid: true },
  { score: 100, valid: true },  // Upper boundary
  { score: 101, valid: false },
];
```

---

## Black Box Testing Cases

### BB-001: Authentication Flow

#### BB-001.1: Login with Valid Credentials

**Test Scenario:**
```
Given: User is on login page
When: User enters valid email and password
And: Clicks login button
Then: User is authenticated
And: Redirected to admin panel
And: Session is created
```

**Test Steps:**
1. Navigate to `/`
2. Enter email: `admin@test.com`
3. Enter password: `password123`
4. Click "เข้าสู่ระบบ"
5. Verify redirect to `/admin`
6. Verify session exists

**Expected UI Elements:**
- Login form visible
- Loading indicator during login
- Success toast message
- Redirect within 2 seconds

---

#### BB-001.2: Login with Invalid Credentials

**Test Matrix:**

| Email | Password | Expected Result | Error Message |
|-------|----------|-----------------|---------------|
| valid@test.com | wrong | ❌ | "รหัสผ่านไม่ถูกต้อง" |
| invalid@test.com | any | ❌ | "ไม่พบบัญชีผู้ใช้" |
| | password | ❌ | Validation error |
| valid@test.com | | ❌ | Validation error |
| | | ❌ | Validation error |

---

### BB-002: Anime Management

#### BB-002.1: Add New Anime - Happy Path

**User Story:**
```
As an admin
I want to add a new anime
So that it appears in the system
```

**Test Steps:**
1. Login to admin panel
2. Click "รายการ Anime"
3. Click "+ เพิ่ม Anime"
4. Fill form:
   - Title: "Attack on Titan"
   - Publisher: "Wit Studio"
   - Description: "Humanity vs Titans"
   - First Aired: "2013-04-07"
   - Format: "TV Series"
   - Popularity: 95
   - Genres: Action, Drama
5. Upload image
6. Click "เพิ่ม Anime"

**Expected Results:**
- ✅ Form submits successfully
- ✅ Success toast displayed
- ✅ Redirect to anime list
- ✅ New anime appears in list
- ✅ Genre counts updated
- ✅ Appears in Recent Updates

**Performance:**
- Submit completes within 3 seconds
- Page load within 2 seconds

---

#### BB-002.2: Add Anime - Error Cases

**Test Scenarios:**

1. **Missing Required Fields**
   ```
   Scenario: Submit without title
   Given: Form is open
   When: User submits without entering title
   Then: Error toast "กรุณากรอกชื่อ Anime" appears
   And: Form is not submitted
   ```

2. **No Genres Selected**
   ```
   Scenario: Submit without genres
   Given: Form has title
   When: User submits without selecting genres
   Then: Error toast "กรุณาเลือกอย่างน้อย 1 Genre" appears
   ```

3. **Invalid Date Format**
   ```
   Scenario: Invalid first aired date
   Given: User enters invalid date
   When: User tries to submit
   Then: HTML5 validation prevents submission
   ```

---

#### BB-002.3: Edit Existing Anime

**Test Scenario:**
```
Given: Anime "Death Note" exists
When: Admin clicks edit
Then: Form loads with existing data
When: Admin changes description
And: Adds new genre "Psychological"
And: Updates popularity to 92
And: Clicks "อัปเดตข้อมูล"
Then: Changes are saved
And: Updated data appears in list
And: Genre counts updated
```

**Verification Points:**
- Pre-filled data is correct
- All fields are editable
- Image preview shows existing image
- Updated timestamp changes
- Genre counts recalculated

---

### BB-003: Genre Management

#### BB-003.1: Genre Operations Flow

**Complete Flow Test:**
```
1. Add Genre "Isekai"
   → Success, appears in list with count 0

2. Add Anime with "Isekai" genre
   → Count updates to 1

3. Try to delete "Isekai"
   → Delete button disabled
   → Tooltip: "Genre นี้ถูกใช้งานอยู่"

4. Edit Anime, remove "Isekai"
   → Count updates to 0

5. Delete "Isekai"
   → Success, genre removed
```

---

#### BB-003.2: Genre Search

**Test Cases:**

| Search Term | Expected Results | Notes |
|-------------|------------------|-------|
| "action" | Action | Case insensitive |
| "ACT" | Action | Case insensitive |
| "xyz" | No results | Invalid search |
| "" | All genres | Empty search |
| "   " | All genres | Whitespace |

**UI Behavior:**
- Real-time filtering
- No results message when empty
- Clear search button appears
- Count indicator updates

---

### BB-004: Front Office Features

#### BB-004.1: Home Page Display

**Test Checklist:**
- [ ] Hero section loads
- [ ] Popular anime displayed
- [ ] Sorted by popularity_score DESC
- [ ] Cards show image, title, genres
- [ ] Hover effects work
- [ ] Click opens detail popup
- [ ] Responsive on mobile

**Performance:**
- Initial load < 2 seconds
- Images lazy load
- Smooth scrolling

---

#### BB-004.2: Search Functionality

**Test Scenarios:**

1. **Search by Title**
   ```
   Input: "attack"
   Expected: Shows all anime with "attack" in title
   Case: Insensitive
   ```

2. **Filter by Genre**
   ```
   Input: Select "Action"
   Expected: Shows only Action anime
   Multiple: AND logic
   ```

3. **Combined Search**
   ```
   Input: Search "titan" + Genre "Action"
   Expected: Anime matching BOTH criteria
   Logic: title.includes(search) AND genres.includes(genre)
   ```

4. **Clear Filters**
   ```
   Action: Click "Clear All"
   Expected: 
   - Search input cleared
   - Genre selections removed
   - Shows all anime
   ```

---

### BB-005: UI/UX Testing

#### BB-005.1: Responsive Design

**Breakpoints to Test:**

| Device | Width | Expected Layout |
|--------|-------|-----------------|
| Mobile | 375px | Single column, hamburger menu |
| Tablet | 768px | 2 columns, collapsed sidebar |
| Desktop | 1024px | 3 columns, full sidebar |
| Large | 1920px | 4 columns, full layout |

**Test Each Page:**
- Login
- Dashboard
- Anime List
- Anime Form
- Genre Management
- Front Office pages

---

#### BB-005.2: Dark/Light Mode

**Test Cases:**
1. Toggle theme
2. Verify contrast ratios
3. Check all components
4. Verify persistence across sessions

**Elements to Check:**
- Text readability
- Button visibility
- Card backgrounds
- Border colors
- Icons

---

### BB-006: Performance Testing

#### BB-006.1: Page Load Times

**Benchmarks:**

| Page | Target | Max Acceptable |
|------|--------|----------------|
| Login | <1s | 2s |
| Dashboard | <2s | 3s |
| Anime List | <2s | 3s |
| Search Results | <1s | 2s |

---

#### BB-006.2: Large Dataset Performance

**Test Scenario:**
```
Given: Database has 1000+ anime
When: User loads anime list
Then: Page loads within acceptable time
And: Pagination works correctly
And: Search remains responsive
```

---

## Integration Testing Cases

### INT-001: End-to-End Anime Creation

**Complete Flow:**
```
1. Login → Success
2. Navigate to Anime Form → Form loads
3. Add new genre "Isekai" → Genre created
4. Fill anime form with "Isekai" → Form valid
5. Submit form → Anime created
6. Check anime list → Anime appears
7. Check genre management → Count updated
8. Check front office → Anime visible
9. Check recent updates → Update logged
```

---

### INT-002: Genre Dependency Chain

**Test Complex Dependencies:**
```
1. Create genres: A, B, C
2. Create anime1 with genres: A, B
3. Create anime2 with genres: B, C
4. Update anime1, remove B → B count: 1
5. Delete anime2 → B count: 0
6. Delete genre B → Success
7. Try delete genre A → Blocked (anime1)
```

---

## Test Execution Instructions

### Setup
```bash
# Install dependencies
npm install

# Setup test database
npm run test:setup

# Run all tests
npm test

# Run specific test suite
npm test -- hooks/useAnimeData
npm test -- components/AnimeForm
npm test -- integration/animeFlow

# Run with coverage
npm test -- --coverage

# Watch mode
npm test -- --watch
```

### Test Data
```typescript
// Create test data
npm run test:seed

// Clean test data
npm run test:clean
```

### CI/CD Integration
```yaml
# .github/workflows/test.yml
name: Test
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - run: npm install
      - run: npm test
      - run: npm run test:coverage
```

---

## Test Coverage Goals

| Category | Target | Current |
|----------|--------|---------|
| Hooks | 95% | TBD |
| Components | 90% | TBD |
| Pages | 85% | TBD |
| Utils | 95% | TBD |
| Overall | 90% | TBD |

---

## กเอกสารทดสอบเพิ่มเติม

- [White Box Testing Report](./WHITE_BOX_TESTING.md)
- [Black Box Testing Report](./BLACK_BOX_TESTING.md)
- [Test Plan](./TEST_PLAN.md)
- [Bug Reports](./BUG_REPORTS.md)

---

**Last Updated:** 2 ตุลาคม 2025  
**Version:** 1.0  
**Maintainer:** Development Team
