import { describe, it, expect, beforeEach } from 'vitest';
import { useFavoritesStore } from './useFavoritesStore';

describe('useFavoritesStore', () => {
  beforeEach(() => {
    localStorage.clear();
    useFavoritesStore.setState({ ids: [] });
  });

  it('toggle thêm bài vào danh sách yêu thích', () => {
    useFavoritesStore.getState().toggle('s1');
    expect(useFavoritesStore.getState().ids).toEqual(['s1']);
  });

  it('toggle lần hai thì bỏ bài khỏi danh sách', () => {
    useFavoritesStore.getState().toggle('s1');
    useFavoritesStore.getState().toggle('s1');
    expect(useFavoritesStore.getState().ids).toEqual([]);
  });

  it('lưu danh sách vào localStorage với key music-favorites', () => {
    useFavoritesStore.getState().toggle('s1');
    useFavoritesStore.getState().toggle('s3');
    expect(localStorage.getItem('music-favorites')).toContain('"ids":["s1","s3"]');
  });
});
