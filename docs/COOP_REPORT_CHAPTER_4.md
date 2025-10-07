# บทที่ 4: การพัฒนาและดำเนินการทดสอบ

## 4.1 การพัฒนา Automated Tests (White Box Testing)

### 4.1.1 Unit Testing - Custom Hooks

**useAnimeData Hook Testing:**

```typescript
// src/__tests__/hooks/useAnimeData.test.ts
import { renderHook, waitFor } from '@testing-library/react';
import { useAnimeData } from '@/hooks/useAnimeData';

describe('useAnimeData Hook', () => {
  test('TC-WB-001: Should initialize with empty state', () => {
    const { result } = renderHook(() => useAnimeData());
    
    expect(result.current.animes).toEqual([]);
    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBeNull();
  });

  test('TC-WB-002: Should fetch animes successfully', async () => {
    const { result } = renderHook(() => useAnimeData());
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.animes.length).toBeGreaterThan(0);
      expect(result.current.error).toBeNull();
    });
  });

  test('TC-WB-003: Should handle fetch error', async () => {
    server.use(
      http.get('/api/animes', () => {
        return HttpResponse.json({ error: 'Server error' }, { status: 500 });
      })
    );

    const { result } = renderHook(() => useAnimeData());
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeTruthy();
      expect(result.current.animes).toEqual([]);
    });
  });
});
```

**useGenres Hook Testing:**

```typescript
// src/__tests__/hooks/useGenres.test.ts
describe('useGenres Hook', () => {
  test('TC-WB-011: Should fetch genres on mount', async () => {
    const { result } = renderHook(() => useGenres());
    
    await waitFor(() => {
      expect(result.current.genres.length).toBeGreaterThan(0);
      expect(result.current.loading).toBe(false);
    });
  });

  test('TC-WB-012: Should create new genre', async () => {
    const { result } = renderHook(() => useGenres());
    
    await result.current.createGenre({
      name: 'Test Genre',
      color: '#FF5733',
      icon: '⚔️'
    });
    
    await waitFor(() => {
      expect(result.current.genres).toContainEqual(
        expect.objectContaining({ name: 'Test Genre' })
      );
    });
  });

  test('TC-WB-013: Should update genre', async () => {
    const { result } = renderHook(() => useGenres());
    
    const genreId = result.current.genres[0].id;
    await result.current.updateGenre(genreId, { name: 'Updated Genre' });
    
    await waitFor(() => {
      const updated = result.current.genres.find(g => g.id === genreId);
      expect(updated?.name).toBe('Updated Genre');
    });
  });

  test('TC-WB-014: Should delete genre', async () => {
    const { result } = renderHook(() => useGenres());
    
    const initialCount = result.current.genres.length;
    const genreId = result.current.genres[0].id;
    
    await result.current.deleteGenre(genreId);
    
    await waitFor(() => {
      expect(result.current.genres.length).toBe(initialCount - 1);
      expect(result.current.genres.find(g => g.id === genreId)).toBeUndefined();
    });
  });
});
```

### 4.1.2 Component Testing

**AnimeCard Component Testing:**

```typescript
// src/__tests__/components/AnimeCard.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import AnimeCard from '@/components/AnimeCard';

describe('AnimeCard Component', () => {
  const mockAnime = {
    id: '1',
    title: 'Test Anime',
    description: 'Test description',
    score: 8.5,
    episodes: 24,
    image_url: 'test.jpg',
    status: 'Completed'
  };

  test('TC-WB-021: Should render anime information', () => {
    render(<AnimeCard anime={mockAnime} />);
    
    expect(screen.getByText('Test Anime')).toBeInTheDocument();
    expect(screen.getByText('8.5')).toBeInTheDocument();
    expect(screen.getByText('24 Episodes')).toBeInTheDocument();
    expect(screen.getByText('Completed')).toBeInTheDocument();
  });

  test('TC-WB-022: Should display anime image', () => {
    render(<AnimeCard anime={mockAnime} />);
    
    const image = screen.getByAltText('Test Anime');
    expect(image).toHaveAttribute('src', 'test.jpg');
  });

  test('TC-WB-023: Should call onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<AnimeCard anime={mockAnime} onClick={handleClick} />);
    
    fireEvent.click(screen.getByRole('article'));
    expect(handleClick).toHaveBeenCalledWith('1');
  });

  test('TC-WB-024: Should show placeholder for missing image', () => {
    const animeWithoutImage = { ...mockAnime, image_url: '' };
    render(<AnimeCard anime={animeWithoutImage} />);
    
    expect(screen.getByText('No Image')).toBeInTheDocument();
  });
});
```

**AnimeForm Component Testing:**

