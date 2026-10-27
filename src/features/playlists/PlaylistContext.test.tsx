import { describe, it, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { usePlaylists, usePlaylistDispatch } from './PlaylistContext';

describe('PlaylistContext', () => {
  it('usePlaylists báo lỗi rõ ràng khi dùng ngoài Provider', () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    expect(() => renderHook(() => usePlaylists())).toThrow('PlaylistProvider');
    vi.restoreAllMocks();
  });

  it('usePlaylistDispatch báo lỗi rõ ràng khi dùng ngoài Provider', () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    expect(() => renderHook(() => usePlaylistDispatch())).toThrow('PlaylistProvider');
    vi.restoreAllMocks();
  });
});
