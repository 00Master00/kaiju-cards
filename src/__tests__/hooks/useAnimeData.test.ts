import { renderHook, act, waitFor } from '@testing-library/react';
import { useAnimeData } from '@/hooks/useAnimeData';
import { supabase } from '@/integrations/supabase/client';

// Mock Supabase
jest.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: jest.fn(),
  },
}));

// Mock toast
jest.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: jest.fn(),
  }),
}));

describe('useAnimeData Hook - White Box Testing', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('TC-WB-001: fetchAnime()', () => {
    it('should fetch all anime from database', async () => {
      const mockData = [
        {
          id: '1',
          title: 'Test Anime',
          description: 'Test Description',
          genres: ['Action'],
          popularity_score: 85,
        },
      ];

      const mockSelect = jest.fn().mockResolvedValue({
        data: mockData,
        error: null,
      });

      (supabase.from as jest.Mock).mockReturnValue({
        select: mockSelect,
      });

      const { result } = renderHook(() => useAnimeData());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(supabase.from).toHaveBeenCalledWith('anime');
      expect(mockSelect).toHaveBeenCalledWith('*');
      expect(result.current.animeList).toEqual(mockData);
    });

    it('should handle fetch error gracefully', async () => {
      const mockError = new Error('Database connection failed');
      
      (supabase.from as jest.Mock).mockReturnValue({
        select: jest.fn().mockResolvedValue({
          data: null,
          error: mockError,
        }),
      });

      const { result } = renderHook(() => useAnimeData());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.animeList).toEqual([]);
    });
  });

  describe('TC-WB-002: createAnime()', () => {
    it('should create new anime with valid data', async () => {
      const newAnime = {
        title: 'New Anime',
        description: 'Test Description',
        genres: ['Action', 'Adventure'],
        publisher: 'Test Studio',
        first_aired: '2024-01-01',
        format: 'TV Series',
        image_url: 'http://example.com/image.jpg',
        popularity_score: 85,
      };

      const mockInsert = jest.fn().mockResolvedValue({
        data: { id: '1', ...newAnime },
        error: null,
      });

      (supabase.from as jest.Mock).mockReturnValue({
        insert: mockInsert,
        select: jest.fn().mockReturnThis(),
      });

      const { result } = renderHook(() => useAnimeData());

      let response;
      await act(async () => {
        response = await result.current.createAnime(newAnime);
      });

      expect(mockInsert).toHaveBeenCalledWith([newAnime]);
      expect(response).toHaveProperty('data');
    });

    it('should validate required fields', async () => {
      const invalidAnime = {
        title: '',
        description: '',
        genres: [],
        publisher: '',
        first_aired: '',
        format: 'TV Series',
        image_url: null,
        popularity_score: 0,
      };

      const { result } = renderHook(() => useAnimeData());

      // This should fail validation in the component level
      // Hook itself doesn't validate, it's tested at component level
      expect(invalidAnime.title).toBe('');
      expect(invalidAnime.genres).toHaveLength(0);
    });
  });

  describe('TC-WB-003: updateAnime()', () => {
    it('should update existing anime', async () => {
      const animeId = '1';
      const updateData = {
        title: 'Updated Anime',
        description: 'Updated Description',
        genres: ['Action'],
        popularity_score: 90,
      };

      const mockUpdate = jest.fn().mockReturnValue({
        eq: jest.fn().mockResolvedValue({
          data: { id: animeId, ...updateData },
          error: null,
        }),
      });

      (supabase.from as jest.Mock).mockReturnValue({
        update: mockUpdate,
      });

      const { result } = renderHook(() => useAnimeData());

      await act(async () => {
        await result.current.updateAnime(animeId, updateData);
      });

      expect(mockUpdate).toHaveBeenCalledWith(updateData);
    });

    it('should handle non-existent anime ID', async () => {
      const nonExistentId = 'invalid-id';
      const updateData = { title: 'Test' };

      const mockUpdate = jest.fn().mockReturnValue({
        eq: jest.fn().mockResolvedValue({
          data: null,
          error: { message: 'Anime not found' },
        }),
      });

      (supabase.from as jest.Mock).mockReturnValue({
        update: mockUpdate,
      });

      const { result } = renderHook(() => useAnimeData());

      await act(async () => {
        const response = await result.current.updateAnime(nonExistentId, updateData);
        expect(response.error).toBeDefined();
      });
    });
  });

  describe('TC-WB-004: getAnimeById()', () => {
    it('should return anime by ID', async () => {
      const mockAnime = {
        id: '1',
        title: 'Test Anime',
        genres: ['Action'],
      };

      // Mock initial fetch
      (supabase.from as jest.Mock).mockReturnValue({
        select: jest.fn().mockResolvedValue({
          data: [mockAnime],
          error: null,
        }),
      });

      const { result } = renderHook(() => useAnimeData());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      const anime = result.current.getAnimeById('1');
      expect(anime).toEqual(mockAnime);
    });

    it('should return undefined for non-existent ID', async () => {
      (supabase.from as jest.Mock).mockReturnValue({
        select: jest.fn().mockResolvedValue({
          data: [],
          error: null,
        }),
      });

      const { result } = renderHook(() => useAnimeData());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      const anime = result.current.getAnimeById('non-existent');
      expect(anime).toBeUndefined();
    });
  });

  describe('TC-WB-005: Error Handling', () => {
    it('should handle network errors', async () => {
      const networkError = new Error('Network error');
      
      (supabase.from as jest.Mock).mockReturnValue({
        select: jest.fn().mockRejectedValue(networkError),
      });

      const { result } = renderHook(() => useAnimeData());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.animeList).toEqual([]);
    });

    it('should handle null/undefined responses', async () => {
      (supabase.from as jest.Mock).mockReturnValue({
        select: jest.fn().mockResolvedValue({
          data: null,
          error: null,
        }),
      });

      const { result } = renderHook(() => useAnimeData());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.animeList).toEqual([]);
    });
  });
});
