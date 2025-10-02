import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import AnimeForm from '@/pages/AnimeForm';
import { useAnimeData } from '@/hooks/useAnimeData';
import { useGenres } from '@/hooks/useGenres';

// Mock hooks
jest.mock('@/hooks/useAnimeData');
jest.mock('@/hooks/useGenres');
jest.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: jest.fn(),
  }),
}));

// Mock navigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useParams: () => ({}),
}));

describe('AnimeForm Component - Black Box Testing', () => {
  const mockCreateAnime = jest.fn();
  const mockUpdateAnime = jest.fn();
  const mockGetAnimeById = jest.fn();
  const mockCreateAnimeUpdate = jest.fn();
  const mockAddGenre = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    
    (useAnimeData as jest.Mock).mockReturnValue({
      createAnime: mockCreateAnime,
      updateAnime: mockUpdateAnime,
      getAnimeById: mockGetAnimeById,
      createAnimeUpdate: mockCreateAnimeUpdate,
      loading: false,
    });

    (useGenres as jest.Mock).mockReturnValue({
      genres: [
        { id: '1', name: 'Action' },
        { id: '2', name: 'Drama' },
      ],
      addGenre: mockAddGenre,
    });
  });

  const renderForm = () => {
    return render(
      <BrowserRouter>
        <AnimeForm />
      </BrowserRouter>
    );
  };

  describe('TC-BB-004: Add New Anime', () => {
    it('should render form with all required fields', () => {
      renderForm();

      expect(screen.getByLabelText(/ชื่อ Anime/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/ผู้จัดพิมพ์/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/เรื่องย่อ/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/วันที่เริ่มฉาย/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/รูปแบบ/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/คะแนนความนิยม/i)).toBeInTheDocument();
    });

    it('should submit form with valid data', async () => {
      mockCreateAnime.mockResolvedValue({
        data: { id: '1' },
        error: null,
      });

      mockCreateAnimeUpdate.mockResolvedValue({ error: null });

      renderForm();

      // Fill in form
      fireEvent.change(screen.getByLabelText(/ชื่อ Anime/i), {
        target: { value: 'Attack on Titan' },
      });

      fireEvent.change(screen.getByLabelText(/ผู้จัดพิมพ์/i), {
        target: { value: 'Wit Studio' },
      });

      fireEvent.change(screen.getByLabelText(/เรื่องย่อ/i), {
        target: { value: 'Humanity vs Titans' },
      });

      // Add genre
      const actionButton = screen.getByText('Action').closest('button');
      if (actionButton) {
        fireEvent.click(actionButton);
      }

      // Submit form
      const submitButton = screen.getByRole('button', { name: /เพิ่ม Anime/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockCreateAnime).toHaveBeenCalledWith(
          expect.objectContaining({
            title: 'Attack on Titan',
            publisher: 'Wit Studio',
            description: 'Humanity vs Titans',
            genres: expect.arrayContaining(['Action']),
          })
        );
      });
    });
  });

  describe('TC-BB-005: Form Validation', () => {
    it('should show error when title is empty', async () => {
      renderForm();

      // Try to submit without title
      const submitButton = screen.getByRole('button', { name: /เพิ่ม Anime/i });
      fireEvent.click(submitButton);

      // Form should not be submitted
      await waitFor(() => {
        expect(mockCreateAnime).not.toHaveBeenCalled();
      });
    });

    it('should show error when no genres selected', async () => {
      renderForm();

      // Fill title but no genres
      fireEvent.change(screen.getByLabelText(/ชื่อ Anime/i), {
        target: { value: 'Test Anime' },
      });

      const submitButton = screen.getByRole('button', { name: /เพิ่ม Anime/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockCreateAnime).not.toHaveBeenCalled();
      });
    });

    it('should accept popularity score between 0-100', () => {
      renderForm();

      const scoreInput = screen.getByLabelText(/คะแนนความนิยม/i) as HTMLInputElement;

      fireEvent.change(scoreInput, { target: { value: '50' } });
      expect(scoreInput.value).toBe('50');

      fireEvent.change(scoreInput, { target: { value: '0' } });
      expect(scoreInput.value).toBe('0');

      fireEvent.change(scoreInput, { target: { value: '100' } });
      expect(scoreInput.value).toBe('100');
    });
  });

  describe('TC-BB-006: Genre Management in Form', () => {
    it('should add existing genre to anime', () => {
      renderForm();

      const actionButton = screen.getByText('Action').closest('button');
      if (actionButton) {
        fireEvent.click(actionButton);
      }

      // Genre should be added (shown as badge)
      expect(screen.getByText('Action')).toBeInTheDocument();
    });

    it('should remove genre from selection', () => {
      renderForm();

      // Add genre
      const actionButton = screen.getByText('Action').closest('button');
      if (actionButton) {
        fireEvent.click(actionButton);
      }

      // Remove genre
      const removeButton = screen.getAllByRole('button').find(btn => 
        btn.querySelector('svg') && btn.textContent?.includes('Action')
      );

      if (removeButton) {
        fireEvent.click(removeButton);
      }

      // Genre should be removed
      expect(screen.queryByText('Action')).not.toBeInTheDocument();
    });

    it('should add custom genre', async () => {
      mockAddGenre.mockResolvedValue(true);

      renderForm();

      const customInput = screen.getByPlaceholderText(/เพิ่ม Genre ใหม่/i);
      fireEvent.change(customInput, { target: { value: 'Isekai' } });

      const addButton = customInput.nextElementSibling as HTMLButtonElement;
      fireEvent.click(addButton);

      await waitFor(() => {
        expect(mockAddGenre).toHaveBeenCalledWith('Isekai');
      });
    });

    it('should not add duplicate genre', () => {
      renderForm();

      // Add Action genre
      const actionButton = screen.getByText('Action').closest('button');
      if (actionButton) {
        fireEvent.click(actionButton);
        fireEvent.click(actionButton); // Try to add again
      }

      // Should only appear once
      const actionBadges = screen.getAllByText('Action');
      expect(actionBadges).toHaveLength(1);
    });
  });

  describe('TC-BB-007: Image Upload', () => {
    it('should upload and preview image', () => {
      renderForm();

      const file = new File(['image'], 'test.png', { type: 'image/png' });
      const input = screen.getByLabelText(/อัปโหลดรูปภาพ/i)
        .closest('button')
        ?.previousElementSibling as HTMLInputElement;

      if (input) {
        Object.defineProperty(input, 'files', {
          value: [file],
        });

        fireEvent.change(input);

        // Image preview should appear
        waitFor(() => {
          expect(screen.getByAltText('Preview')).toBeInTheDocument();
        });
      }
    });

    it('should remove uploaded image', async () => {
      renderForm();

      // First upload an image
      const file = new File(['image'], 'test.png', { type: 'image/png' });
      const input = screen.getByLabelText(/อัปโหลดรูปภาพ/i)
        .closest('button')
        ?.previousElementSibling as HTMLInputElement;

      if (input) {
        Object.defineProperty(input, 'files', {
          value: [file],
        });
        fireEvent.change(input);
      }

      // Then remove it
      await waitFor(() => {
        const removeButton = screen.getByText(/ลบรูปภาพ/i);
        fireEvent.click(removeButton);
      });

      expect(screen.queryByAltText('Preview')).not.toBeInTheDocument();
    });
  });

  describe('TC-BB-008: Navigation', () => {
    it('should navigate back to anime list', () => {
      renderForm();

      const backButton = screen.getAllByRole('button')[0]; // First button is back button
      fireEvent.click(backButton);

      expect(mockNavigate).toHaveBeenCalledWith('/admin/anime');
    });

    it('should navigate to anime list after successful submission', async () => {
      mockCreateAnime.mockResolvedValue({
        data: { id: '1' },
        error: null,
      });

      mockCreateAnimeUpdate.mockResolvedValue({ error: null });

      renderForm();

      // Fill required fields
      fireEvent.change(screen.getByLabelText(/ชื่อ Anime/i), {
        target: { value: 'Test Anime' },
      });

      const actionButton = screen.getByText('Action').closest('button');
      if (actionButton) {
        fireEvent.click(actionButton);
      }

      const submitButton = screen.getByRole('button', { name: /เพิ่ม Anime/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/admin/anime');
      });
    });
  });
});
