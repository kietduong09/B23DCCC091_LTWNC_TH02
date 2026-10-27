import { describe, it, expect } from 'vitest';
import { formatDuration, formatTotal } from './format';

describe('formatDuration', () => {
  it('định dạng 0 giây thành 0:00', () => expect(formatDuration(0)).toBe('0:00'));
  it('thêm số 0 cho giây nhỏ hơn 10 (65 → 1:05)', () => expect(formatDuration(65)).toBe('1:05'));
  it('định dạng 300 giây thành 5:00', () => expect(formatDuration(300)).toBe('5:00'));
  it('xử lý giá trị âm hoặc không hợp lệ về 0:00', () => {
    expect(formatDuration(-5)).toBe('0:00');
    expect(formatDuration(Number.NaN)).toBe('0:00');
  });
  it('formatTotal hiển thị phút và giây', () => expect(formatTotal(337)).toBe('5 phút 37 giây'));
});
