# บทที่ 4: การพัฒนาและดำเนินการทดสอบ

## 4.1 การพัฒนา Automated Tests

### 4.1.1 Unit Tests สำหรับ Custom Hooks

**useAnimeData Hook Test**
```typescript
// src/__tests__/hooks/useAnimeData.test.ts
import { renderHook, waitFor } from '@testing-library/react';
import { useAnimeData } from '@/hooks/useAnimeData';

describe('useAnimeData Hook', () => {
  it('should fetch animes successfully', async () => {
    const { result } = renderHook(() => useAnimeData());
    
    await waitFor(() => {
      expect(result.current.animes).toHaveLength(5);
      expect(result.current.loading).toBe(false);
    });
  });
  
  it('should handle fetch errors', async () => {
    // Test error handling
  });
});
```

### 4.1.2 Component Tests

**AnimeForm Component Test**
```typescript
// src/__tests__/components/AnimeForm.test.tsx
describe('AnimeForm Component', () => {
  it('should render form fields', () => {
    render(<AnimeForm />);
    expect(screen.getByLabelText('Title')).toBeInTheDocument();
  });
  
  it('should validate required fields', async () => {
    render(<AnimeForm />);
    const submitButton = screen.getByRole('button', { name: /save/i });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('Title is required')).toBeInTheDocument();
    });
  });
});
```

### 4.1.3 Integration Tests

**Complete User Flow Test**
```typescript
describe('Anime Management Flow', () => {
  it('should complete full CRUD cycle', async () => {
    // Create -> Read -> Update -> Delete
  });
});
```

## 4.2 การดำเนินการทดสอบ Manual

### 4.2.1 UI/UX Testing Checklist
- ✅ Responsive design ทุกขนาดหน้าจอ
- ✅ Navigation ทำงานถูกต้อง
- ✅ Form validation แสดงผลชัดเจน
- ✅ Loading states แสดงผลเหมาะสม
- ✅ Error messages เข้าใจง่าย

### 4.2.2 Cross-browser Testing
- Chrome ✅
- Firefox ✅
- Safari ✅
- Edge ✅

## 4.3 Performance Testing

### 4.3.1 Key Metrics
- Page Load Time: < 3 วินาที
- API Response Time: < 500ms
- Time to Interactive: < 5 วินาที

## 4.4 ปัญหาที่พบและแก้ไข

### 4.4.1 ปัญหาด้าน Async Testing
**ปัญหา:** Tests ล้มเหลวเพราะ async operations
**แก้ไข:** ใช้ waitFor และ findBy queries

### 4.4.2 ปัญหา Mock Data
**ปัญหา:** Mock data ไม่สอดคล้องกับ production
**แก้ไข:** สร้าง realistic test data sets

---

**สรุป:** บทนี้อธิบายการพัฒนาและดำเนินการทดสอบทั้ง automated และ manual พร้อมปัญหาที่พบและวิธีแก้ไข
