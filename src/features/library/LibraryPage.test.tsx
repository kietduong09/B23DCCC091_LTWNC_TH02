import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import LibraryPage from './LibraryPage';
import { PlaylistProvider } from '../playlists/PlaylistContext';
import { usePlayerStore } from '../player/usePlayerStore';
import { useFavoritesStore } from '../favorites/useFavoritesStore';

const setup = () =>
  render(<MemoryRouter><PlaylistProvider><LibraryPage /></PlaylistProvider></MemoryRouter>);

describe('LibraryPage', () => {
  beforeEach(() => {
    localStorage.clear();
    useFavoritesStore.setState({ ids: [] });
    usePlayerStore.setState({ queue: [], currentIndex: -1, isPlaying: false, position: 0 });
  });

  it('hiển thị 10000 bài nhưng chỉ render một phần nhỏ dòng (ảo hóa)', () => {
    setup();
    expect(screen.getByText('Tìm thấy 10000 bài hát')).toBeInTheDocument();
    const rows = screen.getAllByRole('listitem').length;
    expect(rows).toBeGreaterThan(0);
    expect(rows).toBeLessThan(30);
  });

  it('chưa lọc ngay khi đang gõ, sau 300ms mới lọc ra 1250 bài cho "mưa"', async () => {
    setup();
    await userEvent.type(screen.getByLabelText('Tìm kiếm'), 'mưa');
    expect(screen.getByText('Tìm thấy 10000 bài hát')).toBeInTheDocument();
    expect(await screen.findByText('Tìm thấy 1250 bài hát')).toBeInTheDocument();
  });

  it('tìm theo tên ca sĩ, không phân biệt hoa thường', async () => {
    setup();
    await userEvent.type(screen.getByLabelText('Tìm kiếm'), 'THU HÀ');
    expect(await screen.findByText('Tìm thấy 1000 bài hát')).toBeInTheDocument();
  });

  it('hiển thị thông báo khi không có kết quả', async () => {
    setup();
    await userEvent.type(screen.getByLabelText('Tìm kiếm'), 'xyz');
    expect(await screen.findByText('Không tìm thấy bài hát nào')).toBeInTheDocument();
  });

  it('lọc theo thể loại Rock ra 2000 bài', async () => {
    setup();
    await userEvent.selectOptions(screen.getByLabelText('Thể loại'), 'Rock');
    expect(screen.getByText('Tìm thấy 2000 bài hát')).toBeInTheDocument();
  });

  it('sắp xếp Tên A–Z thì dòng đầu là Biển bình yên 1', async () => {
    setup();
    await userEvent.selectOptions(screen.getByLabelText('Sắp xếp'), 'title');
    expect(screen.getAllByRole('listitem')[0]).toHaveTextContent('Biển bình yên 1');
  });

  it('sắp xếp theo thời lượng tăng dần thì dòng đầu là 2:30', async () => {
    setup();
    await userEvent.selectOptions(screen.getByLabelText('Sắp xếp'), 'duration');
    expect(screen.getAllByRole('listitem')[0]).toHaveTextContent('2:30');
  });

  it('bấm Phát thì hàng đợi là danh sách đang lọc', async () => {
    setup();
    await userEvent.selectOptions(screen.getByLabelText('Thể loại'), 'Rock');
    await userEvent.click(screen.getAllByRole('button', { name: /^Phát / })[0]);
    const { queue, currentIndex, isPlaying } = usePlayerStore.getState();
    expect(queue).toHaveLength(2000);
    expect(queue.every((s) => s.genre === 'Rock')).toBe(true);
    expect(currentIndex).toBe(0);
    expect(isPlaying).toBe(true);
  });

  it('bấm + Hàng đợi thì thêm bài vào hàng đợi', async () => {
    setup();
    await userEvent.click(screen.getAllByRole('button', { name: /vào hàng đợi/ })[0]);
    expect(usePlayerStore.getState().queue.map((s) => s.id)).toEqual(['s1']);
  });

  it('bấm ♡ thì thêm bài vào yêu thích', async () => {
    setup();
    await userEvent.click(screen.getAllByRole('button', { name: 'Thêm vào yêu thích' })[0]);
    expect(useFavoritesStore.getState().ids).toEqual(['s1']);
  });

  it('khóa nút + Playlist khi chưa có playlist nào', () => {
    setup();
    expect(screen.getAllByRole('button', { name: /vào playlist/ })[0]).toBeDisabled();
    expect(screen.getByLabelText('Playlist đang chọn')).toBeDisabled();
  });

  it('thêm bài vào playlist đang chọn và báo đã có khi thêm trùng', async () => {
    localStorage.setItem('music-playlists', '[{"id":"p1","name":"Chạy bộ","songIds":[]}]');
    setup();
    const add = () => screen.getAllByRole('button', { name: /vào playlist/ })[0];
    await userEvent.click(add());
    expect(screen.getByRole('status')).toHaveTextContent('Đã thêm');
    expect(localStorage.getItem('music-playlists')).toContain('"songIds":["s1"]');
    await userEvent.click(add());
    expect(screen.getByRole('status')).toHaveTextContent('đã có trong Chạy bộ');
  });
});