```typescript
// src/__tests__/components/AnimeForm.test.tsx
describe('AnimeForm Component', () => {
  test('TC-WB-031: Should render form fields', () => {
    render(<AnimeForm />);
    
    expect(screen.getByLabelText('Title')).toBeInTheDocument();
    expect(screen.getByLabelText('Description')).toBeInTheDocument();
    expect(screen.getByLabelText('Score')).toBeInTheDocument();
    expect(screen.getByLabelText('Episodes')).toBeInTheDocument();
  });

  test('TC-WB-032: Should validate required fields', async () => {
    render(<AnimeForm />);
    
    fireEvent.click(screen.getByText('Save'));
    
    await waitFor(() => {
      expect(screen.getByText('Title is required')).toBeInTheDocument();
    });
  });

  test('TC-WB-033: Should submit form with valid data', async () => {
    const onSubmit = jest.fn();
    render(<AnimeForm onSubmit={onSubmit} />);
    
    fireEvent.change(screen.getByLabelText('Title'), {
      target: { value: 'New Anime' }
    });
    fireEvent.change(screen.getByLabelText('Score'), {
      target: { value: '8.5' }
    });
    
    fireEvent.click(screen.getByText('Save'));
    
    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'New Anime',
          score: 8.5
        })
      );
    });
  });
});
```

### 4.1.3 Integration Testing

**Anime CRUD Flow Integration Test:**

```typescript
// src/__tests__/integration/animeFlow.test.tsx
describe('Anime CRUD Integration', () => {
  test('TC-WB-041: Complete CRUD flow', async () => {
    // Create
    const { result } = renderHook(() => useAnimeData());
    
    await result.current.createAnime({
      title: 'Integration Test Anime',
      score: 9.0,
      episodes: 12
    });
    
    await waitFor(() => {
      expect(result.current.animes).toContainEqual(
        expect.objectContaining({ title: 'Integration Test Anime' })
      );
    });
    
    // Read
    const createdAnime = result.current.animes.find(
      a => a.title === 'Integration Test Anime'
    );
    expect(createdAnime).toBeDefined();
    
    // Update
    await result.current.updateAnime(createdAnime.id, {
      score: 9.5
    });
    
    await waitFor(() => {
      const updated = result.current.animes.find(a => a.id === createdAnime.id);
      expect(updated.score).toBe(9.5);
    });
    
    // Delete
    await result.current.deleteAnime(createdAnime.id);
    
    await waitFor(() => {
      expect(
        result.current.animes.find(a => a.id === createdAnime.id)
      ).toBeUndefined();
    });
  });
});
```

---

## 4.2 การดำเนินการ Manual Testing (Black Box Testing)

### 4.2.1 Functional Testing

**Module: Authentication**

**TC-BB-001: Login with Valid Credentials**
- **Priority:** P0 (Critical)
- **Preconditions:** User registered in system
- **Steps:**
  1. Navigate to `/login`
  2. Enter email: "admin@test.com"
  3. Enter password: "Test1234"
  4. Click "Login" button
- **Expected Result:**
  - User redirected to dashboard
  - Success toast displayed
  - User session established
- **Status:** ✅ PASS

**TC-BB-002: Login with Invalid Email**
- **Priority:** P1 (High)
- **Steps:**
  1. Navigate to `/login`
  2. Enter email: "invalid@test.com"
  3. Enter password: "Test1234"
  4. Click "Login" button
- **Expected Result:**
  - Error message: "Invalid credentials"
  - User remains on login page
- **Status:** ✅ PASS

**Module: Anime Management**

**TC-BB-011: Create New Anime**
- **Priority:** P0 (Critical)
- **Steps:**
  1. Login as admin
  2. Navigate to `/admin/anime/new`
  3. Fill form with valid data
  4. Upload image
  5. Select genres
  6. Click "Save"
- **Expected Result:**
  - Anime created successfully
  - Redirected to anime list
  - New anime visible in list
- **Status:** ✅ PASS

**TC-BB-012: Edit Existing Anime**
- **Priority:** P0 (Critical)
- **Steps:**
  1. Navigate to anime list
  2. Click "Edit" on any anime
  3. Update title and score
  4. Click "Save"
- **Expected Result:**
  - Changes saved successfully
  - Updated data displayed
- **Status:** ✅ PASS

**TC-BB-013: Delete Anime**
- **Priority:** P1 (High)
- **Steps:**
  1. Navigate to anime list
  2. Click "Delete" on an anime
  3. Confirm deletion
- **Expected Result:**
  - Anime removed from list
  - Confirmation message shown
- **Status:** ✅ PASS

### 4.2.2 UI/UX Testing

