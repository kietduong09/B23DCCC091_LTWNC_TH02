import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PlayerBar from './PlayerBar';
import { usePlayerStore } from './usePlayerStore';
import { SONGS } from '../../data/songs';

const reset = () => usePlayerStore.setState({ queue: [], currentIndex: -1, isPlaying: false, position: 0 });

describe('PlayerBar', () => {
  beforeEach(reset);
  afterEach(() => vi.useRealTimers());

  it('hiển thị trạng thái trống và khóa các nút khi chưa có bài', () => {
    render(<PlayerBar />);
    expect(screen.getByText('Chưa phát bài nào')).toBeInTheDocument();
    expect(screen.getByText('Hàng đợi: 0 bài')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Phát' })).toBeDisabled();
  });

  it('hiển thị bài đang phát và số bài trong hàng đợi', () => {
    usePlayerStore.getState().playQueue(SONGS.slice(0, 2), 0);
    render(<PlayerBar />);
    expect(screen.getByText('Đang phát: Mưa tháng Sáu 1 – Lê Minh')).toBeInTheDocument();
    expect(screen.getByText('Hàng đợi: 2 bài')).toBeInTheDocument();
  });

  it('bấm Tạm dừng rồi Phát để chuyển trạng thái', async () => {
    usePlayerStore.getState().playQueue(SONGS.slice(0, 2), 0);
    render(<PlayerBar />);
    await userEvent.click(screen.getByRole('button', { name: 'Tạm dừng' }));
    expect(usePlayerStore.getState().isPlaying).toBe(false);
    await userEvent.click(screen.getByRole('button', { name: 'Phát' }));
    expect(usePlayerStore.getState().isPlaying).toBe(true);
  });

  it('bấm Sau chuyển sang bài kế tiếp và Trước quay lại bài trước', async () => {
    usePlayerStore.getState().playQueue(SONGS.slice(0, 2), 0);
    render(<PlayerBar />);
    await userEvent.click(screen.getByRole('button', { name: 'Sau' }));
    expect(screen.getByText('Đang phát: Nắng tháng Sáu 1 – Quang Huy')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Trước' }));
    expect(usePlayerStore.getState().currentIndex).toBe(0);
  });

  it('đồng hồ tăng 1 giây mỗi giây khi đang phát và đứng yên khi tạm dừng', () => {
    vi.useFakeTimers();
    usePlayerStore.getState().playQueue(SONGS.slice(0, 2), 0);
    render(<PlayerBar />);
    act(() => { vi.advanceTimersByTime(3000); });
    expect(usePlayerStore.getState().position).toBe(3);
    act(() => usePlayerStore.getState().togglePlay());
    act(() => { vi.advanceTimersByTime(3000); });
    expect(usePlayerStore.getState().position).toBe(3);
  });

  it('dọn interval khi component bị gỡ khỏi màn hình', () => {
    vi.useFakeTimers();
    usePlayerStore.getState().playQueue(SONGS.slice(0, 2), 0);
    const { unmount } = render(<PlayerBar />);
    act(() => { vi.advanceTimersByTime(2000); });
    unmount();
    act(() => { vi.advanceTimersByTime(5000); });
    expect(usePlayerStore.getState().position).toBe(2);
  });
});
