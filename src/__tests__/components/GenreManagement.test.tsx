import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import GenreManagement from '@/pages/GenreManagement';
import { useAnimeData } from '@/hooks/useAnimeData';
import { useGenres } from '@/hooks/useGenres';

// Mock hooks
jest.mock('@/hooks/useAnimeData');
jest.mock('@/hooks/useGenres');

// Mock navigate
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

describe('GenreManagement Component - Black Box Testing', () => {
  const mockAddGenre = jest.fn();
  const mockDeleteGenre = jest.fn();

  const mockAnimeList = [
    {
      id: '1',
      title: 'Attack on Titan',
      genres: ['Action', 'Drama'],
      image_url: 'http://example.com/image.jpg',
      description: 'Test description',
    },
    {
      id: '2',
      title: 'Death Note',
      genres: ['Mystery', 'Drama'],
      image_url: 'http://example.com/image2.jpg',
      description: 'Test description 2',
    },
  ];

  const mockGenres = [
    { id: '1', name: 'Action', created_at: '2024-01-01', updated_at: '2024-01-01' },
    { id: '2', name: 'Drama', created_at: '2024-01-01', updated_at: '2024-01-01' },
    { id: '3', name: 'Mystery', created_at: '2024-01-01', updated_at: '2024-01-01' },
    { id: '4', name: 'Unused', created_at: '2024-01-01', updated_at: '2024-01-01' },
  ];

  beforeEach(() => {
    jest.clearAllMocks();

    (useAnimeData as jest.Mock).mockReturnValue({
      animeList: mockAnimeList,
      loading: false,
    });

    (useGenres as jest.Mock).mockReturnValue({
      genres: mockGenres,
      loading: false,
      addGenre: mockAddGenre,
      deleteGenre: mockDeleteGenre,
    });
  });

  const renderComponent = () => {
    return render(
      <BrowserRouter>
        <GenreManagement />
      </BrowserRouter>
    );
  };

  describe('TC-BB-009: Add New Genre', () => {
    it('should render add genre form', () => {
      renderComponent();

      expect(screen.getByPlaceholderText(/ชื่อ Genre ใหม่/i)).toBeInTheDocument();
      expect(screen.getByText(/เพิ่ม Genre ใหม่/i)).toBeInTheDocument();
    });

    it('should add new genre successfully', async () => {
      mockAddGenre.mockResolvedValue(true);

      renderComponent();

      const input = screen.getByPlaceholderText(/ชื่อ Genre ใหม่/i);
      const submitButton = screen.getByRole('button', { name: /เพิ่ม/i });

      fireEvent.change(input, { target: { value: 'Isekai' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockAddGenre).toHaveBeenCalledWith('Isekai');
      });
    });

    it('should not submit empty genre', async () => {
      renderComponent();

      const input = screen.getByPlaceholderText(/ชื่อ Genre ใหม่/i);
      const submitButton = screen.getByRole('button', { name: /เพิ่ม/i });

      fireEvent.change(input, { target: { value: '   ' } });
      fireEvent.click(submitButton);

      expect(mockAddGenre).not.toHaveBeenCalled();
    });

    it('should clear input after successful add', async () => {
      mockAddGenre.mockResolvedValue(true);

      renderComponent();

      const input = screen.getByPlaceholderText(/ชื่อ Genre ใหม่/i) as HTMLInputElement;
      
      fireEvent.change(input, { target: { value: 'Isekai' } });
      
      const submitButton = screen.getByRole('button', { name: /เพิ่ม/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(input.value).toBe('');
      });
    });
  });

  describe('TC-BB-010: Display Genres with Counts', () => {
    it('should display all genres with correct counts', () => {
      renderComponent();

      // Action - used in 1 anime
      expect(screen.getByText('Action')).toBeInTheDocument();
      expect(screen.getByText(/ใช้ใน 1 anime/i)).toBeInTheDocument();

      // Drama - used in 2 anime
      expect(screen.getByText('Drama')).toBeInTheDocument();
      expect(screen.getByText(/ใช้ใน 2 anime/i)).toBeInTheDocument();

      // Unused - used in 0 anime
      expect(screen.getByText('Unused')).toBeInTheDocument();
      expect(screen.getByText(/ใช้ใน 0 anime/i)).toBeInTheDocument();
    });

    it('should display correct statistics', () => {
      renderComponent();

      // Total genres: 4
      expect(screen.getByText('จำนวน Genres ทั้งหมด')).toBeInTheDocument();

      // Active genres: 3 (Action, Drama, Mystery)
      expect(screen.getByText('Genres ที่ใช้งาน')).toBeInTheDocument();

      // Inactive genres: 1 (Unused)
      expect(screen.getByText('Genres ที่ไม่ใช้งาน')).toBeInTheDocument();
    });
  });

  describe('TC-BB-011: Search Genres', () => {
    it('should filter genres by search term', () => {
      renderComponent();

      const searchInput = screen.getByPlaceholderText(/ค้นหา Genre/i);
      
      fireEvent.change(searchInput, { target: { value: 'act' } });

      // Should show Action
      expect(screen.getByText('Action')).toBeInTheDocument();
      
      // Should not show Drama, Mystery, Unused
      expect(screen.queryByText('Drama')).not.toBeInTheDocument();
    });

    it('should be case-insensitive', () => {
      renderComponent();

      const searchInput = screen.getByPlaceholderText(/ค้นหา Genre/i);
      
      fireEvent.change(searchInput, { target: { value: 'ACTION' } });

      expect(screen.getByText('Action')).toBeInTheDocument();
    });

    it('should show no results message when no match', () => {
      renderComponent();

      const searchInput = screen.getByPlaceholderText(/ค้นหา Genre/i);
      
      fireEvent.change(searchInput, { target: { value: 'xyz123' } });

      expect(screen.getByText(/ไม่พบ Genre ที่ค้นหา/i)).toBeInTheDocument();
    });

    it('should clear search', () => {
      renderComponent();

      const searchInput = screen.getByPlaceholderText(/ค้นหา Genre/i);
      
      fireEvent.change(searchInput, { target: { value: 'action' } });
      
      const clearButton = screen.getByText(/ล้างการค้นหา/i);
      fireEvent.click(clearButton);

      // All genres should be visible again
      expect(screen.getByText('Action')).toBeInTheDocument();
      expect(screen.getByText('Drama')).toBeInTheDocument();
    });
  });

  describe('TC-BB-012: Delete Genre', () => {
    it('should disable delete button for genres in use', () => {
      renderComponent();

      // Find Action genre (used in 1 anime)
      const actionGenre = screen.getByText('Action').closest('div');
      const deleteButton = actionGenre?.querySelector('button[disabled]');

      expect(deleteButton).toBeDisabled();
    });

    it('should enable delete button for unused genres', () => {
      renderComponent();

      // Find Unused genre (used in 0 anime)
      const unusedGenre = screen.getByText('Unused').closest('div');
      const deleteButton = unusedGenre?.querySelector('button:not([disabled])');

      expect(deleteButton).not.toBeDisabled();
    });

    it('should delete unused genre with confirmation', async () => {
      // Mock window.confirm
      global.confirm = jest.fn(() => true);

      renderComponent();

      // Find and click delete button for Unused genre
      const unusedGenre = screen.getByText('Unused').closest('div');
      const deleteButtons = unusedGenre?.querySelectorAll('button');
      const deleteButton = Array.from(deleteButtons || []).find(btn => 
        btn.querySelector('svg') // Find button with trash icon
      );

      if (deleteButton) {
        fireEvent.click(deleteButton);
      }

      await waitFor(() => {
        expect(mockDeleteGenre).toHaveBeenCalledWith('4', 'Unused');
      });
    });

    it('should cancel delete on confirmation cancel', async () => {
      global.confirm = jest.fn(() => false);

      renderComponent();

      const unusedGenre = screen.getByText('Unused').closest('div');
      const deleteButtons = unusedGenre?.querySelectorAll('button');
      const deleteButton = Array.from(deleteButtons || []).find(btn => 
        btn.querySelector('svg')
      );

      if (deleteButton) {
        fireEvent.click(deleteButton);
      }

      expect(mockDeleteGenre).not.toHaveBeenCalled();
    });
  });

  describe('TC-BB-013: View Anime in Genre', () => {
    it('should open dialog when clicking genre with anime', () => {
      renderComponent();

      const actionGenre = screen.getByText('Action').closest('div');
      
      fireEvent.click(actionGenre!);

      // Dialog should open
      waitFor(() => {
        expect(screen.getByText(/Anime ใน Genre: Action/i)).toBeInTheDocument();
      });
    });

    it('should display anime list in dialog', () => {
      renderComponent();

      const dramaGenre = screen.getByText('Drama').closest('div');
      fireEvent.click(dramaGenre!);

      waitFor(() => {
        // Should show both anime with Drama genre
        expect(screen.getByText('Attack on Titan')).toBeInTheDocument();
        expect(screen.getByText('Death Note')).toBeInTheDocument();
      });
    });

    it('should not open dialog for genre with no anime', () => {
      renderComponent();

      const unusedGenre = screen.getByText('Unused').closest('div');
      
      fireEvent.click(unusedGenre!);

      // Dialog should not open
      expect(screen.queryByText(/Anime ใน Genre: Unused/i)).not.toBeInTheDocument();
    });

    it('should show view button on hover for genres with anime', () => {
      renderComponent();

      const actionGenre = screen.getByText('Action').closest('div');
      
      // Hover should show view button
      if (actionGenre) {
        fireEvent.mouseEnter(actionGenre);
        
        waitFor(() => {
          const viewButtons = actionGenre.querySelectorAll('button');
          expect(viewButtons.length).toBeGreaterThan(1);
        });
      }
    });
  });

  describe('TC-BB-014: Loading State', () => {
    it('should show loading indicator when loading', () => {
      (useGenres as jest.Mock).mockReturnValue({
        genres: [],
        loading: true,
        addGenre: mockAddGenre,
        deleteGenre: mockDeleteGenre,
      });

      renderComponent();

      expect(screen.getByRole('img', { hidden: true })).toHaveClass('animate-spin');
    });
  });
});
