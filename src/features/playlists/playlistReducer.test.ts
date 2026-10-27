import { describe, it, expect } from 'vitest';
import { playlistReducer } from './playlistReducer';
import type { Playlist } from './playlistReducer';

const base: Playlist[] = [{ id: 'p1', name: 'Chạy bộ', songIds: [] }];

describe('playlistReducer', () => {
  it('tạo playlist mới', () =>
    expect(playlistReducer([], { type: 'create', id: 'p1', name: 'Chạy bộ' })).toEqual(base));
  it('addSong không thêm trùng bài', () => {
    const once = playlistReducer(base, { type: 'addSong', playlistId: 'p1', songId: 's1' });
    const twice = playlistReducer(once, { type: 'addSong', playlistId: 'p1', songId: 's1' });
    expect(twice[0].songIds).toEqual(['s1']);
  });
  it('removeSong bỏ đúng bài', () => {
    const state = [{ id: 'p1', name: 'A', songIds: ['s1', 's2'] }];
    expect(playlistReducer(state, { type: 'removeSong', playlistId: 'p1', songId: 's1' })[0].songIds).toEqual(['s2']);
  });
  it('xóa playlist không tồn tại thì giữ nguyên state', () =>
    expect(playlistReducer(base, { type: 'remove', id: 'zzz' })).toEqual(base));
  it('rename đổi tên và không sửa state cũ', () => {
    const next = playlistReducer(base, { type: 'rename', id: 'p1', name: 'Tập gym' });
    expect(next[0].name).toBe('Tập gym');
    expect(base[0].name).toBe('Chạy bộ');
  });
});
