import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import PlaylistDetailPage from './PlaylistDetailPage';
import { PlaylistProvider } from './PlaylistContext';
import { usePlayerStore } from '../player/usePlayerStore';

const seed = (value: string) => localStorage.setItem('music-playlists', value);

const setup = (path: string) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <PlaylistProvider>
        <Routes><Route path="/playlists/:id" element={<PlaylistDetailPage />} /></Routes>
      </PlaylistProvider>
    </MemoryRouter>,
  );

describe('PlaylistDetailPage', () => {
  beforeEach(() => {
    localStorage.clear();
    usePlayerStore.setState({ queue: [], currentIndex: -1, isPlaying: false, position: 0 });
  });

  it('hiển thị tên, các bài và tổng thời lượng 5 phút 37 giây', () => {
    seed('[{"id":"p1","name":"Chạy bộ","songIds":["s1","s2"]}]');
    setup('/playlists/p1');
    expect(screen.getByRole('heading', { name: 'Chạy bộ' })).toBeInTheDocument();
    expect(screen.getByText('Tổng thời lượng: 5 phút 37 giây')).toBeInTheDocument();
    expect(screen.getByText('Nắng tháng Sáu 1')).toBeInTheDocument();
  });

  it('bấm Phát tất cả thì hàng đợi có đủ 2 bài và phát bài đầu', async () => {
    seed('[{"id":"p1","name":"Chạy bộ","songIds":["s1","s2"]}]');
    setup('/playlists/p1');
    await userEvent.click(screen.getByRole('button', { name: 'Phát tất cả' }));
    const player = usePlayerStore.getState();
    expect(player.queue).toHaveLength(2);
    expect(player.queue[player.currentIndex].title).toBe('Mưa tháng Sáu 1');
  });

  it('bấm Bỏ thì bài biến mất và tổng thời lượng được tính lại', async () => {
    seed('[{"id":"p1","name":"Chạy bộ","songIds":["s1","s2"]}]');
    setup('/playlists/p1');
    await userEvent.click(screen.getAllByRole('button', { name: 'Bỏ' })[0]);
    expect(screen.queryByText('Mưa tháng Sáu 1')).not.toBeInTheDocument();
    expect(screen.getByText('Tổng thời lượng: 3 phút 7 giây')).toBeInTheDocument();
  });

  it('hiển thị trạng thái rỗng khi playlist chưa có bài', () => {
    seed('[{"id":"p1","name":"Trống","songIds":[]}]');
    setup('/playlists/p1');
    expect(screen.getByText(/chưa có bài nào/)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Phát tất cả' })).not.toBeInTheDocument();
  });

  it('hiển thị Không tìm thấy playlist khi id không tồn tại', () => {
    setup('/playlists/zzz');
    expect(screen.getByText('Không tìm thấy playlist')).toBeInTheDocument();
  });

  it('không bị crash khi localStorage chứa JSON lỗi', () => {
    seed('{lỗi json');
    setup('/playlists/p1');
    expect(screen.getByText('Không tìm thấy playlist')).toBeInTheDocument();
  });

  it('bỏ qua phần tử sai định dạng trong localStorage', () => {
    seed('[1, {"id":"p1","name":"Hợp lệ","songIds":["s1"]}, {"id":"p2"}]');
    setup('/playlists/p1');
    expect(screen.getByRole('heading', { name: 'Hợp lệ' })).toBeInTheDocument();
  });
});
