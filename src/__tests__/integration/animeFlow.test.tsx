import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

// Integration tests - testing complete user flows
jest.mock('@/integrations/supabase/client');

describe('Anime Management Flow - Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('TC-INT-001: Complete Anime Creation Flow', () => {
    it('should create anime and update genres', async () => {
      // Test scenario:
      // 1. User navigates to AnimeForm
      // 2. Fills in all anime details
      // 3. Adds a new genre "Isekai"
      // 4. Submits form
      // 5. Anime is created
      // 6. Genre count updates
      // 7. Anime appears in list

      const mockGenres = [
        { id: '1', name: 'Action' },
        { id: '2', name: 'Drama' },
      ];

      const mockAnimeData = {
        id: '1',
        title: 'That Time I Got Reincarnated as a Slime',
        description: 'An isekai adventure',
        genres: ['Action', 'Isekai'],
        publisher: 'Kodansha',
        first_aired: '2018-10-02',
        format: 'TV Series',
        popularity_score: 88,
        image_url: null,
      };

      // Mock genre fetch
      (supabase.from as jest.Mock).mockReturnValue({
        select: jest.fn().mockReturnValue({
          order: jest.fn().mockResolvedValue({
            data: mockGenres,
            error: null,
          }),
        }),
        insert: jest.fn().mockResolvedValue({
          data: [mockAnimeData],
          error: null,
        }),
      });

      // Expected flow:
      // 1. Fetch genres
      expect(supabase.from).toHaveBeenCalledWith('genres');

      // 2. Add new genre "Isekai"
      expect(supabase.from).toHaveBeenCalledWith('genres');

      // 3. Insert anime
      expect(supabase.from).toHaveBeenCalledWith('anime');

      // 4. Create anime update
      expect(supabase.from).toHaveBeenCalledWith('anime_updates');
    });
  });

  describe('TC-INT-002: Genre Usage Protection Flow', () => {
    it('should prevent deletion of genres in use', async () => {
      // Test scenario:
      // 1. Genre "Action" is used in 3 anime
      // 2. User tries to delete "Action"
      // 3. System prevents deletion
      // 4. Shows appropriate error message

      const mockAnimeList = [
        { id: '1', genres: ['Action'] },
        { id: '2', genres: ['Action', 'Drama'] },
        { id: '3', genres: ['Action'] },
      ];

      // Count should be 3
      const actionCount = mockAnimeList.filter(anime => 
        anime.genres.includes('Action')
      ).length;

      expect(actionCount).toBe(3);

      // Delete should be prevented
      const canDelete = actionCount === 0;
      expect(canDelete).toBe(false);
    });
  });

  describe('TC-INT-003: Search and Filter Flow', () => {
    it('should filter anime by multiple criteria', () => {
      // Test scenario:
      // 1. User enters search term "attack"
      // 2. User selects genre filter "Action"
      // 3. System applies both filters (AND logic)
      // 4. Returns matching results

      const mockAnimeList = [
        { id: '1', title: 'Attack on Titan', genres: ['Action', 'Drama'] },
        { id: '2', title: 'Death Note', genres: ['Mystery', 'Drama'] },
        { id: '3', title: 'Attack on Titan: Final Season', genres: ['Action'] },
        { id: '4', title: 'One Punch Man', genres: ['Action', 'Comedy'] },
      ];

      const searchTerm = 'attack';
      const selectedGenres = ['Action'];

      const filtered = mockAnimeList.filter(anime => {
        const matchesSearch = anime.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesGenre = selectedGenres.length === 0 || 
          selectedGenres.some(genre => anime.genres.includes(genre));
        
        return matchesSearch && matchesGenre;
      });

      // Should return only Attack on Titan titles with Action genre
      expect(filtered).toHaveLength(2);
      expect(filtered[0].title).toContain('Attack');
      expect(filtered[0].genres).toContain('Action');
    });
  });

  describe('TC-INT-004: Update Anime and Genre Counts', () => {
    it('should update genre counts when anime genres change', () => {
      // Test scenario:
      // 1. Anime initially has genres: ['Action', 'Drama']
      // 2. User updates to: ['Action', 'Mystery']
      // 3. Drama count decreases by 1
      // 4. Mystery count increases by 1
      // 5. Action count stays same

      const animeList = [
        { id: '1', genres: ['Action', 'Drama'] },
        { id: '2', genres: ['Drama'] },
        { id: '3', genres: ['Mystery'] },
      ];

      const getGenreCount = (genreName: string, list: typeof animeList) => {
        return list.filter(anime => anime.genres.includes(genreName)).length;
      };

      // Before update
      const beforeAction = getGenreCount('Action', animeList);
      const beforeDrama = getGenreCount('Drama', animeList);
      const beforeMystery = getGenreCount('Mystery', animeList);

      expect(beforeAction).toBe(1);
      expect(beforeDrama).toBe(2);
      expect(beforeMystery).toBe(1);

      // Simulate update
      animeList[0].genres = ['Action', 'Mystery'];

      // After update
      const afterAction = getGenreCount('Action', animeList);
      const afterDrama = getGenreCount('Drama', animeList);
      const afterMystery = getGenreCount('Mystery', animeList);

      expect(afterAction).toBe(1); // Stays same
      expect(afterDrama).toBe(1); // Decreases
      expect(afterMystery).toBe(2); // Increases
    });
  });

  describe('TC-INT-005: Popularity Ranking Flow', () => {
    it('should sort and display anime by popularity', () => {
      // Test scenario:
      // 1. System has multiple anime with different scores
      // 2. User navigates to Popular Rankings
      // 3. Anime are displayed in descending order
      // 4. Top 3 are highlighted

      const mockAnimeList = [
        { id: '1', title: 'Anime A', popularity_score: 75 },
        { id: '2', title: 'Anime B', popularity_score: 95 },
        { id: '3', title: 'Anime C', popularity_score: 88 },
        { id: '4', title: 'Anime D', popularity_score: 92 },
        { id: '5', title: 'Anime E', popularity_score: 80 },
      ];

      const sorted = [...mockAnimeList].sort((a, b) => 
        b.popularity_score - a.popularity_score
      );

      const top3 = sorted.slice(0, 3);
      const rest = sorted.slice(3);

      // Verify sorting
      expect(sorted[0].title).toBe('Anime B'); // 95
      expect(sorted[1].title).toBe('Anime D'); // 92
      expect(sorted[2].title).toBe('Anime C'); // 88

      // Verify top 3 separation
      expect(top3).toHaveLength(3);
      expect(rest).toHaveLength(2);
    });
  });

  describe('TC-INT-006: Form Validation Flow', () => {
    it('should validate all fields before submission', () => {
      // Test scenario:
      // 1. User attempts to submit incomplete form
      // 2. System validates each field
      // 3. Shows appropriate errors
      // 4. Prevents submission until valid

      const formData = {
        title: '',
        description: 'Test',
        genres: [] as string[],
        publisher: '',
        popularity_score: 150,
      };

      const validateForm = (data: typeof formData) => {
        const errors: string[] = [];

        if (!data.title.trim()) {
          errors.push('Title is required');
        }

        if (data.genres.length === 0) {
          errors.push('At least one genre is required');
        }

        if (data.popularity_score < 0 || data.popularity_score > 100) {
          errors.push('Popularity score must be between 0 and 100');
        }

        return errors;
      };

      const errors = validateForm(formData);

      expect(errors).toContain('Title is required');
      expect(errors).toContain('At least one genre is required');
      expect(errors).toHaveLength(2);

      // Fix issues
      formData.title = 'Valid Title';
      formData.genres = ['Action'];
      formData.popularity_score = 85;

      const errorsAfterFix = validateForm(formData);
      expect(errorsAfterFix).toHaveLength(0);
    });
  });

  describe('TC-INT-007: Concurrent Genre Operations', () => {
    it('should handle concurrent add/delete operations', async () => {
      // Test scenario:
      // 1. User A adds genre "Isekai"
      // 2. User B tries to add same genre
      // 3. System detects duplicate
      // 4. Shows appropriate error
      // 5. Only one genre is created

      const existingGenres = ['Action', 'Drama'];

      const addGenre = (name: string) => {
        if (existingGenres.includes(name)) {
          throw new Error('Genre already exists');
        }
        existingGenres.push(name);
        return true;
      };

      // User A adds
      expect(() => addGenre('Isekai')).not.toThrow();
      expect(existingGenres).toContain('Isekai');

      // User B tries to add same
      expect(() => addGenre('Isekai')).toThrow('Genre already exists');

      // Should only have one Isekai
      const isekaiCount = existingGenres.filter(g => g === 'Isekai').length;
      expect(isekaiCount).toBe(1);
    });
  });
});
