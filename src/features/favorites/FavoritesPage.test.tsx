import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import FavoritesPage from './FavoritesPage';
import { useFavoritesStore } from './useFavoritesStore';
import { usePlayerStore } from '../player/usePlayerStore';

const setup = () => render(<MemoryRouter><FavoritesPage /></MemoryRouter>);

describe('FavoritesPage', () => {
  beforeEach(() => {
    localStorage.clear();
    useFavoritesStore.setState({ ids: [] });
    usePlayerStore.setState({ queue: [], currentIndex: -1, isPlaying: false, position: 0 });
  });

  it('hiển thị thông báo khi chưa có bài yêu thích', () => {
    setup();
    expect(screen.getByText(/Bạn chưa có bài hát yêu thích\./)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Phát tất cả' })).not.toBeInTheDocument();
  });

  it('liệt kê các bài đã thích và đếm số lượng', () => {
    useFavoritesStore.setState({ ids: ['s1', 's3'] });
    setup();
    expect(screen.getByText('2 bài')).toBeInTheDocument();
    expect(screen.getByText('Mưa tháng Sáu 1')).toBeInTheDocument();
    expect(screen.getByText('Gió tháng Sáu 1')).toBeInTheDocument();
  });

  it('bấm Phát tất cả thì đưa các bài yêu thích vào hàng đợi', async () => {
    useFavoritesStore.setState({ ids: ['s1', 's3'] });
    setup();
    await userEvent.click(screen.getByRole('button', { name: 'Phát tất cả' }));
    const player = usePlayerStore.getState();
    expect(player.queue.map((s) => s.id)).toEqual(['s1', 's3']);
    expect(player.currentIndex).toBe(0);
    expect(player.isPlaying).toBe(true);
  });

  it('bấm Bỏ yêu thích thì bài biến mất khỏi danh sách', async () => {
    useFavoritesStore.setState({ ids: ['s1', 's3'] });
    setup();
    await userEvent.click(screen.getAllByRole('button', { name: 'Bỏ yêu thích' })[0]);
    expect(useFavoritesStore.getState().ids).toEqual(['s3']);
    expect(screen.queryByText('Mưa tháng Sáu 1')).not.toBeInTheDocument();
  });
});
