import { describe, it, expect } from 'vitest';
import { generateSongs } from './songs';

describe('generateSongs', () => {
  const songs = generateSongs(10000);
  it('sinh đúng 10000 bài', () => expect(songs).toHaveLength(10000));
  it('id không trùng nhau', () => expect(new Set(songs.map((s) => s.id)).size).toBe(10000));
  it('thời lượng nằm trong khoảng 150–300', () =>
    expect(songs.every((s) => s.duration >= 150 && s.duration <= 300)).toBe(true));
  it('ba bài đầu đúng theo đề bài', () => {
    expect(songs[0]).toEqual({ id: 's1', title: 'Mưa tháng Sáu 1', artist: 'Lê Minh', genre: 'Pop', duration: 150 });
    expect(songs[1]).toMatchObject({ title: 'Nắng tháng Sáu 1', artist: 'Quang Huy', genre: 'Indie', duration: 187 });
    expect(songs[2]).toMatchObject({ title: 'Gió tháng Sáu 1', artist: 'Bảo Trâm', genre: 'Ballad', duration: 224 });
  });
  it('luôn cho cùng một kết quả', () => expect(generateSongs(100)).toEqual(generateSongs(100)));
});
