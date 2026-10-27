import { useEffect } from 'react';
import { usePlayerStore } from './usePlayerStore';
import ProgressBar from './ProgressBar';

export default function PlayerBar() {
  const song = usePlayerStore((s) => s.queue[s.currentIndex]);
  const isPlaying = usePlayerStore((s) => s.isPlaying);
  const queueLength = usePlayerStore((s) => s.queue.length);
  const togglePlay = usePlayerStore((s) => s.togglePlay);
  const next = usePlayerStore((s) => s.next);
  const prev = usePlayerStore((s) => s.prev);
  const tick = usePlayerStore((s) => s.tick);
  const active = isPlaying && song !== undefined;

  useEffect(() => {
    if (!active) return;
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [active, tick]);

  return (
    <footer className="player" aria-label="Trình phát nhạc">
      <p className="now" aria-live="polite">
        {song ? `Đang phát: ${song.title} – ${song.artist}` : 'Chưa phát bài nào'}
      </p>
      <div className="controls">
        <button onClick={prev} disabled={!song}>Trước</button>
        <button onClick={togglePlay} disabled={!song} aria-pressed={isPlaying}>
          {isPlaying ? 'Tạm dừng' : 'Phát'}
        </button>
        <button onClick={next} disabled={!song}>Sau</button>
      </div>
      <ProgressBar />
      <p className="queue">Hàng đợi: {queueLength} bài</p>
    </footer>
  );
}
