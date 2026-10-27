import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SongRow from './SongRow';
import type { SongRowProps } from './SongRow';
import type { Song } from '../../types';

const song: Song = { id: 's1', title: 'Mưa tháng Sáu 1', artist: 'Lê Minh', genre: 'Pop', duration: 150 };

const setup = (over: Partial<SongRowProps> = {}) => {
  const props: SongRowProps = {
    song, index: 0, isFavorite: false, canAddToPlaylist: true,
    onPlay: vi.fn(), onToggleFavorite: vi.fn(), onAddToQueue: vi.fn(), onAddToPlaylist: vi.fn(),
    ...over,
  };
  render(<SongRow {...props} />);
  return props;
};

describe('SongRow', () => {
  it('hiển thị tên bài và thời lượng 2:30', () => {
    setup();
    expect(screen.getByText('Mưa tháng Sáu 1')).toBeInTheDocument();
    expect(screen.getByText('2:30')).toBeInTheDocument();
  });

  it('bấm nút Phát thì gọi onPlay với đúng bài hát', async () => {
    const props = setup();
    await userEvent.click(screen.getByRole('button', { name: 'Phát Mưa tháng Sáu 1' }));
    expect(props.onPlay).toHaveBeenCalledWith(song);
  });

  it('nút yêu thích có tên "Thêm vào yêu thích" khi chưa thích', async () => {
    const props = setup();
    await userEvent.click(screen.getByRole('button', { name: 'Thêm vào yêu thích' }));
    expect(props.onToggleFavorite).toHaveBeenCalledWith('s1');
  });

  it('nút yêu thích có tên "Bỏ yêu thích" khi đã thích', () => {
    setup({ isFavorite: true });
    expect(screen.getByRole('button', { name: 'Bỏ yêu thích' })).toBeInTheDocument();
  });

  it('nút + Playlist bị khóa khi chưa có playlist', () => {
    setup({ canAddToPlaylist: false });
    expect(screen.getByRole('button', { name: /vào playlist/ })).toBeDisabled();
  });
});