**TC-BB-021: Responsive Design - Mobile View**
- **Device:** iPhone 12 (390x844)
- **Steps:**
  1. Open website on mobile
  2. Navigate through pages
  3. Test navigation menu
- **Expected Result:**
  - All elements visible
  - Touch targets adequate size
  - Navigation menu collapsible
- **Status:** ⚠️ MINOR ISSUES
- **Issues:** Some buttons too small on mobile

**TC-BB-022: Dark Mode Toggle**
- **Steps:**
  1. Click theme toggle button
  2. Verify colors change
  3. Navigate to different pages
- **Expected Result:**
  - Theme changes smoothly
  - All pages respect theme
  - Theme persists on reload
- **Status:** ✅ PASS

### 4.2.3 Cross-Browser Testing

**TC-BB-031: Chrome Compatibility**
- **Browser:** Chrome 120
- **Test Scope:** All major features
- **Result:** ✅ PASS - All features work correctly

**TC-BB-032: Firefox Compatibility**
- **Browser:** Firefox 121
- **Test Scope:** All major features
- **Result:** ✅ PASS - All features work correctly

**TC-BB-033: Safari Compatibility**
- **Browser:** Safari 17
- **Test Scope:** All major features  
- **Result:** ⚠️ MINOR ISSUES
- **Issues:** Some CSS animations not smooth

---

## 4.3 Performance Testing

### 4.3.1 Page Load Performance

**Test Results:**

| Page | Load Time | First Contentful Paint | Time to Interactive |
|------|-----------|------------------------|---------------------|
| Home | 1.2s | 0.8s | 1.5s |
| Anime List | 1.5s | 0.9s | 1.8s |
| Anime Detail | 1.1s | 0.7s | 1.4s |
| Admin Dashboard | 1.8s | 1.0s | 2.1s |

**Performance Goals:**
- ✅ Load Time < 2s
- ✅ FCP < 1.5s  
- ✅ TTI < 3s

### 4.3.2 API Response Time

**Test Results:**

| Endpoint | Average Response Time | Success Rate |
|----------|----------------------|--------------|
| GET /animes | 245ms | 100% |
| GET /animes/:id | 128ms | 100% |
| POST /animes | 312ms | 99.8% |
| PUT /animes/:id | 298ms | 99.9% |
| DELETE /animes/:id | 156ms | 100% |
| GET /genres | 89ms | 100% |

**Performance Goals:**
- ✅ Response Time < 500ms
- ✅ Success Rate > 99%

---

## 4.4 ปัญหาที่พบระหว่างการทดสอบ

### 4.4.1 Critical Issues (P0)

**BUG-001: Authentication Session Timeout Not Working**
- **Severity:** Critical
- **Description:** User session doesn't expire after timeout
- **Impact:** Security risk
- **Status:** Fixed
- **Fix:** Implement proper session timeout handling

**BUG-002: Data Loss on Form Validation Error**
- **Severity:** Critical
- **Description:** Form data lost when validation fails
- **Impact:** Poor UX, data loss
- **Status:** Fixed  
- **Fix:** Preserve form state on validation error

### 4.4.2 High Priority Issues (P1)

**BUG-011: Search Results Not Updating Real-time**
- **Severity:** High
- **Description:** Search doesn't filter results immediately
- **Status:** Fixed
- **Fix:** Implement debounced search

**BUG-012: Image Upload Size Not Validated**
- **Severity:** High
- **Description:** Large images crash the upload
- **Status:** Fixed
- **Fix:** Add client-side size validation

### 4.4.3 Medium Priority Issues (P2)

**BUG-021: Pagination Buttons Overlap on Mobile**
- **Severity:** Medium
- **Status:** In Progress

**BUG-022: Genre Colors Not Visible in Dark Mode**
- **Severity:** Medium
- **Status:** Fixed

### 4.4.4 Low Priority Issues (P3)

**BUG-031: Tooltip Animation Delay**
- **Severity:** Low
- **Status:** Backlog

---

## สรุป

บทที่ 4 นี้ได้นำเสนอกระบวนการพัฒนาและดำเนินการทดสอบทั้ง Automated (White Box) และ Manual (Black Box) Testing พร้อมตัวอย่าง Test Cases จริงและผลการทดสอบ

การทดสอบที่ครอบคลุมช่วยค้นพบข้อบกพร่อง 47 รายการ ซึ่งส่วนใหญ่ได้รับการแก้ไขแล้ว ส่งผลให้ระบบมีคุณภาพและความน่าเชื่อถือสูงขึ้น

ในบทถัดไปจะนำเสนอผลการทดสอบโดยรวม การวิเคราะห์ Metrics และสรุปคุณภาพของระบบ