import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import ProgressBar from './ProgressBar';
import { usePlayerStore } from './usePlayerStore';
import { SONGS } from '../../data/songs';

describe('ProgressBar', () => {
  beforeEach(() => usePlayerStore.setState({ queue: [], currentIndex: -1, isPlaying: false, position: 0 }));

  it('hiển thị 0:00 / 0:00 khi chưa phát bài nào', () => {
    render(<ProgressBar />);
    expect(screen.getByText('0:00 / 0:00')).toBeInTheDocument();
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '0');
  });

  it('hiển thị thời gian hiện tại / tổng thời lượng và phần trăm', () => {
    usePlayerStore.setState({ queue: [SONGS[0]], currentIndex: 0, position: 5 });
    render(<ProgressBar />);
    expect(screen.getByText('0:05 / 2:30')).toBeInTheDocument();
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '3');
  });
});
