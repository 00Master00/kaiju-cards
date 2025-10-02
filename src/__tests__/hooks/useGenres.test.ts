import { renderHook, act, waitFor } from '@testing-library/react';
import { useGenres } from '@/hooks/useGenres';
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

describe('useGenres Hook - White Box Testing', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('TC-WB-006: fetchGenres()', () => {
    it('should fetch all genres ordered by name', async () => {
      const mockGenres = [
        { id: '1', name: 'Action', created_at: '2024-01-01', updated_at: '2024-01-01' },
        { id: '2', name: 'Drama', created_at: '2024-01-02', updated_at: '2024-01-02' },
      ];

      const mockOrder = jest.fn().mockResolvedValue({
        data: mockGenres,
        error: null,
      });

      const mockSelect = jest.fn().mockReturnValue({
        order: mockOrder,
      });

      (supabase.from as jest.Mock).mockReturnValue({
        select: mockSelect,
      });

      const { result } = renderHook(() => useGenres());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(supabase.from).toHaveBeenCalledWith('genres');
      expect(mockSelect).toHaveBeenCalledWith('*');
      expect(mockOrder).toHaveBeenCalledWith('name');
      expect(result.current.genres).toEqual(mockGenres);
    });

    it('should handle empty genres list', async () => {
      (supabase.from as jest.Mock).mockReturnValue({
        select: jest.fn().mockReturnValue({
          order: jest.fn().mockResolvedValue({
            data: [],
            error: null,
          }),
        }),
      });

      const { result } = renderHook(() => useGenres());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.genres).toEqual([]);
    });
  });

  describe('TC-WB-007: addGenre()', () => {
    it('should add new genre with trimmed name', async () => {
      const genreName = '  Isekai  ';
      const trimmedName = 'Isekai';

      const mockInsert = jest.fn().mockResolvedValue({
        data: [{ id: '1', name: trimmedName }],
        error: null,
      });

      const mockSelect = jest.fn().mockReturnThis();

      (supabase.from as jest.Mock).mockReturnValue({
        insert: mockInsert,
        select: mockSelect,
      });

      const { result } = renderHook(() => useGenres());

      let response;
      await act(async () => {
        response = await result.current.addGenre(genreName);
      });

      expect(mockInsert).toHaveBeenCalledWith([{ name: trimmedName }]);
      expect(response).toBeTruthy();
    });

    it('should prevent duplicate genres', async () => {
      const duplicateError = {
        code: '23505', // Unique constraint violation
        message: 'duplicate key value',
      };

      (supabase.from as jest.Mock).mockReturnValue({
        insert: jest.fn().mockResolvedValue({
          data: null,
          error: duplicateError,
        }),
      });

      const { result } = renderHook(() => useGenres());

      let response;
      await act(async () => {
        response = await result.current.addGenre('Action');
      });

      expect(response).toBeFalsy();
    });

    it('should reject empty genre name', async () => {
      const { result } = renderHook(() => useGenres());

      let response;
      await act(async () => {
        response = await result.current.addGenre('   ');
      });

      // Should not call Supabase for empty name
      expect(supabase.from).not.toHaveBeenCalled();
    });
  });

  describe('TC-WB-008: deleteGenre()', () => {
    it('should delete genre successfully', async () => {
      const genreId = '1';
      const genreName = 'Test Genre';

      const mockDelete = jest.fn().mockReturnValue({
        eq: jest.fn().mockResolvedValue({
          error: null,
        }),
      });

      (supabase.from as jest.Mock).mockReturnValue({
        delete: mockDelete,
      });

      const { result } = renderHook(() => useGenres());

      await act(async () => {
        await result.current.deleteGenre(genreId, genreName);
      });

      expect(mockDelete).toHaveBeenCalled();
    });

    it('should handle delete errors', async () => {
      const genreId = '1';
      const genreName = 'Action';
      const deleteError = new Error('Genre is in use');

      (supabase.from as jest.Mock).mockReturnValue({
        delete: jest.fn().mockReturnValue({
          eq: jest.fn().mockResolvedValue({
            error: deleteError,
          }),
        }),
      });

      const { result } = renderHook(() => useGenres());

      await act(async () => {
        await result.current.deleteGenre(genreId, genreName);
      });

      // Should handle error gracefully
      expect(result.current.genres).toBeDefined();
    });
  });

  describe('TC-WB-009: refreshGenres()', () => {
    it('should refresh genres list', async () => {
      const initialGenres = [
        { id: '1', name: 'Action', created_at: '2024-01-01', updated_at: '2024-01-01' },
      ];

      const updatedGenres = [
        ...initialGenres,
        { id: '2', name: 'Drama', created_at: '2024-01-02', updated_at: '2024-01-02' },
      ];

      const mockOrder = jest.fn()
        .mockResolvedValueOnce({
          data: initialGenres,
          error: null,
        })
        .mockResolvedValueOnce({
          data: updatedGenres,
          error: null,
        });

      (supabase.from as jest.Mock).mockReturnValue({
        select: jest.fn().mockReturnValue({
          order: mockOrder,
        }),
      });

      const { result } = renderHook(() => useGenres());

      await waitFor(() => {
        expect(result.current.genres).toEqual(initialGenres);
      });

      await act(async () => {
        await result.current.refreshGenres();
      });

      expect(result.current.genres).toEqual(updatedGenres);
    });
  });
});
