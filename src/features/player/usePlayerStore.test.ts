import { describe, it, expect, beforeEach } from 'vitest';
import { usePlayerStore } from './usePlayerStore';
import type { Song } from '../../types';

const mk = (id: string, duration = 3): Song => ({ id, title: id, artist: 'A', genre: 'Pop', duration });
const [a, b] = [mk('a'), mk('b')];

describe('usePlayerStore', () => {
  beforeEach(() => usePlayerStore.setState({ queue: [], currentIndex: -1, isPlaying: false, position: 0 }));

  it('playQueue đặt đúng bài và đưa position về 0', () => {
    usePlayerStore.setState({ position: 9 });
    usePlayerStore.getState().playQueue([a, b], 1);
    expect(usePlayerStore.getState()).toMatchObject({ currentIndex: 1, isPlaying: true, position: 0 });
  });
  it('playQueue bỏ qua index không hợp lệ', () => {
    usePlayerStore.getState().playQueue([a], 5);
    expect(usePlayerStore.getState().currentIndex).toBe(-1);
  });
  it('togglePlay không phát khi chưa có bài', () => {
    usePlayerStore.getState().togglePlay();
    expect(usePlayerStore.getState().isPlaying).toBe(false);
  });
  it('addToQueue không thêm bài trùng', () => {
    usePlayerStore.getState().addToQueue(a);
    usePlayerStore.getState().addToQueue(a);
    expect(usePlayerStore.getState().queue).toHaveLength(1);
  });
  it('tick tăng position 1 giây, ở giây cuối tự sang bài sau', () => {
    usePlayerStore.getState().playQueue([a, b], 0);
    usePlayerStore.getState().tick();
    expect(usePlayerStore.getState().position).toBe(1);
    usePlayerStore.getState().tick();
    usePlayerStore.getState().tick();
    expect(usePlayerStore.getState()).toMatchObject({ currentIndex: 1, position: 0 });
  });
  it('next ở bài cuối thì isPlaying là false', () => {
    usePlayerStore.getState().playQueue([a], 0);
    usePlayerStore.getState().next();
    expect(usePlayerStore.getState().isPlaying).toBe(false);
  });
  it('prev: quá 3 giây thì tua về 0, ngược lại lùi bài', () => {
    usePlayerStore.getState().playQueue([a, b], 1);
    usePlayerStore.setState({ position: 5 });
    usePlayerStore.getState().prev();
    expect(usePlayerStore.getState()).toMatchObject({ currentIndex: 1, position: 0 });
    usePlayerStore.getState().prev();
    expect(usePlayerStore.getState().currentIndex).toBe(0);
  });
});
